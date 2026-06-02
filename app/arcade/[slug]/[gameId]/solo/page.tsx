'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../../src/lib/supabase'

interface NormalizedQuestion {
  questionText: string
  imageUrl?: string
  options: string[]
  correctIndex: number
  originalWord?: string
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
      return { questionText: q.word, options: allOptions, correctIndex: allOptions.indexOf(q.definition), originalWord: q.word }
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

export default function SoloPage({ params }: { params: { slug: string; gameId: string } }) {
  const { slug, gameId } = params
  const [game, setGame] = useState<any>(null)
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<'vocab' | 'quiz' | 'results'>('vocab')
  const [vocabIndex, setVocabIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [timerActive, setTimerActive] = useState(false)
  const [results, setResults] = useState<{ correct: boolean }[]>([])

  useEffect(() => {
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => {
      if (!data) { setLoading(false); return }
      setGame(data)
      const normalized = normalizeQuestions(Array.isArray(data.questions) ? data.questions : [], data.game_type)
      setQuestions(normalized)
      setTimeLeft(data.timer_seconds || 20)
      setPhase(data.show_vocab_lesson ? 'vocab' : 'quiz')
      setLoading(false)
    })
  }, [gameId])

  const handleTimeout = useCallback(() => {
    if (revealed) return
    setRevealed(true)
    setTimerActive(false)
    setResults(prev => [...prev, { correct: false }])
  }, [revealed])

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      if (timerActive && timeLeft <= 0) handleTimeout()
      return
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, timeLeft, handleTimeout])

  const startQuestion = () => {
    setSelected(null); setRevealed(false)
    setTimeLeft(game.timer_seconds || 20)
    setTimerActive(true)
  }

  useEffect(() => {
    if (phase === 'quiz' && questions.length > 0) startQuestion()
  }, [phase, questionIndex])

  const handleAnswer = (optIndex: number) => {
    if (revealed) return
    setSelected(optIndex); setRevealed(true); setTimerActive(false)
    const correct = optIndex === questions[questionIndex].correctIndex
    if (correct) setScore(prev => prev + 1)
    setResults(prev => [...prev, { correct }])
  }

  const nextQuestion = () => {
    if (questionIndex + 1 >= questions.length) { setPhase('results'); return }
    setQuestionIndex(prev => prev + 1)
  }

  const restart = () => {
    const reshuffled = normalizeQuestions(Array.isArray(game.questions) ? game.questions : [], game.game_type)
    setQuestions(reshuffled); setQuestionIndex(0); setScore(0); setResults([])
    setPhase(game.show_vocab_lesson ? 'vocab' : 'quiz')
    setVocabIndex(0)
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
    </main>
  )

  if (!game) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white' }}>Game not found. <Link href={`/arcade/${slug}`} style={{ color: '#f59e0b' }}>Go back</Link></div>
    </main>
  )

  const timerPct = ((timeLeft / (game.timer_seconds || 20)) * 100)
  const timerColor = timeLeft > (game.timer_seconds * 0.5) ? '#22c55e' : timeLeft > (game.timer_seconds * 0.25) ? '#f59e0b' : '#ef4444'
  const rawVocab = Array.isArray(game.questions) ? game.questions : []

  // ── VOCAB LESSON PHASE ──────────────────────────────────
  if (phase === 'vocab') {
    const word = rawVocab[vocabIndex]
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Link href={`/arcade/${slug}/${gameId}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>📚 Vocab Lesson · {vocabIndex + 1} / {rawVocab.length}</div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ color: '#888', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Word {vocabIndex + 1}</div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a2e', marginBottom: '20px' }}>
              {word?.word || word?.question || word?.statement}
            </div>
            {word?.image_url && <img src={word.image_url} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', marginBottom: '20px' }} />}
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '20px', border: '2px solid #86efac', fontSize: '17px', color: '#15803d', fontWeight: '600', lineHeight: '1.6' }}>
              {word?.definition || (word?.correct === 'true' ? 'This is TRUE' : word?.correct === 'false' ? 'This is FALSE' : word?.['option_' + word?.correct])}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            {vocabIndex > 0 && (
              <button onClick={() => setVocabIndex(prev => prev - 1)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                ← Previous
              </button>
            )}
            {vocabIndex + 1 < rawVocab.length ? (
              <button onClick={() => setVocabIndex(prev => prev + 1)}
                style={{ flex: 2, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next Word →
              </button>
            ) : (
              <button onClick={() => setPhase('quiz')}
                style={{ flex: 2, background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.4)' }}>
                🎮 Start the Game! →
              </button>
            )}
          </div>
        </div>
      </main>
    )
  }

  // ── RESULTS PHASE ────────────────────────────────────────
  if (phase === 'results') {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '👍' : '💪'
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '500px', background: 'white', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{emoji}</div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>
            {pct === 100 ? 'Perfect Score!' : pct >= 70 ? 'Great Job!' : pct >= 50 ? 'Good Try!' : 'Keep Practising!'}
          </h2>
          <div style={{ fontSize: '56px', fontWeight: '900', color: pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444', marginBottom: '8px' }}>{pct}%</div>
          <div style={{ color: '#888', fontSize: '17px', marginBottom: '32px' }}>{score} out of {questions.length} correct</div>

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            {results.map((r, i) => (
              <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: r.correct ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                {r.correct ? '✓' : '✗'}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={restart}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
              🔄 Play Again
            </button>
            <Link href={`/arcade/${slug}`}
              style={{ display: 'block', background: '#f3f4f6', color: '#374151', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
              ← Back to Arcade
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── QUIZ PHASE ───────────────────────────────────────────
  const q = questions[questionIndex]
  if (!q) return null

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* TOP BAR */}
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href={`/arcade/${slug}/${gameId}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>← Exit</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>{questionIndex + 1} / {questions.length}</div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '4px 14px', color: '#fbbf24', fontWeight: '800', fontSize: '14px' }}>
            ⭐ {score}
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '6px', marginBottom: '24px' }}>
        <div style={{ height: '6px', borderRadius: '10px', background: '#f59e0b', width: `${((questionIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* TIMER */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontSize: '40px', fontWeight: '900', color: timerColor, animation: timeLeft <= 5 && timerActive ? 'pulse 0.5s infinite' : 'none', lineHeight: 1 }}>{timeLeft}</div>
            <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ height: '6px', borderRadius: '6px', background: timerColor, width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
            </div>
          </div>
        </div>

        {/* QUESTION */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 24px', marginBottom: '20px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.1)' }}>
          {game.game_type === 'vocab_blast' && (
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>What does this word mean?</div>
          )}
          {q.imageUrl && <img src={q.imageUrl} alt="Question" style={{ width: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '12px', marginBottom: '16px' }} />}
          <div style={{ color: 'white', fontSize: '26px', fontWeight: '900', lineHeight: '1.3' }}>{q.questionText}</div>
        </div>

        {/* OPTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: q.options.length === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {q.options.map((opt, i) => {
            let bg = 'rgba(255,255,255,0.08)'
            let border = 'rgba(255,255,255,0.12)'
            let color = 'white'
            if (revealed) {
              if (i === q.correctIndex) { bg = 'rgba(34,197,94,0.25)'; border = '#22c55e'; color = '#86efac' }
              else if (i === selected) { bg = 'rgba(239,68,68,0.25)'; border = '#ef4444'; color = '#fca5a5' }
            } else if (selected === i) { bg = 'rgba(245,158,11,0.25)'; border = '#f59e0b' }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={revealed}
                style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '18px 16px', color, fontWeight: '700', fontSize: '16px', cursor: revealed ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: revealed && i === q.correctIndex ? '#22c55e' : revealed && i === selected ? '#ef4444' : 'rgba(255,255,255,0.15)', color: 'white', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>
                  {revealed && i === q.correctIndex ? '✓' : revealed && i === selected && i !== q.correctIndex ? '✗' : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* NEXT BUTTON */}
        {revealed && (
          <button onClick={nextQuestion}
            style={{ marginTop: '20px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
            {questionIndex + 1 >= questions.length ? '🏆 See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    </main>
  )
}
