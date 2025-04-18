import React from 'react';
import ExploreComponent from '../components/clubEventPages/explore';

const ClubsExplorePage = () => {
  // Sample clubs data - replace with your actual data source
  const clubs = [
    {
      imageUrl: 'https://example.com/cs-club.jpg',
      title: 'Computer Science Club',
      date: 'Meets every Wednesday'
    },
    {
      imageUrl: 'https://example.com/debate-club.jpg',
      title: 'Debate Society',
      date: 'Meets every Tuesday'
    },
    {
      imageUrl: 'https://example.com/photography-club.jpg',
      title: 'Photography Club',
      date: 'Meets every Friday'
    },
    {
      imageUrl: 'https://example.com/entrepreneurship-club.jpg',
      title: 'Entrepreneurship Club',
      date: 'Meets every Monday'
    },
    {
      imageUrl: 'https://example.com/chess-club.jpg',
      title: 'Chess Club',
      date: 'Meets every Thursday'
    },
    {
      imageUrl: 'https://example.com/music-club.jpg',
      title: 'Music Society',
      date: 'Meets every Wednesday'
    },
    {
      imageUrl: 'https://example.com/robotics-club.jpg',
      title: 'Robotics Club',
      date: 'Meets every Saturday'
    },
    {
      imageUrl: 'https://example.com/art-club.jpg',
      title: 'Art Collective',
      date: 'Meets every Sunday'
    },
    {
      imageUrl: 'https://example.com/ai-club.jpg',
      title: 'AI & Machine Learning Club',
      date: 'Meets bi-weekly'
    },
    {
      imageUrl: 'https://example.com/business-club.jpg',
      title: 'Business Association',
      date: 'Meets every Tuesday'
    },
    {
      imageUrl: 'https://example.com/literature-club.jpg',
      title: 'Literature Society',
      date: 'Meets every Friday'
    },
    {
      imageUrl: 'https://example.com/engineering-club.jpg',
      title: 'Engineering Club',
      date: 'Meets every Thursday'
    },
    {
      imageUrl: 'https://example.com/dance-club.jpg',
      title: 'Dance Troupe',
      date: 'Meets every Monday'
    },
    {
      imageUrl: 'https://example.com/theater-club.jpg',
      title: 'Drama Society',
      date: 'Meets every Wednesday'
    },
    {
      imageUrl: 'https://example.com/volunteer-club.jpg',
      title: 'Volunteer Network',
      date: 'Meets monthly'
    },
    {
      imageUrl: 'https://example.com/language-club.jpg',
      title: 'Language Exchange',
      date: 'Meets every Friday'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <ExploreComponent
        title="Explore Clubs"
        items={clubs}
        type="club"
      />
    </div>
  );
};

export default ClubsExplorePage;