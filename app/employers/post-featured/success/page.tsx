import Link from 'next/link'

export default function FeaturedSuccess() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px 32px', maxWidth: '520px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Payment Successful!</h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
          Your featured job listing is now live! It will appear on the homepage and at the top of search results for 14 days.
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
          <p style={{ color: '#166534', fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px' }}>✅ Your listing is now:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Visible on the homepage', 'Featured at the top of job listings', 'Highlighted with a ⭐ Featured badge', 'Active for 14 days'].map(item => (
              <li key={item} style={{ fontSize: '13px', color: '#166534' }}>• {item}</li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/jobs" style={{ display: 'block', background: '#E85D26', color: 'white', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
            View All Jobs →
          </Link>
          <Link href="/employers/post-featured" style={{ display: 'block', background: 'white', color: '#666', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', border: '1px solid #ddd' }}>
            Post Another Job
          </Link>
        </div>
      </div>
    </main>
  )
}
