import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExploreComponent from '../components/clubEventPages/explore';

const EventsExplorePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const response = await fetch('http://localhost:5050/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const payload = await response.text();
        let data;
        try {
          data = JSON.parse(payload);
        } catch {
          throw new Error(`Non-JSON response: ${payload}`);
        }
  
        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }
  
        const items = data.map(event => {
          // Format the date for display
          const formattedDate = event.reservation?.date 
            ? new Date(event.reservation.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })
            : 'Date not set';

          return {
            id: event.eventID,
            title: event.name,
            description: event.description,
            imageUrl: event.image,
            date: formattedDate, // Formatted display date
            rawDate: event.reservation?.date, // Keep original for sorting/filtering
            startTime: event.reservation?.startTime 
              ? new Date(event.reservation.startTime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : null,
            endTime: event.reservation?.endTime 
              ? new Date(event.reservation.endTime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : null,
            clubName: event.club?.name,
            clubLogo: event.club?.logo,
            club: event.club,
            reservation: event.reservation
          };
        });
        
        setEvents(items);
      } catch (err) {
        console.error('FetchEvents error:', err);
        setError(err.message);
        if (err.message.includes('Authentication')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, [navigate]);

  const handleEventClick = (eventId) => {
    const event = events.find(e => e.id === eventId);
    navigate(`/app/events/${eventId}`, {
      state: {
        eventData: event
      }
    });
  };

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Loading events...</div>
    </div>
  );

  if (error) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: 'red'
    }}>
      Error loading events: {error}
    </div>
  );

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
        onItemClick={handleEventClick}
      />
    </div>
  );
};

export default EventsExplorePage;