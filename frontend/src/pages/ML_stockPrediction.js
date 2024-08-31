import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import topNYSECompanies from '../components/NYSECompanies';




function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(topNYSECompanies);
  const [companyName, setCompanyName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [serverMessage, setServerMessage] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);



  const { username } = location.state || { username: 'User' };



  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    updateFilteredCompanies(e.target.value);
  };

  const updateFilteredCompanies = (searchTerm) => {
    const filtered = topNYSECompanies.filter(company => {
      if (!company || !company.symbol) return false;
      const searchLetters = searchTerm.toLowerCase().split('');
      const symbolLetters = company.symbol.toLowerCase().split('');
      return searchLetters.every(letter => symbolLetters.includes(letter));
    });
    setFilteredCompanies(filtered);
  };

  const handleSelectChange = async (e) => {
    const selectedSymbol = e.target.value;
    setSelectedCompany(selectedSymbol);

    const company = topNYSECompanies.find(c => c.symbol === selectedSymbol);
    console.log("Company name: ", company);
    setCompanyName(company ? company.name : '');
    console.log("set company to: ", company);
    const companyRequest = company;
    console.log("Checking if companyRequest goes in", companyRequest.name)
    const response = await fetch('http://localhost:5000/receive-string', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: companyRequest.name }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('String sent successfully');
        setServerMessage(data.message);
      } else {
        console.error('Failed to send string');
      }
  };

  useEffect(() => {
    if (serverMessage && !isTyping) {
      
      setIsTyping(true);
      setDisplayedMessage('');
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i <= serverMessage.length) {
          setDisplayedMessage(serverMessage.slice(0, i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 50); // Adjust typing speed here (milliseconds per character)

      return () => clearInterval(typingInterval);
    }
  }, [serverMessage]);


  const dashboardStyle = {
    marginTop: '-25px',
    backgroundImage: `url(${require('.././pics/AlternateBackground.jpg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  };

  

  

  return (

    <div style={dashboardStyle}>
        <div >
      <h2 style={{ marginTop: '20px', marginBottom:'-30px', color: 'black', fontSize:'40px'}}>Ready to use some A.I., {username}?</h2>
      <img
        src={require('.././pics/goBacktoDashfromTradingSim.png')}
        alt="Go back to dashboard"
        style={{ position: 'absolute', top: '20px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
        onClick={() => navigate('/UserDashboard', { state: { username } })}
      />

        </div>
      






        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '50px', marginTop: '50px' }}>
      <div style={{ flex: '1', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ color: 'black' }}>Select a Company:</h3>
        <input 
          type="text" 
          placeholder="Search by symbol..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
          style={{ padding: '10px', marginBottom: '20px', width: '100%' }} 
        />
        <select 
          value={selectedCompany} 
          onChange={handleSelectChange} 
          size="10" 
          style={{ padding: '10px', width: '100%', fontSize: '16px' }}
        >
          {filteredCompanies.map(company => (
            <option key={company.symbol} value={company.symbol}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      
      <div style={{ flex: '1', maxWidth: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '700px',
            height: '310px',
            borderRadius: '20px',
            padding: '20px',
            color: 'black',
            backgroundColor:'black',
            overflow: 'auto'  // Add this to handle overflow
          }}>
          <h1 style={{color:'#05fa17'}}>{displayedMessage}</h1>
        </div>
      </div>
    </div>
          
      
    </div>
    
  );
}

export default UserDashboard;