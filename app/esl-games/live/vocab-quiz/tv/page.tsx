'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { questionBank, shuffle } from '../questions'

const optionColors = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a']
const optionLabels = ['A', 'B', 'C', 'D']

function TVGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const difficulty = searchParams.get('difficulty') || 'Easy'

  const [questions] = useState(() => {
    const pool = questionBank[topic]?.[difficulty] || questionBank['Animals']['Easy']
    return shuffle(pool).slice(0, 10)
  })

  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  const difficultyColor = difficulty === 'Easy' ? '#16a34a' : difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
  const difficultyEmoji = difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : '🔴'

  useEffect(() => {
    if (!running || revealed) return
    if (timeLeft === 0) { setRevealed(true); setRunning(false); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, revealed])

  function startTimer() { setRunning(true) }
  function revealAnswer() { setRevealed(true); setRunning(false) }

  function next() {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1)
    setRevealed(false)
    setRunning(false)
    setTimeLeft(20)
  }

  if (finished) {
    return (
      <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', padding: '40px' }}>
        <div style={{ fontSize: '120px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '64px', fontWeight: 'bold', margin: 0 }}>Game Over!</h1>
        <p style={{ color: '#ccc', fontSize: '28px' }}>Well played everyone!</p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button onClick={() => window.location.reload()} style={{ background: '#E85D26', color: 'white', padding: '16px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
          <Link href="/esl-games/live/vocab-quiz" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>Change Topic</Link>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const timerColor = timeLeft > 10 ? '#16a34a' : timeLeft > 5 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh', padding: '32px 48px', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', opacity: 0.7 }}>🎮 Vocab Quiz — {topic}</div>
          <span style={{ background: difficultyColor + '30', color: difficultyColor, padding: '4px 14px', borderRadius: '20px', fontSize: '15px', fontWeight: '600' }}>{difficultyEmoji} {difficulty}</span>
        </div>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', opacity: 0.7 }}>Question {current + 1} / {questions.length}</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '12px', marginBottom: '32px' }}>
        <div style={{ background: timerColor, height: '12px', borderRadius: '8px', width: `${(timeLeft / 20) * 100}%`, transition: 'width 1s linear, background 0.3s' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px 60px', textAlign: 'center', maxWidth: '900px', marginBottom: '40px' }}>
          <div style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', lineHeight: '1.3' }}>{q.q}</div>
          {running && !revealed && (
            <div style={{ color: timerColor, fontSize: '64px', fontWeight: 'bold', marginTop: '16px' }}>{timeLeft}</div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', maxWidth: '900px' }}>
          {q.options.map((opt: string, i: number) => {
            const isCorrect = opt === q.answer
            const bg = revealed ? (isCorrect ? '#16a34a' : 'rgba(255,255,255,0.08)') : optionColors[i]
            const border = revealed && isCorrect ? '4px solid #4ade80' : '4px solid transparent'
            return (
              <div key={i} style={{ background: bg, border, borderRadius: '16px', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>
                  {optionLabels[i]}
                </div>
                <div style={{ color: 'white', fontSize: '26px', fontWeight: 'bold' }}>{opt}</div>
                {revealed && isCorrect && <div style={{ marginLeft: 'auto', fontSize: '36px' }}>✅</div>}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
        {!running && !revealed && (
          <button onClick={startTimer} style={{ background: '#16a34a', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            ▶ Start Timer
          </button>
        )}
        {!revealed && (
          <button onClick={revealAnswer} style={{ background: '#E85D26', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            💡 Reveal Answer
          </button>
        )}
        {revealed && (
          <button onClick={next} style={{ background: '#0891b2', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            {current + 1 >= questions.length ? '🏆 Finish' : 'Next Question →'}
          </button>
        )}
        <Link href="/esl-games/live/vocab-quiz" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 36px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
          ✕ Exit
        </Link>
      </div>
    </div>
  )
}

export default function TVPage() {
  return <Suspense fallback={<div style={{ background: '#1a1a2e', minHeight: '100vh' }} />}><TVGame /></Suspense>
}