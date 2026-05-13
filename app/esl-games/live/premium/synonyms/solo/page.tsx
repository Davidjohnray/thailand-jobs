'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { questionBank, shuffle } from '../questions'

const COLOR = '#E85D26'
const optionColors = [COLOR, '#7C3AED', '#2D6BE4', '#16a34a']
const optionLabels = ['A', 'B', 'C', 'D']

function SoloGame() {
  const searchParams = useSearchParams()
  const ageGroup = searchParams.get('ageGroup') || 'P3-P4'
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [questions] = useState(() => shuffle(questionBank[ageGroup] || questionBank['P3-P4']).slice(0, 20))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [running, setRunning] = useState(true)

  useEffect(() => { const pwd = localStorage.getItem('premium_games_password'); const session = localStorage.getItem('premium_games_session'); if (pwd && session) setAuthed(true); setAuthChecking(false) }, [])
  useEffect(() => {
    if (!running || revealed) return
    if (timeLeft === 0) { setRevealed(true); setRunning(false); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, revealed])

  function handleSelect(opt: string) {
    if (revealed) return
    setSelected(opt); setRevealed(true); setRunning(false)
    if (opt === questions[current].answer) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1); setSelected(null); setRevealed(false); setTimeLeft(20); setRunning(true)
  }

  const q = questions[current]
  const timerColor = timeLeft > 10 ? '#16a34a' : timeLeft > 5 ? '#f59e0b' : '#ef4444'

  if (authChecking) return <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></main>
  if (!authed) return <main style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center' }}><Link href="/esl-games/live/premium" style={{ background: COLOR, color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Get Access →</Link></div></main>

  if (finished) return (
    <main style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>{score >= 16 ? '🏆' : score >= 12 ? '🥇' : score >= 8 ? '👍' : '📚'}</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px' }}>Quiz Complete!</h1>
        <div style={{ fontSize: '72px', fontWeight: 'bold', color: COLOR, marginBottom: '8px' }}>{score}</div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '32px' }}>out of {questions.length}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setRevealed(false); setTimeLeft(20); setRunning(true); setFinished(false) }}
            style={{ background: COLOR, color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>🔄 Play Again</button>
          <Link href="/esl-games/live/premium/synonyms" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Back</Link>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh', padding: '20px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <Link href="/esl-games/live/premium/synonyms" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ background: '#fff4f0', color: COLOR, padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>Q{current + 1}/{questions.length}</span>
            <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>Score: {score}</span>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>🔁 Synonyms & Antonyms — {ageGroup}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: timerColor }}>{timeLeft}s</span>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: '6px', height: '6px', marginBottom: '20px' }}>
            <div style={{ background: timerColor, height: '6px', borderRadius: '6px', width: `${(timeLeft / 20) * 100}%`, transition: 'width 1s linear' }} />
          </div>
          <div style={{ background: '#fff4f0', borderRadius: '12px', padding: '18px', marginBottom: '20px', borderLeft: `4px solid ${COLOR}` }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a1a2e', margin: 0, lineHeight: '1.5' }}>{q.q}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {q.options.map((opt, i) => {
              const isCorrect = opt === q.answer
              const isSelected = opt === selected
              const bg = revealed ? (isCorrect ? '#dcfce7' : isSelected ? '#ffeaea' : '#f8f9fa') : optionColors[i]
              const border = revealed ? (isCorrect ? '2px solid #16a34a' : isSelected ? '2px solid #ef4444' : '2px solid transparent') : '2px solid transparent'
              const textColor = revealed ? (isCorrect ? '#15803d' : isSelected ? '#dc2626' : '#888') : 'white'
              return (
                <button key={i} onClick={() => handleSelect(opt)} disabled={revealed}
                  style={{ background: bg, border, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: revealed ? 'default' : 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '28px', height: '28px', background: revealed ? (isCorrect ? '#16a34a' : isSelected ? '#ef4444' : '#e2e8f0') : 'rgba(255,255,255,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '13px', flexShrink: 0 }}>{optionLabels[i]}</div>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: textColor }}>{opt}</span>
                  {revealed && isCorrect && <span style={{ marginLeft: 'auto' }}>✅</span>}
                  {revealed && isSelected && !isCorrect && <span style={{ marginLeft: 'auto' }}>❌</span>}
                </button>
              )
            })}
          </div>
          {revealed && (
            <button onClick={next} style={{ background: COLOR, color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', width: '100%' }}>
              {current + 1 >= questions.length ? '🏆 See Results' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default function SoloPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><SoloGame /></Suspense>
}
