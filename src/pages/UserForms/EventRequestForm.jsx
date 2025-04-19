import { useState } from 'react';
const token = localStorage.getItem('token');

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID = storedUser.userID;   

export default function EventRequestForm({ onSubmit }) {
  const [clubName, setClubName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- submit as EventApproval form ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      formType: 'EventApproval',
      details: {
        clubName,
        eventName,
        eventType,
        eventDateTime,
        venue,
        description,
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

      if (onSubmit) {
        onSubmit(payload.details);          // parent closes modal
      } else {
        alert('Event request submitted!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div>
      <p>‎ </p>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Submit an Event Request
        </h2>
        <p style={{ color: '#6b7280' }}>Fill out the form to request your event.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field label="Club Name" value={clubName} onChange={setClubName} />
        <Field label="Event Name" value={eventName} onChange={setEventName} />
        <Field
          label="Event Type"
          value={eventType}
          onChange={setEventType}
          isSelect
          options={['Social', 'Academic', 'Cultural', 'Sports', 'Fundraiser', 'Other']}
        />
        <Field
          label="Event Date & Time"
          value={eventDateTime}
          onChange={setEventDateTime}
          type="datetime-local"
        />
        <Field label="Venue" value={venue} onChange={setVenue} />
        <Field
          label="Event Description"
          value={description}
          onChange={setDescription}
          isTextarea
        />

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

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
      </form>
    </div>
  );
}

/* ---------- reusable field component ---------- */
function Field({
  label,
  value,
  onChange,
  isTextarea = false,
  isSelect = false,
  options = [],
  type = 'text',
}) {
  const commonStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    resize: isTextarea ? 'vertical' : 'none',
  };

  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </label>

      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          required
          style={{ ...commonStyle, minHeight: '100px' }}
        />
      ) : isSelect ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={{ ...commonStyle, cursor: 'pointer' }}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
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
