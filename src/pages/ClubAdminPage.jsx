import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/clubEventPages/logo';
import Bio from '../components/clubEventPages/bio';
import CompressedEventCarousel from '../components/clubEventPages/compressedEventCarosel';
import Contact from '../components/clubEventPages/contactBox';

const AdminClubPage = ({
  clubName = "Kya Slay Club",
  logoUrl = "/images/club-logo.png",
  bioText = "This club is super fun fun fun...",
  memberCount = 42,
  logoSize = 80,
  titleSize = '2rem',
  clubEmail = "club@su.edu"
}) => {
  const navigate = useNavigate();

  const handleDeleteClub = () => {
    if (window.confirm(`Are you sure you want to delete ${clubName}? This action cannot be undone.`)) {
     
      alert(`${clubName} has been deleted`);
  
    }
  };

  const handleMessageClub = () => {

    const existingChat = checkForExistingChat(clubEmail);
    
    if (existingChat) {

      navigate('../chatBoard', { state: { presetEmail: clubEmail, autoOpen: true } });
    } else {

      navigate('../chatBoard', { state: { presetEmail: clubEmail } });
    }
  };


  const checkForExistingChat = (email) => {

    return false; 
  };

  const upcomingEvents = [
    { imageUrl: "/images/event1.jpg", title: "Monthly Meetup", date: "June 15, 2023" },
    { imageUrl: "/images/event2.jpg", title: "Workshop Series", date: "June 22, 2023" },
  ];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        {/* Title and Logo Row */}
        <div style={styles.headerRow}>
          <h1 style={styles.title}>
            {clubName} (Admin View)
          </h1>
          <div style={styles.logoContainer}>
            <Logo imageUrl={logoUrl} size={logoSize} />
          </div>
        </div>

        {/* Bio and Contact Section */}
        <div style={styles.infoSection}>
          <div style={styles.bioContainer}>
            <Bio text={bioText} width="100%" height="100%" />
          </div>
          <div style={styles.contactContainer}>
            <Contact 
              email={clubEmail} 
              instagram="@clubhandle"
              website="https://www.clubwebsite.com"
            />
          </div>
        </div>

        {/* Member Count and Admin Buttons */}
        <div style={styles.memberSection}>
          <div style={styles.memberCount}>
            Number of members: {memberCount}
          </div>
          <button
            onClick={handleMessageClub}
            style={styles.messageButton}
          >
            Message Club
          </button>
        </div>

        {/* Events Carousel */}
        <div style={styles.eventsSection}>
          <CompressedEventCarousel
            events={upcomingEvents}
            title="Upcoming Events"
            carouselHeight="240px"
          />
        </div>

        {/* Delete Club Button */}
        <div style={styles.deleteSection}>
          <button
            onClick={handleDeleteClub}
            style={styles.deleteButton}
          >
            Delete Club
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  pageContainer: {
    display: 'grid',
    placeItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '20px',
    boxSizing: 'border-box',
    margin: 0,
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {
    maxWidth: '900px',
    width: '100%',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    fontSize: '2rem',
    margin: 0,
    flex: 1,
    minWidth: 'min(300px, 100%)',
    color: '#2c3e50',
    lineHeight: '1.2'
  },
  logoContainer: {
    marginLeft: '20px',
    flexShrink: 0
  },
  infoSection: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  bioContainer: {
    flex: 2,
    minWidth: 'min(300px, 100%)',
    height: '200px'
  },
  contactContainer: {
    flex: 1,
    minWidth: 'min(200px, 100%)',
    height: '200px'
  },
  memberSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '40px',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px'
  },
  memberCount: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '8px',
    flex: 1
  },
  messageButton: {
    padding: '12px 24px',
    backgroundColor: '#005587',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#003d66'
    }
  },
  eventsSection: {
    marginTop: '60px',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '40px'
  },
  deleteSection: {
    marginTop: '60px',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '40px',
    textAlign: 'center'
  },
  deleteButton: {
    padding: '12px 24px',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#b71c1c'
    }
  }
};

export default AdminClubPage;