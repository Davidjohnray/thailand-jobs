'use client'
import { useState } from 'react'
import Link from 'next/link'
import { buildBoard, POINT_VALUES, BoardState } from '../questions'

const CAT_COLORS = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a', '#f59e0b']

export default function JeopardyTVPage() {
  const [boardState] = useState<BoardState>(() => buildBoard())
  const [view, setView] = useState<'board' | 'question' | 'answer'>('board')
  const [selectedTile, setSelectedTile] = useState<{ cat: number; row: number } | null>(null)
  const [used, setUsed] = useState<string[]>([])

  function selectTile(cat: number, row: number) {
    if (used.includes(`${cat}-${row}`)) return
    setSelectedTile({ cat, row })
    setView('question')
  }

  function reveal() { setView('answer') }

  function next() {
    const key = `${selectedTile!.cat}-${selectedTile!.row}`
    setUsed(u => [...u, key])
    setSelectedTile(null)
    setView('board')
  }

  if (view === 'question' || view === 'answer') {
    const q = boardState.board[selectedTile!.cat][selectedTile!.row]
    const isDaily = boardState.dailyDouble === `${selectedTile!.cat}-${selectedTile!.row}`
    return (
      <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <span style={{ background: CAT_COLORS[selectedTile!.cat], color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            {boardState.categories[selectedTile!.cat]}
          </span>
          <span style={{ background: '#fbbf24', color: '#1a1a2e', padding: '8px 20px', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            {isDaily ? '⭐ DAILY DOUBLE!' : `${q.points} points`}
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {isDaily && (
            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', borderRadius: '16px', padding: '20px 48px', marginBottom: '32px' }}>
              <p style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '28px', margin: 0 }}>⭐ DAILY DOUBLE! Worth {q.points * 2} points!</p>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px 64px', textAlign: 'center', maxWidth: '800px', marginBottom: '40px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', margin: '0 0 16px' }}>For {q.points}{isDaily ? ' × 2 = ' + q.points * 2 : ''} points...</p>
            <p style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: 0, lineHeight: '1.4' }}>{q.question}</p>
          </div>

          {view === 'answer' && (
            <div style={{ background: 'rgba(22,163,74,0.2)', border: '3px solid #16a34a', borderRadius: '20px', padding: '24px 48px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px', margin: '0 0 8px' }}>The answer is:</p>
              <p style={{ color: '#4ade80', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>{q.answer}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {view === 'question' && (
            <button onClick={reveal} style={{ background: '#fbbf24', color: '#1a1a2e', padding: '16px 48px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
              💡 Reveal Answer
            </button>
          )}
          {view === 'answer' && (
            <button onClick={next} style={{ background: '#16a34a', color: 'white', padding: '16px 48px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
              Back to Board →
            </button>
          )}
          <button onClick={() => { setView('board'); setSelectedTile(null) }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '16px 32px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            ✕ Skip
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', padding: '32px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <Link href="/esl-games/live/jeopardy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '16px' }}>← Back</Link>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>🎯 Jeopardy</h1>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>{used.length}/25 tiles used</span>
      </div>

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