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
    title: 'Why Trust Comes First',
    emoji: '🤲',
    reading: `In Spanish, the word "confianza" means trust, confidence, and closeness. In Latin American business, it may be the most important word of all.

In many Western countries, people do business first and become friends later — if they become friends at all. A good product, a fair price, and a clear contract are often enough to start working together.

In much of Latin America, the order is the opposite. People want to know you first. Do you seem honest? Will you be loyal? Do you care about them as people? Only when they feel confianza will they feel comfortable doing serious business with you.

Why is personal trust so important? One reason is history. In many Latin American countries, people have experienced economic crises, sudden changes in government, and slow or unreliable legal systems. When institutions are not always reliable, people depend more on people they know and trust — family, friends, and long-term partners.

This idea is sometimes called "personalismo": business relationships are with a person, not just with a company. If your contact person leaves the company, the relationship may leave with them.

This is very similar to "guanxi" in China. In both cultures, a contract is important, but the relationship is what makes business work.

In this lesson, you will learn how confianza is built, the role of family and networks, how WhatsApp became the centre of business communication, and how trust can be lost.`,
    vocab: [
      { word: 'Closeness', definition: 'A feeling of being close to someone emotionally.' },
      { word: 'Crisis', definition: 'A time of great difficulty or danger.' },
      { word: 'Institution', definition: 'An important organisation, such as a bank, court, or government department.' },
      { word: 'Unreliable', definition: 'Not able to be trusted or depended on.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'In your country, do people do business first and become friends later, or the opposite?',
      'Why do you think people trust friends more than institutions in some countries?',
    ],
  },
  {
    title: 'Building Confianza',
    emoji: '☕',
    reading: `Confianza cannot be rushed, but there are clear ways to build it.

Small talk is big talk. Meetings in Latin America often start with 10, 20, or even 30 minutes of conversation before anyone talks about business. People ask about your family, your trip, your weekend, and your opinion of their country. This is not wasted time — it is the most important part of the meeting.

Good topics. Family, food, football, travel, music, and the local city are all great topics. Show real interest in the country. Learn the name of the local football team, try the local food, and ask for recommendations. Latin Americans are proud of their countries and enjoy sharing them.

Topics to be careful with. Politics, religion, and comparisons with other countries can be sensitive, especially at a first meeting. Never call the United States "America" — for Latin Americans, America is the whole continent, and they are Americans too.

Meet in person. Video calls are useful, but face-to-face meetings build confianza much faster. Flying in for a meeting shows that the relationship matters to you.

Share a meal. Lunch or dinner is where many relationships really begin. (You will learn more about this in the next lesson.)

Be consistent. Keep your promises, reply to messages, and stay in touch even when you do not need anything.

Show your personal side. Sharing a little about your own family or hobbies helps people see you as a person, not just a business contact.`,
    vocab: [
      { word: 'Small talk', definition: 'Polite, friendly conversation about everyday topics.' },
      { word: 'Recommendation', definition: 'A suggestion about what is good to do, see, or eat.' },
      { word: 'Sensitive', definition: 'Likely to upset people, so you need to be careful.' },
      { word: 'Continent', definition: 'One of the large areas of land on Earth, like Asia or America.' },
    ],
    phrases: [
      { en: 'How was your weekend?', local: '¿Qué tal tu fin de semana?', phonetic: 'Keh TAHL too feen deh seh-MAH-nah', note: 'Spanish. A friendly start to any Monday meeting.' },
      { en: 'What do you recommend I try here?', local: '¿Qué me recomiendas probar aquí?', phonetic: 'Keh meh reh-koh-MYEN-dahs proh-BAR ah-KEE', note: 'Spanish. People love to recommend local food and places.' },
      { en: 'All good with your family?', local: 'Tudo bem com a família?', phonetic: 'TOO-doo BEYN kohn ah fah-MEE-lyah', note: 'Portuguese. Shows personal interest — very important in Brazil.' },
      { en: 'I love this city!', local: '¡Me encanta esta ciudad! / Adoro esta cidade!', phonetic: 'Meh en-KAN-tah ES-tah syoo-DAHD / Ah-DOH-roo ES-tah see-DAH-jee', note: 'Spanish / Portuguese. Showing love for their country builds warmth quickly.' },
    ],
    discussion: [
      'How long is small talk before a business meeting in your country?',
      'What topics are safe for small talk in your culture? Which are not?',
      'What would you tell a foreign visitor to try in your city?',
    ],
  },
  {
    title: 'Family and Compadrazgo',
    emoji: '👨‍👩‍👧‍👦',
    reading: `In Latin America, family is at the centre of life — and often at the centre of business too.

Many companies, from small shops to large corporations, are owned and run by families. Brothers, sisters, cousins, and in-laws may all work in the same business. When you build a relationship with a family business, you are building a relationship with the whole family.

Family also includes people who are not related by blood. In many Latin American countries, "compadrazgo" — the godparent relationship — creates strong, lifelong bonds. When a child is baptised, the parents choose a "padrino" (godfather) and "madrina" (godmother). The parents and godparents then call each other "compadre" and "comadre". This is a serious relationship of trust and mutual support.

Godparents are also chosen for other important events, such as weddings and a girl's fifteenth birthday party, the "quinceañera". Being asked to be a padrino is an honour.

In business, a "compadre" can be a very powerful connection. People help their compadres find jobs, get loans, solve problems, and make introductions. The words "compadre" and "compa" are also used more casually between close male friends.

For foreigners, the lesson is clear. Ask about family, remember names, and show respect for family events. If a business partner invites you to a family celebration, it is a sign of real confianza. Go if you can — and bring a small gift.`,
    vocab: [
      { word: 'In-law', definition: 'A relative of your husband or wife, such as a mother-in-law.' },
      { word: 'Godparent', definition: 'A person who promises to help guide a child, often chosen at a religious ceremony.' },
      { word: 'Baptise', definition: 'To perform a Christian ceremony that welcomes a person into the church.' },
      { word: 'Mutual support', definition: 'When two people help each other.' },
    ],
    phrases: [
      { en: 'Godfather / Godmother.', local: 'Padrino / Madrina', phonetic: 'Pah-DREE-noh / Mah-DREE-nah', note: 'Also used for sponsors at weddings and quinceañeras.' },
      { en: 'Co-father / Co-mother (godparent bond).', local: 'Compadre / Comadre', phonetic: 'Kom-PAH-dreh / Koh-MAH-dreh', note: 'What parents and godparents call each other. A strong lifelong bond.' },
      { en: 'Buddy, mate. (Mexico, informal)', local: 'Compa', phonetic: 'KOM-pah', note: 'A short, casual form of compadre between friends.' },
      { en: 'Thank you for inviting me — it\'s an honour.', local: 'Gracias por invitarme, es un honor.', phonetic: 'GRAH-syahs por een-vee-TAR-meh, es oon oh-NOR', note: 'A warm reply to an invitation to a family event.' },
    ],
    discussion: [
      'Are godparents important in your culture? What is their role?',
      'Would you like to work in a business with your family? Why or why not?',
      'If a business partner invited you to their child\'s birthday party, would you go? Why?',
    ],
  },
  {
    title: 'Palanca, Pituto and QI — Who You Know',
    emoji: '🔗',
    reading: `Just as China has guanxi, Latin American countries have their own words for using connections to get things done.

In Mexico, connections are called "palanca" — literally "a lever". A lever helps you lift something heavy with less effort. If you "tienes palanca" (have a lever), you know someone who can open a door for you — get a job interview, speed up a permit, or introduce you to an important client.

In Chile, the word is "pituto". A "pituto" is a contact who helps you get a job or opportunity. Chileans often joke that many jobs are found "por pituto" — through connections — rather than through job adverts.

In Brazil, people joke about "QI". Normally, QI means IQ — intelligence. But Brazilians say it also means "Quem Indica" — "who recommends you". In other words, your "QI" is not how smart you are, but who knows you!

In Peru, people talk about having "vara" — a stick — and in Argentina, an unfair favour based on connections may be called "acomodo".

Connections can be positive. They help build trust, make introductions faster, and create loyal networks. Recommendations from trusted people are often more valuable than a CV.

But connections can also be unfair. They can mean the best person does not get the job, or that rules are bent for friends. Many Latin Americans have mixed feelings about this. They use their contacts — but they also complain when others use theirs.`,
    vocab: [
      { word: 'Lever', definition: 'A bar that helps you lift or move something heavy.' },
      { word: 'Permit', definition: 'An official document that allows you to do something.' },
      { word: 'Advert', definition: 'A notice or announcement offering a job, product, or service.' },
      { word: 'Mixed feelings', definition: 'Having both positive and negative feelings about something.' },
    ],
    phrases: [
      { en: 'To have connections. (Mexico)', local: 'Tener palanca', phonetic: 'Teh-NEHR pah-LAHN-kah', note: 'Literally "to have a lever". Knowing someone who can help.' },
      { en: 'A useful contact. (Chile)', local: 'Un pituto', phonetic: 'Oon pee-TOO-toh', note: '"Lo consiguió por pituto" = "He got it through a contact."' },
      { en: 'Who recommends you. (Brazil)', local: 'QI — Quem Indica', phonetic: 'Keh-EE — Keyn een-JEE-kah', note: 'A Brazilian joke: your "QI" is who recommends you, not how smart you are.' },
      { en: 'Could you introduce me to...?', local: '¿Me podrías presentar a...?', phonetic: 'Meh poh-DREE-ahs preh-sen-TAR ah', note: 'Spanish. A polite way to ask a contact for an introduction.' },
    ],
    discussion: [
      'What is the word for "connections" in your language? Is it positive or negative?',
      'Is it fair to get a job through connections? When is it OK and when is it not?',
      'Have you ever helped someone get a job or opportunity? Did you feel good about it?',
    ],
  },
  {
    title: 'Business on WhatsApp',
    emoji: '💬',
    reading: `In much of Latin America, business does not happen by email. It happens on WhatsApp.

In Brazil, Mexico, Argentina, Colombia, and many other countries, WhatsApp is used for almost everything: arranging meetings, sending prices, sharing documents, confirming orders, and even closing deals. Many people check WhatsApp far more often than their email. An important email may wait days for a reply — a WhatsApp message may get an answer in minutes.

WhatsApp business culture has its own style.

It is personal. Messages often start with a greeting and a personal question before business: "Good morning, Carlos! How was your weekend? Quick question about the order..."

Voice messages are everywhere. Brazilians in particular love "áudios" — voice messages — and may send long ones instead of typing. Listening to and sending voice messages is a normal part of business.

Emojis are fine. A smile, a thumbs up, or a "🙏" is normal even in professional messages, especially once a relationship has started.

Groups are common. Projects often have WhatsApp groups with clients, suppliers, and team members.

Fast replies build trust. Replying quickly shows you care about the relationship. Leaving messages unread for days may seem cold.

For people from cultures where email is more formal, WhatsApp business can feel too casual at first. But in Latin America, being reachable and friendly on WhatsApp is an important part of building confianza.`,
    vocab: [
      { word: 'Arrange', definition: 'To plan or organise something.' },
      { word: 'Close a deal', definition: 'To successfully finish a business agreement.' },
      { word: 'Reachable', definition: 'Easy to contact.' },
      { word: 'Casual', definition: 'Relaxed and informal.' },
    ],
    phrases: [
      { en: 'Good morning! How are you? Quick question...', local: '¡Buen día! ¿Cómo estás? Una consulta rápida...', phonetic: 'Bwen DEE-ah! KOH-moh es-TAHS? OO-nah kon-SOOL-tah RAH-pee-dah', note: 'Spanish. A friendly way to start a business message.' },
      { en: 'I\'ll send you a voice message.', local: 'Vou te mandar um áudio.', phonetic: 'Voh chee man-DAR oong OW-joo', note: 'Portuguese. Voice messages are very common in Brazilian business.' },
      { en: 'Perfect, thank you!', local: '¡Perfecto, gracias! / Perfeito, obrigado!', phonetic: 'Per-FEK-toh, GRAH-syahs / Per-FAY-too, oh-bree-GAH-doo', note: 'Spanish / Portuguese. A quick, warm reply. Women say "obrigada" in Portuguese.' },
      { en: 'Hugs! (message ending)', local: '¡Abrazo! / Abraços!', phonetic: 'Ah-BRAH-soh / Ah-BRAH-soos', note: 'Spanish / Portuguese. A friendly way to finish a message.' },
    ],
    discussion: [
      'Do you use WhatsApp, LINE, KakaoTalk, or WeChat for work? How is it different from email?',
      'Do you like voice messages? Would you use them for business?',
      'Is it professional to use emojis in work messages? Why or why not?',
    ],
  },
  {
    title: 'How Confianza Is Lost',
    emoji: '💔',
    reading: `Confianza takes a long time to build — and it can be lost very quickly. Here are the most common mistakes foreigners make.

Being cold or rushed. Skipping small talk, checking your phone during conversation, or saying "Let's get straight to business" can make you seem uninterested in the person.

Changing your contact person. Because relationships are personal, sending a new manager without a proper introduction can damage the relationship. If your company must change the contact, the old contact should introduce the new one personally — ideally in person.

Breaking promises. If you say you will call, call. If you promise a sample by Friday, send it. Small broken promises add up.

Sending junior staff. If the other side sends their director, sending a junior employee can feel disrespectful.

Being too pushy. Pressing for a fast decision or a signature before the relationship is ready can make people suspicious.

Disappearing. Contacting people only when you need something makes them feel used. Stay in touch during holidays and quiet periods too.

Embarrassing someone in public. Like in Asia, criticising someone in front of others damages trust.

How do you repair confianza? Apologise personally — a phone call or meeting, not just an email. Explain what happened honestly. And then show, with your actions over time, that you can be trusted again.`,
    vocab: [
      { word: 'Proper', definition: 'Correct, suitable, or appropriate.' },
      { word: 'Sample', definition: 'A small amount of a product that shows what it is like.' },
      { word: 'Pushy', definition: 'Trying too hard to make someone do something.' },
      { word: 'Suspicious', definition: 'Feeling that something may be wrong or dishonest.' },
    ],
    phrases: [
      { en: 'I\'d like to introduce you to my colleague, who will be working with you.', local: '', phonetic: '', note: 'The right way to hand over a relationship to a new contact.' },
      { en: 'I\'m very sorry — I wanted to call you personally.', local: '', phonetic: '', note: 'Shows the apology is sincere and personal.' },
      { en: 'Please take your time — there\'s no rush.', local: '', phonetic: '', note: 'Shows you care about the relationship more than a quick signature.' },
      { en: 'I was thinking of you — how are things?', local: '', phonetic: '', note: 'A warm message to stay in touch when you don\'t need anything.' },
    ],
    discussion: [
      'Which mistake on this page do you think is the most serious? Why?',
      'Have you ever lost trust in someone? Could they repair it? How?',
      'Why is a personal phone call better than an email when you apologise?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. Is confianza being built or damaged? What should the person do?

Situation 1: The Efficient Visitor
Yuto, from Japan, has a one-hour meeting with a Mexican distributor in Monterrey. To save time, he starts immediately: "Thank you for your time. Let me show you our prices." The Mexican director looks surprised and becomes very quiet. After the meeting, he does not reply to Yuto's emails. What went wrong?

Situation 2: The New Manager
A Korean company has worked with a Brazilian partner for five years through its manager, Mr. Park. Mr. Park moves back to Seoul. The company sends an email: "Mr. Lee is your new contact from today." Six months later, orders from Brazil have dropped by half. Why might this be? What should the company have done?

Situation 3: The Unread Messages
Fatima, from Saudi Arabia, is working with a Colombian supplier. The supplier sends her many WhatsApp messages and voice notes. Fatima prefers email and only replies once a week. The supplier tells a colleague that Fatima "doesn't seem interested". How could Fatima handle this?

Situation 4: The Birthday Invitation
Chen, from China, has worked with an Argentine partner for one year. The partner invites him to his daughter's quinceañera. Chen is busy and is not sure if it is appropriate for a business contact to attend. What should he do?

Situation 5: The Politics Question
At a first dinner in Lima, Tom, from the USA, says, "I love America — it's the best country in the world." His Peruvian hosts smile politely, but the atmosphere changes. Why? What could Tom say instead?`,
    vocab: [
      { word: 'Distributor', definition: 'A company that sells and delivers products from a manufacturer to shops.' },
      { word: 'Drop', definition: 'To become lower or less.' },
      { word: 'Appropriate', definition: 'Suitable or right for a particular situation.' },
      { word: 'Atmosphere', definition: 'The feeling or mood in a place or situation.' },
    ],
    phrases: [],
    discussion: [
      'Which situation shows the biggest loss of confianza? Why?',
      'In Situation 2, what exactly should the Korean company have done?',
      'In Situation 4, would you go to the quinceañera? What gift would you bring?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

Confianza: Trust, confidence, and closeness. In Latin America, people often want to know you before they do serious business with you. "Personalismo" means relationships are with people, not just companies. It is similar to guanxi in China.

Building confianza: Small talk is important. Talk about family, food, football, and travel. Be careful with politics and religion, and never call the USA "America". Meet in person, share meals, keep promises, and show your personal side.

Family and compadrazgo: Many businesses are family-run. Godparent relationships — padrino, madrina, compadre, comadre — create strong, lifelong bonds. An invitation to a family event is a sign of real trust.

Who you know: Palanca in Mexico, pituto in Chile, QI ("Quem Indica") in Brazil. Connections open doors, but they can also be unfair.

WhatsApp business: Much business happens on WhatsApp. Messages are personal, voice notes and emojis are normal, and fast replies build trust.

Losing confianza: Being cold, changing contacts without introduction, breaking promises, being pushy, disappearing, and embarrassing people. Repair trust with a personal apology and consistent actions.`,
    vocab: [
      { word: 'Bond', definition: 'A strong connection between people.' },
      { word: 'Consistent', definition: 'Always behaving in the same way.' },
      { word: 'Repair', definition: 'To fix something that is broken or damaged.' },
      { word: 'Similar', definition: 'Almost the same, but not exactly.' },
    ],
    phrases: [],
    discussion: [
      'Compare confianza in Latin America with guanxi in China. What is similar? What is different?',
      'How do people build trust in business in your country?',
      'If you were starting a business relationship in Latin America, what would you do in your first month?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "Confianza — building trust before business in Latin America: small talk, family and compadrazgo, connections (palanca, pituto, QI), WhatsApp business culture, and how trust is lost". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function ConfianzaPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🤲</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 3 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>Confianza — Trust Before Business</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Why relationships come before contracts</p>
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
