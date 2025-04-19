import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventPage from './eventPage';

const EventPageWrapper = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExec, setIsExec] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const eventData = await response.json();

        // Check if current user is an executive
        try {
          const userResponse = await fetch(`http://localhost:5000/api/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            const isClubAdmin = eventData.club?.executives?.some(
              exec => exec.userID === userData.userID
            );
            setIsExec(isClubAdmin || false);
          }
        } catch (err) {
          console.error('Failed to check admin status:', err);
          setIsExec(false);
        }

        setEvent({
          eventTitle: eventData.name,
          logoUrl: eventData.club?.logo || '/images/club-logo.png',
          eventPhoto: eventData.image || eventData.reservation?.imageUrl || '/images/event-photo.jpg',
          bioText: eventData.description || 'No description available',
          eventDate: new Date(eventData.reservation?.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          eventTime: eventData.reservation ? 
            `${eventData.reservation.startTime} - ${eventData.reservation.endTime}` : 
            'Time not specified',
          clubName: eventData.club?.name,
          approvalStatus: eventData.status || "Approved",
          clubID: eventData.clubID,
          eventData: eventData // Pass the full event data for editing
        });
      } catch (err) {
        console.error('FetchEvent error:', err);
        setError(err.message);
        if (err.message.includes('Authentication')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleCancelEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel event');
      }
      
      navigate('/explore', { state: { message: 'Event cancelled successfully' } });
    } catch (err) {
      console.error('Cancel event error:', err);
      setError('Failed to cancel event: ' + err.message);
    }
  };

  const handleUpdateEvent = async (updatedEvent) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('name', updatedEvent.name);
      formData.append('description', updatedEvent.description);
      
      if (updatedEvent.imageFile) {
        formData.append('image', updatedEvent.imageFile);
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      const eventData = await response.json();
      setEvent(prev => ({
        ...prev,
        eventTitle: eventData.name,
        bioText: eventData.description,
        eventPhoto: eventData.image || prev.eventPhoto,
        eventData: eventData
      }));

      return { success: true, message: 'Event updated successfully' };
    } catch (err) {
      console.error('Update event error:', err);
      return { success: false, message: err.message };
    }
  };

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>Error loading event: {error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <EventPage 
      {...event}
      isExec={isExec}
      onCancelEvent={handleCancelEvent}
      onUpdateEvent={handleUpdateEvent}
    />
  );
};

export default EventPageWrapper;