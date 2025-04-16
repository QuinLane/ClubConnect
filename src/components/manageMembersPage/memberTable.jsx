import React from 'react';

const MemberTable = ({ members, onRemoveMember }) => {
  const sortedMembers = [...members].sort((a, b) => 
    a.email.localeCompare(b.email)
  );

  // Constants for height calculation
  const rowHeight = 48; // Height of each row in pixels
  const headerHeight = 56; // Height of header section
  const maxVisibleRows = 13; // Max rows to show before scrolling

  // Calculate dynamic height
  const tableHeight = Math.min(
    sortedMembers.length * rowHeight + headerHeight,
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
      height: `${tableHeight}px`, // Dynamic height
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        flexShrink: 0 // Prevent header from shrinking
      }}>
        <h3 style={{ margin: 0 }}>Members ({members.length})</h3>
      </div>

      {/* Scrollable table body - only scroll when more than maxVisibleRows */}
      <div style={{ 
        overflowY: sortedMembers.length > maxVisibleRows ? 'auto' : 'visible',
        flexGrow: 1 // Take up remaining space
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
              position: sortedMembers.length > maxVisibleRows ? 'sticky' : 'static',
              top: 0,
              zIndex: 1
            }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '500',
                width: '80%'
              }}>Email</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'right',
                fontWeight: '500',
                width: '20%'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedMembers.map((member) => (
              <tr 
                key={member.email} 
                style={{
                  height: `${rowHeight}px`, // Fixed row height
                  borderBottom: '1px solid #f0f0f0',
                  ':hover': { backgroundColor: '#fafafa' }
                }}
              >
                <td style={{
                  padding: '12px 16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{member.email}</td>
                <td style={{
                  padding: '12px 16px',
                  textAlign: 'right'
                }}>
                  <button 
                    onClick={() => onRemoveMember(member.email)}
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

export default MemberTable;