import React from 'react';

const ExecutiveTable = ({ executives, onRemoveExecutive }) => {
  // Simple sort by email
  const sortedExecutives = [...executives].sort((a, b) => 
    a.email.localeCompare(b.email)
  );

  const getRoleColor = (role) => {
    if (role === 'President') return '#1976d2';
    if (role === 'Vice President' || role === 'VP') return '#388e3c';
    return '#666';
  };

  // Calculate height based on number of entries
  const rowHeight = 48;
  const headerHeight = 56; // This is for column headers only now
  const maxVisibleRows = 9;
  
  const tableHeight = Math.min(
    sortedExecutives.length * rowHeight + headerHeight,
    maxVisibleRows * rowHeight + headerHeight
  );

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      width: 'fit-content',
      minWidth: '350px',
      height: `${tableHeight}px`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Removed the "Executives" header div completely */}
      
      {/* Scrollable table body */}
      <div style={{ 
        overflowY: sortedExecutives.length > maxVisibleRows ? 'auto' : 'visible',
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
              position: sortedExecutives.length > maxVisibleRows ? 'sticky' : 'static',
              top: 0,
              zIndex: 1
            }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '500',
                width: '50%'
              }}>Email</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '500',
                width: '30%'
              }}>Role</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'right',
                fontWeight: '500',
                width: '20%'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExecutives.map((executive) => (
              <tr 
                key={executive.id}
                style={{
                  height: `${rowHeight}px`,
                  borderBottom: '1px solid #f0f0f0',
                  ':hover': { backgroundColor: '#fafafa' }
                }}
              >
                <td style={{
                  padding: '12px 16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {executive.email}
                </td>
                <td style={{
                  padding: '12px 16px',
                  color: getRoleColor(executive.role),
                  fontWeight: '500'
                }}>
                  {executive.role}
                </td>
                <td style={{
                  padding: '12px 16px',
                  textAlign: 'right'
                }}>
                  <button 
                    onClick={() => onRemoveExecutive(executive.id)}
                    style={{
                      background: '#ff4444',
                      border: '1px solid #ff4444',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        backgroundColor: '#cc0000',
                        borderColor: '#cc0000'
                      }
                    }}
                  >
                    Remove
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

export default ExecutiveTable;