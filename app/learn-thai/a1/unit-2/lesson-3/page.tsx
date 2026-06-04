'use client'
import { useState } from 'react'
import Link from 'next/link'

const COMBINATIONS = [
  {
    vowel: 'เอีย', name: 'Sara Ia', roman: 'ia',
    sound: 'Starts with "ee" then glides into "a" — like saying "ee-a" quickly as one sound.',
    example: { thai: 'เบียร์', roman: 'bia', english: 'beer' },
    example2: { thai: 'เสีย', roman: 'sia', english: 'to lose / broken' },
    tip: 'เสีย (sia) is very useful — เสียเงิน (lose money), เสียใจ (sad), โทรศัพท์เสีย (phone is broken).',
    breakdown: ['เ — vowel marker (before)', 'อี — long "ii" sound', 'ย — glide to "a"'],
  },
  {
    vowel: 'เอือ', name: 'Sara Uea', roman: 'uea',
    sound: 'Starts with the "uue" sound then glides to "a" — a complex three-part glide unique to Thai.',
    example: { thai: 'เมือง', roman: 'mueang', english: 'city/town' },
    example2: { thai: 'เรื่อง', roman: 'rueang', english: 'matter/story' },
    tip: 'เมือง (mueang) appears in many city names — เชียงเมือง, กรุงเทพมหานคร. เรื่อง (rueang) means "about/matter" — เรื่องอะไร? (What is it about?).',
    breakdown: ['เ — vowel marker (before)', 'อือ — "uue" sound', 'อ — glide to "a"'],
  },
  {
    vowel: 'อัว', name: 'Sara Ua', roman: 'ua',
    sound: 'Starts with "oo" (as in book) then glides to "a" — like "ooa" said quickly.',
    example: { thai: 'หัว', roman: 'hua', english: 'head' },
    example2: { thai: 'ตัว', roman: 'tua', english: 'body/self/classifier' },
    tip: 'ตัว (tua) is incredibly versatile — it means body, self, and is also the classifier for animals and some objects. เขาตัวใหญ่ (he is big-bodied).',
    breakdown: ['อ — initial position', 'อ — "oo" sound', 'ว — glide to "a"'],
  },
  {
    vowel: 'ไอ / ใอ', name: 'Sara Mai / Sara Mai Muan', roman: 'ai',
    sound: 'Like the "i" in "hide" or "sky" — a diphthong gliding from "a" to "i".',
    example: { thai: 'ใจ', roman: 'jai', english: 'heart/mind' },
    example2: { thai: 'ไป', roman: 'pai', english: 'to go' },
    tip: 'ไป (pai) = to go — essential! ใจ (jai) = heart — แฝงใจ (kind-hearted). There are two spellings (ไ and ใ) but they sound identical — only 20 words use ใ.',
    breakdown: ['ไ or ใ — vowel marker (before)', 'อ — base consonant', 'Combined = "ai" sound'],
  },
  {
    vowel: 'อาย', name: 'Sara Aai', roman: 'aai',
    sound: 'Like ไอ but longer — "aa" gliding to "i". A long version of the "ai" sound.',
    example: { thai: 'สาย', roman: 'saai', english: 'late / string' },
    example2: { thai: 'ขาย', roman: 'khaai', english: 'to sell' },
    tip: 'ขาย (khaai) = to sell — you\'ll see this on every market stall. สาย (saai) = late — มาสาย (arrived late) is a very common phrase.',
    breakdown: ['อา — long "aa" vowel', 'ย — glide to "i"'],
  },
  {
    vowel: 'เอา', name: 'Sara Ao', roman: 'ao',
    sound: 'Like the "ow" in "how" or "cow" — gliding from "a" to "o".',
    example: { thai: 'เอา', roman: 'ao', english: 'to take/want' },
    example2: { thai: 'เมา', roman: 'mao', english: 'drunk' },
    tip: 'เอา (ao) = to take or want — เอาไหม? (Do you want some?) is one of the most useful everyday phrases. เมา (mao) = drunk — useful to know!',
    breakdown: ['เ — vowel marker (before)', 'อ — base consonant', 'า — glide to "o"'],
  },
  {
    vowel: 'อาว', name: 'Sara Aao', roman: 'aao',
    sound: 'Like เอา but longer — "aao" held slightly longer on the "aa" part.',
    example: { thai: 'ดาว', roman: 'daao', english: 'star' },
    example2: { thai: 'ยาว', roman: 'yaao', english: 'long' },
    tip: 'ดาว (daao) = star — ดาวจีน (Chinese star), ดาวฤกษ์ (fixed star). ยาว (yaao) = long — used for length, hair, time etc.',
    breakdown: ['อา — long "aa" vowel', 'ว — glide to "o"'],
  },
  {
    vowel: 'อิว', name: 'Sara Io', roman: 'io',
    sound: 'Starts with short "i" then glides to "o" — like "ee-o" said quickly.',
    example: { thai: 'เขียว', roman: 'khiao', english: 'green' },
    example2: { thai: 'ริ้ว', roman: 'rio', english: 'stripe/line' },
    tip: 'เขียว (khiao) = green — สีเขียว (green colour). A very common colour in Thailand — rice fields, temples, nature.',
    breakdown: ['อิ — short "i" vowel', 'ว — glide to "o"'],
  },
  {
    vowel: 'เอ็ว', name: 'Sara Eo', roman: 'eo',
    sound: 'Starts with "e" (as in bed) then glides to "o" — like "e-o" said as one syllable.',
    example: { thai: 'เก้าเอ้', roman: 'gao-ee', english: 'chair (Thai name)' },
    example2: { thai: 'เลว', roman: 'leo', english: 'bad/evil' },
    tip: 'เลว (leo) = bad or evil — คนเลว (bad person). This combination is less common but important to recognise.',
    breakdown: ['เ — vowel marker (before)', 'อ — base consonant', 'ว — glide to "o"'],
  },
  {
    vowel: 'แอว', name: 'Sara Aeo', roman: 'aeo',
    sound: 'Starts with "ae" (as in cat) then glides to "o" — a three-part sound unique to Thai.',
    example: { thai: 'แอว', roman: 'aeo', english: 'waist' },
    example2: { thai: 'แกว่ง', roman: 'gwaeng', english: 'to swing/sway' },
    tip: 'This combination is less common but appears in some body part vocabulary and movement words.',
    breakdown: ['แ — vowel marker (before)', 'อ — base consonant', 'ว — glide to "o"'],
  },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

function shuffleFour(correct: string, others: string[]): string[] {
  const picks = others.sort(() => Math.random() - 0.5).slice(0, 3)
  return [correct, ...picks].sort(() => Math.random() - 0.5)
}

const QUIZ_Q = COMBINATIONS.slice(0, 8).map(v => ({
  correct: v.roman, vowel: v.vowel, name: v.name,
  options: shuffleFour(v.roman, COMBINATIONS.map(x => x.roman).filter(x => x !== v.roman)),
}))

export default function Unit2Lesson3() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizQ] = useState(QUIZ_Q)

  const card = COMBINATIONS[cardIndex]
  const pct = Math.round((correct / quizQ.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === quizQ[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
    speak(COMBINATIONS.find(v => v.roman === quizQ[quizIndex].correct)?.example.thai || '')
  }

  const nextQ = () => {
    if (quizIndex + 1 >= quizQ.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #312e81, #6d28d9)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 2 · Lesson 3 — Vowel Combinations</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Learn</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(109,40,217,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(109,40,217,0.1)' }}>
          <span style={{ color: '#6d28d9', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {COMBINATIONS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#7c3aed', borderRadius: '10px', width: `${((cardIndex + 1) / COMBINATIONS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#6d28d9', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Vowel Combinations</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #7c3aed' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🎵 What are Vowel Combinations?</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Vowel combinations (also called diphthongs and triphthongs) are vowel sounds that glide from one position to another within a single syllable. Thai has many of these — they are made by combining the vowels you already know with the semi-vowels ย (y) and ว (w).
              </p>
              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontWeight: '800', fontSize: '13px', marginBottom: '8px' }}>💡 The key builders</div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', fontWeight: '900', color: '#7c3aed' }}>ย</div>
                    <div style={{ color: '#374151', fontSize: '13px', fontWeight: '700' }}>Yo (y)</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>glides to "i"</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', fontWeight: '900', color: '#7c3aed' }}>ว</div>
                    <div style={{ color: '#374151', fontSize: '13px', fontWeight: '700' }}>Wo (w)</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>glides to "o/w"</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>When ย or ว appear after a vowel, they create a gliding sound — the vowel starts at one point and smoothly moves to another.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #312e81, #6d28d9)', padding: '40px 32px', textAlign: 'center' }}>
              <span style={{ background: '#7c3aed', color: 'white', fontSize: '11px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', marginBottom: '16px' }}>Vowel Combination</span>
              <div style={{ fontSize: '72px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px', letterSpacing: '4px' }}>{card.vowel}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '8px' }}>{card.name} · /{card.roman}/</div>
              <button onClick={() => speak(card.example.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>🔊 Hear example</button>
            </div>

            <div style={{ padding: '28px 32px' }}>
              {/* Breakdown */}
              <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '2px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🔬 How it\'s built</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {card.breakdown.map((part, i) => (
                    <span key={i} style={{ background: '#ede9fe', color: '#5b21b6', fontSize: '13px', fontWeight: '700', padding: '6px 12px', borderRadius: '20px' }}>{part}</span>
                  ))}
                </div>
              </div>

              {/* Sound */}
              <div style={{ background: '#ecfeff', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '2px solid #a5f3fc' }}>
                <div style={{ color: '#0369a1', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>🎵 Sound</div>
                <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{card.sound}</p>
              </div>

              {/* Examples */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[card.example, card.example2].map((ex, i) => (
                  <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: '900', color: '#7c3aed' }}>{ex.thai}</div>
                      <button onClick={() => speak(ex.thai)} style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ede9fe', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>🔊</button>
                    </div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}>{ex.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{ex.english}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Key tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>All 10 Vowel Combinations</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COMBINATIONS.map((v, i) => (
                <button key={v.name} onClick={() => { setCardIndex(i); speak(v.example.thai) }}
                  style={{ background: i === cardIndex ? '#7c3aed' : '#f9fafb', color: i === cardIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === cardIndex ? '#7c3aed' : '#e5e7eb'}`, borderRadius: '10px', padding: '8px 12px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {v.vowel.split('/')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < COMBINATIONS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(COMBINATIONS[cardIndex + 1].example.thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #312e81, #6d28d9)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next ({COMBINATIONS[cardIndex + 1].vowel.split('/')[0].trim()}) →
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
            <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '14px' }}>Question {quizIndex + 1} of {quizQ.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#7c3aed', borderRadius: '10px', width: `${((quizIndex + 1) / quizQ.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What sound does this vowel combination make?</div>
              <div style={{ fontSize: '64px', fontWeight: '900', color: '#7c3aed', lineHeight: 1, marginBottom: '8px' }}>{quizQ[quizIndex].vowel}</div>
              <div style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '12px' }}>{quizQ[quizIndex].name}</div>
              <button onClick={() => speak(COMBINATIONS.find(v => v.roman === quizQ[quizIndex].correct)?.example.thai || '')}
                style={{ background: '#f5f3ff', color: '#7c3aed', border: '2px solid #ede9fe', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear example
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quizQ[quizIndex].options.map(opt => {
                const isCorrect = opt === quizQ[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (selected) {
                  if (isCorrect) { bg = '#f5f3ff'; border = '#7c3aed'; textColor = '#5b21b6' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '20px 12px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ color: textColor, fontWeight: '900', fontSize: '24px', fontFamily: 'monospace', marginBottom: '4px' }}>/{opt}/</div>
                    {selected && isCorrect && <div style={{ color: '#7c3aed', fontSize: '18px' }}>✓</div>}
                    {selected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div style={{ background: selected === quizQ[quizIndex].correct ? '#f5f3ff' : '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${selected === quizQ[quizIndex].correct ? '#ede9fe' : '#fca5a5'}` }}>
              {selected === quizQ[quizIndex].correct
                ? <div style={{ color: '#5b21b6', fontWeight: '700', fontSize: '15px' }}>✅ Correct! <span style={{ fontWeight: '400' }}>{quizQ[quizIndex].vowel} — {quizQ[quizIndex].name} — makes the /{quizQ[quizIndex].correct}/ sound.</span></div>
                : <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '15px' }}>❌ Not quite. <span style={{ fontWeight: '400' }}>The correct sound is <strong>/{quizQ[quizIndex].correct}/</strong> — {quizQ[quizIndex].name}.</span></div>
              }
            </div>
          )}
          {selected && (
            <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #312e81, #7c3aed)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {quizIndex + 1 >= quizQ.length ? '🏆 See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#7c3aed' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {quizQ.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#f5f3ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #ede9fe', textAlign: 'left' }}>
              <div style={{ color: '#5b21b6', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You now know all the core Thai vowel combinations. One lesson left in Unit 2 — Tone Marks. This is where everything starts to come together!</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-2/lesson-4" style={{ display: 'block', background: 'linear-gradient(135deg, #312e81, #7c3aed)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Tone Marks →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                🔄 Review Again
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
