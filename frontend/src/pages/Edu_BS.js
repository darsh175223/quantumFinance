import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jStat } from 'jstat';

function EDU_BS() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || { username: 'User' };

  const [stockPrice, setStockPrice] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [timeToMaturity, setTimeToMaturity] = useState('');
  const [riskFreeRate, setRiskFreeRate] = useState('');
  const [volatility, setVolatility] = useState('');
  const [callPrice, setCallPrice] = useState('');
  const [putPrice, setPutPrice] = useState('');

  const calculateBlackScholes = () => {
    const S = parseFloat(stockPrice);
    const K = parseFloat(strikePrice);
    const T = parseFloat(timeToMaturity);
    const r = parseFloat(riskFreeRate) / 100;
    const sigma = parseFloat(volatility) / 100;

    const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const call = S * jStat.normal.cdf(d1, 0, 1) - K * Math.exp(-r * T) * jStat.normal.cdf(d2, 0, 1);
    const put = K * Math.exp(-r * T) * jStat.normal.cdf(-d2, 0, 1) - S * jStat.normal.cdf(-d1, 0, 1);

    setCallPrice(call.toFixed(2));
    setPutPrice(put.toFixed(2));
  };

  const dashboardStyle = {
    marginTop: '-25px',
    backgroundImage: `url(${require('.././pics/Background_EDU_BS.png')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '150vh',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const formContainerStyle = {
    backgroundColor: '#22272e',
    borderRadius: '15px',
    padding: '20px',
    width: '300px',
    height: '450px',
    marginLeft: '30px',
    position: 'absolute',
    top: '190px',
    left: '20px',
  };

  const inputStyle = {
    width: '100%',
    marginBottom: '20px',
    backgroundColor: 'black',
    color: '#c5d1de',
    fontSize: '25px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#c5d1de',
    fontSize: '20px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
  };

  const infoBoxStyle = {
    backgroundColor: '#22272e',
    borderRadius: '10px',
    padding: '20px',
    width: '1000px',
    height: '600px',
    position: 'absolute',
    top: '410px',
    left: '450px',
    color: '#c5d1de',
    fontSize: '16px',
    lineHeight: '1.5',
  };

  return (
    <div style={dashboardStyle} >
      <div>
      <div style={{
        backgroundColor: '#22272e',
        padding: '5px',
        width: '700px',
        height: '100px',
        marginLeft: '300px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '25px',
        position: 'absolute',
        top: '100px',
        left: '200px',

        

        }}>
        <h2 style={{ marginTop: '-40px', marginBottom: '-30px', color: 'white', marginLeft: '70px' }}>
            Apply the Black Scholes Model to Real Stocks!
        </h2>
        </div>
        
        <img
          src={require('.././pics/goBacktoDashfromTradingSim.png')}
          alt="Go back to dashboard"
          style={{ position: 'absolute', top: '100px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
          onClick={() => navigate('/BS_Dash', { state: { username } })}
        />
        
        <div style={formContainerStyle}>
          <label style={labelStyle}>Stock Price (S):</label>
          <input 
            type="text" 
            value={stockPrice} 
            onChange={(e) => setStockPrice(e.target.value)} 
            style={inputStyle}
          />
          <label style={labelStyle}>Strike Price (K):</label>
          <input 
            type="text" 
            value={strikePrice} 
            onChange={(e) => setStrikePrice(e.target.value)} 
            style={inputStyle}
          />
          <label style={labelStyle}>Time to Maturity (T in years):</label>
          <input 
            type="text" 
            value={timeToMaturity} 
            onChange={(e) => setTimeToMaturity(e.target.value)} 
            style={inputStyle}
          />
          <label style={labelStyle}>Risk-Free Rate (r in %):</label>
          <input 
            type="text" 
            value={riskFreeRate} 
            onChange={(e) => setRiskFreeRate(e.target.value)} 
            style={inputStyle}
          />
          <label style={labelStyle}>Volatility (σ in %):</label>
          <input 
            type="text" 
            value={volatility} 
            onChange={(e) => setVolatility(e.target.value)} 
            style={inputStyle}
          />
          <button onClick={calculateBlackScholes} style={buttonStyle}>Calculate</button>
        </div>

        <div style={infoBoxStyle}>
          <h3>Understanding the Black-Scholes Model</h3>
          <p style={{color: '#c5d1de'}}>
          Imagine you're at a carnival. You see a game where you have to guess if a coin will land heads or tails. If you guess right, you win a prize. But what if you could somehow know exactly what the chances of it landing heads were? That's kind of what the Black-Scholes model does for the stock market.
          </p>
          <h4>What is the Black-Scholes Model?</h4>
          <p style={{color: '#c5d1de'}}>
          It's a mathematical formula that helps us figure out the fair price of an option. An option is like a bet on a stock. You can buy a "call" option, which means you have the right to buy a stock at a certain price in the future. Or you can buy a "put" option, which means you have the right to sell a stock at a certain price in the future.   </p>
          <h4>Why is it important?</h4>

          <p style={{color: '#c5d1de'}}>
          The Black-Scholes model is super important because it helps people make decisions about buying and selling options. It gives us a way to estimate the risk and reward of these bets.   </p>
          <h4>So, why is it so useful?</h4>
      <ol style={{ textAlign: 'left' }}>
        <li><b>Pricing options</b>: It helps us determine a fair price for options, preventing people from being overcharged or undercharged.</li>
        <li><b>Risk management</b>: Investors can use the model to assess the risk of their option positions and make informed decisions.</li>
        
        <li><b>Arbitrage</b>: It helps identify potential arbitrage opportunities, where you can buy and sell the same asset in different markets to make a profit without taking on any risk.</li>
      </ol>
          


        </div>

      </div>

      <div style={{ color: 'black', position: 'absolute', top: '250px', right: '750px' }}>
        <div style={{
          backgroundColor: '#86ff86',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '15px',
        }}>
          <p style={{ color: 'black', fontSize: '30px', paddingRight: '15px' }}>Call Price: ${callPrice}</p>
        </div>
      </div>

      <div style={{ color: 'black', position: 'absolute', top: '250px', right: '450px' }}>
        <div style={{
          backgroundColor: '#ff7e7e',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '15px',
        }}>
          <p style={{ color: 'black', fontSize: '30px', paddingLeft: '15px' }}>Put Price: ${putPrice}</p>
        </div>
      </div>
    </div>
  );
}

export default EDU_BS;
