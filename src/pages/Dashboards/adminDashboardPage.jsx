import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    { 
      title: 'SU Inbox',
      description: 'View and manage all SU messages',
      color: '#005587',
      onClick: () => navigate('../chatSU')
    },
    { 
      title: 'Requests & Forms',
      description: 'Review pending requests',
      color: '#388e3c',
      onClick: () => navigate('../forms-su')
    },
    { 
      title: 'Manage Clubs',
      description: 'View and manage clubs',
      color: '#d32f2f',
      onClick: () => navigate('../manage-clubs')
    },
    { 
      title: 'Manage Users',
      description: 'View and manage events',
      color: '#ff9800',
      onClick: () => navigate('../manage-users')
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '50px',
        fontSize: '2.5rem'
      }}>
        Admin Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '30px',
        maxWidth: '1000px',
        height: '60vh',
        margin: '0 auto'
      }}>
        {dashboardItems.map((item, index) => (
          <div 
            key={index}
            onClick={item.onClick}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderTop: `6px solid ${item.color}`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
              }
            }}
          >
            <h2 style={{
              color: item.color,
              marginTop: 0,
              fontSize: '1.8rem',
              marginBottom: '15px'
            }}>
              {item.title}
            </h2>
            <p style={{
              color: '#666',
              fontSize: '1.1rem',
              marginBottom: '20px'
            }}>
              {item.description}
            </p>
            <div style={{
              width: '50px',
              height: '3px',
              backgroundColor: item.color,
              margin: '0 auto'
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;