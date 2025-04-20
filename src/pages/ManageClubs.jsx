import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageClubs() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all clubs
  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch('http://localhost:5050/api/clubs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setClubs(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, [token]);

  const handleDelete = async (clubID) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    setDeletingId(clubID);
    try {
      const res = await fetch(`http://localhost:5050/api/clubs/${clubID}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Failed to delete club ${clubID}`);
      }
      setClubs(prev => prev.filter(c => c.clubID !== clubID));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter clubs by search term
  const displayedClubs = clubs.filter(club =>
    club.clubName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading clubs...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Manage Clubs</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search clubs..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '8px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      {displayedClubs.length === 0 ? (
        <div>No clubs {searchTerm ? 'match your search.' : 'found.'}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedClubs.map(club => (
              <tr key={club.clubID}>
                <td style={tdStyle}>{club.clubID}</td>
                <td style={tdStyle}>{club.clubName}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(club.clubID)}
                    disabled={deletingId === club.clubID}
                    style={buttonStyle(deletingId === club.clubID)}
                  >
                    {deletingId === club.clubID ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  borderBottom: '2px solid #ccc',
  textAlign: 'left',
  padding: '8px',
  backgroundColor: '#f5f5f5',
};

const tdStyle = {
  borderBottom: '1px solid #eee',
  padding: '8px',
};

const buttonStyle = (disabled) => ({
  padding: '6px 12px',
  color: 'white',
  backgroundColor: disabled ? '#999' : '#e53e3e',
  border: 'none',
  borderRadius: '4px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'background-color 0.2s',
});
