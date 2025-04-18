import React from 'react';
import PropTypes from 'prop-types';

const Announcement = ({ message, author }) => {
  return (
    <div style={styles.container}>
      <div style={styles.bubble}>
        <p style={styles.message}>{message}</p>
        <p style={styles.author}>- {author}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    margin: '16px 0',
  },
  bubble: {
    backgroundColor: '#f0f8ff',
    borderRadius: '20px',
    padding: '16px 24px',
    maxWidth: '80%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  message: {
    margin: 0,
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333',
  },
  author: {
    margin: '8px 0 0 0',
    fontSize: '14px',
    textAlign: 'right',
    color: '#666',
    fontStyle: 'italic',
  },
};

Announcement.propTypes = {
  message: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Announcement;