import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const { username } = location.state || { username: 'User' };

  const dashboardStyle = {
    marginTop: '-25px',
    backgroundImage: `url(${require('.././pics/Background_landingPage.jpg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '110vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const squareStyle = {
    width: '200px',
    height: '200px',
    backgroundColor: '#22272e',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#c5d1de',
    margin: '0 20px', // Add some margin between the buttons
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
  };

  const handleNavigateToTradingSim = () => {
    navigate('/TradingSim', { state: { username } });
  };

  const handleNavigateToML = () => {
    navigate('/ML_stockPrediction', { state: { username } });
  };
  const handleNavigateToExpenseTracker = () => {
    navigate('/ExpenseTracker', { state: { username } });
  };
  const handleNavigateToWE_Assistant = () => {
    navigate('/WE_Assistant', { state: { username } });
  };
  const handleNavigateToBS_Dash = () => {
    navigate('/BS_Dash', { state: { username } });
  };
  const handleNavigateToApp_BS = () => {
    navigate('/App_BS', { state: { username } });
  };

  return (
    <div style={dashboardStyle}>
      <div>
      <h1 style={{ marginTop: '0px', marginBottom: '60px', color:'black' }}>Welcome, {username}!</h1>

      </div>
      

      <div style={{ display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap', // Allows the buttons to wrap if necessary
    maxWidth: '1100px', // Set the desired maximum width
    margin: '0 auto', // Center the div horizontally
    gap: '30px', // Adds 30px space between buttons



    }}>
        <button onClick={handleNavigateToTradingSim} style={{   width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#c5d1de',
    fontSize:'20px',
    margin: '0 20px', // Add some margin between the buttons
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
    backgroundImage: `url(${require('.././pics/userdashboard-quantumFinance.jpg')})`,
    }}>
          Trading Simulation
        </button>
        <button onClick={handleNavigateToML} style={{   width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#c5d1de',
    fontSize:'20px',
    margin: '0 20px', // Add some margin between the buttons
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
    backgroundImage: `url(${require('.././pics/ML_image.jpg')})`,
    }}>
          ML Stock Prediction
        </button>
        <button onClick={handleNavigateToExpenseTracker} style={{   width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#c5d1de',
    fontSize:'20px',
    margin: '0 20px', // Add some margin between the buttons
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
    backgroundImage: `url(${require('.././pics/expense2.jpeg')})`,
    
    }}>
          Expense Tracker
        </button>
        <button onClick={handleNavigateToWE_Assistant} style={{   width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#c5d1de',
    fontSize:'20px',
    margin: '0 20px', // Add some margin between the buttons
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
    backgroundImage: `url(${require('.././pics/WE2.jpg')})`,
    
    }}>
          Wealth Management Assistant
        </button>
        <button onClick={handleNavigateToBS_Dash} style={{   width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#c5d1de',
    fontSize:'20px',
    margin: '0 20px', // Add some margin between the buttons
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
    backgroundImage: `url(${require('.././pics/Black_Scholes_image2.jpg')})`,
    
    }}>
          Black Scholes Model
        </button>
        <button onClick={handleNavigateToApp_BS} style={{   width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#c5d1de',
    fontSize:'20px',
    margin: '0 20px', // Add some margin between the buttons
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
    backgroundImage: `url(${require('.././pics/Option_strat2.jpg')})`,
    
    }}>
          Options Trading Strategy Builder
        </button>
      </div>
      <img
        src={require('.././pics/goBacktoDashfromTradingSim.png')}
        alt="Go back to dashboard"
        style={{ position: 'absolute', top: '20px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
        onClick={() => navigate('/', { state: { username } })}
      />
    </div>
  );
}

export default UserDashboard;
