import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [NameSlice, setNameSlice] = useState([""]);
  const [PriceSlice, setPriceSlice] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const { username } = location.state || { username: 'User' };

  const calcTotal = () => {
    let total = 0;
    for (let i = 0; i < PriceSlice.length; i++) {
      total += parseInt(PriceSlice[i]); // Convert to integer before adding
    }
    return total;
  };

  const handleClear = () => {
    try {
        const response =  axios.patch('http://localhost:8080/clearPurchase', null, {
          params: {
            username: username,
          
          },
        });
        console.log('CLEAR successful:', response.data);
        // Update state to reflect the new item added
      setNameSlice([]);
      setPriceSlice( []);
      
      // Optionally, clear the input fields after adding the item
      setNewItem("");
      setNewPrice("");
  
        
      } catch (error) {
        console.error('Error making the purchase:', error);
      }   
    
  };

  // Fetch stock assets (QuantitySlice and NameSlice)
  useEffect(() => {
    const fetchStockAssets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getPurchases', {
          params: { username: username },
        });
        setNameSlice(response.data.purchasesSlice);
        setPriceSlice(response.data.pricesList);
      } catch (error) {
        console.error('Error fetching stock assets:', error);
      }
    };

    fetchStockAssets();
  }, [username]);

  const addNewItem = async () => {
    try {
      const response = await axios.patch('http://localhost:8080/addItem', null, {
        params: {
          username: username,
          itemName: newItem,
          price: newPrice,
        },
      });
      console.log('ADD successful:', response.data);

      // Update state to reflect the new item added
      setNameSlice(prev => [...prev, newItem]);
      setPriceSlice(prev => [...prev, newPrice]);
      
      // Optionally, clear the input fields after adding the item
      setNewItem("");
      setNewPrice("");
    } catch (error) {
      console.error('Error making the purchase:', error);
    }   
  };

  const dashboardStyle = {
    marginTop: '-25px',
    backgroundImage: `url(${require('.././pics/userdashboard-quantumFinance.jpg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '200vh',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={dashboardStyle}>
      <div>
        <h1>______</h1>
        <h1 style={{ marginTop: '0px', marginBottom:'-30px'}}>Expense Tracking</h1>
        <h1 style={{marginBottom: '80px'}}>______</h1>
        <img
        src={require('.././pics/goBacktoDashfromTradingSim.png')}
        alt="Go back to dashboard"
        style={{ position: 'absolute', top: '100px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
        onClick={() => navigate('/UserDashboard', { state: { username } })}
      />
      </div>
      <div>
        <div style={{
          marginTop: '50px',
          backgroundColor: 'white',
          width: '100%',
          marginLeft: '300px',
          maxWidth: '800px',
          padding: '20px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        }}>
          <h2>Add expense</h2>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input
              type="text"
              value={newItem}
              onChange={(event) => setNewItem(event.target.value)} 
              placeholder="Add purchase item"
              style={{
                flex: 5,
                marginRight: '10px',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <input
              type="text"
              value={newPrice}
              onChange={(event) => setNewPrice(event.target.value)} 
              placeholder="Amount Spent($)"
              style={{
                flex: 1,
                marginRight: '10px',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <button
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
              }}
              onClick={addNewItem}
            >
              Add
            </button>
          </div>

          <div>
              <button onClick={handleClear} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
            Clear All Items
            </button>
              </div>

        </div>
      </div>
              

      <div style={{
        marginTop: '50px',
        backgroundColor: 'white',
        width: '100%',
        marginLeft: '300px',
        maxWidth: '800px',
        padding: '20px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      }}>
        <h2>Items Purchased</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Purchase</th>
              <th>Price($)</th>
            </tr>
          </thead>
          <tbody>
            {NameSlice.map((quantity, index) => (
              <tr key={index}>
                <td>{quantity}</td>
                <td>{PriceSlice[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 style={{color: 'black'}}>Total: ${calcTotal()}</h3>

      </div>

       


    </div>
  );
}

export default UserDashboard;
