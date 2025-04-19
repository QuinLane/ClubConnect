import React, { useState, useEffect, useRef } from 'react';
import Message from '../components/messages/message';
import MessageInput from '../components/messages/messageInput';
import MessagingBoard from '../components/messages/MessagingBoard';

const API_URL = 'http://localhost:5050';

const TestPage = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const adminID = storedUser.userID;
  const token = localStorage.getItem('token');
  const endRef = useRef(null);

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch SU threads (latest message per exec)
  const fetchThreads = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/su-messages/threads/${adminID}`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { threads: threadMap } = await res.json();

      // Map to contact objects
      const newContacts = Object.entries(threadMap).map(([uid, msg]) => ({
        email: uid,                   // use exec ID as email placeholder
        userID: parseInt(uid, 10),
        lastMessage: msg?.content || '',
        lastMessageTime: msg?.sentAt || null
      }));

      setContacts(newContacts);
      if (newContacts.length > 0) {
        selectContact(newContacts[0]);
      }
    } catch (err) {
      console.error('Failed to fetch threads', err);
    }
  };

  // Fetch messages for a given execID
  const fetchConversation = async (userID) => {
    try {
      const res = await fetch(
        `${API_URL}/api/su-messages/conversation/${userID}`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      setMessages(sorted);
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to fetch conversation', err);
      setMessages([]);
    }
  };

  const selectContact = (contact) => {
    setCurrentChat(contact.email);
    fetchConversation(contact.userID);
  };

  const handleSend = async (text) => {
    if (!currentChat) return;
    const contact = contacts.find(c => c.email === currentChat);
    if (!contact) return;

    try {
      const res = await fetch(
        `${API_URL}/api/su-messages/messageSU`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userID: contact.userID,
            suAdminID: adminID,
            content: text
          })
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await res.json();
      fetchConversation(contact.userID);
      fetchThreads();
    } catch (err) {
      console.error('Failed to send SU message', err);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <div style={{
      width: '95%', maxWidth: '1200px', margin: '20px auto',
      backgroundColor: '#f5f5f5', borderRadius: '12px',
      height: '90vh', display: 'flex', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>

      {/* Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <MessagingBoard
          contacts={contacts.map(c => ({ email: c.email, lastMessage: c.lastMessage, lastMessageTime: c.lastMessageTime }))}
          onSelectContact={(email) => {
            const c = contacts.find(x => x.email === email);
            if (c) selectContact(c);
          }}
          showEmailsOnly
        />
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', padding: '16px 0', backgroundColor: '#005587', color: 'white', fontSize: '1.2rem' }}>
          {currentChat || 'SU Chat'}
        </div>

        <div style={{ flex: 1, padding: '20px', backgroundColor: 'white', overflowY: 'auto' }}>
          {messages.length === 0 && <div style={{ textAlign: 'center', color: '#666' }}>No messages yet</div>}
          {messages.map(msg => (
            <Message
              key={msg.messageID}
              text={msg.content}
              isSender={msg.direction === 'SU_TO_EXEC'}
            />
          ))}
          <div ref={endRef} />
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default TestPage;
