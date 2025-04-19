import React, { useState } from 'react';

const MemberTable = ({ members, onRemoveMember, onUpdateRole }) => {
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editedRole, setEditedRole] = useState('');

  const sortedMembers = [...members].sort((a, b) =>
    a.email.localeCompare(b.email)
  );

  const rowHeight = 48;
  const headerHeight = 56;
  const maxVisibleRows = 13;

  const tableHeight = Math.min(
    sortedMembers.length * rowHeight + headerHeight,
    maxVisibleRows * rowHeight + headerHeight
  );

  const handleDoubleClick = (member) => {
    setEditingMemberId(member.id);
    setEditedRole(member.role || '');
  };

  const handleRoleChange = (e) => {
    setEditedRole(e.target.value);
  };

  const handleBlur = (memberId) => {
    if (editedRole.trim() !== '') {
      onUpdateRole(memberId, editedRole.trim());
    }
    setEditingMemberId(null);
  };

  const handleKeyDown = (e, memberId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur(memberId);
    } else if (e.key === 'Escape') {
      setEditingMemberId(null);
    }
  };

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
            <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMembers.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: '12px', textAlign: 'center', color: '#888' }}>
                No members found.
              </td>
            </tr>
          ) : (
            sortedMembers.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{member.email}</td>
                <td
                  style={{ padding: '12px', cursor: 'pointer' }}
                  onDoubleClick={() => handleDoubleClick(member)}
                >
                  {editingMemberId === member.id ? (
                    <input
                      type="text"
                      value={editedRole}
                      onChange={handleRoleChange}
                      onBlur={() => handleBlur(member.id)}
                      onKeyDown={(e) => handleKeyDown(e, member.id)}
                      autoFocus
                      style={{
                        width: '100%',
                        fontSize: '1em',
                        padding: '4px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    />
                  ) : (
                    member.role || <span style={{ color: '#aaa' }}>(no role)</span>
                  )}
                </td>
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
                      fontSize: '0.9em',
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
