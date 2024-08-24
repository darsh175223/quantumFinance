import numpy as np
from stockSentimentData import stock_data

# Assuming stock_data is a list of tuples (x, y)
# If it's in a different format, we may need to adjust the script

# Convert the data into numpy arrays
x = np.array([point[0] for point in stock_data])
y = np.array([point[1] for point in stock_data])

# Calculate the line of best fit
coefficients = np.polyfit(x, y, 1)
slope = coefficients[0]
intercept = coefficients[1]

# Create the line of best fit function
def line_of_best_fit(x):
    return slope * x + intercept

print(f"Line of best fit: y = {slope:.4f}x + {intercept:.4f}")

# Example usage:
x_example = .6
y_predicted = line_of_best_fit(x_example)
print(f"For x = {x_example}, predicted y = {y_predicted:.4f}")