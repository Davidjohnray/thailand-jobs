'use client'
import { useState } from 'react'
import Link from 'next/link'
import { buildBoard, POINT_VALUES, BoardState } from '../questions'

const CAT_COLORS = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a', '#f59e0b']

export default function JeopardySoloPage() {
  const [boardState] = useState<BoardState>(() => buildBoard())
  const [view, setView] = useState<'board' | 'question' | 'answer'>('board')
  const [selectedTile, setSelectedTile] = useState<{ cat: number; row: number } | null>(null)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [used, setUsed] = useState<string[]>([])
  const [finished, setFinished] = useState(false)

  const totalTiles = 25
  const usedCount = used.length

  function selectTile(cat: number, row: number) {
    const key = `${cat}-${row}`
    if (used.includes(key)) return
    setSelectedTile({ cat, row })
    setSelectedOption(null)
    setView('question')
  }

  function handleAnswer(option: string) {
    if (selectedOption) return
    setSelectedOption(option)
    const q = boardState.board[selectedTile!.cat][selectedTile!.row]
    const isDaily = boardState.dailyDouble === `${selectedTile!.cat}-${selectedTile!.row}`
    if (option === q.answer) {
      setScore(s => s + q.points * (isDaily ? 2 : 1))
    }
    setView('answer')
  }

  function backToBoard() {
    const key = `${selectedTile!.cat}-${selectedTile!.row}`
    const newUsed = [...used, key]
    setUsed(newUsed)
    setSelectedTile(null)
    setView('board')
    if (newUsed.length === totalTiles) setFinished(true)
  }

  if (finished) {
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', color: 'white', maxWidth: '480px' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 16px' }}>Board Complete!</h1>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', marginBottom: '28px' }}>
            <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#fbbf24' }}>{score.toLocaleString()}</div>
            <div style={{ opacity: 0.7, fontSize: '18px', marginTop: '8px' }}>points</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Play Again</button>
            <Link href="/esl-games/live/jeopardy" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Back</Link>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'question' || view === 'answer') {
    const q = boardState.board[selectedTile!.cat][selectedTile!.row]
    const isDaily = boardState.dailyDouble === `${selectedTile!.cat}-${selectedTile!.row}`
    const isCorrect = selectedOption === q.answer
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', padding: '24px 16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ background: CAT_COLORS[selectedTile!.cat], color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                {boardState.categories[selectedTile!.cat]}
              </span>
              <span style={{ background: '#fbbf24', color: '#1a1a2e', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                {isDaily ? '⭐ DAILY DOUBLE — ' : ''}{q.points}{isDaily ? ' × 2!' : ' pts'}
              </span>
            </div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
              💰 {score.toLocaleString()}
            </span>
          </div>

          {isDaily && view === 'question' && (
            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', borderRadius: '16px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
              <p style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>⭐ DAILY DOUBLE! Correct answer = {q.points * 2} points!</p>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 12px' }}>For {q.points} points{isDaily ? ' × 2' : ''}...</p>
            <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: 0, lineHeight: '1.5' }}>{q.question}</p>
          </div>

          {view === 'question' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)}
                  style={{ background: ['#E85D26', '#0891b2', '#7C3AED', '#16a34a'][i], border: 'none', borderRadius: '14px', padding: '20px 12px', cursor: 'pointer', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div style={{ background: isCorrect ? 'rgba(22,163,74,0.2)' : 'rgba(239,68,68,0.2)', border: `2px solid ${isCorrect ? '#16a34a' : '#ef4444'}`, borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{isCorrect ? '✅' : '❌'}</div>
                <p style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', margin: '0 0 8px' }}>
                  {isCorrect ? `Correct! +${q.points * (isDaily ? 2 : 1)} points!` : 'Not quite!'}
                </p>
                {!isCorrect && (
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0 }}>
                    The answer was <strong style={{ color: 'white' }}>{q.answer}</strong>
                  </p>
                )}
              </div>
              <button onClick={backToBoard} style={{ width: '100%', background: '#fbbf24', color: '#1a1a2e', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' }}>
                Back to Board →
              </button>
            </>
          )}
        </div>
      </main>
    )
  }

  // BOARD VIEW
  return (
    <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link href="/esl-games/live/jeopardy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{usedCount}/{totalTiles} tiles</span>
            <span style={{ background: '#fbbf24', color: '#1a1a2e', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '16px' }}>💰 {score.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {boardState.categories.map((cat, catI) => (
            <div key={catI} style={{ background: CAT_COLORS[catI], borderRadius: '10px', padding: '12px 8px', textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: '13px', minHeight: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    background: isUsed ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)',
                    border: isDaily && !isUsed ? '2px solid #fbbf24' : '2px solid transparent',
                    borderRadius: '10px', padding: '16px 8px', cursor: isUsed ? 'default' : 'pointer',
                    color: isUsed ? 'rgba(255,255,255,0.2)' : '#fbbf24',
                    fontWeight: 'bold', fontSize: '20px', textAlign: 'center',
                    transition: 'all 0.2s', minHeight: '64px',
                  }}
                  onMouseEnter={e => { if (!isUsed) e.currentTarget.style.background = 'rgba(255,255,255,0.22)' }}
                  onMouseLeave={e => { if (!isUsed) e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}>
                  {isUsed ? '✓' : isDaily ? '⭐' : pts}
                </button>
              )
            })
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '16px' }}>
          ⭐ = Daily Double (correct answer scores double points!)
        </p>
      </div>
    </main>
  )
}