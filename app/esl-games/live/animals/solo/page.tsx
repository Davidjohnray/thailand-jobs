'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { animalQuestions } from '../questions'

const TOTAL_TIME = 20
const OPTION_COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#22c55e']
const OPTION_BG = ['#eef2ff', '#fef2f2', '#fffbeb', '#f0fdf4']

function AnimalsSoloInner() {
  const qs = animalQuestions
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [finished, setFinished] = useState(false)
  const [showStar, setShowStar] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!finished && selected === null) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { handleTimeout(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [current, selected, finished])

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (selected !== null) return
    setSelected(-1)
    setTimeout(nextQuestion, 2000)
  }

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    if (timerRef.current) clearInterval(timerRef.current)
    setSelected(idx)
    const correct = idx === qs[current].answer
    if (correct) { setScore(s => s + 1); setShowStar(true); setTimeout(() => setShowStar(false), 1000) }
    setTimeout(nextQuestion, 2000)
  }

  const nextQuestion = () => {
    if (current + 1 >= qs.length) { setFinished(true); return }
    setCurrent(c => c + 1)
    setSelected(null)
    setTimeLeft(TOTAL_TIME)
  }

  const restart = () => {
    setCurrent(0); setSelected(null); setScore(0)
    setTimeLeft(TOTAL_TIME); setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / qs.length) * 100)
    const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🌟' : pct >= 60 ? '😊' : '💪'
    const msg = pct === 100 ? 'PERFECT!' : pct >= 80 ? 'Amazing!' : pct >= 60 ? 'Good job!' : 'Keep trying!'
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7, #dbeafe, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <style>{`@keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }`}</style>
        <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #fde68a', animation: 'popIn 0.5s ease' }}>
          <div style={{ fontSize: '80px', marginBottom: '12px' }}>{emoji}</div>
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#1e1b4b', marginBottom: '8px' }}>{msg}</h2>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '24px' }}>You got <strong style={{ color: '#f59e0b' }}>{score}</strong> out of <strong>{qs.length}</strong> animals right!</p>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#6366f1', marginBottom: '28px' }}>{pct}%</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={restart}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', padding: '14px 32px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' }}>
              🔄 Play Again!
            </button>
            <Link href="/esl-games/live/animals" style={{ background: '#f3f4f6', color: '#374151', padding: '14px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '16px' }}>
              ← Back
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const timerColor = timeLeft > 12 ? '#22c55e' : timeLeft > 7 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / TOTAL_TIME) * 100

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7 0%, #dbeafe 50%, #fce7f3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <style>{`
        @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes wiggle { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
        @keyframes starPop { 0%{transform:scale(0) rotate(0deg);opacity:1} 100%{transform:scale(3) rotate(180deg);opacity:0} }
        @keyframes correct { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes wrong { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
      `}</style>

      {showStar && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '80px', animation: 'starPop 0.8s ease forwards', zIndex: 999, pointerEvents: 'none' }}>⭐</div>
      )}

      <div style={{ width: '100%', maxWidth: '560px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Link href="/esl-games/live/animals" style={{ background: 'white', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', color: '#6b7280', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Exit</Link>
          <div style={{ background: 'white', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '18px', color: '#f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>⭐ {score}</div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          {qs.map((_, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < current ? '#22c55e' : i === current ? '#6366f1' : '#e5e7eb', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Timer */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '10px 16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px', fontWeight: '900', color: timerColor, minWidth: '32px', textAlign: 'center' }}>{timeLeft}</span>
          <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ background: timerColor, height: '10px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
          </div>
          <span style={{ fontSize: '16px' }}>⏱️</span>
        </div>

        {/* Question card */}
        <div style={{ background: 'white', borderRadius: '28px', padding: '32px', textAlign: 'center', marginBottom: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '3px solid #fde68a' }}>
          <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Question {current + 1} of {qs.length}
          </p>
          <div style={{ fontSize: '100px', marginBottom: '12px', animation: 'wiggle 2s ease-in-out infinite' }}>{q.emoji}</div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1e1b4b', margin: 0 }}>{q.question}</h2>
        </div>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.answer
            const isSelected = selected === idx
            let bg = OPTION_BG[idx]
            let border = OPTION_COLORS[idx]
            let animation = ''
            if (selected !== null) {
              if (isCorrect) { bg = '#dcfce7'; border = '#16a34a'; animation = 'correct 0.4s ease' }
              else if (isSelected) { bg = '#fee2e2'; border = '#dc2626'; animation = 'wrong 0.4s ease' }
              else { bg = '#f9fafb'; border = '#e5e7eb' }
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={selected !== null}
                style={{
                  background: bg, border: `3px solid ${border}`, borderRadius: '20px', padding: '16px 8px',
                  cursor: selected !== null ? 'default' : 'pointer', textAlign: 'center',
                  transition: 'all 0.2s', animation, transform: isSelected && selected !== null ? '' : 'scale(1)',
                  boxShadow: selected === null ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                }}>
                <div style={{ fontSize: '52px', marginBottom: '6px' }}>{opt.emoji}</div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: border }}>{opt.name}</div>
                {selected !== null && isCorrect && <div style={{ fontSize: '20px', marginTop: '4px' }}>✅</div>}
                {selected !== null && isSelected && !isCorrect && <div style={{ fontSize: '20px', marginTop: '4px' }}>❌</div>}
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default function AnimalsSoloPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7, #dbeafe, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '64px', animation: 'bounce 1s infinite' }}>🐾</div>
      </main>
    }>
      <AnimalsSoloInner />
    </Suspense>
  )
}
