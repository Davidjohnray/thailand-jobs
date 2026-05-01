'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { categoryBank } from '../questions'

function TVGame() {
  const searchParams = useSearchParams()
  const categoryName = searchParams.get('category') || categoryBank[0].category
  const categoryData = categoryBank.find(c => c.category === categoryName) || categoryBank[0]

  const [phase, setPhase] = useState<'ready' | 'playing' | 'finished'>('ready')
  const [timeLeft, setTimeLeft] = useState(categoryData.timeLimit)
  const [running, setRunning] = useState(false)
  const [teams, setTeams] = useState([
    { name: 'Team 1', score: 0, color: '#E85D26' },
    { name: 'Team 2', score: 0, color: '#0891b2' },
    { name: 'Team 3', score: 0, color: '#7C3AED' },
  ])

  useEffect(() => {
    if (!running) return
    if (timeLeft === 0) { setRunning(false); setPhase('finished'); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running])

  function addPoint(teamIndex: number) {
    setTeams(prev => prev.map((t, i) => i === teamIndex ? { ...t, score: t.score + 1 } : t))
  }

  function removePoint(teamIndex: number) {
    setTeams(prev => prev.map((t, i) => i === teamIndex ? { ...t, score: Math.max(0, t.score - 1) } : t))
  }

  const timerColor = timeLeft > 15 ? '#4ade80' : timeLeft > 8 ? '#fbbf24' : '#f87171'
  const sorted = [...teams].sort((a, b) => b.score - a.score)

  if (phase === 'finished') {
    return (
      <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', padding: '40px', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '100px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', margin: 0 }}>Time's Up!</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '500px', marginTop: '16px' }}>
          {sorted.map((team, i) => (
            <div key={team.name} style={{ background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '36px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
              <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '24px', flex: 1 }}>{team.name}</span>
              <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '32px' }}>{team.score}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => { setPhase('ready'); setTimeLeft(categoryData.timeLimit); setRunning(false); setTeams(teams.map(t => ({ ...t, score: 0 }))) }}
            style={{ background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            Play Again
          </button>
          <Link href="/esl-games/live/category-race" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            Change Category
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh', padding: '24px 40px', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', opacity: 0.7 }}>🎭 Category Race</div>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', opacity: 0.7 }}>{categoryData.topic}</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '12px', marginBottom: '28px' }}>
        <div style={{ background: timerColor, height: '12px', borderRadius: '8px', width: `${(timeLeft / categoryData.timeLimit) * 100}%`, transition: 'width 1s linear, background 0.3s' }} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', marginBottom: '8px' }}>Name as many as you can...</div>
        <div style={{ color: 'white', fontSize: '52px', fontWeight: 'bold', lineHeight: '1.2' }}>{categoryName}</div>
        {running && (
          <div style={{ color: timerColor, fontSize: '80px', fontWeight: 'bold', marginTop: '8px', lineHeight: 1 }}>{timeLeft}</div>
        )}
        {!running && phase === 'ready' && (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '24px', marginTop: '12px' }}>Press Start when ready!</div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px', flex: 1, alignItems: 'center' }}>
        {teams.map((team, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', textAlign: 'center', border: `2px solid ${team.color}40` }}>
            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{team.name}</div>
            <div style={{ color: team.color, fontSize: '72px', fontWeight: 'bold', lineHeight: 1, marginBottom: '16px' }}>{team.score}</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={() => addPoint(i)}
                style={{ background: team.color, color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                +1
              </button>
              <button onClick={() => removePoint(i)}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', fontSize: '18px', cursor: 'pointer' }}>
                −
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {!running && phase === 'ready' && (
          <button onClick={() => { setRunning(true); setPhase('playing') }}
            style={{ background: '#16a34a', color: 'white', padding: '14px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
            ▶ Start Timer
          </button>
        )}
        {running && (
          <button onClick={() => { setRunning(false); setPhase('finished') }}
            style={{ background: '#E85D26', color: 'white', padding: '14px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
            ⏹ Stop
          </button>
        )}
        {phase === 'playing' && !running && (
          <button onClick={() => setPhase('finished')}
            style={{ background: '#0891b2', color: 'white', padding: '14px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
            🏆 See Results
          </button>
        )}
        <Link href="/esl-games/live/category-race" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
          ✕ Exit
        </Link>
      </div>
    </div>
  )
}

export default function TVPage() {
  return <Suspense fallback={<div style={{ background: '#1a1a2e', minHeight: '100vh' }} />}><TVGame /></Suspense>
}