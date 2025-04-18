import { useState, useEffect } from 'react';

export default function EventRequestForm({ isReadOnly = true }) {
  const [clubName, setClubName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Social');
  const [eventDateTime, setEventDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [availableVenues, setAvailableVenues] = useState([]);
  const [isOffCampus, setIsOffCampus] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');

  // Mock function to fetch available venues based on date/time
  const fetchAvailableVenues = async (dateTime) => {
    // In a real app, this would be an API call
    return [
      { id: '1', name: 'Student Union Ballroom', capacity: 200 },
      { id: '2', name: 'Library Auditorium', capacity: 150 },
      { id: '3', name: 'Campus Quad', capacity: 500 },
      { id: '4', name: 'Science Building Room 101', capacity: 50 },
    ];
  };

  useEffect(() => {
    if (eventDateTime && !isOffCampus) {
      fetchAvailableVenues(eventDateTime).then(venues => {
        setAvailableVenues(venues);
        if (venues.length > 0) {
          setVenue(venues[0].id);
        }
      });
    } else {
      setAvailableVenues([]);
    }
  }, [eventDateTime, isOffCampus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response
      setRequestStatus('Pending Approval');
      
    } catch (err) {
      setError(err.message || 'Failed to submit event request');
    } finally {
      setIsLoading(false);
    }
  };

  if (requestStatus) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '1rem'
          }}>
            Event Request Status
          </h2>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem',
            fontWeight: '500'
          }}>
            Status: {requestStatus}
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Your event request has been submitted successfully. You'll be notified when it's reviewed.
          </p>
          <button
            onClick={() => setRequestStatus('')}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Submit Another Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '0.5rem'
          }}>
            {isReadOnly ? 'Event Request Review' : 'Submit an Event Request'}
          </h2>
          <p style={{ color: '#6b7280' }}>
            {isReadOnly ? 'Review the event details before approving or denying.' : 'Fill out the form to request your event'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Field label="Club Name" value={clubName} onChange={setClubName} readOnly={isReadOnly} />
          <Field label="Event Name" value={eventName} onChange={setEventName} readOnly={isReadOnly} />
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              disabled={isReadOnly}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                backgroundColor: isReadOnly ? '#f3f4f6' : 'white',
                outline: 'none',
                cursor: isReadOnly ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="Social">Social</option>
              <option value="Academic">Academic</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Fundraiser">Fundraiser</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <Field 
            label="Event Date and Time" 
            value={eventDateTime} 
            onChange={setEventDateTime} 
            readOnly={isReadOnly} 
            type="datetime-local"
          />
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              Venue
            </label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                id="offCampus"
                checked={isOffCampus}
                onChange={(e) => setIsOffCampus(e.target.checked)}
                disabled={isReadOnly}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="offCampus" style={{ fontSize: '0.875rem', color: '#374151' }}>
                Off-Campus Event
              </label>
            </div>
            
            {isOffCampus ? (
              <>
                <Field 
                  label="Venue Name" 
                  value={venueName} 
                  onChange={setVenueName} 
                  readOnly={isReadOnly}
                />
                <Field 
                  label="Venue Capacity" 
                  value={venueCapacity} 
                  onChange={setVenueCapacity} 
                  readOnly={isReadOnly}
                  type="number"
                />
              </>
            ) : (
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                disabled={isReadOnly || !eventDateTime}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: isReadOnly ? '#f3f4f6' : 'white',
                  outline: 'none',
                  cursor: isReadOnly ? 'not-allowed' : 'pointer'
                }}
              >
                {availableVenues.length > 0 ? (
                  availableVenues.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} (Capacity: {v.capacity})
                    </option>
                  ))
                ) : (
                  <option value="">{eventDateTime ? 'No venues available' : 'Select date/time first'}</option>
                )}
              </select>
            )}
          </div>
          
          <Field 
            label="Event Description" 
            value={eventDescription} 
            onChange={setEventDescription} 
            readOnly={isReadOnly} 
            isTextarea 
          />

          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          {isReadOnly ? (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1.5rem'
            }}>
              <button
                type="button"
                onClick={() => alert('Approved!')}
                style={{
                  flex: 1,
                  marginRight: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => alert('Denied!')}
                style={{
                  flex: 1,
                  marginLeft: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Deny
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isLoading || (!isOffCampus && (!eventDateTime || !venue))}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                backgroundColor: isLoading ? '#9ca3af' : '#4f46e5',
                color: 'white',
                fontWeight: '500',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '0.5rem'
              }}
            >
              {isLoading ? 'Submitting...' : 'Submit Event Request'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, readOnly, isTextarea, type = 'text' }) {
  const commonStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: readOnly ? '#f3f4f6' : 'white',
    outline: 'none',
    boxSizing: 'border-box',
    resize: isTextarea ? 'vertical' : 'none',
  };

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.25rem'
      }}>
        {label}
      </label>
      {readOnly ? (
        <div style={commonStyle}>
          {value}
        </div>
      ) : isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          required
          style={{ ...commonStyle, minHeight: '100px' }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={commonStyle}
        />
      )}
    </div>
  );
}