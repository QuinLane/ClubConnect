import React, { useState, useEffect } from 'react';

const token      = localStorage.getItem('token');
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID     = storedUser.userID ?? null;

export default function CreateClubForm({
  onSubmit,
  isReadOnly    = false,
  initialData   = {}
}) {
  const [clubName,         setClubName]         = useState(initialData.clubName        || '');
  const [description,      setDescription]      = useState(initialData.description     || '');
  const [category,         setCategory]         = useState(initialData.category        || '');
  const [meetingTime,      setMeetingTime]      = useState(initialData.meetingTime     || '');
  const [website,          setWebsite]          = useState(initialData.website         || '');
  const [clubEmail,        setClubEmail]        = useState(initialData.clubEmail       || '');
  const [socialLinksText,  setSocialLinksText]  = useState(
    initialData.socialMediaLinks);
  const [error,            setError]            = useState('');
  const [isLoading,        setIsLoading]        = useState(false);

  // preload when viewing existing
  useEffect(() => {
    if (isReadOnly) {
      setClubName(initialData.clubName        || '');
      setDescription(initialData.description  || '');
      setCategory(initialData.category        || '');
      setMeetingTime(initialData.meetingTime  || '');
      setWebsite(initialData.website          || '');
      setClubEmail(initialData.clubEmail      || '');
      setSocialLinksText(initialData.socialMediaLinks);
    }
  }, [initialData, isReadOnly]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // send raw string for socialMediaLinks, backend will parse JSON
    const payload = {
      formType: 'ClubCreation',
      details: {
        clubName,
        description,
        category,
        meetingTime,
        website,
        clubEmail,
        socialMediaLinks: socialLinksText,
        president: userID
      },
    };

    try {
      const res = await fetch(`http://localhost:5050/api/forms/${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit club request');
      }
      if (onSubmit) onSubmit(payload.details);
      else alert('Club creation request submitted!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p>‎</p>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1a1a1a',
          marginBottom: '0.5rem',
        }}>
          {isReadOnly ? 'Club Request Review' : 'Create a New Club'}
        </h2>
        <p style={{ color: '#6b7280' }}>
          {isReadOnly
            ? 'Review the club details below.'
            : 'Fill out the form to register your club.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field
          label="Club Name"
          value={clubName}
          onChange={setClubName}
          readOnly={isReadOnly}
        />

        <Field
          label="Description"
          value={description}
          onChange={setDescription}
          isTextarea
          readOnly={isReadOnly}
        />

        <Field
          label="Category"
          value={category}
          onChange={setCategory}
          isSelect
          options={['Academic','Cultural','Sports','Arts','Volunteer','Other']}
          readOnly={isReadOnly}
        />

        <Field
          label="Meeting Time"
          value={meetingTime}
          onChange={setMeetingTime}
          readOnly={isReadOnly}
        />

        <Field
          label="Website"
          value={website}
          onChange={setWebsite}
          placeholder="https://example.com"
          readOnly={isReadOnly}
        />

        <Field
          label="Club Email"
          value={clubEmail}
          onChange={setClubEmail}
          type="email"
          placeholder="you@club.com"
          readOnly={isReadOnly}
        />

        <Field
          label="Social Media Links (comma-separated)"
          value={socialLinksText}
          onChange={setSocialLinksText}
          isTextarea
          rows={2}
          placeholder="https://twitter.com/... , https://facebook.com/..."
          readOnly={isReadOnly}
        />

        {error && (
          <div style={{
            padding:'0.75rem',
            backgroundColor:'#fef2f2',
            color:'#dc2626',
            fontSize:'0.875rem',
            borderRadius:'0.375rem',
            border:'1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {!isReadOnly && (
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width:'100%',
              padding:'0.75rem',
              borderRadius:'0.375rem',
              backgroundColor: isLoading ? '#9ca3af' : '#4f46e5',
              color:'white',
              fontWeight:500,
              border:'none',
              cursor: isLoading ? 'not-allowed':'pointer',
              transition:'all 0.2s',
              marginTop:'0.5rem'
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit Club Request'}
          </button>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  isTextarea = false,
  isSelect   = false,
  options    = [],
  type       = 'text',
  placeholder= '',
  readOnly   = false,
  rows       = 4
}) {
  const style = {
    width:'100%',
    padding:'0.75rem',
    borderRadius:'0.375rem',
    border:'1px solid #d1d5db',
    backgroundColor: readOnly ? '#f3f4f6' : 'white',
    outline:'none',
    boxSizing:'border-box',
    resize: isTextarea ? 'vertical' : 'none'
  };

  if (isSelect) {
    return (
      <div>
        <label style={{
          display:'block', fontSize:'0.875rem', fontWeight:500,
          color:'#374151', marginBottom:'0.25rem'
        }}>
          {label}
        </label>
        {readOnly ? (
          <div style={style}>{value}</div>
        ) : (
          <select
            value={value}
            onChange={e=>onChange(e.target.value)}
            required
            style={{ ...style, cursor:'pointer' }}
          >
            <option value="">Select a category</option>
            {options.map(o=>(
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        )}
      </div>
    );
  }

  if (isTextarea) {
    return (
      <div>
        <label style={{
          display:'block', fontSize:'0.875rem', fontWeight:500,
          color:'#374151', marginBottom:'0.25rem'
        }}>
          {label}
        </label>
        {readOnly ? (
          <div style={style}>{value}</div>
        ) : (
          <textarea
            value={value}
            onChange={e=>onChange(e.target.value)}
            rows={rows}
            required
            placeholder={placeholder}
            style={{ ...style, minHeight:`${rows*20}px` }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <label style={{
        display:'block', fontSize:'0.875rem', fontWeight:500,
        color:'#374151', marginBottom:'0.25rem'
      }}>
        {label}
      </label>
      {readOnly ? (
        <div style={style}>{value}</div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e=>onChange(e.target.value)}
          required
          placeholder={placeholder}
          style={style}
        />
      )}
    </div>
  );
}
