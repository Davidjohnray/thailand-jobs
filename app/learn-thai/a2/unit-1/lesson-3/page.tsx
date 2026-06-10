'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useLearnThaiGate } from '@/hooks/useLearnThaiGate'

// ── Audio cache ──────────────────────────────────────────────────
const audioCache: Record<string, AudioBuffer> = {}
let sharedContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!sharedContext || sharedContext.state === 'closed') sharedContext = new AudioContext()
  return sharedContext
}

async function fetchAndCache(text: string, voice: 'nova' | 'echo'): Promise<AudioBuffer | null> {
  const clean = text.replace(/\.\.\./g, '').trim()
  const key = `${voice}:${clean}`
  if (audioCache[key]) return audioCache[key]
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean, voice }),
    })
    if (!res.ok) return null
    const buf = await getAudioContext().decodeAudioData(await res.arrayBuffer())
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

function ListenBtn({ text, voice = 'nova', label = '🔊', style: btnStyle }: {
  text: string; voice?: 'nova' | 'echo'; label?: string; style?: React.CSSProperties
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle')
  const activeRef = useRef(false)

  const handleClick = async () => {
    if (status === 'playing') { activeRef.current = false; setStatus('idle'); return }
    const clean = text.replace(/\.\.\./g, '').trim()
    const key = `${voice}:${clean}`
    if (!audioCache[key]) setStatus('loading')
    const buffer = audioCache[key] ?? await fetchAndCache(clean, voice)
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
    thai: 'ตื่นนอน', roman: 'tuen noon', english: 'Wake up',
    example: { thai: 'ฉันตื่นนอนตอนหกโมงเช้าค่ะ', roman: 'chan tuen noon tawn hok mong chao kha', english: 'I wake up at six in the morning.' },
    note: 'ตื่น = to wake, นอน = to sleep/lie down. ตอน = at (time). โมงเช้า = o\'clock in the morning.',
    tip: 'Thais often ask ตื่นกี่โมง (tuen gii mong) = What time do you wake up? as casual small talk.',
  },
  {
    thai: 'กินข้าว', roman: 'gin khao', english: 'Eat (a meal)',
    example: { thai: 'กินข้าวเช้าแล้วหรือยังคะ', roman: 'gin khao chao laeo rue yang kha', english: 'Have you eaten breakfast yet?' },
    note: 'กิน = to eat, ข้าว = rice/meal. กินข้าวเช้า = eat breakfast, กินข้าวเที่ยง = lunch, กินข้าวเย็น = dinner.',
    tip: 'กินข้าวแล้วหรือยัง is one of the most common Thai greetings — literally asking if you\'ve eaten.',
  },
  {
    thai: 'ไปทำงาน', roman: 'pai tham ngaan', english: 'Go to work',
    example: { thai: 'ฉันไปทำงานตอนเจ็ดโมงครึ่งค่ะ', roman: 'chan pai tham ngaan tawn jet mong khrueng kha', english: 'I go to work at half past seven.' },
    note: 'ไป = to go. ทำงาน = to work. ครึ่ง = half. เจ็ดโมงครึ่ง = seven thirty.',
    tip: 'Thai school days often start at 8am. You\'ll hear ไปโรงเรียน (go to school) constantly from parents.',
  },
  {
    thai: 'เลิกงาน', roman: 'loek ngaan', english: 'Finish work',
    example: { thai: 'ฉันเลิกงานตอนสี่โมงเย็นค่ะ', roman: 'chan loek ngaan tawn sii mong yen kha', english: 'I finish work at four in the afternoon.' },
    note: 'เลิก = to finish/stop. งาน = work. โมงเย็น = o\'clock in the afternoon.',
    tip: 'เลิกแล้วไปไหน (loek laeo pai nai) = Where are you going after work? Very common question.',
  },
  {
    thai: 'ออกกำลังกาย', roman: 'awk gam lang gaai', english: 'Exercise',
    example: { thai: 'ฉันออกกำลังกายทุกเช้าค่ะ', roman: 'chan awk gam lang gaai thuk chao kha', english: 'I exercise every morning.' },
    note: 'ออก = go out, กำลังกาย = physical strength. ทุกเช้า = every morning.',
    tip: 'Lumpini Park in Bangkok and parks near schools are packed with exercisers at 6am. Thais love morning exercise.',
  },
  {
    thai: 'ดูทีวี', roman: 'duu thii wii', english: 'Watch TV',
    example: { thai: 'ตอนเย็นฉันชอบดูทีวีค่ะ', roman: 'tawn yen chan choop duu thii wii kha', english: 'In the evening I like watching TV.' },
    note: 'ดู = to watch/look. ตอนเย็น = in the evening. Also: ดูหนัง = watch a movie, ดูซีรีส์ = watch a series.',
    tip: 'Thai soap operas (ละคร la khon) are hugely popular. Asking about them is a great conversation starter.',
  },
  {
    thai: 'ทำอาหาร', roman: 'tham aa haan', english: 'Cook food',
    example: { thai: 'ฉันชอบทำอาหารไทยค่ะ', roman: 'chan choop tham aa haan thai kha', english: 'I like cooking Thai food.' },
    note: 'ทำ = to make/do. อาหาร = food. ทำอาหารไทย = cook Thai food.',
    tip: 'Telling a Thai you can cook Thai food earns huge respect. Even better if you know ผัดกะเพรา (pad kaprao).',
  },
  {
    thai: 'ชอบเล่น', roman: 'choop len', english: 'Like to play / enjoy doing',
    example: { thai: 'ฉันชอบเล่นกีฬาค่ะ', roman: 'chan choop len gii laa kha', english: 'I like playing sport.' },
    note: 'ชอบ = to like, เล่น = to play. เล่นกีฬา = play sport, เล่นดนตรี = play music, เล่นเกม = play games.',
    tip: 'เล่น is very versatile in Thai — it covers playing sport, instruments, and games.',
  },
  {
    thai: 'ว่างๆ', roman: 'waang waang', english: 'Free time / when free',
    example: { thai: 'ตอนว่างๆ ฉันชอบอ่านหนังสือค่ะ', roman: 'tawn waang waang chan choop aan nang sue kha', english: 'In my free time I like reading.' },
    note: 'ว่าง = free/available. ๆ repeats the word for emphasis. ตอนว่างๆ = when you have free time.',
    tip: 'คุณว่างไหม (khun waang mai) = Are you free? The most important question for making plans.',
  },
  {
    thai: 'ทุกวัน', roman: 'thuk wan', english: 'Every day',
    example: { thai: 'ฉันดื่มกาแฟทุกวันค่ะ', roman: 'chan dueam gaa fae thuk wan kha', english: 'I drink coffee every day.' },
    note: 'ทุก = every. วัน = day. Also: ทุกเช้า (every morning), ทุกอาทิตย์ (every week), ทุกปี (every year).',
    tip: 'Frequency words like ทุกวัน are very useful for talking about habits and routines.',
  },
  {
    thai: 'บางครั้ง', roman: 'baang khrang', english: 'Sometimes',
    example: { thai: 'บางครั้งฉันไปออกกำลังกายตอนเย็นค่ะ', roman: 'baang khrang chan pai awk gam lang gaai tawn yen kha', english: 'Sometimes I go and exercise in the evening.' },
    note: 'บาง = some, ครั้ง = time/occasion. Also useful: มักจะ (mak ja) = usually, นานๆ ครั้ง = rarely.',
    tip: 'Thai frequency words go at the start of the sentence, unlike English where they often go in the middle.',
  },
  {
    thai: 'งานอดิเรก', roman: 'ngaan a di rek', english: 'Hobby',
    example: { thai: 'งานอดิเรกของฉันคือการถ่ายรูปค่ะ', roman: 'ngaan a di rek khong chan khue gaan thaai ruup kha', english: 'My hobby is photography.' },
    note: 'งาน = work/thing, อดิเรก = recreation. คือ = is/equals. การ + verb = the act of doing something.',
    tip: 'Popular hobbies to mention: การถ่ายรูป (photography), การอ่านหนังสือ (reading), การท่องเที่ยว (travelling).',
  },
  {
    thai: 'ท่องเที่ยว', roman: 'thong thiao', english: 'Travel / go sightseeing',
    example: { thai: 'ฉันชอบท่องเที่ยวทั่วไทยค่ะ', roman: 'chan choop thong thiao thua thai kha', english: 'I love travelling around Thailand.' },
    note: 'ท่อง = wander, เที่ยว = go out/travel. ทั่วไทย = all over Thailand.',
    tip: 'Saying you love travelling Thailand always sparks great conversation — Thais love recommending places.',
  },
  {
    thai: 'นอนดึก', roman: 'noon duek', english: 'Stay up late',
    example: { thai: 'ฉันมักจะนอนดึกค่ะ ประมาณเที่ยงคืน', roman: 'chan mak ja noon duek kha pra maan thiang khueen', english: 'I usually stay up late, around midnight.' },
    note: 'นอน = sleep, ดึก = late at night. มักจะ = usually. เที่ยงคืน = midnight.',
    tip: 'Thai nightlife culture means many people sleep late. ตีสาม (tii saam) = 3am — not uncommon!',
  },
  {
    thai: 'พักผ่อน', roman: 'phak phawn', english: 'Rest / relax',
    example: { thai: 'วันหยุดฉันชอบพักผ่อนอยู่บ้านค่ะ', roman: 'wan yut chan choop phak phawn yuu baan kha', english: 'On holidays I like relaxing at home.' },
    note: 'พัก = to rest, ผ่อน = to ease/relax. วันหยุด = holiday/day off.',
    tip: 'พักผ่อนให้เต็มที่ (phak phawn hai tem thii) = Rest fully — a very caring thing to say to someone.',
  },
]

const CONVERSATION = [
  { speaker: 'A' as const, thai: 'คุณตื่นนอนกี่โมงครับ', roman: 'khun tuen noon gii mong khrap', english: 'What time do you wake up?' },
  { speaker: 'B' as const, thai: 'ตื่นประมาณหกโมงครึ่งค่ะ แล้วก็กินข้าวเช้าก่อนไปทำงานค่ะ', roman: 'tuen pra maan hok mong khrueng kha laeo gor gin khao chao gorn pai tham ngaan kha', english: 'I wake up at about six thirty, then eat breakfast before going to work.' },
  { speaker: 'A' as const, thai: 'ไปทำงานกี่โมงครับ', roman: 'pai tham ngaan gii mong khrap', english: 'What time do you go to work?' },
  { speaker: 'B' as const, thai: 'ประมาณเจ็ดโมงครึ่งค่ะ แล้วเลิกงานตอนสี่โมงเย็นค่ะ', roman: 'pra maan jet mong khrueng kha laeo loek ngaan tawn sii mong yen kha', english: 'About seven thirty. I finish work at four in the afternoon.' },
  { speaker: 'A' as const, thai: 'หลังเลิกงานทำอะไรครับ', roman: 'lang loek ngaan tham a rai khrap', english: 'What do you do after work?' },
  { speaker: 'B' as const, thai: 'บางครั้งออกกำลังกายค่ะ แล้วก็ทำอาหารกินเองที่บ้านค่ะ', roman: 'baang khrang awk gam lang gaai kha laeo gor tham aa haan gin eng thii baan kha', english: 'Sometimes I exercise, then cook and eat at home.' },
  { speaker: 'A' as const, thai: 'งานอดิเรกของคุณคืออะไรครับ', roman: 'ngaan a di rek khong khun khue a rai khrap', english: 'What are your hobbies?' },
  { speaker: 'B' as const, thai: 'ชอบท่องเที่ยวและถ่ายรูปค่ะ ตอนว่างๆ ชอบดูซีรีส์ด้วยค่ะ', roman: 'choop thong thiao lae thaai ruup kha tawn waang waang choop duu sii riit duai kha', english: 'I like travelling and photography. In free time I also like watching series.' },
  { speaker: 'A' as const, thai: 'นอนกี่โมงครับ ปกติ', roman: 'noon gii mong khrap pa ga ti', english: 'What time do you usually sleep?' },
  { speaker: 'B' as const, thai: 'นอนดึกหน่อยค่ะ ประมาณเที่ยงคืนค่ะ ชอบพักผ่อนดูทีวีก่อนนอนค่ะ', roman: 'noon duek noi kha pra maan thiang khueen kha choop phak phawn duu thii wii gorn noon kha', english: 'A bit late, around midnight. I like relaxing and watching TV before bed.' },
]

const QUIZ = [
  { q: 'How do you say "I wake up at six"?', correct: 'Chan tuen noon tawn hok mong', options: ['Chan noon tawn hok mong', 'Chan tuen noon tawn hok mong', 'Chan pai tawn hok mong', 'Chan awk tawn hok mong'] },
  { q: 'What does กินข้าวแล้วหรือยัง mean?', correct: 'Have you eaten yet?', options: ['Are you hungry?', 'Have you eaten yet?', 'Do you like rice?', 'What did you eat?'] },
  { q: 'How do you say "every day"?', correct: 'Thuk wan', options: ['Baang khrang', 'Thuk wan', 'Wan yut', 'Tawn yen'] },
  { q: 'What does ว่างๆ (waang waang) mean?', correct: 'Free time', options: ['Very busy', 'Free time', 'Every week', 'Late at night'] },
  { q: 'How do you say "I finish work"?', correct: 'Chan loek ngaan', options: ['Chan pai ngaan', 'Chan tham ngaan', 'Chan loek ngaan', 'Chan awk ngaan'] },
  { q: 'What does บางครั้ง (baang khrang) mean?', correct: 'Sometimes', options: ['Always', 'Never', 'Sometimes', 'Usually'] },
  { q: 'How do you say "I like to exercise"?', correct: 'Chan choop awk gam lang gaai', options: ['Chan choop len gii laa', 'Chan choop awk gam lang gaai', 'Chan choop tham ngaan', 'Chan choop noon'] },
  { q: 'What does ท่องเที่ยว (thong thiao) mean?', correct: 'Travel / sightseeing', options: ['Go to work', 'Travel / sightseeing', 'Cook food', 'Watch TV'] },
  { q: 'How do you say "In my free time"?', correct: 'Tawn waang waang', options: ['Tawn yen', 'Tawn waang waang', 'Tawn chao', 'Tawn glaang khueen'] },
  { q: 'What does พักผ่อน (phak phawn) mean?', correct: 'Rest / relax', options: ['Go out', 'Exercise', 'Rest / relax', 'Stay up late'] },
]

const SCRIPT_Q = VOCAB.slice(0, 10).sort(() => Math.random() - 0.5).map(v => ({
  thai: v.thai, roman: v.roman, english: v.english,
  options: [v.english, ...VOCAB.filter(x => x.english !== v.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
}))

const LISTENING_Q = [
  { question: 'What time does the woman wake up?', correct: 'About six thirty', options: ['Six o\'clock', 'About six thirty', 'Seven o\'clock', 'Half past seven'] },
  { question: 'What time does she finish work?', correct: 'Four in the afternoon', options: ['Three in the afternoon', 'Four in the afternoon', 'Five in the afternoon', 'Six in the evening'] },
  { question: 'What does she sometimes do after work?', correct: 'Exercise', options: ['Go shopping', 'Exercise', 'Watch TV', 'Meet friends'] },
  { question: 'What are her hobbies?', correct: 'Travelling and photography', options: ['Cooking and reading', 'Travelling and photography', 'Sport and music', 'Gaming and TV'] },
  { question: 'What time does she usually sleep?', correct: 'Around midnight', options: ['Ten o\'clock', 'Eleven o\'clock', 'Around midnight', 'One in the morning'] },
]

export default function A2Unit1Lesson3() {
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
      <div style={{ background: `linear-gradient(135deg, ${D}, ${C})`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A2 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>A2 · Unit 1 · Lesson 3 — Daily Life & Hobbies</div>
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
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>🌅 A2 Unit 1 Lesson 3 — Daily Life & Hobbies</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>Describe your daily routine and hobbies in Thai. Talk about what you do every day, sometimes, and in your free time.</p>
              <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '14px 18px', border: `1px solid ${C}40` }}>
                <div style={{ color: D, fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>🎯 15 words · 🔊 Male and female AI voices</div>
                <div style={{ color: '#374151', fontSize: '14px' }}>Daily routine · ทุกวัน every day · บางครั้ง sometimes · ว่างๆ free time · hobbies vocab</div>
              </div>
            </div>
          )}
          <div style={{ background: 'rgba(14,165,233,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px', marginBottom: '16px' }}>
            <span style={{ color: C, fontSize: '13px', fontWeight: '700' }}>{cardIndex + 1} / {VOCAB.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: C, borderRadius: '10px', width: `${((cardIndex + 1) / VOCAB.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: `linear-gradient(135deg, ${D}, ${C})`, padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '44px', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '10px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px' }}>{card.english}</div>
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
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>🗣️ Real Conversation — Talking About Your Day</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px' }}>Click any line to hear it. Press Play for the full conversation.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#f0f9ff', color: C, fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>🧑 Somchai = echo (male)</span>
              <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>👩 Sara = nova (female)</span>
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
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai word and choose the correct English meaning.</p>
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
              <ListenBtn text={SCRIPT_Q[scriptIndex].thai} voice="nova" label="🔊 Hear it"
                style={{ background: '#f0f9ff', color: C, border: `2px solid ${C}40`, padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }} />
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
              <div style={{ color: D, fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Unit 1 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can now introduce yourself, talk about your family and describe your daily life in Thai. Next up: Food & Ordering at Restaurants.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a2/unit-2/lesson-1" style={{ display: 'block', background: `linear-gradient(135deg, ${D}, ${C})`, color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Unit 2 — Food & Ordering →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
