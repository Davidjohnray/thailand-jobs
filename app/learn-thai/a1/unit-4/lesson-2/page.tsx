'use client'
import { useState } from 'react'
import Link from 'next/link'

const PARTICLES = [
  {
    particle: 'ครับ', roman: 'khrap', gender: 'Male', color: '#3b82f6',
    emoji: '👨',
    when: 'Used by male speakers at the end of sentences to be polite, respectful, or formal.',
    tone: 'Mid tone — said clearly but not stressed.',
    uses: [
      { thai: 'สวัสดีครับ', roman: 'sawasdee khrap', english: 'Hello (male)', example: 'Meeting someone' },
      { thai: 'ขอบคุณครับ', roman: 'khob khun khrap', english: 'Thank you (male)', example: 'Expressing thanks' },
      { thai: 'ใช่ครับ', roman: 'chai khrap', english: 'Yes (male)', example: 'Agreeing' },
      { thai: 'ไม่ครับ', roman: 'mai khrap', english: 'No (male)', example: 'Disagreeing politely' },
      { thai: 'ได้ครับ', roman: 'dai khrap', english: 'Yes I can / OK (male)', example: 'Accepting a request' },
    ],
    tip: 'As a male teacher, you\'ll use ครับ dozens of times every day. It softens commands, confirms understanding, and shows respect. When in doubt — add ครับ.',
  },
  {
    particle: 'ค่ะ', roman: 'kha', gender: 'Female (statement)', color: '#ec4899',
    emoji: '👩',
    when: 'Used by female speakers at the end of statements and questions to be polite. Has a falling tone.',
    tone: 'Falling tone — ค่ะ goes down at the end.',
    uses: [
      { thai: 'สวัสดีค่ะ', roman: 'sawasdee kha', english: 'Hello (female)', example: 'Meeting someone' },
      { thai: 'ขอบคุณค่ะ', roman: 'khob khun kha', english: 'Thank you (female)', example: 'Expressing thanks' },
      { thai: 'ใช่ค่ะ', roman: 'chai kha', english: 'Yes (female)', example: 'Agreeing' },
      { thai: 'ได้ค่ะ', roman: 'dai kha', english: 'Yes I can / OK (female)', example: 'Accepting a request' },
      { thai: 'ไม่เป็นไรค่ะ', roman: 'mai pen rai kha', english: 'No problem (female)', example: 'Reassuring someone' },
    ],
    tip: 'Female teachers will use ค่ะ constantly. Note: ค่ะ has a falling tone. คะ (no tone mark) is used for questions — same sound, different spelling.',
  },
  {
    particle: 'คะ', roman: 'kha', gender: 'Female (question)', color: '#f97316',
    emoji: '🙋‍♀️',
    when: 'Used by female speakers at the end of YES/NO questions. Rising tone — the question version of ค่ะ.',
    tone: 'Rising tone — คะ goes up at the end, signalling a question.',
    uses: [
      { thai: 'สบายดีไหมคะ', roman: 'sabaai dii mai kha', english: 'How are you? (female)', example: 'Asking how someone is' },
      { thai: 'อร่อยไหมคะ', roman: 'aroy mai kha', english: 'Is it delicious? (female)', example: 'Asking about food' },
      { thai: 'ไปไหนคะ', roman: 'pai nai kha', english: 'Where are you going? (female)', example: 'Casual greeting question' },
      { thai: 'เข้าใจไหมคะ', roman: 'khao jai mai kha', english: 'Do you understand? (female)', example: 'Checking comprehension in class' },
    ],
    tip: 'The difference between ค่ะ and คะ: ค่ะ has mai ek (falling tone) for statements. คะ has no tone mark (rising) for questions. This is important — getting it wrong sounds unnatural.',
  },
  {
    particle: 'นะ', roman: 'na', gender: 'Both — softener', color: '#22c55e',
    emoji: '😊',
    when: 'Used by both male and female speakers. Softens a statement, adds warmth, seeks agreement, or makes a request gentler.',
    tone: 'Mid tone — relaxed and friendly.',
    uses: [
      { thai: 'ขอบคุณนะ', roman: 'khob khun na', english: 'Thanks (warm/casual)', example: 'Casual thanks between friends' },
      { thai: 'ไปก่อนนะ', roman: 'pai gon na', english: 'I\'m heading off now', example: 'Casual goodbye' },
      { thai: 'เข้าใจนะ', roman: 'khao jai na', english: 'You understand, right?', example: 'Checking with students' },
      { thai: 'ระวังนะ', roman: 'rawang na', english: 'Be careful, OK?', example: 'Caring reminder' },
    ],
    tip: 'นะ is the friendliest particle. Adding นะ to almost anything makes it warmer and less direct. Thai teachers use it constantly with students — it\'s caring without being soft.',
  },
  {
    particle: 'ครับผม', roman: 'khrap phom', gender: 'Male — very polite', color: '#6366f1',
    emoji: '🙇‍♂️',
    when: 'Very polite/humble form used by male speakers in formal situations — with bosses, elders, or when being especially respectful.',
    tone: 'Mid tones throughout.',
    uses: [
      { thai: 'ครับผม', roman: 'khrap phom', english: 'Yes sir/ma\'am (very formal)', example: 'Responding to a senior colleague' },
      { thai: 'เข้าใจครับผม', roman: 'khao jai khrap phom', english: 'I understand (very formal)', example: 'Formal understanding' },
    ],
    tip: 'You don\'t need this every day — but knowing it shows respect. In most teaching situations, ครับ alone is perfectly polite.',
  },
]

const QUIZ_Q = [
  { q: 'A male teacher says goodbye. Which particle does he use?', correct: 'ครับ', options: ['ค่ะ', 'ครับ', 'คะ', 'นะ'] },
  { q: 'A female teacher ends a statement. Which particle?', correct: 'ค่ะ', options: ['คะ', 'ครับ', 'ค่ะ', 'นะ'] },
  { q: 'A female teacher asks a yes/no question. Which particle?', correct: 'คะ', options: ['ค่ะ', 'ครับ', 'นะ', 'คะ'] },
  { q: 'Which particle adds warmth and is used by both male and female?', correct: 'นะ', options: ['ครับ', 'ค่ะ', 'นะ', 'คะ'] },
  { q: 'สวัสดีครับ is said by...?', correct: 'A male speaker', options: ['A female speaker', 'A male speaker', 'Either gender', 'Only elders'] },
  { q: 'What tone does ค่ะ have?', correct: 'Falling tone', options: ['Mid tone', 'Rising tone', 'Falling tone', 'High tone'] },
  { q: 'What tone does คะ (question particle) have?', correct: 'Rising tone', options: ['Mid tone', 'Rising tone', 'Falling tone', 'Low tone'] },
  { q: 'ขอบคุณนะ sounds...?', correct: 'Warm and casual', options: ['Very formal', 'Rude', 'Warm and casual', 'Confused'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit4Lesson2() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const card = PARTICLES[cardIndex]
  const pct = Math.round((correct / QUIZ_Q.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === QUIZ_Q[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
  }

  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ_Q.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #831843, #db2777)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 4 · Lesson 2 — Polite Particles</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Learn</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(219,39,119,0.05)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(219,39,119,0.1)' }}>
          <span style={{ color: '#db2777', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {PARTICLES.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#db2777', borderRadius: '10px', width: `${((cardIndex + 1) / PARTICLES.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: card.color, fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>{card.gender}</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #db2777' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🙏 Polite Particles — Why They Matter</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Polite particles are small words added to the end of Thai sentences. They don't change the meaning — they change the <strong>politeness level and social relationship</strong>. Using them correctly is one of the fastest ways to sound natural and respectful.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { p: 'ครับ', desc: 'Male — all situations', color: '#3b82f6' },
                  { p: 'ค่ะ', desc: 'Female — statements', color: '#ec4899' },
                  { p: 'คะ', desc: 'Female — questions', color: '#f97316' },
                  { p: 'นะ', desc: 'Both — friendly softener', color: '#22c55e' },
                ].map(p => (
                  <div key={p.p} style={{ background: p.color + '10', borderRadius: '10px', padding: '12px 16px', border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => speak(p.p)} style={{ fontSize: '28px', fontWeight: '900', color: p.color, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>{p.p}</button>
                    <div style={{ color: '#374151', fontSize: '13px', fontWeight: '600' }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: `linear-gradient(135deg, #831843, ${card.color})`, padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{card.emoji}</div>
              <div style={{ fontSize: '80px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px' }}>{card.particle}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 16px', borderRadius: '20px', color: 'white', fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>{card.gender}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.particle)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '8px 22px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>🔊 Hear it</button>
              </div>
            </div>

            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: card.color + '10', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${card.color}25` }}>
                <div style={{ color: card.color, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>📖 When to use</div>
                <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 8px' }}>{card.when}</p>
                <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '8px 12px', display: 'inline-block' }}>
                  <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: '700' }}>🎵 Tone: </span>
                  <span style={{ color: '#374151', fontSize: '13px' }}>{card.tone}</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Examples in use</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {card.uses.map((use, i) => (
                    <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '22px', fontWeight: '900', color: card.color, marginBottom: '3px' }}>{use.thai}</div>
                        <div style={{ color: '#374151', fontWeight: '600', fontSize: '14px' }}>{use.roman}</div>
                        <div style={{ color: '#9ca3af', fontSize: '13px' }}>{use.english} · <em>{use.example}</em></div>
                      </div>
                      <button onClick={() => speak(use.thai)} style={{ background: card.color + '15', color: card.color, border: `1px solid ${card.color}30`, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>🔊</button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Teacher tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>All Particles</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {PARTICLES.map((p, i) => (
                <button key={i} onClick={() => { setCardIndex(i); speak(p.particle) }}
                  style={{ background: i === cardIndex ? p.color : '#f9fafb', color: i === cardIndex ? 'white' : '#374151', border: `2px solid ${i === cardIndex ? p.color : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 16px', fontSize: '22px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {p.particle}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < PARTICLES.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(PARTICLES[cardIndex + 1].particle) }}
                style={{ flex: 1, background: `linear-gradient(135deg, #831843, ${PARTICLES[cardIndex + 1].color})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {PARTICLES[cardIndex + 1].particle} →
              </button>
            ) : (
              <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                ✅ Take the Quiz →
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#db2777', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#db2777', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '19px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{QUIZ_Q[quizIndex].q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_Q[quizIndex].options.map(opt => {
                const isCorrect = opt === QUIZ_Q[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = '#fdf2f8'; border = '#db2777'; textColor = '#831843' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}><span style={{ color: textColor, fontWeight: '700', fontSize: '16px' }}>{opt}</span>{/[\u0e00-\u0e7f]/.test(opt) && <button onClick={(e) => { e.stopPropagation(); speak(opt) }} style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '13px' }}>🔊</button>}</div>
                    {selected && isCorrect && <span style={{ color: '#db2777', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#fdf2f8' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#fbcfe8' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#831843', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #831843, #db2777)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '🏆 Results →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#db2777' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#fdf2f8' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#fdf2f8', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #fbcfe8', textAlign: 'left' }}>
              <div style={{ color: '#831843', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You now know how to use ครับ ค่ะ คะ and นะ correctly. One more lesson in Unit 4 — essential phrases for daily life.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-4/lesson-3" style={{ display: 'block', background: 'linear-gradient(135deg, #831843, #db2777)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Useful Phrases →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
