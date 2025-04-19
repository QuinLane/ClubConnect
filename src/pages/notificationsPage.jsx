import React, { useState, useEffect } from 'react';
import Announcement from '../components/messages/announcment';
import CreateAnnouncement from '../components/messages/createAnnouncement';

const NotificationsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [managedClubs, setManagedClubs] = useState([]);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || {});
  const currentUserID = user.userID;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch managed clubs if user is an executive
        if (user.userType === 'ClubExecutive') {
          const clubsResponse = await fetch(`http://localhost:5050/api/executives/user/${currentUserID}/clubs`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const clubsData = await clubsResponse.json();
          setManagedClubs(clubsData);
        }

        // Fetch notifications
        const notificationsResponse = await fetch(`http://localhost:5050/api/notifications/user/${currentUserID}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!notificationsResponse.ok) {
          throw new Error('Failed to fetch announcements');
        }
        
        const notificationsData = await notificationsResponse.json();
        
        // Transform the API data
        const transformedAnnouncements = notificationsData.map(notification => ({
          id: notification.notificationID,
          message: notification.content,
          title: notification.title,
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
      fetchData();
    }
  }, [currentUserID, token, user.userType]);

  const handleNewAnnouncement = async (newAnnouncement) => {
    try {
      let endpoint = 'http://localhost:5050/api/notifications';
      let body = {
        title: newAnnouncement.title,
        content: newAnnouncement.message,
        senderID: currentUserID
      };

      // Determine recipient type and set appropriate endpoint/body
      if (newAnnouncement.recipientType === 'allstudents' && user.userType === 'SUAdmin') {
        endpoint += '/all';
      } else if (newAnnouncement.recipientType === 'specificclub') {
        endpoint += '/club';
        body.clubID = newAnnouncement.specificClub;
      } else if (newAnnouncement.recipientType === 'clubmembers') {
        endpoint += '/club';
        body.clubID = newAnnouncement.specificClub;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to create announcement');

      // Refresh announcements
      const notificationsResponse = await fetch(`http://localhost:5050/api/notifications/user/${currentUserID}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const notificationsData = await notificationsResponse.json();
      const transformedAnnouncements = notificationsData.map(notification => ({
        id: notification.notificationID,
        message: notification.content,
        title: notification.title,
        author: notification.sender 
          ? `${notification.sender.firstName} ${notification.sender.lastName}` + 
            (notification.club ? ` (${notification.club.clubName})` : '')
          : 'System',
        timestamp: notification.postedAt,
        isSender: notification.senderID === parseInt(currentUserID)
      }));
      
      setAnnouncements(transformedAnnouncements);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const sortedAnnouncements = [...announcements].sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Announcements</h1>

      {(user.userType === 'SUAdmin' || managedClubs.length > 0) && (
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
          userRole={user.userType}
          managedClubs={managedClubs}
        />
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
              title={announcement.title}
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

// ... styles remain the same ...


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