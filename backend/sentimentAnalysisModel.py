import torch
from transformers import BertTokenizer, BertForSequenceClassification, AdamW, get_linear_schedule_with_warmup
from datasets import load_dataset
from torch.utils.data import DataLoader, TensorDataset
import time

print("Start")

# Load the IMDB dataset and take 1/5 of its data
dataset = load_dataset("imdb")
train_data = dataset["train"].shuffle(seed=42).select(range(10000))  # 1/5 of 25000
test_data = dataset["test"].shuffle(seed=42).select(range(10000))  # 1/5 of 25000

print("Tokenize")

# Tokenize the data
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

def tokenize_function(examples):
    return tokenizer(examples['text'], padding='max_length', truncation=True, max_length=128)

train_encodings = tokenize_function(train_data)
test_encodings = tokenize_function(test_data)

print("Convert to PyTorch tensors")

# Convert to PyTorch tensors
train_dataset = TensorDataset(
    torch.tensor(train_encodings['input_ids']),
    torch.tensor(train_encodings['attention_mask']),
    torch.tensor(train_data['label'])
)
test_dataset = TensorDataset(
    torch.tensor(test_encodings['input_ids']),
    torch.tensor(test_encodings['attention_mask']),
    torch.tensor(test_data['label'])
)

# Create data loaders
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=32)

print("Load pre-trained BERT model")

# Load pre-trained BERT model
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)

# Set up optimizer
optimizer = AdamW(model.parameters(), lr=2e-5)

# Set up scheduler
num_training_steps = len(train_loader) * 5  # 5 epochs
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=0, num_training_steps=num_training_steps)

# Training loop
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)
print("Starting epochs")

num_epochs = 5
max_train_time = 600  # 10 minutes in seconds

start_time = time.time()
for epoch in range(num_epochs):
    model.train()
    for batch_idx, batch in enumerate(train_loader):
        batch = tuple(t.to(device) for t in batch)
        inputs = {'input_ids': batch[0], 'attention_mask': batch[1], 'labels': batch[2]}

        outputs = model(**inputs)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        scheduler.step()
        optimizer.zero_grad()

        if batch_idx % 50 == 0:
            print(f"Epoch: {epoch}, Batch: {batch_idx}, Loss: {loss.item():.4f}")

        if time.time() - start_time > max_train_time:
            print(f"Training stopped after {time.time() - start_time:.2f} seconds")
            break

    if time.time() - start_time > max_train_time:
        break

print("Training completed")
print("Evaluation")

# Evaluation
model.eval()
correct = 0
total = 0

i=0

with torch.no_grad():
    for batch in test_loader:
        print("iteration", i)
        batch = tuple(t.to(device) for t in batch)
        inputs = {'input_ids': batch[0], 'attention_mask': batch[1]}
        labels = batch[2]

        outputs = model(**inputs)
        _, predicted = torch.max(outputs.logits, 1)

        total += labels.size(0)
        correct += (predicted == labels).sum().item()

accuracy = correct / total
print(f"Test Accuracy: {accuracy:.2f}")

# Save the fine-tuned model
model.save_pretrained("fine_tuned_bert_sentiment")
tokenizer.save_pretrained("fine_tuned_bert_sentiment")