'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const SPEEDS = [
  { label: '🐢 Very Slow', value: 0.55 },
  { label: '🚶 Slow', value: 0.72 },
  { label: '🏃 Normal', value: 0.9 },
  { label: '⚡ Fast', value: 1.1 },
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
    number: 1, title: 'Tourism Around the World', emoji: '✈️', color: '#f59e0b',
    text: `Tourism is one of the biggest industries in the world. Every year, hundreds of millions of people travel to different countries to see famous places, experience new cultures, and enjoy their holidays. Countries like France, Thailand, Spain, Italy, and the United States welcome tens of millions of tourists each year. For many nations, tourism is an extremely important source of income.\n\nIn recent decades, tourism has grown very quickly. Cheaper flights, the internet, and booking apps have made it easier and more affordable for people to travel internationally. Social media has also played a big role — when people post beautiful photos of a destination online, it can attract millions of new visitors. Some places that were almost unknown twenty years ago have become incredibly popular tourist destinations because of social media. This rapid growth has brought many benefits to local communities, but it has also created some serious problems that are becoming harder and harder to ignore.`,
    vocab: [
      { word: 'Industry', definition: 'A type of business or economic activity — tourism is one of the world\'s largest industries.' },
      { word: 'Income', definition: 'Money that a person, business, or country receives regularly — tourism brings income to many countries.' },
      { word: 'Affordable', definition: 'Not too expensive — something that most people can pay for without spending too much money.' },
      { word: 'Destination', definition: 'The place where someone is travelling to — a popular tourist destination is a place many people want to visit.' },
    ],
    questions: [
      { n: 1, q: 'Have you ever visited another country as a tourist? What did you enjoy most about the experience?' },
      { n: 2, q: 'Why do you think people enjoy travelling to other countries? What do they usually hope to see or do?' },
      { n: 3, q: 'Can you think of a place that became very popular because of social media? What effect did this have?' },
    ]
  },
  {
    number: 2, title: 'The Benefits of Tourism for Local Communities', emoji: '💰', color: '#22c55e',
    text: `Tourism can bring many benefits to the communities that welcome visitors. The most obvious benefit is economic. When tourists visit a place, they spend money on hotels, restaurants, transport, shopping, and activities. This money goes directly to local businesses and creates jobs for local people. In some areas — especially in developing countries — tourism is the main source of employment for many families.\n\nTourism can also help to preserve local culture and heritage. When tourists come to see traditional festivals, local crafts, or historic buildings, communities are encouraged to protect and celebrate these things. Museums, cultural centres, and heritage sites often receive funding from tourism. Additionally, tourism can improve infrastructure in a region — roads, airports, and public services are often improved to make the area more attractive to visitors, which also benefits local residents. Some communities have also used tourism to raise awareness about environmental issues, encouraging visitors to learn about and help protect natural areas.`,
    vocab: [
      { word: 'Economic', definition: 'Relating to money, businesses, and the financial system of a country or region.' },
      { word: 'Employment', definition: 'Having a paid job — when someone is employed, they work and receive money for their work.' },
      { word: 'Heritage', definition: 'The traditions, buildings, and culture that have been passed down from the past and are considered important to protect.' },
      { word: 'Infrastructure', definition: 'The basic systems and structures a country needs to work — such as roads, airports, electricity, and water supply.' },
    ],
    questions: [
      { n: 4, q: 'What are the most important economic benefits of tourism for a local community? Can you think of any examples from your own country?' },
      { n: 5, q: 'Do you think tourism always helps to preserve local culture, or can it sometimes damage it? Give reasons for your answer.' },
      { n: 6, q: 'Have you ever seen infrastructure in your area improve because of tourism? What changed?' },
    ]
  },
  {
    number: 3, title: 'The Problems Tourism Can Cause', emoji: '⚠️', color: '#ef4444',
    text: `Although tourism brings many benefits, it can also cause serious problems for local communities. One of the biggest issues is overcrowding. Some destinations become so popular that they are completely overwhelmed by visitors. In cities like Venice, Barcelona, and Kyoto, local residents complain that the streets are too crowded, prices have risen sharply, and it is difficult to live a normal daily life. Some residents have been forced to move out of city centres because rents have become too expensive — this is called "tourist gentrification."\n\nTourism also has a significant impact on the environment. Large numbers of visitors can damage natural areas — forests, beaches, coral reefs, and wildlife habitats can all be harmed by careless tourists. The carbon emissions from air travel contribute to climate change, and plastic waste left by tourists is a major problem in many coastal and natural areas. In some places, local culture is also affected negatively. Traditional ways of life can change when a community becomes dependent on tourism — local festivals may become performances for tourists rather than genuine celebrations, and traditional crafts may be replaced by cheap mass-produced souvenirs.`,
    vocab: [
      { word: 'Overcrowding', definition: 'When too many people are in a place at the same time — making it uncomfortable, difficult, or damaging.' },
      { word: 'Overwhelmed', definition: 'Having too much of something to deal with — feeling unable to manage because there is too much pressure or quantity.' },
      { word: 'Gentrification', definition: 'When an area becomes more expensive and changes as wealthier people move in — often forcing out original residents.' },
      { word: 'Dependent', definition: 'Relying on something or someone for support — when a community is dependent on tourism, it needs tourism to survive.' },
    ],
    questions: [
      { n: 7, q: 'Have you ever visited a place that felt too crowded with tourists? How did it affect your experience?' },
      { n: 8, q: 'Do you think tourists have a responsibility to protect the places they visit? What should they do or avoid doing?' },
      { n: 9, q: 'Is it fair if local people have to move out of their homes because tourism has made rents too expensive? What could be done to prevent this?' },
    ]
  },
  {
    number: 4, title: 'Finding a Better Way to Travel', emoji: '🌿', color: '#8b5cf6',
    text: `Many experts and communities are now looking for ways to manage tourism more carefully. One idea is "sustainable tourism" — a way of travelling that tries to protect the environment and benefit local communities, rather than damage them. Sustainable tourists try to stay in locally owned guesthouses rather than large international hotel chains, eat at local restaurants, and buy products made by local people. They also try to minimise their impact on the environment by avoiding single-use plastic and respecting natural areas.\n\nSome governments have introduced policies to limit the number of tourists in sensitive areas. In Bhutan, for example, tourists must pay a high daily fee to visit the country, which limits the number of visitors and helps fund conservation projects. New Zealand and Iceland have introduced visitor taxes to pay for the environmental damage caused by tourism. Other places, like the Italian island of Capri, have completely banned large cruise ships. These are difficult decisions, because limiting tourism also means reducing income — but many communities are starting to feel that the quality of life for local people must come first. The future of tourism will depend on whether visitors, companies, and governments can work together to find a better balance.`,
    vocab: [
      { word: 'Sustainable', definition: 'Able to continue for a long time without causing damage — sustainable tourism tries not to harm the environment or communities.' },
      { word: 'Minimise', definition: 'To reduce something to the smallest possible amount — to make something as small or limited as possible.' },
      { word: 'Conservation', definition: 'The protection of nature, animals, and the environment — keeping natural areas safe from damage or destruction.' },
      { word: 'Policy', definition: 'A set of rules or plans made by a government or organisation to deal with a particular issue or situation.' },
    ],
    questions: [
      { n: 10, q: 'What is sustainable tourism? Do you think it is possible for most tourists to travel in this way? Why or why not?' },
      { n: 11, q: 'Should governments limit the number of tourists allowed to visit popular places? What are the advantages and disadvantages of doing this?' },
      { n: 12, q: 'Overall, do you think tourism is more positive or more negative for local communities? Give reasons for your answer.' },
    ]
  },
]

async function fetchTranslation(text: string, lang: string, type: 'word' | 'question' | 'message'): Promise<string> {
  const systems: Record<string, string> = {
    word: `You are a language learning assistant. Translate this English vocabulary entry to ${lang}. Return ONLY the translated word and a brief explanation in ${lang} (max 25 words). No extra text, no English.`,
    question: `You are a translator. Translate this English discussion question to ${lang}. Return ONLY the translated question. No extra text.`,
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
      title={isDisabled ? 'Select a language above to translate' : done ? 'Translated' : `Translate to ${lang}`}
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

  const SYSTEM = `You are a friendly English conversation partner helping a B1 level student practise discussion skills. The reading topic is "Tourism — Good or Bad for Local Communities?". The current discussion question is: "${question}". Keep every response to 2-3 sentences maximum. Use simple, clear English suitable for B1 level. Always end with one natural follow-up question. If the student makes a significant grammar error, gently correct it at the very end using "💡 Quick tip: ..." — only the most important error. Be encouraging and warm.`

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
          💡 Type your answer or tap <strong>🎤 Start Recording</strong> — speak your answer, then tap <strong>⏹ Stop & Send</strong>.
        </div>
      )}
      {messages.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ fontSize: '20px', flexShrink: 0 }}>{m.role === 'user' ? '🧑‍🎓' : '🤖'}</div>
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: m.role === 'user' ? color : 'white', color: m.role === 'user' ? 'white' : '#374151', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '14px', lineHeight: '1.6', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: m.role === 'assistant' ? '1px solid #e5e7eb' : 'none' }}>
                  {m.content}
                </div>
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {!m.translation && <TranslateBtn text={m.content} type="message" lang={translationLang} color={color} onTranslated={(t) => setMessageTranslation(i, t)} />}
                    {translationLang === 'none' && !m.translation && <span style={{ color: '#9ca3af', fontSize: '11px' }}>Select a language to translate</span>}
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
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div style={{ background: 'white', padding: '10px 14px', borderRadius: '4px 16px 16px 16px', fontSize: '14px', color: '#9ca3af', border: '1px solid #e5e7eb' }}>Thinking...</div>
            </div>
          )}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
          placeholder="Type your answer here..." rows={2}
          style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={listening ? stopVoice : startVoice}
            style={{ background: listening ? '#ef4444' : '#22c55e', color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.3)' : 'none', transition: 'all 0.2s' }}>
            {listening ? '⏹' : '🎤'}
          </button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            style={{ background: input.trim() && !loading ? color : '#e5e7eb', color: input.trim() && !loading ? 'white' : '#9ca3af', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
        </div>
      </div>
      {!listening && (
        <div style={{ padding: '4px 16px 10px', display: 'flex', gap: '16px' }}>
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>🎤 = Start recording</span>
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>⏹ = Stop & send</span>
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>➤ = Send typed</span>
        </div>
      )}
      {listening && (
        <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #fee2e2', background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', flexShrink: 0 }} />
              <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>Recording...</span>
            </div>
            <button onClick={stopVoice} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop & Send</button>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: interimText ? '#374151' : '#9ca3af', lineHeight: '1.6', border: '1px solid #fca5a5', fontStyle: 'italic', minHeight: '40px' }}>
            {interimText || 'Waiting for speech...'}
            {interimText && <span style={{ display: 'inline-block', width: '2px', height: '16px', background: '#ef4444', marginLeft: '2px', verticalAlign: 'middle', animation: 'pulse 1s infinite' }} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TourismPage() {
  const [speed, setSpeed] = useState(0.9)
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
      if (!text || text.split(' ').length > 6) return
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
            system: isPhrase
              ? `You are an English dictionary for B1 learners. Respond with ONLY one simple sentence (max 20 words) explaining what the phrase means. No extra text.`
              : `You are an English dictionary for B1 learners. Respond with ONLY one simple sentence (max 15 words) defining this word. No extra text.`,
            messages: [{ role: 'user', content: isPhrase ? `What does "${text}" mean?` : `Define: "${text}"` }],
          }),
        })
        const data = await res.json()
        setLookupDef(data.content || 'No definition found.')
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: `You are a language learning assistant for B1 English students. Respond ONLY with valid JSON (no markdown, no backticks): {"definition": "one simple English sentence max 15 words", "translation": "the word/phrase in ${translationLang} with a brief explanation in ${translationLang}, max 25 words"}`,
            messages: [{ role: 'user', content: `Word or phrase: "${text}"` }],
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
    const u = new SpeechSynthesisUtterance(word); u.lang = 'en-GB'; u.rate = 0.85; u.pitch = 1
    window.speechSynthesis.speak(u)
  }

  function stopAudio() { if (typeof window === 'undefined') return; window.speechSynthesis.cancel() }
  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      <section style={{ background: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B1 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>✈️</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#92400e', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(34,197,94,0.7)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Society & Culture</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>Tourism — Good or Bad for Local Communities?</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>Welcome or Not Welcome? — Explore the benefits and problems that tourism brings to local communities, and how we can travel in a better way.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[{ icon: '📄', label: '4 reading parts' }, { icon: '💬', label: '12 discussion questions' }, { icon: '📚', label: '16 vocabulary words' }, { icon: '✍️', label: 'Highlight any text' }, { icon: '🌍', label: 'Multi-language lookup' }, { icon: '🤖', label: 'AI conversation partner' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>How to use:</span>
            {['🔊 Play passage aloud', '✍️ Highlight any text for lookup', '🌍 Translate vocab & questions', '🤖 Practice with AI'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '13px' }}>
                <span style={{ background: '#E85D26', color: 'white', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🔊 Speed:</span>
              {SPEEDS.map(s => (
                <button key={s.value} onClick={() => setSpeed(s.value)}
                  style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#f59e0b' : '#e5e7eb', background: speed === s.value ? '#f59e0b' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🌍 Translate to:</span>
              <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setQuestionTranslations({}) }}
                style={{ padding: '5px 12px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? '#f59e0b' : '#e5e7eb', background: translationLang !== 'none' ? '#fffbeb' : 'white', color: translationLang !== 'none' ? '#92400e' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {PARTS.map(part => (
          <div key={part.number} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: `linear-gradient(135deg, ${part.color}22, ${part.color}08)`, borderLeft: `5px solid ${part.color}`, padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: part.color, color: 'white', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>{part.number}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: part.color, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Part {part.number}</div>
                <h2 data-passage="true" style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{part.emoji} {part.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => speakText(part.text.replace(/\n\n/g, ' '))} style={{ background: part.color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>▶ Play</button>
                <button onClick={stopAudio} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop</button>
              </div>
            </div>

            <div style={{ background: '#fffbeb', padding: '8px 28px', borderBottom: '1px solid #fde68a' }}>
              <span style={{ color: '#92400e', fontSize: '12px', fontWeight: '600' }}>✍️ Highlight any word or phrase to look it up{translationLang !== 'none' && <span style={{ color: '#d97706' }}> + {currentLang?.label} translation</span>}</span>
            </div>

            <div data-passage="true" style={{ padding: '24px 28px 20px', userSelect: 'text', cursor: 'text' }}>
              {part.text.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: '1.85', margin: i === 0 ? '0 0 18px' : '0', fontFamily: 'Georgia, serif' }}>{para}</p>
              ))}
            </div>

            <div style={{ margin: '0 28px 24px', background: part.color + '08', border: `1px solid ${part.color}25`, borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: part.color + '18', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${part.color}20` }}>
                <span style={{ fontSize: '16px' }}>📚</span>
                <span style={{ color: part.color, fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vocabulary — Part {part.number}</span>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {part.vocab.map((v, i) => {
                  const vKey = `${part.number}-${v.word}`
                  return (
                    <div key={v.word} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: i < part.vocab.length - 1 ? '10px' : '0', borderBottom: i < part.vocab.length - 1 ? `1px solid ${part.color}15` : 'none' }}>
                      <div style={{ background: part.color, color: 'white', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <span data-passage="true" style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>{v.word}</span>
                          <button onClick={() => speakWord(v.word)} style={{ background: part.color + '15', color: part.color, border: `1px solid ${part.color}30`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0 }}>🔊</button>
                          <TranslateBtn text={`Word: "${v.word}"\nDefinition: "${v.definition}"`} type="word" lang={translationLang} color={part.color} onTranslated={(t) => setVocabTranslations(prev => ({ ...prev, [vKey]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#d1d5db', fontSize: '11px' }}>← select a language</span>}
                        </div>
                        <span data-passage="true" style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{v.definition}</span>
                        {vocabTranslations[vKey] && (
                          <div style={{ marginTop: '6px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '8px 12px' }}>
                            <span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span>
                            <span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{vocabTranslations[vKey]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

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
                      <div style={{ flex: 1 }}>
                        <p data-passage="true" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 6px' }}>{q.q}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <TranslateBtn text={q.q} type="question" lang={translationLang} color={part.color} onTranslated={(t) => setQuestionTranslations(prev => ({ ...prev, [q.n]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#4b5563', fontSize: '11px' }}>← select a language</span>}
                        </div>
                        {questionTranslations[q.n] && (
                          <div style={{ marginTop: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '10px 14px' }}>
                            <span style={{ color: '#fbbf24', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span>
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6' }}>{questionTranslations[q.n]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginLeft: '42px' }}>
                      <ConversationBox question={q.q} color={part.color} translationLang={translationLang} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', paddingBottom: selectedText ? '140px' : '16px' }}>
          <Link href="/esl-resources/reading-comprehension/b1" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to B1 Reading Comprehension</Link>
        </div>
      </div>

      {selectedText && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, animation: 'slideUp 0.25s ease' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', background: 'white', borderRadius: '20px 20px 0 0', padding: '20px 24px 32px', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', border: '2px solid #fde68a', borderBottom: 'none' }}>
            <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '4px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', fontFamily: 'Georgia, serif' }}>"{selectedText}"</span>
                <button onClick={() => speakWord(selectedText)} style={{ background: '#fffbeb', color: '#92400e', border: '2px solid #fde68a', padding: '6px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>🔊 Hear it</button>
              </div>
              <button onClick={() => setSelectedText(null)} style={{ background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', marginLeft: '12px' }}>✕</button>
            </div>
            {lookupLoading ? (
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 18px', border: '1px solid #fde68a', color: '#9ca3af', fontSize: '15px' }}>Looking up...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 18px', border: '1px solid #fde68a' }}>
                  <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📖 English Definition</div>
                  <span style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>{lookupDef}</span>
                </div>
                {translationLang !== 'none' && lookupTranslation && (
                  <div style={{ background: '#fdf4ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e9d5ff' }}>
                    <div style={{ color: '#7c3aed', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{currentLang?.label} Translation</div>
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
