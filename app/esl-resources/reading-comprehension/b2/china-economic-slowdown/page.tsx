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
    number: 1, title: 'The Factory Floor Goes Quiet', emoji: '🏭', color: '#dc2626',
    text: `For decades, China was the factory of the world. Its manufacturing sector grew at breathtaking speed, producing everything from smartphones to steel, clothing to cars. The country lifted more than 800 million people out of poverty in just forty years — the fastest economic transformation in human history. But in August 2026, new data painted a very different picture: Chinese factories were slowing down, consumer spending was weak, and Beijing appeared to have little appetite for the large-scale stimulus measures that economists were calling for.\n\nThe official Purchasing Managers Index — a closely watched measure of factory activity — fell below 50 for the third consecutive month, indicating contraction rather than growth. Export orders declined as global demand weakened. Youth unemployment remained stubbornly high, with roughly one in five young Chinese workers unable to find a job. Property prices continued to fall in most major cities, destroying household wealth and confidence.\n\nFor the rest of the world, China's economic slowdown matters enormously. China is the second-largest economy on Earth and the largest trading partner of more than 120 countries. When Chinese factories buy less raw material, commodity-exporting countries from Australia to Brazil to Zambia feel the impact. When Chinese consumers spend less, luxury brands and tourism industries worldwide suffer. When China's property market weakens, global financial markets become nervous.\n\nThe slowdown also raises a question with profound implications: is the Chinese economic model — state-directed growth, massive infrastructure investment, export-led manufacturing — reaching its limits? And if so, what comes next for a country of 1.4 billion people whose social stability has been built on the promise of ever-rising prosperity?`,
    vocab: [
      { word: 'Stimulus measures', definition: 'Actions taken by a government to boost economic growth, such as increasing spending or cutting taxes.' },
      { word: 'Contraction', definition: 'When an economy gets smaller — producing less, selling less, and employing fewer people.' },
      { word: 'Commodity', definition: 'A raw material or basic good that is traded in large quantities — oil, iron, wheat, copper.' },
      { word: 'Social stability', definition: 'A peaceful, orderly society where people are not protesting, rioting, or demanding radical change.' },
    ],
    questions: [
      { n: 1, q: 'China lifted 800 million people out of poverty in 40 years. What happens to a society when that growth slows down or stops?' },
      { n: 2, q: 'One in five young Chinese workers cannot find a job. What are the social and political consequences of high youth unemployment?' },
      { n: 3, q: 'China is the largest trading partner of 120+ countries. How does its slowdown affect your country specifically?' },
    ]
  },
  {
    number: 2, title: 'What Went Wrong?', emoji: '📉', color: '#b91c1c',
    text: `China's current economic difficulties are the result of several interconnected problems, some long-term and structural, others more recent.\n\nThe property crisis is the most visible. For two decades, China's economic growth was heavily dependent on real estate development. Local governments raised money by selling land to developers. Developers built apartment buildings — often before anyone had agreed to buy them. Chinese families invested their savings in property, which was seen as the safest and most profitable investment available. At its peak, the property sector accounted for nearly 30% of Chinese GDP.\n\nWhen the government tried to reduce the property sector's excessive debt in 2020 — introducing rules limiting how much developers could borrow — the bubble burst. Major developers like Evergrande and Country Garden defaulted on their debts. Construction projects were abandoned. Property prices fell. Millions of Chinese families watched the value of their most important asset decline — and responded by spending less on everything else.\n\nDemographics are another structural challenge. China's population began declining in 2022 — the first sustained decline since the great famine of the early 1960s. Decades of the one-child policy, combined with rising living costs and changing attitudes toward marriage and children, have produced a rapidly ageing society. Fewer workers mean less economic output, less consumption, and higher costs for pensions and healthcare.\n\nThe geopolitical environment has also deteriorated. The US-China trade war, which began under Trump's first term and has intensified in his second, has led to tariffs, export controls on advanced technology, and efforts by Western companies to diversify their supply chains away from China. The era of seamless economic integration between China and the West appears to be ending.`,
    vocab: [
      { word: 'Structural', definition: 'Relating to the basic, underlying design of something — problems that are built into the system.' },
      { word: 'Defaulted', definition: 'Failed to repay money that was borrowed — unable to meet financial obligations.' },
      { word: 'Demographics', definition: 'The statistical characteristics of a population — age, birth rates, death rates, growth.' },
      { word: 'Supply chains', definition: 'The network of companies and processes involved in producing and delivering a product to consumers.' },
    ],
    questions: [
      { n: 4, q: 'Property accounted for 30% of Chinese GDP. Why is it dangerous for any economy to depend so heavily on one sector?' },
      { n: 5, q: 'China population is declining. Japan faced the same problem decades ago. What lessons can China learn from Japan experience?' },
      { n: 6, q: 'Western companies are moving supply chains away from China. Where are they going, and what does this mean for countries in Southeast Asia like Thailand?' },
    ]
  },
  {
    number: 3, title: 'The AI Race — A New Engine?', emoji: '🤖', color: '#991b1b',
    text: `Despite its economic difficulties, China is betting heavily on one sector to drive future growth: artificial intelligence. The competition between the United States and China to dominate AI has become one of the defining technological rivalries of the 21st century — and it is intensifying.\n\nChina has made remarkable progress. DeepSeek, a Chinese AI startup, released models in early 2025 that rivalled the performance of leading American systems at a fraction of the cost. The achievement stunned Silicon Valley and challenged the assumption that AI leadership required the enormous computing budgets available only to American tech giants. Chinese companies like Baidu, Alibaba, and Tencent are all investing heavily in AI, and the Chinese government has declared AI a strategic national priority.\n\nBut the race is far from equal. The United States has imposed strict export controls on advanced semiconductor chips, restricting China's access to the most powerful hardware needed to train cutting-edge AI models. These restrictions have forced Chinese companies to find creative workarounds — designing more efficient algorithms that require less computing power, and developing alternative chip architectures. Whether these workarounds can fully compensate for the hardware gap remains an open question.\n\nThe AI race has implications far beyond technology. The country that leads in AI will likely lead in military capability, economic productivity, and global influence for decades to come. For China, AI represents not just an economic opportunity but a strategic necessity — a way to maintain its rise even as its traditional growth engines falter. For the United States, maintaining AI leadership has become a matter of national security.\n\nThe outcome of this race will shape the global balance of power in the 21st century. And the data from Chinese factories this week suggests that the stakes for Beijing could not be higher.`,
    vocab: [
      { word: 'Semiconductor', definition: 'A material used to make computer chips — the tiny components that power all digital technology.' },
      { word: 'Export controls', definition: 'Government restrictions on selling certain products or technologies to other countries.' },
      { word: 'Algorithms', definition: 'Sets of rules or instructions that tell a computer how to solve a problem or complete a task.' },
      { word: 'Strategic necessity', definition: 'Something that must be done because it is essential for long-term survival or success.' },
    ],
    questions: [
      { n: 7, q: 'DeepSeek matched American AI at a fraction of the cost. What does this tell us about innovation under constraints?' },
      { n: 8, q: 'The US restricts chip exports to China. Is this fair competition, or is it economic warfare? Where is the line?' },
      { n: 9, q: 'The country that leads in AI will likely lead the world. Do you agree? Is AI really that important, or is it overhyped?' },
    ]
  },
  {
    number: 4, title: 'What China Means for the World', emoji: '🌏', color: '#7f1d1d',
    text: `China's economic trajectory matters to every person on the planet — not because China is special, but because it is so large that anything that happens to its economy reverberates everywhere.\n\nFor commodity-exporting countries — Australia (iron ore), Brazil (soybeans), Saudi Arabia (oil), Zambia (copper) — a Chinese slowdown means lower demand, lower prices, and lower revenues. For manufacturing competitors — Vietnam, India, Mexico, Thailand — it could mean opportunity, as companies looking to diversify away from China redirect investment to alternative production bases. For consumers everywhere, it could mean changes in the price and availability of everything from electronics to clothing.\n\nThe geopolitical implications are equally significant. China's Communist Party derives much of its domestic legitimacy from economic performance. The implicit social contract — the government delivers prosperity, and the people accept authoritarian rule — depends on continued growth. If growth stalls permanently, the political consequences are unpredictable. History suggests that economic frustration can lead to either reform or repression — and in China's case, either outcome would have global implications.\n\nFor countries in Southeast Asia, including Thailand, the relationship with China is particularly complex. China is ASEAN's largest trading partner, its largest source of tourists, and an increasingly important investor. A slowdown in China affects Thai exports, tourism revenue, and foreign investment. But it also creates opportunities — as global supply chains reorganise, countries that can offer stable, skilled, and cost-competitive manufacturing have a chance to attract businesses looking for alternatives to China.\n\nThe story of China's economy is not over — it is entering a new chapter. Whether that chapter is one of managed transition or painful decline will depend on decisions made in Beijing. But the consequences will be felt in Bangkok, Berlin, and Buenos Aires alike.`,
    vocab: [
      { word: 'Reverberates', definition: 'Has effects that spread outward — like ripples from a stone thrown into water.' },
      { word: 'Legitimacy', definition: 'The right to rule — the acceptance by citizens that their government has the authority to govern.' },
      { word: 'Implicit', definition: 'Understood but not openly stated — agreed without being written down or spoken.' },
      { word: 'Cost-competitive', definition: 'Able to produce goods or services at prices that are attractive compared to other countries.' },
    ],
    questions: [
      { n: 10, q: 'Thailand depends on Chinese tourists, trade, and investment. How should Thailand prepare for a long-term Chinese slowdown?' },
      { n: 11, q: 'China social contract is: government delivers prosperity, people accept authoritarian rule. What happens if prosperity stops?' },
      { n: 12, q: 'Companies are moving supply chains from China to Vietnam, India, and Thailand. Is this a real opportunity for Southeast Asia? What are the risks?' },
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

function ListenBtn({ text, speed, color }: { text: string; speed: number; color: string }) {
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const handleClick = async () => {
    if (playing && sourceRef.current) { try { sourceRef.current.stop() } catch {} sourceRef.current = null; setPlaying(false); return }
    setLoading(true)
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
      if (!res.ok) { setLoading(false); return }
      const arrayBuffer = await res.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer; source.playbackRate.value = speed
      source.connect(audioContext.destination)
      source.onended = () => { setPlaying(false); sourceRef.current = null }
      sourceRef.current = source; setLoading(false); setPlaying(true); source.start(0)
    } catch { setLoading(false); setPlaying(false) }
  }
  return (
    <button onClick={handleClick}
      style={{ background: playing ? color : color + '15', color: playing ? 'white' : color, border: `1px solid ${color}40`, padding: '2px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}>
      {loading ? '...' : playing ? '⏹ Stop' : '🔊 Listen'}
    </button>
  )
}

type Message = { role: 'user' | 'assistant'; content: string; translation?: string }

function ConversationBox({ question, color, translationLang, speed }: { question: string; color: string; translationLang: string; speed: number }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [open, setOpen] = useState(false)
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')

  const SYSTEM = `You are a thoughtful English conversation partner helping a B2 upper-intermediate student practise discussion skills. The reading topic is "The Relationship Between AI and Humans". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use sophisticated but accessible B2-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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
  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ marginTop: '10px', width: '100%', background: color + '12', border: `2px dashed ${color}40`, borderRadius: '12px', padding: '10px', color, fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      🤖 Practice answering with AI
    </button>
  )

  return (
    <div style={{ marginTop: '10px', background: '#eef2ff', borderRadius: '14px', border: `2px solid ${color}30`, overflow: 'hidden' }}>
      <div style={{ background: color, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>🤖 AI Conversation Partner</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setMessages([])} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>🔄 Reset</button>
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>✕ Close</button>
        </div>
      </div>
      {messages.length === 0 && <div style={{ padding: '14px 16px', color: '#6b7280', fontSize: '13px', lineHeight: '1.6', borderBottom: '1px solid #c7d2fe' }}>💡 Type your answer or tap <strong>🎤 Start Recording</strong> — speak your full answer, then tap <strong>⏹ Stop & Send</strong>.</div>}
      {messages.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ fontSize: '20px', flexShrink: 0 }}>{m.role === 'user' ? '🧑‍🎓' : '🤖'}</div>
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: m.role === 'user' ? color : 'white', color: m.role === 'user' ? 'white' : '#374151', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '14px', lineHeight: '1.6', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: m.role === 'assistant' ? '1px solid #e5e7eb' : 'none' }}>{m.content}</div>
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <ListenBtn text={m.content} speed={speed} color={color} />
                    {!m.translation && <TranslateBtn text={m.content} type="message" lang={translationLang} color={color} onTranslated={(t) => setMessageTranslation(i, t)} />}
                    {translationLang === 'none' && !m.translation && <span style={{ color: '#9ca3af', fontSize: '11px' }}>Select a language to translate</span>}
                  </div>
                )}
                {m.translation && <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}><span style={{ color: color, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>🌍 Translation</span>{m.translation}</div>}
              </div>
            </div>
          ))}
          {loading && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ fontSize: '20px' }}>🤖</span><div style={{ background: 'white', padding: '10px 14px', borderRadius: '4px 16px 16px 16px', fontSize: '14px', color: '#9ca3af', border: '1px solid #e5e7eb' }}>Thinking...</div></div>}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #c7d2fe', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }} placeholder="Type your answer here..." rows={2} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={listening ? stopVoice : startVoice} style={{ background: listening ? '#ef4444' : '#22c55e', color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.3)' : 'none', transition: 'all 0.2s' }}>{listening ? '⏹' : '🎤'}</button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? color : '#e5e7eb', color: input.trim() && !loading ? 'white' : '#9ca3af', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
        </div>
      </div>
      {!listening && <div style={{ padding: '4px 16px 10px', display: 'flex', gap: '16px' }}><span style={{ color: '#9ca3af', fontSize: '11px' }}>🎤 = Start recording</span><span style={{ color: '#9ca3af', fontSize: '11px' }}>⏹ = Stop & send</span><span style={{ color: '#9ca3af', fontSize: '11px' }}>➤ = Send typed</span></div>}
      {listening && (
        <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #fee2e2', background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', flexShrink: 0 }} /><span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>Recording... speak your full answer</span></div>
            <button onClick={stopVoice} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>⏹ Stop & Send</button>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: interimText ? '#374151' : '#9ca3af', lineHeight: '1.6', border: '1px solid #fca5a5', fontStyle: 'italic', minHeight: '40px' }}>{interimText || 'Waiting for speech...'}{interimText && <span style={{ display: 'inline-block', width: '2px', height: '16px', background: '#ef4444', marginLeft: '2px', verticalAlign: 'middle', animation: 'pulse 1s infinite' }} />}</div>
        </div>
      )}
    </div>
  )
}

export default function ChinaEconomyPage() {
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
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: isPhrase ? `You are an English dictionary for B2 learners. Respond with ONLY one sentence (max 20 words) explaining what the phrase means. No extra text.` : `You are an English dictionary for B2 learners. Respond with ONLY one sentence (max 15 words) defining this word. No extra text.`, messages: [{ role: 'user', content: isPhrase ? `What does "${text}" mean?` : `Define: "${text}"` }] }) })
        const data = await res.json(); setLookupDef(data.content || 'No definition found.')
      } else {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: `You are a language learning assistant for B2 English students. Respond ONLY with valid JSON (no markdown, no backticks): {"definition": "one simple English sentence max 15 words", "translation": "the word/phrase in ${translationLang} with a brief explanation in ${translationLang}, max 25 words"}`, messages: [{ role: 'user', content: `Word or phrase: "${text}"` }] }) })
        const data = await res.json()
        try { const parsed = JSON.parse(data.content); setLookupDef(parsed.definition || 'No definition found.'); setLookupTranslation(parsed.translation || '') }
        catch { setLookupDef(data.content || 'No definition found.'); setLookupTranslation('') }
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
    const u = new SpeechSynthesisUtterance(word); u.lang = 'en-GB'; u.rate = 0.85; u.pitch = 1; window.speechSynthesis.speak(u)
  }
  function stopAudio() { if (typeof window === 'undefined') return; window.speechSynthesis.cancel() }
  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <section style={{ background: 'linear-gradient(135deg, #0d0a2e 0%, #1e1b4b 50%, #312e81 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B2 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>🏭</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#6366f1', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B2 Upper Intermediate</span>
                <span style={{ background: 'rgba(99,102,241,0.5)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>This Week's News</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>China's Factory Slowdown and the AI Race</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>Chinese factories are slowing, youth unemployment is rising, and Beijing is betting everything on AI. What went wrong, and what does it mean for the world?</p>
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
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>How to use:</span>
            {['🔊 Play passage aloud', '✍️ Highlight any text for lookup', '🌍 Translate vocab, questions & AI answers', '🤖 Practice with AI'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '13px' }}>
                <span style={{ background: '#6366f1', color: 'white', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🔊 Speed:</span>
              {SPEEDS.map(s => (
                <button key={s.value} onClick={() => setSpeed(s.value)} style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#6366f1' : '#e5e7eb', background: speed === s.value ? '#6366f1' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🌍 Translate to:</span>
              <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setQuestionTranslations({}) }} style={{ padding: '5px 12px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? '#6366f1' : '#e5e7eb', background: translationLang !== 'none' ? '#eef2ff' : 'white', color: translationLang !== 'none' ? '#3730a3' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
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
            <div style={{ background: '#eef2ff', padding: '8px 28px', borderBottom: '1px solid #c7d2fe' }}>
              <span style={{ color: '#3730a3', fontSize: '12px', fontWeight: '600' }}>✍️ Highlight any word or phrase to hear it and see its meaning{translationLang !== 'none' && <span style={{ color: '#6366f1' }}> + {currentLang?.label} translation</span>}</span>
            </div>
            <div data-passage="true" style={{ padding: '24px 28px 20px', userSelect: 'text', cursor: 'text' }}>
              {part.text.split('\n\n').map((para, i) => <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: '1.85', margin: i === 0 ? '0 0 18px' : '0', fontFamily: 'Georgia, serif' }}>{para}</p>)}
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
                          <TranslateBtn text={`Word: "${v.word}"\nDefinition: "${v.definition}"`} type="word" lang={translationLang} color={part.color} onTranslated={(t) => setVocabTranslations(prev => ({ ...prev, [vKey]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#d1d5db', fontSize: '11px' }}>← select a language to translate</span>}
                        </div>
                        <span data-passage="true" style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', userSelect: 'text', cursor: 'text' }}>{v.definition}</span>
                        {vocabTranslations[vKey] && <div style={{ marginTop: '6px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '8px 12px' }}><span style={{ color: '#3730a3', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span><span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{vocabTranslations[vKey]}</span></div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ background: '#1a1a2e', padding: '20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '18px' }}>💬</span>
                <span style={{ color: '#a5b4fc', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Discussion Questions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {part.questions.map(q => (
                  <div key={q.n}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ background: part.color, color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{q.n}</div>
                      <div style={{ flex: 1 }}>
                        <p data-passage="true" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 6px', userSelect: 'text', cursor: 'text' }}>{q.q}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <TranslateBtn text={q.q} type="question" lang={translationLang} color={part.color} onTranslated={(t) => setQuestionTranslations(prev => ({ ...prev, [q.n]: t }))} />
                          {translationLang === 'none' && <span style={{ color: '#4b5563', fontSize: '11px' }}>← select a language to translate</span>}
                        </div>
                        {questionTranslations[q.n] && <div style={{ marginTop: '8px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '10px 14px' }}><span style={{ color: '#a5b4fc', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span><span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6' }}>{questionTranslations[q.n]}</span></div>}
                      </div>
                    </div>
                    <div style={{ marginLeft: '42px' }}><ConversationBox question={q.q} color={part.color} translationLang={translationLang} speed={speed} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', paddingBottom: selectedText ? '140px' : '16px' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to B2 Reading Comprehension</Link>
        </div>
      </div>
      {selectedText && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, animation: 'slideUp 0.25s ease' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', background: 'white', borderRadius: '20px 20px 0 0', padding: '20px 24px 32px', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)', border: '2px solid #c7d2fe', borderBottom: 'none' }}>
            <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '4px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', fontFamily: 'Georgia, serif' }}>"{selectedText}"</span>
                <button onClick={() => speakWord(selectedText)} style={{ background: '#eef2ff', color: '#3730a3', border: '2px solid #c7d2fe', padding: '6px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', flexShrink: 0 }}>🔊 Hear it</button>
              </div>
              <button onClick={() => setSelectedText(null)} style={{ background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0, marginLeft: '12px' }}>✕</button>
            </div>
            {lookupLoading ? (
              <div style={{ background: '#eef2ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #c7d2fe', color: '#9ca3af', fontSize: '15px' }}>{translationLang !== 'none' ? `Looking up definition and ${currentLang?.label} translation...` : 'Looking up...'}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#eef2ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #c7d2fe' }}>
                  <div style={{ color: '#3730a3', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📖 English Definition</div>
                  <span style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>{lookupDef}</span>
                </div>
                {translationLang !== 'none' && lookupTranslation && (
                  <div style={{ background: '#eef2ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #a5b4fc' }}>
                    <div style={{ color: '#4338ca', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{currentLang?.label} Translation</div>
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
