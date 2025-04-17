import { useState } from 'react';

export default function CreateClubPage() {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
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
      // TODO: Redirect to club page or dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
            Create a New Club
          </h2>
          <p style={{ color: '#6b7280' }}>
            Fill out the form to register your club
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Club Name *
            </label>
            <input
              type="text"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              placeholder="Enter club name"
              required
              style={{
                width: '100%',
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your club"
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Select a category</option>
              <option value="academic">Academic</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="volunteer">Volunteer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Meeting Time
            </label>
            <input
              type="text"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              placeholder="e.g. Every Tuesday 4-5pm"
              style={{
                width: '100%',
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

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
        </form>
      </div>
    </div>
  );
}