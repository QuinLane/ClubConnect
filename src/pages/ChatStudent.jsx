import React, { useState, useEffect, useRef } from 'react';
import Message from '../components/messages/message';
import MessageInput from '../components/messages/messageInput';

const API_URL = 'http://localhost:5050';

const ChatStudent = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userID     = storedUser.userID;
  const token      = localStorage.getItem('token');
  const endRef     = useRef(null);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/su-messages/conversation/${userID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const sorted = data
        .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      setMessages(sorted);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text) => {
    try {
      const res = await fetch(
        `${API_URL}/api/su-messages/messageStudent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userID, content: text }),
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await res.json();
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5500);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      style={{
        width: '95%',
        maxWidth: '800px',
        margin: '20px auto',
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        fontFamily: 'Arial, sans-serif',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          padding: '16px 0',
          backgroundColor: '#005587',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        }}
      >
        Student Union Chat
      </header>

      {/* Messages pane */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#f9f9f9',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
        }}
      >
        {isLoading && messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50%' }}>
            Loading messages...
          </div>
        )}
        {!isLoading && messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50%' }}>
            No messages yet.
          </div>
        )}
        {messages.map((msg) => (
          <Message
            key={msg.messageID}
            text={msg.content}
            isSender={msg.direction === 'EXEC_TO_SU'}
          />
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatStudent;
