import React, { useState } from 'react';

import CoveredCall from './CoveredCall';
import MarriedPut from '../components/MarriedPut';
import BullCallSpread from '../components/BullCallSpread';
import BearPutSpread from '../components/BearPutSpread';
import ProtectiveCollar from '../components/ProtectiveCollar';
import LongStraddle from '../components/LongStraddle';
import LongStrangle from '../components/LongStrangle';
import LongCallButterflySpread from '../components/LongCallButterflySpread';
import IronCondor from '../components/IronCondor';
import IronButterfly from '../components/IronButterfly';
import Reversal from '../components/Reversal';

const OptionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const options = [
    'Covered Call',
    'Married Put',
    'Bull Call Spread',
    'Bear Put Spread',
    'Protective Collar',
    'Long Straddle',
    'Long Strangle',
    'Long Call Butterfly Spread',
    'Iron Condor',
    'Iron Butterfly',
    'Reversal'
  ];

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      setIsConfirmed(true);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    dropdownButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      fontSize:'25px',
      cursor: 'pointer',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)'
    },
    optionsList: {
      position: 'absolute',
      zIndex: 10,
      marginTop: '4px',
      width: '100%',
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      maxHeight: '240px',
      overflowY: 'auto',
      fontSize:'20px',
      listStyleType: 'none',
      padding: 0,
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
    },
    option: {
      padding: '8px 16px',
      cursor: 'pointer',
    },
    confirmButton: {
      marginTop: '35px',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      marginLeft:'25px',
      cursor: 'pointer',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    header: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
  };

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'Covered Call':
        return <CoveredCall />;
      case 'Married Put':
        return <MarriedPut />;
      case 'Bull Call Spread':
        return <BullCallSpread />;
      case 'Bear Put Spread':
        return <BearPutSpread />;
      case 'Protective Collar':
        return <ProtectiveCollar />;
      case 'Long Straddle':
        return <LongStraddle />;
      case 'Long Strangle':
        return <LongStrangle />;
      case 'Long Call Butterfly Spread':
        return <LongCallButterflySpread />;
      case 'Iron Condor':
        return <IronCondor />;
      case 'Iron Butterfly':
        return <IronButterfly />;
      case 'Reversal':
        return <Reversal />;

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {!isConfirmed ? (
        <>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={styles.dropdownButton}
            >
              {selectedOption || 'Select a Strategy'}
            </button>
            {isOpen && (
              <ul style={styles.optionsList}>
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleSelect(option)}
                    style={styles.option}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleConfirm}
            style={{
              ...styles.confirmButton,
              ...(selectedOption ? {} : styles.disabledButton),
            }}
            disabled={!selectedOption}
          >
            <b>Confirm my selection</b>
          </button>
        </>
      ) : (
        <>
        <div style={{marginLeft:'-300px', marginTop:'-30px'}}>
        <h2 style={styles.header}>Using {selectedOption}</h2>
        {renderSelectedComponent()}

        </div>
          
        </>
      )}
    </div>
  );
};

export default OptionsDropdown;