'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { questionBank, shuffle } from '../questions'

function SoloGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const difficulty = searchParams.get('difficulty') || 'Easy'

  const [questions] = useState(() => {
    const pool = questionBank[topic]?.[difficulty] || questionBank['Animals']['Easy']
    return shuffle(pool).slice(0, 10)
  })

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [answered, setAnswered] = useState(false)

  const difficultyColor = difficulty === 'Easy' ? '#16a34a' : difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
  const difficultyEmoji = difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : '🔴'

  useEffect(() => {
    if (answered || finished) return
    if (timeLeft === 0) { setAnswered(true); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, answered, finished])

  function handleAnswer(answer: string) {
    if (answered) return
    setAnswered(true)
    setSelected(answer)
    if (answer === questions[current].answer) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
      setTimeLeft(15)
    }
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', maxWidth: '480px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Game Over!</h2>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
            <span style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{topic}</span>
            <span style={{ background: difficultyColor + '20', color: difficultyColor, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{difficultyEmoji} {difficulty}</span>
          </div>
          <div style={{ background: '#f0f4ff', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a1a2e' }}>{score}/{questions.length}</div>
            <div style={{ color: '#666', fontSize: '16px', marginTop: '4px' }}>{pct}% correct</div>
          </div>
          <p style={{ color: '#444', fontSize: '15px', marginBottom: '28px' }}>
            {pct >= 80 ? 'Excellent work! 🌟' : pct >= 50 ? 'Good effort! Keep practising.' : 'Keep trying — you will get there!'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              Play Again
            </button>
            <Link href="/esl-games/live/vocab-quiz" style={{ background: '#f0f0f0', color: '#1a1a2e', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              Change Topic
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const q = questions[current]
  const timerPct = (timeLeft / 15) * 100
  const timerColor = timeLeft > 8 ? '#16a34a' : timeLeft > 4 ? '#f59e0b' : '#ef4444'

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link href="/esl-games/live/vocab-quiz" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{topic}</span>
            <span style={{ background: difficultyColor + '20', color: difficultyColor, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{difficultyEmoji} {difficulty}</span>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>⭐ {score}</span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>Question {current + 1} of {questions.length}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: answered ? '#94a3b8' : timerColor }}>
              {answered ? '—' : `${timeLeft}s`}
            </span>
          </div>

          <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px', marginBottom: '24px' }}>
            <div style={{
              background: answered ? '#94a3b8' : timerColor,
              height: '8px', borderRadius: '8px',
              width: answered ? '0%' : `${timerPct}%`,
              transition: 'width 1s linear, background 0.3s'
            }} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 28px', lineHeight: '1.4', textAlign: 'center' }}>{q.q}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {q.options.map((opt: string, i: number) => {
              let bg = 'white'
              let border = '2px solid #e2e8f0'
              let color = '#1a1a2e'
              if (answered) {
                if (opt === q.answer) { bg = '#dcfce7'; border = '2px solid #16a34a'; color = '#15803d' }
                else if (opt === selected) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#dc2626' }
              }
              const icons = ['🅰️', '🅱️', '🅲', '🅳']
              return (
                <button key={i} onClick={() => handleAnswer(opt)} disabled={answered}
                  style={{
                    background: bg, border, color,
                    borderRadius: '12px', padding: '16px',
                    fontSize: '15px', fontWeight: '600',
                    cursor: answered ? 'default' : 'pointer',
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.2s',
                    opacity: answered && opt !== q.answer && opt !== selected ? 0.5 : 1,
                  }}>
                  <span style={{ fontSize: '20px' }}>{icons[i]}</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && !selected && (
            <div style={{ textAlign: 'center', marginTop: '16px', padding: '12px', background: '#fef2f2', borderRadius: '10px' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '15px' }}>⏰ Time's up! </span>
              <span style={{ color: '#666', fontSize: '15px' }}>The answer was </span>
              <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '15px' }}>{q.answer}</span>
            </div>
          )}

          {answered && (
            <button onClick={next} style={{ width: '100%', marginTop: '16px', background: '#1a1a2e', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              {current + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}
            </button>
          )}
        </div>

        <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px' }}>
          <div style={{ background: '#1a1a2e', height: '8px', borderRadius: '8px', width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '8px' }}>{current + 1} of {questions.length} questions</p>
      </div>
    </main>
  )
}

export default function SoloPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><SoloGame /></Suspense>
}