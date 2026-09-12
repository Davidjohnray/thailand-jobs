'use client'
import Link from 'next/link'

const subLevels = [
  { name: 'Lower Secondary', ageRange: '11–13', description: 'Building on Primary skills with longer texts, more complex grammar, and independent writing.' },
  { name: 'Upper Secondary', ageRange: '14+', description: 'Exam-focused reading, writing, listening and speaking preparation.' },
]

export default function SecondaryHomePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F3E8FF, #E0F2FE)', fontFamily: 'sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <Link href="/courses" style={{ display: 'inline-block', marginBottom: '16px', color: '#7C3AED', textDecoration: 'none', fontWeight: 'bold' }}>
          ← All Courses
        </Link>
        <h1 style={{ textAlign: 'center', fontSize: '30px', color: '#3B2A5F', marginBottom: '4px' }}>Secondary English</h1>
        <p style={{ textAlign: 'center', color: '#6b5b8a', marginBottom: '8px' }}>Ages 11+</p>
        <p style={{ textAlign: 'center', color: '#8a99a8', fontSize: '13px', marginBottom: '32px', fontStyle: 'italic' }}>
          Planning stage — no content built yet
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {subLevels.map((level) => (
            <div
              key={level.name}
              style={{
                background: 'white',
                borderRadius: '18px',
                padding: '20px 24px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                opacity: 0.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#3B2A5F' }}>{level.name}</div>
                <div
                  style={{
                    background: '#F1F5F9',
                    color: '#64748B',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Coming Soon
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#8a99a8', marginBottom: '8px' }}>Ages {level.ageRange}</div>
              <p style={{ color: '#6b5b8a', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{level.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
