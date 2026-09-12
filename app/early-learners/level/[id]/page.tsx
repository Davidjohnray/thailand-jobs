'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Unit = {
  id: number
  name: string
  sort_order: number
  is_published: boolean
}

export default function EarlyLearnersLevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [levelName, setLevelName] = useState('')
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: level } = await supabase.from('early_course_levels').select('name').eq('id', id).single()
      if (level) setLevelName(level.name)

      const { data: unitRows } = await supabase
        .from('early_course_units')
        .select('id, name, sort_order, is_published')
        .eq('level_id', id)
        .order('sort_order', { ascending: true })
      setUnits(unitRows || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <main style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        Loading level...
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFE9A8, #FFD3E0)', fontFamily: 'sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <Link href="/early-learners" style={{ display: 'inline-block', marginBottom: '16px', color: '#7C3AED', textDecoration: 'none', fontWeight: 'bold' }}>
          ← All Levels
        </Link>
        <h1 style={{ textAlign: 'center', fontSize: '28px', color: '#5b3a29', marginBottom: '32px' }}>{levelName}</h1>

        {units.length === 0 && (
          <p style={{ textAlign: 'center', color: '#8a6a55' }}>No units found for this level yet.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {units.map((unit, i) => {
            const ready = unit.is_published
            return (
              <Link
                key={unit.id}
                href={ready ? `/early-learners/unit/${unit.id}` : '#'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'white',
                  borderRadius: '18px',
                  padding: '18px 22px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                  textDecoration: 'none',
                  opacity: ready ? 1 : 0.5,
                  cursor: ready ? 'pointer' : 'default',
                  pointerEvents: ready ? 'auto' : 'none',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: ready ? '#7C3AED' : '#bbb',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    fontSize: '14px',
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#5b3a29' }}>{unit.name}</div>
                {!ready && (
                  <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#8a6a55', fontStyle: 'italic' }}>
                    Coming soon
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
