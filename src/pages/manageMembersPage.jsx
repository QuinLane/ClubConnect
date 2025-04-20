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
  const [presidentError, setPresidentError] = useState('');
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPresidentPrompt, setShowPresidentPrompt] = useState(false);
  const [newPresidentEmail, setNewPresidentEmail] = useState('');
  const [executiveToModify, setExecutiveToModify] = useState(null);
  const [actionType, setActionType] = useState('');

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
        
        // Fetch executives
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
  const handleUpdateRole = async (executiveId, newRole) => {
    try {
      const executive = executives.find(e => e.id === executiveId);
      const wasPresident = executive?.role === 'President';
      const willBePresident = newRole === 'President';
      const isCurrentUser = executiveId === user.userID;
  
      // If current user is trying to make someone else president
      if (!isCurrentUser && willBePresident) {
        setExecutiveToModify(executive);
        setActionType('presidentChange');
        setShowPresidentPrompt(true);
        return;
      }
  
      // If changing from president to non-president, check if there are other presidents
      if (wasPresident && !willBePresident) {
        const hasOtherPresident = executives.some(
          e => e.id !== executiveId && e.role === 'President'
        );
        
        if (!hasOtherPresident) {
          setExecutiveToModify(executive);
          setActionType('update');
          setShowPresidentPrompt(true);
          return;
        }
      }
  
      await performRoleUpdate(executiveId, newRole);
    } catch (err) {
      console.error("Error updating role:", err);
      setError(err.message);
    }
  };

  const performRoleUpdate = async (executiveId, newRole) => {
    const response = await fetch(
      `http://localhost:5050/api/executives/${clubID}/${executiveId}/role`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      }
    );
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update role');
    }
  
    setExecutives(prevExecs =>
      prevExecs.map(exec =>
        exec.id === executiveId ? { ...exec, role: newRole } : exec
      )
    );
  
    // Check if current user is changing from president to non-president
    if (executiveId === user.userID && newRole.toLowerCase() !== 'president') {
      const wasPresident = executives.find(e => e.id === executiveId)?.role === 'President';
      if (wasPresident) {
        navigate(`/app/club/${clubID}`);
      }
    }
  };

  const handleRemoveExecutive = async (executiveId) => {
    try {
      const executive = executives.find(e => e.id === executiveId);
      
      if (executive?.role === 'President') {
        const hasOtherPresident = executives.some(
          e => e.id !== executiveId && e.role === 'President'
        );
        
        if (!hasOtherPresident) {
          setExecutiveToModify(executive);
          setActionType('remove');
          setShowPresidentPrompt(true);
          return;
        }
      }

      if (!window.confirm('Are you sure you want to remove this executive?')) {
        return;
      }

      await performExecutiveRemoval(executiveId);
    } catch (err) {
      console.error("Error removing executive:", err);
      setError(err.message);
    }
  };

  const performExecutiveRemoval = async (executiveId) => {
    const response = await fetch(
      `http://localhost:5050/api/executives/${clubID}/${executiveId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove executive');
    }

    setExecutives(prevExecs => prevExecs.filter(e => e.id !== executiveId));
  };

  const handlePresidentSubmit = async () => {
    try {
      if (actionType === 'presidentChange') {
        if (!newPresidentEmail.trim()) {
          setPresidentError('Please enter a new role');
          return;
        }
        
        if (newPresidentEmail.trim().toLowerCase() === 'president') {
          setPresidentError('Your new role cannot be "President"');
          return;
        }
  
        // First update the new president's role
        await performRoleUpdate(executiveToModify.id, 'President');
        
        // Then update current user's role
        await performRoleUpdate(user.userID, newPresidentEmail.trim());
        
        // Redirect after successful role change
        navigate(`/app/club/${clubID}`);
      } else {
        const newPresident = executives.find(
          exec => exec.email === newPresidentEmail
        );
    
        if (!newPresident) {
          setPresidentError('Not a member of the club');
          return;
        }
    
        await performRoleUpdate(newPresident.id, 'President');
    
        if (actionType === 'remove') {
          await performExecutiveRemoval(executiveToModify.id);
          
          // If we're removing ourselves as president (by assigning someone else)
          if (executiveToModify.id === user.userID) {
            navigate(`/app/club/${clubID}`);
          }
        }
        
        // If we're assigning someone else as president (but not removing ourselves)
        if (actionType === 'update' && executiveToModify.id === user.userID) {
          navigate(`/app/club/${clubID}`);
        }
      }
    
      setShowPresidentPrompt(false);
      setNewPresidentEmail('');
      setExecutiveToModify(null);
      setActionType('');
      setPresidentError('');
    } catch (err) {
      console.error("Error handling president change:", err);
      setPresidentError('Failed to complete the role change');
    }
  };
  const handleRemoveMember = async (userID) => {
    try {
      // Is this member also an executive President?
      const memberExec = executives.find(e => e.id === userID && e.role === 'President');
      if (memberExec) {
        // Count how many presidents exist
        const presidentCount = executives.filter(e => e.role === 'President').length;
        if (presidentCount === 1) {
          // If they're the last president, trigger the “assign new president” prompt
          setExecutiveToModify(memberExec);
          setActionType('remove');
          setShowPresidentPrompt(true);
          return;
        }
     }

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
  
      setMembers(prevMembers => prevMembers.filter(m => m.id !== userID));
      setExecutives(prevExecs => prevExecs.filter(e => e.id !== userID));
      
    } catch (err) {
      console.error("Error removing member:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };
  
  const handleAddExecutive = async () => {
    if (!newExecutive.email || !newExecutive.role) {
      setError('Email and role are required');
      return;
    }
    if (executives.some(exec => exec.email === newExecutive.email)) {
      alert('User is already an executive');
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
              onUpdateRole={handleUpdateRole}
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

      {showPresidentPrompt && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      width: '400px',
      maxWidth: '90%'
    }}>
{actionType === 'presidentChange' ? (
  <>
    <h2 style={{ marginTop: 0 }}>Change Your Role</h2>
    <p>Since you're making {executiveToModify?.email} the new president, please enter a new role for yourself (cannot be "President"):</p>
    <input
      type="text"
      placeholder="Enter your new role"
      value={newPresidentEmail} // Still reusing this state variable
      onChange={(e) => {
        setNewPresidentEmail(e.target.value);
        setPresidentError('');
      }}
      style={{
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: presidentError ? '1px solid red' : '1px solid #ddd',
        borderRadius: '4px'
      }}
    />
  </>
) : (
        <>
          <h2 style={{ marginTop: 0 }}>Assign New President</h2>
          <p>You must assign a new president before changing the current president's role.</p>
          <input
            type="email"
            placeholder="Enter new president's email"
            value={newPresidentEmail}
            onChange={(e) => {
              setNewPresidentEmail(e.target.value);
              setPresidentError('');
            }}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              border: presidentError ? '1px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </>
      )}
      
      {presidentError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {presidentError}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button 
          onClick={() => {
            setShowPresidentPrompt(false);
            setNewPresidentEmail('');
            setPresidentError('');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button 
          onClick={handlePresidentSubmit}
          style={{
            padding: '8px 16px',
            backgroundColor: '#005587',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManageMembers;