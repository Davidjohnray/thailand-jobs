'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { scrambleBank, scrambleWord, shuffle } from '../questions'

function SoloGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const [words] = useState(() => shuffle(scrambleBank[topic] || scrambleBank['Animals']).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [scrambled, setScrambled] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [finished, setFinished] = useState(false)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    setScrambled(scrambleWord(words[current].word))
    setInput('')
    setAnswered(false)
    setCorrect(null)
    setTimeLeft(20)
    setHint(false)
  }, [current])

  useEffect(() => {
    if (answered || finished) return
    if (timeLeft === 0) { handleSubmit(true); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, answered, finished])

  function handleSubmit(timedOut = false) {
    if (answered) return
    setAnswered(true)
    const isCorrect = !timedOut && input.trim().toUpperCase() === words[current].word.toUpperCase()
    setCorrect(isCorrect)
    if (isCorrect) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= words.length) { setFinished(true); return }
    setCurrent(c => c + 1)
  }

  if (finished) {
    const pct = Math.round((score / words.length) * 100)
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', maxWidth: '480px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Game Over!</h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>Topic: {topic}</p>
          <div style={{ background: '#f5f3ff', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#7C3AED' }}>{score}/{words.length}</div>
            <div style={{ color: '#666', fontSize: '16px', marginTop: '4px' }}>{pct}% correct</div>
          </div>
          <p style={{ color: '#444', fontSize: '15px', marginBottom: '28px' }}>
            {pct >= 80 ? 'Amazing spelling! 🌟' : pct >= 50 ? 'Good effort! Keep practising.' : 'Keep trying — you will improve!'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#7C3AED', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>Play Again</button>
            <Link href="/esl-games/live/word-scramble" style={{ background: '#f0f0f0', color: '#1a1a2e', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>Change Topic</Link>
          </div>
        </div>
      </main>
    )
  }

  const w = words[current]
  const timerColor = timeLeft > 12 ? '#16a34a' : timeLeft > 6 ? '#f59e0b' : '#ef4444'

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link href="/esl-games/live/word-scramble" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ background: '#f5f3ff', color: '#7C3AED', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{topic}</span>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>⭐ {score}</span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>Word {current + 1} of {words.length}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: answered ? '#94a3b8' : timerColor }}>{answered ? '—' : `${timeLeft}s`}</span>
          </div>

          <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px', marginBottom: '28px' }}>
            <div style={{ background: answered ? '#94a3b8' : timerColor, height: '8px', borderRadius: '8px', width: answered ? '0%' : `${(timeLeft / 20) * 100}%`, transition: 'width 1s linear' }} />
          </div>

          <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '8px' }}>Unscramble this word:</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {scrambled.split('').map((letter, i) => (
              <div key={i} style={{ width: '48px', height: '56px', background: '#7C3AED', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                {letter}
              </div>
            ))}
          </div>

          {hint && (
            <div style={{ background: '#f5f3ff', borderRadius: '10px', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
              <span style={{ color: '#7C3AED', fontSize: '14px' }}>💡 {w.hint}</span>
            </div>
          )}

          {!answered ? (
            <>
              <input
                value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Type your answer..."
                autoFocus
                style={{ width: '100%', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif', textTransform: 'uppercase', marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleSubmit()} style={{ flex: 1, background: '#7C3AED', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Submit ✓
                </button>
                {!hint && (
                  <button onClick={() => setHint(true)} style={{ background: '#f5f3ff', color: '#7C3AED', padding: '14px 20px', borderRadius: '12px', border: '1px solid #7C3AED', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                    💡 Hint
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', padding: '16px', background: correct ? '#dcfce7' : '#fee2e2', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{correct ? '✅' : '❌'}</div>
                <p style={{ fontWeight: 'bold', fontSize: '18px', color: correct ? '#15803d' : '#dc2626', margin: '0 0 4px' }}>
                  {correct ? 'Correct!' : 'Not quite!'}
                </p>
                {!correct && (
                  <p style={{ color: '#444', fontSize: '16px', margin: 0 }}>
                    The answer was <strong style={{ letterSpacing: '3px' }}>{w.word}</strong>
                  </p>
                )}
              </div>
              <button onClick={next} style={{ width: '100%', background: '#1a1a2e', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                {current + 1 >= words.length ? 'See Results 🏆' : 'Next Word →'}
              </button>
            </>
          )}
        </div>

        <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px' }}>
          <div style={{ background: '#7C3AED', height: '8px', borderRadius: '8px', width: `${((current + (answered ? 1 : 0)) / words.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '8px' }}>{current + 1} of {words.length} words</p>
      </div>
    </main>
  )
}

export default function SoloPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><SoloGame /></Suspense>
}