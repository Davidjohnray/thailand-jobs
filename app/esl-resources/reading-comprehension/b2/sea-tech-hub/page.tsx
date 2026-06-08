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
    number: 1,
    title: 'From Manufacturing Powerhouse to Tech Innovator',
    emoji: '🏭',
    color: '#f59e0b',
    text: `For much of the twentieth century, Southeast Asia was primarily known as a region of manufacturing, agriculture, and natural resource exports. Nations like Thailand, Vietnam, and Indonesia were major producers of electronics components, textiles, and agricultural goods for global markets. While this economic model brought significant growth, it left the region heavily dependent on foreign investment and external demand. Beginning in the early 2010s, however, a significant shift began to take shape.\n\nA rapidly expanding middle class, surging smartphone adoption, and improving digital infrastructure created the conditions for a homegrown technology sector. Young entrepreneurs who had studied or worked abroad began returning to their home countries with international experience and ambitions. Governments across the region invested in education, broadband networks, and business-friendly regulations to attract both talent and capital. By the mid-2020s, Southeast Asia had firmly established itself as one of the world's fastest-growing technology markets, with a digital economy valued at over 300 billion US dollars and continuing to expand rapidly.`,
    vocab: [
      { word: 'Powerhouse', definition: 'A country or organisation with great strength, energy, or influence in a particular area.' },
      { word: 'Infrastructure', definition: 'The basic systems a country needs to function — roads, internet, electricity, transport.' },
      { word: 'Homegrown', definition: 'Developed locally within a country or region, rather than imported from abroad.' },
      { word: 'Capital', definition: 'Money available for investment in businesses and economic development.' },
    ],
    questions: [
      { n: 1, q: 'Why do you think Southeast Asia was able to shift so quickly from manufacturing to technology?' },
      { n: 2, q: 'What role does government investment play in building a successful tech sector?' },
      { n: 3, q: 'Is it an advantage or a disadvantage that Southeast Asia\'s tech boom came after Silicon Valley\'s?' },
    ]
  },
  {
    number: 2,
    title: 'Grab, Gojek, and Sea Group: Homegrown Giants',
    emoji: '🦄',
    color: '#22c55e',
    text: `The most visible symbols of Southeast Asia's tech rise are its homegrown superapp companies. Grab, founded in Malaysia in 2012 and now headquartered in Singapore, began as a ride-hailing service before expanding into food delivery, financial services, and healthcare. Today it operates across eight countries and serves tens of millions of users daily. Its Indonesian rival, Gojek, followed a similar path — starting with motorcycle taxis in Jakarta and growing into a platform offering over twenty services, from grocery delivery to digital payments.\n\nPerhaps the most ambitious of the regional giants is Sea Group, also headquartered in Singapore. Founded in 2009, Sea built its business on online gaming before expanding into e-commerce through its Shopee platform and digital finance through SeaMoney. By 2021, Sea had become Southeast Asia's most valuable listed company with a market capitalisation exceeding 200 billion US dollars. These companies are not simply copies of American or Chinese tech firms — they have adapted their services to the specific needs of a diverse, mobile-first region where many users have limited access to traditional banking and prefer to transact on a smartphone rather than a desktop computer.`,
    vocab: [
      { word: 'Superapp', definition: 'A single mobile application that offers many different services — transport, payments, shopping — in one place.' },
      { word: 'Ride-hailing', definition: 'A service where users book private cars or motorbikes through a smartphone app.' },
      { word: 'Market capitalisation', definition: 'The total value of a company\'s shares — used as a measure of its overall size and worth.' },
      { word: 'Mobile-first', definition: 'Designed primarily for smartphone users rather than desktop or laptop computer users.' },
    ],
    questions: [
      { n: 4, q: 'Why have superapps become so popular in Southeast Asia but less dominant in Western markets?' },
      { n: 5, q: 'Is it more impressive to build a company in an emerging market or an established one?' },
      { n: 6, q: 'How important is financial inclusion — giving people without bank accounts access to digital finance — to the region\'s development?' },
    ]
  },
  {
    number: 3,
    title: 'Singapore, Vietnam, Indonesia, and Thailand: Four Different Approaches',
    emoji: '🗺️',
    color: '#3b82f6',
    text: `Southeast Asia is not a single unified market — it comprises eleven nations with different languages, legal systems, currencies, and levels of development. This diversity means that different countries have taken different paths to building their tech ecosystems.\n\nSingapore has positioned itself as the region's financial and innovation capital. With world-class universities, a transparent legal system, low corporate tax rates, and strong intellectual property protections, it attracts regional headquarters for multinational corporations and venture capital firms. Vietnam has emerged as a major destination for technology manufacturing and software outsourcing, with companies like Samsung and Intel operating large facilities there. Its growing pool of young, skilled engineers has also begun to produce ambitious local startups. Indonesia, with a population of over 270 million and a rapidly expanding middle class, represents the region's largest consumer market — making it an essential battleground for any tech company with regional ambitions. Thailand, meanwhile, has invested heavily in smart city initiatives and digital government services, and its Eastern Economic Corridor has attracted significant foreign investment in advanced manufacturing and data centres.`,
    vocab: [
      { word: 'Ecosystem', definition: 'A network of interconnected organisations, investors, and talent that together support innovation.' },
      { word: 'Venture capital', definition: 'Investment provided to early-stage companies with high growth potential, in exchange for a share of ownership.' },
      { word: 'Outsourcing', definition: 'Hiring an external company or team — often in another country — to perform a business function.' },
      { word: 'Smart city', definition: 'An urban area that uses technology and data to improve efficiency, sustainability, and quality of life.' },
    ],
    questions: [
      { n: 7, q: 'Which of the four countries\' approaches to tech growth do you find most interesting, and why?' },
      { n: 8, q: 'Is it better for a country to focus on one tech strength or to develop many different sectors?' },
      { n: 9, q: 'How can smaller countries in Southeast Asia compete with larger ones like Indonesia?' },
    ]
  },
  {
    number: 4,
    title: 'Challenges, Competition, and the Road Ahead',
    emoji: '🚀',
    color: '#8b5cf6',
    text: `Despite its impressive growth, Southeast Asia's tech sector faces significant challenges. Talent shortages are a persistent problem — the demand for skilled software engineers, data scientists, and product managers consistently outpaces the supply. Brain drain remains a concern in smaller economies, where the best graduates are often recruited by companies in Singapore, the United States, or Australia. Regulatory fragmentation — the fact that companies must navigate eleven different legal systems — adds cost and complexity that can slow expansion.\n\nGeopolitical tensions also create uncertainty. The rivalry between the United States and China has placed Southeast Asia in a delicate position as both powers compete for technological and economic influence in the region. Local companies must decide whether to align with American platforms, Chinese investors, or attempt to remain independent — a difficult balance in an increasingly divided global technology landscape. Nevertheless, the long-term outlook remains broadly positive. A young and growing population, rising incomes, improving digital infrastructure, and a new generation of ambitious entrepreneurs all point toward continued expansion. Whether Southeast Asia can produce globally competitive technology companies — rather than strong regional ones — will be one of the defining business stories of the coming decade.`,
    vocab: [
      { word: 'Brain drain', definition: 'The emigration of highly educated or skilled people from one country to another with better opportunities.' },
      { word: 'Regulatory fragmentation', definition: 'The complexity caused by having many different sets of laws and rules across different countries or regions.' },
      { word: 'Geopolitical', definition: 'Relating to how geography and political power between countries affect world events.' },
      { word: 'Outlook', definition: 'The likely future situation — the prospects for how things will develop.' },
    ],
    questions: [
      { n: 10, q: 'How can Southeast Asian countries reduce brain drain and keep talented people at home?' },
      { n: 11, q: 'Should the region try to stay neutral in the US–China tech rivalry, or choose a side?' },
      { n: 12, q: 'Do you think a Southeast Asian company will become a global tech giant within the next twenty years?' },
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

  const SYSTEM = `You are a friendly English conversation partner helping a B2 level student practise discussion skills. The reading topic is "The Rise of Southeast Asia as a Tech Hub". The current discussion question is: "${question}". Keep every response to 2-3 sentences maximum. Always end with one natural follow-up question to keep the conversation going. If the student makes a significant grammar error, gently correct it at the very end using "💡 Quick tip: ..." — only the most important error. Be encouraging and warm.`

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
          💡 Type your answer or tap <strong>🎤 Start Recording</strong> — speak your full answer, then tap <strong>⏹ Stop & Send</strong>.
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
              <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>Recording... speak your full answer</span>
            </div>
            <button onClick={stopVoice} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>⏹ Stop & Send</button>
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

export default function SEATechHubPage() {
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
              ? `You are an English dictionary for B2 learners. Respond with ONLY one sentence (max 25 words) explaining what the phrase means. No extra text.`
              : `You are an English dictionary for B2 learners. Respond with ONLY one sentence (max 20 words) defining this word simply. No extra text.`,
            messages: [{ role: 'user', content: isPhrase ? `What does "${text}" mean?` : `Define: "${text}"` }],
          }),
        })
        const data = await res.json()
        setLookupDef(data.content || 'No definition found.')
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: `You are a language learning assistant for B2 English students. Respond ONLY with valid JSON (no markdown, no backticks): {"definition": "one simple English sentence max 20 words", "translation": "the word/phrase in ${translationLang} with a brief explanation in ${translationLang}, max 30 words"}`,
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

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B2 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>🌏</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#3b82f6', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B2 Upper Intermediate</span>
                <span style={{ background: 'rgba(251,191,36,0.7)', color: '#1a1a2e', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Work & Business</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>The Rise of Southeast Asia as a Tech Hub</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>Silicon Valley of the East — explore how Singapore, Vietnam, Indonesia, and Thailand are building world-class tech industries, and what Grab, Gojek, and Sea Group reveal about the region's ambitions.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[{ icon: '📄', label: '4 reading parts' }, { icon: '💬', label: '12 discussion questions' }, { icon: '📚', label: '16 vocabulary words' }, { icon: '✍️', label: 'Highlight any text' }, { icon: '🌍', label: 'Multi-language lookup' }, { icon: '🤖', label: 'AI conversation partner' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE + SPEED + LANGUAGE */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>How to use:</span>
            {['🔊 Play passage aloud', '✍️ Highlight any text for lookup', '🌍 Translate vocab, questions & AI answers', '🤖 Practice with AI'].map((step, i) => (
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
                  style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#3b82f6' : '#e5e7eb', background: speed === s.value ? '#3b82f6' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🌍 Translate to:</span>
              <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setQuestionTranslations({}) }}
                style={{ padding: '5px 12px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? '#3b82f6' : '#e5e7eb', background: translationLang !== 'none' ? '#eff6ff' : 'white', color: translationLang !== 'none' ? '#1d4ed8' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
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
                <h2 data-passage="true" style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: 'bold', margin: 0, userSelect: 'text', cursor: 'text' }}>{part.emoji} {part.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => speakText(part.text.replace(/\n\n/g, ' '))} style={{ background: part.color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: `0 3px 10px ${part.color}40` }}>▶ Play Passage</button>
                <button onClick={stopAudio} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop</button>
              </div>
            </div>

            <div style={{ background: '#eff6ff', padding: '8px 28px', borderBottom: '1px solid #dbeafe' }}>
              <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600' }}>
                ✍️ Highlight any word, phrase or title to hear it and see its meaning
                {translationLang !== 'none' && <span style={{ color: '#1d4ed8' }}> + {currentLang?.label} translation</span>}
              </span>
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
                          <span data-passage="true" style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', userSelect: 'text', cursor: 'text' }}>{v.word}</span>
                          <button onClick={() => speakWord(v.word)} style={{ background: part.color + '15', color: part.color, border: `1px solid ${part.color}30`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0 }}>🔊</button>
                          <TranslateBtn text={`Word: "${v.word}"\nDefinition: "${v.definition}"`} type="word" lang={translationLang} color={part.color}
                            onTranslated={(t) => setVocabTranslations(prev => ({ ...prev, [vKey]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#d1d5db', fontSize: '11px' }}>← select a language to translate</span>}
                        </div>
                        <span data-passage="true" style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', userSelect: 'text', cursor: 'text' }}>{v.definition}</span>
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
                        <p data-passage="true" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 6px', userSelect: 'text', cursor: 'text' }}>{q.q}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <TranslateBtn text={q.q} type="question" lang={translationLang} color={part.color}
                            onTranslated={(t) => setQuestionTranslations(prev => ({ ...prev, [q.n]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#4b5563', fontSize: '11px' }}>← select a language to translate</span>}
                        </div>
                        {questionTranslations[q.n] && (
                          <div style={{ marginTop: '8px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '10px', padding: '10px 14px' }}>
                            <span style={{ color: '#93c5fd', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span>
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
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to B2 Reading Comprehension</Link>
        </div>
      </div>

      {selectedText && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, animation: 'slideUp 0.25s ease' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', background: 'white', borderRadius: '20px 20px 0 0', padding: '20px 24px 32px', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', border: '2px solid #dbeafe', borderBottom: 'none' }}>
            <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '4px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', fontFamily: 'Georgia, serif' }}>"{selectedText}"</span>
                <button onClick={() => speakWord(selectedText)} style={{ background: '#eff6ff', color: '#3b82f6', border: '2px solid #bfdbfe', padding: '6px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', flexShrink: 0 }}>🔊 Hear it</button>
              </div>
              <button onClick={() => setSelectedText(null)} style={{ background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0, marginLeft: '12px' }}>✕</button>
            </div>
            {lookupLoading ? (
              <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #dbeafe', color: '#9ca3af', fontSize: '15px' }}>
                {translationLang !== 'none' ? `Looking up definition and ${currentLang?.label} translation...` : 'Looking up...'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #dbeafe' }}>
                  <div style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📖 English Definition</div>
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
