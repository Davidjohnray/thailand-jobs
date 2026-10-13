'use client'
import Link from 'next/link'
import { useState } from 'react'

const COURSES = [
  {
    id: 'business-in-asia',
    title: 'Business in Asia',
    emoji: '🏯',
    description: 'Real life and culture of doing business across Asia',
    color: '#047857',
    gradient: 'linear-gradient(135deg, #022c22 0%, #047857 100%)',
    level: 'B1',
    lessonCount: 10,
    detail: 'Go beyond textbook Business English. This course puts you inside real situations — exchanging business cards in Tokyo, drinking with colleagues in Seoul, navigating family empires in Bangkok. Each lesson is built around scenarios, roleplay, cultural rules, and the phrases you actually need.',
    tags: ['10 lessons', 'Interactive', 'Cultural scenarios', 'Roleplay'],
    lessons: [
      { id: 'business-card-ceremony', title: 'The Business Card Ceremony', emoji: '🪪', description: 'First impressions in Japan, Korea, China and Thailand', available: true },
      { id: 'drinking-with-the-boss', title: 'Drinking with the Boss', emoji: '🍻', description: 'After-work culture from Seoul to Singapore', available: false },
      { id: 'losing-face', title: 'Losing Face', emoji: '😶', description: 'The most important concept in Asian business', available: false },
      { id: 'saying-no-without-saying-no', title: 'The Art of Saying No Without Saying No', emoji: '🤐', description: 'Indirect communication across cultures', available: false },
      { id: 'guanxi', title: 'Guanxi — It\'s Who You Know', emoji: '🤝', description: 'Relationships, networks and trust in China', available: false },
      { id: 'salarymans-day', title: 'The Salaryman\'s Day', emoji: '🚶', description: 'A day in the life of a Japanese office worker', available: false },
      { id: 'family-business-empires', title: 'Family Business Empires', emoji: '👨‍👩‍👦', description: 'The dynasties behind Asia\'s biggest companies', available: false },
      { id: 'bowing-waiing-shaking-hands', title: 'Bowing, Wai-ing, and Shaking Hands', emoji: '🙏', description: 'Greetings and body language across Asia', available: false },
      { id: 'night-market-entrepreneur', title: 'The Night Market Entrepreneur', emoji: '🏮', description: 'Street business, hustle and the Asian dream', available: false },
      { id: 'when-east-meets-west', title: 'When East Meets West', emoji: '🌏', description: 'Clashes, compromises and finding common ground', available: false },
    ],
  },
]

function ProgressBar({ completed, total, color }: { completed: number, total: number, color: string }) {
  const pct = Math.round((completed / total) * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
      <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '20px', height: '8px', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', background: color, height: '100%', borderRadius: '20px', transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', flexShrink: 0 }}>{completed}/{total}</span>
    </div>
  )
}

export default function CoursesHub() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>('business-in-asia')

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #022c22 0%, #047857 60%, #059669 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← ESL Resources</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ color: 'white', fontSize: '36px', lineHeight: 1 }}>📚</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>COURSES</div>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' }}>Courses</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 12px', lineHeight: '1.5', maxWidth: '520px' }}>Interactive courses that go beyond reading. Scenarios, roleplay, cultural insights, and the phrases you actually need.</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Interactive lessons', 'Real scenarios', 'Cultural insights', 'Roleplay & discussion'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            {['✍️ Highlight any text', '🌍 13-language translation', '🤖 AI conversation partner', '🎤 Push-to-talk voice', '🔊 4-speed audio', '🔊 Natural AI voice'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {COURSES.map(course => {
          const availableLessons = course.lessons.filter(l => l.available).length
          const isExpanded = expandedCourse === course.id

          return (
            <div key={course.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
              {/* Course Header */}
              <div style={{ background: course.gradient, padding: '32px 28px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '20px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px' }}>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>{course.level} Intermediate</span>
                </div>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{course.emoji}</div>
                <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px' }}>{course.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: '0 0 16px', lineHeight: '1.6', maxWidth: '600px' }}>{course.detail}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {course.tags.map(tag => (
                    <span key={tag} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Progress + Expand */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>{availableLessons} of {course.lessonCount} lessons available</span>
                  <button onClick={() => setExpandedCourse(isExpanded ? null : course.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: course.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isExpanded ? 'Hide lessons' : 'Show lessons'}
                    <span style={{ fontSize: '18px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
                  </button>
                </div>
                <ProgressBar completed={availableLessons} total={course.lessonCount} color={course.color} />
              </div>

              {/* Lesson List */}
              {isExpanded && (
                <div style={{ padding: '12px 28px 28px' }}>
                  {course.lessons.map((lesson, idx) => (
                    lesson.available ? (
                      <Link key={lesson.id} href={`/esl-resources/courses/${course.id}/${lesson.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', margin: '4px 0', transition: 'background 0.15s', cursor: 'pointer' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#f0fdf4' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: course.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', flexShrink: 0 }}>{idx + 1}</div>
                          <div style={{ fontSize: '28px', flexShrink: 0 }}>{lesson.emoji}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>{lesson.title}</div>
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{lesson.description}</div>
                          </div>
                          <div style={{ background: course.color, color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Start →</div>
                        </div>
                      </Link>
                    ) : (
                      <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', margin: '4px 0', opacity: 0.5 }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#d1d5db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', flexShrink: 0 }}>{idx + 1}</div>
                        <div style={{ fontSize: '28px', flexShrink: 0 }}>{lesson.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>{lesson.title}</div>
                          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{lesson.description}</div>
                        </div>
                        <span style={{ background: '#f3f4f6', color: '#9ca3af', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>Coming Soon</span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Coming Soon placeholder for future courses */}
        <div style={{ background: 'white', borderRadius: '20px', border: '2px dashed #d1d5db', padding: '48px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ fontSize: '48px' }}>🌏</div>
          <div style={{ color: '#9ca3af', fontSize: '18px', fontWeight: '700', textAlign: 'center' }}>More courses coming soon</div>
          <div style={{ color: '#d1d5db', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>New interactive courses on culture, travel, and real-world English are in development.</div>
        </div>
      </div>
    </main>
  )
}
