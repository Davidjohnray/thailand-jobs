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
    title: 'There\'s Always a Way',
    emoji: '🪄',
    reading: `Imagine you arrive at a government office in Brazil to collect an important document. The clerk tells you the system is down, and you must come back next week. You explain that you are flying home tomorrow. The clerk thinks for a moment, smiles, and says, "Vamos dar um jeito" — "Let's find a way." Twenty minutes later, you leave with your document.

This is the famous "jeitinho brasileiro" — the "little Brazilian way". "Jeito" means "way" or "knack", and "jeitinho" is the small, friendly form. To "dar um jeito" means to find a way around a problem, often by being creative, flexible, or using a personal connection.

The jeitinho is one of the most discussed ideas in Brazilian culture. For some Brazilians, it is something to be proud of: the ability to solve problems that seem impossible, to improvise, and to stay positive in difficult situations. For others, it is something to worry about: a habit of bending rules, cutting corners, and putting personal connections above fairness.

The truth is that the jeitinho can be both. It can mean fixing a broken machine with a piece of wire. It can mean a kind clerk helping a stressed traveller. But it can also mean jumping a queue, avoiding a fine, or — at the extreme — corruption.

In this lesson, you will explore the good and bad sides of the jeitinho, similar ideas in other Latin American countries, where the line is, and how to use creative problem-solving in a positive way at work.`,
    vocab: [
      { word: 'Clerk', definition: 'A person who works in an office, dealing with documents or customers.' },
      { word: 'Knack', definition: 'A special skill or ability to do something well.' },
      { word: 'Improvise', definition: 'To do something without planning, using whatever is available.' },
      { word: 'Fine', definition: 'Money you must pay as a punishment for breaking a rule.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'Have you ever "found a way" to solve a problem when the rules said it was impossible?',
      'In your country, do people usually follow rules exactly, or look for flexible solutions?',
    ],
  },
  {
    title: 'The Good Jeitinho',
    emoji: '💡',
    reading: `Many Brazilians see the positive jeitinho as a survival skill — and history helps explain why.

In the 1980s and early 1990s, Brazil suffered from hyperinflation. Prices could rise every day, sometimes many times in a month. Supermarket workers changed price labels constantly. Families rushed to spend their salaries the moment they were paid. In this world, people who could adapt quickly, find creative solutions, and help each other survived. Flexibility was not a choice — it was necessary. In 1994, the "Plano Real" introduced a new currency and finally brought inflation under control, but the creative, flexible mindset remained.

In business, the good jeitinho can be a real strength.

Creativity. Brazilian teams are often very good at finding unexpected solutions when the official plan fails.

Flexibility. When a supplier is late or a machine breaks, Brazilians are often less likely to panic and more likely to say, "OK, let's find another way."

Customer service. A shop owner who stays open ten minutes late for you, or a hotel worker who solves your problem even though it is "not their job", is showing a positive jeitinho.

Relationships. The jeitinho often depends on people helping each other. Asking politely, smiling, and building good relationships can open doors.

For people from cultures where rules are followed exactly — such as Japan, Korea, or Germany — this flexibility can be surprising. But it can also be very effective.`,
    vocab: [
      { word: 'Hyperinflation', definition: 'When prices rise extremely fast, making money lose its value very quickly.' },
      { word: 'Survival', definition: 'Continuing to live or exist, especially in a difficult situation.' },
      { word: 'Currency', definition: 'The system of money used in a country, like the dollar or the yen.' },
      { word: 'Mindset', definition: 'A person\'s way of thinking and their attitudes.' },
    ],
    phrases: [
      { en: 'Let\'s find a way.', local: 'Vamos dar um jeito.', phonetic: 'VAH-moos dar oong ZHAY-too', note: 'The classic positive jeitinho phrase. Usually a good sign!' },
      { en: 'Is there any way...?', local: 'Será que tem um jeitinho?', phonetic: 'Seh-RAH kee teyn oong zhay-CHEE-nyoo', note: 'A soft, polite way to ask if a flexible solution is possible.' },
      { en: 'No problem, we\'ll sort it out.', local: 'Sem problema, a gente resolve.', phonetic: 'Seyn proh-BLEH-mah, ah ZHEN-chee heh-ZOL-vee', note: '"A gente" is a very common informal way to say "we" in Brazil.' },
      { en: 'You\'re a lifesaver!', local: 'Você salvou minha vida!', phonetic: 'Voh-SEH sahl-VOH MEE-nyah VEE-dah', note: 'Literally "you saved my life". A warm thank-you for help.' },
    ],
    discussion: [
      'How do you think living with hyperinflation would change the way people think?',
      'Can you remember a time when someone broke a small rule to help you? How did you feel?',
      'Is flexibility a strength or a weakness in business? Why?',
    ],
  },
  {
    title: 'The Grey Zone',
    emoji: '🌫️',
    reading: `Not every jeitinho is positive. Many Brazilians themselves criticise the darker side.

Jumping the queue. Asking a friend who works at a hospital to get you an appointment faster may feel like a harmless jeitinho to you — but it is unfair to the people who waited.

Avoiding the rules. Parking where it is not allowed "just for five minutes", or finding a way to avoid paying a fine.

"Do you know who you are talking to?" One famous Brazilian phrase is "Você sabe com quem está falando?" — "Do you know who you're talking to?" People sometimes use it to show that they are important or well-connected, and therefore should not follow the same rules as everyone else. Brazilian anthropologist Roberto DaMatta wrote about this phrase as a symbol of how status can be used to escape rules. Today, it is often used as an example of bad behaviour.

Bending the truth. Small lies to speed up a process — for example, saying a document is "urgent" when it is not.

This is the "grey zone": actions that are not always illegal, but are not completely fair either. Different people draw the line in different places.

For foreign businesspeople, it is important to understand this grey zone. When a local partner says, "Don't worry, I'll find a jeitinho," it is reasonable to ask politely: "How?" A creative solution is great. A solution that breaks the law or your company's rules is not.`,
    vocab: [
      { word: 'Harmless', definition: 'Not causing any damage or hurt.' },
      { word: 'Anthropologist', definition: 'A person who studies human societies and cultures.' },
      { word: 'Symbol', definition: 'Something that represents a bigger idea.' },
      { word: 'Grey zone', definition: 'A situation that is not clearly right or wrong.' },
    ],
    phrases: [
      { en: 'Do you know who you\'re talking to?', local: 'Você sabe com quem está falando?', phonetic: 'Voh-SEH SAH-bee kohn keyn es-TAH fah-LAHN-doo', note: 'A famous phrase used to show status. Today it sounds arrogant — don\'t use it!' },
      { en: 'Just out of interest — how will that work?', local: '', phonetic: '', note: 'A polite way to check that a "jeitinho" solution is legal and safe.' },
      { en: 'I\'d prefer to do it the official way, if possible.', local: '', phonetic: '', note: 'Shows respect for the rules without accusing anyone.' },
    ],
    discussion: [
      'Where would you draw the line between a helpful favour and an unfair advantage?',
      'Is there a phrase like "Do you know who you\'re talking to?" in your language?',
      'Is it ever OK to "bend the truth" a little to get something done? Give an example.',
    ],
  },
  {
    title: 'The Jeitinho Across Latin America',
    emoji: '🌎',
    reading: `The jeitinho is a Brazilian word, but similar ideas exist across Latin America — each with its own name and its own good and bad sides.

Argentina — "viveza criolla". This means something like "local cleverness". It describes a quick, sharp, street-smart way of thinking. At its best, it means being resourceful and quick-thinking. At its worst, it means taking advantage of others — and many Argentine writers have criticised it.

Argentina also has a funny expression for improvised fixes: "atado con alambre" — "tied together with wire". It describes something that works, but only just — like a car held together with wire and tape. Argentines often use it to joke about their own country's creative, temporary solutions.

Mexico. Mexicans have a strong culture of "resolver" — solving problems with whatever is available. But there is also a well-known, critical saying: "El que no transa, no avanza" — "If you don't cheat, you don't get ahead." Many Mexicans use it ironically, to criticise a culture of shortcuts, not to recommend it.

Peru — "la criollada". Similar to viveza criolla, it can mean clever creativity or cheeky rule-breaking.

Across the region, these ideas show something important. People often have to deal with complicated systems, slow bureaucracy, and economic uncertainty. Creativity and flexibility help them survive. But many Latin Americans also want stronger rules, fairer institutions, and less need for "jeitinhos" in the first place.`,
    vocab: [
      { word: 'Resourceful', definition: 'Good at finding ways to solve problems with what you have.' },
      { word: 'Take advantage of', definition: 'To use someone unfairly for your own benefit.' },
      { word: 'Ironically', definition: 'Saying the opposite of what you mean, often to criticise or joke.' },
      { word: 'Cheeky', definition: 'Slightly rude or disrespectful, but often in a funny way.' },
    ],
    phrases: [
      { en: 'Tied together with wire.', local: 'Atado con alambre.', phonetic: 'Ah-TAH-doh kohn ahl-AHM-breh', note: 'Argentina. Describes a fix that works — but only just.' },
      { en: 'Local cleverness.', local: 'Viveza criolla.', phonetic: 'Vee-VEH-sah kree-OH-yah', note: 'Argentina. Can be a compliment or a criticism.' },
      { en: 'Let\'s solve it.', local: 'Lo resolvemos.', phonetic: 'Loh reh-sohl-VEH-mohs', note: 'Spanish. A positive, problem-solving phrase.' },
      { en: 'If you don\'t cheat, you don\'t get ahead.', local: 'El que no transa, no avanza.', phonetic: 'El keh noh TRAHN-sah, noh ah-VAHN-sah', note: 'Mexico. Usually said ironically to criticise shortcuts.' },
    ],
    discussion: [
      'Is there an expression like "tied together with wire" in your language?',
      'Why do you think people say "if you don\'t cheat, you don\'t get ahead" ironically?',
      'Do complicated systems make people more creative — or more likely to break rules?',
    ],
  },
  {
    title: 'When It Crosses the Line',
    emoji: '⚖️',
    reading: `Sometimes a "creative solution" is simply corruption. Every businessperson in Latin America needs to recognise the difference.

In Mexico, a small bribe is sometimes called a "mordida" — literally "a bite". In other countries, a bribe may be politely described as a "propina" (tip), a "regalito" (little gift), or a payment to "speed things up". Whatever the name, paying an official to ignore a rule, approve a permit, or win a contract is illegal.

Latin American countries have taken strong action against corruption in recent years. In Brazil, a huge investigation called "Lava Jato" ("Car Wash"), which began in 2014, uncovered corruption involving major companies and politicians and led to many arrests. Brazil also passed a "Clean Company Act" in 2013, which allows companies — not only individuals — to be punished for bribery. Other countries in the region have also strengthened their laws.

Foreign companies must also follow the laws of their home countries. Laws like the US Foreign Corrupt Practices Act and the UK Bribery Act apply to bribes paid anywhere in the world, including through local agents or "consultants".

How to stay safe:

Know the rules. Learn your company's policy on gifts, payments, and agents.

Ask questions. If someone offers to "find a jeitinho", ask exactly how it will work.

Be careful with fixers. Use registered professionals, such as accountants and lawyers.

Get receipts. Official payments should have official receipts.

Walk away if needed. No deal is worth breaking the law.`,
    vocab: [
      { word: 'Bribe', definition: 'Money or a gift given to someone to persuade them to do something dishonest.' },
      { word: 'Investigation', definition: 'A careful examination to discover the truth about something.' },
      { word: 'Uncover', definition: 'To discover something that was hidden.' },
      { word: 'Receipt', definition: 'A piece of paper that shows you have paid for something.' },
    ],
    phrases: [
      { en: 'A bribe. (Mexico, informal)', local: 'Una mordida', phonetic: 'OO-nah mor-DEE-dah', note: 'Literally "a bite". Know the word — but never pay one.' },
      { en: 'Could I have an official receipt, please?', local: '¿Me puede dar un recibo oficial, por favor?', phonetic: 'Meh PWEH-deh dar oon reh-SEE-boh oh-fee-SYAHL, por fah-VOR', note: 'Spanish. Official payments should always come with official receipts.' },
      { en: 'I\'m sorry, our company can\'t do that.', local: 'Lo siento, nuestra empresa no puede hacer eso.', phonetic: 'Loh SYEN-toh, NWES-trah em-PREH-sah noh PWEH-deh ah-SEHR EH-soh', note: 'Spanish. Refuse politely and blame company rules, not the person.' },
    ],
    discussion: [
      'Why do you think people use soft words like "tip" or "little gift" for bribes?',
      'What would you do if a "consultant" offered to speed up a permit for a cash payment?',
      'Do you think strong anti-corruption laws can change a culture? How long might it take?',
    ],
  },
  {
    title: 'The Good Jeitinho at Work',
    emoji: '🛠️',
    reading: `So how can you use the positive side of the jeitinho — creativity, flexibility, and problem-solving — without crossing the line?

Ask "Is there another way?" When a plan fails, do not just stop. Ask your team to think creatively. Latin American colleagues are often very good at this.

Value improvisation. In some cultures, changing the plan is seen as failure. In Latin America, a team that adapts quickly to a problem is often admired.

Build relationships. Many positive jeitinhos come from people who want to help you because they like and trust you. Be polite, patient, and friendly — with clerks, receptionists, drivers, and assistants, not only senior managers.

Explain your situation. Instead of demanding, explain the problem and ask for help. "I'm flying home tomorrow and I really need this document. Is there anything we can do?" This invites people to find a solution.

Stay inside the law. Creativity is about finding better ways, not about breaking rules. Check that any solution is legal and transparent.

Balance with planning. Flexibility is powerful, but it works best with a good plan behind it. If you come from a culture of careful planning, you can bring that strength — and learn flexibility from your Latin American colleagues.

The best international teams combine both: the careful planning of Japan or Germany, and the creative flexibility of Brazil or Mexico.`,
    vocab: [
      { word: 'Admire', definition: 'To respect and approve of someone or something.' },
      { word: 'Demand', definition: 'To ask for something very firmly, as if you have the right to it.' },
      { word: 'Transparent', definition: 'Open and honest, with nothing hidden.' },
      { word: 'Combine', definition: 'To put two or more things together.' },
    ],
    phrases: [
      { en: 'Is there anything we can do?', local: '¿Hay algo que podamos hacer? / Tem algo que a gente possa fazer?', phonetic: 'Eye AHL-goh keh poh-DAH-mohs ah-SEHR / Teyn AHL-goo kee ah ZHEN-chee POH-sah fah-ZEHR', note: 'Spanish / Portuguese. Invites a creative, helpful solution.' },
      { en: 'Let\'s think outside the box.', local: '', phonetic: '', note: 'An English expression meaning "let\'s think creatively".' },
      { en: 'What\'s our Plan B?', local: '', phonetic: '', note: 'A useful question when the first plan is not working.' },
      { en: 'Thank you so much for your help — I really appreciate it.', local: '', phonetic: '', note: 'Always thank people who find a way to help you.' },
    ],
    discussion: [
      'Is changing the plan seen as a strength or a failure in your culture?',
      'What can planning cultures and flexible cultures learn from each other?',
      'Describe a time when you or your team had to improvise. What happened?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. Is this a good jeitinho, a grey zone, or crossing the line? What should the person do?

Situation 1: The Broken Machine
Kazuki, a Japanese engineer, is visiting a factory in Manaus, Brazil. A machine breaks, and the replacement part will take three weeks to arrive from Japan. A Brazilian technician says, "Don't worry, I'll find a jeitinho," and fixes it the same day with a part from another machine. Kazuki is worried it is not "the correct procedure". What should he do?

Situation 2: The Fast Permit
Hye-jin, from Korea, is opening an office in Mexico City. A man introduces himself as a "gestor" and promises to get her business permit in one week instead of three months — for a large cash payment, with no receipt. What should she do?

Situation 3: The Queue
Omar, from Saudi Arabia, is waiting in a long queue at a bank in São Paulo. His Brazilian colleague says, "Wait here — my cousin works here, I'll get you to the front." Omar feels uncomfortable. What could he say?

Situation 4: The Late Delivery
Liu Yang, from China, needs a delivery to reach Santiago before a trade fair on Monday. On Friday, the shipping company says it is impossible. Liu explains her situation politely to the manager, who calls a colleague and arranges a special weekend delivery for an extra (official) fee. Is this a good jeitinho? Why?

Situation 5: The Important Person
At a restaurant in Buenos Aires, a customer is told there are no free tables. He says loudly, "Do you know who I am? I know the owner!" Other customers look annoyed. What does this show about the "dark side" of connections?`,
    vocab: [
      { word: 'Replacement', definition: 'A new thing that takes the place of an old or broken one.' },
      { word: 'Procedure', definition: 'The official or correct way of doing something.' },
      { word: 'Shipping', definition: 'The business of sending goods from one place to another.' },
      { word: 'Annoyed', definition: 'Slightly angry.' },
    ],
    phrases: [],
    discussion: [
      'Rank the five situations from "good jeitinho" to "crossing the line". Explain your order.',
      'In Situation 1, should Kazuki accept the fix? What risks should he check?',
      'In Situation 3, what exactly could Omar say to his colleague? Practise it with the AI.',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

The jeitinho brasileiro: The "little Brazilian way" — finding a way around a problem through creativity, flexibility, or personal connections. "Vamos dar um jeito" means "Let's find a way."

The good jeitinho: A survival skill shaped partly by Brazil's history of hyperinflation. It shows up as creativity, flexibility, great customer service, and people helping each other.

The grey zone: Jumping queues, avoiding fines, bending the truth, and "Você sabe com quem está falando?" — using status to escape rules. Not always illegal, but not always fair.

Across Latin America: Argentina's "viveza criolla" and "atado con alambre", Mexico's culture of "resolver" and the ironic saying "El que no transa, no avanza", and Peru's "criollada".

Crossing the line: Bribes, whether called a "mordida", a "propina", or a "regalito", are illegal. Brazil's "Lava Jato" investigation and anti-corruption laws show the region is taking action. Foreign laws also apply.

Using the good jeitinho at work: Ask "Is there another way?", value improvisation, build relationships at every level, explain your situation, stay inside the law, and combine flexibility with good planning.`,
    vocab: [
      { word: 'Shape', definition: 'To influence how something develops.' },
      { word: 'Status', definition: 'A person\'s position or importance in society.' },
      { word: 'Escape', definition: 'To get away from something.' },
      { word: 'Value', definition: 'To think that something is important.' },
    ],
    phrases: [],
    discussion: [
      'Do you think the jeitinho is more positive or more negative overall? Why?',
      'Is there a word for the jeitinho in your culture? How do people feel about it?',
      'Compare: how do people in your country solve problems when the rules make things difficult?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "O Jeitinho Brasileiro — creative problem-solving and flexibility in Brazil and Latin America (viveza criolla, resolver), the grey zone of bending rules, and where the line with corruption is". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function JeitinhoBrasileiroPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🪄</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 5 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>O Jeitinho Brasileiro</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Creative problem-solving — or bending the rules?</p>
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
