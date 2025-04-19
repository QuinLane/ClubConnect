import React, { useState, useEffect } from 'react';
import CompressedEventCarousel from '../../components/clubEventPages/compressedEventCarosel';

const DashboardPage = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserID = user.userID;

  // State for RSVP'd events
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState(null);

  // State for member clubs
  const [memberClubs, setMemberClubs] = useState([]);
  const [loadingMemberClubs, setLoadingMemberClubs] = useState(false);
  const [errorMemberClubs, setErrorMemberClubs] = useState(null);

  // Static data for managed clubs (keeping as per your request)
  const managedClubs = [
    {
      imageUrl: 'https://example.com/club1.jpg',
      title: 'Computer Science Club',
      date: 'Managed since Jan 2023'
    },
    {
      imageUrl: 'https://example.com/club2.jpg',
      title: 'Debate Society',
      date: 'Managed since Mar 2023'
    },
    {
      imageUrl: 'https://example.com/club3.jpg',
      title: 'Photography Club',
      date: 'Managed since Sep 2022'
    },
    {
      imageUrl: 'https://example.com/club4.jpg',
      title: 'Entrepreneurship Club',
      date: 'Managed since Nov 2023'
    }
  ];

  // Fetch user's RSVP'd events
  useEffect(() => {
    const fetchUserRSVPs = async () => {
      try {
        setLoadingEvents(true);
        const response = await fetch(`http://localhost:5050/api/rsvps/user/${currentUserID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch RSVPs');
        }
        
        const rsvps = await response.json();
        
        // Transform RSVPs into event format for the carousel
        const events = rsvps.map(rsvp => {
          const eventDate = rsvp.event.reservation?.date 
            ? new Date(rsvp.event.reservation.date) 
            : null;
          
          return {
            id: rsvp.event.eventID,
            imageUrl: rsvp.event.image || '/images/default-event.jpg',
            title: rsvp.event.name,
            date: eventDate ? eventDate.toISOString() : 'Date TBD',
            formattedDate: eventDate 
              ? eventDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : 'Date TBD',
            clubName: rsvp.event.club?.clubName || 'Unknown Club'
          };
        });
        
        // Sort events by date (newest first)
        const sortedEvents = events.sort((a, b) => {
          if (a.date === 'Date TBD' && b.date === 'Date TBD') return 0;
          if (a.date === 'Date TBD') return 1; // Put TBD dates at the end
          if (b.date === 'Date TBD') return -1;
          return new Date(b.date) - new Date(a.date);
        });
        
        setMyEvents(sortedEvents);
      } catch (err) {
        console.error('Error fetching RSVPs:', err);
        setErrorEvents(err.message);
      } finally {
        setLoadingEvents(false);
      }
    };
    
    if (currentUserID) {
      fetchUserRSVPs();
    }
  }, [currentUserID, token]);

  // Fetch member clubs
  useEffect(() => {
    const fetchMemberClubs = async () => {
      try {
        setLoadingMemberClubs(true);
        const response = await fetch(`http://localhost:5050/api/clubs/user/${currentUserID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch member clubs');
        }
        
        const clubs = await response.json();
        
        // Transform clubs into format for the carousel
        const formattedClubs = clubs.map(club => {
          const joinDate = club.members?.find(m => m.userID === currentUserID)?.createdAt;
          const formattedDate = joinDate 
            ? new Date(joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
              })
            : 'Member since unknown date';
          
          return {
            id: club.clubID,
            imageUrl: club.image || '/images/default-club.png',
            title: club.clubName,
            date: `Member since ${formattedDate}`,
            type: 'club'
          };
        });
        
        setMemberClubs(formattedClubs);
      } catch (err) {
        console.error('Error fetching member clubs:', err);
        setErrorMemberClubs(err.message);
      } finally {
        setLoadingMemberClubs(false);
      }
    };
    
    if (currentUserID) {
      fetchMemberClubs();
    }
  }, [currentUserID, token]);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      minHeight: '100vh'
    }}>
      {/* Header with gray bar */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#005587',
          margin: 0,
          textAlign: 'center',
          fontSize: '2rem'
        }}>
          My Dashboard
        </h1>
      </div>

      {/* Clubs I Manage (Executive) - kept static as requested */}
      <CompressedEventCarousel
        events={managedClubs}
        title="Clubs I Manage"
        showTitle={true}
      />

      {/* Clubs I'm a Member Of - now dynamic */}
      {loadingMemberClubs ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading your clubs...</div>
      ) : errorMemberClubs ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          Error loading clubs: {errorMemberClubs}
        </div>
      ) : (
        <CompressedEventCarousel
          events={memberClubs}
          title="Clubs I'm a Member Of"
          showTitle={true}
        />
      )}

      {/* My Events (RSVP'd) */}
      {loadingEvents ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading your events...</div>
      ) : errorEvents ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          Error loading events: {errorEvents}
        </div>
      ) : (
        <CompressedEventCarousel
          events={myEvents}
          title="My Events"
          showTitle={true}
        />
      )}
    </div>
  );
};

export default DashboardPage;