import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExploreComponent from '../components/clubEventPages/explore';
import EventPage from './EventPage';

const ExploreEvents = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // COMMON auth redirect
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // DETAIL view
  const [eventDetail, setEventDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null);
  const [isExec, setIsExec] = useState(false);

  // LIST view
  const [eventsList, setEventsList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorList, setErrorList] = useState(null);

  // Fetch single event
  useEffect(() => {
    if (!eventId) return;
    setLoadingDetail(true);
    fetch(`http://localhost:5050/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data;
      })
      .then(data => {
        // check exec rights
        const execs = data.club?.executives || [];
        setIsExec(execs.some(exec => exec.userID === JSON.parse(localStorage.getItem('user') || '{}').userID));
        // shape for EventPage
        setEventDetail({
          eventTitle: data.name,
          logoUrl: data.club?.logo || '/images/club-logo.png',
          eventPhoto: data.image || data.reservation?.imageUrl || '/images/event-photo.jpg',
          bioText: data.description || 'No description available',
          eventDate: data.reservation?.date
            ? new Date(data.reservation.date).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
            : 'Date not specified',
          eventTime: data.reservation
            ? `${data.reservation.startTime} - ${data.reservation.endTime}`
            : 'Time not specified',
          clubName: data.club?.clubName,
          approvalStatus: data.status || 'Approved',
          clubID: data.clubID,
          eventData: data,
        });
      })
      .catch(err => setErrorDetail(err.message))
      .finally(() => setLoadingDetail(false));
  }, [eventId, token]);

  // Fetch events list
  useEffect(() => {
    if (eventId) return;
    setLoadingList(true);
    fetch('http://localhost:5050/api/events', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(async res => {
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } 
        catch { throw new Error(`Non-JSON response: ${text}`); }
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data;
      })
      .then(list => {
        setEventsList(list.map(event => ({
          id: event.eventID,
          title: event.name,
          description: event.description,
          imageUrl: event.image,
          date: event.reservation?.date
            ? new Date(event.reservation.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })
            : 'Date not set',
          rawDate: event.reservation?.date,
          startTime: event.reservation?.startTime
            ? new Date(event.reservation.startTime).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
            : null,
          endTime: event.reservation?.endTime
            ? new Date(event.reservation.endTime).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
            : null,
          clubName: event.club?.clubName,
          clubLogo: event.club?.logo,
          club: event.club,
          reservation: event.reservation,
        })));
      })
      .catch(err => setErrorList(err.message))
      .finally(() => setLoadingList(false));
  }, [eventId, token]);

  // Handlers for detail actions
  const handleCancelEvent = async () => {
    try {
      const res = await fetch(`http://localhost:5050/api/events/${eventId}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to cancel event');
      }
      navigate('/explore', { state:{ message:'Event cancelled successfully' }});
    } catch (err) {
      setErrorDetail(err.message);
    }
  };

  const handleUpdateEvent = async (updated) => {
    try {
      const formData = new FormData();
      formData.append('name', updated.name);
      formData.append('description', updated.description);
      if (updated.imageFile) formData.append('image', updated.imageFile);

      const res = await fetch(`http://localhost:5050/api/events/${eventId}`, {
        method:'PUT', headers:{ Authorization:`Bearer ${token}` }, body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update event');
      // update state
      setEventDetail(prev => ({
        ...prev,
        eventTitle: data.name,
        bioText: data.description,
        eventPhoto: data.image || prev.eventPhoto,
        eventData: data,
      }));
      return { success:true, message:'Event updated successfully' };
    } catch (err) {
      return { success:false, message: err.message };
    }
  };

  // RENDER
  if (eventId) {
    if (loadingDetail) return <div>Loading event details...</div>;
    if (errorDetail) return <div>Error: {errorDetail}</div>;
    if (!eventDetail) return <div>Event not found</div>;
    return (
      <EventPage
        {...eventDetail}
        isExec={isExec}
        onCancelEvent={handleCancelEvent}
        onUpdateEvent={handleUpdateEvent}
      />
    );
  }

  // list
  if (loadingList) return <div>Loading events...</div>;
  if (errorList) return <div style={{ color:'red' }}>Error: {errorList}</div>;
  return (
    <div style={{ backgroundColor:'#f5f5f5', minHeight:'100vh', padding:'20px 0' }}>
      <ExploreComponent
        title="Explore Events"
        items={eventsList}
        type="event"
        onItemClick={id => navigate(`/app/events/${id}`)}
      />
    </div>
  );
};

export default ExploreEvents;
