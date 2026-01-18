// ErrorMessage Component
// Displays error messages with optional retry functionality.
export default function ErrorMessage({ error, onRetry }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px',
      background: 'rgba(244, 67, 54, 0.1)',
      border: '1px solid rgba(244, 67, 54, 0.3)',
      borderRadius: '12px',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#f44336', marginBottom: '16px' }}>⚠️ Error</h3>
      <p style={{ marginBottom: '20px', opacity: 0.9 }}>
        {error?.message || 'Something went wrong. Please try again.'}
      </p>
      {/* Optional retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: '#f44336',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
