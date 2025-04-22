import React, { useState } from 'react';

const Bio = ({ text, width = '800px', height = '800px', isEditable = false, onSave }) => {
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
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isEditable ? 'pointer' : 'default',
        padding: '15px', 
        boxSizing: 'border-box' 
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div style={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            style={{
              width: '90%',
              height: '80%',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '10px',
              marginBottom: '15px',
              fontSize: '14px',
              resize: 'none'
            }}
          />
          <div style={{ 
            display: 'flex', 
            gap: '15px',
            width: '90%',
            justifyContent: 'center'
          }}>
            <button onClick={handleSave} style={buttonStyle('#4CAF50')}>Save</button>
            <button onClick={handleCancel} style={buttonStyle('#f44336')}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#333333',
          overflowY: 'auto', 
          textAlign: 'center',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word' 
        }}>
          {text}
        </div>
      )}
    </div>
  );
};

const buttonStyle = (bgColor) => ({
  padding: '10px 20px',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  minWidth: '100px'
});

export default Bio;