'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { questionBank, shuffle } from '../questions'

const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'

const optionColors = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a']
const optionLabels = ['A', 'B', 'C', 'D']

const TEAM_COLORS = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a']
const TEAM_NAMES = ['Team 1', 'Team 2', 'Team 3', 'Team 4']

function TVGame() {
  const searchParams = useSearchParams()
  const ageGroup = searchParams.get('ageGroup') || 'P1-P2'
  const numTeams = parseInt(searchParams.get('teams') || '2')

  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [setupDone, setSetupDone] = useState(false)
  const [teamNames, setTeamNames] = useState<string[]>(TEAM_NAMES.slice(0, numTeams))
  const [teamCount, setTeamCount] = useState(numTeams)

  const [questions] = useState(() => {
    const pool = questionBank[ageGroup] || questionBank['P1-P2']
    return shuffle(pool).slice(0, 20)
  })

  const [scores, setScores] = useState<number[]>([0, 0, 0, 0])
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [pointsAwarded, setPointsAwarded] = useState<boolean[]>([false, false, false, false])

  useEffect(() => {
    const pwd = localStorage.getItem(PASSWORD_KEY)
    const session = localStorage.getItem(SESSION_KEY)
    if (pwd && session) setAuthed(true)
    setAuthChecking(false)
  }, [])

  useEffect(() => {
    if (!running || revealed) return
    if (timeLeft === 0) { setRevealed(true); setRunning(false); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, revealed])

  function startTimer() { setRunning(true) }
  function revealAnswer() { setRevealed(true); setRunning(false) }

  function awardPoint(teamIdx: number) {
    if (pointsAwarded[teamIdx]) {
      // take away point if already awarded (toggle)
      setScores(prev => prev.map((s, i) => i === teamIdx ? s - 1 : s))
      setPointsAwarded(prev => prev.map((p, i) => i === teamIdx ? false : p))
    } else {
      setScores(prev => prev.map((s, i) => i === teamIdx ? s + 1 : s))
      setPointsAwarded(prev => prev.map((p, i) => i === teamIdx ? true : p))
    }
  }

  function next() {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1)
    setRevealed(false)
    setRunning(false)
    setTimeLeft(20)
    setPointsAwarded([false, false, false, false])
  }

  if (authChecking) return <div style={{ background: '#1a1a2e', minHeight: '100vh' }} />

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
        <Link href="/esl-games/live/premium" style={{ background: '#7C3AED', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Get Access →</Link>
      </div>
    </main>
  )

  // SETUP SCREEN — pick number of teams and names
  if (!setupDone) {
    return (
      <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '560px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📺</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>TV Mode Setup</h1>
            <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>🔤 English Quiz — {ageGroup}</p>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e', display: 'block', marginBottom: '12px' }}>How many teams?</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[2, 3, 4].map(n => (
                <button key={n} onClick={() => { setTeamCount(n); setTeamNames(TEAM_NAMES.slice(0, n)) }}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', border: teamCount === n ? '3px solid #7C3AED' : '2px solid #eee', background: teamCount === n ? '#f5f3ff' : 'white', fontWeight: 'bold', fontSize: '18px', color: teamCount === n ? '#7C3AED' : '#1a1a2e', cursor: 'pointer' }}>
                  {n} Teams
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e', display: 'block', marginBottom: '12px' }}>Team Names</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: teamCount }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '40px', borderRadius: '4px', background: TEAM_COLORS[i], flexShrink: 0 }} />
                  <input
                    value={teamNames[i] || `Team ${i + 1}`}
                    onChange={e => setTeamNames(prev => prev.map((n, idx) => idx === i ? e.target.value : n))}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '2px solid #eee', fontSize: '15px', outline: 'none', fontWeight: 'bold' }}
                    placeholder={`Team ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setSetupDone(true)}
            style={{ width: '100%', background: '#7C3AED', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
            🎮 Start Game →
          </button>
        </div>
      </div>
    )
  }

  // FINISHED SCREEN
  if (finished) {
    const maxScore = Math.max(...scores.slice(0, teamCount))
    const winners = teamNames.filter((_, i) => scores[i] === maxScore)
    return (
      <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', padding: '40px' }}>
        <div style={{ fontSize: '100px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', margin: 0 }}>Game Over!</h1>
        <p style={{ color: '#fbbf24', fontSize: '28px', fontWeight: 'bold' }}>
          {winners.length === 1 ? `🥇 Winner: ${winners[0]}!` : `🤝 Draw: ${winners.join(' & ')}!`}
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
          {teamNames.slice(0, teamCount).map((name, i) => (
            <div key={i} style={{ background: TEAM_COLORS[i], borderRadius: '16px', padding: '20px 32px', textAlign: 'center', minWidth: '140px', border: scores[i] === maxScore ? '4px solid #fbbf24' : '4px solid transparent' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', marginBottom: '4px' }}>{name}</div>
              <div style={{ color: 'white', fontSize: '40px', fontWeight: 'bold' }}>{scores[i]}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>points</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <button onClick={() => window.location.reload()} style={{ background: '#7C3AED', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
          <Link href="/esl-games/live/premium/english" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 36px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>Change Age Group</Link>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const timerColor = timeLeft > 10 ? '#16a34a' : timeLeft > 5 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh', padding: '24px 40px', display: 'flex', flexDirection: 'column' }}>

      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', opacity: 0.7 }}>🔤 English Quiz — {ageGroup}</div>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', opacity: 0.7 }}>Question {current + 1} / {questions.length}</div>
      </div>

      {/* TIMER BAR */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '10px', marginBottom: '20px' }}>
        <div style={{ background: timerColor, height: '10px', borderRadius: '8px', width: `${(timeLeft / 20) * 100}%`, transition: 'width 1s linear, background 0.3s' }} />
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1 }}>

        {/* MAIN GAME AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* QUESTION */}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px 40px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', lineHeight: '1.3' }}>{q.q}</div>
            {running && !revealed && (
              <div style={{ color: timerColor, fontSize: '56px', fontWeight: 'bold', marginTop: '12px' }}>{timeLeft}</div>
            )}
          </div>

          {/* ANSWER OPTIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {q.options.map((opt, i) => {
              const isCorrect = opt === q.answer
              const bg = revealed ? (isCorrect ? '#16a34a' : 'rgba(255,255,255,0.06)') : optionColors[i]
              const border = revealed && isCorrect ? '4px solid #4ade80' : '4px solid transparent'
              return (
                <div key={i} style={{ background: bg, border, borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.3s' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>
                    {optionLabels[i]}
                  </div>
                  <div style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>{opt}</div>
                  {revealed && isCorrect && <div style={{ marginLeft: 'auto', fontSize: '32px' }}>✅</div>}
                </div>
              )
            })}
          </div>

          {/* CONTROL BUTTONS */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {!running && !revealed && (
              <button onClick={startTimer} style={{ background: '#16a34a', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                ▶ Start Timer
              </button>
            )}
            {!revealed && (
              <button onClick={revealAnswer} style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                💡 Reveal Answer
              </button>
            )}
            {revealed && (
              <button onClick={next} style={{ background: '#7C3AED', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                {current + 1 >= questions.length ? '🏆 See Final Scores' : 'Next Question →'}
              </button>
            )}
            <Link href="/esl-games/live/premium/english" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
              ✕ Exit
            </Link>
          </div>
        </div>

        {/* TEAM SCORES SIDEBAR */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', textAlign: 'center', marginBottom: '4px' }}>🏆 Scores</div>
          {teamNames.slice(0, teamCount).map((name, i) => (
            <div key={i} style={{ background: TEAM_COLORS[i], borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
              <div style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', lineHeight: 1 }}>{scores[i]}</div>
              {revealed && (
                <button
                  onClick={() => awardPoint(i)}
                  style={{
                    marginTop: '8px', width: '100%', padding: '8px',
                    borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
                    background: pointsAwarded[i] ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)',
                    color: 'white',
                  }}>
                  {pointsAwarded[i] ? '✓ Awarded' : '+ Give Point'}
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default function TVPage() {
  return <Suspense fallback={<div style={{ background: '#1a1a2e', minHeight: '100vh' }} />}><TVGame /></Suspense>
}
