'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { electricityQuestions } from '../questions'

const SESSION_KEY = 'premium_games_session'
const TOTAL_TIME = 25
const TEAM_COLORS = ['#f59e0b', '#1d4ed8', '#16a34a', '#dc2626']
const OPTION_COLORS = ['#f59e0b', '#1d4ed8', '#16a34a', '#dc2626']
const OPTION_BG = ['#fffbeb', '#eff6ff', '#f0fdf4', '#fef2f2']
type Team = { name: string; score: number; emoji: string }
const DEFAULT_TEAMS: Team[] = [
  { name: 'Team 1', score: 0, emoji: '⚡' },
  { name: 'Team 2', score: 0, emoji: '🔋' },
  { name: 'Team 3', score: 0, emoji: '💡' },
  { name: 'Team 4', score: 0, emoji: '🔌' },
]

function ElectricityTVInner() {
  const qs = electricityQuestions
  const [authed] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem(SESSION_KEY))
  const [phase, setPhase] = useState<'setup' | 'game' | 'finished'>('setup')
  const [numTeams, setNumTeams] = useState(2)
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS)
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timerRunning && timeLeft > 0) { timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000) }
    else if (timerRunning && timeLeft === 0) { setTimerRunning(false) }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timerRunning, timeLeft])

  const startTimer = () => { setTimeLeft(TOTAL_TIME); setRevealed(false); setTimerRunning(true) }
  const addPoint = (idx: number) => setTeams(prev => prev.map((t, i) => i === idx ? { ...t, score: t.score + 1 } : t))
  const removePoint = (idx: number) => setTeams(prev => prev.map((t, i) => i === idx ? { ...t, score: Math.max(0, t.score - 1) } : t))
  const revealAnswer = () => { setTimerRunning(false); setRevealed(true) }
  const updateTeam = (idx: number, name: string) => setTeams(prev => prev.map((t, i) => i === idx ? { ...t, name } : t))
  const nextQuestion = () => {
    if (current + 1 >= qs.length) { setPhase('finished'); return }
    setCurrent(c => c + 1); setTimeLeft(TOTAL_TIME); setTimerRunning(false); setRevealed(false)
  }

  if (!authed) return <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Link href="/esl-games/live/premium/electricity" style={{ color: '#f59e0b', fontWeight: 'bold' }}>← Please log in first</Link></main>

  if (phase === 'setup') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '3px solid #f59e0b' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>📺</div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>TV Classroom Mode</h1>
        <p style={{ color: '#f59e0b', fontSize: '15px', marginBottom: '32px', fontWeight: '700' }}>⚡ Electricity — {qs.length} questions</p>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '800', color: '#374151', marginBottom: '12px' }}>How many teams?</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[2,3,4].map(n => <button key={n} onClick={() => setNumTeams(n)} style={{ padding: '12px 24px', borderRadius: '12px', border: '3px solid', borderColor: numTeams === n ? '#f59e0b' : '#e5e7eb', background: numTeams === n ? '#f59e0b' : 'white', color: numTeams === n ? 'white' : '#374151', fontWeight: '800', fontSize: '18px', cursor: 'pointer' }}>{n}</button>)}
          </div>
        </div>
        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {teams.slice(0, numTeams).map((team, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>{team.emoji}</span>
              <input value={team.name} onChange={e => updateTeam(idx, e.target.value)} style={{ flex: 1, padding: '10px 16px', borderRadius: '12px', border: `3px solid ${TEAM_COLORS[idx]}`, fontSize: '16px', fontWeight: '800', outline: 'none', color: TEAM_COLORS[idx] }} />
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('game')} style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontWeight: '900', fontSize: '20px', cursor: 'pointer', boxShadow: '0 8px 28px rgba(245,158,11,0.4)' }}>
          ⚡ Start the Quiz!
        </button>
      </div>
    </main>
  )

  if (phase === 'finished') {
    const sorted = [...teams.slice(0, numTeams)].sort((a, b) => b.score - a.score)
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '3px solid #f59e0b' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a2e', marginBottom: '24px' }}>Game Over!</h1>
          {sorted.map((t, i) => <div key={i} style={{ background: i === 0 ? '#fffbeb' : '#f9fafb', borderRadius: '16px', padding: '16px 24px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: i === 0 ? '3px solid #fde68a' : '2px solid #e5e7eb' }}><span style={{ fontWeight: '800', fontSize: '20px', color: '#1a1a2e' }}>{['🥇','🥈','🥉','4️⃣'][i]} {t.emoji} {t.name}</span><span style={{ fontWeight: '900', fontSize: '28px', color: TEAM_COLORS[i] }}>{t.score}</span></div>)}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button onClick={() => { setCurrent(0); setTeams(DEFAULT_TEAMS); setPhase('setup'); setRevealed(false); setTimerRunning(false) }} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '14px 28px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>Play Again!</button>
            <Link href="/esl-games/live/premium/electricity" style={{ background: '#fffbeb', color: '#92400e', padding: '14px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>← Back</Link>
          </div>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const timerColor = timeLeft > 15 ? '#22c55e' : timeLeft > 8 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / TOTAL_TIME) * 100

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e 0%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
      {/* Scoreboard */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {teams.slice(0, numTeams).map((team, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: '20px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', border: `3px solid ${TEAM_COLORS[idx]}` }}>
            <span style={{ fontSize: '24px' }}>{team.emoji}</span>
            <span style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '15px' }}>{team.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={() => removePoint(idx)} style={{ background: '#f9fafb', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', color: '#6b7280' }}>−</button>
              <span style={{ fontWeight: '900', fontSize: '24px', color: TEAM_COLORS[idx], minWidth: '32px', textAlign: 'center' }}>{team.score}</span>
              <button onClick={() => addPoint(idx)} style={{ background: TEAM_COLORS[idx], border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', color: 'white' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Timer bar */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontWeight: '800', fontSize: '14px', color: '#f59e0b' }}>Q{current + 1}/{qs.length}</span>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
          <div style={{ background: timerColor, height: '12px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
        </div>
        <span style={{ fontWeight: '900', fontSize: '28px', color: timerColor, minWidth: '40px', textAlign: 'center' }}>{timeLeft}</span>
        {!timerRunning && !revealed && <button onClick={startTimer} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(34,197,94,0.4)' }}>▶ Start Timer</button>}
        {timerRunning && <button onClick={() => setTimerRunning(false)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>⏸ Pause</button>}
      </div>

      {/* Question */}
      <div style={{ background: 'white', borderRadius: '24px', padding: '28px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '3px solid #f59e0b', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚡</div>
        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#1a1a2e', margin: 0, lineHeight: '1.5', maxWidth: '680px' }}>{q.question}</h2>
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.answer
          let bg = OPTION_BG[idx], border = `3px solid ${OPTION_COLORS[idx]}60`
          if (revealed) { if (isCorrect) { bg = '#dcfce7'; border = '3px solid #16a34a' } else { bg = 'rgba(255,255,255,0.05)'; border = '3px solid rgba(255,255,255,0.1)' } }
          return (
            <div key={idx} style={{ background: bg, border, borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.3s' }}>
              <div style={{ background: revealed && isCorrect ? '#16a34a' : OPTION_COLORS[idx], color: 'white', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>
                {revealed && isCorrect ? '✓' : String.fromCharCode(65 + idx)}
              </div>
              <span style={{ fontWeight: '700', fontSize: '17px', color: revealed && isCorrect ? '#14532d' : revealed ? 'rgba(255,255,255,0.4)' : '#1a1a2e' }}>{opt}</span>
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!revealed
          ? <button onClick={revealAnswer} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '14px 40px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' }}>👁 Show Answer</button>
          : <button onClick={nextQuestion} style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: 'white', padding: '14px 40px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(29,78,216,0.4)' }}>{current + 1 >= qs.length ? '🏁 See Results!' : 'Next Question →'}</button>}
        <Link href="/esl-games/live/premium/electricity" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '14px 20px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>Exit</Link>
      </div>
    </main>
  )
}

export default function ElectricityTVPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '64px' }}>⚡</div></main>}>
      <ElectricityTVInner />
    </Suspense>
  )
}
