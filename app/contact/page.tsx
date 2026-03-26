import Link from 'next/link'

export default function ContactPage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <a href="/" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>← Back to Home</a>

        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>💬</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Get in Touch</h1>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
            To contact us, please create a free member account or log in. You can send us a message directly through your account and we will reply there — no emails needed!
          </p>

          <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
            <p style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px', fontSize: '15px' }}>✅ Benefits of messaging via your account:</p>
            {[
              'Track all your messages in one place',
              'Get replies directly in your account',
              'No waiting on emails',
              'Ask about jobs, visa sponsorship & more',
              '100% free to join',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: '#555' }}>
                <span style={{ color: '#E85D26', fontWeight: 'bold' }}>→</span> {item}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/account/register" style={{ display: 'block', background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              Create Free Account →
            </Link>
            <Link href="/account/login" style={{ display: 'block', background: 'white', color: '#1a1a2e', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', border: '1px solid #ddd' }}>
              Login to My Account
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}