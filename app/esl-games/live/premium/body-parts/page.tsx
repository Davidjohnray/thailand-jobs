'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'

const MODES = [
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#22c55e' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#6366f1' },
]

export default function BodyPartsPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)
  const [mode, setMode] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY)
    if (saved) setAuthed(true)
    setChecking(false)
  }, [])

  const handleLogin = async () => {
    if (!password.trim()) return
    setLogging(true)
    setError('')
    const { data } = await supabase.from('pro_game_passwords').select('*').eq('password', password.trim().toUpperCase()).eq('active', true).single()
    if (data) {
      localStorage.setItem(SESSION_KEY, 'true')
      localStorage.setItem(PASSWORD_KEY, password.trim().toUpperCase())
      await supabase.from('pro_game_passwords').update({ last_login: new Date().toISOString() }).eq('id', data.id)
      setAuthed(true)
    } else {
      setError('Invalid password. Please check your access code.')
    }
    setLogging(false)
  }

  if (checking) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #dcfce7, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '64px' }}>👁️</div>
    </main>
  )

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #dcfce7 0%, #dbeafe 50%, #ede9fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #86efac' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>👁️</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#1e1b4b', marginBottom: '8px' }}>Body Parts</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Premium Kindergarten Game — Enter your access code</p>
        <input value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid #ef4444' : '2px solid #e5e7eb', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#e5e7eb' : 'linear-gradient(135deg, #22c55e, #6366f1)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(34,197,94,0.3)' }}>
          {logging ? 'Checking...' : '🔓 Enter Game'}
        </button>
        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '20px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>← Back to Premium</Link>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #dcfce7 0%, #dbeafe 50%, #ede9fe 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
      `}</style>

      {/* Floating body part emojis */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {['👀','👃','👄','👂','✋','🦵','👣','💪','🦷','🖐️'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: `${20 + (i % 3) * 10}px`, left: `${(i * 11) % 92}%`, top: `${(i * 17) % 85}%`, opacity: 0.1, animation: `float ${3 + i % 3}s ease-in-out infinite` }}>{e}</div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #86efac', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '80px', marginBottom: '8px', animation: 'bounce 2s ease-in-out infinite' }}>🫀</div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b', margin: '0 0 6px' }}>Body Parts!</h1>
        <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px' }}>Head, shoulders, knees and toes! 🌟</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{ padding: '18px 24px', borderRadius: '16px', border: '3px solid', borderColor: mode === m.id ? m.color : '#e5e7eb', background: mode === m.id ? m.color : 'white', color: mode === m.id ? 'white' : '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s', transform: mode === m.id ? 'scale(1.02)' : 'scale(1)' }}>
              <span style={{ fontSize: '32px' }}>{m.emoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '16px' }}>{m.label}</div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => mode && router.push(`/esl-games/live/premium/body-parts/${mode}`)} disabled={!mode}
          style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: mode ? 'linear-gradient(135deg, #22c55e, #6366f1)' : '#e5e7eb', color: mode ? 'white' : '#9ca3af', fontWeight: '900', fontSize: '20px', cursor: mode ? 'pointer' : 'not-allowed', boxShadow: mode ? '0 8px 24px rgba(34,197,94,0.4)' : 'none', transition: 'all 0.2s' }}>
          {mode ? '🫀 Let\'s Learn!' : 'Choose a mode first!'}
        </button>

        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '20px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>← Back to Premium Games</Link>
      </div>
    </main>
  )
}
