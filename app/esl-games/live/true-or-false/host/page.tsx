'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../../../src/lib/supabase'
import { getQuestionsByDifficulty, shuffle, Difficulty } from '../questions'

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

function HostGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const difficulty = (searchParams.get('difficulty') || 'easy') as Difficulty
  const [questions] = useState(() => shuffle(getQuestionsByDifficulty(topic, difficulty)).slice(0, 10))
  const [roomCode] = useState(() => generateCode())
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
    window.location.href = '/esl-games/live/true-or-false'
  }

  useEffect(() => {
    const orderJson = JSON.stringify(questions)
    supabase.from('live_game_rooms').insert([{
      code: roomCode,
      game_type: 'true-or-false',
      topic,
      status: 'waiting',
      current_question: 0,
      question_order: orderJson,
    }]).then(({ error }: any) => {
      if (error) console.error('Room insert error:', error.message)
    })
  }, [])

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data }: any = await supabase.from('live_game_players').select('*').eq('room_code', roomCode)
      setPlayers(data || [])
    }
    fetchPlayers()
    const interval = setInterval(fetchPlayers, 2000)
    return () => clearInterval(interval)
  }, [roomCode])

  useEffect(() => {
    if (phase !== 'playing') return
    const fetchAnswers = async () => {
      const { data }: any = await supabase.from('live_game_answers').select('*').eq('room_code', roomCode).eq('question_index', current)
      setAnswers(data || [])
    }
    fetchAnswers()
    const interval = setInterval(fetchAnswers, 1500)
    return () => clearInterval(interval)
  }, [roomCode, current, phase])

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
    const correctAnswer = questions[current].answer.toString()
    const { data: roundAnswers }: any = await supabase.from('live_game_answers').select('*').eq('room_code', roomCode).eq('question_index', current)
    if (roundAnswers) {
      for (const ans of roundAnswers) {
        if (ans.answer === correctAnswer) {
          const player = players.find((p: any) => p.id === ans.player_id)
          await supabase.from('live_game_players').update({ score: (player?.score || 0) + 1 }).eq('id', ans.player_id)
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
  const trueCount = answers.filter(a => a.answer === 'true').length
  const falseCount = answers.filter(a => a.answer === 'false').length

  if (phase === 'lobby') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link href="/esl-games/live/true-or-false" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>True or False Lobby</h1>
            <p style={{ color: '#666', fontSize: '15px', margin: '0 0 32px' }}>Share this code with your students</p>
            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Room Code</p>
              <div style={{ color: 'white', fontSize: '72px', fontWeight: 'bold', letterSpacing: '12px', lineHeight: 1 }}>{roomCode}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '16px 0 0' }}>
                Students go to <strong style={{ color: 'white' }}>jobsinthailand.net/play</strong>
              </p>
            </div>
            <div style={{ background: '#ecfeff', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>👥 Players joined: {players.length}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: '#0891b2', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>{topic}</span>
                  <span style={{ background: difficulty === 'easy' ? '#16a34a' : difficulty === 'medium' ? '#f59e0b' : '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                    {difficulty === 'easy' ? '🟢 Easy' : difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                  </span>
                </div>
              </div>
              {players.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Waiting for players to join...</p>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {players.map((p: any) => (
                    <span key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '5px 14px', fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{p.nickname}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={startGame} disabled={players.length === 0}
              style={{ background: players.length > 0 ? '#16a34a' : '#cbd5e1', color: 'white', padding: '14px 48px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: players.length > 0 ? 'pointer' : 'default', width: '100%' }}>
              {players.length === 0 ? 'Waiting for players...' : `Start Game with ${players.length} player${players.length > 1 ? 's' : ''} →`}
            </button>
            <button onClick={clearRoom} style={{ background: 'transparent', color: '#888', padding: '10px', border: 'none', fontSize: '14px', cursor: 'pointer', marginTop: '8px', width: '100%' }}>
              ✕ Cancel and start fresh
            </button>
          </div>
        </div>
      </main>
    )
  }

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
            <button onClick={clearRoom} style={{ background: '#0891b2', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>🔄 New Game</button>
            <Link href="/esl-games/live" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Back to Games</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '20px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Room: {roomCode}</span>
            <span style={{ background: '#ecfeff', color: '#0891b2', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>{topic}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>👥 {players.length}</span>
            <span style={{ background: '#fff3ed', color: '#E85D26', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>Q{current + 1}/{questions.length}</span>
            <button onClick={clearRoom} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>✕ End</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#888', fontSize: '14px' }}>Question {current + 1} of {questions.length}</span>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: timerColor }}>{timeLeft}s</span>
            </div>
            <div style={{ background: '#f0f0f0', borderRadius: '6px', height: '6px', marginBottom: '20px' }}>
              <div style={{ background: timerColor, height: '6px', borderRadius: '6px', width: `${(timeLeft / 15) * 100}%`, transition: 'width 1s linear' }} />
            </div>

            <div style={{ background: '#f8faff', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0, lineHeight: '1.5' }}>{q.statement}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: revealed ? (q.answer ? '#dcfce7' : '#f8f9fa') : '#f0fdf4', border: `2px solid ${revealed && q.answer ? '#16a34a' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>✅</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: revealed && q.answer ? '#16a34a' : '#1a1a2e' }}>TRUE</div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{trueCount} answered</div>
              </div>
              <div style={{ background: revealed ? (!q.answer ? '#fee2e2' : '#f8f9fa') : '#fef2f2', border: `2px solid ${revealed && !q.answer ? '#ef4444' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>❌</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: revealed && !q.answer ? '#ef4444' : '#1a1a2e' }}>FALSE</div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{falseCount} answered</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {!revealed && (
                <button onClick={handleReveal} style={{ background: '#0891b2', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
                  💡 Reveal Answer ({answers.length}/{players.length} answered)
                </button>
              )}
              {revealed && (
                <button onClick={nextQuestion} style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
                  {current + 1 >= questions.length ? '🏆 Final Scores' : 'Next Question →'}
                </button>
              )}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', textAlign: 'center' }}>🏆 Leaderboard</h3>
            {sorted.length === 0 ? (
              <p style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>No scores yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sorted.map((p: any, i: number) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: i === 0 ? '#fffbeb' : '#f8f9fa', borderRadius: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}</span>
                    <span style={{ flex: 1, fontWeight: '600', fontSize: '14px', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nickname}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#0891b2' }}>{p.score}</span>
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