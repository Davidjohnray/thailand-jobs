'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const INTRO_PHRASES = [
  {
    thai: 'ฉันชื่อ...', roman: 'chan chuu...', english: 'My name is... (female)', emoji: '👋',
    note: 'ฉัน = I (female, polite), ชื่อ = name. Males say ผมชื่อ... (phom chuu...). ชื่อ also means "to be called".',
    example: { thai: 'ฉันชื่อซาร่า', roman: 'chan chuu Saaraa', english: 'My name is Sara' },
    tip: 'In casual speech many Thais skip the pronoun: ชื่อ... alone is fine. Adding ครับ/ค่ะ at the end is polite.',
  },
  {
    thai: 'ผมชื่อ...', roman: 'phom chuu...', english: 'My name is... (male)', emoji: '🙋‍♂️',
    note: 'ผม = I (male, polite). ผม also means "hair" — same word! Context makes the meaning clear.',
    example: { thai: 'ผมชื่อเดวิด', roman: 'phom chuu David', english: 'My name is David' },
    tip: 'ผม is the polite male pronoun. In casual settings between friends, men sometimes use เรา (rao = we/I) or even กู (guu) — but stick with ผม as a teacher.',
  },
  {
    thai: 'คุณชื่ออะไร', roman: 'khun chuu a rai', english: 'What is your name?', emoji: '❓',
    note: 'คุณ = you (polite). อะไร = what. This is the standard polite way to ask someone\'s name.',
    example: { thai: 'คุณชื่ออะไรครับ', roman: 'khun chuu a rai khrap', english: 'What is your name? (male asking)' },
    tip: 'For children you can say หนูชื่ออะไร (nuu chuu a rai) — หนู is how you address or refer to a young child, more endearing.',
  },
  {
    thai: 'ฉันมาจาก...', roman: 'chan maa jaak...', english: 'I come from... (female)', emoji: '🌍',
    note: 'มา = to come, จาก = from. ฉันมาจากอังกฤษ = I come from England. Very common in introductions.',
    example: { thai: 'ฉันมาจากอังกฤษ', roman: 'chan maa jaak Ang-grid', english: 'I come from England' },
    tip: 'Countries: อังกฤษ (England), อเมริกา (America), ออสเตรเลีย (Australia), แคนาดา (Canada), แอฟริกา (Africa), ไอร์แลนด์ (Ireland).',
  },
  {
    thai: 'ฉันเป็นครู', roman: 'chan pen khruu', english: 'I am a teacher', emoji: '👨‍🏫',
    note: 'เป็น = to be (for roles/occupations). ครู = teacher. ฉันเป็น + occupation is how you state your job.',
    example: { thai: 'ผมเป็นครูภาษาอังกฤษ', roman: 'phom pen khruu phasaa ang-grid', english: 'I am an English teacher' },
    tip: 'ครู is the general word for teacher. อาจารย์ (aa jaan) is more formal — used for university lecturers. In schools ครู is the standard and respectful title.',
  },
  {
    thai: 'ฉันอยู่ที่...', roman: 'chan yuu thii...', english: 'I live in/at...', emoji: '🏠',
    note: 'อยู่ = to live/stay/be somewhere, ที่ = at/in. ฉันอยู่ที่กรุงเทพ = I live in Bangkok.',
    example: { thai: 'ผมอยู่ที่อยุธยา', roman: 'phom yuu thii A-yut-tha-yaa', english: 'I live in Ayutthaya' },
    tip: 'อยู่ is incredibly versatile — อยู่ที่ไหน? (where do you live?), อยู่ดีไหม? (are you doing well?), เขาอยู่ไหน? (where is he?).',
  },
  {
    thai: 'ยินดีที่ได้รู้จัก', roman: 'yin dii thii dai ruu jak', english: 'Nice to meet you', emoji: '🤝',
    note: 'A formal and warm way to end an introduction. ยินดี = pleased/glad, รู้จัก = to know/be acquainted with.',
    example: { thai: 'ยินดีที่ได้รู้จักครับ', roman: 'yin dii thii dai ruu jak khrap', english: 'Nice to meet you (male)' },
    tip: 'After meeting someone, Thais often exchange Line IDs rather than business cards. แอด Line ด้วยนะ (add me on Line) is extremely common!',
  },
  {
    thai: 'แนะนำตัว', roman: 'nae nam tua', english: 'To introduce oneself', emoji: '🗣️',
    note: 'แนะนำ = to recommend/introduce, ตัว = self/body. ขอแนะนำตัวหน่อยนะครับ = allow me to introduce myself (very polite opening).',
    example: { thai: 'ขอแนะนำตัวหน่อยนะครับ', roman: 'kho nae nam tua noi na khrap', english: 'Allow me to introduce myself' },
    tip: 'This formal opener immediately impresses Thai people — it shows you\'ve put effort into learning the language and culture.',
  },
]

const FULL_INTRO = {
  male: [
    { thai: 'สวัสดีครับ', roman: 'sawasdee khrap', english: 'Hello' },
    { thai: 'ผมชื่อเดวิด', roman: 'phom chuu David', english: 'My name is David' },
    { thai: 'ผมมาจากอังกฤษ', roman: 'phom maa jaak Ang-grid', english: 'I come from England' },
    { thai: 'ผมเป็นครูภาษาอังกฤษ', roman: 'phom pen khruu phasaa ang-grid', english: 'I am an English teacher' },
    { thai: 'ผมอยู่ที่อยุธยา', roman: 'phom yuu thii A-yut-tha-yaa', english: 'I live in Ayutthaya' },
    { thai: 'ผมอายุสามสิบห้าปี', roman: 'phom aa yu saam sip haa pii', english: 'I am 35 years old' },
    { thai: 'ยินดีที่ได้รู้จักครับ', roman: 'yin dii thii dai ruu jak khrap', english: 'Nice to meet you' },
  ],
  female: [
    { thai: 'สวัสดีค่ะ', roman: 'sawasdee kha', english: 'Hello' },
    { thai: 'ฉันชื่อซาร่า', roman: 'chan chuu Saaraa', english: 'My name is Sara' },
    { thai: 'ฉันมาจากออสเตรเลีย', roman: 'chan maa jaak Aaw-sa-treh-lia', english: 'I come from Australia' },
    { thai: 'ฉันเป็นครูภาษาอังกฤษ', roman: 'chan pen khruu phasaa ang-grid', english: 'I am an English teacher' },
    { thai: 'ฉันอยู่ที่เชียงใหม่', roman: 'chan yuu thii Chiang Mai', english: 'I live in Chiang Mai' },
    { thai: 'ฉันอายุยี่สิบแปดปี', roman: 'chan aa yu yii sip bpaet pii', english: 'I am 28 years old' },
    { thai: 'ยินดีที่ได้รู้จักค่ะ', roman: 'yin dii thii dai ruu jak kha', english: 'Nice to meet you' },
  ],
}

const QUIZ_Q = [
  { q: 'How does a male say "My name is..." in Thai?', correct: 'Phom chuu...', options: ['Chan chuu...', 'Phom chuu...', 'Khun chuu...', 'Rao chuu...'] },
  { q: 'How do you ask "What is your name?" in Thai?', correct: 'Khun chuu a rai', options: ['Chan chuu a rai', 'Khun maa jaak nai', 'Khun chuu a rai', 'Khun pen a rai'] },
  { q: 'How do you say "I come from England"? (female)', correct: 'Chan maa jaak Ang-grid', options: ['Chan yuu thii Ang-grid', 'Chan maa jaak Ang-grid', 'Phom maa jaak Ang-grid', 'Chan pen Ang-grid'] },
  { q: 'What does "pen" mean in "chan pen khruu"?', correct: 'To be (for occupations)', options: ['To have', 'To be (for occupations)', 'To come', 'To live'] },
  { q: 'How do you say "I live in Bangkok"?', correct: 'Chan yuu thii Krung Thep', options: ['Chan maa jaak Krung Thep', 'Chan pen Krung Thep', 'Chan yuu thii Krung Thep', 'Chan chuu Krung Thep'] },
  { q: 'What does "yin dii thii dai ruu jak" mean?', correct: 'Nice to meet you', options: ['How are you?', 'Nice to meet you', 'Where are you from?', 'What is your name?'] },
  { q: 'ผม (phom) means "I" for male speakers. It also means...?', correct: 'Hair', options: ['Hand', 'Hair', 'Heart', 'Head'] },
  { q: 'To introduce yourself formally in Thai, you say...?', correct: 'Kho nae nam tua noi na khrap/kha', options: ['Sawasdee khrap/kha', 'Kho nae nam tua noi na khrap/kha', 'Chan chuu a rai', 'Yin dii thii dai ruu jak'] },
]

const SCRIPT_Q = INTRO_PHRASES.map(p => ({
  thai: p.thai, roman: p.roman, english: p.english,
  options: [p.english, ...INTRO_PHRASES.filter(x => x.english !== p.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
})).sort(() => Math.random() - 0.5)

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

function speakSequence(lines: { thai: string }[], delay = 1800) {
  if (typeof window === 'undefined') return
  lines.forEach((line, i) => setTimeout(() => speak(line.thai), i * delay))
}

export default function Unit7Lesson3() {
  const [phase, setPhase] = useState<'learn' | 'practice' | 'quiz' | 'script' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [scriptSelected, setScriptSelected] = useState<string | null>(null)
  const [scriptScore, setScriptScore] = useState(0)
  const [scriptAnswers, setScriptAnswers] = useState<boolean[]>([])
  const [playing, setPlaying] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const card = INTRO_PHRASES[cardIndex]
  const pct = Math.round((correct / QUIZ_Q.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === QUIZ_Q[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
  }

  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ_Q.length) { setPhase('script'); setScriptIndex(0); setScriptSelected(null); setScriptScore(0); setScriptAnswers([]); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  const playIntro = () => {
    setPlaying(true)
    const lines = FULL_INTRO[gender]
    speakSequence(lines, 2000)
    setTimeout(() => setPlaying(false), lines.length * 2000 + 500)
  }

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice requires Chrome'); return }
    setTranscript('')
    const r = new SR(); r.lang = 'th-TH'; r.continuous = false; r.interimResults = false
    r.onstart = () => setListening(true)
    r.onresult = (e: any) => { setTranscript(e.results[0][0].transcript); setListening(false) }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    r.start()
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #064e3b, #10b981)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 7 · Lesson 3 — Introductions</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ id: 'learn', label: '📖 Learn' }, { id: 'practice', label: '🎤 Practice' }, { id: 'quiz', label: '🧠 Quiz' }, { id: 'script', label: '✍️ Script' }].map(tab => (
            <button key={tab.id} onClick={() => {
              if (tab.id === 'quiz') { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }
              if (tab.id === 'script') { setScriptIndex(0); setScriptSelected(null); setScriptScore(0); setScriptAnswers([]) }
              setPhase(tab.id as any)
            }} style={{ background: phase === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEARN PHASE */}
      {phase === 'learn' && (
        <div style={{ background: 'rgba(16,185,129,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(16,185,129,0.1)' }}>
          <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {INTRO_PHRASES.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#10b981', borderRadius: '10px', width: `${((cardIndex + 1) / INTRO_PHRASES.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Introductions</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #10b981' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🗣️ The A1 Grand Finale — Introducing Yourself</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                This is where everything comes together. By the end of this lesson you'll be able to give a complete introduction in Thai — your name, where you're from, what you do, where you live, and your age. Everything you've learned in A1 feeds into this moment.
              </p>
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 18px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>✅ What you'll be able to say</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.8' }}>
                  👋 Hello · 📛 My name is · 🌍 I come from · 👨‍🏫 I am a teacher · 🏠 I live in · 🎂 I am X years old · 🤝 Nice to meet you
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #064e3b, #10b981)', padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{card.emoji}</div>
              <div style={{ fontSize: '52px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '19px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '20px' }}>{card.english}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>🐢 Slow</button>
              </div>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '2px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#10b981' }}>{card.example.thai}</div>
                  <div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)} style={{ marginLeft: 'auto', background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🔊</button>
                </div>
              </div>
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '14px 16px', border: '1px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>All Phrases</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {INTRO_PHRASES.map((p, i) => (
                <button key={i} onClick={() => { setCardIndex(i); speak(p.thai) }}
                  style={{ background: i === cardIndex ? '#10b981' : '#f9fafb', color: i === cardIndex ? 'white' : '#374151', border: `2px solid ${i === cardIndex ? '#10b981' : '#e5e7eb'}`, borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontSize: '20px', transition: 'all 0.15s' }}>
                  {p.emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < INTRO_PHRASES.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(INTRO_PHRASES[cardIndex + 1].thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #064e3b, #10b981)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next →
              </button>
            ) : (
              <button onClick={() => setPhase('practice')}
                style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                🎤 Practice Your Introduction →
              </button>
            )}
          </div>
        </div>
      )}

      {/* PRACTICE PHASE */}
      {phase === 'practice' && (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #10b981' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>🎤 Full Introduction Practice</h2>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>Listen to a complete Thai introduction, then try saying it yourself line by line using the microphone.</p>
          </div>

          {/* Gender toggle */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#6b7280', fontWeight: '700', fontSize: '14px' }}>Speaker:</span>
            <button onClick={() => setGender('male')} style={{ background: gender === 'male' ? '#10b981' : '#f9fafb', color: gender === 'male' ? 'white' : '#374151', border: `2px solid ${gender === 'male' ? '#10b981' : '#e5e7eb'}`, padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>👨 Male</button>
            <button onClick={() => setGender('female')} style={{ background: gender === 'female' ? '#10b981' : '#f9fafb', color: gender === 'female' ? 'white' : '#374151', border: `2px solid ${gender === 'female' ? '#10b981' : '#e5e7eb'}`, padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>👩 Female</button>
          </div>

          {/* Full intro display */}
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #064e3b, #10b981)', padding: '16px 24px' }}>
              <div style={{ color: 'white', fontWeight: '900', fontSize: '16px' }}>Complete Introduction — {gender === 'male' ? '👨 Male version' : '👩 Female version'}</div>
            </div>
            <div style={{ padding: '8px 0' }}>
              {FULL_INTRO[gender].map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', borderBottom: i < FULL_INTRO[gender].length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>{line.thai}</div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>{line.roman} · {line.english}</div>
                  </div>
                  <button onClick={() => speak(line.thai)} style={{ background: '#f0fdf4', color: '#10b981', border: '1px solid #86efac', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>🔊</button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={playIntro} disabled={playing}
            style={{ width: '100%', background: playing ? '#6b7280' : 'linear-gradient(135deg, #064e3b, #10b981)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: playing ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
            {playing ? '⏸ Playing...' : '▶ Play Full Introduction'}
          </button>

          {/* Microphone */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ color: '#374151', fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}>🎤 Try saying a line yourself</div>
            <button onClick={startListening} disabled={listening}
              style={{ background: listening ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '30px', cursor: listening ? 'not-allowed' : 'pointer', fontWeight: '900', fontSize: '16px', boxShadow: listening ? '0 0 0 6px rgba(239,68,68,0.2)' : 'none', transition: 'all 0.2s' }}>
              {listening ? '⏺ Listening...' : '🎤 Record'}
            </button>
            {transcript && (
              <div style={{ marginTop: '14px', background: '#f0fdf4', borderRadius: '12px', padding: '14px', border: '2px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>You said:</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#064e3b' }}>{transcript}</div>
              </div>
            )}
          </div>

          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
            style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
            🧠 Take the Quiz →
          </button>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#10b981', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '19px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{QUIZ_Q[quizIndex].q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_Q[quizIndex].options.map(opt => {
                const isCorrect = opt === QUIZ_Q[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = '#f0fdf4'; border = '#10b981'; textColor = '#064e3b' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#10b981', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f0fdf4' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#86efac' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#064e3b', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #064e3b, #10b981)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {/* SCRIPT PHASE */}
      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #10b981' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition — Introductions</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai phrase and choose the correct English meaning. Final challenge before completing A1!</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#10b981', borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What does this mean?</div>
              <div style={{ fontSize: '44px', fontWeight: '900', color: '#10b981', lineHeight: 1.2, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#f0fdf4', color: '#10b981', border: '2px solid #86efac', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isCorrect = opt === SCRIPT_Q[scriptIndex].english
                const isSelected = scriptSelected === opt
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#f0fdf4'; border = '#10b981'; textColor = '#064e3b' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => {
                    if (scriptSelected) return
                    setScriptSelected(opt)
                    if (isCorrect) setScriptScore(prev => prev + 1)
                    setScriptAnswers(prev => [...prev, isCorrect])
                  }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {scriptSelected && isCorrect && <span style={{ color: '#10b981', fontSize: '20px' }}>✓</span>}
                    {scriptSelected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#f0fdf4' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? '#86efac' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: '#064e3b', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english}</span>
              }
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #064e3b, #10b981)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {scriptIndex + 1 >= SCRIPT_Q.length ? '🎓 Complete A1! →' : 'Next →'}
            </button>
          )}
        </div>
      )}

      {/* COMPLETE — A1 GRADUATION */}
      {phase === 'complete' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '3px solid #10b981' }}>
            <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎓</div>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>A1 Complete!</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: '#10b981', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} on the final quiz</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '16px', padding: '24px', marginBottom: '28px', border: '2px solid #86efac', textAlign: 'left' }}>
              <div style={{ color: '#064e3b', fontWeight: '900', fontSize: '18px', marginBottom: '12px' }}>🇹🇭 You completed A1 Thai!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.9' }}>
                You now know:<br />
                ✓ <strong>44 consonants + 28 vowels</strong> — the full Thai alphabet<br />
                ✓ <strong>5 tones + all tone rules</strong> — mid, high and low class<br />
                ✓ <strong>Greetings & polite particles</strong> — ครับ ค่ะ นะ<br />
                ✓ <strong>Numbers 1–100</strong> + money & prices<br />
                ✓ <strong>Days, months & time</strong><br />
                ✓ <strong>Family & describing people</strong><br />
                ✓ <strong>A complete self-introduction</strong> in Thai<br /><br />
                <strong>Go introduce yourself to a Thai person today. You're ready.</strong>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1" style={{ display: 'block', background: 'linear-gradient(135deg, #064e3b, #10b981)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                ← Review A1 Overview
              </Link>
              <Link href="/learn-thai" style={{ display: 'block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                🚀 Continue to A2 →
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
