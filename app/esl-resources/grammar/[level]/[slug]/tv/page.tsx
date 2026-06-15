'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

type Question = {
  id: string
  type: 'fill_blank' | 'multiple_choice' | 'error_correction' | 'sentence_transform' | 'free_write'
  question: string
  options?: string[]
  answer?: string
  explanation?: string
  hint?: string
}

const LEVEL_COLORS: Record<string, string> = {
  a1: '#16a34a', a2: '#0891b2', b1: '#2D6BE4', b2: '#7C3AED', c1: '#d97706', c2: '#E85D26'
}

export default function GrammarTVPage({ params }: { params: Promise<{ level: string; slug: string }> }) {
  const { level, slug } = use(params)
  const accent = LEVEL_COLORS[level] ?? '#2D6BE4'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [questions, setQuestions] = useState<Question[]>([])
  const [topicTitle, setTopicTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: t } = await supabase
        .from('grammar_topics')
        .select('id, title')
        .eq('slug', slug)
        .eq('level', level)
        .single()

      if (t) {
        setTopicTitle(t.title)
        const { data: q } = await supabase
          .from('grammar_questions')
          .select('*')
          .eq('topic_id', t.id)
          .neq('type', 'free_write')
          .order('order_index')
        setQuestions(q ?? [])
      }
      setLoading(false)
    }
    load()
  }, [slug, level])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (!showAnswer) {
          setShowAnswer(true)
        } else {
          if (current + 1 >= questions.length) {
            setFinished(true)
          } else {
            setCurrent(c => c + 1)
            setShowAnswer(false)
          }
        }
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (showAnswer) {
          setShowAnswer(false)
        } else if (current > 0) {
          setCurrent(c => c - 1)
          setShowAnswer(false)
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showAnswer, current, questions.length])

  if (loading) return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontFamily: 'sans-serif' }}>
      Loading…
    </div>
  )

  if (questions.length === 0) return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', fontFamily: 'sans-serif' }}>
      <p style={{ color: 'white', fontSize: '24px' }}>No questions available yet.</p>
      <Link href={`/esl-resources/grammar/${level}/${slug}`} style={{ color: accent, fontSize: '16px' }}>← Back to lesson</Link>
    </div>
  )

  if (finished) return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ fontSize: '80px' }}>🎉</div>
      <h1 style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', margin: 0, textAlign: 'center' }}>All done!</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px', margin: 0 }}>{questions.length} questions completed</p>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <button onClick={() => { setCurrent(0); setShowAnswer(false); setFinished(false) }}
          style={{ background: accent, color: 'white', border: 'none', cursor: 'pointer', padding: '16px 36px', borderRadius: '14px', fontSize: '18px', fontWeight: 'bold' }}>
          Start again
        </button>
        <Link href={`/esl-resources/grammar/${level}/${slug}`} style={{ textDecoration: 'none' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '16px 36px', borderRadius: '14px', fontSize: '18px', fontWeight: 'bold' }}>
            Back to lesson
          </div>
        </Link>
      </div>
    </div>
  )

  const q = questions[current]

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      {/* TOP BAR */}
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ background: accent, color: 'white', fontSize: '13px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '8px' }}>
            {level.toUpperCase()}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>{topicTitle}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            {current + 1} / {questions.length}
          </span>
          <Link href={`/esl-resources/grammar/${level}/${slug}`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>
            ✕ Exit
          </Link>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
        <div style={{ height: '4px', background: accent, width: `${((current + (showAnswer ? 1 : 0)) / questions.length) * 100}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 60px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

        {/* QUESTION TYPE BADGE */}
        <span style={{ background: `${accent}25`, color: accent, fontSize: '13px', fontWeight: 'bold', padding: '6px 16px', borderRadius: '20px', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {q.type.replace('_', ' ')}
        </span>

        {/* QUESTION */}
        <h2 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.5', margin: '0 0 48px', maxWidth: '900px' }}>
          {q.question}
        </h2>

        {/* OPTIONS (for multiple choice) */}
        {q.type === 'multiple_choice' && q.options && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '800px', marginBottom: '48px' }}>
            {q.options.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.07)'
              let border = 'rgba(255,255,255,0.15)'
              let color = 'white'
              if (showAnswer) {
                if (opt === q.answer) { bg = 'rgba(34,197,94,0.2)'; border = '#22c55e'; color = '#86efac' }
                else { bg = 'rgba(255,255,255,0.03)'; border = 'rgba(255,255,255,0.06)'; color = 'rgba(255,255,255,0.3)' }
              }
              return (
                <div key={i} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
                  <span style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${showAnswer && opt === q.answer ? '#22c55e' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: showAnswer && opt === q.answer ? '#22c55e' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                    {showAnswer && opt === q.answer ? '✓' : String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ fontSize: '20px', color, fontWeight: showAnswer && opt === q.answer ? 'bold' : 'normal' }}>{opt}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* ANSWER REVEAL (for non-multiple-choice) */}
        {q.type !== 'multiple_choice' && (
          <div style={{ width: '100%', maxWidth: '800px', marginBottom: '48px' }}>
            {showAnswer ? (
              <div style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e', borderRadius: '16px', padding: '28px 32px', textAlign: 'center' }}>
                <p style={{ color: '#86efac', fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>✓ Answer</p>
                <p style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{q.answer}</p>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '16px', padding: '28px 32px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px', margin: 0 }}>Press Space or → to reveal answer</p>
              </div>
            )}
          </div>
        )}

        {/* EXPLANATION */}
        {showAnswer && q.explanation && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px 24px', maxWidth: '800px', width: '100%', marginBottom: '32px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>{q.explanation}</p>
          </div>
        )}

        {/* HINT */}
        {!showAnswer && q.hint && (
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px', fontStyle: 'italic', margin: '0 0 32px' }}>💡 {q.hint}</p>
        )}

      </div>

      {/* BOTTOM CONTROLS */}
      <div style={{ background: '#1a1a2e', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => { if (showAnswer) { setShowAnswer(false) } else if (current > 0) { setCurrent(c => c - 1); setShowAnswer(false) } }}
          disabled={current === 0 && !showAnswer}
          style={{ background: 'rgba(255,255,255,0.08)', color: current === 0 && !showAnswer ? 'rgba(255,255,255,0.2)' : 'white', border: 'none', cursor: current === 0 && !showAnswer ? 'default' : 'pointer', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold' }}>
          ← Back
        </button>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>
          Space / → to advance · ← to go back
        </p>

        <button
          onClick={() => {
            if (!showAnswer) { setShowAnswer(true) }
            else if (current + 1 >= questions.length) { setFinished(true) }
            else { setCurrent(c => c + 1); setShowAnswer(false) }
          }}
          style={{ background: accent, color: 'white', border: 'none', cursor: 'pointer', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold' }}>
          {!showAnswer ? 'Show answer →' : current + 1 >= questions.length ? 'Finish ✓' : 'Next →'}
        </button>
      </div>

    </div>
  )
}
