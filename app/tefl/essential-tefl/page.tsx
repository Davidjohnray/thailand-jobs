'use client'

export default function EssentialTeflLandingPage() {
  const affiliateLink = 'https://www.essentialtefl.com/?ref=DAVIDRAY'

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'affiliate_click', {
        partner_name: 'essential_tefl',
      })
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', padding: '8px 20px', marginBottom: '24px' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>🎓 In-Person Certification · Bangkok</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '44px', fontWeight: 'bold', margin: '0 0 20px', lineHeight: '1.25' }}>
            Teach English Abroad with an<br />
            <span style={{ color: '#f59e0b' }}>In-Person TEFL Certification</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', margin: '0 0 8px', lineHeight: '1.7', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
            Get ready to teach English abroad with a 120-hour in-person certification course in Bangkok.
            More than just a qualification, this course brings you into a real classroom setting, where
            you'll connect with classmates from around the globe and gain hands-on experience with actual students.
          </p>
        </div>
      </section>

      {/* WHY IN-PERSON */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Why Study In-Person</h2>
            <p style={{ color: '#666', fontSize: '17px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.7' }}>
              Unlike online courses, an in-person course prepares you for real world classroom teaching
              by building your skills in a live environment. Yes, it may cost more — but the value is unmatched.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { emoji: '🏫', title: 'Real Classroom Practice', desc: 'Hands-on teaching practice sessions with actual students, not just theory.' },
              { emoji: '🌍', title: 'Global Classmates', desc: 'Connect with classmates from around the globe and build lifelong friendships.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#f8f9fa', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 10px' }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Job placement highlight card */}
          <div style={{
            marginTop: '24px',
            background: 'linear-gradient(135deg, #E85D26, #f59e0b)',
            borderRadius: '16px',
            padding: '32px 28px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🤝</div>
            <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px' }}>
              Job Placement in Thailand's Top Schools
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '15px', margin: 0, lineHeight: '1.6', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
              Graduate with the confidence to teach students worldwide — and a direct path into
              some of Thailand's best schools.
            </p>
          </div>
        </div>
      </section>

      {/* NO EXPERIENCE NEEDED */}
      <section style={{ padding: '80px 24px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💪</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>
            No Prior Experience? No Problem.
          </h2>
          <p style={{ color: '#666', fontSize: '17px', lineHeight: '1.7', margin: 0 }}>
            All you need is fluency in English and the drive to teach! You'll be guided every step of the way,
            from your first lesson plan through to your first day in front of a class.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: '#1a1a2e', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px' }}>
            Ready to start your journey to teaching in Thailand?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: '0 0 32px' }}>
            You'll be taken to view course dates and pricing.
          </p>
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={handleCtaClick}
            style={{ background: '#E85D26', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px', display: 'inline-block' }}
          >
            View This Course →
          </a>
        </div>
      </section>

    </main>
  )
}
