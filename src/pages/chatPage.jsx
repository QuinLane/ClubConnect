import React, { useState } from 'react';
import Message from '../components/messages/message';
import MessageInput from '../components/messages/messageInput';

const TestPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How's it going?", isSender: false },
    { text: "Great! Just testing this new chat interface.", isSender: true },
  ]);

  const handleSend = (newMessage) => {
    setMessages([...messages, { text: newMessage, isSender: true }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Reply: " + newMessage, 
        isSender: false 
      }]);
    }, 1000);
  };

  return (
    <div style={{
      width: '90%',
      maxWidth: '800px',  // Wider container
      margin: '20px auto',
      padding: '0',
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      fontFamily: 'Arial, sans-serif',
      overflowX: 'hidden',
      height: '90vh',  // Taller container
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{ 
        color: '#333',
        textAlign: 'center',
        padding: '20px 0',
        margin: 0
      }}>
        SU chat
      </h2>

      {/* Expanded chat container */}
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
  );
};

export default TestPage;