import React from 'react';

const FormDetails = () => {
  // Hardcoded form data
  const formData = {
    formTitle: "Club Registration Form",
    submissionDate: "October 15, 2023",
    submittedBy: "john.doe@university.edu",
    details: {
      clubName: "Computer Science Society",
      category: "Academic",
      meetingSchedule: "Every Wednesday 4-5pm",
      advisor: "Dr. Sarah Johnson",
      membersCount: 42,
      budgetRequested: "$1,200",
      description: "A club for students interested in computer science research and projects."
    }
  };

  const handleApprove = () => {
    console.log("Form approved");
    // Add your approval logic here
  };

  const handleReject = () => {
    console.log("Form rejected");
    // Add your rejection logic here
  };

  // Reusable detail row component
  const DetailItem = ({ label, value, isFullWidth = false }) => (
    <div style={{
      display: 'flex',
      flexDirection: isFullWidth ? 'column' : 'row',
      marginBottom: '1rem'
    }}>
      <dt style={{
        width: isFullWidth ? '100%' : '33%',
        fontWeight: '500',
        color: '#000'
      }}>{label}</dt>
      <dd style={{
        width: isFullWidth ? '100%' : '67%',
        color: '#000',
        marginTop: isFullWidth ? '0.25rem' : '0'
      }}>{value}</dd>
    </div>
  );

  return (
    <div style={{
      maxWidth: '42rem',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: '#fff',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#000',
        marginBottom: '1rem'
      }}>{formData.formTitle}</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{
          fontSize: '0.875rem',
          color: '#000',
          opacity: '0.7'
        }}>Submitted on: {formData.submissionDate}</p>
        <p style={{
          fontSize: '0.875rem',
          color: '#000',
          opacity: '0.7'
        }}>Submitted by: {formData.submittedBy}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DetailItem label="Club Name" value={formData.details.clubName} />
        <DetailItem label="Category" value={formData.details.category} />
        <DetailItem label="Meeting Schedule" value={formData.details.meetingSchedule} />
        <DetailItem label="Faculty Advisor" value={formData.details.advisor} />
        <DetailItem label="Current Members" value={formData.details.membersCount} />
        <DetailItem label="Budget Requested" value={formData.details.budgetRequested} />
        <DetailItem 
          label="Description" 
          value={formData.details.description} 
          isFullWidth 
        />
      </div>

      <div style={{
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: "space-evenly",
        gap: '1rem'
      }}>
        <button
          onClick={handleReject}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: '1px solid #dc2626',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Reject
        </button>
        <button
          onClick={handleApprove}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: '1px solid #2563eb',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default FormDetails;