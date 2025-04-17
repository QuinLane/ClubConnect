import React, { useState } from 'react';
import Message from '../components/messages/message';
import MessageInput from '../components/messages/messageInput';
import MessagingBoard from '../components/messages/messagingBoard';

const TestPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How's it going?", isSender: false },
    { text: "Great! Just testing this new chat interface.", isSender: true },
  ]);

  const [contacts] = useState([
    {
      email: 'alex@su.edu',
      name: 'Alex Johnson',
      lastMessage: "Let's meet to discuss the project",
      lastMessageTime: new Date()
    },
    {
      email: 'sam@su.edu',
      name: 'Sam Wilson',
      lastMessage: "Did you see the latest assignment?",
      lastMessageTime: new Date(Date.now() - 3600000)
    },
    {
      email: 'jordan@su.edu',
      name: 'Jordan Lee',
      lastMessage: "The study group is at 3pm tomorrow",
      lastMessageTime: new Date(Date.now() - 86400000)
    }
  ]);

  const [currentChat, setCurrentChat] = useState(contacts[0].email);

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
    // In a real app, you would load the messages for this contact here
    setMessages([
      { text: `Starting conversation with ${contacts.find(c => c.email === email).name}`, isSender: false }
    ]);
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
      <MessagingBoard 
        contacts={contacts} 
        onSelectContact={handleSelectContact}
      />

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          color: '#333',
          textAlign: 'center',
          padding: '16px 0',
          margin: 0,
          backgroundColor: '#005587',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          {contacts.find(c => c.email === currentChat)?.name || 'SU Chat'}
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
    </div>
  );
};

export default TestPage;