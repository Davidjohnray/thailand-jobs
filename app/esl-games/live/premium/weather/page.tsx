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
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#0ea5e9' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#8b5cf6' },
]

export default function WeatherPage() {
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
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9, #7dd3fc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '64px' }}>🌤️</div>
    </main>
  )

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9 0%, #7dd3fc 50%, #bae6fd 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '3px solid #7dd3fc' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>⛅</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0c4a6e', marginBottom: '8px' }}>Weather Watch!</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Premium Kindergarten Game — Enter your access code</p>
        <input value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid #ef4444' : '2px solid #bae6fd', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#e5e7eb' : 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(14,165,233,0.4)' }}>
          {logging ? 'Checking...' : '🔓 Enter Game'}
        </button>
        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '20px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>← Back to Premium</Link>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 40%, #bae6fd 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes cloud { 0%{transform:translateX(-20px)} 50%{transform:translateX(20px)} 100%{transform:translateX(-20px)} }
        @keyframes fall { 0%{transform:translateY(-20px);opacity:0} 50%{opacity:1} 100%{transform:translateY(20px);opacity:0} }
        @keyframes spin { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.15)} 100%{transform:rotate(360deg) scale(1)} }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
      `}</style>

      {/* Floating weather decoration */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {['☀️','⛅','🌧️','❄️','🌈','💨','⛈️','🌤️','🌩️','🌸'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: `${22 + (i % 3) * 12}px`, left: `${(i * 11) % 92}%`, top: `${(i * 17) % 85}%`, opacity: 0.15, animation: `cloud ${4 + i % 3}s ease-in-out infinite` }}>{e}</div>
        ))}
      </div>

      {/* Sun rays decoration */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,0,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '4px solid #7dd3fc', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '88px', marginBottom: '8px', animation: 'spin 8s linear infinite' }}>☀️</div>
        <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#0c4a6e', margin: '0 0 6px' }}>Weather Watch!</h1>
        <p style={{ color: '#0369a1', fontSize: '16px', marginBottom: '32px', fontWeight: '700' }}>What's the weather like today? 🌈</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{ padding: '18px 24px', borderRadius: '16px', border: '3px solid', borderColor: mode === m.id ? m.color : '#e0f2fe', background: mode === m.id ? m.color : '#f0f9ff', color: mode === m.id ? 'white' : '#0369a1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s', transform: mode === m.id ? 'scale(1.03)' : 'scale(1)', boxShadow: mode === m.id ? `0 6px 20px ${m.color}50` : 'none' }}>
              <span style={{ fontSize: '32px' }}>{m.emoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '16px' }}>{m.label}</div>
                <div style={{ fontSize: '13px', opacity: 0.85 }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => mode && router.push(`/esl-games/live/premium/weather/${mode}`)} disabled={!mode}
          style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: mode ? 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' : '#e0f2fe', color: mode ? 'white' : '#93c5fd', fontWeight: '900', fontSize: '20px', cursor: mode ? 'pointer' : 'not-allowed', boxShadow: mode ? '0 8px 28px rgba(14,165,233,0.5)' : 'none', transition: 'all 0.2s' }}>
          {mode ? '⛅ Let\'s Check the Weather!' : 'Choose a mode first!'}
        </button>

        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '20px', color: '#7dd3fc', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>← Back to Premium Games</Link>
      </div>
    </main>
  )
}
