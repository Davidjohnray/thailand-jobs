'use client'
import Link from 'next/link'

type Course = {
  name: string
  ageRange: string
  description: string
  status: 'live' | 'preview' | 'coming-soon'
  href: string
}

const courses: Course[] = [
  {
    name: 'Early Learners',
    ageRange: '3–6 years',
    description: 'Listening, speaking, phonics and pre-writing through songs, flashcards and games.',
    status: 'live',
    href: '/early-learners',
  },
  {
    name: 'Primary',
    ageRange: '7–10 years',
    description: 'Reading, writing, listening and speaking through stories, dialogues and interactive practice.',
    status: 'preview',
    href: '/primary/lesson/1',
  },
  {
    name: 'Secondary',
    ageRange: '11+ years',
    description: 'More advanced reading, writing and exam-focused English skills.',
    status: 'coming-soon',
    href: '#',
  },
]

const statusStyles: Record<Course['status'], { label: string; color: string; bg: string }> = {
  live: { label: 'Available Now', color: '#16A34A', bg: '#DCFCE7' },
  preview: { label: 'In Development — Preview', color: '#B45309', bg: '#FEF3C7' },
  'coming-soon': { label: 'Coming Soon', color: '#64748B', bg: '#F1F5F9' },
}

export default function CoursesHomePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF6E5, #E8F3FF)', fontFamily: 'sans-serif', padding: '40px 16px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '32px', color: '#1E3A5F', marginBottom: '8px' }}>
          English Courses
        </h1>
        <p style={{ textAlign: 'center', color: '#5b7a99', marginBottom: '36px' }}>
          Choose the right level by age
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {courses.map((course) => {
            const status = statusStyles[course.status]
            const clickable = course.status !== 'coming-soon'
            return (
              <Link
                key={course.name}
                href={clickable ? course.href : '#'}
                style={{
                  display: 'block',
                  background: 'white',
                  borderRadius: '20px',
                  padding: '24px 28px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  textDecoration: 'none',
                  opacity: clickable ? 1 : 0.6,
                  cursor: clickable ? 'pointer' : 'default',
                  pointerEvents: clickable ? 'auto' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1E3A5F' }}>{course.name}</div>
                    <div style={{ fontSize: '14px', color: '#8a99a8' }}>{course.ageRange}</div>
                  </div>
                  <div
                    style={{
                      background: status.bg,
                      color: status.color,
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {status.label}
                  </div>
                </div>
                <p style={{ color: '#4a5f73', fontSize: '15px', lineHeight: '1.5', margin: 0 }}>{course.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
