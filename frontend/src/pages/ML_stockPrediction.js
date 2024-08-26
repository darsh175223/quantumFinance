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
      <h2 style={{ marginTop: '0px', marginBottom:'-30px', color: 'white'}}>Ready to use some A.I., {username}?</h2>
      <h1 style={{marginBottom: '80px'}}>______</h1>
      <img
        src={require('.././pics/goBacktoDashfromTradingSim.png')}
        alt="Go back to dashboard"
        style={{ position: 'absolute', top: '100px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
        onClick={() => navigate('/UserDashboard', { state: { username } })}
      />

        </div>
      






      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop:'-60px' }}>
            <h3 style={{ color: 'white' }}>Select a Company:</h3>
            <input 
              type="text" 
              placeholder="Search by symbol..." 
              value={searchTerm} 
              onChange={handleSearchChange} 
              style={{ padding: '10px', marginBottom: '20px' }} 
            />
            <select 
              value={selectedCompany} 
              onChange={handleSelectChange} 
              size="10" 
              style={{ padding: '10px', width: '300px', fontSize: '16px' }}
            >
              {filteredCompanies.map(company => (
                <option key={company.symbol} value={company.symbol}>
                  {company.name}
                </option>
              ))}
            </select>
            <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1500px',
  height: '100px',
  backgroundColor: '#693158',
  borderRadius: '10px',
  boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.5)',
  padding: '0px',
  marginTop: '20px',
  color: 'black' // Add this line to set the text color to black
}}>
  <h1>{serverMessage}</h1>
</div>
          </div>
          
      
    </div>
    
  );
}

export default UserDashboard;