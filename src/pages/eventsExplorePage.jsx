import React from 'react';
import ExploreComponent from '../components/clubEventPages/explore';

const EventsExplorePage = () => {
  // Sample events data - replace with your actual data source
  const events = [
    {
      imageUrl: 'https://example.com/tech-conference.jpg',
      title: 'Tech Conference 2023',
      date: 'December 15, 2023'
    },
    {
      imageUrl: 'https://example.com/hackathon.jpg',
      title: 'Annual Hackathon',
      date: 'January 20-22, 2024'
    },
    {
      imageUrl: 'https://example.com/career-fair.jpg',
      title: 'Spring Career Fair',
      date: 'March 10, 2024'
    },
    {
      imageUrl: 'https://example.com/alumni-networking.jpg',
      title: 'Alumni Networking Night',
      date: 'February 5, 2024'
    },
    {
      imageUrl: 'https://example.com/workshop.jpg',
      title: 'Web Development Workshop',
      date: 'November 30, 2023'
    },
    {
      imageUrl: 'https://example.com/science-fair.jpg',
      title: 'Science Research Fair',
      date: 'April 15, 2024'
    },
    {
      imageUrl: 'https://example.com/art-exhibit.jpg',
      title: 'Student Art Exhibit',
      date: 'December 1-15, 2023'
    },
    {
      imageUrl: 'https://example.com/music-festival.jpg',
      title: 'Campus Music Festival',
      date: 'May 5-7, 2024'
    },
        {
          imageUrl: 'https://example.com/tech-conference.jpg',
          title: 'Tech Conference 2023',
          date: 'December 15, 2023'
        },
        {
          imageUrl: 'https://example.com/hackathon.jpg',
          title: 'Annual Hackathon',
          date: 'January 20-22, 2024'
        },
        {
          imageUrl: 'https://example.com/career-fair.jpg',
          title: 'Spring Career Fair',
          date: 'March 10, 2024'
        },
        {
          imageUrl: 'https://example.com/alumni-networking.jpg',
          title: 'Alumni Networking Night',
          date: 'February 5, 2024'
        },
        {
          imageUrl: 'https://example.com/workshop.jpg',
          title: 'Web Development Workshop',
          date: 'November 30, 2023'
        },
        {
          imageUrl: 'https://example.com/science-fair.jpg',
          title: 'Science Research Fair',
          date: 'April 15, 2024'
        },
        {
          imageUrl: 'https://example.com/art-exhibit.jpg',
          title: 'Student Art Exhibit',
          date: 'December 1-15, 2023'
        },
        {
          imageUrl: 'https://example.com/music-festival.jpg',
          title: 'Campus Music Festival',
          date: 'May 5-7, 2024'
        }
  ];

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <ExploreComponent
        title="Explore Events"
        items={events}
        type="event"
      />
    </div>
  );
};

export default EventsExplorePage;