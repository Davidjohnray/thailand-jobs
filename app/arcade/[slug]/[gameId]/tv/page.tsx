'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../../src/lib/supabase'

interface NormalizedQuestion {
  questionText: string
  imageUrl?: string
  options: string[]
  correctIndex: number
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalizeQuestions(raw: any[], gameType: string): NormalizedQuestion[] {
  return raw.map(q => {
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
    if (gameType === 'true_or_false') {
      return { questionText: q.statement, options: ['True', 'False'], correctIndex: q.correct === 'true' ? 0 : 1 }
    }
    return { questionText: '', options: [], correctIndex: 0 }
  })
}

export default function TVModePage({ params }: { params: { slug: string; gameId: string } }) {
  const { slug, gameId } = params
  const [game, setGame] = useState<any>(null)
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<'vocab' | 'waiting' | 'playing' | 'revealed' | 'finished'>('waiting')
  const [vocabIndex, setVocabIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [timerActive, setTimerActive] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => {
      if (!data) { setLoading(false); return }
      setGame(data)
      const normalized = normalizeQuestions(Array.isArray(data.questions) ? data.questions : [], data.game_type)
      setQuestions(normalized)
      setTimeLeft(data.timer_seconds || 20)
      setPhase(data.show_vocab_lesson ? 'vocab' : 'waiting')
      setLoading(false)
    })
  }, [gameId])

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      if (timerActive && timeLeft <= 0) { setTimerActive(false); setPhase('revealed') }
      return
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, timeLeft])

  const startTimer = () => {
    setPhase('playing')
    setTimeLeft(game.timer_seconds || 20)
    setTimerActive(true)
  }

  const revealAnswer = () => {
    setTimerActive(false)
    setPhase('revealed')
  }

  const nextQuestion = () => {
    if (questionIndex + 1 >= questions.length) { setPhase('finished'); return }
    setQuestionIndex(prev => prev + 1)
    setPhase('waiting')
    setTimeLeft(game?.timer_seconds || 20)
  }

  const restart = () => {
    const reshuffled = normalizeQuestions(Array.isArray(game.questions) ? game.questions : [], game.game_type)
    setQuestions(reshuffled)
    setQuestionIndex(0)
    setPhase(game.show_vocab_lesson ? 'vocab' : 'waiting')
    setVocabIndex(0)
    setTimeLeft(game.timer_seconds || 20)
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '24px' }}>Loading...</div>
    </main>
  )

  if (!game) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white' }}>Game not found. <Link href={`/arcade/${slug}`} style={{ color: '#f59e0b' }}>Go back</Link></div>
    </main>
  )

  const q = questions[questionIndex]
  const timerPct = game ? (timeLeft / game.timer_seconds) * 100 : 100
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'
  const rawVocab = Array.isArray(game.questions) ? game.questions : []

  const optionColors = ['#7C3AED', '#E85D26', '#0891b2', '#16a34a']
  const optionLetters = ['A', 'B', 'C', 'D']

  // ── VOCAB LESSON ─────────────────────────────────────────
  if (phase === 'vocab') {
    const word = rawVocab[vocabIndex]
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link href={`/arcade/${slug}/${gameId}`} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '16px' }}>← Back</Link>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', fontWeight: '700' }}>
            📚 Vocabulary — {vocabIndex + 1} / {rawVocab.length}
          </div>
          <div style={{ width: '60px' }} />
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '900px', textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '24px' }}>Word / Term</div>
            <div style={{ color: 'white', fontSize: '72px', fontWeight: '900', marginBottom: '40px', lineHeight: 1.1 }}>
              {word?.word || word?.question || word?.statement}
            </div>
            {word?.image_url && <img src={word.image_url} alt="" style={{ maxHeight: '280px', objectFit: 'contain', borderRadius: '16px', marginBottom: '32px' }} />}
            <div style={{ background: 'rgba(34,197,94,0.15)', border: '3px solid #22c55e', borderRadius: '20px', padding: '32px 40px', fontSize: '32px', color: '#86efac', fontWeight: '700', lineHeight: '1.5', maxWidth: '700px', margin: '0 auto' }}>
              {word?.definition || (word?.correct === 'true' ? '✅ This is TRUE' : word?.correct === 'false' ? '❌ This is FALSE' : word?.['option_' + word?.correct])}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          {vocabIndex > 0 && (
            <button onClick={() => setVocabIndex(prev => prev - 1)}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', padding: '16px 40px', borderRadius: '14px', fontWeight: '800', fontSize: '20px', cursor: 'pointer' }}>
              ← Previous
            </button>
          )}
          {vocabIndex + 1 < rawVocab.length ? (
            <button onClick={() => setVocabIndex(prev => prev + 1)}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer' }}>
              Next →
            </button>
          ) : (
            <button onClick={() => setPhase('waiting')}
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '16px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(34,197,94,0.4)' }}>
              🎮 Start Game!
            </button>
          )}
        </div>
      </main>
    )
  }

  // ── FINISHED ─────────────────────────────────────────────
  if (phase === 'finished') return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '120px', marginBottom: '24px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '64px', fontWeight: '900', marginBottom: '16px' }}>Game Over!</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px', marginBottom: '48px' }}>Great job everyone! 🎉</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={restart}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '20px 48px', borderRadius: '16px', fontWeight: '900', fontSize: '22px', cursor: 'pointer' }}>
            🔄 Play Again
          </button>
          <Link href={`/arcade/${slug}`}
            style={{ display: 'block', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', padding: '20px 48px', borderRadius: '16px', fontWeight: '800', fontSize: '22px', textDecoration: 'none' }}>
            ← Back to Arcade
          </Link>
        </div>
      </div>
    </main>
  )

  // ── WAITING / PLAYING / REVEALED ─────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', padding: '24px 40px' }}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}} @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href={`/arcade/${slug}/${gameId}`} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '16px' }}>← Exit</Link>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>{game.title}</div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', fontWeight: '700' }}>
          Q {questionIndex + 1} / {questions.length}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '8px', marginBottom: '32px' }}>
        <div style={{ height: '8px', borderRadius: '10px', background: '#f59e0b', width: `${((questionIndex + 1) / questions.length) * 100}%`, transition: 'width 0.5s' }} />
      </div>

      {/* QUESTION AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* TIMER */}
        {(phase === 'playing' || phase === 'revealed') && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '80px', fontWeight: '900', color: timerColor, lineHeight: 1, animation: timeLeft <= 5 && phase === 'playing' ? 'pulse 0.5s infinite' : 'none' }}>{timeLeft}</div>
            <div style={{ width: '200px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', margin: '8px auto 0', overflow: 'hidden' }}>
              <div style={{ height: '8px', borderRadius: '8px', background: timerColor, width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
            </div>
          </div>
        )}

        {/* QUESTION BOX */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', padding: '36px 48px', marginBottom: '32px', textAlign: 'center', width: '100%', maxWidth: '1000px', border: '2px solid rgba(255,255,255,0.1)' }}>
          {game.game_type === 'vocab_blast' && phase !== 'waiting' && (
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>What does this mean?</div>
          )}
          {q?.imageUrl && <img src={q.imageUrl} alt="Question" style={{ maxHeight: '300px', objectFit: 'contain', borderRadius: '16px', marginBottom: '24px' }} />}
          <div style={{ color: phase === 'waiting' ? 'rgba(255,255,255,0.4)' : 'white', fontSize: phase === 'waiting' ? '32px' : '52px', fontWeight: '900', lineHeight: 1.2, transition: 'all 0.3s' }}>
            {phase === 'waiting' ? `Question ${questionIndex + 1} coming up...` : q?.questionText}
          </div>
        </div>

        {/* OPTIONS GRID */}
        {phase !== 'waiting' && q && (
          <div style={{ display: 'grid', gridTemplateColumns: q.options.length === 2 ? '1fr 1fr' : 'repeat(2, 1fr)', gap: '16px', width: '100%', maxWidth: '1000px', animation: 'fadeIn 0.3s ease' }}>
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex
              const revealed = phase === 'revealed'
              return (
                <div key={i} style={{
                  background: revealed ? (isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.05)') : optionColors[i] + '33',
                  border: `3px solid ${revealed ? (isCorrect ? '#22c55e' : 'rgba(255,255,255,0.1)') : optionColors[i]}`,
                  borderRadius: '18px', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '20px',
                  opacity: revealed && !isCorrect ? 0.4 : 1, transition: 'all 0.4s',
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: revealed ? (isCorrect ? '#22c55e' : 'rgba(255,255,255,0.1)') : optionColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '24px', color: 'white', flexShrink: 0 }}>
                    {revealed && isCorrect ? '✓' : optionLetters[i]}
                  </div>
                  <div style={{ color: revealed ? (isCorrect ? '#86efac' : 'rgba(255,255,255,0.5)') : 'white', fontWeight: '800', fontSize: '24px', lineHeight: 1.3 }}>{opt}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* TEACHER CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
        {phase === 'waiting' && (
          <button onClick={startTimer}
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '18px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(34,197,94,0.4)' }}>
            ▶ Start Timer
          </button>
        )}
        {phase === 'playing' && (
          <button onClick={revealAnswer}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '18px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' }}>
            👁 Reveal Answer
          </button>
        )}
        {phase === 'revealed' && (
          <button onClick={nextQuestion}
            style={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)', color: 'white', border: 'none', padding: '18px 48px', borderRadius: '14px', fontWeight: '900', fontSize: '20px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(8,145,178,0.4)' }}>
            {questionIndex + 1 >= questions.length ? '🏆 Finish Game' : 'Next Question →'}
          </button>
        )}
        <Link href={`/arcade/${slug}/${gameId}`}
          style={{ display: 'block', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '2px solid rgba(255,255,255,0.15)', padding: '18px 32px', borderRadius: '14px', fontWeight: '700', fontSize: '18px', textDecoration: 'none' }}>
          ✕ Exit
        </Link>
      </div>
    </main>
  )
}
