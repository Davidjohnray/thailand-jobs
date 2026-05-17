'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { questions } from '../questions'

const SESSION_KEY = 'premium_games_session'
const TOTAL_TIME = 15

export default function HouseSoloPage() {
  const params = useSearchParams()
  const ageGroup = params.get('age') || 'P1-P2'
  const qs = questions[ageGroup] || []

  const [authed] = useState(() => typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === 'true')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (authed && !finished && selected === null) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { handleTimeout(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [current, selected, finished, authed])

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (selected !== null) return
    setSelected(-1)
    setAnswers(prev => [...prev, false])
    setTimeout(() => nextQuestion(), 1800)
  }

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    if (timerRef.current) clearInterval(timerRef.current)
    setSelected(idx)
    const correct = idx === qs[current].answer
    if (correct) setScore(s => s + 1)
    setAnswers(prev => [...prev, correct])
    setTimeout(() => nextQuestion(), 1800)
  }

  const nextQuestion = () => {
    if (current + 1 >= qs.length) { setFinished(true); return }
    setCurrent(c => c + 1)
    setSelected(null)
    setTimeLeft(TOTAL_TIME)
  }

  const restart = () => {
    setCurrent(0); setSelected(null); setScore(0)
    setTimeLeft(TOTAL_TIME); setFinished(false); setAnswers([])
  }

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <p style={{ marginBottom: '16px' }}>Please log in first.</p>
        <Link href="/esl-games/live/premium/house" style={{ color: '#0d9488', fontWeight: 'bold' }}>← Back</Link>
      </div>
    </main>
  )

  if (finished) {
    const pct = Math.round((score / qs.length) * 100)
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '📚'}</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
            {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work!' : 'Keep practising!'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '24px' }}>You scored {score} out of {qs.length}</p>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#0d9488', marginBottom: '24px' }}>{pct}%</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {answers.map((a, i) => (
              <span key={i} style={{ background: a ? '#dcfce7' : '#fee2e2', color: a ? '#16a34a' : '#dc2626', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                {a ? '✓' : '✗'}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={restart} style={{ background: '#0d9488', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Try Again</button>
            <Link href="/esl-games/live/premium/house" style={{ background: '#f1f5f9', color: '#0f172a', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back</Link>
          </div>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const timerPct = (timeLeft / TOTAL_TIME) * 100
  const timerColor = timeLeft > 8 ? '#0d9488' : timeLeft > 4 ? '#f59e0b' : '#ef4444'
  const LABELS = ['A', 'B', 'C', 'D']
  const BG = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e']

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', padding: '24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link href="/esl-games/live/premium/house" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>← Exit</Link>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>{ageGroup}</span>
            <span style={{ background: '#0d9488', color: 'white', padding: '4px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>⭐ {score}</span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '6px', marginBottom: '8px' }}>
          <div style={{ background: '#0d9488', height: '6px', borderRadius: '8px', width: `${((current) / qs.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginBottom: '24px' }}>
          <span>Question {current + 1} of {qs.length}</span>
          <span>🏠 Around the House</span>
        </div>

        {/* Timer */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: timerColor, fontWeight: 'bold', fontSize: '24px', minWidth: '40px', textAlign: 'center' }}>{timeLeft}</span>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '8px' }}>
            <div style={{ background: timerColor, height: '8px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏠</div>
          <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', lineHeight: '1.4', margin: 0 }}>{q.q}</p>
        </div>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {q.options.map((opt, idx) => {
            let bg = BG[idx]
            if (selected !== null) {
              if (idx === q.answer) bg = '#16a34a'
              else if (idx === selected) bg = '#dc2626'
              else bg = '#334155'
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={selected !== null}
                style={{ background: bg, color: 'white', padding: '18px 14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: selected !== null ? 'not-allowed' : 'pointer', textAlign: 'left', display: 'flex', gap: '10px', alignItems: 'center', transition: 'background 0.3s' }}>
                <span style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px' }}>{LABELS[idx]}</span>
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
