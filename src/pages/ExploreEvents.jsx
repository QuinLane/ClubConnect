import React, { useState, useEffect } from 'react';
import ExploreComponent from '../components/clubEventPages/explore';

const EventsExplorePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5050/api/events/upcoming');
        const payload = await response.text();
        let data;
        try {
          data = JSON.parse(payload);
        } catch {
          throw new Error(`Non‑JSON response: ${payload}`);
        }
  
        if (!response.ok) {
          // your server is returning { error: "Failed to fetch upcoming events: …" }
          throw new Error(data.error || `HTTP ${response.status}`);
        }
  
        const items = data.map(event => ({
          imageUrl: event.reservation?.imageUrl || '../components/event.webp',
          title: event.name,
          date: new Date(event.reservation?.date).toLocaleDateString(),
          id: event.eventID,
        }));
        setEvents(items);
      } catch (err) {
        console.error('FetchEvents error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);
  

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events: {error}</div>;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px 0' }}>
      <ExploreComponent title="Explore Events" items={events} type="event" />
    </div>
  );
};

export default EventsExplorePage;
