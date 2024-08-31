import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('User signed in:', data);

      navigate('/UserDashboard', { state: { username } });
    } catch (error) {
      console.error('Error signing in:', error);
      alert("Error signing in. Please check your credentials and try again.");
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#333',
    color: 'white'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#ddd'
  };

  return (
    <div className="sign-in-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <div style={{
        backgroundColor: 'black',
        padding: '2rem',
        borderRadius: '10px',
        color: 'white',
        width: '300px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign In to Quantum Finance</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="username" style={labelStyle}>Username:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={inputStyle}
          />
          
          <label htmlFor="password" style={labelStyle}>Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={inputStyle}
          />
          
          <button 
            type="submit" 
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem'
            }}
          >
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4CAF50' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;