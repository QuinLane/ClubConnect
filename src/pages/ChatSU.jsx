import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MessagingBoard from '../components/messages/MessagingBoard';

const API_URL = 'http://localhost:5050';

const ChatSUList = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch threads and resolve user names
  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/su-messages/threads`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { threads: threadMap } = await res.json();

      const entries = Object.entries(threadMap);
      const contactsWithNames = await Promise.all(
        entries.map(async ([uid, msg]) => {
          let displayName = uid;
          try {
            const nameRes = await fetch(`${API_URL}/api/users/${uid}/name`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            });
            if (nameRes.ok) {
              const { name } = await nameRes.json();
              displayName = name;
            }
          } catch (e) {
            console.error('Error fetching user name:', e);
          }

          return {
            email: uid,
            name: displayName,
            userID: parseInt(uid, 10),
            lastMessage: msg?.content || '',
            lastMessageTime: msg?.sentAt || null
          };
        })
      );

      setContacts(contactsWithNames);
    } catch (err) {
      console.error('Failed to fetch threads', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // initial load + polling every 5 seconds
    fetchThreads();
    const interval = setInterval(fetchThreads, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '95%',
      maxWidth: '1200px',
      margin: '20px auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      height: '90vh',
      display: 'flex',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Left Panel */}
      <div style={{
        width: '300px',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        backgroundColor: 'white'
      }}>
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading conversations...
          </div>
        ) : (
          <MessagingBoard
            contacts={contacts}
            onSelectContact={(email) => navigate(`/app/chatSU/${email}`)}
          />
        )}
      </div>

      {/* Right Panel - Blank */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        color: '#666',
        fontSize: '1.2rem'
      }}>
        {contacts.length > 0
          ? 'Select a conversation from the left'
          : 'No conversations available'}
      </div>
    </div>
  );
};

export default ChatSUList;
