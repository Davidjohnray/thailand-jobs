'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { electricityQuestions } from '../questions'

const SESSION_KEY = 'premium_games_session'
const OPTION_COLORS = ['#f59e0b', '#1d4ed8', '#16a34a', '#dc2626']
const OPTION_BG = ['#fffbeb', '#eff6ff', '#f0fdf4', '#fef2f2']
const TIMER_PRESETS = [10, 15, 25, 45, 60]

function ElectricitySoloInner() {
  const qs = electricityQuestions
  const [authed] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem(SESSION_KEY))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timerSetting, setTimerSetting] = useState(25)
  const [customInput, setCustomInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(25)
  const [timerRunning, setTimerRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showStar, setShowStar] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTimeLeft(timerSetting)
  }, [timerSetting])

  useEffect(() => {
    if (timerRunning && timeLeft > 0 && selected === null) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timerRunning && timeLeft === 0 && selected === null) {
      setTimerRunning(false)
      setSelected(-1)
      setTimeout(nextQuestion, 2500)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timerRunning, timeLeft, selected])

  const startTimer = () => { setTimeLeft(timerSetting); setTimerRunning(true); setGameStarted(true) }

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setTimerRunning(false); setSelected(idx); setGameStarted(true)
    if (idx === qs[current].answer) { setScore(s => s + 1); setShowStar(true); setTimeout(() => setShowStar(false), 900) }
    setTimeout(nextQuestion, 2500)
  }

  const nextQuestion = () => {
    if (current + 1 >= qs.length) { setFinished(true); return }
    setCurrent(c => c + 1); setSelected(null); setTimeLeft(timerSetting); setTimerRunning(false)
  }

  const restart = () => { setCurrent(0); setSelected(null); setScore(0); setTimeLeft(timerSetting); setTimerRunning(false); setFinished(false); setGameStarted(false) }

  const applyCustomTime = () => {
    const val = parseInt(customInput)
    if (!isNaN(val) && val >= 5 && val <= 300) {
      setTimerSetting(val)
      setTimeLeft(val)
      setCustomInput('')
    }
  }

  if (!authed) return <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Link href="/esl-games/live/premium/electricity" style={{ color: '#f59e0b', fontWeight: 'bold' }}>← Please log in first</Link></main>

  if (finished) {
    const pct = Math.round((score / qs.length) * 100)
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <style>{`@keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '3px solid #f59e0b', animation: 'popIn 0.5s ease' }}>
          <div style={{ fontSize: '80px', marginBottom: '12px' }}>{pct === 100 ? '🏆' : pct >= 80 ? '⚡' : pct >= 60 ? '💡' : '🔋'}</div>
          <h2 style={{ fontSize: '34px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'PERFECT!' : pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work!' : 'Keep studying!'}</h2>
          <p style={{ color: '#f59e0b', fontSize: '18px', marginBottom: '8px' }}>You got <strong style={{ fontSize: '24px' }}>{score}</strong> out of <strong>{qs.length}</strong>!</p>
          <div style={{ fontSize: '52px', fontWeight: '900', color: '#1d4ed8', marginBottom: '28px' }}>{pct}%</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={restart} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '14px 32px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: 'pointer' }}>🔄 Try Again!</button>
            <Link href="/esl-games/live/premium/electricity" style={{ background: '#fffbeb', color: '#92400e', padding: '14px 24px', borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '16px' }}>← Back</Link>
          </div>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const timerColor = timeLeft > timerSetting * 0.6 ? '#22c55e' : timeLeft > timerSetting * 0.3 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / timerSetting) * 100

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e 0%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <style>{`
        @keyframes starPop{0%{transform:scale(0) rotate(0deg);opacity:1}100%{transform:scale(3) rotate(180deg);opacity:0}}
        @keyframes correct{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes wrong{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
      `}</style>
      {showStar && <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '80px', animation: 'starPop 0.8s ease forwards', zIndex: 999, pointerEvents: 'none' }}>⭐</div>}

      <div style={{ width: '100%', maxWidth: '620px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <Link href="/esl-games/live/premium/electricity" style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: '14px' }}>← Exit</Link>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '20px', color: '#f59e0b' }}>⭐ {score}</div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
          {qs.map((_, i) => <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: i < current ? '#22c55e' : i === current ? '#f59e0b' : 'rgba(255,255,255,0.2)' }} />)}
        </div>

        {/* TIMER SETTING — show before game starts */}
        {!gameStarted && (
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 16px', marginBottom: '14px' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', textAlign: 'center' }}>
              ⏱️ Set Timer Per Question
            </div>
            {/* Preset buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
              {TIMER_PRESETS.map(t => (
                <button key={t} onClick={() => setTimerSetting(t)}
                  style={{ padding: '8px 16px', borderRadius: '12px', border: '2px solid', borderColor: timerSetting === t ? '#f59e0b' : 'rgba(255,255,255,0.2)', background: timerSetting === t ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: timerSetting === t ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: '800', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', minWidth: '52px' }}>
                  {t}s
                </button>
              ))}
            </div>
            {/* Custom input */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
              <input
                type="number" min="5" max="300"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyCustomTime()}
                placeholder="Custom (5–300s)"
                style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', width: '140px', outline: 'none', textAlign: 'center' }}
              />
              <button onClick={applyCustomTime}
                style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                Set
              </button>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', marginTop: '8px' }}>
              Currently: <strong style={{ color: '#f59e0b' }}>{timerSetting} seconds</strong> per question
            </div>
          </div>
        )}

        {/* Timer bar */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '10px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px', fontWeight: '900', color: timerRunning || (gameStarted && timeLeft < timerSetting) ? timerColor : 'rgba(255,255,255,0.4)', minWidth: '40px', textAlign: 'center' }}>{timeLeft}</span>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ background: timerRunning || (gameStarted && timeLeft < timerSetting) ? timerColor : 'rgba(255,255,255,0.2)', height: '10px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
          </div>
          {!timerRunning && selected === null && (
            <button onClick={startTimer}
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 3px 10px rgba(34,197,94,0.4)' }}>
              ▶ Start
            </button>
          )}
          {timerRunning && (
            <button onClick={() => setTimerRunning(false)}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
              ⏸
            </button>
          )}
          {/* Change timer mid-game */}
          {gameStarted && !timerRunning && selected === null && (
            <button onClick={() => setGameStarted(false)}
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '8px', fontWeight: '700', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              ⚙️ Timer
            </button>
          )}
        </div>

        {/* Question card */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '28px', textAlign: 'center', marginBottom: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '3px solid #f59e0b' }}>
          <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Question {current + 1} of {qs.length}</div>
          <div style={{ fontSize: '32px', marginBottom: '14px' }}>⚡</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: 0, lineHeight: '1.5' }}>{q.question}</h2>
        </div>

        {/* Answer options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                style={{ background: bg, border: `3px solid ${border}`, borderRadius: '16px', padding: '16px 20px', cursor: selected !== null ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s', animation: anim, boxShadow: selected === null ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', textAlign: 'left' }}>
                <div style={{ background: selected !== null && isCorrect ? '#16a34a' : selected !== null && isSelected ? '#dc2626' : OPTION_COLORS[idx], color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>
                  {selected !== null && isCorrect ? '✓' : selected !== null && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + idx)}
                </div>
                <span style={{ fontWeight: '700', fontSize: '15px', color: selected !== null && isCorrect ? '#14532d' : selected !== null && isSelected ? '#7f1d1d' : '#1a1a2e' }}>{opt}</span>
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default function ElectricitySoloPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '64px' }}>⚡</div></main>}>
      <ElectricitySoloInner />
    </Suspense>
  )
}
