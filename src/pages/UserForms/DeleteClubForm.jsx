import { useState } from 'react';

const token = localStorage.getItem('token');
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID = storedUser.userID ?? null;   // e.g. 42

export default function DeleteClubForm({ onSubmit, clubID = '' }) {
  const [clubId, setClubId]   = useState(clubID);
  const [confirmation, setConfirmation] = useState('');
  const [error, setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- submit as DeleteClub form ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userID) return setError('User ID not found; please log in again.');

    if (confirmation.toLowerCase() !== 'delete') {
      return setError('Please type "delete" to confirm.');
    }

    setIsLoading(true);
    setError('');

    const payload = {
      formType: 'DeleteClub',
      details: { clubId },
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
        throw new Error(err.error || 'Failed to submit delete request');
      }

      onSubmit ? onSubmit(payload.details)
               : alert('Club deletion request submitted!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- UI (unchanged style) ---------- */
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <p>‎ </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Delete Club
        </h2>
        <p style={{ color: '#6b7280' }}>
          This action cannot be undone. Please confirm below.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field
          label="Club ID *"
          value={clubId}
          onChange={setClubId}
          placeholder="Enter club ID to delete"
        />

        <Field
          label='Type "delete" to confirm *'
          value={confirmation}
          onChange={setConfirmation}
          placeholder='Type "delete" to confirm'
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

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            backgroundColor: isLoading ? '#9ca3af' : '#dc2626',
            color: 'white',
            fontWeight: 500,
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginTop: '0.5rem',
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit Delete Request'}
        </button>
      </form>
    </div>
  );
}

/* ---------- small Field helper ---------- */
function Field({ label, value, onChange, placeholder = '' }) {
  const style = {
    width: '100%',
    backgroundColor: 'white',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        style={style}
      />
    </div>
  );
}
