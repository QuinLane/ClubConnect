import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ 
  text = "",
  isSender = false
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isSender ? 'flex-end' : 'flex-start',
      margin: '8px 0',
      width: '100%',
      padding: '0 12px',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: isSender 
          ? '18px 4px 18px 18px'
          : '4px 18px 18px 18px',
        backgroundColor: isSender 
          ? '#005587'
          : '#e5e5ea',
        color: isSender ? 'white' : 'black',
        fontSize: '0.95rem',
        lineHeight: '1.4',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
      }}>
        {text}
      </div>
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  isSender: PropTypes.bool
};

Message.defaultProps = {
  isSender: false
};

export default Message;
