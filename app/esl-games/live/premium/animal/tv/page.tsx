'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { questionBank, shuffle } from '../questions'

const COLOR = '#16a34a'
const optionColors = [COLOR, '#E85D26', '#7C3AED', '#2D6BE4']
const optionLabels = ['A', 'B', 'C', 'D']
const teamColors = ['#16a34a', '#E85D26', '#7C3AED', '#2D6BE4']

function TVGame() {
  const searchParams = useSearchParams()
  const ageGroup = searchParams.get('ageGroup') || 'P3-P4'
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [phase, setPhase] = useState<'setup' | 'playing' | 'finished'>('setup')
  const [numTeams, setNumTeams] = useState(2)
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2', 'Team 3', 'Team 4'])
  const [teamScores, setTeamScores] = useState([0, 0, 0, 0])
  const [lastGiven, setLastGiven] = useState<number | null>(null)
  const [questions] = useState(() => shuffle(questionBank[ageGroup] || questionBank['P3-P4']).slice(0, 20))
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [running, setRunning] = useState(false)

  useEffect(() => { const pwd = localStorage.getItem('premium_games_password'); const session = localStorage.getItem('premium_games_session'); if (pwd && session) setAuthed(true); setAuthChecking(false) }, [])
  useEffect(() => { if (!running || revealed) return; if (timeLeft === 0) { setRevealed(true); setRunning(false); return }; const t = setTimeout(() => setTimeLeft(t => t - 1), 1000); return () => clearTimeout(t) }, [timeLeft, running, revealed])

  function givePoint(i: number) {
    if (lastGiven === i) { setTeamScores(s => { const n = [...s]; n[i] = Math.max(0, n[i] - 1); return n }); setLastGiven(null) }
    else { if (lastGiven !== null) { setTeamScores(s => { const n = [...s]; n[lastGiven] = Math.max(0, n[lastGiven] - 1); return n }) }; setTeamScores(s => { const n = [...s]; n[i] += 1; return n }); setLastGiven(i) }
  }

  function next() {
    if (current + 1 >= questions.length) { setPhase('finished'); return }
    setCurrent(c => c + 1); setRevealed(false); setTimeLeft(20); setRunning(false); setLastGiven(null)
  }

  const q = questions[current]
  const timerColor = timeLeft > 10 ? '#16a34a' : timeLeft > 5 ? '#f59e0b' : '#ef4444'
  const activeTeams = teamNames.slice(0, numTeams)
  const activeScores = teamScores.slice(0, numTeams)

  if (authChecking) return <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></main>
  if (!authed) return <main style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center' }}><Link href="/esl-games/live/premium" style={{ background: COLOR, color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Get Access →</Link></div></main>

  if (phase === 'setup') return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link href="/esl-games/live/premium/animal" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
        <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginTop: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📺</div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>TV Team Mode</h1>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '6px' }}>🐾 Animal Kingdom — {ageGroup}</p>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e', display: 'block', marginBottom: '12px' }}>Number of Teams</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[2, 3, 4].map(n => (
                <button key={n} onClick={() => setNumTeams(n)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${numTeams === n ? COLOR : '#e5e7eb'}`, background: numTeams === n ? '#f0fdf4' : 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', color: numTeams === n ? COLOR : '#666' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e', display: 'block', marginBottom: '12px' }}>Team Names</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: numTeams }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: teamColors[i], flexShrink: 0 }} />
                  <input value={teamNames[i]} onChange={e => setTeamNames(n => { const x = [...n]; x[i] = e.target.value; return x })}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => { setPhase('playing'); setRunning(false) }}
            style={{ width: '100%', background: COLOR, color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '17px', cursor: 'pointer' }}>
            🚀 Start Game →
          </button>
        </div>
      </div>
    </main>
  )

  if (phase === 'finished') return (
    <main style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: '0 0 32px' }}>Final Scores!</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {activeTeams.map((name, i) => ({ name, score: activeScores[i], color: teamColors[i] })).sort((a, b) => b.score - a.score).map((t, i) => (
            <div key={t.name} style={{ background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '28px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
              <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '20px', flex: 1, textAlign: 'left' }}>{t.name}</span>
              <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '26px' }}>{t.score}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => { setPhase('setup'); setCurrent(0); setTeamScores([0, 0, 0, 0]); setRevealed(false); setLastGiven(null) }}
            style={{ background: COLOR, color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>🔄 Play Again</button>
          <Link href="/esl-games/live/premium/animal" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Back</Link>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ background: '#1a1a2e', minHeight: '100vh', padding: '16px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>🐾 Animal Kingdom</span>
            <span style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>{ageGroup}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>Q{current + 1}/{questions.length}</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: timerColor }}>{timeLeft}s</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '8px', marginBottom: '12px' }}>
              <div style={{ background: timerColor, height: '6px', borderRadius: '6px', width: `${(timeLeft / 20) * 100}%`, transition: 'width 1s linear' }} />
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '20px', marginBottom: '12px', borderLeft: `5px solid ${COLOR}` }}>
              <p style={{ fontWeight: 'bold', fontSize: '22px', color: '#1a1a2e', margin: 0, lineHeight: '1.5' }}>{q.q}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {q.options.map((opt, i) => {
                const isCorrect = opt === q.answer
                const bg = revealed ? (isCorrect ? '#dcfce7' : 'rgba(255,255,255,0.07)') : optionColors[i]
                const border = revealed && isCorrect ? '2px solid #16a34a' : '2px solid transparent'
                const textColor = revealed && isCorrect ? '#15803d' : revealed ? '#888' : 'white'
                return (
                  <div key={i} style={{ background: bg, border, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s' }}>
                    <div style={{ width: '32px', height: '32px', background: revealed ? (isCorrect ? '#16a34a' : 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '14px', flexShrink: 0 }}>{optionLabels[i]}</div>
                    <span style={{ fontWeight: '600', fontSize: '15px', color: textColor }}>{opt}</span>
                    {revealed && isCorrect && <span style={{ marginLeft: 'auto', fontSize: '20px' }}>✅</span>}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {!running && !revealed && <button onClick={() => setRunning(true)} style={{ background: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>▶ Start Timer</button>}
              {running && !revealed && <button onClick={() => { setRevealed(true); setRunning(false) }} style={{ background: COLOR, color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>💡 Reveal Answer</button>}
              {revealed && <button onClick={next} style={{ background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>{current + 1 >= questions.length ? '🏆 Final Scores' : 'Next Question →'}</button>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeTeams.map((name, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '16px 18px', border: `2px solid ${lastGiven === i ? teamColors[i] : 'transparent'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: teamColors[i] }} />
                  <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e', flex: 1 }}>{name}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '24px', color: teamColors[i] }}>{activeScores[i]}</span>
                </div>
                {revealed && (
                  <button onClick={() => givePoint(i)}
                    style={{ width: '100%', background: lastGiven === i ? teamColors[i] : '#f0f0f0', color: lastGiven === i ? 'white' : '#555', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                    {lastGiven === i ? '✓ Point Given (tap to undo)' : '+ Give Point'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function TVPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><TVGame /></Suspense>
}
