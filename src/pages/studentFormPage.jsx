import React, { useState } from 'react';
import CreateClubForm from './UserForms/CreateClubForm';
import FundingRequestForm from './UserForms/FundingRequestForm';
import EventRequestForm from './ApproveOrDeny';
import DeleteClubForm from './UserForms/DeleteClubForm';
import FormRequestsTable from '../components/tables/statusTable';

const FormsPage = () => {
  /* ---------- state ---------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);   // holds a React element
  const [selectedFormKey, setSelectedFormKey] = useState(null);

  const [formRequests, setFormRequests] = useState([
    {
      id: 1,
      formName: 'Annual Budget Request',
      formType: 'Funding',
      clubName: 'Chess Club',
      status: 'Pending',
      submittedDate: '2023-05-15',
      data: { /* dummy pre‑filled data goes here */ },
    },
    {
      id: 2,
      formName: 'Fall Tournament',
      formType: 'Event',
      clubName: 'Debate Team',
      status: 'Approved',
      submittedDate: '2023-05-10',
      data: {},
    },
    {
      id: 3,
      formName: 'New Club Application',
      formType: 'Create Club',
      clubName: 'Photography Society',
      status: 'Pending',
      submittedDate: '2023-05-18',
      data: {},
    },
    {
      id: 4,
      formName: 'Club Dissolution',
      formType: 'Delete Club',
      clubName: 'Robotics Club',
      status: 'Rejected',
      submittedDate: '2023-05-05',
      data: {},
    },
  ]);

  /* ---------- helpers ---------- */
  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setSelectedFormKey(null);
  };

  const handleFormSubmit = (formType, formData) => {
    const newRequest = {
      id: formRequests.length + 1,
      formName: formData.eventName || formData.clubName || formData.title || formType,
      formType,
      clubName: formData.clubName || 'My Club',
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      data: formData,
    };
    setFormRequests([...formRequests, newRequest]);
    closeModal();
    alert(`${formType} submitted successfully!`);
  };

  const viewRequest = (request) => {
    let component = null;
    switch (request.formType) {
      case 'Create Club':
        component = <CreateClubForm isReadOnly={true} initialData={request.data} />;
        break;
      case 'Funding':
        component = <FundingRequestForm isReadOnly={true} initialData={request.data} />;
        break;
      case 'Event':
        component = <EventRequestForm isReadOnly={true} initialData={request.data} />;
        break;
      case 'Delete Club':
        component = <DeleteClubForm isReadOnly={true} initialData={request.data} />;
        break;
      default:
        component = <p>Unknown form type</p>;
    }
    openModal(component);
  };

  const formOptions = [
    {
      key: 'create',
      title: 'Create a Club',
      description: 'Start a new club within the university system',
      component: <CreateClubForm onSubmit={(d) => handleFormSubmit('Create Club', d)} />,
    },
    {
      key: 'funding',
      title: 'Funding Request',
      description: 'Request financial support for your club',
      component: <FundingRequestForm onSubmit={(d) => handleFormSubmit('Funding', d)} />,
    },
    {
      key: 'event',
      title: 'Event Request',
      description: 'Propose and schedule a new club event',
      component: <EventRequestForm onSubmit={(d) => handleFormSubmit('Event', d)} />,
    },
    {
      key: 'delete',
      title: 'Delete Club',
      description: 'Request to remove an existing club',
      component: <DeleteClubForm isReadOnly={false} onSubmit={(d) => handleFormSubmit('Delete Club', d)} />,
    },
  ];

  const chooseForm = (opt) => {
    setSelectedFormKey(opt.key);
    openModal(opt.component);
  };

  /* ---------- render ---------- */
  return (
    <>
      {/* ---- main page ---- */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* TOP: submitted forms / status */}
        <section
          style={{
            flex: '0 0 55%',
            padding: '1rem',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              color: '#1f2937',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            Your Submitted Forms
          </h2>
          <FormRequestsTable requests={formRequests} onRowClick={viewRequest} />
        </section>

        {/* BOTTOM: available forms */}
        <section
          style={{
            width: '100%',
            flex: '1 1 auto',
            overflowY: 'auto',
            padding: '1rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              color: '#1f2937',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            Available Forms
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {formOptions.map((opt) => (
              <div
                key={opt.key}
                onClick={() => chooseForm(opt)}
                style={{
                  backgroundColor:
                    selectedFormKey === opt.key ? '#e0e7ff' : '#ffffff',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb',
                  transition: 'background 0.2s, transform 0.2s',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: '#111827',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {opt.title}
                </h3>
                <p
                  style={{
                    marginTop: '0.25rem',
                    color: '#4b5563',
                    fontSize: '0.8rem',
                  }}
                >
                  {opt.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- modal ---- */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: '90vh',
              width: 'min(90%, 650px)',
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '1rem',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={closeModal}
              style={{
                float: 'right',
                background: 'transparent',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              &times;
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </>
  );
};

export default FormsPage;
