import React from 'react';

const MemberTable = ({ members, onRemoveMember }) => {
  const sortedMembers = [...members].sort((a, b) => 
    a.email.localeCompare(b.email)
  );

  // Constants for height calculation
  const rowHeight = 48; // Height of each row in pixels
  const headerHeight = 56; // Height of header section
  const maxVisibleRows = 13; // Max rows to show before scrolling

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
      width: '100%',
      maxHeight: `${tableHeight}px`,
      overflowY: 'auto',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMembers.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ padding: '12px', textAlign: 'center', color: '#888' }}>
                No members found.
              </td>
            </tr>
          ) : (
            sortedMembers.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{member.email}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                <button 
  onClick={() => onRemoveMember(member.id)}
  style={{
    backgroundColor: '#c0392b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '0.9em'
  }}
>
  Remove
</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
