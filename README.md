
# Quantum Finance

Quantum Finance is a comprehensive financial simulation platform designed to offer users a variety of tools for managing personal finances, Options Trading Strategy Builder, Trading Simulations, performing sentiment analysis for stock predictions, Expense Tracker, and offerring visualization of the Black Scholes model. The platform also features an AI financial advisor and autonomous threat detection capabilities.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Demo](#Demo)
- [Contributing](#contributing)
- [License](#license)

## Features

1. **Trading Simulations**: Users can engage in realistic stock trading with simulated money, enabling them to learn and practice trading.
   
2. **Sentiment Analysis for Stock Prediction**: NumPy-driven time series forecasting model for stock price prediction (25% MAE) by fine-tuning a BERT-based transformer architecture, achieving 80% accuracy in market sentiment classification.   
3. **Options Trading Strategy Builder**: an options trading strategy builder using Go to optimize the construction and execution of multi-leg strategies (e.g., spreads, combinations, synthetics) and leverage real-time market data processing to calculate projected profits of option strategies, resulting in 35% increase in simulated trading throughput and 40% reduction in operational latency
   
4. **Expense Tracker**: Allows users to record and monitor spending habits and store them in a database
   
5. **Wealth Management Assistant**: Provides a tutorial to assist users on how to manage their finances on various financial topics such as budgeting, mortages, investment options, etc

6. **Options Pricing**: Users can calculate the prices of options using the Black-Scholes model as well as visualize the changes to prices by manipulating certain variables.

7. **Autonomous Threat Detection**: comprehensive threat detection and response framework using C++ to collect real-time threat intelligence, identify malicious actors, and trigger an automated incident response via Discord within 10 seconds of threat identification.

## Technologies

- **Frontend**: ReactJS
- **Backend**: Go, Flask (Python)
- **Database**: MySQL
- **Mobile App**: React Native (planned)
- **Machine Learning**: Python (for sentiment analysis)
- **Threat Detection**: Wuzah, SOAR (Shuffle)

## Installation

### Prerequisites

- Node.js and npm
- Go
- Python with Flask
- MySQL

### Clone the repository

```bash
git clone https://github.com/<yourusername>/quantum-finance.git
cd quantum-finance
```

### Install dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend (Go)

```bash
cd backend
go mod tidy
```

#### Backend (Flask)

```bash
python -m venv myenv

myenv\Scripts\activate

```

### Database Setup

Set up your MySQL database and run the necessary migrations for the `quantumFinanceUserDatabase` schema.

### Environment Variables

Create a `.env` file in both the backend and frontend directories with the necessary configuration variables such as database credentials, API keys, etc.

## Usage

### Start the Frontend

```bash
cd frontend
npm start
```

### Start the Backend (Go)

```bash
cd backend
go run .\main.go .\models.go .\database.go .\optionsTradingServer.go
```

### Start the Flask Server (Python)

```bash
cd backend
python .\ML_stockPrediction_backend.py
```

## Demo
Landing page
![Screenshot 2024-08-31 161212](https://github.com/user-attachments/assets/7b4c8e15-c75e-40e1-93ac-1395c3d046ac)
Sign in page
![Screenshot 2024-08-31 161901](https://github.com/user-attachments/assets/eabd4d55-de20-48bb-a55a-99f06a5d9910)

Register page
![Screenshot 2024-08-31 161956](https://github.com/user-attachments/assets/b9282686-2098-4d16-b1e0-70a5ddb46fdb)

About page
![Screenshot 2024-08-31 162056](https://github.com/user-attachments/assets/4b560642-6a51-4c78-9b75-eddfdf4fd5b3)

Dashboard
![Screenshot 2024-08-31 162404](https://github.com/user-attachments/assets/8427db61-59cf-4b5a-ba31-3fd31e04e122)

Trading Simulator
![Screenshot 2024-08-31 162633](https://github.com/user-attachments/assets/7e6964a3-34f0-4ec5-acd1-217dfe4fcd36)

Options Trading Strategy Builder
![image](https://github.com/user-attachments/assets/19aeb402-c10d-4b72-873a-529be39f450d)

ML stock prediction
![image](https://github.com/user-attachments/assets/cd7bc86f-c7f9-4dfa-b67e-5e2e2bbff094)

Expense Tracker
![image](https://github.com/user-attachments/assets/87af2e99-66f3-48ae-8f12-0ec0860fdcd6)

Wealth Management Assistant
![image](https://github.com/user-attachments/assets/191fcaa8-35c3-4388-aa27-9420743c2724)

Black Scholes model GUI
![image](https://github.com/user-attachments/assets/50aeb51c-8e4b-43a7-b4ac-7edb303d6de1)







## Contributing

Contributions are welcome! Please create an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License.


