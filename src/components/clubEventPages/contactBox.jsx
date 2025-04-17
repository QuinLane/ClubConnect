import React from 'react';

const Contact = ({ email, instagram, website }) => {
  return (
    <div style={{
      flex: 1,
      minWidth: 'min(200px, 100%)',
      backgroundColor: '#e0e0e0',
      padding: '20px',
      borderRadius: '8px',
      height: '160px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#2c3e50' }}>Contact</h3>
      <div style={{ fontSize: '0.95rem', color: '#444' }}>
        <p style={{ margin: '4px 0' }}><strong>Email:</strong> {email}</p>
        {instagram && <p style={{ margin: '4px 0' }}><strong>Instagram:</strong> {instagram}</p>}
        {website && <p style={{ margin: '4px 0' }}><strong>Website:</strong> <a href={website} target="_blank" rel="noopener noreferrer">{website}</a></p>}
      </div>
    </div>
  );
};

export default Contact;
