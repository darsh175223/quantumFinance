import React from 'react';

function About() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem'
  };

  const contentStyle = {
    backgroundColor: 'black',
    color: 'white',
    padding: '2rem',
    borderRadius: '10px',
    maxWidth: '800px',
    width: '100%'
  };

  const headingStyle = {
    color: '#4CAF50',
    marginBottom: '1rem'
  };

  const paragraphStyle = {
    marginBottom: '1rem',
    lineHeight: '1.6'
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0
  };

  const listItemStyle = {
    marginBottom: '0.5rem',
    paddingLeft: '1rem',
    position: 'relative'
  };

  const bulletStyle = {
    color: '#4CAF50',
    position: 'absolute',
    left: 0
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={{...headingStyle, fontSize: '2rem', textAlign: 'center'}}>About Quantum Finance</h1>
        <p style={paragraphStyle}>
          Welcome to Quantum Finance, your gateway to mastering personal finance through advanced AI-driven simulations. Our platform provides you with the tools to simulate real-world financial scenarios, helping you make informed decisions in a risk-free environment.
        </p>
        <h2 style={headingStyle}>Project Description</h2>
        <p style={paragraphStyle}>
          Quantum Finance is designed to be a comprehensive personal finance simulator where users can experiment with fake money in a safe, simulated environment. Leveraging cutting-edge machine learning algorithms, including sentiment analysis and advanced options pricing models, our platform offers insights that were previously only accessible to financial experts.
        </p>
        <h2 style={headingStyle}>Mission Statement</h2>
        <p style={paragraphStyle}>
          Our mission is to democratize financial education by providing powerful tools that empower users to take control of their financial future. We believe that everyone should have access to the knowledge and resources needed to make informed investment decisions, regardless of their financial background.
        </p>
        <h2 style={headingStyle}>Key Features</h2>
        <ul style={listStyle}>
          {[
            'AI-Driven Sentiment Analysis for Stock Predictions',
            'Options Trading Strategy Builder',
            'Stock Market Trading Simulator',
            'Wealth Management Assistant',
            'Black-Scholes Options Pricing Model Tutorial',
            'Autonomous Threat Detection'
          ].map((feature, index) => (
            <li key={index} style={listItemStyle}>
              <span style={bulletStyle}>-</span> {feature}
            </li>
          ))}
        </ul>
        <h2 style={headingStyle}>Why Choose Quantum Finance?</h2>
        <p style={paragraphStyle}>
          Whether you're a beginner looking to learn the ropes or a seasoned investor seeking advanced tools, Quantum Finance offers a unique blend of education and practical application. Our platform is designed to be user-friendly, yet powerful enough to provide deep insights and real-world applications.
        </p>
        <p style={paragraphStyle}>
          Join us on this journey to financial mastery and explore the possibilities that Quantum Finance can offer you.
        </p>
      </div>
    </div>
  );
}

export default About;