'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useLearnThaiGate } from '@/hooks/useLearnThaiGate'

// ── Browser TTS — instant, for single words/short phrases ────────
function speakThai(text: string) {
  if (typeof window === 'undefined') return
  const clean = text.replace(/\.\.\./g, '')
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(clean)
  utt.lang = 'th-TH'
  utt.rate = 0.8
  window.speechSynthesis.speak(utt)
}

// ── OpenAI TTS — quality audio for sentences & conversation ──────
const audioCache: Record<string, AudioBuffer> = {}
let sharedContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!sharedContext || sharedContext.state === 'closed') sharedContext = new AudioContext()
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
    const buf = await getAudioContext().decodeAudioData(arrayBuffer)
    audioCache[key] = buf
    return buf
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

// OpenAI listen button — for example sentences
function ListenBtn({ text, voice = 'nova', label = '🔊', style: btnStyle }: {
  text: string; voice?: 'nova' | 'echo'; label?: string; style?: React.CSSProperties
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle')
  const activeRef = useRef(false)

  const handleClick = async () => {
    if (status === 'playing') { activeRef.current = false; setStatus('idle'); return }
    const key = `${voice}:${text}`
    if (!audioCache[key]) setStatus('loading')
    const buffer = audioCache[key] ?? await fetchAndCache(text, voice)
    if (!buffer) { setStatus('idle'); return }
    activeRef.current = true
    setStatus('playing')
    await playBuffer(buffer)
    if (activeRef.current) setStatus('idle')
    activeRef.current = false
  }

  return <button onClick={handleClick} style={btnStyle}>{status === 'loading' ? '...' : status === 'playing' ? '⏹ Stop' : label}</button>
}
// ────────────────────────────────────────────────────────────────

const VOCAB = [
  {
    thai: 'ฉันชื่อ...', roman: 'chan chuu...', english: 'My name is... (female)',
    example: { thai: 'ฉันชื่อซาร่าค่ะ', roman: 'chan chuu Saaraa kha', english: 'My name is Sara.' },
    note: 'ฉัน is the polite female "I". Males use ผม (phom). Always add ค่ะ (female) or ครับ (male) to sound natural.',
    tip: 'Thais often go by nickname — ชื่อเล่น (chuu len). Ask: คุณมีชื่อเล่นไหม? (Do you have a nickname?)',
  },
  {
    thai: 'ฉันอายุ...ปี', roman: 'chan aa yu...pii', english: 'I am ... years old',
    example: { thai: 'ฉันอายุยี่สิบแปดปีค่ะ', roman: 'chan aa yu yii sip bpaet pii kha', english: 'I am 28 years old.' },
    note: 'อายุ = age. ปี = year. The number goes between them.',
    tip: 'Asking age is perfectly normal in Thailand. คุณอายุเท่าไรครับ/ค่ะ is a standard question.',
  },
  {
    thai: 'ฉันเป็น...', roman: 'chan pen...', english: 'I am a... (occupation)',
    example: { thai: 'ฉันเป็นครูภาษาอังกฤษค่ะ', roman: 'chan pen khruu phasaa ang-grid kha', english: 'I am an English teacher.' },
    note: 'เป็น = to be, used for roles. Common jobs: ครู (teacher), หมอ (doctor), พยาบาล (nurse).',
    tip: 'ภาษาอังกฤษ = English language. ครูภาษาอังกฤษ is what everyone will call you.',
  },
  {
    thai: 'ฉันมาจาก...', roman: 'chan maa jaak...', english: 'I come from...',
    example: { thai: 'ฉันมาจากอังกฤษค่ะ', roman: 'chan maa jaak Ang-grid kha', english: 'I come from England.' },
    note: 'มา = to come, จาก = from. Countries: อังกฤษ (England), อเมริกา (America), ออสเตรเลีย (Australia).',
    tip: 'Follow with ฉันอยู่ที่ไทยมา...ปีแล้ว — Thais love hearing how long you have been here.',
  },
  {
    thai: 'ฉันอยู่ที่...', roman: 'chan yuu thii...', english: 'I live in/at...',
    example: { thai: 'ฉันอยู่ที่อยุธยามาสองปีแล้วค่ะ', roman: 'chan yuu thii A-yut-tha-yaa maa soong pii laeo kha', english: 'I have been in Ayutthaya two years.' },
    note: 'อยู่ที่ = live at/in. มา...ปีแล้ว = for...years already.',
    tip: 'Cities: กรุงเทพ (Bangkok), เชียงใหม่ (Chiang Mai), อยุธยา (Ayutthaya), ภูเก็ต (Phuket).',
  },
  {
    thai: 'ฉันชอบ...', roman: 'chan choop...', english: 'I like...',
    example: { thai: 'ฉันชอบอาหารไทยมากค่ะ', roman: 'chan choop aa haan thai maak kha', english: 'I really like Thai food.' },
    note: 'ชอบ = to like. มาก = very much. ไม่ชอบ = do not like.',
    tip: 'Saying you love Thai food instantly warms up any Thai person.',
  },
  {
    thai: 'ฉันพูดภาษาไทยได้นิดหน่อย', roman: 'chan phuut phasaa thai dai nit noi', english: 'I can speak a little Thai',
    example: { thai: 'ฉันพูดภาษาไทยได้นิดหน่อยค่ะ', roman: 'chan phuut phasaa thai dai nit noi kha', english: 'I can speak a little Thai.' },
    note: 'พูด = to speak. ได้ after a verb = can. นิดหน่อย = a little.',
    tip: 'Say this early — Thais will be immediately encouraging.',
  },
  {
    thai: 'ยินดีที่ได้รู้จัก', roman: 'yin dii thii dai ruu jak', english: 'Nice to meet you',
    example: { thai: 'ยินดีที่ได้รู้จักค่ะ', roman: 'yin dii thii dai ruu jak kha', english: 'Nice to meet you.' },
    note: 'ยินดี = pleased. รู้จัก = to know or be acquainted with.',
    tip: 'After this, Thais often say แอดไลน์ด้วยนะ — add me on LINE.',
  },
  {
    thai: 'ฉันสอนที่...', roman: 'chan soon thii...', english: 'I teach at...',
    example: { thai: 'ฉันสอนที่โรงเรียนประถมค่ะ', roman: 'chan soon thii roong rian pra thom kha', english: 'I teach at a primary school.' },
    note: 'สอน = to teach. ประถม = primary, มัธยม = secondary, มหาวิทยาลัย = university.',
    tip: 'Being a teacher is highly respected. Parents often wai you.',
  },
  {
    thai: 'คุณอยู่ที่นี่มานานแค่ไหนแล้ว', roman: 'khun yuu thii nii maa naan khae nai laeo', english: 'How long have you been here?',
    example: { thai: 'คุณอยู่ที่นี่มานานแค่ไหนแล้วครับ', roman: 'khun yuu thii nii maa naan khae nai laeo khrap', english: 'How long have you been here?' },
    note: 'นาน = long time, แค่ไหน = how long, แล้ว = already.',
    tip: 'Answer: ฉันอยู่มา...ปีแล้วค่ะ',
  },
  {
    thai: 'ฉันรักประเทศไทย', roman: 'chan rak pra thet thai', english: 'I love Thailand',
    example: { thai: 'ฉันรักประเทศไทยมากค่ะ', roman: 'chan rak pra thet thai maak kha', english: 'I love Thailand very much.' },
    note: 'รัก = to love. ประเทศไทย = Thailand formal. Casual: เมืองไทย.',
    tip: 'This will always get a huge smile. Follow with something specific you love.',
  },
  {
    thai: 'คุณพูดภาษาอังกฤษได้ไหม', roman: 'khun phuut phasaa ang-grid dai mai', english: 'Can you speak English?',
    example: { thai: 'คุณพูดภาษาอังกฤษได้ไหมครับ', roman: 'khun phuut phasaa ang-grid dai mai khrap', english: 'Can you speak English?' },
    note: 'ได้ไหม = can you? ได้ = yes/can, ไม่ได้ = no/cannot.',
    tip: 'Always try Thai first — the effort is always appreciated.',
  },
  {
    thai: 'ฉันกำลังเรียนภาษาไทย', roman: 'chan gam lang rian phasaa thai', english: 'I am learning Thai',
    example: { thai: 'ฉันกำลังเรียนภาษาไทยอยู่ค่ะ', roman: 'chan gam lang rian phasaa thai yuu kha', english: 'I am currently learning Thai.' },
    note: 'กำลัง = currently in the process of. This is your present continuous marker.',
    tip: 'Your magic phrase. Thais become your teacher, friend, and biggest supporter.',
  },
  {
    thai: 'ขอโทษ ช่วยพูดช้าๆ ได้ไหม', roman: 'kho thoot chuai phuut chaa chaa dai mai', english: 'Sorry, can you speak slowly?',
    example: { thai: 'ขอโทษนะคะ ช่วยพูดช้าๆ ได้ไหมคะ', roman: 'kho thoot na kha chuai phuut chaa chaa dai mai kha', english: 'Sorry, can you speak slowly?' },
    note: 'ช้าๆ = slowly. Essential — Thais always slow down for you.',
    tip: 'ๆ means repeat the word. ช้าๆ = slow slow = very slowly.',
  },
  {
    thai: 'ฉันไม่เข้าใจ', roman: 'chan mai khao jai', english: 'I do not understand',
    example: { thai: 'ขอโทษค่ะ ฉันไม่เข้าใจค่ะ', roman: 'kho thoot kha chan mai khao jai kha', english: 'Sorry, I do not understand.' },
    note: 'เข้าใจ = to understand, literally enter heart. เข้าใจแล้ว = I understand now.',
    tip: 'เข้าใจไหม? = Do you understand? Your students ask you this!',
  },
]

const CONVERSATION = [
  { speaker: 'A' as const, thai: 'สวัสดีครับ ผมชื่อมาร์คครับ', roman: 'sawasdee khrap phom chuu Mark khrap', english: 'Hello, my name is Mark.' },
  { speaker: 'B' as const, thai: 'สวัสดีค่ะ ดีใจที่ได้รู้จักค่ะ ฉันชื่อนิดค่ะ', roman: 'sawasdee kha dii jai thii dai ruu jak kha chan chuu Nit kha', english: 'Hello, pleased to meet you. My name is Nit.' },
  { speaker: 'A' as const, thai: 'คุณมาจากไหนครับ', roman: 'khun maa jaak nai khrap', english: 'Where are you from?' },
  { speaker: 'B' as const, thai: 'ฉันเป็นคนไทยค่ะ มาจากเชียงใหม่ค่ะ คุณล่ะครับ', roman: 'chan pen khon thai kha maa jaak Chiang Mai kha khun la khrap', english: 'I am Thai, from Chiang Mai. And you?' },
  { speaker: 'A' as const, thai: 'ผมมาจากอังกฤษครับ อยู่ที่ไทยมาสองปีแล้วครับ', roman: 'phom maa jaak Ang-grid khrap yuu thii thai maa soong pii laeo khrap', english: 'I am from England. Two years in Thailand.' },
  { speaker: 'B' as const, thai: 'โอ้ สองปีแล้วเหรอคะ พูดภาษาไทยได้บ้างไหมคะ', roman: 'oh soong pii laeo roe kha phuut phasaa thai dai baang mai kha', english: 'Two years already? Can you speak Thai?' },
  { speaker: 'A' as const, thai: 'ได้นิดหน่อยครับ กำลังเรียนอยู่ครับ', roman: 'dai nit noi khrap gam lang rian yuu khrap', english: 'A little. I am still learning.' },
  { speaker: 'B' as const, thai: 'เก่งมากเลยค่ะ คุณทำงานอะไรที่นี่คะ', roman: 'geng maak loei kha khun tham ngaan a rai thii nii kha', english: 'Very impressive! What do you do here?' },
  { speaker: 'A' as const, thai: 'ผมเป็นครูภาษาอังกฤษครับ สอนที่โรงเรียนมัธยมครับ', roman: 'phom pen khruu phasaa ang-grid khrap soon thii roong rian mat tha yom khrap', english: 'I am an English teacher at a secondary school.' },
  { speaker: 'B' as const, thai: 'ดีมากเลยค่ะ ยินดีที่ได้รู้จักค่ะ', roman: 'dii maak loei kha yin dii thii dai ruu jak kha', english: 'Wonderful! Nice to meet you.' },
]

const QUIZ = [
  { q: 'How does a female say "My name is Sara"?', correct: 'Chan chuu Sara kha', options: ['Phom chuu Sara khrap', 'Chan chuu Sara kha', 'Khun chuu Sara kha', 'Chan pen Sara kha'] },
  { q: 'What does กำลัง (gam lang) indicate?', correct: 'A continuous/ongoing action', options: ['Past tense', 'A continuous/ongoing action', 'Future tense', 'A question'] },
  { q: 'How do you say "I have been in Thailand 3 years"?', correct: 'Chan yuu thii thai maa saam pii laeo', options: ['Chan yuu thii thai saam pii', 'Chan maa thai saam pii', 'Chan yuu thii thai maa saam pii laeo', 'Chan pen thai saam pii laeo'] },
  { q: 'What does เข้าใจ (khao jai) literally mean?', correct: 'Enter heart', options: ['Open mind', 'Enter heart', 'Clear head', 'Know well'] },
  { q: 'How do you ask someone to speak slowly?', correct: 'Chuai phuut chaa chaa dai mai', options: ['Chuai phuut lek lek', 'Chuai phuut chaa chaa dai mai', 'Chuai phuut nit noi', 'Chuai phuut yai yai'] },
  { q: 'What does ได้ไหม (dai mai) mean?', correct: 'Can you? / Is it possible?', options: ['Do you want to?', 'Can you? / Is it possible?', 'Did you?', 'Will you?'] },
  { q: 'How do you say "I love Thailand"?', correct: 'Chan rak pra thet thai', options: ['Chan choop pra thet thai', 'Chan rak pra thet thai', 'Chan yuu pra thet thai', 'Chan dii pra thet thai'] },
  { q: 'The ๆ symbol means?', correct: 'Repeat the previous word', options: ['End of sentence', 'Repeat the previous word', 'Question marker', 'Emphasis'] },
  { q: 'How do you say "I teach at a primary school"?', correct: 'Chan soon thii roong rian pra thom', options: ['Chan rian thii roong rian', 'Chan soon thii roong rian mat tha yom', 'Chan soon thii roong rian pra thom', 'Chan pen khruu roong rian'] },
  { q: 'Polite female sentence ender?', correct: 'ค่ะ (kha)', options: ['ครับ (khrap)', 'ค่ะ (kha)', 'นะ (na)', 'เลย (loei)'] },
]

const SCRIPT_Q = VOCAB.slice(0, 10).sort(() => Math.random() - 0.5).map(v => ({
  thai: v.thai, roman: v.roman, english: v.english,
  options: [v.english, ...VOCAB.filter(x => x.english !== v.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
}))

const LISTENING_Q = [
  { question: 'What is the man\'s name?', correct: 'Mark', options: ['Mark', 'Nit', 'David', 'James'] },
  { question: 'Where is the man from?', correct: 'England', options: ['America', 'Australia', 'England', 'Scotland'] },
  { question: 'How long has the man been in Thailand?', correct: 'Two years', options: ['One year', 'Two years', 'Three years', 'Six months'] },
  { question: 'What does the man do?', correct: 'English teacher', options: ['Doctor', 'Engineer', 'English teacher', 'Business owner'] },
  { question: 'Can the man speak Thai?', correct: 'A little', options: ['Not at all', 'A little', 'Very well', 'Fluently'] },
]

export default function A2Unit1Lesson1() {
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
  const stopRef = useRef(false)

  const card = VOCAB[cardIndex]
  const pct = Math.round((correct / QUIZ.length) * 100)
  const C = '#0ea5e9'
  const D = '#0369a1'

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
      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${D}, ${C})`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A2 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>A2 · Unit 1 · Lesson 1 — Introducing Yourself</div>
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
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${C}` }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>🗣️ A2 Unit 1 — Introducing Yourself in Detail</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>Build on your A1 introduction with more natural sentences, present continuous, and cultural context.</p>
              <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '14px 18px', border: `1px solid ${C}40` }}>
                <div style={{ color: D, fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>🎯 15 phrases · 🔊 AI voices for sentences · instant audio for words</div>
                <div style={{ color: '#374151', fontSize: '14px' }}>Occupations · กำลัง present continuous · ได้ไหม for requests · ช้าๆ survival Thai</div>
              </div>
            </div>
          )}
          <div style={{ background: `rgba(14,165,233,0.06)`, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px', marginBottom: '16px' }}>
            <span style={{ color: C, fontSize: '13px', fontWeight: '700' }}>{cardIndex + 1} / {VOCAB.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: C, borderRadius: '10px', width: `${((cardIndex + 1) / VOCAB.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: `linear-gradient(135deg, ${D}, ${C})`, padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '44px', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '10px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', marginBottom: '20px' }}>{card.english}</div>
              {/* Browser TTS for main word — instant */}
              <button onClick={() => speakThai(card.thai)}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>
                🔊 Listen
              </button>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${C}40` }}>
                <div style={{ color: C, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: C, marginBottom: '4px' }}>{card.example.thai}</div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.example.english}</div>
                  </div>
                  {/* OpenAI TTS for example sentence — quality audio */}
                  <ListenBtn text={card.example.thai} voice="nova" label="🔊"
                    style={{ marginLeft: 'auto', background: C, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }} />
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
              ? <button onClick={() => setCardIndex(p => p + 1)} style={{ flex: 1, background: `linear-gradient(135deg, ${D}, ${C})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>Next →</button>
              : <button onClick={() => setPhase('conversation')} style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>🗣️ Conversation →</button>
            }
          </div>
        </div>
      )}

      {/* CONVERSATION */}
      {phase === 'conversation' && (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${C}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>🗣️ Real Conversation — Meeting Someone New</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px' }}>Click any line to hear it. Press Play for the full conversation.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#f0f9ff', color: C, fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>🧑 Mark = echo (male)</span>
              <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>👩 Nit = nova (female)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={startConversation} disabled={playStatus !== 'idle'}
              style={{ flex: 1, background: playStatus !== 'idle' ? '#6b7280' : `linear-gradient(135deg, ${D}, ${C})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: playStatus !== 'idle' ? 'default' : 'pointer' }}>
              {playStatus === 'playing' ? '⏸ Playing...' : '▶ Play Full Conversation'}
            </button>
            {playStatus !== 'idle' && <button onClick={stopConversation} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>■ Stop</button>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {CONVERSATION.map((line, i) => (
              <div key={i} style={{ background: activeLine === i ? (line.speaker === 'A' ? '#f0f9ff' : '#f0fdf4') : 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${activeLine === i ? (line.speaker === 'A' ? C : '#22c55e') : '#e5e7eb'}`, transition: 'all 0.2s', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: line.speaker === 'A' ? C : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', flexShrink: 0 }}>
                  {line.speaker === 'A' ? '🧑' : '👩'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '19px', fontWeight: '900', color: line.speaker === 'A' ? C : '#15803d', marginBottom: '4px' }}>{line.thai}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '2px' }}>{line.roman}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>{line.english}</div>
                </div>
                {/* OpenAI TTS per line */}
                <ListenBtn text={line.thai} voice={line.speaker === 'A' ? 'echo' : 'nova'} label="🔊"
                  style={{ background: line.speaker === 'A' ? `${C}15` : '#f0fdf4', color: line.speaker === 'A' ? C : '#15803d', border: `1px solid ${line.speaker === 'A' ? C : '#22c55e'}40`, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', flexShrink: 0 }} />
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
            <span style={{ color: C, fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: C, borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{QUIZ[quizIndex].q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ[quizIndex].options.map(opt => {
                const isC = opt === QUIZ[quizIndex].correct; const isSel = opt === selected
                let bg = '#f9fafb', bdr = '#e5e7eb', tc = '#374151'
                if (selected) { if (isC) { bg = '#f0f9ff'; bdr = C; tc = D } else if (isSel) { bg = '#fef2f2'; bdr = '#ef4444'; tc = '#dc2626' } }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${bdr}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: tc, fontWeight: '700', fontSize: '14px' }}>{opt}</span>
                    {selected && isC && <span style={{ color: C, fontSize: '20px' }}>✓</span>}
                    {selected && isSel && !isC && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ[quizIndex].correct ? '#f0f9ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ[quizIndex].correct ? C + '60' : '#fca5a5'}` }}>
              {selected === QUIZ[quizIndex].correct ? <span style={{ color: D, fontWeight: '700' }}>✅ Correct!</span> : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ[quizIndex].correct}</strong></span>}
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: `linear-gradient(135deg, ${D}, ${C})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ.length ? '✍️ Script →' : 'Next →'}</button>}
        </div>
      )}

      {/* SCRIPT */}
      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `5px solid ${C}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>✍️ Script Recognition</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai phrase and choose the correct English meaning.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: C, fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: C, borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What does this mean?</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: C, lineHeight: 1.3, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              {/* Browser TTS for script words — instant */}
              <button onClick={() => speakThai(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#f0f9ff', color: C, border: `2px solid ${C}40`, padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isC = opt === SCRIPT_Q[scriptIndex].english; const isSel = scriptSelected === opt
                let bg = '#f9fafb', bdr = '#e5e7eb', tc = '#1a1a2e'
                if (scriptSelected) { if (isC) { bg = '#f0f9ff'; bdr = C; tc = D } else if (isSel) { bg = '#fef2f2'; bdr = '#ef4444'; tc = '#dc2626' } }
                return (
                  <button key={opt} onClick={() => { if (scriptSelected) return; setScriptSelected(opt); if (isC) setScriptScore(p => p + 1) }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${bdr}`, borderRadius: '12px', padding: '14px 20px', cursor: scriptSelected ? 'default' : 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: tc, fontWeight: '700', fontSize: '14px' }}>{opt}</span>
                    {scriptSelected && isC && <span style={{ color: C, fontSize: '20px' }}>✓</span>}
                    {scriptSelected && isSel && !isC && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#f0f9ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? C + '60' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected ? <span style={{ color: D, fontWeight: '700' }}>✅ Correct!</span> : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is: <strong>{SCRIPT_Q[scriptIndex].english}</strong></span>}
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setListenIndex(0); setListenSelected(null); setListenScore(0); setListenPlayed(false); setPhase('listening'); return }
              setScriptIndex(p => p + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: `linear-gradient(135deg, ${D}, ${C})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {scriptIndex + 1 >= SCRIPT_Q.length ? '🎧 Listening →' : 'Next →'}
            </button>
          )}
        </div>
      )}

      {/* LISTENING */}
      {phase === 'listening' && (
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `5px solid ${C}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>🎧 Listening Comprehension</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>Listen without reading along, then answer the questions.</p>
            <button onClick={() => { startConversation(); setListenPlayed(true) }} disabled={playStatus !== 'idle'}
              style={{ background: playStatus !== 'idle' ? '#6b7280' : `linear-gradient(135deg, ${D}, ${C})`, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '900', fontSize: '15px', cursor: playStatus !== 'idle' ? 'default' : 'pointer' }}>
              {playStatus === 'playing' ? '⏸ Playing...' : listenPlayed ? '🔄 Play Again' : '▶ Play Conversation'}
            </button>
          </div>
          {listenPlayed && (
            <>
              <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: C, fontWeight: '700', fontSize: '14px' }}>Q {listenIndex + 1} / {LISTENING_Q.length}</span>
                <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '8px', background: C, borderRadius: '10px', width: `${((listenIndex + 1) / LISTENING_Q.length) * 100}%`, transition: 'width 0.3s' }} />
                </div>
                <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {listenScore}</span>
              </div>
              <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                <div style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{LISTENING_Q[listenIndex].question}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {LISTENING_Q[listenIndex].options.map(opt => {
                    const isC = opt === LISTENING_Q[listenIndex].correct; const isSel = listenSelected === opt
                    let bg = '#f9fafb', bdr = '#e5e7eb', tc = '#374151'
                    if (listenSelected) { if (isC) { bg = '#f0f9ff'; bdr = C; tc = D } else if (isSel) { bg = '#fef2f2'; bdr = '#ef4444'; tc = '#dc2626' } }
                    return (
                      <button key={opt} onClick={() => { if (listenSelected) return; setListenSelected(opt); if (isC) setListenScore(p => p + 1) }} disabled={!!listenSelected}
                        style={{ background: bg, border: `2px solid ${bdr}`, borderRadius: '12px', padding: '14px 20px', cursor: listenSelected ? 'default' : 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: tc, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                        {listenSelected && isC && <span style={{ color: C, fontSize: '20px' }}>✓</span>}
                        {listenSelected && isSel && !isC && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
              {listenSelected && (
                <div style={{ background: LISTENING_Q[listenIndex].correct === listenSelected ? '#f0f9ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${LISTENING_Q[listenIndex].correct === listenSelected ? C + '60' : '#fca5a5'}` }}>
                  {LISTENING_Q[listenIndex].correct === listenSelected ? <span style={{ color: D, fontWeight: '700' }}>✅ Correct!</span> : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{LISTENING_Q[listenIndex].correct}</strong></span>}
                </div>
              )}
              {listenSelected && (
                <button onClick={() => { if (listenIndex + 1 >= LISTENING_Q.length) { setPhase('complete'); return } setListenIndex(p => p + 1); setListenSelected(null) }}
                  style={{ width: '100%', background: `linear-gradient(135deg, ${D}, ${C})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
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
            <div style={{ fontSize: '48px', fontWeight: '900', color: pct >= 70 ? C : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '15px', marginBottom: '24px' }}>{correct}/{QUIZ.length} quiz · {listenScore}/{LISTENING_Q.length} listening</div>
            <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: `2px solid ${C}40`, textAlign: 'left' }}>
              <div style={{ color: D, fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson 1 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can now introduce yourself in detail in Thai. Next: family and relationships.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a2/unit-1/lesson-2" style={{ display: 'block', background: `linear-gradient(135deg, ${D}, ${C})`, color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Family and Relationships →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
