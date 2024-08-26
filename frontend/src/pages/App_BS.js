import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';




function APP_BS() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || { username: 'User' }; 

 

  const dashboardStyle = {
    marginTop: '-25px',
    backgroundImage: `url(${require('.././pics/userdashboard-quantumFinance.jpg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  };


  return (
    <div style={dashboardStyle}>
        <div>
        <h1>______</h1>
        <h2 style={{ marginTop: '0px', marginBottom:'-30px', color: 'white'}}>Apply the Black Scholes Model to Real Stocks!</h2>
      <h1 style={{marginBottom: '80px'}}>______</h1>
      <img
        src={require('.././pics/goBacktoDashfromTradingSim.png')}
        alt="Go back to dashboard"
        style={{ position: 'absolute', top: '100px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
        onClick={() => navigate('/BS_Dash', { state: { username } })}
      />

     

      
      

        </div>

        
      






   
          
      
    </div>
    
  );
}

export default APP_BS;