'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

type Tab = 'learn' | 'practise' | 'teach'

type Explanation = {
  intro: string
  form_table?: { headers: string[]; rows: string[][] }
  examples: { sentence: string; note?: string }[]
  common_mistakes: { wrong: string; right: string; note?: string }[]
  learner_tips: string[]
  tip_box?: string
}

type Question = {
  id: string
  type: 'fill_blank' | 'multiple_choice' | 'error_correction' | 'sentence_transform' | 'free_write'
  question: string
  options?: string[]
  answer?: string
  explanation?: string
  hint?: string
}

type Topic = {
  id: string
  slug: string
  title: string
  level: string
  order_index: number
  short_desc: string
  explanation: Explanation | null
}

const LEVEL_COLORS: Record<string, string> = {
  a1: '#16a34a', a2: '#0891b2', b1: '#2D6BE4', b2: '#7C3AED', c1: '#d97706', c2: '#E85D26'
}
const LEVEL_LABELS: Record<string, string> = {
  a1: 'A1 Starter', a2: 'A2 Elementary', b1: 'B1 Pre-Intermediate',
  b2: 'B2 Intermediate', c1: 'C1 Upper-Intermediate', c2: 'C2 Advanced'
}

export default function GrammarTopicPage({ params }: { params: Promise<{ level: string; slug: string }> }) {
  const { level, slug } = use(params)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [tab, setTab] = useState<Tab>('learn')
  const [topic, setTopic] = useState<Topic | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [learnDone, setLearnDone] = useState(false)

  const [current, setCurrent] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [aiFeedback, setAiFeedback] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: t } = await supabase
        .from('grammar_topics')
        .select('*')
        .eq('slug', slug)
        .eq('level', level)
        .single()
      setTopic(t)

      if (t) {
        const { data: q } = await supabase
          .from('grammar_questions')
          .select('*')
          .eq('topic_id', t.id)
          .order('order_index')
        setQuestions(q ?? [])

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: prog } = await supabase
            .from('grammar_progress')
            .select('learn_completed')
            .eq('user_id', user.id)
            .eq('topic_id', t.id)
            .single()
          if (prog?.learn_completed) setLearnDone(true)
        }
      }
      setLoading(false)
    }
    load()
  }, [slug, level])

  async function markLearnComplete() {
    if (!topic) return
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('grammar_progress').upsert({
        user_id: user.id,
        topic_id: topic.id,
        learn_completed: true,
      }, { onConflict: 'user_id,topic_id' })
    }
    setLearnDone(true)
  }

  async function handleSubmit() {
    if (submitted) return
    const q = questions[current]
    setSubmitted(true)
    if (q.type === 'free_write') {
      setAiLoading(true)
      try {
        const res = await fetch('/api/grammar-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topic?.title, level: topic?.level, question: q.question, answer: userAnswer }),
        })
        const data = await res.json()
        setAiFeedback(data.feedback)
        setScore(s => s + (data.score >= 70 ? 1 : 0))
      } catch {
        setAiFeedback('Could not load AI feedback right now.')
      }
      setAiLoading(false)
    } else {
      const normalise = (s: string) => s.trim().toLowerCase().replace(/[.!?,;:'"]+$/g, '').trim()
const isCorrect = normalise(userAnswer) === normalise(q.answer ?? '')
      setCorrect(isCorrect)
      if (isCorrect) setScore(s => s + 1)
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setUserAnswer('')
      setSubmitted(false)
      setCorrect(null)
      setAiFeedback('')
    }
  }

  const accent = LEVEL_COLORS[level] ?? '#2D6BE4'

  if (loading) return (
    <main style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '15px' }}>
      Loading…
    </main>
  )

  if (!topic) return (
    <main style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <p style={{ fontSize: '18px', color: '#444' }}>Topic not found.</p>
      <Link href={`/esl-resources/grammar/${level}`} style={{ color: accent, fontWeight: 'bold', textDecoration: 'none' }}>← Back to {level.toUpperCase()}</Link>
    </main>
  )

  const exp = topic.explanation

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: '#1a1a2e', padding: '24px 24px 0', color: 'white' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href={`/esl-resources/grammar/${level}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '12px' }}>
            ← {LEVEL_LABELS[level] ?? level.toUpperCase()}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div>
              <span style={{ background: accent, color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '6px', marginBottom: '8px', display: 'inline-block' }}>
                {level.toUpperCase()}
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 4px', letterSpacing: '-0.5px' }}>{topic.title}</h1>
              {topic.short_desc && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>{topic.short_desc}</p>}
            </div>
            {learnDone && (
              <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '13px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '8px' }}>✓ Learn complete</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['learn', 'practise', 'teach'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#1a1a2e' : 'rgba(255,255,255,0.55)',
                border: 'none', cursor: 'pointer', padding: '10px 22px',
                borderRadius: '10px 10px 0 0', fontSize: '14px', fontWeight: 'bold',
              }}>
                {t === 'learn' ? '📖 Learn' : t === 'practise' ? '✍️ Practise' : '📺 Teach'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '36px 24px' }}>

        {tab === 'learn' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {!exp ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔧</div>
                <p style={{ fontSize: '16px' }}>Explanation coming soon for this topic.</p>
              </div>
            ) : (
              <>
                <div style={{ background: 'white', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 14px' }}>What is it?</h2>
                  <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.8', margin: 0 }}>{exp.intro}</p>
                </div>

                {exp.form_table && (
                  <div style={{ background: 'white', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Form</h2>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                          <tr>{exp.form_table.headers.map((h: string) => (
                            <th key={h} style={{ background: accent, color: 'white', padding: '10px 14px', textAlign: 'left', fontWeight: 'bold', fontSize: '13px' }}>{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {exp.form_table.rows.map((row: string[], i: number) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? '#f9fafb' : 'white' }}>
                              {row.map((cell: string, j: number) => (
                                <td key={j} style={{ padding: '10px 14px', color: '#444', borderBottom: '1px solid #f0f0f0' }}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div style={{ background: 'white', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Examples</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {exp.examples.map((ex: { sentence: string; note?: string }, i: number) => (
                      <div key={i} style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '16px' }}>
                        <p style={{ fontSize: '15px', color: '#1a1a2e', fontWeight: 'bold', margin: '0 0 2px', fontStyle: 'italic' }}>{ex.sentence}</p>
                        {ex.note && <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{ex.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Common mistakes</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {exp.common_mistakes.map((m: { wrong: string; right: string; note?: string }, i: number) => (
                      <div key={i}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 14px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#ef4444', margin: '0 0 4px', textTransform: 'uppercase' }}>✗ Wrong</p>
                            <p style={{ fontSize: '14px', color: '#7f1d1d', margin: 0, fontStyle: 'italic' }}>{m.wrong}</p>
                          </div>
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 14px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#16a34a', margin: '0 0 4px', textTransform: 'uppercase' }}>✓ Correct</p>
                            <p style={{ fontSize: '14px', color: '#14532d', margin: 0, fontStyle: 'italic' }}>{m.right}</p>
                          </div>
                        </div>
                        {m.note && <p style={{ fontSize: '13px', color: '#888', margin: '6px 0 0' }}>{m.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {exp.learner_tips && exp.learner_tips.length > 0 && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '16px', padding: '28px 32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', margin: '0 0 4px' }}>💡 Common learner mistakes</h2>
                    <p style={{ fontSize: '13px', color: '#a16207', margin: '0 0 14px' }}>Mistakes English learners commonly make with this grammar point</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {exp.learner_tips.map((tip: string, i: number) => (
                        <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14px', color: '#78350f', lineHeight: '1.6' }}>
                          <span style={{ flexShrink: 0, marginTop: '2px' }}>→</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.tip_box && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '20px 28px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>💡</span>
                    <p style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.7', margin: 0 }}>{exp.tip_box}</p>
                  </div>
                )}

                <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                  {learnDone ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <span style={{ background: '#dcfce7', color: '#16a34a', fontWeight: 'bold', fontSize: '14px', padding: '10px 24px', borderRadius: '10px' }}>✓ Learn section complete</span>
                      <button onClick={() => setTab('practise')} style={{ background: accent, color: 'white', border: 'none', cursor: 'pointer', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold' }}>
                        Start practising →
                      </button>
                    </div>
                  ) : (
                    <button onClick={markLearnComplete} style={{ background: accent, color: 'white', border: 'none', cursor: 'pointer', padding: '14px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold' }}>
                      Mark as learned ✓
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'practise' && (
          <div>
            {questions.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔧</div>
                <p style={{ fontSize: '16px' }}>Practice questions coming soon.</p>
              </div>
            ) : finished ? (
              <div style={{ background: 'white', borderRadius: '20px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>{score / questions.length >= 0.8 ? '🎉' : score / questions.length >= 0.5 ? '👍' : '📚'}</div>
                <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{score} / {questions.length} correct</h2>
                <p style={{ color: '#888', fontSize: '15px', margin: '0 0 28px' }}>
                  {score / questions.length >= 0.8 ? 'Excellent work!' : score / questions.length >= 0.5 ? 'Good effort — try again to improve.' : 'Review the Learn tab and try again.'}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => { setCurrent(0); setScore(0); setFinished(false); setSubmitted(false); setUserAnswer(''); setCorrect(null); setAiFeedback('') }}
                    style={{ background: accent, color: 'white', border: 'none', cursor: 'pointer', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                    Try again
                  </button>
                  <button onClick={() => setTab('learn')}
                    style={{ background: '#f3f4f6', color: '#444', border: 'none', cursor: 'pointer', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                    Review Learn tab
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>Question {current + 1} of {questions.length}</span>
                    <span style={{ fontSize: '13px', color: '#888' }}>{score} correct</span>
                  </div>
                  <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '6px' }}>
                    <div style={{ background: accent, height: '6px', borderRadius: '4px', width: `${(current / questions.length) * 100}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
                {(() => {
                  const q = questions[current]
                  return (
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: accent, background: `${accent}18`, padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                        {q.type.replace('_', ' ')}
                      </span>
                      <p style={{ fontSize: '17px', color: '#1a1a2e', lineHeight: '1.7', margin: '16px 0 20px', fontWeight: '500' }}>{q.question}</p>

                      {q.type === 'multiple_choice' && q.options ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {q.options.map((opt: string, i: number) => {
                            let bg = '#f9fafb', border = '#e5e7eb', color = '#444'
                            if (submitted) {
                              if (opt === q.answer) { bg = '#f0fdf4'; border = '#86efac'; color = '#166534' }
                              else if (opt === userAnswer && opt !== q.answer) { bg = '#fef2f2'; border = '#fca5a5'; color = '#991b1b' }
                            } else if (opt === userAnswer) { bg = '#eff6ff'; border = accent; color = '#1e40af' }
                            return (
                              <button key={i} disabled={submitted} onClick={() => setUserAnswer(opt)}
                                style={{ background: bg, border: `2px solid ${border}`, borderRadius: '10px', padding: '12px 16px', textAlign: 'left', cursor: submitted ? 'default' : 'pointer', fontSize: '14px', color, fontWeight: opt === userAnswer ? 'bold' : 'normal' }}>
                                <span style={{ marginRight: '10px', opacity: 0.4 }}>{String.fromCharCode(65 + i)}.</span>{opt}
                              </button>
                            )
                          })}
                        </div>
                      ) : q.type === 'free_write' ? (
                        <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)} disabled={submitted}
                          placeholder="Write your answer here…" rows={4}
                          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', color: '#1a1a2e', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                      ) : (
                        <input type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} disabled={submitted}
                          onKeyDown={e => e.key === 'Enter' && !submitted && userAnswer ? handleSubmit() : undefined}
                          placeholder="Type your answer…"
                          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `2px solid ${submitted ? (correct ? '#86efac' : '#fca5a5') : '#e5e7eb'}`, fontSize: '15px', color: '#1a1a2e', outline: 'none', boxSizing: 'border-box', background: submitted ? (correct ? '#f0fdf4' : '#fef2f2') : 'white' }} />
                      )}

                      {q.hint && !submitted && (
                        <p style={{ fontSize: '13px', color: '#888', margin: '10px 0 0', fontStyle: 'italic' }}>💡 {q.hint}</p>
                      )}

                      {submitted && (
                        <div style={{ marginTop: '16px' }}>
                          {q.type === 'free_write' ? (
                            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '16px 18px' }}>
                              {aiLoading
                                ? <p style={{ color: '#0369a1', fontSize: '14px', margin: 0 }}>Getting AI feedback…</p>
                                : <p style={{ color: '#0c4a6e', fontSize: '14px', lineHeight: '1.7', margin: 0 }}><strong>AI Feedback:</strong> {aiFeedback}</p>
                              }
                            </div>
                          ) : (
                            <div style={{ background: correct ? '#f0fdf4' : '#fef2f2', border: `1px solid ${correct ? '#86efac' : '#fca5a5'}`, borderRadius: '12px', padding: '14px 16px' }}>
                              <p style={{ fontWeight: 'bold', fontSize: '14px', color: correct ? '#166534' : '#991b1b', margin: '0 0 6px' }}>
                                {correct ? '✓ Correct!' : `✗ The answer is: ${q.answer}`}
                              </p>
                              {q.explanation && <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: '1.6' }}>{q.explanation}</p>}
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        {!submitted ? (
                          <button onClick={handleSubmit} disabled={!userAnswer}
                            style={{ background: userAnswer ? accent : '#e5e7eb', color: userAnswer ? 'white' : '#aaa', border: 'none', cursor: userAnswer ? 'pointer' : 'default', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                            Check answer
                          </button>
                        ) : (
                          <button onClick={handleNext}
                            style={{ background: accent, color: 'white', border: 'none', cursor: 'pointer', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                            {current + 1 >= questions.length ? 'See results →' : 'Next question →'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {tab === 'teach' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#1a1a2e', borderRadius: '20px', padding: '48px 40px', textAlign: 'center', color: 'white' }}>
              <span style={{ background: accent, color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '6px', marginBottom: '20px', display: 'inline-block' }}>
                {level.toUpperCase()} GRAMMAR
              </span>
              <h2 style={{ fontSize: '34px', fontWeight: 'bold', margin: '0 0 12px', letterSpacing: '-0.5px' }}>{topic.title}</h2>
              {topic.short_desc && <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', margin: 0 }}>{topic.short_desc}</p>}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>📋 Classroom activities</h3>
              {[
                { title: 'Concept check questions (CCQs)', desc: 'Ask students concept questions before drilling to check they understand the meaning, not just the form.' },
                { title: 'Drilling', desc: 'Choral drill → individual drill → substitution drill. Keep it short — 2 minutes maximum.' },
                { title: 'Controlled practice', desc: 'Use the Practise tab questions as a class activity — display on screen, students write answers, then reveal.' },
                { title: 'Freer practice', desc: 'Give students a speaking task that naturally requires this grammar point. Monitor and note errors for feedback.' },
              ].map((a, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ color: accent, fontWeight: 'bold', flexShrink: 0, marginTop: '2px' }}>→</span>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a1a2e', margin: '0 0 4px' }}>{a.title}</p>
                    <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' }}>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {exp && exp.examples.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 6px' }}>💬 Sample CCQs</h3>
                <p style={{ fontSize: '13px', color: '#888', margin: '0 0 16px' }}>Ask these to check understanding before moving to practice</p>
                {exp.examples.slice(0, 2).map((ex: { sentence: string }, i: number) => (
                  <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px 16px', marginBottom: '10px' }}>
                    <p style={{ fontStyle: 'italic', fontSize: '14px', color: '#1a1a2e', margin: '0 0 8px', fontWeight: 'bold' }}>&ldquo;{ex.sentence}&rdquo;</p>
                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>→ Is this happening now or regularly? · Is it positive or negative? · Who is doing the action?</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #2D6BE4)', borderRadius: '16px', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '17px', fontWeight: 'bold', margin: '0 0 6px' }}>📺 TV / Projector mode</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', margin: 0 }}>Full-screen display — practice questions one at a time for the whole class</p>
              </div>
              <Link href={`/esl-resources/grammar/${level}/${slug}/tv`} style={{ textDecoration: 'none' }}>
                <span style={{ background: 'white', color: '#7C3AED', fontWeight: 'bold', fontSize: '14px', padding: '12px 22px', borderRadius: '10px', display: 'inline-block' }}>
                  Open TV mode →
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
