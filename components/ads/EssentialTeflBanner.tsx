'use client'

export default function EssentialTeflBanner() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'banner_click', {
        banner_name: 'essential_tefl',
        banner_location: window.location.pathname,
      })
    }
  }

  return (
    <a href="/tefl/essential-tefl" onClick={handleClick} style={{ textDecoration: 'none' }}>
      <div
        style={{
          width: '240px',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          border: '2px solid #E85D26',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ background: '#E85D26', padding: '10px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
            🎓 Get TEFL Certified
          </div>
        </div>

        <div style={{ padding: '20px 16px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📜</div>
          <div style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '16px', marginBottom: '6px', lineHeight: '1.3' }}>
            In-Person Course in Bangkok
          </div>
          <div style={{ color: '#666', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>
            120-hour certification with real classroom practice & job placement support
          </div>
          <div style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block' }}>
            Learn More →
          </div>
        </div>
      </div>
    </a>
  )
}
