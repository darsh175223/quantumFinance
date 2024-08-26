import './App.css';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import TradingSim from './pages/TradingSim';
import ML_stockPrediction from './pages/ML_stockPrediction';
import ExpenseTracker from './pages/ExpenseTracker';


function App() {
  return (
    <div className="App">
      <header>
        <div className="logo">
          <Link to="/">QUANTUM FINANCE</Link>
        </div>
        <nav>
          <Link to="/about">About</Link>
          <Link to="/signin" className="sign-in">Sign In</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={
            <div className="hero">
              <div className="hero-content">
                <h1 style={{ marginBottom: '50px' }}>MASTER YOUR MONEY</h1>
                <p style={{ marginBottom: '50px' }}>AI-Driven Financial Simulations For Smarter Investing</p>
                <Link to="/register" className="try-free-button" style={{
                  backgroundColor: '#3da5d9',
                  color: 'black',
                  textDecoration: 'none',
                  padding: '15px 30px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginBottom: '50px' // Add margin to the bottom of the link
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

        </Routes>
      </main>
    </div>
  );
}

export default App;