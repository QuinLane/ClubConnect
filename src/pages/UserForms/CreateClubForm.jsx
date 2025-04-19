import { useState } from 'react';
const token = localStorage.getItem('token');

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID = storedUser.userID;   

export default function ClubForm({ onSubmit }) {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- submit as "ClubCreation" form ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      formType: 'ClubCreation',
      details: { clubName, description, category, meetingTime },
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
        throw new Error(err.error || 'Failed to submit club request');
      }

      if (onSubmit) {
        onSubmit(payload.details);   // parent closes modal & adds row
      } else {
        alert('Club creation request submitted!');
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
          Create a New Club
        </h2>
        <p style={{ color: '#6b7280' }}>
          Fill out the form to register your club.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field label="Club Name" value={clubName} onChange={setClubName} />
        <Field label="Description" value={description} onChange={setDescription} isTextarea />
        <Field label="Category" value={category} onChange={setCategory} isSelect />
        <Field label="Meeting Time" value={meetingTime} onChange={setMeetingTime} />

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
          {isLoading ? 'Submitting...' : 'Submit Club Request'}
        </button>
      </form>
    </div>
  );
}

/* ---------- reusable field ---------- */
function Field({ label, value, onChange, isTextarea = false, isSelect = false, type = 'text' }) {
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
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '0.25rem',
      }}>
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
