'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useLearnThaiGate } from '@/hooks/useLearnThaiGate'

// ── TTS ──────────────────────────────────────────────────────────
const urlCache: Record<string, string> = {}
let activeAudio: HTMLAudioElement | null = null

async function tts(text: string, voice: 'nova' | 'echo' = 'nova'): Promise<void> {
  if (typeof window === 'undefined') return
  if (activeAudio) { activeAudio.pause(); activeAudio = null }
  const key = `${voice}::${text}`
  try {
    if (!urlCache[key]) {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      urlCache[key] = URL.createObjectURL(blob)
    }
    await new Promise<void>((resolve) => {
      const audio = new Audio(urlCache[key])
      activeAudio = audio
      audio.onended = () => { activeAudio = null; resolve() }
      audio.onerror = () => { activeAudio = null; resolve() }
      audio.play().catch(() => resolve())
    })
  } catch { /* silent fail */ }
}
// ────────────────────────────────────────────────────────────────

const VOCAB = [
  {
    thai: 'ฉันชื่อ...', roman: 'chan chuu...', english: 'My name is... (female)',
    example: { thai: 'ฉันชื่อซาร่าค่ะ', roman: 'chan chuu Saaraa kha', english: 'My name is Sara.' },
    note: 'ฉัน is the polite female "I". Males use ผม (phom). Always add ค่ะ (female) or ครับ (male) to sound natural and polite.',
    tip: 'Thais often go by nickname — ชื่อเล่น (chuu len). Ask: คุณมีชื่อเล่นไหม? (Do you have a nickname?)',
  },
  {
    thai: 'ฉันอายุ...ปี', roman: 'chan aa yu...pii', english: 'I am ... years old',
    example: { thai: 'ฉันอายุยี่สิบแปดปีค่ะ', roman: 'chan aa yu yii sip bpaet pii kha', english: 'I am 28 years old.' },
    note: 'อายุ (aa yu) = age. ปี (pii) = year. The number goes between them.',
    tip: 'Asking age is perfectly normal in Thailand — not rude at all. คุณอายุเท่าไรครับ/ค่ะ is a standard question.',
  },
  {
    thai: 'ฉันเป็น...', roman: 'chan pen...', english: 'I am a... (occupation)',
    example: { thai: 'ฉันเป็นครูภาษาอังกฤษค่ะ', roman: 'chan pen khruu phasaa ang-grid kha', english: 'I am an English teacher.' },
    note: 'เป็น (pen) = to be, for roles and occupations. Common jobs: ครู (teacher), หมอ (doctor), พยาบาล (nurse), วิศวกร (engineer).',
    tip: 'ภาษาอังกฤษ literally means "English language". ครูภาษาอังกฤษ is what everyone will call you.',
  },
  {
    thai: 'ฉันมาจาก...', roman: 'chan maa jaak...', english: 'I come from...',
    example: { thai: 'ฉันมาจากอังกฤษค่ะ', roman: 'chan maa jaak Ang-grid kha', english: 'I come from England.' },
    note: 'มา = to come, จาก = from. Countries: อังกฤษ (England), อเมริกา (America), ออสเตรเลีย (Australia), แคนาดา (Canada), สกอตแลนด์ (Scotland).',
    tip: 'Follow with ฉันอยู่ที่ไทยมา...ปีแล้ว — Thais love hearing how long you\'ve been here.',
  },
  {
    thai: 'ฉันอยู่ที่...', roman: 'chan yuu thii...', english: 'I live in/at...',
    example: { thai: 'ฉันอยู่ที่อยุธยามาสองปีแล้วค่ะ', roman: 'chan yuu thii A-yut-tha-yaa maa soong pii laeo kha', english: 'I\'ve been in Ayutthaya for two years.' },
    note: 'อยู่ที่ = live at/in. มา...ปีแล้ว = for...years. Shows you\'re committed to Thailand — not just a tourist.',
    tip: 'Cities: กรุงเทพ (Bangkok), เชียงใหม่ (Chiang Mai), อยุธยา (Ayutthaya), ภูเก็ต (Phuket), ขอนแก่น (Khon Kaen).',
  },
  {
    thai: 'ฉันชอบ...', roman: 'chan choop...', english: 'I like...',
    example: { thai: 'ฉันชอบอาหารไทยมากค่ะ', roman: 'chan choop aa haan thai maak kha', english: 'I really like Thai food.' },
    note: 'ชอบ = to like. มาก = very much. ไม่ชอบ = don\'t like.',
    tip: 'Saying you love Thai food will instantly warm up any Thai. Food is the number one bonding topic in Thai culture.',
  },
  {
    thai: 'ฉันพูดภาษาไทยได้นิดหน่อย', roman: 'chan phuut phasaa thai dai nit noi', english: 'I can speak a little Thai',
    example: { thai: 'ฉันพูดภาษาไทยได้นิดหน่อยค่ะ', roman: 'chan phuut phasaa thai dai nit noi kha', english: 'I can speak a little Thai.' },
    note: 'พูด = to speak. ได้ after a verb = can/able to. นิดหน่อย = a little.',
    tip: 'Say this early — Thais will be immediately encouraging and often start teaching you more words.',
  },
  {
    thai: 'ยินดีที่ได้รู้จัก', roman: 'yin dii thii dai ruu jak', english: 'Nice to meet you',
    example: { thai: 'ยินดีที่ได้รู้จักค่ะ ชื่อซาร่านะคะ', roman: 'yin dii thii dai ruu jak kha chuu Saaraa na kha', english: 'Nice to meet you. My name is Sara.' },
    note: 'ยินดี = pleased/glad. รู้จัก = to know/be acquainted with. Shows real effort and earns deep respect.',
    tip: 'After this, Thais often say แอดไลน์ด้วยนะ (add me on LINE) — the Thai way of staying connected.',
  },
  {
    thai: 'ฉันสอนที่...', roman: 'chan soon thii...', english: 'I teach at...',
    example: { thai: 'ฉันสอนที่โรงเรียนประถมค่ะ', roman: 'chan soon thii roong rian pra thom kha', english: 'I teach at a primary school.' },
    note: 'สอน = to teach. โรงเรียน = school. ประถม = primary, มัธยม = secondary, มหาวิทยาลัย = university.',
    tip: 'Being a teacher (ครู) is highly respected. Parents often wai you even in casual settings.',
  },
  {
    thai: 'คุณอยู่ที่นี่มานานแค่ไหนแล้ว', roman: 'khun yuu thii nii maa naan khae nai laeo', english: 'How long have you been here?',
    example: { thai: 'คุณอยู่ที่นี่มานานแค่ไหนแล้วครับ', roman: 'khun yuu thii nii maa naan khae nai laeo khrap', english: 'How long have you been here?' },
    note: 'มา = been here, นาน = long time, แค่ไหน = how long, แล้ว = already. A key A2 question pattern.',
    tip: 'Answer: ฉันอยู่มา...ปีแล้วค่ะ. Thais are always curious how long foreigners have been in Thailand.',
  },
  {
    thai: 'ฉันรักประเทศไทย', roman: 'chan rak pra thet thai', english: 'I love Thailand',
    example: { thai: 'ฉันรักประเทศไทยมากค่ะ ที่นี่สวยมาก', roman: 'chan rak pra thet thai maak kha thii nii suai maak', english: 'I love Thailand very much. It\'s beautiful here.' },
    note: 'รัก = to love. ประเทศไทย = Thailand (formal). Casually: เมืองไทย. This will ALWAYS get a huge smile.',
    tip: 'Follow with something specific — อาหาร (food), ผู้คน (people), วัฒนธรรม (culture).',
  },
  {
    thai: 'คุณพูดภาษาอังกฤษได้ไหม', roman: 'khun phuut phasaa ang-grid dai mai', english: 'Can you speak English?',
    example: { thai: 'ขอโทษนะครับ คุณพูดภาษาอังกฤษได้ไหมครับ', roman: 'kho thoot na khrap khun phuut phasaa ang-grid dai mai khrap', english: 'Excuse me, can you speak English?' },
    note: 'ได้ไหม = can you? The standard ability question. ได้ = yes/can, ไม่ได้ = no/can\'t.',
    tip: 'Always try Thai first — the effort is appreciated even if your Thai is basic.',
  },
  {
    thai: 'ฉันกำลังเรียนภาษาไทย', roman: 'chan gam lang rian phasaa thai', english: 'I am learning Thai',
    example: { thai: 'ฉันกำลังเรียนภาษาไทยอยู่ค่ะ', roman: 'chan gam lang rian phasaa thai yuu kha', english: 'I am currently learning Thai.' },
    note: 'กำลัง (gam lang) = currently/in the process of — your present continuous marker in Thai.',
    tip: 'Your magic phrase. Thais become your teacher, friend, and biggest supporter when they hear this.',
  },
  {
    thai: 'ขอโทษ ช่วยพูดช้าๆ ได้ไหม', roman: 'kho thoot chuai phuut chaa chaa dai mai', english: 'Sorry, can you speak slowly?',
    example: { thai: 'ขอโทษนะคะ ช่วยพูดช้าๆ ได้ไหมคะ', roman: 'kho thoot na kha chuai phuut chaa chaa dai mai kha', english: 'Sorry, can you please speak slowly?' },
    note: 'ช่วย = please/help. ช้าๆ = slowly. ESSENTIAL — never be embarrassed to use this.',
    tip: 'ๆ means repeat the word — ช้าๆ = "slow slow" = very slowly. Common throughout Thai.',
  },
  {
    thai: 'ฉันไม่เข้าใจ', roman: 'chan mai khao jai', english: 'I don\'t understand',
    example: { thai: 'ขอโทษค่ะ ฉันไม่เข้าใจ ช่วยอธิบายอีกครั้งได้ไหมคะ', roman: 'kho thoot kha chan mai khao jai chuai a thi bai iik khrang dai mai kha', english: 'Sorry, I don\'t understand. Can you explain again?' },
    note: 'เข้าใจ = to understand (literally "enter heart"). เข้าใจแล้ว = I understand now.',
    tip: 'เข้าใจไหม? = Do you understand? Your students will ask you this constantly!',
  },
]

const CONVERSATION = [
  { speaker: 'A' as const, thai: 'สวัสดีครับ ผมชื่อมาร์คครับ', roman: 'sawasdee khrap phom chuu Mark khrap', english: 'Hello, my name is Mark.' },
  { speaker: 'B' as const, thai: 'สวัสดีค่ะ ดีใจที่ได้รู้จักค่ะ ฉันชื่อนิดค่ะ', roman: 'sawasdee kha dii jai thii dai ruu jak kha chan chuu Nit kha', english: 'Hello, pleased to meet you. My name is Nit.' },
  { speaker: 'A' as const, thai: 'คุณมาจากไหนครับ', roman: 'khun maa jaak nai khrap', english: 'Where are you from?' },
  { speaker: 'B' as const, thai: 'ฉันเป็นคนไทยค่ะ มาจากเชียงใหม่ค่ะ คุณล่ะครับ', roman: 'chan pen khon thai kha maa jaak Chiang Mai kha khun la khrap', english: 'I\'m Thai, from Chiang Mai. And you?' },
  { speaker: 'A' as const, thai: 'ผมมาจากอังกฤษครับ อยู่ที่ไทยมาสองปีแล้วครับ', roman: 'phom maa jaak Ang-grid khrap yuu thii thai maa soong pii laeo khrap', english: 'I\'m from England. I\'ve been in Thailand two years.' },
  { speaker: 'B' as const, thai: 'โอ้ สองปีแล้วเหรอคะ พูดภาษาไทยได้บ้างไหมคะ', roman: 'oh soong pii laeo roe kha phuut phasaa thai dai baang mai kha', english: 'Oh, two years already? Can you speak some Thai?' },
  { speaker: 'A' as const, thai: 'ได้นิดหน่อยครับ กำลังเรียนอยู่ครับ', roman: 'dai nit noi khrap gam lang rian yuu khrap', english: 'A little. I\'m still learning.' },
  { speaker: 'B' as const, thai: 'เก่งมากเลยค่ะ คุณทำงานอะไรที่นี่คะ', roman: 'geng maak loei kha khun tham ngaan a rai thii nii kha', english: 'Very impressive! What do you do here?' },
  { speaker: 'A' as const, thai: 'ผมเป็นครูภาษาอังกฤษครับ สอนที่โรงเรียนมัธยมครับ', roman: 'phom pen khruu phasaa ang-grid khrap soon thii roong rian mat tha yom khrap', english: 'I\'m an English teacher at a secondary school.' },
  { speaker: 'B' as const, thai: 'ดีมากเลยค่ะ ยินดีที่ได้รู้จักค่ะ', roman: 'dii maak loei kha yin dii thii dai ruu jak kha', english: 'Wonderful! Nice to meet you.' },
]

const QUIZ = [
  { q: 'How does a female say "My name is Sara"?', correct: 'Chan chuu Sara kha', options: ['Phom chuu Sara khrap', 'Chan chuu Sara kha', 'Khun chuu Sara kha', 'Chan pen Sara kha'] },
  { q: 'What does กำลัง (gam lang) indicate?', correct: 'A continuous/ongoing action', options: ['Past tense', 'A continuous/ongoing action', 'Future tense', 'A question'] },
  { q: 'How do you say "I\'ve been in Thailand for 3 years"?', correct: 'Chan yuu thii thai maa saam pii laeo', options: ['Chan yuu thii thai saam pii', 'Chan maa thai saam pii', 'Chan yuu thii thai maa saam pii laeo', 'Chan pen thai saam pii laeo'] },
  { q: 'What does เข้าใจ (khao jai) literally mean?', correct: 'Enter heart', options: ['Open mind', 'Enter heart', 'Clear head', 'Know well'] },
  { q: 'How do you ask someone to speak slowly?', correct: 'Chuai phuut chaa chaa dai mai', options: ['Chuai phuut lek lek dai mai', 'Chuai phuut chaa chaa dai mai', 'Chuai phuut nit noi dai mai', 'Chuai phuut yai yai dai mai'] },
  { q: 'What does ได้ไหม (dai mai) mean at sentence end?', correct: 'Can you? / Is it possible?', options: ['Do you want to?', 'Can you? / Is it possible?', 'Did you?', 'Will you?'] },
  { q: 'How do you say "I love Thailand"?', correct: 'Chan rak pra thet thai', options: ['Chan choop pra thet thai', 'Chan rak pra thet thai', 'Chan yuu pra thet thai', 'Chan dii pra thet thai'] },
  { q: 'The ๆ symbol means...?', correct: 'Repeat the previous word', options: ['End of sentence', 'Repeat the previous word', 'Question marker', 'Emphasis'] },
  { q: 'How do you say "I teach at a primary school"?', correct: 'Chan soon thii roong rian pra thom', options: ['Chan rian thii roong rian pra thom', 'Chan soon thii roong rian mat tha yom', 'Chan soon thii roong rian pra thom', 'Chan pen khruu roong rian pra thom'] },
  { q: 'What is the polite female sentence ender?', correct: 'ค่ะ (kha)', options: ['ครับ (khrap)', 'ค่ะ (kha)', 'นะ (na)', 'เลย (loei)'] },
]

const SCRIPT_Q = VOCAB.slice(0, 10).sort(() => Math.random() - 0.5).map(v => ({
  thai: v.thai, roman: v.roman, english: v.english,
  options: [v.english, ...VOCAB.filter(x => x.english !== v.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
}))

const LISTENING_Q = [
  { question: 'What is the man\'s name?', correct: 'Mark', options: ['Mark', 'Nit', 'David', 'James'] },
  { question: 'Where is the man from?', correct: 'England', options: ['America', 'Australia', 'England', 'Scotland'] },
  { question: 'How long has the man been in Thailand?', correct: 'Two years', options: ['One year', 'Two years', 'Three years', 'Six months'] },
  { question: 'What does the man do for work?', correct: 'English teacher', options: ['Doctor', 'Engineer', 'English teacher', 'Business owner'] },
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
  const [playStatus, setPlayStatus] = useState<'idle' | 'loading' | 'playing'>('idle')
  const stopRef = useRef(false)

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

  const playConversation = async () => {
    if (playStatus !== 'idle') return
    stopRef.current = false
    setPlayStatus('loading')
    // Pre-fetch all audio
    const urls: string[] = []
    for (const line of CONVERSATION) {
      const key = `${line.speaker === 'A' ? 'echo' : 'nova'}::${line.thai}`
      if (!urlCache[key]) {
        try {
          const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: line.thai, voice: line.speaker === 'A' ? 'echo' : 'nova' }),
          })
          const blob = await res.blob()
          urlCache[key] = URL.createObjectURL(blob)
        } catch { urlCache[key] = '' }
      }
      urls.push(urlCache[key])
    }
    if (stopRef.current) { setPlayStatus('idle'); return }
    setPlayStatus('playing')
    // Play in sequence
    for (let i = 0; i < urls.length; i++) {
      if (stopRef.current) break
      if (!urls[i]) continue
      setActiveLine(i)
      await new Promise<void>((resolve) => {
        const audio = new Audio(urls[i])
        activeAudio = audio
        audio.onended = () => { activeAudio = null; resolve() }
        audio.onerror = () => { activeAudio = null; resolve() }
        audio.play().catch(() => resolve())
      })
      if (!stopRef.current) await new Promise(r => setTimeout(r, 500))
    }
    setActiveLine(-1)
    setPlayStatus('idle')
  }

  const stopConversation = () => {
    stopRef.current = true
    if (activeAudio) { activeAudio.pause(); activeAudio = null }
    setActiveLine(-1)
    setPlayStatus('idle')
  }

  const btn = (label: string, active: boolean, onClick: () => void) => (
    <button onClick={onClick} style={{ background: active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>{label}</button>
  )

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A2 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>A2 · Unit 1 · Lesson 1 — Introducing Yourself</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {btn('📖 Learn', phase === 'learn', () => { stopConversation(); setPhase('learn') })}
          {btn('🗣️ Conversation', phase === 'conversation', () => { stopConversation(); setPhase('conversation') })}
          {btn('🧠 Quiz', phase === 'quiz', () => { stopConversation(); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]); setPhase('quiz') })}
          {btn('✍️ Script', phase === 'script', () => { stopConversation(); setScriptIndex(0); setScriptSelected(null); setScriptScore(0); setPhase('script') })}
          {btn('🎧 Listening', phase === 'listening', () => { stopConversation(); setListenIndex(0); setListenSelected(null); setListenScore(0); setPhase('listening') })}
        </div>
      </div>

      {/* LEARN */}
      {phase === 'learn' && (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>🗣️ A2 Unit 1 — Introducing Yourself in Detail</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>Build on your A1 introduction with more natural sentences, the present continuous tense, and cultural context that makes your Thai feel real.</p>
              <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '14px 18px', border: `1px solid ${COLOR}40` }}>
                <div style={{ color: DARK, fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>🎯 15 phrases · Male & female AI voices</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>Occupations · How long you've been here · กำลัง present continuous · ได้ไหม for requests · ช้าๆ survival Thai</div>
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
              <button onClick={() => tts(card.thai, 'nova')} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
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
                  <button onClick={() => tts(card.example.thai, 'nova')} style={{ marginLeft: 'auto', background: COLOR, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🔊</button>
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
            {cardIndex > 0 && <button onClick={() => setCardIndex(p => p - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Back</button>}
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
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>🗣️ Real Conversation — Meeting Someone New</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px' }}>Click any line to hear it. Press Play to hear the full conversation with male & female voices.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#f0f9ff', color: COLOR, fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>🧑 Mark = male (echo)</span>
              <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>👩 Nit = female (nova)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={playConversation} disabled={playStatus !== 'idle'}
              style={{ flex: 1, background: playStatus !== 'idle' ? '#6b7280' : `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: playStatus !== 'idle' ? 'default' : 'pointer' }}>
              {playStatus === 'loading' ? '⏳ Loading all audio...' : playStatus === 'playing' ? '⏸ Playing...' : '▶ Play Full Conversation'}
            </button>
            {playStatus !== 'idle' && <button onClick={stopConversation} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>■ Stop</button>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {CONVERSATION.map((line, i) => (
              <div key={i} onClick={() => tts(line.thai, line.speaker === 'A' ? 'echo' : 'nova')}
                style={{ background: activeLine === i ? (line.speaker === 'A' ? '#f0f9ff' : '#f0fdf4') : 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', border: `2px solid ${activeLine === i ? (line.speaker === 'A' ? COLOR : '#22c55e') : '#e5e7eb'}`, transition: 'all 0.2s', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: line.speaker === 'A' ? COLOR : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', flexShrink: 0 }}>
                  {line.speaker === 'A' ? '🧑' : '👩'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '19px', fontWeight: '900', color: line.speaker === 'A' ? COLOR : '#15803d', marginBottom: '4px' }}>{line.thai}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '2px' }}>{line.roman}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>{line.english}</div>
                </div>
                <span style={{ color: '#d1d5db', fontSize: '18px', flexShrink: 0 }}>🔊</span>
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
                const isCorrect = opt === QUIZ[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = '#f0f9ff'; border = COLOR; textColor = DARK }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '14px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: COLOR, fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
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
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai phrase and choose the correct English meaning.</p>
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
              <button onClick={() => tts(SCRIPT_Q[scriptIndex].thai, 'nova')} style={{ background: '#f0f9ff', color: COLOR, border: `2px solid ${COLOR}40`, padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>🔊 Hear it</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isCorrect = opt === SCRIPT_Q[scriptIndex].english
                const isSelected = scriptSelected === opt
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#f0f9ff'; border = COLOR; textColor = DARK }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => { if (scriptSelected) return; setScriptSelected(opt); if (isCorrect) setScriptScore(p => p + 1) }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '14px' }}>{opt}</span>
                    {scriptSelected && isCorrect && <span style={{ color: COLOR, fontSize: '20px' }}>✓</span>}
                    {scriptSelected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
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
            <button onClick={() => { playConversation(); setListenPlayed(true) }} disabled={playStatus !== 'idle'}
              style={{ background: playStatus !== 'idle' ? '#6b7280' : `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '900', fontSize: '15px', cursor: playStatus !== 'idle' ? 'default' : 'pointer' }}>
              {playStatus === 'loading' ? '⏳ Loading...' : playStatus === 'playing' ? '⏸ Playing...' : listenPlayed ? '🔄 Play Again' : '▶ Play Conversation'}
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
                    const isCorrect = opt === LISTENING_Q[listenIndex].correct
                    const isSelected = listenSelected === opt
                    let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                    if (listenSelected) {
                      if (isCorrect) { bg = '#f0f9ff'; border = COLOR; textColor = DARK }
                      else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                    }
                    return (
                      <button key={opt} onClick={() => { if (listenSelected) return; setListenSelected(opt); if (isCorrect) setListenScore(p => p + 1) }} disabled={!!listenSelected}
                        style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: listenSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                        {listenSelected && isCorrect && <span style={{ color: COLOR, fontSize: '20px' }}>✓</span>}
                        {listenSelected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
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
                <button onClick={() => {
                  if (listenIndex + 1 >= LISTENING_Q.length) { setPhase('complete'); return }
                  setListenIndex(p => p + 1); setListenSelected(null)
                }} style={{ width: '100%', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
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
              <div style={{ color: DARK, fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson 1 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can now introduce yourself in detail in Thai. Next: family and relationships.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a2/unit-1/lesson-2" style={{ display: 'block', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Family & Relationships →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
