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
  const [jeopardyState, setJeopardyState] = useState<any>(null)
  const [currentTileKey, setCurrentTileKey] = useState<string | null>(null)
  const [mlSelected, setMlSelected] = useState<string[]>([])

  useEffect(() => {
    if (gameType === 'word-scramble' && questions[current]) {
      setScrambledWord(scrambleWord(questions[current].word))
      setScrambleInput('')
    }
    if (gameType === 'missing-letter') {
      setMlSelected([])
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
    const gt = roomData.game_type || 'vocab-quiz'
    setGameType(gt)
    if (gt === 'jeopardy') {
      const state = roomData.question_order ? JSON.parse(roomData.question_order) : null
      setJeopardyState(state)
    } else {
      const qs = roomData.question_order ? JSON.parse(roomData.question_order) : []
      setQuestions(qs)
    }
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

  // Poll for question changes during non-jeopardy games
  useEffect(() => {
    if (phase !== 'playing' || !room || gameType === 'jeopardy') return
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
        setMlSelected([])
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [phase, room, current, gameType])

  // Jeopardy polling
  useEffect(() => {
    if (phase !== 'playing' || !room || gameType !== 'jeopardy') return
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
      const state = JSON.parse(data.question_order)
      setJeopardyState(state)
      const newKey = state.currentTile ? `${state.currentTile.cat}-${state.currentTile.row}` : null
      if (newKey !== currentTileKey) {
        setCurrentTileKey(newKey)
        setAnswered(false)
        setSelected(null)
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [phase, room, gameType, currentTileKey])

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

  async function buzzIn() {
    if (answered || !playerId || !room || !jeopardyState?.currentTile) return
    setAnswered(true)
    const tileIndex = jeopardyState.currentTile.cat * 5 + jeopardyState.currentTile.row
    await supabase.from('live_game_answers').insert([{
      room_code: room.code,
      player_id: playerId,
      question_index: tileIndex,
      answer: 'buzz',
      correct: false,
    }])
  }

  async function handleMLAnswer(option: string, q: any) {
    if (answered) return
    const newSelected = [...mlSelected, option]
    if (q.missingIndexes.length === 1) {
      setSelected(option)
      setAnswered(true)
      const correct = option === q.word[q.missingIndexes[0]]
      if (correct) setScore(s => s + 1)
      await supabase.from('live_game_answers').insert([{
        room_code: room.code, player_id: playerId,
        question_index: current, answer: option, correct,
      }])
    } else {
      setMlSelected(newSelected)
      if (newSelected.length === q.missingIndexes.length) {
        setAnswered(true)
        const answerStr = newSelected.join(',')
        const correctStr = q.missingIndexes.map((idx: number) => q.word[idx]).join(',')
        const correct = answerStr === correctStr
        if (correct) setScore(s => s + 1)
        await supabase.from('live_game_answers').insert([{
          room_code: room.code, player_id: playerId,
          question_index: current, answer: answerStr, correct,
        }])
      }
    }
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
          <p style={{ opacity: 0.8, fontSize: '18px', margin: '0 0 24px' }}>
            {gameType === 'jeopardy' ? `Final rank: #${myRank}` : `You scored ${score} points — rank #${myRank}`}
          </p>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            {leaderboard.map((p: any, i: number) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <span style={{ fontSize: '20px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span style={{ flex: 1, textAlign: 'left', fontWeight: p.id === playerId ? 'bold' : 'normal', color: p.id === playerId ? '#fbbf24' : 'white' }}>{p.nickname}</span>
                <span style={{ fontWeight: 'bold' }}>{gameType === 'jeopardy' ? (p.score || 0).toLocaleString() : p.score} pts</span>
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

  // PLAYING — JEOPARDY
  if (gameType === 'jeopardy') {
    const hasActiveTile = jeopardyState?.buzzPhase && jeopardyState?.currentTile
    const activeCat = hasActiveTile ? jeopardyState.currentTile.cat : null
    const activeRow = hasActiveTile ? jeopardyState.currentTile.row : null
    const activeQ = hasActiveTile ? jeopardyState.board[activeCat][activeRow] : null
    const isDaily = hasActiveTile && jeopardyState.dailyDouble === `${activeCat}-${activeRow}`
    const pts = activeQ ? (isDaily ? activeQ.points * 2 : activeQ.points) : 0

    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Hi {nickname}!</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>💰 {(score || 0).toLocaleString()}</span>
          </div>
          {!hasActiveTile ? (
            <div>
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎯</div>
              <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>Get Ready!</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>Waiting for teacher to pick a question...</p>
            </div>
          ) : answered ? (
            <div>
              <div style={{ fontSize: '72px', marginBottom: '16px' }}>🔔</div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px' }}>You buzzed in!</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>Waiting for the teacher...</p>
            </div>
          ) : (
            <div>
              {isDaily && (
                <div style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                  <p style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>⭐ DAILY DOUBLE — worth {pts} points!</p>
                </div>
              )}
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '0 0 10px' }}>For {pts} points...</p>
                <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0, lineHeight: '1.5' }}>{activeQ.question}</p>
              </div>
              <button onClick={buzzIn}
                style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#1a1a2e', border: 'none', borderRadius: '20px', padding: '32px', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 32px rgba(245,158,11,0.4)' }}>
                🔔 BUZZ IN!
              </button>
            </div>
          )}
        </div>
      </main>
    )
  }

  // PLAYING
  const q = questions[current]
  if (!q) return null

  // TRUE OR FALSE
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

  // WORD SCRAMBLE
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
              <button onClick={() => submitAnswer(scrambleInput)}
                style={{ width: '100%', background: '#7C3AED', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '18px', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>
                Submit ✓
              </button>
            </>
          )}
        </div>
      </main>
    )
  }

  // MISSING LETTER
  if (gameType === 'missing-letter') {
    const displayWord = q.word.split('').map((letter: string, i: number) => {
      if (q.missingIndexes.includes(i)) {
        const pos = q.missingIndexes.indexOf(i)
        return mlSelected[pos] || '_'
      }
      return letter
    })
    const isCorrect = q.missingIndexes.length === 1
      ? selected === q.word[q.missingIndexes[0]]
      : mlSelected.join(',') === q.missingIndexes.map((idx: number) => q.word[idx]).join(',')

    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', minHeight: '100vh', padding: '20px 16px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Word {current + 1}/10</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>⭐ {score}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 8px' }}>💡 {q.hint}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 20px' }}>
              {q.missingIndexes.length === 1 ? 'Find the missing letter' : `Find the ${q.missingIndexes.length} missing letters`}
              {q.missingIndexes.length > 1 && mlSelected.length > 0 && ` (${mlSelected.length}/${q.missingIndexes.length})`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {displayWord.map((letter: string, i: number) => {
                const isMissing = q.missingIndexes.includes(i)
                const pos = q.missingIndexes.indexOf(i)
                return (
                  <div key={i} style={{
                    width: '44px', height: '52px',
                    background: isMissing
                      ? (answered ? (isCorrect ? 'rgba(22,163,74,0.5)' : 'rgba(239,68,68,0.5)') : (mlSelected[pos] ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'))
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '24px', fontWeight: 'bold',
                    border: isMissing ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                  }}>
                    {letter === '_' ? '' : letter}
                  </div>
                )
              })}
            </div>
          </div>
          {answered ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '12px' }}>{isCorrect ? '✅' : '❌'}</div>
              <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
                {isCorrect ? 'Correct! 🎉' : 'Not quite!'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0 }}>
                The word is <strong style={{ color: 'white', letterSpacing: '4px' }}>{q.word}</strong>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '16px' }}>Waiting for next question...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {q.options.map((opt: string, i: number) => {
                const isSelected = mlSelected.includes(opt)
                return (
                  <button key={i} onClick={() => handleMLAnswer(opt, q)} disabled={isSelected}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.2)' : optionColors[i],
                      border: isSelected ? '2px solid white' : 'none',
                      borderRadius: '14px', padding: '24px 12px', cursor: isSelected ? 'default' : 'pointer',
                      color: 'white', fontWeight: 'bold', fontSize: '32px', opacity: isSelected ? 0.6 : 1,
                    }}>
                    {opt}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </main>
    )
  }

  // VOCAB QUIZ
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