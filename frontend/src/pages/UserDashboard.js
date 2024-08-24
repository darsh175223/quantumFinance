import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const { username } = location.state || { username: 'User' };

  const dashboardStyle = {
    marginTop: '-25px',
    backgroundImage: `url(${require('.././pics/userdashboard-quantumFinance.jpg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const squareStyle = {
    width: '200px',
    height: '200px',
    backgroundColor: '#f4f5d5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'black',
    margin: '0 20px', // Add some margin between the buttons
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
  };

  const handleNavigateToTradingSim = () => {
    navigate('/TradingSim', { state: { username } });
  };

  const handleNavigateToML = () => {
    navigate('/ML_stockPrediction', { state: { username } });
  };

  return (
    <div style={dashboardStyle}>
      <h1>______</h1>
      <h1 style={{ marginTop: '0px', marginBottom: '-30px' }}>Welcome, {username}</h1>
      <h1 style={{ marginBottom: '80px' }}>______</h1>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={handleNavigateToTradingSim} style={squareStyle}>
          Trading Simulation
        </button>
        <button onClick={handleNavigateToML} style={squareStyle}>
          ML Stock Prediction
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
