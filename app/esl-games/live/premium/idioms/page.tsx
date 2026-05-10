'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'
const COLOR = '#0d9488'

const ageGroups = [
  { id: 'P1-P2', label: 'P1 – P2', desc: 'Ages 6–8', emoji: '🌱' },
  { id: 'P3-P4', label: 'P3 – P4', desc: 'Ages 8–10', emoji: '📚' },
  { id: 'P5-P6', label: 'P5 – P6', desc: 'Ages 10–12', emoji: '🔬' },
  { id: 'M1-M3', label: 'M1 – M3', desc: 'Ages 12–15', emoji: '🎓' },
]

export default function IdiomsPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedAge, setSelectedAge] = useState('P3-P4')

  useEffect(() => {
    const pwd = localStorage.getItem(PASSWORD_KEY)
    const session = localStorage.getItem(SESSION_KEY)
    if (pwd && session) {
      supabase.from('pro_game_passwords').select('session_token, active').eq('password', pwd).single().then(({ data }) => {
        if (data?.active && data.session_token === session) setAuthed(true)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></main>

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Premium Access Required</h2>
        <Link href="/esl-games/live/premium" style={{ background: COLOR, color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Get Access →</Link>
      </div>
    </main>
  )

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/esl-games/live/premium" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back to Premium Games</Link>
        <div style={{ textAlign: 'center', margin: '24px 0 32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '8px' }}>🗣️</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Idioms & Phrases</h1>
          <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>What does the idiom mean? 20 questions from a pool of 40</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>1. Select Age Group</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {ageGroups.map(g => (
              <button key={g.id} onClick={() => setSelectedAge(g.id)}
                style={{ padding: '16px', borderRadius: '12px', border: `2px solid ${selectedAge === g.id ? COLOR : '#e5e7eb'}`, background: selectedAge === g.id ? '#f0fdfa' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{g.emoji}</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e' }}>{g.label}</div>
                <div style={{ color: '#888', fontSize: '13px' }}>{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>2. Choose Game Mode</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => router.push(`/esl-games/live/premium/idioms/solo?ageGroup=${selectedAge}`)}
              style={{ background: COLOR, color: 'white', padding: '16px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>👤</span>
              <div><div>Solo Mode</div><div style={{ fontWeight: 'normal', fontSize: '13px', opacity: 0.85 }}>Play alone — test your idiom knowledge</div></div>
            </button>
            <button onClick={() => router.push(`/esl-games/live/premium/idioms/host?ageGroup=${selectedAge}`)}
              style={{ background: '#1a1a2e', color: 'white', padding: '16px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>📱</span>
              <div><div>Multiplayer (Students join on phones)</div><div style={{ fontWeight: 'normal', fontSize: '13px', opacity: 0.85 }}>Students go to jobsinthailand.net/play</div></div>
            </button>
            <button onClick={() => router.push(`/esl-games/live/premium/idioms/tv?ageGroup=${selectedAge}`)}
              style={{ background: '#6366f1', color: 'white', padding: '16px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>📺</span>
              <div><div>TV Team Mode</div><div style={{ fontWeight: 'normal', fontSize: '13px', opacity: 0.85 }}>Show on classroom screen — team scoring</div></div>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
