import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';




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
  const handleNavigateToEducation = () => {
    navigate('/Edu_BS', { state: { username } });
  };

  const handleNavigateToApplication = () => {
    navigate('/App_BS', { state: { username } });
  };
  

  return (
    <div style={dashboardStyle}>
        <div>
        <h1>______</h1>
      <h2 style={{ marginTop: '0px', marginBottom:'-30px', color: 'white'}}>Explore your OPTIONS, {username}!</h2>
      <h1 style={{marginBottom: '80px'}}>______</h1>
      <img
        src={require('.././pics/goBacktoDashfromTradingSim.png')}
        alt="Go back to dashboard"
        style={{ position: 'absolute', top: '100px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
        onClick={() => navigate('/UserDashboard', { state: { username } })}
      />

     

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={handleNavigateToEducation} style={squareStyle}>
          Educational Mode
        </button>
        <button onClick={handleNavigateToApplication} style={squareStyle}>
          Application mode
        </button>
        
        </div>
      

        </div>

        
      






   
          
      
    </div>
    
  );
}

export default UserDashboard;