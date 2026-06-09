'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLearnThaiGate } from '@/hooks/useLearnThaiGate'

// ── Audio cache — shared across all buttons on this page ─────────
const audioCache: Record<string, AudioBuffer> = {}
let sharedContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!sharedContext || sharedContext.state === 'closed') {
    sharedContext = new AudioContext()
  }
  return sharedContext
}

async function fetchAndCache(text: string, voice: 'nova' | 'echo'): Promise<AudioBuffer | null> {
  const key = `${voice}:${text}`
  if (audioCache[key]) return audioCache[key]
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    })
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    const ctx = getAudioContext()
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
    audioCache[key] = audioBuffer
    return audioBuffer
  } catch { return null }
}

function playBuffer(buffer: AudioBuffer): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext()
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.onended = () => resolve()
      source.start(0)
    } catch { resolve() }
  })
}

function ListenBtn({ text, voice = 'nova', label = '🔊 Listen', style: btnStyle }: {
  text: string; voice?: 'nova' | 'echo'; label?: string; style?: React.CSSProperties
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle')
  const activeRef = useRef(false)

  const handleClick = async () => {
    if (status === 'playing') { activeRef.current = false; setStatus('idle'); return }
    const key = `${voice}:${text}`
    const cached = audioCache[key]
    if (!cached) setStatus('loading')
    const buffer = cached ?? await fetchAndCache(text, voice)
    if (!buffer) { setStatus('idle'); return }
    activeRef.current = true
    setStatus('playing')
    await playBuffer(buffer)
    if (activeRef.current) setStatus('idle')
    activeRef.current = false
  }

  return (
    <button onClick={handleClick} style={btnStyle}>
      {status === 'loading' ? '...' : status === 'playing' ? '⏹ Stop' : label}
    </button>
  )
}
// ────────────────────────────────────────────────────────────────

const VOCAB = [
  {
    thai: 'แต่งงานแล้ว', roman: 'taeng ngaan laeo', english: 'Married',
    example: { thai: 'ฉันแต่งงานแล้วค่ะ', roman: 'chan taeng ngaan laeo kha', english: 'I am married.' },
    note: 'แต่งงาน = to marry. แล้ว = already. Together: already married.',
    tip: 'Thais ask about marital status very early. มีแฟนไหม (mii faen mai) = Do you have a girlfriend/boyfriend?',
  },
  {
    thai: 'โสด', roman: 'soot', english: 'Single',
    example: { thai: 'ตอนนี้ฉันโสดค่ะ', roman: 'tawn nii chan soot kha', english: 'Right now I am single.' },
    note: 'โสด = single/unmarried. ตอนนี้ = right now. Common and perfectly normal to discuss.',
    tip: 'Thais may follow up with ทำไมล่ะ (tham mai la) = Why? — totally normal curiosity!',
  },
  {
    thai: 'มีลูก', roman: 'mii luuk', english: 'Have children',
    example: { thai: 'ฉันมีลูกสองคนค่ะ', roman: 'chan mii luuk soong khon kha', english: 'I have two children.' },
    note: 'มี = have. ลูก = child/children. คน = classifier for people. Number goes before คน.',
    tip: 'ลูกชาย = son, ลูกสาว = daughter. Thais love hearing about your family.',
  },
  {
    thai: 'พ่อแม่', roman: 'phoo mae', english: 'Parents (father and mother)',
    example: { thai: 'พ่อแม่ของฉันอยู่ที่อังกฤษค่ะ', roman: 'phoo mae khong chan yuu thii Ang-grid kha', english: 'My parents are in England.' },
    note: 'พ่อ = father, แม่ = mother. ของฉัน = my/mine. ของ shows possession.',
    tip: 'Family is central to Thai culture. Asking about parents shows you respect their values.',
  },
  {
    thai: 'พี่น้อง', roman: 'phii nong', english: 'Siblings',
    example: { thai: 'ฉันมีพี่น้องสามคนค่ะ', roman: 'chan mii phii nong saam khon kha', english: 'I have three siblings.' },
    note: 'พี่ = older sibling, น้อง = younger sibling. Thai distinguishes age, not gender, for siblings.',
    tip: 'พี่ชาย = older brother, พี่สาว = older sister, น้องชาย = younger brother, น้องสาว = younger sister.',
  },
  {
    thai: 'แฟน', roman: 'faen', english: 'Partner / boyfriend / girlfriend',
    example: { thai: 'แฟนของฉันเป็นคนไทยค่ะ', roman: 'faen khong chan pen khon thai kha', english: 'My partner is Thai.' },
    note: 'แฟน = partner/significant other (from the English word "fan"). Used for bf/gf and spouse casually.',
    tip: 'Very common word. คู่ชีวิต (khuu chiiwit) = life partner, more formal.',
  },
  {
    thai: 'บ้าน', roman: 'baan', english: 'Home / house',
    example: { thai: 'บ้านของฉันอยู่ใกล้โรงเรียนค่ะ', roman: 'baan khong chan yuu glai roong rian kha', english: 'My home is near the school.' },
    note: 'บ้าน = home/house/village. ใกล้ = near. ไกล = far.',
    tip: 'กลับบ้าน (glap baan) = go home. You will hear this constantly in Thailand.',
  },
  {
    thai: 'อยู่ด้วยกัน', roman: 'yuu duai gan', english: 'Live together',
    example: { thai: 'เราอยู่ด้วยกันมาสองปีแล้วค่ะ', roman: 'rao yuu duai gan maa soong pii laeo kha', english: 'We have lived together for two years.' },
    note: 'อยู่ = live/stay. ด้วยกัน = together. เรา = we. กัน adds mutuality.',
    tip: 'กัน at the end of many phrases shows mutual/shared action — a very useful Thai pattern.',
  },
  {
    thai: 'จะ', roman: 'ja', english: 'Will / going to (future)',
    example: { thai: 'ฉันจะโทรหาพ่อแม่พรุ่งนี้ค่ะ', roman: 'chan ja thoo haa phoo mae phrung nii kha', english: 'I will call my parents tomorrow.' },
    note: 'จะ before a verb = future tense. พรุ่งนี้ = tomorrow. โทรหา = call (by phone).',
    tip: 'จะ is your future tense marker. No conjugation needed — just add จะ before any verb.',
  },
  {
    thai: 'ความสัมพันธ์', roman: 'khwaam sam phan', english: 'Relationship',
    example: { thai: 'ความสัมพันธ์ของเราดีมากค่ะ', roman: 'khwaam sam phan khong rao dii maak kha', english: 'Our relationship is very good.' },
    note: 'ความ turns adjectives/verbs into abstract nouns. สัมพันธ์ = related/connected.',
    tip: 'ความ is a key A2 pattern: ความรัก (love), ความสุข (happiness), ความเข้าใจ (understanding).',
  },
  {
    thai: 'คิดถึง', roman: 'khit theung', english: 'Miss / think of',
    example: { thai: 'ฉันคิดถึงครอบครัวมากค่ะ', roman: 'chan khit theung khroop khrua maak kha', english: 'I miss my family very much.' },
    note: 'คิด = think. ถึง = reach/about. Together: think about = miss.',
    tip: 'คิดถึงนะ (khit theung na) = I will miss you. One of the most emotionally warm phrases in Thai.',
  },
  {
    thai: 'ครอบครัว', roman: 'khroop khrua', english: 'Family',
    example: { thai: 'ครอบครัวของฉันสำคัญมากค่ะ', roman: 'khroop khrua khong chan sam khan maak kha', english: 'My family is very important to me.' },
    note: 'ครอบครัว = family unit. สำคัญ = important.',
    tip: 'Family is the heart of Thai society. Showing respect for family always earns deep respect.',
  },
  {
    thai: 'เป็นห่วง', roman: 'pen huang', english: 'Worried about / care about',
    example: { thai: 'แม่เป็นห่วงฉันมากค่ะ', roman: 'mae pen huang chan maak kha', english: 'My mother worries about me a lot.' },
    note: 'เป็นห่วง = to be concerned/worried about someone you care for. Shows love and concern.',
    tip: 'เป็นห่วงด้วยนะ (pen huang duai na) = I am worried about you too. A caring phrase.',
  },
  {
    thai: 'ห่างบ้าน', roman: 'haang baan', english: 'Far from home',
    example: { thai: 'ฉันอยู่ห่างบ้านมากค่ะ แต่ชอบไทย', roman: 'chan yuu haang baan maak kha tae choop thai', english: 'I am far from home but I love Thailand.' },
    note: 'ห่าง = far from. บ้าน = home. แต่ = but.',
    tip: 'Thais deeply empathise with being away from family. This phrase always creates connection.',
  },
  {
    thai: 'วิดีโอคอล', roman: 'wi dii oh khon', english: 'Video call',
    example: { thai: 'ฉันวิดีโอคอลกับครอบครัวทุกอาทิตย์ค่ะ', roman: 'chan wi dii oh khon gap khroop khrua thuk aa thit kha', english: 'I video call my family every week.' },
    note: 'วิดีโอคอล = video call (loanword). กับ = with. ทุกอาทิตย์ = every week.',
    tip: 'Technology vocabulary like this is very current Thai — Thais use these words constantly.',
  },
]

const CONVERSATION = [
  { speaker: 'A' as const, thai: 'คุณมีครอบครัวอยู่ที่ไทยไหมครับ', roman: 'khun mii khroop khrua yuu thii thai mai khrap', english: 'Do you have family here in Thailand?' },
  { speaker: 'B' as const, thai: 'ไม่ค่ะ ครอบครัวของฉันอยู่ที่อังกฤษค่ะ', roman: 'mai kha khroop khrua khong chan yuu thii Ang-grid kha', english: 'No, my family is in England.' },
  { speaker: 'A' as const, thai: 'คิดถึงบ้านบ้างไหมครับ', roman: 'khit theung baan baang mai khrap', english: 'Do you miss home?' },
  { speaker: 'B' as const, thai: 'คิดถึงบ้างค่ะ แต่ฉันชอบอยู่ที่ไทยมากค่ะ', roman: 'khit theung baang kha tae chan choop yuu thii thai maak kha', english: 'A little, but I really love living in Thailand.' },
  { speaker: 'A' as const, thai: 'คุณติดต่อครอบครัวบ่อยไหมครับ', roman: 'khun tit taw khroop khrua boi mai khrap', english: 'Do you contact your family often?' },
  { speaker: 'B' as const, thai: 'วิดีโอคอลทุกอาทิตย์ค่ะ เทคโนโลยีช่วยได้มากเลยค่ะ', roman: 'wi dii oh khon thuk aa thit kha thek noo loh yii chuai dai maak loei kha', english: 'Video call every week. Technology helps so much.' },
  { speaker: 'A' as const, thai: 'คุณแต่งงานแล้วหรือยังครับ', roman: 'khun taeng ngaan laeo rue yang khrap', english: 'Are you married?' },
  { speaker: 'B' as const, thai: 'ยังค่ะ แต่มีแฟนค่ะ แฟนเป็นคนไทยค่ะ', roman: 'yang kha tae mii faen kha faen pen khon thai kha', english: 'Not yet, but I have a partner. My partner is Thai.' },
  { speaker: 'A' as const, thai: 'โอ้ ดีจังเลยครับ เขาอยู่ที่ไหนครับ', roman: 'oh dii jang loei khrap khao yuu thii nai khrap', english: 'Oh wonderful! Where does he/she live?' },
  { speaker: 'B' as const, thai: 'อยู่ด้วยกันที่อยุธยาค่ะ มีความสุขมากเลยค่ะ', roman: 'yuu duai gan thii A-yut-tha-yaa kha mii khwaam suk maak loei kha', english: 'We live together in Ayutthaya. Very happy.' },
]

const QUIZ = [
  { q: 'How do you say "I am married"?', correct: 'Chan taeng ngaan laeo', options: ['Chan mii faen laeo', 'Chan taeng ngaan laeo', 'Chan soot laeo', 'Chan yuu duai gan'] },
  { q: 'What does จะ (ja) indicate before a verb?', correct: 'Future tense', options: ['Past tense', 'Future tense', 'Continuous action', 'Negation'] },
  { q: 'How do you say "I miss my family"?', correct: 'Chan khit theung khroop khrua', options: ['Chan rak khroop khrua', 'Chan khit theung khroop khrua', 'Chan pen huang khroop khrua', 'Chan yuu gap khroop khrua'] },
  { q: 'What does ความ do to a word?', correct: 'Turns it into an abstract noun', options: ['Makes it negative', 'Turns it into an abstract noun', 'Makes it past tense', 'Makes it a question'] },
  { q: 'How do you say "I have two children"?', correct: 'Chan mii luuk soong khon', options: ['Chan mii luuk soong', 'Chan mii soong luuk', 'Chan mii luuk soong khon', 'Chan pen mae soong khon'] },
  { q: 'What does กัน at the end of a phrase show?', correct: 'Mutual or shared action', options: ['Negation', 'Mutual or shared action', 'Future tense', 'Politeness'] },
  { q: 'How do you say "My parents are in England"?', correct: 'Phoo mae khong chan yuu thii Ang-grid', options: ['Phoo mae chan yuu Ang-grid', 'Phoo mae khong chan yuu thii Ang-grid', 'Phoo mae pen khon Ang-grid', 'Phoo mae chan pen Ang-grid'] },
  { q: 'What does พี่น้อง (phii nong) mean?', correct: 'Siblings', options: ['Parents', 'Children', 'Siblings', 'Cousins'] },
  { q: 'How do you say "We live together"?', correct: 'Rao yuu duai gan', options: ['Rao yuu duai', 'Rao yuu gan', 'Rao yuu duai gan', 'Rao pen duai gan'] },
  { q: 'What does เป็นห่วง (pen huang) express?', correct: 'Worry or care for someone', options: ['Being in love', 'Worry or care for someone', 'Being homesick', 'Missing someone'] },
]

const SCRIPT_Q = VOCAB.slice(0, 10).sort(() => Math.random() - 0.5).map(v => ({
  thai: v.thai, roman: v.roman, english: v.english,
  options: [v.english, ...VOCAB.filter(x => x.english !== v.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
}))

const LISTENING_Q = [
  { question: 'Where is the woman\'s family?', correct: 'England', options: ['Thailand', 'England', 'Australia', 'America'] },
  { question: 'How often does she video call her family?', correct: 'Every week', options: ['Every day', 'Every week', 'Every month', 'Rarely'] },
  { question: 'Is the woman married?', correct: 'No, but she has a partner', options: ['Yes', 'No, she is single', 'No, but she has a partner', 'She does not say'] },
  { question: 'What nationality is her partner?', correct: 'Thai', options: ['British', 'Thai', 'Australian', 'American'] },
  { question: 'Where do they live together?', correct: 'Ayutthaya', options: ['Bangkok', 'Chiang Mai', 'Ayutthaya', 'Phuket'] },
]

const ALL_AUDIO: { text: string; voice: 'nova' | 'echo' }[] = [
  ...VOCAB.flatMap(v => [
    { text: v.thai.replace(/\.\.\./g, ''), voice: 'nova' as const },
    { text: v.example.thai, voice: 'nova' as const },
  ]),
  ...CONVERSATION.map(l => ({ text: l.thai, voice: (l.speaker === 'A' ? 'echo' : 'nova') as 'nova' | 'echo' })),
  ...SCRIPT_Q.map(q => ({ text: q.thai.replace(/\.\.\./g, ''), voice: 'nova' as const })),
]

export default function A2Unit1Lesson2() {
  useLearnThaiGate()

  const [phase, setPhase] = useState<'learn' | 'conversation' | 'quiz' | 'script' | 'listening' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [scriptSelected, setScriptSelected] = useState<string | null>(null)
  const [scriptScore, setScriptScore] = useState(0)
  const [listenIndex, setListenIndex] = useState(0)
  const [listenSelected, setListenSelected] = useState<string | null>(null)
  const [listenScore, setListenScore] = useState(0)
  const [activeLine, setActiveLine] = useState(-1)
  const [listenPlayed, setListenPlayed] = useState(false)
  const [playStatus, setPlayStatus] = useState<'idle' | 'playing'>('idle')
  const [preloadDone, setPreloadDone] = useState(false)
  const stopRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function preload() {
      for (const item of ALL_AUDIO) {
        if (cancelled) return
        fetchAndCache(item.text, item.voice).catch(() => {})
        await new Promise(r => setTimeout(r, 150))
      }
      if (!cancelled) setPreloadDone(true)
    }
    preload()
    return () => { cancelled = true }
  }, [])

  const card = VOCAB[cardIndex]
  const pct = Math.round((correct / QUIZ.length) * 100)
  const COLOR = '#0ea5e9'
  const DARK = '#0369a1'

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    if (ans === QUIZ[quizIndex].correct) setCorrect(p => p + 1)
    setAnswers(p => [...p, ans === QUIZ[quizIndex].correct])
  }
  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ.length) { setPhase('script'); return }
    setQuizIndex(p => p + 1); setSelected(null)
  }
  const stopConversation = () => { stopRef.current = true; setActiveLine(-1); setPlayStatus('idle') }
  const startConversation = async () => {
    stopRef.current = false
    setPlayStatus('playing')
    for (let i = 0; i < CONVERSATION.length; i++) {
      if (stopRef.current) break
      const line = CONVERSATION[i]
      const voice = line.speaker === 'A' ? 'echo' : 'nova'
      setActiveLine(i)
      const buffer = await fetchAndCache(line.thai, voice)
      if (stopRef.current) break
      if (buffer) await playBuffer(buffer)
      if (!stopRef.current) await new Promise(r => setTimeout(r, 400))
    }
    setActiveLine(-1)
    setPlayStatus('idle')
  }

  const navBtn = (label: string, id: string) => (
    <button key={id} onClick={() => {
      stopConversation()
      if (id === 'quiz') { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }
      if (id === 'script') { setScriptIndex(0); setScriptSelected(null); setScriptScore(0) }
      if (id === 'listening') { setListenIndex(0); setListenSelected(null); setListenScore(0) }
      setPhase(id as any)
    }} style={{ background: phase === id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
      {label}
    </button>
  )

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A2 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>A2 · Unit 1 · Lesson 2 — Family & Relationships</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {navBtn('📖 Learn', 'learn')}
          {navBtn('🗣️ Conversation', 'conversation')}
          {navBtn('🧠 Quiz', 'quiz')}
          {navBtn('✍️ Script', 'script')}
          {navBtn('🎧 Listening', 'listening')}
        </div>
      </div>

      {/* LEARN */}
      {phase === 'learn' && (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>👨‍👩‍👧 A2 Unit 1 Lesson 2 — Family & Relationships</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>Talk about your family, relationships, and home life in Thai. Learn the future tense จะ and the mutual pattern กัน.</p>
              <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '14px 18px', border: `1px solid ${COLOR}40` }}>
                <div style={{ color: DARK, fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>
                  🎯 15 words · 🔊 Male and female AI voices
                  {!preloadDone && <span style={{ color: '#9ca3af', fontWeight: '400', marginLeft: '8px' }}>· ⏳ Loading audio...</span>}
                  {preloadDone && <span style={{ color: '#22c55e', fontWeight: '400', marginLeft: '8px' }}>· ✅ Audio ready</span>}
                </div>
                <div style={{ color: '#374151', fontSize: '14px' }}>Family vocab · จะ future tense · กัน mutual action · ความ noun prefix</div>
              </div>
            </div>
          )}
          <div style={{ background: 'rgba(14,165,233,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px', marginBottom: '16px' }}>
            <span style={{ color: COLOR, fontSize: '13px', fontWeight: '700' }}>{cardIndex + 1} / {VOCAB.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: COLOR, borderRadius: '10px', width: `${((cardIndex + 1) / VOCAB.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '44px', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '10px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', marginBottom: '20px' }}>{card.english}</div>
              <ListenBtn text={card.thai.replace(/\.\.\./g, '')} voice="nova" label="🔊 Listen"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }} />
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${COLOR}40` }}>
                <div style={{ color: COLOR, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: COLOR, marginBottom: '4px' }}>{card.example.thai}</div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.example.english}</div>
                  </div>
                  <ListenBtn text={card.example.thai} voice="nova" label="🔊"
                    style={{ marginLeft: 'auto', background: COLOR, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }} />
                </div>
              </div>
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Grammar Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 16px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Cultural Tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(p => p - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>← Back</button>}
            {cardIndex + 1 < VOCAB.length
              ? <button onClick={() => setCardIndex(p => p + 1)} style={{ flex: 1, background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>Next →</button>
              : <button onClick={() => setPhase('conversation')} style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>🗣️ Conversation →</button>
            }
          </div>
        </div>
      )}

      {/* CONVERSATION */}
      {phase === 'conversation' && (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>🗣️ Real Conversation — Talking About Family</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px' }}>Click any line to hear it. Press Play for the full conversation.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#f0f9ff', color: COLOR, fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>🧑 Mark = echo (male)</span>
              <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>👩 Sara = nova (female)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={startConversation} disabled={playStatus !== 'idle'}
              style={{ flex: 1, background: playStatus !== 'idle' ? '#6b7280' : `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: playStatus !== 'idle' ? 'default' : 'pointer' }}>
              {playStatus === 'playing' ? '⏸ Playing...' : '▶ Play Full Conversation'}
            </button>
            {playStatus !== 'idle' && <button onClick={stopConversation} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>■ Stop</button>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {CONVERSATION.map((line, i) => (
              <div key={i} style={{ background: activeLine === i ? (line.speaker === 'A' ? '#f0f9ff' : '#f0fdf4') : 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${activeLine === i ? (line.speaker === 'A' ? COLOR : '#22c55e') : '#e5e7eb'}`, transition: 'all 0.2s', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: line.speaker === 'A' ? COLOR : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', flexShrink: 0 }}>
                  {line.speaker === 'A' ? '🧑' : '👩'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '19px', fontWeight: '900', color: line.speaker === 'A' ? COLOR : '#15803d', marginBottom: '4px' }}>{line.thai}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '2px' }}>{line.roman}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>{line.english}</div>
                </div>
                <ListenBtn text={line.thai} voice={line.speaker === 'A' ? 'echo' : 'nova'} label="🔊"
                  style={{ background: line.speaker === 'A' ? `${COLOR}15` : '#f0fdf4', color: line.speaker === 'A' ? COLOR : '#15803d', border: `1px solid ${line.speaker === 'A' ? COLOR : '#22c55e'}40`, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <button onClick={() => { stopConversation(); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]); setPhase('quiz') }}
            style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
            🧠 Take the Quiz →
          </button>
        </div>
      )}

      {/* QUIZ */}
      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: COLOR, fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: COLOR, borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{QUIZ[quizIndex].q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ[quizIndex].options.map(opt => {
                const isC = opt === QUIZ[quizIndex].correct; const isSel = opt === selected
                let bg = '#f9fafb', bdr = '#e5e7eb', tc = '#374151'
                if (selected) { if (isC) { bg = '#f0f9ff'; bdr = COLOR; tc = DARK } else if (isSel) { bg = '#fef2f2'; bdr = '#ef4444'; tc = '#dc2626' } }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${bdr}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: tc, fontWeight: '700', fontSize: '14px' }}>{opt}</span>
                    {selected && isC && <span style={{ color: COLOR, fontSize: '20px' }}>✓</span>}
                    {selected && isSel && !isC && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ[quizIndex].correct ? '#f0f9ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ[quizIndex].correct ? COLOR + '60' : '#fca5a5'}` }}>
              {selected === QUIZ[quizIndex].correct ? <span style={{ color: DARK, fontWeight: '700' }}>✅ Correct!</span> : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ[quizIndex].correct}</strong></span>}
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ.length ? '✍️ Script →' : 'Next →'}</button>}
        </div>
      )}

      {/* SCRIPT */}
      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>✍️ Script Recognition</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai word and choose the correct English meaning.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: COLOR, fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: COLOR, borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What does this mean?</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: COLOR, lineHeight: 1.3, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <ListenBtn text={SCRIPT_Q[scriptIndex].thai.replace(/\.\.\./g, '')} voice="nova" label="🔊 Hear it"
                style={{ background: '#f0f9ff', color: COLOR, border: `2px solid ${COLOR}40`, padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isC = opt === SCRIPT_Q[scriptIndex].english; const isSel = scriptSelected === opt
                let bg = '#f9fafb', bdr = '#e5e7eb', tc = '#1a1a2e'
                if (scriptSelected) { if (isC) { bg = '#f0f9ff'; bdr = COLOR; tc = DARK } else if (isSel) { bg = '#fef2f2'; bdr = '#ef4444'; tc = '#dc2626' } }
                return (
                  <button key={opt} onClick={() => { if (scriptSelected) return; setScriptSelected(opt); if (isC) setScriptScore(p => p + 1) }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${bdr}`, borderRadius: '12px', padding: '14px 20px', cursor: scriptSelected ? 'default' : 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: tc, fontWeight: '700', fontSize: '14px' }}>{opt}</span>
                    {scriptSelected && isC && <span style={{ color: COLOR, fontSize: '20px' }}>✓</span>}
                    {scriptSelected && isSel && !isC && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#f0f9ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? COLOR + '60' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected ? <span style={{ color: DARK, fontWeight: '700' }}>✅ Correct!</span> : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is: <strong>{SCRIPT_Q[scriptIndex].english}</strong></span>}
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setListenIndex(0); setListenSelected(null); setListenScore(0); setListenPlayed(false); setPhase('listening'); return }
              setScriptIndex(p => p + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {scriptIndex + 1 >= SCRIPT_Q.length ? '🎧 Listening →' : 'Next →'}
            </button>
          )}
        </div>
      )}

      {/* LISTENING */}
      {phase === 'listening' && (
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>🎧 Listening Comprehension</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>Listen without reading along, then answer the questions.</p>
            <button onClick={() => { startConversation(); setListenPlayed(true) }} disabled={playStatus !== 'idle'}
              style={{ background: playStatus !== 'idle' ? '#6b7280' : `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '900', fontSize: '15px', cursor: playStatus !== 'idle' ? 'default' : 'pointer' }}>
              {playStatus === 'playing' ? '⏸ Playing...' : listenPlayed ? '🔄 Play Again' : '▶ Play Conversation'}
            </button>
          </div>
          {listenPlayed && (
            <>
              <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: COLOR, fontWeight: '700', fontSize: '14px' }}>Q {listenIndex + 1} / {LISTENING_Q.length}</span>
                <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '8px', background: COLOR, borderRadius: '10px', width: `${((listenIndex + 1) / LISTENING_Q.length) * 100}%`, transition: 'width 0.3s' }} />
                </div>
                <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {listenScore}</span>
              </div>
              <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                <div style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{LISTENING_Q[listenIndex].question}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {LISTENING_Q[listenIndex].options.map(opt => {
                    const isC = opt === LISTENING_Q[listenIndex].correct; const isSel = listenSelected === opt
                    let bg = '#f9fafb', bdr = '#e5e7eb', tc = '#374151'
                    if (listenSelected) { if (isC) { bg = '#f0f9ff'; bdr = COLOR; tc = DARK } else if (isSel) { bg = '#fef2f2'; bdr = '#ef4444'; tc = '#dc2626' } }
                    return (
                      <button key={opt} onClick={() => { if (listenSelected) return; setListenSelected(opt); if (isC) setListenScore(p => p + 1) }} disabled={!!listenSelected}
                        style={{ background: bg, border: `2px solid ${bdr}`, borderRadius: '12px', padding: '14px 20px', cursor: listenSelected ? 'default' : 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: tc, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                        {listenSelected && isC && <span style={{ color: COLOR, fontSize: '20px' }}>✓</span>}
                        {listenSelected && isSel && !isC && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
              {listenSelected && (
                <div style={{ background: LISTENING_Q[listenIndex].correct === listenSelected ? '#f0f9ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${LISTENING_Q[listenIndex].correct === listenSelected ? COLOR + '60' : '#fca5a5'}` }}>
                  {LISTENING_Q[listenIndex].correct === listenSelected ? <span style={{ color: DARK, fontWeight: '700' }}>✅ Correct!</span> : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{LISTENING_Q[listenIndex].correct}</strong></span>}
                </div>
              )}
              {listenSelected && (
                <button onClick={() => { if (listenIndex + 1 >= LISTENING_Q.length) { setPhase('complete'); return } setListenIndex(p => p + 1); setListenSelected(null) }}
                  style={{ width: '100%', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
                  {listenIndex + 1 >= LISTENING_Q.length ? '🏆 Complete →' : 'Next →'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep going!'}</h2>
            <div style={{ fontSize: '48px', fontWeight: '900', color: pct >= 70 ? COLOR : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '15px', marginBottom: '24px' }}>{correct} / {QUIZ.length} quiz · {listenScore} / {LISTENING_Q.length} listening</div>
            <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: `2px solid ${COLOR}40`, textAlign: 'left' }}>
              <div style={{ color: DARK, fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson 2 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can now talk about your family, relationships and home life in Thai. Next: daily life and hobbies.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a2/unit-1/lesson-3" style={{ display: 'block', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Daily Life & Hobbies →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
