import React, { useState, useEffect } from 'react';
import ExploreComponent from '../components/clubEventPages/explore';

const ClubsExplorePage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://localhost:5050/api/clubs/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const items = data.map(club => ({
          imageUrl: '../components/event.webp',
          title: club.clubName,
          date: club.description || '',
          id: club.clubID,
        }));
        setClubs(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <div>Loading clubs...</div>;
  if (error) return <div>Error loading clubs: {error}</div>;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px 0' }}>
      <ExploreComponent title="Explore Clubs" items={clubs} type="club" />
    </div>
  );
};

export default ClubsExplorePage;
