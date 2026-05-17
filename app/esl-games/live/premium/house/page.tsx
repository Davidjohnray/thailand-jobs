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

const AGE_GROUPS = ['P1-P2', 'P3-P4', 'P5-P6', 'M1-M3']
const MODES = [
  { id: 'solo', label: '👤 Solo Play', desc: 'Play on your own device. Perfect for self-study.' },
  { id: 'host', label: '📱 Live Multiplayer', desc: 'Students join on their phones with a room code.' },
  { id: 'tv', label: '📺 TV Classroom Mode', desc: 'Show on the big screen. Teams compete together.' },
]

export default function HouseGamePage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)
  const [ageGroup, setAgeGroup] = useState('')
  const [mode, setMode] = useState('')
  const [roomCode, setRoomCode] = useState('')

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session) setAuthed(true)
    setChecking(false)
  }, [])

  const handleLogin = async () => {
    if (!password.trim()) return
    setLogging(true)
    setError('')
    const { data } = await supabase
      .from('pro_game_passwords')
      .select('*')
      .eq('password', password.trim().toUpperCase())
      .eq('active', true)
      .single()
    if (data) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      sessionStorage.setItem(PASSWORD_KEY, password.trim().toUpperCase())
      await supabase.from('pro_game_passwords').update({ last_login: new Date().toISOString() }).eq('id', data.id)
      setAuthed(true)
    } else {
      setError('Invalid password. Please check your access code.')
    }
    setLogging(false)
  }

  const startGame = () => {
    if (!ageGroup || !mode) return
    if (mode === 'host') {
      router.push(`/esl-games/live/premium/house/host?age=${ageGroup}&room=${roomCode}`)
    } else if (mode === 'tv') {
      router.push(`/esl-games/live/premium/house/tv?age=${ageGroup}`)
    } else {
      router.push(`/esl-games/live/premium/house/solo?age=${ageGroup}`)
    }
  }

  if (checking) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading...</p>
    </main>
  )

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🏠</div>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Around the House</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Premium ESL Game — Enter your access code to play</p>
        <input
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: error ? '2px solid #ef4444' : '2px solid #e2e8f0', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#cbd5e1' : '#0d9488', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer' }}>
          {logging ? 'Checking...' : '🔓 Enter Game'}
        </button>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '20px' }}>
          Need access? <Link href="/esl-games/live/premium" style={{ color: '#0d9488', fontWeight: 'bold', textDecoration: 'none' }}>Get Premium →</Link>
        </p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/esl-games/live/premium" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>← Back to Premium Games</Link>
          <div style={{ fontSize: '64px', margin: '20px 0 12px' }}>🏠</div>
          <h1 style={{ color: 'white', fontSize: '34px', fontWeight: 'bold', margin: '0 0 8px' }}>Around the House</h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Rooms, furniture and household vocabulary • 20 questions • All levels</p>
        </div>

        {/* AGE GROUP */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>1. Select Age Group</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {AGE_GROUPS.map(ag => (
              <button key={ag} onClick={() => setAgeGroup(ag)}
                style={{ padding: '14px 8px', borderRadius: '10px', border: '2px solid', borderColor: ageGroup === ag ? '#0d9488' : 'rgba(255,255,255,0.15)', background: ageGroup === ag ? '#0d9488' : 'transparent', color: 'white', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                {ag}
              </button>
            ))}
          </div>
        </div>

        {/* GAME MODE */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>2. Select Game Mode</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                style={{ padding: '16px 20px', borderRadius: '10px', border: '2px solid', borderColor: mode === m.id ? '#0d9488' : 'rgba(255,255,255,0.15)', background: mode === m.id ? 'rgba(13,148,136,0.2)' : 'transparent', color: 'white', textAlign: 'left', cursor: 'pointer' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{m.label}</div>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ROOM CODE for multiplayer */}
        {mode === 'host' && (
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px', marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>3. Room Code</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>The teacher controls the game — students answer on their devices.</p>
            {!roomCode ? (
              <button onClick={() => setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase())}
                style={{ background: '#0d9488', color: 'white', padding: '10px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Generate Room Code
              </button>
            ) : (
              <div>
                <div style={{ fontSize: '44px', fontWeight: 'bold', color: 'white', letterSpacing: '8px', marginBottom: '8px' }}>{roomCode}</div>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>Share this code with your students at <strong style={{ color: 'white' }}>jobsinthailand.net/play</strong></div>
              </div>
            )}
          </div>
        )}

        <button onClick={startGame} disabled={!ageGroup || !mode}
          style={{ width: '100%', background: !ageGroup || !mode ? 'rgba(255,255,255,0.1)' : '#0d9488', color: 'white', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: !ageGroup || !mode ? 'not-allowed' : 'pointer' }}>
          {!ageGroup ? 'Select an age group to start' : !mode ? 'Select a game mode' : '🏠 Start Around the House!'}
        </button>

        <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
          20 questions • 15 seconds per question • 4 answer choices
        </p>
      </div>
    </main>
  )
}
