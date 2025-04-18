import { useState } from 'react';

export default function ClubForm({ isReadOnly = false }) {
  const [clubName, setClubName] = useState('Chess Enthusiasts Club');
  const [description, setDescription] = useState('A club for chess lovers to meet, compete, and grow their strategy skills together.');
  const [category, setCategory] = useState('Academic');
  const [meetingTime, setMeetingTime] = useState('Fridays 3–5 PM');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/clubs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubName, description, category, meetingTime }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create club');
      }

      alert('Club created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecision = (decision) => {
    alert(`You chose to ${decision} this club request.`);
    // Replace with real API logic if needed
  };

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
            {isReadOnly ? 'Club Request Review' : 'Create a New Club'}
          </h2>
          <p style={{ color: '#6b7280' }}>
            {isReadOnly ? 'Review the details before approving or denying the request.' : 'Fill out the form to register your club'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Field label="Club Name" value={clubName} onChange={setClubName} readOnly={isReadOnly} />
          <Field label="Description" value={description} onChange={setDescription} readOnly={isReadOnly} isTextarea />
          <Field label="Category" value={category} onChange={setCategory} readOnly={isReadOnly} isSelect />
          <Field label="Meeting Time" value={meetingTime} onChange={setMeetingTime} readOnly={isReadOnly} />

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
                onClick={() => handleDecision('approve')}
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
                onClick={() => handleDecision('deny')}
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
              disabled={isLoading}
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
              {isLoading ? 'Creating Club...' : 'Create Club'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, readOnly, isTextarea, isSelect }) {
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
      ) : isSelect ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={{ ...commonStyle, cursor: 'pointer' }}
        >
          <option value="">Select a category</option>
          <option value="academic">Academic</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="arts">Arts</option>
          <option value="volunteer">Volunteer</option>
          <option value="other">Other</option>
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={commonStyle}
        />
      )}
    </div>
  );
}
