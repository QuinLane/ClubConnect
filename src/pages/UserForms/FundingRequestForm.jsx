import React, { useState, useEffect } from 'react';

const token      = localStorage.getItem('token');
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userID     = storedUser.userID;

export default function FundingRequestForm({
  onSubmit,
  isReadOnly = false,
  initialData = {}
}) {
  // dynamic clubs fetch
  const [clubs,        setClubs]        = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  // form fields
  const [clubName,        setClubName]        = useState(initialData.clubName || '');
  const [requestAmount,   setRequestAmount]   = useState(initialData.requestAmount || '');
  const [purpose,         setPurpose]         = useState(initialData.purpose || '');
  const [budgetBreakdown, setBudgetBreakdown] = useState(initialData.budgetBreakdown || '');
  const [error,           setError]           = useState('');
  const [isLoading,       setIsLoading]       = useState(false);

  // fetch clubs the user is an exec of
  useEffect(() => {
    if (!userID) {
      setError('User not found; please log in again.');
      setLoadingClubs(false);
      return;
    }
    fetch(`http://localhost:5050/api/executives/user/${userID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load your clubs');
        return res.json();
      })
      .then(data => {
        const names = data.map(rec => rec.club.clubName);
        setClubs(names);
        // preload clubName when reviewing
        if (isReadOnly && initialData.clubName) {
          setClubName(initialData.clubName);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoadingClubs(false));
  }, [userID, isReadOnly, initialData]);

  // preload other fields when reviewing
  useEffect(() => {
    if (isReadOnly) {
      setRequestAmount(initialData.requestAmount || '');
      setPurpose(initialData.purpose || '');
      setBudgetBreakdown(initialData.budgetBreakdown || '');
    }
  }, [initialData, isReadOnly]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      formType: 'Funding',
      details: { clubName, requestAmount, purpose, budgetBreakdown },
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
        throw new Error(err.error || 'Failed to submit funding request');
      }

      if (onSubmit) onSubmit(payload.details);
      else alert('Funding request submitted!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1a1a1a',
          marginBottom: '0.5rem',
        }}>
          {isReadOnly ? 'Funding Request Review' : 'Submit Funding Request'}
        </h2>
        <p style={{ color: '#6b7280' }}>
          {isReadOnly
            ? 'Review the funding request details below.'
            : 'Request financial support for your club.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field
          label="Club Name"
          value={clubName}
          onChange={setClubName}
          isSelect
          options={clubs}
          loading={loadingClubs}
          readOnly={isReadOnly}
        />

        <Field
          label="Request Amount ($)"
          value={requestAmount}
          onChange={setRequestAmount}
          type="number"
          placeholder="Enter amount in USD"
          min="0"
          step="0.01"
          readOnly={isReadOnly}
        />

        <Field
          label="Purpose of Funding"
          value={purpose}
          onChange={setPurpose}
          isTextarea
          placeholder="Describe what the funding will be used for"
          readOnly={isReadOnly}
        />

        <Field
          label="Budget Breakdown"
          value={budgetBreakdown}
          onChange={setBudgetBreakdown}
          isTextarea
          placeholder="Provide detailed budget allocation"
          rows={5}
          readOnly={isReadOnly}
        />

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            fontSize: '0.875rem',
            borderRadius: '0.375rem',
            border: '1px solid #fecaca',
          }}>
            {error}
          </div>
        )}

        {!isReadOnly && (
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              backgroundColor: isLoading ? '#9ca3af' : '#10b981',
              color: 'white',
              fontWeight: 500,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: '0.5rem',
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
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
  isSelect = false,
  options = [],
  type = 'text',
  placeholder = '',
  min,
  step,
  rows = 4,
  readOnly = false,
  loading = false,
}) {
  const commonStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: readOnly ? '#f3f4f6' : 'white',
    outline: 'none',
    boxSizing: 'border-box',
    resize: isTextarea ? 'vertical' : 'none',
  };

  if (isSelect) {
    return (
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.25rem',
        }}>
          {label}
        </label>
        {readOnly ? (
          <div style={commonStyle}>{value}</div>
        ) : loading ? (
          <div style={{ ...commonStyle, color: '#6b7280' }}>Loading clubs…</div>
        ) : (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            style={{ ...commonStyle, cursor: 'pointer' }}
          >
            <option value="">Select your club</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
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
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.25rem',
        }}>
          {label}
        </label>
        <textarea
          value={value}
          onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
          rows={rows}
          required
          disabled={readOnly}
          placeholder={placeholder}
          style={{ ...commonStyle, minHeight: `${rows * 20}px` }}
        />
      </div>
    );
  }

  // default input
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '0.25rem',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        min={min}
        step={step}
        style={commonStyle}
        disabled={readOnly}
      />
    </div>
  );
}
