import React, { useState } from 'react';
import CreateClubForm from './CreateClubForm';
import FundingRequestForm from './FundingRequestForm';
import EventRequestForm from './FundingRequestForm';
import DeleteClubForm from './DeleteClubForm'; // assuming you renamed DeleteClubPage

const FormsPage = () => {
  const [selectedForm, setSelectedForm] = useState(null);

  const formOptions = [
    {
      key: 'create',
      title: 'Create a Club',
      description: 'Start a new club within the university system',
      component: <CreateClubForm />,
    },
    {
      key: 'funding',
      title: 'Funding Request',
      description: 'Request financial support for your club',
      component: <FundingRequestForm />,
    },
    {
      key: 'event',
      title: 'Event Request',
      description: 'Propose and schedule a new club event',
      component: <EventRequestForm />,
    },
    {
      key: 'delete',
      title: 'Delete Club',
      description: 'Request to remove an existing club',
      component: <DeleteClubForm isReadOnly={false} />,
    },
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Left panel - form options */}
      <div style={{
        width: '30%',
        backgroundColor: '#e5e7eb',
        padding: '2rem',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#1f2937' }}>Forms</h2>
        {formOptions.map((item) => (
          <div
            key={item.key}
            onClick={() => setSelectedForm(item.key)}
            style={{
              backgroundColor: selectedForm === item.key ? '#d1d5db' : 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              cursor: 'pointer',
              boxShadow: selectedForm === item.key ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            <h3 style={{ margin: 0, color: '#111827' }}>{item.title}</h3>
            <p style={{ marginTop: '0.25rem', color: '#4b5563' }}>{item.description}</p>
          </div>
        ))}
      </div>

      {/* Right panel - form content */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
        backgroundColor: '#ffffff'
      }}>
        {selectedForm ? (
          formOptions.find(f => f.key === selectedForm)?.component
        ) : (
          <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>Select a form to begin.</p>
        )}
      </div>
    </div>
  );
};

export default FormsPage;
