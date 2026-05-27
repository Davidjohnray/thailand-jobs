'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const SPEEDS = [
  { label: '🐢 Very Slow', value: 0.55 },
  { label: '🚶 Slow', value: 0.72 },
  { label: '🏃 Normal', value: 0.9 },
  { label: '⚡ Fast', value: 1.1 },
]

const PARTS = [
  { number: 1, title: 'What Are Wearable Health Monitors?', emoji: '⌚', color: '#0ea5e9',
    text: `Wearable health monitors are small electronic devices that people wear on their body. The most common type looks like a watch and is worn on the wrist. These devices can count steps, measure heart rate, and track daily activity. Many people use wearable health monitors to learn more about their health and lifestyle.\n\nIn recent years, these devices have become very popular. People of all ages use them, from students to older adults. Some people use them for exercise, while others use them to check basic health information every day.`,
    vocab: [
      { word: 'Wearable', definition: 'Something you can wear on your body, like a watch or bracelet, that has electronic features.' },
      { word: 'Monitor', definition: 'A device that watches or measures something continuously — here, it tracks your health.' },
      { word: 'Heart rate', definition: 'How fast your heart beats — measured in beats per minute.' },
      { word: 'Lifestyle', definition: 'The way a person lives — including habits, diet, exercise and daily routine.' },
    ],
    questions: [
      { n: 1, q: 'Have you seen or used a wearable health monitor before?' },
      { n: 2, q: 'Why do you think these devices are popular?' },
      { n: 3, q: 'Do you think everyone needs a health monitor? Why or why not?' },
    ]
  },
  { number: 2, title: 'How Do They Help People?', emoji: '📊', color: '#22c55e',
    text: `Wearable health monitors help people understand their daily habits. They show how much a person walks, how long they sleep, and how active they are. This information is usually sent to a smartphone app, where users can see charts and numbers.\n\nWhen people see their health data, they may want to make better choices. For example, they may walk more, sleep earlier, or exercise more often. These devices can help people notice unhealthy habits and try to change them.`,
    vocab: [
      { word: 'Habits', definition: 'Things you do regularly without thinking — either good or bad routines in daily life.' },
      { word: 'Data', definition: 'Information collected and stored, often as numbers or statistics.' },
      { word: 'App', definition: 'A software application on a smartphone or tablet used to do a specific task.' },
      { word: 'Unhealthy', definition: 'Not good for your body or mind — habits or choices that can cause harm over time.' },
    ],
    questions: [
      { n: 4, q: 'Do you like seeing information about your daily habits?' },
      { n: 5, q: 'Can technology help people make better health choices?' },
      { n: 6, q: 'What habit would you like to improve?' },
    ]
  },
  { number: 3, title: 'Motivation and Daily Life', emoji: '🎯', color: '#f59e0b',
    text: `Many wearable health monitors help motivate users. They set daily goals, such as walking a certain number of steps. Some devices send messages or alerts to remind users to move, stand up, or drink water. This can be helpful for people who sit for long hours.\n\nSome people enjoy competing with friends or family using these devices. They feel happy when they reach their goals and see progress. For many users, wearable health monitors make health and exercise more fun.`,
    vocab: [
      { word: 'Motivate', definition: 'To give someone a reason to do something — to encourage them to take action.' },
      { word: 'Goals', definition: 'Targets you want to reach — something you plan and try to achieve.' },
      { word: 'Alerts', definition: 'Notifications or reminders sent by a device to get your attention.' },
      { word: 'Progress', definition: 'Movement forward towards a goal — improvement over time.' },
    ],
    questions: [
      { n: 7, q: 'Do goals motivate you or make you feel stressed?' },
      { n: 8, q: 'Would you like to compete with friends using a health device?' },
      { n: 9, q: 'What kind of reminder would help you most?' },
    ]
  },
  { number: 4, title: 'Problems and Future Use', emoji: '🔋', color: '#8b5cf6',
    text: `Although wearable health monitors are useful, they also have problems. They need to be charged often, and sometimes the data is not completely accurate. Some people feel uncomfortable wearing a device all day.\n\nAnother concern is privacy. Health data is personal, and some users worry about who can see their information. Even with these concerns, wearable health monitors continue to improve and are likely to become more common in the future.`,
    vocab: [
      { word: 'Accurate', definition: 'Correct and without mistakes — giving the right information or measurement.' },
      { word: 'Uncomfortable', definition: 'Not pleasant or easy — causing a feeling of difficulty or annoyance.' },
      { word: 'Privacy', definition: 'The right to keep personal information to yourself — not sharing it with others.' },
      { word: 'Concern', definition: 'A worry or problem that people think about — something that causes anxiety.' },
    ],
    questions: [
      { n: 10, q: 'Would wearing a device all day bother you? Why or why not?' },
      { n: 11, q: 'How important is privacy when using technology?' },
      { n: 12, q: 'Do you think wearable health monitors will be more popular in the future?' },
    ]
  },
]

// ── Conversation Box ──────────────────────────────────────────
type Message = { role: 'user' | 'assistant'; content: string }

function ConversationBox({ question, color }: { question: string; color: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [open, setOpen] = useState(false)
  const recognitionRef = useRef<any>(null)

  const SYSTEM = `You are a friendly English conversation partner helping a B1 level student practise speaking and discussion skills. The reading topic is "Wearable Health Monitors". The current discussion question is: "${question}". Keep every response to 2 sentences maximum — short and simple. Use easy vocabulary suitable for B1 level. Always end with one simple follow-up question. If the student makes a grammar error, gently correct it at the very end using "💡 Quick tip: ..." — only the most important error. Be warm, patient and encouraging.`

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM, messages: updated }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || 'Sorry, try again.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — please try again.' }])
    }
    setLoading(false)
  }

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input requires Chrome browser.'); return }
    const r = new SR()
    r.lang = 'en-US'; r.interimResults = false
    r.onstart = () => setListening(true)
    r.onresult = (e: any) => { const t = e.results[0][0].transcript; setListening(false); sendMessage(t) }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    recognitionRef.current = r; r.start()
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{ marginTop: '10px', width: '100%', background: color + '12', border: `2px dashed ${color}40`, borderRadius: '12px', padding: '10px', color, fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      🤖 Practice answering with AI
    </button>
  )

  return (
    <div style={{ marginTop: '10px', background: '#f8faff', borderRadius: '14px', border: `2px solid ${color}30`, overflow: 'hidden' }}>
      <div style={{ background: color, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>🤖 AI Conversation Partner</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setMessages([])} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>🔄 Reset</button>
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>✕ Close</button>
        </div>
      </div>
      {messages.length === 0 && (
        <div style={{ padding: '14px 16px', color: '#6b7280', fontSize: '13px', lineHeight: '1.6', borderBottom: '1px solid #eee' }}>
          💡 <strong>Speak or type</strong> your answer. The AI will respond and ask a follow-up question!
        </div>
      )}
      {messages.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ fontSize: '20px', flexShrink: 0 }}>{m.role === 'user' ? '🧑‍🎓' : '🤖'}</div>
              <div style={{ background: m.role === 'user' ? color : 'white', color: m.role === 'user' ? 'white' : '#374151', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '14px', lineHeight: '1.6', maxWidth: '80%', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: m.role === 'assistant' ? '1px solid #e5e7eb' : 'none' }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div style={{ background: 'white', padding: '10px 14px', borderRadius: '4px 16px 16px 16px', fontSize: '14px', color: '#9ca3af', border: '1px solid #e5e7eb' }}>Thinking...</div>
            </div>
          )}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
          placeholder="Type your answer... or use the mic 🎤" rows={2}
          style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={listening ? () => { recognitionRef.current?.stop(); setListening(false) } : startVoice}
            style={{ background: listening ? '#ef4444' : '#22c55e', color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.3)' : 'none' }}>
            {listening ? '⏹' : '🎤'}
          </button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            style={{ background: input.trim() && !loading ? color : '#e5e7eb', color: input.trim() && !loading ? 'white' : '#9ca3af', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ➤
          </button>
        </div>
      </div>
      {listening && (
        <div style={{ padding: '6px 16px 10px', color: '#ef4444', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
          Listening... speak now
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function WearableHealthMonitorsPage() {
  const [speed, setSpeed] = useState(0.9)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [lookupDef, setLookupDef] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)

  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection()
      if (!sel) return
      const text = sel.toString().trim().replace(/\s+/g, ' ')
      if (!text || text.split(' ').length > 6) return
      const anchor = sel.anchorNode?.parentElement
      if (!anchor?.closest('[data-passage]')) return
      handleLookup(text)
    }
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('touchend', handleSelection)
    }
  }, [])

  const handleLookup = async (text: string) => {
    if (!text || text.length < 2) return
    setSelectedText(text); setLookupDef(''); setLookupLoading(true)
    speakWord(text)
    try {
      const isPhrase = text.includes(' ')
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: isPhrase
            ? `You are an English dictionary for B1 learners. The user selected a phrase. Respond with ONLY one simple sentence (max 20 words) explaining what it means. Use easy vocabulary. No extra text.`
            : `You are an English dictionary for B1 learners. Respond with ONLY one simple sentence (max 15 words) defining this word. Use easy vocabulary. No extra text.`,
          messages: [{ role: 'user', content: isPhrase ? `What does "${text}" mean?` : `Define: "${text}"` }],
        }),
      })
      const data = await res.json()
      setLookupDef(data.content || 'No definition found.')
    } catch { setLookupDef('Could not load definition.') }
    setLookupLoading(false)
  }

  function speakText(text: string) {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    sentences.forEach(s => {
      const u = new SpeechSynthesisUtterance(s.trim())
      u.lang = 'en-GB'; u.rate = speed; u.pitch = 1
      window.speechSynthesis.speak(u)
    })
  }

  function speakWord(word: string) {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'en-GB'; u.rate = 0.85; u.pitch = 1
    window.speechSynthesis.speak(u)
  }

  function stopAudio() { if (typeof window === 'undefined') return; window.speechSynthesis.cancel() }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B1 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>⌚</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#0ea5e9', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(34,197,94,0.7)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Health & Technology</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>Wearable Health Monitors</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>Smartwatches, step counters and health apps — explore how wearable technology is changing the way we understand our health every day.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[{ icon: '📄', label: '4 reading parts' }, { icon: '💬', label: '12 discussion questions' }, { icon: '📚', label: '16 vocabulary words' }, { icon: '✍️', label: 'Select any word or phrase' }, { icon: '🤖', label: 'AI conversation partner' }, { icon: '🔊', label: 'Audio included' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE + SPEED */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>How to use:</span>
            {['🔊 Play passage aloud', '✍️ Highlight any word or phrase', '📚 Study vocabulary', '🤖 Practice with AI'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '13px' }}>
                <span style={{ background: '#E85D26', color: 'white', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🔊 Speed:</span>
            {SPEEDS.map(s => (
              <button key={s.value} onClick={() => setSpeed(s.value)}
                style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#0ea5e9' : '#e5e7eb', background: speed === s.value ? '#0ea5e9' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {PARTS.map(part => (
          <div key={part.number} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>

            {/* Part Header */}
            <div style={{ background: `linear-gradient(135deg, ${part.color}22, ${part.color}08)`, borderLeft: `5px solid ${part.color}`, padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: part.color, color: 'white', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>{part.number}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: part.color, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Part {part.number}</div>
                <h2 style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{part.emoji} {part.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => speakText(part.text.replace(/\n\n/g, ' '))} style={{ background: part.color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: `0 3px 10px ${part.color}40` }}>▶ Play Passage</button>
                <button onClick={stopAudio} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop</button>
              </div>
            </div>

            {/* Selection hint */}
            <div style={{ background: '#e0f2fe', padding: '8px 28px', borderBottom: '1px solid #bae6fd' }}>
              <span style={{ color: '#0369a1', fontSize: '12px', fontWeight: '600' }}>✍️ Highlight any word or phrase in the passage to hear it and see its meaning</span>
            </div>

            {/* Reading Text */}
            <div data-passage="true" style={{ padding: '24px 28px 20px', userSelect: 'text', cursor: 'text' }}>
              {part.text.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: '#374151', fontSize: '17px', lineHeight: '2', margin: i === 0 ? '0 0 18px' : '0', fontFamily: 'Georgia, serif' }}>{para}</p>
              ))}
            </div>

            {/* Vocabulary */}
            <div style={{ margin: '0 28px 24px', background: part.color + '08', border: `1px solid ${part.color}25`, borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: part.color + '18', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${part.color}20` }}>
                <span style={{ fontSize: '16px' }}>📚</span>
                <span style={{ color: part.color, fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vocabulary — Part {part.number}</span>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {part.vocab.map((v, i) => (
                  <div key={v.word} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: i < part.vocab.length - 1 ? '10px' : '0', borderBottom: i < part.vocab.length - 1 ? `1px solid ${part.color}15` : 'none' }}>
                    <div style={{ background: part.color, color: 'white', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>{v.word}</span>
                        <button onClick={() => speakWord(v.word)} style={{ background: part.color + '15', color: part.color, border: `1px solid ${part.color}30`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0 }}>🔊</button>
                      </div>
                      <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{v.definition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Questions + AI */}
            <div style={{ background: '#1a1a2e', padding: '20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '18px' }}>💬</span>
                <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Discussion Questions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {part.questions.map(q => (
                  <div key={q.n}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ background: part.color, color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{q.n}</div>
                      <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{q.q}</p>
                    </div>
                    <div style={{ marginLeft: '42px' }}>
                      <ConversationBox question={q.q} color={part.color} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', paddingBottom: selectedText ? '120px' : '16px' }}>
          <Link href="/esl-resources/reading-comprehension/b1" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to B1 Reading Comprehension</Link>
        </div>
      </div>

      {/* WORD/PHRASE DEFINITION POPUP */}
      {selectedText && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, animation: 'slideUp 0.25s ease' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', background: 'white', borderRadius: '20px 20px 0 0', padding: '20px 24px 32px', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', border: '2px solid #bae6fd', borderBottom: 'none' }}>
            <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '4px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', fontFamily: 'Georgia, serif' }}>"{selectedText}"</span>
                <button onClick={() => speakWord(selectedText)}
                  style={{ background: '#e0f2fe', color: '#0369a1', border: '2px solid #bae6fd', padding: '6px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', flexShrink: 0 }}>
                  🔊 Hear it
                </button>
              </div>
              <button onClick={() => setSelectedText(null)}
                style={{ background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0, marginLeft: '12px' }}>
                ✕
              </button>
            </div>
            <div style={{ background: '#e0f2fe', borderRadius: '12px', padding: '14px 18px', border: '1px solid #bae6fd', minHeight: '52px', display: 'flex', alignItems: 'center' }}>
              {lookupLoading
                ? <span style={{ color: '#9ca3af', fontSize: '15px' }}>{selectedText.includes(' ') ? 'Looking up phrase...' : 'Looking up definition...'}</span>
                : <span style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>{lookupDef}</span>
              }
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
