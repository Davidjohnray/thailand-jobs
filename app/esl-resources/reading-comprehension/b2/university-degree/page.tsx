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
    number: 1, title: 'The University Dream', emoji: '🎓', color: '#f59e0b',
    text: `For much of the twentieth century, a university degree was widely seen as a guaranteed pathway to a secure, well-paying job and a comfortable middle-class life. Parents across the world encouraged their children to study hard, gain good grades, and go to university — the implicit promise being that a degree would open doors that would otherwise remain closed. In many countries, higher education was heavily subsidised by the state, making it accessible to a much broader section of society than ever before.\n\nHowever, the landscape has changed dramatically. In many countries, university tuition fees have risen sharply over the past two decades. In England, tuition fees were introduced in 1998 and have since risen to £9,250 per year — meaning a typical three-year degree now leaves students with over £50,000 in debt before they have earned a single pound. In the United States, the situation is even more acute: the total outstanding student loan debt has surpassed $1.7 trillion, and graduates in some fields earn barely enough to make a dent in their repayments. Against this backdrop, a growing number of young people — and their families — are asking a question that once seemed almost taboo: is a university degree actually worth it?`,
    vocab: [
      { word: 'Subsidised', definition: 'Supported financially by a government or organisation so that the cost to the individual is reduced or free.' },
      { word: 'Tuition fees', definition: 'The money charged by a university for the teaching and academic programmes it provides to students.' },
      { word: 'Outstanding debt', definition: 'The amount of money that has been borrowed and not yet paid back — the remaining balance on a loan.' },
      { word: 'Taboo', definition: 'A subject that is considered socially unacceptable or forbidden to discuss — something people avoid talking about openly.' },
    ],
    questions: [
      { n: 1, q: 'Why do you think university degrees were seen as such a reliable route to success in the past? Has this view changed in your country?' },
      { n: 2, q: 'How much do university students pay in tuition fees in your country? Do you think this is reasonable, or is it too expensive?' },
      { n: 3, q: 'Would you describe starting your career with significant student debt as a serious problem? How might it affect someone\'s life choices after graduation?' },
    ]
  },
  {
    number: 2, title: 'The Case For a Degree', emoji: '✅', color: '#22c55e',
    text: `Despite the rising costs, there remains a strong case for pursuing a university education. Statistically, graduates continue to earn significantly more than non-graduates over the course of their working lives. In the UK, the average graduate earns around £10,000 more per year than a non-graduate — a premium that, over a forty-year career, far outweighs the initial cost of the degree. In the US, the wage gap between graduates and non-graduates has widened considerably since the 1980s, with degree holders typically earning 65% more than those without a university qualification.\n\nBeyond earning potential, universities offer benefits that are difficult to quantify in purely financial terms. The experience of studying a subject in depth, developing critical thinking skills, and engaging with diverse ideas and perspectives shapes graduates in ways that employers consistently value. University also provides networking opportunities and social capital — the connections formed during three or four years of shared academic and social life can open doors throughout a career. For certain professions — medicine, law, architecture, engineering — a degree is not simply advantageous but legally required. And in many parts of the world, particularly in Asia, a university degree carries enormous cultural weight, shaping social status and family expectations in ways that go far beyond simple economics.`,
    vocab: [
      { word: 'Premium', definition: 'An additional amount above the standard — a wage premium means earning more than the average for that type of work.' },
      { word: 'Quantify', definition: 'To measure or express something as a number or quantity — some benefits are hard to quantify because they cannot easily be counted.' },
      { word: 'Social capital', definition: 'The networks of relationships and connections a person has that can provide help, opportunities, and advantages in life and work.' },
      { word: 'Advantageous', definition: 'Providing a benefit or advantage — something that helps you succeed or puts you in a better position than others.' },
    ],
    questions: [
      { n: 4, q: 'The passage argues that graduates earn significantly more over their careers. Do you think this earnings difference alone justifies the cost of a degree? What other factors should be considered?' },
      { n: 5, q: 'Which do you think is more valuable from a university education — the specific subject knowledge, the critical thinking skills, or the social connections? Give reasons.' },
      { n: 6, q: 'In your culture, how important is a university degree for social status and family expectations? Is this pressure a positive or negative thing?' },
    ]
  },
  {
    number: 3, title: 'The Case Against', emoji: '⚠️', color: '#ef4444',
    text: `Critics of the university system argue that the traditional degree model is increasingly failing both students and society. One major concern is the mismatch between what universities teach and what employers actually need. Many graduates find that their degrees did not prepare them adequately for the workplace — surveys consistently show that employers value practical skills, communication, and problem-solving over academic knowledge in most roles. Meanwhile, degrees in certain subjects — the arts, humanities, and some social sciences — are frequently targeted by politicians and media commentators who question their economic value.\n\nThe rise of alternative pathways has also challenged the dominance of the degree. Vocational qualifications, apprenticeships, and online learning platforms such as Coursera, edX, and LinkedIn Learning now offer credible routes into many careers. Companies including Google, Apple, and IBM have publicly announced that they no longer require a degree for many positions — instead prioritising demonstrable skills and experience. Some of the most famous and successful entrepreneurs of the modern era — Bill Gates, Mark Zuckerberg, and Steve Jobs among them — famously dropped out of university before completing their degrees. While these examples are exceptional, they feed a growing narrative that talent and drive can replace formal credentials, particularly in fast-moving sectors such as technology and entrepreneurship.`,
    vocab: [
      { word: 'Mismatch', definition: 'A situation where two things do not correspond or fit together well — a mismatch between skills and job requirements.' },
      { word: 'Vocational', definition: 'Related to a particular job or profession — vocational qualifications train people for specific types of practical work.' },
      { word: 'Apprenticeship', definition: 'A system where someone learns a trade or profession by working for an employer while receiving training and often studying part-time.' },
      { word: 'Credentials', definition: 'Qualifications, achievements, and experiences that show someone is qualified to do something — proof of ability or status.' },
    ],
    questions: [
      { n: 7, q: 'Do you think there is a mismatch between what universities teach and what employers need? Has this been your experience or the experience of people you know?' },
      { n: 8, q: 'Should apprenticeships and vocational qualifications be seen as equally valuable to university degrees? Why do you think they are sometimes considered less prestigious?' },
      { n: 9, q: 'The passage mentions Bill Gates and Mark Zuckerberg as famous dropouts. Do you think their success is a good argument against going to university, or are they unusual exceptions?' },
    ]
  },
  {
    number: 4, title: 'A Changing Landscape', emoji: '🔮', color: '#8b5cf6',
    text: `The question of whether a degree is "worth it" cannot be answered simply — it depends enormously on what subject is studied, at which institution, in which country, and for what purpose. A medical degree from a top university will almost certainly provide a strong return on investment. A degree in a highly competitive field from a lower-ranked institution, on the other hand, may leave a graduate with debt and limited career prospects. The decision is deeply personal and context-dependent.\n\nWhat seems clear is that the relationship between education and employment is changing rapidly, and institutions that do not adapt risk becoming irrelevant. Some universities are already responding — introducing more work-based learning, shorter and more flexible programmes, and partnerships with industry. Governments are increasingly recognising the need to invest in vocational education and reduce the stigma associated with non-degree pathways. The future may well be one in which a mix of credentials — degrees, professional qualifications, online certifications, and portfolio evidence of real-world skills — replaces the single university degree as the standard measure of a young person\'s readiness for the workforce. Whether this change happens fast enough to meet the needs of today\'s students and employers remains one of the most pressing questions in education policy worldwide.`,
    vocab: [
      { word: 'Return on investment', definition: 'The benefit or profit gained from spending money on something, compared to the amount spent — whether the cost was worth it.' },
      { word: 'Context-dependent', definition: 'Depending on the specific situation or circumstances — something that varies according to the conditions it is in.' },
      { word: 'Stigma', definition: 'A mark of disgrace or negative perception associated with something — the stigma of not having a degree means people may look down on you.' },
      { word: 'Portfolio', definition: 'A collection of work, projects, or examples that demonstrates a person\'s skills, experience, and achievements.' },
    ],
    questions: [
      { n: 10, q: 'The passage says the answer depends on "what subject, at which institution, in which country." Do you agree that these factors make a big difference? Can you give examples?' },
      { n: 11, q: 'How do you think the education system in your country needs to change to better prepare young people for the modern workforce?' },
      { n: 12, q: 'Overall, if you were advising a 17-year-old today, would you recommend going to university? What questions would you ask them before giving your advice?' },
    ]
  },
]

async function fetchTranslation(text: string, lang: string, type: 'word' | 'question' | 'message'): Promise<string> {
  const systems: Record<string, string> = {
    word: `You are a language learning assistant. Translate this English vocabulary entry to ${lang}. Return ONLY the translated word and a brief explanation in ${lang} (max 25 words). No extra text, no English.`,
    question: `You are a translator. Translate this English discussion question to ${lang}. Return ONLY the translated question. No extra text.`,
    message: `You are a translator. Translate this English text to ${lang}. Return ONLY the translation. No extra text.`,
  }
  const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: systems[type], messages: [{ role: 'user', content: text }] }) })
  const data = await res.json()
  return data.content || ''
}

function TranslateBtn({ text, type, lang, color, onTranslated }: { text: string; type: 'word' | 'question' | 'message'; lang: string; color: string; onTranslated: (t: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const isDisabled = lang === 'none'
  const handleClick = async () => {
    if (isDisabled || loading || done) return
    setLoading(true); onTranslated(await fetchTranslation(text, lang, type)); setDone(true); setLoading(false)
  }
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

  const SYSTEM = `You are a friendly English conversation partner helping a B2 level student practise discussion skills. The reading topic is "Is a University Degree Still Worth It?". The current discussion question is: "${question}". Keep every response to 2-3 sentences. Use clear B2-level English. Always end with one natural follow-up question. If the student makes a significant grammar error, gently correct it at the end using "💡 Quick tip: ...". Be encouraging and warm.`

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: SYSTEM, messages: updated.map(m => ({ role: m.role, content: m.content })) }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || 'Sorry, try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error.' }]) }
    setLoading(false)
  }

  const setMessageTranslation = (idx: number, translation: string) => setMessages(prev => prev.map((m, i) => i === idx ? { ...m, translation } : m))

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input requires Chrome.'); return }
    transcriptRef.current = ''
    const r = new SR(); r.lang = 'en-US'; r.continuous = true; r.interimResults = true
    r.onstart = () => { setListening(true); setInterimText('') }
    r.onresult = (e: any) => { let f = ''; let t = ''; for (let i = 0; i < e.results.length; i++) { if (e.results[i].isFinal) f += e.results[i][0].transcript + ' '; else t += e.results[i][0].transcript } transcriptRef.current = f; setInterimText(f + t) }
    r.onerror = () => { setListening(false); setInterimText('') }
    r.onend = () => { setListening(false); const text = transcriptRef.current.trim() || interimText.trim(); if (text) { setInterimText(''); transcriptRef.current = ''; sendMessage(text) } else { setInterimText(''); transcriptRef.current = '' } }
    recognitionRef.current = r; r.start()
  }
  const stopVoice = () => recognitionRef.current?.stop()

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
      {messages.length === 0 && <div style={{ padding: '14px 16px', color: '#6b7280', fontSize: '13px', lineHeight: '1.6', borderBottom: '1px solid #eee' }}>💡 Type your answer or tap <strong>🎤</strong> to speak.</div>}
      {messages.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ fontSize: '20px', flexShrink: 0 }}>{m.role === 'user' ? '🧑‍🎓' : '🤖'}</div>
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: m.role === 'user' ? color : 'white', color: m.role === 'user' ? 'white' : '#374151', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '14px', lineHeight: '1.6', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: m.role === 'assistant' ? '1px solid #e5e7eb' : 'none' }}>{m.content}</div>
                {m.role === 'assistant' && !m.translation && <TranslateBtn text={m.content} type="message" lang={translationLang} color={color} onTranslated={(t) => setMessageTranslation(i, t)} />}
                {m.translation && <div style={{ background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}><span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>🌍 Translation</span>{m.translation}</div>}
              </div>
            </div>
          ))}
          {loading && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ fontSize: '20px' }}>🤖</span><div style={{ background: 'white', padding: '10px 14px', borderRadius: '4px 16px 16px 16px', fontSize: '14px', color: '#9ca3af', border: '1px solid #e5e7eb' }}>Thinking...</div></div>}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }} placeholder="Type your answer here..." rows={2} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={listening ? stopVoice : startVoice} style={{ background: listening ? '#ef4444' : '#22c55e', color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.3)' : 'none', transition: 'all 0.2s' }}>{listening ? '⏹' : '🎤'}</button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? color : '#e5e7eb', color: input.trim() && !loading ? 'white' : '#9ca3af', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
        </div>
      </div>
      {listening && (
        <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #fee2e2', background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', flexShrink: 0 }} /><span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>Recording...</span></div>
            <button onClick={stopVoice} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop & Send</button>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: interimText ? '#374151' : '#9ca3af', lineHeight: '1.6', border: '1px solid #fca5a5', fontStyle: 'italic', minHeight: '40px' }}>{interimText || 'Waiting for speech...'}</div>
        </div>
      )}
    </div>
  )
}

export default function UniversityDegreePage() {
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
      const sel = window.getSelection(); if (!sel) return
      const text = sel.toString().trim().replace(/\s+/g, ' ')
      if (!text || text.split(' ').length > 6) return
      if (!sel.anchorNode?.parentElement?.closest('[data-passage]')) return
      handleLookup(text)
    }
    document.addEventListener('mouseup', handleSelection); document.addEventListener('touchend', handleSelection)
    return () => { document.removeEventListener('mouseup', handleSelection); document.removeEventListener('touchend', handleSelection) }
  }, [translationLang])

  const handleLookup = async (text: string) => {
    if (!text || text.length < 2) return
    setSelectedText(text); setLookupDef(''); setLookupTranslation(''); setLookupLoading(true)
    speakWord(text)
    const isPhrase = text.includes(' ')
    try {
      if (translationLang === 'none') {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: isPhrase ? `You are an English dictionary for B2 learners. Respond with ONLY one sentence (max 25 words) explaining the phrase. No extra text.` : `You are an English dictionary for B2 learners. Respond with ONLY one sentence (max 20 words) defining this word. No extra text.`, messages: [{ role: 'user', content: isPhrase ? `What does "${text}" mean?` : `Define: "${text}"` }] }) })
        const data = await res.json(); setLookupDef(data.content || 'No definition found.')
      } else {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: `You are a language learning assistant for B2 English students. Respond ONLY with valid JSON (no markdown, no backticks): {"definition": "one simple English sentence max 20 words", "translation": "the word/phrase in ${translationLang} with a brief explanation in ${translationLang}, max 30 words"}`, messages: [{ role: 'user', content: `Word or phrase: "${text}"` }] }) })
        const data = await res.json()
        try { const parsed = JSON.parse(data.content); setLookupDef(parsed.definition || 'No definition found.'); setLookupTranslation(parsed.translation || '') } catch { setLookupDef(data.content || 'No definition found.') }
      }
    } catch { setLookupDef('Could not load definition.') }
    setLookupLoading(false)
  }

  function speakText(text: string) { if (typeof window === 'undefined') return; window.speechSynthesis.cancel(); const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]; sentences.forEach(s => { const u = new SpeechSynthesisUtterance(s.trim()); u.lang = 'en-GB'; u.rate = speed; window.speechSynthesis.speak(u) }) }
  function speakWord(word: string) { if (typeof window === 'undefined') return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(word); u.lang = 'en-GB'; u.rate = 0.85; window.speechSynthesis.speak(u) }
  function stopAudio() { if (typeof window === 'undefined') return; window.speechSynthesis.cancel() }
  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      <section style={{ background: 'linear-gradient(135deg, #1c1917 0%, #92400e 60%, #f59e0b 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B2 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>🎓</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#92400e', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B2 Upper Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Work & Business</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>Is a University Degree Still Worth It?</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>Degree or No Degree? — Explore the rising cost of university education, the arguments for and against a degree, and what the future of qualifications might look like.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[{ icon: '📄', label: '4 reading parts' }, { icon: '💬', label: '12 discussion questions' }, { icon: '📚', label: '16 vocabulary words' }, { icon: '✍️', label: 'Highlight any text' }, { icon: '🌍', label: 'Multi-language lookup' }, { icon: '🤖', label: 'AI conversation partner' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🔊 Speed:</span>
              {SPEEDS.map(s => (<button key={s.value} onClick={() => setSpeed(s.value)} style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#f59e0b' : '#e5e7eb', background: speed === s.value ? '#f59e0b' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>{s.label}</button>))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🌍 Translate to:</span>
              <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setQuestionTranslations({}) }} style={{ padding: '5px 12px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? '#f59e0b' : '#e5e7eb', background: translationLang !== 'none' ? '#fffbeb' : 'white', color: translationLang !== 'none' ? '#92400e' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
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
                <button onClick={stopAudio} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹</button>
              </div>
            </div>
            <div style={{ background: '#fffbeb', padding: '8px 28px', borderBottom: '1px solid #fde68a' }}>
              <span style={{ color: '#92400e', fontSize: '12px', fontWeight: '600' }}>✍️ Highlight any word or phrase to look it up{translationLang !== 'none' && <span style={{ color: '#d97706' }}> + {currentLang?.label} translation</span>}</span>
            </div>
            <div data-passage="true" style={{ padding: '24px 28px 20px', userSelect: 'text', cursor: 'text' }}>
              {part.text.split('\n\n').map((para, i) => (<p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: '1.85', margin: i === 0 ? '0 0 18px' : '0', fontFamily: 'Georgia, serif' }}>{para}</p>))}
            </div>
            <div style={{ margin: '0 28px 24px', background: part.color + '08', border: `1px solid ${part.color}25`, borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: part.color + '18', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${part.color}20` }}>
                <span style={{ fontSize: '16px' }}>📚</span><span style={{ color: part.color, fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vocabulary — Part {part.number}</span>
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
                        </div>
                        <span data-passage="true" style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{v.definition}</span>
                        {vocabTranslations[vKey] && <div style={{ marginTop: '6px', background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '8px 12px' }}><span style={{ color: '#7c3aed', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span><span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{vocabTranslations[vKey]}</span></div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ background: '#1a1a2e', padding: '20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}><span style={{ fontSize: '18px' }}>💬</span><span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Discussion Questions</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {part.questions.map(q => (
                  <div key={q.n}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ background: part.color, color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{q.n}</div>
                      <div style={{ flex: 1 }}>
                        <p data-passage="true" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 6px' }}>{q.q}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TranslateBtn text={q.q} type="question" lang={translationLang} color={part.color} onTranslated={(t) => setQuestionTranslations(prev => ({ ...prev, [q.n]: t }))} />
                        </div>
                        {questionTranslations[q.n] && <div style={{ marginTop: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '10px 14px' }}><span style={{ color: '#fbbf24', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span><span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6' }}>{questionTranslations[q.n]}</span></div>}
                      </div>
                    </div>
                    <div style={{ marginLeft: '42px' }}><ConversationBox question={q.q} color={part.color} translationLang={translationLang} /></div>
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
          <div style={{ maxWidth: '860px', margin: '0 auto', background: 'white', borderRadius: '20px 20px 0 0', padding: '20px 24px 32px', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', border: '2px solid #fde68a', borderBottom: 'none' }}>
            <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '4px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', fontFamily: 'Georgia, serif' }}>"{selectedText}"</span>
                <button onClick={() => speakWord(selectedText)} style={{ background: '#fffbeb', color: '#92400e', border: '2px solid #fde68a', padding: '6px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>🔊 Hear it</button>
              </div>
              <button onClick={() => setSelectedText(null)} style={{ background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', marginLeft: '12px' }}>✕</button>
            </div>
            {lookupLoading ? <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 18px', border: '1px solid #fde68a', color: '#9ca3af', fontSize: '15px' }}>Looking up...</div> : (
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