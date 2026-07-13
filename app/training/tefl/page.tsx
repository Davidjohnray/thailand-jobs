import Link from 'next/link'

export default function TeflPage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <section style={{ background: '#1a1a2e', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📚</div>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>TEFL Courses in Thailand</h1>
        <p style={{ color: '#ccc', fontSize: '15px' }}>Get certified and start teaching English abroad</p>
        <Link href="/training" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', marginTop: '16px', display: 'inline-block' }}>← Back to Training</Link>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* COURSE LISTING - ESSENTIAL TEFL */}
        <Link href="/tefl/essential-tefl" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '2px solid #E85D26',
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
              width: '160px',
              minHeight: '160px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '56px',
            }}>
              📜
            </div>
            <div style={{ flex: 1, padding: '28px 24px', minWidth: '260px' }}>
              <div style={{
                display: 'inline-block',
                background: '#fff3ed',
                color: '#E85D26',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '20px',
                marginBottom: '10px',
              }}>
                In-Person · Bangkok
              </div>
              <h3 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
                120-Hour TEFL Certification
              </h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>
                Real classroom practice with actual students in Bangkok, plus{' '}
                <strong style={{ color: '#1a1a2e' }}>job placement support in some of Thailand's top schools</strong>.
                No prior experience needed.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {['🏫 Real Classroom', '🤝 Job Placement', '🌍 Global Classmates'].map(tag => (
                  <div key={tag} style={{ background: '#f8f9fa', color: '#444', fontSize: '12px', fontWeight: '600', padding: '5px 12px', borderRadius: '20px' }}>
                    {tag}
                  </div>
                ))}
              </div>
              <div style={{ background: '#E85D26', color: 'white', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }}>
                View Course Details →
              </div>
            </div>
          </div>
        </Link>

        {/* MORE COMING SOON */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px dashed #ddd' }}>
          <div style={{ fontSize: '40px', marginBottom: '14px' }}>🚧</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '10px' }}>More Courses Coming Soon</h2>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '28px', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto 28px' }}>
            We're building out a full directory of TEFL courses available in Thailand and online. Check back soon or get in touch to list your course here.
          </p>
          <Link href="/contact" style={{ background: '#1a1a2e', color: 'white', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', display: 'inline-block' }}>
            List Your TEFL Course
          </Link>
        </div>

      </section>

    </main>
  )
}
