'use client'
import { use } from 'react'
import { useState, useEffect, useCallback } from 'react'
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

function genRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function HostPage({ params }: { params: any }) {
  const { slug, gameId } = use(params) as { slug: string; gameId: string }

  // PIN gate
  const [pinAuthed, setPinAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [checkingPin, setCheckingPin] = useState(false)

  const checkPin = async () => {
    const trimmed = pin.trim().toUpperCase()
    if (!trimmed) { setPinError('Please enter your activation code.'); return }
    setCheckingPin(true); setPinError('')
    const { data } = await supabase
      .from('teacher_activation_codes')
      .select('used_by_email')
      .eq('code', trimmed)
      .eq('active', true)
      .eq('used', true)
      .single()
    if (!data) { setPinError('Code not recognised. Only the teacher can host a game.'); setCheckingPin(false); return }
    // Verify this code belongs to this arcade slug
    const { data: profile } = await supabase
      .from('teacher_profiles')
      .select('arcade_slug')
      .eq('user_email', data.used_by_email)
      .single()
    if (!profile || profile.arcade_slug !== slug) { setPinError('This code is not for this arcade.'); setCheckingPin(false); return }
    setPinAuthed(true); setCheckingPin(false)
  }

  const [game, setGame] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [room, setRoom] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [phase, setPhase] = useState<'lobby' | 'playing' | 'revealed' | 'finished'>('lobby')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [timerActive, setTimerActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [answerCounts, setAnswerCounts] = useState<number[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: g } = await supabase.from('custom_games').select('*').eq('id', gameId).single()
      if (!g) { setLoading(false); return }
      setGame(g)
      const normalized = normalizeQuestions(Array.isArray(g.questions) ? g.questions : [], g.game_type)
      setQuestions(normalized)
      setTimeLeft(g.timer_seconds || 20)

      // Create room
      const code = genRoomCode()
      const { data: newRoom } = await supabase.from('custom_game_rooms').insert([{
        game_id: gameId, room_code: code, teacher_email: '', status: 'waiting', current_question: 0,
      }]).select().single()
      setRoom(newRoom)
      setLoading(false)
    }
    load()
  }, [gameId])

  // Subscribe to players joining
  useEffect(() => {
    if (!room) return
    const sub = supabase.channel(`room-players-${room.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_game_players', filter: `room_id=eq.${room.id}` },
        () => { supabase.from('custom_game_players').select('*').eq('room_id', room.id).then(({ data }) => setPlayers(data || [])) }
      ).subscribe()
    supabase.from('custom_game_players').select('*').eq('room_id', room.id).then(({ data }) => setPlayers(data || []))
    return () => { supabase.removeChannel(sub) }
  }, [room])

  // Update answer counts when players update
  useEffect(() => {
    if (!questions[questionIndex]) return
    const counts = new Array(questions[questionIndex].options.length).fill(0)
    players.forEach(p => {
      const answers = Array.isArray(p.answers) ? p.answers : []
      const ans = answers.find((a: any) => a.question_index === questionIndex)
      if (ans && ans.answer_index >= 0 && ans.answer_index < counts.length) counts[ans.answer_index]++
    })
    setAnswerCounts(counts)
  }, [players, questionIndex, questions])

  const handleTimeout = useCallback(async () => {
    setTimerActive(false)
    setPhase('revealed')
    if (room) await supabase.from('custom_game_rooms').update({ status: 'revealed' }).eq('id', room.id)
  }, [room])

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) { if (timerActive && timeLeft <= 0) handleTimeout(); return }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, timeLeft, handleTimeout])

  const startGame = async () => {
    if (!room) return
    setPhase('playing'); setQuestionIndex(0)
    setTimeLeft(game.timer_seconds || 20); setTimerActive(true)
    await supabase.from('custom_game_rooms').update({ status: 'playing', current_question: 0 }).eq('id', room.id)
  }

  const revealAnswer = async () => {
    setTimerActive(false); setPhase('revealed')
    if (room) await supabase.from('custom_game_rooms').update({ status: 'revealed' }).eq('id', room.id)
  }

  const nextQuestion = async () => {
    if (!room) return
    if (questionIndex + 1 >= questions.length) {
      setPhase('finished')
      await supabase.from('custom_game_rooms').update({ status: 'finished' }).eq('id', room.id)
      return
    }
    const next = questionIndex + 1
    setQuestionIndex(next); setPhase('playing')
    setTimeLeft(game?.timer_seconds || 20); setTimerActive(true)
    await supabase.from('custom_game_rooms').update({ status: 'playing', current_question: next }).eq('id', room.id)
  }

  const timerPct = game ? (timeLeft / game.timer_seconds) * 100 : 100
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'
  const optionColors = ['#7C3AED', '#E85D26', '#0891b2', '#16a34a']
  const optionLetters = ['A', 'B', 'C', 'D']
  const totalAnswered = answerCounts.reduce((a, b) => a + b, 0)

  if (!pinAuthed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔐</div>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>Teacher Access Only</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
          Only the teacher can host a multiplayer game.<br />Enter your <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#f59e0b' }}>TCH-XXXX-XXXX</span> code to continue.
        </p>
        <input value={pin} onChange={e => { setPin(e.target.value.toUpperCase()); setPinError('') }}
          onKeyDown={e => e.key === 'Enter' && checkPin()}
          placeholder="TCH-XXXX-XXXX" maxLength={13}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', border: `2px solid ${pinError ? '#ef4444' : '#e5e7eb'}`, fontSize: '20px', fontFamily: 'monospace', fontWeight: '800', outline: 'none', boxSizing: 'border-box', letterSpacing: '2px', textAlign: 'center', color: '#1a1a2e', background: '#f9fafb', marginBottom: '8px' }} />
        {pinError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>{pinError}</p>}
        <button onClick={checkPin} disabled={checkingPin || pin.length < 12}
          style={{ width: '100%', background: checkingPin || pin.length < 12 ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: checkingPin || pin.length < 12 ? '#9ca3af' : '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: checkingPin || pin.length < 12 ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
          {checkingPin ? 'Checking...' : '🎮 Host Game →'}
        </button>
        <Link href={`/arcade/${slug}/${gameId}`} style={{ display: 'block', marginTop: '16px', color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>← Back</Link>
      </div>
    </main>
  )

  if (loading) return <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'white', fontSize: '20px' }}>Setting up room...</div></main>
  if (!game) return <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'white' }}>Game not found</div></main>

  const q = questions[questionIndex]
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))

  // ── FINISHED ─────────────────────────────────────────────
  if (phase === 'finished') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
      <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '900', marginBottom: '32px' }}>Game Over!</h1>
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>🏅 Final Leaderboard</h2>
        {sortedPlayers.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', background: i === 0 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)', marginBottom: '8px', border: i === 0 ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '24px', width: '32px', textAlign: 'center' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '17px', flex: 1 }}>{p.nickname}</div>
            <div style={{ color: '#fbbf24', fontWeight: '900', fontSize: '20px' }}>{p.score || 0}</div>
          </div>
        ))}
      </div>
      <Link href={`/arcade/${slug}`} style={{ marginTop: '24px', display: 'block', background: '#f59e0b', color: '#1a1a2e', padding: '14px 40px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px' }}>← Back to Arcade</Link>
    </main>
  )

  // ── LOBBY ─────────────────────────────────────────────────
  if (phase === 'lobby') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
      <div style={{ width: '100%', maxWidth: '700px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>🎮 Multiplayer — Host</div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '900', margin: 0 }}>{game.title}</h1>
        </div>

        {/* Room Code */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', textAlign: 'center', marginBottom: '24px', border: '2px solid rgba(245,158,11,0.4)' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Students go to:</div>
          <div style={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>jobsinthailand.net/arcade/{slug}/{gameId}/join</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Room Code:</div>
          <div style={{ fontSize: '72px', fontWeight: '900', color: 'white', fontFamily: 'monospace', letterSpacing: '8px', animation: 'pulse 2s infinite' }}>{room?.room_code}</div>
        </div>

        {/* Players */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '18px', marginBottom: '16px' }}>
            👥 Players Joined ({players.length})
          </div>
          {players.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '24px', fontSize: '15px' }}>Waiting for students to join...</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {players.map(p => (
                <div key={p.id} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '15px' }}>
                  {p.nickname}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={startGame} disabled={players.length === 0}
          style={{ width: '100%', background: players.length === 0 ? '#374151' : 'linear-gradient(135deg, #22c55e, #16a34a)', color: players.length === 0 ? '#6b7280' : 'white', border: 'none', padding: '20px', borderRadius: '16px', fontWeight: '900', fontSize: '22px', cursor: players.length === 0 ? 'not-allowed' : 'pointer', boxShadow: players.length > 0 ? '0 6px 20px rgba(34,197,94,0.4)' : 'none' }}>
          {players.length === 0 ? 'Waiting for players...' : `▶ Start Game (${players.length} player${players.length !== 1 ? 's' : ''})`}
        </button>
      </div>
    </main>
  )

  // ── PLAYING / REVEALED ────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', padding: '24px 40px' }}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}`}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>{game.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700' }}>
            👥 {players.length} players · {totalAnswered} answered
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: '700' }}>Q {questionIndex + 1}/{questions.length}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '6px', marginBottom: '24px' }}>
        <div style={{ height: '6px', borderRadius: '8px', background: '#f59e0b', width: `${((questionIndex + 1) / questions.length) * 100}%`, transition: 'width 0.5s' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Timer */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '72px', fontWeight: '900', color: timerColor, lineHeight: 1, animation: timeLeft <= 5 && phase === 'playing' ? 'pulse 0.5s infinite' : 'none' }}>{timeLeft}</div>
          <div style={{ width: '180px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', margin: '8px auto 0' }}>
            <div style={{ height: '8px', borderRadius: '8px', background: timerColor, width: `${timerPct}%`, transition: 'width 1s linear' }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 40px', marginBottom: '24px', textAlign: 'center', width: '100%', maxWidth: '900px', border: '2px solid rgba(255,255,255,0.1)' }}>
          {q?.imageUrl && <img src={q.imageUrl} alt="" style={{ maxHeight: '260px', objectFit: 'contain', borderRadius: '12px', marginBottom: '16px' }} />}
          <div style={{ color: 'white', fontSize: '44px', fontWeight: '900', lineHeight: 1.2 }}>{q?.questionText}</div>
        </div>

        {/* Options with answer count bars */}
        <div style={{ display: 'grid', gridTemplateColumns: q?.options?.length === 2 ? '1fr 1fr' : 'repeat(2, 1fr)', gap: '14px', width: '100%', maxWidth: '900px' }}>
          {q?.options?.map((opt: string, i: number) => {
            const isCorrect = i === q.correctIndex
            const count = answerCounts[i] || 0
            const pct = players.length > 0 ? Math.round((count / players.length) * 100) : 0
            return (
              <div key={i} style={{ background: phase === 'revealed' ? (isCorrect ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.05)') : optionColors[i] + '33', border: `3px solid ${phase === 'revealed' ? (isCorrect ? '#22c55e' : 'rgba(255,255,255,0.1)') : optionColors[i]}`, borderRadius: '16px', padding: '20px 24px', opacity: phase === 'revealed' && !isCorrect ? 0.5 : 1, transition: 'all 0.4s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: phase === 'revealed' ? '10px' : '0' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: phase === 'revealed' ? (isCorrect ? '#22c55e' : 'rgba(255,255,255,0.1)') : optionColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px', color: 'white', flexShrink: 0 }}>
                    {phase === 'revealed' && isCorrect ? '✓' : optionLetters[i]}
                  </div>
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '20px', flex: 1 }}>{opt}</div>
                  {phase === 'revealed' && <div style={{ color: isCorrect ? '#86efac' : 'rgba(255,255,255,0.5)', fontWeight: '900', fontSize: '20px' }}>{count}</div>}
                </div>
                {phase === 'revealed' && (
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ height: '8px', borderRadius: '6px', background: isCorrect ? '#22c55e' : 'rgba(255,255,255,0.3)', width: `${pct}%`, transition: 'width 0.6s ease' }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {phase === 'playing' && (
          <button onClick={revealAnswer}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer' }}>
            👁 Reveal Answer
          </button>
        )}
        {phase === 'revealed' && (
          <button onClick={nextQuestion}
            style={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)', color: 'white', border: 'none', padding: '16px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer' }}>
            {questionIndex + 1 >= questions.length ? '🏆 See Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </main>
  )
}
