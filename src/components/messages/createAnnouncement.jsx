import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CreateAnnouncement = ({ onAnnouncementCreate, userRole, managedClubs = [] }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [specificClub, setSpecificClub] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSUAdmin = userRole === 'SUAdmin';
  
  // Determine recipient options based on user role
  const recipientOptions = isSUAdmin
    ? ['All Students', 'Specific Club']
    : managedClubs.length > 0 
      ? managedClubs.map(club => club.clubName) 
      : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newAnnouncement = {
        title,
        message,
        recipientType: isSUAdmin 
          ? recipientType === 'All Students' ? 'allstudents' : 'specificclub'
          : 'clubmembers',
        specificClub: isSUAdmin 
          ? specificClub 
          : managedClubs.find(c => c.clubName === recipientType)?.clubID
      };

      await onAnnouncementCreate(newAnnouncement);
      
      // Reset form
      setTitle('');
      setMessage('');
      setRecipientType('');
      setSpecificClub('');
    } catch (error) {
      console.error("Error creating announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Announcement</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
            maxLength={100}
            placeholder="Enter announcement title..."
          />
        </div>

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
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {(recipientType === 'Specific Club' && isSUAdmin) && (
          <div style={styles.formGroup}>
            <label htmlFor="specificClub" style={styles.label}>
              Club ID:
            </label>
            <input
              type="text"
              id="specificClub"
              value={specificClub}
              onChange={(e) => setSpecificClub(e.target.value)}
              style={styles.input}
              required
              placeholder="Enter club ID"
            />
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
