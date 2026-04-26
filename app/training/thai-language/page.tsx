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

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Featured Thai Language School</h2>
          <p style={{ color: '#666', fontSize: '15px' }}>Trusted by expats and teachers living in Thailand</p>
        </div>

        {/* DUKE LANGUAGE SCHOOL CARD */}
        <a href="/sponsors/duke-language" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #3b5bdb' }}>
            <div style={{ background: '#3b5bdb', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Featured Sponsor</span>
            </div>
            <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ width: '180px', height: 'auto', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Duke Language School</h2>
                <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
                  Professional Thai language courses designed specifically for expats, teachers and business professionals living in Thailand. Whether you are a complete beginner or want to improve your existing Thai — Duke Language School has a course for you.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {['All levels welcome', 'Qualified teachers', 'Flexible schedule', 'Expat friendly'].map(tag => (
                    <span key={tag} style={{ background: '#eef2ff', color: '#3b5bdb', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ background: '#3b5bdb', color: 'white', padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }}>
                  Visit Duke Language School →
                </div>
              </div>
            </div>
          </div>
        </a>

        {/* LIST YOUR SCHOOL */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px dashed #ddd', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏫</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '10px' }}>Run a Thai Language School?</h2>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto 24px' }}>
            Get your school in front of thousands of expats and teachers living in Thailand. Contact us to discuss advertising options.
          </p>
          <Link href="/contact" style={{ background: '#2D6BE4', color: 'white', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', display: 'inline-block' }}>
            List Your Language School
          </Link>
        </div>

      </section>

    </main>
  )
}