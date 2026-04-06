'use client'
import Link from 'next/link'

export default function Ages710Page() {
  const subjects = [
    { id: 'english', label: 'English', desc: 'Reading, writing, grammar, and comprehension', color: '#2D6BE4', icon: 'E' },
    { id: 'math', label: 'Math', desc: 'Numbers, operations, geometry, and problem solving', color: '#0891b2', icon: 'M' },
    { id: 'science', label: 'Science', desc: 'Living things, materials, forces, and the environment', color: '#16a34a', icon: 'S' },
    { id: 'social', label: 'Social Studies', desc: 'Community, history, geography, and culture', color: '#d97706', icon: 'SS' },
  ]

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to ESL Resources</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{ fontSize: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '8px 16px', fontWeight: 'bold' }}>P</div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 7–10</h1>
              <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 4px' }}>Primary School</p>
              <p style={{ opacity: 0.8, fontSize: '14px', margin: 0 }}>Lesson plans covering English, Math, Science, and Social Studies.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a2e', padding: '16px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: '#FBBF24', fontWeight: 'bold', fontSize: '15px' }}>💰 Premium plans: 10฿ each</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold' }}>✅ Free plans available in every subject</span>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px', textAlign: 'center' }}>Choose a Subject</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>Select a subject to browse lesson plans</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {subjects.map(sub => (
            <Link key={sub.id} href={`/esl-resources/ages-7-10/${sub.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: `linear-gradient(135deg, ${sub.color}, ${sub.color}cc)`, borderRadius: '16px', padding: '32px 20px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: `0 4px 20px ${sub.color}40`, transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '8px' }}>{sub.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>{sub.label}</h3>
                <p style={{ opacity: 0.85, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>{sub.desc}</p>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>Browse →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}