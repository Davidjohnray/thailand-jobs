'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { animalQuestions } from '../questions'

const TOTAL_TIME = 20
const OPTION_COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#22c55e']
const OPTION_BG = ['#eef2ff', '#fef2f2', '#fffbeb', '#f0fdf4']
const TEAM_COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#22c55e']

type Team = { name: string; score: number; emoji: string }
const DEFAULT_TEAMS: Team[] = [
  { name: 'Team 1', score: 0, emoji: '🦁' },
  { name: 'Team 2', score: 0, emoji: '🐯' },
  { name: 'Team 3', score: 0, emoji: '🐻' },
  { name: 'Team 4', score: 0, emoji: '🐼' },
]

function AnimalsTVInner() {
  const qs = animalQuestions
  const [phase, setPhase] = useState<'setup' | 'game' | 'finished'>('setup')
  const [numTeams, setNumTeams] = useState(2)
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS)
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [celebration, setCelebration] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timerRunning, timeLeft])

  const startTimer = () => { setTimeLeft(TOTAL_TIME); setRevealed(false); setTimerRunning(true) }

  const revealAnswer = () => {
    setTimerRunning(false)
    setRevealed(true)
    setCelebration(true)
    setTimeout(() => setCelebration(false), 1500)
  }

  const addPoint = (idx: number) => setTeams(prev => prev.map((t, i) => i === idx ? { ...t, score: t.score + 1 } : t))
  const removePoint = (idx: number) => setTeams(prev => prev.map((t, i) => i === idx ? { ...t, score: Math.max(0, t.score - 1) } : t))

  const nextQuestion = () => {
    if (current + 1 >= qs.length) { setPhase('finished'); return }
    setCurrent(c => c + 1)
    setTimeLeft(TOTAL_TIME)
    setTimerRunning(false)
    setRevealed(false)
  }

  const updateTeam = (idx: number, name: string) => setTeams(prev => prev.map((t, i) => i === idx ? { ...t, name } : t))

  if (phase === 'setup') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7 0%, #dbeafe 50%, #fce7f3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #fde68a' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>📺</div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1e1b4b', marginBottom: '6px' }}>TV Classroom Mode</h1>
        <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '32px' }}>🐾 Animal Match — {qs.length} questions</p>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '800', color: '#374151', marginBottom: '12px', fontSize: '15px' }}>How many teams?</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => setNumTeams(n)}
                style={{ padding: '12px 24px', borderRadius: '12px', border: '3px solid', borderColor: numTeams === n ? '#6366f1' : '#e5e7eb', background: numTeams === n ? '#6366f1' : 'white', color: numTeams === n ? 'white' : '#374151', fontWeight: '800', fontSize: '18px', cursor: 'pointer' }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {teams.slice(0, numTeams).map((team, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>{team.emoji}</span>
              <input value={team.name} onChange={e => updateTeam(idx, e.target.value)}
                style={{ flex: 1, padding: '10px 16px', borderRadius: '12px', border: `3px solid ${TEAM_COLORS[idx]}`, fontSize: '16px', fontWeight: '800', outline: 'none', color: TEAM_COLORS[idx] }} />
            </div>
          ))}
        </div>

        <button onClick={() => setPhase('game')}
          style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', fontWeight: '900', fontSize: '20px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(245,158,11,0.4)' }}>
          🎮 Start the Game!
        </button>
      </div>
    </main>
  )

  if (phase === 'finished') {
    const sorted = [...teams.slice(0, numTeams)].sort((a, b) => b.score - a.score)
    const medals = ['🥇', '🥈', '🥉', '4️⃣']
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7, #dbeafe, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #fde68a' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1e1b4b', marginBottom: '24px' }}>Game Over!</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {sorted.map((t, i) => (
              <div key={i} style={{ background: i === 0 ? '#fffbeb' : '#f9fafb', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: i === 0 ? '3px solid #fde68a' : '2px solid #e5e7eb' }}>
                <span style={{ fontWeight: '800', fontSize: '20px', color: '#1e1b4b' }}>{medals[i]} {t.emoji} {t.name}</span>
                <span style={{ fontWeight: '900', fontSize: '28px', color: TEAM_COLORS[i] }}>{t.score}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => { setCurrent(0); setTeams(DEFAULT_TEAMS); setPhase('setup'); setRevealed(false); setTimerRunning(false) }}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', padding: '14px 28px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>Play Again!</button>
            <Link href="/esl-games/live/animals" style={{ background: '#f3f4f6', color: '#374151', padding: '14px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>← Back</Link>
          </div>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const timerColor = timeLeft > 12 ? '#22c55e' : timeLeft > 7 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / TOTAL_TIME) * 100

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7 0%, #dbeafe 50%, #fce7f3 100%)', display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
      <style>{`
        @keyframes wiggle { 0%,100%{transform:rotate(-5deg) scale(1)} 50%{transform:rotate(5deg) scale(1.05)} }
        @keyframes celebrate { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes correctPop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* TEAM SCORES */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {teams.slice(0, numTeams).map((team, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: '20px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: `3px solid ${TEAM_COLORS[idx]}20` }}>
            <span style={{ fontSize: '24px' }}>{team.emoji}</span>
            <span style={{ fontWeight: '800', color: '#1e1b4b', fontSize: '15px' }}>{team.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={() => removePoint(idx)} style={{ background: '#f3f4f6', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', color: '#6b7280' }}>−</button>
              <span style={{ fontWeight: '900', fontSize: '24px', color: TEAM_COLORS[idx], minWidth: '32px', textAlign: 'center' }}>{team.score}</span>
              <button onClick={() => addPoint(idx)} style={{ background: TEAM_COLORS[idx], border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', color: 'white' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* PROGRESS & TIMER */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <span style={{ fontWeight: '800', fontSize: '14px', color: '#6b7280' }}>Q{current + 1}/{qs.length}</span>
        <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
          <div style={{ background: timerColor, height: '12px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
        </div>
        <span style={{ fontWeight: '900', fontSize: '28px', color: timerColor, minWidth: '40px', textAlign: 'center' }}>{timeLeft}</span>
        {!timerRunning && !revealed && (
          <button onClick={startTimer}
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(34,197,94,0.4)' }}>
            ▶ Start Timer
          </button>
        )}
        {timerRunning && (
          <button onClick={() => setTimerRunning(false)}
            style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
            ⏸ Pause
          </button>
        )}
      </div>

      {/* QUESTION */}
      <div style={{ background: 'white', borderRadius: '28px', padding: '24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '3px solid #fde68a', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '120px', animation: 'wiggle 2s ease-in-out infinite', marginBottom: '12px' }}>{q.emoji}</div>
        <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#1e1b4b', margin: 0 }}>{q.question}</h2>
      </div>

      {/* OPTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.answer
          let bg = OPTION_BG[idx]
          let border = `3px solid ${OPTION_COLORS[idx]}40`
          let anim = ''
          if (revealed) {
            if (isCorrect) { bg = '#dcfce7'; border = '3px solid #16a34a'; anim = 'correctPop 0.4s ease' }
            else { bg = '#f9fafb'; border = '3px solid #e5e7eb' }
          }
          return (
            <div key={idx} style={{ background: bg, border, borderRadius: '20px', padding: '16px', textAlign: 'center', transition: 'all 0.3s', animation: anim }}>
              <div style={{ fontSize: '64px', marginBottom: '8px' }}>{opt.emoji}</div>
              <div style={{ fontWeight: '800', fontSize: '18px', color: revealed && isCorrect ? '#16a34a' : OPTION_COLORS[idx] }}>{opt.name}</div>
              {revealed && isCorrect && <div style={{ fontSize: '28px', marginTop: '6px' }}>✅</div>}
            </div>
          )
        })}
      </div>

      {/* CONTROLS */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!revealed ? (
          <button onClick={revealAnswer}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', padding: '14px 36px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' }}>
            👁 Show Answer!
          </button>
        ) : (
          <button onClick={nextQuestion}
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '14px 36px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(99,102,241,0.4)' }}>
            {current + 1 >= qs.length ? '🏁 See Results!' : 'Next Animal! →'}
          </button>
        )}
        <Link href="/esl-games/live/animals" style={{ background: 'white', color: '#6b7280', padding: '14px 20px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>Exit</Link>
      </div>
    </main>
  )
}

export default function AnimalsTVPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7, #dbeafe, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '64px' }}>🐾</div>
      </main>
    }>
      <AnimalsTVInner />
    </Suspense>
  )
}
