import React from 'react';

const Logo = ({ 
  imageUrl, 
  size = 120, 
  borderWidth = 2, 
  borderColor = '#ffffff',
  className = '',
  altText = 'Club Logo'
}) => {
  return (
    <div 
      className={`logo-container ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        margin: '0 auto'
      }}
    >
      <img 
        src={imageUrl} 
        alt={altText} 
        style={{
          width: '90%',
          height: '90%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
};

export default Logo;