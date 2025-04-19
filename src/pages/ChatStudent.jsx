import React, { useState, useEffect } from 'react';
import Message from '../components/messages/message';
import MessageInput from '../components/messages/messageInput';

const API_URL = 'http://localhost:5050';

const ChatStudent = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userID = storedUser.userID;
  const token = localStorage.getItem('token');

  const [messages, setMessages] = useState([]);

  // Fetch conversation for this student
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:5050/api/su-messages/conversation/${userID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setMessages(
        data.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
      );
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5500);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (text) => {
    try {
      const res = await fetch(
        `http://localhost:5050/api/su-messages/messageStudent`,
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
      // Refresh conversation after sending
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

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
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'white',
        }}
      >
        <div
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
        </div>

        <div
          style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            wordBreak: 'break-word',
          }}
        >
          {messages.map((msg, idx) => (
            <Message
              key={idx}
              text={msg.content}
              isSender={msg.direction === 'EXEC_TO_SU'}
            />
          ))}
        </div>

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
    </div>
  );
};

export default ChatStudent;
