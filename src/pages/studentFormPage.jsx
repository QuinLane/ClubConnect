import React, { useState } from 'react';
import CreateClubForm from './CreateClubForm';
import FundingRequestForm from './FundingRequestForm';
import EventRequestForm from '../pages/eventRequestPage';
import DeleteClubForm from './DeleteClubForm';
import FormRequestsTable from '../components/tables/statusTable';

const FormsPage = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [formRequests, setFormRequests] = useState([
    {
      id: 1,
      formName: "Annual Budget Request",
      formType: "Funding",
      clubName: "Chess Club",
      status: "Pending",
      submittedDate: "2023-05-15"
    },
    {
      id: 2,
      formName: "Fall Tournament",
      formType: "Event",
      clubName: "Debate Team",
      status: "Approved",
      submittedDate: "2023-05-10"
    },
    {
      id: 3,
      formName: "New Club Application",
      formType: "Create Club",
      clubName: "Photography Society",
      status: "Pending",
      submittedDate: "2023-05-18"
    },
    {
      id: 4,
      formName: "Club Dissolution",
      formType: "Delete Club",
      clubName: "Robotics Club",
      status: "Rejected",
      submittedDate: "2023-05-05"
    }
  ]);

  const formOptions = [
    {
      key: 'create',
      title: 'Create a Club',
      description: 'Start a new club within the university system',
      component: <CreateClubForm onSubmit={(data) => handleFormSubmit('Create Club', data)} />
    },
    {
      key: 'funding',
      title: 'Funding Request',
      description: 'Request financial support for your club',
      component: <FundingRequestForm onSubmit={(data) => handleFormSubmit('Funding', data)} />
    },
    {
      key: 'event',
      title: 'Event Request',
      description: 'Propose and schedule a new club event',
      component: <EventRequestForm onSubmit={(data) => handleFormSubmit('Event', data)} />
    },
    {
      key: 'delete',
      title: 'Delete Club',
      description: 'Request to remove an existing club',
      component: <DeleteClubForm isReadOnly={false} onSubmit={(data) => handleFormSubmit('Delete Club', data)} />
    },
  ];

  const handleFormSubmit = (formType, formData) => {
    const newRequest = {
      id: formRequests.length + 1,
      formName: formData.eventName || formData.clubName || formData.title || formType,
      formType: formType,
      clubName: formData.clubName || "My Club",
      status: "Pending",
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setFormRequests([...formRequests, newRequest]);
    alert(`${formType} submitted successfully!`);
    setActiveForm(null);
  };

  const handleRowClick = (request) => {
    console.log("Viewing request:", request);
  };

  const handleFormSelection = (formKey) => {
    setSelectedForm(formKey);
    setActiveForm(formOptions.find(f => f.key === formKey)?.component);
  };

  // Form Selection Container Component
  const FormSelectionContainer = () => (
    <div style={{
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb'
    }}>
      <h2 style={{
        marginBottom: '1rem',
        fontSize: '1.25rem',
        color: '#1f2937',
        fontWeight: '600'
      }}>
        Form Selection
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem'
      }}>
        {formOptions.map((item) => (
          <div
            key={item.key}
            onClick={() => handleFormSelection(item.key)}
            style={{
              backgroundColor: selectedForm === item.key ? '#e0e7ff' : 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              border: '1px solid #e5e7eb',
              transition: 'background 0.2s, transform 0.2s',
            }}
          >
            <h3 style={{
              margin: 0,
              color: '#111827',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {item.title}
            </h3>
            <p style={{
              marginTop: '0.25rem',
              color: '#4b5563',
              fontSize: '0.8rem'
            }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // Form Display Container Component
  const FormDisplayContainer = () => (
    <div style={{
      flex: 1,
      padding: '0',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {activeForm ? (
        <div style={{
          flex: 1,
          padding: '0.5rem'
        }}>
          {activeForm}
        </div>
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          padding: '1rem'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p style={{ marginTop: '0.1rem', fontSize: '1rem' }}>
            Select a form to begin
          </p>
        </div>
      )}
    </div>
  );

  // Approval Status Container Component
  const ApprovalStatusContainer = () => (
    <div style={{
      marginTop: '0',
      width: '60%',
      backgroundColor: '#ffffff',
      overflowY: 'auto'
    }}>
      <h2 style={{
        marginBottom: '1rem',
        fontSize: '1.25rem',
        color: '#1f2937',
        fontWeight: '600'
      }}>
        Form Approval Status
      </h2>
      <FormRequestsTable
        requests={formRequests}
        onRowClick={handleRowClick}
      />
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Left panel - form selector and active form */}
      <div style={{
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb'
      }}>
        <FormSelectionContainer />
        <FormDisplayContainer />
      </div>

      {/* Right panel - form approval status table */}
      <ApprovalStatusContainer />
    </div>
  );
};

export default FormsPage;