import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPaperPlane } from 'react-icons/fa';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      padding: '12px',
      backgroundColor: '#f5f5f5',
      borderRadius: '0 0 8px 8px',
      borderTop: '1px solid #e0e0e0'
    }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: '10px 15px',
          border: '1px solid #ddd',
          borderRadius: '20px',
          fontSize: '0.95rem',
          outline: 'none',
          marginRight: '10px',
          ':focus': {
            borderColor: '#005587'
          }
        }}
      />
      <button
        type="submit"
        disabled={!message.trim()}
        style={{
          backgroundColor: '#005587',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          ':hover': {
            backgroundColor: '#003d66'
          },
          ':disabled': {
            backgroundColor: '#cccccc',
            cursor: 'not-allowed'
          }
        }}
      >
        <FaPaperPlane />
      </button>
    </form>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired
};

export default MessageInput;