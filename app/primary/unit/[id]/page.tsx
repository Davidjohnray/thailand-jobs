'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Lesson = {
  id: number
  title: string
  sort_order: number
}

export default function PrimaryUnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [unitName, setUnitName] = useState('')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: unit } = await supabase.from('primary_course_units').select('name').eq('id', id).single()
      if (unit) setUnitName(unit.name)

      const { data: lessonRows } = await supabase
        .from('primary_course_lessons')
        .select('id, title, sort_order')
        .eq('unit_id', id)
        .order('sort_order', { ascending: true })
      setLessons(lessonRows || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return <main style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading unit...</main>
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #DCEEFB, #E8F9F0)', fontFamily: 'sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <Link href="/primary" style={{ display: 'inline-block', marginBottom: '16px', color: '#2563EB', textDecoration: 'none', fontWeight: 'bold' }}>
          ← All Levels
        </Link>
        <h1 style={{ textAlign: 'center', fontSize: '28px', color: '#1E3A5F', marginBottom: '32px' }}>{unitName}</h1>

        {lessons.length === 0 && (
          <p style={{ textAlign: 'center', color: '#8a99a8' }}>No lessons found for this unit yet.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {lessons.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/primary/lesson/${lesson.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'white',
                borderRadius: '20px',
                padding: '20px 24px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E3A5F' }}>{lesson.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
