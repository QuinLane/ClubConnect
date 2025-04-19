import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const Announcement = ({ message, author, title, timestamp }) => {
  return (
    <div style={styles.container}>
      <div style={styles.bubble}>
        {title && <h3 style={styles.title}>{title}</h3>}
        <p style={styles.message}>{message}</p>
        <div style={styles.footer}>
          <p style={styles.author}>- {author}</p>
          {timestamp && (
            <p style={styles.timestamp}>
              {format(new Date(timestamp), 'MMM d, yyyy h:mm a')}
            </p>
          )}
        </div>
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
  title: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50',
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px'
  },
  message: {
    margin: '8px 0',
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px'
  },
  author: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
  },
  timestamp: {
    margin: 0,
    fontSize: '12px',
    color: '#999'
  }
};

Announcement.propTypes = {
  message: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string,
  timestamp: PropTypes.string
};

Announcement.defaultProps = {
  title: '',
  timestamp: null
};

export default Announcement;