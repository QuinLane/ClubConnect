import React, { useState } from 'react';
import ApprovalTable from '../components/tables/approvalTable';

const RequestPage = () => {
  // Sample approval request data
  const [requests, setRequests] = useState([
    {
      id: 1,
      requesterName: 'Alex Johnson',
      requesterEmail: 'alex@su.edu',
      requestType: 'Budget Approval',
      status: 'Pending',
      details: 'Requesting $5,000 for conference expenses'
    },
    {
      id: 2,
      requesterName: 'Sam Wilson',
      requesterEmail: 'sam@su.edu',
      requestType: 'Leave Request',
      status: 'Approved',
      details: 'Vacation leave from June 10-17'
    },
    {
      id: 3,
      requesterName: 'Jordan Lee',
      requesterEmail: 'jordan@su.edu',
      requestType: 'Equipment Purchase',
      status: 'Rejected',
      details: 'New laptop for research work'
    },
    {
      id: 4,
      requesterName: 'Taylor Smith',
      requesterEmail: 'taylor@su.edu',
      requestType: 'Travel Authorization',
      status: 'Pending',
      details: 'Conference in San Francisco next month'
    },
    {
      id: 5,
      requesterName: 'Casey Kim',
      requesterEmail: 'casey@su.edu',
      requestType: 'Software License',
      status: 'Pending',
      details: 'Adobe Creative Cloud subscription'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    console.log('Selected request:', request);
    // In a real app, you might open a modal or navigate to a detail view here
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: '#005587',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        Approval Requests Dashboard
      </h1>

      {/* Main content container with two columns */}
      <div style={{
        display: 'flex',
        gap: '40px' // Increased from 20px to 40px for more space between containers
      }}>
        {/* Left column - Approval Table */}
        <div style={{
          flex: '1',
          minWidth: '0' // prevents flex items from overflowing
        }}>
          <ApprovalTable 
            requests={requests} 
            onRowClick={handleRowClick} 
          />
        </div>

        {/* Right column - Blank container */}
        <div style={{
          flex: '1',
          minWidth: '0',
          border: '1px dashed #ccc',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#fafafa',
          minHeight: '400px'
        }}>
          {selectedRequest ? (
            <>
              <h2 style={{ 
                color: '#005587',
                marginTop: 0,
                borderBottom: '1px solid #ddd',
                paddingBottom: '10px'
              }}>
                Request Details
              </h2>
              <div style={{ marginBottom: '10px' }}>
                <strong>Requester:</strong> {selectedRequest.requesterName} ({selectedRequest.requesterEmail})
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Type:</strong> {selectedRequest.requestType}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> 
                <span style={{ 
                  color: selectedRequest.status === 'Approved' ? '#388e3c' :
                        selectedRequest.status === 'Rejected' ? '#d32f2f' : '#ff9800',
                  fontWeight: '500',
                  marginLeft: '8px'
                }}>
                  {selectedRequest.status}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Details:</strong> {selectedRequest.details}
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#388e3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Approve
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Reject
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  More Info
                </button>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#666',
              padding: '40px 0'
            }}>
              Select a request from the table to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestPage;