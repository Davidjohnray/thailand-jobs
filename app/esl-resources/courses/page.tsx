'use client'
import Link from 'next/link'

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
    availableLessons: 10,
    detail: 'Go beyond textbook Business English. This course puts you inside real situations — exchanging business cards in Tokyo, drinking with colleagues in Seoul, navigating family empires in Bangkok. Each lesson is built around scenarios, cultural rules, and the phrases you actually need.',
    tags: ['10 lessons', 'Interactive', 'Cultural scenarios'],
  },
  {
    id: 'business-in-latin-america',
    title: 'Business in Latin America',
    emoji: '🌎',
    description: 'Real life and culture of doing business across Latin America',
    color: '#c2410c',
    gradient: 'linear-gradient(135deg, #431407 0%, #c2410c 100%)',
    level: 'B1',
    lessonCount: 10,
    availableLessons: 1,
    detail: 'From cheek kisses in Mexico City to three-hour lunches in Buenos Aires and the Brazilian jeitinho. This course puts you inside real business situations across Latin America — with scenarios, cultural rules, and key phrases in Spanish and Portuguese.',
    tags: ['10 lessons', 'Interactive', 'Spanish & Portuguese phrases'],
  },
]

export default function CoursesHub() {
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
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0, lineHeight: '1.5', maxWidth: '520px' }}>Interactive courses that go beyond reading. Scenarios, cultural insights, and the phrases you actually need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {COURSES.map(course => (
          <Link key={course.id} href={`/esl-resources/courses/${course.id}`} style={{ textDecoration: 'none' }}>
            <div
              style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
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
              <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>{course.availableLessons} of {course.lessonCount} lessons available</span>
                  <div style={{ flex: 1, maxWidth: '200px', background: '#e5e7eb', borderRadius: '20px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${(course.availableLessons / course.lessonCount) * 100}%`, background: course.color, height: '100%', borderRadius: '20px' }} />
                  </div>
                </div>
                <div style={{ background: course.color, color: 'white', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' }}>View Course →</div>
              </div>
            </div>
          </Link>
        ))}

        {/* Coming soon placeholder */}
        <div style={{ background: 'white', borderRadius: '20px', border: '2px dashed #d1d5db', padding: '48px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ fontSize: '48px' }}>🌏</div>
          <div style={{ color: '#9ca3af', fontSize: '18px', fontWeight: '700', textAlign: 'center' }}>More courses coming soon</div>
          <div style={{ color: '#d1d5db', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>New interactive courses on culture, travel, and real-world English are in development.</div>
        </div>
      </div>
    </main>
  )
}
