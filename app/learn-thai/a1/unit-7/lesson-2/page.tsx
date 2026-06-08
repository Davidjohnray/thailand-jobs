'use client'
import { useState } from 'react'
import Link from 'next/link'

const DESCRIPTORS = [
  {
    category: 'Age', emoji: '🎂', color: '#f59e0b',
    words: [
      { thai: 'อายุ', roman: 'aa yu', english: 'Age', example: 'อายุเท่าไร (how old are you?)' },
      { thai: 'อายุ...ปี', roman: 'aa yu...pii', english: '...years old', example: 'อายุสามสิบปี (30 years old)' },
      { thai: 'เด็ก', roman: 'dek', english: 'Child / young', example: 'เด็กน้อย (little child)' },
      { thai: 'ผู้ใหญ่', roman: 'phuu yai', english: 'Adult', example: 'ผู้ใหญ่ใจดี (kind-hearted adult)' },
      { thai: 'แก่', roman: 'gae', english: 'Old (person)', example: 'คนแก่ (elderly person)' },
    ],
    note: 'To say your age: อายุ + number + ปี. So "I am 35 years old" = ฉันอายุสามสิบห้าปี. ปี means year.',
  },
  {
    category: 'Size & Height', emoji: '📏', color: '#0ea5e9',
    words: [
      { thai: 'สูง', roman: 'suung', english: 'Tall', example: 'ผู้ชายสูง (tall man)' },
      { thai: 'เตี้ย', roman: 'tia', english: 'Short (height)', example: 'คนเตี้ย (short person)' },
      { thai: 'ใหญ่', roman: 'yai', english: 'Big / large', example: 'ตัวใหญ่ (big body)' },
      { thai: 'เล็ก', roman: 'lek', english: 'Small / little', example: 'ตัวเล็ก (small/slim)' },
      { thai: 'อ้วน', roman: 'uan', english: 'Fat / chubby', example: 'หน่อยอ้วนขึ้น (a bit chubbier)' },
      { thai: 'ผอม', roman: 'phoom', english: 'Thin / slim', example: 'ผอมมาก (very slim)' },
    ],
    note: 'In Thai culture, commenting on weight is common and not usually offensive — อ้วนขึ้น (gained weight) is said casually. Don\'t be surprised if people mention it!',
  },
  {
    category: 'Appearance', emoji: '👀', color: '#8b5cf6',
    words: [
      { thai: 'สวย', roman: 'suai', english: 'Beautiful (woman)', example: 'สวยมาก (very beautiful)' },
      { thai: 'หล่อ', roman: 'loo', english: 'Handsome (man)', example: 'หล่อมาก (very handsome)' },
      { thai: 'น่ารัก', roman: 'naa rak', english: 'Cute / adorable', example: 'น่ารักจัง (so cute!)' },
      { thai: 'ผมสั้น', roman: 'phom san', english: 'Short hair', example: 'ผมสั้นสีดำ (short black hair)' },
      { thai: 'ผมยาว', roman: 'phom yaao', english: 'Long hair', example: 'ผมยาวสวย (beautiful long hair)' },
    ],
    note: 'สวยมาก and น่ารักจัง are great compliments — Thais love giving and receiving them. จัง intensifies the feeling: น่ารักจัง = so incredibly cute!',
  },
  {
    category: 'Personality', emoji: '😊', color: '#22c55e',
    words: [
      { thai: 'ใจดี', roman: 'jai dii', english: 'Kind-hearted', example: 'ครูใจดี (kind teacher)' },
      { thai: 'ขยัน', roman: 'kha yan', english: 'Hard-working', example: 'นักเรียนขยัน (hard-working student)' },
      { thai: 'ขี้เกียจ', roman: 'khii giat', english: 'Lazy', example: 'ขี้เกียจมาก (very lazy)' },
      { thai: 'ฉลาด', roman: 'cha laat', english: 'Clever / smart', example: 'เด็กฉลาด (clever child)' },
      { thai: 'ตลก', roman: 'ta lok', english: 'Funny', example: 'ตลกมาก (very funny)' },
      { thai: 'เงียบ', roman: 'ngiap', english: 'Quiet / calm', example: 'นิสัยเงียบ (quiet personality)' },
    ],
    note: 'ใจดี literally means "good heart" — ใจ = heart, ดี = good. Many Thai personality words use ใจ: ใจร้อน (impatient, literally "hot heart"), ใจเย็น (calm, literally "cool heart").',
  },
]

const ALL_WORDS = DESCRIPTORS.flatMap(d => d.words)

const SCRIPT_Q = ALL_WORDS.sort(() => Math.random() - 0.5).slice(0, 10).map(w => ({
  thai: w.thai, roman: w.roman, english: w.english,
  options: [w.english, ...ALL_WORDS.filter(x => x.english !== w.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
}))

const QUIZ_Q = [
  { q: 'How do you say "I am 30 years old" in Thai?', correct: 'Chan aa yu saam sip pii', options: ['Chan aa yu saam sip', 'Chan aa yu saam sip pii', 'Saam sip pii chan', 'Aa yu chan saam sip'] },
  { q: 'What does "suai" mean?', correct: 'Beautiful (woman)', options: ['Handsome (man)', 'Beautiful (woman)', 'Cute', 'Tall'] },
  { q: 'What does "jai dii" literally mean?', correct: 'Good heart', options: ['Kind face', 'Good heart', 'Smart mind', 'Happy soul'] },
  { q: 'How do you say "hard-working" in Thai?', correct: 'Kha yan', options: ['Cha laat', 'Ta lok', 'Kha yan', 'Khii giat'] },
  { q: 'Which word means "lazy"?', correct: 'Khii giat', options: ['Kha yan', 'Cha laat', 'Khii giat', 'Jai dii'] },
  { q: 'In Thai culture, commenting on someone\'s weight is...?', correct: 'Common and usually not offensive', options: ['Very rude', 'Common and usually not offensive', 'Only said to family', 'Never done'] },
  { q: 'What does "naa rak" mean?', correct: 'Cute / adorable', options: ['Beautiful', 'Handsome', 'Cute / adorable', 'Funny'] },
  { q: '"Jai yen" literally means "cool heart" — what personality does it describe?', correct: 'Calm / relaxed', options: ['Cold / unfriendly', 'Calm / relaxed', 'Shy', 'Serious'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit7Lesson2() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'script' | 'complete'>('learn')
  const [catIndex, setCatIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [scriptSelected, setScriptSelected] = useState<string | null>(null)
  const [scriptScore, setScriptScore] = useState(0)
  const [scriptAnswers, setScriptAnswers] = useState<boolean[]>([])

  const cat = DESCRIPTORS[catIndex]
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
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #6d28d9)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 7 · Lesson 2 — Describing People</div>
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
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 24px' }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {DESCRIPTORS.map((d, i) => (
              <button key={i} onClick={() => setCatIndex(i)}
                style={{ background: i === catIndex ? d.color : 'white', color: i === catIndex ? 'white' : '#374151', border: `2px solid ${i === catIndex ? d.color : '#e5e7eb'}`, padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.15s' }}>
                {d.emoji} {d.category}
              </button>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${cat.color}` }}>
            <div style={{ color: cat.color, fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{cat.emoji} {cat.category}</div>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{cat.note}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {cat.words.map((word, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `4px solid ${cat.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '28px', fontWeight: '900', color: cat.color }}>{word.thai}</span>
                      <span style={{ color: '#6b7280', fontSize: '16px', fontWeight: '600' }}>{word.roman}</span>
                    </div>
                    <div style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{word.english}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{word.example}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => speak(word.thai)}
                      style={{ background: cat.color + '15', color: cat.color, border: `1px solid ${cat.color}30`, padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🔊</button>
                    <button onClick={() => speak(word.thai, 0.5)}
                      style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>🐢</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {catIndex > 0 && <button onClick={() => setCatIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {catIndex + 1 < DESCRIPTORS.length ? (
              <button onClick={() => setCatIndex(prev => prev + 1)}
                style={{ flex: 1, background: `linear-gradient(135deg, #1a1a2e, ${DESCRIPTORS[catIndex + 1].color})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {DESCRIPTORS[catIndex + 1].emoji} {DESCRIPTORS[catIndex + 1].category} →
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
            <span style={{ color: '#6d28d9', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#6d28d9', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
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
                  if (isCorrect) { bg = '#f5f3ff'; border = '#6d28d9'; textColor = '#4c1d95' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#6d28d9', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f5f3ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#ede9fe' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#4c1d95', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #1a1a2e, #6d28d9)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #6d28d9' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition — Descriptions</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai word and choose the correct English meaning. 10 random questions from all categories.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#6d28d9', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#6d28d9', borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What does this mean?</div>
              <div style={{ fontSize: '64px', fontWeight: '900', color: '#6d28d9', lineHeight: 1, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#f5f3ff', color: '#6d28d9', border: '2px solid #ede9fe', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isCorrect = opt === SCRIPT_Q[scriptIndex].english
                const isSelected = scriptSelected === opt
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#f5f3ff'; border = '#6d28d9'; textColor = '#4c1d95' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => {
                    if (scriptSelected) return
                    setScriptSelected(opt)
                    if (isCorrect) setScriptScore(prev => prev + 1)
                    setScriptAnswers(prev => [...prev, isCorrect])
                  }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {scriptSelected && isCorrect && <span style={{ color: '#6d28d9', fontSize: '20px' }}>✓</span>}
                    {scriptSelected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#f5f3ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? '#ede9fe' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: '#4c1d95', fontWeight: '700' }}>✅ Correct! {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english}</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
              }
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #1a1a2e, #6d28d9)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
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
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#6d28d9' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#f5f3ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #ede9fe', textAlign: 'left' }}>
              <div style={{ color: '#4c1d95', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can describe people in Thai — age, size, appearance, and personality. One lesson left: putting it all together with introductions!</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-7/lesson-3" style={{ display: 'block', background: 'linear-gradient(135deg, #1a1a2e, #6d28d9)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Introductions →
              </Link>
              <button onClick={() => { setPhase('learn'); setCatIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
