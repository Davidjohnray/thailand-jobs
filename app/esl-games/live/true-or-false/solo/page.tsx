'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getQuestionsByDifficulty, shuffle, Difficulty } from '../questions'

function SoloGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const difficulty = (searchParams.get('difficulty') || 'easy') as Difficulty
  const [questions] = useState(() => shuffle(getQuestionsByDifficulty(topic, difficulty)).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<boolean | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setSelected(null)
    setAnswered(false)
    setTimeLeft(10)
  }, [current])

  useEffect(() => {
    if (answered || finished) return
    if (timeLeft === 0) { setAnswered(true); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, answered, finished])

  function handleAnswer(answer: boolean) {
    if (answered) return
    setSelected(answer)
    setAnswered(true)
    if (answer === questions[current].answer) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', maxWidth: '480px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Game Over!</h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>{topic} — {difficulty}</p>
          <div style={{ background: '#ecfeff', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#0891b2' }}>{score}/{questions.length}</div>
            <div style={{ color: '#666', fontSize: '16px', marginTop: '4px' }}>{pct}% correct</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#0891b2', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>Play Again</button>
            <Link href="/esl-games/live/true-or-false" style={{ background: '#f0f0f0', color: '#1a1a2e', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>Change Topic</Link>
          </div>
        </div>
      </main>
    )
  }

  const q = questions[current]
  const timerColor = timeLeft > 6 ? '#16a34a' : timeLeft > 3 ? '#f59e0b' : '#ef4444'

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link href="/esl-games/live/true-or-false" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ background: '#ecfeff', color: '#0891b2', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{topic}</span>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>⭐ {score}</span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>Question {current + 1} of {questions.length}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: answered ? '#94a3b8' : timerColor }}>{answered ? '—' : `${timeLeft}s`}</span>
          </div>

          <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px', marginBottom: '28px' }}>
            <div style={{ background: answered ? '#94a3b8' : timerColor, height: '8px', borderRadius: '8px', width: answered ? '0%' : `${(timeLeft / 10) * 100}%`, transition: 'width 1s linear' }} />
          </div>

          <div style={{ background: '#f8faff', borderRadius: '16px', padding: '28px', marginBottom: '28px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0, lineHeight: '1.5' }}>{q.statement}</p>
          </div>

          {!answered ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => handleAnswer(true)}
                style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '16px', padding: '24px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                ✅ TRUE
              </button>
              <button onClick={() => handleAnswer(false)}
                style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '16px', padding: '24px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                ❌ FALSE
              </button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', padding: '20px', background: selected === q.answer ? '#dcfce7' : selected === null ? '#fef3c7' : '#fee2e2', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{selected === q.answer ? '✅' : selected === null ? '⏰' : '❌'}</div>
                <p style={{ fontWeight: 'bold', fontSize: '18px', color: selected === q.answer ? '#15803d' : selected === null ? '#92400e' : '#dc2626', margin: '0 0 6px' }}>
                  {selected === q.answer ? 'Correct!' : selected === null ? "Time's up!" : 'Not quite!'}
                </p>
                <p style={{ color: '#555', fontSize: '15px', margin: 0 }}>
                  The answer is <strong>{q.answer ? 'TRUE ✅' : 'FALSE ❌'}</strong>
                </p>
              </div>
              <button onClick={next} style={{ width: '100%', background: '#1a1a2e', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                {current + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}
              </button>
            </>
          )}
        </div>

        <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px', marginTop: '16px' }}>
          <div style={{ background: '#0891b2', height: '8px', borderRadius: '8px', width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>
    </main>
  )
}

export default function SoloPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><SoloGame /></Suspense>
}