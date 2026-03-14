import Link from 'next/link'

export default function ThaiLanguagePage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <section style={{ background: '#1a1a2e', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🇹🇭</div>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Thai Language Schools</h1>
        <p style={{ color: '#ccc', fontSize: '15px' }}>Learn Thai from beginner to advanced level</p>
        <Link href="/training" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', marginTop: '16px', display: 'inline-block' }}>← Back to Training</Link>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px 32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px dashed #ddd' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Coming Soon</h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto 32px' }}>
            We are building a directory of Thai language schools across Thailand. Check back soon or get in touch to list your school here.
          </p>
          <Link href="/contact" style={{ background: '#2D6BE4', color: 'white', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', display: 'inline-block' }}>
            List Your Language School
          </Link>
        </div>
      </section>

    </main>
  )
}