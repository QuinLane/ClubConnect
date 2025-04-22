import React from 'react';
import PropTypes from 'prop-types';

const FormRequestsTable = ({ requests, onRowClick, selectedId, maxHeight = '400px' }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return '#388e3c';
      case 'pending':  return '#ff9800';
      case 'rejected': return '#d32f2f';
      default:         return '#666';
    }
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      width: '100%',
      maxHeight: maxHeight,
      overflow: 'auto'            
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Form Type</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Club</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr
              key={request.id}
              onClick={() => onRowClick(request)}
              style={{
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: request.id === selectedId ? '#1890ff' : 'transparent',
                color:            request.id === selectedId ? '#ffffff' : 'inherit',
                cursor: 'pointer'
              }}
            >
              <td style={{ padding: '12px 16px' }}>{request.formType}</td>
              <td style={{ padding: '12px 16px' }}>{request.clubName}</td>
              <td style={{
                padding: '12px 16px',
                color: request.id === selectedId
                  ? '#ffffff'
                  : getStatusColor(request.status)
              }}>
                {request.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

FormRequestsTable.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id:        PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      formType:  PropTypes.string.isRequired,
      clubName:  PropTypes.string.isRequired,
      status:    PropTypes.oneOf(['Approved','Pending','Rejected']).isRequired,
    })
  ).isRequired,
  onRowClick: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight:  PropTypes.string
};

export default FormRequestsTable;
