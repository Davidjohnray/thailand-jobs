'use client'
import { useState } from 'react'
import Link from 'next/link'

const TIME_VOCAB = [
  {
    thai: 'กี่โมง', roman: 'gii moong', english: 'What time is it?', emoji: '🕐',
    note: 'The standard way to ask the time. กี่ = how many, โมง = hour/o\'clock. You\'ll hear this constantly.',
    example: { thai: 'ตอนนี้กี่โมง', roman: 'ton nii gii moong', english: 'What time is it now?' },
    tip: 'Just say กี่โมงครับ/ค่ะ and point at your wrist — everyone understands.',
  },
  {
    thai: 'โมง', roman: 'moong', english: 'O\'clock (daytime 7am–11am)', emoji: '🌅',
    note: 'โมง is used for daytime hours 7am–11am. สามโมง = 9am (3 o\'clock morning). Thai timekeeping has different words for different parts of the day.',
    example: { thai: 'สามโมงเช้า', roman: 'saam moong chao', english: '9am (3 o\'clock morning)' },
    tip: 'The Thai clock system divides the day into sections. For simplicity, many Thais now use the 24-hour clock — สิบสี่โมง = 14:00.',
  },
  {
    thai: 'บ่าย', roman: 'baai', english: 'Afternoon (1pm–4pm)', emoji: '☀️',
    note: 'บ่าย covers early afternoon. บ่ายโมง = 1pm, บ่ายสองโมง = 2pm, บ่ายสามโมง = 3pm, บ่ายสี่โมง = 4pm.',
    example: { thai: 'บ่ายสองโมง', roman: 'baai soong moong', english: '2pm' },
    tip: 'บ่าย + number + โมง. Most common times for Thai afternoon classes and meetings.',
  },
  {
    thai: 'เย็น', roman: 'yen', english: 'Evening (5pm–6pm)', emoji: '🌇',
    note: 'เย็น means both "evening" and "cool/cold". ห้าโมงเย็น = 5pm, หกโมงเย็น = 6pm. Also used in สวัสดีตอนเย็น (good evening).',
    example: { thai: 'ห้าโมงเย็น', roman: 'haa moong yen', english: '5pm' },
    tip: 'เย็น is also why cold things have เย็น — น้ำเย็น (cold water), กาแฟเย็น (iced coffee).',
  },
  {
    thai: 'ทุ่ม', roman: 'thum', english: 'Evening hours (7pm–11pm)', emoji: '🌆',
    note: 'ทุ่ม covers 7pm–11pm. หนึ่งทุ่ม = 7pm, สองทุ่ม = 8pm, สามทุ่ม = 9pm, สี่ทุ่ม = 10pm, ห้าทุ่ม = 11pm.',
    example: { thai: 'สองทุ่ม', roman: 'soong thum', english: '8pm' },
    tip: 'ทุ่ม starts at 7pm (หนึ่งทุ่ม = one thum = 7pm). Think of it as evening o\'clock.',
  },
  {
    thai: 'เที่ยงคืน', roman: 'thiang khuuen', english: 'Midnight', emoji: '🌙',
    note: 'เที่ยง = midpoint, คืน = night. เที่ยง alone means midday (noon). เที่ยงคืน = midnight. เที่ยงวัน = noon.',
    example: { thai: 'เที่ยงคืนแล้ว', roman: 'thiang khuuen laeo', english: 'It\'s already midnight' },
    tip: 'เที่ยง = midpoint of something. เที่ยงวัน (midday), เที่ยงคืน (midnight). Easy to remember!',
  },
  {
    thai: 'นาที', roman: 'naa thii', english: 'Minutes', emoji: '⏱️',
    note: 'สิบห้านาที = 15 minutes, สามสิบนาที = 30 minutes, สี่สิบห้านาที = 45 minutes. นาที comes after the number.',
    example: { thai: 'สิบห้านาที', roman: 'sip haa naa thii', english: '15 minutes' },
    tip: 'To say "half past": สองโมงครึ่ง (2:30) — ครึ่ง means half. สามโมงครึ่ง = 3:30.',
  },
  {
    thai: 'ครึ่ง', roman: 'khrueng', english: 'Half (past)', emoji: '⏰',
    note: 'ครึ่ง = half. Add it after the hour: บ่ายสองโมงครึ่ง = 2:30pm. Much easier than saying "thirty minutes".',
    example: { thai: 'บ่ายโมงครึ่ง', roman: 'baai moong khrueng', english: '1:30pm' },
    tip: 'ครึ่ง is your best friend for telling time. Use it for any half-hour: สามทุ่มครึ่ง = 9:30pm.',
  },
]

const TIME_EXAMPLES = [
  { time: '7:00am', thai: 'เจ็ดโมงเช้า', roman: 'jet moong chao' },
  { time: '9:00am', thai: 'เก้าโมงเช้า', roman: 'gao moong chao' },
  { time: '12:00pm', thai: 'เที่ยงวัน', roman: 'thiang wan' },
  { time: '1:00pm', thai: 'บ่ายโมง', roman: 'baai moong' },
  { time: '2:30pm', thai: 'บ่ายสองโมงครึ่ง', roman: 'baai soong moong khrueng' },
  { time: '5:00pm', thai: 'ห้าโมงเย็น', roman: 'haa moong yen' },
  { time: '7:00pm', thai: 'หนึ่งทุ่ม', roman: 'nueng thum' },
  { time: '9:30pm', thai: 'สามทุ่มครึ่ง', roman: 'saam thum khrueng' },
]

const SCRIPT_Q = TIME_EXAMPLES.map(t => ({
  thai: t.thai, roman: t.roman, english: t.time,
  options: [t.time, ...TIME_EXAMPLES.filter(x => x.time !== t.time).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.time)].sort(() => Math.random() - 0.5),
})).sort(() => Math.random() - 0.5)

const QUIZ_Q = [
  { q: 'How do you ask "What time is it?" in Thai?', correct: 'Gii moong', options: ['Ton nii', 'Gii moong', 'Naa thii', 'Thiang wan'] },
  { q: 'How do you say 2pm in Thai?', correct: 'Baai soong moong', options: ['Soong thum', 'Baai soong moong', 'Soong moong yen', 'Baai soong naa thii'] },
  { q: 'What does "khrueng" mean?', correct: 'Half', options: ['Quarter', 'Half', 'Minute', 'Hour'] },
  { q: 'How do you say 8pm in Thai?', correct: 'Soong thum', options: ['Nueng thum', 'Soong thum', 'Saam thum', 'Haa thum'] },
  { q: 'What time is "saam thum khrueng"?', correct: '9:30pm', options: ['8:30pm', '9:00pm', '9:30pm', '10:30pm'] },
  { q: 'How do you say "noon" in Thai?', correct: 'Thiang wan', options: ['Thiang khuuen', 'Thiang wan', 'Jet moong chao', 'Haa moong yen'] },
  { q: 'ทุ่ม (thum) covers which hours?', correct: '7pm–11pm', options: ['1pm–6pm', '7am–11am', '7pm–11pm', '12am–6am'] },
  { q: 'How do you say 1:30pm in Thai?', correct: 'Baai moong khrueng', options: ['Baai moong', 'Nueng thum khrueng', 'Baai moong khrueng', 'Baai soong moong'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit6Lesson3() {
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

  const card = TIME_VOCAB[cardIndex]
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
      <div style={{ background: 'linear-gradient(135deg, #1c1917, #d97706)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 6 · Lesson 3 — Telling the Time</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ id: 'learn', label: '📖 Learn' }, { id: 'quiz', label: '🧠 Quiz' }, { id: 'script', label: '✍️ Script' }].map(tab => (
            <button key={tab.id} onClick={() => {
              if (tab.id === 'quiz') { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }
              if (tab.id === 'script') { setScriptIndex(0); setScriptSelected(null); setScriptScore(0); setScriptAnswers([]) }
              setPhase(tab.id as any)
            }} style={{ background: phase === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(217,119,6,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(217,119,6,0.1)' }}>
          <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {TIME_VOCAB.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#d97706', borderRadius: '10px', width: `${((cardIndex + 1) / TIME_VOCAB.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{card.emoji} {card.english}</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #d97706' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🕐 Telling the Time in Thai</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Thai timekeeping divides the day into sections with different words — unlike the simple 12-hour or 24-hour clock. Once you learn the pattern it's logical. Many modern Thais also use the 24-hour clock.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                {[
                  { label: '🌅 Morning', time: '7–11am', word: 'โมงเช้า' },
                  { label: '☀️ Noon', time: '12pm', word: 'เที่ยงวัน' },
                  { label: '🌤️ Afternoon', time: '1–4pm', word: 'บ่าย' },
                  { label: '🌇 Evening', time: '5–6pm', word: 'โมงเย็น' },
                  { label: '🌆 Night', time: '7–11pm', word: 'ทุ่ม' },
                  { label: '🌙 Midnight', time: '12am', word: 'เที่ยงคืน' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fffbeb', borderRadius: '10px', padding: '10px 12px', border: '1px solid #fde68a', textAlign: 'center' }}>
                    <div style={{ fontWeight: '800', fontSize: '13px', color: '#92400e' }}>{s.label}</div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>{s.time}</div>
                    <div style={{ color: '#d97706', fontSize: '14px', fontWeight: '900', marginTop: '4px' }}>{s.word}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1c1917, #d97706)', padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{card.emoji}</div>
              <div style={{ fontSize: '56px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '20px' }}>{card.english}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>🐢 Slow</button>
              </div>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#fef9c3', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '2px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#d97706' }}>{card.example.thai}</div>
                  <div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '15px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)} style={{ marginLeft: 'auto', background: '#d97706', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🔊</button>
                </div>
              </div>
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 16px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>

          {/* Time examples reference */}
          {cardIndex === TIME_VOCAB.length - 1 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Quick Reference — Common Times</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TIME_EXAMPLES.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#f9fafb', borderRadius: '10px' }}>
                    <span style={{ color: '#d97706', fontWeight: '900', fontSize: '15px', width: '60px', flexShrink: 0 }}>{t.time}</span>
                    <span style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '16px', flex: 1 }}>{t.thai}</span>
                    <button onClick={() => speak(t.thai)} style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>🔊</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>All Topics</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TIME_VOCAB.map((v, i) => (
                <button key={i} onClick={() => { setCardIndex(i); speak(v.thai) }}
                  style={{ background: i === cardIndex ? '#d97706' : '#f9fafb', color: i === cardIndex ? 'white' : '#374151', border: `2px solid ${i === cardIndex ? '#d97706' : '#e5e7eb'}`, borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontSize: '20px', transition: 'all 0.15s' }}>
                  {v.emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < TIME_VOCAB.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(TIME_VOCAB[cardIndex + 1].thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #1c1917, #d97706)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {TIME_VOCAB[cardIndex + 1].english} →
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
            <span style={{ color: '#d97706', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#d97706', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
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
                  if (isCorrect) { bg = '#fffbeb'; border = '#d97706'; textColor = '#92400e' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#d97706', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#fffbeb' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#fde68a' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#92400e', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #1c1917, #d97706)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #d97706' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition — Times</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai time expression and choose the correct clock time. Random order each time.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#d97706', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#d97706', borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What time is this?</div>
              <div style={{ fontSize: '44px', fontWeight: '900', color: '#d97706', lineHeight: 1.1, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#fffbeb', color: '#d97706', border: '2px solid #fde68a', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isCorrect = opt === SCRIPT_Q[scriptIndex].english
                const isSelected = scriptSelected === opt
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#fffbeb'; border = '#d97706'; textColor = '#92400e' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => {
                    if (scriptSelected) return
                    setScriptSelected(opt)
                    if (isCorrect) setScriptScore(prev => prev + 1)
                    setScriptAnswers(prev => [...prev, isCorrect])
                  }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '20px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: textColor }}>{opt}</div>
                    {scriptSelected && isCorrect && <div style={{ color: '#d97706', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                    {scriptSelected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#fffbeb' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? '#fde68a' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: '#92400e', fontWeight: '700' }}>✅ Correct! {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english}</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
              }
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #1c1917, #d97706)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {scriptIndex + 1 >= SCRIPT_Q.length ? '🏆 Finish →' : 'Next →'}
            </button>
          )}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#d97706' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#fffbeb' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#fffbeb', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #fde68a', textAlign: 'left' }}>
              <div style={{ color: '#92400e', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>🎉 Unit 6 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                You can now:<br />
                ✓ Name all 7 days of the week<br />
                ✓ Name all 12 months<br />
                ✓ Tell and ask the time<br /><br />
                Next up: Unit 7 — Family and People!
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1" style={{ display: 'block', background: 'linear-gradient(135deg, #1c1917, #d97706)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                ← Back to A1 Overview
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
