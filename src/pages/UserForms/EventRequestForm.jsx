import React, { useState, useEffect } from 'react';

const token = localStorage.getItem('token');
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID = storedUser.userID ?? null;

export default function EventRequestForm({
  onSubmit,
  initialData = {},
  isReadOnly = false,
}) {
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [filteredVenues, setFilteredVenues] = useState([]);

  const [date, setDate] = useState(initialData.date || '');
  const [startTime, setStartTime] = useState(initialData.startTime || '');
  const [endTime, setEndTime] = useState(initialData.endTime || '');
  const [venueID, setVenueID] = useState(initialData.venueID || '');

  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [clubID, setClubID] = useState(initialData.clubID || '');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minDate, setMinDate] = useState('');


  useEffect(() => {
    const t = new Date();
    t.setDate(t.getDate());
    setMinDate(t.toISOString().split('T')[0]);
  }, []);

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
        const clubOpts = data.map(rec => ({
          value: rec.club.clubID,
          label: rec.club.clubName,
        }));
        setClubs(clubOpts);
        if (isReadOnly && initialData.clubID) {
          setClubID(initialData.clubID);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoadingClubs(false));
  }, [userID, isReadOnly, initialData]);


  useEffect(() => {
    fetch('http://localhost:5050/api/venues', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load venues');
        return res.json();
      })
      .then(data => setVenues(data))
      .catch(err => setError(err.message))
      .finally(() => setLoadingVenues(false));
  }, []);


  useEffect(() => {
    if (date && startTime && endTime && venues.length) {
      const selStart = new Date(`${date}T${startTime}`);
      const selEnd = new Date(`${date}T${endTime}`);
      const available = venues.filter(v => {
        return !v.reservations.some(r => {
          const rStart = new Date(r.start);
          const rEnd = new Date(r.endTime);
          return selStart < rEnd && selEnd > rStart;
        });
      });
      setFilteredVenues(available);
    } else {
      setFilteredVenues([]);
      setVenueID('');
    }
  }, [date, startTime, endTime, venues]);

  useEffect(() => {
    if (isReadOnly && initialData) {
      setDate(initialData.date || '');
      setStartTime(initialData.startTime || '');
      setEndTime(initialData.endTime || '');
      setVenueID(initialData.venueID || '');
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setClubID(initialData.clubID || '');
    }
  }, [initialData, isReadOnly]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!date || !startTime || !endTime) {
      setError('Please select date, start, and end time.');
      return;
    }
    if (endTime <= startTime) {
      setError('End time must be later than start time.');
      return;
    }

    setIsLoading(true);
    const payload = {
      formType: 'EventApproval',
      details: {
        name,
        description,
        clubID: parseInt(clubID, 10),
        date,
        startTime,
        endTime,
        venueID: parseInt(venueID, 10),
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
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1a1a1a',
          marginBottom: '0.5rem',
        }}>
          {isReadOnly ? 'Event Request Review' : 'Submit an Event Request'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field
          label="Club"
          value={clubID}
          onChange={setClubID}
          isSelect
          options={clubs}
          loading={loadingClubs}
          readOnly={isReadOnly}
        />

        <Field
          label="Event Name"
          value={name}
          onChange={setName}
          readOnly={isReadOnly}
        />

        <Field
          label="Description"
          value={description}
          onChange={setDescription}
          isTextarea
          readOnly={isReadOnly}
        />

        <Field
          label="Date"
          value={date}
          onChange={setDate}
          type="date"
          readOnly={isReadOnly}
          min={minDate}
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
          min={startTime}
        />

        <Field
          label="Venue"
          value={venueID}
          onChange={setVenueID}
          isSelect
          options={filteredVenues.map(v => ({ value: v.venueID, label: v.name }))}
          loading={loadingVenues}
          readOnly={isReadOnly}
          disabled={!(date && startTime && endTime)}
        />

        {error && <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '0.375rem' }}>{error}</div>}

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
  isSelect = false,
  options = [],
  type = 'text',
  readOnly = false,
  placeholder = '',
  rows = 4,
  loading = false,
  disabled = false,
  min,
}) {
  const style = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: readOnly ? '#f3f4f6' : 'white',
    boxSizing: 'border-box',
    resize: isTextarea ? 'vertical' : 'none',
  };

  if (isSelect) {
    return (
      <div>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>{label}</label>
        {readOnly ? (
          <div style={style}>{options.find(o => o.value === value)?.label || value}</div>
        ) : loading ? (
          <div style={{ ...style, color: '#6b7280' }}>Loading…</div>
        ) : (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            style={{ ...style, cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>
    );
  }

  if (isTextarea) {
    return (
      <div>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>{label}</label>
        {readOnly ? (
          <div style={style}>{value}</div>
        ) : (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            style={{ ...style, minHeight: `${rows * 20}px` }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>{label}</label>
      {readOnly ? (
        <div style={style}>{value}</div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          style={style}
        />
      )}
    </div>
  );
}
