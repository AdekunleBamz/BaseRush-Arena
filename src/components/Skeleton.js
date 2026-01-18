// Skeleton Loading Component
// Displays animated skeleton placeholders for content loading states.
export default function Skeleton({ width = '100%', height = '20px', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite',
        borderRadius: '4px'
      }}
    />
  )
}

// Skeleton Card for stats
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card">
      <Skeleton width="60%" height="16px" className="skeleton-title" />
      <div style={{ marginTop: '12px' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            width={`${Math.random() * 40 + 60}%`}
            height="14px"
            style={{ marginBottom: '8px' }}
          />
        ))}
      </div>
    </div>
  )
}

// Skeleton Grid for multiple items
export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-item">
          <Skeleton width="100%" height="120px" />
        </div>
      ))}
    </div>
  )
}