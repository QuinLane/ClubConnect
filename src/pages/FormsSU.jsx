// src/pages/SUFormsPage.jsx
import React, { useState, useEffect } from 'react';
import CreateClubForm   from './UserForms/CreateClubForm';
import FundingRequestForm from './UserForms/FundingRequestForm';
import EventRequestForm   from './UserForms/EventRequestForm';
import DeleteClubForm     from './UserForms/DeleteClubForm';
import FormRequestsTable  from '../components/tables/statusTable';

export default function SUFormsPage() {
  const token = localStorage.getItem('token');
  const [forms, setForms]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  //  Fetch all pending forms on mount
  useEffect(() => {
    const fetchOpenForms = async () => {
      try {
        const res = await fetch('http://localhost:5050/api/forms/open', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load open forms');
        const data = await res.json();
        // Map to the shape your table expects:
        const mapped = data.map(f => {
          const details = JSON.parse(f.details || '{}');
          return {
            id       : f.formID,
            formType : f.formType,
            clubName : f.club?.clubName || details.clubName || '—',
            status   : f.status,
            data     : details,
          };
        });
        setForms(mapped);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOpenForms();
  }, [token]);

  // Open modal with read‑only form preview
  const handleRowClick = (frm) => {
    let FormComponent;
    switch (frm.formType) {
      case 'ClubCreation':
        FormComponent = <CreateClubForm   initialData={frm.data} isReadOnly />;
        break;
      case 'Funding':
        FormComponent = <FundingRequestForm initialData={frm.data} isReadOnly />;
        break;
      case 'EventApproval':
        FormComponent = <EventRequestForm   initialData={frm.data} isReadOnly />;
        break;
      case 'DeleteClub':
        FormComponent = <DeleteClubForm     initialData={frm.data} isReadOnly />;
        break;
      default:
        FormComponent = <p>Unknown form type</p>;
    }
    setActiveForm({ ...frm, FormComponent });
    setModalOpen(true);
  };

  // Approve / Deny API call
  const handleDecision = async (formID, status) => {
    try {
      const res = await fetch(`http://localhost:5050/api/forms/${formID}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update form');
      }
      setForms(forms.filter(f => f.id !== formID));
      setModalOpen(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveForm(null);
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading forms…</p>;
  if (error)   return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <>
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          SU Admin: Pending Forms
        </h2>
        <FormRequestsTable
          requests={forms}
          onRowClick={handleRowClick}
        />
      </div>

      {modalOpen && activeForm && (
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
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(90%, 650px)',
              maxHeight: '90vh',
              backgroundColor: 'white',
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

            {activeForm.FormComponent}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={() => handleDecision(activeForm.id, 'Approved')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Approve
              </button>
              <button
                onClick={() => handleDecision(activeForm.id, 'Rejected')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
