import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Logo from '../components/clubEventPages/logo';
import Bio from '../components/clubEventPages/bio';

const EventPage = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserID = storedUser.userID;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExec, setIsExec] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/events/${eventID}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

        // determine if user is club exec
        const execs = data.club?.executives || [];
        setIsExec(execs.some(e => e.userID === currentUserID));

        // shape date/time
        const eventDate = data.reservation?.date
          ? new Date(data.reservation.date).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })
          : 'Date TBD';
        const eventTime = data.reservation
          ? `${data.reservation.startTime} - ${data.reservation.endTime}`
          : 'Time TBD';

        setEvent({
          eventTitle: data.name,
          logoUrl: data.club?.logo || '/images/default-club.png',
          eventPhoto: data.image || '/images/default-event.jpg',
          bioText: data.description || 'No description available.',
          eventDate,
          eventTime,
          approvalStatus: data.status || 'Pending',
          clubID: data.clubID
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventID, token, navigate, currentUserID]);

  const handleRSVPClick = () => {
    // implement RSVP logic here
  };

  const handleCancelEvent = () => {
    if (!window.confirm('Cancel this event?')) return;
    fetch(`http://localhost:5050/api/events/${eventID}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to cancel event');
        navigate('/app/explore-events');
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <div>Loading event...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  const { eventTitle, logoUrl, eventPhoto, bioText, eventDate, eventTime, approvalStatus, clubID } = event;

  return (
    <div style={{
      display: 'grid', placeItems: 'center', minHeight: '100vh', width: '100vw',
      padding: '20px', backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '900px', width: '100%', padding: '40px', backgroundColor: '#fff',
        borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', margin: 0, flex: 1, color: '#2c3e50', lineHeight: '1.2' }}>{eventTitle}</h1>
          <Logo imageUrl={logoUrl} size={80} />
        </div>

        {/* Bio & Photo */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <Bio text={bioText} width="400px" height="400px" />
          <div style={{ width: '400px', height: '400px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={eventPhoto} alt={eventTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Date/Time & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2c3e50' }}>{eventDate}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#4a5568' }}>{eventTime}</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleRSVPClick} style={buttonStyle(isExec ? '#388e3c' : '#005587')}>{isExec ? 'Admin View' : 'RSVP Now'}</button>
            <button onClick={() => navigate(`/app/club/${clubID}`)} style={buttonStyle('#f57c00')}>View Club</button>
          </div>
        </div>

        {/* Exec Controls */}
        {isExec && (
          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '6px', border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Status: <strong style={{ color: approvalStatus === 'Approved' ? '#388e3c' : '#e74c3c' }}>{approvalStatus}</strong></span>
            <button onClick={handleCancelEvent} style={buttonStyle('#e74c3c')}>Cancel Event</button>
          </div>
        )}
      </div>
    </div>
  );
};

const buttonStyle = (bg) => ({
  padding: '12px 24px', backgroundColor: bg, color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s'
});

export default EventPage;