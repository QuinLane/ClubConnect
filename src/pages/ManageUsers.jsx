import React, { useState, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

export default function ManageUsers() {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserID = storedUser.userID;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.menu-container')) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:5050/api/users/getall', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (user) => {
    const endpoint = user.userType === 'Student'
      ? `/api/users/${user.userID}/make-admin`
      : `/api/users/${user.userID}/make-student`;
    try {
      const res = await fetch(`http://localhost:5050${endpoint}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update role');
      }
      const result = await res.json();
      setUsers(prev => prev.map(u =>
        u.userID === user.userID ? result.user : u
      ));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setMenuOpenId(null);
    }
  };

  const displayedUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Manage Users</h1>

      <input
        type="text"
        placeholder="Search by username..."
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

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>UserID</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>User Type</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map(user => (
            <tr key={user.userID}>
              <td style={tdStyle}>{user.userID}</td>
              <td style={tdStyle}>{user.username}</td>
              <td style={tdStyle}>{user.userType}</td>
              <td style={tdStyle}>
                {user.userID !== currentUserID && (
                  <div className="menu-container" style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === user.userID ? null : user.userID)}
                      style={iconButtonStyle}
                    >
                      <FaEllipsisV />
                    </button>
                    {menuOpenId === user.userID && (
                      <div style={menuStyle}>
                        <button
                          onClick={() => {
                            const action = user.userType === 'Student'
                              ? 'promote this user to SUAdmin'
                              : 'demote this user to Student';
                            if (window.confirm(`Are you sure you want to ${action}?`)) {
                              handleRoleChange(user);
                            }
                          }}
                          style={menuItemStyle}
                        >
                          {user.userType === 'Student' ? 'Make SUAdmin' : 'Make Student'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

const iconButtonStyle = {
  background: 'transparent',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer'
};

const menuStyle = {
  position: 'absolute',
  top: '100%',
  right: '0',
  background: 'white',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 10,
};

const menuItemStyle = {
  display: 'block',
  padding: '8px 12px',
  width: '100%',
  background: 'white',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer'
};
