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
    title: 'The Business Calendar',
    emoji: '📅',
    reading: `A European company plans to launch a new product in Brazil in the middle of February. They book meetings with partners, plan a marketing campaign, and arrange a big press event. Then they discover the problem: it is Carnival week. Offices are half empty. Partners are on holiday. The whole country is dancing in the streets. Nobody is thinking about a product launch.

In every country, the calendar shapes business. But in Latin America, some events are so big that the country almost stops. Football matches, Carnival, religious festivals, and national holidays can close offices, slow decisions, and change everyone's mood.

Understanding the calendar is a simple but powerful business skill. If you know when people will be on holiday, busy with family, or watching a big match, you can plan better — and avoid embarrassing mistakes. You also show respect for the culture.

There is another important difference to remember. Much of South America — including Brazil, Argentina, and Chile — is in the Southern Hemisphere. That means summer is from December to March. The long summer holidays often happen in January and February, not in July and August like in Europe or North America. Christmas and New Year happen in the middle of summer, and many businesses slow down from mid-December until after Carnival.

In this lesson, you will learn about football, Carnival, religious and national holidays, special bonuses, and how to plan — and celebrate — with the Latin American calendar.`,
    vocab: [
      { word: 'Launch', definition: 'The time when a new product is introduced to the public.' },
      { word: 'Campaign', definition: 'A planned set of activities to achieve a goal, like advertising.' },
      { word: 'Mood', definition: 'The way someone feels at a particular time.' },
      { word: 'Hemisphere', definition: 'One half of the Earth, such as the northern or southern half.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'When is the busiest holiday season in your country? Does business slow down?',
      'Have you ever had a plan ruined because you forgot about a holiday or event?',
    ],
  },
  {
    title: 'Football — More Than a Game',
    emoji: '⚽',
    reading: `In much of Latin America, football is not just a sport. It is part of national identity, family life, and daily conversation.

When the national team plays in the World Cup, normal life can stop. In Brazil, many companies change working hours so employees can watch the matches. Banks and government offices may open late or close early. Streets go quiet during the game — and explode with noise when a goal is scored. Mexico co-hosted the 2026 World Cup with the USA and Canada, and the opening match was played at Mexico City's famous Estadio Azteca.

Club football is also extremely important. Every country has huge rivalries:

Argentina: Boca Juniors versus River Plate — the "Superclásico" — is one of the most intense rivalries in world football.

Brazil: Flamengo versus Fluminense in Rio de Janeiro — the "Fla-Flu" — and Corinthians versus Palmeiras in São Paulo.

Mexico: Club América versus Chivas de Guadalajara — the "Clásico Nacional".

For business, football is a powerful tool for small talk and building confianza. Learning the name of your partner's favourite team — and asking about the last match — is an easy way to start a friendly conversation.

But be careful! Football loyalties are very strong. Never insult someone's team, even as a joke, until you know them well. And if you support a rival team, it may be wise to keep it quiet at first. Also, avoid scheduling important meetings during big matches.`,
    vocab: [
      { word: 'Identity', definition: 'The qualities and feelings that make a person or group who they are.' },
      { word: 'Rivalry', definition: 'Strong competition between two people, teams, or groups.' },
      { word: 'Intense', definition: 'Very strong or extreme.' },
      { word: 'Insult', definition: 'To say something rude that upsets someone.' },
    ],
    phrases: [
      { en: 'Which team do you support?', local: '¿De qué equipo eres? / Pra que time você torce?', phonetic: 'Deh keh eh-KEE-poh EH-res / Prah kee CHEE-mee voh-SEH TOR-see', note: 'Spanish / Portuguese. A great small-talk question.' },
      { en: 'Did you watch the game?', local: '¿Viste el partido? / Você viu o jogo?', phonetic: 'VEES-teh el par-TEE-doh / Voh-SEH vee-OO oo ZHOH-goo', note: 'Spanish / Portuguese. Perfect for Monday morning conversation.' },
      { en: 'Goal!', local: '¡Gol! / Gol!', phonetic: 'GOHL!', note: 'The longer you shout it, the better!' },
      { en: 'What a match!', local: '¡Qué partidazo! / Que jogaço!', phonetic: 'Keh par-tee-DAH-soh / Kee zhoh-GAH-soo', note: 'Spanish / Portuguese. Enthusiastic praise for a great game.' },
    ],
    discussion: [
      'Is football (or another sport) important in your country? Does life stop for big matches?',
      'Why do you think football is such a good topic for business small talk?',
      'Do you have a favourite team? How would you feel if a business partner insulted it?',
    ],
  },
  {
    title: 'Carnival — The Year Starts After',
    emoji: '🎭',
    reading: `There is a famous saying in Brazil: "O ano só começa depois do Carnaval" — "The year only starts after Carnival." It is a joke, but it contains a lot of truth.

Carnival happens every year in February or early March, just before the Christian period of Lent. The exact dates change each year. It is the biggest festival in Brazil, and one of the biggest in the world.

Each city celebrates differently. In Rio de Janeiro, the famous samba schools parade through the Sambadrome with huge decorated floats, thousands of dancers, and spectacular costumes. Each school prepares for the parade for almost a whole year. In Salvador, enormous trucks with sound systems, called "trios elétricos", drive slowly through the streets followed by huge crowds. In Recife and Olinda, people dance "frevo" and follow giant puppets. And across the country, street parties called "blocos" fill neighbourhoods with music and dancing.

For business, Carnival week is not a good time for meetings, launches, or decisions. Many offices close for several days, and many people take the whole week off. Combined with the summer holidays in January, this means the first two months of the year can be slow for business in Brazil.

Other Latin American countries also have important carnivals — such as the Barranquilla Carnival in Colombia and carnivals in Uruguay, Bolivia, and parts of Mexico.

The best advice: plan around Carnival — or join the party!`,
    vocab: [
      { word: 'Lent', definition: 'The 40 days before Easter, when some Christians give up certain foods or habits.' },
      { word: 'Parade', definition: 'A public celebration where people walk or dance through the streets.' },
      { word: 'Float', definition: 'A large decorated vehicle in a parade.' },
      { word: 'Spectacular', definition: 'Extremely impressive and exciting to see.' },
    ],
    phrases: [
      { en: 'The year only starts after Carnival.', local: 'O ano só começa depois do Carnaval.', phonetic: 'Oo AH-noo soh koh-MEH-sah deh-POYS doo kar-nah-VOW', note: 'Portuguese. A Brazilian joke — with a lot of truth.' },
      { en: 'Happy Carnival! / Have a great Carnival!', local: 'Bom Carnaval!', phonetic: 'Bohn kar-nah-VOW', note: 'Portuguese. A friendly wish before the holiday.' },
      { en: 'Let\'s talk after Carnival.', local: 'Vamos conversar depois do Carnaval.', phonetic: 'VAH-moos kohn-ver-SAR deh-POYS doo kar-nah-VOW', note: 'Portuguese. You will hear this a lot in February!' },
      { en: 'Street party (Carnival).', local: 'Bloco', phonetic: 'BLOH-koo', note: 'Portuguese. A street party group that plays music and dances through the city.' },
    ],
    discussion: [
      'Is there a festival in your country that is as big as Carnival?',
      'Would you enjoy Carnival in Rio, Salvador, or Recife? Why?',
      'How would you plan a business project in Brazil around Carnival?',
    ],
  },
  {
    title: 'Holy Days and National Days',
    emoji: '🎉',
    reading: `Religious and national holidays are also very important in the Latin American business calendar.

Semana Santa (Holy Week). The week before Easter, usually in March or April, is a major holiday in most of Latin America. Many people travel to the beach or visit family, and offices often close on Thursday and Friday. In some countries, many people take the whole week off. Expect slow replies and closed businesses.

Día de Muertos (Day of the Dead). In Mexico, on 1 and 2 November, families remember loved ones who have died. They build colourful altars called "ofrendas", decorated with flowers, candles, photos, and the dead person's favourite food. It is a joyful celebration of life and memory, not a sad event. Many offices and schools put up their own ofrendas.

Día de la Virgen de Guadalupe. On 12 December, millions of Mexicans celebrate the Virgin of Guadalupe, Mexico's most important religious figure. Huge numbers of pilgrims travel to the Basilica in Mexico City.

Independence days. Each country celebrates its independence with patriotic events. In Mexico, on the night of 15 September, people shout "¡Viva México!" in the "Grito de Independencia", and 16 September is a national holiday. Brazil celebrates on 7 September, Argentina on 9 July. In Chile, the "Fiestas Patrias" on 18 and 19 September are so popular that the whole week can be slow for business.

"Puentes" — bridges. When a holiday falls on a Tuesday or Thursday, many people take the Monday or Friday off too, making a long weekend. This is called a "puente" (bridge) in Spanish. In Brazil, it is called "emendar o feriado".`,
    vocab: [
      { word: 'Altar', definition: 'A table or raised area used for religious offerings or ceremonies.' },
      { word: 'Joyful', definition: 'Very happy.' },
      { word: 'Pilgrim', definition: 'A person who travels to a holy place for religious reasons.' },
      { word: 'Patriotic', definition: 'Showing love and support for your country.' },
    ],
    phrases: [
      { en: 'Holy Week.', local: 'Semana Santa', phonetic: 'Seh-MAH-nah SAHN-tah', note: 'Spanish. A major holiday week before Easter.' },
      { en: 'Long weekend (bridge).', local: 'Puente', phonetic: 'PWEN-teh', note: 'Spanish. An extra day off between a holiday and the weekend.' },
      { en: 'Long live Mexico!', local: '¡Viva México!', phonetic: 'VEE-vah MEH-hee-koh', note: 'Shouted during the Grito de Independencia on 15 September.' },
      { en: 'Happy holidays!', local: '¡Felices fiestas! / Boas festas!', phonetic: 'Feh-LEE-ses FYES-tahs / BOH-ahs FES-tahs', note: 'Spanish / Portuguese. A safe greeting for the end-of-year season.' },
    ],
    discussion: [
      'Is there a festival like Día de Muertos in your culture, to remember people who have died?',
      'What is the most important national holiday in your country? How do people celebrate?',
      'Do people in your country take "bridge" days to make long weekends?',
    ],
  },
  {
    title: 'Bonuses, Posadas and the End of the Year',
    emoji: '🎄',
    reading: `The end of the year is a special time in the Latin American business calendar — with extra money, parties, and gifts.

The 13th salary. In many Latin American countries, workers receive an extra month's salary at the end of the year, required by law. In Brazil, it is called the "décimo terceiro salário" — the thirteenth salary. In Mexico, it is called the "aguinaldo", and it is paid in December. Other countries have similar systems. This extra money leads to a big increase in shopping in November and December — an important time for retailers.

Christmas parties and posadas. In Mexico, the "posadas" are traditional celebrations from 16 to 24 December. Many companies hold a "posada" as their end-of-year party, with food, music, piñatas, and a warm drink called "ponche". These parties are an important chance to build relationships with colleagues and partners.

Gift baskets. Many companies send gifts to their clients and partners at the end of the year. In Mexico, a "canasta navideña" — Christmas basket — may include wine, chocolates, and special foods. In Brazil, companies often give a "cesta de Natal".

The summer slowdown. In the Southern Hemisphere, December and January are summer. In Brazil, Argentina, and Chile, many people take their main holiday in January. Combined with Christmas, New Year, and Carnival, business in these countries can be slow from mid-December to early March.

Smart planning: try to close important deals before mid-December, or plan to restart them after Carnival.`,
    vocab: [
      { word: 'Retailer', definition: 'A business that sells goods to the public, such as a shop.' },
      { word: 'Piñata', definition: 'A decorated container filled with sweets, which children hit with a stick to break.' },
      { word: 'Basket', definition: 'A container used to carry or hold things, often made of woven material.' },
      { word: 'Slowdown', definition: 'A period when activity becomes slower.' },
    ],
    phrases: [
      { en: 'Christmas bonus. (Mexico)', local: 'Aguinaldo', phonetic: 'Ah-gee-NAHL-doh', note: 'An extra payment required by law, paid in December.' },
      { en: 'The thirteenth salary. (Brazil)', local: 'Décimo terceiro', phonetic: 'DEH-see-moo ter-SAY-roo', note: 'An extra month\'s salary, usually paid in two parts at the end of the year.' },
      { en: 'Merry Christmas and Happy New Year!', local: '¡Feliz Navidad y próspero año nuevo! / Feliz Natal e próspero Ano Novo!', phonetic: 'Feh-LEES nah-vee-DAHD ee PROS-peh-roh AH-nyoh NWEH-voh / Feh-LEEZ nah-TOW ee PROS-peh-roo AH-noo NOH-voo', note: 'Spanish / Portuguese. Perfect for year-end messages to clients.' },
      { en: 'Let\'s pick this up in the new year.', local: '', phonetic: '', note: 'A polite way to pause a project for the holiday season.' },
    ],
    discussion: [
      'Do workers in your country get a bonus at the end of the year?',
      'Does your company send gifts to clients at the end of the year? What kind?',
      'Would you prefer your main holiday in summer or winter? Why?',
    ],
  },
  {
    title: 'Joining In — Respectfully',
    emoji: '🙌',
    reading: `Latin Americans love to share their celebrations, and joining in is one of the best ways to build strong relationships. Here is how to do it well.

Learn the dates. Put the main holidays of your partners' countries into your calendar — including Carnival, Semana Santa, independence days, and big football matches.

Send greetings. A short, warm message before a holiday is always appreciated. "¡Felices fiestas!", "Bom Carnaval!", or "¡Feliz Día de la Independencia!" shows you care about your partners' culture.

Accept invitations. If you are invited to a posada, an asado, a carnival party, or to watch a match, try to go. It is a sign of trust and friendship.

Wear the shirt. During the World Cup, wearing the local team's shirt — or at least its colours — is a fun way to show support. (But if your own country is playing against them, you might want to be diplomatic!)

Respect religious traditions. Many holidays have religious meaning. You do not need to share the beliefs, but show respect. At a Día de Muertos ofrenda, for example, ask questions politely and do not touch the offerings.

Do not expect business during big holidays. Pushing for a meeting during Carnival or Semana Santa can seem disrespectful.

Share your own culture too. Your Latin American partners will probably be curious about your country's festivals. Telling them about Lunar New Year, Ramadan and Eid, Chuseok, or Obon can create a great conversation — and a deeper connection.`,
    vocab: [
      { word: 'Appreciate', definition: 'To be thankful for something.' },
      { word: 'Diplomatic', definition: 'Careful to say or do things without upsetting people.' },
      { word: 'Offering', definition: 'Something given as a gift, especially for religious reasons.' },
      { word: 'Curious', definition: 'Wanting to know or learn about something.' },
    ],
    phrases: [
      { en: 'Happy Independence Day!', local: '¡Feliz Día de la Independencia!', phonetic: 'Feh-LEES DEE-ah deh lah een-deh-pen-DEN-syah', note: 'Spanish. Send it to partners on their national day.' },
      { en: 'Thank you for inviting me!', local: '¡Gracias por la invitación! / Obrigado pelo convite!', phonetic: 'GRAH-syahs por lah een-vee-tah-SYOHN / Oh-bree-GAH-doo PEH-loo kohn-VEE-chee', note: 'Spanish / Portuguese. Women say "obrigada".' },
      { en: 'Can you tell me about this tradition?', local: '¿Me puedes contar sobre esta tradición?', phonetic: 'Meh PWEH-des kohn-TAR SOH-breh ES-tah trah-dee-SYOHN', note: 'Spanish. Shows respectful curiosity.' },
      { en: 'In my country, we celebrate...', local: '', phonetic: '', note: 'Share your own festivals — it builds a two-way connection.' },
    ],
    discussion: [
      'Which Latin American celebration would you most like to join? Why?',
      'How would you explain your country\'s most important festival to a Latin American partner?',
      'Is it OK to wear another country\'s football shirt when your own country is playing them?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. What went wrong — or what should the person do?

Situation 1: The February Launch
A Korean electronics company plans to launch a new phone in Brazil on the Tuesday of Carnival week. They have booked a big event in São Paulo and invited 200 journalists and partners. Only 30 people say they will come. What went wrong? When should they launch?

Situation 2: The Match Meeting
Ichiro, from Japan, schedules a two-hour meeting with Argentine partners in Buenos Aires. Later, he discovers it is at the same time as the Boca Juniors versus River Plate Superclásico. His partners have not complained. Should he change the meeting? Why?

Situation 3: The Ofrenda
Noura, from Saudi Arabia, is working in Mexico City in November. Her office has built a Día de Muertos ofrenda with photos of colleagues' family members who have died. A colleague invites her to look at it and add something if she wants. Noura is not sure how to respond, because it is not part of her religion. What could she do?

Situation 4: The January Email
Li Ming, from China, sends an urgent email to a partner in Santiago on 8 January. He gets an automatic reply: "On holiday until 2 February." He has another urgent question for a partner in Buenos Aires. What should he expect? How could he plan better next year?

Situation 5: The Rival Shirt
Before a World Cup match between Brazil and Mexico, Carlos, a Mexican manager, invites his Brazilian clients to watch the game together at a restaurant. Should the Brazilian clients wear their team's shirts? How can everyone enjoy the match without damaging the business relationship?`,
    vocab: [
      { word: 'Journalist', definition: 'A person who writes or reports news for newspapers, TV, or websites.' },
      { word: 'Schedule', definition: 'To plan something for a particular time.' },
      { word: 'Automatic reply', definition: 'An email sent automatically when someone is away.' },
      { word: 'Rival', definition: 'A person or team that competes against you.' },
    ],
    phrases: [],
    discussion: [
      'Which situation shows the biggest planning mistake? Why?',
      'In Situation 3, what could Noura say or do? Practise it with the AI.',
      'In Situation 5, would you wear your team\'s shirt? Why or why not?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

The business calendar: In Latin America, some events are so big that the country almost stops. In the Southern Hemisphere, summer is from December to March, and the main holidays are often in January.

Football: The World Cup can change working hours. Mexico co-hosted the 2026 World Cup. Big rivalries include Boca versus River (Argentina), Flamengo versus Fluminense and Corinthians versus Palmeiras (Brazil), and América versus Chivas (Mexico). Football is great for small talk — but never insult someone's team.

Carnival: In February or early March. Rio has samba schools, Salvador has trios elétricos, and Recife and Olinda have frevo. "The year only starts after Carnival." Do not plan launches or important meetings during Carnival week.

Holy days and national days: Semana Santa, Día de Muertos (1–2 November), Día de la Virgen de Guadalupe (12 December), and independence days. "Puentes" create long weekends.

End of the year: The aguinaldo (Mexico) and décimo terceiro (Brazil) give workers an extra month's salary. Posadas, gift baskets, and a long summer slowdown in the south.

Joining in: Learn the dates, send greetings, accept invitations, respect religious traditions, avoid pushing for business during big holidays, and share your own culture too.`,
    vocab: [
      { word: 'Main', definition: 'The most important or biggest.' },
      { word: 'Rivalry', definition: 'Strong competition between two teams or groups.' },
      { word: 'Push for', definition: 'To try hard to get something.' },
      { word: 'Tradition', definition: 'A custom or belief passed down from the past.' },
    ],
    phrases: [],
    discussion: [
      'Compare the business calendar in Latin America with the calendar in your country.',
      'If you were planning a project in Brazil or Mexico, which months would you avoid? Why?',
      'Which Latin American celebration from this lesson would you most like to experience?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "When the Country Stops — football, Carnival, Semana Santa, Día de Muertos, independence days, year-end bonuses and planning business around the Latin American calendar". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function WhenTheCountryStopsPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>⚽</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 9 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>When the Country Stops</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Football, Carnival and the business calendar</p>
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
