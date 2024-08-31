import './App.css';
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import TradingSim from './pages/TradingSim';
import ML_stockPrediction from './pages/ML_stockPrediction';
import ExpenseTracker from './pages/ExpenseTracker';
import WE_Assistant from './pages/WE_Assistant';
import BS_Dash from './pages/BS_Dash';
import Edu_BS from './pages/Edu_BS';
import App_BS from './pages/App_BS';

function App() {
  const location = useLocation();

  // Function to check if the navbar should be displayed
  const shouldDisplayNavBar = 
    location.pathname === '/' || 
    location.pathname === '/about' ||
    location.pathname === '/signin' || 
    location.pathname === '/register';

  return (
    <div className="App">
      {shouldDisplayNavBar && (
        <header>
          <div className="logo">
            <Link to="/" style={{fontSize:'30px'}}>QUANTUM FINANCE</Link>
          </div>
          <nav>
            <Link to="/about" style={{ color: 'black', fontWeight: 'bold', fontSize:'25px' }}>About</Link>
            <Link to="/signin" className="sign-in">Sign In</Link>
          </nav>
        </header>
      )}
      <main>
        <Routes>
          <Route path="/" element={
            <div className="hero">
              <div className="hero-content" style={{boxShadow:'15px 15px 20px rgba(0,0,0,0.8)'}}>
                <h1 style={{ marginBottom: '70px', marginTop:'50px', marginRight:'-30px', fontSize:'50px', marginLeft:'-500px'  }}>MASTER YOUR MONEY</h1>
                <p style={{ marginBottom: '125px',  marginRight:'-170px', fontSize:'30px',  marginLeft:'-500px' }}>AI-Driven Financial Services For Smarter Investing</p>
                <Link to="/register" className="try-free-button" style={{
                  backgroundColor: '#3da5d9',
                  color: 'black',
                  textDecoration: 'none',
                  padding: '15px 30px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginBottom: '50px',
                  marginRight:'800px'
                }}>
                  Try for Free
                </Link>
              </div>
            </div>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/TradingSim" element={<TradingSim />} />
          <Route path="/ML_stockPrediction" element={<ML_stockPrediction />} />
          <Route path="/ExpenseTracker" element={<ExpenseTracker />} />
          <Route path="/WE_Assistant" element={<WE_Assistant />} />
          <Route path="/BS_Dash" element={<BS_Dash />} />
          <Route path="/Edu_BS" element={<Edu_BS />} />
          <Route path="/App_BS" element={<App_BS />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
