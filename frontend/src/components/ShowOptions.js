import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ShowOptions = () => {
  const [optionstraded, setOptionstraded] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const location = useLocation();
  const { username } = location.state || { username: 'User' };
  console.log("Checking if username is passed in", username);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (!buttonRef.current?.contains(e.target) && !dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousemove', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    // Making the Axios call
    axios.get('http://localhost:8080/getAllOptions', { params: { username } })
      .then(response => {
        const data = response.data.options;
        const formattedOptions = data.flatMap(option => {
          const [strategy, trades] = option.split(':');
          return trades.replace(/;;/g, ' ').replace(/;/g, '').split(' ').filter(Boolean).map(trade => formatOption(strategy.trim(), trade));
        });
        setOptionstraded(formattedOptions);
      })
      .catch(error => {
        console.error("Error fetching options data: ", error);
      });
  }, [username]);

  // Function to format the option string
  const formatOption = (strategy, trade) => {
    console.log("strategy", strategy, "trade", trade);
    let description = '';


    if(strategy[0]=='C'||strategy[0]=='M'){
        const [symbol, strikePrice, cost, duration] = trade.replace(/[()]/g, '').split(',');
    

        if (strategy === 'CoveredCall') {
        description = `Covered Call for ${symbol} for strike price of $${cost} and bought price of $${strikePrice}. Expiry: ${duration} years`;
        } else if (strategy === 'MarriedPut') {
        description = `Married Put for ${symbol} for strike price of $${cost} and bought price of $${strikePrice}. Expiry: ${duration} years`;
        } else {
        description = `${strategy} for ${symbol} for strike price of $${strikePrice} lasting ${duration} years`;
        }

    }else if(strategy[0]=='B'&&strategy[1]=='u'){
        const [symbol, strikePrice, higherStrikePrice, duration] = trade.replace(/[()]/g, '').split(',');
        description = `${strategy} for ${symbol}: Strike price of bought call is $${strikePrice} and sold call is $${higherStrikePrice} lasting ${duration} years`;
    }else if(strategy[0]=='B'&&strategy[1]=='e'){
        const [symbol, strikePrice, higherStrikePrice, duration] = trade.replace(/[()]/g, '').split(',');
        description = `${strategy} for ${symbol}: Strike price of bought put is $${strikePrice} and sold put is $${higherStrikePrice} lasting ${duration} years`;
    }else if(strategy[0]=='P'){
        const [symbol, strikePrice, higherStrikePrice, duration] = trade.replace(/[()]/g, '').split(',');
        description = `${strategy} for ${symbol}: Strike price of Call is $${strikePrice} and Put is $${higherStrikePrice} lasting ${duration} years`;
    }
    else if(strategy=='LongStraddle'){
        const [symbol, strikePrice, higherStrikePrice, duration] = trade.replace(/[()]/g, '').split(',');
        description = `${strategy} for ${symbol}: ${higherStrikePrice} calls and puts at $${strikePrice} lasting ${duration} years`;
    }
    else if(strategy=='LongStrangle'){
        const [symbol, strikePrice, higherStrikePrice, duration] = trade.replace(/[()]/g, '').split(',');
        description = `${strategy} for ${symbol}: Calls for $${strikePrice} and Puts at $${higherStrikePrice} lasting ${duration} years`;
    }else if(strategy=='LongCallButterflySpread'){
        const [symbol, strikePrice, higherStrikePrice, duration] = trade.replace(/[()]/g, '').split(',');
        const soldCall = (parseInt(higherStrikePrice)-parseInt(strikePrice))+parseInt(higherStrikePrice);
        description = `${strategy} for ${symbol}: Bought 2 Calls for $${strikePrice}, sold 2 Calls for $${soldCall} and bought 1 Call at $${higherStrikePrice} for ${duration} years`;
    }
    else if(strategy=='IronCondor'){
        const [symbol, high , low, duration] = trade.replace(/[()]/g, '').split(',');
        const longCall = (parseInt(high)-parseInt(low))/2+parseInt(high);
        const shortPut = parseInt(low)-(parseInt(high)-parseInt(low))/2;
        description = `${strategy} for ${symbol}: Bought Put for $${shortPut} and Call for $${longCall}, sold Put for $${low} and Call for $${high}. Expiry: ${duration} years`;
    }
    else if(strategy=='IronButterfly'){
        const [symbol, strike , range, duration] = trade.replace(/[()]/g, '').split(',');
        const longCall = parseInt(strike)+(parseInt(range)/2);
        const shortPut = parseInt(strike)-(parseInt(range)/2);
        description = `${strategy} for ${symbol}: Sold Put/Call for $${strike}, bought Call for $${longCall}, sold Put for $${shortPut}. Expiry: ${duration} years`;
    }
    else if(strategy=='Reversal'){
        const [symbol, strike , range, duration] = trade.replace(/[()]/g, '').split(',');
        description = `${strategy} for ${symbol}: Bought Put for $${strike}, sold Call for $${range}. Expiry: ${duration} years`;
    }

    

    return description;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto'
  };

  const buttonContainerStyle = {
    position: 'relative',
    width: '100%',
    zIndex: 2
  };

  const buttonStyle = {
    width: '900px',
    padding: '15px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    borderColor: 'black',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '30px'
  };

  const dropdownStyle = {
    position: 'absolute',
    width: '900px',
    backgroundColor: '#dbeafe',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    top: '100%',
    marginTop: '4px'
  };

  const dropdownItemStyle = {
    padding: '8px',
    cursor: 'pointer'
  };

  const summaryStyle = {
    width: '1050px',
    padding: '16px',
    backgroundColor: '#1f2937',
    color: '#d1d5db',
    borderRadius: '15px',
    transition: 'transform 0.3s',
    transform: isOpen ? `translateY(${optionstraded.length * 40 }px)` : 'translateY(0)',
    marginTop: '16px',
    marginLeft: '525px'
  };
  

  return (
    <div style={containerStyle}>
      <div style={buttonContainerStyle}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          style={buttonStyle}
        >
          Show Options In Use
        </button>
        {isOpen && (
          <div ref={dropdownRef} style={dropdownStyle}>
            {optionstraded.map((option, index) => (
              <div 
                key={index} 
                style={dropdownItemStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#bfdbfe'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={summaryStyle}>
        <h2 style={{ color: 'white' }}>Learn how to implement options trading strategies industry professionals use</h2>
        <br></br>
        <h3>1. Strategies: Shows all available options trading strategies available</h3>
        <h3>2. Research: Explore the pricing of different options through interactive Black Scholes model heatmaps</h3>
        <h3>3. Charts: Explore the stock prices and chart of different stocks</h3>
      </div>
    </div>
  );
};

export default ShowOptions;
