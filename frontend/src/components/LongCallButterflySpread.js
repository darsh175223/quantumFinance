import React, { useState } from 'react';
import topNYSECompanies from '../components/NYSECompanies';


const CoveredCall = () => {
  const [stockPrice, setStockPrice] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(topNYSECompanies);
  const [companyName, setCompanyName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const standardPremium = 10;


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


  const handleSelectChange = (e) => {
    const selectedSymbol = e.target.value;
    setSelectedCompany(selectedSymbol);


    const company = topNYSECompanies.find(c => c.symbol === selectedSymbol);
    setCompanyName(company ? company.name : '');
  };
    

   
  

  return (
    <div style={{display:'flex'}}>
                    <div>
                    <h1 style={{marginRight:'-500px'}}>Long Call Butterfly Spread Strategy</h1>
                    <div style={{backgroundColor:'#22272e'}}>
                    <h5 style={{position:'absolute', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',left:'150px', borderRadius:'15px',  top:'300px', color:'#c5d1de', backgroundColor:'#22272e', padding:'15px', width:'550px'}}>Profit: (2 * [Current Price - Strike Price of Bought Call 1]) - (2 * [Current Price - Strike Price of Sold Call]) + (Current Price - Strike Price of Bought Call 2) - Net Premium Paid</h5>

                    </div>


                    </div>
                    <div style={{ padding: '20px' }}>
                    <div style={{
                    marginTop: '-20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    width: '100%',
                    maxWidth: '1200px',
                    gap: '20px',
                    }}>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{ color: 'black' }}>Select a Company:</h2>
                        <input
                        type="text"
                        placeholder="Search by symbol..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ padding: '10px', marginBottom: '20px', borderColor:'black' }}
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
                    </div>
                    </div>
                    </div>


                <div>
                <h4>Enter strike price of bought Call1</h4>
                <input 
                    type="number" 
                    placeholder="Call Price..." 
                    value={stockPrice} 
                    style={{ borderColor: 'black'}}
                    onChange={(e) => setStockPrice(e.target.value)} 
                />
                        <h4>Enter strike price of bought Call2</h4>

                <input 
                    type="number" 
                    placeholder="Call price..." 
                    value={strikePrice} 
                    style={{ borderColor: 'black'}}
                    onChange={(e) => setStrikePrice(e.target.value)} 
                />
                {/* The Premium input is removed, using $10 as the standard premium */}
                <div>
                <button  style={{ padding: '10px', fontSize: '16px', backgroundColor:'#65ed55', borderRadius:'15px', marginTop:'20px' }}>Submit</button>

                </div>

                </div>

               
    </div>
  );
};

export default CoveredCall;