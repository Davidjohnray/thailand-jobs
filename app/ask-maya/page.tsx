'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Message = { role: 'user' | 'assistant'; content: string }

const QUICK_QUESTIONS = [
  'What teaching jobs are available?',
  'Any jobs in Bangkok?',
  'What free ESL games do you have?',
  'Tell me about lesson plans',
  'How do I post a job?',
  'How do I register on the site?',
]

export default function AskMayaPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    const hasSpeechSynthesis = 'speechSynthesis' in window
    setVoiceSupported(hasSpeechRecognition && hasSpeechSynthesis)
    if (hasSpeechSynthesis) synthRef.current = window.speechSynthesis
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function speak(text: string) {
    if (!voiceEnabled || !synthRef.current) return
    synthRef.current.cancel()
    const clean = text.replace(/[*_~`#]/g, '').replace(/\n/g, ' ')
    const utterance = new SpeechSynthesisUtterance(clean)
    const voices = synthRef.current.getVoices()
    const femaleVoice = voices.find(v =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('moira') ||
      (v.name.toLowerCase().includes('google') && v.name.toLowerCase().includes('us') && v.lang === 'en-US')
    ) || voices.find(v => v.lang.startsWith('en'))
    if (femaleVoice) utterance.voice = femaleVoice
    utterance.rate = 0.95
    utterance.pitch = 1.05
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    synthRef.current.speak(utterance)
  }

  function stopSpeaking() {
    synthRef.current?.cancel()
    setSpeaking(false)
  }

  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  async function sendMessage(text?: string) {
    const userText = (text || input).trim()
    if (!userText || loading) return
    setInput('')
    stopSpeaking()
    const newMessages: Message[] = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/maya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      const reply = data.reply
      const updated: Message[] = [...newMessages, { role: 'assistant', content: reply }]
      setMessages(updated)
      if (voiceEnabled) speak(reply)
    } catch {
      const fallback = 'Sorry, something went wrong. Please try again or visit jobsinthailand.net directly.'
      setMessages([...newMessages, { role: 'assistant', content: fallback }])
    }
    setLoading(false)
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '48px 24px 40px', color: 'white', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
          <div style={{ fontSize: '64px' }}>👩‍🏫</div>
          {speaking && (
            <div style={{ position: 'absolute', bottom: 0, right: -4, width: '18px', height: '18px', background: '#4ade80', borderRadius: '50%', border: '2px solid white', animation: 'pulse 1s infinite' }} />
          )}
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px' }}>Ask Maya</h1>
        <p style={{ opacity: 0.9, fontSize: '16px', maxWidth: '520px', margin: '0 auto 20px' }}>
          Your AI assistant for jobsinthailand.net — ask about jobs, ESL games, lesson plans and more.
        </p>
        {voiceSupported && (
          <button
            onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopSpeaking() }}
            style={{
              background: voiceEnabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: 'white',
              borderRadius: '24px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <span>{voiceEnabled ? '🔊' : '🔇'}</span>
            {voiceEnabled ? 'Voice on — click to mute' : 'Enable voice replies'}
          </button>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Chat window */}
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '24px' }}>

          {/* Messages area */}
          <div style={{ height: '500px', overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>

            {/* Welcome */}
            <MayaBubble>
              <div>Hi! I'm Maya 👋 I'm here to help with anything on <strong>jobsinthailand.net</strong> — teaching jobs, ESL games, lesson plans, or general questions about teaching in Thailand.</div>
              <div style={{ marginTop: '8px' }}>Just ask me anything! If I don't know the answer I'll point you in the right direction.</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #0891b2', color: '#0891b2', background: 'white', cursor: 'pointer', fontFamily: 'sans-serif' }}>{q}</button>
                ))}
              </div>
            </MayaBubble>

            {messages.map((m, i) => (
              m.role === 'user'
                ? <UserBubble key={i}>{m.content}</UserBubble>
                : <MayaBubble key={i}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                    {voiceEnabled && i === messages.length - 1 && (
                      <button onClick={speaking ? stopSpeaking : () => speak(m.content)} style={{ marginTop: '8px', fontSize: '12px', color: '#0891b2', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'sans-serif' }}>
                        {speaking ? '⏹ Stop speaking' : '🔊 Replay'}
                      </button>
                    )}
                  </MayaBubble>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <Avatar />
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', borderBottomLeftRadius: '4px', padding: '14px 18px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px 20px', display: 'flex', gap: '10px', alignItems: 'center', background: 'white' }}>

            {/* Mic button */}
            {voiceSupported && (
              <button
                onClick={listening ? stopListening : startListening}
                title={listening ? 'Stop listening' : 'Speak your question'}
                style={{
                  width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                  background: listening ? '#ef4444' : '#f1f5f9',
                  border: listening ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', animation: listening ? 'pulse 1s infinite' : 'none',
                }}
              >
                {listening ? '⏹' : '🎤'}
              </button>
            )}

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={listening ? 'Listening...' : 'Ask Maya anything...'}
              disabled={listening}
              style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '24px', padding: '11px 18px', fontSize: '14px', outline: 'none', fontFamily: 'sans-serif', background: listening ? '#fef2f2' : 'white' }}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: input.trim() ? '#0891b2' : '#cbd5e1', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: '💼', title: 'Live Job Search', desc: 'Maya searches current active listings from the database in real time' },
            { icon: '🎮', title: '90+ ESL Games', desc: 'Ask about free games for any age group — Under 5s through to Primary' },
            { icon: '🎤', title: 'Voice Support', desc: 'Enable voice replies above and use the mic button to speak your questions' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.icon}</div>
              <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px', marginBottom: '4px' }}>{c.title}</div>
              <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.5' }}>{c.desc}</div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#999', fontSize: '13px' }}>
          Maya is an AI assistant and may occasionally make mistakes.{' '}
          <Link href="/contact" style={{ color: '#0891b2' }}>Contact us directly</Link>
          {' '}if you need guaranteed accurate information.
        </p>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </main>
  )
}

function Avatar() {
  return (
    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #0891b2, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
      👩‍🏫
    </div>
  )
}

function MayaBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <Avatar />
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', borderBottomLeftRadius: '4px', padding: '12px 16px', fontSize: '14px', lineHeight: '1.6', color: '#1a1a2e', maxWidth: '560px' }}>
        {children}
      </div>
    </div>
  )
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexDirection: 'row-reverse' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>👤</div>
      <div style={{ background: '#0891b2', color: 'white', borderRadius: '16px', borderBottomRightRadius: '4px', padding: '12px 16px', fontSize: '14px', lineHeight: '1.6', maxWidth: '560px', whiteSpace: 'pre-wrap' }}>
        {children}
      </div>
    </div>
  )
}