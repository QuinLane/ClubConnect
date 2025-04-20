import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MessagingBoard = ({ 
  contacts = [],
  onSelectContact = () => {}
}) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [unreadContacts, setUnreadContacts] = useState(new Set());

  // Sort contacts by most recent message (newest first)
  const sortedContacts = [...contacts].sort((a, b) => 
    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );

  const handleContactClick = (email) => {
    setSelectedContact(email);
    onSelectContact(email);
    // Remove from unread set when selected
    setUnreadContacts(prev => {
      const newSet = new Set(prev);
      newSet.delete(email);
      return newSet;
    });
  };

  // Simulate new messages coming in
  useEffect(() => {
    const interval = setInterval(() => {
      if (contacts.length > 0 && selectedContact) {
        const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
        if (randomContact.email !== selectedContact) {
          setUnreadContacts(prev => new Set(prev).add(randomContact.email));
        }
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [contacts, selectedContact]);

  return (
    <div style={{
      width: '300px',
      height: '100%',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #e0e0e0',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#005587',
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: '500'
      }}>
        Messages
      </div>

      {sortedContacts.map(contact => (
        <div
          key={contact.email}
          onClick={() => handleContactClick(contact.email)}
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #e0e0e0',
            cursor: 'pointer',
            backgroundColor: selectedContact === contact.email ? '#e9f5ff' : 'white',
            transition: 'background-color 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            ':hover': {
              backgroundColor: '#f1f1f1'
            }
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: selectedContact === contact.email ? '600' : '500',
              marginBottom: '4px'
            }}>
              {contact.name || contact.email}
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: '#666',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {contact.lastMessage || 'No messages yet'}
            </div>
          </div>
          
          {unreadContacts.has(contact.email) && (
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#005587',
              marginLeft: '10px'
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

MessagingBoard.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string,
      lastMessage: PropTypes.string,
      lastMessageTime: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date)
      ])
    })
  ),
  onSelectContact: PropTypes.func
};

MessagingBoard.defaultProps = {
  contacts: [],
  onSelectContact: () => {}
};

export default MessagingBoard;
