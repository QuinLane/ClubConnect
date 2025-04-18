import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FormRequestsTable = ({ requests, onRowClick }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return '#388e3c';
      case 'pending': return '#ff9800';
      case 'rejected': return '#d32f2f';
      default: return '#666';
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
      width: '100%'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f9f9f9',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Form</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Club</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr 
                key={request.id}
                onClick={() => handleRowClick(request)}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: request.id === selectedRequest ? '#1890ff' : 'transparent',
                  color: request.id === selectedRequest ? '#ffffff' : 'inherit',
                  cursor: 'pointer'
                }}
              >
                <td style={{ padding: '12px 16px' }}>
                  {request.formName || request.formType}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {request.clubName}
                </td>
                <td style={{ 
                  padding: '12px 16px',
                  color: request.id === selectedRequest ? '#ffffff' : getStatusColor(request.status)
                }}>
                  {request.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

FormRequestsTable.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      formName: PropTypes.string,
      formType: PropTypes.string.isRequired,
      clubName: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['Approved', 'Pending', 'Rejected']).isRequired,
    })
  ).isRequired,
  onRowClick: PropTypes.func.isRequired
};

export default FormRequestsTable;