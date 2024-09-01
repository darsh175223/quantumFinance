import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';


function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();


  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 12);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const id = generateRandomId();
    const name = `${firstName} ${lastName}`;

    const user = {
      id: id,
      name: name,
      username: username,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('User registered:', data);
      alert("User registered successfully!");
      navigate('/TradingSim', { state: { username } })

    } catch (error) {
      console.error('Error registering user:', error);
      alert("Error registering user. Please try again.");
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'black',
        padding: '2rem',
        borderRadius: '10px',
        color: 'white',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register for Quantum Finance</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="first-name" style={labelStyle}>First Name:</label>
          <input type="text" id="first-name" name="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />

          <label htmlFor="last-name" style={labelStyle}>Last Name:</label>
          <input type="text" id="last-name" name="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={inputStyle} />

          <label htmlFor="username" style={labelStyle}>Username:</label>
          <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} />

          <label htmlFor="password" style={labelStyle}>Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

          <label htmlFor="confirm-password" style={labelStyle}>Confirm Password:</label>
          <input type="password" id="confirm-password" name="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />

          <button type="submit" style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem'
          }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/signin" style={{ color: '#4CAF50' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;