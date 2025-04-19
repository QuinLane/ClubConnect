import { useState } from 'react';
const token = localStorage.getItem('token');

export default function FundingRequestForm({ onSubmit }) {
  const dummyClubs = [
    'Chess Club',
    'Debate Team',
    'Photography Society',
    'Robotics Club',
    'Drama Club',
  ];

  const [clubName, setClubName] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [budgetBreakdown, setBudgetBreakdown] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      formType: 'Funding',
      details: {
        clubName,
        requestAmount,
        purpose,
        budgetBreakdown,
      },
    };

    try {
      const res = await fetch('http://localhost:5050/api/forms/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit funding request');
      }

      if (onSubmit) {
        onSubmit(payload.details);           // parent closes modal
      } else {
        alert('Funding request submitted!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- form ---------- */
  return (
    <div>
      <p>‎ </p>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Submit Funding Request
        </h2>
        <p style={{ color: '#6b7280' }}>Request financial support for your club.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field
          label="Club Name"
          value={clubName}
          onChange={setClubName}
          isSelect
          options={dummyClubs}
        />

        <Field
          label="Request Amount ($)"
          value={requestAmount}
          onChange={setRequestAmount}
          type="number"
          placeholder="Enter amount in USD"
          min="0"
          step="0.01"
        />

        <Field
          label="Purpose of Funding"
          value={purpose}
          onChange={setPurpose}
          isTextarea
          placeholder="Describe what the funding will be used for"
        />

        <Field
          label="Budget Breakdown"
          value={budgetBreakdown}
          onChange={setBudgetBreakdown}
          isTextarea
          placeholder="Provide detailed budget allocation"
          rows={5}
        />

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

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
      </form>
    </div>
  );
}

/* ---------- field component ---------- */
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
}) {
  const commonStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    resize: isTextarea ? 'vertical' : 'none',
  };

  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </label>

      {isSelect ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={{ ...commonStyle, cursor: 'pointer' }}
        >
          <option value="">Select your club</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          required
          placeholder={placeholder}
          style={{ ...commonStyle, minHeight: `${rows * 20}px` }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
          min={min}
          step={step}
          style={commonStyle}
        />
      )}
    </div>
  );
}
