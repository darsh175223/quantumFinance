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

article_lines = [
    "Microvision, Inc. (MVIS): Cash Burn and Revenue Decline Make It a Risky AR Stock",
    "InterDigital, Inc. (IDCC): Legal Challenges and Revenue Fluctuations Make It a Risky AR Stock",
    "Vuzix Corporation (VUZI): High Costs and Revenue Struggles Place It Among the Worst AR Stocks",
    "Exp World Holdings, Inc. (EXPI): Declining Earnings and Market Concerns Place It Among the Worst AR Stocks",
    "Super Micro Computer, Inc. (SMCI): Rising CapEx and Overvaluation Make It a Risky AR Investment",
    "Etsy, Inc. (ETSY): AR Expansion Fails to Counteract E-Commerce Slowdown Amid Investor Skepticism",
    "Xerox Holdings Corporation (XRX): AR Ambitions Overshadowed By Financial Struggles and Short Seller Pressure",
    "Williams-Sonoma Inc. (WSM)'s AR Push: A Risky Bet Amid Market Challenges and Short Seller Skepticism",
    "Immersion Corporation (IMMR): A Risky AR Investment Amidst Short Sellers' Skepticism",
    "ChatGPT Stock Advice: 10 Recent Stock Recommendations",
    "Taiwan Semiconductor Manufacturing Company Limited (TSM): Among Goldman Sachs' Best Hedge Fund Stock Picks",
    "NVIDIA Corporation (NVDA): Among Goldman Sachs' Best Hedge Fund Stock Picks",
    "Apple Inc. (AAPL): Among Goldman Sachs' Best Hedge Fund Stock Picks",
    "Alphabet Inc. (GOOG): Among Goldman Sachs' Best Hedge Fund Stock Picks",
    "Microsoft Corporation (MSFT): Among Goldman Sachs' Best Hedge Fund Stock Picks",
    "Tech titans target OpenAI deal, including Nvidia",
    "Nvidia isn't the only tech titan targeting OpenAI deal",
    "NVIDIA Corporation (NVDA) : This AI Stock Is Trending Right Now"
]

meta_news=[
    "Meta Platforms, Inc. (META): Harnessing Geothermal for AI Data Centers",
    "Trump warns Mark Zuckerberg could spend the rest of his life in prison",
    "Why Is Meta Platforms (META) Up 4.1% Since Last Earnings Report?",
    "Helix Energy Solutions Group, Inc. (HLX): The Best Small Cap AI Stock To Buy According to Short Sellers?",
    "BigBear.ai Holdings, Inc. (BBAI): The Best Small Cap AI Stock To Buy According to Short Sellers?",
    "Evolv Technology (EVLV): The Best Small Cap AI Stock To Buy According to Short Sellers?",
    "Innodata Inc. (INOD): The Best Small Cap AI Stock To Buy According to Short Sellers?",
    "Big Pharma is betting billions on one AI-biotech.",
    "Serve Robotics Inc. (SERV): The Best Small Cap AI Stock To Buy According to Short Sellers?",
    "Fastly, Inc. (FSLY): The Best Small Cap AI Stock To Buy According to Short Sellers?",
    "SoundHound AI (SOUN): The Best Small Cap AI Stock To Buy According to Short Sellers?",
    "Lemonade (LMND): The Best Small Cap AI Stock To Buy According to Short Sellers?",
    "Power doesnt always mean profit: What builders of digital ecosystems can learn from the metaverse",
    "Forget Nvidia: Billionaire Daniel Loeb Has 31% of His $8.7 Billion Portfolio in Just 4 Unstoppable Artificial Intelligence (AI) Stocks Instead",
    "Insider Sale: Chief Legal Officer of Meta Platforms Inc (META) Sells Shares",
    "7 Best Fast Money Stocks To Buy According To Hedge Funds",
    "Meta Platforms (META) Stock Moves 0.28%: What You Should Know",
    "Nvidia investors should've sold the stock a month ago, strategist says",
    "Controversial California bill to prevent AI disasters heads to Newsom despite pushback from Big Tech",
    "Magnificent Seven Stocks: Nvidia Stock Slides On Earnings; Apple Eyes Buy Point",
    "How Meta Platforms, Inc. (NASDAQ:META) Will Deliver 20% Return in 12 Months",
    "Meta Platforms, Inc. (META): A Beginner Stock You Should Check Out",
    "The biggest challenge for Nvidia stock in one chart",
    "Is Meta Stock A Buy As It Hovers Near Key Level?",
    "Nvidia Cant Escape Shadow of AI Spending Fears",
    "HP prints an earnings miss, CEO weighs in on AI PCs and cost cuts",
    "Forget Amazon And Tesla. This Non-Magnificent Seven Stock Dwarfs Their Gains.",
    "Meta considers new mixed reality glasses as headsets alternative, the Information reports",
    "Top Stock Movers Now: Super Micro Computer, JM Smucker, Nvidia, and More",
    "Meta faces $3.6 million fine in Brazil for allowing bogus Havan ads",
    "Mark Zuckerbergs push for efficiency is upending Metas ambitions in augmented reality",
    "Some Billionaires are Selling Meta Platforms, Inc. (NASDAQ:META) Shares",
    "Analyst Says Meta Platforms (META) AI Monetization is Growing Rapidly",
    "Mark Zuckerbergs election-season gift to Republicans",
    "Analysts are Recommending These 10 AI Stocks",
    "Meta has abandoned efforts to make custom chips for its upcoming AR glasses",
    "Who are Nvidia's biggest competitors?",
    "Meta Shuttering Augmented Reality Studio Amid Pivot to AI",
    "Mark Zuckerberg says White House 'pressured' Meta to 'censor' Covid-19 content",
    "How Zuckerberg censored Covid on Facebook",
    "How Nick Clegg and Mark Zuckerberg bowed to Covid censorship",
    "Meta to shut augmented reality studio used by third-party creators",
    "Meta CEO says company was 'pressured' by Biden admin to censor COVID-19 content",
    "Meta's Mark Zuckerberg Blasts US Government for Efforts to 'Censor' Content",
    "Zuckerberg says White House 'pressured' Meta on COVID content",
    "Meta Platforms, Inc. (META): Trending AI Stock on Latest Analyst Ratings and News",
    "Zuckerberg Says Hes Ready to Push Back Against White House Pressure Over Content",
    "Meta Platforms, Inc. (META) Is a Trending Stock: Facts to Know Before Betting on It",
    "Mark Zuckerberg has some regrets about how Meta handled the pandemic",
    "Mark Zuckerberg Says White House Was Wrong to Pressure Facebook on Covid",
    "If you don't own Nvidia stock you are missing a revolution, says tech investor",
    "Mark Zuckerberg says Meta was pressured by Biden administration to censor Covid-related content in 2021",
    "The biggest challenge for Nvidia stock in one chart",
    "Is Meta Stock A Buy As It Hovers Near Key Level?",
    "Nvidia Cant Escape Shadow of AI Spending Fears",
    "HP prints an earnings miss, CEO weighs in on AI PCs and cost cuts",
    "Forget Amazon And Tesla. This Non-Magnificent Seven Stock Dwarfs Their Gains.",
    "Meta considers new mixed reality glasses as headsets alternative, the Information reports",
    "Top Stock Movers Now: Super Micro Computer, JM Smucker, Nvidia, and More",
    "Meta faces $3.6 million fine in Brazil for allowing bogus Havan ads",
    "Mark Zuckerbergs push for efficiency is upending Metas ambitions in augmented reality",
    "Some Billionaires are Selling Meta Platforms, Inc. (NASDAQ:META) Shares",
    "Analyst Says Meta Platforms (META) AI Monetization is Growing Rapidly",
    "Mark Zuckerbergs election-season gift to Republicans",
    "Analysts are Recommending These 10 AI Stocks",
    "Meta has abandoned efforts to make custom chips for its upcoming AR glasses",
    "Who are Nvidia's biggest competitors?",
    "Meta Shuttering Augmented Reality Studio Amid Pivot to AI",
    "Mark Zuckerberg says White House 'pressured' Meta to 'censor' Covid-19 content",
    "How Zuckerberg censored Covid on Facebook",
    "How Nick Clegg and Mark Zuckerberg bowed to Covid censorship",
    "Meta to shut augmented reality studio used by third-party creators",
    "Meta CEO says company was 'pressured' by Biden admin to censor COVID-19 content",
    "Meta's Mark Zuckerberg Blasts US Government for Efforts to 'Censor' Content",
    "Zuckerberg says White House 'pressured' Meta on COVID content",
    "Meta Platforms, Inc. (META): Trending AI Stock on Latest Analyst Ratings and News",
    "Zuckerberg Says Hes Ready to Push Back Against White House Pressure Over Content",
    "Meta Platforms, Inc. (META) Is a Trending Stock: Facts to Know Before Betting on It"
]


# The stock_increase value
stock_increase = 0.0084
meta_stock_increase = 0.006

# Initialize an empty list to store the results

# Process each line in the provided text
for line in article_lines:
    sentiment_dict = sid_obj.polarity_scores(line)
    stock_data.append((sentiment_dict['compound'], stock_increase))

for line in meta_news:
    sentiment_dict = sid_obj.polarity_scores(line)
    stock_data.append((sentiment_dict['compound'], meta_stock_increase))


print(stock_data)