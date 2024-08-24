import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
nltk.download('vader_lexicon')

#This is just a small representation of teh data used to train the line of best fit model

stock_data = []
sid_obj = SentimentIntensityAnalyzer()

sentiment_dict = sid_obj.polarity_scores("   Workday follows Salesforce’s lead, and it could spur stock’s best day    ")
stock_increase = .02

stock_data.append((sentiment_dict['compound'],stock_increase ))

sentiment_dict = sid_obj.polarity_scores("   Microsoft's New AI Org Engineers Get Paid The Highest, Salary Significantly better    ")
stock_increase = .003

stock_data.append((sentiment_dict['compound'],stock_increase ))

sentiment_dict = sid_obj.polarity_scores("   Investor's Business Daily Apple Stock Seen Getting Lift From AI Opportunity    ")
stock_increase = .01

stock_data.append((sentiment_dict['compound'],stock_increase ))

sentiment_dict = sid_obj.polarity_scores("   Samsung bad over 1 million electric ranges after hundreds of fires reported    ")
stock_increase = -.0048

stock_data.append((sentiment_dict['compound'],stock_increase ))

sentiment_dict = sid_obj.polarity_scores("   Amazon CEO Andy Jassy Says Company's AI Assistant Has Saved $260M And 4.5K Developer-Years Of Work: 'It's Been A Game Changer For Us'    ")
stock_increase = -.014

stock_data.append((sentiment_dict['compound'],stock_increase ))

sentiment_dict = sid_obj.polarity_scores("   Capital one merger deal can increase busniess profits    ")
stock_increase = .02

stock_data.append((sentiment_dict['compound'],stock_increase ))

sentiment_dict = sid_obj.polarity_scores("   Warren Bufett selling shares causes peopel to think that the bank stocks are doing badly    ")
stock_increase = -.06

stock_data.append((sentiment_dict['compound'],stock_increase ))

sentiment_dict = sid_obj.polarity_scores("   the stock might be doing poorly because they were unfortunately forced to sell off part of their businees to not be in debt    ")
stock_increase = -.04

stock_data.append((sentiment_dict['compound'],stock_increase ))


print(stock_data)