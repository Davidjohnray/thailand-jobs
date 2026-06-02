'use client'
import { useState, useEffect, useCallback, use } from 'react'
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
      return { questionText: q.word, imageUrl: undefined, options: allOptions, correctIndex: allOptions.indexOf(q.definition) }
    }
    if (gameType === 'quiz_master' || gameType === 'picture_quiz') {
      const opts = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean)
      const correctOpt = opts[['a','b','c','d'].indexOf(q.correct)]
      const shuffled = shuffleArray(opts)
      return { questionText: q.question, imageUrl: q.image_url || undefined, options: shuffled, correctIndex: shuffled.indexOf(correctOpt) }
    }
    if (gameType === 'true_or_false') {
      return { questionText: q.statement, imageUrl: undefined, options: ['True', 'False'], correctIndex: q.correct === 'true' ? 0 : 1 }
    }
    return { questionText: '', imageUrl: undefined, options: [], correctIndex: 0 }
  })
}

export default function SelfStudyPage({ params }: { params: any }) {
  const { slug, gameId } = use(params) as { slug: string; gameId: string }
  const [game, setGame] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<'vocab' | 'quiz' | 'results'>('vocab')
  const [vocabIndex, setVocabIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [results, setResults] = useState<{ correct: boolean }[]>([])

  useEffect(() => {
    if (!gameId) return
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => {
      if (!data) { setLoading(false); return }
      setGame(data)
      setQuestions(normalizeQuestions(Array.isArray(data.questions) ? data.questions : [], data.game_type))
      setTimeLeft(data.timer_seconds || 30)
      setLoading(false)
    })
  }, [gameId])

  const handleTimeout = useCallback(() => {
    if (revealed) return
    setRevealed(true); setTimerActive(false)
    setResults(prev => [...prev, { correct: false }])
  }, [revealed])

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) { if (timerActive && timeLeft <= 0) handleTimeout(); return }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [timerActive, timeLeft, handleTimeout])

  const startQuestion = useCallback(() => {
    setSelected(null); setRevealed(false)
    setTimeLeft(game?.timer_seconds || 30); setTimerActive(true)
  }, [game])

  useEffect(() => {
    if (phase === 'quiz' && questions.length > 0) startQuestion()
  }, [phase, questionIndex, startQuestion])

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
    setQuestions(normalizeQuestions(Array.isArray(game.questions) ? game.questions : [], game.game_type))
    setQuestionIndex(0); setScore(0); setResults([])
    setPhase('vocab'); setVocabIndex(0)
  }

  if (loading) return <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'white', fontSize: '18px' }}>Loading...</div></main>
  if (!game) return <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'white' }}>Game not found. <Link href={`/arcade/${slug}`} style={{ color: '#f59e0b' }}>Go back</Link></div></main>

  const rawVocab = Array.isArray(game.questions) ? game.questions : []
  const timerPct = ((timeLeft / (game.timer_seconds || 30)) * 100)
  const timerColor = timeLeft > (game.timer_seconds * 0.5) ? '#22c55e' : timeLeft > (game.timer_seconds * 0.25) ? '#f59e0b' : '#ef4444'

  // VOCAB PHASE
  if (phase === 'vocab') {
    const word = rawVocab[vocabIndex]
    const isLast = vocabIndex + 1 >= rawVocab.length
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Link href={`/arcade/${slug}/${gameId}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '700' }}>📚 Vocabulary · {vocabIndex + 1} / {rawVocab.length}</div>
          </div>

          {/* Progress bar */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '6px', marginBottom: '24px' }}>
            <div style={{ height: '6px', borderRadius: '10px', background: '#f59e0b', width: `${((vocabIndex + 1) / rawVocab.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>
              {game.game_type === 'vocab_blast' ? 'Word' : game.game_type === 'true_or_false' ? 'Statement' : 'Question'}
            </div>
            {word?.image_url && <img src={word.image_url} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', marginBottom: '16px' }} />}
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a2e', marginBottom: '20px', lineHeight: '1.3' }}>
              {word?.word || word?.question || word?.statement}
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '18px', border: '2px solid #86efac' }}>
              <div style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Answer</div>
              <div style={{ fontSize: '17px', color: '#15803d', fontWeight: '700', lineHeight: '1.6' }}>
                {word?.definition || (word?.correct === 'true' ? '✅ TRUE' : word?.correct === 'false' ? '❌ FALSE' : word?.['option_' + word?.correct])}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {vocabIndex > 0 && (
              <button onClick={() => setVocabIndex(prev => prev - 1)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                ← Previous
              </button>
            )}
            {!isLast ? (
              <button onClick={() => setVocabIndex(prev => prev + 1)}
                style={{ flex: 2, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next Word →
              </button>
            ) : (
              <button onClick={() => setPhase('quiz')}
                style={{ flex: 2, background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                🎮 Start the Quiz! →
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '16px' }}>
            Study all the vocabulary, then test yourself with a quiz
          </p>
        </div>
      </main>
    )
  }

  // RESULTS PHASE
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
            <button onClick={restart} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              🔄 Study Again
            </button>
            <Link href={`/arcade/${slug}`} style={{ display: 'block', background: '#f3f4f6', color: '#374151', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
              ← Back to Arcade
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // QUIZ PHASE
  const q = questions[questionIndex]
  if (!q) return null

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link href={`/arcade/${slug}/${gameId}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>← Exit</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>{questionIndex + 1} / {questions.length}</div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '4px 14px', color: '#fbbf24', fontWeight: '800', fontSize: '14px' }}>⭐ {score}</div>
        </div>
      </div>
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '6px', marginBottom: '20px' }}>
        <div style={{ height: '6px', borderRadius: '10px', background: '#f59e0b', width: `${((questionIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: timerColor, animation: timeLeft <= 5 && timerActive ? 'pulse 0.5s infinite' : 'none', lineHeight: 1 }}>{timeLeft}</div>
          <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px', margin: '6px auto 0', overflow: 'hidden' }}>
            <div style={{ height: '6px', borderRadius: '6px', background: timerColor, width: `${timerPct}%`, transition: 'width 1s linear' }} />
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 24px', marginBottom: '18px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.1)' }}>
          {game.game_type === 'vocab_blast' && <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>What does this mean?</div>}
          {q.imageUrl && <img src={q.imageUrl} alt="" style={{ width: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '12px', marginBottom: '14px' }} />}
          <div style={{ color: 'white', fontSize: '26px', fontWeight: '900', lineHeight: '1.3' }}>{q.questionText}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: q.options.length === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {q.options.map((opt: string, i: number) => {
            let bg = 'rgba(255,255,255,0.08)', border = 'rgba(255,255,255,0.12)', color = 'white'
            if (revealed) {
              if (i === q.correctIndex) { bg = 'rgba(34,197,94,0.25)'; border = '#22c55e'; color = '#86efac' }
              else if (i === selected) { bg = 'rgba(239,68,68,0.25)'; border = '#ef4444'; color = '#fca5a5' }
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={revealed}
                style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '18px 16px', color, fontWeight: '700', fontSize: '16px', cursor: revealed ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: revealed && i === q.correctIndex ? '#22c55e' : revealed && i === selected ? '#ef4444' : 'rgba(255,255,255,0.15)', color: 'white', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0 }}>
                  {revealed && i === q.correctIndex ? '✓' : revealed && i === selected && i !== q.correctIndex ? '✗' : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
        {revealed && (
          <button onClick={nextQuestion} style={{ marginTop: '20px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
            {questionIndex + 1 >= questions.length ? '🏆 See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    </main>
  )
}
