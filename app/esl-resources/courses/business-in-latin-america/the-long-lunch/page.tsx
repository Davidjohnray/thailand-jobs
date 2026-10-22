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
    title: 'Lunch Is the Main Event',
    emoji: '🍽️',
    reading: `In many offices in Asia, Europe, and North America, lunch is quick. People eat a sandwich at their desk, grab noodles near the station, or finish a bento box in 15 minutes.

In much of Latin America, lunch is different. In many countries, it is the biggest meal of the day. It can last one, two, or even three hours. Families may come together at home, and in business, lunch is often where the most important conversations happen.

In Mexico, the main meal of the day is called "la comida", and it is often eaten between 2 and 4 p.m. In Brazil, "o almoço" (lunch) is a big, hot meal with rice, beans, meat, and salad. In Argentina, lunch is important on weekdays, but the most famous meal is the weekend "asado" — a long barbecue with family and friends.

For business, a long lunch is not a break from work. It is part of the work. Over food, people relax, tell stories, laugh, and get to know each other. They build confianza. The business conversation may not start until the coffee arrives — or it may not happen at all, and that is OK. The relationship has still moved forward.

There is even a special word for the time after the meal, when people stay at the table talking: "sobremesa".

In this lesson, you will learn about business meals in Mexico, Brazil, and Argentina, table manners across the region, and how to get the most out of the long lunch.`,
    vocab: [
      { word: 'Grab', definition: 'Here: to get or eat something quickly.' },
      { word: 'Barbecue', definition: 'A meal where meat is cooked outside over a fire.' },
      { word: 'Relax', definition: 'To become calm and less worried.' },
      { word: 'Move forward', definition: 'To make progress.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'How long is a typical lunch break in your country? Where do people eat?',
      'Would you enjoy a three-hour business lunch? Why or why not?',
    ],
  },
  {
    title: 'Mexico — La Comida de Negocios',
    emoji: '🇲🇽',
    reading: `In Mexico, a business lunch — "comida de negocios" — usually starts around 2 p.m. and can easily continue until 4 or 5 p.m. Breakfast meetings are also popular, especially in big cities, and they are usually shorter.

The meal often begins with drinks and conversation. Talking about business immediately is unusual. People talk about family, travel, football, and food first. The host will usually decide when it is time to talk business — often near the end of the meal, over coffee or a digestif like tequila or mezcal.

Mexican food is incredibly varied, and it is one of the best ways to build connection. Your hosts will love it if you show interest and try local dishes. Ask about regional specialities — mole from Oaxaca and Puebla, cochinita pibil from Yucatán, or tacos al pastor in Mexico City. If something is spicy, it is fine to say so!

Who pays? In Mexico, the person who invited usually pays. Friendly arguments about the bill are common — people may compete to pay. If you are the guest, offer to pay, but accept gracefully if your host insists. Next time, invite them and pay yourself.

Tequila and mezcal are often sipped slowly, not drunk as fast shots. If you do not drink alcohol, it is fine to say so politely and choose a soft drink or "agua fresca" — a fresh fruit drink.

One more tip: do not plan another important meeting at 3 p.m. on the same day!`,
    vocab: [
      { word: 'Digestif', definition: 'An alcoholic drink served after a meal.' },
      { word: 'Speciality', definition: 'A food that a particular place is famous for.' },
      { word: 'Gracefully', definition: 'In a polite and pleasant way.' },
      { word: 'Insist', definition: 'To say firmly that something must happen.' },
    ],
    phrases: [
      { en: 'Enjoy your meal.', local: '¡Buen provecho!', phonetic: 'Bwen proh-BEH-choh', note: 'Said before eating — and even to strangers you pass in a restaurant.' },
      { en: 'Cheers!', local: '¡Salud!', phonetic: 'Sah-LOOD', note: 'Literally "health!". Make eye contact when you clink glasses.' },
      { en: 'The bill, please.', local: 'La cuenta, por favor.', phonetic: 'Lah KWEN-tah por fah-VOR', note: 'If you are the host, ask the waiter quietly so your guest does not see the bill.' },
      { en: 'This is on me.', local: 'Yo invito.', phonetic: 'Yoh een-VEE-toh', note: 'Literally "I invite". The way to say you are paying.' },
    ],
    discussion: [
      'In your country, who pays for a business meal? Do people argue about the bill?',
      'What dish from your country would you recommend to a Mexican business partner?',
      'Why do you think Mexicans wait until the end of the meal to talk about business?',
    ],
  },
  {
    title: 'Brazil — Churrasco and Cafezinho',
    emoji: '🇧🇷',
    reading: `Brazil has two food traditions every business visitor should know: churrasco and cafezinho.

Churrasco is Brazilian barbecue. At a "churrascaria", many restaurants use the "rodízio" system. Waiters walk around the restaurant with large skewers of grilled meat — beef, chicken, sausage, pork, and more — and slice pieces directly onto your plate. Each guest has a small card: green means "Yes, please bring more meat!", and red means "Stop, I need a break." Many visitors make the mistake of eating too much salad and bread at the start and have no room left for the meat!

Note for visitors who do not eat pork: many churrascarias serve pork, and the famous Brazilian dish "feijoada" — a black bean stew — traditionally contains several pork cuts. It is perfectly fine to ask what each dish contains.

Cafezinho means "little coffee". It is a small, strong, sweet coffee, and it is offered everywhere in Brazil — in offices, shops, and homes. When you arrive at a business meeting, you will almost certainly be offered a cafezinho. Accepting it is a small gesture of friendship. If you do not drink coffee, a glass of water is fine, but say no with a smile and a thank-you.

Brazilians also love "self-service por quilo" restaurants, where you fill your plate and pay by weight. They are popular for quick weekday lunches.

Lunch is usually between 12 and 2 p.m., and a business lunch can easily last two hours.`,
    vocab: [
      { word: 'Skewer', definition: 'A long thin metal or wooden stick used to hold food while cooking.' },
      { word: 'Slice', definition: 'To cut something into thin, flat pieces.' },
      { word: 'Stew', definition: 'A dish of meat or vegetables cooked slowly in liquid.' },
      { word: 'Gesture', definition: 'An action that shows a feeling or intention.' },
    ],
    phrases: [
      { en: 'Enjoy your meal.', local: 'Bom apetite!', phonetic: 'Bohn ah-peh-CHEE-chee', note: 'The Brazilian way to say "enjoy your meal".' },
      { en: 'Would you like a little coffee?', local: 'Aceita um cafezinho?', phonetic: 'Ah-SAY-tah oong kah-feh-ZEE-nyoo', note: 'You will hear this at almost every meeting in Brazil.' },
      { en: 'Yes, please! / No, thank you.', local: 'Sim, por favor! / Não, obrigado.', phonetic: 'Seen, por fah-VOR / Nowng, oh-bree-GAH-doo', note: 'Women say "obrigada". Always add a smile.' },
      { en: 'Cheers!', local: 'Saúde!', phonetic: 'Sah-OO-jee', note: 'Literally "health!", like "salud" in Spanish.' },
    ],
    discussion: [
      'Would you like to try a churrascaria? What would you be careful about?',
      'Is it rude to refuse coffee or tea in your culture? How would you refuse politely?',
      'What drink is offered to guests at offices in your country?',
    ],
  },
  {
    title: 'Argentina — The Asado and Mate',
    emoji: '🇦🇷',
    reading: `In Argentina, two traditions are at the heart of social and business life: the asado and mate.

The asado is much more than a barbecue. It is a long social event, often on a weekend, that can last all afternoon. Different cuts of beef, sausages ("chorizo" and "morcilla"), and sometimes vegetables are slowly cooked over wood or charcoal. The person who cooks is called the "asador", and it is an honoured role. At the end of the meal, it is tradition for everyone to clap and shout, "¡Un aplauso para el asador!" — "A round of applause for the asador!"

Being invited to an asado at someone's home is a sign of real friendship. Bring wine, dessert, or ice cream, and do not arrive exactly on time.

Mate is a traditional herbal drink that is shared from one cup, called a "mate", with a metal straw called a "bombilla". One person, the "cebador", prepares the mate and passes it around the group. Each person drinks the whole cup and passes it back to the cebador, who refills it for the next person.

There are a few important mate rules. Do not move or stir the straw. Drink all of it — do not pass it on half full. And be careful with "gracias": when you say "thank you" after drinking mate, it means "I don't want any more." If you want more, just pass it back without saying thanks!

Being offered mate in a meeting or office is a sign of welcome and trust.`,
    vocab: [
      { word: 'Cut', definition: 'Here: a piece of meat from a particular part of an animal.' },
      { word: 'Honoured', definition: 'Respected and admired.' },
      { word: 'Herbal', definition: 'Made from plants or leaves.' },
      { word: 'Stir', definition: 'To move a spoon or stick around in a liquid to mix it.' },
    ],
    phrases: [
      { en: 'A round of applause for the asador!', local: '¡Un aplauso para el asador!', phonetic: 'Oon ah-PLOW-soh PAH-rah el ah-sah-DOR', note: 'Shouted at the end of every good asado. Join in!' },
      { en: 'Would you like a mate?', local: '¿Querés un mate?', phonetic: 'Keh-REHS oon MAH-teh', note: 'Argentine Spanish uses "querés", not "quieres".' },
      { en: 'Thank you (I\'ve had enough).', local: 'Gracias.', phonetic: 'GRAH-syahs', note: 'With mate, "gracias" means "no more for me".' },
      { en: 'Delicious!', local: '¡Riquísimo!', phonetic: 'Ree-KEE-see-moh', note: 'A very enthusiastic way to praise food in Argentina.' },
    ],
    discussion: [
      'Would you feel comfortable sharing one cup and straw with a group? Why or why not?',
      'Why do you think the asador is so respected?',
      'Is there a drink in your culture that is shared or served with special rules?',
    ],
  },
  {
    title: 'Table Manners Across the Region',
    emoji: '🍴',
    reading: `Table manners vary across Latin America, but some rules are common in most countries.

Wait for the host. Do not start eating until the host starts or says "buen provecho" or "bom apetite". The host may also make a short toast first.

Hands on the table. In Mexico and Argentina, it is polite to keep your hands visible above the table, resting your wrists on the edge. Putting your hands in your lap can seem strange.

Do not rush. Eating quickly and leaving can seem rude. Meals are for conversation. Put your knife and fork down between bites and take part in the conversation.

Try everything. Showing interest in local food is one of the easiest ways to build warmth. If you do not like something or cannot eat it, refuse politely and explain simply.

Eating with hands. Tacos are eaten with your hands, but many other dishes are eaten with a knife and fork. In Brazil, many people even eat pizza and sandwiches with a knife and fork, especially in formal settings.

Napkins and bread. Keep your napkin on your lap. In many places, bread is placed directly on the table or a small plate.

Splitting the bill. In business, the host normally pays. Among friends, splitting the bill is becoming more common. In some countries, people call it paying "a la americana".

Compliment the food. Saying the food is delicious is always appreciated — especially at someone's home.`,
    vocab: [
      { word: 'Visible', definition: 'Able to be seen.' },
      { word: 'Lap', definition: 'The top part of your legs when you are sitting down.' },
      { word: 'Bite', definition: 'A small piece of food that you put in your mouth.' },
      { word: 'Compliment', definition: 'To say something nice about someone or something.' },
    ],
    phrases: [
      { en: 'This is delicious!', local: '¡Está delicioso! / Está delicioso!', phonetic: 'Es-TAH deh-lee-SYOH-soh / Es-TAH deh-lee-see-OH-zoo', note: 'Spanish / Portuguese. The same words, slightly different pronunciation.' },
      { en: 'I don\'t eat pork, sorry.', local: 'No como cerdo, disculpe. / Não como carne de porco, desculpe.', phonetic: 'Noh KOH-moh SEHR-doh, dees-KOOL-peh / Nowng KOH-moo KAR-nee jee POR-koo, des-KOOL-pee', note: 'Spanish / Portuguese. A simple, polite way to explain a food restriction.' },
      { en: 'I don\'t drink alcohol, but cheers!', local: 'No tomo alcohol, ¡pero salud!', phonetic: 'Noh TOH-moh ahl-KOHL, PEH-roh sah-LOOD', note: 'Spanish. Join the toast with any drink.' },
      { en: 'Can we split the bill?', local: '¿Podemos dividir la cuenta?', phonetic: 'Poh-DEH-mohs dee-vee-DEER lah KWEN-tah', note: 'Spanish. Fine among friends — but not usually at a business meal.' },
    ],
    discussion: [
      'Where do you keep your hands during a meal in your country?',
      'Is it rude to refuse food in your culture? How would you refuse politely?',
      'Which table manner from this page is the most different from your culture?',
    ],
  },
  {
    title: 'Sobremesa — Where Deals Are Made',
    emoji: '☕',
    reading: `The meal is finished. The plates have been taken away. But nobody stands up. Coffee arrives, maybe a small dessert, maybe a digestif. People lean back in their chairs, and the conversation continues for another hour or more. This is "sobremesa" — literally "over the table".

Sobremesa is one of the most loved traditions in Spanish-speaking countries. It is the time for long stories, jokes, opinions, and real conversation. In business, it is often the moment when people feel relaxed enough to talk honestly — about their plans, their problems, and what they really want from the deal.

For many foreigners, especially from cultures where meals are fast and efficient, sobremesa can feel strange. "We have finished eating — why are we still here?" But leaving quickly can send the wrong message. It may suggest that you were only there for the food, or that you are not interested in the people.

How to make the most of sobremesa:

Relax. Do not check your phone or your watch.

Let the host lead. If business comes up, follow the conversation naturally. Do not force it.

Listen carefully. People may share useful information about decisions, competitors, or what is happening inside their company.

Share stories. Tell them about your country, your family, or a funny travel experience.

Know when to go. When the host asks for the bill or starts to stand up, it is time to leave — with a warm thank-you to everyone.`,
    vocab: [
      { word: 'Lean back', definition: 'To move your body backwards into a relaxed position.' },
      { word: 'Efficient', definition: 'Working quickly and well without wasting time.' },
      { word: 'Competitor', definition: 'A company that tries to win the same customers as you.' },
      { word: 'Force', definition: 'Here: to make something happen when it is not natural.' },
    ],
    phrases: [
      { en: 'Shall we have a coffee?', local: '¿Tomamos un cafecito?', phonetic: 'Toh-MAH-mohs oon kah-feh-SEE-toh', note: 'Spanish. A friendly way to continue the conversation after the meal.' },
      { en: 'Tell me more about your plans for next year.', local: '', phonetic: '', note: 'A relaxed way to move gently towards business during sobremesa.' },
      { en: 'Thank you for a wonderful lunch.', local: 'Gracias por una comida maravillosa.', phonetic: 'GRAH-syahs por OO-nah koh-MEE-dah mah-rah-vee-YOH-sah', note: 'Spanish. Always thank your host warmly before leaving.' },
      { en: 'Next time, it\'s my treat.', local: 'La próxima, invito yo.', phonetic: 'Lah PROK-see-mah, een-VEE-toh yoh', note: 'Spanish. Promises to return the invitation — and builds the relationship.' },
    ],
    discussion: [
      'Is there a tradition like sobremesa in your country?',
      'Why do you think people are more honest after a long meal?',
      'How would you feel if a business lunch lasted three hours but you never talked about business?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. What went wrong — or what is about to go wrong? What should the person do?

Situation 1: The Quick Lunch
Daichi, from Japan, invites a Mexican client to lunch at 12 p.m. He has booked a table for one hour because he has another meeting at 1:30. The client arrives at 12:30, orders drinks, and starts talking about his family. At 1:15, Daichi asks for the bill. The client looks surprised. What went wrong? How could Daichi plan better?

Situation 2: The Red Card
Soo-jin, from Korea, goes to a churrascaria in São Paulo with Brazilian partners. She does not understand the green and red cards. Her card is on green, and waiters keep putting meat on her plate. She is very full but too polite to refuse. What should she do?

Situation 3: The Pork Question
Abdullah, from Saudi Arabia, is invited to a Brazilian colleague's home for feijoada on Saturday. He does not eat pork, and he knows feijoada usually contains pork. He does not want to offend his host. What should he do?

Situation 4: The Mate Mistake
At a meeting in Córdoba, Argentina, Zhang Wei is offered mate. He takes a small sip, says "Gracias!", and passes it on. He is never offered mate again during the meeting, and he wonders if he did something wrong. What happened?

Situation 5: The Bill Battle
After a long lunch in Bogotá, Emma, from Australia, and her Colombian client both try to pay. The client says, "No, no, you are my guest!" Emma insists, puts her card on the table, and says, "Let's split it." The client looks uncomfortable. What should Emma have done?`,
    vocab: [
      { word: 'Book', definition: 'To arrange to have something, such as a table at a restaurant.' },
      { word: 'Full', definition: 'Having eaten so much that you cannot eat more.' },
      { word: 'Offend', definition: 'To upset someone by being rude or disrespectful.' },
      { word: 'Battle', definition: 'Here: a friendly fight or competition.' },
    ],
    phrases: [],
    discussion: [
      'Which situation would be the most difficult for you? Why?',
      'In Situation 3, what exactly could Abdullah say to his host? Practise it with the AI.',
      'In Situation 5, should the guest ever insist on paying? When?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

The long lunch: In much of Latin America, lunch is the main meal of the day and can last two or three hours. In business, it is where relationships and confianza are built. Business talk often comes at the end — or not at all.

Mexico: "La comida" is usually between 2 and 4 p.m. Talk about family and food first. The host decides when to talk business. The person who invites usually pays — "Yo invito." Say "¡Buen provecho!" and "¡Salud!"

Brazil: At a churrascaria, green means more meat and red means stop. Feijoada traditionally contains pork. A cafezinho is offered at almost every meeting — accept it if you can. Say "Bom apetite!" and "Saúde!"

Argentina: The asado is a long weekend barbecue. Applaud the asador. Mate is shared from one cup — do not move the straw, finish the cup, and remember that "gracias" means "no more".

Table manners: Wait for the host, keep your hands visible, do not rush, try local food, refuse politely if you cannot eat something, and compliment the meal.

Sobremesa: The conversation after the meal. Relax, let the host lead, listen carefully, share stories, and leave when the host is ready.`,
    vocab: [
      { word: 'Main', definition: 'The largest or most important.' },
      { word: 'Applaud', definition: 'To clap your hands to show you like something.' },
      { word: 'Remember', definition: 'To keep information in your mind.' },
      { word: 'Share', definition: 'To give part of something to other people, or to use it together.' },
    ],
    phrases: [],
    discussion: [
      'Which food tradition from this lesson would you most like to experience? Why?',
      'Compare business meals in Latin America with business meals in your country.',
      'Would you invite a Latin American partner to a long lunch or a quick lunch in your country? Where would you take them?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "The Long Lunch — business meals in Mexico, Brazil and Argentina: la comida, churrasco, cafezinho, asado, mate, table manners and sobremesa". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function TheLongLunchPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🍽️</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 4 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>The Long Lunch</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Sobremesa, churrasco, asado and cafezinho</p>
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
