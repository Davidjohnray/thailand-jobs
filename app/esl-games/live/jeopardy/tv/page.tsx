'use client'
import { useState } from 'react'
import Link from 'next/link'
import { buildBoard, POINT_VALUES, BoardState } from '../questions'

const CAT_COLORS = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a', '#f59e0b']

const TEAMS = [
  { name: 'Team 1', color: '#E85D26', emoji: '🔴' },
  { name: 'Team 2', color: '#0891b2', emoji: '🔵' },
  { name: 'Team 3', color: '#16a34a', emoji: '🟢' },
]

export default function JeopardyTVPage() {
  const [boardState] = useState<BoardState>(() => buildBoard())
  const [view, setView] = useState<'setup' | 'board' | 'question' | 'answer'>('setup')
  const [selectedTile, setSelectedTile] = useState<{ cat: number; row: number } | null>(null)
  const [used, setUsed] = useState<string[]>([])
  const [teamCount, setTeamCount] = useState(2)
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2', 'Team 3'])
  const [scores, setScores] = useState([0, 0, 0])
  const [finished, setFinished] = useState(false)

  function selectTile(cat: number, row: number) {
    if (used.includes(`${cat}-${row}`)) return
    setSelectedTile({ cat, row })
    setView('question')
  }

  function reveal() { setView('answer') }

  function awardPoints(teamIndex: number) {
    const q = boardState.board[selectedTile!.cat][selectedTile!.row]
    const isDaily = boardState.dailyDouble === `${selectedTile!.cat}-${selectedTile!.row}`
    const pts = isDaily ? q.points * 2 : q.points
    const newScores = [...scores]
    newScores[teamIndex] += pts
    setScores(newScores)
    next()
  }

  function deductPoints(teamIndex: number) {
    const q = boardState.board[selectedTile!.cat][selectedTile!.row]
    const isDaily = boardState.dailyDouble === `${selectedTile!.cat}-${selectedTile!.row}`
    const pts = isDaily ? q.points * 2 : q.points
    const newScores = [...scores]
    newScores[teamIndex] = Math.max(0, newScores[teamIndex] - pts)
    setScores(newScores)
    next()
  }

  function next() {
    const key = `${selectedTile!.cat}-${selectedTile!.row}`
    const newUsed = [...used, key]
    setUsed(newUsed)
    setSelectedTile(null)
    setView('board')
    if (newUsed.length === 25) setFinished(true)
  }

  const activeTeams = TEAMS.slice(0, teamCount)

  // SETUP SCREEN
  if (view === 'setup') {
    return (
      <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px' }}>Jeopardy — TV Mode</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: '0 0 40px' }}>Set up your teams before starting</p>

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', marginBottom: '28px' }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 20px' }}>How many teams?</h2>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '28px' }}>
              {[2, 3].map(n => (
                <button key={n} onClick={() => setTeamCount(n)} style={{
                  background: teamCount === n ? 'white' : 'rgba(255,255,255,0.1)',
                  color: teamCount === n ? '#1a1a2e' : 'white',
                  border: 'none', borderRadius: '12px', padding: '16px 32px',
                  fontSize: '24px', fontWeight: 'bold', cursor: 'pointer',
                }}>
                  {n} Teams
                </button>
              ))}
            </div>

            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px' }}>Team Names</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
              {TEAMS.slice(0, teamCount).map((team, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{team.emoji}</span>
                  <input
                    value={teamNames[i]}
                    onChange={e => {
                      const newNames = [...teamNames]
                      newNames[i] = e.target.value
                      setTeamNames(newNames)
                    }}
                    maxLength={20}
                    style={{
                      flex: 1, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '10px',
                      padding: '12px 16px', fontSize: '16px', fontWeight: 'bold',
                      background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none',
                      fontFamily: 'sans-serif',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setView('board')}
            style={{ background: '#fbbf24', color: '#1a1a2e', padding: '18px 48px', borderRadius: '14px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
            Start Game →
          </button>
          <div style={{ marginTop: '12px' }}>
            <Link href="/esl-games/live/jeopardy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          </div>
        </div>
      </div>
    )
  }

  // FINISHED
  if (finished) {
    const winner = scores.indexOf(Math.max(...scores.slice(0, teamCount)))
    return (
      <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', width: '100%' }}>
          <div style={{ fontSize: '100px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ color: 'white', fontSize: '52px', fontWeight: 'bold', margin: '0 0 8px' }}>Game Over!</h1>
          <p style={{ color: '#fbbf24', fontSize: '28px', margin: '0 0 40px' }}>{teamNames[winner]} wins! 🎉</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {activeTeams.map((team, i) => {
              const isWinner = i === winner
              return (
                <div key={i} style={{
                  background: isWinner ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.1)',
                  borderRadius: '20px', padding: '28px 40px', textAlign: 'center', minWidth: '180px',
                  border: isWinner ? 'none' : '2px solid rgba(255,255,255,0.2)',
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>{isWinner ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                  <div style={{ color: isWinner ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>{teamNames[i]}</div>
                  <div style={{ color: isWinner ? '#1a1a2e' : '#fbbf24', fontWeight: 'bold', fontSize: '32px' }}>{scores[i].toLocaleString()}</div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#E85D26', color: 'white', padding: '16px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
            <Link href="/esl-games/live/jeopardy" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>Back</Link>
          </div>
        </div>
      </div>
    )
  }

  // QUESTION / ANSWER VIEW
  if (view === 'question' || view === 'answer') {
    const q = boardState.board[selectedTile!.cat][selectedTile!.row]
    const isDaily = boardState.dailyDouble === `${selectedTile!.cat}-${selectedTile!.row}`
    const pts = isDaily ? q.points * 2 : q.points
    return (
      <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '32px 48px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ background: CAT_COLORS[selectedTile!.cat], color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            {boardState.categories[selectedTile!.cat]}
          </span>
          <span style={{ background: '#fbbf24', color: '#1a1a2e', padding: '8px 20px', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            {isDaily ? `⭐ DAILY DOUBLE — ${pts} pts` : `${pts} points`}
          </span>
        </div>

        {/* Team scores */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
          {activeTeams.map((team, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 20px', textAlign: 'center', minWidth: '140px' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '2px' }}>{teamNames[i]}</div>
              <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '22px' }}>{scores[i].toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Question */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {isDaily && (
            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', borderRadius: '16px', padding: '16px 48px', marginBottom: '24px' }}>
              <p style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '24px', margin: 0 }}>⭐ DAILY DOUBLE! Worth {pts} points!</p>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px 64px', textAlign: 'center', maxWidth: '800px', marginBottom: '32px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', margin: '0 0 16px' }}>For {pts} points...</p>
            <p style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: 0, lineHeight: '1.4' }}>{q.question}</p>
          </div>

          {view === 'answer' && (
            <>
              <div style={{ background: 'rgba(22,163,74,0.2)', border: '3px solid #16a34a', borderRadius: '20px', padding: '20px 48px', textAlign: 'center', marginBottom: '28px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', margin: '0 0 6px' }}>The answer is:</p>
                <p style={{ color: '#4ade80', fontSize: '40px', fontWeight: 'bold', margin: 0 }}>{q.answer}</p>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: '0 0 12px' }}>Which team answered correctly?</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {activeTeams.map((team, i) => (
                    <button key={i} onClick={() => awardPoints(i)}
                      style={{ background: team.color, color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' }}>
                      ✅ {teamNames[i]}
                    </button>
                  ))}
                  <button onClick={() => next()}
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ➡ No one
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '8px 0 12px' }}>Or deduct points for a wrong answer:</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {activeTeams.map((team, i) => (
                    <button key={i} onClick={() => deductPoints(i)}
                      style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.4)', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                      ❌ {teamNames[i]} -{pts}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
          {view === 'question' && (
            <button onClick={reveal} style={{ background: '#fbbf24', color: '#1a1a2e', padding: '16px 48px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
              💡 Reveal Answer
            </button>
          )}
          <button onClick={() => next()} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '16px 32px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            ✕ Skip
          </button>
        </div>
      </div>
    )
  }

  // BOARD VIEW
  return (
    <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', padding: '24px 48px' }}>

      {/* Team scores at top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="/esl-games/live/jeopardy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '16px' }}>← Back</Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          {activeTeams.map((team, i) => (
            <div key={i} style={{ background: team.color, borderRadius: '12px', padding: '12px 24px', textAlign: 'center', minWidth: '160px' }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '2px' }}>{team.emoji} {teamNames[i]}</div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '28px' }}>{scores[i].toLocaleString()}</div>
            </div>
          ))}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>{used.length}/25 used</span>
      </div>

      {/* Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {boardState.categories.map((cat, catI) => (
          <div key={catI} style={{ background: CAT_COLORS[catI], borderRadius: '12px', padding: '20px 12px', textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: '18px', minHeight: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cat}
          </div>
        ))}
        {POINT_VALUES.map((pts, rowI) =>
          boardState.categories.map((_, catI) => {
            const key = `${catI}-${rowI}`
            const isUsed = used.includes(key)
            const isDaily = boardState.dailyDouble === key
            return (
              <button key={key} onClick={() => selectTile(catI, rowI)} disabled={isUsed}
                style={{
                  background: isUsed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
                  border: isDaily && !isUsed ? '3px solid #fbbf24' : '3px solid transparent',
                  borderRadius: '12px', padding: '20px', cursor: isUsed ? 'default' : 'pointer',
                  color: isUsed ? 'rgba(255,255,255,0.15)' : '#fbbf24',
                  fontWeight: 'bold', fontSize: '32px', textAlign: 'center',
                  transition: 'all 0.2s', minHeight: '90px',
                }}
                onMouseEnter={e => { if (!isUsed) e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={e => { if (!isUsed) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}>
                {isUsed ? '✓' : isDaily ? '⭐' : pts}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}