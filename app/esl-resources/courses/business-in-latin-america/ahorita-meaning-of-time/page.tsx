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

const COLOR = '#c2410c'
const COLORS = { main: '#c2410c', dark: '#431407', light: '#ea580c', pale: '#fff7ed', border: '#fed7aa' }

const PAGES = [
  {
    title: 'What Time Is "Now"?',
    emoji: '⏰',
    reading: `You are working with a supplier in Mexico City. You ask when the documents will be ready. He smiles and says, "Ahorita." You are happy — you think "ahorita" means "right now". You wait. One hour. Three hours. The next day, the documents still have not arrived. What happened?

The answer: "ahorita" does not always mean "now". It can mean "now", "in a few minutes", "later today", or sometimes, politely, "probably not".

Different cultures see time differently. Researchers sometimes describe two styles. In "clock time" cultures — like Japan, Germany, and Switzerland — time is fixed. A 9:00 meeting starts at 9:00. Being late is disrespectful. Schedules are planned carefully and rarely change.

In "event time" or "relationship time" cultures — including much of Latin America — time is more flexible. People and relationships come first. If a conversation with a friend is important, it is more polite to finish it than to rush to the next appointment. A meeting might start 15 or 30 minutes late, and nobody is upset.

Neither style is right or wrong. But when a Japanese manager and a Brazilian manager plan a project together, they may have very different ideas about what "on time" means.

In this lesson, you will learn the time words that confuse foreigners in Mexico, Brazil, and other countries, how deadlines really work, and how to plan successfully with Latin American partners.`,
    vocab: [
      { word: 'Supplier', definition: 'A company or person that provides goods or services to another business.' },
      { word: 'Flexible', definition: 'Able to change easily to suit new situations.' },
      { word: 'Appointment', definition: 'A meeting arranged for a particular time.' },
      { word: 'Rush', definition: 'To move or do something very quickly, often too quickly.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'In your country, what happens if you arrive 15 minutes late for a business meeting?',
      'Is your culture more "clock time" or "relationship time"? Give an example.',
    ],
  },
  {
    title: 'Mexico — Ahorita, Al Rato and Mañana',
    emoji: '🇲🇽',
    reading: `Mexican Spanish has some of the most famous — and most confusing — time words in the world.

"Ahora" means "now". "Ahorita" is the small, friendly form — literally "a little now". In theory, it should mean "right now". In practice, it can mean almost anything. "Ahorita voy" could mean "I'm coming right now" or "I'll come later". Mexicans themselves often joke about this. The tone of voice and the situation tell you which meaning is correct.

If someone really means "immediately", they may say "ahorita mismo" or "ahora mismo" — "right now, this moment".

"Al rato" means "in a while" — maybe an hour, maybe later today. "Mañana" means "tomorrow", but it is also sometimes used to mean "at some point in the future". And "luego" means "later" — without saying how much later.

Why are these words so flexible? One reason is politeness. In Mexican culture, saying "no" or "I can't do that today" can feel rude. A soft, flexible time word lets people avoid disappointing you directly.

In business, Mexicans in big cities like Mexico City and Monterrey are usually more punctual than in social situations — but meetings can still start late, especially if traffic is bad. As a foreigner, it is best to arrive on time yourself, and be patient if others are 15 or 20 minutes late. Social events are different: arriving exactly on time at a party can be seen as arriving too early!`,
    vocab: [
      { word: 'In theory', definition: 'What should be true or happen, but may not in reality.' },
      { word: 'Immediately', definition: 'Now, without waiting.' },
      { word: 'Disappoint', definition: 'To make someone sad because something they hoped for did not happen.' },
      { word: 'Punctual', definition: 'Arriving or doing something at the expected time.' },
    ],
    phrases: [
      { en: 'Right now (or... later).', local: 'Ahorita.', phonetic: 'Ah-oh-REE-tah', note: 'The famous flexible Mexican word. Listen to the tone and ask for a time if it matters.' },
      { en: 'Right this moment.', local: 'Ahorita mismo.', phonetic: 'Ah-oh-REE-tah MEES-moh', note: 'Adds urgency. More likely to really mean "now".' },
      { en: 'In a while.', local: 'Al rato.', phonetic: 'Ahl RAH-toh', note: 'Later — maybe an hour, maybe this afternoon.' },
      { en: 'At what time exactly?', local: '¿A qué hora exactamente?', phonetic: 'Ah keh OH-rah ek-sak-tah-MEN-teh', note: 'A polite way to get a clear time when "ahorita" is not enough.' },
    ],
    discussion: [
      'Why do you think Mexicans use flexible time words instead of saying "no" or "later"?',
      'Does your language have a word like "ahorita" that can mean different things?',
      'If someone says "ahorita" and you need the documents today, what would you say?',
    ],
  },
  {
    title: 'Brazil — Hora Brasileira and "Já Já"',
    emoji: '🇧🇷',
    reading: `In Brazil, people sometimes talk about "hora brasileira" — Brazilian time. It describes a relaxed attitude to punctuality, especially in social life. If a friend invites you to a barbecue at 2 p.m., many guests will arrive at 3 or later. Arriving at exactly 2 p.m. might mean you help the host finish cleaning the house!

Brazilian Portuguese also has its own flexible time words. "Daqui a pouco" means "in a little while". "Já já" — literally "already already" — means "very soon". But like the Mexican "ahorita", "já já" can mean five minutes or two hours. "Mais tarde" means "later", and "um minutinho" — "a little minute" — is almost never just one minute.

In business, the rules are stricter, but it depends on the city. São Paulo, Brazil's business capital, is known for being more punctual. In other parts of the country, especially the north and northeast, meetings may be more relaxed. Traffic is also a real and serious problem in big Brazilian cities. A one-hour delay because of traffic in São Paulo is not an excuse — it is a reality.

Brazilians often start meetings with a long, friendly conversation before getting to business. This is not wasting time. It is building the relationship. Trying to skip it to "save time" may make you seem cold.

One more thing: in Brazil, things often move slowly — until suddenly they move very fast. Brazilians are famous for solving problems at the last minute.`,
    vocab: [
      { word: 'Attitude', definition: 'The way you think and feel about something.' },
      { word: 'Strict', definition: 'Following rules carefully and exactly.' },
      { word: 'Excuse', definition: 'A reason you give to explain why you did something wrong.' },
      { word: 'At the last minute', definition: 'At the latest possible time before something must happen.' },
    ],
    phrases: [
      { en: 'Very soon.', local: 'Já já.', phonetic: 'Zhah zhah', note: 'Literally "already already". Could be five minutes — or two hours.' },
      { en: 'In a little while.', local: 'Daqui a pouco.', phonetic: 'Dah-KEE ah POH-koo', note: 'A common way to say "soon" without a fixed time.' },
      { en: 'Just a minute.', local: 'Um minutinho.', phonetic: 'Oong mee-noo-CHEE-nyoo', note: '"A little minute". Rarely means exactly one minute!' },
      { en: 'Can we confirm the time?', local: 'Podemos confirmar o horário?', phonetic: 'Poh-DEH-moos kohn-feer-MAR oo oh-RAH-ryoo', note: 'A polite way to make the meeting time clear.' },
    ],
    discussion: [
      'Would you arrive on time, early, or late to a Brazilian barbecue? Why?',
      'Why do you think Brazilians start meetings with long, friendly conversations?',
      'Are you a "last-minute" person or do you finish things early? Give an example.',
    ],
  },
  {
    title: 'Argentina, Colombia and Chile',
    emoji: '🌎',
    reading: `Time is flexible across much of Latin America, but every country has its own rhythm.

Argentina. Argentines live late. Lunch may start at 1 or 2 p.m., and dinner often starts at 9 or 10 p.m. — sometimes even later on weekends. Restaurants in Buenos Aires can be almost empty at 8 p.m. and full at 11 p.m. Business meetings usually start a little late, and they often include long conversations. A useful phrase you will hear is "en un ratito" — "in a little while".

Colombia. Colombians sometimes joke about "la hora colombiana" — Colombian time — which runs a little behind the clock. When a Colombian says "ya voy" ("I'm coming now"), they may still be at home. In business, especially in Bogotá and Medellín, punctuality is more expected, but delays of 10 to 20 minutes are common and usually forgiven.

Chile. Chile is often seen as one of the more punctual countries in Latin America, especially in business. Meetings in Santiago usually start close to the agreed time. Chileans also have their own time word: "al tiro", which means "right away" — and usually really does mean right away.

Across the region, one thing is important: time is often measured by relationships, not the clock. Being late because you helped a friend, finished an important conversation, or stopped to greet someone is often more acceptable than being rude to keep a schedule.`,
    vocab: [
      { word: 'Rhythm', definition: 'A regular pattern of how things happen.' },
      { word: 'Run behind', definition: 'To be later than planned.' },
      { word: 'Forgive', definition: 'To stop being angry with someone for something they did.' },
      { word: 'Measure', definition: 'To judge the size or amount of something.' },
    ],
    phrases: [
      { en: 'In a little while.', local: 'En un ratito.', phonetic: 'En oon rah-TEE-toh', note: 'Very common in Argentina. Flexible, like "ahorita".' },
      { en: 'I\'m coming now!', local: '¡Ya voy!', phonetic: 'Yah VOY', note: 'Common in Colombia and elsewhere. They may not be on their way yet.' },
      { en: 'Right away. (Chile)', local: 'Al tiro.', phonetic: 'Ahl TEE-roh', note: 'Chilean slang. Usually really means immediately.' },
      { en: 'Sorry for the delay.', local: 'Perdón por la demora.', phonetic: 'Per-DOHN por lah deh-MOH-rah', note: 'A polite apology if you are late.' },
    ],
    discussion: [
      'Would you enjoy having dinner at 10 p.m. like in Argentina? Why or why not?',
      'Is it acceptable to be late because you stopped to help a friend? Why?',
      'Chile is more punctual than many neighbours. Why might countries in the same region be different?',
    ],
  },
  {
    title: 'Deadlines, Plans and Last Minutes',
    emoji: '📅',
    reading: `Flexible time also affects deadlines and planning. Here is what foreign businesspeople often notice in Latin America — and how to work with it.

Plans change. A meeting arranged for next Tuesday may move to Thursday. A visit planned weeks ago may be confirmed only the day before. This is not always disorganisation. Many Latin Americans prefer to stay flexible so they can react to new situations.

Deadlines are often seen as targets. In many Western and East Asian companies, a deadline is a fixed promise. In some Latin American workplaces, a deadline can be seen more as a goal — something to aim for, but which may move if there are good reasons.

The last-minute rush. Many projects move slowly at first and then very quickly at the end. Teams can work extremely hard in the final days to finish. Foreign managers who expect steady progress may panic in the middle of a project.

So how can you manage time successfully?

Confirm everything. Send a friendly WhatsApp message the day before a meeting to confirm the time and place.

Be specific. Instead of "soon" or "next week", agree on an exact day and time.

Explain why the deadline matters. "Our client in Tokyo needs this on Friday, because their board meets on Monday" works better than just "Friday, please."

Build in extra time. Plan a buffer of a few days before your real deadline.

Check progress in a friendly way. Regular, relaxed check-ins keep the relationship warm and the project moving.`,
    vocab: [
      { word: 'Disorganisation', definition: 'A lack of planning or order.' },
      { word: 'Target', definition: 'A goal or result that you try to achieve.' },
      { word: 'Panic', definition: 'To suddenly feel very worried and unable to think clearly.' },
      { word: 'Buffer', definition: 'Extra time or space added to protect against problems.' },
    ],
    phrases: [
      { en: 'Just confirming our meeting tomorrow at 10. See you then!', local: '', phonetic: '', note: 'A friendly WhatsApp reminder. Very normal in Latin America.' },
      { en: 'Could we agree on an exact date?', local: '', phonetic: '', note: 'Turns "soon" into a real deadline, politely.' },
      { en: 'This date is important because...', local: '', phonetic: '', note: 'Explaining the reason makes people take a deadline more seriously.' },
      { en: 'How is everything going with the project?', local: '', phonetic: '', note: 'A relaxed, friendly check-in that keeps work moving.' },
    ],
    discussion: [
      'Is a deadline a fixed promise or a target in your culture?',
      'Which tip on this page do you think is the most useful? Why?',
      'Do you prefer steady progress or working hard at the last minute? Why?',
    ],
  },
  {
    title: 'Clock Time Meets Relationship Time',
    emoji: '🌏',
    reading: `What happens when people from "clock time" cultures work with people from "relationship time" cultures? Let us look at both sides.

A Japanese view. Kenji, a Japanese project manager, works with a team in Brazil. In Japan, trains run on time almost to the second. Kenji arrives at meetings five minutes early. When his Brazilian colleagues arrive 20 minutes late, laughing and chatting, he feels they do not respect his time. When deadlines move, he worries that the project is failing.

A Brazilian view. Camila, Kenji's Brazilian colleague, sees things differently. She was late because she stopped to help a colleague with a problem. She thinks Kenji is a little cold — he never asks about her family and always wants to start the meeting immediately. She knows the team will finish on time, because they always work hard at the end.

Both Kenji and Camila are professional. Both want the project to succeed. They just have different ideas about what respect looks like. For Kenji, respect means being on time. For Camila, respect means making time for people.

The best teams learn from each other. Kenji can learn to spend five minutes on friendly conversation before a meeting, and to trust the team's final push. Camila can learn to tell Kenji early if something will be late, and to arrive on time for important meetings with Japanese clients.

In international business, the goal is not to change the other culture. It is to understand it — and meet in the middle.`,
    vocab: [
      { word: 'Respect', definition: 'A feeling that someone is important and should be treated well.' },
      { word: 'Professional', definition: 'Behaving in a skilled and correct way at work.' },
      { word: 'Final push', definition: 'A big effort at the end to finish something.' },
      { word: 'Meet in the middle', definition: 'To reach an agreement where both sides change a little.' },
    ],
    phrases: [
      { en: 'Is everything OK? You seem worried about the timeline.', local: '', phonetic: '', note: 'Opens a friendly conversation about different time expectations.' },
      { en: 'If there\'s any delay, could you let me know as early as possible?', local: '', phonetic: '', note: 'Respects flexibility while asking for early communication.' },
      { en: 'For this meeting, it\'s really important that we start on time.', local: '', phonetic: '', note: 'Makes clear when punctuality matters most.' },
      { en: 'How\'s the family?', local: '¿Cómo está la familia? / Como vai a família?', phonetic: 'KOH-moh es-TAH lah fah-MEE-lyah / KOH-moo vai ah fah-MEE-lyah', note: 'Spanish / Portuguese. A warm question before getting down to business.' },
    ],
    discussion: [
      'Do you understand Kenji\'s view or Camila\'s view better? Why?',
      'What does "respect" mean to you at work — being on time, or making time for people?',
      'What could you do to "meet in the middle" with a colleague who sees time differently?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. What is happening, and what should the person do?

Situation 1: The Ahorita Problem
Min-ji, from Korea, asks a Mexican colleague for an important report. He says, "Sí, ahorita te lo mando" ("Yes, I'll send it to you ahorita"). Four hours later, she still has nothing, and she needs the report before 6 p.m. What should she do?

Situation 2: The Early Guest
Hiroshi, from Japan, is invited to a dinner party at a Brazilian colleague's home at 8 p.m. He arrives at exactly 7:55 p.m. The host opens the door in shorts, with wet hair, and looks surprised. What happened? What time should Hiroshi arrive next time?

Situation 3: The Moving Meeting
Faisal, from Saudi Arabia, has flown to Bogotá for a meeting with a potential partner on Tuesday. On Monday evening, the partner sends a WhatsApp message: "So sorry, can we move to Thursday?" Faisal's flight home is on Wednesday. How should he reply?

Situation 4: The Late-Night Dinner
Li Wei, from China, is in Buenos Aires. His Argentine clients invite him to dinner "at nine". He arrives at 9 p.m. and the restaurant is almost empty. His clients arrive at 9:45 and dinner finishes at 1 a.m. He has a meeting at 8 the next morning. How could he handle this better?

Situation 5: The Deadline
A German manager tells his team in Chile, "The deadline is Friday." On Thursday, he discovers the team has only finished half of the work. On Friday night, they send everything — and the quality is excellent. Should the manager be happy, worried, or both? What could he change next time?`,
    vocab: [
      { word: 'Potential', definition: 'Possible in the future.' },
      { word: 'Reply', definition: 'To answer someone.' },
      { word: 'Discover', definition: 'To find out something you did not know before.' },
      { word: 'Quality', definition: 'How good or bad something is.' },
    ],
    phrases: [],
    discussion: [
      'Which situation would be most frustrating for you? Why?',
      'In Situation 1, what exactly should Min-ji say? Practise it with the AI.',
      'In Situation 3, should Faisal change his flight, or ask for another solution?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

Two kinds of time: "Clock time" cultures, like Japan and Germany, treat time as fixed. "Relationship time" cultures, including much of Latin America, are more flexible — people come before schedules.

Mexico: "Ahorita" can mean now, soon, later, or probably not. "Ahorita mismo" is more urgent. "Al rato" means in a while, and "mañana" can mean tomorrow or someday. Business is more punctual than social life.

Brazil: "Hora brasileira" is relaxed, especially socially. "Já já", "daqui a pouco", and "um minutinho" are flexible. São Paulo is more punctual, and traffic is a real problem. Meetings start with friendly conversation. Problems are often solved at the last minute.

Argentina, Colombia, and Chile: Argentines eat dinner very late. Colombians joke about "la hora colombiana" and "ya voy". Chile is more punctual, and "al tiro" really means right away.

Deadlines and planning: Plans change, deadlines can be seen as targets, and work often speeds up at the end. Confirm meetings the day before, agree on exact dates, explain why deadlines matter, build in extra time, and check in regularly.

Meeting in the middle: For some people, respect means being on time. For others, it means making time for people. Successful teams understand both.`,
    vocab: [
      { word: 'Treat', definition: 'To think about or deal with something in a particular way.' },
      { word: 'Urgent', definition: 'Needing to be done immediately.' },
      { word: 'Socially', definition: 'In situations with friends and other people, not at work.' },
      { word: 'Regularly', definition: 'Often, at the same times or in the same way.' },
    ],
    phrases: [],
    discussion: [
      'Which time word from this lesson do you think is the most confusing? Why?',
      'Would you find it easier to work in a "clock time" or a "relationship time" culture?',
      'Compare: how is time different in Latin America and in your country?',
      'What was the most useful thing you learned in this lesson?',
    ],
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

function TranslateBtn({ text, type, lang, onTranslated }: { text: string; type: 'word' | 'question' | 'message'; lang: string; onTranslated: (t: string) => void }) {
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
      style={{ background: isDisabled ? '#f3f4f6' : done ? '#f0fdf4' : '#c2410c15', color: isDisabled ? '#d1d5db' : done ? '#16a34a' : COLOR, border: `1px solid ${isDisabled ? '#e5e7eb' : done ? '#86efac' : '#c2410c40'}`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: isDisabled ? 'not-allowed' : done ? 'default' : 'pointer', fontWeight: '700', flexShrink: 0, transition: 'all 0.2s' }}>
      {loading ? '...' : done ? '✓ 🌍' : '🌍'}
    </button>
  )
}

function ShortListenBtn({ text }: { text: string }) {
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
      source.buffer = audioBuffer; source.playbackRate.value = 0.85
      source.connect(audioContext.destination)
      source.onended = () => { setPlaying(false); sourceRef.current = null }
      sourceRef.current = source; setLoading(false); setPlaying(true); source.start(0)
    } catch { setLoading(false); setPlaying(false) }
  }
  return (
    <button onClick={handleClick}
      style={{ background: playing ? COLOR : '#c2410c15', color: playing ? 'white' : COLOR, border: `1px solid ${COLOR}40`, padding: '2px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}>
      {loading ? '...' : playing ? '⏹ Stop' : '🔊'}
    </button>
  )
}

type Message = { role: 'user' | 'assistant'; content: string; translation?: string }

function ConversationBox({ question, translationLang, speed }: { question: string; translationLang: string; speed: number }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [open, setOpen] = useState(false)
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is ""Ahorita" and the Meaning of Time — flexible time words, punctuality, deadlines and planning in Mexico, Brazil, Argentina, Colombia and Chile, compared with clock-time cultures like Japan". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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
    <button onClick={() => setOpen(true)} style={{ marginTop: '8px', width: '100%', background: '#c2410c12', border: `2px dashed ${COLOR}40`, borderRadius: '12px', padding: '10px', color: COLOR, fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      🤖 Practice answering with AI
    </button>
  )

  return (
    <div style={{ marginTop: '8px', background: '#fff7ed', borderRadius: '14px', border: `2px solid ${COLOR}30`, overflow: 'hidden' }}>
      <div style={{ background: COLOR, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>🤖 AI Conversation Partner</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setMessages([])} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>🔄 Reset</button>
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>✕ Close</button>
        </div>
      </div>
      {messages.length === 0 && <div style={{ padding: '14px 16px', color: '#6b7280', fontSize: '13px', lineHeight: '1.6', borderBottom: `1px solid ${COLORS.border}` }}>💡 Type your answer or tap <strong>🎤 Start Recording</strong> — speak your full answer, then tap <strong>⏹ Stop & Send</strong>.</div>}
      {messages.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ fontSize: '20px', flexShrink: 0 }}>{m.role === 'user' ? '🧑‍🎓' : '🤖'}</div>
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: m.role === 'user' ? COLOR : 'white', color: m.role === 'user' ? 'white' : '#374151', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '14px', lineHeight: '1.6', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: m.role === 'assistant' ? '1px solid #e5e7eb' : 'none' }}>{m.content}</div>
                {m.role === 'assistant' && !m.translation && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShortListenBtn text={m.content} />
                    <TranslateBtn text={m.content} type="message" lang={translationLang} onTranslated={(t) => setMessageTranslation(i, t)} />
                  </div>
                )}
                {m.translation && <div style={{ background: '#fff7ed', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}><span style={{ color: COLOR, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>🌍 {currentLang?.label}</span>{m.translation}</div>}
              </div>
            </div>
          ))}
          {loading && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ fontSize: '20px' }}>🤖</span><div style={{ background: 'white', padding: '10px 14px', borderRadius: '4px 16px 16px 16px', fontSize: '14px', color: '#9ca3af', border: '1px solid #e5e7eb' }}>Thinking...</div></div>}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }} placeholder="Type your answer here..." rows={2} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={listening ? stopVoice : startVoice} style={{ background: listening ? '#ef4444' : '#22c55e', color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.3)' : 'none', transition: 'all 0.2s' }}>{listening ? '⏹' : '🎤'}</button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? COLOR : '#e5e7eb', color: input.trim() && !loading ? 'white' : '#9ca3af', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
        </div>
      </div>
      {listening && (
        <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #fee2e2', background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', flexShrink: 0 }} /><span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>Recording... speak your full answer</span></div>
            <button onClick={stopVoice} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>⏹ Stop & Send</button>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: interimText ? '#374151' : '#9ca3af', lineHeight: '1.6', border: '1px solid #fca5a5', fontStyle: 'italic', minHeight: '40px' }}>{interimText || 'Waiting for speech...'}</div>
        </div>
      )}
    </div>
  )
}

export default function AhoritaMeaningOfTimePage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [speed, setSpeed] = useState(0.9)
  const [translationLang, setTranslationLang] = useState('none')
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const blobUrlRef = useRef<string | null>(null)
  const [vocabTranslations, setVocabTranslations] = useState<Record<string, string>>({})
  const [questionTranslations, setQuestionTranslations] = useState<Record<string, string>>({})
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [lookupDef, setLookupDef] = useState('')
  const [lookupTranslation, setLookupTranslation] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)

  const page = PAGES[currentPage]
  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  // Stop ALL audio on page change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.onended = null
      audioRef.current = null
    }
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }
    setAudioState('idle')
    setVocabTranslations({})
    setQuestionTranslations({})
    setSelectedText(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // Update playback rate when speed changes
  useEffect(() => {
    if (audioRef.current) { audioRef.current.playbackRate = speed }
  }, [speed])

  // Main page audio: play / pause / resume
  const handlePageAudio = async () => {
    if (audioState === 'playing' && audioRef.current) {
      audioRef.current.pause()
      setAudioState('paused')
      return
    }
    if (audioState === 'paused' && audioRef.current) {
      audioRef.current.play()
      setAudioState('playing')
      return
    }
    // New playback
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }
    setAudioState('loading')
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: page.reading }) })
      if (!res.ok) { setAudioState('idle'); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      blobUrlRef.current = url
      const audio = new Audio(url)
      audio.playbackRate = speed
      audio.onended = () => { setAudioState('idle') }
      audioRef.current = audio
      await audio.play()
      setAudioState('playing')
    } catch { setAudioState('idle') }
  }

  // Text highlight lookup
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
    // Speak the word
    if (typeof window !== 'undefined') { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = 0.85; window.speechSynthesis.speak(u) }
    const isPhrase = text.includes(' ')
    try {
      if (translationLang === 'none') {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: isPhrase ? 'You are an English dictionary for B1 learners. Respond with ONLY one sentence (max 20 words) explaining what the phrase means. No extra text.' : 'You are an English dictionary for B1 learners. Respond with ONLY one sentence (max 15 words) defining this word. No extra text.', messages: [{ role: 'user', content: isPhrase ? `What does "${text}" mean?` : `Define: "${text}"` }] }) })
        const data = await res.json(); setLookupDef(data.content || 'No definition found.')
      } else {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: `You are a language learning assistant for B1 English students. Respond ONLY with valid JSON (no markdown, no backticks): {"definition": "one simple English sentence max 15 words", "translation": "the word/phrase in ${translationLang} with a brief explanation in ${translationLang}, max 25 words"}`, messages: [{ role: 'user', content: `Word or phrase: "${text}"` }] }) })
        const data = await res.json()
        try { const parsed = JSON.parse(data.content); setLookupDef(parsed.definition || 'No definition found.'); setLookupTranslation(parsed.translation || '') }
        catch { setLookupDef(data.content || 'No definition found.'); setLookupTranslation('') }
      }
    } catch { setLookupDef('Could not load definition.') }
    setLookupLoading(false)
  }

  const goNext = () => { if (currentPage < PAGES.length - 1) setCurrentPage(currentPage + 1) }
  const goPrev = () => { if (currentPage > 0) setCurrentPage(currentPage - 1) }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh', paddingBottom: '100px' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* HEADER */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.main} 60%, ${COLORS.light} 100%)`, padding: '40px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/courses/business-in-latin-america" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>← Business in Latin America</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '64px', flexShrink: 0 }}>⏰</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 2 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>{'"Ahorita" and the Meaning of Time'}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Now, later, or never? Time and deadlines</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            {['✍️ Highlight any text', '🌍 13-language translation', '🤖 AI conversation partner', '🎤 Push-to-talk voice', '🔊 4-speed audio', '🔊 Pause & resume'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROLS BAR */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '12px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>🔊 Speed:</span>
            {SPEEDS.map(s => (
              <button key={s.value} onClick={() => setSpeed(s.value)} style={{ padding: '3px 10px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? COLOR : '#e5e7eb', background: speed === s.value ? COLOR : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>🌍</span>
            <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setQuestionTranslations({}) }} style={{ padding: '4px 10px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? COLOR : '#e5e7eb', background: translationLang !== 'none' ? COLORS.pale : 'white', color: translationLang !== 'none' ? COLORS.dark : '#555', fontWeight: '700', fontSize: '11px', cursor: 'pointer', outline: 'none' }}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* PAGE PROGRESS */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {PAGES.map((_, i) => (
            <div key={i} onClick={() => setCurrentPage(i)} style={{ flex: 1, height: '6px', borderRadius: '3px', background: i <= currentPage ? COLOR : '#e5e7eb', cursor: 'pointer', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>Page {currentPage + 1} of {PAGES.length}</span>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>{page.emoji} {page.title}</span>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '16px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>

          {/* Page Title */}
          <div style={{ background: `linear-gradient(135deg, ${COLOR}22, ${COLOR}08)`, borderLeft: `5px solid ${COLOR}`, padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '36px', flexShrink: 0 }}>{page.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLOR, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Page {currentPage + 1}</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{page.title}</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={handlePageAudio} style={{ background: audioState === 'playing' ? '#ef4444' : audioState === 'paused' ? '#f59e0b' : COLOR, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: `0 3px 10px ${audioState === 'playing' ? 'rgba(239,68,68,0.4)' : audioState === 'paused' ? 'rgba(245,158,11,0.4)' : COLOR + '40'}`, transition: 'all 0.2s', minWidth: '120px' }}>
                {audioState === 'loading' ? '⏳ Loading...' : audioState === 'playing' ? '⏸ Pause' : audioState === 'paused' ? '▶ Resume' : '▶ Listen'}
              </button>
              {audioState !== 'idle' && audioState !== 'loading' && (
                <button onClick={() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null }; if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }; setAudioState('idle') }} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop</button>
              )}
            </div>
          </div>

          {/* Highlight tip */}
          <div style={{ background: COLORS.pale, padding: '8px 28px', borderBottom: `1px solid ${COLORS.border}` }}>
            <span style={{ color: COLORS.dark, fontSize: '12px', fontWeight: '600' }}>✍️ Highlight any word or phrase to hear it and see its meaning{translationLang !== 'none' && <span style={{ color: COLOR }}> + {currentLang?.label} translation</span>}</span>
          </div>

          {/* Reading Content */}
          <div data-passage="true" style={{ padding: '24px 28px 20px', userSelect: 'text', cursor: 'text' }}>
            {page.reading.split('\n\n').map((para, i) => <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: '1.85', margin: i === 0 ? '0 0 18px' : '18px 0 0', fontFamily: 'Georgia, serif' }}>{para}</p>)}
          </div>

          {/* Vocabulary */}
          <div style={{ margin: '0 28px 20px', background: COLOR + '08', border: `1px solid ${COLOR}25`, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ background: COLOR + '18', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${COLOR}20` }}>
              <span style={{ fontSize: '16px' }}>📚</span>
              <span style={{ color: COLOR, fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vocabulary</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {page.vocab.map((v, i) => {
                const vKey = `${currentPage}-${v.word}`
                return (
                  <div key={v.word} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: i < page.vocab.length - 1 ? '10px' : '0', borderBottom: i < page.vocab.length - 1 ? `1px solid ${COLOR}15` : 'none' }}>
                    <div style={{ background: COLOR, color: 'white', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span data-passage="true" style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', userSelect: 'text', cursor: 'text' }}>{v.word}</span>
                        <ShortListenBtn text={v.word} />
                        <TranslateBtn text={`Word: "${v.word}"\nDefinition: "${v.definition}"`} type="word" lang={translationLang} onTranslated={(t) => setVocabTranslations(prev => ({ ...prev, [vKey]: t }))} />
                      </div>
                      <span data-passage="true" style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', userSelect: 'text', cursor: 'text' }}>{v.definition}</span>
                      {vocabTranslations[vKey] && <div style={{ marginTop: '6px', background: COLORS.pale, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '8px 12px' }}><span style={{ color: COLOR, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span><span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{vocabTranslations[vKey]}</span></div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Key Phrases (if any) */}
          {page.phrases && page.phrases.length > 0 && (
            <div style={{ margin: '0 28px 20px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: '#fef3c7', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #fde68a' }}>
                <span style={{ fontSize: '16px' }}>🗣️</span>
                <span style={{ color: '#92400e', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Key Phrases</span>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {page.phrases.map((p, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>"{p.en}"</span>
                      <ShortListenBtn text={p.en} />
                    </div>
                    {p.local && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '18px', color: '#374151' }}>{p.local}</span>
                        <span style={{ fontSize: '13px', color: '#92400e', fontStyle: 'italic' }}>({p.phonetic})</span>
                      </div>
                    )}
                    <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', fontStyle: 'italic' }}>💡 {p.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion Questions */}
          <div style={{ background: COLORS.dark, padding: '20px 28px', borderRadius: '0 0 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '18px' }}>💬</span>
              <span style={{ color: COLORS.border, fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Discussion Questions</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {page.discussion.map((q, qi) => {
                const qKey = `${currentPage}-${qi}`
                return (
                  <div key={qi}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ background: COLOR, color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{qi + 1}</div>
                      <div style={{ flex: 1 }}>
                        <p data-passage="true" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 6px', userSelect: 'text', cursor: 'text' }}>{q}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <TranslateBtn text={q} type="question" lang={translationLang} onTranslated={(t) => setQuestionTranslations(prev => ({ ...prev, [qKey]: t }))} />
                        </div>
                        {questionTranslations[qKey] && <div style={{ marginTop: '8px', background: 'rgba(194,65,12,0.15)', border: '1px solid rgba(194,65,12,0.3)', borderRadius: '10px', padding: '10px 14px' }}><span style={{ color: COLORS.border, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span><span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6' }}>{questionTranslations[qKey]}</span></div>}
                      </div>
                    </div>
                    <div style={{ marginLeft: '42px' }}><ConversationBox question={q} translationLang={translationLang} speed={speed} /></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 24px', zIndex: 150, boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={goPrev} disabled={currentPage === 0} style={{ background: currentPage === 0 ? '#f3f4f6' : COLOR, color: currentPage === 0 ? '#d1d5db' : 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s', minWidth: '120px' }}>
            ← Previous
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>Page {currentPage + 1} of {PAGES.length}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{page.title}</div>
          </div>
          <button onClick={goNext} disabled={currentPage === PAGES.length - 1} style={{ background: currentPage === PAGES.length - 1 ? '#f3f4f6' : COLOR, color: currentPage === PAGES.length - 1 ? '#d1d5db' : 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: currentPage === PAGES.length - 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s', minWidth: '120px' }}>
            Next →
          </button>
        </div>
      </div>

      {/* WORD LOOKUP POPUP */}
      {selectedText && (
        <div style={{ position: 'fixed', bottom: '80px', left: 0, right: 0, zIndex: 200, animation: 'slideUp 0.25s ease' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)', border: `2px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', fontFamily: 'Georgia, serif' }}>"{selectedText}"</span>
                  <ShortListenBtn text={selectedText} />
                </div>
                <button onClick={() => setSelectedText(null)} style={{ background: '#f3f4f6', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0 }}>✕</button>
              </div>
              {lookupLoading ? (
                <div style={{ background: COLORS.pale, borderRadius: '10px', padding: '12px 16px', border: `1px solid ${COLORS.border}`, color: '#9ca3af', fontSize: '14px' }}>Looking up...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: COLORS.pale, borderRadius: '10px', padding: '12px 16px', border: `1px solid ${COLORS.border}` }}>
                    <div style={{ color: COLORS.dark, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>📖 Definition</div>
                    <span style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5' }}>{lookupDef}</span>
                  </div>
                  {translationLang !== 'none' && lookupTranslation && (
                    <div style={{ background: COLORS.pale, borderRadius: '10px', padding: '12px 16px', border: `1px solid ${COLOR}60` }}>
                      <div style={{ color: COLOR, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{currentLang?.label}</div>
                      <span style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5' }}>{lookupTranslation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
