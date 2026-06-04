'use client'
import { useState } from 'react'
import Link from 'next/link'

const MID_TONE_RULES = [
  {
    rule: 'Mid Class + No Tone Mark + Live Syllable',
    result: 'Mid Tone',
    color: '#6b7280',
    toneName: 'Mid',
    explanation: 'A live syllable ends in a long vowel, or the consonants ม น ง ย ว ล. With no tone mark, mid class consonants produce a flat, steady mid tone.',
    examples: [
      { thai: 'กา', roman: 'gaa', english: 'crow', breakdown: 'ก (mid) + า (long vowel) = mid tone' },
      { thai: 'จาน', roman: 'jaan', english: 'plate', breakdown: 'จ (mid) + า + น (live ending) = mid tone' },
      { thai: 'ตาม', roman: 'taam', english: 'to follow', breakdown: 'ต (mid) + า + ม (live ending) = mid tone' },
    ],
  },
  {
    rule: 'Mid Class + No Tone Mark + Dead Syllable (short vowel)',
    result: 'Low Tone',
    color: '#3b82f6',
    toneName: 'Low',
    explanation: 'A dead syllable ends in a short vowel with no final consonant, or ends in ก ด ต บ (stop consonants). With no tone mark, mid class + dead syllable = low tone.',
    examples: [
      { thai: 'กะ', roman: 'ga', english: 'portion/to cut', breakdown: 'ก (mid) + short vowel ะ (dead) = low tone' },
      { thai: 'จะ', roman: 'ja', english: 'will (future)', breakdown: 'จ (mid) + short vowel ะ (dead) = low tone' },
      { thai: 'บาก', roman: 'baak', english: 'to engrave', breakdown: 'บ (mid) + า + ก (stop = dead) = low tone' },
    ],
  },
  {
    rule: 'Mid Class + Mai Ek (◌่)',
    result: 'Low Tone',
    color: '#3b82f6',
    toneName: 'Low',
    explanation: 'Adding mai ek to a mid class consonant always produces a low tone, regardless of whether the syllable is live or dead.',
    examples: [
      { thai: 'ก่า', roman: 'gaa', english: '(particle)', breakdown: 'ก (mid) + ่ (mai ek) = low tone' },
      { thai: 'จ่าย', roman: 'jaai', english: 'to pay', breakdown: 'จ (mid) + ่ = low tone' },
      { thai: 'ต่อ', roman: 'too', english: 'to connect/next', breakdown: 'ต (mid) + ่ = low tone' },
    ],
  },
  {
    rule: 'Mid Class + Mai Tho (◌้)',
    result: 'Falling Tone',
    color: '#ef4444',
    toneName: 'Falling',
    explanation: 'Adding mai tho to a mid class consonant always produces a falling tone — starts high then drops down.',
    examples: [
      { thai: 'ก้า', roman: 'gaa', english: '(archaic)', breakdown: 'ก (mid) + ้ (mai tho) = falling tone' },
      { thai: 'ด้าน', roman: 'daan', english: 'side/aspect', breakdown: 'ด (mid) + ้ = falling tone' },
      { thai: 'จ้าง', roman: 'jaang', english: 'to hire', breakdown: 'จ (mid) + ้ = falling tone' },
    ],
  },
  {
    rule: 'Mid Class + Mai Tri (◌๊)',
    result: 'High Tone',
    color: '#f59e0b',
    toneName: 'High',
    explanation: 'Adding mai tri to a mid class consonant produces a high tone. This mark is relatively rare — used in a small set of words.',
    examples: [
      { thai: 'โต๊ะ', roman: 'to', english: 'table', breakdown: 'ต (mid) + ๊ (mai tri) = high tone' },
      { thai: 'เก๊', roman: 'gee', english: 'fake/counterfeit', breakdown: 'ก (mid) + ๊ = high tone' },
      { thai: 'แก๊ส', roman: 'gaes', english: 'gas', breakdown: 'ก (mid) + ๊ = high tone' },
    ],
  },
  {
    rule: 'Mid Class + Mai Jattawa (◌๋)',
    result: 'Rising Tone',
    color: '#22c55e',
    toneName: 'Rising',
    explanation: 'Adding mai jattawa to a mid class consonant produces a rising tone. This is the rarest tone mark — you will see it occasionally in informal writing.',
    examples: [
      { thai: 'เน๋อ', roman: 'noe', english: '(casual particle)', breakdown: 'น (mid) + ๋ (mai jattawa) = rising tone' },
      { thai: 'ก๋วยเตี๋ยว', roman: 'guay tiao', english: 'noodles', breakdown: 'ก + ๋ = rising tone' },
      { thai: 'เอ๋', roman: 'ee', english: '(exclamation)', breakdown: 'อ (mid) + ๋ = rising tone' },
    ],
  },
]

const QUIZ_Q = [
  { q: 'Mid class consonant + long vowel + no tone mark = ?', correct: 'Mid tone', options: ['Low tone', 'Mid tone', 'Falling tone', 'High tone'] },
  { q: 'Mid class + Mai Ek (◌่) = ?', correct: 'Low tone', options: ['Falling tone', 'Low tone', 'High tone', 'Mid tone'] },
  { q: 'Mid class + Mai Tho (◌้) = ?', correct: 'Falling tone', options: ['Low tone', 'Rising tone', 'Falling tone', 'High tone'] },
  { q: 'Mid class + dead syllable (short vowel) + no tone mark = ?', correct: 'Low tone', options: ['Mid tone', 'Low tone', 'High tone', 'Falling tone'] },
  { q: 'What tone does จ่าย (to pay) use?', correct: 'Low tone', options: ['Mid tone', 'Falling tone', 'Low tone', 'High tone'] },
  { q: 'Mid class + Mai Tri (◌๊) = ?', correct: 'High tone', options: ['Rising tone', 'Falling tone', 'Mid tone', 'High tone'] },
  { q: 'What makes a syllable "dead"?', correct: 'Ends in a stop consonant (ก ด ต บ) or short vowel', options: ['Ends in ม น ง', 'Has a tone mark', 'Ends in a stop consonant (ก ด ต บ) or short vowel', 'Has a long vowel'] },
  { q: 'What tone does โต๊ะ (table) use?', correct: 'High tone', options: ['Mid tone', 'Falling tone', 'High tone', 'Rising tone'] },
]

const TONE_COLORS: Record<string, string> = {
  'Mid': '#6b7280', 'Low': '#3b82f6', 'Falling': '#ef4444', 'High': '#f59e0b', 'Rising': '#22c55e'
}

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit3Lesson2() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [ruleIndex, setRuleIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const rule = MID_TONE_RULES[ruleIndex]
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
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 3 · Lesson 2 — Tone Rules: Mid Class</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setRuleIndex(0) }} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Rules</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(79,70,229,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(79,70,229,0.1)' }}>
          <span style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{ruleIndex + 1} / {MID_TONE_RULES.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#6366f1', borderRadius: '10px', width: `${((ruleIndex + 1) / MID_TONE_RULES.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: rule.color, fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>→ {rule.toneName} Tone</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {ruleIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #6366f1' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>📊 Mid Class Tone Rules</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Mid class consonants follow the <strong>simplest and most regular tone rules</strong> in Thai. Once you learn these 6 rules you can predict the tone of any mid class syllable. The rules depend on two things: whether the syllable is <strong>live or dead</strong>, and which <strong>tone mark</strong> is used.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '12px 16px', border: '1px solid #86efac' }}>
                  <div style={{ color: '#15803d', fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>✅ Live Syllable</div>
                  <div style={{ color: '#374151', fontSize: '13px', lineHeight: '1.5' }}>Ends in a long vowel OR ends in ม น ง ย ว ล (sonorant consonants)</div>
                </div>
                <div style={{ background: '#fef2f2', borderRadius: '10px', padding: '12px 16px', border: '1px solid #fca5a5' }}>
                  <div style={{ color: '#dc2626', fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>💀 Dead Syllable</div>
                  <div style={{ color: '#374151', fontSize: '13px', lineHeight: '1.5' }}>Ends in a short vowel with no final consonant, OR ends in ก ด ต บ (stop consonants)</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick reference table */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Mid Class — All 6 Rules at a Glance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MID_TONE_RULES.map((r, i) => (
                <button key={i} onClick={() => setRuleIndex(i)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', border: `2px solid ${i === ruleIndex ? r.color : '#e5e7eb'}`, background: i === ruleIndex ? r.color + '10' : '#f9fafb', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ background: r.color, color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: '13px', color: '#374151', fontWeight: '600' }}>{r.rule}</div>
                  <div style={{ background: r.color, color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>{r.toneName}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Current rule card */}
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: `linear-gradient(135deg, #1e1b4b, ${rule.color})`, padding: '28px 32px' }}>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '6px 14px', marginBottom: '12px' }}>
                <span style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>Rule {ruleIndex + 1} of {MID_TONE_RULES.length}</span>
              </div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '900', margin: '0 0 12px', lineHeight: '1.3' }}>{rule.rule}</h3>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '30px', padding: '8px 20px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>Result:</span>
                <span style={{ color: 'white', fontSize: '20px', fontWeight: '900' }}>{rule.result}</span>
              </div>
            </div>
            <div style={{ padding: '24px 32px' }}>
              <div style={{ background: rule.color + '10', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', border: `1px solid ${rule.color}30` }}>
                <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{rule.explanation}</p>
              </div>
              <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Examples</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rule.examples.map((ex, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f9fafb', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: rule.color, flexShrink: 0, width: '60px' }}>{ex.thai}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#374151', fontSize: '15px' }}>{ex.roman} — {ex.english}</div>
                      <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '2px' }}>{ex.breakdown}</div>
                    </div>
                    <button onClick={() => speak(ex.thai)} style={{ background: rule.color + '15', color: rule.color, border: `1px solid ${rule.color}30`, padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>🔊</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {ruleIndex > 0 && <button onClick={() => setRuleIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {ruleIndex + 1 < MID_TONE_RULES.length ? (
              <button onClick={() => setRuleIndex(prev => prev + 1)}
                style={{ flex: 1, background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next Rule →
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
            <span style={{ color: '#4f46e5', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#6366f1', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '19px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{QUIZ_Q[quizIndex].q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_Q[quizIndex].options.map(opt => {
                const isCorrect = opt === QUIZ_Q[quizIndex].correct
                const isSelected = opt === selected
                const toneColor = TONE_COLORS[opt.replace(' tone', '')] || '#374151'
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = toneColor + '15'; border = toneColor; textColor = toneColor }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ fontSize: '18px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '18px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#eef2ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#c7d2fe' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#4338ca', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '🏆 Results →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#6366f1' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#eef2ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#eef2ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #c7d2fe', textAlign: 'left' }}>
              <div style={{ color: '#4338ca', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You now know all 6 mid class tone rules. Next: High and Low class rules — completing your understanding of the entire Thai tone system.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-3/lesson-3" style={{ display: 'block', background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: High & Low Class Tone Rules →
              </Link>
              <button onClick={() => { setPhase('learn'); setRuleIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
