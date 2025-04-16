import React from 'react';

const Bio = ({ text, width = '300px', height = '200px' }) => {
  return (
    <div style={{
      width: '400px',
      height: '400px',
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflowY: 'auto',
      alignItems: 'center',
      justifyContent: 'center' // Add this
      // Add this

    }}>
      <div style={{
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#333333',
        height: '100%',
        overflowY: 'auto',
        paddingRight: '5px',
        textAlign: 'center',    // Add this for horizontal centering

      }}>
        {text}
      </div>
    </div>
  );
};

export default Bio;