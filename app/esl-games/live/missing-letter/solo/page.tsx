'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getMLQuestions, shuffle, buildDisplayWord, Difficulty, MLQuestion } from '../questions'

function SoloGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const difficulty = (searchParams.get('difficulty') || 'easy') as Difficulty
  const [questions] = useState<MLQuestion[]>(() => shuffle(getMLQuestions(topic, difficulty)).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setSelectedLetters([])
    setAnswered(false)
    setCorrect(false)
    setTimeLeft(15)
  }, [current])

  useEffect(() => {
    if (answered || finished) return
    if (timeLeft === 0) { setAnswered(true); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, answered, finished])

  const q = questions[current]

  function handleAnswer(option: string) {
    if (answered) return
    const newSelected = [...selectedLetters, option]

    if (q.missingIndexes.length === 1) {
      // Single missing letter — answer immediately
      setAnswered(true)
      const isCorrect = option === q.word[q.missingIndexes[0]]
      setCorrect(isCorrect)
      if (isCorrect) setScore(s => s + 1)
    } else {
      // Two missing letters — need both
      setSelectedLetters(newSelected)
      if (newSelected.length === q.missingIndexes.length) {
        setAnswered(true)
        const isCorrect = q.missingIndexes.every((idx, i) => newSelected[i] === q.word[idx])
        setCorrect(isCorrect)
        if (isCorrect) setScore(s => s + 1)
      }
    }
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
          <div style={{ background: '#f0f4ff', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1e3a5f' }}>{score}/{questions.length}</div>
            <div style={{ color: '#666', fontSize: '16px', marginTop: '4px' }}>{pct}% correct</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#1e3a5f', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>Play Again</button>
            <Link href="/esl-games/live/missing-letter" style={{ background: '#f0f0f0', color: '#1a1a2e', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>Change Topic</Link>
          </div>
        </div>
      </main>
    )
  }

  const timerColor = timeLeft > 8 ? '#16a34a' : timeLeft > 4 ? '#f59e0b' : '#ef4444'
  const displayWord = buildDisplayWord(q.word, q.missingIndexes, false)

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link href="/esl-games/live/missing-letter" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ background: '#f0f4ff', color: '#1e3a5f', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{topic}</span>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>⭐ {score}</span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>Word {current + 1} of {questions.length}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: answered ? '#94a3b8' : timerColor }}>{answered ? '—' : `${timeLeft}s`}</span>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px', marginBottom: '28px' }}>
            <div style={{ background: answered ? '#94a3b8' : timerColor, height: '8px', borderRadius: '8px', width: answered ? '0%' : `${(timeLeft / 15) * 100}%`, transition: 'width 1s linear' }} />
          </div>

          <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '8px' }}>💡 {q.hint}</p>
          <p style={{ color: '#666', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
            {q.missingIndexes.length === 1 ? 'Find the missing letter:' : `Find the ${q.missingIndexes.length} missing letters:`}
            {q.missingIndexes.length > 1 && selectedLetters.length > 0 && ` (${selectedLetters.length}/${q.missingIndexes.length} selected)`}
          </p>

          {/* Word display */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {displayWord.map((letter, i) => {
              const isMissing = q.missingIndexes.includes(i)
              const missingPos = q.missingIndexes.indexOf(i)
              const filledLetter = answered
                ? q.word[i]
                : (isMissing && selectedLetters[missingPos] ? selectedLetters[missingPos] : letter)

              return (
                <div key={i} style={{
                  width: '52px', height: '60px',
                  background: answered
                    ? (isMissing ? (correct ? '#dcfce7' : '#fee2e2') : '#f8f9fa')
                    : (isMissing ? (selectedLetters[missingPos] ? '#dbeafe' : '#1e3a5f') : '#f8f9fa'),
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', fontWeight: 'bold',
                  color: answered
                    ? (isMissing ? (correct ? '#15803d' : '#dc2626') : '#1a1a2e')
                    : (isMissing ? 'white' : '#1a1a2e'),
                  border: isMissing ? '2px solid transparent' : '2px solid #e2e8f0',
                }}>
                  {filledLetter === '_' ? '' : filledLetter}
                </div>
              )
            })}
          </div>

          {!answered ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {q.options.map((opt, i) => {
                const isSelected = selectedLetters.includes(opt)
                return (
                  <button key={i} onClick={() => handleAnswer(opt)}
                    disabled={isSelected}
                    style={{
                      background: isSelected ? '#dbeafe' : ['#E85D26', '#0891b2', '#7C3AED', '#16a34a'][i],
                      border: isSelected ? '2px solid #2D6BE4' : '2px solid transparent',
                      borderRadius: '14px', padding: '20px 12px', cursor: isSelected ? 'default' : 'pointer',
                      color: 'white', fontWeight: 'bold', fontSize: '28px', letterSpacing: '4px',
                      opacity: isSelected ? 0.7 : 1,
                    }}>
                    {opt}
                  </button>
                )
              })}
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', padding: '16px', background: correct ? '#dcfce7' : '#fee2e2', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{correct ? '✅' : '❌'}</div>
                <p style={{ fontWeight: 'bold', fontSize: '18px', color: correct ? '#15803d' : '#dc2626', margin: '0 0 4px' }}>
                  {correct ? 'Correct!' : selectedLetters.length === 0 ? "Time's up!" : 'Not quite!'}
                </p>
                <p style={{ color: '#555', fontSize: '16px', margin: 0 }}>
                  The word is <strong style={{ letterSpacing: '4px', fontSize: '20px' }}>{q.word}</strong>
                </p>
              </div>
              <button onClick={next} style={{ width: '100%', background: '#1a1a2e', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                {current + 1 >= questions.length ? 'See Results 🏆' : 'Next Word →'}
              </button>
            </>
          )}
        </div>

        <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px', marginTop: '16px' }}>
          <div style={{ background: '#1e3a5f', height: '8px', borderRadius: '8px', width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>
    </main>
  )
}

export default function SoloPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><SoloGame /></Suspense>
}