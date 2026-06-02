'use client'
import { use } from 'react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../../src/lib/supabase'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

function normalizeQuestions(raw: any[], gameType: string) {
  return raw.map(q => {
    if (gameType === 'word_hunter') {
    const distractors = [q.distractor1, q.distractor2, q.distractor3].filter(Boolean)
    const allOptions = shuffleArray([q.correct_word, ...distractors])
    return { questionText: q.definition, imageUrl: undefined, options: allOptions, correctIndex: allOptions.indexOf(q.correct_word) }
  }
  if (gameType === 'vocab_blast') {
      const distractors = [q.distractor1, q.distractor2, q.distractor3].filter(Boolean)
      const allOptions = shuffleArray([q.definition, ...distractors])
      return { questionText: q.word, options: allOptions, correctIndex: allOptions.indexOf(q.definition) }
    }
    if (gameType === 'quiz_master' || gameType === 'picture_quiz') {
      const opts = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean)
      const correctOpt = opts[['a','b','c','d'].indexOf(q.correct)]
      const shuffled = shuffleArray(opts)
      return { questionText: q.question, imageUrl: q.image_url || undefined, options: shuffled, correctIndex: shuffled.indexOf(correctOpt) }
    }
    if (gameType === 'true_or_false') return { questionText: q.statement, options: ['True', 'False'], correctIndex: q.correct === 'true' ? 0 : 1 }
    return { questionText: '', options: [], correctIndex: 0 }
  })
}

export default function JoinPage({ params }: { params: any }) {
  const { slug, gameId } = use(params) as { slug: string; gameId: string }

  const [phase, setPhase] = useState<'enter_code' | 'enter_name' | 'waiting' | 'playing' | 'answered' | 'revealed' | 'finished'>('enter_code')
  const [roomCode, setRoomCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [codeError, setCodeError] = useState('')
  const [nameError, setNameError] = useState('')
  const [joining, setJoining] = useState(false)
  const [room, setRoom] = useState<any>(null)
  const [game, setGame] = useState<any>(null)
  const [player, setPlayer] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [allPlayers, setAllPlayers] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(20)
  const timerRef = useRef<any>(null)

  // Subscribe to room changes
  useEffect(() => {
    if (!room) return
    const sub = supabase.channel(`room-status-${room.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'custom_game_rooms', filter: `id=eq.${room.id}` },
        ({ new: updated }) => {
          setRoom(updated)
          if (updated.status === 'playing') {
            const qi = updated.current_question || 0
            setQuestionIndex(qi); setSelected(null); setPhase('playing')
            setTimeLeft(game?.timer_seconds || 20)
          }
          if (updated.status === 'revealed') setPhase('revealed')
          if (updated.status === 'finished') setPhase('finished')
        }
      ).subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [room, game])

  // Subscribe to all players for waiting room and leaderboard
  useEffect(() => {
    if (!room) return
    const sub = supabase.channel(`room-all-players-${room.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_game_players', filter: `room_id=eq.${room.id}` },
        () => { supabase.from('custom_game_players').select('*').eq('room_id', room.id).then(({ data }) => setAllPlayers(data || [])) }
      ).subscribe()
    supabase.from('custom_game_players').select('*').eq('room_id', room.id).then(({ data }) => setAllPlayers(data || []))
    return () => { supabase.removeChannel(sub) }
  }, [room])

  // Timer countdown during playing
  useEffect(() => {
    if (phase !== 'playing') { clearInterval(timerRef.current); return }
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current); return 0 } return prev - 1 })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, questionIndex])

  const findRoom = async () => {
    const trimmed = roomCode.trim().toUpperCase()
    if (!trimmed || trimmed.length !== 4) { setCodeError('Please enter the 4-letter room code.'); return }
    setJoining(true); setCodeError('')
    const { data: r } = await supabase.from('custom_game_rooms').select('*').eq('room_code', trimmed).eq('game_id', gameId).single()
    if (!r) { setCodeError('Room not found. Check the code and try again.'); setJoining(false); return }
    if (r.status === 'finished') { setCodeError('This game has already finished.'); setJoining(false); return }
    const { data: g } = await supabase.from('custom_games').select('*').eq('id', gameId).single()
    if (!g) { setCodeError('Game not found.'); setJoining(false); return }
    setRoom(r); setGame(g)
    const normalized = normalizeQuestions(Array.isArray(g.questions) ? g.questions : [], g.game_type)
    setQuestions(normalized)
    setTimeLeft(g.timer_seconds || 20)
    setJoining(false); setPhase('enter_name')
  }

  const joinGame = async () => {
    if (!nickname.trim()) { setNameError('Please enter your name.'); return }
    if (nickname.trim().length > 20) { setNameError('Name must be 20 characters or less.'); return }
    setJoining(true); setNameError('')
    // Check nickname not already taken
    const { data: existing } = await supabase.from('custom_game_players').select('id').eq('room_id', room.id).eq('nickname', nickname.trim()).single()
    if (existing) { setNameError('This name is already taken. Please choose another.'); setJoining(false); return }
    const { data: newPlayer } = await supabase.from('custom_game_players').insert([{ room_id: room.id, nickname: nickname.trim(), score: 0, answers: [] }]).select().single()
    setPlayer(newPlayer); setJoining(false); setPhase('waiting')
  }

  const handleAnswer = async (optIndex: number) => {
    if (selected !== null || !player || !questions[questionIndex]) return
    setSelected(optIndex)
    const q = questions[questionIndex]
    const correct = optIndex === q.correctIndex
    const newScore = score + (correct ? 1 : 0)
    if (correct) setScore(newScore)

    const existingAnswers = Array.isArray(player.answers) ? player.answers : []
    const updatedAnswers = [...existingAnswers, { question_index: questionIndex, answer_index: optIndex, correct, time_ms: (game.timer_seconds - timeLeft) * 1000 }]

    await supabase.from('custom_game_players').update({ answers: updatedAnswers, score: newScore }).eq('id', player.id)
    setPlayer((prev: any) => ({ ...prev, answers: updatedAnswers, score: newScore }))
    setPhase('answered')
  }

  const optionColors = ['#7C3AED', '#E85D26', '#0891b2', '#16a34a']
  const optionLetters = ['A', 'B', 'C', 'D']
  const q = questions[questionIndex]
  const timerPct = game ? (timeLeft / game.timer_seconds) * 100 : 100
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'
  const sortedPlayers = [...allPlayers].sort((a, b) => (b.score || 0) - (a.score || 0))
  const myRank = sortedPlayers.findIndex(p => p.id === player?.id) + 1

  // ── ENTER CODE ─────────────────────────────────────────────
  if (phase === 'enter_code') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📱</div>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>Join the Game!</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Enter the 4-letter code from your teacher&apos;s screen</p>
        <input value={roomCode} onChange={e => { setRoomCode(e.target.value.toUpperCase()); setCodeError('') }}
          onKeyDown={e => e.key === 'Enter' && findRoom()}
          placeholder="e.g. LION" maxLength={4}
          style={{ width: '100%', padding: '18px', borderRadius: '12px', border: `2px solid ${codeError ? '#ef4444' : '#e5e7eb'}`, fontSize: '32px', fontFamily: 'monospace', fontWeight: '900', outline: 'none', boxSizing: 'border-box', letterSpacing: '6px', textAlign: 'center', color: '#1a1a2e', marginBottom: '8px' }} />
        {codeError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>{codeError}</p>}
        <button onClick={findRoom} disabled={joining || roomCode.length !== 4}
          style={{ width: '100%', background: joining || roomCode.length !== 4 ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: joining || roomCode.length !== 4 ? '#9ca3af' : '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '18px', cursor: joining || roomCode.length !== 4 ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
          {joining ? 'Checking...' : 'Join →'}
        </button>
      </div>
    </main>
  )

  // ── ENTER NAME ─────────────────────────────────────────────
  if (phase === 'enter_name') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', textAlign: 'center' }}>
        <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '12px', padding: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <div><div style={{ fontWeight: '800', color: '#14532d', fontSize: '14px' }}>Room found!</div><div style={{ color: '#15803d', fontSize: '12px' }}>{game?.title}</div></div>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>What&apos;s your name?</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>This is how you&apos;ll appear on the leaderboard</p>
        <input value={nickname} onChange={e => { setNickname(e.target.value); setNameError('') }}
          onKeyDown={e => e.key === 'Enter' && joinGame()}
          placeholder="e.g. Tom, Sara, Student 5" maxLength={20}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${nameError ? '#ef4444' : '#e5e7eb'}`, fontSize: '18px', fontWeight: '700', outline: 'none', boxSizing: 'border-box', textAlign: 'center', marginBottom: '8px' }} />
        {nameError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>{nameError}</p>}
        <button onClick={joinGame} disabled={joining || !nickname.trim()}
          style={{ width: '100%', background: joining || !nickname.trim() ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: joining || !nickname.trim() ? '#9ca3af' : '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '18px', cursor: joining || !nickname.trim() ? 'not-allowed' : 'pointer' }}>
          {joining ? 'Joining...' : 'Join Game 🎮'}
        </button>
      </div>
    </main>
  )

  // ── WAITING ─────────────────────────────────────────────────
  if (phase === 'waiting') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'spin 3s linear infinite', display: 'inline-block' }}>🎮</div>
        <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '900', marginBottom: '8px' }}>You&apos;re in, {nickname}!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '24px' }}>Waiting for the teacher to start the game...</p>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px 24px', display: 'inline-block' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>Players in room</div>
          <div style={{ color: 'white', fontSize: '32px', fontWeight: '900' }}>{allPlayers.length}</div>
        </div>
      </div>
    </main>
  )

  // ── FINISHED ─────────────────────────────────────────────────
  if (phase === 'finished') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>{myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🎉'}</div>
        <h2 style={{ color: 'white', fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>Game Over!</h2>
        <div style={{ color: '#fbbf24', fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>
          You ranked #{myRank} of {allPlayers.length}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px' }}>Score: {score} / {questions.length}</div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '800', marginBottom: '14px' }}>🏅 Final Leaderboard</h3>
          {sortedPlayers.slice(0, 10).map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: p.id === player?.id ? 'rgba(245,158,11,0.2)' : 'transparent', marginBottom: '4px', border: p.id === player?.id ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent' }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', width: '24px' }}>{i + 1}.</div>
              <div style={{ color: p.id === player?.id ? '#fbbf24' : 'white', fontWeight: p.id === player?.id ? '800' : '600', flex: 1, textAlign: 'left' }}>{p.nickname} {p.id === player?.id ? '(you)' : ''}</div>
              <div style={{ color: p.id === player?.id ? '#fbbf24' : 'rgba(255,255,255,0.8)', fontWeight: '800' }}>{p.score || 0}</div>
            </div>
          ))}
        </div>
        <Link href={`/arcade/${slug}`} style={{ display: 'block', background: '#f59e0b', color: '#1a1a2e', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px' }}>← Back to Arcade</Link>
      </div>
    </main>
  )

  // ── PLAYING ─────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
      <style>{`@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}`}</style>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '14px' }}>
          {nickname}
        </div>
        <div style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '14px' }}>
          ⭐ {score}
        </div>
      </div>

      {/* Timer */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '56px', fontWeight: '900', color: timerColor, lineHeight: 1 }}>{timeLeft}</div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginTop: '6px', overflow: 'hidden' }}>
          <div style={{ height: '8px', borderRadius: '8px', background: timerColor, width: `${timerPct}%`, transition: 'width 1s linear' }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '16px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.1)' }}>
        {q?.imageUrl && <img src={q.imageUrl} alt="" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '10px', marginBottom: '12px' }} />}
        <div style={{ color: 'white', fontSize: '22px', fontWeight: '800', lineHeight: 1.3 }}>{q?.questionText}</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '8px' }}>Q{questionIndex + 1} of {questions.length}</div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {q?.options?.map((opt: string, i: number) => {
          const isSelected = selected === i
          const isCorrect = i === q.correctIndex
          const isRevealed = phase === 'revealed' || phase === 'answered'
          let bg = optionColors[i] + '33'
          let border = optionColors[i]
          let textColor = 'white'
          if (isRevealed) {
            if (isCorrect) { bg = 'rgba(34,197,94,0.3)'; border = '#22c55e'; textColor = '#86efac' }
            else if (isSelected) { bg = 'rgba(239,68,68,0.3)'; border = '#ef4444'; textColor = '#fca5a5' }
            else { bg = 'rgba(255,255,255,0.04)'; border = 'rgba(255,255,255,0.1)'; textColor = 'rgba(255,255,255,0.3)' }
          } else if (isSelected) { bg = optionColors[i] + '55'; }
          return (
            <button key={i} onClick={() => handleAnswer(i)}
              disabled={selected !== null || phase === 'answered'}
              style={{ background: bg, border: `3px solid ${border}`, borderRadius: '14px', padding: '18px 20px', color: textColor, fontWeight: '800', fontSize: '18px', cursor: selected !== null ? 'default' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s', animation: !isRevealed && !selected ? 'none' : undefined }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: isRevealed ? (isCorrect ? '#22c55e' : isSelected ? '#ef4444' : 'rgba(255,255,255,0.1)') : optionColors[i], color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>
                {isRevealed && isCorrect ? '✓' : isRevealed && isSelected && !isCorrect ? '✗' : optionLetters[i]}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {/* Waiting for reveal */}
      {phase === 'answered' && (
        <div style={{ marginTop: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
          {selected === q?.correctIndex ? '✅ Correct! Waiting for next question...' : '❌ Wrong. Waiting for next question...'}
        </div>
      )}
    </main>
  )
}
