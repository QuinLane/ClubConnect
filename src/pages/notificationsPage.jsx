import React, { useState } from 'react';
import Announcement from '../components/messages/announcment';
import CreateAnnouncement from '../components/messages/createAnnouncement';

const NotificationsPage = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      message: "The chess club tournament has been rescheduled to next Friday at 4 PM in the student center.",
      author: "Sarah Johnson (Chess Club)",
      timestamp: "2023-11-15T09:30:00Z"
    },
    {
      id: 2,
      message: "All club presidents: Budget requests for Q1 are due by end of day Friday. Please submit through the portal.",
      author: "Student Activities Office",
      timestamp: "2023-11-14T14:15:00Z"
    },
    {
      id: 3,
      message: "Photography club field trip to the art museum this Saturday - meet at the west entrance at 10 AM.",
      author: "Alex Chen (Photography Club)",
      timestamp: "2023-11-13T18:45:00Z"
    },
    {
      id: 4,
      message: "Reminder: All club advisors must complete the safety training module by November 20th.",
      author: "Campus Administration",
      timestamp: "2023-11-12T11:00:00Z"
    },
    {
      id: 5,
      message: "Debate team practice canceled this week due to the regional competition. Good luck team!",
      author: "Prof. Rodriguez (Debate Advisor)",
      timestamp: "2023-11-10T16:20:00Z"
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleNewAnnouncement = (newAnnouncement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setShowCreateForm(false); // Hide the form after submission
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
        {sortedAnnouncements.map(announcement => (
          <Announcement
            key={announcement.id}
            message={announcement.message}
            author={announcement.author}
          />
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
  }
};

export default NotificationsPage;
