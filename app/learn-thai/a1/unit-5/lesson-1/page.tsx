'use client'
import { useState } from 'react'
import Link from 'next/link'

const NUMBERS = [
  {
    num: 1, thai: 'หนึ่ง', roman: 'nueng', english: 'One',
    note: 'หนึ่ง is the standard word for 1. In informal counting you often hear เดียว (diao) meaning "one/single" instead.',
    mnemonic: 'หนึ่ง — think "noing" — one note on a guitar.',
    example: { thai: 'หนึ่งคน', roman: 'nueng khon', english: 'one person' },
  },
  {
    num: 2, thai: 'สอง', roman: 'soong', english: 'Two',
    note: 'สอง is used for the number 2. In the tens position it becomes ยี่ (yii) — so 20 is ยี่สิบ not สองสิบ.',
    mnemonic: 'สอง sounds like "song" — two people singing a duet.',
    example: { thai: 'สองคน', roman: 'soong khon', english: 'two people' },
  },
  {
    num: 3, thai: 'สาม', roman: 'saam', english: 'Three',
    note: 'สาม has a mid tone. Used as a standalone number and in compound numbers like สามสิบ (30).',
    mnemonic: 'สาม sounds like "saam" — Sam had three friends.',
    example: { thai: 'สามวัน', roman: 'saam wan', english: 'three days' },
  },
  {
    num: 4, thai: 'สี่', roman: 'sii', english: 'Four',
    note: 'สี่ has a falling tone. Also means "colour" (สี) with a different tone — so tone matters here!',
    mnemonic: 'สี่ — "see" — four eyes to see better.',
    example: { thai: 'สี่โมง', roman: 'sii moong', english: 'four o\'clock' },
  },
  {
    num: 5, thai: 'ห้า', roman: 'haa', english: 'Five',
    note: 'ห้า has a falling tone. Also means "to forbid/prohibit" in some contexts. Thais write "555" online to mean "hahaha" since ห้า sounds like "ha".',
    mnemonic: '555 = hahaha in Thai internet slang — five fives for laughing!',
    example: { thai: 'ห้าบาท', roman: 'haa baat', english: 'five baht' },
  },
  {
    num: 6, thai: 'หก', roman: 'hok', english: 'Six',
    note: 'หก has a low tone. A dead syllable — short vowel with stop consonant. Also means "to spill/fall over" with different tone.',
    mnemonic: 'หก — "hok" — like a hockey puck — six players on the ice.',
    example: { thai: 'หกชั่วโมง', roman: 'hok chua moong', english: 'six hours' },
  },
  {
    num: 7, thai: 'เจ็ด', roman: 'jet', english: 'Seven',
    note: 'เจ็ด has a low tone. Dead syllable — stops at ด. Used in all compound numbers like เจ็ดสิบ (70).',
    mnemonic: 'เจ็ด sounds like "jet" — a jet has 7 letters.',
    example: { thai: 'เจ็ดวัน', roman: 'jet wan', english: 'seven days' },
  },
  {
    num: 8, thai: 'แปด', roman: 'bpaet', english: 'Eight',
    note: 'แปด has a low tone. The bp sound is the unaspirated p — like the "p" in "sport", not "pot".',
    mnemonic: 'แปด — "bpaet" — eight beats in music.',
    example: { thai: 'แปดโมง', roman: 'bpaet moong', english: 'eight o\'clock' },
  },
  {
    num: 9, thai: 'เก้า', roman: 'gao', english: 'Nine',
    note: 'เก้า has a falling tone. Also means "old/ancient" with a different tone. Nine is considered a lucky number in Thailand.',
    mnemonic: 'เก้า — "gao" — nine is lucky in Thai culture, like "go" moving forward.',
    example: { thai: 'เก้าบาท', roman: 'gao baat', english: 'nine baht' },
  },
  {
    num: 10, thai: 'สิบ', roman: 'sip', english: 'Ten',
    note: 'สิบ is the word for ten AND the word used to build 20–90. สิบ + number = the tens: สิบเอ็ด (11), ยี่สิบ (20), สามสิบ (30).',
    mnemonic: 'สิบ — "sip" — take a sip and count to ten.',
    example: { thai: 'สิบบาท', roman: 'sip baat', english: 'ten baht' },
  },
]

const QUIZ_Q = [
  { q: 'What is the Thai word for the number 1?', correct: 'Nueng', options: ['Soong', 'Nueng', 'Saam', 'Sii'] },
  { q: 'What does "ห้า" (haa) mean?', correct: 'Five', options: ['Four', 'Six', 'Five', 'Seven'] },
  { q: 'Thai people write "555" online to mean what?', correct: 'Hahaha (laughing)', options: ['Very good', 'Hahaha (laughing)', 'I am fine', 'Thank you'] },
  { q: 'What is "sip" in Thai?', correct: 'Ten', options: ['Eight', 'Nine', 'Seven', 'Ten'] },
  { q: 'In Thai, the number 20 is NOT "soong sip" — it uses a special word instead. What is the Thai word for 20?', correct: 'Yii sip', options: ['Soong sip', 'Yii sip', 'Saam sip', 'Sip soong'] },
  { q: 'Which number is considered lucky in Thailand?', correct: 'Nine', options: ['Seven', 'Eight', 'Nine', 'Six'] },
  { q: 'What is the Thai word for eight?', correct: 'Bpaet', options: ['Jet', 'Gao', 'Hok', 'Bpaet'] },
  { q: '"Saam wan" means...?', correct: 'Three days', options: ['Three people', 'Three hours', 'Three days', 'Three baht'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

function shuffleOptions(correct: number, all: number[]): number[] {
  const others = all.filter(n => n !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
  return [correct, ...others].sort(() => Math.random() - 0.5)
}

const SCRIPT_Q = NUMBERS.map(n => ({
  thai: n.thai, roman: n.roman, english: n.english, num: n.num,
  options: shuffleOptions(n.num, NUMBERS.map(x => x.num)),
})).sort(() => Math.random() - 0.5)

export default function Unit5Lesson1() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'script' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [scriptSelected, setScriptSelected] = useState<string | null>(null)
  const [scriptScore, setScriptScore] = useState(0)
  const [scriptAnswers, setScriptAnswers] = useState<boolean[]>([])

  const card = NUMBERS[cardIndex]
  const pct = Math.round((correct / QUIZ_Q.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === QUIZ_Q[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
  }

  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ_Q.length) { setPhase('script'); setScriptIndex(0); setScriptSelected(null); setScriptScore(0); setScriptAnswers([]); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 5 · Lesson 1 — Numbers 1–10</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Learn</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
          <button onClick={() => { setPhase('script'); setScriptIndex(0); setScriptSelected(null); setScriptScore(0); setScriptAnswers([]) }} style={{ background: phase === 'script' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>✍️ Script</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(124,58,237,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
          <span style={{ color: '#7c3aed', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {NUMBERS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#7c3aed', borderRadius: '10px', width: `${((cardIndex + 1) / NUMBERS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#7c3aed', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Numbers 1–10</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #7c3aed' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🔢 Thai Numbers</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Thai numbers are logical and consistent — once you know 1–10, building larger numbers is straightforward. Thai also has its own number symbols (๑ ๒ ๓...) but Arabic numerals (1 2 3) are used everywhere in modern Thailand. Start with the words first.
              </p>
              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontWeight: '800', fontSize: '13px', marginBottom: '8px' }}>💡 The pattern</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                  11 = สิบเอ็ด (ten-one) · 12 = สิบสอง (ten-two) · 20 = ยี่สิบ · 21 = ยี่สิบเอ็ด · 30 = สามสิบ<br />
                  <strong>Exception:</strong> 2 = สอง but 20 = ยี่สิบ (not สองสิบ). Just one irregular to remember!
                </div>
              </div>
            </div>
          )}

          {/* Main number card */}
          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '80px', fontWeight: '900', color: 'rgba(255,255,255,0.15)', lineHeight: 1, position: 'absolute', right: '32px', top: '20px' }}>{card.num}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Number {card.num}</div>
              <div style={{ fontSize: '80px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '10px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>{card.roman} — {card.english}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>🐢 Slow</button>
              </div>
            </div>

            <div style={{ padding: '28px 32px' }}>
              {/* Example */}
              <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '2px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: '#7c3aed' }}>{card.example.thai}</div>
                  <div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '16px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '14px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)} style={{ marginLeft: 'auto', background: '#7c3aed', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>🔊</button>
                </div>
              </div>

              {/* Note */}
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>

              {/* Mnemonic */}
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 16px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Memory tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.mnemonic}</p>
              </div>
            </div>
          </div>

          {/* Number grid */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>All 10 Numbers</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {NUMBERS.map((n, i) => (
                <button key={n.num} onClick={() => { setCardIndex(i); speak(n.thai) }}
                  style={{ background: i === cardIndex ? '#7c3aed' : '#f9fafb', color: i === cardIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === cardIndex ? '#7c3aed' : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 12px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center', minWidth: '52px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '900' }}>{n.thai}</div>
                  <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.7 }}>{n.num}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < NUMBERS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(NUMBERS[cardIndex + 1].thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {NUMBERS[cardIndex + 1].thai} ({NUMBERS[cardIndex + 1].num}) →
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
            <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#7c3aed', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
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
                  if (isCorrect) { bg = '#f5f3ff'; border = '#7c3aed'; textColor = '#5b21b6' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '16px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#7c3aed', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f5f3ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#ede9fe' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#5b21b6', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct answer: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '🏆 Results →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '5px solid #7c3aed' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Look at the Thai number script and choose the correct number. This trains your eye to recognise Thai numerals.</p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {NUMBERS.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#7c3aed', borderRadius: '10px', width: `${((scriptIndex + 1) / NUMBERS.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Which number is this?</div>
              <div style={{ fontSize: '96px', fontWeight: '900', color: '#7c3aed', lineHeight: 1, marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#f5f3ff', color: '#7c3aed', border: '2px solid #ede9fe', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {SCRIPT_Q[scriptIndex].options.map(num => {
                  const isCorrect = num === SCRIPT_Q[scriptIndex].num
                  const isSelected = scriptSelected === String(num)
                  let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                  if (scriptSelected) {
                    if (isCorrect) { bg = '#f5f3ff'; border = '#7c3aed'; textColor = '#5b21b6' }
                    else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                  }
                  return (
                    <button key={num} onClick={() => {
                      if (scriptSelected) return
                      setScriptSelected(String(num))
                      if (isCorrect) setScriptScore(prev => prev + 1)
                      setScriptAnswers(prev => [...prev, isCorrect])
                    }} disabled={!!scriptSelected}
                      style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '20px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: '900', color: textColor }}>{num}</div>
                      {scriptSelected && <div style={{ color: textColor, fontSize: '14px', fontWeight: '700', marginTop: '4px' }}>{NUMBERS.find(n => n.num === num)?.roman}</div>}
                      {scriptSelected && isCorrect && <div style={{ color: '#7c3aed', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                      {scriptSelected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                    </button>
                  )
                })}
            </div>
          </div>

          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].num === Number(scriptSelected) ? '#f5f3ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].num === Number(scriptSelected) ? '#ede9fe' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].num === Number(scriptSelected)
                ? <span style={{ color: '#5b21b6', fontWeight: '700' }}>✅ Correct! {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} — {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
              }
            </div>
          )}

          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= NUMBERS.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {scriptIndex + 1 >= NUMBERS.length ? '🏆 Finish →' : 'Next →'}
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
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#f5f3ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #ede9fe', textAlign: 'left' }}>
              <div style={{ color: '#5b21b6', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You know numbers 1–10 in Thai — vocabulary, pronunciation AND script recognition. Next: numbers 11–100.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-5/lesson-2" style={{ display: 'block', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Numbers 11–100 →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
