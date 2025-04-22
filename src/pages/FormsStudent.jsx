import React, { useEffect, useState } from 'react';
import CreateClubForm     from './UserForms/CreateClubForm';
import FundingRequestForm from './UserForms/FundingRequestForm';
import EventRequestForm   from './UserForms/EventRequestForm';
import DeleteClubForm     from './UserForms/DeleteClubForm';
import FormRequestsTable  from '../components/tables/statusTable';

const token      = localStorage.getItem('token');
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID     = storedUser.userID ?? null;

export default function StudentFormPage() {
  const [formRequests,    setFormRequests]    = useState([]);
  const [selectedFormId,  setSelectedFormId]  = useState(null);
  const [modalOpen,       setModalOpen]       = useState(false);
  const [modalContent,    setModalContent]    = useState(null);
  const [selectedFormKey, setSelectedFormKey] = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');
  

  useEffect(() => {
    if (!userID) {
      setError('User not found.');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch('http://localhost:5050/api/forms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch forms');
        const allForms = await res.json();
        const myForms = allForms
          .filter(f => f.userID === userID)
          .map(f => {
            const d    = JSON.parse(f.details || '{}');
            const name = d.eventName || d.clubName || d.title || f.formType;
            return {
              id:            f.formID,
              formName:      name,
              formType:      f.formType,
              clubName:      d.clubName || '—',
              status:        f.status,
              submittedDate: f.submittedAt?.slice(0,10),
              data:          d,
            };
          });
        setFormRequests(myForms);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openModal  = (content) => { setModalContent(content); setModalOpen(true); };
  const closeModal = ()        => { setModalOpen(false); setModalContent(null); setSelectedFormKey(null); };

  const viewRequest = (req) => {
    setSelectedFormId(req.id);
    let comp;
    switch (req.formType) {
      case 'ClubCreation':
        comp = <CreateClubForm    initialData={req.data} isReadOnly />;
        break;
      case 'Funding':
        comp = <FundingRequestForm initialData={req.data} isReadOnly />;
        break;
      case 'EventApproval':
        comp = <EventRequestForm   initialData={req.data} isReadOnly />;
        break;
      case 'DeleteClub':
        comp = <DeleteClubForm     initialData={req.data} isReadOnly />;
        break;
      default:
        comp = <p>Unknown form type</p>;
    }
    openModal(comp);
  };

  // bottom cards definitions
  const formOptions = [
    {
      key: 'create',
      title: 'Create a Club',
      description: 'Start a new club within the university system',
      component: <CreateClubForm onSubmit={(d) => handleFormSubmit('ClubCreation', d)} />
    },
    {
      key: 'funding',
      title: 'Funding Request',
      description: 'Request financial support for your club',
      component: <FundingRequestForm onSubmit={(d) => handleFormSubmit('Funding', d)} />
    },
    {
      key: 'event',
      title: 'Event Request',
      description: 'Propose and schedule a new club event',
      component: <EventRequestForm onSubmit={(d) => handleFormSubmit('EventApproval', d)} />
    },
    {
      key: 'delete',
      title: 'Delete Club',
      description: 'Request to remove an existing club',
      component: <DeleteClubForm onSubmit={(d) => handleFormSubmit('DeleteClub', d)} />
    },
  ];

  const handleFormSubmit = (formType, formData) => {
    const newRow = {
      id:            Date.now(),
      formName:      formData.eventName || formData.clubName || formData.title || formType,
      formType,
      clubName:      formData.clubName || '—',
      status:        'Pending',
      submittedDate: new Date().toISOString().slice(0,10),
      data:          formData,
    };
    setFormRequests(prev => [newRow, ...prev]);
    closeModal();
  };

  const chooseForm = (opt) => {
    setSelectedFormKey(opt.key);
    openModal(opt.component);
  };

  if (loading) return <p style={{ padding:'2rem' }}>Loading your forms…</p>;
  if (error)   return <p style={{ padding:'2rem', color:'#d32f2f' }}>{error}</p>;

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif',
      }}>
        <section style={{
          flex: '0 0 50%',
          padding: '1rem',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            color: '#1f2937',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            Your Submitted Forms
          </h2>
          <FormRequestsTable
            requests={formRequests}
            onRowClick={viewRequest}
            selectedId={selectedFormId}
          />
        </section>

        {/* Bottom: available forms */}
        <section style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          padding: '1rem',
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            color: '#1f2937',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            Available Forms
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
          }}>
            {formOptions.map(opt => (
              <div key={opt.key}
                   onClick={() => chooseForm(opt)}
                   style={{
                     backgroundColor: selectedFormKey === opt.key ? '#e0e7ff' : '#ffffff',
                     padding: '0.75rem',
                     borderRadius: '0.5rem',
                     border: '1px solid #e5e7eb',
                     cursor: 'pointer',
                   }}>
                <h3 style={{
                  margin: 0,
                  color: '#111827',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}>
                  {opt.title}
                </h3>
                <p style={{
                  marginTop: '0.25rem',
                  color: '#4b5563',
                  fontSize: '0.8rem',
                }}>
                  {opt.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {modalOpen && (
        <div onClick={closeModal} style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            maxHeight: '90vh',
            width: 'min(90%, 650px)',
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1rem',
            overflowY: 'auto',
          }}>
            <button onClick={closeModal} style={{
              float: 'right',
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
            }}>
              &times;
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </>
  );
}
