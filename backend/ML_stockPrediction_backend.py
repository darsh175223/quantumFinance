from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import make_response
import requests
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from transformers import BertTokenizer, BertForSequenceClassification
import torch

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

nltk.download('vader_lexicon')

# Load the fine-tuned model and tokenizer
model = BertForSequenceClassification.from_pretrained("fine_tuned_bert_sentiment")
tokenizer = BertTokenizer.from_pretrained("fine_tuned_bert_sentiment")

# Set the device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

def prepare_myModel_text(text):
    # Tokenize the input
    inputs = tokenizer(text, padding=True, truncation=True, max_length=128, return_tensors="pt")

    # Move the inputs to the same device as the model
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Perform inference
    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

    # Get the predicted class (0 for negative, 1 for positive)
    predicted_class = torch.argmax(predictions).item()

    # Get the confidence score
    confidence = predictions[0][predicted_class].item()
    
    return predicted_class, confidence

# Replace 'your_api_key' with your actual NewsAPI key
api_key = 'b09aeff87c7a48f387c8f51b9591c38a'
base_url = 'https://newsapi.org/v2/everything'

def get_stock_news(query, api_key):
    params = {
        'q': query,
        'sortBy': 'relevancy',
        'language': 'en',
        'apiKey': api_key
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        news_data = response.json()
        articles = news_data['articles']
        sid_obj = SentimentIntensityAnalyzer()
        final_sentiment = 0

        for article in articles[:10]:
            sentiment_dict = sid_obj.polarity_scores(f"Title: {article['title']} Description: {article['description']}")
            sModelAns, midModelConf = prepare_myModel_text(f"Title: {article['title']} Description: {article['description']}")
            if sModelAns == 0:
                sModelAns = -1
            hybridSentiment = (sModelAns * midModelConf)**7 + sentiment_dict['compound']
            growthPrediction = 0.0389 * hybridSentiment - 0.015
            final_sentiment += growthPrediction

        growthPrediction = final_sentiment / 10

        rounded_growthPrediction = round(float(growthPrediction), 4)
        print(rounded_growthPrediction)



        if growthPrediction > 0:
            return f"{query}: Predicting Bullish with potential growth of {round(float(rounded_growthPrediction*100), 4)}%"
        elif growthPrediction < 0:
            return f"{query}: Predicting Bearish with potential loss of {round(float(rounded_growthPrediction*100), 4)}%"
        return "No significant prediction"
    else:
        print(f"Failed to fetch news: {response.status_code}, {response.reason}")
        return "Failed to fetch news"

@app.route('/receive-string', methods=['POST'])
def receive_string():
    data = request.json
    message = data.get('message', '')
    print(f"Received string: {message}", flush=True)
    verdict = get_stock_news(message, api_key)
    
    # Directly return the response with the message to the frontend
    print(verdict)
    return jsonify({"message": verdict}), 200

if __name__ == '__main__':
    app.run(debug=True)
