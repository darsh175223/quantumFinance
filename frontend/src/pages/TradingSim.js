import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import topNYSECompanies from '../components/NYSECompanies';


function TradingSim() {
  const location = useLocation();
  const navigate = useNavigate();


  const { username } = location.state || { username: 'user' };


  const [stockPrice, setStockPrice] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(topNYSECompanies);
  const [companyName, setCompanyName] = useState("");
  const [numStocks, setNumStocks] = useState('');
  const [cash, setCash] = useState(2000);
  const [networth, setNetworth] = useState("calculating");
  const [QuantitySlice, setQuantitySlice] = useState([""]);
  const [NameSlice, setNameSlice] = useState([""]);
  const [PriceSlice, setPriceSlice] = useState([""]);
  const [CurrentPrice, setCurrPrice] = useState([])


  function truncateMoney(moneyStr) {
    // Convert the string to a number
    const number = parseFloat(moneyStr);
 
    // Check if conversion is successful and number is valid
    if (isNaN(number)) {
      console.error('Invalid input for truncateMoney:', moneyStr);
      return "0.00"; // Default value if input is invalid
    }
 
    // Format the number to 2 decimal places and return as string
    return number.toFixed(2)+"";
  }
  // HELP ME OVER HERE!!!!!!!
 
   
 
 


 


 


  // Fetch the stock price when a company is selected
  useEffect(() => {
    const fetchStockPrice = async () => {
      if (selectedCompany === "") return;


      try {
        // Fetch from Twelve Data API
        let response = await axios.get('https://api.twelvedata.com/time_series', {
          params: {
            symbol: selectedCompany,
            interval: '1min',
            outputsize: '1',
            apikey: '23ba00821f554f1483efe54897bedd08',
          },
        });


        let data = response.data;


        if (data && data.values && data.values.length > 0) {
          const latestPrice = parseFloat(data.values[0].open).toFixed(2);
          setStockPrice(latestPrice);
        } else {
          console.error('No data found in the response from Twelve Data:', data);


          // Fetch from Alpha Vantage API as fallback
          response = await axios.get('https://www.alphavantage.co/query', {
            params: {
              function: 'TIME_SERIES_INTRADAY',
              symbol: selectedCompany,
              interval: '1min',
              apikey: 'PDGSNPB5Q4M6GR8B', // Replace with your Alpha Vantage API key
            },
          });


          data = response.data;


          const timeSeries = data['Time Series (1min)'];
          if (timeSeries) {
            const latestTimestamp = Object.keys(timeSeries)[0];
            const latestPrice = parseFloat(timeSeries[latestTimestamp]['1. open']).toFixed(2);
            setStockPrice(latestPrice);
          } else {
            console.error('No data found in the response from Alpha Vantage:', data);
            setStockPrice('Data not available');
          }
        }
      } catch (error) {
        console.error('Error fetching the stock price:', error);
        setStockPrice('Error fetching data');
      }
    };


    fetchStockPrice();
  }, [selectedCompany]);


   // Fetch the cash value asynchronously
   useEffect(() => {
    const fetchCashValue = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getCash', {
          params: { username: username },
        });
        console.log("Cash value: ", response.data.cash);


        if (response.data && response.data.cash !== undefined) {
            console.log("Good ending");
          setCash(response.data.cash);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching cash value:', error);
      }


     
    };


    fetchCashValue();
  }, [username]);


  // Fetch the cash value asynchronously
  useEffect(() => {
    const fetchNetworth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getNetworth', {
          params: { username: username },
        });
        console.log("Networth value: ", response.data.cash);
 
        if (response.data && response.data.cash !== undefined) {
          console.log("Good ending:v2");
          setNetworth(response.data.cash);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching Networth value:', error);
      }
 
      // Delay the next fetch by 5 minutes (300,000 milliseconds)
      setTimeout(fetchNetworth, 300000);
    };
 
    fetchNetworth();
  }, [username]);


  // Fetch stock assets (QuantitySlice and NameSlice)
  useEffect(() => {
    const fetchStockAssets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getStockAssets', {
          params: {
            username: username,
            quantity: 0,
          },
        });
        console.log(response.data.quantitySlice);






        // const { QuantitySlice, NameSlice, PriceSlice } = response.data;


        setQuantitySlice(response.data.quantitySlice);
        setNameSlice(response.data.nameSlice);
        setPriceSlice(response.data.priceSlice);


        console.log("QuantitySlice:", QuantitySlice);
        console.log("NameSlice:", NameSlice);
        console.log("PriceSlice:", PriceSlice);
      } catch (error) {
        console.error('Error fetching stock assets:', error);
      }
    };


    fetchStockAssets();
  }, [username]);


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
  };
  const refreshPage = () => {
    window.location.reload();
  }


  const handleBuyClick = async () => {
    if(cash>=numStocks*stockPrice){
        try {
            const response = await axios.patch('http://localhost:8080/buy', null, {
              params: {
                username: username,
                quantity: numStocks,
                stock: selectedCompany,
                price: stockPrice,
              },
            });
     
            console.log('Buy successful:', response.data);
            setCash(cash - numStocks * stockPrice);
          } catch (error) {
            console.error('Error making the purchase:', error);
          }
     
          try {
            const response = await axios.patch('http://localhost:8080/setCash', null, {
              params: {
                username: username,
                cash: cash - numStocks * stockPrice + "",
              },
             
            }
          );
          refreshPage()


            console.log('Cash reset successful:', response.data);
            setCash(cash - numStocks * stockPrice);
          } catch (error) {
            console.error('Error making the cash reset:', error);
          }


    }
   


   
  };


  const handleSellClick = async () => {
    try {
      const response = await axios.patch('http://localhost:8080/sell', null, {
        params: {
          username: username,
          quantity: numStocks,
          stock: selectedCompany,
          price: stockPrice,
        },
      });


      console.log('Sell successful:', response.data);
      setCash(cash + numStocks * stockPrice);
    } catch (error) {
      console.error('Error making the sale:', error);
    }


    try {
        const response = await axios.patch('http://localhost:8080/setCash', null, {
          params: {
            username: username,
            cash: cash + numStocks * stockPrice + "",
          },
        });
 
        console.log('Cash reset successful:', response.data);
        setCash(cash + numStocks * stockPrice);
      } catch (error) {
        console.error('Error making the cash reset:', error);
      }


  };


  return (
    <div style={{
      marginTop: '-25px',
      backgroundImage: `url(${require('../pics/userdashboard-quantumFinance.jpg')})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '200vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h1 style={{ marginTop: '20px' }}>Hello, Trader!</h1>
      <img
        src={require('.././pics/goBacktoDashfromTradingSim.png')}
        alt="Go back to dashboard"
        style={{ position: 'absolute', top: '80px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
        onClick={() => navigate('/UserDashboard', { state: { username } })}
      />
      <div style={{ padding: '20px' }}>
        <div style={{
          marginTop: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          maxWidth: '1200px',
          gap: '20px',
        }}>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: 'white' }}>Select a Company:</h2>
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ padding: '10px', marginBottom: '20px' }}
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
         
          <div style={{
            width: '300px',
            height: '300px',
            backgroundColor: 'white',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            marginTop: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
          }}>
            {selectedCompany && (
              <>
                <h2>{companyName}</h2>
                <h2>Symbol: {selectedCompany}</h2>
                <h2>Price: ${stockPrice}</h2>
                <input
                  type="number"
                  placeholder="Number of stocks to buy/sell"
                  value={numStocks}
                  onChange={(e) => setNumStocks(e.target.value)}
                  style={{ padding: '10px', marginBottom: '10px', width: '200px' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleBuyClick} style={{ padding: '10px', fontSize: '16px', backgroundColor:'#65ed55' }}>Buy</button>
                  <button onClick={handleSellClick} style={{ padding: '10px', fontSize: '16px', backgroundColor:'#f55249' }}>Sell</button>
                </div>
              </>
            )}
          </div>


          <div style={{
            width: '300px',
            height: '300px',
            backgroundColor: 'white',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            marginTop: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
          }}>
            <h2>Cash: ${truncateMoney(cash)}</h2>
            <h2>Networth: ${truncateMoney(networth)}</h2>




          </div>
        </div>
       
        <div style={{
          marginTop: '50px',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '1200px',
          padding: '20px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        }}>
          <h2>Stocks you own</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Stock Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {QuantitySlice.map((quantity, index) => (
                <tr key={NameSlice[index]}>
                  <td>{quantity}</td>
                  <td>{NameSlice[index]}</td>
                  <td>${PriceSlice[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default TradingSim;






