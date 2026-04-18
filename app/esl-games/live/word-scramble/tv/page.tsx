'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { scrambleBank, scrambleWord, shuffle, getWordsByDifficulty, Difficulty } from '../questions'

function TVGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
const difficulty = (searchParams.get('difficulty') || 'easy') as Difficulty
const [words] = useState(() => shuffle(getWordsByDifficulty(topic, difficulty)).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [scrambled, setScrambled] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setScrambled(scrambleWord(words[current].word))
    setRevealed(false)
    setRunning(false)
    setTimeLeft(30)
  }, [current])

  useEffect(() => {
    if (!running || revealed) return
    if (timeLeft === 0) { setRevealed(true); setRunning(false); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, revealed])

  function next() {
    if (current + 1 >= words.length) { setFinished(true); return }
    setCurrent(c => c + 1)
  }

  if (finished) {
    return (
      <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: '120px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '64px', fontWeight: 'bold', margin: 0 }}>Game Over!</h1>
        <p style={{ color: '#ccc', fontSize: '28px' }}>Well played everyone!</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => window.location.reload()} style={{ background: '#7C3AED', color: 'white', padding: '16px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
          <Link href="/esl-games/live/word-scramble" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>Change Topic</Link>
        </div>
      </div>
    )
  }

  const w = words[current]
  const timerColor = timeLeft > 15 ? '#16a34a' : timeLeft > 8 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh', padding: '32px 48px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', opacity: 0.7 }}>🔀 Word Scramble — {topic}</div>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', opacity: 0.7 }}>Word {current + 1} / {words.length}</div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '12px', marginBottom: '32px' }}>
        <div style={{ background: timerColor, height: '12px', borderRadius: '8px', width: `${(timeLeft / 30) * 100}%`, transition: 'width 1s linear' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px', marginBottom: '16px' }}>Unscramble this word:</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {scrambled.split('').map((letter, i) => (
            <div key={i} style={{ width: '80px', height: '90px', background: '#7C3AED', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '48px', fontWeight: 'bold' }}>
              {letter}
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '20px', marginBottom: '16px' }}>💡 Hint: {w.hint}</p>

        {revealed && (
          <div style={{ background: '#16a34a', borderRadius: '20px', padding: '24px 48px', marginTop: '16px' }}>
            <p style={{ color: 'white', fontSize: '18px', margin: '0 0 8px', opacity: 0.8 }}>The answer is:</p>
            <p style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', margin: 0, letterSpacing: '8px' }}>{w.word}</p>
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
            {current + 1 >= words.length ? '🏆 Finish' : 'Next Word →'}
          </button>
        )}
        <Link href="/esl-games/live/word-scramble" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 36px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
          ✕ Exit
        </Link>
      </div>
    </div>
  )
}

export default function TVPage() {
  return <Suspense fallback={<div style={{ background: '#1a1a2e', minHeight: '100vh' }} />}><TVGame /></Suspense>
}