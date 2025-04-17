import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ApprovalTable = ({ requests, onRowClick }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Calculate height based on number of entries (48px per row + 56px for header)
  const rowHeight = 48;
  const headerHeight = 56;
  const maxVisibleRows = 9;
  
  // Dynamic height calculation
  const tableHeight = Math.min(
    requests.length * rowHeight + headerHeight,
    maxVisibleRows * rowHeight + headerHeight
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return '#388e3c'; // Green
      case 'pending': return '#ff9800';  // Orange
      case 'rejected': return '#d32f2f'; // Red
      default: return '#666';            // Gray
    }
  };

  const handleRowClick = (request) => {
    setSelectedRequest(request.id === selectedRequest ? null : request.id);
    onRowClick(request);
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      width: 'fit-content',
      minWidth: '600px',
      height: `${tableHeight}px`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Scrollable table body with headers */}
      <div style={{ 
        overflowY: requests.length > maxVisibleRows ? 'auto' : 'visible',
        flexGrow: 1
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f9f9f9',
              borderBottom: '1px solid #e0e0e0',
              position: requests.length > maxVisibleRows ? 'sticky' : 'static',
              top: 0,
              zIndex: 1
            }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '500',
                width: '30%'
              }}>Requester</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '500',
                width: '40%'
              }}>Request Type</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '500',
                width: '20%'
              }}>Status</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'right',
                fontWeight: '500',
                width: '10%'
              }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr 
                key={request.id}
                onClick={() => handleRowClick(request)}
                style={{
                  height: `${rowHeight}px`,
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: request.id === selectedRequest ? '#1890ff' : 'transparent',
                  color: request.id === selectedRequest ? '#ffffff' : 'inherit',
                  cursor: 'pointer',
                  ':hover': { 
                    backgroundColor: request.id === selectedRequest ? '#096dd9' : '#fafafa',
                    color: request.id === selectedRequest ? '#ffffff' : 'inherit'
                  }
                }}
              >
                <td style={{
                  padding: '12px 16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {request.requesterName || request.requesterEmail}
                </td>
                <td style={{
                  padding: '12px 16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {request.requestType}
                </td>
                <td style={{
                  padding: '12px 16px',
                  color: request.id === selectedRequest ? '#ffffff' : getStatusColor(request.status),
                  fontWeight: '500'
                }}>
                  {request.status}
                </td>
                <td style={{
                  padding: '12px 16px',
                  textAlign: 'right'
                }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(request);
                    }}
                    style={{
                      background: request.id === selectedRequest ? '#ffffff' : 'transparent',
                      border: 'none',
                      color: request.id === selectedRequest ? '#1890ff' : '#005587',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      ':hover': {
                        textDecoration: 'underline',
                        color: request.id === selectedRequest ? '#096dd9' : '#003366'
                      }
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ApprovalTable.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      requesterName: PropTypes.string,
      requesterEmail: PropTypes.string.isRequired,
      requestType: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['Approved', 'Pending', 'Rejected']).isRequired,
    })
  ).isRequired,
  onRowClick: PropTypes.func.isRequired
};

export default ApprovalTable;