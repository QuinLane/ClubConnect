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
        const membersRes = await fetch(`http://localhost:5050/api/clubs/members/${clubID || 1}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!membersRes.ok) {
          const errorData = await membersRes.json();
          throw new Error(errorData.error || 'Failed to fetch members');
        }

        const membersData = await membersRes.json();
        
        // Transform data for MemberTable
        const formattedMembers = membersData.map(member => ({
          id: member.user.userID,
          email: member.user.email,
          name: `${member.user.firstName} ${member.user.lastName}`,
          status: member.status || 'Active'
        }));

        setMembers(formattedMembers);

        // Fetch executives
        const execsRes = await fetch(`http://localhost:5050/api/clubs/executives/${clubID || 1}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (execsRes.ok) {
          const execsData = await execsRes.json();
          setExecutives(execsData.map(exec => ({
            id: exec.user.userID,
            email: exec.user.email,
            name: `${exec.user.firstName} ${exec.user.lastName}`,
            role: exec.role
          })));
        }

      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        
        // Fallback test data for development
        if (process.env.NODE_ENV === 'development') {
          setMembers([
            { id: 1, email: 'test1@ucalgary.ca', name: 'Test User 1', status: 'Active' },
            { id: 2, email: 'test2@ucalgary.ca', name: 'Test User 2', status: 'Pending' }
          ]);
          setExecutives([
            { id: 3, email: 'admin@ucalgary.ca', name: 'Club Admin', role: 'President' }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubID, token, navigate]);

  const handleRemoveMember = async (email) => {
    try {
      const response = await fetch(`http://localhost:5050/api/clubs/${clubID || 1}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      // Update local state
      setMembers(members.filter(m => m.email !== email));
    } catch (err) {
      console.error("Error removing member:", err);
      setError(err.message);
    }
  };

  const handleAddExecutive = async () => {
    if (!newExecutive.email || !newExecutive.role) return;

    try {
      const response = await fetch(`http://localhost:5050/api/clubs/${clubID || 1}/executives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newExecutive.email,
          role: newExecutive.role
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add executive');
      }

      const newExec = await response.json();
      setExecutives([...executives, {
        id: newExec.userID,
        email: newExecutive.email,
        name: newExec.name || 'New Executive',
        role: newExecutive.role
      }]);
      setNewExecutive({ email: '', role: '' });

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
            Club ID: {clubID || 1}
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
            <ExecutiveTable executives={executives} />
            
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