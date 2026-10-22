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
    title: 'Families at the Top',
    emoji: '🏛️',
    reading: `In Business in Asia, you met the family empires behind Samsung, CP Group, and Tata. Latin America has its own powerful business families — and in many ways, they are even more central to the economy.

Across the region, many of the largest companies are controlled by a small number of families. These family groups often own businesses in many different industries at the same time: banks, telecommunications, food, retail, mining, construction, and media. Business experts call these "grupos económicos" — economic groups.

Why are family groups so strong in Latin America? There are several reasons. In countries where banks were weak and economies were unstable, families often trusted only each other with money and decisions. Many families also built close relationships with governments over decades. And when one business became successful, they used the profits to buy or start businesses in other industries.

Many of these family empires were started by immigrants — from Spain, Italy, Lebanon, Germany, Japan, and other countries — who arrived with very little and built huge companies over several generations.

For anyone doing business in Latin America, it is very likely that you will work with a family-controlled company at some point — as a customer, a supplier, a partner, or an employee. Understanding how these companies think and make decisions is a real advantage.

In this lesson, you will meet family empires from Mexico, Brazil, Chile, Colombia, and Argentina.`,
    vocab: [
      { word: 'Central', definition: 'Most important; at the centre of something.' },
      { word: 'Telecommunications', definition: 'Sending information by phone, internet, radio, or TV.' },
      { word: 'Unstable', definition: 'Likely to change suddenly; not steady.' },
      { word: 'Advantage', definition: 'Something that helps you be more successful than others.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'Are there powerful business families in your country? What industries are they in?',
      'Why do you think families trust each other more than banks or governments in some countries?',
    ],
  },
  {
    title: 'Mexico — Slim, Bimbo and OXXO',
    emoji: '🇲🇽',
    reading: `Mexico is home to some of the most famous family business groups in the world.

Carlos Slim and Grupo Carso. Carlos Slim, the son of a Lebanese immigrant, has been one of the richest people in the world. His family controls Grupo Carso, which is involved in construction, retail, and industry, and América Móvil — one of the largest mobile phone companies in Latin America, with brands like Telcel in Mexico and Claro in many other countries. In Mexico, it is very difficult to live a day without using something connected to the Slim family's businesses.

Grupo Bimbo. Bimbo started in 1945 as a small bakery in Mexico City, founded by Lorenzo Servitje and his partners. Its first products were sliced bread and buns. Today, Grupo Bimbo is often described as the largest baking company in the world, with factories and brands across the Americas, Europe, Asia, and Africa. The company is known for its strong values and is still connected to the founding families.

FEMSA and OXXO. FEMSA is a large business group based in Monterrey, a city famous for its industrial families. One of FEMSA's best-known businesses is OXXO, the red-and-yellow convenience store chain. There are many thousands of OXXO stores across Mexico — people use them not only to buy snacks and drinks, but also to pay bills, send money, and pay for online shopping in cash.

Monterrey, in northern Mexico, is often called the country's industrial capital. Many of its biggest companies were built by local families with a strong reputation for hard work and discipline.`,
    vocab: [
      { word: 'Immigrant', definition: 'A person who has moved to live permanently in another country.' },
      { word: 'Bun', definition: 'A small round piece of bread.' },
      { word: 'Convenience store', definition: 'A small shop that stays open long hours and sells everyday items.' },
      { word: 'Discipline', definition: 'The ability to control your behaviour and work hard.' },
    ],
    phrases: [
      { en: 'Economic group (family business group).', local: 'Grupo económico', phonetic: 'GROO-poh eh-koh-NOH-mee-koh', note: 'A group of companies controlled by one owner or family.' },
      { en: 'The founder.', local: 'El fundador / La fundadora', phonetic: 'El foon-dah-DOR / Lah foon-dah-DOH-rah', note: 'Founders are often deeply respected in family companies.' },
      { en: 'Family business.', local: 'Empresa familiar', phonetic: 'Em-PREH-sah fah-mee-LYAR', note: 'The common Spanish term for a family-owned company.' },
    ],
    discussion: [
      'Is there a company in your country that you use every day without thinking about it?',
      'Why do you think OXXO stores are used for paying bills and sending money?',
      'What do you think helped Bimbo grow from one bakery into a global company?',
    ],
  },
  {
    title: 'Brazil — Banks, Industry and Media',
    emoji: '🇧🇷',
    reading: `Brazil, the largest economy in Latin America, also has many powerful business families.

Itaú Unibanco. Itaú Unibanco is one of the largest banks in Latin America. It was created in 2008 by a merger between two Brazilian banks, Itaú and Unibanco. The bank is still connected to several founding families, including the Setubal, Villela, and Moreira Salles families, who have been important in Brazilian banking for generations.

Votorantim. Votorantim is one of Brazil's oldest and biggest family-controlled industrial groups. Its history goes back more than 100 years, to a textile factory in the town of Votorantim, near São Paulo. The Ermírio de Moraes family built it into a group with businesses in cement, metals, energy, and more. Votorantim is often studied as an example of how a family company can survive across many generations.

Grupo Globo. The Marinho family controls Grupo Globo, the largest media group in Brazil. Its TV channel, TV Globo, is famous for its "telenovelas" — soap operas — which are watched by millions of Brazilians every night and exported to many other countries. Globo also owns newspapers, radio stations, and streaming services.

Brazilian business families often have strong connections to São Paulo, the country's financial and business centre. Many of these families send their children to study at top universities abroad, and the new generations are bringing modern management, technology, and international experience into the old family empires.`,
    vocab: [
      { word: 'Merger', definition: 'When two companies join together to become one.' },
      { word: 'Textile', definition: 'Cloth or fabric, or the industry that makes it.' },
      { word: 'Cement', definition: 'A grey powder mixed with water and sand to make concrete for building.' },
      { word: 'Soap opera', definition: 'A TV drama series about the lives of a group of characters.' },
    ],
    phrases: [
      { en: 'Family business.', local: 'Empresa familiar', phonetic: 'Em-PREH-zah fah-mee-lee-AR', note: 'Portuguese. Same words as Spanish, with a different pronunciation.' },
      { en: 'Heir / successor.', local: 'Herdeiro / Herdeira', phonetic: 'Ehr-DAY-roo / Ehr-DAY-rah', note: 'Portuguese. The person who will take over the business.' },
      { en: 'Shareholder.', local: 'Acionista', phonetic: 'Ah-syoh-NEES-tah', note: 'Portuguese. A person who owns part of a company.' },
      { en: 'Board of directors.', local: 'Conselho de administração', phonetic: 'Kohn-SEH-lyoo jee ahd-mee-nees-trah-SOWNG', note: 'Portuguese. Often includes family members in family companies.' },
    ],
    discussion: [
      'Do people in your country watch soap operas? Are any of them from Latin America?',
      'Why might a family company survive for more than 100 years?',
      'Do you think the new generation should change the family business or protect its traditions?',
    ],
  },
  {
    title: 'Chile, Colombia and Argentina',
    emoji: '🌎',
    reading: `Family business groups are also central in other Latin American countries.

Chile — the Luksic family. The Luksic group is one of the most powerful business groups in Chile. Its interests include mining (through Antofagasta, a major copper company), banking (Banco de Chile), and drinks (CCU, a large beer and drinks company). Copper is one of Chile's most important exports, so mining families have great influence on the economy.

Colombia — the Santo Domingo family. For many years, the Santo Domingo family controlled Bavaria, Colombia's biggest beer company. In 2005, Bavaria was sold to the international brewer SABMiller in one of the largest business deals in Colombian history. The family remained an important investor in many other businesses.

Argentina — Techint and Arcor. Techint was founded in 1945 by Agostino Rocca, an Italian engineer who moved to Argentina. Today, the Rocca family's group is a global leader in steel pipes for the oil and gas industry, through companies like Tenaris and Ternium. Arcor, another Argentine family company, started in 1951 in the small town of Arroyito, in Córdoba province. It became one of the world's largest makers of sweets and candies, selling its products in many countries.

These stories show common patterns: immigrant founders, strong family values, growth into many industries, and the challenge of passing the business to the next generation.`,
    vocab: [
      { word: 'Copper', definition: 'A reddish-brown metal used in electrical wires and pipes.' },
      { word: 'Export', definition: 'A product that is sold to another country.' },
      { word: 'Brewer', definition: 'A company that makes beer.' },
      { word: 'Province', definition: 'One of the large areas that some countries are divided into.' },
    ],
    phrases: [
      { en: 'Partner.', local: 'Socio / Socia', phonetic: 'SOH-syoh / SOH-syah', note: 'Spanish. A business partner or co-owner.' },
      { en: 'The next generation.', local: 'La próxima generación', phonetic: 'Lah PROK-see-mah heh-neh-rah-SYOHN', note: 'Spanish. An important topic in every family business.' },
      { en: 'Third generation.', local: 'Tercera generación', phonetic: 'Ter-SEH-rah heh-neh-rah-SYOHN', note: 'Spanish. The founder\'s grandchildren — often a difficult stage.' },
    ],
    discussion: [
      'Why do you think many Latin American family empires were started by immigrants?',
      'Should a family sell its company for a lot of money, or keep it for future generations?',
      'Which family empire from this page do you find the most interesting? Why?',
    ],
  },
  {
    title: 'Inside the Family Firm',
    emoji: '👨‍👩‍👧',
    reading: `How does a Latin American family company really work?

The patriarch or matriarch. Many family companies are led by a strong older figure — often the founder or their son or daughter. Employees may call him "Don" or her "Doña" followed by their first name, as a sign of deep respect: "Don Roberto", "Doña Carmen". The patriarch's opinion can be final, even if he has officially retired.

Family in key positions. Sons, daughters, nephews, and in-laws often hold important jobs. Some are very talented. Others are there mainly because they are family. Non-family managers need to learn how to work with both.

Loyalty and trust. Long-serving employees are often treated almost like family. Loyalty is highly valued, and many workers stay with the same family company for decades.

Succession — the big challenge. Passing the company to the next generation is one of the hardest moments. Brothers and sisters may disagree. Cousins may compete. Some families split the business, and some sell it.

The family protocol. To avoid conflicts, many Latin American business families now create a "protocolo familiar" — a family protocol or constitution. It sets rules about who can work in the company, how leaders are chosen, how profits are shared, and how disagreements are solved. Many families also create a "family council" that meets regularly to discuss the business.

Professional management. Increasingly, families hire professional managers from outside and keep family members on the board. This mix of family values and professional management is becoming more common.`,
    vocab: [
      { word: 'Patriarch', definition: 'An older man who is the head of a family or group.' },
      { word: 'Matriarch', definition: 'An older woman who is the head of a family or group.' },
      { word: 'Succession', definition: 'The process of passing a position or business to the next person.' },
      { word: 'Constitution', definition: 'A set of basic rules for how an organisation is run.' },
    ],
    phrases: [
      { en: 'Don Roberto / Doña Carmen', local: 'Don / Doña + first name', phonetic: 'Dohn / DOH-nyah', note: 'Spanish. A respectful title for older, senior people — used with the first name.' },
      { en: 'Family protocol.', local: 'Protocolo familiar', phonetic: 'Proh-toh-KOH-loh fah-mee-LYAR', note: 'Spanish. A written agreement on how the family runs the business.' },
      { en: 'Family council.', local: 'Consejo de familia', phonetic: 'Kohn-SEH-hoh deh fah-MEE-lyah', note: 'Spanish. A group of family members who meet to discuss the business.' },
      { en: 'Who makes the final decision?', local: '¿Quién toma la decisión final?', phonetic: 'Kyen TOH-mah lah deh-see-SYOHN fee-NAHL', note: 'Spanish. A useful (polite!) question to understand a family company.' },
    ],
    discussion: [
      'Is there a respectful title like "Don" or "Doña" in your language?',
      'Do you think a family protocol is a good idea? What rules would you include?',
      'Would you be happy working in a company where the boss\'s son or daughter might become your manager?',
    ],
  },
  {
    title: 'Working With a Latin American Family Firm',
    emoji: '🤝',
    reading: `If you work with a family-controlled company in Latin America, these tips will help.

Find the real decision-maker. The person with the biggest title is not always the person who decides. The founder, a senior family member, or a trusted long-time advisor may have more influence. Watch who people look at before they answer, and who arrives last to the meeting.

Respect the founder's story. Ask about the history of the company. Showing interest in how it started — and how the family built it — creates warmth and trust.

Build confianza with the family. As you learned in Lesson 3, relationships come first. Lunches, dinners, and personal conversations matter even more in family companies.

Be patient. Important decisions may be discussed at family dinners or weekend gatherings, not in the office. Pushing for a quick answer can damage the relationship.

Respect the next generation. Young family members you meet today may be running the company in a few years. Treat them with respect.

Stay out of family politics. Never take sides in a disagreement between family members, and never criticise one family member to another.

Show long-term commitment. Family companies think in decades. Showing that you want a long-term partnership — not a quick profit — is a strong advantage.

Compare this with what you learned about Asian family businesses in Business in Asia. You will see that many of the same rules apply on both sides of the Pacific.`,
    vocab: [
      { word: 'Decision-maker', definition: 'The person who has the power to make the final decision.' },
      { word: 'Advisor', definition: 'A person who gives advice, especially in business.' },
      { word: 'Gathering', definition: 'A meeting of people, often for a social reason.' },
      { word: 'Commitment', definition: 'A promise to support something for a long time.' },
    ],
    phrases: [
      { en: 'How did the company begin?', local: '¿Cómo empezó la empresa? / Como a empresa começou?', phonetic: 'KOH-moh em-peh-SOH lah em-PREH-sah / KOH-moo ah em-PREH-zah koh-meh-SOH', note: 'Spanish / Portuguese. A great question to show respect for the founder.' },
      { en: 'We\'re interested in a long-term relationship.', local: 'Nos interesa una relación a largo plazo.', phonetic: 'Nohs een-teh-REH-sah OO-nah reh-lah-SYOHN ah LAR-goh PLAH-soh', note: 'Spanish. Family companies value long-term thinking.' },
      { en: 'Please take all the time you need.', local: 'Tómense el tiempo que necesiten.', phonetic: 'TOH-men-seh el TYEM-poh keh neh-seh-SEE-ten', note: 'Spanish. Shows patience while the family decides.' },
    ],
    discussion: [
      'How could you find out who really makes decisions in a family company?',
      'Which tip from this page is the same as working with Asian family businesses?',
      'Why is it dangerous to take sides in a family disagreement?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. What is happening, and what should the person do?

Situation 1: The Quiet Grandfather
Satoshi, from Japan, is negotiating with a family-owned food company in Guadalajara. He meets the CEO, who is friendly and positive. At every meeting, an older man — "Don Ernesto" — sits quietly and listens. The CEO always says, "I need to discuss it with my father." Who should Satoshi focus on? How?

Situation 2: The Young Director
Yuna, from Korea, is meeting a Brazilian family company. The 26-year-old granddaughter of the founder is the new marketing director. Yuna's colleague says, "She's only there because of her family. Let's talk to the older managers." What should Yuna do?

Situation 3: The Family Dispute
At a dinner in Santiago, two Chilean brothers who run their family business start arguing about the future of the company. One brother turns to Majed, a Saudi investor, and asks, "What do you think? Should we sell?" How should Majed respond?

Situation 4: The Long Wait
Chen Hao, from China, has been waiting four months for a decision from an Argentine family company. His boss in Shanghai wants an answer this week. Chen thinks the family needs more time. What should he say to his boss? What could he do to move things forward politely?

Situation 5: The Outsider
María, a talented non-family manager, has worked for a Mexican family company for 12 years. The founder is retiring. Everyone knows his son, who has much less experience, will become the new CEO. María is thinking about leaving. What advice would you give her?`,
    vocab: [
      { word: 'Negotiate', definition: 'To discuss something to reach an agreement.' },
      { word: 'Focus on', definition: 'To give most of your attention to something or someone.' },
      { word: 'Dispute', definition: 'A serious disagreement or argument.' },
      { word: 'Outsider', definition: 'A person who is not part of a group, such as a family.' },
    ],
    phrases: [],
    discussion: [
      'Which situation would be the hardest for you? Why?',
      'In Situation 3, what exactly could Majed say? Practise it with the AI.',
      'In Situation 5, should María stay or leave? What are the advantages of each choice?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

Families at the top: Many of Latin America's biggest companies are controlled by family "grupos económicos" that operate in many industries. Many were founded by immigrants.

Mexico: Carlos Slim's Grupo Carso and América Móvil (Telcel, Claro). Grupo Bimbo, which started as one bakery in 1945. FEMSA and its OXXO convenience stores, from Monterrey — Mexico's industrial capital.

Brazil: Itaú Unibanco and its banking families. Votorantim, an industrial group with more than 100 years of history. Grupo Globo, the media giant famous for telenovelas.

Chile, Colombia, and Argentina: The Luksic group in mining, banking, and drinks. The Santo Domingo family and the sale of Bavaria. Techint, founded by an Italian engineer, and Arcor, the sweets maker from a small town in Córdoba.

Inside the family firm: Respected leaders called "Don" and "Doña", family members in key positions, strong loyalty, and the big challenge of succession. Many families now use a "protocolo familiar" and family councils.

Working with family firms: Find the real decision-maker, respect the founder's story, build confianza, be patient, respect the next generation, stay out of family politics, and show long-term commitment.`,
    vocab: [
      { word: 'Operate', definition: 'To do business or work in a particular area.' },
      { word: 'Giant', definition: 'A very large and powerful company or organisation.' },
      { word: 'Key position', definition: 'An important job in an organisation.' },
      { word: 'Respect', definition: 'To admire someone and treat them well.' },
    ],
    phrases: [],
    discussion: [
      'Compare Latin American family empires with the Asian family empires from Business in Asia. What is similar? What is different?',
      'Would you prefer to work for a family company or a company run by professional managers? Why?',
      'If you started a business, would you want your family to run it after you?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "Family Empires — family-controlled business groups in Latin America such as Grupo Carso, Grupo Bimbo, FEMSA/OXXO, Itaú, Votorantim, Globo, Luksic, Techint and Arcor, and how to work with family companies". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function LatamFamilyEmpiresPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🏛️</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 7 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>Family Empires</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>{"The families behind Latin America's biggest companies"}</p>
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
