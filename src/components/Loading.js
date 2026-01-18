// Loading Component
// Displays a spinning loader with customizable message for loading states.
export default function Loading({ message = 'Loading...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      {/* Spinning loader animation */}
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite, pulse 2s infinite',
        margin: '0 auto 16px'
      }} />
      <p style={{ animation: 'fadeIn 1s ease-in' }}>{message}</p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
