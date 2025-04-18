import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CreateAnnouncement = ({ onAnnouncementCreate, userRole, managedClubs = [] }) => {
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [specificClub, setSpecificClub] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userRole === 'admin';
  // Admins can send to all students, all executives, or specific clubs
  const recipientOptions = isAdmin
    ? ['All Students', 'All Club Executives', 'Specific Club']
    // Non-admins can only send to clubs they manage
    : managedClubs.length > 0 
      ? managedClubs.map(club => club.name) 
      : ['No clubs managed'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create the new announcement
    const newAnnouncement = {
      id: Date.now(),
      message,
      author,
      recipientType,
      specificClub: recipientType === 'Specific Club' ? specificClub : null,
      timestamp: new Date().toISOString(),
    };

    // Pass to parent component
    onAnnouncementCreate(newAnnouncement);
    
    // Reset form fields
    setMessage('');
    setAuthor('');
    setRecipientType('');
    setSpecificClub('');
    setIsSubmitting(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Announcement</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="message" style={styles.label}>
            Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
            required
            maxLength={500}
            placeholder="Enter your announcement message..."
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="author" style={styles.label}>
            Your Name/Role:
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={styles.input}
            required
            placeholder="e.g. John Doe (Chess Club President)"
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="recipientType" style={styles.label}>
            Send To:
          </label>
          <select
            id="recipientType"
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select recipient type</option>
            {recipientOptions.map(option => (
              <option key={option} value={option.replace(/\s+/g, '').toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {(recipientType === 'specificclub' || recipientType === 'clubmembers') && !isAdmin && (
          <div style={styles.formGroup}>
            <label htmlFor="specificClub" style={styles.label}>
              Select Club:
            </label>
            <select
              id="specificClub"
              value={specificClub}
              onChange={(e) => setSpecificClub(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select a club</option>
              {managedClubs.map(club => (
                <option key={club.id} value={club.name}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          type="submit" 
          style={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Announcement'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#2c3e50',
    marginTop: '0',
    marginBottom: '20px',
    fontSize: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: '600',
    color: '#495057',
    fontSize: '0.9rem',
  },
  textarea: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '1rem',
  },
  input: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontFamily: 'inherit',
    fontSize: '1rem',
  },
  select: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontFamily: 'inherit',
    fontSize: '1rem',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    alignSelf: 'flex-start',
    ':hover': {
      backgroundColor: '#2980b9',
    },
    ':disabled': {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
    },
  },
};

CreateAnnouncement.propTypes = {
  onAnnouncementCreate: PropTypes.func.isRequired,
  userRole: PropTypes.oneOf(['admin', 'clubManager', 'member']).isRequired,
  managedClubs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

CreateAnnouncement.defaultProps = {
  managedClubs: [],
};

export default CreateAnnouncement;
