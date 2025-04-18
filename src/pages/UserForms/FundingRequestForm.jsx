import { useState } from 'react';

export default function FundingRequestForm({ isReadOnly = false }) {
  const [clubName, setClubName] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [budgetBreakdown, setBudgetBreakdown] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response
      setRequestStatus('Under Review');
      
    } catch (err) {
      setError(err.message || 'Failed to submit funding request');
    } finally {
      setIsLoading(false);
    }
  };

  if (requestStatus) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '1rem'
          }}>
            Funding Request Status
          </h2>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem',
            fontWeight: '500'
          }}>
            Status: {requestStatus}
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Your funding request has been submitted successfully. The finance committee will review it.
          </p>
          <button
            onClick={() => setRequestStatus('')}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '0.5rem'
          }}>
            {isReadOnly ? 'Funding Request Review' : 'Submit Funding Request'}
          </h2>
          <p style={{ color: '#6b7280' }}>
            {isReadOnly ? 'Review the funding request details' : 'Request financial support for your club'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Field 
            label="Club Name" 
            value={clubName} 
            onChange={setClubName} 
            readOnly={isReadOnly} 
            placeholder="Enter your club name"
          />
          
          <Field 
            label="Request Amount ($)" 
            value={requestAmount} 
            onChange={setRequestAmount} 
            readOnly={isReadOnly} 
            type="number"
            placeholder="Enter amount in USD"
            min="0"
            step="0.01"
          />
          
          <Field 
            label="Purpose of Funding" 
            value={purpose} 
            onChange={setPurpose} 
            readOnly={isReadOnly} 
            isTextarea
            placeholder="Describe what the funding will be used for"
          />
          
          <Field 
            label="Budget Breakdown" 
            value={budgetBreakdown} 
            onChange={setBudgetBreakdown} 
            readOnly={isReadOnly} 
            isTextarea
            placeholder="Provide detailed budget allocation"
            rows={5}
          />

          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          {isReadOnly ? (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1.5rem'
            }}>
              <button
                type="button"
                onClick={() => alert('Approved!')}
                style={{
                  flex: 1,
                  marginRight: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => alert('Denied!')}
                style={{
                  flex: 1,
                  marginLeft: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Deny
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                backgroundColor: isLoading ? '#9ca3af' : '#10b981',
                color: 'white',
                fontWeight: '500',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '0.5rem'
              }}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ 
  label, 
  value, 
  onChange, 
  readOnly, 
  isTextarea, 
  type = 'text',
  placeholder = '',
  min,
  step,
  rows = 4
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

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.25rem'
      }}>
        {label}
      </label>
      {readOnly ? (
        <div style={commonStyle}>
          {value || <span style={{ color: '#9ca3af' }}>Not provided</span>}
        </div>
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