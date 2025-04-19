import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Message from '../components/messages/message';
import MessageInput from '../components/messages/messageInput';

const ChatPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([
    { text: "Hello! How can we help you with the club?", isSender: false },
  ]);

  const [currentChat, setCurrentChat] = useState('clubs@su.edu');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [autoOpenChat, setAutoOpenChat] = useState(false);

  // Check for preset email from navigation
  useEffect(() => {
    if (location.state?.presetEmail) {
      const presetEmail = location.state.presetEmail;
      setCurrentChat(presetEmail);
      setAutoOpenChat(location.state.autoOpen || false);
    }
  }, [location.state]);

  const handleSend = (newMessage) => {
    // Add user's message
    setMessages([...messages, { text: newMessage, isSender: true }]);
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replyText = autoOpenChat 
        ? `Thanks for your message about ${currentChat.split('@')[0].replace('.', ' ')}! We'll get back to you soon.`
        : "Reply: " + newMessage;
      
      setMessages(prev => [...prev, { 
        text: replyText, 
        isSender: false 
      }]);
    }, 1000);
  };

  const handleNewChat = () => {
    if (!newChatEmail) return;
    setCurrentChat(newChatEmail);
    setMessages([
      { text: `Started new conversation with ${newChatEmail.split('@')[0].replace('.', ' ')}`, isSender: false }
    ]);
    setNewChatEmail('');
    setShowNewChatModal(false);
  };

  return (
    <div style={{
      width: '95%',
      maxWidth: '800px', // Narrower for better centering
      margin: '20px auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      fontFamily: 'Arial, sans-serif',
      overflowX: 'hidden',
      height: '90vh',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Main Chat Area - now centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '16px 0',
          margin: 0,
          backgroundColor: '#005587',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}>
          {currentChat.split('@')[0].replace('.', ' ')}
        </div>

        {/* Chat messages container */}
        <div style={{
          backgroundColor: '#f9f9f9',
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          overflowX: 'hidden',
          wordBreak: 'break-word'
        }}>
          {messages.map((message, index) => (
            <Message
              key={index}
              text={message.text}
              isSender={message.isSender}
            />
          ))}
        </div>

        {/* Message input */}
        <div style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }}>
          <MessageInput onSend={handleSend} />
        </div>
      </div>

      {/* New Chat Button - now floating */}
      <button
        onClick={() => setShowNewChatModal(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          padding: '15px',
          backgroundColor: '#005587',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          width: '60px',
          height: '60px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 100
        }}
      >
        +
      </button>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h2 style={{ marginTop: 0 }}>Start New Chat</h2>
            <p>Enter the email address of the person or club you want to message:</p>
            <input
              type="email"
              value={newChatEmail}
              onChange={(e) => setNewChatEmail(e.target.value)}
              placeholder="club@su.edu"
              style={{
                width: '100%',
                padding: '12px',
                margin: '15px 0',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowNewChatModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleNewChat}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#005587',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                disabled={!newChatEmail}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;