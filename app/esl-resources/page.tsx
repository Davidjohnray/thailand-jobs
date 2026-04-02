'use client'
import Link from 'next/link'

export default function ESLResourcesPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E85D26 100%)', padding: '70px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>📖</div>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 14px', letterSpacing: '-1px' }}>ESL Resources</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '560px', margin: '0 auto 10px' }}>
          Ready-to-teach ESL lesson plans for all ages
        </p>
        <p style={{ fontSize: '14px', opacity: 0.75, maxWidth: '480px', margin: '0 auto' }}>
          Designed for bilingual schools, private kindergartens, and ESL programs in Thailand
        </p>
      </div>

      {/* PRICING BAR */}
      <div style={{ background: '#1a1a2e', padding: '20px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: '#FBBF24', fontWeight: 'bold', fontSize: '14px', marginRight: '8px' }}>💰 Pricing:</span>
          {[
            { label: 'Single', usd: '$1', thb: '35฿' },
            { label: '5-Pack', usd: '$4', thb: '140฿' },
            { label: '10-Pack', usd: '$7.50', thb: '250฿' },
            { label: '20-Pack', usd: '$14', thb: '490฿' },
          ].map((item, i) => (
            <span key={i} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '13px', padding: '6px 14px', borderRadius: '20px' }}>
              {item.label}: <strong style={{ color: '#FBBF24' }}>{item.usd}</strong> / {item.thb}
            </span>
          ))}
          <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 'bold', marginLeft: '8px' }}>✅ Free plans available</span>
        </div>
      </div>

      {/* AGE GROUP BANNERS */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px', textAlign: 'center' }}>Choose an Age Group</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>Select the age group you teach to browse lesson plans</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '56px' }}>

          {/* UNDER 5S */}
          <Link href="/esl-resources/under-5s" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(249,115,22,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🐣</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Under 5s</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 16px' }}>Ages 3–4 · Pre-K</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>Simple vocabulary, movement, and songs. No reading or writing.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                Browse Plans →
              </span>
            </div>
          </Link>

          {/* AGES 5-6 */}
          <Link href="/esl-resources/ages-5-6" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🌟</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 5–6</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 16px' }}>K1–K2</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>Vocabulary, guided practice, and speaking activities.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                Browse Plans →
              </span>
            </div>
          </Link>

          {/* AGES 7-10 */}
<Link href="/esl-resources/ages-7-10" style={{ textDecoration: 'none' }}>
  <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(8,145,178,0.3)', transition: 'transform 0.2s' }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
    <div style={{ fontSize: '52px', marginBottom: '12px' }}>📗</div>
    <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 7–10</h3>
    <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 16px' }}>Primary School</p>
    <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>English, Math, Science, and Social Studies.</p>
    <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
      Browse Plans →
    </span>
  </div>
</Link>

{/* AGES 11+ */}
<Link href="/esl-resources/ages-11-plus" style={{ textDecoration: 'none' }}>
  <div style={{ background: 'linear-gradient(135deg, #2D6BE4, #4f8ef7)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,107,228,0.3)', transition: 'transform 0.2s' }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
    <div style={{ fontSize: '52px', marginBottom: '12px' }}>📘</div>
    <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 11+</h3>
    <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 16px' }}>Secondary School</p>
    <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>English, Math, Science, and Social Studies.</p>
    <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
      Browse Plans →
    </span>
  </div>
</Link>

        </div>

        {/* INFO STRIP */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '36px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { icon: '🎯', title: 'All Ages', desc: 'Starting with Pre-K and K1–K2, with more age groups coming soon.' },
            { icon: '⏱️', title: '30–45 Min', desc: 'Short structured stages: routine, vocabulary, activity, practice, review.' },
            { icon: '🏫', title: 'School Ready', desc: 'Used by bilingual schools and private kindergartens across Thailand.' },
            { icon: '✅', title: 'No Prep', desc: 'Print and teach. Flashcards, worksheets, and teacher notes included.' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px', fontSize: '15px' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}