'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLearnThaiGate } from '@/hooks/useLearnThaiGate'

const VOCAB = [
  {
    thai: 'ฉันชื่อ...', roman: 'chan chuu...', english: 'My name is... (female)',
    example: { thai: 'ฉันชื่อซาร่าค่ะ', roman: 'chan chuu Saaraa kha', english: 'My name is Sara.' },
    note: 'At A2 we build on the A1 intro. ฉัน is the polite female "I". Males use ผม (phom). Always add ค่ะ (female) or ครับ (male) to sound natural and polite.',
    tip: 'Thais often introduce themselves by nickname — ชื่อเล่น (chuu len). Ask: คุณมีชื่อเล่นไหม? (Do you have a nickname?)',
  },
  {
    thai: 'ฉันอายุ...ปี', roman: 'chan aa yu...pii', english: 'I am ... years old',
    example: { thai: 'ฉันอายุยี่สิบแปดปีค่ะ', roman: 'chan aa yu yii sip bpaet pii kha', english: 'I am 28 years old.' },
    note: 'อายุ (aa yu) = age. ปี (pii) = year. The number goes between them. Unlike English you never say "I am 28" without ปี.',
    tip: 'Asking someone\'s age in Thailand is completely normal — not rude at all. คุณอายุเท่าไรครับ/ค่ะ (How old are you?) is a standard question.',
  },
  {
    thai: 'ฉันเป็น...', roman: 'chan pen...', english: 'I am a... (occupation)',
    example: { thai: 'ฉันเป็นครูภาษาอังกฤษค่ะ', roman: 'chan pen khruu phasaa ang-grid kha', english: 'I am an English teacher.' },
    note: 'เป็น (pen) = to be, used for roles and occupations. Common jobs: ครู (teacher), หมอ (doctor), พยาบาล (nurse), นักธุรกิจ (businessperson), วิศวกร (engineer).',
    tip: 'ภาษาอังกฤษ literally means "English language". You\'ll hear it all the time as a teacher — ครูภาษาอังกฤษ is what everyone will call you.',
  },
  {
    thai: 'ฉันมาจาก...', roman: 'chan maa jaak...', english: 'I come from...',
    example: { thai: 'ฉันมาจากอังกฤษค่ะ', roman: 'chan maa jaak Ang-grid kha', english: 'I come from England.' },
    note: 'มา (maa) = to come, จาก (jaak) = from. Countries: อังกฤษ (England), อเมริกา (America), ออสเตรเลีย (Australia), แคนาดา (Canada), แอฟริกาใต้ (South Africa), ไอร์แลนด์ (Ireland), นิวซีแลนด์ (New Zealand), สกอตแลนด์ (Scotland).',
    tip: 'Saying where you\'re from immediately creates connection. Follow up with ฉันอยู่ที่ไทยมา...ปีแล้ว (I\'ve been in Thailand for ... years) — Thais love hearing this.',
  },
  {
    thai: 'ฉันอยู่ที่...', roman: 'chan yuu thii...', english: 'I live in/at...',
    example: { thai: 'ฉันอยู่ที่อยุธยามาสองปีแล้วค่ะ', roman: 'chan yuu thii A-yut-tha-yaa maa soong pii laeo kha', english: 'I\'ve been living in Ayutthaya for two years.' },
    note: 'อยู่ที่ (yuu thii) = live at/in. Adding มา...ปีแล้ว (maa...pii laeo) = for...years. This immediately shows you\'re committed to living in Thailand — not just a tourist.',
    tip: 'Cities: กรุงเทพ (Bangkok), เชียงใหม่ (Chiang Mai), อยุธยา (Ayutthaya), ภูเก็ต (Phuket), ขอนแก่น (Khon Kaen), สมุย (Samui).',
  },
  {
    thai: 'ฉันชอบ...', roman: 'chan choop...', english: 'I like...',
    example: { thai: 'ฉันชอบอาหารไทยมากค่ะ', roman: 'chan choop aa haan thai maak kha', english: 'I really like Thai food.' },
    note: 'ชอบ (choop) = to like. Add มาก (maak) = very much, or มากที่สุด (maak thii sut) = the most. ไม่ชอบ (mai choop) = don\'t like.',
    tip: 'Saying you love Thai food (ฉันชอบอาหารไทยมากค่ะ) will instantly warm up any Thai person you meet. Food is a major bonding topic in Thai culture.',
  },
  {
    thai: 'ฉันพูดภาษาไทยได้นิดหน่อย', roman: 'chan phuut phasaa thai dai nit noi', english: 'I can speak a little Thai',
    example: { thai: 'ฉันพูดภาษาไทยได้นิดหน่อยค่ะ', roman: 'chan phuut phasaa thai dai nit noi kha', english: 'I can speak a little Thai.' },
    note: 'พูด (phuut) = to speak. ได้ (dai) after a verb means "can/able to". นิดหน่อย (nit noi) = a little. This phrase is gold — use it early and Thais will be impressed and encouraging.',
    tip: 'After saying this, Thais will often try to teach you more words on the spot. This is a fantastic way to make friends and practice naturally.',
  },
  {
    thai: 'ยินดีที่ได้รู้จัก', roman: 'yin dii thii dai ruu jak', english: 'Nice to meet you',
    example: { thai: 'ยินดีที่ได้รู้จักค่ะ ชื่อซาร่านะคะ', roman: 'yin dii thii dai ruu jak kha chuu Saaraa na kha', english: 'Nice to meet you. My name is Sara.' },
    note: 'ยินดี (yin dii) = pleased/glad. รู้จัก (ruu jak) = to know/be acquainted with. This formal phrase shows real effort and earns respect from Thais.',
    tip: 'After ยินดีที่ได้รู้จัก, Thais often say แอดไลน์ด้วยนะ (add me on LINE) — exchanging LINE IDs is the Thai equivalent of swapping phone numbers.',
  },
  {
    thai: 'ฉันสอนที่...', roman: 'chan soon thii...', english: 'I teach at...',
    example: { thai: 'ฉันสอนที่โรงเรียนประถมค่ะ', roman: 'chan soon thii roong rian pra thom kha', english: 'I teach at a primary school.' },
    note: 'สอน (soon) = to teach. โรงเรียน (roong rian) = school. ประถม (pra thom) = primary, มัธยม (mat tha yom) = secondary, มหาวิทยาลัย (ma ha wit tha ya lai) = university.',
    tip: 'Being a teacher (ครู/khruu) is a highly respected profession in Thailand. Parents will often wai you (press palms together) even in casual settings.',
  },
  {
    thai: 'ฉันอยู่ที่นี่มานานแค่ไหนแล้ว', roman: 'chan yuu thii nii maa naan khae nai laeo', english: 'How long have you been here?',
    example: { thai: 'คุณอยู่ที่นี่มานานแค่ไหนแล้วครับ', roman: 'khun yuu thii nii maa naan khae nai laeo khrap', english: 'How long have you been here?' },
    note: 'A key A2 question pattern. มา (maa) = coming/been here, นาน (naan) = long time, แค่ไหน (khae nai) = how much/how long, แล้ว (laeo) = already/now.',
    tip: 'Answer with: ฉันอยู่มา...ปีแล้วค่ะ (I\'ve been here for...years). Thais are always curious how long foreigners have been in Thailand.',
  },
  {
    thai: 'ฉันรักประเทศไทย', roman: 'chan rak pra thet thai', english: 'I love Thailand',
    example: { thai: 'ฉันรักประเทศไทยมากค่ะ ที่นี่สวยมาก', roman: 'chan rak pra thet thai maak kha thii nii suai maak', english: 'I love Thailand very much. It\'s beautiful here.' },
    note: 'รัก (rak) = to love. ประเทศไทย (pra thet thai) = Thailand (formal). Casually Thais say เมืองไทย (mueang thai). This phrase will ALWAYS get a huge smile.',
    tip: 'Follow this up with something specific you love — อาหาร (food), ผู้คน (people), วัฒนธรรม (culture), อากาศ (weather). It shows genuine appreciation.',
  },
  {
    thai: 'คุณพูดภาษาอังกฤษได้ไหม', roman: 'khun phuut phasaa ang-grid dai mai', english: 'Can you speak English?',
    example: { thai: 'ขอโทษนะครับ คุณพูดภาษาอังกฤษได้ไหมครับ', roman: 'kho thoot na khrap khun phuut phasaa ang-grid dai mai khrap', english: 'Excuse me, can you speak English?' },
    note: 'ได้ไหม (dai mai) = can you? / is it possible? This is the standard yes/no question ending for ability. ได้ (dai) = yes/can, ไม่ได้ (mai dai) = no/can\'t.',
    tip: 'Even as you improve your Thai, knowing this phrase helps in emergencies. But try Thai first — the effort is always appreciated!',
  },
  {
    thai: 'ฉันกำลังเรียนภาษาไทย', roman: 'chan gam lang rian phasaa thai', english: 'I am learning Thai',
    example: { thai: 'ฉันกำลังเรียนภาษาไทยอยู่ค่ะ', roman: 'chan gam lang rian phasaa thai yuu kha', english: 'I am currently learning Thai.' },
    note: 'กำลัง (gam lang) = currently/in the process of (present continuous marker). เรียน (rian) = to study/learn. อยู่ (yuu) at the end reinforces the ongoing action.',
    tip: 'This is your magic phrase. Saying ฉันกำลังเรียนภาษาไทยอยู่ค่ะ opens doors — Thais will become your teacher, your friend, and your biggest supporter.',
  },
  {
    thai: 'ขอโทษ ช่วยพูดช้าๆ ได้ไหม', roman: 'kho thoot chuai phuut chaa chaa dai mai', english: 'Sorry, can you speak slowly?',
    example: { thai: 'ขอโทษนะคะ ช่วยพูดช้าๆ ได้ไหมคะ', roman: 'kho thoot na kha chuai phuut chaa chaa dai mai kha', english: 'Sorry, can you please speak slowly?' },
    note: 'ช่วย (chuai) = please/help. ช้าๆ (chaa chaa) = slowly. This is ESSENTIAL for real conversations. Never be embarrassed to use it — Thais will always slow down for you.',
    tip: 'The ๆ symbol in Thai means to repeat the word — ช้าๆ literally means "slow slow" = very slowly. You\'ll see this pattern everywhere in Thai.',
  },
  {
    thai: 'ฉันไม่เข้าใจ', roman: 'chan mai khao jai', english: 'I don\'t understand',
    example: { thai: 'ขอโทษค่ะ ฉันไม่เข้าใจ ช่วยอธิบายอีกครั้งได้ไหมคะ', roman: 'kho thoot kha chan mai khao jai chuai a thi bai iik khrang dai mai kha', english: 'Sorry, I don\'t understand. Can you explain again?' },
    note: 'เข้าใจ (khao jai) = to understand (literally "enter heart"). ไม่เข้าใจ = don\'t understand. เข้าใจแล้ว (khao jai laeo) = I understand now.',
    tip: 'เข้าใจไหม (khao jai mai?) = Do you understand? Your Thai students will ask you this! เข้าใจแล้ว (khao jai laeo) = Got it / I understand now.',
  },
]

const CONVERSATION = [
  { speaker: 'A', thai: 'สวัสดีครับ ผมชื่อมาร์คครับ', roman: 'sawasdee khrap phom chuu Mark khrap', english: 'Hello, my name is Mark.' },
  { speaker: 'B', thai: 'สวัสดีค่ะ ดีใจที่ได้รู้จักค่ะ ฉันชื่อนิดค่ะ', roman: 'sawasdee kha dii jai thii dai ruu jak kha chan chuu Nit kha', english: 'Hello, pleased to meet you. My name is Nit.' },
  { speaker: 'A', thai: 'คุณมาจากไหนครับ', roman: 'khun maa jaak nai khrap', english: 'Where are you from?' },
  { speaker: 'B', thai: 'ฉันเป็นคนไทยค่ะ มาจากเชียงใหม่ค่ะ คุณล่ะครับ', roman: 'chan pen khon thai kha maa jaak Chiang Mai kha khun la khrap', english: 'I\'m Thai. I\'m from Chiang Mai. And you?' },
  { speaker: 'A', thai: 'ผมมาจากอังกฤษครับ อยู่ที่ไทยมาสองปีแล้วครับ', roman: 'phom maa jaak Ang-grid khrap yuu thii thai maa soong pii laeo khrap', english: 'I\'m from England. I\'ve been in Thailand for two years.' },
  { speaker: 'B', thai: 'โอ้ สองปีแล้วเหรอคะ พูดภาษาไทยได้บ้างไหมคะ', roman: 'oh soong pii laeo roe kha phuut phasaa thai dai baang mai kha', english: 'Oh, two years already? Can you speak some Thai?' },
  { speaker: 'A', thai: 'ได้นิดหน่อยครับ กำลังเรียนอยู่ครับ', roman: 'dai nit noi khrap gam lang rian yuu khrap', english: 'A little. I\'m still learning.' },
  { speaker: 'B', thai: 'เก่งมากเลยค่ะ คุณทำงานอะไรที่นี่คะ', roman: 'geng maak loei kha khun tham ngaan a rai thii nii kha', english: 'Wow, very impressive! What do you do here?' },
  { speaker: 'A', thai: 'ผมเป็นครูภาษาอังกฤษครับ สอนที่โรงเรียนมัธยมครับ', roman: 'phom pen khruu phasaa ang-grid khrap soon thii roong rian mat tha yom khrap', english: 'I\'m an English teacher. I teach at a secondary school.' },
  { speaker: 'B', thai: 'ดีมากเลยค่ะ ยินดีที่ได้รู้จักค่ะ', roman: 'dii maak loei kha yin dii thii dai ruu jak kha', english: 'That\'s wonderful! Nice to meet you.' },
]

const QUIZ = [
  { q: 'How does a female say "My name is Sara" in Thai?', correct: 'Chan chuu Sara kha', options: ['Phom chuu Sara khrap', 'Chan chuu Sara kha', 'Khun chuu Sara kha', 'Chan pen Sara kha'] },
  { q: 'What does กำลัง (gam lang) indicate in a sentence?', correct: 'A continuous/ongoing action', options: ['Past tense', 'A continuous/ongoing action', 'Future tense', 'A question'] },
  { q: 'How do you say "I\'ve been in Thailand for 3 years"?', correct: 'Chan yuu thii thai maa saam pii laeo', options: ['Chan yuu thii thai saam pii', 'Chan maa thai saam pii', 'Chan yuu thii thai maa saam pii laeo', 'Chan pen thai saam pii laeo'] },
  { q: 'What does เข้าใจ (khao jai) literally mean?', correct: 'Enter heart', options: ['Open mind', 'Enter heart', 'Clear head', 'Know well'] },
  { q: 'How do you ask someone to speak slowly?', correct: 'Chuai phuut chaa chaa dai mai', options: ['Chuai phuut lek lek dai mai', 'Chuai phuut chaa chaa dai mai', 'Chuai phuut nit noi dai mai', 'Chuai phuut yai yai dai mai'] },
  { q: 'What does ได้ไหม (dai mai) mean at the end of a sentence?', correct: 'Can you? / Is it possible?', options: ['Do you want to?', 'Can you? / Is it possible?', 'Did you?', 'Will you?'] },
  { q: 'How do you say "I love Thailand" in Thai?', correct: 'Chan rak pra thet thai', options: ['Chan choop pra thet thai', 'Chan rak pra thet thai', 'Chan yuu pra thet thai', 'Chan dii pra thet thai'] },
  { q: 'The ๆ symbol in Thai means...?', correct: 'Repeat the previous word', options: ['End of sentence', 'Repeat the previous word', 'Question marker', 'Emphasis marker'] },
  { q: 'How do you say "I teach at a primary school"?', correct: 'Chan soon thii roong rian pra thom', options: ['Chan rian thii roong rian pra thom', 'Chan soon thii roong rian mat tha yom', 'Chan soon thii roong rian pra thom', 'Chan pen khruu roong rian pra thom'] },
  { q: 'What\'s the polite female sentence ender that makes Thai sound natural?', correct: 'ค่ะ (kha)', options: ['ครับ (khrap)', 'ค่ะ (kha)', 'นะ (na)', 'เลย (loei)'] },
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

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

function speakLine(text: string, index: number, setActive: (n: number) => void) {
  setActive(index)
  speak(text)
  setTimeout(() => setActive(-1), 3000)
}

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

  const card = VOCAB[cardIndex]
  const pct = Math.round((correct / QUIZ.length) * 100)

  const COLOR = '#0ea5e9'
  const DARK = '#0369a1'

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === QUIZ[quizIndex].correct
    if (isCorrect) setCorrect(p => p + 1)
    setAnswers(p => [...p, isCorrect])
  }

  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ.length) { setPhase('script'); return }
    setQuizIndex(p => p + 1); setSelected(null)
  }

  const playConversation = () => {
    CONVERSATION.forEach((line, i) => {
      setTimeout(() => { speak(line.thai); setActiveLine(i) }, i * 2500)
    })
    setTimeout(() => setActiveLine(-1), CONVERSATION.length * 2500)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A2 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>A2 · Unit 1 · Lesson 1 — Introducing Yourself</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'learn', label: '📖 Learn' },
            { id: 'conversation', label: '🗣️ Conversation' },
            { id: 'quiz', label: '🧠 Quiz' },
            { id: 'script', label: '✍️ Script' },
            { id: 'listening', label: '🎧 Listening' },
          ].map(tab => (
            <button key={tab.id} onClick={() => {
              if (tab.id === 'quiz') { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }
              if (tab.id === 'script') { setScriptIndex(0); setScriptSelected(null); setScriptScore(0) }
              if (tab.id === 'listening') { setListenIndex(0); setListenSelected(null); setListenScore(0) }
              setPhase(tab.id as any)
            }} style={{ background: phase === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEARN */}
      {phase === 'learn' && (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>🗣️ A2 Unit 1 — Introducing Yourself in Detail</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>
                You can already give a basic introduction in Thai from A1. Now we go deeper — more natural sentences, the present continuous tense, asking about others, and the cultural context that makes your Thai feel real rather than textbook.
              </p>
              <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '14px 18px', border: `1px solid ${COLOR}40` }}>
                <div style={{ color: DARK, fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>🎯 This lesson — 15 phrases & patterns</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                  Occupations · How long you've been here · กำลัง present continuous · ได้ไหม for requests · ช้าๆ survival Thai · Cultural tips for every phrase
                </div>
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
              <div style={{ fontSize: '52px', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '10px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '19px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '20px' }}>{card.english}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>🐢 Slow</button>
              </div>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${COLOR}40` }}>
                <div style={{ color: COLOR, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: COLOR, marginBottom: '4px' }}>{card.example.thai}</div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)} style={{ marginLeft: 'auto', background: COLOR, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🔊</button>
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
            {cardIndex + 1 < VOCAB.length ? (
              <button onClick={() => setCardIndex(p => p + 1)} style={{ flex: 1, background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next →
              </button>
            ) : (
              <button onClick={() => setPhase('conversation')} style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                🗣️ Conversation Practice →
              </button>
            )}
          </div>
        </div>
      )}

      {/* CONVERSATION */}
      {phase === 'conversation' && (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>🗣️ Real Conversation — Meeting Someone New</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>
              Listen to Mark (foreign teacher) and Nit (Thai person) meeting for the first time. Follow the Thai, then try saying each line yourself.
            </p>
            <button onClick={playConversation} style={{ background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '900', fontSize: '15px', cursor: 'pointer' }}>
              ▶ Play Full Conversation
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {CONVERSATION.map((line, i) => (
              <div key={i} onClick={() => speakLine(line.thai, i, setActiveLine)}
                style={{ background: activeLine === i ? (line.speaker === 'A' ? '#f0f9ff' : '#f0fdf4') : 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', border: `2px solid ${activeLine === i ? (line.speaker === 'A' ? COLOR : '#22c55e') : '#e5e7eb'}`, transition: 'all 0.2s', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: line.speaker === 'A' ? COLOR : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>
                  {line.speaker === 'A' ? '🧑' : '👩'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: line.speaker === 'A' ? COLOR : '#15803d', marginBottom: '4px' }}>{line.thai}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '2px' }}>{line.roman}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>{line.english}</div>
                </div>
                <span style={{ color: '#d1d5db', fontSize: '18px', flexShrink: 0 }}>🔊</span>
              </div>
            ))}
          </div>

          <button onClick={() => { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]); setPhase('quiz') }}
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
              {selected === QUIZ[quizIndex].correct
                ? <span style={{ color: DARK, fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {/* SCRIPT */}
      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>✍️ Script Recognition</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai phrase and choose the correct English meaning.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: COLOR, fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: COLOR, borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What does this mean?</div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: COLOR, lineHeight: 1.3, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)} style={{ background: '#f0f9ff', color: COLOR, border: `2px solid ${COLOR}40`, padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>🔊 Hear it</button>
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
                  <button key={opt} onClick={() => {
                    if (scriptSelected) return
                    setScriptSelected(opt)
                    if (isCorrect) setScriptScore(p => p + 1)
                  }} disabled={!!scriptSelected}
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
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: DARK, fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is: <strong>{SCRIPT_Q[scriptIndex].english}</strong></span>
              }
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
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>
              Listen to the conversation again without reading along. Then answer the questions in English.
            </p>
            <button onClick={() => { playConversation(); setListenPlayed(true) }}
              style={{ background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '900', fontSize: '15px', cursor: 'pointer' }}>
              {listenPlayed ? '🔄 Play Again' : '▶ Play Conversation'}
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
                      <button key={opt} onClick={() => {
                        if (listenSelected) return
                        setListenSelected(opt)
                        if (isCorrect) setListenScore(p => p + 1)
                      }} disabled={!!listenSelected}
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
                  {LISTENING_Q[listenIndex].correct === listenSelected
                    ? <span style={{ color: DARK, fontWeight: '700' }}>✅ Correct!</span>
                    : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct answer: <strong>{LISTENING_Q[listenIndex].correct}</strong></span>
                  }
                </div>
              )}
              {listenSelected && (
                <button onClick={() => {
                  if (listenIndex + 1 >= LISTENING_Q.length) { setPhase('complete'); return }
                  setListenIndex(p => p + 1); setListenSelected(null)
                }} style={{ width: '100%', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
                  {listenIndex + 1 >= LISTENING_Q.length ? '🏆 Complete Lesson →' : 'Next →'}
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
            <div style={{ color: '#888', fontSize: '15px', marginBottom: '24px' }}>{correct} / {QUIZ.length} on the quiz · {listenScore} / {LISTENING_Q.length} on listening</div>
            <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: `2px solid ${COLOR}40`, textAlign: 'left' }}>
              <div style={{ color: DARK, fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson 1 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                You can now introduce yourself in detail in Thai — your name, age, job, where you're from, how long you've been here, and what you love about Thailand. Next: talking about your family and relationships.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a2/unit-1/lesson-2" style={{ display: 'block', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next Lesson: Family & Relationships →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
