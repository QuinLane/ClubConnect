import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Announcement from '../components/messages/announcment';
import CreateAnnouncement from '../components/messages/createAnnouncement';

const NotificationsPage = () => {
  const { clubID } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch notifications from backend
// In NotificationsPage.js
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      let endpoint;
      if (clubID) {
        // For club-specific notifications
        endpoint = `http://localhost:5050/api/notifications/club/${clubID}`;
      } else if (user.userType === 'SUAdmin') {
        // SUAdmins can see all notifications they sent plus received
        endpoint = `http://localhost:5050/api/notifications/sender/${user.userID}`;
      } else {
        // Regular users see notifications they sent plus received
        endpoint = `http://localhost:5050/api/notifications/user/${user.userID}`;
      }
      
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const data = await response.json();
      
      const formattedNotifications = data.map(notification => ({
        id: notification.notificationID,
        message: notification.content,
        title: notification.title,
        author: notification.sender 
          ? `${notification.sender.firstName} ${notification.sender.lastName}${notification.club ? ` (${notification.club.clubName})` : ''}`
          : 'System Notification',
        timestamp: notification.postedAt,
        isClubNotification: !!notification.clubID,
        isRead: notification.recipients?.find(r => r.userID === user.userID)?.isRead || 
               (notification.senderID === user.userID) // Sender automatically "read" their own notifications
      }));
      
      setNotifications(formattedNotifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchNotifications();
}, [clubID, token, user.userID, user.userType]);

  const handleNewAnnouncement = async (newAnnouncement) => {
    try {
      // Determine the appropriate endpoint based on context
      let endpoint = 'http://localhost:5050/api/notifications';
      let body = {
        title: newAnnouncement.title,
        content: newAnnouncement.message,
        senderID: user.userID
      };

      if (clubID) {
        endpoint += '/club';
        body.clubID = clubID;
      } else {
        endpoint += '/all';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to create notification');

      // Refresh notifications after creation
      const updatedResponse = await fetch(
        clubID 
          ? `http://localhost:5050/api/notifications/club/${clubID}`
          : `http://localhost:5050/api/notifications/user/${user.userID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedData = await updatedResponse.json();
      const formattedNotifications = updatedData.map(notification => ({
        id: notification.notificationID,
        message: notification.content,
        title: notification.title,
        author: notification.sender 
          ? `${notification.sender.firstName} ${notification.sender.lastName}${notification.club ? ` (${notification.club.clubName})` : ''}`
          : 'System Notification',
        timestamp: notification.postedAt,
        isRead: notification.recipients?.find(r => r.userID === user.userID)?.isRead || false
      }));
      
      setNotifications(formattedNotifications);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAsRead = async (notificationID) => {
    try {
      await fetch(`http://localhost:5050/api/notifications/read/${notificationID}/${user.userID}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state to reflect read status
      setNotifications(prev => prev.map(n => 
        n.id === notificationID ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  if (loading) return <div style={styles.loading}>Loading notifications...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>
        {clubID ? 'Club Announcements' : 'My Notifications'}
      </h1>

      {(user.userType === 'SUAdmin' || (clubID && user.isClubAdmin)) && (
        <button 
          onClick={() => setShowCreateForm(prev => !prev)} 
          style={styles.button}
        >
          {showCreateForm ? 'Cancel' : 'Create Announcement'}
        </button>
      )}

      {showCreateForm && (
        <CreateAnnouncement 
          onAnnouncementCreate={handleNewAnnouncement} 
          isClubNotification={!!clubID}
        />
      )}

      <div style={styles.announcementsContainer}>
        {sortedNotifications.map(notification => (
          <div 
            key={notification.id} 
            onClick={() => handleMarkAsRead(notification.id)}
            style={{
              ...styles.notificationWrapper,
              opacity: notification.isRead ? 0.8 : 1,
              backgroundColor: notification.isRead ? '#f9f9f9' : '#ffffff'
            }}
          >
            <Announcement
              message={notification.message}
              author={notification.author}
              title={notification.title}
              timestamp={notification.timestamp}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '32px',
    borderBottom: '2px solid #eee',
    paddingBottom: '16px'
  },
  button: {
    marginBottom: '20px',
    padding: '10px 16px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  announcementsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  notificationWrapper: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    padding: '8px',
    ':hover': {
      backgroundColor: '#f0f8ff'
    }
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: 'red',
    fontSize: '18px'
  }
};

export default NotificationsPage;