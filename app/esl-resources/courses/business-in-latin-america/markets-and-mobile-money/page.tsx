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
    title: 'From Street Stall to Smartphone',
    emoji: '🛒',
    reading: `Walk through a city in Latin America and you will see business everywhere. A woman selling fresh juice from a cart. A man selling phone chargers at a traffic light. A small family shop on every corner. A weekly street market full of fruit, clothes, and electronics.

This is the informal economy — small businesses and workers that are often not officially registered and usually work with cash. In many Latin American countries, nearly half of all workers earn their living in the informal economy. It gives millions of people a way to make money when formal jobs are hard to find.

At the same time, Latin America has become one of the most exciting places in the world for digital money and online shopping. Brazil's Pix payment system is used by most adults in the country. Digital banks like Nubank have grown to serve tens of millions of customers. Mercado Libre, founded in Argentina, has become one of the biggest companies in the region.

The interesting thing is that these two worlds are now meeting. A street food seller in São Paulo may accept payment by Pix on her phone. A small shop in Mexico City may sell on WhatsApp. A market trader in Bogotá may use a digital wallet instead of a cash box.

In this lesson, you will explore traditional markets, the informal economy, and the digital payment revolution — and learn how to sell to Latin American customers.`,
    vocab: [
      { word: 'Cart', definition: 'A small vehicle with wheels, pushed by hand, often used to sell food.' },
      { word: 'Informal economy', definition: 'Work and businesses that are not officially registered or taxed.' },
      { word: 'Digital wallet', definition: 'An app on your phone that stores money and makes payments.' },
      { word: 'Revolution', definition: 'A very big and sudden change.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'Do you usually pay with cash, card, or phone? Why?',
      'Are there many street sellers and markets in your city? What do they sell?',
    ],
  },
  {
    title: 'Mexico — Tianguis, Tienditas and OXXO',
    emoji: '🇲🇽',
    reading: `In Mexico, markets have a very long history. The word "tianguis" comes from the Nahuatl language of the Aztecs, and street markets have existed in Mexico since long before the Spanish arrived. Today, tianguis are weekly or temporary street markets that appear in different neighbourhoods on different days. You can buy fruit, vegetables, clothes, tools, toys, and street food — usually at lower prices than in supermarkets.

Mexico also has permanent covered markets called "mercados", where families have run the same food stalls for generations.

Then there are the "tienditas" — small family-run corner shops, sometimes called "changarros" or "misceláneas". There are hundreds of thousands of them across the country. They sell drinks, snacks, eggs, tortillas, phone credit, and household items, often in very small quantities. Many customers buy just what they need for the day.

Cash is still very important in Mexico. Many people, especially in smaller towns, do not have bank accounts or credit cards. This is one reason why OXXO convenience stores are so useful. At OXXO, customers can pay electricity bills, top up phones, send money, and even pay for online shopping in cash. Online shops often offer "pay at OXXO" as a payment option.

Mexico also receives huge amounts of money every year from Mexicans working abroad, especially in the USA. These "remesas" — remittances — are worth tens of billions of dollars each year and are an important source of income for many families.`,
    vocab: [
      { word: 'Temporary', definition: 'Lasting for only a limited time.' },
      { word: 'Quantity', definition: 'An amount or number of something.' },
      { word: 'Top up', definition: 'To add more money or credit, for example to a phone.' },
      { word: 'Remittance', definition: 'Money that a person working abroad sends home to their family.' },
    ],
    phrases: [
      { en: 'How much is it?', local: '¿Cuánto cuesta?', phonetic: 'KWAN-toh KWES-tah', note: 'The most useful question at any market.' },
      { en: 'Can you give me a better price?', local: '¿Me lo deja más barato?', phonetic: 'Meh loh DEH-hah mahs bah-RAH-toh', note: 'A polite way to bargain at a tianguis. Smile when you say it!' },
      { en: 'Street market.', local: 'Tianguis', phonetic: 'tee-AHN-gees', note: 'From the Aztec language Nahuatl. A weekly or temporary market.' },
      { en: 'Can I pay with card?', local: '¿Puedo pagar con tarjeta?', phonetic: 'PWEH-doh pah-GAR kohn tar-HEH-tah', note: 'Many small shops and stalls still only accept cash.' },
    ],
    discussion: [
      'Do you prefer shopping at markets or supermarkets? Why?',
      'Why do you think many Mexicans pay for online shopping in cash at OXXO?',
      'Is bargaining normal in your country? Where?',
    ],
  },
  {
    title: 'Brazil — Feiras, Camelôs and Pix',
    emoji: '🇧🇷',
    reading: `In Brazil, the "feira livre" — the open street market — is part of weekly life. Every neighbourhood has its market day, when stalls fill a street with fresh fruit, vegetables, fish, and flowers. Sellers shout their prices and offer free samples. A favourite feira snack is "pastel" — a crispy fried pastry — with a glass of fresh sugarcane juice, "caldo de cana".

Street vendors, called "camelôs", sell everything from umbrellas on rainy days to phone cases and sunglasses. They are a big part of Brazil's informal economy.

But the biggest change in Brazilian commerce in recent years is Pix. Pix is an instant payment system created by Brazil's Central Bank and launched in November 2020. With Pix, people can send money to anyone in seconds, 24 hours a day, using just a phone number, email, tax number, or a QR code. For individuals, it is usually free.

Pix spread incredibly fast. Within a few years, most Brazilian adults were using it. Today, you can pay by Pix at supermarkets, restaurants, taxis, and even many street stalls and feiras. Many small sellers who never accepted cards now accept Pix.

Brazil is also home to Nubank, a digital bank founded in São Paulo in 2013. With its purple card and simple app, Nubank attracted tens of millions of customers who were tired of traditional banks' high fees and long queues. It has become one of the largest digital banks in the world.`,
    vocab: [
      { word: 'Sample', definition: 'A small amount of something that you can try for free.' },
      { word: 'Pastry', definition: 'A food made from flour, fat, and water, baked or fried.' },
      { word: 'Commerce', definition: 'The buying and selling of goods and services.' },
      { word: 'Launch', definition: 'To start or introduce something new.' },
    ],
    phrases: [
      { en: 'Can I pay by Pix?', local: 'Posso pagar no Pix?', phonetic: 'POH-soo pah-GAR noo PEEKS', note: 'One of the most useful questions in Brazil today.' },
      { en: 'What\'s your Pix key?', local: 'Qual é a sua chave Pix?', phonetic: 'Kwahl eh ah SOO-ah SHAH-vee PEEKS', note: 'A Pix "key" can be a phone number, email, or tax number.' },
      { en: 'How much is it?', local: 'Quanto custa?', phonetic: 'KWAN-too KOOS-tah', note: 'Portuguese. Use it at any feira or shop.' },
      { en: 'Street market.', local: 'Feira livre', phonetic: 'FAY-rah LEE-vree', note: 'Literally "free market". A weekly neighbourhood market.' },
    ],
    discussion: [
      'Is there a payment system like Pix in your country? How popular is it?',
      'Why do you think Pix became popular so quickly?',
      'Would you trust a digital-only bank with your money? Why or why not?',
    ],
  },
  {
    title: 'Mercado Libre — The Amazon of Latin America',
    emoji: '📦',
    reading: `In 1999, an Argentine student named Marcos Galperin was studying for his MBA at Stanford University in the USA. He saw how online marketplaces were growing in America and had an idea: build one for Latin America. He returned to Buenos Aires and founded Mercado Libre — "free market" in Spanish, "Mercado Livre" in Portuguese.

At the start, many people thought it would fail. Few Latin Americans had internet access. Even fewer had credit cards. Many people did not trust online shopping. Postal services were slow and unreliable.

Instead of giving up, Mercado Libre built solutions for each problem.

The payment problem. It created Mercado Pago, its own payment system, so buyers and sellers could pay safely — including in cash at shops, or in monthly instalments.

The delivery problem. It built its own logistics network, Mercado Envíos, with warehouses, trucks, and even planes, to deliver faster.

The trust problem. It created a seller reputation system, so buyers could see which sellers were reliable.

Today, Mercado Libre is the largest e-commerce company in Latin America and one of the most valuable companies in the region. Mercado Pago has grown into a major fintech business, offering digital wallets, loans, and payments to millions of people who never had a bank account.

Mercado Libre's story shows an important lesson: in emerging markets, the best businesses often succeed by solving the basic problems that others ignore.`,
    vocab: [
      { word: 'Marketplace', definition: 'A website where many sellers can sell products to buyers.' },
      { word: 'Instalment', definition: 'One of several payments you make over time to pay for something.' },
      { word: 'Logistics', definition: 'The organisation of moving and storing goods.' },
      { word: 'Emerging market', definition: 'A country whose economy is growing and developing quickly.' },
    ],
    phrases: [
      { en: 'Free shipping.', local: 'Envío gratis / Frete grátis', phonetic: 'En-VEE-oh GRAH-tees / FREH-chee GRAH-chees', note: 'Spanish / Portuguese. A big reason customers choose one seller over another.' },
      { en: 'When will it arrive?', local: '¿Cuándo llega?', phonetic: 'KWAN-doh YEH-gah', note: 'Spanish. A common customer question.' },
      { en: 'Seller reputation.', local: 'Reputación del vendedor', phonetic: 'Reh-poo-tah-SYOHN del ven-deh-DOR', note: 'Spanish. Online buyers check this carefully before they buy.' },
    ],
    discussion: [
      'What problems did Mercado Libre need to solve to succeed?',
      'What is the biggest online shopping website in your country? How is it similar to Mercado Libre?',
      'Can you think of a basic problem in your country that a new business could solve?',
    ],
  },
  {
    title: 'Fintech and the Unbanked',
    emoji: '📱',
    reading: `For many years, a large share of adults in Latin America did not have a bank account. They were "unbanked". Banks had high fees, required many documents, and had few branches in poor or rural areas. People kept their savings in cash — at home, in shops, or through informal savings groups.

Smartphones changed this. Today, many people who never entered a bank branch are using financial services through apps. These new technology companies are called "fintechs" — from "financial technology".

Fintech is growing fast across the region. Brazil has Nubank and Pix. Argentina has Mercado Pago and other digital wallets, which became popular partly because high inflation encouraged people to spend money quickly or move it into digital accounts. In Colombia, apps like Nequi and Daviplata have helped millions of people send and receive money from their phones. Mexico has a growing number of digital banks and payment apps, and its banking system has fast digital transfers.

Fintech brings real benefits: lower costs, easier access, and safer storage of money. Small businesses can accept digital payments, get small loans, and build a financial history.

But there are risks too. Some people borrow too much through easy online loans. Online fraud and scams are a serious problem. And people without smartphones or digital skills can still be left behind.

For businesses, the message is clear: if you want to sell in Latin America, you need to accept the payment methods people actually use — not only credit cards.`,
    vocab: [
      { word: 'Unbanked', definition: 'Not having a bank account.' },
      { word: 'Branch', definition: 'One of the local offices of a bank or company.' },
      { word: 'Fraud', definition: 'Illegally tricking people to get money.' },
      { word: 'Left behind', definition: 'Not able to make progress when others do.' },
    ],
    phrases: [
      { en: 'Do you accept transfers?', local: '¿Aceptan transferencias?', phonetic: 'Ah-SEP-tahn trans-feh-REN-syahs', note: 'Spanish. Bank transfers by phone are now very common.' },
      { en: 'I\'ll send it to you now.', local: 'Te lo transfiero ahora.', phonetic: 'Teh loh trans-FYEH-roh ah-OH-rah', note: 'Spanish. Common when paying friends or small businesses.' },
      { en: 'Digital wallet.', local: 'Billetera digital / Carteira digital', phonetic: 'Bee-yeh-TEH-rah dee-hee-TAHL / Kar-TAY-rah jee-zhee-TOW', note: 'Spanish / Portuguese.' },
    ],
    discussion: [
      'Do you know anyone who does not have a bank account? Why not?',
      'What are the benefits and dangers of easy online loans?',
      'How can fintech companies protect customers from fraud?',
    ],
  },
  {
    title: 'Selling to Latin American Customers',
    emoji: '💳',
    reading: `If your company wants to sell products in Latin America, here are some important things to know.

Offer local payment methods. Credit cards are only one option. Customers may want to pay by Pix in Brazil, in cash at OXXO in Mexico, with a digital wallet, or by bank transfer. In Brazil, many people also use the "boleto" — a payment slip that can be paid at banks, lottery shops, or online.

Instalments are essential. In Brazil, buying in instalments — "parcelado" — is extremely common, even for small purchases like clothes or shoes. Shops advertise prices like "10x sem juros" — ten payments with no interest. In Mexico, "meses sin intereses" — months without interest — is a key selling point for electronics, appliances, and travel. If you do not offer instalments, many customers may not buy.

Sell where people are. WhatsApp, Instagram, and Facebook are major sales channels. Many customers prefer to ask questions and order through WhatsApp before they buy.

Delivery matters. Fast, reliable delivery and free shipping are important. Many online buyers also want to track their order step by step.

Build trust. Clear prices, good reviews, easy returns, and friendly customer service help customers trust a new brand.

Speak their language. Brazil needs Portuguese. The rest of the region needs Spanish — and local expressions vary. A website in only English will lose most customers.`,
    vocab: [
      { word: 'Payment slip', definition: 'A piece of paper or document used to make a payment.' },
      { word: 'Interest', definition: 'Extra money you pay when you borrow money.' },
      { word: 'Appliance', definition: 'A machine used in the home, like a fridge or washing machine.' },
      { word: 'Track', definition: 'To follow the movement or progress of something.' },
    ],
    phrases: [
      { en: 'Ten instalments with no interest.', local: '10x sem juros', phonetic: 'Dehs vay-zehs seyn ZHOO-roos', note: 'Portuguese. Seen in almost every Brazilian shop window.' },
      { en: 'Months without interest.', local: 'Meses sin intereses', phonetic: 'MEH-sehs seen een-teh-REH-sehs', note: 'Spanish (Mexico). A very important selling point.' },
      { en: 'Can I pay in instalments?', local: '¿Puedo pagar a meses? / Posso parcelar?', phonetic: 'PWEH-doh pah-GAR ah MEH-sehs / POH-soo par-seh-LAR', note: 'Spanish / Portuguese. Customers ask this all the time.' },
      { en: 'Send us a message on WhatsApp.', local: 'Escríbenos por WhatsApp. / Manda uma mensagem no WhatsApp.', phonetic: 'Es-KREE-beh-nohs por WATS-ap / MAHN-dah OO-mah men-SAH-zheyn noo WATS-ap', note: 'Spanish / Portuguese. A normal way for shops to invite customers.' },
    ],
    discussion: [
      'Do people in your country often buy things in instalments? What kinds of things?',
      'Why do you think instalments are so popular in Brazil and Mexico?',
      'If you were selling a product in Latin America, which tip would you focus on first?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `This time, you are the business advisor. Read each situation and decide what the person should do.

Situation 1: The Card-Only Shop
A Japanese cosmetics brand opens an online shop in Brazil. It only accepts international credit cards. After three months, many customers visit the website, but very few buy. What is the problem? What should the company change?

Situation 2: The Instalment Question
A Korean electronics company launches a new laptop in Mexico at a high price. A local partner says, "You must offer 'meses sin intereses' or nobody will buy it." The Korean managers think instalments are risky and only want full payment. What would you advise?

Situation 3: The WhatsApp Seller
Laila, from Saudi Arabia, sells luxury perfumes. She wants to start selling in Colombia. A local friend says she should sell mainly through WhatsApp and Instagram, not only through a website. Laila thinks WhatsApp is "not professional". What would you tell her?

Situation 4: The Market Visit
Wang Jun, from China, visits a tianguis in Mexico City. He wants to buy a souvenir. The seller says it costs 300 pesos. Wang Jun has heard that bargaining is normal, so he offers 50 pesos. The seller looks offended. What went wrong? How should he bargain?

Situation 5: The Small Shop
Doña Lupe has a small tiendita in Puebla. She only accepts cash. Many young customers now ask, "Can I pay by transfer?" She is worried about technology and fees. What advice would you give her?`,
    vocab: [
      { word: 'Cosmetics', definition: 'Products like make-up and skin cream used to improve appearance.' },
      { word: 'Risky', definition: 'Possibly dangerous or likely to cause loss.' },
      { word: 'Souvenir', definition: 'Something you buy to remember a place you visited.' },
      { word: 'Offended', definition: 'Upset because someone was rude or disrespectful.' },
    ],
    phrases: [],
    discussion: [
      'Choose one situation. What is your advice? Explain why.',
      'In Situation 4, how would you bargain politely? Practise it with the AI.',
      'In Situation 5, should Doña Lupe start accepting digital payments? Why?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

Two worlds meeting: Latin America has a large informal economy, with nearly half of workers in many countries working informally. At the same time, it is a world leader in digital payments and fintech.

Mexico: Tianguis street markets, permanent mercados, and hundreds of thousands of tienditas. Cash is still important, so OXXO stores are used to pay bills and pay for online shopping. Remittances from Mexicans abroad are worth tens of billions of dollars each year.

Brazil: Weekly feiras with pastel and sugarcane juice. Camelôs selling in the street. Pix, launched in 2020, lets people send money instantly and is now used almost everywhere. Nubank became one of the world's largest digital banks.

Mercado Libre: Founded in Argentina in 1999. It succeeded by solving basic problems — payments with Mercado Pago, delivery with its own logistics, and trust with seller reputations.

Fintech and the unbanked: Apps and digital wallets are bringing financial services to millions of people without bank accounts. Benefits include lower costs and easier access. Risks include too much debt and fraud.

Selling in Latin America: Offer local payment methods, offer instalments ("parcelado", "meses sin intereses"), sell on WhatsApp and social media, deliver reliably, build trust, and use Spanish and Portuguese.`,
    vocab: [
      { word: 'Leader', definition: 'A person, company, or country that is the most successful or advanced.' },
      { word: 'Access', definition: 'The ability or right to use something.' },
      { word: 'Debt', definition: 'Money that you owe to someone.' },
      { word: 'Reliably', definition: 'In a way that can be trusted to work well.' },
    ],
    phrases: [],
    discussion: [
      'Compare how people pay for things in Latin America and in your country.',
      'Which company or idea from this lesson impressed you the most? Why?',
      'Do you think cash will disappear completely in the next 20 years?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "Markets, Mercados and Mobile Money — street markets, the informal economy, OXXO, Pix, Nubank, Mercado Libre, fintech and how to sell to Latin American customers". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function MarketsMobileMoneyPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🛒</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 8 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>Markets, Mercados and Mobile Money</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>From street markets to Pix and Mercado Libre</p>
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
