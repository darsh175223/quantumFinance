import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jStat } from 'jstat';
import TradingView from '.././components/TradingViewWidget';
import topNYSECompanies from '../components/NYSECompanies';
import { Heatmap } from '.././components/Heatmap';
import OptionsStrategiesDropdown from '.././components/OptionsStrategiesDropdown';



import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';




import axios from 'axios';




function EDU_BS() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || { username: 'User' };

  const [stockPrice, setStockPrice] = useState(null);
  const [strikePrice, setStrikePrice] = useState(120);
  const [timeToMaturity, setTimeToMaturity] = useState(.5);
  const [riskFreeRate, setRiskFreeRate] = useState(0.05);
  const [volatility, setVolatility] = useState(.2);
  const [callPrice, setCallPrice] = useState('');
  const [putPrice, setPutPrice] = useState('');
  const [cash, setCash] = useState(2000);
  const [projectedProfit, setProjectedProfit] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const [isGreekPopupOpen, setisGreekPopupOpen] = useState(false); // State to manage popup visibility
  const [isStratPopupOpen, setisStratPopupOpen] = useState(false); // State to manage popup visibility
  const [isBUYtPopupOpen, setisBUYtPopupOpen] = useState(false); // State to manage popup visibility


  const [impliedVolatility, setimpliedVolatility] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(topNYSECompanies);
  const [companyName, setCompanyName] = useState("");

  const [inputs, setInputs] = useState({
    currentPrice: stockPrice,
    strike: strikePrice,
    timeToMaturity: timeToMaturity,
    volatility: volatility,
    interestRate: 0.05,
  });

  const [heatmapParams, setHeatmapParams] = useState({
    spotMin: stockPrice*.8,
    spotMax: stockPrice*1.2,
    volMin: volatility*.5,
    volMax: volatility*1.5,
  });

  useEffect(() => {
    setInputs(prevInputs => ({
      ...prevInputs,
      currentPrice: stockPrice,
      strike: strikePrice,
      timeToMaturity: timeToMaturity,
      volatility: volatility,
    }));

    setHeatmapParams(prevParams => ({
      ...prevParams,
      spotMin: stockPrice * 0.8,
      spotMax: stockPrice * 1.2,
      volMin: volatility * 0.5,
      volMax: volatility * 1.5,
    }));
  }, [stockPrice, strikePrice, timeToMaturity, volatility]);

  





  const calculateImpliedVolatility = async () => {
    try {
      const apiKey = '23ba00821f554f1483efe54897bedd08';
      const symbol = selectedCompany;
      
      const [currentPrice, priceSixMonthsAgo] = await Promise.all([
        getCurrentPrice(apiKey, symbol),
        getPriceSixMonthsAgo(apiKey, symbol)
      ]);
  
      console.log('Current Price:', currentPrice);
      console.log('Price 6 Months Ago:', priceSixMonthsAgo);
  
      const riskFreeRate = 0.05; // 5%
  
      const iv = computeImpliedVolatility(priceSixMonthsAgo, currentPrice);
      setVolatility(iv);
      console.log('Implied Volatility:', iv);
    } catch (error) {
      console.error('Error calculating implied volatility:', error);
      setVolatility(0); // Set to 0 or some default value in case of error
    }
  };

// Fetch current price of AAPL stock
const getCurrentPrice = async (apiKey, symbol) => {
  try {
    const response = await axios.get(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`);
    
    console.log('API Response:', response.data);

    if (response.data.status === 'error') {
      throw new Error(`API returned an error: ${response.data.message}`);
    }

    if (!response.data.price) {
      throw new Error('Price data not available in the API response');
    }
    console.log("CurrentPrice",response.data.price )
    const intPrice = response.data.price;
    console.log("intPrice", intPrice);
    setStockPrice(parseFloat(intPrice).toFixed(2));
    // setStockPrice(512);



    console.log("CurrentPrice2",stockPrice )

    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error in getCurrentPrice:', error);
    throw error;
  }
};

const getPriceSixMonthsAgo = async (apiKey, symbol) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);

    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&apikey=${apiKey}`;
    
    console.log('Requesting URL:', url);

    const response = await axios.get(url);
    
    console.log('API Response:', response.data);

    if (response.data.status === 'error') {
      throw new Error(`API returned an error: ${response.data.message}`);
    }

    const prices = response.data.values;
    
    if (!prices || !Array.isArray(prices) || prices.length === 0) {
      throw new Error('No price data available');
    }

    console.log("Price 6 months ago:", prices[prices.length - 1].close);
    return parseFloat(prices[prices.length - 1].close);
  } catch (error) {
    console.error('Error in getPriceSixMonthsAgo:', error);
    throw error;
  }
};

// Compute implied volatility using the Black-Scholes model
const computeImpliedVolatility = (S, C) => {
  
  let sigma = 0;

  sigma = (C-S)/S/0.7071067812;
  let absoluteSigma = Math.abs(sigma);

  absoluteSigma = absoluteSigma.toFixed(2);

  console.log("sigma",absoluteSigma);
  return absoluteSigma;
};




 

  const calculateBlackScholes = () => {
    
    calculateImpliedVolatility();
    console.log("rechecking volatility: ", volatility);
    getCurrentPrice('23ba00821f554f1483efe54897bedd08',selectedCompany);
    
    // console.log("newStockPrice", newStockPrice);
    // setStockPrice(newStockPrice);
    console.log("current stock price", stockPrice);


    setTimeout(() => {
      const S = parseFloat(stockPrice);
      const K = parseFloat(strikePrice);
      const T = parseFloat(timeToMaturity);
      const r = 0.05;
      const sigma = volatility;
      
  
      console.log("stockPrice", stockPrice);
      console.log("strikePrice", strikePrice);
      console.log("timeToMaturity", timeToMaturity);
      console.log("r", r);
      console.log("boltaility sigma", sigma);
  
      let d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
      let d2 = d1 - sigma * Math.sqrt(T);
  
      let call = S * jStat.normal.cdf(d1, 0, 1) - K * Math.exp(-r * T) * jStat.normal.cdf(d2, 0, 1);
      let put = K * Math.exp(-r * T) * jStat.normal.cdf(-d2, 0, 1) - S * jStat.normal.cdf(-d1, 0, 1);
  
      console.log("call", call);
      console.log("put", put);
  
  
      setCallPrice(call.toFixed(2));
      setPutPrice(put.toFixed(2));




      
    }, 7000);
    

    

   





  



  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };
  const handleGreeksOpenPopup = () => {
    setisGreekPopupOpen(true);
  };
  const handleStratOpenPopup = () => {
    setisStratPopupOpen(true);
  };
  const handleBUYOpenPopup = () => {
    console.log("opening BUY")
    setisBUYtPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const handleGreeksClosePopup = () => {
    setisGreekPopupOpen(false);
  };
  const handleStratClosePopup = () => {
    setisStratPopupOpen(false);
  };
  const handleBUYClosePopup = () => {
    setisBUYtPopupOpen(false);
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    updateFilteredCompanies(e.target.value);
  };


  const updateFilteredCompanies = (searchTerm) => {
    const filtered = topNYSECompanies.filter(company => {
      if (!company || !company.symbol) return false;
      const searchLetters = searchTerm.toLowerCase().split('');
      const symbolLetters = company.symbol.toLowerCase().split('');
      return searchLetters.every(letter => symbolLetters.includes(letter));
    });
    setFilteredCompanies(filtered);
  };


  const handleSelectChange = (e) => {
    const selectedSymbol = e.target.value;
    setSelectedCompany(selectedSymbol);


    const company = topNYSECompanies.find(c => c.symbol === selectedSymbol);
    setCompanyName(company ? company.name : '');
    // calculateImpliedVolatility();
    // getCurrentPrice('23ba00821f554f1483efe54897bedd08',selectedCompany);
  };
  const refreshPage = () => {
    window.location.reload();
  }


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
    height: '350px',
    marginLeft: '30px',
    position: 'absolute',
    top: '250px',
    left: '0px',
    boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.5)',
  };



 

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#cfb6f2',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '25px',
  };

 

  const popupStyle = {
    position: 'absolute',
    top: '400px',
    left: '800px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '1250px',
    height:'500px',
    boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.5)',
  };

  const greekPopupStyle = {
    position: 'absolute',
    top: '400px',
    left: '800px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '1250px',
    height:'500px',
    boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.5)',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: 'transparent',
    color: 'red',
    border: 'none',
    fontSize: '30px',
    cursor: 'pointer',
  };

  function CustomArrow(props) {
    const { className, style, onClick, direction, leftOffset = '300px' } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          background: 'black',
          borderRadius: '50%',
          padding: '10px',
          [direction === 'next' ? 'right' : 'left']: direction === 'next' ? '-40px' : leftOffset, // Adjust positioning based on direction
          top: 'calc(50% - 60px)', // Move arrows 105px higher
          zIndex: 1, // Ensure it appears above other content
        }}
        onClick={onClick}
      />
    );
  }
  const slideStyle = {
    backgroundColor: 'transparent',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '800px',
    marginLeft: '350px',
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />
  };

  const slides = [
    {
      title: "Covered Call",
      content: (
        <>
          <p style={{color:'black'}}>A covered call is when you own a stock and sell someone the right to buy it from you at a certain price. You do this to make extra money from selling that right, even if you end up selling the stock at a profit.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You own 100 shares of Company XYZ at $50 each. You sell a call option with a strike price of $55. If the stock price stays below $55, you keep the premium. If it rises above $55, you sell the stock at $55.</p>
        </>
      )
    },
    {
      title: "Married Put(Protective Put)",
      content: (
        <>
          <p style={{color:'black'}}>A married put is like buying insurance for a stock you own. You buy a put option so that if the stock’s price drops, you won’t lose too much money because you can still sell it at a higher price.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You buy 100 shares of Company XYZ at $50 each and purchase a put option with a strike price of $45. If the stock drops below $45, the put option limits your losses, allowing you to sell at $45.</p>
        </>
      )
    },
    {
      title: "Bull Call Spread",
      content: (
        <>
          <p style={{color:'black'}}>A bull call spread is a way to make money if you think a stock's price will go up, but not too much. You buy one call option and sell another at a higher price to lower the cost.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You buy a call option on Company XYZ with a strike price of $50 and sell another with a strike price of $55. If the stock rises to $55, your profit is the difference between the two strike prices minus the cost of the options.</p>
        </>
      )
    },
    {
      title: "Bear Put Spread",
      content: (
        <>
          <p style={{color:'black'}}>A bear put spread is a way to profit if you think a stock's price will go down, but not too much. You buy one put option and sell another at a lower price to reduce your costs.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You buy a put option on Company XYZ with a strike price of $50 and sell another with a strike price of $45. If the stock drops to $45, your profit is the difference between the two strike prices minus the cost of the options.</p>
        </>
      )
    },
    {
      title: "Protective Collar",
      content: (
        <>
          <p style={{color:'black'}}>A protective collar is like putting limits on how much you can win or lose on a stock you own. You buy a put option to protect against big losses and sell a call option to pay for it, which limits how much you can gain.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You own 100 shares of Company XYZ at $50 each. You buy a put option with a strike price of $45 and sell a call option with a strike price of $55. If the stock falls, the put protects your downside; if it rises, the call limits your upside.</p>
        </>
      )
    },
    {
      title: "Long Straddle",
      content: (
        <>
          <p style={{color:'black'}}>A long straddle is a way to make money if you think a stock’s price is going to move a lot, but you don’t know if it will go up or down. You buy both a call option and a put option on the same stock.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You buy a call and a put option on Company XYZ with a strike price of $50. If the stock price moves significantly up or down, you profit from one of the options.</p>
        </>
      )
    },
    {
      title: "Long Strangle",
      content: (
        <>
          <p style={{color:'black'}}>A long strangle is like a long straddle, but cheaper. You buy a call option and a put option with different strike prices, betting that the stock’s price will move a lot.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You buy a call option with a strike price of $55 and a put option with a strike price of $45 on Company XYZ. If the stock price moves significantly up or down, you profit from one of the options.</p>
        </>
      )
    },
    {
      title: "Long Call Butterfly Spread",
      content: (
        <>
          <p style={{color:'black'}}>A long call butterfly spread is for when you think a stock's price won’t move much. It’s a way to make a profit if the stock stays near a certain price by buying and selling multiple call options.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You buy a call option on Company XYZ with a strike price of $45, sell two with a strike price of $50, and buy one with a strike price of $55. Your profit is maximized if the stock price is around $50 at expiration.</p>
        </>
      )
    },
    {
      title: "Iron Condor",
      content: (
        <>
          <p style={{color:'black'}}>An iron condor is a strategy for when you think a stock’s price will stay in a narrow range. You sell a call and a put option close to the current price and buy another call and put option further out.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You sell a put with a strike price of $45 and a call with a strike price of $55 on Company XYZ. You also buy a put with a strike price of $40 and a call with a strike price of $60. The strategy profits if the stock price remains between $45 and $55.</p>
        </>
      )
    },
    {
      title: "Iron Butterfly",
      content: (
        <>
          <p style={{color:'black'}}>An iron butterfly is similar to an iron condor, but the call and put you sell are at the same strike price. It’s a strategy for when you think a stock’s price will stay close to one number.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You sell a call and a put with a strike price of $50 on Company XYZ. You also buy a put with a strike price of $45 and a call with a strike price of $55. The strategy profits if the stock price is close to $50 at expiration.</p>
        </>
      )
    },
    
    {
      title: "Reversal",
      content: (
        <>
          <p style={{color:'black'}}>A reversal is the opposite of a conversion. You sell the stock, buy a call option, and sell a put option at the same strike price. It’s another way to lock in a small, risk-free profit.</p>
          <h4>Example:</h4>
          <p style={{color:'black'}}>You sell 100 shares of Company XYZ at $50, buy a call option with a strike price of $50, and sell a put option with a strike price of $50. This creates a risk-free position, profiting from mispricing in the market.</p>
        </>
      )
    }
  ];
  const [selectedComponent, setSelectedComponent] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (selectedComponent) {
      setConfirmed(true);
    }
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      // case 'button':
      //   return <Button>Sample Button</Button>;
      // case 'progress':
      //   return <Progress value={66} />;
      // case 'checkbox':
      //   return <Checkbox />;
      // case 'radio':
      //   return (
      //     <RadioGroup>
      //       <RadioGroupItem value="option1" id="option1" />
      //       <RadioGroupItem value="option2" id="option2" />
      //     </RadioGroup>
      //   );
      default:
        return null;
    }
  };

  if (confirmed) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Selected Component</h2>
        {renderSelectedComponent()}
      </div>
    );
  }


  return (
    <div style={dashboardStyle}>
      <div>
        <div
          style={{
            backgroundColor: '#22272e',
            padding: '5px',
            width: '500px',
            height: '100px',
            marginLeft: '300px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '25px',
            position: 'absolute',
            top: '100px',
            left: '0px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h1 style={{ marginTop: '-40px', marginBottom: '-30px', color: 'white', marginLeft: '30px' }}>
            Options Strategy Builder
          </h1>
        </div>

        <img
          src={require('.././pics/goBacktoDashfromTradingSim.png')}
          alt="Go back to dashboard"
          style={{ position: 'absolute', top: '100px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
          onClick={() => navigate('/BS_Dash', { state: { username } })}
        />

        <div style={formContainerStyle}>
          <label style={{ color: '#c5d1de', fontSize: '30px' }}>Projected Profits:</label>
          <h1 style={{ color: '#c5d1de', fontSize: '30px', marginBottom: '50px' }}>${projectedProfit}</h1>
          <label style={{ color: '#c5d1de', fontSize: '30px' }}>Cash:</label>
          <h1 style={{ color: '#c5d1de', fontSize: '30px', marginBottom: '50px' }}>${cash}</h1>

          <button  style={buttonStyle} onClick={handleBUYOpenPopup}>Buy Option</button>
        </div>

        <button
        onClick={handleStratOpenPopup}
          style={{
            backgroundColor: '#22272e',
            padding: '5px',
            width: '180px',
            height: '110px',
            marginLeft: '300px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '25px',
            position: 'absolute',
            top: '100px',
            left: '515px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h3 style={{ color: '#ab5c2e', marginLeft: '20px', fontSize: '25px' }}>
            Strategies
          </h3>
        </button>

        <button
        onClick={handleGreeksOpenPopup}
          style={{
            backgroundColor: '#22272e',
            padding: '5px',
            width: '160px',
            height: '110px',
            marginLeft: '300px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '25px',
            position: 'absolute',
            top: '100px',
            left: '700px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h3 style={{ color: '#e3c609', marginLeft: '20px', fontSize: '25px' }}>
            Research
          </h3>
        </button>
        

        <button
          onClick={handleOpenPopup}
          style={{
            backgroundColor: '#22272e',
            padding: '5px',
            width: '130px',
            height: '110px',
            marginLeft: '300px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '25px',
            position: 'absolute',
            top: '100px',
            left: '865px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h3 style={{ color: '#4caded', marginLeft: '20px', fontSize: '25px' }}>
            Charts
          </h3>
        </button>

        
      </div>
      {isGreekPopupOpen && (
  <div style={greekPopupStyle}>
    <button style={closeButtonStyle} onClick={handleGreeksClosePopup}>
      <b>X</b>
    </button>

    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', position:'absolute',top:'100px' }}>
    <h2 style={{ color: 'black' }}>Select a Company:</h2>

            <input
              type="text"
              placeholder={selectedCompany}
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ padding: '10px', marginBottom: '20px' , borderColor: 'black' }}
            />
            <select
              value={selectedCompany}
              onChange={handleSelectChange}
              size="10"
              style={{ padding: '10px', width: '300px', fontSize: '16px' }}
            >
              {filteredCompanies.map(company => (
                <option key={company.symbol} value={company.symbol}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <h3 style={{position:'absolute', left:'340px', top:'170px'}}>Enter option duration</h3>
          <input
              type="text"
              placeholder="Enter time to maturity..."
              onChange={(e) => setTimeToMaturity(e.target.value)}
              style={{ padding: '10px', marginBottom: '20px', marginTop:'200px', borderColor: 'black', marginLeft: '-430px'  }}
            />
            <h3 style={{position:'absolute', left:'340px', top:'300px', fontSize:'15px'}}>Enter your predicted price</h3>
          <input
              type="text"
              placeholder="Enter strike price..."
              onChange={(e) => setStrikePrice(e.target.value)}
              style={{ padding: '10px', position: 'absolute', top:'225px',left:'640px', marginTop:'125px', borderColor: 'black', marginLeft: '-300px'  }}
            />
            <button onClick={calculateBlackScholes} style={{
              width: '10%',
              padding: '10px',
              backgroundColor: '#cfb6f2',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '25px',
              position:'absolute',
              top:'475px',
              left:'100px'

            }}>Calculate</button>

            <div>
              <div style={{position:'absolute', top:'50px', left:'700px', borderRadius: '5px',width:'220px',  backgroundColor: '#86ff86', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)'}}>
                <h2>Call Value: ${callPrice}</h2>

              </div>

              
              <div style={{position:'absolute', top:'50px', left:'1000px', borderRadius: '5px',width:'220px',  backgroundColor: '#ff7e7e', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)'}}>
              <h2>Put Value: ${putPrice}</h2>

              </div>

              <div className="heatmaps" style={{ display: 'flex', marginLeft:'550px', marginTop:'-150px' }}>
                <Heatmap
                  title="Call Price Heatmap"
                  inputs={inputs}
                  heatmapParams={heatmapParams}
                  type="call"
                />
                <Heatmap
                  title="Put Price Heatmap"
                  inputs={inputs}
                  heatmapParams={heatmapParams}
                  type="put"
                />
              </div>


            </div>



            
        
        

  </div>
)}

      {isPopupOpen && (
        <div style={popupStyle}>
          <button style={closeButtonStyle} onClick={handleClosePopup}>
            <b>X
              </b>
          </button>
          <TradingView></TradingView>
        </div>
      )}


    {isBUYtPopupOpen && (
        <div style={popupStyle}>
          <button style={closeButtonStyle} onClick={handleBUYClosePopup}>
            <b>X
              </b>
          </button>
          <h1 style={{color:'black'}}>Automated Option Strategy Builder</h1>
          <div style={{position:'absolute', left:'550px', top:'120px'}}>
          <OptionsStrategiesDropdown/>

          </div>

        </div>
      )}


    {isStratPopupOpen && (
        <div style={popupStyle}>
          <button style={closeButtonStyle} onClick={handleStratClosePopup}>
            <b>X
              </b>
          </button>
          <div style={{marginLeft:'-100px', marginTop:'50px', }}>
            <div style={{backgroundColor:'#22272e', padding:'10px', width:'400px', marginLeft:'520px', borderRadius:'15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)'}}>
            <h2 style={{ color: '#c5d1de', marginBottom: '20px', marginTop: '20px' , marginLeft:'25px'}}>Options Trading Strategies</h2>


            </div>
      <Slider {...settings} style={{ width: '80%' }}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div style={slideStyle}>
              <h2>{slide.title}</h2>
              {slide.content}
            </div>
          </div>
        ))}
      </Slider>
      
    </div>
        </div>
      )}
    </div>
  );
}

export default EDU_BS;
