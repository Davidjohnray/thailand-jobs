'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { categoryBank, checkAnswer } from '../questions'

function SoloGame() {
  const searchParams = useSearchParams()
  const categoryName = searchParams.get('category') || categoryBank[0].category
  const categoryData = categoryBank.find(c => c.category === categoryName) || categoryBank[0]

  const [phase, setPhase] = useState<'ready' | 'playing' | 'finished'>('ready')
  const [timeLeft, setTimeLeft] = useState(categoryData.timeLimit)
  const [input, setInput] = useState('')
  const [correct, setCorrect] = useState<string[]>([])
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft === 0) { setPhase('finished'); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, phase])

  function startGame() {
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    if (correct.map(a => a.toLowerCase()).includes(trimmed.toLowerCase())) {
      setInput('')
      return
    }
    if (checkAnswer(trimmed, categoryData.answers)) {
      setCorrect(prev => [...prev, trimmed])
      setInput('')
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setInput('')
    }
  }

  const timerColor = timeLeft > 15 ? '#16a34a' : timeLeft > 8 ? '#f59e0b' : '#ef4444'

  if (phase === 'ready') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎭</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px' }}>Category Race</h1>
          <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
            <div style={{ color: '#065f46', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{categoryName}</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Type as many answers as you can in <strong>{categoryData.timeLimit} seconds</strong></div>
          </div>
          <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '28px', textAlign: 'left' }}>
            <div style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px', fontSize: '14px' }}>How to play:</div>
            <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.8' }}>
              ✅ Type an answer and press Enter<br/>
              🟢 Correct answers appear below<br/>
              ❌ Wrong answers shake the input<br/>
              ⏱ You have {categoryData.timeLimit} seconds — go as fast as you can!
            </div>
          </div>
          <button onClick={startGame} style={{ background: '#065f46', color: 'white', padding: '16px 48px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
            Start! →
          </button>
          <Link href="/esl-games/live/category-race" style={{ display: 'block', color: '#888', textDecoration: 'none', marginTop: '16px', fontSize: '14px' }}>← Change Category</Link>
        </div>
      </main>
    )
  }

  if (phase === 'finished') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', maxWidth: '560px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{correct.length >= 10 ? '🏆' : correct.length >= 5 ? '👍' : '💪'}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Time's Up!</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>{categoryName}</p>
          <div style={{ background: '#f0fdf4', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#065f46' }}>{correct.length}</div>
            <div style={{ color: '#666', fontSize: '16px' }}>correct answers out of {categoryData.answers.length} possible</div>
          </div>
          {correct.length > 0 && (
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '8px', fontSize: '14px' }}>✅ Your correct answers:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {correct.map(a => (
                  <span key={a} style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{a}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setPhase('ready'); setCorrect([]); setTimeLeft(categoryData.timeLimit); setInput('') }}
              style={{ background: '#065f46', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              Play Again
            </button>
            <Link href="/esl-games/live/category-race" style={{ background: '#f0f0f0', color: '#1a1a2e', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              Change Category
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ background: '#f0fdf4', color: '#065f46', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>{categoryName}</span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>✅ {correct.length}</span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: timerColor }}>{timeLeft}s</span>
          </div>
        </div>

        <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '10px', marginBottom: '20px' }}>
          <div style={{ background: timerColor, height: '10px', borderRadius: '8px', width: `${(timeLeft / categoryData.timeLimit) * 100}%`, transition: 'width 1s linear, background 0.3s' }} />
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px', textAlign: 'center' }}>Name things that are...</h2>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#065f46', margin: '0 0 24px', textAlign: 'center', lineHeight: '1.3' }}>{categoryName}</h1>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                placeholder="Type an answer and press Enter..."
                style={{
                  flex: 1, padding: '14px 16px', fontSize: '16px', borderRadius: '10px',
                  border: shake ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  outline: 'none', transition: 'border-color 0.2s',
                  animation: shake ? 'shake 0.3s ease-in-out' : 'none',
                }} />
              <button type="submit" style={{ background: '#065f46', color: 'white', padding: '14px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                ✓
              </button>
            </div>
          </form>
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-8px); }
              75% { transform: translateX(8px); }
            }
          `}</style>
        </div>

        {correct.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '10px', fontSize: '14px' }}>✅ Correct answers ({correct.length}):</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {correct.map(a => (
                <span key={a} style={{ background: '#dcfce7', color: '#15803d', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SoloPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><SoloGame /></Suspense>
}