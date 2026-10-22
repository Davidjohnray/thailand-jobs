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
    title: 'Why Greetings Matter in Latin America',
    emoji: '🤝',
    reading: `Imagine you arrive for your first meeting at a company in Mexico City. You hold out your hand for a handshake. Your Mexican colleague shakes it — and then leans in and kisses you on the cheek. Ten minutes later, another colleague arrives and gives your manager a big hug with two strong pats on the back. Welcome to Latin America.

In much of Asia, business greetings keep a polite distance: a bow, a wai, a light handshake. In Latin America, greetings are usually warmer and more physical. People stand closer, touch each other's arms while talking, and may greet with a kiss on the cheek (a "beso") or a hug (an "abrazo" in Spanish, an "abraço" in Portuguese).

This warmth is not unprofessional. In Latin American culture, business is built on personal relationships. A warm greeting says, "I see you as a person, not just a business contact." A cold or very short greeting can make you seem distant, arrogant, or uninterested.

But the rules are not the same everywhere. Mexico, Brazil, Argentina, Colombia, Chile, and Peru all have their own customs. The number of kisses changes. Who kisses whom changes. And in formal business, a handshake is still the safest start.

In this lesson, you will learn how people greet each other across Latin America, how to use names and titles correctly, and how to handle the moment when you are not sure whether to shake, hug, or kiss.`,
    vocab: [
      { word: 'Physical', definition: 'Connected with the body, such as touching.' },
      { word: 'Pat', definition: 'To touch someone gently and quickly with your open hand.' },
      { word: 'Distant', definition: 'Not friendly or warm; keeping away from close contact.' },
      { word: 'Custom', definition: 'A traditional way of doing something in a particular culture.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'How do people greet each other in business in your country? Is there any physical contact?',
      'How would you feel if a new business contact kissed you on the cheek? Why?',
    ],
  },
  {
    title: 'Mexico — Handshakes, Besos and Titles',
    emoji: '🇲🇽',
    reading: `In Mexico, a first business meeting usually starts with a handshake. The handshake is friendly and not too strong, and it may last a little longer than in the USA or Europe. Make eye contact and smile.

As the relationship grows, greetings become warmer. Women often greet both men and women with one light kiss on the right cheek — usually more of a cheek touch with a kissing sound than a real kiss. Men who know each other well often give an "abrazo": a short hug with a couple of pats on the back, sometimes combined with a handshake. Let the Mexican person lead. If they move towards a beso or an abrazo, it is a sign that they feel comfortable with you.

Titles are very important in Mexican business. People with a university degree are often called by their professional title, not "Mr." or "Mrs.". A person with a bachelor's degree may be called "Licenciado" or "Licenciada" (Lic.). An engineer is "Ingeniero" or "Ingeniera" (Ing.). An architect is "Arquitecto" (Arq.). A doctor or a person with a PhD is "Doctor" or "Doctora". You will see these titles on business cards, emails, and office doors. Using them shows respect.

Mexicans also use the formal "usted" (you) with people they do not know well, older people, and senior managers. Wait until someone invites you to use the informal "tú".

Finally, greet everyone in the room, not just the most important person — and say goodbye to everyone when you leave.`,
    vocab: [
      { word: 'Degree', definition: 'A qualification you receive after finishing a university course.' },
      { word: 'Bachelor\'s degree', definition: 'A first university degree, usually after three or four years of study.' },
      { word: 'Lead', definition: 'Here: to be the first to act, so others can follow.' },
      { word: 'Formal', definition: 'Following official or polite rules; not casual.' },
    ],
    phrases: [
      { en: 'Nice to meet you.', local: 'Mucho gusto.', phonetic: 'MOO-cho GOOS-toh', note: 'The standard polite phrase for a first meeting. Say it with a handshake.' },
      { en: 'Pleased to meet you.', local: 'Encantado / Encantada.', phonetic: 'En-kan-TAH-doh / En-kan-TAH-dah', note: 'Encantado if you are a man, encantada if you are a woman.' },
      { en: 'How are you? (formal)', local: '¿Cómo está usted?', phonetic: 'KOH-moh es-TAH oo-STED', note: 'Uses "usted" — the polite form. Safe for any business situation.' },
      { en: 'Good morning, Licenciado García.', local: 'Buenos días, licenciado García.', phonetic: 'BWAY-nohs DEE-ahs, lee-sen-see-AH-doh gar-SEE-ah', note: 'Using a person\'s professional title is a sign of respect in Mexico.' },
    ],
    discussion: [
      'Are professional titles like "Engineer" or "Doctor" used in your country? When?',
      'Why do you think Mexicans let the relationship grow before using besos and abrazos?',
      'Is there a formal and informal "you" in your language? How do you decide which to use?',
    ],
  },
  {
    title: 'Brazil — Beijinhos and Abraços',
    emoji: '🇧🇷',
    reading: `Brazilians are famous for their warmth, and their greetings show it.

In a first business meeting, a handshake is normal, especially between men. But Brazilians often add a friendly touch — a hand on your shoulder or arm, or a pat on the back. Between women, and between men and women, a kiss on the cheek ("beijinho" — a little kiss) is very common, even quite early in a relationship.

How many kisses? It depends on the city. In São Paulo, one kiss is common. In Rio de Janeiro, two kisses — one on each cheek — are typical. In some places, people give three, sometimes as a wish for good luck. If you are not sure, follow the other person and do not worry too much. Brazilians usually find a foreigner's confusion funny, not rude.

Men who are friends often greet with an "abraço" — a hug with strong pats on the back. In fact, "um abraço" (a hug) is also a very common way to end emails and messages, even in business. "Abraços" or "Um abraço" at the end of an email is friendly, not too personal.

Brazilians often use first names quickly, even in business. But they may add "Senhor" or "Senhora" for older or senior people — and often with the first name, not the family name: "Senhor Paulo", not "Senhor Silva". Doctors, lawyers, and other senior professionals are sometimes called "Doutor" or "Doutora" as a sign of respect.

One very important rule: Brazilians speak Portuguese, not Spanish. Speaking Spanish to a Brazilian may be understood — but it is not appreciated!`,
    vocab: [
      { word: 'Warmth', definition: 'Friendliness and kindness towards other people.' },
      { word: 'Typical', definition: 'Normal for a particular person, place, or situation.' },
      { word: 'Confusion', definition: 'A state of not being sure what is happening or what to do.' },
      { word: 'Appreciate', definition: 'To be pleased about something and see its value.' },
    ],
    phrases: [
      { en: 'Nice to meet you.', local: 'Prazer.', phonetic: 'Prah-ZEHR', note: 'Short and very common. "Muito prazer" means "very nice to meet you".' },
      { en: 'All good? — All good!', local: 'Tudo bem? — Tudo bom!', phonetic: 'TOO-doo BEYN? — TOO-doo BOHN!', note: 'The most common Brazilian greeting. Use it everywhere.' },
      { en: 'Good morning.', local: 'Bom dia.', phonetic: 'Bohn JEE-ah', note: 'Say it to everyone when you arrive — in the office, the lift, or a shop.' },
      { en: 'A hug (email ending).', local: 'Um abraço.', phonetic: 'Oong ah-BRAH-soo', note: 'A warm but professional way to end emails and messages in Brazil.' },
    ],
    discussion: [
      'Would you feel comfortable ending a business email with "a hug"? Why or why not?',
      'Why do you think the number of kisses is different in different cities?',
      'Brazilians use first names quickly. Is this the same or different in your country?',
    ],
  },
  {
    title: 'Argentina, Colombia, Chile and Peru',
    emoji: '🌎',
    reading: `Each Spanish-speaking country in Latin America has its own greeting style. Here are four important business markets.

Argentina. Argentines are very warm. One kiss on the right cheek is the standard greeting between women, and between men and women. What surprises many visitors is that Argentine men who know each other — friends, family, and sometimes close colleagues — also often greet each other with a kiss on the cheek. In a first business meeting, however, a handshake is normal. Argentines also like long conversations and strong opinions, so be ready to talk about football, politics, and food.

Colombia. Colombians are known for being very polite and friendly. A firm handshake with eye contact is normal in business. Women often greet with one kiss on the cheek. Colombians frequently use the title "Doctor" for professionals as a sign of respect, even for people who do not have a PhD. You will also hear the phrase "a la orden" ("at your service") many times a day.

Chile. Chilean business culture is often a little more formal and reserved than in other Latin American countries. Handshakes are normal at first meetings, and one kiss on the cheek is common between women and between men and women once people know each other. Chileans value punctuality more than many of their neighbours.

Peru. In Peru, a handshake is standard for first meetings. Women and close friends often greet with one kiss on the right cheek. Peruvians are generally polite and indirect, especially with people they do not know well.

The common rule across the region: start with a handshake, then follow the other person's lead.`,
    vocab: [
      { word: 'Market', definition: 'Here: a country or area where a company sells its products.' },
      { word: 'Reserved', definition: 'Not showing your feelings or opinions openly.' },
      { word: 'Punctuality', definition: 'The habit of being on time.' },
      { word: 'Follow someone\'s lead', definition: 'To do what another person does first.' },
    ],
    phrases: [
      { en: 'How\'s it going? (Argentina, informal)', local: '¿Qué tal?', phonetic: 'Keh TAHL', note: 'Friendly and common. Use with colleagues once you know them.' },
      { en: 'At your service.', local: 'A la orden.', phonetic: 'Ah lah OR-den', note: 'Very common in Colombia — in shops, offices, and on the phone.' },
      { en: 'What\'s up? (Colombia, informal)', local: '¿Qué más?', phonetic: 'Keh MAHS', note: 'A casual Colombian greeting. Literally "what else?".' },
      { en: 'Good afternoon.', local: 'Buenas tardes.', phonetic: 'BWAY-nahs TAR-dess', note: 'Used from about noon until evening across Spanish-speaking Latin America.' },
    ],
    discussion: [
      'Which country\'s greeting style would be most comfortable for you? Why?',
      'Argentine men often kiss each other on the cheek. How would people react to this in your country?',
      'Why do you think "start with a handshake, then follow their lead" is a good rule?',
    ],
  },
  {
    title: 'Personal Space, Touch and Saying Goodbye',
    emoji: '👋',
    reading: `Greetings are only the start. During the conversation, Latin American body language may feel very different from what you are used to — especially if you come from East Asia.

Personal space. People in Latin America usually stand closer to each other when they talk. If you step back to make more space, your colleague may step forward again. Stepping back too much can seem cold or unfriendly.

Touch. Touching someone's arm, shoulder, or back during a conversation is normal and friendly. It shows interest and warmth — it is not usually romantic or aggressive.

Eye contact. Good eye contact shows honesty and interest. Looking down or away too much may make you seem shy, nervous, or even untrustworthy. This is very different from some Asian cultures, where lowering your eyes shows respect.

Greeting everyone. When you enter a meeting, office, or small shop, greet everyone — not just the boss. In many places, people even say "buenos días" or "bom dia" when they enter a lift.

Saying goodbye. Leaving is just as important as arriving. In Latin America, it can be rude to leave a meeting or party with one general "bye". People often say goodbye to each person individually — with a handshake, a kiss, or a hug. This can take a long time! Many Latin Americans joke that saying goodbye at a family party takes half an hour.

The key idea: in Latin America, warmth and personal attention show respect.`,
    vocab: [
      { word: 'Personal space', definition: 'The area around your body that you feel is your own.' },
      { word: 'Romantic', definition: 'Connected with love between two people.' },
      { word: 'Untrustworthy', definition: 'Not able to be trusted.' },
      { word: 'Individually', definition: 'Separately; one by one.' },
    ],
    phrases: [
      { en: 'Good morning, everyone!', local: '¡Buenos días a todos!', phonetic: 'BWAY-nohs DEE-ahs ah TOH-dohs', note: 'Spanish. A good way to greet a whole room when you arrive.' },
      { en: 'See you later.', local: 'Hasta luego.', phonetic: 'AHS-tah LWAY-goh', note: 'Spanish. A common and polite goodbye.' },
      { en: 'Bye! See you!', local: 'Tchau! Até logo!', phonetic: 'Chow! Ah-TEH LOH-goo!', note: 'Portuguese. "Tchau" is very common in Brazil.' },
      { en: 'It was a pleasure.', local: 'Fue un placer. / Foi um prazer.', phonetic: 'Fweh oon plah-SEHR / Foy oong prah-ZEHR', note: 'Spanish / Portuguese. A warm way to say goodbye after a meeting.' },
    ],
    discussion: [
      'How close do people stand when they talk in your country? Show it with a partner if you can.',
      'Is looking someone in the eye a sign of respect or disrespect in your culture?',
      'Do you say goodbye to everyone individually when you leave a party? Why or why not?',
    ],
  },
  {
    title: 'Names, Surnames, Tú and Usted',
    emoji: '🏷️',
    reading: `Using someone's name correctly is an important part of a good greeting. Latin American names can confuse foreigners, so here are the basics.

Two surnames. In Spanish-speaking countries, most people have two surnames. The first comes from their father, and the second from their mother. For example, in the name María González López, "González" is her father's surname and "López" is her mother's. In business, you usually use the first surname: "Señora González", not "Señora López". On formal documents, both surnames are used.

Brazilian names. Brazilians also often have more than one surname, but the order is usually different — the mother's surname often comes first and the father's surname last. In everyday business, however, Brazilians use first names much more than family names. You may be called "Senhor David" or just "David" very quickly.

Tú and usted. Spanish has two words for "you". "Tú" is informal — for friends, family, children, and colleagues you know well. "Usted" is formal — for older people, senior managers, customers, and people you have just met. In Colombia, some people use "usted" even with close friends and family. If you are not sure, use "usted" and wait for the other person to say "puedes tutearme" ("you can use tú with me").

Você and o senhor. In Brazilian Portuguese, "você" is the normal word for "you" and is used in most situations. With older or very senior people, Brazilians may use "o senhor" (for a man) or "a senhora" (for a woman) to show respect.

Getting names and forms of address right is a small thing — but it tells people that you care.`,
    vocab: [
      { word: 'Surname', definition: 'Your family name, which you share with other members of your family.' },
      { word: 'Document', definition: 'An official paper or file with information on it.' },
      { word: 'Informal', definition: 'Relaxed and friendly; not following official rules.' },
      { word: 'Form of address', definition: 'The name or title you use when you speak or write to someone.' },
    ],
    phrases: [
      { en: 'You can use "tú" with me.', local: 'Puedes tutearme.', phonetic: 'PWAY-des too-teh-AR-meh', note: 'Said by someone who wants to be less formal with you. Now you can use "tú".' },
      { en: 'What is your name? (formal)', local: '¿Cómo se llama usted?', phonetic: 'KOH-moh seh YAH-mah oo-STED', note: 'Polite Spanish. Use with people you have just met.' },
      { en: 'Mr. / Mrs. (with first name, Brazil)', local: 'Senhor Paulo / Senhora Ana', phonetic: 'Seh-NYOR POW-loo / Seh-NYOR-ah AH-nah', note: 'Brazilians often use Senhor/Senhora with the first name, not the surname.' },
      { en: 'Please, call me Carlos.', local: 'Por favor, llámame Carlos.', phonetic: 'Por fah-VOR, YAH-mah-meh KAR-lohs', note: 'A friendly way to invite someone to use your first name.' },
    ],
    discussion: [
      'How many surnames do people have in your country? Whose surname comes first?',
      'Does your language have different words for formal and informal "you"? When do you switch?',
      'Have you ever used the wrong name or title for someone? What happened?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. Something has gone wrong — or is about to. What should the person do?

Situation 1: The Bow and the Hug
Takeshi, a Japanese manager, meets his Mexican partner, Ingeniero Ramírez, for the third time in Guadalajara. Takeshi bows politely. At the same moment, Ramírez opens his arms for an abrazo. They nearly bump heads and both laugh nervously. What could Takeshi do next time? What could Ramírez do?

Situation 2: The Kiss Surprise
Ahmed, a Saudi businessman, is in São Paulo. A Brazilian female colleague walks towards him to greet him with a kiss on the cheek. For personal and religious reasons, Ahmed does not greet women this way. What can he do to stay respectful without making her feel embarrassed?

Situation 3: The Wrong Surname
Ji-hoon from Korea writes an email to "Dear Ms. López". The woman's full name is Ana Martínez López. She replies politely but signs her name "Ana Martínez". What was Ji-hoon's mistake?

Situation 4: The Quick Exit
At the end of a long dinner with eight Colombian clients, Wei, a Chinese sales manager, stands up, waves to the whole table, says "Thank you, goodnight!" and leaves. The next day, a colleague tells him that some clients felt he was cold. Why? What should Wei do next time?

Situation 5: The Step Back
Hana, from Japan, is talking with an Argentine supplier at a trade fair. He stands very close and touches her arm while he talks. She steps back. He steps forward. She steps back again. By the end of the conversation, she is against the wall. How could Hana handle this situation?`,
    vocab: [
      { word: 'Bump', definition: 'To hit something lightly by accident.' },
      { word: 'Religious', definition: 'Connected with religion or a belief in God.' },
      { word: 'Exit', definition: 'The act of leaving a place.' },
      { word: 'Trade fair', definition: 'A large event where companies show and sell their products.' },
    ],
    phrases: [],
    discussion: [
      'Which situation would be the most uncomfortable for you? Why?',
      'In Situation 2, what exactly could Ahmed say or do? Practise it with the AI.',
      'Have you ever been confused about how to greet someone from another culture?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

Why greetings matter: In Latin America, greetings are warmer and more physical than in much of Asia. Warmth shows that you value the person, not just the business.

Mexico: Start with a handshake. Besos (one cheek kiss) and abrazos (hugs with pats on the back) come as the relationship grows. Use professional titles like Licenciado, Ingeniero, and Doctor. Use "usted" until invited to use "tú".

Brazil: Handshakes plus friendly touches. Kisses on the cheek are common — one in São Paulo, two in Rio, sometimes three elsewhere. "Um abraço" is a friendly email ending. Brazilians speak Portuguese, not Spanish.

Argentina, Colombia, Chile, and Peru: One kiss on the right cheek is common. Argentine men who know each other may also kiss. Colombians often use "Doctor" for professionals. Chileans tend to be more formal and punctual.

Personal space and goodbyes: People stand closer, touch arms and shoulders, and make strong eye contact. Greet everyone when you arrive, and say goodbye to each person individually.

Names: Spanish speakers usually have two surnames — use the first one. Brazilians often use first names, even with Senhor or Senhora.

The golden rule: start with a handshake, then follow the other person's lead.`,
    vocab: [
      { word: 'Value', definition: 'To think that someone or something is important.' },
      { word: 'Punctual', definition: 'Arriving or doing something at the right time.' },
      { word: 'Golden rule', definition: 'The most important rule or principle to remember.' },
      { word: 'Principle', definition: 'A basic idea or rule that guides how you behave.' },
    ],
    phrases: [],
    discussion: [
      'What is the biggest difference between greetings in Latin America and in your country?',
      'Which Latin American greeting would you find the hardest to get used to? Why?',
      'Compare: how is greeting someone in Latin America different from greeting someone in Japan or Thailand?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "Besos, Abrazos and Handshakes — business greetings, personal space, names, titles and tú/usted in Mexico, Brazil, Argentina, Colombia, Chile and Peru". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function BesosAbrazosHandshakesPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🤝</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 1 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>Besos, Abrazos and Handshakes</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Greetings and first impressions across Latin America</p>
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
