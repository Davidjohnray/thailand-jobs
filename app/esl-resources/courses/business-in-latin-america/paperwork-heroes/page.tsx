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
    title: 'The Paper Mountain',
    emoji: '📑',
    reading: `Opening a bank account. Registering a company. Renting an office. Getting a work visa. In many countries, these are simple tasks. In much of Latin America, they can become long adventures through a mountain of paperwork.

The Spanish word "trámite" means an official procedure — the forms, documents, stamps, signatures, and visits needed to get something approved. Foreigners in Latin America quickly learn this word, because they hear it all the time. "It's a long trámite." "You need to do the trámite in person." "The trámite is not ready yet."

Why is bureaucracy so heavy in some Latin American countries? Historians point to several reasons: legal systems with many formal requirements, a tradition of strong central government, and, in some cases, low trust — so the system asks for many documents to prove that people are who they say they are.

Typical requirements can include certified copies of documents, notarised signatures, proof of address, tax ID numbers, official stamps, and translations by approved translators. A small mistake — a missing stamp or a name spelled slightly differently — can mean starting again.

But Latin Americans have also developed clever ways to survive bureaucracy, including professional helpers who know the system inside out. And many countries are now moving quickly towards digital government.

In this lesson, you will learn about paperwork in Brazil, Mexico, and other countries, the people who help you through it, and practical tips to survive.`,
    vocab: [
      { word: 'Procedure', definition: 'An official way of doing something, usually with steps to follow.' },
      { word: 'Certified', definition: 'Officially confirmed as true or correct.' },
      { word: 'Notarised', definition: 'Officially confirmed by a notary, a legal official.' },
      { word: 'Inside out', definition: 'Completely; in every detail.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'What is the most difficult official process you have had to do in your country?',
      'Why do you think some countries have more paperwork than others?',
    ],
  },
  {
    title: 'Brazil — CPF, Cartório and Despachante',
    emoji: '🇧🇷',
    reading: `In Brazil, three words will help you survive the paperwork.

CPF. The CPF is a personal tax identification number. Almost everything in Brazil requires it: opening a bank account, signing a phone contract, renting an apartment, buying online, and even getting a discount at some pharmacies. Foreigners who live or do business in Brazil usually need a CPF very early. Without it, daily life is difficult.

Cartório. A cartório is an official registry office, similar to a notary. Brazilians go to cartórios to register births, marriages, and property — and to make documents official. One famous procedure is "reconhecimento de firma" — "recognition of signature". The cartório confirms that a signature on a document really belongs to the person. Many contracts and official forms need this.

Despachante. A despachante is a professional who handles paperwork for you. Despachantes know which forms to fill in, which office to visit, and how to avoid common mistakes. They are often used for vehicle registration, licences, and company documents. Using a registered despachante is completely legal and very common.

Brazilians also talk about the "Custo Brasil" — the "Brazil cost". It describes the extra costs of doing business in Brazil because of complicated taxes, bureaucracy, and infrastructure problems. Brazil's tax system is famous for being one of the most complex in the world, and companies often employ large accounting teams just to stay compliant.

The good news: Brazil has made big progress with digital services, and many procedures can now be done online.`,
    vocab: [
      { word: 'Identification', definition: 'An official document or number that shows who you are.' },
      { word: 'Registry', definition: 'An official place where records are kept.' },
      { word: 'Infrastructure', definition: 'Basic systems like roads, ports, and power that a country needs.' },
      { word: 'Compliant', definition: 'Following official rules or laws correctly.' },
    ],
    phrases: [
      { en: 'What\'s your CPF?', local: 'Qual é o seu CPF?', phonetic: 'Kwahl eh oo SEH-oo seh-peh-EH-fee', note: 'You will hear this in shops, banks, and offices all over Brazil.' },
      { en: 'Signature recognition.', local: 'Reconhecimento de firma', phonetic: 'Heh-koh-nyeh-see-MEN-too jee FEER-mah', note: 'Done at a cartório to make a signature official.' },
      { en: 'Registry office / notary.', local: 'Cartório', phonetic: 'Kar-TOH-ryoo', note: 'Where documents become official in Brazil.' },
      { en: 'Paperwork helper.', local: 'Despachante', phonetic: 'Des-pah-SHAN-chee', note: 'A professional who handles official procedures for you.' },
    ],
    discussion: [
      'Is there a number like the CPF in your country? What do you need it for?',
      'Would you hire a despachante, or try to do the paperwork yourself? Why?',
      'How might the "Custo Brasil" affect foreign companies thinking about investing in Brazil?',
    ],
  },
  {
    title: 'Mexico — RFC, Factura and Notario',
    emoji: '🇲🇽',
    reading: `Mexico has its own paperwork vocabulary.

RFC and CURP. The RFC (Registro Federal de Contribuyentes) is the tax ID number for people and companies. The CURP is a personal identity code used for many government procedures. Foreign residents and companies working in Mexico need these numbers for banking, contracts, and taxes.

SAT and the factura. The SAT is Mexico's tax authority. Mexico uses an electronic invoice system, and every business invoice — called a "factura" — must be created and registered digitally. If you are buying something for your company, you must ask for a factura, or you may not be able to claim the expense. In restaurants, hotels, and shops, you will often hear customers ask, "¿Me da factura?" — "Can you give me an invoice?"

The notario público. In Mexico, a "notario público" is very different from a notary in the USA. A Mexican notario is a highly trained lawyer appointed by the government, with important powers. Notarios are needed to create companies, buy property, and make many legal documents official. Their fees can be high, but their work gives documents strong legal protection.

The gestor. Like the Brazilian despachante, a "gestor" — or a company called a "gestoría" — helps people and businesses handle procedures with government offices.

Proof of address. Many trámites require a "comprobante de domicilio" — proof of address — usually a recent electricity, water, or phone bill. Foreigners are often surprised how often they need it.`,
    vocab: [
      { word: 'Authority', definition: 'An official organisation with power to make decisions.' },
      { word: 'Invoice', definition: 'A document that lists goods or services and how much must be paid.' },
      { word: 'Claim', definition: 'Here: to officially ask for money back, for example for a work expense.' },
      { word: 'Appoint', definition: 'To officially choose someone for a job or position.' },
    ],
    phrases: [
      { en: 'Can I have an invoice, please?', local: '¿Me da factura, por favor?', phonetic: 'Meh dah fak-TOO-rah, por fah-VOR', note: 'Essential for business expenses in Mexico.' },
      { en: 'Proof of address.', local: 'Comprobante de domicilio', phonetic: 'Kom-proh-BAHN-teh deh doh-mee-SEE-lyoh', note: 'Usually a recent utility bill. Needed for many procedures.' },
      { en: 'What documents do I need?', local: '¿Qué documentos necesito?', phonetic: 'Keh doh-koo-MEN-tohs neh-seh-SEE-toh', note: 'Ask this before every trámite — and ask for a written list.' },
      { en: 'Notary public (lawyer).', local: 'Notario público', phonetic: 'Noh-TAH-ryoh POO-blee-koh', note: 'A powerful legal official in Mexico — not just someone who stamps documents.' },
    ],
    discussion: [
      'Do you need an official invoice for work expenses in your country?',
      'Why do you think Mexico gives notarios so much power?',
      'Do you think electronic invoices are a good idea? Why?',
    ],
  },
  {
    title: 'Chile, Colombia and Argentina',
    emoji: '🌎',
    reading: `Each country in Latin America has its own system, with its own strengths and challenges.

Chile. Chile is often seen as one of the most organised countries in the region for business procedures. The "RUT" (Rol Único Tributario) is the national ID and tax number, and Chileans use it everywhere — at banks, in hospitals, and even when shopping, where cashiers may ask, "¿RUT?" Chile has also developed digital government services. Many procedures can be done online with a single digital key called "ClaveÚnica".

Colombia. Colombians often talk about "papeleo" — paperwork — and the long queues ("filas") at some offices. Notarías are very important, and many documents must be signed there. In Colombia, notaries often take your fingerprint ("huella") as well as your signature to confirm your identity. Companies have a tax number called the "NIT". Colombia has also been working to reduce unnecessary procedures and move services online.

Argentina. In Argentina, people often need to book an appointment — a "turno" — for official procedures, sometimes weeks in advance. Argentina's economy has gone through many changes, and rules about taxes, imports, and foreign currency have changed often over the years. This means foreign businesses need good local advice and must check that their information is up to date.

Across the region, one profession is especially important: the accountant — "contador" in Spanish, "contador" or "contabilista" in Portuguese. A good local accountant is often the most valuable partner a foreign business can have.`,
    vocab: [
      { word: 'Organised', definition: 'Well planned and working in an efficient way.' },
      { word: 'Cashier', definition: 'A person who takes payment in a shop.' },
      { word: 'Fingerprint', definition: 'The mark made by the pattern of lines on the end of your finger.' },
      { word: 'Up to date', definition: 'Having the newest and most recent information.' },
    ],
    phrases: [
      { en: 'Your RUT, please? (Chile)', local: '¿RUT?', phonetic: 'ROOT', note: 'Chilean cashiers and offices ask for this often.' },
      { en: 'I\'d like to book an appointment.', local: 'Quisiera sacar un turno.', phonetic: 'Kee-SYEH-rah sah-KAR oon TOOR-noh', note: 'Argentina. Many procedures need a "turno".' },
      { en: 'Where is the queue for...?', local: '¿Dónde está la fila para...?', phonetic: 'DOHN-deh es-TAH lah FEE-lah PAH-rah', note: 'Spanish. Useful in any government office.' },
      { en: 'Accountant.', local: 'Contador / Contadora', phonetic: 'Kohn-tah-DOR / Kohn-tah-DOH-rah', note: 'Often the most important partner for a foreign business.' },
    ],
    discussion: [
      'Would you prefer to use one ID number for everything, like the RUT in Chile? Why?',
      'What do you think about giving your fingerprint at a notary?',
      'Why is a good local accountant so important for a foreign business?',
    ],
  },
  {
    title: 'Going Digital',
    emoji: '💻',
    reading: `The image of long queues and paper stamps is still real in many places — but Latin America is also changing quickly. Several countries have become leaders in digital government.

Brazil has developed a national digital platform called "gov.br", which allows citizens to access many public services online with one account. Brazil also created Pix, an instant payment system run by the Central Bank, which has transformed how people pay each other and pay bills. (You will learn more about Pix in Lesson 8.)

Mexico was one of the first countries in the world to make electronic invoicing mandatory for businesses. Every factura is checked digitally by the tax authority, which helps reduce fraud and makes tax collection more efficient.

Chile's ClaveÚnica lets citizens log in to many government services with one secure password, and many procedures that once required a visit can now be completed online.

Colombia and other countries have launched programmes to cut unnecessary procedures and allow more documents to be signed and sent electronically.

Digital government has big benefits: less time in queues, fewer chances for small bribes, and more transparency. But there are challenges too. Not everyone has good internet access or digital skills, especially in rural areas and among older people. And sometimes the new digital system and the old paper system exist at the same time — meaning you need to do both!`,
    vocab: [
      { word: 'Citizen', definition: 'A person who legally belongs to a country.' },
      { word: 'Transform', definition: 'To change something completely.' },
      { word: 'Mandatory', definition: 'Required by law or rules.' },
      { word: 'Rural', definition: 'Connected with the countryside, not towns or cities.' },
    ],
    phrases: [
      { en: 'Can I do this online?', local: '¿Se puede hacer en línea? / Dá para fazer online?', phonetic: 'Seh PWEH-deh ah-SEHR en LEE-neh-ah / Dah PAH-rah fah-ZEHR on-LINE', note: 'Spanish / Portuguese. Always ask — it may save you a trip.' },
      { en: 'Do I need to come in person?', local: '¿Tengo que venir en persona?', phonetic: 'TEN-goh keh veh-NEER en pehr-SOH-nah', note: 'Spanish. Check before you travel to an office.' },
      { en: 'Could you send it to me by email?', local: '¿Me lo puede enviar por correo?', phonetic: 'Meh loh PWEH-deh en-vee-AR por koh-REH-oh', note: 'Spanish. Many documents can now be sent digitally.' },
    ],
    discussion: [
      'Are government services in your country mostly online or in person?',
      'What are the advantages and disadvantages of digital government?',
      'How could governments help older people and rural communities use digital services?',
    ],
  },
  {
    title: 'How to Survive a Trámite',
    emoji: '🧭',
    reading: `Whatever country you are in, these practical tips will make paperwork much easier.

Get the full list. Before you start, ask for a complete written list of the documents you need. Ask if there are any special requirements, such as how recent a bill must be or whether copies must be certified.

Bring originals and copies. Always bring original documents and several photocopies. Many offices do not have photocopiers — or the queue for the photocopier is as long as the queue for the office!

Check the details. Make sure your name is spelled exactly the same on every document — including middle names and accents. Small differences can cause big problems.

Apostille and translation. Documents from your home country, such as degrees or birth certificates, may need an "apostille" — an international certificate that confirms a document is genuine. They may also need an official translation by an approved translator, called a "tradução juramentada" in Brazil or a "perito traductor" in Mexico.

Arrive early. Many offices give out a limited number of tickets each day.

Be patient and polite. The person behind the desk can make your day much easier — or much harder. A smile, a "buenos días", and patience help a lot.

Use professionals. A good accountant, lawyer, despachante, or gestor is worth the cost.

Expect the unexpected. Build extra time into your plans. Trámites almost always take longer than promised.`,
    vocab: [
      { word: 'Requirement', definition: 'Something that is needed or that you must have.' },
      { word: 'Photocopy', definition: 'A paper copy of a document made by a machine.' },
      { word: 'Genuine', definition: 'Real and true, not fake.' },
      { word: 'Expect the unexpected', definition: 'Be ready for surprises or problems.' },
    ],
    phrases: [
      { en: 'Could you give me a written list of the requirements?', local: '¿Me podría dar una lista de los requisitos por escrito?', phonetic: 'Meh poh-DREE-ah dar OO-nah LEES-tah deh lohs reh-kee-SEE-tohs por es-KREE-toh', note: 'Spanish. The most useful question before any trámite.' },
      { en: 'Do I need the original or a copy?', local: '¿Necesito el original o una copia?', phonetic: 'Neh-seh-SEE-toh el oh-ree-hee-NAHL oh OO-nah KOH-pyah', note: 'Spanish. Bring both, just in case.' },
      { en: 'Sworn translation. (Brazil)', local: 'Tradução juramentada', phonetic: 'Trah-doo-SOWNG zhoo-rah-men-TAH-dah', note: 'An official translation required for many foreign documents in Brazil.' },
      { en: 'Thank you for your patience and help.', local: 'Gracias por su paciencia y su ayuda.', phonetic: 'GRAH-syahs por soo pah-SYEN-syah ee soo ah-YOO-dah', note: 'Spanish. Kind words go a long way at an official desk.' },
    ],
    discussion: [
      'Which tip on this page do you think is the most important? Why?',
      'Have you ever had a problem because of a small mistake on a document?',
      'Would you rather pay a professional or spend your own time on paperwork? Why?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. What went wrong, and what should the person do?

Situation 1: The Missing CPF
Ryo, from Japan, has just arrived in São Paulo to work for six months. He tries to open a bank account, sign a phone contract, and buy a train ticket online. Each time, he is asked for his CPF, which he does not have. He is becoming very frustrated. What should he do first?

Situation 2: The Spelling Problem
Al-Qahtani, a Saudi businessman, is registering a company in Mexico. His passport spells his name "Mohammed", but his university degree spells it "Muhammad". The notario says the documents do not match. What can he do?

Situation 3: The Invoice
Zhou Min, from China, takes three clients to dinner in Monterrey. She pays and keeps the normal receipt. Back at the office, the Mexican accountant tells her she cannot claim the expense. Why? What should she have done?

Situation 4: The Third Visit
Kim Sung-ho, from Korea, has visited the same government office in Bogotá three times. Each time, he is told he is missing a different document. He is angry and starts raising his voice at the clerk. What should he do instead?

Situation 5: The Fixer
A man outside a government office in Buenos Aires offers to "skip the queue" and get Ana's document today for a cash payment. A registered gestor in the city offers to handle the same document legally, but it will take two weeks. Ana needs it in ten days. What should she do?`,
    vocab: [
      { word: 'Frustrated', definition: 'Annoyed because you cannot do what you want.' },
      { word: 'Match', definition: 'To be the same as something else.' },
      { word: 'Raise your voice', definition: 'To speak loudly, often because you are angry.' },
      { word: 'Skip', definition: 'To avoid or not do something, such as waiting in a queue.' },
    ],
    phrases: [],
    discussion: [
      'Which situation would be the most stressful for you? Why?',
      'In Situation 4, what exactly could Kim say to the clerk? Practise it with the AI.',
      'In Situation 5, what are Ana\'s options? Which one would you choose?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

The trámite: An official procedure with forms, stamps, signatures, and visits. Bureaucracy can be heavy in Latin America because of formal legal systems, strong central government, and the need to prove identity.

Brazil: The CPF tax number is needed for almost everything. Cartórios make documents official, including "reconhecimento de firma". Despachantes handle paperwork legally. The "Custo Brasil" describes the extra cost of doing business.

Mexico: The RFC and CURP are key ID numbers. Every business expense needs an electronic "factura" — ask "¿Me da factura?" A notario público is a powerful legal official. Gestores help with procedures. You often need a "comprobante de domicilio".

Chile, Colombia, and Argentina: Chile's RUT is used everywhere, and ClaveÚnica makes many services digital. Colombian notaries may take fingerprints. In Argentina, you often need a "turno", and rules change often. A good local accountant is essential.

Going digital: Brazil's gov.br and Pix, Mexico's electronic invoices, and Chile's ClaveÚnica show a fast move to digital government.

Surviving a trámite: Get a written list, bring originals and copies, check spelling, get apostilles and official translations, arrive early, be patient and polite, use professionals, and expect the unexpected.`,
    vocab: [
      { word: 'Essential', definition: 'Extremely important and necessary.' },
      { word: 'Formal', definition: 'Following official rules.' },
      { word: 'Handle', definition: 'To deal with something.' },
      { word: 'Patient', definition: 'Able to wait calmly without getting angry.' },
    ],
    phrases: [],
    discussion: [
      'Compare bureaucracy in Latin America with bureaucracy in your country.',
      'Which country in this lesson seems easiest for a foreign business? Why?',
      'If a friend was moving to Brazil or Mexico for work, what three paperwork tips would you give them?',
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

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "Paperwork Heroes — bureaucracy and official procedures (trámites) in Brazil, Mexico, Chile, Colombia and Argentina: CPF, cartório, despachante, factura, notario, digital government and tips for surviving paperwork". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

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

export default function PaperworkHeroesPage() {
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
            <div style={{ fontSize: '64px', flexShrink: 0 }}>📑</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 6 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>Paperwork Heroes</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Bureaucracy, trámites, despachantes and gestores</p>
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
