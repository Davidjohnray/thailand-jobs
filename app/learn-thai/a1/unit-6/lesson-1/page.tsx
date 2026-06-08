'use client'
import { useState } from 'react'
import Link from 'next/link'

const DAYS = [
  {
    thai: 'วันจันทร์', roman: 'wan jan', english: 'Monday', short: 'จ.', color: '#f59e0b',
    note: 'จันทร์ comes from the Sanskrit word for moon (Chandra). Thai days are named after celestial bodies — a system shared with many South and Southeast Asian cultures.',
    mnemonic: 'Jan sounds like "Jan" — Monday is the start of January energy. New week, new start.',
    example: { thai: 'วันจันทร์นี้', roman: 'wan jan nii', english: 'this Monday' },
  },
  {
    thai: 'วันอังคาร', roman: 'wan ang khaan', english: 'Tuesday', short: 'อ.', color: '#ef4444',
    note: 'อังคาร is named after the planet Mars (Mangala in Sanskrit). Mars = red, which is why Tuesday\'s colour in Thai tradition is red.',
    mnemonic: 'Ang khaan — "angry" — Mars the angry red planet. Tuesday is red day.',
    example: { thai: 'วันอังคารที่แล้ว', roman: 'wan ang khaan thii laeo', english: 'last Tuesday' },
  },
  {
    thai: 'วันพุธ', roman: 'wan phut', english: 'Wednesday', short: 'พ.', color: '#22c55e',
    note: 'พุธ is named after Mercury (Budha in Sanskrit). Wednesday\'s colour is green in Thai tradition. วันพุธ is also Buddha\'s day — many Thais visit temples on Wednesdays.',
    mnemonic: 'Phut — like "put" — put yourself in the middle of the week. Wednesday.',
    example: { thai: 'วันพุธหน้า', roman: 'wan phut naa', english: 'next Wednesday' },
  },
  {
    thai: 'วันพฤหัสบดี', roman: 'wan phá-rúe-hàt', english: 'Thursday', short: 'พฤ.', color: '#f97316',
    note: 'The longest day name! พฤหัสบดี is named after Jupiter (Brihaspati). Often shortened in speech to วันพฤหัส (wan phá-rúe-hàt). Orange is Thursday\'s traditional colour.',
    mnemonic: 'The hardest to say — practice slowly: phá-rúe-hàt. Thor\'s day (Thursday) — Jupiter is the king of gods like Thor.',
    example: { thai: 'วันพฤหัสนี้', roman: 'wan phá-rúe-hàt nii', english: 'this Thursday' },
  },
  {
    thai: 'วันศุกร์', roman: 'wan suk', english: 'Friday', short: 'ศ.', color: '#3b82f6',
    note: 'ศุกร์ is named after Venus (Shukra in Sanskrit). Friday\'s colour is blue in Thai tradition. วันศุกร์ is a favourite — end of the school week!',
    mnemonic: 'Suk sounds like "sook" — Friday brings suksan (happiness)! Also, สุข means happiness in Thai.',
    example: { thai: 'วันศุกร์เย็น', roman: 'wan suk yen', english: 'Friday evening' },
  },
  {
    thai: 'วันเสาร์', roman: 'wan sao', english: 'Saturday', short: 'ส.', color: '#8b5cf6',
    note: 'เสาร์ is named after Saturn (Shani in Sanskrit). Purple/violet is Saturday\'s colour in Thai tradition.',
    mnemonic: 'Sao — "Saturday" starts with S, and สาว (sao) means young woman — Saturday night out!',
    example: { thai: 'วันเสาร์อาทิตย์', roman: 'wan sao aa thit', english: 'Saturday and Sunday (weekend)' },
  },
  {
    thai: 'วันอาทิตย์', roman: 'wan aa thit', english: 'Sunday', short: 'อา.', color: '#ef4444',
    note: 'อาทิตย์ is named after the Sun (Aditya in Sanskrit). Sunday\'s colour is red — the same as Tuesday. Thai school uniforms are colour-coded by day at some schools.',
    mnemonic: 'Aa thit — "a hit" — Sunday is a hit! Also อาทิตย์ means sun AND week in Thai.',
    example: { thai: 'สุดสัปดาห์', roman: 'sut sap daa', english: 'weekend' },
  },
]

const SCRIPT_Q = DAYS.map(d => ({
  thai: d.thai, roman: d.roman, english: d.english,
  options: [d.english, ...DAYS.filter(x => x.english !== d.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
})).sort(() => Math.random() - 0.5)

const QUIZ_Q = [
  { q: 'What does "wan" (วัน) mean in Thai?', correct: 'Day', options: ['Week', 'Day', 'Month', 'Time'] },
  { q: 'How do you say Monday in Thai?', correct: 'Wan jan', options: ['Wan suk', 'Wan jan', 'Wan sao', 'Wan phut'] },
  { q: 'Which day is named after the planet Venus?', correct: 'Friday', options: ['Monday', 'Wednesday', 'Friday', 'Sunday'] },
  { q: 'How do you say "next Wednesday" in Thai?', correct: 'Wan phut naa', options: ['Wan phut nii', 'Wan phut laeo', 'Wan phut naa', 'Wan phut yen'] },
  { q: 'Which Thai day also means "sun" AND "week"?', correct: 'Wan aa thit (Sunday)', options: ['Wan jan (Monday)', 'Wan suk (Friday)', 'Wan aa thit (Sunday)', 'Wan sao (Saturday)'] },
  { q: 'How do you say Friday in Thai?', correct: 'Wan suk', options: ['Wan jan', 'Wan phut', 'Wan suk', 'Wan sao'] },
  { q: 'What is the Thai word for "weekend"?', correct: 'Sut sap daa', options: ['Wan aa thit', 'Sut sap daa', 'Wan sao aa thit', 'Nueng aathit'] },
  { q: 'Thai days of the week are named after...?', correct: 'Planets and celestial bodies', options: ['Thai kings', 'Animals', 'Planets and celestial bodies', 'Numbers'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit6Lesson1() {
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

  const card = DAYS[cardIndex]
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
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e, #0369a1)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 6 · Lesson 1 — Days of the Week</div>
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
        <div style={{ background: 'rgba(3,105,161,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(3,105,161,0.1)' }}>
          <span style={{ color: '#0369a1', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {DAYS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#0369a1', borderRadius: '10px', width: `${((cardIndex + 1) / DAYS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: card.color, fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>{card.english}</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #0369a1' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>📅 Days of the Week</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                All Thai days start with <strong>วัน (wan)</strong> meaning "day". Each day is named after a planet from Sanskrit tradition — the same system used in Indian and Burmese calendars. Each day also has a traditional colour.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {DAYS.map((d, i) => (
                  <div key={i} style={{ background: d.color, color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>
                    {d.short} {d.english}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: `linear-gradient(135deg, #0c4a6e, ${card.color})`, padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>{card.english}</div>
              <div style={{ fontSize: '60px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '10px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>{card.roman}</div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 16px', borderRadius: '20px', color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>Short: {card.short}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>🐢 Slow</button>
              </div>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '2px solid #bae6fd' }}>
                <div style={{ color: '#0369a1', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: card.color }}>{card.example.thai}</div>
                  <div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '15px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)} style={{ marginLeft: 'auto', background: card.color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🔊</button>
                </div>
              </div>
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Origin</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 16px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Memory tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.mnemonic}</p>
              </div>
            </div>
          </div>

          {/* Day colour strip */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>All 7 Days</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {DAYS.map((d, i) => (
                <button key={i} onClick={() => { setCardIndex(i); speak(d.thai) }}
                  style={{ background: i === cardIndex ? d.color : '#f9fafb', color: i === cardIndex ? 'white' : '#374151', border: `2px solid ${i === cardIndex ? d.color : '#e5e7eb'}`, borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center', minWidth: '44px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800' }}>{d.short}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>{d.english.slice(0, 3)}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < DAYS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(DAYS[cardIndex + 1].thai) }}
                style={{ flex: 1, background: `linear-gradient(135deg, #0c4a6e, ${DAYS[cardIndex + 1].color})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {DAYS[cardIndex + 1].english} →
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
            <span style={{ color: '#0369a1', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#0369a1', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
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
                  if (isCorrect) { bg = '#f0f9ff'; border = '#0369a1'; textColor = '#0c4a6e' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#0369a1', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f0f9ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#bae6fd' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#0c4a6e', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #0c4a6e, #0369a1)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #0369a1' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition — Days</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai day name and choose the correct English day. Random order each time.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#0369a1', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#0369a1', borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Which day is this?</div>
              <div style={{ fontSize: '52px', fontWeight: '900', color: '#0369a1', lineHeight: 1.1, marginBottom: '12px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#f0f9ff', color: '#0369a1', border: '2px solid #bae6fd', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isCorrect = opt === SCRIPT_Q[scriptIndex].english
                const isSelected = scriptSelected === opt
                const dayColor = DAYS.find(d => d.english === opt)?.color || '#6b7280'
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#f0f9ff'; border = '#0369a1'; textColor = '#0c4a6e' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => {
                    if (scriptSelected) return
                    setScriptSelected(opt)
                    if (isCorrect) setScriptScore(prev => prev + 1)
                    setScriptAnswers(prev => [...prev, isCorrect])
                  }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '18px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: dayColor, margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '16px', fontWeight: '900', color: textColor }}>{opt}</div>
                    {scriptSelected && isCorrect && <div style={{ color: '#0369a1', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                    {scriptSelected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#f0f9ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? '#bae6fd' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: '#0c4a6e', fontWeight: '700' }}>✅ Correct! {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english}</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
              }
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #0c4a6e, #0369a1)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
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
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#0369a1' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#f0f9ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #bae6fd', textAlign: 'left' }}>
              <div style={{ color: '#0c4a6e', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You know all 7 days of the week in Thai. Next: months of the year — then you can talk about dates and schedules!</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-6/lesson-2" style={{ display: 'block', background: 'linear-gradient(135deg, #0c4a6e, #0369a1)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Months of the Year →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
