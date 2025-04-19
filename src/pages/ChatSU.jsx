import React, { useState } from 'react';
import Message from '../components/messages/Message';
import MessageInput from '../components/messages/messageInput';
import MessagingBoard from '../components/messages/messagingBoard';

const TestPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How's it going?", isSender: false },
    { text: "Great! Just testing this new chat interface.", isSender: true },
  ]);

  const [contacts, setContacts] = useState([
    {
      email: 'alex@su.edu',
      lastMessage: "Let's meet to discuss the project",
      lastMessageTime: new Date()
    },
    {
      email: 'sam@su.edu',
      lastMessage: "Did you see the latest assignment?",
      lastMessageTime: new Date(Date.now() - 3600000)
    },
    {
      email: 'jordan@su.edu',
      lastMessage: "The study group is at 3pm tomorrow",
      lastMessageTime: new Date(Date.now() - 86400000)
    }
  ]);

  const [currentChat, setCurrentChat] = useState(contacts[0].email);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');

  const handleSend = (newMessage) => {
    setMessages([...messages, { text: newMessage, isSender: true }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Reply: " + newMessage, 
        isSender: false 
      }]);
    }, 1000);
  };

  const handleSelectContact = (email) => {
    setCurrentChat(email);
    setMessages([
      { text: `Starting conversation with ${email}`, isSender: false }
    ]);
  };

  const handleNewChat = () => {
    if (!newChatEmail) return;
    
    // Check if contact already exists
    if (contacts.some(c => c.email === newChatEmail)) {
      setCurrentChat(newChatEmail);
      setShowNewChatModal(false);
      return;
    }

    // Create new contact
    const newContact = {
      email: newChatEmail,
      lastMessage: "New conversation started",
      lastMessageTime: new Date()
    };

    setContacts([...contacts, newContact]);
    setCurrentChat(newChatEmail);
    setMessages([
      { text: `Started new conversation with ${newChatEmail}`, isSender: false }
    ]);
    setNewChatEmail('');
    setShowNewChatModal(false);
  };

  return (
    <div style={{
      width: '95%',
      maxWidth: '1200px',
      margin: '20px auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      fontFamily: 'Arial, sans-serif',
      overflowX: 'hidden',
      height: '90vh',
      display: 'flex',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Messaging Board Sidebar */}
      <div style={{ position: 'relative', width: '300px' }}>
        <MessagingBoard 
          contacts={contacts} 
          onSelectContact={handleSelectContact}
          showEmailsOnly={true}
        />
        <button
          onClick={() => setShowNewChatModal(true)}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            padding: '12px',
            backgroundColor: '#005587',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          + Create New Chat
        </button>
      </div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '16px 0',
          margin: 0,
          backgroundColor: '#005587',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          {currentChat || 'SU Chat'}
        </div>

        {/* Chat messages container */}
        <div style={{
          backgroundColor: 'white',
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
          borderTop: '1px solid #e0e0e0'
        }}>
          <MessageInput onSend={handleSend} />
        </div>
      </div>

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
            <p>Enter the email address:</p>
            <input
              type="email"
              value={newChatEmail}
              onChange={(e) => setNewChatEmail(e.target.value)}
              placeholder="user@su.edu"
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

export default TestPage;