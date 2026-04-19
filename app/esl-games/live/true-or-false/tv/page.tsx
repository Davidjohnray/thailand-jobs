'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getQuestionsByDifficulty, shuffle, Difficulty } from '../questions'

function TVGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const difficulty = (searchParams.get('difficulty') || 'easy') as Difficulty
  const [questions] = useState(() => shuffle(getQuestionsByDifficulty(topic, difficulty)).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setRevealed(false)
    setRunning(false)
    setTimeLeft(15)
  }, [current])

  useEffect(() => {
    if (!running || revealed) return
    if (timeLeft === 0) { setRevealed(true); setRunning(false); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, revealed])

  function next() {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1)
  }

  if (finished) {
    return (
      <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: '120px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '64px', fontWeight: 'bold', margin: 0 }}>Game Over!</h1>
        <p style={{ color: '#ccc', fontSize: '28px' }}>Well played everyone!</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => window.location.reload()} style={{ background: '#0891b2', color: 'white', padding: '16px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
          <Link href="/esl-games/live/true-or-false" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>Change Topic</Link>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const timerColor = timeLeft > 8 ? '#16a34a' : timeLeft > 4 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh', padding: '32px 48px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', opacity: 0.7 }}>✅ True or False — {topic}</div>
        <div style={{ color: 'white', fontSize: '20px', opacity: 0.7 }}>Question {current + 1} / {questions.length}</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '12px', marginBottom: '32px' }}>
        <div style={{ background: timerColor, height: '12px', borderRadius: '8px', width: `${(timeLeft / 15) * 100}%`, transition: 'width 1s linear' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px 64px', marginBottom: '48px', textAlign: 'center', maxWidth: '900px' }}>
          <p style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', margin: 0, lineHeight: '1.4' }}>{q.statement}</p>
        </div>

        <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
          <div style={{ background: revealed ? (q.answer ? '#16a34a' : 'rgba(255,255,255,0.1)') : 'rgba(22,163,74,0.3)', borderRadius: '20px', padding: '28px 64px', textAlign: 'center', border: `3px solid ${revealed && q.answer ? '#16a34a' : 'rgba(255,255,255,0.2)'}`, transition: 'all 0.3s' }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>✅</div>
            <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>TRUE</div>
          </div>
          <div style={{ background: revealed ? (!q.answer ? '#ef4444' : 'rgba(255,255,255,0.1)') : 'rgba(239,68,68,0.3)', borderRadius: '20px', padding: '28px 64px', textAlign: 'center', border: `3px solid ${revealed && !q.answer ? '#ef4444' : 'rgba(255,255,255,0.2)'}`, transition: 'all 0.3s' }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>❌</div>
            <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>FALSE</div>
          </div>
        </div>

        {running && !revealed && (
          <div style={{ color: timerColor, fontSize: '80px', fontWeight: 'bold' }}>{timeLeft}</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {!running && !revealed && (
          <button onClick={() => setRunning(true)} style={{ background: '#16a34a', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>▶ Start Timer</button>
        )}
        {!revealed && (
          <button onClick={() => { setRevealed(true); setRunning(false) }} style={{ background: '#0891b2', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>💡 Reveal Answer</button>
        )}
        {revealed && (
          <button onClick={next} style={{ background: '#E85D26', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            {current + 1 >= questions.length ? '🏆 Finish' : 'Next Question →'}
          </button>
        )}
        <Link href="/esl-games/live/true-or-false" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 36px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>✕ Exit</Link>
      </div>
    </div>
  )
}

export default function TVPage() {
  return <Suspense fallback={<div style={{ background: '#1a1a2e', minHeight: '100vh' }} />}><TVGame /></Suspense>
}