'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Level = {
  id: number
  name: string
  age_range: string | null
  sort_order: number
}

export default function EarlyLearnersHomePage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [unitCounts, setUnitCounts] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: levelRows } = await supabase
        .from('early_course_levels')
        .select('id, name, age_range, sort_order')
        .order('sort_order', { ascending: true })
      setLevels(levelRows || [])

      const { data: unitRows } = await supabase.from('early_course_units').select('id, level_id').eq('is_published', true)
      const counts: Record<number, number> = {}
      ;(unitRows || []).forEach((u: any) => {
        counts[u.level_id] = (counts[u.level_id] || 0) + 1
      })
      setUnitCounts(counts)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <main style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        Loading course...
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFE9A8, #FFD3E0)', fontFamily: 'sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <Link href="/courses" style={{ display: 'inline-block', marginBottom: '16px', color: '#7C3AED', textDecoration: 'none', fontWeight: 'bold' }}>
          ← All Courses
        </Link>
        <h1 style={{ textAlign: 'center', fontSize: '30px', color: '#5b3a29', marginBottom: '4px' }}>
          Early Learners English
        </h1>
        <p style={{ textAlign: 'center', color: '#8a6a55', marginBottom: '32px' }}>Choose a level</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {levels.map((level) => {
            const hasUnits = (unitCounts[level.id] || 0) > 0
            return (
              <Link
                key={level.id}
                href={hasUnits ? `/early-learners/level/${level.id}` : '#'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'white',
                  borderRadius: '18px',
                  padding: '20px 24px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                  textDecoration: 'none',
                  opacity: hasUnits ? 1 : 0.5,
                  cursor: hasUnits ? 'pointer' : 'default',
                  pointerEvents: hasUnits ? 'auto' : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#5b3a29' }}>{level.name}</div>
                  <div style={{ fontSize: '14px', color: '#8a6a55' }}>{level.age_range ? `Ages ${level.age_range}` : ''}</div>
                </div>
                {!hasUnits && (
                  <div style={{ fontSize: '12px', color: '#8a6a55', fontStyle: 'italic' }}>Coming soon</div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
