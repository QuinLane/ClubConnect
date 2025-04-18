import React from 'react';

const CompletedFormsPage = () => {
  const submittedForms = [
    {
      title: 'Create a Club',
      description: 'Name: Hiking Club\nDescription: A club for outdoor enthusiasts.',
    },
    {
      title: 'Funding Request',
      description: 'Amount: $500\nPurpose: Purchase of event supplies.',
    },
    {
      title: 'Event Request',
      description: 'Event: Welcome Social\nDate: May 1st, 2025',
    },
    {
      title: 'Delete Club',
      description: 'Club Name: Chess Club\nReason: Low participation',
    },
  ];

  const handleAction = (action, title) => {
    alert(`${action} form: ${title}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: '50px',
        fontSize: '2.5rem'
      }}>
        Completed Forms
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
        {submittedForms.map((form, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#e5e7eb',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <h2 style={{
              color: '#374151',
              marginTop: 0,
              fontSize: '1.8rem',
              marginBottom: '15px'
            }}>
              {form.title}
            </h2>
            <pre style={{
              color: '#4b5563',
              fontSize: '1.1rem',
              whiteSpace: 'pre-wrap',
              marginBottom: '20px'
            }}>
              {form.description}
            </pre>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button
                onClick={() => handleAction('Approved', form.title)}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Approve
              </button>
              <button
                onClick={() => handleAction('Denied', form.title)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedFormsPage;
