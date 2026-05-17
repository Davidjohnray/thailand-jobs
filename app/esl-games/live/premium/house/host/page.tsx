'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { questions } from '../questions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SESSION_KEY = 'premium_games_session'
const TOTAL_TIME = 15
const LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e']

function HouseHostInner() {
  const params = useSearchParams()
  const ageGroup = params.get('age') || 'P1-P2'
  const roomCode = params.get('room') || ''
  const qs = questions[ageGroup] || []

  const [authed] = useState(() => typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === 'true')
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [players, setPlayers] = useState<any[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  const [finished, setFinished] = useState(false)
  const [gameId, setGameId] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!authed || !roomCode) return
    const init = async () => {
      const { data } = await supabase.from('live_game_rooms').insert([{
        room_code: roomCode,
        game_type: 'house',
        age_group: ageGroup,
        current_question: 0,
        status: 'waiting',
        question_data: qs[0],
      }]).select().single()
      if (data) setGameId(data.id)
    }
    init()
  }, [authed, roomCode])

  useEffect(() => {
    if (!gameId) return
    const sub = supabase.channel(`room-${roomCode}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_game_players', filter: `room_code=eq.${roomCode}` }, () => loadPlayers())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_game_answers', filter: `room_code=eq.${roomCode}` }, () => loadAnswers())
      .subscribe()
    loadPlayers()
    return () => { supabase.removeChannel(sub) }
  }, [gameId, roomCode])

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timerRunning, timeLeft])

  const loadPlayers = async () => {
    const { data } = await supabase.from('live_game_players').select('*').eq('room_code', roomCode)
    setPlayers(data || [])
  }

  const loadAnswers = async () => {
    const { data } = await supabase.from('live_game_answers').select('*').eq('room_code', roomCode).eq('question_index', current)
    setAnswers(data || [])
  }

  const startTimer = () => {
    setTimeLeft(TOTAL_TIME)
    setRevealed(false)
    setTimerRunning(true)
    supabase.from('live_game_rooms').update({ status: 'playing', current_question: current }).eq('room_code', roomCode)
  }

  const revealAnswer = async () => {
    setTimerRunning(false)
    setRevealed(true)
    await supabase.from('live_game_rooms').update({ status: 'reveal', correct_answer: qs[current].answer }).eq('room_code', roomCode)
    loadAnswers()
  }

  const nextQuestion = async () => {
    if (current + 1 >= qs.length) {
      setFinished(true)
      await supabase.from('live_game_rooms').update({ status: 'finished' }).eq('room_code', roomCode)
      return
    }
    const next = current + 1
    setCurrent(next)
    setTimeLeft(TOTAL_TIME)
    setTimerRunning(false)
    setRevealed(false)
    setAnswers([])
    await supabase.from('live_game_rooms').update({ current_question: next, status: 'playing', question_data: qs[next] }).eq('room_code', roomCode)
  }

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Link href="/esl-games/live/premium/house" style={{ color: '#0d9488', fontWeight: 'bold' }}>← Please log in first</Link>
    </main>
  )

  if (finished) {
    const scored = players.map(p => ({
      ...p,
      totalScore: answers.filter(a => a.player_name === p.name && a.correct).length,
    })).sort((a, b) => b.totalScore - a.totalScore)

    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🏆</div>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Game Over!</h2>
          {scored.slice(0, 5).map((p, i) => (
            <div key={i} style={{ background: i === 0 ? 'rgba(13,148,136,0.2)' : 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 20px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: i === 0 ? '1px solid #0d9488' : 'none' }}>
              <span style={{ color: 'white', fontWeight: 'bold' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {p.name}</span>
              <span style={{ color: '#0d9488', fontWeight: 'bold', fontSize: '18px' }}>{p.totalScore} pts</span>
            </div>
          ))}
          <Link href="/esl-games/live/premium/house" style={{ display: 'inline-block', marginTop: '24px', background: '#0d9488', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Menu</Link>
        </div>
      </main>
    )
  }

  const q = qs[current]
  const timerColor = timeLeft > 8 ? '#0d9488' : timeLeft > 4 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / TOTAL_TIME) * 100

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)', display: 'flex', flexDirection: 'column', padding: '20px', gap: '14px' }}>

      {/* TOP */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ background: '#0d9488', color: 'white', padding: '4px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '16px', letterSpacing: '3px' }}>{roomCode}</span>
          <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '10px' }}>jobsinthailand.net/play</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>👥 {players.length} students • Q {current + 1}/{qs.length}</span>
          <Link href="/esl-games/live/premium/house" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>Exit</Link>
        </div>
      </div>

      {/* TIMER */}
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: timerColor, fontWeight: 'bold', fontSize: '26px', minWidth: '40px', textAlign: 'center' }}>{timeLeft}</span>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '8px' }}>
          <div style={{ background: timerColor, height: '8px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear' }} />
        </div>
        <span style={{ color: '#64748b', fontSize: '13px' }}>✅ {answers.length} answered</span>
        {!timerRunning && !revealed && (
          <button onClick={startTimer}
            style={{ background: '#0d9488', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            ▶ Start Timer
          </button>
        )}
        {timerRunning && (
          <button onClick={() => setTimerRunning(false)}
            style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            ⏸
          </button>
        )}
      </div>

      {/* QUESTION */}
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏠</div>
        <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', lineHeight: '1.4', margin: 0 }}>{q.q}</p>
      </div>

      {/* OPTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {q.options.map((opt, idx) => {
          let bg = OPTION_COLORS[idx]
          if (revealed) bg = idx === q.answer ? '#16a34a' : '#334155'
          return (
            <div key={idx} style={{ background: bg, borderRadius: '10px', padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'center', transition: 'background 0.4s' }}>
              <span style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 'bold', fontSize: '13px' }}>{LABELS[idx]}</span>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>{opt}</span>
              {revealed && idx === q.answer && <span style={{ marginLeft: 'auto', fontSize: '18px' }}>✓</span>}
            </div>
          )
        })}
      </div>

      {/* CONTROLS */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!revealed ? (
          <button onClick={revealAnswer}
            style={{ background: '#f59e0b', color: '#0f172a', padding: '12px 32px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            👁 Reveal Answer
          </button>
        ) : (
          <button onClick={nextQuestion}
            style={{ background: '#0d9488', color: 'white', padding: '12px 32px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            {current + 1 >= qs.length ? '🏁 Finish Game' : 'Next Question →'}
          </button>
        )}
      </div>
    </main>
  )
}

export default function HouseHostPage() {
  return <Suspense fallback={<main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#94a3b8' }}>Loading...</p></main>}><HouseHostInner /></Suspense>
}
