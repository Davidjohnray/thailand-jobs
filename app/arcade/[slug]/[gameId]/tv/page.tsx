'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../../src/lib/supabase'

const TEAM_COLORS = ['#ef4444','#f59e0b','#22c55e','#0ea5e9','#8b5cf6','#ec4899']
const TEAM_EMOJIS = ['🔴','🟡','🟢','🔵','🟣','🩷']
const DEFAULT_NAMES = ['Team Red','Team Yellow','Team Green','Team Blue','Team Purple','Team Pink']

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
      return { questionText: q.definition, imageUrl: q.image_data || undefined, options: allOptions, correctIndex: allOptions.indexOf(q.correct_word) }
    }
    if (gameType === 'vocab_blast') {
      const distractors = [q.distractor1, q.distractor2, q.distractor3].filter(Boolean)
      const allOptions = shuffleArray([q.definition, ...distractors])
      return { questionText: q.word, imageUrl: q.image_data || undefined, options: allOptions, correctIndex: allOptions.indexOf(q.definition) }
    }
    if (gameType === 'quiz_master' || gameType === 'picture_quiz') {
      const opts = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean)
      const correctOpt = opts[['a','b','c','d'].indexOf(q.correct)]
      const shuffled = shuffleArray(opts)
      return { questionText: q.question, imageUrl: q.image_data || q.image_url || undefined, options: shuffled, correctIndex: shuffled.indexOf(correctOpt) }
    }
    if (gameType === 'true_or_false') return { questionText: q.statement, imageUrl: q.image_data || undefined, options: ['True', 'False'], correctIndex: q.correct === 'true' ? 0 : 1 }
    return { questionText: '', imageUrl: undefined, options: [], correctIndex: 0 }
  })
}

type Phase = 'setup' | 'waiting' | 'playing' | 'revealed' | 'leaderboard' | 'finished'

export default function TVModePage({ params }: { params: any }) {
  const { slug, gameId } = use(params) as { slug: string; gameId: string }
  const [game, setGame] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<Phase>('setup')

  // Setup
  const [teamCount, setTeamCount] = useState(4)
  const [teamNames, setTeamNames] = useState<string[]>(DEFAULT_NAMES)
  const [useTimer, setUseTimer] = useState(true)
  const [timerSeconds, setTimerSeconds] = useState(30)

  // Game
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [scores, setScores] = useState<number[]>([0,0,0,0,0,0])
  const [pointsAwarded, setPointsAwarded] = useState<boolean[]>([false,false,false,false,false,false])

  useEffect(() => {
    if (!gameId) return
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => {
      if (!data) { setLoading(false); return }
      setGame(data)
      // Merge sessionStorage images back into questions
      let rawQuestions = Array.isArray(data.questions) ? data.questions : []
      try {
        const stored = sessionStorage.getItem(`game_images_${gameId}`)
        if (stored) {
          const images = JSON.parse(stored)
          rawQuestions = rawQuestions.map((q: any, i: number) => images[i] ? { ...q, image_data: images[i] } : q)
        }
      } catch {}
      setQuestions(normalizeQuestions(rawQuestions, data.game_type))
      setTimerSeconds(data.timer_seconds || 30)
      setTimeLeft(data.timer_seconds || 30)
      setLoading(false)
    })
  }, [gameId])

  // Timer
  useEffect(() => {
    if (!timerActive || !useTimer || timeLeft <= 0) {
      if (timerActive && useTimer && timeLeft <= 0) { setTimerActive(false); setPhase('revealed') }
      return
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, timeLeft, useTimer])

  const startTimer = () => { setPhase('playing'); setTimeLeft(timerSeconds); setTimerActive(true) }
  const revealAnswer = () => { setTimerActive(false); setPhase('revealed') }

  const showLeaderboard = () => {
    setPointsAwarded(Array(6).fill(false))
    setPhase('leaderboard')
  }

  const nextQuestion = () => {
    if (questionIndex + 1 >= questions.length) { setPhase('finished'); return }
    setQuestionIndex(prev => prev + 1)
    setPhase('waiting')
    setTimeLeft(timerSeconds)
  }

  const togglePoint = (teamIdx: number) => {
    const newAwarded = [...pointsAwarded]
    newAwarded[teamIdx] = !newAwarded[teamIdx]
    setPointsAwarded(newAwarded)
    const newScores = [...scores]
    newScores[teamIdx] = newAwarded[teamIdx] ? newScores[teamIdx] + 1 : newScores[teamIdx] - 1
    setScores(newScores)
  }

  const restartGame = () => {
    let rawQuestions = Array.isArray(game.questions) ? game.questions : []
    try {
      const stored = sessionStorage.getItem(`game_images_${gameId}`)
      if (stored) {
        const images = JSON.parse(stored)
        rawQuestions = rawQuestions.map((q: any, i: number) => images[i] ? { ...q, image_data: images[i] } : q)
      }
    } catch {}
    setQuestions(normalizeQuestions(rawQuestions, game.game_type))
    setQuestionIndex(0); setScores(Array(6).fill(0)); setPhase('setup'); setTimeLeft(timerSeconds)
  }

  if (loading) return <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'white', fontSize: '24px' }}>Loading...</div></main>
  if (!game) return <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'white' }}>Game not found. <Link href={`/arcade/${slug}`} style={{ color: '#f59e0b' }}>Go back</Link></div></main>

  const teams = teamNames.slice(0, teamCount)
  const q = questions[questionIndex]
  const timerPct = useTimer ? (timeLeft / timerSeconds) * 100 : 100
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'
  const sortedTeams = teams.map((name, i) => ({ name, score: scores[i], color: TEAM_COLORS[i], emoji: TEAM_EMOJIS[i], idx: i })).sort((a, b) => b.score - a.score)

  // SETUP PHASE — goes straight here, no vocab
  if (phase === 'setup') {
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '700px' }}>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: '900', textAlign: 'center', marginBottom: '8px' }}>🎮 Game Setup</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '16px', marginBottom: '36px' }}>{game.title} · {questions.length} questions</p>

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '2px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '18px', marginBottom: '16px' }}>👥 Number of Teams</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[1,2,3,4,5,6].map(n => (
                <button key={n} onClick={() => setTeamCount(n)}
                  style={{ width: '56px', height: '56px', borderRadius: '14px', border: '3px solid', borderColor: teamCount === n ? TEAM_COLORS[n-1] : 'rgba(255,255,255,0.2)', background: teamCount === n ? TEAM_COLORS[n-1] + '30' : 'transparent', color: teamCount === n ? TEAM_COLORS[n-1] : 'rgba(255,255,255,0.6)', fontWeight: '900', fontSize: '22px', cursor: 'pointer' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '2px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '18px', marginBottom: '16px' }}>✏️ Team Names</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {Array.from({ length: teamCount }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: TEAM_COLORS[i] + '20', borderRadius: '10px', padding: '10px 14px', border: `2px solid ${TEAM_COLORS[i]}40` }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{TEAM_EMOJIS[i]}</span>
                  <input value={teamNames[i]} onChange={e => { const n = [...teamNames]; n[i] = e.target.value; setTeamNames(n) }}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontWeight: '700', fontSize: '15px', outline: 'none', minWidth: 0 }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '28px', border: '2px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '18px', marginBottom: '16px' }}>⏱ Timer</div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button onClick={() => setUseTimer(true)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '3px solid', borderColor: useTimer ? '#22c55e' : 'rgba(255,255,255,0.2)', background: useTimer ? 'rgba(34,197,94,0.2)' : 'transparent', color: useTimer ? '#22c55e' : 'rgba(255,255,255,0.6)', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
                ⏱ Timer On
              </button>
              <button onClick={() => setUseTimer(false)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '3px solid', borderColor: !useTimer ? '#0ea5e9' : 'rgba(255,255,255,0.2)', background: !useTimer ? 'rgba(14,165,233,0.2)' : 'transparent', color: !useTimer ? '#0ea5e9' : 'rgba(255,255,255,0.6)', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
                ⏹ No Timer
              </button>
            </div>
            {useTimer && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', flexShrink: 0 }}>Seconds per question:</span>
                <input type="number" value={timerSeconds} min={5} max={120}
                  onChange={e => { const v = parseInt(e.target.value) || 30; setTimerSeconds(v); setTimeLeft(v) }}
                  style={{ width: '80px', padding: '10px 14px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: '900', fontSize: '18px', outline: 'none', textAlign: 'center' }} />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[15,20,30,45,60].map(s => (
                    <button key={s} onClick={() => { setTimerSeconds(s); setTimeLeft(s) }}
                      style={{ padding: '8px 14px', borderRadius: '8px', border: '2px solid', borderColor: timerSeconds === s ? '#f59e0b' : 'rgba(255,255,255,0.2)', background: timerSeconds === s ? 'rgba(245,158,11,0.2)' : 'transparent', color: timerSeconds === s ? '#f59e0b' : 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                      {s}s
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href={`/arcade/${slug}/${gameId}`} style={{ textDecoration: 'none' }}>
              <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', padding: '16px 28px', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>← Back</button>
            </Link>
            <button onClick={() => setPhase('waiting')} style={{ flex: 1, background: 'linear-gradient(135deg, #E85D26, #dc4d1e)', color: 'white', border: 'none', padding: '16px 28px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer' }}>
              🎮 Start Game!
            </button>
          </div>
        </div>
      </main>
    )
  }

  // FINISHED PHASE
  if (phase === 'finished') {
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '700px', textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '900', marginBottom: '8px' }}>Game Over!</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', marginBottom: '40px' }}>Final Scores</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            {sortedTeams.map((team, rank) => (
              <div key={team.idx} style={{ background: rank === 0 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '20px', border: `3px solid ${rank === 0 ? '#f59e0b' : team.color + '40'}` }}>
                <div style={{ fontSize: '36px', flexShrink: 0 }}>{rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`}</div>
                <div style={{ fontSize: '28px', flexShrink: 0 }}>{team.emoji}</div>
                <div style={{ flex: 1, textAlign: 'left' }}><div style={{ color: 'white', fontWeight: '900', fontSize: '22px' }}>{team.name}</div></div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: rank === 0 ? '#f59e0b' : team.color }}>{team.score} pts</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={restartGame} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '18px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer' }}>🔄 Play Again</button>
            <Link href={`/arcade/${slug}/${gameId}`} style={{ display: 'block', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', padding: '18px 36px', borderRadius: '14px', fontWeight: '800', fontSize: '18px', textDecoration: 'none' }}>← Mode Select</Link>
          </div>
        </div>
      </main>
    )
  }

  // LEADERBOARD PHASE
  if (phase === 'leaderboard') {
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>After Question {questionIndex + 1}</div>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '900', margin: 0 }}>📊 Leaderboard</h1>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '800px', width: '100%', margin: '0 auto', gap: '12px' }}>
          {sortedTeams.map((team, rank) => {
            const barWidth = sortedTeams[0].score > 0 ? (team.score / sortedTeams[0].score) * 100 : 0
            return (
              <div key={team.idx} style={{ background: rank === 0 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px 24px', border: `3px solid ${rank === 0 ? '#f59e0b50' : team.color + '30'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>{rank === 0 ? '👑' : `${rank + 1}.`}</div>
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>{team.emoji}</div>
                  <div style={{ flex: 1, color: 'white', fontWeight: '900', fontSize: '22px' }}>{team.name}</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: rank === 0 ? '#f59e0b' : team.color }}>{team.score} pts</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '10px', borderRadius: '8px', background: rank === 0 ? '#f59e0b' : team.color, width: `${barWidth}%`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          {questionIndex + 1 >= questions.length
            ? <button onClick={() => setPhase('finished')} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '18px 56px', borderRadius: '14px', fontWeight: '900', fontSize: '22px', cursor: 'pointer' }}>🏆 Final Results →</button>
            : <button onClick={nextQuestion} style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', color: 'white', border: 'none', padding: '18px 56px', borderRadius: '14px', fontWeight: '900', fontSize: '22px', cursor: 'pointer' }}>Next Question →</button>
          }
        </div>
      </main>
    )
  }

  // MAIN GAME PHASES (waiting / playing / revealed)
  if (!q) return null
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', padding: '24px 40px' }}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>{game.title}</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', fontWeight: '700' }}>Q {questionIndex + 1} / {questions.length}</div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {teams.map((name, i) => (
          <div key={i} style={{ flex: 1, minWidth: '80px', background: TEAM_COLORS[i] + '25', borderRadius: '12px', padding: '10px 14px', border: `2px solid ${TEAM_COLORS[i]}50`, textAlign: 'center' }}>
            <div style={{ fontSize: '18px' }}>{TEAM_EMOJIS[i]}</div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '13px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
            <div style={{ color: TEAM_COLORS[i], fontWeight: '900', fontSize: '20px' }}>{scores[i]}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '6px', marginBottom: '16px' }}>
        <div style={{ height: '6px', borderRadius: '10px', background: '#f59e0b', width: `${((questionIndex + 1) / questions.length) * 100}%`, transition: 'width 0.5s' }} />
      </div>

      {useTimer && (phase === 'playing' || phase === 'revealed') && (
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '64px', fontWeight: '900', color: timerColor, animation: timeLeft <= 5 && phase === 'playing' ? 'pulse 0.5s infinite' : 'none', lineHeight: 1 }}>{timeLeft}</div>
          <div style={{ width: '200px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', margin: '6px auto 0', overflow: 'hidden' }}>
            <div style={{ height: '8px', borderRadius: '8px', background: timerColor, width: `${timerPct}%`, transition: 'width 1s linear' }} />
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 40px', marginBottom: '20px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.1)', flex: phase === 'waiting' ? 1 : 'none' }}>
        {q?.imageUrl && phase !== 'waiting' && <img src={q.imageUrl} alt="" style={{ maxHeight: '260px', objectFit: 'contain', borderRadius: '16px', marginBottom: '20px' }} />}
        <div style={{ color: phase === 'waiting' ? 'rgba(255,255,255,0.3)' : 'white', fontSize: phase === 'waiting' ? '28px' : '44px', fontWeight: '900', lineHeight: 1.2, transition: 'all 0.3s' }}>
          {phase === 'waiting' ? `Question ${questionIndex + 1} — Ready?` : q?.questionText}
        </div>
      </div>

      {phase !== 'waiting' && q && (
        <div style={{ display: 'grid', gridTemplateColumns: q.options.length === 2 ? '1fr 1fr' : 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {q.options.map((opt: string, i: number) => {
            const isCorrect = i === q.correctIndex
            const isRevealed = phase === 'revealed'
            const optColors = ['#7C3AED','#E85D26','#0891b2','#16a34a']
            return (
              <div key={i} style={{ background: isRevealed ? (isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.05)') : optColors[i] + '33', border: `3px solid ${isRevealed ? (isCorrect ? '#22c55e' : 'rgba(255,255,255,0.08)') : optColors[i]}`, borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', opacity: isRevealed && !isCorrect ? 0.35 : 1, transition: 'all 0.4s' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isRevealed ? (isCorrect ? '#22c55e' : 'rgba(255,255,255,0.08)') : optColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '22px', color: 'white', flexShrink: 0 }}>
                  {isRevealed && isCorrect ? '✓' : String.fromCharCode(65 + i)}
                </div>
                <div style={{ color: isRevealed ? (isCorrect ? '#86efac' : 'rgba(255,255,255,0.4)') : 'white', fontWeight: '800', fontSize: '22px', lineHeight: 1.3 }}>{opt}</div>
              </div>
            )
          })}
        </div>
      )}

      {phase === 'revealed' && (
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px 24px', marginBottom: '16px', border: '2px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>✅ Award points — tap the teams that got it right</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {teams.map((name, i) => (
              <button key={i} onClick={() => togglePoint(i)}
                style={{ padding: '10px 20px', borderRadius: '10px', border: `3px solid ${pointsAwarded[i] ? TEAM_COLORS[i] : 'rgba(255,255,255,0.2)'}`, background: pointsAwarded[i] ? TEAM_COLORS[i] + '35' : 'transparent', color: pointsAwarded[i] ? TEAM_COLORS[i] : 'rgba(255,255,255,0.5)', fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {pointsAwarded[i] ? '✓ ' : ''}{TEAM_EMOJIS[i]} {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', paddingTop: '8px', flexWrap: 'wrap' }}>
        {phase === 'waiting' && (
          <button onClick={startTimer} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '18px 56px', borderRadius: '14px', fontWeight: '900', fontSize: '22px', cursor: 'pointer' }}>
            {useTimer ? '▶ Start Timer' : '▶ Show Question'}
          </button>
        )}
        {phase === 'playing' && (
          <button onClick={revealAnswer} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '18px 56px', borderRadius: '14px', fontWeight: '900', fontSize: '22px', cursor: 'pointer' }}>👁 Reveal Answer</button>
        )}
        {phase === 'revealed' && (
          <button onClick={showLeaderboard} style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', color: 'white', border: 'none', padding: '18px 56px', borderRadius: '14px', fontWeight: '900', fontSize: '22px', cursor: 'pointer' }}>📊 Show Leaderboard →</button>
        )}
        <Link href={`/arcade/${slug}/${gameId}`} style={{ display: 'block', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '2px solid rgba(255,255,255,0.15)', padding: '18px 32px', borderRadius: '14px', fontWeight: '700', fontSize: '18px', textDecoration: 'none' }}>✕ Exit</Link>
      </div>
    </main>
  )
}
