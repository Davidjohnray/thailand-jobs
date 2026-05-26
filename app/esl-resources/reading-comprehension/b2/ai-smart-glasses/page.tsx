'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const SPEEDS = [
  { label: '🐢 Very Slow', value: 0.55 },
  { label: '🚶 Slow', value: 0.72 },
  { label: '🏃 Normal', value: 0.9 },
  { label: '⚡ Fast', value: 1.1 },
]

const PARTS = [
  {
    number: 1, title: 'From Simple Glasses to Intelligent Devices', emoji: '👓', color: '#3b82f6',
    text: `Smart glasses have existed for several years, but early versions were often limited, expensive, or uncomfortable to use. Recent advances in artificial intelligence, miniaturized hardware, and battery technology have changed this situation. Next-generation AI smart glasses now aim to blend naturally into daily life, looking more like normal eyewear while offering powerful digital features. These devices can display information directly in the user's field of vision, reducing the need to constantly check a phone.

What makes these glasses different from earlier wearable technology is their ability to understand context. Using cameras, microphones, and sensors, AI smart glasses can recognize surroundings, interpret speech, and respond intelligently. Instead of being a distraction, they are designed to quietly support users during work, travel, and social interaction. Supporters believe this shift could change how people interact with technology, making it more seamless and less intrusive.`,
    vocab: [
      { word: 'Miniaturized', definition: 'Made very small — hardware components reduced to tiny sizes to fit inside glasses.' },
      { word: 'Wearable technology', definition: 'Electronic devices designed to be worn on the body — like smart watches or glasses.' },
      { word: 'Seamless', definition: 'Smooth and uninterrupted — technology that works without you noticing it.' },
      { word: 'Intrusive', definition: 'Unwanted or disturbing — technology that interrupts or interferes with normal life.' },
    ],
    questions: [
      { n: 1, q: 'Do you think wearable technology should replace smartphones, or simply support them?' },
      { n: 2, q: 'How comfortable would you feel wearing smart glasses in public spaces?' },
      { n: 3, q: 'Is convenience more important than appearance when adopting new technology?' },
    ]
  },
  {
    number: 2, title: 'Real-Time Translation and Navigation', emoji: '🗺️', color: '#8b5cf6',
    text: `One of the most exciting features of next-gen AI smart glasses is real-time language translation. Users can hear or see translations instantly while speaking with people from different countries. This could greatly reduce language barriers in travel, international business, and education. Unlike smartphone apps, the hands-free design allows users to maintain eye contact and natural conversation, which may improve communication and trust.

Navigation is another powerful use case. AI smart glasses can project directions, landmarks, and alerts directly into the user's view. For example, walking directions may appear on the street ahead, or reminders could appear when approaching a destination. For people unfamiliar with a city — or those with mobility or vision challenges — this could significantly improve independence and confidence. However, reliance on constant digital guidance may also reduce people's natural sense of direction.`,
    vocab: [
      { word: 'Real-time', definition: 'Happening instantly as events occur — no delay between input and output.' },
      { word: 'Hands-free', definition: 'Working without needing to hold or touch a device — using voice or sensors instead.' },
      { word: 'Landmark', definition: 'A recognizable building or place used as a point of reference for navigation.' },
      { word: 'Augmented reality', definition: 'Digital information or images overlaid onto the real world through a screen or lens.' },
    ],
    questions: [
      { n: 4, q: 'How might real-time translation change international communication?' },
      { n: 5, q: 'Could over-reliance on navigation technology weaken human skills?' },
      { n: 6, q: 'Should this technology be encouraged in education and tourism?' },
    ]
  },
  {
    number: 3, title: 'AI Assistance in Daily Life and Work', emoji: '💼', color: '#f59e0b',
    text: `Beyond translation and navigation, AI smart glasses act as personal assistants. They can summarize messages, provide reminders, identify objects, or offer suggestions based on what the user sees. In professional settings, this could transform productivity. For example, technicians might receive instructions while repairing equipment, or doctors could view patient data without looking away from their work.

At the same time, constant AI assistance raises concerns about attention, privacy, and decision-making. If AI systems guide users too often, people may lose confidence in their own judgment. There are also questions about data collection: cameras and microphones worn on the face may capture sensitive information about others without their consent. Balancing usefulness with ethical responsibility will be one of the biggest challenges for widespread adoption.`,
    vocab: [
      { word: 'Productivity', definition: 'The efficiency of completing tasks — how much useful work is done in a given time.' },
      { word: 'Consent', definition: 'Permission given by a person to allow something — especially collecting their data.' },
      { word: 'Transparency', definition: 'Being open and honest about how something works, especially with data and privacy.' },
    ],
    questions: [
      { n: 7, q: 'Should AI assistants make decisions for people or only offer suggestions?' },
      { n: 8, q: 'How much data collection is acceptable for better user experience?' },
      { n: 9, q: 'Would AI smart glasses improve or reduce workplace creativity?' },
    ]
  },
  {
    number: 4, title: 'Social Impact and the Future of Smart Glasses', emoji: '🌍', color: '#22c55e',
    text: `As AI smart glasses become more common, they may reshape social norms. Just as smartphones changed how people interact, smart glasses could affect eye contact, attention, and trust. Some people may feel uncomfortable being recorded or analyzed without knowing it. Others may see the technology as empowering, especially for people with disabilities or communication challenges.

Looking ahead, the success of AI smart glasses will depend on trust, regulation, and design choices. If companies focus on transparency, privacy protection, and user control, these devices may become a normal part of daily life. If not, public resistance could slow adoption. Whether they become essential tools or niche gadgets, AI smart glasses represent an important step toward a more integrated digital future.`,
    vocab: [
      { word: 'Transparency', definition: 'Being open and honest about how something works, especially with data and privacy.' },
      { word: 'Niche', definition: 'Appealing to a small, specific group of people rather than the general public.' },
      { word: 'Wearable technology', definition: 'Electronic devices designed to be worn on the body — like smart watches or glasses.' },
    ],
    questions: [
      { n: 10, q: 'How might smart glasses change social behaviour in public spaces?' },
      { n: 11, q: 'Should governments regulate wearable AI devices more strictly?' },
      { n: 12, q: 'Would you personally choose to use AI smart glasses in your daily life? Why or why not?' },
    ]
  },
]

// ── Clickable Passage ─────────────────────────────────────────
function ClickablePassage({ text, onWordClick }: { text: string; onWordClick: (word: string) => void }) {
  return (
    <>
      {text.split('\n\n').map((para, pi) => (
        <p key={pi} style={{ color: '#374151', fontSize: '16px', lineHeight: '1.85', margin: pi === 0 ? '0 0 18px' : '0', fontFamily: 'Georgia, serif' }}>
          {para.split(/(\s+)/).map((token, ti) => {
            const clean = token.replace(/[^a-zA-Z''-]/g, '')
            if (!clean || token.trim() === '') return <span key={ti}>{token}</span>
            return (
              <span key={ti} onClick={() => onWordClick(clean)}
                style={{ cursor: 'pointer', borderBottom: '1px dotted #93c5fd', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#eff6ff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {token}
              </span>
            )
          })}
        </p>
      ))}
    </>
  )
}

// ── Conversation Box ──────────────────────────────────────────
type Message = { role: 'user' | 'assistant'; content: string }

function ConversationBox({ question, color }: { question: string; color: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [open, setOpen] = useState(false)
  const recognitionRef = useRef<any>(null)

  const SYSTEM = `You are a friendly English conversation partner helping a B2 level student practise discussion skills. The reading topic is "AI Smart Glasses". The current discussion question is: "${question}". Keep every response to 2-3 sentences maximum. Always end with one natural follow-up question to keep the conversation going. If the student makes a significant grammar error, gently correct it at the very end using "💡 Quick tip: ..." — but only correct the most important error, not every mistake. Be encouraging and warm.`

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM,
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      const reply = data.content || 'Sorry, I could not respond. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — please try again.' }])
    }
    setLoading(false)
  }

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice recognition is not supported in this browser. Please use Chrome.'); return }
    const r = new SR()
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1
    r.onstart = () => setListening(true)
    r.onresult = (e: any) => { const t = e.results[0][0].transcript; setInput(t); setListening(false); sendMessage(t) }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    recognitionRef.current = r; r.start()
  }

  const stopVoice = () => { recognitionRef.current?.stop(); setListening(false) }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{ marginTop: '10px', width: '100%', background: color + '12', border: `2px dashed ${color}40`, borderRadius: '12px', padding: '10px', color: color, fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
              <div style={{ fontSize: '20px' }}>🤖</div>
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
          <button onClick={listening ? stopVoice : startVoice}
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
export default function AISmartGlassesPage() {
  const [speed, setSpeed] = useState(0.9)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [wordDef, setWordDef] = useState('')
  const [defLoading, setDefLoading] = useState(false)

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

  const handleWordClick = async (word: string) => {
    if (word.length < 3) return // skip very short words like "a", "is", "of"
    setSelectedWord(word)
    setWordDef('')
    setDefLoading(true)
    speakWord(word)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a dictionary for B2 English learners. When given a word, respond with ONLY a single short definition of 1 sentence (max 20 words). No extra text, no examples, no punctuation at the end beyond a full stop.',
          messages: [{ role: 'user', content: `Define this word: "${word}"` }],
        }),
      })
      const data = await res.json()
      setWordDef(data.content || 'No definition found.')
    } catch {
      setWordDef('Could not load definition.')
    }
    setDefLoading(false)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B2 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>🥽</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#3b82f6', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B2 Upper Intermediate</span>
                <span style={{ background: 'rgba(139,92,246,0.6)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Technology</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>Next-Gen AI Smart Glasses</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>A New Way to See the World — explore how AI-powered glasses are changing daily life, work, travel and social interaction.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[{ icon: '📄', label: '4 reading parts' }, { icon: '💬', label: '12 discussion questions' }, { icon: '📚', label: '12 vocabulary words' }, { icon: '🖱️', label: 'Click any word' }, { icon: '🤖', label: 'AI conversation partner' }, { icon: '🔊', label: 'Audio included' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE + SPEED */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>How to use:</span>
            {['🔊 Play passage aloud', '🖱️ Click any word for definition', '📚 Study vocabulary', '🤖 Practice with AI'].map((step, i) => (
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
                style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#3b82f6' : '#e5e7eb', background: speed === s.value ? '#3b82f6' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
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

            {/* Click hint */}
            <div style={{ background: '#eff6ff', padding: '8px 28px', borderBottom: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px' }}>🖱️</span>
              <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600' }}>Click any word in the passage to hear it and see its definition</span>
            </div>

            {/* Reading Text — clickable */}
            <div style={{ padding: '24px 28px 20px' }}>
              <ClickablePassage text={part.text} onWordClick={handleWordClick} />
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

        <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to B2 Reading Comprehension</Link>
        </div>
      </div>

      {/* WORD DEFINITION POPUP — slides up from bottom */}
      {selectedWord && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, animation: 'slideUp 0.25s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedWord(null) }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', background: 'white', borderRadius: '20px 20px 0 0', padding: '20px 24px 32px', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', border: '2px solid #e0e7ff', borderBottom: 'none' }}>
            {/* Handle bar */}
            <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '4px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e' }}>{selectedWord}</span>
                <button onClick={() => speakWord(selectedWord)}
                  style={{ background: '#eff6ff', color: '#3b82f6', border: '2px solid #bfdbfe', padding: '6px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  🔊 Hear it
                </button>
              </div>
              <button onClick={() => setSelectedWord(null)}
                style={{ background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0 }}>
                ✕
              </button>
            </div>
            <div style={{ background: '#f8faff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e0e7ff', minHeight: '48px', display: 'flex', alignItems: 'center' }}>
              {defLoading
                ? <span style={{ color: '#9ca3af', fontSize: '15px' }}>Looking up definition...</span>
                : <span style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>{wordDef}</span>
              }
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
