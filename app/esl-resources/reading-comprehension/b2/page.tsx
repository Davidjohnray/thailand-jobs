'use client'
import Link from 'next/link'

const LESSONS = [
  {
    id: 'ai-smart-glasses',
    title: 'Next‑Gen AI Smart Glasses',
    emoji: '👓',
    description: 'A New Way to See the World',
    heroDescription: 'Explore how AI‑powered smart glasses are changing daily life, work, travel and social interaction.',
    badges: ['B2 Upper‑Intermediate', 'Technology', '4 parts · 12 questions'],
    color: '#6366f1',
  },
  {
    id: 'ai-home-robots',
    title: 'AI‑Powered Home Robots',
    emoji: '🤖',
    description: 'Living with Intelligent Machines',
    heroDescription: 'Explore how AI robots are changing life at home, raising questions about privacy, trust and the future of human connection.',
    badges: ['B2 Upper‑Intermediate', 'Technology & Society', '4 parts · 12 questions'],
    color: '#ec4899',
  },
  {
    id: 'holographic-displays',
    title: 'Holographic Display Gadgets',
    emoji: '🪄',
    description: 'From Science Fiction to Consumer Technology',
    heroDescription: 'Explore how holographic technology is moving from science fiction to reality, changing business, education and culture.',
    badges: ['B2 Upper‑Intermediate', 'Emerging Tech', '4 parts · 12 questions'],
    color: '#14b8a6',
  },
  {
    id: 'ai-everyday-life',
    title: 'Artificial Intelligence in Everyday Life',
    emoji: '🧠',
    description: 'How AI Shapes Our Daily World',
    heroDescription: 'From voice assistants and smart homes to work, education, and ethics — understand how AI is transforming everyday life.',
    badges: ['B2 Upper‑Intermediate', 'AI & Society', '4 parts · 12 questions'],
    color: '#3b82f6',
  },
]

export default function B2ReadingHub() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>
            ← B2 Reading Comprehension
          </Link>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px' }}>Future Tech & Society</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
              Explore how emerging technologies are reshaping daily life, work, and human connection.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['📚 4 reading topics', '💬 48 discussion questions', '🌍 Multi‑language support', '🤖 AI conversation partner'].map(f => (
                <span key={f} style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '40px', color: 'white', fontSize: '13px', fontWeight: '500' }}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
          {LESSONS.map(lesson => (
            <div
              key={lesson.id}
              style={{
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 20px 32px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{ background: `linear-gradient(135deg, ${lesson.color}22, ${lesson.color}08)`, padding: '24px 24px 16px' }}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>{lesson.emoji}</div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 6px' }}>{lesson.title}</h2>
                <p style={{ color: lesson.color, fontWeight: '600', fontSize: '14px', margin: 0 }}>{lesson.description}</p>
              </div>
              <div style={{ padding: '20px 24px', flex: 1 }}>
                <p style={{ color: '#4b5563', lineHeight: '1.6', margin: '0 0 20px', fontSize: '15px' }}>
                  {lesson.heroDescription}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {lesson.badges.map(badge => (
                    <span key={badge} style={{ background: '#f3f4f6', color: '#374151', fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                <Link
                  href={`/esl-resources/reading-comprehension/b2/${lesson.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: lesson.color,
                    color: 'white',
                    textDecoration: 'none',
                    padding: '12px 20px',
                    borderRadius: '40px',
                    fontWeight: '700',
                    fontSize: '14px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1e1b4b')}
                  onMouseLeave={e => (e.currentTarget.style.background = lesson.color)}
                >
                  Open Lesson →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '56px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>More B2 lessons coming soon</p>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '8px' }}>Technology, society, environment, culture and more</p>
        </div>
      </div>
    </main>
  )
}