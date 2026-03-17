import Link from 'next/link'

export default function CVBuilderPage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
          CV / Resume Builder
        </h1>
        <p style={{ color: '#ccc', fontSize: '16px', maxWidth: '560px', margin: '0 auto' }}>
          Create a professional CV in minutes. Perfect for teaching jobs and careers in Thailand.
        </p>
      </section>

      {/* PLANS */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>Choose Your Plan</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '48px', fontSize: '16px' }}>Start free or unlock more powerful features</p>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>

          {/* FREE PLAN */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #eee', flex: 1, minWidth: '260px', maxWidth: '320px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🆓</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Free</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e' }}>฿0</div>
              <div style={{ color: '#999', fontSize: '14px' }}>forever</div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['1 CV template', 'All basic sections', 'Download as PDF'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#444' }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/cv-builder/build" style={{ display: 'block', textAlign: 'center', background: '#1a1a2e', color: 'white', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              Build Free CV →
            </Link>
          </div>

          {/* STANDARD PLAN */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 8px 32px rgba(232,93,38,0.15)', border: '2px solid #E85D26', flex: 1, minWidth: '260px', maxWidth: '320px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#E85D26', color: 'white', padding: '4px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              MOST POPULAR
            </div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>⭐</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Standard</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#E85D26' }}>฿299</div>
              <div style={{ color: '#999', fontSize: '14px' }}>per month</div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Everything in Free', '5 CV templates', 'No watermark', 'Save up to 3 CVs', 'AI writing suggestions'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#444' }}>
                  <span style={{ color: '#E85D26', fontWeight: 'bold' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="https://buy.stripe.com/9B6aEQ7Jx5ovbVL4X6a7C00" style={{ display: 'block', textAlign: 'center', background: '#E85D26', color: 'white', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              Get Standard →
            </Link>
          </div>

          {/* PREMIUM PLAN */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 4px 16px rgba(45,107,228,0.12)', border: '2px solid #2D6BE4', flex: 1, minWidth: '260px', maxWidth: '320px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>💎</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Premium</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2D6BE4' }}>฿599</div>
              <div style={{ color: '#999', fontSize: '14px' }}>per month</div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Everything in Standard', '15+ CV templates', 'Unlimited saved CVs', 'Cover letter builder', 'LinkedIn import'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#444' }}>
                  <span style={{ color: '#2D6BE4', fontWeight: 'bold' }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="https://buy.stripe.com/00w7sE7Jx8AH0d3exGa7C01" style={{ display: 'block', textAlign: 'center', background: '#2D6BE4', color: 'white', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              Get Premium →
            </Link>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'white', padding: '60px 24px', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '48px', color: '#1a1a2e' }}>Why Use Our CV Builder?</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
            {[
              { icon: '⚡', title: 'Fast & Easy', desc: 'Build a professional CV in under 10 minutes' },
              { icon: '🇹🇭', title: 'Thailand Focused', desc: 'Templates designed for Thai employers and international schools' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Build your CV on any device, anywhere' },
              { icon: '📥', title: 'PDF Download', desc: 'Download and share your CV instantly' },
            ].map(f => (
              <div key={f.title} style={{ flex: 1, minWidth: '180px', maxWidth: '200px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#1a1a2e' }}>{f.title}</div>
                <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}