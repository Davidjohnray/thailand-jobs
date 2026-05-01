'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../../../src/lib/supabase'
import { categoryBank, checkAnswer } from '../questions'

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

function HostGame() {
  const searchParams = useSearchParams()
  const categoryName = searchParams.get('category') || categoryBank[0].category
  const categoryData = categoryBank.find(c => c.category === categoryName) || categoryBank[0]

  const [roomCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const existing = sessionStorage.getItem('categoryRaceRoomCode')
      if (existing) return existing
      const newCode = generateCode()
      sessionStorage.setItem('categoryRaceRoomCode', newCode)
      return newCode
    }
    return generateCode()
  })

  const [phase, setPhase] = useState<'lobby' | 'playing' | 'finished'>('lobby')
  const [players, setPlayers] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(categoryData.timeLimit)
  const [running, setRunning] = useState(false)
  const [answers, setAnswers] = useState<any[]>([])

  async function clearRoom() {
    await supabase.from('live_game_answers').delete().eq('room_code', roomCode)
    await supabase.from('live_game_players').delete().eq('room_code', roomCode)
    await supabase.from('live_game_rooms').delete().eq('code', roomCode)
    sessionStorage.removeItem('categoryRaceRoomCode')
    window.location.reload()
  }

  useEffect(() => {
    supabase.from('live_game_rooms').insert([{
      code: roomCode,
      game_type: 'category-race',
      topic: categoryName,
      status: 'waiting',
      current_question: 0,
      question_order: JSON.stringify([{ category: categoryName, answers: categoryData.answers }]),
    }]).then(({ error }: any) => {
      if (error && error.code !== '23505') console.error('Room insert error:', error.message)
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
      const { data }: any = await supabase.from('live_game_answers').select('*').eq('room_code', roomCode)
      setAnswers(data || [])
    }
    fetchAnswers()
    const interval = setInterval(fetchAnswers, 1000)
    return () => clearInterval(interval)
  }, [roomCode, phase])

  useEffect(() => {
    if (!running) return
    if (timeLeft === 0) { setRunning(false); endGame(); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running])

  async function startGame() {
    await supabase.from('live_game_rooms').update({ status: 'playing' }).eq('code', roomCode)
    setPhase('playing')
    setRunning(true)
  }

  async function endGame() {
    setRunning(false)
    const { data: allAnswers }: any = await supabase.from('live_game_answers').select('*').eq('room_code', roomCode)
    if (allAnswers) {
      for (const player of players) {
        const correctCount = allAnswers.filter((a: any) => a.player_id === player.id && a.answer === 'correct').length
        await supabase.from('live_game_players').update({ score: correctCount }).eq('id', player.id)
      }
      const { data }: any = await supabase.from('live_game_players').select('*').eq('room_code', roomCode)
      setPlayers(data || [])
    }
    await supabase.from('live_game_rooms').update({ status: 'finished' }).eq('code', roomCode)
    setPhase('finished')
  }

  const timerColor = timeLeft > 15 ? '#16a34a' : timeLeft > 8 ? '#f59e0b' : '#ef4444'
  const sorted = [...players].sort((a: any, b: any) => b.score - a.score)

  const correctByPlayer: Record<string, number> = {}
  answers.forEach((a: any) => {
    if (a.answer === 'correct') {
      correctByPlayer[a.player_id] = (correctByPlayer[a.player_id] || 0) + 1
    }
  })

  if (phase === 'lobby') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link href="/esl-games/live/category-race" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎭</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Game Lobby</h1>
            <div style={{ background: '#f0fdf4', color: '#065f46', padding: '8px 20px', borderRadius: '20px', fontSize: '15px', fontWeight: 'bold', display: 'inline-block', marginBottom: '24px' }}>
              {categoryName}
            </div>
            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Room Code</p>
              <div style={{ color: 'white', fontSize: '72px', fontWeight: 'bold', letterSpacing: '12px', lineHeight: 1 }}>{roomCode}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '16px 0 0' }}>
                Students go to <strong style={{ color: 'white' }}>jobsinthailand.net/play</strong>
              </p>
            </div>
            <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
              <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', marginBottom: '8px' }}>👥 Players joined: {players.length}</div>
              {players.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Waiting for players...</p>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {players.map((p: any) => (
                    <span key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '5px 14px', fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{p.nickname}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={startGame} disabled={players.length === 0}
              style={{ background: players.length > 0 ? '#065f46' : '#cbd5e1', color: 'white', padding: '14px 48px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: players.length > 0 ? 'pointer' : 'default', width: '100%' }}>
              {players.length === 0 ? 'Waiting for players...' : `Start Race with ${players.length} player${players.length > 1 ? 's' : ''} →`}
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
          <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: '0 0 8px' }}>Time's Up!</h1>
          <p style={{ color: '#ccc', marginBottom: '32px' }}>{categoryName}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {sorted.map((p: any, i: number) => (
              <div key={p.id} style={{ background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '28px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '18px', flex: 1, textAlign: 'left' }}>{p.nickname}</span>
                <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '22px' }}>{p.score} answers</span>
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

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '20px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Room: {roomCode}</span>
            <span style={{ background: '#f0fdf4', color: '#065f46', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>🎭 {categoryName}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>👥 {players.length} players</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: timerColor }}>{timeLeft}s</span>
            <button onClick={() => { setRunning(false); endGame() }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              ⏹ End
            </button>
          </div>
        </div>

        <div style={{ background: '#f0f0f0', borderRadius: '6px', height: '8px', marginBottom: '20px' }}>
          <div style={{ background: timerColor, height: '8px', borderRadius: '6px', width: `${(timeLeft / categoryData.timeLimit) * 100}%`, transition: 'width 1s linear' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>Name as many as you can...</div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#065f46', margin: '0 0 24px', lineHeight: '1.3' }}>{categoryName}</h2>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '18px' }}>
                {answers.filter((a: any) => a.answer === 'correct').length} correct answers submitted
              </div>
              <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Students are typing answers on their phones!</div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', textAlign: 'center' }}>🏆 Live Scores</h3>
            {players.length === 0 ? (
              <p style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>No players yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...players].sort((a: any, b: any) => (correctByPlayer[b.id] || 0) - (correctByPlayer[a.id] || 0)).map((p: any, i: number) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: i === 0 ? '#fffbeb' : '#f8f9fa', borderRadius: '10px', border: i === 0 ? '1px solid #fde68a' : '1px solid transparent' }}>
                    <span style={{ fontSize: '18px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}</span>
                    <span style={{ flex: 1, fontWeight: '600', fontSize: '14px', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nickname}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#065f46' }}>{correctByPlayer[p.id] || 0}</span>
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