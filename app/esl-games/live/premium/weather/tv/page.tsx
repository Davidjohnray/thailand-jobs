'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { weatherQuestions } from '../questions'

const SESSION_KEY = 'premium_games_session'
const TOTAL_TIME = 20
const TEAM_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#22c55e']
const OPTION_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#22c55e']

const skyGradients: Record<string, string> = {
  '☀️': 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 50%, #fde68a 100%)',
  '🌧️': 'linear-gradient(180deg, #475569 0%, #64748b 50%, #94a3b8 100%)',
  '⛅': 'linear-gradient(180deg, #0ea5e9 0%, #7dd3fc 50%, #e0f2fe 100%)',
  '❄️': 'linear-gradient(180deg, #1e3a5f 0%, #3b82f6 50%, #bfdbfe 100%)',
  '💨': 'linear-gradient(180deg, #0f766e 0%, #14b8a6 50%, #99f6e4 100%)',
  '⛈️': 'linear-gradient(180deg, #1e1b4b 0%, #3730a3 50%, #6366f1 100%)',
  '🌈': 'linear-gradient(180deg, #0ea5e9 0%, #a78bfa 40%, #f9a8d4 100%)',
  '🌫️': 'linear-gradient(180deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)',
  '🌩️': 'linear-gradient(180deg, #312e81 0%, #4338ca 50%, #818cf8 100%)',
  '🌪️': 'linear-gradient(180deg, #292524 0%, #57534e 50%, #a8a29e 100%)',
  '🌂': 'linear-gradient(180deg, #475569 0%, #64748b 50%, #94a3b8 100%)',
  '🕶️': 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 50%, #fde68a 100%)',
  '🧥': 'linear-gradient(180deg, #1e3a5f 0%, #3b82f6 50%, #bfdbfe 100%)',
  '🏖️': 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 50%, #fef08a 100%)',
  '☕': 'linear-gradient(180deg, #1e3a5f 0%, #3b82f6 50%, #bfdbfe 100%)',
  '⛄': 'linear-gradient(180deg, #1e3a5f 0%, #3b82f6 50%, #bfdbfe 100%)',
  '🌸': 'linear-gradient(180deg, #ec4899 0%, #f9a8d4 50%, #fce7f3 100%)',
  '🍂': 'linear-gradient(180deg, #92400e 0%, #d97706 50%, #fde68a 100%)',
}

type Team = { name: string; score: number; emoji: string }
const DEFAULT_TEAMS: Team[] = [
  { name: 'Team 1', score: 0, emoji: '☀️' },
  { name: 'Team 2', score: 0, emoji: '🌧️' },
  { name: 'Team 3', score: 0, emoji: '❄️' },
  { name: 'Team 4', score: 0, emoji: '🌈' },
]

function WeatherTVInner() {
  const qs = weatherQuestions
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
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false)
    }
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

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9, #bae6fd)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Link href="/esl-games/live/premium/weather" style={{ color: 'white', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none' }}>← Please log in first</Link>
    </main>
  )

  if (phase === 'setup') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9, #38bdf8, #bae6fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '4px solid #7dd3fc' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>📺</div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0c4a6e', marginBottom: '6px' }}>TV Classroom Mode</h1>
        <p style={{ color: '#0369a1', fontSize: '15px', marginBottom: '32px', fontWeight: '700' }}>🌤️ Weather Watch — {qs.length} questions</p>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '800', color: '#374151', marginBottom: '12px' }}>How many teams?</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => setNumTeams(n)}
                style={{ padding: '12px 24px', borderRadius: '12px', border: '3px solid', borderColor: numTeams === n ? '#0ea5e9' : '#e0f2fe', background: numTeams === n ? '#0ea5e9' : '#f0f9ff', color: numTeams === n ? 'white' : '#0369a1', fontWeight: '800', fontSize: '18px', cursor: 'pointer' }}>
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
          style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', fontWeight: '900', fontSize: '20px', cursor: 'pointer', boxShadow: '0 8px 28px rgba(14,165,233,0.5)' }}>
          ⛅ Start Weather Watch!
        </button>
      </div>
    </main>
  )

  if (phase === 'finished') {
    const sorted = [...teams.slice(0, numTeams)].sort((a, b) => b.score - a.score)
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9, #38bdf8, #bae6fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '4px solid #7dd3fc' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0c4a6e', marginBottom: '24px' }}>Game Over!</h1>
          {sorted.map((t, i) => (
            <div key={i} style={{ background: i === 0 ? '#f0f9ff' : '#f9fafb', borderRadius: '16px', padding: '16px 24px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: i === 0 ? '3px solid #7dd3fc' : '2px solid #e5e7eb' }}>
              <span style={{ fontWeight: '800', fontSize: '20px', color: '#0c4a6e' }}>{['🥇','🥈','🥉','4️⃣'][i]} {t.emoji} {t.name}</span>
              <span style={{ fontWeight: '900', fontSize: '28px', color: TEAM_COLORS[i] }}>{t.score}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button onClick={() => { setCurrent(0); setTeams(DEFAULT_TEAMS); setPhase('setup'); setRevealed(false); setTimerRunning(false) }}
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', padding: '14px 28px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>Play Again!</button>
            <Link href="/esl-games/live/premium/weather" style={{ background: '#f0f9ff', color: '#0369a1', padding: '14px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>← Back</Link>
          </div>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const bg = skyGradients[q.emoji] || 'linear-gradient(180deg, #0ea5e9, #bae6fd)'
  const timerColor = timeLeft > 12 ? '#22c55e' : timeLeft > 7 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / TOTAL_TIME) * 100

  return (
    <main style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px', transition: 'background 1.5s ease' }}>
      <style>{`
        @keyframes weatherFloat{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.08) translateY(-16px)}}
        @keyframes correctPop{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
      `}</style>

      {/* TEAMS */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {teams.slice(0, numTeams).map((team, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '20px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            <span style={{ fontSize: '24px' }}>{team.emoji}</span>
            <span style={{ fontWeight: '800', color: '#0c4a6e', fontSize: '15px' }}>{team.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={() => removePoint(idx)} style={{ background: 'rgba(0,0,0,0.08)', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', color: '#6b7280' }}>−</button>
              <span style={{ fontWeight: '900', fontSize: '24px', color: TEAM_COLORS[idx], minWidth: '32px', textAlign: 'center' }}>{team.score}</span>
              <button onClick={() => addPoint(idx)} style={{ background: TEAM_COLORS[idx], border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', color: 'white' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* TIMER */}
      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <span style={{ fontWeight: '800', fontSize: '14px', color: '#0369a1' }}>Q{current + 1}/{qs.length}</span>
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.1)', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
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
            style={{ background: 'rgba(255,255,255,0.8)', color: '#6b7280', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
            ⏸ Pause
          </button>
        )}
      </div>

      {/* BIG QUESTION */}
      <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '28px', padding: '24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '140px', animation: 'weatherFloat 3s ease-in-out infinite', marginBottom: '16px' }}>{q.emoji}</div>
        <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#0c4a6e', margin: 0 }}>{q.question}</h2>
      </div>

      {/* OPTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.answer
          let bgOpt = 'rgba(255,255,255,0.92)'
          let border = `3px solid ${OPTION_COLORS[idx]}60`
          let anim = ''
          if (revealed) {
            if (isCorrect) { bgOpt = '#dcfce7'; border = '3px solid #16a34a'; anim = 'correctPop 0.4s ease' }
            else { bgOpt = 'rgba(255,255,255,0.5)'; border = '3px solid rgba(255,255,255,0.3)' }
          }
          return (
            <div key={idx} style={{ background: bgOpt, border, borderRadius: '20px', padding: '16px', textAlign: 'center', transition: 'all 0.3s', animation: anim, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
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
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', padding: '14px 36px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(14,165,233,0.4)' }}>
            {current + 1 >= qs.length ? '🏁 See Results!' : 'Next! →'}
          </button>
        )}
        <Link href="/esl-games/live/premium/weather" style={{ background: 'rgba(255,255,255,0.9)', color: '#0369a1', padding: '14px 20px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>Exit</Link>
      </div>
    </main>
  )
}

export default function WeatherTVPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9, #bae6fd)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '64px' }}>🌤️</div></main>}>
      <WeatherTVInner />
    </Suspense>
  )
}
