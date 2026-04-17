'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../../../src/lib/supabase'
import { questionBank } from '../questions'

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const optionColors = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a']
const optionLabels = ['A', 'B', 'C', 'D']

function HostGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const [questions] = useState(() => (questionBank[topic] || questionBank['Animals']).slice(0, 10))

  const [roomCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const existing = sessionStorage.getItem('hostRoomCode')
      if (existing) return existing
      const newCode = generateCode()
      sessionStorage.setItem('hostRoomCode', newCode)
      return newCode
    }
    return generateCode()
  })

  const [phase, setPhase] = useState<'lobby' | 'playing' | 'finished'>('lobby')
  const [players, setPlayers] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [running, setRunning] = useState(false)
  const [answers, setAnswers] = useState<any[]>([])

  async function clearRoom() {
    await supabase.from('live_game_answers').delete().eq('room_code', roomCode)
    await supabase.from('live_game_players').delete().eq('room_code', roomCode)
    await supabase.from('live_game_rooms').delete().eq('code', roomCode)
    sessionStorage.removeItem('hostRoomCode')
    window.location.reload()
  }

  // Create room in Supabase on mount
  useEffect(() => {
    const orderJson = JSON.stringify(questions)
    supabase.from('live_game_rooms').insert([{
      code: roomCode,
      game_type: 'vocab-quiz',
      topic,
      status: 'waiting',
      current_question: 0,
      question_order: orderJson,
    }]).then(({ error }: any) => {
      if (error && error.code !== '23505') console.error('Room insert error:', error.message)
      else console.log('Room ready:', roomCode)
    })
  }, [])

  // Poll for new players joining
  useEffect(() => {
    const fetchPlayers = async () => {
      const { data }: any = await supabase
        .from('live_game_players')
        .select('*')
        .eq('room_code', roomCode)
      setPlayers(data || [])
    }
    fetchPlayers()
    const interval = setInterval(fetchPlayers, 2000)
    return () => clearInterval(interval)
  }, [roomCode])

  // Poll for answers during game
  useEffect(() => {
    if (phase !== 'playing') return
    const fetchAnswers = async () => {
      const { data }: any = await supabase
        .from('live_game_answers')
        .select('*')
        .eq('room_code', roomCode)
        .eq('question_index', current)
      setAnswers(data || [])
    }
    fetchAnswers()
    const interval = setInterval(fetchAnswers, 1500)
    return () => clearInterval(interval)
  }, [roomCode, current, phase])

  // Timer
  useEffect(() => {
    if (!running || revealed) return
    if (timeLeft === 0) { handleReveal(); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, revealed])

  async function startGame() {
    await supabase.from('live_game_rooms').update({ status: 'playing', current_question: 0 }).eq('code', roomCode)
    setPhase('playing')
    setRunning(true)
  }

  async function handleReveal() {
    setRevealed(true)
    setRunning(false)
    const correctAnswer = questions[current].answer
    const { data: roundAnswers }: any = await supabase
      .from('live_game_answers')
      .select('*')
      .eq('room_code', roomCode)
      .eq('question_index', current)
    if (roundAnswers) {
      for (const ans of roundAnswers) {
        if (ans.answer === correctAnswer) {
          const player = players.find((p: any) => p.id === ans.player_id)
          await supabase.from('live_game_players')
            .update({ score: (player?.score || 0) + 1 })
            .eq('id', ans.player_id)
        }
      }
      const { data }: any = await supabase.from('live_game_players').select('*').eq('room_code', roomCode)
      setPlayers(data || [])
    }
  }

  async function nextQuestion() {
    if (current + 1 >= questions.length) {
      await supabase.from('live_game_rooms').update({ status: 'finished' }).eq('code', roomCode)
      setPhase('finished')
      return
    }
    const next = current + 1
    setCurrent(next)
    setRevealed(false)
    setRunning(true)
    setTimeLeft(15)
    setAnswers([])
    await supabase.from('live_game_rooms').update({ current_question: next }).eq('code', roomCode)
  }

  const sorted = [...players].sort((a: any, b: any) => b.score - a.score)
  const q = questions[current]
  const timerColor = timeLeft > 8 ? '#16a34a' : timeLeft > 4 ? '#f59e0b' : '#ef4444'

  // LOBBY
  if (phase === 'lobby') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link href="/esl-games/live/vocab-quiz" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📱</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Game Lobby</h1>
            <p style={{ color: '#666', fontSize: '15px', margin: '0 0 32px' }}>Share this code with your students</p>
            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Room Code</p>
              <div style={{ color: 'white', fontSize: '72px', fontWeight: 'bold', letterSpacing: '12px', lineHeight: 1 }}>{roomCode}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '16px 0 0' }}>
                Students go to <strong style={{ color: 'white' }}>jobsinthailand.net/play</strong>
              </p>
            </div>
            <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>👥 Players joined: {players.length}</span>
                <span style={{ background: '#0891b2', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>{topic}</span>
              </div>
              {players.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Waiting for players to join...</p>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {players.map((p: any) => (
                    <span key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '5px 14px', fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                      {p.nickname}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={startGame}
              disabled={players.length === 0}
              style={{ background: players.length > 0 ? '#16a34a' : '#cbd5e1', color: 'white', padding: '14px 48px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: players.length > 0 ? 'pointer' : 'default', width: '100%' }}>
              {players.length === 0 ? 'Waiting for players...' : `Start Game with ${players.length} player${players.length > 1 ? 's' : ''} →`}
            </button>
            <button onClick={clearRoom}
              style={{ background: 'transparent', color: '#888', padding: '10px', border: 'none', fontSize: '14px', cursor: 'pointer', marginTop: '8px', width: '100%' }}>
              ✕ Cancel and start fresh
            </button>
          </div>
        </div>
      </main>
    )
  }

  // FINISHED
  if (phase === 'finished') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: '0 0 32px' }}>Final Scores!</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {sorted.map((p: any, i: number) => (
              <div key={p.id} style={{ background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '28px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '18px', flex: 1, textAlign: 'left' }}>{p.nickname}</span>
                <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '22px' }}>{p.score} pts</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={clearRoom} style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              🔄 New Game
            </button>
            <Link href="/esl-games/live" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              Back to Games
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // PLAYING
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '20px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Room: {roomCode}</span>
            <span style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>{topic}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>👥 {players.length} players</span>
            <span style={{ background: '#fff3ed', color: '#E85D26', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>Q{current + 1}/{questions.length}</span>
            <button onClick={clearRoom} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              ✕ End Game
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
          <div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#888', fontSize: '14px' }}>Question {current + 1} of {questions.length}</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: timerColor }}>{timeLeft}s</span>
              </div>
              <div style={{ background: '#f0f0f0', borderRadius: '6px', height: '6px', marginBottom: '20px' }}>
                <div style={{ background: timerColor, height: '6px', borderRadius: '6px', width: `${(timeLeft / 15) * 100}%`, transition: 'width 1s linear' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 24px', lineHeight: '1.4' }}>{q.q}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {q.options.map((opt: string, i: number) => {
                  const isCorrect = opt === q.answer
                  const bg = revealed ? (isCorrect ? '#dcfce7' : '#f8f9fa') : optionColors[i]
                  const border = revealed && isCorrect ? '2px solid #16a34a' : '2px solid transparent'
                  const color = revealed ? (isCorrect ? '#15803d' : '#888') : 'white'
                  return (
                    <div key={i} style={{ background: bg, border, borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s' }}>
                      <div style={{ width: '32px', height: '32px', background: revealed ? (isCorrect ? '#16a34a' : '#e2e8f0') : 'rgba(255,255,255,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '14px', flexShrink: 0 }}>
                        {optionLabels[i]}
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '15px', color }}>{opt}</span>
                      {revealed && isCorrect && <span style={{ marginLeft: 'auto' }}>✅</span>}
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                {!revealed && (
                  <button onClick={handleReveal} style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
                    💡 Reveal Answer ({answers.length}/{players.length} answered)
                  </button>
                )}
                {revealed && (
                  <button onClick={nextQuestion} style={{ background: '#0891b2', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
                    {current + 1 >= questions.length ? '🏆 See Final Scores' : 'Next Question →'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', textAlign: 'center' }}>🏆 Leaderboard</h3>
            {sorted.length === 0 ? (
              <p style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>No scores yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sorted.map((p: any, i: number) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: i === 0 ? '#fffbeb' : '#f8f9fa', borderRadius: '10px', border: i === 0 ? '1px solid #fde68a' : '1px solid transparent' }}>
                    <span style={{ fontSize: '18px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}</span>
                    <span style={{ flex: 1, fontWeight: '600', fontSize: '14px', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nickname}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#E85D26' }}>{p.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function HostPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><HostGame /></Suspense>
}