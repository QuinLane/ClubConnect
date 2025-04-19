import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MemberTable from "../components/tables/memberTable";
import ExecutiveTable from "../components/tables/executiveTable";

const ManageMembers = () => {
  const { clubID } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // State management
  const [members, setMembers] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for new executive form
  const [newExecutive, setNewExecutive] = useState({
    email: '',
    role: ''
  });

  // Fetch data
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch members
        const membersRes = await fetch(`http://localhost:5050/api/clubs/members/${clubID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!membersRes.ok) throw new Error('Failed to fetch members');
        const membersData = await membersRes.json();
        
        // Fetch executives - using corrected endpoint
        const execsRes = await fetch(`http://localhost:5050/api/executives/club/${clubID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        if (!execsRes.ok) {
          const errorText = await execsRes.text();
          throw new Error(errorText.includes('<!DOCTYPE') ? 
            'Server returned HTML error page' : 
            errorText);
        }
    
        const execsData = await execsRes.json();
        
        // Transform data
        setMembers(membersData.map(m => ({
          id: m.user.userID,
          email: m.user.email,
          name: `${m.user.firstName} ${m.user.lastName}`,
          status: m.status || 'Active'
        })));
    
        setExecutives(execsData.map(e => ({
          id: e.user.userID,
          email: e.user.email,
          name: `${e.user.firstName} ${e.user.lastName}`,
          role: e.role || 'Executive'
        })));
    
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubID, token, navigate]);

  const handleRemoveMember = async (userID) => {
    try {
      // Confirm before deleting
      if (!window.confirm('Are you sure you want to remove this member?')) {
        return;
      }
  
      const response = await fetch(`http://localhost:5050/api/clubs/${clubID}/members/${userID}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove member');
      }
  
      // Update both members and executives lists
      setMembers(prevMembers => prevMembers.filter(m => m.id !== userID));
      setExecutives(prevExecs => prevExecs.filter(e => e.id !== userID));
      
    } catch (err) {
      console.error("Error removing member:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };
  
  const handleRemoveExecutive = async (executiveId) => {
    try {
      if (!window.confirm('Are you sure you want to remove this executive?')) {
        return;
      }
  
      const response = await fetch(`http://localhost:5050/api/executives/${clubID}/${executiveId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove executive');
      }
  
      // Update the executives list
      setExecutives(prevExecs => prevExecs.filter(e => e.id !== executiveId));
      setError(null);
  
    } catch (err) {
      console.error("Error removing executive:", err);
      setError(err.message);
    }
  };




  
  const handleAddExecutive = async () => {
    if (!newExecutive.email || !newExecutive.role) {
      setError('Email and role are required');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5050/api/executives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newExecutive.email,
          clubID: parseInt(clubID),
          role: newExecutive.role
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add executive');
      }
  
      const newExec = await response.json();
      
      // Add the new executive to the state
      setExecutives(prevExecs => [
        ...prevExecs,
        {
          id: newExec.user.userID,
          email: newExec.user.email,
          name: `${newExec.user.firstName} ${newExec.user.lastName}`,
          role: newExec.role
        }
      ]);
      
      setNewExecutive({ email: '', role: '' });
      setError(null);
  
    } catch (err) {
      console.error("Error adding executive:", err);
      setError(err.message);
    }
  };

  // Styles
  const containerStyles = {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    width: '100vw',
    overflowX: 'hidden'
  };

  const headerContainerStyles = {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%'
  };

  const contentStyles = {
    flex: 1,
    padding: '20px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box'
  };

  const tablesContainerStyles = {
    display: 'flex',
    gap: '30px',
    height: 'calc(100vh - 200px)',
    minHeight: '500px',
    width: '100%'
  };

  const columnStyles = {
    flex: 1,
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
    minWidth: '300px',
    overflowY: 'auto',
    height: '100%',
    boxSizing: 'border-box'
  };

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading members data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyles}>
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={headerContainerStyles}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, textAlign: 'center' }}>Member Management</h1>
          <h2 style={{ margin: '10px 0 0', textAlign: 'center', color: '#bdc3c7' }}>
            Club ID: {clubID}
          </h2>
        </div>
      </div>
      
      <div style={contentStyles}>
        <div style={tablesContainerStyles}>
          <div style={columnStyles}>
            <h2 style={{ marginTop: 0 }}>Members ({members.length})</h2>
            <MemberTable 
              members={members} 
              onRemoveMember={handleRemoveMember} 
            />
          </div>
          
          <div style={columnStyles}>
            <h2 style={{ marginTop: 0 }}>Executives ({executives.length})</h2>
            <ExecutiveTable 
  executives={executives} 
  onRemoveExecutive={handleRemoveExecutive} 
/>            
            <div style={{ 
              border: '1px solid #ddd',
              padding: '15px',
              marginTop: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px'
            }}>
              <h4 style={{ marginTop: 0 }}>Add New Executive</h4>
              <input
                type="text"
                name="email"
                placeholder="ucalgary email"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                value={newExecutive.email}
                onChange={(e) => setNewExecutive({...newExecutive, email: e.target.value})}
              />
              <input
                type="text"
                name="role"
                placeholder="role"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                value={newExecutive.role}
                onChange={(e) => setNewExecutive({...newExecutive, role: e.target.value})}
              />
              <button 
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#005587',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                onClick={handleAddExecutive}
              >
                Add Executive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;