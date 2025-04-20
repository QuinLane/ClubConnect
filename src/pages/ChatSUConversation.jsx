import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Message from '../components/messages/message';
import MessageInput from '../components/messages/messageInput';

const API_URL = 'http://localhost:5050';

const ChatSUConversation = () => {
  const { ucid } = useParams();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const adminID = storedUser.userID;
  const token = localStorage.getItem('token');
  const endRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contactName, setContactName] = useState('');

  // Fetch conversation and sort messages
  const fetchConversation = async () => {
    try {
      const res = await fetch(`${API_URL}/api/su-messages/conversation/${ucid}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      setMessages(sorted);
    } catch (err) {
      console.error('Failed to fetch conversation', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch contact's display name
  useEffect(() => {
    const fetchContactName = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${ucid}/name`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const { name } = await res.json();
          setContactName(name);
        } else {
          setContactName(ucid);
        }
      } catch (err) {
        console.error('Failed to fetch contact name', err);
        setContactName(ucid);
      }
    };
    fetchContactName();
  }, [ucid]);

  // Send a new message
  const handleSend = async (text) => {
    try {
      const res = await fetch(`${API_URL}/api/su-messages/messageSU`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userID: parseInt(ucid, 10),
          suAdminID: adminID,
          content: text
        })
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await res.json();
      fetchConversation();
    } catch (err) {
      console.error('Failed to send SU message', err);
    }
  };

  // Initial load and polling setup
  useEffect(() => {
    fetchConversation();
    const interval = setInterval(fetchConversation, 5000);
    return () => clearInterval(interval);
  }, [ucid]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
        <button 
          onClick={() => navigate('/app/chatSU')}
          style={{
            padding: '10px',
            margin: '10px',
            backgroundColor: '#005587',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to All Chats
        </button>
      </div>

      {/* Right Panel */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden'
      }}>
        <div style={{ 
          textAlign: 'center',  
          padding: '16px 0',  
          backgroundColor: '#005587',  
          color: 'white',  
          fontSize: '1.2rem'  
        }}>
          Conversation with {contactName || ucid}
        </div>

        {isLoading ? (
          <div style={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            Loading conversation...
          </div>
        ) : (
          <>  
            {/* Scrollable message list */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '20px', 
              backgroundColor: 'white' 
            }}>
              {messages.length === 0 ? (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#666'
                }}>
                  No messages in this conversation yet
                </div>
              ) : (
                messages.map(msg => (
                  <Message
                    key={msg.messageID}
                    text={msg.content}
                    isSender={msg.direction === 'SU_TO_EXEC'}
                  />
                ))
              )}
              <div ref={endRef} />
            </div>

            {/* Input area */}
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f5f5f5', 
              borderTop: '1px solid #e0e0e0' 
            }}>
              <MessageInput onSend={handleSend} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSUConversation;
