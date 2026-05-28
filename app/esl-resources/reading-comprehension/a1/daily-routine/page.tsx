'use client'
import { useState } from 'react'
import Link from 'next/link'

const LANGUAGES = [
  { value: 'none', label: '🌍 English only' },
  { value: 'Thai', label: '🇹🇭 Thai' },
  { value: 'Japanese', label: '🇯🇵 Japanese' },
  { value: 'Korean', label: '🇰🇷 Korean' },
  { value: 'Chinese', label: '🇨🇳 Chinese' },
  { value: 'Arabic', label: '🇸🇦 Arabic' },
  { value: 'Spanish', label: '🇪🇸 Spanish' },
  { value: 'French', label: '🇫🇷 French' },
  { value: 'German', label: '🇩🇪 German' },
  { value: 'Portuguese', label: '🇧🇷 Portuguese' },
  { value: 'Russian', label: '🇷🇺 Russian' },
  { value: 'Vietnamese', label: '🇻🇳 Vietnamese' },
  { value: 'Indonesian', label: '🇮🇩 Indonesian' },
]

const VOCAB = [
  { word: 'Wake up', meaning: 'Stop sleeping', emoji: '🌅' },
  { word: 'Breakfast', meaning: 'First meal of the day', emoji: '🍞' },
  { word: 'Work', meaning: 'Job / place of employment', emoji: '💼' },
  { word: 'Lunch', meaning: 'Meal at midday', emoji: '🥗' },
  { word: 'Dinner', meaning: 'Evening meal', emoji: '🍽️' },
  { word: 'Go to bed', meaning: 'Stop the day and sleep', emoji: '🛏️' },
]

const QUESTIONS = [
  { q: 'What time does the person wake up?', options: ['6 o\'clock', '7 o\'clock', '8 o\'clock'], answer: 1, emoji: '⏰' },
  { q: 'What does the person drink at breakfast?', options: ['Tea', 'Milk', 'Coffee'], answer: 2, emoji: '☕' },
  { q: 'Where does the person work?', options: ['At home', 'In an office', 'In a school'], answer: 1, emoji: '🏢' },
  { q: 'What time does work finish?', options: ['4 o\'clock', '5 o\'clock', '6 o\'clock'], answer: 1, emoji: '🕔' },
  { q: 'What does the person do after dinner?', options: ['Works', 'Sleeps', 'Watches TV'], answer: 2, emoji: '📺' },
]

const PASSAGE = `I wake up at 7 o'clock every day.
I get out of bed and wash my face.
At 7:30, I eat breakfast. I drink coffee and eat bread.
At 8 o'clock, I go to work.
I work in an office. I start work at 9 o'clock.
I have lunch at 12 o'clock with my coworkers.
I finish work at 5 o'clock.
After work, I go home.
I eat dinner at 7 o'clock and watch TV.
At 10:30, I go to bed.
I sleep and get ready for the next day.`

const LISTENING_SCRIPT = `I wake up at seven o'clock. I eat breakfast at seven thirty. I go to work at eight o'clock. I finish work at five o'clock. I go to bed at ten thirty.`

const SPEEDS = [
  { label: '🐢 Very Slow', value: 0.55 },
  { label: '🚶 Slow', value: 0.72 },
  { label: '🏃 Normal', value: 0.9 },
  { label: '⚡ Fast', value: 1.1 },
]

// ── Translation helper ────────────────────────────────────────
async function fetchTranslation(text: string, lang: string, type: 'vocab' | 'question'): Promise<string> {
  const systems: Record<string, string> = {
    vocab: `You are a language learning assistant for A1 beginner English students. Translate this English word and its meaning to ${lang}. Return ONLY the translated word and its meaning in ${lang} (max 20 words). No English, no extra text.`,
    question: `You are a translator. Translate this simple English question to ${lang}. Return ONLY the translated question. No extra text.`,
  }
  const res = await fetch('/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systems[type], messages: [{ role: 'user', content: text }] }),
  })
  const data = await res.json()
  return data.content || ''
}

// ── Translate Button ──────────────────────────────────────────
function TranslateBtn({ text, type, lang, color, onTranslated }: {
  text: string; type: 'vocab' | 'question'; lang: string; color: string; onTranslated: (t: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleClick = async () => {
    if (lang === 'none' || loading || done) return
    setLoading(true)
    const result = await fetchTranslation(text, lang, type)
    onTranslated(result); setDone(true); setLoading(false)
  }

  const isDisabled = lang === 'none'
  return (
    <button onClick={handleClick} disabled={isDisabled || loading || done}
      title={isDisabled ? 'Select a language above to translate' : done ? 'Translated' : `Translate to ${lang}`}
      style={{ background: isDisabled ? '#f3f4f6' : done ? '#f0fdf4' : color + '15', color: isDisabled ? '#d1d5db' : done ? '#16a34a' : color, border: `1px solid ${isDisabled ? '#e5e7eb' : done ? '#86efac' : color + '40'}`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: isDisabled ? 'not-allowed' : done ? 'default' : 'pointer', fontWeight: '700', flexShrink: 0, transition: 'all 0.2s' }}>
      {loading ? '...' : done ? '✓ 🌍' : '🌍'}
    </button>
  )
}

function speak(text: string, rate: number) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-GB'; u.rate = rate; u.pitch = 1
  window.speechSynthesis.speak(u)
}

function stop() {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
}

export default function DailyRoutinePage() {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [writing, setWriting] = useState({ wakeUp: '', breakfast: '', bed: '' })
  const [section, setSection] = useState<'warmup' | 'reading' | 'vocab' | 'questions' | 'listening' | 'speaking' | 'writing'>('warmup')
  const [speed, setSpeed] = useState(0.9)
  const [translationLang, setTranslationLang] = useState('none')
  const [vocabTranslations, setVocabTranslations] = useState<Record<string, string>>({})
  const [speakingTranslations, setSpeakingTranslations] = useState<Record<number, string>>({})
  const [warmupTranslations, setWarmupTranslations] = useState<Record<number, string>>({})

  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (submitted) return
    setAnswers(prev => { const n = [...prev]; n[qIdx] = optIdx; return n })
  }

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time])
  }

  const score = answers.filter((a, i) => a === QUESTIONS[i].answer).length
  const allAnswered = answers.every(a => a !== null)

  const SECTIONS = [
    { id: 'warmup', label: '💬 Warm-up', color: '#f59e0b' },
    { id: 'reading', label: '📖 Reading', color: '#3b82f6' },
    { id: 'vocab', label: '📚 Vocab', color: '#8b5cf6' },
    { id: 'questions', label: '❓ Questions', color: '#E85D26' },
    { id: 'listening', label: '🔊 Listening', color: '#06b6d4' },
    { id: 'speaking', label: '🗣️ Speaking', color: '#22c55e' },
    { id: 'writing', label: '✍️ Writing', color: '#ec4899' },
  ]

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← A1 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>⏰</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#16a34a', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>A1 Beginner</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Daily Life</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 1</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>My Daily Routine</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>
                Learn to talk about your daily routine — waking up, eating meals, going to work and going to bed.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[{ icon: '📖', label: 'Short reading text' }, { icon: '📚', label: '6 vocabulary words' }, { icon: '❓', label: '5 comprehension questions' }, { icon: '🌍', label: '13-language translation' }, { icon: '✍️', label: 'Writing practice' }, { icon: '⏱️', label: '30–45 min lesson' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* STICKY NAV + SPEED + LANGUAGE */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '10px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Section tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setSection(s.id as any)}
                style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', background: section === s.id ? s.color : '#f0f0f0', color: section === s.id ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {s.label}
              </button>
            ))}
          </div>
          {/* Speed + Language row */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🔊 Speed:</span>
              {SPEEDS.map(s => (
                <button key={s.value} onClick={() => setSpeed(s.value)}
                  style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#16a34a' : '#e5e7eb', background: speed === s.value ? '#16a34a' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🌍 Translate to:</span>
              <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setSpeakingTranslations({}); setWarmupTranslations({}) }}
                style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? '#16a34a' : '#e5e7eb', background: translationLang !== 'none' ? '#f0fdf4' : 'white', color: translationLang !== 'none' ? '#15803d' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* WARM-UP */}
        {section === 'warmup' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #f59e0b22, #f59e0b08)', borderLeft: '5px solid #f59e0b', padding: '20px 24px' }}>
              <div style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 1 — 3 to 5 minutes</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>💬 Warm-up Questions</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ color: '#555', fontSize: '15px', marginBottom: '20px', lineHeight: '1.6' }}>Ask your student these questions. Short answers are fine — single words or simple sentences.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { q: 'What time do you wake up?', hint: 'e.g. Seven o\'clock / 6:30' },
                  { q: 'Do you eat breakfast?', hint: 'e.g. Yes / No / Sometimes' },
                  { q: 'Do you work or study?', hint: 'e.g. I work. / I study.' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fffbeb', borderRadius: '14px', padding: '16px 20px', border: '2px solid #fde68a' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ background: '#f59e0b', color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a2e' }}>{item.q}</div>
                          <TranslateBtn text={item.q} type="question" lang={translationLang} color="#f59e0b"
                            onTranslated={(t) => setWarmupTranslations(prev => ({ ...prev, [i]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#d1d5db', fontSize: '11px' }}>← select a language</span>}
                        </div>
                        <div style={{ color: '#92400e', fontSize: '13px' }}>💡 {item.hint}</div>
                        {warmupTranslations[i] && (
                          <div style={{ marginTop: '8px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '8px 12px' }}>
                            <span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>{currentLang?.label}</span>
                            <span style={{ color: '#374151', fontSize: '15px' }}>{warmupTranslations[i]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSection('reading')} style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>Ready! → Start Reading</button>
            </div>
          </div>
        )}

        {/* READING */}
        {section === 'reading' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f622, #3b82f608)', borderLeft: '5px solid #3b82f6', padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 2 — Read Together</div>
                <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>📖 My Daily Routine</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => speak(PASSAGE, speed)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 3px 10px rgba(59,130,246,0.4)' }}>▶ Play</button>
                <button onClick={stop} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop</button>
              </div>
            </div>
            <div style={{ padding: '28px' }}>
              <div style={{ background: '#f8faff', borderRadius: '16px', padding: '24px', border: '1px solid #e0e7ff' }}>
                {PASSAGE.split('\n').map((line, i) => (
                  <p key={i} style={{ color: '#1e3a5f', fontSize: '18px', lineHeight: '2', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>{line}</p>
                ))}
              </div>
              <button onClick={() => setSection('vocab')} style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.4)' }}>→ Study Vocabulary</button>
            </div>
          </div>
        )}

        {/* VOCAB */}
        {section === 'vocab' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf622, #8b5cf608)', borderLeft: '5px solid #8b5cf6', padding: '20px 24px' }}>
              <div style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 3 — Key Words</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>📚 Vocabulary</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {VOCAB.map(v => (
                  <div key={v.word} style={{ background: '#faf5ff', borderRadius: '14px', padding: '16px', border: '2px solid #e9d5ff' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '36px', flexShrink: 0 }}>{v.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '16px' }}>{v.word}</span>
                          <button onClick={() => speak(v.word, speed)} style={{ background: '#8b5cf615', color: '#8b5cf6', border: '1px solid #8b5cf630', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700' }}>🔊</button>
                          <TranslateBtn text={`${v.word}: ${v.meaning}`} type="vocab" lang={translationLang} color="#8b5cf6"
                            onTranslated={(t) => setVocabTranslations(prev => ({ ...prev, [v.word]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#d1d5db', fontSize: '11px' }}>← translate</span>}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>{v.meaning}</div>
                        {vocabTranslations[v.word] && (
                          <div style={{ marginTop: '8px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '8px 10px' }}>
                            <span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>{currentLang?.label}</span>
                            <span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{vocabTranslations[v.word]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSection('questions')} style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.4)' }}>→ Answer the Questions</button>
            </div>
          </div>
        )}

        {/* COMPREHENSION QUESTIONS */}
        {section === 'questions' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #E85D2622, #E85D2608)', borderLeft: '5px solid #E85D26', padding: '20px 24px' }}>
              <div style={{ color: '#E85D26', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 4 — Choose the Correct Answer</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>❓ Reading Comprehension</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                {QUESTIONS.map((q, qi) => (
                  <div key={qi} style={{ background: '#f9fafb', borderRadius: '16px', padding: '20px', border: submitted && answers[qi] === q.answer ? '2px solid #22c55e' : submitted && answers[qi] !== q.answer ? '2px solid #ef4444' : '2px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <span style={{ fontSize: '24px' }}>{q.emoji}</span>
                      <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e', lineHeight: '1.4' }}><span style={{ color: '#E85D26', marginRight: '6px' }}>{qi + 1}.</span>{q.q}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {q.options.map((opt, oi) => {
                        const isSelected = answers[qi] === oi; const isCorrect = oi === q.answer
                        let bg = 'white', border = '#e5e7eb', color = '#374151'
                        if (submitted) { if (isCorrect) { bg = '#dcfce7'; border = '#16a34a'; color = '#14532d' } else if (isSelected && !isCorrect) { bg = '#fee2e2'; border = '#ef4444'; color = '#7f1d1d' } } else if (isSelected) { bg = '#eff6ff'; border = '#3b82f6'; color = '#1e3a5f' }
                        return (
                          <button key={oi} onClick={() => handleAnswer(qi, oi)} disabled={submitted}
                            style={{ background: bg, border: `2px solid ${border}`, borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: submitted ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                            <span style={{ background: border, color: isSelected || (submitted && isCorrect) ? 'white' : '#9ca3af', width: '26px', height: '26px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                              {submitted && isCorrect ? '✓' : submitted && isSelected && !isCorrect ? '✗' : String.fromCharCode(97 + oi)}
                            </span>
                            <span style={{ fontWeight: '600', fontSize: '15px', color }}>{opt}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {!submitted ? (
                <button onClick={() => setSubmitted(true)} disabled={!allAnswered}
                  style={{ width: '100%', background: allAnswered ? 'linear-gradient(135deg, #E85D26, #f97316)' : '#e5e7eb', color: allAnswered ? 'white' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: allAnswered ? 'pointer' : 'not-allowed', boxShadow: allAnswered ? '0 4px 14px rgba(232,93,38,0.4)' : 'none' }}>
                  {allAnswered ? '✅ Check My Answers' : 'Answer all questions first'}
                </button>
              ) : (
                <div>
                  <div style={{ background: score === QUESTIONS.length ? '#dcfce7' : score >= 3 ? '#fffbeb' : '#fee2e2', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '16px', border: `2px solid ${score === QUESTIONS.length ? '#16a34a' : score >= 3 ? '#f59e0b' : '#ef4444'}` }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>{score === QUESTIONS.length ? '🏆' : score >= 3 ? '⭐' : '💪'}</div>
                    <div style={{ fontWeight: '900', fontSize: '24px', color: '#1a1a2e', marginBottom: '4px' }}>{score} out of {QUESTIONS.length} correct!</div>
                    <div style={{ color: '#555', fontSize: '15px' }}>{score === QUESTIONS.length ? 'Perfect score — well done!' : score >= 3 ? 'Good work! Review the wrong answers.' : 'Keep trying — read the passage again!'}</div>
                  </div>
                  <button onClick={() => setSection('listening')} style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(6,182,212,0.4)' }}>→ Listening Practice</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LISTENING */}
        {section === 'listening' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #06b6d422, #06b6d408)', borderLeft: '5px solid #06b6d4', padding: '20px 24px' }}>
              <div style={{ color: '#06b6d4', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 5 — Listen Carefully</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>🔊 Listening Practice</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ color: '#555', fontSize: '15px', marginBottom: '20px', lineHeight: '1.6' }}>Listen to the short passage below. Circle the times you hear. You can listen more than once!</p>
              <div style={{ background: '#ecfeff', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '2px solid #67e8f9' }}>
                <div style={{ color: '#0e7490', fontSize: '13px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>🎧 Listening Script</div>
                {LISTENING_SCRIPT.split('. ').filter(Boolean).map((s, i, arr) => (
                  <p key={i} style={{ color: '#164e63', fontSize: '17px', lineHeight: '1.8', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>{s}{i < arr.length - 1 ? '.' : ''}</p>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => speak(LISTENING_SCRIPT, speed)} style={{ background: '#06b6d4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 3px 10px rgba(6,182,212,0.4)' }}>▶ Play Listening</button>
                <button onClick={stop} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '12px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>⏹ Stop</button>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '16px', padding: '20px', border: '2px solid #86efac', marginBottom: '20px' }}>
                <div style={{ color: '#15803d', fontSize: '13px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>✅ Which times did you hear? Tap to select:</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['6:00', '7:00', '7:30', '8:00', '9:00', '12:00', '5:00', '7:00 (dinner)', '10:30'].map(time => {
                    const isSelected = selectedTimes.includes(time)
                    return (
                      <button key={time} onClick={() => toggleTime(time)}
                        style={{ padding: '10px 18px', borderRadius: '12px', border: '2px solid', borderColor: isSelected ? '#16a34a' : '#e5e7eb', background: isSelected ? '#16a34a' : 'white', color: isSelected ? 'white' : '#374151', fontWeight: '700', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>
              <button onClick={() => setSection('speaking')} style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.4)' }}>→ Speaking Practice</button>
            </div>
          </div>
        )}

        {/* SPEAKING */}
        {section === 'speaking' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #22c55e22, #22c55e08)', borderLeft: '5px solid #22c55e', padding: '20px 24px' }}>
              <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 6 — Speak in Full Sentences</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>🗣️ Speaking Practice</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', border: '2px solid #86efac', marginBottom: '20px' }}>
                <div style={{ color: '#15803d', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>📝 Model sentence:</div>
                <div style={{ color: '#14532d', fontSize: '18px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>I wake up at 6 o'clock.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {[
                  { q: 'What time do you wake up?', hint: 'I wake up at _____ o\'clock.', emoji: '🌅' },
                  { q: 'What do you eat for breakfast?', hint: 'I eat _____ for breakfast.', emoji: '🍳' },
                  { q: 'What time do you go to bed?', hint: 'I go to bed at _____ o\'clock.', emoji: '🛏️' },
                  { q: 'What do you do after work or school?', hint: 'After work, I _____.', emoji: '🏠' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', border: '2px solid #86efac' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a2e' }}>{item.q}</div>
                          <TranslateBtn text={item.q} type="question" lang={translationLang} color="#22c55e"
                            onTranslated={(t) => setSpeakingTranslations(prev => ({ ...prev, [i]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#d1d5db', fontSize: '11px' }}>← select a language</span>}
                        </div>
                        {speakingTranslations[i] && (
                          <div style={{ marginBottom: '6px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '8px 10px' }}>
                            <span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>{currentLang?.label}</span>
                            <span style={{ color: '#374151', fontSize: '15px' }}>{speakingTranslations[i]}</span>
                          </div>
                        )}
                        <div style={{ color: '#16a34a', fontSize: '14px', fontStyle: 'italic' }}>💡 {item.hint}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSection('writing')} style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899, #be185d)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(236,72,153,0.4)' }}>→ Writing Practice</button>
            </div>
          </div>
        )}

        {/* WRITING */}
        {section === 'writing' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #ec489922, #ec489908)', borderLeft: '5px solid #ec4899', padding: '20px 24px' }}>
              <div style={{ color: '#ec4899', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 7 — Complete the Sentences</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>✍️ Writing Practice</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ color: '#555', fontSize: '15px', marginBottom: '20px' }}>Complete the sentences about <strong>your own</strong> daily routine.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'I wake up at', key: 'wakeUp' as const, placeholder: 'e.g. 7 o\'clock', emoji: '🌅' },
                  { label: 'I eat breakfast at', key: 'breakfast' as const, placeholder: 'e.g. 7:30 / I don\'t eat breakfast', emoji: '🍳' },
                  { label: 'I go to bed at', key: 'bed' as const, placeholder: 'e.g. 11 o\'clock', emoji: '🛏️' }
                ].map(item => (
                  <div key={item.key} style={{ background: '#fdf2f8', borderRadius: '14px', padding: '16px 20px', border: '2px solid #f9a8d4' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                      <span style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a2e' }}>{item.label}</span>
                    </div>
                    <input value={writing[item.key]} onChange={e => setWriting(prev => ({ ...prev, [item.key]: e.target.value }))} placeholder={item.placeholder}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #f9a8d4', fontSize: '16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Georgia, serif', color: '#1a1a2e' }} />
                  </div>
                ))}
              </div>
              <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '24px' }}>
                <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>🎓 Lesson Outcome — A1 Can-Do</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Read a short text about daily routines ✅', 'Understand basic time expressions ✅', 'Answer simple comprehension questions ✅', 'Talk about your own daily routine ✅'].map((item, i) => (
                    <div key={i} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ color: '#22c55e', fontWeight: '900' }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <Link href="/esl-resources/reading-comprehension/a1" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to A1 Reading Comprehension</Link>
        </div>
      </div>
    </main>
  )
}
