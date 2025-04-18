import React from 'react';
import CompressedEventCarousel from '../components/clubEventPages/compressedEventCarosel';

const DashboardPage = () => {
  // Sample data - replace with your actual data
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

  const memberClubs = [
    {
      imageUrl: 'https://example.com/club5.jpg',
      title: 'Chess Club',
      date: 'Member since Feb 2023'
    },
    {
      imageUrl: 'https://example.com/club6.jpg',
      title: 'Music Society',
      date: 'Member since Aug 2022'
    },
    {
      imageUrl: 'https://example.com/club7.jpg',
      title: 'Robotics Club',
      date: 'Member since Oct 2023'
    }
  ];

  const myEvents = [
    {
      imageUrl: 'https://example.com/event1.jpg',
      title: 'Tech Conference 2023',
      date: 'Dec 15, 2023'
    },
    {
      imageUrl: 'https://example.com/event2.jpg',
      title: 'Hackathon Finals',
      date: 'Jan 20, 2024'
    },
    {
      imageUrl: 'https://example.com/event3.jpg',
      title: 'Alumni Networking',
      date: 'Feb 5, 2024'
    },
    {
      imageUrl: 'https://example.com/event4.jpg',
      title: 'Career Fair',
      date: 'Mar 10, 2024'
    },
    {
      imageUrl: 'https://example.com/event5.jpg',
      title: 'Workshop: Public Speaking',
      date: 'Apr 2, 2024'
    }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header with gray bar */}
      <div style={{
        backgroundColor: '#f5f5f5', // Light gray background
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

      {/* Clubs I Manage (Executive) */}
      <CompressedEventCarousel
        events={managedClubs}
        title="Clubs I Manage"
        showTitle={true}
      />

      {/* Clubs I'm a Member Of */}
      <CompressedEventCarousel
        events={memberClubs}
        title="Clubs I'm a Member Of"
        showTitle={true}
      />

      {/* My Events (RSVP'd) */}
      <CompressedEventCarousel
        events={myEvents}
        title="My Events"
        showTitle={true}
      />
    </div>
  );
};

export default DashboardPage;