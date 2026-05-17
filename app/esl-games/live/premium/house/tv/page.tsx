'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { questions } from '../questions'

const SESSION_KEY = 'premium_games_session'
const TOTAL_TIME = 15

type Team = { name: string; score: number; color: string }

const DEFAULT_TEAMS: Team[] = [
  { name: 'Team 1', score: 0, color: '#3b82f6' },
  { name: 'Team 2', score: 0, color: '#ef4444' },
  { name: 'Team 3', score: 0, color: '#f59e0b' },
  { name: 'Team 4', score: 0, color: '#22c55e' },
]

const LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e']

function HouseTVInner() {
  const params = useSearchParams()
  const ageGroup = params.get('age') || 'P1-P2'
  const qs = questions[ageGroup] || []

  const [authed] = useState(() => typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === 'true')
  const [phase, setPhase] = useState<'setup' | 'game' | 'answer' | 'finished'>('setup')
  const [numTeams, setNumTeams] = useState(2)
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS)
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timerRunning, timeLeft])

  const startTimer = () => {
    setTimeLeft(TOTAL_TIME)
    setRevealed(false)
    setTimerRunning(true)
  }

  const revealAnswer = () => {
    setTimerRunning(false)
    setRevealed(true)
  }

  const addPoint = (teamIdx: number) => {
    setTeams(prev => prev.map((t, i) => i === teamIdx ? { ...t, score: t.score + 1 } : t))
  }

  const removePoint = (teamIdx: number) => {
    setTeams(prev => prev.map((t, i) => i === teamIdx ? { ...t, score: Math.max(0, t.score - 1) } : t))
  }

  const nextQuestion = () => {
    if (current + 1 >= qs.length) { setPhase('finished'); return }
    setCurrent(c => c + 1)
    setTimeLeft(TOTAL_TIME)
    setTimerRunning(false)
    setRevealed(false)
    setPhase('game')
  }

  const updateTeamName = (idx: number, name: string) => {
    setTeams(prev => prev.map((t, i) => i === idx ? { ...t, name } : t))
  }

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <p style={{ marginBottom: '16px' }}>Please log in first.</p>
        <Link href="/esl-games/live/premium/house" style={{ color: '#0d9488', fontWeight: 'bold' }}>← Back</Link>
      </div>
    </main>
  )

  if (phase === 'setup') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '40px', maxWidth: '600px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏠</div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold' }}>Around the House — TV Mode</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>{ageGroup} • {qs.length} questions</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px', fontWeight: 'bold' }}>NUMBER OF TEAMS</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => setNumTeams(n)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid', borderColor: numTeams === n ? '#0d9488' : 'rgba(255,255,255,0.15)', background: numTeams === n ? '#0d9488' : 'transparent', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                {n} Teams
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px', fontWeight: 'bold' }}>TEAM NAMES</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {teams.slice(0, numTeams).map((team, idx) => (
              <input key={idx} value={team.name} onChange={e => updateTeamName(idx, e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: `2px solid ${team.color}`, background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', outline: 'none', fontWeight: 'bold' }} />
            ))}
          </div>
        </div>

        <button onClick={() => setPhase('game')}
          style={{ width: '100%', background: '#0d9488', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
          🏠 Start Game
        </button>
      </div>
    </main>
  )

  if (phase === 'finished') {
    const sorted = [...teams.slice(0, numTeams)].sort((a, b) => b.score - a.score)
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>🏆</div>
          <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', marginBottom: '8px' }}>Game Over!</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {sorted.map((t, i) => (
              <div key={i} style={{ background: i === 0 ? 'rgba(13,148,136,0.3)' : 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: i === 0 ? '2px solid #0d9488' : '1px solid transparent' }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {t.name}</span>
                <span style={{ color: '#0d9488', fontWeight: 'bold', fontSize: '24px' }}>{t.score}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => { setCurrent(0); setTeams(DEFAULT_TEAMS); setPhase('setup'); setRevealed(false); setTimerRunning(false) }}
              style={{ background: '#0d9488', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
            <Link href="/esl-games/live/premium/house" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back</Link>
          </div>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const timerColor = timeLeft > 8 ? '#0d9488' : timeLeft > 4 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / TOTAL_TIME) * 100

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px' }}>

      {/* TOP BAR — scores */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {teams.slice(0, numTeams).map((team, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', border: `2px solid ${team.color}40` }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{team.name}</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button onClick={() => removePoint(idx)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>−</button>
              <span style={{ color: team.color, fontWeight: 'bold', fontSize: '22px', minWidth: '36px', textAlign: 'center' }}>{team.score}</span>
              <button onClick={() => addPoint(idx)} style={{ background: team.color, border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* PROGRESS */}
      <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        Question {current + 1} of {qs.length} • {ageGroup} • 🏠 Around the House
      </div>

      {/* TIMER BAR */}
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: timerColor, fontWeight: 'bold', fontSize: '28px', minWidth: '44px', textAlign: 'center' }}>{timeLeft}</span>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '10px' }}>
          <div style={{ background: timerColor, height: '10px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
        </div>
        {/* START TIMER BUTTON — key feature */}
        {!timerRunning && !revealed && (
          <button onClick={startTimer}
            style={{ background: '#0d9488', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            ▶ Start Timer
          </button>
        )}
        {timerRunning && (
          <button onClick={() => setTimerRunning(false)}
            style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
            ⏸ Pause
          </button>
        )}
      </div>

      {/* QUESTION */}
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏠</div>
        <p style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', lineHeight: '1.4', margin: 0 }}>{q.q}</p>
      </div>

      {/* OPTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {q.options.map((opt, idx) => {
          let bg = OPTION_COLORS[idx]
          if (revealed) {
            bg = idx === q.answer ? '#16a34a' : '#334155'
          }
          return (
            <div key={idx} style={{ background: bg, borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center', transition: 'background 0.4s' }}>
              <span style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{LABELS[idx]}</span>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{opt}</span>
              {revealed && idx === q.answer && <span style={{ marginLeft: 'auto', fontSize: '20px' }}>✓</span>}
            </div>
          )
        })}
      </div>

      {/* CONTROLS */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!revealed ? (
          <button onClick={revealAnswer}
            style={{ background: '#f59e0b', color: '#0f172a', padding: '12px 32px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            👁 Reveal Answer
          </button>
        ) : (
          <button onClick={nextQuestion}
            style={{ background: '#0d9488', color: 'white', padding: '12px 32px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            {current + 1 >= qs.length ? '🏁 See Results' : 'Next Question →'}
          </button>
        )}
        <Link href="/esl-games/live/premium/house" style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Exit</Link>
      </div>
    </main>
  )
}

export default function HouseTVPage() {
  return <Suspense fallback={<main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#94a3b8' }}>Loading...</p></main>}><HouseTVInner /></Suspense>
}
