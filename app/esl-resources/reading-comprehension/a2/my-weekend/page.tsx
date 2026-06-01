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
  { word: 'Weekend', meaning: 'Saturday and Sunday — the days when you don\'t work or go to school', emoji: '📅' },
  { word: 'Usual', meaning: 'Normal — the same as always, what happens most of the time', emoji: '🔄' },
  { word: 'Afternoon', meaning: 'The time between 12 o\'clock midday and the evening', emoji: '🌤️' },
  { word: 'Market', meaning: 'A place where people sell food, clothes and other things — often outside', emoji: '🛒' },
  { word: 'Finish', meaning: 'To complete something — to do something until the end', emoji: '✅' },
  { word: 'Hobby', meaning: 'Something you enjoy doing in your free time — not work or school', emoji: '🎨' },
]

const QUESTIONS = [
  { q: 'What time does Tom get up on Saturday?', options: ['7 o\'clock', '8 o\'clock', '9 o\'clock'], answer: 2, emoji: '⏰' },
  { q: 'What does Tom do with his friends in the park?', options: ['He runs', 'He plays football', 'He has a picnic'], answer: 1, emoji: '⚽' },
  { q: 'What is Tom\'s favourite TV show about?', options: ['Animals', 'Food', 'Cars'], answer: 2, emoji: '📺' },
  { q: 'Where does Tom\'s family go on Sunday?', options: ['To the beach', 'To the market', 'To the park'], answer: 1, emoji: '🛒' },
  { q: 'When does Tom do his homework?', options: ['Saturday morning', 'Sunday morning', 'Sunday afternoon'], answer: 2, emoji: '📝' },
  { q: 'What does Tom do before he goes to sleep?', options: ['He plays video games', 'He reads a book', 'He watches TV'], answer: 1, emoji: '📚' },
]

const PASSAGE = `On the weekend, Tom does not go to school.
He gets up later than usual.
He gets up at 9 o'clock on Saturday morning.
Then he has a big breakfast with his family.
In the afternoon, Tom plays football with his friends.
They play in the park near Tom's house.
Tom is good at football and he plays every Saturday.
In the evening, Tom watches TV or plays video games.
His favourite TV show is about cars.
On Sunday, Tom's family sometimes goes to the market.
They buy food and vegetables for the week.
Tom likes the market because there are many delicious foods to eat.
In the afternoon on Sunday, Tom does his homework.
He doesn't like homework very much.
But he always finishes it before dinner.
At night, Tom reads a book in bed.
He goes to sleep at 10 o'clock.
Tom loves the weekend!`

const LISTENING_SCRIPT = `Tom gets up at 9 o'clock on Saturday morning. He plays football with his friends in the park. In the evening, he watches his favourite TV show about cars. On Sunday, his family goes to the market. Tom does his homework on Sunday afternoon. He reads a book before he goes to sleep.`

const SPEEDS = [
  { label: '🐢 Very Slow', value: 0.45 },
  { label: '🚶 Slow', value: 0.65 },
  { label: '🏃 Normal', value: 0.85 },
  { label: '⚡ Fast', value: 1.0 },
]

async function fetchTranslation(text: string, lang: string, type: 'vocab' | 'question'): Promise<string> {
  const systems: Record<string, string> = {
    vocab: `You are a language learning assistant for A2 elementary English students. Translate this English word and its meaning to ${lang}. Return ONLY the translated word and its meaning in ${lang} (max 20 words). No English, no extra text.`,
    question: `You are a translator. Translate this English question to ${lang}. Return ONLY the translated question. No extra text.`,
  }
  const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: systems[type], messages: [{ role: 'user', content: text }] }) })
  const data = await res.json()
  return data.content || ''
}

function TranslateBtn({ text, type, lang, color, onTranslated }: { text: string; type: 'vocab' | 'question'; lang: string; color: string; onTranslated: (t: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const handleClick = async () => {
    if (lang === 'none' || loading || done) return
    setLoading(true); const result = await fetchTranslation(text, lang, type); onTranslated(result); setDone(true); setLoading(false)
  }
  const isDisabled = lang === 'none'
  return (
    <button onClick={handleClick} disabled={isDisabled || loading || done}
      style={{ background: isDisabled ? '#f3f4f6' : done ? '#f0fdf4' : color + '15', color: isDisabled ? '#d1d5db' : done ? '#16a34a' : color, border: `1px solid ${isDisabled ? '#e5e7eb' : done ? '#86efac' : color + '40'}`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: isDisabled ? 'not-allowed' : done ? 'default' : 'pointer', fontWeight: '700', flexShrink: 0 }}>
      {loading ? '...' : done ? '✓ 🌍' : '🌍'}
    </button>
  )
}

function speak(text: string, rate: number) { if (typeof window === 'undefined') return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = rate; u.pitch = 1; window.speechSynthesis.speak(u) }
function stopAudio() { if (typeof window === 'undefined') return; window.speechSynthesis.cancel() }

export default function MyWeekendPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [writing, setWriting] = useState({ weekend: '', hobby: '', sunday: '' })
  const [section, setSection] = useState<'warmup' | 'reading' | 'vocab' | 'questions' | 'listening' | 'speaking' | 'writing'>('warmup')
  const [listeningAnswers, setListeningAnswers] = useState({ q1: '', q2: '' })
  const [speed, setSpeed] = useState(0.65)
  const [translationLang, setTranslationLang] = useState('none')
  const [vocabTranslations, setVocabTranslations] = useState<Record<string, string>>({})
  const [speakingTranslations, setSpeakingTranslations] = useState<Record<number, string>>({})
  const [warmupTranslations, setWarmupTranslations] = useState<Record<number, string>>({})

  const currentLang = LANGUAGES.find(l => l.value === translationLang)
  const handleAnswer = (qIdx: number, optIdx: number) => { if (submitted) return; setAnswers(prev => { const n = [...prev]; n[qIdx] = optIdx; return n }) }
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

  const accentColor = '#84cc16'

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/a2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← A2 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>🎉</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#65a30d', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>A2 Elementary</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Free Time</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 1</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>My Weekend</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>Learn to talk about weekend activities, hobbies and free time.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[{ icon: '📖', label: 'Reading passage' }, { icon: '📚', label: '6 vocabulary words' }, { icon: '❓', label: '6 questions' }, { icon: '🌍', label: '13-language translation' }, { icon: '✍️', label: 'Writing practice' }, { icon: '⏱️', label: '30–45 min lesson' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '10px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {SECTIONS.map(s => <button key={s.id} onClick={() => setSection(s.id as any)} style={{ padding: '5px 12px', borderRadius: '20px', border: 'none', background: section === s.id ? s.color : '#f0f0f0', color: section === s.id ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>)}
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🔊 Speed:</span>
              {SPEEDS.map(s => <button key={s.value} onClick={() => setSpeed(s.value)} style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? accentColor : '#e5e7eb', background: speed === s.value ? accentColor : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>{s.label}</button>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🌍 Translate to:</span>
              <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setSpeakingTranslations({}); setWarmupTranslations({}) }}
                style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? accentColor : '#e5e7eb', background: translationLang !== 'none' ? '#f7fee7' : 'white', color: translationLang !== 'none' ? '#3f6212' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {section === 'warmup' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #f59e0b22, #f59e0b08)', borderLeft: '5px solid #f59e0b', padding: '20px 24px' }}>
              <div style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 1 — 3 to 5 minutes</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>💬 Warm-up Questions</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ color: '#555', fontSize: '15px', marginBottom: '20px' }}>Ask your student these questions before reading.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { q: 'What do you usually do on the weekend?', hint: 'e.g. I usually watch TV. / I play sport.' },
                  { q: 'Do you have a hobby? What is it?', hint: 'e.g. My hobby is _____ . / I like to _____ .' },
                  { q: 'Do you prefer weekdays or weekends? Why?', hint: 'e.g. I prefer weekends because I can relax.' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fffbeb', borderRadius: '14px', padding: '16px 20px', border: '2px solid #fde68a' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ background: '#f59e0b', color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a2e' }}>{item.q}</div>
                          <TranslateBtn text={item.q} type="question" lang={translationLang} color="#f59e0b" onTranslated={t => setWarmupTranslations(p => ({ ...p, [i]: t }))} />
                        </div>
                        <div style={{ color: '#92400e', fontSize: '13px' }}>💡 {item.hint}</div>
                        {warmupTranslations[i] && <div style={{ marginTop: '8px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '8px 12px' }}><span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>{currentLang?.label}</span><span style={{ color: '#374151', fontSize: '15px' }}>{warmupTranslations[i]}</span></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSection('reading')} style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>Ready! → Start Reading</button>
            </div>
          </div>
        )}

        {section === 'reading' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f622, #3b82f608)', borderLeft: '5px solid #3b82f6', padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}><div style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 2 — Read Together</div><h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>📖 My Weekend</h2></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => speak(PASSAGE, speed)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 3px 10px rgba(59,130,246,0.4)' }}>▶ Play</button>
                <button onClick={stopAudio} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop</button>
              </div>
            </div>
            <div style={{ padding: '28px' }}>
              <div style={{ background: '#f8faff', borderRadius: '16px', padding: '24px', border: '1px solid #e0e7ff' }}>
                {PASSAGE.split('\n').map((line, i) => <p key={i} style={{ color: '#1e3a5f', fontSize: '18px', lineHeight: '2.1', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>{line}</p>)}
              </div>
              <button onClick={() => setSection('vocab')} style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>→ Study Vocabulary</button>
            </div>
          </div>
        )}

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
                          <TranslateBtn text={`${v.word}: ${v.meaning}`} type="vocab" lang={translationLang} color="#8b5cf6" onTranslated={t => setVocabTranslations(p => ({ ...p, [v.word]: t }))} />
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>{v.meaning}</div>
                        {vocabTranslations[v.word] && <div style={{ marginTop: '8px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '8px 10px' }}><span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>{currentLang?.label}</span><span style={{ color: '#374151', fontSize: '14px' }}>{vocabTranslations[v.word]}</span></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSection('questions')} style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>→ Answer the Questions</button>
            </div>
          </div>
        )}

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
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}><span style={{ fontSize: '24px' }}>{q.emoji}</span><div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}><span style={{ color: '#E85D26', marginRight: '6px' }}>{qi + 1}.</span>{q.q}</div></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {q.options.map((opt, oi) => {
                        const isSelected = answers[qi] === oi; const isCorrect = oi === q.answer
                        let bg = 'white', border = '#e5e7eb', color = '#374151'
                        if (submitted) { if (isCorrect) { bg = '#dcfce7'; border = '#16a34a'; color = '#14532d' } else if (isSelected) { bg = '#fee2e2'; border = '#ef4444'; color = '#7f1d1d' } } else if (isSelected) { bg = '#eff6ff'; border = '#3b82f6'; color = '#1e3a5f' }
                        return <button key={oi} onClick={() => handleAnswer(qi, oi)} disabled={submitted} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: submitted ? 'default' : 'pointer', textAlign: 'left' }}><span style={{ background: border, color: isSelected || (submitted && isCorrect) ? 'white' : '#9ca3af', width: '26px', height: '26px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>{submitted && isCorrect ? '✓' : submitted && isSelected && !isCorrect ? '✗' : String.fromCharCode(97 + oi)}</span><span style={{ fontWeight: '600', fontSize: '15px', color }}>{opt}</span></button>
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {!submitted ? (
                <button onClick={() => setSubmitted(true)} disabled={!allAnswered} style={{ width: '100%', background: allAnswered ? 'linear-gradient(135deg, #E85D26, #f97316)' : '#e5e7eb', color: allAnswered ? 'white' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: allAnswered ? 'pointer' : 'not-allowed' }}>{allAnswered ? '✅ Check My Answers' : 'Answer all questions first'}</button>
              ) : (
                <div>
                  <div style={{ background: score === QUESTIONS.length ? '#dcfce7' : score >= 4 ? '#fffbeb' : '#fee2e2', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '16px', border: `2px solid ${score === QUESTIONS.length ? '#16a34a' : score >= 4 ? '#f59e0b' : '#ef4444'}` }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>{score === QUESTIONS.length ? '🏆' : score >= 4 ? '⭐' : '💪'}</div>
                    <div style={{ fontWeight: '900', fontSize: '24px', color: '#1a1a2e', marginBottom: '4px' }}>{score} out of {QUESTIONS.length} correct!</div>
                    <div style={{ color: '#555', fontSize: '15px' }}>{score === QUESTIONS.length ? 'Perfect — well done!' : score >= 4 ? 'Good work!' : 'Keep trying — read again!'}</div>
                  </div>
                  <button onClick={() => setSection('listening')} style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>→ Listening Practice</button>
                </div>
              )}
            </div>
          </div>
        )}

        {section === 'listening' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #06b6d422, #06b6d408)', borderLeft: '5px solid #06b6d4', padding: '20px 24px' }}>
              <div style={{ color: '#06b6d4', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 5 — Listen Carefully</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>🔊 Listening Practice</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ color: '#555', fontSize: '15px', marginBottom: '20px' }}>Listen and answer the two questions below.</p>
              <div style={{ background: '#ecfeff', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '2px solid #67e8f9' }}>
                <div style={{ color: '#0e7490', fontSize: '13px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>🎧 Listening Script</div>
                {LISTENING_SCRIPT.split('. ').filter(Boolean).map((s, i, arr) => <p key={i} style={{ color: '#164e63', fontSize: '17px', lineHeight: '1.9', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>{s}{i < arr.length - 1 ? '.' : ''}</p>)}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => speak(LISTENING_SCRIPT, speed)} style={{ background: '#06b6d4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>▶ Play Listening</button>
                <button onClick={stopAudio} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '12px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>⏹ Stop</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {[
                  { label: 'What does Tom do on Saturday afternoon?', key: 'q1' as const, placeholder: 'e.g. He plays football' },
                  { label: 'What does Tom do before he goes to sleep?', key: 'q2' as const, placeholder: 'e.g. He reads a book' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f0fdfa', borderRadius: '14px', padding: '16px 20px', border: '2px solid #99f6e4' }}>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e', marginBottom: '10px' }}><span style={{ color: '#06b6d4', marginRight: '6px' }}>{i + 1}.</span>{item.label}</div>
                    <input value={listeningAnswers[item.key]} onChange={e => setListeningAnswers(p => ({ ...p, [item.key]: e.target.value }))} placeholder={item.placeholder} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #67e8f9', fontSize: '16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Georgia, serif', color: '#1a1a2e' }} />
                  </div>
                ))}
              </div>
              <button onClick={() => setSection('speaking')} style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>→ Speaking Practice</button>
            </div>
          </div>
        )}

        {section === 'speaking' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #22c55e22, #22c55e08)', borderLeft: '5px solid #22c55e', padding: '20px 24px' }}>
              <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 6 — Speak in Full Sentences</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>🗣️ Speaking Practice</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', border: '2px solid #86efac', marginBottom: '20px' }}>
                <div style={{ color: '#15803d', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>📝 Model sentences:</div>
                <div style={{ color: '#14532d', fontSize: '16px', fontWeight: '700', fontFamily: 'Georgia, serif', lineHeight: '1.8' }}>On Saturday, I usually play football.<br />My favourite hobby is reading books.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {[
                  { q: 'What time do you get up on the weekend?', hint: 'I get up at _____ on Saturday / Sunday.', emoji: '⏰' },
                  { q: 'What is your favourite thing to do on the weekend?', hint: 'My favourite thing to do is _____ .', emoji: '⭐' },
                  { q: 'Do you prefer weekdays or weekends? Why?', hint: 'I prefer _____ because _____ .', emoji: '💭' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', border: '2px solid #86efac' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a2e' }}>{item.q}</div>
                          <TranslateBtn text={item.q} type="question" lang={translationLang} color="#22c55e" onTranslated={t => setSpeakingTranslations(p => ({ ...p, [i]: t }))} />
                        </div>
                        {speakingTranslations[i] && <div style={{ marginBottom: '6px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '8px 10px' }}><span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>{currentLang?.label}</span><span style={{ color: '#374151', fontSize: '15px' }}>{speakingTranslations[i]}</span></div>}
                        <div style={{ color: '#16a34a', fontSize: '14px', fontStyle: 'italic' }}>💡 {item.hint}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSection('writing')} style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899, #be185d)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>→ Writing Practice</button>
            </div>
          </div>
        )}

        {section === 'writing' && (
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: 'linear-gradient(135deg, #ec489922, #ec489908)', borderLeft: '5px solid #ec4899', padding: '20px 24px' }}>
              <div style={{ color: '#ec4899', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Step 7 — Complete the Sentences</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>✍️ Writing Practice</h2>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ color: '#555', fontSize: '15px', marginBottom: '20px' }}>Complete the sentences about <strong>your own</strong> weekend.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'On the weekend, I usually', suffix: '.', key: 'weekend' as const, placeholder: 'e.g. watch TV / play sport / visit friends', emoji: '📅' },
                  { label: 'My favourite hobby is', suffix: '.', key: 'hobby' as const, placeholder: 'e.g. playing football / reading / cooking', emoji: '🎨' },
                  { label: 'On Sunday, I', suffix: 'with my family.', key: 'sunday' as const, placeholder: 'e.g. eat dinner / go to the market / watch TV', emoji: '👨‍👩‍👧' }
                ].map(item => (
                  <div key={item.key} style={{ background: '#fdf2f8', borderRadius: '14px', padding: '16px 20px', border: '2px solid #f9a8d4' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                      <span style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e' }}>{item.label} <span style={{ color: '#9ca3af' }}>___________</span> {item.suffix}</span>
                    </div>
                    <input value={writing[item.key]} onChange={e => setWriting(p => ({ ...p, [item.key]: e.target.value }))} placeholder={item.placeholder} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #f9a8d4', fontSize: '16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Georgia, serif', color: '#1a1a2e' }} />
                  </div>
                ))}
              </div>
              <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '24px' }}>
                <div style={{ color: '#84cc16', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>🎓 Lesson Outcome — A2 Can-Do</div>
                {['Read and understand a passage about weekend activities ✅', 'Use vocabulary for hobbies and free time ✅', 'Answer comprehension questions about a text ✅', 'Talk and write about your own weekend activities ✅'].map((item, i) => (
                  <div key={i} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}><span style={{ color: '#84cc16', fontWeight: '900' }}>✓</span> {item}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <Link href="/esl-resources/reading-comprehension/a2" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to A2 Reading Comprehension</Link>
        </div>
      </div>
    </main>
  )
}
