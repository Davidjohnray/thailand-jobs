import Link from 'next/link'

export default function DukeLanguagePage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '64px 24px', textAlign: 'center' }}>
        <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ width: '180px', marginBottom: '24px' }} />
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
          Duke Language School
        </h1>
        <p style={{ color: '#ccc', maxWidth: '600px', margin: '0 auto 32px', fontSize: '16px', lineHeight: 1.7 }}>
          Professional Thai language courses in Bangkok for expats and teachers living in Thailand — from complete beginners to advanced learners.
        </p>
        <a href="https://dukelanguage.com/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: '#c9a84c', color: '#1a1a2e', padding: '14px 36px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
          Visit Duke Language School
        </a>
      </section>

      {/* WHY LEARN THAI */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1a2e', marginBottom: '20px', textAlign: 'center' }}>
          Why Teachers in Thailand Learn Thai
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
            <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1a1a2e' }}>Better at school</div>
            <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>Communicate with Thai staff and students with confidence.</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
            <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1a1a2e' }}>Easier daily life</div>
            <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>Markets, taxis, landlords and hospitals become far simpler.</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
            <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1a1a2e' }}>Visas and admin</div>
            <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>Immigration and government offices are smoother with basic Thai.</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
            <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1a1a2e' }}>Stand out</div>
            <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>Most foreign teachers never learn Thai — schools notice the ones who do.</div>
          </div>
        </div>
      </section>

      {/* COURSE TYPES */}
      <section style={{ background: '#1a1a2e', padding: '56px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>
            Course Types Available
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>One-on-One</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Group Classes</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Online Classes</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Intensive Courses</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT + CTA */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '56px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>About Duke Language School</h2>
        <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
          Duke Language School is one of Thailand's leading Thai language schools for foreigners and expats, with experienced teachers and courses designed for adult learners living and working in Thailand.
        </p>
        <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
          Whether you're brand new to Thailand or have been here for years, Duke's courses are built for people who want to get serious about learning Thai.
        </p>
        <a href="https://dukelanguage.com/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: '#3b5bdb', color: 'white', padding: '14px 36px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
          Visit Duke Language School
        </a>
      </section>

      <div style={{ textAlign: 'center', padding: '24px' }}>
        <Link href="/jobs/teaching" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px' }}>← Back to Teaching Jobs</Link>
      </div>
    </main>
  )
}
