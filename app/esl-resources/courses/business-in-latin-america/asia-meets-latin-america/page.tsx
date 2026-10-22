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
    title: 'Across the Pacific',
    emoji: '🌏',
    reading: `Asia and Latin America are on opposite sides of the Pacific Ocean, more than 10,000 kilometres apart. But the connections between them are older and deeper than many people think.

More than 400 years ago, from 1565 to 1815, Spanish ships called the "Manila galleons" sailed across the Pacific between Manila, in the Philippines, and Acapulco, in Mexico. They carried Chinese silk, porcelain, and spices to the Americas, and silver from Mexico and Peru to Asia. Some historians describe this as one of the first truly global trade routes. Even today, you can find Asian influences in Mexican culture — and Mexican influences in the Philippines.

In the 19th and 20th centuries, thousands of people moved from Asia to Latin America. Chinese workers went to Peru, Cuba, and Mexico. Japanese families went to Brazil and Peru. Korean communities grew in Brazil, Argentina, and Mexico. Arab families from Lebanon and Syria moved to Brazil, Mexico, Argentina, and many other countries.

Today, Asia and Latin America are major trading partners. Latin America sends soybeans, copper, iron ore, oil, and meat to Asia. Asia sends electronics, cars, machines, and technology to Latin America. Asian companies have built factories across the region, and millions of Latin Americans now watch K-dramas, listen to K-pop, and eat sushi.

In this final lesson, you will explore the human and business bridges between Asia, the Middle East, and Latin America — and review the whole course.`,
    vocab: [
      { word: 'Opposite', definition: 'Completely different, or on the other side.' },
      { word: 'Porcelain', definition: 'A hard, delicate, white material used to make fine cups and plates.' },
      { word: 'Trade route', definition: 'A path used regularly by traders to move goods.' },
      { word: 'Influence', definition: 'The effect that something has on how someone or something develops.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'Did you know about the Manila galleons? What surprises you about this history?',
      'Can you think of any connections between your country and Latin America?',
    ],
  },
  {
    title: 'Japan and Brazil — A Century-Long Bridge',
    emoji: '🇯🇵',
    reading: `On 18 June 1908, a ship called the Kasato Maru arrived at the port of Santos, in Brazil. On board were around 780 Japanese immigrants, who had come to work on Brazil's coffee farms. Life was very hard — the work was difficult, the pay was low, and the culture was completely new. But more and more Japanese families followed.

Today, Brazil has the largest community of Japanese descent in the world outside Japan — often estimated at around two million people. They are called "Nikkei" — people of Japanese descent living abroad. Many Japanese-Brazilians have become successful farmers, doctors, engineers, business leaders, and politicians. They helped transform Brazilian agriculture, introducing new fruits and vegetables and modern farming techniques.

In São Paulo, the neighbourhood of Liberdade is famous for its Japanese shops, restaurants, red lanterns, and festivals. Sushi is extremely popular across Brazil — often with local twists, like sushi with cream cheese or fruit.

The bridge goes both ways. From 1990, Japan changed its immigration rules to allow people of Japanese descent from Latin America to work in Japan. Many Japanese-Brazilians and Japanese-Peruvians moved to Japan, especially to work in factories. They are called "dekasegi" — people who work away from home. Towns like Hamamatsu and Oizumi now have Brazilian shops, restaurants, and schools.

Peru also has an important Japanese community, which began with immigrants in 1899.`,
    vocab: [
      { word: 'Descent', definition: 'Your family origins; the country your ancestors came from.' },
      { word: 'Agriculture', definition: 'Farming; growing crops and raising animals.' },
      { word: 'Lantern', definition: 'A light in a decorated case, often made of paper.' },
      { word: 'Twist', definition: 'Here: a new or unexpected change to something traditional.' },
    ],
    phrases: [
      { en: 'Person of Japanese descent living abroad.', local: '日系 / Nikkei', phonetic: 'Nik-kei', note: 'Used for Japanese communities in Brazil, Peru, and elsewhere.' },
      { en: 'Working away from home.', local: '出稼ぎ / Dekasegi', phonetic: 'De-ka-se-gi', note: 'Used for Latin Americans of Japanese descent working in Japan.' },
      { en: 'Japanese-Brazilian.', local: 'Nipo-brasileiro', phonetic: 'NEE-poo brah-zee-LAY-roo', note: 'Portuguese. A Brazilian of Japanese descent.' },
      { en: 'Nice to meet you.', local: 'Prazer em conhecê-lo / conhecê-la.', phonetic: 'Prah-ZEHR eyn koh-nyeh-SEH-loo / koh-nyeh-SEH-lah', note: 'Portuguese. Use "-lo" for a man and "-la" for a woman.' },
    ],
    discussion: [
      'Why do you think Japanese immigrants were so successful in Brazilian agriculture?',
      'Would you like to visit Liberdade in São Paulo? What would you want to see or eat?',
      'How do you think "dekasegi" workers felt living in Japan — the country of their grandparents?',
    ],
  },
  {
    title: 'China in Latin America',
    emoji: '🇨🇳',
    reading: `In the last 25 years, China has become one of the most important economic partners for Latin America.

Trade. China is now the largest trading partner of several South American countries, including Brazil, Chile, and Peru. Brazil sells huge amounts of soybeans and iron ore to China. Chile and Peru sell copper — a key metal for electronics and electric cars. In return, Latin America buys Chinese electronics, machinery, and vehicles.

Investment. Chinese companies have invested in mines, power plants, railways, and ports across the region. In 2024, a large new port opened at Chancay, in Peru, built with major Chinese investment. It is designed to make shipping between South America and Asia faster.

Electric cars. Chinese car companies have grown quickly in Latin America. The Chinese electric car maker BYD has been building a large factory in the state of Bahia, in Brazil — on the site of a former Ford factory.

Chinese communities. Chinese immigrants arrived in Latin America from the 19th century, especially in Peru, Cuba, and Mexico. In Peru, Chinese and Peruvian cooking combined to create "chifa" — a hugely popular cuisine. There are chifa restaurants all over Lima, and dishes like "arroz chaufa" (fried rice) and "lomo saltado" show the Chinese influence on Peruvian food.

China's growing role brings opportunities — investment, jobs, and new markets — but also debate. Some people worry about depending too much on one partner, or about local industries competing with Chinese imports.`,
    vocab: [
      { word: 'Iron ore', definition: 'Rock that contains iron, used to make steel.' },
      { word: 'Machinery', definition: 'Machines, especially large ones used in factories.' },
      { word: 'Cuisine', definition: 'A style of cooking from a particular country or region.' },
      { word: 'Debate', definition: 'Discussion between people who have different opinions.' },
    ],
    phrases: [
      { en: 'Chinese-Peruvian cuisine.', local: 'Chifa', phonetic: 'CHEE-fah', note: 'Spanish (Peru). From the Chinese "chī fàn" — "to eat (rice)".' },
      { en: 'Fried rice. (Peru)', local: 'Arroz chaufa', phonetic: 'Ah-ROHS CHOW-fah', note: 'Spanish (Peru). A famous chifa dish.' },
      { en: 'Trading partner.', local: 'Socio comercial / Parceiro comercial', phonetic: 'SOH-syoh koh-mehr-SYAHL / Par-SAY-roo koh-mehr-see-OW', note: 'Spanish / Portuguese.' },
      { en: 'Investment.', local: 'Inversión / Investimento', phonetic: 'Een-vehr-SYOHN / Een-ves-chee-MEN-too', note: 'Spanish / Portuguese.' },
    ],
    discussion: [
      'What are the advantages and risks of having one very big trading partner?',
      'Have you ever tried a "fusion" cuisine like chifa? What was it like?',
      'Why do you think Chinese car companies are growing fast in Latin America?',
    ],
  },
  {
    title: 'Korea in Latin America',
    emoji: '🇰🇷',
    reading: `South Korea's connection with Latin America is younger than Japan's, but it is growing fast — in business and in culture.

Factories. Korean companies have built important factories in the region. Kia opened a large car factory near Monterrey, in Mexico, in 2016. Hyundai has a car factory in Piracicaba, in the state of São Paulo, Brazil. Samsung and LG have large factories in Mexico and Brazil that make TVs, phones, and home appliances for the whole American continent.

Mexico is especially attractive for Asian manufacturers because it is next to the USA and has trade agreements with it. Companies can build products in Mexico and send them easily to North American customers. This trend is sometimes called "nearshoring".

Korean communities. Korean immigrants began arriving in Brazil, Argentina, and Paraguay in the 1960s. In São Paulo, many Koreans settled in the neighbourhood of Bom Retiro, where they became very successful in the clothing and fashion industry. Buenos Aires also has a Korean neighbourhood, sometimes called "Koreatown".

The Korean Wave. Korean culture — "Hallyu", or the Korean Wave — is extremely popular in Latin America. K-pop groups fill stadiums in Mexico City, São Paulo, Santiago, and Lima. K-dramas are watched by millions. Many young Latin Americans are learning Korean, and Korean food, skincare, and fashion are booming.

For Korean businesspeople, this cultural popularity can be a great advantage. Many Latin Americans already feel positive and curious about Korea.`,
    vocab: [
      { word: 'Manufacturer', definition: 'A company that makes goods in large quantities.' },
      { word: 'Trade agreement', definition: 'An official agreement between countries about buying and selling goods.' },
      { word: 'Settle', definition: 'To start living permanently in a new place.' },
      { word: 'Boom', definition: 'To grow very quickly and become very successful.' },
    ],
    phrases: [
      { en: 'The Korean Wave.', local: '한류 / Hallyu', phonetic: 'Hal-lyu', note: 'The global popularity of Korean culture, including K-pop and K-dramas.' },
      { en: 'Moving production closer to the customer.', local: 'Nearshoring', phonetic: 'NEER-shor-ing', note: 'English, used in Spanish too. A big reason Asian companies build in Mexico.' },
      { en: 'Do you like K-pop?', local: '¿Te gusta el K-pop? / Você gosta de K-pop?', phonetic: 'Teh GOOS-tah el KAY-pop / Voh-SEH GOS-tah jee KAY-pop', note: 'Spanish / Portuguese. A great conversation starter with young Latin Americans.' },
    ],
    discussion: [
      'Why do you think K-pop and K-dramas are so popular in Latin America?',
      'Why is Mexico attractive for Asian companies that want to sell to the USA?',
      'How could a Korean company use the Korean Wave to help its business in Latin America?',
    ],
  },
  {
    title: 'The Middle East and Latin America',
    emoji: '🌙',
    reading: `The Middle East also has deep connections with Latin America.

Arab immigration. From the late 19th century, large numbers of people from Lebanon and Syria moved to Latin America. Many arrived with very little and started as travelling salespeople, then opened shops, factories, and businesses. Today, millions of Latin Americans have Lebanese or Syrian ancestry. Brazil is often said to have one of the largest Lebanese-descended populations in the world.

Many of these families became very successful in business and politics. Mexican businessman Carlos Slim, whom you met in Lesson 7, is the son of a Lebanese immigrant. Lebanese influence can also be seen in food. In Mexico, "tacos árabes" — Arab-style tacos — came from Lebanese immigrants in Puebla, and they are said to have inspired the famous "tacos al pastor", cooked on a vertical spit like shawarma. In Brazil, "esfiha" and "kibe" (kibbeh) are sold in bakeries and snack bars all over the country.

Halal food trade. Brazil is one of the world's largest exporters of halal chicken and beef. Brazilian food companies work with Islamic certification organisations so their products meet halal standards for customers in Saudi Arabia, the United Arab Emirates, and other Muslim-majority countries.

Investment and trade. Gulf countries, including Saudi Arabia, have increased investment in Latin America in areas like agriculture, mining, and energy. Football is another connection: many Brazilian and other Latin American players have played in the Saudi Pro League.`,
    vocab: [
      { word: 'Ancestry', definition: 'Your family origins; the people your family came from.' },
      { word: 'Spit', definition: 'A long metal stick on which meat is cooked over heat.' },
      { word: 'Halal', definition: 'Food that is allowed under Islamic law.' },
      { word: 'Certification', definition: 'An official document or process showing that something meets a standard.' },
    ],
    phrases: [
      { en: 'Arab-style tacos. (Mexico)', local: 'Tacos árabes', phonetic: 'TAH-kohs AH-rah-bes', note: 'Spanish. A Lebanese-Mexican dish from Puebla.' },
      { en: 'Esfiha / Kibbeh. (Brazil)', local: 'Esfiha / Kibe', phonetic: 'Es-FEE-hah / KEE-bee', note: 'Portuguese. Arab snacks sold all over Brazil.' },
      { en: 'Is this halal?', local: '¿Esto es halal? / Isso é halal?', phonetic: 'ES-toh es hah-LAHL / EE-soo eh hah-LAHL', note: 'Spanish / Portuguese. A useful question in restaurants.' },
      { en: 'My family is from...', local: 'Mi familia es de... / Minha família é de...', phonetic: 'Mee fah-MEE-lyah es deh / MEE-nyah fah-MEE-lyah eh jee', note: 'Spanish / Portuguese. Latin Americans love to talk about family origins.' },
    ],
    discussion: [
      'Were you surprised by the Lebanese influence on Mexican and Brazilian food? Why?',
      'Why do you think so many Arab immigrants became successful in business?',
      'How could a Saudi company build strong business relationships in Brazil or Mexico?',
    ],
  },
  {
    title: 'Building Bridges',
    emoji: '🌉',
    reading: `What is it like for Asian and Middle Eastern businesspeople to work in Latin America — and for Latin Americans to work with them? Here are some common experiences.

What Asian visitors often find challenging: The physical greetings — cheek kisses and hugs. Meetings that start late and run long. Very direct emotional expression — Latin Americans may show excitement, frustration, or disagreement openly. Flexible deadlines. Long lunches when they expected a quick meeting.

What Latin Americans often find challenging with Asian partners: Formality and distance, especially at first meetings. Long silences in meetings. Indirect communication — not knowing if "yes" really means yes. Decisions that take a long time because many people must agree. Less small talk and personal conversation.

What Middle Eastern and Latin American partners often share: Warm hospitality, the importance of family, generous meals, relationships before business, and flexible attitudes to time. Many Saudi and Latin American businesspeople find they connect easily.

How to build bridges:

Explain your culture. Tell partners how things work in your country — they will appreciate understanding you.

Ask about theirs. Show curiosity, not judgement.

Find common ground. Food, family, football, and travel are almost universal topics.

Meet in the middle. A Japanese manager might accept a hug; a Brazilian partner might be more punctual for the meeting with Tokyo.

Be patient. Strong cross-cultural relationships take time — but they can last for decades.`,
    vocab: [
      { word: 'Challenging', definition: 'Difficult in a way that tests your ability.' },
      { word: 'Hospitality', definition: 'Being friendly and generous to guests.' },
      { word: 'Judgement', definition: 'An opinion about whether something is good or bad.' },
      { word: 'Common ground', definition: 'Interests, opinions, or experiences that people share.' },
    ],
    phrases: [
      { en: 'In my country, we usually... How is it here?', local: '', phonetic: '', note: 'Shares your culture and invites theirs — a perfect bridge-building question.' },
      { en: 'I\'m still learning your customs, so please tell me if I make a mistake.', local: '', phonetic: '', note: 'Shows humility and makes people feel comfortable helping you.' },
      { en: 'We have a lot in common!', local: '¡Tenemos mucho en común! / Temos muito em comum!', phonetic: 'Teh-NEH-mohs MOO-choh en koh-MOON / TEH-moos MOON-too eyn koh-MOON', note: 'Spanish / Portuguese. A warm way to celebrate shared values.' },
      { en: 'Welcome to my country!', local: '', phonetic: '', note: 'Say it when Latin American partners visit you — and show them your hospitality.' },
    ],
    discussion: [
      'Which Latin American custom do you think would be the hardest for people from your country?',
      'What could Latin Americans find difficult about doing business in your country?',
      'What does your culture have in common with Latin American culture?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. How can these people build a stronger bridge?

Situation 1: The Silent Meeting
Rafael, a Brazilian sales manager, presents a proposal to a Japanese company in Osaka. At the end, there is a long silence. Nobody asks questions. Rafael fills the silence by talking more and lowering his price twice. Later, his Japanese contact says they were "just thinking". What should Rafael have done?

Situation 2: The Emotional Partner
Jae-won, from Korea, is negotiating with a Mexican supplier. The supplier becomes very animated — he raises his voice, waves his hands, and says, "This price is impossible!" Jae-won thinks the relationship is finished. The next day, the supplier calls him in a friendly mood with a new offer. What happened? How should Jae-won interpret this?

Situation 3: The Halal Dinner
A Brazilian company invites a delegation from Saudi Arabia to São Paulo. The plan is a traditional churrascaria and a bar afterwards. What changes would you suggest to make the visit comfortable and respectful for the Saudi guests?

Situation 4: The Factory Visit
A team from a Chinese car company is visiting partners in Monterrey. The Chinese team wants to start the factory tour at 8 a.m. and finish all meetings by noon. The Mexican hosts have planned a long lunch with the company owner. How could both sides meet in the middle?

Situation 5: Your Turn
Think about a business partner, colleague, or friend from Latin America — real or imaginary. What would you do to build a strong relationship with them over the next year?`,
    vocab: [
      { word: 'Proposal', definition: 'A formal plan or suggestion.' },
      { word: 'Animated', definition: 'Full of energy and emotion.' },
      { word: 'Interpret', definition: 'To decide what something means.' },
      { word: 'Delegation', definition: 'A group of people sent to represent a company or country.' },
    ],
    phrases: [],
    discussion: [
      'Which situation shows the biggest cultural misunderstanding? Why?',
      'In Situation 3, plan the perfect visit for the Saudi delegation. Discuss it with the AI.',
      'Answer Situation 5. What is your plan?',
    ],
  },
  {
    title: 'Course Review & Final Discussion',
    emoji: '🎓',
    reading: `Congratulations! You have completed Business in Latin America. Let us review the whole course.

Lesson 1 — Besos, Abrazos and Handshakes: Start with a handshake, then follow your partner's lead. Use titles like Licenciado and Ingeniero, and say goodbye to everyone.

Lesson 2 — "Ahorita" and the Meaning of Time: Time is flexible. Confirm meetings, agree on exact dates, and explain why deadlines matter.

Lesson 3 — Confianza: Trust comes before business. Small talk, family, WhatsApp, and personal relationships are essential.

Lesson 4 — The Long Lunch: Lunch is where relationships grow. Enjoy the cafezinho, applaud the asador, learn the mate rules, and stay for the sobremesa.

Lesson 5 — O Jeitinho Brasileiro: Creative problem-solving is a strength — but know where the line is.

Lesson 6 — Paperwork Heroes: Get the full list, bring copies, use professionals, and be patient with trámites.

Lesson 7 — Family Empires: Find the real decision-maker, respect the founder, and think long-term.

Lesson 8 — Markets, Mercados and Mobile Money: From tianguis to Pix and Mercado Libre. Offer local payments and instalments.

Lesson 9 — When the Country Stops: Plan around football, Carnival, Semana Santa, and the southern summer — and join the celebrations.

Lesson 10 — Asia Meets Latin America: The bridges are old and strong. Explain your culture, ask about theirs, and meet in the middle.`,
    vocab: [
      { word: 'Complete', definition: 'To finish something.' },
      { word: 'Essential', definition: 'Absolutely necessary.' },
      { word: 'Strength', definition: 'A good quality or ability.' },
      { word: 'Bridge', definition: 'Here: a connection between two different people or cultures.' },
    ],
    phrases: [],
    discussion: [
      'Which lesson in this course was the most useful or surprising for you? Why?',
      'Compare Business in Asia and Business in Latin America. What are the three biggest differences? What do they have in common?',
      'If you were going to Latin America for business next month, what three things would you remember from this course?',
      'Which Latin American country would you most like to visit or work in? Why?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "Asia Meets Latin America — historical and business connections between Asia, the Middle East and Latin America: the Manila galleons, Japanese-Brazilians, Chinese and Korean investment, Arab-Latin communities, and building cross-cultural bridges". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function AsiaMeetsLatinAmericaPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🌏</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 10 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>Asia Meets Latin America</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Japanese-Brazilians, Asian investment and new bridges</p>
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
