import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Message from '../components/messages/message';
import MessageInput from '../components/messages/messageInput';
import MessagingBoard from '../components/messages/messagingBoard';

const ChatPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([
    { text: "Hello! How can we help you with the club?", isSender: false },
  ]);

  const [contacts, setContacts] = useState([
    {
      email: 'clubs@su.edu',
      name: 'SU Clubs Admin',
      lastMessage: "Welcome to SU Clubs messaging",
      lastMessageTime: new Date()
    }
  ]);

  const [currentChat, setCurrentChat] = useState(contacts[0].email);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [autoOpenChat, setAutoOpenChat] = useState(false);

  // Check for preset email from navigation
  useEffect(() => {
    if (location.state?.presetEmail) {
      const presetEmail = location.state.presetEmail;
      
      // Check if we should auto-open this chat
      if (location.state.autoOpen) {
        setCurrentChat(presetEmail);
        setAutoOpenChat(true);
      } else {
        // Otherwise just pre-fill the new chat modal
        setShowNewChatModal(true);
        setNewChatEmail(presetEmail);
      }
      
      // Check if this contact already exists
      if (!contacts.some(c => c.email === presetEmail)) {
        // Add club as a new contact
        const clubName = presetEmail.split('@')[0].replace('.', ' ');
        const newContact = {
          email: presetEmail,
          name: clubName,
          lastMessage: "New conversation started",
          lastMessageTime: new Date()
        };
        setContacts([...contacts, newContact]);
      }
    }
  }, [location.state]);

  const handleSend = (newMessage) => {
    // Add user's message
    setMessages([...messages, { text: newMessage, isSender: true }]);
    
    // Update last message in contacts
    setContacts(contacts.map(contact => 
      contact.email === currentChat 
        ? { ...contact, lastMessage: newMessage, lastMessageTime: new Date() }
        : contact
    ));
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replyText = autoOpenChat 
        ? `Thanks for your message about ${currentChat.split('@')[0].replace('.', ' ')}! We'll get back to you soon.`
        : "Reply: " + newMessage;
      
      setMessages(prev => [...prev, { 
        text: replyText, 
        isSender: false 
      }]);
      
      // Update last message in contacts for the reply
      setContacts(contacts.map(contact => 
        contact.email === currentChat 
          ? { ...contact, lastMessage: replyText, lastMessageTime: new Date() }
          : contact
      ));
    }, 1000);
  };

  const handleSelectContact = (email) => {
    setCurrentChat(email);
    setMessages([
      { text: `Conversation with ${contacts.find(c => c.email === email).name}`, isSender: false }
    ]);
    setAutoOpenChat(false);
  };

  const handleNewChat = () => {
    if (!newChatEmail) return;
    
    // Check if contact already exists
    const existingContact = contacts.find(c => c.email === newChatEmail);
    if (existingContact) {
      setCurrentChat(newChatEmail);
      setMessages([
        { text: `Continued conversation with ${existingContact.name}`, isSender: false }
      ]);
      setShowNewChatModal(false);
      return;
    }

    // Create new contact
    const newContact = {
      email: newChatEmail,
      name: newChatEmail.split('@')[0].replace('.', ' '),
      lastMessage: "New conversation started",
      lastMessageTime: new Date()
    };

    setContacts([...contacts, newContact]);
    setCurrentChat(newChatEmail);
    setMessages([
      { text: `Started new conversation with ${newContact.name}`, isSender: false }
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
      <div style={{ 
        width: '300px',
        borderRight: '1px solid #e0e0e0',
        position: 'relative',
        backgroundColor: 'white'
      }}>
        <MessagingBoard 
          contacts={contacts} 
          onSelectContact={handleSelectContact}
          currentChat={currentChat}
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
          + New Chat
        </button>
      </div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '16px 0',
          margin: 0,
          backgroundColor: '#005587',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          {contacts.find(c => c.email === currentChat)?.name || 'SU Clubs Chat'}
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