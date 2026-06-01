'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const SPEEDS = [
  { label: '🐢 Very Slow', value: 0.45 },
  { label: '🚶 Slow', value: 0.65 },
  { label: '🏃 Normal', value: 0.85 },
  { label: '⚡ Fast', value: 1.0 },
]

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

const PARTS = [
  {
    number: 1, title: 'My Home', emoji: '🏠', color: '#f59e0b',
    text: `My name is Sara. I live in an apartment. My apartment is on the third floor. It is not very big, but I love it.\n\nMy apartment has three rooms. There is a bedroom, a living room, and a kitchen. There is also a small bathroom. My bedroom is my favourite room. It is quiet and comfortable.\n\nI have a bed, a desk, and a wardrobe in my bedroom. I have a small window too. I can see a park from my window. In the morning, I open the window and I can hear the birds.`,
    vocab: [
      { word: 'apartment', definition: 'A set of rooms to live in, inside a bigger building.' },
      { word: 'floor', definition: 'A level in a building — the first floor, second floor, third floor.' },
      { word: 'comfortable', definition: 'Nice and relaxing — you feel good and happy there.' },
      { word: 'wardrobe', definition: 'A large piece of furniture where you keep your clothes.' },
    ],
    questions: [
      { n: 1, q: 'Do you live in an apartment or a house?' },
      { n: 2, q: 'How many rooms does your home have?' },
      { n: 3, q: 'What can you see from your window?' },
    ]
  },
  {
    number: 2, title: 'My Living Room', emoji: '🛋️', color: '#8b5cf6',
    text: `The living room is the biggest room in my apartment. My family spends a lot of time there. We watch TV together in the evening. We also eat snacks and talk.\n\nIn my living room, there is a sofa, a television, and a coffee table. There are also some plants near the window. I love the plants. They make the room feel happy and bright.\n\nOn weekends, I sometimes read a book on the sofa. My cat sits next to me. It is very relaxing. The living room is a special place for my family.`,
    vocab: [
      { word: 'sofa', definition: 'A long, soft seat for two or more people — also called a couch.' },
      { word: 'together', definition: 'With other people — not alone.' },
      { word: 'plant', definition: 'A living thing with leaves and roots — you keep it in a pot inside your home.' },
      { word: 'relaxing', definition: 'Calm and peaceful — it makes you feel less tired and less stressed.' },
    ],
    questions: [
      { n: 4, q: 'What do you do in your living room?' },
      { n: 5, q: 'Do you have any plants or pets in your home?' },
      { n: 6, q: 'What is your favourite room at home? Why?' },
    ]
  },
]

async function fetchTranslation(text: string, lang: string, type: 'word' | 'question' | 'message'): Promise<string> {
  const systems: Record<string, string> = {
    word: `You are a language learning assistant. Translate this English vocabulary entry to ${lang}. Return ONLY the translated word and a very short explanation in ${lang} (max 15 words). No extra text, no English.`,
    question: `You are a translator. Translate this English question to ${lang}. Return ONLY the translated question. No extra text.`,
    message: `You are a translator. Translate this English text to ${lang}. Return ONLY the translation. No extra text.`,
  }
  const res = await fetch('/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systems[type], messages: [{ role: 'user', content: text }] }),
  })
  const data = await res.json()
  return data.content || ''
}

function TranslateBtn({ text, type, lang, color, onTranslated }: {
  text: string; type: 'word' | 'question' | 'message'; lang: string; color: string; onTranslated: (t: string) => void
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
      style={{ background: isDisabled ? '#f3f4f6' : done ? '#f0fdf4' : color + '15', color: isDisabled ? '#d1d5db' : done ? '#16a34a' : color, border: `1px solid ${isDisabled ? '#e5e7eb' : done ? '#86efac' : color + '40'}`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: isDisabled ? 'not-allowed' : done ? 'default' : 'pointer', fontWeight: '700', flexShrink: 0, transition: 'all 0.2s' }}>
      {loading ? '...' : done ? '✓ 🌍' : '🌍'}
    </button>
  )
}

type Message = { role: 'user' | 'assistant'; content: string; translation?: string }

function ConversationBox({ question, color, translationLang }: { question: string; color: string; translationLang: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [open, setOpen] = useState(false)
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')

  const SYSTEM = `You are a very friendly and encouraging English teacher helping an A1 beginner student practise speaking. The topic is "My Home". The question is: "${question}". Use VERY simple English — short sentences, basic words only. Maximum 2 sentences in your reply. Always ask one simple follow-up question. If the student makes a grammar mistake, gently say "Good try! We say: ..." and give the correct sentence. Be very warm, patient and positive. Use simple emoji occasionally to feel friendly.`

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: SYSTEM, messages: updated.map(m => ({ role: m.role, content: m.content })) }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || 'Sorry, try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — please try again.' }]) }
    setLoading(false)
  }

  const setMessageTranslation = (idx: number, translation: string) => {
    setMessages(prev => prev.map((m, i) => i === idx ? { ...m, translation } : m))
  }

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input requires Chrome browser.'); return }
    transcriptRef.current = ''
    const r = new SR(); r.lang = 'en-US'; r.continuous = true; r.interimResults = true
    r.onstart = () => { setListening(true); setInterimText('') }
    r.onresult = (e: any) => {
      let final = ''; let interim = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) { final += e.results[i][0].transcript + ' ' }
        else { interim += e.results[i][0].transcript }
      }
      transcriptRef.current = final; setInterimText(final + interim)
    }
    r.onerror = () => { setListening(false); setInterimText('') }
    r.onend = () => {
      setListening(false)
      const text = transcriptRef.current.trim() || interimText.trim()
      if (text) { setInterimText(''); transcriptRef.current = ''; sendMessage(text) }
      else { setInterimText(''); transcriptRef.current = '' }
    }
    recognitionRef.current = r; r.start()
  }

  const stopVoice = () => { recognitionRef.current?.stop() }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ marginTop: '10px', width: '100%', background: color + '12', border: `2px dashed ${color}40`, borderRadius: '12px', padding: '10px', color, fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      🤖 Practice answering with AI
    </button>
  )

  return (
    <div style={{ marginTop: '10px', background: '#fffbeb', borderRadius: '14px', border: `2px solid ${color}30`, overflow: 'hidden' }}>
      <div style={{ background: color, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>🤖 AI English Teacher</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setMessages([])} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>🔄 Reset</button>
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>✕ Close</button>
        </div>
      </div>
      {messages.length === 0 && (
        <div style={{ padding: '14px 16px', color: '#6b7280', fontSize: '13px', lineHeight: '1.6', borderBottom: '1px solid #fde68a' }}>
          💡 Try to answer in English! Type or use the 🎤 microphone button. Don&apos;t worry about mistakes — just try!
        </div>
      )}
      {messages.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ fontSize: '20px', flexShrink: 0 }}>{m.role === 'user' ? '🧑‍🎓' : '👩‍🏫'}</div>
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: m.role === 'user' ? color : 'white', color: m.role === 'user' ? 'white' : '#374151', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '14px', lineHeight: '1.6', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: m.role === 'assistant' ? '1px solid #fde68a' : 'none' }}>
                  {m.content}
                </div>
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {!m.translation && <TranslateBtn text={m.content} type="message" lang={translationLang} color={color} onTranslated={(t) => setMessageTranslation(i, t)} />}
                  </div>
                )}
                {m.translation && (
                  <div style={{ background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                    <span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>🌍 Translation</span>
                    {m.translation}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '20px' }}>👩‍🏫</span>
              <div style={{ background: 'white', padding: '10px 14px', borderRadius: '4px 16px 16px 16px', fontSize: '14px', color: '#9ca3af', border: '1px solid #fde68a' }}>Thinking...</div>
            </div>
          )}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #fde68a', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
          placeholder="Type your answer in English..." rows={2}
          style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '2px solid #fde68a', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5', background: 'white' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={listening ? stopVoice : startVoice}
            style={{ background: listening ? '#ef4444' : '#22c55e', color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.3)' : 'none', transition: 'all 0.2s' }}>
            {listening ? '⏹' : '🎤'}
          </button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            style={{ background: input.trim() && !loading ? color : '#e5e7eb', color: input.trim() && !loading ? 'white' : '#9ca3af', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
        </div>
      </div>
      {listening && (
        <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #fee2e2', background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', flexShrink: 0 }} />
              <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>Recording... speak slowly and clearly!</span>
            </div>
            <button onClick={stopVoice} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop & Send</button>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: interimText ? '#374151' : '#9ca3af', lineHeight: '1.6', border: '1px solid #fca5a5', fontStyle: 'italic', minHeight: '40px' }}>
            {interimText || 'Waiting for speech...'}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MyHomePage() {
  const [speed, setSpeed] = useState(0.65)
  const [translationLang, setTranslationLang] = useState('none')
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [lookupDef, setLookupDef] = useState('')
  const [lookupTranslation, setLookupTranslation] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [vocabTranslations, setVocabTranslations] = useState<Record<string, string>>({})
  const [questionTranslations, setQuestionTranslations] = useState<Record<number, string>>({})

  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection()
      if (!sel) return
      const text = sel.toString().trim().replace(/\s+/g, ' ')
      if (!text || text.split(' ').length > 5) return
      const anchor = sel.anchorNode?.parentElement
      if (!anchor?.closest('[data-passage]')) return
      handleLookup(text)
    }
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)
    return () => { document.removeEventListener('mouseup', handleSelection); document.removeEventListener('touchend', handleSelection) }
  }, [translationLang])

  const handleLookup = async (text: string) => {
    if (!text || text.length < 2) return
    setSelectedText(text); setLookupDef(''); setLookupTranslation(''); setLookupLoading(true)
    speakWord(text)
    const isPhrase = text.includes(' ')
    try {
      if (translationLang === 'none') {
        const res = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: `You are an English dictionary for A1 beginners. Use VERY simple English. Respond with ONLY one sentence (max 12 words). No extra text.`,
            messages: [{ role: 'user', content: isPhrase ? `What does "${text}" mean? Very simple.` : `What is "${text}"? Very simple.` }],
          }),
        })
        const data = await res.json()
        setLookupDef(data.content || 'No definition found.')
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: `You are a language learning assistant for A1 English beginners. Respond ONLY with valid JSON (no markdown, no backticks): {"definition": "very simple English sentence max 12 words", "translation": "the word in ${translationLang} with a very short explanation in ${translationLang}, max 15 words"}`,
            messages: [{ role: 'user', content: `Word: "${text}"` }],
          }),
        })
        const data = await res.json()
        try {
          const parsed = JSON.parse(data.content)
          setLookupDef(parsed.definition || 'No definition found.')
          setLookupTranslation(parsed.translation || '')
        } catch { setLookupDef(data.content || 'No definition found.'); setLookupTranslation('') }
      }
    } catch { setLookupDef('Could not load definition.') }
    setLookupLoading(false)
  }

  function speakText(text: string) {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    sentences.forEach(s => { const u = new SpeechSynthesisUtterance(s.trim()); u.lang = 'en-GB'; u.rate = speed; u.pitch = 1; window.speechSynthesis.speak(u) })
  }

  function speakWord(word: string) {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word); u.lang = 'en-GB'; u.rate = 0.75; u.pitch = 1
    window.speechSynthesis.speak(u)
  }

  function stopAudio() { if (typeof window === 'undefined') return; window.speechSynthesis.cancel() }

  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  return (
    <main style={{ background: '#fffbeb', minHeight: '100vh' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #fbbf24 100%)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/a1" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← A1 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🏠</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.3)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>A1 Beginner</span>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Daily Life</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>2 Parts · 6 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '30px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>My Home</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>Rooms, furniture and favourite places — read about Sara&apos;s apartment and practise talking about your own home.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[{ icon: '📖', label: '2 short passages' }, { icon: '💬', label: '6 questions' }, { icon: '📚', label: '8 new words' }, { icon: '🔊', label: 'Listen & read' }, { icon: '🌍', label: 'Translation' }, { icon: '🤖', label: 'AI teacher' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section style={{ background: 'white', borderBottom: '2px solid #fde68a', padding: '12px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🔊 Speed:</span>
            {SPEEDS.map(s => (
              <button key={s.value} onClick={() => setSpeed(s.value)}
                style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#f59e0b' : '#e5e7eb', background: speed === s.value ? '#f59e0b' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🌍 Translate:</span>
            <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setQuestionTranslations({}) }}
              style={{ padding: '5px 12px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? '#f59e0b' : '#e5e7eb', background: translationLang !== 'none' ? '#fffbeb' : 'white', color: translationLang !== 'none' ? '#92400e' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600' }}>✍️ Tap any word to look it up</div>
        </div>
      </section>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {PARTS.map(part => (
          <div key={part.number} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>

            {/* Part header */}
            <div style={{ background: `linear-gradient(135deg, ${part.color}20, ${part.color}08)`, borderLeft: `5px solid ${part.color}`, padding: '18px 24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: part.color, color: 'white', width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>{part.number}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: part.color, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Part {part.number}</div>
                <h2 style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{part.emoji} {part.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => speakText(part.text.replace(/\n\n/g, ' '))}
                  style={{ background: part.color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: `0 3px 10px ${part.color}40` }}>
                  ▶ Listen
                </button>
                <button onClick={stopAudio}
                  style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 10px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  ⏹
                </button>
              </div>
            </div>

            {/* Hint bar */}
            <div style={{ background: `${part.color}10`, padding: '7px 24px', borderBottom: `1px solid ${part.color}20` }}>
              <span style={{ color: part.color, fontSize: '12px', fontWeight: '600' }}>
                ✍️ Tap any word to hear it and see what it means
                {translationLang !== 'none' && currentLang && <span> + {currentLang.label}</span>}
              </span>
            </div>

            {/* Passage */}
            <div data-passage="true" style={{ padding: '22px 24px 18px', userSelect: 'text', cursor: 'text' }}>
              {part.text.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: '#374151', fontSize: '17px', lineHeight: '2', margin: i === 0 ? '0 0 16px' : '0', fontFamily: 'Georgia, serif', fontWeight: '400' }}>{para}</p>
              ))}
            </div>

            {/* Vocabulary */}
            <div style={{ margin: '0 24px 24px', background: part.color + '08', border: `1px solid ${part.color}25`, borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: part.color + '20', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${part.color}20` }}>
                <span style={{ fontSize: '15px' }}>📚</span>
                <span style={{ color: part.color, fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>New Words</span>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {part.vocab.map((v, i) => {
                  const vKey = `${part.number}-${v.word}`
                  return (
                    <div key={v.word} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', paddingBottom: i < part.vocab.length - 1 ? '10px' : '0', borderBottom: i < part.vocab.length - 1 ? `1px solid ${part.color}15` : 'none' }}>
                      <div style={{ background: part.color, color: 'white', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <span data-passage="true" style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', userSelect: 'text', cursor: 'text' }}>{v.word}</span>
                          <button onClick={() => speakWord(v.word)} style={{ background: part.color + '15', color: part.color, border: `1px solid ${part.color}30`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0 }}>🔊</button>
                          <TranslateBtn text={`Word: "${v.word}". Meaning: "${v.definition}"`} type="word" lang={translationLang} color={part.color}
                            onTranslated={(t) => setVocabTranslations(prev => ({ ...prev, [vKey]: t }))} />
                        </div>
                        <span data-passage="true" style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', userSelect: 'text' }}>{v.definition}</span>
                        {vocabTranslations[vKey] && (
                          <div style={{ marginTop: '6px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '7px 12px' }}>
                            <span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>{currentLang?.label}</span>
                            <span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{vocabTranslations[vKey]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Questions */}
            <div style={{ background: '#1a1a2e', padding: '18px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px' }}>💬</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Questions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {part.questions.map(q => (
                  <div key={q.n}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ background: part.color, color: 'white', width: '26px', height: '26px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{q.n}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 6px', fontWeight: '500' }}>{q.q}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TranslateBtn text={q.q} type="question" lang={translationLang} color={part.color}
                            onTranslated={(t) => setQuestionTranslations(prev => ({ ...prev, [q.n]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#4b5563', fontSize: '11px' }}>← select a language above to translate</span>}
                        </div>
                        {questionTranslations[q.n] && (
                          <div style={{ marginTop: '8px', background: `${part.color}20`, border: `1px solid ${part.color}40`, borderRadius: '10px', padding: '9px 14px' }}>
                            <span style={{ color: part.color, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span>
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6' }}>{questionTranslations[q.n]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginLeft: '38px' }}>
                      <ConversationBox question={q.q} color={part.color} translationLang={translationLang} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}

        {/* Writing practice */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px 24px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '2px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>✍️</span>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Writing Practice</h3>
          </div>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px' }}>
            Write 3–5 sentences about your home. Try to use words from this lesson!
          </p>
          <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '16px', border: '2px dashed #fde68a' }}>
            <p style={{ color: '#92400e', fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>Try to write:</p>
            {[
              'I live in a _____ (house / apartment).',
              'My home has _____ rooms.',
              'My favourite room is the _____.',
              'In my _____, there is a _____.',
              'I like my home because _____.',
            ].map((prompt, i) => (
              <div key={i} style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.8', display: 'flex', gap: '8px' }}>
                <span style={{ color: '#f59e0b', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}.</span> {prompt}
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: selectedText ? '140px' : '16px' }}>
          <Link href="/esl-resources/reading-comprehension/a1" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to A1 Lessons</Link>
        </div>
      </div>

      {/* WORD LOOKUP POPUP */}
      {selectedText && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, animation: 'slideUp 0.25s ease' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', background: 'white', borderRadius: '20px 20px 0 0', padding: '18px 24px 28px', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', border: '2px solid #fde68a', borderBottom: 'none' }}>
            <div style={{ width: '36px', height: '4px', background: '#fde68a', borderRadius: '4px', margin: '0 auto 14px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#92400e', fontFamily: 'Georgia, serif' }}>"{selectedText}"</span>
                <button onClick={() => speakWord(selectedText)} style={{ background: '#fffbeb', color: '#92400e', border: '2px solid #fde68a', padding: '5px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>🔊 Hear it</button>
              </div>
              <button onClick={() => setSelectedText(null)} style={{ background: '#f3f4f6', border: 'none', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0 }}>✕</button>
            </div>
            {lookupLoading ? (
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 18px', border: '1px solid #fde68a', color: '#9ca3af', fontSize: '15px' }}>Looking up...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lookupDef && (
                  <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 18px', border: '1px solid #fde68a' }}>
                    <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📖 Meaning</div>
                    <span style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>{lookupDef}</span>
                  </div>
                )}
                {translationLang !== 'none' && lookupTranslation && (
                  <div style={{ background: '#fdf4ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e9d5ff' }}>
                    <div style={{ color: '#7c3aed', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{currentLang?.label}</div>
                    <span style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>{lookupTranslation}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
