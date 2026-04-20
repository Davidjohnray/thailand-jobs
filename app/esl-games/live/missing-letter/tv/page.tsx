'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getMLQuestions, shuffle, buildDisplayWord, Difficulty, MLQuestion } from '../questions'

function TVGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const difficulty = (searchParams.get('difficulty') || 'easy') as Difficulty
  const [questions] = useState<MLQuestion[]>(() => shuffle(getMLQuestions(topic, difficulty)).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setRevealed(false)
    setRunning(false)
    setTimeLeft(20)
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
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: '120px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '64px', fontWeight: 'bold', margin: 0 }}>Game Over!</h1>
        <p style={{ color: '#ccc', fontSize: '28px' }}>Well played everyone!</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => window.location.reload()} style={{ background: '#1e3a5f', color: 'white', padding: '16px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
          <Link href="/esl-games/live/missing-letter" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>Change Topic</Link>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const timerColor = timeLeft > 10 ? '#16a34a' : timeLeft > 5 ? '#f59e0b' : '#ef4444'
  const displayWord = buildDisplayWord(q.word, q.missingIndexes, revealed)

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '32px 48px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', opacity: 0.7 }}>🔤 Missing Letter — {topic}</div>
        <div style={{ color: 'white', fontSize: '20px', opacity: 0.7 }}>Word {current + 1} / {questions.length}</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '12px', marginBottom: '32px' }}>
        <div style={{ background: timerColor, height: '12px', borderRadius: '8px', width: `${(timeLeft / 20) * 100}%`, transition: 'width 1s linear' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px', marginBottom: '8px' }}>💡 {q.hint}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', marginBottom: '32px' }}>
          {q.missingIndexes.length === 1 ? 'What is the missing letter?' : `What are the ${q.missingIndexes.length} missing letters?`}
        </p>

        {/* Big word display */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {displayWord.map((letter, i) => {
            const isMissing = q.missingIndexes.includes(i)
            return (
              <div key={i} style={{
                width: '90px', height: '100px',
                background: isMissing
                  ? (revealed ? '#16a34a' : '#1e3a5f')
                  : 'rgba(255,255,255,0.1)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '52px', fontWeight: 'bold', color: 'white',
                border: isMissing ? '3px solid rgba(255,255,255,0.4)' : '3px solid transparent',
              }}>
                {letter === '_' ? '?' : letter}
              </div>
            )
          })}
        </div>

        {/* Options */}
        {!revealed && (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {q.options.map((opt, i) => (
              <div key={i} style={{
                width: '100px', height: '100px',
                background: ['#E85D26', '#0891b2', '#7C3AED', '#16a34a'][i],
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '52px', fontWeight: 'bold', color: 'white',
              }}>
                {opt}
              </div>
            ))}
          </div>
        )}

        {revealed && (
          <div style={{ background: 'rgba(22,163,74,0.2)', border: '3px solid #16a34a', borderRadius: '20px', padding: '20px 48px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', margin: '0 0 6px' }}>The answer is:</p>
            <p style={{ color: '#4ade80', fontSize: '52px', fontWeight: 'bold', margin: 0, letterSpacing: '8px' }}>{q.word}</p>
          </div>
        )}

        {running && !revealed && (
          <div style={{ color: timerColor, fontSize: '72px', fontWeight: 'bold', marginTop: '24px' }}>{timeLeft}</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
        {!running && !revealed && (
          <button onClick={() => setRunning(true)} style={{ background: '#16a34a', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            ▶ Start Timer
          </button>
        )}
        {!revealed && (
          <button onClick={() => { setRevealed(true); setRunning(false) }} style={{ background: '#E85D26', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            💡 Reveal Answer
          </button>
        )}
        {revealed && (
          <button onClick={next} style={{ background: '#0891b2', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            {current + 1 >= questions.length ? '🏆 Finish' : 'Next Word →'}
          </button>
        )}
        <Link href="/esl-games/live/missing-letter" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 36px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
          ✕ Exit
        </Link>
      </div>
    </div>
  )
}

export default function TVPage() {
  return <Suspense fallback={<div style={{ background: '#0f172a', minHeight: '100vh' }} />}><TVGame /></Suspense>
}