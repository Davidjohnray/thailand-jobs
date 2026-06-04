'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const MID_CLASS = [
  {
    char: 'ก', name: 'Ko Kai', meaning: 'Chicken', roman: 'g/k',
    example: { thai: 'ไก่', roman: 'gai', english: 'chicken' },
    tone: 'mid', note: 'This is the very first letter of the Thai alphabet. It sounds like the "g" in "go" at the start of a word.',
    mnemonic: 'Think of a chicken (ไก่ gai) — ก looks like a chicken with its head turned.'
  },
  {
    char: 'จ', name: 'Jo Jan', meaning: 'Plate', roman: 'j',
    example: { thai: 'จาน', roman: 'jaan', english: 'plate' },
    tone: 'mid', note: 'Sounds like "j" in "jungle". Common at the start of words.',
    mnemonic: 'จ looks like a curved plate (จาน jaan).'
  },
  {
    char: 'ด', name: 'Do Dek', meaning: 'Child', roman: 'd',
    example: { thai: 'เด็ก', roman: 'dek', english: 'child/kid' },
    tone: 'mid', note: 'Sounds like "d" in "dog". Very common letter — เด็ก (dek) means child or kid.',
    mnemonic: 'ด looks like a small child sitting down.'
  },
  {
    char: 'ต', name: 'To Tao', meaning: 'Turtle', roman: 't',
    example: { thai: 'เต่า', roman: 'tao', english: 'turtle' },
    tone: 'mid', note: 'Sounds like "t" in "top" — unaspirated (no puff of air). Different from ท which has a puff.',
    mnemonic: 'ต looks like a turtle (เต่า tao) with its shell.'
  },
  {
    char: 'บ', name: 'Bo Baimai', meaning: 'Leaf', roman: 'b',
    example: { thai: 'ใบไม้', roman: 'bai mai', english: 'leaf' },
    tone: 'mid', note: 'Sounds like "b" in "boy". One of the most common consonants in Thai.',
    mnemonic: 'บ looks like a leaf (ใบไม้) with a stem at the bottom.'
  },
  {
    char: 'ป', name: 'Po Pla', meaning: 'Fish', roman: 'p',
    example: { thai: 'ปลา', roman: 'plaa', english: 'fish' },
    tone: 'mid', note: 'Sounds like "p" in "sport" — unaspirated. Different from พ/ผ which have a puff of air.',
    mnemonic: 'ป looks like a fish (ปลา plaa) with a fin on top.'
  },
  {
    char: 'อ', name: 'O Ang', meaning: 'Basin', roman: 'o/-',
    example: { thai: 'อ่าง', roman: 'aang', english: 'basin/bowl' },
    tone: 'mid', note: 'This letter acts as a vowel carrier when a syllable starts with a vowel sound. Very important letter.',
    mnemonic: 'อ is a round basin (อ่าง aang) — a circle with a tail.'
  },
  {
    char: 'ฎ', name: 'Do Chada', meaning: 'Crown', roman: 'd',
    example: { thai: 'ชฎา', roman: 'chada', english: 'Thai crown' },
    tone: 'mid', note: 'Rare letter — mainly used in words borrowed from Sanskrit and Pali. Same sound as ด.',
    mnemonic: 'ฎ is a rare crown-shaped letter — you won\'t see it often.'
  },
  {
    char: 'ฏ', name: 'To Patak', meaning: 'Spear', roman: 't',
    example: { thai: 'ปฏัก', roman: 'patak', english: 'spear/goad' },
    tone: 'mid', note: 'Very rare letter — only in a few words. Same sound as ต.',
    mnemonic: 'ฏ is extremely rare — just recognise it when you see it.'
  },
]

const QUIZ_QUESTIONS = MID_CLASS.slice(0, 6).map(c => ({
  question: `Which letter makes the "${c.roman}" sound and is named "${c.name}"?`,
  correct: c.char,
  options: shuffleFour(c.char, MID_CLASS.map(x => x.char).filter(x => x !== c.char)),
  audio: c.char,
}))

function shuffleFour(correct: string, others: string[]): string[] {
  const picks = others.sort(() => Math.random() - 0.5).slice(0, 3)
  return [correct, ...picks].sort(() => Math.random() - 0.5)
}

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

const TONE_COLORS: Record<string, string> = { mid: '#f59e0b', high: '#ef4444', low: '#0ea5e9', falling: '#8b5cf6', rising: '#22c55e' }

export default function Unit1Lesson1() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizQuestions] = useState(QUIZ_QUESTIONS)

  const card = MID_CLASS[cardIndex]

  useEffect(() => { setFlipped(false) }, [cardIndex])

  const handleQuizAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === quizQuestions[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
    speak(quizQuestions[quizIndex].correct, 0.7)
  }

  const nextQuiz = () => {
    if (quizIndex + 1 >= quizQuestions.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  const pct = Math.round((correct / quizQuestions.length) * 100)

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <style>{`@keyframes flip{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a1e, #15803d)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 1 · Lesson 1 — Mid Class Consonants</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setCardIndex(0) }}
            style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
            📖 Learn
          </button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
            style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
            🧠 Quiz
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      {phase === 'learn' && (
        <div style={{ background: 'rgba(21,128,61,0.1)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(21,128,61,0.15)' }}>
          <span style={{ color: '#15803d', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {MID_CLASS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#22c55e', borderRadius: '10px', width: `${((cardIndex + 1) / MID_CLASS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#15803d', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Mid Class Consonants</span>
        </div>
      )}

      {/* LEARN PHASE */}
      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>

          {/* Introduction — only show on first card */}
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #f59e0b' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🔤 About Mid Class Consonants</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>
                Thai consonants are divided into 3 classes — <strong>mid</strong>, <strong>high</strong>, and <strong>low</strong>. The class affects the <strong>tone</strong> of the syllable. We start with the 9 mid class consonants because they follow the simplest tone rules.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[{ label: 'Mid Class', color: '#f59e0b', count: '9 letters' }, { label: 'High Class', color: '#ef4444', count: '11 letters' }, { label: 'Low Class', color: '#0ea5e9', count: '24 letters' }].map(c => (
                  <span key={c.label} style={{ background: c.color + '20', color: c.color, fontSize: '13px', fontWeight: '700', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${c.color}40` }}>{c.label} — {c.count}</span>
                ))}
              </div>
            </div>
          )}

          {/* Main character card */}
          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            {/* Character display */}
            <div style={{ background: 'linear-gradient(135deg, #0c4a1e, #15803d)', padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ background: '#f59e0b', color: '#1a1a2e', fontSize: '11px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Mid Class</span>
              </div>
              <div style={{ fontSize: '120px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{card.char}</div>
              <button onClick={() => speak(card.char)}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>
                🔊 Hear it
              </button>
            </div>

            {/* Details */}
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Name</div>
                  <div style={{ color: '#1a1a2e', fontWeight: '900', fontSize: '18px' }}>{card.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.meaning}</div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Sound (romanised)</div>
                  <div style={{ color: '#1a1a2e', fontWeight: '900', fontSize: '18px', fontFamily: 'monospace' }}>{card.roman}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>Approximate sound</div>
                </div>
              </div>

              {/* Example word */}
              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '2px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example Word</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '44px', fontWeight: '900', color: '#15803d', lineHeight: 1 }}>{card.example.thai}</div>
                  <div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '16px' }}>{card.example.roman}</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)}
                    style={{ marginLeft: 'auto', background: '#22c55e', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                    🔊 Hear
                  </button>
                </div>
              </div>

              {/* Note */}
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Pronunciation Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>

              {/* Mnemonic */}
              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '14px 16px', border: '1px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Memory Tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.mnemonic}</p>
              </div>
            </div>
          </div>

          {/* All 9 mini grid */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>All 9 Mid Class Consonants</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {MID_CLASS.map((c, i) => (
                <button key={c.char} onClick={() => { setCardIndex(i); speak(c.char) }}
                  style={{ background: i === cardIndex ? '#15803d' : '#f9fafb', color: i === cardIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === cardIndex ? '#15803d' : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 14px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s', minWidth: '52px', textAlign: 'center' }}>
                  {c.char}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && (
              <button onClick={() => setCardIndex(prev => prev - 1)}
                style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                ← Previous
              </button>
            )}
            {cardIndex + 1 < MID_CLASS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(MID_CLASS[cardIndex + 1].char) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #15803d, #22c55e)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next Character ({MID_CLASS[cardIndex + 1].char}) →
              </button>
            ) : (
              <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                ✅ I know them all — Take the Quiz →
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#15803d', fontWeight: '700', fontSize: '14px' }}>Question {quizIndex + 1} of {quizQuestions.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#22c55e', borderRadius: '10px', width: `${((quizIndex + 1) / quizQuestions.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Which letter is this?</div>
              <div style={{ fontSize: '96px', fontWeight: '900', color: '#1a1a2e', lineHeight: 1, marginBottom: '16px' }}>
                {quizQuestions[quizIndex].correct}
              </div>
              <button onClick={() => speak(quizQuestions[quizIndex].correct)}
                style={{ background: '#f0fdf4', color: '#15803d', border: '2px solid #86efac', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ color: '#374151', fontSize: '15px', fontWeight: '600', textAlign: 'center', marginBottom: '20px' }}>
              {quizQuestions[quizIndex].question.split('"')[0]}
              <strong style={{ color: '#15803d' }}>"{quizQuestions[quizIndex].question.match(/"([^"]+)"/)?.[1]}"</strong>
              {quizQuestions[quizIndex].question.split('"').slice(-1)[0]}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quizQuestions[quizIndex].options.map(opt => {
                const isCorrect = opt === quizQuestions[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', color = '#1a1a2e'
                if (selected) {
                  if (isCorrect) { bg = '#f0fdf4'; border = '#22c55e'; color = '#15803d' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; color = '#dc2626' }
                }
                const charData = MID_CLASS.find(c => c.char === opt)
                return (
                  <button key={opt} onClick={() => handleQuizAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '18px 12px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', fontWeight: '900', color, marginBottom: '6px' }}>{opt}</div>
                    <div style={{ color: selected ? color : '#9ca3af', fontSize: '13px', fontWeight: '700' }}>
                      {selected ? charData?.name : '?'}
                    </div>
                    {selected && isCorrect && <div style={{ color: '#22c55e', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                    {selected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div style={{ background: selected === quizQuestions[quizIndex].correct ? '#f0fdf4' : '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${selected === quizQuestions[quizIndex].correct ? '#86efac' : '#fca5a5'}` }}>
              {selected === quizQuestions[quizIndex].correct
                ? <div style={{ color: '#15803d', fontWeight: '700', fontSize: '15px' }}>✅ Correct! <span style={{ fontWeight: '400' }}>That is <strong>{quizQuestions[quizIndex].correct}</strong> — {MID_CLASS.find(c => c.char === quizQuestions[quizIndex].correct)?.name}.</span></div>
                : <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '15px' }}>❌ Not quite. <span style={{ fontWeight: '400' }}>The correct answer is <strong>{quizQuestions[quizIndex].correct}</strong> — {MID_CLASS.find(c => c.char === quizQuestions[quizIndex].correct)?.name}.</span></div>
              }
            </div>
          )}

          {selected && (
            <button onClick={nextQuiz}
              style={{ width: '100%', background: 'linear-gradient(135deg, #15803d, #22c55e)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {quizIndex + 1 >= quizQuestions.length ? '🏆 See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      )}

      {/* COMPLETE PHASE */}
      {phase === 'complete' && (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>
              {pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}
            </h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#22c55e' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {quizQuestions.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                  {a ? '✓' : '✗'}
                </div>
              ))}
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #86efac', textAlign: 'left' }}>
              <div style={{ color: '#15803d', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You have learned all 9 mid class consonants. Next up: High Class Consonants.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-1/lesson-2"
                style={{ display: 'block', background: 'linear-gradient(135deg, #15803d, #22c55e)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next Lesson: High Class Consonants →
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
