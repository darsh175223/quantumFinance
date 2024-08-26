import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [grossIncome, setGrossIncome] = useState('');
  const [netIncome, setNetIncome] = useState(null);


  const { username } = location.state || { username: 'User' };

 const calculateTakeHomePay = () => {
    const income = parseFloat(grossIncome);
    if (isNaN(income) || income <= 0) {
      alert('Please enter a valid gross income');
      return;
    }

    // Simplified tax calculation for California
    // Note: This is a basic approximation and doesn't account for all deductions and credits
    let federalTax = 0;
    let stateTax = 0;

    // Federal Tax Brackets for 2023 (simplified)
    if (income > 578125) federalTax = 174238.25 + (income - 578125) * 0.37;
    else if (income > 231250) federalTax = 52832 + (income - 231250) * 0.35;
    else if (income > 182100) federalTax = 37104 + (income - 182100) * 0.32;
    else if (income > 95375) federalTax = 16290 + (income - 95375) * 0.24;
    else if (income > 44725) federalTax = 5147 + (income - 44725) * 0.22;
    else if (income > 11000) federalTax = 1100 + (income - 11000) * 0.12;
    else federalTax = income * 0.10;

    // California State Tax Brackets for 2023 (simplified)
    if (income > 1000000) stateTax = 118304.50 + (income - 1000000) * 0.133;
    else if (income > 625369) stateTax = 65289.29 + (income - 625369) * 0.123;
    else if (income > 375221) stateTax = 33348.13 + (income - 375221) * 0.113;
    else if (income > 312686) stateTax = 25789.56 + (income - 312686) * 0.103;
    else if (income > 61214) stateTax = 2386.59 + (income - 61214) * 0.093;
    else if (income > 48435) stateTax = 1460.17 + (income - 48435) * 0.08;
    else if (income > 34892) stateTax = 860.29 + (income - 34892) * 0.06;
    else if (income > 22107) stateTax = 387.87 + (income - 22107) * 0.04;
    else if (income > 10099) stateTax = 100.99 + (income - 10099) * 0.02;
    else stateTax = income * 0.01;

    // Social Security and Medicare
    const socialSecurity = Math.min(income * 0.062, 9932.40); // 6.2% up to $160,200 for 2023
    const medicare = income * 0.0145;

    const totalDeductions = federalTax + stateTax + socialSecurity + medicare;
    const takeHomePay = income - totalDeductions;

    setNetIncome(takeHomePay.toFixed(2));
  };


 function CustomArrow(props) {
  const { className, style, onClick, direction, leftOffset = '309px' } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        background: 'black',
        borderRadius: '50%',
        padding: '10px',
        [direction === 'next' ? 'right' : 'left']: direction === 'next' ? '-15px' : leftOffset, // Adjust positioning based on direction
        top: 'calc(50% - 60px)', // Move arrows 105px higher
        zIndex: 1, // Ensure it appears above other content
      }}
      onClick={onClick}
    />
  );
}



  const dashboardStyle = {
    marginTop: '-25px',
    backgroundImage: `url(${require('.././pics/userdashboard-quantumFinance.jpg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '200vh',
    justifyContent: 'center',
    alignItems: 'center',
  };


 
  const slideStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '800px',
    marginLeft: '350px',
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />
  };
  const slides = [
    {
      title: "Calculating Gross vs. Net Income",
      content: (
        <>
          <p style={{color:'black'}}>Gross income is your total earnings before deductions, while net income is what you actually take home after taxes and other deductions.</p>
          <h4>How to calculate:</h4>
          <ol>
            <li>Start with your gross income</li>
            <li>Subtract federal, state, and local taxes</li>
            <li>Subtract other deductions (Social Security, Medicare, health insurance, retirement contributions)</li>
            <li>The result is your net income</li>
          </ol>
          <p style={{color:'black'}}>Knowing your net income is crucial for accurate budgeting and financial planning.</p>
        </>
      )
    },
    {
        title: "Calculate Your California Take-Home Pay",
        content: (
          <>
            <p style={{color:'black'}}>Enter your annual gross income to calculate your estimated take-home pay in California.</p>
            <div style={{marginBottom: '20px'}}>
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                placeholder="Gross Income"
                style={{padding: '10px', marginRight: '10px'}}
              />
            <button onClick={calculateTakeHomePay} style={{ padding: '10px', borderRadius: '5px', backgroundColor: 'green', color: 'white' }}>Calculate</button>
            </div>
            {netIncome !== null && (
              <p style={{color:'black'}}>Your estimated annual take-home pay: ${netIncome}</p>
            )}
            <p style={{color:'black'}}>Note: This calculation is a simplified estimate and doesn't account for all possible deductions or credits. For accurate tax advice, please consult a tax professional.</p>
          </>
        )
      },






    {
      title: "Creating an Emergency Fund",
      content: (
        <>
          <p style={{color:'black'}}>An emergency fund is savings set aside to cover unexpected expenses or financial emergencies.</p>
          <h4>How to build your emergency fund:</h4>
          <ol>
            <li>Aim for 3-6 months of living expenses</li>
            <li>Start small - even $500 can help</li>
            <li>Set up automatic transfers to a separate savings account</li>
            <li>Use windfalls (tax refunds, bonuses) to boost your fund</li>
          </ol>
          <p style={{color:'black'}}>Having an emergency fund provides financial security and reduces stress during unexpected situations.</p>
        </>
      )
    },
    {
      title: "50/30/20 Budgeting Rule",
      content: (
        <>
          <p style={{color:'black'}}>The 50/30/20 rule is a simple budgeting method to help you manage your money effectively.</p>
          <h4>How it works:</h4>
          <ul>
            <li>50% of your income goes to needs (rent, groceries, utilities)</li>
            <li>30% goes to wants (entertainment, dining out, hobbies)</li>
            <li>20% goes to savings and debt repayment</li>
          </ul>
          <p style={{color:'black'}}>This rule helps ensure you're covering essentials, enjoying life, and working towards financial goals.</p>
        </>
      )
    },
    {
      title: "Debt Management Strategies",
      content: (
        <>
          <p style={{color:'black'}}>Effective debt management is crucial for financial health. Two popular methods are:</p>
          <h4>1. Debt Snowball Method:</h4>
          <ul>
            <li>Pay minimum on all debts</li>
            <li>Put extra money towards the smallest debt</li>
            <li>Once paid off, move to the next smallest</li>
            <li>Provides psychological wins to keep you motivated</li>
          </ul>
          <h4>2. Debt Avalanche Method:</h4>
          <ul>
            <li>Pay minimum on all debts</li>
            <li>Put extra money towards the highest interest debt</li>
            <li>Once paid off, move to the next highest interest debt</li>
            <li>Saves more money in interest over time</li>
          </ul>
          <p style={{color:'black'}}>Choose the method that works best for your financial situation and personality.</p>
        </>
      )
    }
  ];

  return (
    <div style={dashboardStyle}>
      <div>
        <h1>______</h1>
        <h1 style={{ marginTop: '0px', marginBottom:'-30px'}}>Wealth Management Assistant</h1>
        <h1 style={{marginBottom: '80px'}}>______</h1>
        <img
        src={require('.././pics/goBacktoDashfromTradingSim.png')}
        alt="Go back to dashboard"
        style={{ position: 'absolute', top: '100px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
        onClick={() => navigate('/UserDashboard', { state: { username } })}
      />
        
      </div>
      <div >
      <h2 style={{ color: 'white', marginBottom: '20px', marginTop: '-30px' }}>Income and Budgeting</h2>
      <Slider {...settings} style={{ width: '80%' }}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div style={slideStyle}>
              <h2>{slide.title}</h2>
              {slide.content}
            </div>
          </div>
        ))}
      </Slider>
      
    </div>
      


    </div>
  );
}

export default UserDashboard;
