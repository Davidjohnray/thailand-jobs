import Link from 'next/link'

export default function ComingSoon() {
  return (
    <main style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
      <div>
        <div style={{ fontSize: '60px', marginBottom: '24px' }}>🇹🇭</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>Thai Expat Services</h1>
        <div style={{ background: '#E85D26', color: 'white', display: 'inline-block', padding: '8px 24px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', marginBottom: '24px', letterSpacing: '2px' }}>
          COMING SOON
        </div>
        <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '32px', maxWidth: '400px', lineHeight: '1.6' }}>
          Visas, work permits & expat services in Thailand. We are launching soon — check back shortly!
        </p>
        <Link href="/" style={{ background: '#E85D26', color: 'white', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
          ← Back to Jobs
        </Link>
      </div>
    </main>
  )
}