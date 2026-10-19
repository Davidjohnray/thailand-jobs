'use client'
import Link from 'next/link'

const LESSONS = [
  { id: 'business-card-ceremony', title: 'The Business Card Ceremony', emoji: '🪪', description: 'First impressions in Japan, Korea, China and Thailand', available: true },
  { id: 'drinking-with-the-boss', title: 'Drinking with the Boss', emoji: '🍻', description: 'After-work culture from Seoul to Singapore', available: true },
  { id: 'losing-face', title: 'Losing Face', emoji: '😶', description: 'The most important concept in Asian business', available: true },
  { id: 'saying-no-without-saying-no', title: 'The Art of Saying No Without Saying No', emoji: '🤐', description: 'Indirect communication across cultures', available: true },
  { id: 'guanxi', title: 'Guanxi — It\'s Who You Know', emoji: '🤝', description: 'Relationships, networks and trust in China', available: false },
  { id: 'salarymans-day', title: 'The Salaryman\'s Day', emoji: '🚶', description: 'A day in the life of a Japanese office worker', available: false },
  { id: 'family-business-empires', title: 'Family Business Empires', emoji: '👨‍👩‍👦', description: 'The dynasties behind Asia\'s biggest companies', available: false },
  { id: 'bowing-waiing-shaking-hands', title: 'Bowing, Wai-ing, and Shaking Hands', emoji: '🙏', description: 'Greetings and body language across Asia', available: false },
  { id: 'night-market-entrepreneur', title: 'The Night Market Entrepreneur', emoji: '🏮', description: 'Street business, hustle and the Asian dream', available: false },
  { id: 'when-east-meets-west', title: 'When East Meets West', emoji: '🌏', description: 'Clashes, compromises and finding common ground', available: false },
]

const COLOR = '#047857'

export default function BusinessInAsiaPage() {
  const available = LESSONS.filter(l => l.available).length

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #022c22 0%, #047857 60%, #059669 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources/courses" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← All Courses</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '64px' }}>🏯</div>
            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>10 Lessons</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 min each</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>Business in Asia</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0, lineHeight: '1.6', maxWidth: '560px' }}>Go beyond textbook Business English. This course puts you inside real situations — exchanging business cards in Tokyo, drinking with colleagues in Seoul, navigating family empires in Bangkok.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            {['Cultural scenarios', 'Real phrases', 'AI conversation partner', '13-language translation', 'Pause & resume audio'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Progress */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>{available} of {LESSONS.length} lessons available</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '20px', height: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${(available / LESSONS.length) * 100}%`, background: COLOR, height: '100%', borderRadius: '20px', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Lesson List */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 24px 64px' }}>
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {LESSONS.map((lesson, idx) => (
            lesson.available ? (
              <Link key={lesson.id} href={`/esl-resources/courses/business-in-asia/${lesson.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', borderBottom: idx < LESSONS.length - 1 ? '1px solid #f3f4f6' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#f0fdf4' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: COLOR, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', flexShrink: 0 }}>{idx + 1}</div>
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>{lesson.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>{lesson.title}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '3px' }}>{lesson.description}</div>
                  </div>
                  <div style={{ background: COLOR, color: 'white', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>Start →</div>
                </div>
              </Link>
            ) : (
              <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', borderBottom: idx < LESSONS.length - 1 ? '1px solid #f3f4f6' : 'none', opacity: 0.45 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#d1d5db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ fontSize: '32px', flexShrink: 0 }}>{lesson.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>{lesson.title}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '3px' }}>{lesson.description}</div>
                </div>
                <span style={{ background: '#f3f4f6', color: '#9ca3af', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Coming Soon</span>
              </div>
            )
          ))}
        </div>
      </div>
    </main>
  )
}
