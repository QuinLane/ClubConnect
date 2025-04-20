import React, { useState } from 'react';

const Bio = ({ text, width = '400px', height = '400px', isEditable = false, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleDoubleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    onSave(editedText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
  };

  return (
    <div 
      style={{
        width: width,
        height: height,
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isEditable ? 'pointer' : 'default'
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div style={{ padding: '10px' }}>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            style={{
              width: '100%',
              height: '80%',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px',
              marginBottom: '10px'
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={buttonStyle('#4CAF50')}>Save</button>
            <button onClick={handleCancel} style={buttonStyle('#f44336')}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#333333',
          height: '100%',
          overflowY: 'auto',
          paddingRight: '5px',
          textAlign: 'center',
          padding: '10px'
        }}>
          {text}
        </div>
      )}
    </div>
  );
};

const buttonStyle = (bgColor) => ({
  padding: '8px 16px',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});

export default Bio;