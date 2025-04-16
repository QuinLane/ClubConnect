import React from 'react';

const ExecutiveTable = ({ executives, onRemoveExecutive }) => {
  // Role priority for sorting
  const rolePriority = {
    'President': 1,
    'Vice President': 2,
    'VP': 2
  };

  const sortedExecutives = [...executives].sort((a, b) => {
    const aPriority = rolePriority[a.role] || 99;
    const bPriority = rolePriority[b.role] || 99;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.email.localeCompare(b.email);
  });

  const getRoleColor = (role) => {
    if (role === 'President') return '#1976d2';
    if (role === 'Vice President' || role === 'VP') return '#388e3c';
    return '#666';
  };

  // Calculate height based on number of entries (48px per row + 56px for header)
  const rowHeight = 48;
  const headerHeight = 56;
  const maxVisibleRows = 9;
  
  // Dynamic height calculation
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
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        flexShrink: 0
      }}>
        <h3 style={{ margin: 0 }}>Executives ({executives.length})</h3>
      </div>

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
                key={`${executive.role}-${executive.email}`} 
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
                }}>{executive.email}</td>
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
                    onClick={() => onRemoveExecutive(executive.email)}
                    style={{
                      background: '#000000',
                      border: '1px solid #000000',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        backgroundColor: '#333333',
                        borderColor: '#333333'
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