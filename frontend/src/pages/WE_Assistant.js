import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();


  const { username } = location.state || { username: 'User' };



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
      


    </div>
  );
}

export default UserDashboard;
