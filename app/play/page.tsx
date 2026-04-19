'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '../../src/lib/supabase'

const optionColors = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a']
const optionLabels = ['A', 'B', 'C', 'D']

function scrambleWord(word: string): string {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  const result = arr.join('')
  return result === word ? scrambleWord(word) : result
}

function PlayPage() {
  const [phase, setPhase] = useState<'join' | 'lobby' | 'playing' | 'finished'>('join')
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [room, setRoom] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [gameType, setGameType] = useState('vocab-quiz')
  const [scrambleInput, setScrambleInput] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')

  useEffect(() => {
    if (gameType === 'word-scramble' && questions[current]) {
      setScrambledWord(scrambleWord(questions[current].word))
      setScrambleInput('')
    }
  }, [current, gameType, questions])

  async function joinRoom() {
    setError('')
    if (!code.trim() || !nickname.trim()) { setError('Please enter your name and the room code'); return }
    const { data: roomData }: any = await supabase
      .from('live_game_rooms')
      .select('*')
      .eq('code', code.trim())
      .single()
    if (!roomData) { setError('Room not found — check the code and try again'); return }
    if (roomData.status === 'finished') { setError('This game has already finished'); return }
    const { data: player }: any = await supabase
      .from('live_game_players')
      .insert([{ room_code: code.trim(), nickname: nickname.trim(), score: 0 }])
      .select()
      .single()
    if (!player) { setError('Could not join — please try again'); return }
    setPlayerId(player.id)
    setRoom(roomData)
    const qs = roomData.question_order ? JSON.parse(roomData.question_order) : []
    setQuestions(qs)
    setGameType(roomData.game_type || 'vocab-quiz')
    setPhase('lobby')
  }

  // Poll for game to start
  useEffect(() => {
    if (phase !== 'lobby' || !room) return
    const interval = setInterval(async () => {
      const { data }: any = await supabase
        .from('live_game_rooms')
        .select('*')
        .eq('code', room.code)
        .single()
      if (data?.status === 'playing') {
        setCurrent(data.current_question)
        setPhase('playing')
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [phase, room])

  // Poll for question changes during game
  useEffect(() => {
    if (phase !== 'playing' || !room) return
    const interval = setInterval(async () => {
      const { data }: any = await supabase
        .from('live_game_rooms')
        .select('*')
        .eq('code', room.code)
        .single()
      if (!data) return
      if (data.status === 'finished') {
        const { data: lb }: any = await supabase
          .from('live_game_players')
          .select('*')
          .eq('room_code', room.code)
          .order('score', { ascending: false })
        setLeaderboard(lb || [])
        setPhase('finished')
        return
      }
      if (data.current_question !== current) {
        setCurrent(data.current_question)
        setSelected(null)
        setAnswered(false)
        setScrambleInput('')
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [phase, room, current])

  async function submitAnswer(answer: string) {
    if (answered || !playerId || !room) return
    setSelected(answer)
    setAnswered(true)
    let correct = false
    if (gameType === 'word-scramble') {
      correct = answer.toUpperCase() === questions[current]?.word?.toUpperCase()
    } else if (gameType === 'true-or-false') {
      correct = answer === questions[current]?.answer?.toString()
    } else {
      correct = answer === questions[current]?.answer
    }
    if (correct) setScore(s => s + 1)
    await supabase.from('live_game_answers').insert([{
      room_code: room.code,
      player_id: playerId,
      question_index: current,
      answer,
      correct,
    }])
  }

  // JOIN SCREEN
  if (phase === 'join') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎮</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Join the Game</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 28px' }}>Enter your name and the room code from your teacher</p>
          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && joinRoom()}
            placeholder="Your name"
            maxLength={20}
            style={{ width: '100%', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'sans-serif' }}
          />
          <input
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onKeyDown={e => e.key === 'Enter' && joinRoom()}
            placeholder="4-digit room code"
            maxLength={4}
            style={{ width: '100%', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '8px', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'sans-serif' }}
          />
          <button
            onClick={joinRoom}
            disabled={code.length !== 4 || !nickname.trim()}
            style={{ width: '100%', background: code.length === 4 && nickname.trim() ? '#1a1a2e' : '#cbd5e1', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '17px', fontWeight: 'bold', cursor: code.length === 4 && nickname.trim() ? 'pointer' : 'default' }}>
            Join Game →
          </button>
        </div>
      </main>
    )
  }

  // LOBBY
  if (phase === 'lobby') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>⏳</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 12px' }}>You're in!</h2>
          <p style={{ opacity: 0.8, fontSize: '18px', margin: '0 0 8px' }}>Hi {nickname}! 👋</p>
          <p style={{ opacity: 0.6, fontSize: '16px' }}>Waiting for the teacher to start the game...</p>
          <div style={{ marginTop: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 24px', display: 'inline-block' }}>
            <span style={{ opacity: 0.7, fontSize: '14px' }}>Room </span>
            <span style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '4px' }}>{room?.code}</span>
          </div>
        </div>
      </main>
    )
  }

  // FINISHED
  if (phase === 'finished') {
    const myRank = leaderboard.findIndex((p: any) => p.id === playerId) + 1
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', color: 'white', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>{myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🎉'}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>{myRank === 1 ? 'You Won!' : 'Game Over!'}</h2>
          <p style={{ opacity: 0.8, fontSize: '18px', margin: '0 0 24px' }}>You scored {score} points — rank #{myRank}</p>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            {leaderboard.map((p: any, i: number) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <span style={{ fontSize: '20px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span style={{ flex: 1, textAlign: 'left', fontWeight: p.id === playerId ? 'bold' : 'normal', color: p.id === playerId ? '#fbbf24' : 'white' }}>{p.nickname}</span>
                <span style={{ fontWeight: 'bold' }}>{p.score} pts</span>
              </div>
            ))}
          </div>
          <button onClick={() => window.location.href = '/play'} style={{ background: '#E85D26', color: 'white', padding: '12px 32px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            Play Again
          </button>
        </div>
      </main>
    )
  }

  // PLAYING
  const q = questions[current]
  if (!q) return null

  // True or False playing screen
  if (gameType === 'true-or-false') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #0c4a6e, #0891b2)', minHeight: '100vh', padding: '20px 16px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Q{current + 1}/10</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>⭐ {score}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0, lineHeight: '1.5' }}>{q.statement}</p>
          </div>
          {answered ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '12px' }}>{selected === q.answer?.toString() ? '✅' : '❌'}</div>
              <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
                {selected === q.answer?.toString() ? 'Correct! 🎉' : 'Not quite!'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0 }}>
                The answer is <strong style={{ color: 'white' }}>{q.answer ? 'TRUE ✅' : 'FALSE ❌'}</strong>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '16px' }}>Waiting for next question...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => submitAnswer('true')}
                style={{ background: '#16a34a', border: 'none', borderRadius: '16px', padding: '28px 12px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '40px' }}>✅</span>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>TRUE</span>
              </button>
              <button onClick={() => submitAnswer('false')}
                style={{ background: '#ef4444', border: 'none', borderRadius: '16px', padding: '28px 12px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '40px' }}>❌</span>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>FALSE</span>
              </button>
            </div>
          )}
        </div>
      </main>
    )
  }

  // Word Scramble playing screen
  if (gameType === 'word-scramble') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #4c1d95, #7C3AED)', minHeight: '100vh', padding: '20px 16px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Word {current + 1}/10</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>⭐ {score}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 16px' }}>Unscramble this word:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {scrambledWord.split('').map((letter: string, i: number) => (
                <div key={i} style={{ width: '44px', height: '52px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  {letter}
                </div>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>💡 {q.hint}</p>
          </div>
          {answered ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '12px' }}>{selected?.toUpperCase() === q.word?.toUpperCase() ? '✅' : '❌'}</div>
              <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
                {selected?.toUpperCase() === q.word?.toUpperCase() ? 'Correct! 🎉' : 'Not quite!'}
              </p>
              {selected?.toUpperCase() !== q.word?.toUpperCase() && (
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0 }}>
                  Answer: <strong style={{ color: 'white', letterSpacing: '3px' }}>{q.word}</strong>
                </p>
              )}
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '16px' }}>Waiting for next word...</p>
            </div>
          ) : (
            <>
              <input
                value={scrambleInput}
                onChange={e => setScrambleInput(e.target.value.toUpperCase())}
                onKeyDown={e => { if (e.key === 'Enter') submitAnswer(scrambleInput) }}
                placeholder="Type your answer..."
                autoFocus
                style={{ width: '100%', border: 'none', borderRadius: '12px', padding: '14px 16px', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'sans-serif', textTransform: 'uppercase' as const, marginBottom: '12px' }}
              />
              <button
                onClick={() => submitAnswer(scrambleInput)}
                style={{ width: '100%', background: '#7C3AED', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '18px', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>
                Submit ✓
              </button>
            </>
          )}
        </div>
      </main>
    )
  }

  // Vocab Quiz playing screen
  return (
    <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Q{current + 1}/10</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>⭐ {score}</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0, lineHeight: '1.4' }}>{q.q}</p>
        </div>
        {answered ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>{selected === q.answer ? '✅' : '❌'}</div>
            <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
              {selected === q.answer ? 'Correct! 🎉' : 'Not quite!'}
            </p>
            {selected !== q.answer && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0 }}>
                Answer: <strong style={{ color: 'white' }}>{q.answer}</strong>
              </p>
            )}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '16px' }}>Waiting for next question...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {q.options.map((opt: string, i: number) => (
              <button key={i} onClick={() => submitAnswer(opt)}
                style={{ background: optionColors[i], border: 'none', borderRadius: '14px', padding: '20px 12px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '8px', padding: '4px 10px', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{optionLabels[i]}</span>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{opt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function PlayPageWrapper() {
  return <Suspense fallback={<div style={{ background: '#1a1a2e', minHeight: '100vh' }} />}><PlayPage /></Suspense>
}