import React, { useState, useEffect } from 'react';

const token      = localStorage.getItem('token');
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID     = storedUser.userID ?? null;

export default function EventRequestForm({
  onSubmit,
  initialData = {},
  isReadOnly  = false,
}) {
  // dynamic clubs fetch
  const [clubs,        setClubs]        = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  // new state for separate date/time and venueID
  const [eventDate,     setEventDate]     = useState(initialData.date      || '');
  const [startTime,     setStartTime]     = useState(initialData.startTime || '');
  const [endTime,       setEndTime]       = useState(initialData.endTime   || '');
  const [venueID,       setVenueID]       = useState(initialData.venueID  || '');

  const [clubName,      setClubName]      = useState(initialData.clubName    || '');
  const [eventName,     setEventName]     = useState(initialData.eventName   || '');
  const [eventType,     setEventType]     = useState(initialData.eventType   || '');
  const [eventDateTime, setEventDateTime] = useState(initialData.eventDateTime || '');
  const [venue,         setVenue]         = useState(initialData.venue       || '');
  const [description,   setDescription]   = useState(initialData.description || '');
  const [error,         setError]         = useState('');
  const [isLoading,     setIsLoading]     = useState(false);

  // fetch clubs the user is an exec of
  useEffect(() => {
    if (!userID) {
      setError('User not found; please log in again.');
      setLoadingClubs(false);
      return;
    }
    fetch(`http://localhost:5050/api/executives/user/${userID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load your clubs');
        return res.json();
      })
      .then(data => {
        const names = data.map(rec => rec.club.clubName);
        setClubs(names);
        if (isReadOnly && initialData.clubName) {
          setClubName(initialData.clubName);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoadingClubs(false));
  }, [userID, isReadOnly, initialData]);

  // preload other fields when reviewing
  useEffect(() => {
    if (isReadOnly && initialData) {
      setEventName(initialData.eventName      || '');
      setEventType(initialData.eventType      || '');
      setEventDateTime(initialData.eventDateTime || '');
      setVenue(initialData.venue             || '');
      setDescription(initialData.description   || '');

      // preload new fields
      setEventDate(initialData.date      || '');
      setStartTime(initialData.startTime || '');
      setEndTime(initialData.endTime   || '');
      setVenueID(initialData.venueID    || '');
    }
  }, [initialData, isReadOnly]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      formType: 'EventApproval',
      details: {
        // event controller requires these properties:
        name: eventName,
        description,
        // original fields
        clubName,
        eventType,
        eventDateTime,
        venue,
        // newly added required fields
        date: eventDate,
        startTime,
        endTime,
        venueID,
      },
    };

    try {
      const res = await fetch(`http://localhost:5050/api/forms/${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit event request');
      }
      if (onSubmit) onSubmit(payload.details);
      else alert('Event request submitted!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <p>‎</p>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1a1a1a',
          marginBottom: '0.5rem',
        }}>
          {isReadOnly ? 'Event Request Review' : 'Submit an Event Request'}
        </h2>
        <p style={{ color: '#6b7280' }}>
          {isReadOnly
            ? 'Review the event details below.'
            : 'Fill out the form to request your event.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {/* Club Name dropdown */}
        <Field
          label="Club Name"
          value={clubName}
          onChange={setClubName}
          isSelect
          options={clubs}
          loading={loadingClubs}
          readOnly={isReadOnly}
        />

        <Field
          label="Event Name"
          value={eventName}
          onChange={setEventName}
          readOnly={isReadOnly}
        />

        <Field
          label="Event Type"
          value={eventType}
          onChange={setEventType}
          isSelect
          options={['Social','Academic','Cultural','Sports','Fundraiser','Other']}
          readOnly={isReadOnly}
        />

        <Field
          label="Event Date & Time"
          value={eventDateTime}
          onChange={setEventDateTime}
          type="datetime-local"
          readOnly={isReadOnly}
        />

        <Field
          label="Venue"
          value={venue}
          onChange={setVenue}
          readOnly={isReadOnly}
        />

        {/* newly added date/time and venueID fields */}
        <Field
          label="Date"
          value={eventDate}
          onChange={setEventDate}
          type="date"
          readOnly={isReadOnly}
        />
        <Field
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
          type="time"
          readOnly={isReadOnly}
        />
        <Field
          label="End Time"
          value={endTime}
          onChange={setEndTime}
          type="time"
          readOnly={isReadOnly}
        />
        <Field
          label="Venue ID"
          value={venueID}
          onChange={setVenueID}
          type="text"
          readOnly={isReadOnly}
        />

        <Field
          label="Event Description"
          value={description}
          onChange={setDescription}
          isTextarea
          readOnly={isReadOnly}
        />

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            fontSize: '0.875rem',
            borderRadius: '0.375rem',
            border: '1px solid #fecaca',
          }}>
            {error}
          </div>
        )}

        {!isReadOnly && (
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              backgroundColor: isLoading ? '#9ca3af' : '#4f46e5',
              color: 'white',
              fontWeight: 500,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: '0.5rem',
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit Event Request'}
          </button>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  isTextarea = false,
  isSelect   = false,
  options    = [],
  type       = 'text',
  readOnly   = false,
  placeholder= '',
  rows       = 4,
  loading    = false,
}) {
  const style = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: readOnly ? '#f3f4f6' : 'white',
    outline: 'none',
    boxSizing: 'border-box',
    resize: isTextarea ? 'vertical' : 'none',
  };

  if (isSelect) {
    return (
      <div>
        <label style={{ display:'block', fontSize:'0.875rem', fontWeight:500, color:'#374151', marginBottom:'0.25rem' }}>
          {label}
        </label>
        {readOnly ? (
          <div style={style}>{value}</div>
        ) : loading ? (
          <div style={{ ...style, color:'#6b7280' }}>Loading…</div>
        ) : (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            required
            style={{ ...style, cursor:'pointer' }}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        )}
      </div>
    );
  }

  if (isTextarea) {
    return (
      <div>
        <label style={{ display:'block', fontSize:'0.875rem', fontWeight:500, color:'#374151', marginBottom:'0.25rem' }}>
          {label}
        </label>
        {readOnly ? (
          <div style={style}>{value}</div>
        ) : (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            required
            placeholder={placeholder}
            style={{ ...style, minHeight:`${rows*20}px` }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <label style={{ display:'block', fontSize:'0.875rem', fontWeight:500, color:'#374151', marginBottom:'0.25rem' }}>
        {label}
      </label>
      {readOnly ? (
        <div style={style}>{value}</div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required
          placeholder={placeholder}
          style={style}
        />
      )}
    </div>
  );
}
