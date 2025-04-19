import React, { useState, useEffect } from 'react';
import Announcement from '../components/messages/announcment';
import CreateAnnouncement from '../components/messages/createAnnouncement';

const NotificationsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || {});
  const currentUserID = user.userID;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        
        // Fetch both notifications sent to user and sent by user
        const [recipientResponse, senderResponse] = await Promise.all([
          fetch(`http://localhost:5050/api/notifications/user/${currentUserID}`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`http://localhost:5050/api/notifications/sender/${currentUserID}`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);
        
        if (!recipientResponse.ok || !senderResponse.ok) {
          throw new Error('Failed to fetch announcements');
        }
        
        const recipientData = await recipientResponse.json();
        const senderData = await senderResponse.json();
        
        // Combine and deduplicate the notifications
        const combinedNotifications = [...recipientData, ...senderData];
        const uniqueNotifications = combinedNotifications.filter(
          (notification, index, self) =>
            index === self.findIndex(n => n.notificationID === notification.notificationID)
        );
        
        // Transform the API data to match your component's expected format
        const transformedAnnouncements = uniqueNotifications.map(notification => ({
          id: notification.notificationID,
          message: notification.content,
          author: notification.sender 
            ? `${notification.sender.firstName} ${notification.sender.lastName}` + 
              (notification.club ? ` (${notification.club.clubName})` : '')
            : 'System',
          timestamp: notification.postedAt,
          isSender: notification.senderID === parseInt(currentUserID)
        }));
        
        setAnnouncements(transformedAnnouncements);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUserID) {
      fetchAnnouncements();
    }
  }, [currentUserID, token]);

  const handleNewAnnouncement = (newAnnouncement) => {
    setAnnouncements(prev => [{
      ...newAnnouncement,
      isSender: true,
      timestamp: new Date().toISOString()
    }, ...prev]);
    setShowCreateForm(false);
  };

  const sortedAnnouncements = [...announcements].sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Announcements</h1>

      <button 
        onClick={() => setShowCreateForm(prev => !prev)} 
        style={styles.button}
      >
        {showCreateForm ? 'Cancel' : 'Create Announcement'}
      </button>

      {showCreateForm && (
        <CreateAnnouncement onAnnouncementCreate={handleNewAnnouncement} />
      )}

      <div style={styles.announcementsContainer}>
        {loading ? (
          <div style={styles.loading}>Loading announcements...</div>
        ) : error ? (
          <div style={styles.error}>Error: {error}</div>
        ) : sortedAnnouncements.length === 0 ? (
          <div style={styles.empty}>No announcements to display</div>
        ) : (
          sortedAnnouncements.map(announcement => (
            <Announcement
              key={announcement.id}
              message={announcement.message}
              author={announcement.author}
              timestamp={announcement.timestamp}
              isSender={announcement.isSender}
            />
          ))
        )}
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
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    color: 'red'
  },
  empty: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    fontStyle: 'italic'
  }
};

export default NotificationsPage;