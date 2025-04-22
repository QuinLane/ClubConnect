import React, { useState, useEffect } from 'react';

const token      = localStorage.getItem('token');
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID     = storedUser.userID ?? null;

export default function DeleteClubForm({
  onSubmit,
  initialData = {},
  isReadOnly  = false,
}) {
  const [clubs,        setClubs]        = useState([]);   
  const [clubID,       setClubID]       = useState(initialData.clubID || '');
  const [confirmation, setConfirmation] = useState('');
  const [error,        setError]        = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(true);

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

        const list = data.map(rec => ({
          id:   rec.club.clubID,
          name: rec.club.clubName,
        }));
        setClubs(list);
        if (isReadOnly && initialData.clubID) {
          setClubID(initialData.clubID.toString());
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoadingClubs(false));
  }, [userID, isReadOnly, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userID) {
      return setError('User not found; please log in again.');
    }
    if (confirmation.toLowerCase() !== 'delete') {
      return setError('Please type "delete" to confirm.');
    }

    setIsLoading(true);
    setError('');

    const payload = {
      formType: 'DeleteClub',
      details:  { clubID: parseInt(clubID, 10) },
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
      if (onSubmit) onSubmit(payload.details);
      else alert('Club deletion request submitted!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p>‎</p>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1a1a1a',
          marginBottom: '0.5rem'
        }}>
          {isReadOnly ? 'Delete Club Request' : 'Delete Club'}
        </h2>
        <p style={{ color: '#6b7280' }}>
          {isReadOnly
            ? 'Details of your deletion request.'
            : 'This action cannot be undone. Please confirm below.'}
        </p>
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

        {!isReadOnly && (
          <Field
            label='Type "delete" to confirm'
            value={confirmation}
            onChange={setConfirmation}
            placeholder='delete'
          />
        )}

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

        {!isReadOnly && (
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
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  isSelect    = false,
  options     = [],
  isTextarea  = false,
  type        = 'text',
  placeholder = '',
  readOnly    = false,
  rows        = 4,
  loading     = false,
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
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
          {label}
        </label>
        {readOnly ? (
          <div style={style}>
            {options.find(o => o.id.toString() === value)?.name || ''}
          </div>
        ) : loading ? (
          <div style={{ ...style, color: '#6b7280' }}>Loading clubs…</div>
        ) : (
          <select value={value} onChange={e => onChange(e.target.value)} required style={{ ...style, cursor: 'pointer' }}>
            <option value="">Select a club</option>
            {options.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        )}
      </div>
    );
  }

  if (isTextarea) {
    return (
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
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
            style={{ ...style, minHeight: `${rows * 20}px` }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
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
