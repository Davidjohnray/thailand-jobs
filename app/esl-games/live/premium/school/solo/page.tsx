'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { schoolQuestions } from '../questions'

const SESSION_KEY = 'premium_games_session'
const TOTAL_TIME = 20
const OPTION_COLORS = ['#f97316', '#eab308', '#3b82f6', '#22c55e']
const OPTION_BG = ['#fff7ed', '#fefce8', '#eff6ff', '#f0fdf4']

function SchoolSoloInner() {
  const qs = schoolQuestions
  const [authed] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem(SESSION_KEY))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showStar, setShowStar] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timerRunning && timeLeft > 0 && selected === null) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false)
      if (selected === null) { setSelected(-1); setTimeout(nextQuestion, 2000) }
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timerRunning, timeLeft, selected])

  const startTimer = () => { setTimeLeft(TOTAL_TIME); setTimerRunning(true) }
  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setTimerRunning(false); setSelected(idx)
    if (idx === qs[current].answer) { setScore(s => s + 1); setShowStar(true); setTimeout(() => setShowStar(false), 900) }
    setTimeout(nextQuestion, 2000)
  }
  const nextQuestion = () => {
    if (current + 1 >= qs.length) { setFinished(true); return }
    setCurrent(c => c + 1); setSelected(null); setTimeLeft(TOTAL_TIME); setTimerRunning(false)
  }
  const restart = () => { setCurrent(0); setSelected(null); setScore(0); setTimeLeft(TOTAL_TIME); setTimerRunning(false); setFinished(false) }

  if (!authed) return <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed, #fef9c3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Link href="/esl-games/live/premium/school" style={{ color: '#f97316', fontWeight: 'bold' }}>← Please log in first</Link></main>

  if (finished) {
    const pct = Math.round((score / qs.length) * 100)
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed, #fef9c3, #f0fdf4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <style>{`@keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #fdba74', animation: 'popIn 0.5s ease' }}>
          <div style={{ fontSize: '80px', marginBottom: '12px' }}>{pct === 100 ? '🏆' : pct >= 80 ? '🌟' : pct >= 60 ? '😊' : '💪'}</div>
          <h2 style={{ fontSize: '34px', fontWeight: '900', color: '#7c2d12', marginBottom: '8px' }}>{pct === 100 ? 'PERFECT!' : pct >= 80 ? 'Amazing!' : pct >= 60 ? 'Good job!' : 'Keep trying!'}</h2>
          <p style={{ color: '#f97316', fontSize: '18px', marginBottom: '8px' }}>You got <strong style={{ fontSize: '24px' }}>{score}</strong> out of <strong>{qs.length}</strong>!</p>
          <div style={{ fontSize: '52px', fontWeight: '900', color: '#eab308', marginBottom: '28px' }}>{pct}%</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={restart} style={{ background: 'linear-gradient(135deg, #f97316, #eab308)', color: 'white', padding: '14px 32px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: 'pointer' }}>🔄 Again!</button>
            <Link href="/esl-games/live/premium/school" style={{ background: '#fff7ed', color: '#7c2d12', padding: '14px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '16px' }}>← Back</Link>
          </div>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const timerColor = timeLeft > 12 ? '#22c55e' : timeLeft > 7 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / TOTAL_TIME) * 100

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed 0%, #fef9c3 50%, #f0fdf4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <style>{`
        @keyframes starPop{0%{transform:scale(0) rotate(0deg);opacity:1}100%{transform:scale(3) rotate(180deg);opacity:0}}
        @keyframes schoolBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes correct{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes wrong{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
      `}</style>
      {showStar && <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '80px', animation: 'starPop 0.8s ease forwards', zIndex: 999, pointerEvents: 'none' }}>⭐</div>}
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <Link href="/esl-games/live/premium/school" style={{ background: 'white', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', color: '#6b7280', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Exit</Link>
          <div style={{ background: 'white', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '20px', color: '#f97316', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>⭐ {score}</div>
        </div>
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
          {qs.map((_, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < current ? '#22c55e' : i === current ? '#f97316' : '#e5e7eb', transition: 'background 0.3s' }} />)}
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '10px 16px', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', color: timerRunning || timeLeft < TOTAL_TIME ? timerColor : '#9ca3af', minWidth: '36px', textAlign: 'center' }}>{timeLeft}</span>
          <div style={{ flex: 1, background: '#fff7ed', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ background: timerRunning || timeLeft < TOTAL_TIME ? timerColor : '#fdba74', height: '10px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
          </div>
          {!timerRunning && selected === null && <button onClick={startTimer} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 3px 10px rgba(34,197,94,0.4)' }}>▶ Start</button>}
          {timerRunning && <button onClick={() => setTimerRunning(false)} style={{ background: '#fff7ed', color: '#f97316', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>⏸</button>}
        </div>
        <div style={{ background: 'white', borderRadius: '28px', padding: '28px', textAlign: 'center', marginBottom: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '3px solid #fdba74' }}>
          <p style={{ color: '#f97316', fontSize: '15px', fontWeight: '800', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {current + 1} of {qs.length}</p>
          <div style={{ fontSize: '100px', marginBottom: '10px', animation: 'schoolBounce 2.5s ease-in-out infinite' }}>{q.emoji}</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#7c2d12', margin: 0 }}>{q.question}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.answer
            const isSelected = selected === idx
            let bg = OPTION_BG[idx], border = OPTION_COLORS[idx], anim = ''
            if (selected !== null) {
              if (isCorrect) { bg = '#dcfce7'; border = '#16a34a'; anim = 'correct 0.4s ease' }
              else if (isSelected) { bg = '#fee2e2'; border = '#dc2626'; anim = 'wrong 0.4s ease' }
              else { bg = '#f9fafb'; border = '#e5e7eb' }
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={selected !== null}
                style={{ background: bg, border: `3px solid ${border}`, borderRadius: '20px', padding: '16px 8px', cursor: selected !== null ? 'default' : 'pointer', textAlign: 'center', transition: 'all 0.2s', animation: anim, boxShadow: selected === null ? '0 4px 12px rgba(0,0,0,0.08)' : 'none' }}>
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

export default function SchoolSoloPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed, #fef9c3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '64px' }}>🏫</div></main>}>
      <SchoolSoloInner />
    </Suspense>
  )
}
