import React from 'react';
import MemberTable from "../components/manageMembersPage/memberTable";
import ExecutiveTable from "../components/manageMembersPage/executiveTable";

const ManageMembers = () => {
  // Temporary test data
  const testMembers = [
    { email: 'member1@club.com', status: 'Active' },
    { email: 'member2@club.com', status: 'Pending' },
    { email: 'member3@club.com', status: 'Active' },
    { email: 'alice@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },

    { email: 'charlie@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },
    { email: 'charlie@club.com', status: 'Active' },

    { email: 'dana@club.com', status: 'Pending' }
  ];

  const [executives, setExecutives] = React.useState([
    { email: 'president@club.com', role: 'President' },
    { email: 'vp@club.com', role: 'Vice President' },
    { email: 'treasurer@club.com', role: 'Finance' },
    { email: 'events@club.com', role: 'Events Coordinator' },
    { email: 'events@club.com', role: 'Events Coordinator' },
    { email: 'events@club.com', role: 'Events Coordinator' },
    { email: 'events@club.com', role: 'Events Coordinator' },
    { email: 'events@club.com', role: 'Events Coordinator' },
    { email: 'events@club.com', role: 'Events Coordinator' },



    { email: 'secretary@club.com', role: 'Secretary' },
    { email: 'pr@club.com', role: 'Public Relations' }
  ]);

  // State for new executive form
  const [newExecutive, setNewExecutive] = React.useState({
    email: '',
    role: ''
  });

  // Styles for the add executive form
  const addExecutiveBoxStyles = {
    border: '1px solid #ddd',
    padding: '15px',
    marginTop: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px'
  };

  const inputStyles = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  const addButtonStyles = {
    padding: '8px 15px',
    backgroundColor: '#005587',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExecutive(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExecutive = () => {
    if (newExecutive.email && newExecutive.role) {
      setExecutives([...executives, newExecutive]);
      setNewExecutive({ email: '', role: '' });
    }
  };

  // Main container styles
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

  // Header container styles
  const headerContainerStyles = {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%'
  };

  // Header styles
  const headerStyles = {
    textAlign: 'center',
    margin: '0 auto',
    fontSize: '2rem',
    maxWidth: '1200px',
    width: '100%'
  };

  // Subheader styles
  const subheaderStyles = {
    textAlign: 'center',
    color: '#bdc3c7',
    margin: '10px auto 0',
    fontSize: '1.2rem',
    maxWidth: '1200px',
    width: '100%'
  };

  // Main content styles
  const contentStyles = {
    flex: 1,
    padding: '20px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box'
  };

  // Tables container styles
  const tablesContainerStyles = {
    display: 'flex',
    gap: '30px',
    height: 'calc(100vh - 200px)',
    minHeight: '500px',
    width: '100%'
  };

  // Column styles
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

  // Column header styles
  const columnHeaderStyles = {
    color: '#2c3e50',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #ecf0f1',
    fontSize: '1.3rem',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1
  };

  return (
    <div style={containerStyles}>
      {/* Header Section */}
      <div style={headerContainerStyles}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={headerStyles}>Member Management System</h1>
          <h2 style={subheaderStyles}>Organization Leadership Portal</h2>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={contentStyles}>
        <div style={tablesContainerStyles}>
          {/* Left Column - MemberTable */}
          <div style={columnStyles}>
     
            <MemberTable members={testMembers} />
          </div>
          
          {/* Right Column - ExecutiveTable */}
          <div style={columnStyles}>
           
            <ExecutiveTable executives={executives} />
            
            {/* Add Executive Form */}
            <div style={addExecutiveBoxStyles}>
              <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50' }}>Add New Executive</h4>
              <input
                type="text"
                name="email"
                placeholder="ucalgary email"
                style={inputStyles}
                value={newExecutive.email}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="role"
                placeholder="role"
                style={inputStyles}
                value={newExecutive.role}
                onChange={handleInputChange}
              />
              <button 
                style={addButtonStyles}
                onClick={handleAddExecutive}
              >
                Add Executive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debugging footer - remove in production */}
      <div style={{
        textAlign: 'center',
        padding: '10px',
        color: '#7f8c8d',
        fontSize: '0.8rem',
        backgroundColor: '#ecf0f1',
        width: '100%'
      }}>
        Component loaded at: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ManageMembers;