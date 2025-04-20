import React, { useState, useRef, useEffect } from 'react';

const EditableTitle = ({ text, onSave, isEditable, style }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editedText.trim() && editedText !== text) {
      onSave(editedText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedText(text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div onDoubleClick={handleDoubleClick} style={style}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            width: '100%',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
            fontFamily: 'inherit',
            border: '1px solid #ddd',
            padding: '4px',
            borderRadius: '4px'
          }}
        />
      ) : (
        <h1 style={{ margin: 0 }}>{text}</h1>
      )}
    </div>
  );
};

export default EditableTitle;