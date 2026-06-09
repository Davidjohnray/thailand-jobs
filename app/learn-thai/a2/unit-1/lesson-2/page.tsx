'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLearnThaiGate } from '@/hooks/useLearnThaiGate'

const VOCAB = [
  {
    thai: 'ครอบครัว', roman: 'khroob khrua', english: 'Family',
    example: { thai: 'คุณมีครอบครัวที่ไทยไหมครับ', roman: 'khun mii khroob khrua thii thai mai khrap', english: 'Do you have family in Thailand?' },
    note: 'ครอบครัว is the formal word for family unit. You\'ll use this constantly in Thailand as Thais always ask about your family situation early in conversation.',
    tip: 'Thais ask "คุณแต่งงานแล้วหรือยัง?" (Are you married yet?) almost immediately after meeting you. It\'s not intrusive — it\'s genuine interest!',
  },
  {
    thai: 'แต่งงาน', roman: 'taeng ngaan', english: 'To get married / married',
    example: { thai: 'ฉันแต่งงานแล้วค่ะ', roman: 'chan taeng ngaan laeo kha', english: 'I am married.' },
    note: 'แต่งงานแล้ว = already married (แล้ว = already/completed action). ยังไม่แต่งงาน = not yet married. แต่งงานกับ = married to.',
    tip: 'If married to a Thai person, Thais will be especially warm and curious. เมียไทย (Thai wife) or ผัวฝรั่ง (foreign husband) are common casual terms you\'ll hear.',
  },
  {
    thai: 'ลูก', roman: 'luuk', english: 'Child / children',
    example: { thai: 'ฉันมีลูกสองคนค่ะ', roman: 'chan mii luuk soong khon kha', english: 'I have two children.' },
    note: 'ลูก = child (gender neutral). ลูกชาย = son, ลูกสาว = daughter. คน is the counter word for people. มีลูกไหม = Do you have children?',
    tip: 'Children are adored in Thai culture. If you have kids, mention them early — it\'s a huge conversation starter and immediately builds warmth.',
  },
  {
    thai: 'แฟน', roman: 'faen', english: 'Partner / boyfriend / girlfriend',
    example: { thai: 'ฉันมีแฟนเป็นคนไทยค่ะ', roman: 'chan mii faen pen khon thai kha', english: 'My partner is Thai.' },
    note: 'แฟน (from English "fan") is used for all romantic partners — boyfriend, girlfriend, or partner. Very casual and widely used regardless of age.',
    tip: 'คู่ชีวิต (khuu chii wit) is the more formal word for life partner/spouse. You\'ll see this on official forms. แฟน is what everyone actually says.',
  },
  {
    thai: 'พ่อแม่', roman: 'phoo maae', english: 'Parents',
    example: { thai: 'พ่อแม่ของฉันอยู่ที่อังกฤษค่ะ', roman: 'phoo maae khoong chan yuu thii Ang-grid kha', english: 'My parents are in England.' },
    note: 'พ่อ (phoo) = father, แม่ (maae) = mother. Together พ่อแม่ = parents. ของฉัน = my/mine. อยู่ที่ = live in/at.',
    tip: 'Thais have immense respect for parents. Saying you send money home to your parents (ส่งเงินให้พ่อแม่) earns enormous respect in Thai culture.',
  },
  {
    thai: 'พี่น้อง', roman: 'phii noong', english: 'Siblings',
    example: { thai: 'ฉันมีพี่น้องสามคนค่ะ', roman: 'chan mii phii noong saam khon kha', english: 'I have three siblings.' },
    note: 'พี่ = older sibling, น้อง = younger sibling. พี่น้อง together = siblings in general. เป็นลูกคนเดียว = only child.',
    tip: 'If you\'re an only child, Thais will often express sympathy (เหงาไหม? = Aren\'t you lonely?). Family networks are very important in Thai culture.',
  },
  {
    thai: 'อยู่ด้วยกัน', roman: 'yuu duai gan', english: 'To live together',
    example: { thai: 'เราอยู่ด้วยกันที่อยุธยาค่ะ', roman: 'rao yuu duai gan thii A-yut-tha-yaa kha', english: 'We live together in Ayutthaya.' },
    note: 'อยู่ = to live/stay, ด้วยกัน = together. เรา (rao) = we/us. This word is essential for talking about your living situation.',
    tip: 'Cohabiting without marriage is increasingly common in Thailand, especially in cities. Still, older Thais may ask when you plan to make it "official"!',
  },
  {
    thai: 'คิดถึง', roman: 'khit thueng', english: 'To miss someone',
    example: { thai: 'ฉันคิดถึงครอบครัวมากค่ะ', roman: 'chan khit thueng khroob khrua maak kha', english: 'I miss my family a lot.' },
    note: 'คิดถึง literally means "think of/towards". คิดถึงใคร? = Who do you miss? คิดถึงบ้าน = homesick (miss home). This phrase resonates deeply with Thais.',
    tip: 'Saying คิดถึงครอบครัวมาก immediately creates empathy. Thais understand the sacrifice of living far from family and will respect you deeply for it.',
  },
  {
    thai: 'กลับบ้าน', roman: 'glap baan', english: 'To go back home',
    example: { thai: 'ฉันจะกลับบ้านช่วงคริสต์มาสค่ะ', roman: 'chan ja glap baan chuang Krit-mas kha', english: 'I\'ll go home for Christmas.' },
    note: 'กลับ = to return/go back, บ้าน = home/house. จะ (ja) before a verb = future tense (will/going to). ช่วง = around/during (a time period).',
    tip: 'จะ (ja) is your future tense marker in Thai — incredibly useful. ฉันจะ... = I will... Add it before any verb to talk about the future.',
  },
  {
    thai: 'ความสัมพันธ์', roman: 'khwaam sam phan', english: 'Relationship',
    example: { thai: 'เรามีความสัมพันธ์ที่ดีมากค่ะ', roman: 'rao mii khwaam sam phan thii dii maak kha', english: 'We have a really good relationship.' },
    note: 'ความ (khwaam) is a prefix that turns adjectives into nouns — ดี (good) → ความดี (goodness). สัมพันธ์ = relation/connection. Common in formal speech.',
    tip: 'ความ is one of the most useful Thai prefixes. ความรัก = love, ความสุข = happiness, ความฝัน = dream. Learn it once, use it forever.',
  },
  {
    thai: 'เลี้ยงดู', roman: 'liang duu', english: 'To raise / take care of',
    example: { thai: 'พ่อแม่เลี้ยงดูฉันมาอย่างดีค่ะ', roman: 'phoo maae liang duu chan maa yaang dii kha', english: 'My parents raised me well.' },
    note: 'เลี้ยง = to feed/raise, ดู = to look/watch over. Together it means raising children or caring for someone. Shows deep respect for your upbringing.',
    tip: 'If you mention how well your parents raised you, Thais will be moved. Thai culture places enormous value on filial piety — caring for and honouring parents.',
  },
  {
    thai: 'คนเดียว', roman: 'khon diao', english: 'Alone / by oneself',
    example: { thai: 'ฉันมาอยู่ที่ไทยคนเดียวค่ะ', roman: 'chan maa yuu thii thai khon diao kha', english: 'I came to live in Thailand alone.' },
    note: 'คน = person, เดียว = single/alone. ลูกคนเดียว = only child. อยู่คนเดียว = live alone. มาคนเดียว = came alone.',
    tip: 'Thais will often express concern if you live alone: "ไม่เหงาเหรอ?" (Aren\'t you lonely?). It comes from genuine care — community is central to Thai life.',
  },
  {
    thai: 'ห่วงใย', roman: 'huang yai', english: 'To worry about / care for',
    example: { thai: 'แม่ห่วงใยฉันมากค่ะ', roman: 'maae huang yai chan maak kha', english: 'My mother worries about me a lot.' },
    note: 'ห่วง = to worry/be concerned, ใย = care/thread. Together = to care deeply about someone\'s wellbeing. Very common in family conversations.',
    tip: 'A typical Thai parent message: "กินข้าวหรือยัง? แม่ห่วง" (Have you eaten? Mum is worried). Food and worry are deeply connected in Thai family culture!',
  },
  {
    thai: 'รักกัน', roman: 'rak gan', english: 'To love each other',
    example: { thai: 'เรารักกันมากค่ะ', roman: 'rao rak gan maak kha', english: 'We love each other very much.' },
    note: 'รัก = to love, กัน = each other (mutual action). กัน at the end of any verb makes it mutual: ช่วยกัน = help each other, เข้าใจกัน = understand each other.',
    tip: 'กัน is incredibly useful — คุยกัน (talk to each other), ทำงานด้วยกัน (work together), เจอกัน (meet each other). Add it to verbs to make them mutual.',
  },
  {
    thai: 'อบอุ่น', roman: 'op un', english: 'Warm / loving (atmosphere)',
    example: { thai: 'ครอบครัวของฉันอบอุ่นมากค่ะ', roman: 'khroob khrua khoong chan op un maak kha', english: 'My family is very warm and loving.' },
    note: 'อบ = warm air/steam, อุ่น = warm. Together อบอุ่น describes a warm, loving, nurturing atmosphere — especially used for families and homes.',
    tip: 'บ้านอบอุ่น (warm home) is a cherished Thai concept. Saying your family is อบอุ่น will always resonate — it perfectly captures the Thai ideal of family life.',
  },
]

const CONVERSATION = [
  { speaker: 'A', thai: 'คุณมีครอบครัวที่นี่ไหมครับ', roman: 'khun mii khroob khrua thii nii mai khrap', english: 'Do you have family here?' },
  { speaker: 'B', thai: 'ไม่มีค่ะ ครอบครัวของฉันอยู่ที่อังกฤษทั้งหมดเลยค่ะ', roman: 'mai mii kha khroob khrua khoong chan yuu thii Ang-grid thang mot loei kha', english: 'No, my whole family is in England.' },
  { speaker: 'A', thai: 'โอ้ คิดถึงบ้านบ้างไหมครับ', roman: 'oh khit thueng baan baang mai khrap', english: 'Oh, do you miss home?' },
  { speaker: 'B', thai: 'คิดถึงมากเลยค่ะ โดยเฉพาะแม่ค่ะ แต่เราโทรหากันทุกอาทิตย์ค่ะ', roman: 'khit thueng maak loei kha doi cha phaw maae kha tae rao thoo haa gan thuk aa thit kha', english: 'I miss home a lot, especially my mum. But we call each other every week.' },
  { speaker: 'A', thai: 'คุณแต่งงานแล้วหรือยังครับ', roman: 'khun taeng ngaan laeo rue yang khrap', english: 'Are you married?' },
  { speaker: 'B', thai: 'ยังไม่แต่งงานค่ะ แต่มีแฟนเป็นคนไทยค่ะ', roman: 'yang mai taeng ngaan kha tae mii faen pen khon thai kha', english: 'Not yet, but I have a Thai partner.' },
  { speaker: 'A', thai: 'โอ้ ดีจังเลยนะครับ อยู่ด้วยกันไหมครับ', roman: 'oh dii jang loei na khrap yuu duai gan mai khrap', english: 'Oh wonderful! Do you live together?' },
  { speaker: 'B', thai: 'ใช่ค่ะ เราอยู่ด้วยกันที่อยุธยาค่ะ', roman: 'chai kha rao yuu duai gan thii A-yut-tha-yaa kha', english: 'Yes, we live together in Ayutthaya.' },
  { speaker: 'A', thai: 'มีลูกไหมครับ', roman: 'mii luuk mai khrap', english: 'Do you have children?' },
  { speaker: 'B', thai: 'ยังไม่มีค่ะ แต่อนาคตอยากมีค่ะ', roman: 'yang mai mii kha tae a na khot yaak mii kha', english: 'Not yet, but I\'d like to have some in the future.' },
]

const QUIZ = [
  { q: 'How do you say "I am married" in Thai?', correct: 'Chan taeng ngaan laeo', options: ['Chan mii faen laeo', 'Chan taeng ngaan laeo', 'Chan yuu duai gan laeo', 'Chan rak gan laeo'] },
  { q: 'What does จะ (ja) indicate before a verb?', correct: 'Future tense (will/going to)', options: ['Past tense', 'Future tense (will/going to)', 'Present continuous', 'A question'] },
  { q: 'How do you say "I have two children"?', correct: 'Chan mii luuk soong khon', options: ['Chan mii luuk soong', 'Chan mii luuk soong khon', 'Chan mii dek soong khon', 'Chan pen maa soong khon'] },
  { q: 'What does ความ (khwaam) do to a word?', correct: 'Turns an adjective into a noun', options: ['Makes it negative', 'Turns an adjective into a noun', 'Adds future tense', 'Makes it a question'] },
  { q: 'How do you say "I miss my family" in Thai?', correct: 'Chan khit thueng khroob khrua', options: ['Chan rak khroob khrua', 'Chan khit thueng khroob khrua', 'Chan huang yai khroob khrua', 'Chan yuu gap khroob khrua'] },
  { q: 'What does กัน (gan) add to a verb?', correct: 'Makes the action mutual (each other)', options: ['Makes it negative', 'Makes the action mutual (each other)', 'Adds politeness', 'Indicates past tense'] },
  { q: 'How do you say "My parents are in England"?', correct: 'Phoo maae khoong chan yuu thii Ang-grid', options: ['Phoo maae khoong chan maa jaak Ang-grid', 'Phoo maae khoong chan yuu thii Ang-grid', 'Phoo maae khoong chan pen khon Ang-grid', 'Phoo maae khoong chan glap Ang-grid'] },
  { q: 'What does อบอุ่น (op un) describe?', correct: 'A warm, loving atmosphere', options: ['Hot weather', 'A warm, loving atmosphere', 'Physical warmth', 'A spicy taste'] },
  { q: 'How do you say "Not yet married" in Thai?', correct: 'Yang mai taeng ngaan', options: ['Mai taeng ngaan laeo', 'Yang mai taeng ngaan', 'Bpen mai taeng ngaan', 'Yak taeng ngaan'] },
  { q: 'How do you say "I\'ll go home for Christmas"?', correct: 'Chan ja glap baan chuang Krit-mas', options: ['Chan glap baan chuang Krit-mas', 'Chan ja pai baan chuang Krit-mas', 'Chan ja glap baan chuang Krit-mas', 'Chan yaak glap baan Krit-mas'] },
]

const SCRIPT_Q = VOCAB.slice(0, 10).sort(() => Math.random() - 0.5).map(v => ({
  thai: v.thai, roman: v.roman, english: v.english,
  options: [v.english, ...VOCAB.filter(x => x.english !== v.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
}))

const LISTENING_Q = [
  { question: 'Where is the woman\'s family?', correct: 'In England', options: ['In Thailand', 'In England', 'In Australia', 'In Scotland'] },
  { question: 'How often does she call her family?', correct: 'Every week', options: ['Every day', 'Every week', 'Every month', 'Never'] },
  { question: 'Is she married?', correct: 'No, not yet', options: ['Yes', 'No, not yet', 'She doesn\'t know', 'She doesn\'t want to say'] },
  { question: 'What nationality is her partner?', correct: 'Thai', options: ['English', 'Australian', 'Thai', 'American'] },
  { question: 'Where do they live together?', correct: 'Ayutthaya', options: ['Bangkok', 'Chiang Mai', 'Ayutthaya', 'Phuket'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

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
      <div style={{ background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A2 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>A2 · Unit 1 · Lesson 2 — Family & Relationships</div>
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
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>👨‍👩‍👧 Lesson 2 — Family & Relationships</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>
                After introducing yourself, Thais immediately ask about your family. Are you married? Do you have children? Do you miss home? These questions come fast — and answering them well builds instant connection.
              </p>
              <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '14px 18px', border: `1px solid ${COLOR}40` }}>
                <div style={{ color: DARK, fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>🎯 This lesson — 15 vocabulary items</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                  Marriage & relationships · Children · Missing home · Future tense จะ · Mutual action กัน · The ความ prefix · Thai family culture
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
                    <div style={{ fontSize: '22px', fontWeight: '900', color: COLOR, marginBottom: '4px' }}>{card.example.thai}</div>
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
              <button onClick={() => setCardIndex(p => p + 1)} style={{ flex: 1, background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>Next →</button>
            ) : (
              <button onClick={() => setPhase('conversation')} style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>🗣️ Conversation →</button>
            )}
          </div>
        </div>
      )}

      {/* CONVERSATION */}
      {phase === 'conversation' && (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: `5px solid ${COLOR}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>🗣️ Real Conversation — Talking About Family</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>A Thai colleague asks about family life. This conversation happens constantly in Thailand — be ready for it!</p>
            <button onClick={playConversation} style={{ background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '900', fontSize: '15px', cursor: 'pointer' }}>▶ Play Full Conversation</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {CONVERSATION.map((line, i) => (
              <div key={i} onClick={() => { speak(line.thai); setActiveLine(i); setTimeout(() => setActiveLine(-1), 3000) }}
                style={{ background: activeLine === i ? (line.speaker === 'A' ? '#f0f9ff' : '#f0fdf4') : 'white', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', border: `2px solid ${activeLine === i ? (line.speaker === 'A' ? COLOR : '#22c55e') : '#e5e7eb'}`, transition: 'all 0.2s', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: line.speaker === 'A' ? COLOR : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>
                  {line.speaker === 'A' ? '🧑' : '👩'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: line.speaker === 'A' ? COLOR : '#15803d', marginBottom: '4px' }}>{line.thai}</div>
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
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ[quizIndex].correct}</strong></span>}
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
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai and choose the correct English meaning.</p>
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
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: DARK, fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is: <strong>{SCRIPT_Q[scriptIndex].english}</strong></span>}
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
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>Listen to the conversation without reading along, then answer the questions.</p>
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
                  {LISTENING_Q[listenIndex].correct === listenSelected
                    ? <span style={{ color: DARK, fontWeight: '700' }}>✅ Correct!</span>
                    : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct answer: <strong>{LISTENING_Q[listenIndex].correct}</strong></span>}
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
              <div style={{ color: DARK, fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson 2 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                You can now talk about your family, relationships and home life in Thai. You've also learned the future tense จะ and the mutual action pattern กัน. Next: your daily life and hobbies.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a2/unit-1/lesson-3" style={{ display: 'block', background: `linear-gradient(135deg, ${DARK}, ${COLOR})`, color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next Lesson: Daily Life & Hobbies →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
