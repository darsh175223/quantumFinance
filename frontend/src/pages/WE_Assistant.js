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
          <p style={{color:'black'}}>Gross income is your total earnings before any deductions, while net income is the amount of money you take home after taxes, health insurance, retirement contributions, and other withholdings.</p>
          <h4>How to calculate:</h4>
          <ol>
            <li>Start with your gross income – this includes wages, salary, bonuses, and any additional income like side jobs or freelance work.</li>
            <li>Subtract federal, state, and local taxes. Each state has different tax rates, so it's important to check your state's tax obligations.</li>
            <li>Subtract other deductions such as Social Security (6.2% of gross income), Medicare (1.45%), health insurance premiums, retirement contributions (401(k), IRA), and any other pre-tax deductions.</li>
            <li>The remaining amount is your net income, which reflects the true amount you have available for spending, saving, and investing.</li>
          </ol>
          <p style={{color:'black'}}>Understanding the difference between gross and net income is crucial for budgeting, tax planning, and financial goal setting. When planning your finances, always focus on your net income, as it gives a realistic picture of what you can spend and save.</p>
          <h4>Tips:</h4>
          <ul>
            <li>Track both gross and net income monthly to stay aware of tax impacts and withholding patterns.</li>
            <li>If you're a freelancer or contractor, set aside 20-30% of your gross income for estimated taxes to avoid a large tax bill at year-end.</li>
            <li>Review your paycheck stub to ensure your deductions are accurate and you're contributing enough to retirement accounts to take full advantage of employer matching (if applicable).</li>
          </ul>
        </>
      )
    },
    {
      title: "Calculate Your California Take-Home Pay",
      content: (
        <>
          <p style={{color:'black'}}>California has one of the highest state income taxes in the U.S., which can significantly affect your take-home pay. Use this tool to estimate your take-home pay based on your gross income and other factors.</p>
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
          <p style={{color:'black'}}>California's high income taxes (ranging from 1% to 13.3% depending on income bracket), combined with federal taxes, can result in a significant reduction between gross and net income. Be sure to consider other deductions like Social Security, Medicare, health insurance premiums, and retirement contributions.</p>
          <p style={{color:'black'}}>Note: This tool provides an estimate. For precise tax calculations, consider using a tax preparation service or consulting with a tax advisor, especially if you have a complex financial situation, such as multiple income streams or investments.</p>
          <h4>Tips for optimizing California taxes:</h4>
          <ul>
            <li>Maximize contributions to pre-tax accounts like a 401(k) or IRA to lower your taxable income.</li>
            <li>Research additional tax deductions or credits you may be eligible for, such as the Child Tax Credit, mortgage interest deductions, or student loan interest deductions.</li>
            <li>Consider strategies to lower taxable income, such as investing in municipal bonds, which are tax-exempt at the federal and state level.</li>
          </ul>
        </>
      )
    },
    {
      title: "Creating an Emergency Fund",
      content: (
        <>
          <p style={{color:'black'}}>An emergency fund is essential for financial stability, providing a safety net in case of unexpected expenses such as medical emergencies, car repairs, or sudden job loss.</p>
          <h4>Steps to build your emergency fund:</h4>
          <ol>
            <li>Aim for 3-6 months of living expenses. This amount covers your basic needs (housing, utilities, food) in case of a financial emergency. Some experts recommend building up to 12 months if you're self-employed or in a volatile industry.</li>
            <li>Start small – even setting aside $500 to $1,000 can make a big difference in minor emergencies. Gradually increase your savings over time.</li>
            <li>Set up automatic transfers to a separate savings account dedicated solely to emergencies. Automating your savings ensures consistency and removes the temptation to spend the money elsewhere.</li>
            <li>Use windfalls such as tax refunds, bonuses, or gifts to boost your emergency fund quickly.</li>
          </ol>
          <p style={{color:'black'}}>An emergency fund reduces financial stress by ensuring you're prepared for unexpected events. Without one, you may be forced to rely on credit cards or loans, leading to more debt.</p>
          <h4>Additional Considerations:</h4>
          <ul>
            <li>Keep your emergency fund in a high-yield savings account or money market account to earn interest while maintaining easy access to your funds.</li>
            <li>Review your fund periodically and adjust based on life changes (e.g., marriage, having children, buying a home).</li>
            <li>Avoid using the fund for non-emergency situations, like vacations or unnecessary purchases.</li>
          </ul>
        </>
      )
    },
    {
      title: "50/30/20 Budgeting Rule",
      content: (
        <>
          <p style={{color:'black'}}>The 50/30/20 rule is a simple and effective budgeting method designed to balance spending and saving, making it easier to manage your finances and meet long-term goals.</p>
          <h4>How it works:</h4>
          <ul>
            <li>50% of your income goes towards needs – these are essential expenses like rent, mortgage payments, groceries, utilities, and minimum debt payments.</li>
            <li>30% of your income goes towards wants – these include non-essential expenses like entertainment, dining out, vacations, and hobbies. Being mindful of overspending in this category helps ensure you stay within your budget.</li>
            <li>20% of your income is allocated to savings and debt repayment. This category includes contributions to savings accounts, retirement funds, emergency funds, and additional debt payments (beyond minimum payments).</li>
          </ul>
          <p style={{color:'black'}}>This rule helps create a balanced budget that allows you to cover essentials, enjoy discretionary spending, and work towards savings and financial goals.</p>
          <h4>Tips for using the 50/30/20 rule effectively:</h4>
          <ul>
            <li>Use budgeting apps like Mint, YNAB, or EveryDollar to track your spending and ensure you're sticking to the 50/30/20 ratio.</li>
            <li>Adjust the percentages based on your financial goals – if you're aggressively paying down debt or saving for a major purchase, you might increase the percentage allocated to savings.</li>
            <li>If your living expenses exceed 50% of your income, look for ways to cut costs or increase your income to better align with the rule.</li>
          </ul>
        </>
      )
    },
    {
      title: "Debt Management Strategies",
      content: (
        <>
          <p style={{color:'black'}}>Managing debt effectively is crucial for financial health and long-term success. There are several strategies you can use to pay off debt more efficiently and regain control of your finances.</p>
          <h4>1. Debt Snowball Method:</h4>
          <ul>
            <li>List all your debts in order from smallest to largest balance, regardless of interest rate.</li>
            <li>Pay the minimum on all your debts except the smallest one, which you focus on aggressively paying off.</li>
            <li>Once the smallest debt is paid off, roll that payment amount into the next smallest debt, creating a "snowball" effect.</li>
            <li>This method provides psychological wins and keeps you motivated as you see debts disappearing faster.</li>
          </ul>
          <h4>2. Debt Avalanche Method:</h4>
          <ul>
            <li>List your debts in order from the highest interest rate to the lowest.</li>
            <li>Pay the minimum on all debts except the one with the highest interest rate, which you focus on paying off first.</li>
            <li>Once the highest interest debt is paid off, move to the next highest and repeat the process.</li>
            <li>This method saves the most money in interest over time but may take longer to see the psychological reward of debt elimination.</li>
          </ul>
          <p style={{color:'black'}}>Both methods are effective. The best option depends on your financial situation and motivation. If you prefer quick wins, the snowball method may be better, while the avalanche method is more cost-efficient in the long run.</p>
          <h4>Additional Tips:</h4>
          <ul>
            <li>Negotiate lower interest rates with your creditors, or consider consolidating debt with a lower-interest loan.</li>
            <li>Use windfalls, like bonuses or tax refunds, to make extra debt payments.</li>
            <li>Cut unnecessary expenses and direct those savings toward debt repayment.</li>
          </ul>
        </>
      )
    },
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
