'use client'
import { useState } from 'react'
import Link from 'next/link'

const HIGH_CLASS = [
  {
    char: 'ข', name: 'Kho Khai', meaning: 'Egg', roman: 'kh',
    example: { thai: 'ไข่', roman: 'khai', english: 'egg' },
    note: 'Sounds like "k" with a strong puff of air — like "k" in "king". High class consonants produce a rising tone in live syllables.',
    mnemonic: 'ข looks like ก but with an extra stroke on top — the "puff of air" literally added to the letter.'
  },
  {
    char: 'ฃ', name: 'Kho Khuat', meaning: 'Bottle', roman: 'kh',
    example: { thai: 'ขวด', roman: 'khuat', english: 'bottle' },
    note: 'This letter is obsolete — you will almost never see it in modern Thai. It has the same sound as ข.',
    mnemonic: 'ฃ is the "ghost letter" of Thai — it exists but almost nobody uses it anymore. Just recognise it.'
  },
  {
    char: 'ฉ', name: 'Cho Ching', meaning: 'Cymbals', roman: 'ch',
    example: { thai: 'ฉิ่ง', roman: 'ching', english: 'small cymbals' },
    note: 'Sounds like "ch" in "cheese" — with a slight puff of air. Only appears at the start of a syllable, never at the end.',
    mnemonic: 'ฉ is the high class "ch" — think of a cymbal crash ฉิ่ง making a sharp, high sound.'
  },
  {
    char: 'ฐ', name: 'Tho Than', meaning: 'Pedestal', roman: 'th',
    example: { thai: 'ฐาน', roman: 'thaan', english: 'base/pedestal' },
    note: 'Sounds like "t" with a puff of air — like "t" in "top". Not the English "th" sound — no tongue between the teeth.',
    mnemonic: 'ฐ looks like a decorated pedestal or base — ฐาน (thaan) means base or foundation.'
  },
  {
    char: 'ถ', name: 'Tho Thung', meaning: 'Bag', roman: 'th',
    example: { thai: 'ถุง', roman: 'thung', english: 'bag/sack' },
    note: 'Same sound as ฐ — aspirated "t". More common than ฐ in everyday words.',
    mnemonic: 'ถ looks like a bag (ถุง thung) with its opening at the top.'
  },
  {
    char: 'ผ', name: 'Pho Phueng', meaning: 'Bee', roman: 'ph',
    example: { thai: 'ผึ้ง', roman: 'phueng', english: 'bee' },
    note: 'Sounds like "p" with a puff of air — like "p" in "pot". NOT the "f" sound. Only appears at the start of a syllable.',
    mnemonic: 'ผ looks like a bee\'s wings (ผึ้ง phueng) — two strokes spreading outward.'
  },
  {
    char: 'ฝ', name: 'Fo Fa', meaning: 'Lid', roman: 'f',
    example: { thai: 'ฝา', roman: 'faa', english: 'lid/cover' },
    note: 'Sounds like "f" in "fan". One of only two Thai letters that make an "f" sound. Only at the start of syllables.',
    mnemonic: 'ฝ looks like ผ with a curl — the curl turns the "p" sound into an "f" sound.'
  },
  {
    char: 'ศ', name: 'So Sala', meaning: 'Pavilion', roman: 's',
    example: { thai: 'ศาลา', roman: 'saala', english: 'pavilion/hall' },
    note: 'Sounds like "s" in "sun". One of three letters that make an "s" sound. More formal/literary usage.',
    mnemonic: 'ศ is the fancy "s" — used in formal words, names, and borrowed words from Sanskrit.'
  },
  {
    char: 'ษ', name: 'So Ruesi', meaning: 'Hermit', roman: 's',
    example: { thai: 'ฤๅษี', roman: 'rueasii', english: 'hermit/ascetic' },
    note: 'Also sounds like "s". Very rare — mainly in Sanskrit loanwords. Same sound as ศ and ส.',
    mnemonic: 'ษ is extremely rare — you\'ll mainly see it in names and formal/religious words.'
  },
  {
    char: 'ส', name: 'So Suea', meaning: 'Tiger', roman: 's',
    example: { thai: 'เสือ', roman: 'suea', english: 'tiger' },
    note: 'The most common of the three "s" letters. Used in everyday words and very frequently in final position too.',
    mnemonic: 'ส is the everyday "s" — the tiger (เสือ suea) uses the most common form.'
  },
  {
    char: 'ห', name: 'Ho Hip', meaning: 'Chest/Box', roman: 'h',
    example: { thai: 'หีบ', roman: 'hiip', english: 'chest/box' },
    note: 'Sounds like "h" in "hat". Also has a crucial grammatical role — when placed before certain low class consonants it raises their tone class.',
    mnemonic: 'ห is a very important letter — not just for its own sound but because it changes the tone of other letters.'
  },
]

const QUIZ_QUESTIONS = HIGH_CLASS.slice(0, 7).map(c => ({
  correct: c.char,
  name: c.name,
  roman: c.roman,
  options: shuffleFour(c.char, HIGH_CLASS.map(x => x.char).filter(x => x !== c.char)),
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

export default function Unit1Lesson2() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizQuestions] = useState(QUIZ_QUESTIONS)

  const card = HIGH_CLASS[cardIndex]
  const pct = Math.round((correct / quizQuestions.length) * 100)

  const handleQuizAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === quizQuestions[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
    speak(quizQuestions[quizIndex].correct)
  }

  const nextQuiz = () => {
    if (quizIndex + 1 >= quizQuestions.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 1 · Lesson 2 — High Class Consonants</div>
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
        <div style={{ background: 'rgba(79,70,229,0.08)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(79,70,229,0.12)' }}>
          <span style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {HIGH_CLASS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#6366f1', borderRadius: '10px', width: `${((cardIndex + 1) / HIGH_CLASS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>High Class Consonants</span>
        </div>
      )}

      {/* LEARN PHASE */}
      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>

          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #6366f1' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🔤 About High Class Consonants</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>
                There are <strong>11 high class consonants</strong>. In live syllables with no tone mark, high class consonants produce a <strong>rising tone</strong>. Many of the sounds are aspirated — produced with a puff of air. High class consonants are also used to raise the tone of low class consonants when placed before them.
              </p>
              <div style={{ background: '#eef2ff', borderRadius: '10px', padding: '12px 16px', border: '1px solid #c7d2fe' }}>
                <div style={{ color: '#4338ca', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>💡 Key difference from Mid Class</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>Mid class = middle tone by default. High class = rising tone by default. The same letter + same vowel can sound completely different in terms of meaning.</div>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ background: '#6366f1', color: 'white', fontSize: '11px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>High Class</span>
              </div>
              <div style={{ fontSize: '120px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{card.char}</div>
              <button onClick={() => speak(card.char)}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>
                🔊 Hear it
              </button>
            </div>

            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Name</div>
                  <div style={{ color: '#1a1a2e', fontWeight: '900', fontSize: '18px' }}>{card.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.meaning}</div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Sound</div>
                  <div style={{ color: '#1a1a2e', fontWeight: '900', fontSize: '18px', fontFamily: 'monospace' }}>{card.roman}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>Romanised</div>
                </div>
              </div>

              <div style={{ background: '#eef2ff', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '2px solid #c7d2fe' }}>
                <div style={{ color: '#4338ca', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example Word</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '44px', fontWeight: '900', color: '#4338ca', lineHeight: 1 }}>{card.example.thai}</div>
                  <div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '16px' }}>{card.example.roman}</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)}
                    style={{ marginLeft: 'auto', background: '#6366f1', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                    🔊 Hear
                  </button>
                </div>
              </div>

              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Pronunciation Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>

              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '14px 16px', border: '1px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Memory Tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.mnemonic}</p>
              </div>
            </div>
          </div>

          {/* All 11 mini grid */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>All 11 High Class Consonants</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {HIGH_CLASS.map((c, i) => (
                <button key={c.char} onClick={() => { setCardIndex(i); speak(c.char) }}
                  style={{ background: i === cardIndex ? '#4f46e5' : '#f9fafb', color: i === cardIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === cardIndex ? '#4f46e5' : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 14px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s', minWidth: '52px', textAlign: 'center' }}>
                  {c.char}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && (
              <button onClick={() => setCardIndex(prev => prev - 1)}
                style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                ← Previous
              </button>
            )}
            {cardIndex + 1 < HIGH_CLASS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(HIGH_CLASS[cardIndex + 1].char) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next Character ({HIGH_CLASS[cardIndex + 1].char}) →
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
            <span style={{ color: '#4f46e5', fontWeight: '700', fontSize: '14px' }}>Question {quizIndex + 1} of {quizQuestions.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#6366f1', borderRadius: '10px', width: `${((quizIndex + 1) / quizQuestions.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What is the name of this letter?</div>
              <div style={{ fontSize: '96px', fontWeight: '900', color: '#1a1a2e', lineHeight: 1, marginBottom: '16px' }}>{quizQuestions[quizIndex].correct}</div>
              <button onClick={() => speak(quizQuestions[quizIndex].correct)}
                style={{ background: '#eef2ff', color: '#4f46e5', border: '2px solid #c7d2fe', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quizQuestions[quizIndex].options.map(opt => {
                const isCorrect = opt === quizQuestions[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (selected) {
                  if (isCorrect) { bg = '#eef2ff'; border = '#6366f1'; textColor = '#4338ca' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                const charData = HIGH_CLASS.find(c => c.char === opt)
                return (
                  <button key={opt} onClick={() => handleQuizAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '18px 12px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', fontWeight: '900', color: textColor, marginBottom: '6px' }}>{opt}</div>
                    <div style={{ color: selected ? textColor : '#9ca3af', fontSize: '13px', fontWeight: '700' }}>
                      {selected ? charData?.name : '?'}
                    </div>
                    {selected && isCorrect && <div style={{ color: '#6366f1', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                    {selected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div style={{ background: selected === quizQuestions[quizIndex].correct ? '#eef2ff' : '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${selected === quizQuestions[quizIndex].correct ? '#c7d2fe' : '#fca5a5'}` }}>
              {selected === quizQuestions[quizIndex].correct
                ? <div style={{ color: '#4338ca', fontWeight: '700', fontSize: '15px' }}>✅ Correct! <span style={{ fontWeight: '400' }}>That is <strong>{quizQuestions[quizIndex].correct}</strong> — {HIGH_CLASS.find(c => c.char === quizQuestions[quizIndex].correct)?.name}.</span></div>
                : <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '15px' }}>❌ Not quite. <span style={{ fontWeight: '400' }}>The correct answer is <strong>{quizQuestions[quizIndex].correct}</strong> — {HIGH_CLASS.find(c => c.char === quizQuestions[quizIndex].correct)?.name}.</span></div>
              }
            </div>
          )}

          {selected && (
            <button onClick={nextQuiz}
              style={{ width: '100%', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {quizIndex + 1 >= quizQuestions.length ? '🏆 See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>
              {pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}
            </h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#6366f1' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {quizQuestions.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#eef2ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                  {a ? '✓' : '✗'}
                </div>
              ))}
            </div>
            <div style={{ background: '#eef2ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #c7d2fe', textAlign: 'left' }}>
              <div style={{ color: '#4338ca', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You now know 20 of 44 Thai consonants — mid and high class. Next: the 24 low class consonants — the largest group.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-1/lesson-3"
                style={{ display: 'block', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next Lesson: Low Class Consonants →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                🔄 Review Again
              </button>
              <Link href="/learn-thai/a1/unit-1/lesson-1"
                style={{ display: 'block', background: '#f9fafb', color: '#6b7280', border: '2px solid #e5e7eb', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                ← Back to Lesson 1: Mid Class
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
