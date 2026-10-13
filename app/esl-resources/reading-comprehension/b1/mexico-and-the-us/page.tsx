'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

const COLOR = '#c2410c'
const COLOR_DARK = '#7c2d12'
const COLOR_LIGHT = '#fff7ed'
const GRADIENT = 'linear-gradient(135deg, #7c2d12 0%, #c2410c 60%, #ea580c 100%)'

const LANGUAGES = [
  { code: 'en', label: 'English only', flag: '🌐' },
  { code: 'th', label: 'Thai', flag: '🇹🇭' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
  { code: 'id', label: 'Indonesian', flag: '🇮🇩' },
  { code: 'my', label: 'Burmese', flag: '🇲🇲' },
  { code: 'km', label: 'Khmer', flag: '🇰🇭' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
]

const SPEEDS = [
  { label: 'Very Slow', rate: 0.6, icon: '🐌' },
  { label: 'Slow', rate: 0.8, icon: '🚶' },
  { label: 'Normal', rate: 1.0, icon: '🚴' },
  { label: 'Fast', rate: 1.2, icon: '🚀' },
]

const VOCAB = [
  { word: 'Migration', def: 'The movement of people from one place to another to live or work' },
  { word: 'Border', def: 'The official line that separates two countries' },
  { word: 'Remittances', def: 'Money that workers send back to their family in another country' },
  { word: 'Wages', def: 'The money someone earns for their work, usually paid weekly or monthly' },
  { word: 'Proximity', def: 'Being near or close to something' },
  { word: 'Undocumented', def: 'A person living in a country without official legal permission' },
  { word: 'Generation', def: 'All the people born around the same time — first generation moved, second generation was born there' },
  { word: 'Assimilate', def: 'To become part of a new culture and adopt its customs and language' },
  { word: 'Heritage', def: 'The traditions, culture, and history passed down from your family' },
  { word: 'Bilingual', def: 'Able to speak two languages fluently' },
  { word: 'Identity', def: 'Who you are — your sense of self, culture, and belonging' },
  { word: 'Discrimination', def: 'Treating someone unfairly because of their race, nationality, or background' },
]

const PAGES = [
  { id: 1, title: 'Two Countries, One Family', emoji: '🇲🇽' },
  { id: 2, title: 'Why Do Mexicans Move to the US?', emoji: '💼' },
  { id: 3, title: 'What Do Real Mexicans Think?', emoji: '💬' },
  { id: 4, title: 'Mexican-Americans — A Different World', emoji: '🌉' },
  { id: 5, title: 'Vocabulary & Key Phrases', emoji: '📖' },
  { id: 6, title: 'Discussion & Debate', emoji: '🗣️' },
]

export default function MexicoUSLesson() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLang, setSelectedLang] = useState('en')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(2)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({})
  const [loadingTranslations, setLoadingTranslations] = useState<Record<string, boolean>>({})
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null)
  const [popupResult, setPopupResult] = useState<{ word: string; meaning: string; translation?: string } | null>(null)
  const [popupLoading, setPopupLoading] = useState(false)
  const [playingVocab, setPlayingVocab] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-stop audio on page change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlayingAudio(null)
  }, [currentPage])

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatLoading])

  // Close popup on click outside
  useEffect(() => {
    const handler = () => { setPopupPos(null); setPopupResult(null) }
    if (popupPos) {
      setTimeout(() => document.addEventListener('click', handler), 100)
      return () => document.removeEventListener('click', handler)
    }
  }, [popupPos])

  // Text selection handler
  const handleTextSelect = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return
    const text = sel.toString().trim()
    if (text.length > 100) return
    setSelectedText(text)
    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    setPopupPos({ x: rect.left + rect.width / 2, y: rect.top - 10 })
    setPopupResult(null)
    setPopupLoading(true)
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: `The student highlighted: "${text}". Give a short, simple English definition (1 sentence, B1 level).${selectedLang !== 'en' ? ` Also translate it to ${lang?.label}.` : ''} Reply in JSON: {"meaning":"...","translation":"..."}` }]
      })
    })
      .then(r => r.json())
      .then(data => {
        try {
          const parsed = JSON.parse(data.reply || data.content || '{}')
          setPopupResult({ word: text, meaning: parsed.meaning || 'No definition found', translation: parsed.translation })
        } catch {
          setPopupResult({ word: text, meaning: data.reply || data.content || 'No definition found' })
        }
        setPopupLoading(false)
      })
      .catch(() => { setPopupResult({ word: text, meaning: 'Could not look up this word.' }); setPopupLoading(false) })
  }, [selectedLang])

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelect)
    return () => document.removeEventListener('mouseup', handleTextSelect)
  }, [handleTextSelect])

  // TTS
  const playAudio = (text: string, id: string) => {
    if (audioRef.current) {
      if (playingAudio === id) {
        if (audioRef.current.paused) { audioRef.current.play(); return }
        else { audioRef.current.pause(); return }
      }
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlayingAudio(id)
    const cleaned = text.replace(/[\u{1F600}-\u{1F9FF}\u{2600}-\u{2B55}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]/gu, '').replace(/[#*_~`>|]/g, '')
    fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: cleaned, speed: SPEEDS[speedIdx].rate }) })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.playbackRate = SPEEDS[speedIdx].rate
        audioRef.current = audio
        audio.onended = () => { setPlayingAudio(null); audioRef.current = null }
        audio.play()
      })
      .catch(() => setPlayingAudio(null))
  }

  const playVocabWord = (word: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setPlayingVocab(word)
    fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: word, speed: 0.85 }) })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onended = () => { setPlayingVocab(null); audioRef.current = null }
        audio.play()
      })
      .catch(() => setPlayingVocab(null))
  }

  // Translation
  const translate = (text: string, id: string) => {
    if (selectedLang === 'en' || translatedTexts[id]) return
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    setLoadingTranslations(p => ({ ...p, [id]: true }))
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: `Translate to ${lang?.label}. Return ONLY the translation, nothing else:\n\n${text}` }] })
    })
      .then(r => r.json())
      .then(data => {
        setTranslatedTexts(p => ({ ...p, [id]: data.reply || data.content }))
        setLoadingTranslations(p => ({ ...p, [id]: false }))
      })
      .catch(() => setLoadingTranslations(p => ({ ...p, [id]: false })))
  }

  // Chat
  const sendChat = () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(p => [...p, { role: 'user', content: userMsg }])
    setChatLoading(true)
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    const systemMsg = `You are a friendly English conversation partner helping a B1 student discuss Mexico and the US — migration, culture, identity. Keep answers short (2-3 sentences). Ask a follow-up question. Use simple B1 English.${selectedLang !== 'en' ? ` If the student writes in ${lang?.label}, reply in English but add a ${lang?.label} translation in brackets.` : ''}`
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'system', content: systemMsg }, ...chatMessages.slice(-8), { role: 'user', content: userMsg }] })
    })
      .then(r => r.json())
      .then(data => { setChatMessages(p => [...p, { role: 'assistant', content: data.reply || data.content }]); setChatLoading(false) })
      .catch(() => { setChatMessages(p => [...p, { role: 'assistant', content: 'Sorry, I had a connection problem. Try again!' }]); setChatLoading(false) })
  }

  // Paragraph component
  const P = ({ children, id }: { children: string; id: string }) => (
    <div style={{ marginBottom: '20px' }}>
      <p style={{ fontSize: '16px', lineHeight: '1.9', color: '#1a1a2e', margin: '0 0 8px' }}>{children}</p>
      {selectedLang !== 'en' && (
        <button
          onClick={() => translate(children, id)}
          style={{ background: 'none', border: 'none', color: COLOR, fontSize: '13px', cursor: 'pointer', padding: '2px 0', fontWeight: '600' }}
        >
          {loadingTranslations[id] ? 'Translating...' : translatedTexts[id] ? '✓ Translated' : `Translate to ${LANGUAGES.find(l => l.code === selectedLang)?.label}`}
        </button>
      )}
      {translatedTexts[id] && (
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#6b7280', margin: '6px 0 0', fontStyle: 'italic', background: COLOR_LIGHT, padding: '10px 14px', borderRadius: '8px', borderLeft: `3px solid ${COLOR}` }}>{translatedTexts[id]}</p>
      )}
    </div>
  )

  const SubHead = ({ children }: { children: string }) => (
    <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLOR_DARK, margin: '28px 0 12px', borderBottom: `2px solid ${COLOR_LIGHT}`, paddingBottom: '8px' }}>{children}</h3>
  )

  const SpanishPhrase = ({ phrase, meaning }: { phrase: string; meaning: string }) => (
    <div style={{ background: COLOR_LIGHT, border: `1px solid #fed7aa`, borderRadius: '10px', padding: '12px 16px', margin: '12px 0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: COLOR_DARK, fontStyle: 'italic' }}>"{phrase}"</span>
      <span style={{ fontSize: '14px', color: '#6b7280' }}>— {meaning}</span>
    </div>
  )

  const getPageContent = () => {
    switch (currentPage) {
      case 1: return (
        <>
          <P id="1-1">Mexico and the United States share more than a 3,000-kilometre border. They share history, food, music, language, and — most importantly — people.</P>
          <P id="1-2">Today, about 37 million people of Mexican origin live in the United States. That is more than the entire population of many countries. Some moved there recently. Some were born there. Some families have been in the US for generations — since before the border even existed.</P>
          <P id="1-3">This is one of the biggest migration stories in the modern world. But numbers do not tell you everything. Behind the statistics are real people with real reasons, real feelings, and real lives.</P>
          <P id="1-4">In this lesson, we will look at three big questions: Why do so many Mexicans move to the US? What do Mexicans who stay in Mexico really think about it? And why do Mexican-Americans — people born in the US with Mexican roots — sometimes feel like they do not fully belong in either country?</P>
          <P id="1-5">Whether you are from Thailand, Japan, the Philippines, or anywhere else, this story will feel familiar. Migration changes everything — not just for the people who leave, but for the families who stay behind, and the children who grow up between two worlds.</P>
        </>
      )
      case 2: return (
        <>
          <SubHead>Money — The Biggest Reason</SubHead>
          <P id="2-1">The short answer is money. A factory worker in Mexico might earn $400 a month. The same worker doing the same job across the border in the US might earn $2,000 or more. That difference is life-changing — especially when you have children to feed and parents to support back home.</P>
          <P id="2-2">For many Mexicans, moving north is not about wanting a better lifestyle. It is about survival. It is about making sure your children can go to school, your mother can see a doctor, and your family does not go hungry.</P>

          <SubHead>Proximity — It Is Right There</SubHead>
          <P id="2-3">Unlike migrants from Asia or Africa who must fly across oceans, Mexico is right next to the US. Some border towns are so close that people can walk across. Tijuana and San Diego, Juarez and El Paso, Reynosa and McAllen — these twin cities sit on either side of a line, but in many ways they are one place.</P>
          <P id="2-4">This closeness makes everything easier: travelling, sending money home, staying connected with family. A Mexican worker in Los Angeles can sometimes drive home for Christmas. A Filipino worker in Saudi Arabia cannot.</P>

          <SubHead>Networks — Your People Are Already There</SubHead>
          <P id="2-5">Migration creates more migration. If your uncle, your cousin, and three people from your village are already working in Chicago, you know where to go. They can help you find a room, a job, and a community. Whole towns in rural Mexico have connections to specific US cities. Everyone from one village might end up in the same neighbourhood in New York.</P>

          <SubHead>Remittances — The Money That Flows Home</SubHead>
          <P id="2-6">Mexican workers in the US send billions of dollars home every year. In 2023, Mexico received over $60 billion in remittances — more money than it earns from selling oil. This money builds houses, pays school fees, opens small businesses, and supports entire towns.</P>
          <P id="2-7">For many small communities in Mexico, remittances are the economy. Without them, the town would die. One worker in Texas can support ten family members in Oaxaca.</P>

          <SubHead>History — It Has Always Been This Way</SubHead>
          <P id="2-8">Mexican migration to the US is not new. During World War II, the US government created the Bracero Program, which officially brought millions of Mexican workers to American farms because there were not enough American workers. When the programme ended, many stayed — or kept coming back.</P>
          <P id="2-9">Large parts of the American southwest — California, Texas, Arizona, New Mexico — were actually part of Mexico until 1848. Many Mexican families did not cross the border. The border crossed them.</P>
        </>
      )
      case 3: return (
        <>
          <P id="3-1">Ask Mexicans in Mexico what they think about migration to the US, and you will get very different answers depending on who you talk to. The feelings are complicated — and often contradictory.</P>

          <SubHead>Pride and Respect</SubHead>
          <P id="3-2">Many families see their relatives in the US as heroes. They left home, worked incredibly hard in difficult conditions, and now send money that keeps the whole family going. There is deep respect for the sacrifice.</P>
          <SpanishPhrase phrase="Mi hermano se fue para que nosotros pudiéramos comer" meaning="My brother left so we could eat" />
          <P id="3-3">In many Mexican towns, the nicest house on the street belongs to someone who works in the US. Their family is respected. Their sacrifice is honoured.</P>

          <SubHead>Sadness and Loss</SubHead>
          <P id="3-4">But migration breaks families apart. Children grow up without fathers. Grandparents never meet their grandchildren. Couples separate. Birthdays, weddings, and funerals happen with empty chairs.</P>
          <P id="3-5">Many Mexicans say the hardest part is not the distance — it is the time. Years pass. People change. When your brother finally comes home after ten or fifteen years, he is not the same person. And neither are you.</P>

          <SubHead>Frustration with Mexico</SubHead>
          <P id="3-6">Some Mexicans feel angry — not at the people who leave, but at their own country. "Why can't Mexico provide what we need?" is a question you hear often. The fact that millions of people must leave their homeland to survive is seen by many as a national failure — a sign that the government and economy have let people down.</P>

          <SubHead>Suspicion and Jealousy</SubHead>
          <P id="3-7">When migrants come back with money, new clothes, and an American accent, not everyone is happy. Some locals feel jealous or suspicious. "They think they are better than us now."</P>
          <SpanishPhrase phrase="Agringado" meaning="A Mexican who has become like a gringo (an American) — used negatively" />
          <P id="3-8">There is tension between those who stayed and those who left. Those who stayed sometimes feel that they did the harder thing — keeping the family together, working the land, staying loyal to Mexico. Those who left sometimes feel that nobody understands how hard their life really is.</P>
        </>
      )
      case 4: return (
        <>
          <P id="4-1">Now here is where it gets really interesting. If you meet a Mexican-American — someone born and raised in the US with Mexican parents or grandparents — they might surprise you. They look Mexican. They might have a Mexican name. But something is different.</P>

          <SubHead>Language — Lost in Translation</SubHead>
          <P id="4-2">Many second and third-generation Mexican-Americans speak English as their first language. Their Spanish might be limited — enough to talk to grandma, but not enough to read a newspaper. Some speak "Spanglish," a creative mix of both languages that drives language teachers crazy but works perfectly well on the street.</P>
          <P id="4-3">When they visit Mexico, relatives sometimes laugh at their accent or grammar. "You sound like a tourist!" This can be painful for someone who considers themselves Mexican.</P>

          <SubHead>Culture Gap — Between Two Worlds</SubHead>
          <P id="4-4">Mexican-Americans grow up with American schools, American TV, and American social rules. They might eat their grandmother's tamales at home but pizza at school. They celebrate Dia de los Muertos in November but also Thanksgiving the same week. They live in two cultures — but sometimes feel they do not fully belong in either one.</P>
          <SpanishPhrase phrase="Ni de aqui, ni de alla" meaning="Not from here, not from there — the feeling of not belonging fully in either country" />

          <SubHead>The Chicano Identity</SubHead>
          <P id="4-5">Over time, many US-born Mexicans created their own identity: Chicano. This is not Mexican. This is not American. It is something new — a culture born from the border experience, with its own art, music, food, and language. For many people, being Chicano is a source of deep pride.</P>
          <P id="4-6">Chicano culture gave the world muralism, lowrider cars, and some of the most powerful protest art in American history. It is a reminder that people who feel caught between two places sometimes build something entirely new.</P>

          <SubHead>Generational Differences</SubHead>
          <P id="4-7">The first generation sacrificed everything. They worked long hours in farms, factories, kitchens, and construction sites so their children could go to school and have a better life.</P>
          <P id="4-8">The second generation often feels guilty. They have it easier, but they know the cost. They watched their parents struggle and sometimes feel they can never repay that debt.</P>
          <P id="4-9">The third generation sometimes feels disconnected from Mexico entirely. They might not speak Spanish at all. They might never have visited Mexico. But society still sees them as Mexican.</P>
          <P id="4-10">"My grandmother crossed the desert so I could go to university. And I don't even speak her language." This kind of statement — full of pride, guilt, and loss — is something you hear from many young Mexican-Americans today.</P>
        </>
      )
      case 5: return (
        <div>
          <P id="5-intro">Key vocabulary from this lesson. Click any word to hear the pronunciation.</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {VOCAB.map(v => (
              <div
                key={v.word}
                onClick={() => playVocabWord(v.word)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '14px 18px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = COLOR_LIGHT; (e.currentTarget as HTMLDivElement).style.borderColor = '#fed7aa' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'white'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: playingVocab === v.word ? COLOR : '#f3f4f6', color: playingVocab === v.word ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, transition: 'all 0.2s' }}>🔊</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>{v.word}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px', lineHeight: '1.5' }}>{v.def}</div>
                </div>
              </div>
            ))}
          </div>

          <SubHead>Spanish Phrases from the Lesson</SubHead>
          <SpanishPhrase phrase="Mi hermano se fue para que nosotros pudiéramos comer" meaning="My brother left so we could eat" />
          <SpanishPhrase phrase="Ni de aqui, ni de alla" meaning="Not from here, not from there" />
          <SpanishPhrase phrase="Agringado" meaning="Someone who has become like a gringo — used negatively" />
          <SpanishPhrase phrase="Chicano / Chicana" meaning="A US-born person of Mexican heritage who embraces a distinct border identity" />
          <SpanishPhrase phrase="Remesas" meaning="Remittances — money sent home by workers abroad" />
        </div>
      )
      case 6: return (
        <div>
          <P id="6-intro">Use these questions to practise speaking. Try the AI conversation partner to discuss your ideas!</P>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {[
              { q: 'In your country, do people move abroad for work? Where do they go, and why?', icon: '🌏' },
              { q: 'Do you think it is fair that the same job pays ten times more in one country than another?', icon: '💰' },
              { q: 'What do you think it feels like to grow up between two cultures and not fully belong in either one?', icon: '🪞' },
              { q: 'In Thailand, many people from Myanmar, Cambodia, and Laos come to work. How is this similar to the Mexico-US story?', icon: '🇹🇭' },
              { q: '"My grandmother crossed the desert so I could go to university, and I don\'t even speak her language." What does this quote make you feel?', icon: '💬' },
              { q: 'Should children of immigrants learn their parents\' language? Why or why not?', icon: '🗣️' },
              { q: 'Do you think migration is good or bad for the country people leave? Give reasons for both sides.', icon: '⚖️' },
              { q: 'If you had to move to another country to support your family, would you do it? What would be the hardest part?', icon: '✈️' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '18px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: COLOR, marginBottom: '4px' }}>Question {i + 1}</div>
                  <div style={{ fontSize: '15px', color: '#1a1a2e', lineHeight: '1.6' }}>{item.q}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: COLOR_LIGHT, border: `1px solid #fed7aa`, borderRadius: '14px', padding: '20px', marginTop: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🤖</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: COLOR_DARK, marginBottom: '4px' }}>Want to practise your answers?</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Click the chat button below to discuss these questions with the AI conversation partner.</div>
            <button onClick={() => setShowChat(true)} style={{ background: COLOR, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>Start a Conversation</button>
          </div>
        </div>
      )
      default: return null
    }
  }

  const pageText: Record<number, string> = {
    1: `Mexico and the United States share more than a 3,000-kilometre border. They share history, food, music, language, and most importantly, people. Today, about 37 million people of Mexican origin live in the United States. That is more than the entire population of many countries. Some moved there recently. Some were born there. Some families have been in the US for generations, since before the border even existed. This is one of the biggest migration stories in the modern world. But numbers do not tell you everything. Behind the statistics are real people with real reasons, real feelings, and real lives. In this lesson, we will look at three big questions: Why do so many Mexicans move to the US? What do Mexicans who stay in Mexico really think about it? And why do Mexican-Americans, people born in the US with Mexican roots, sometimes feel like they do not fully belong in either country? Whether you are from Thailand, Japan, the Philippines, or anywhere else, this story will feel familiar. Migration changes everything, not just for the people who leave, but for the families who stay behind, and the children who grow up between two worlds.`,
    2: `Money, the biggest reason. The short answer is money. A factory worker in Mexico might earn 400 dollars a month. The same worker doing the same job across the border in the US might earn 2,000 dollars or more. That difference is life-changing, especially when you have children to feed and parents to support back home. For many Mexicans, moving north is not about wanting a better lifestyle. It is about survival. It is about making sure your children can go to school, your mother can see a doctor, and your family does not go hungry. Proximity. Unlike migrants from Asia or Africa who must fly across oceans, Mexico is right next to the US. Some border towns are so close that people can walk across. This closeness makes everything easier. Networks. Migration creates more migration. If your uncle, your cousin, and three people from your village are already working in Chicago, you know where to go. Remittances. Mexican workers in the US send billions of dollars home every year. In 2023, Mexico received over 60 billion dollars in remittances, more money than it earns from selling oil. History. During World War Two, the US government created the Bracero Program, which officially brought millions of Mexican workers to American farms.`,
    3: `Ask Mexicans in Mexico what they think about migration to the US, and you will get very different answers. The feelings are complicated. Pride and respect: Many families see their relatives in the US as heroes. They left home, worked incredibly hard, and now send money that keeps the whole family going. Sadness and loss: Migration breaks families apart. Children grow up without fathers. Grandparents never meet their grandchildren. Many Mexicans say the hardest part is not the distance, it is the time. Years pass. People change. Frustration: Some Mexicans feel angry, not at the people who leave, but at their own country. Why can't Mexico provide what we need? Suspicion: When migrants come back with money and an American accent, not everyone is happy. There is a word for this: agringado, a Mexican who has become like a gringo.`,
    4: `If you meet a Mexican-American, someone born and raised in the US with Mexican parents or grandparents, they might surprise you. They look Mexican. They might have a Mexican name. But something is different. Language: Many second and third generation Mexican-Americans speak English as their first language. Their Spanish might be limited. Some speak Spanglish, a creative mix of both languages. Culture gap: Mexican-Americans grow up with American schools, American TV, and American social rules. They live in two cultures but sometimes feel they do not fully belong in either one. Ni de aqui, ni de alla. Not from here, not from there. The Chicano identity: Over time, many US-born Mexicans created their own identity: Chicano. This is not Mexican. This is not American. It is something new. Generational differences: The first generation sacrificed everything. The second generation often feels guilty. The third generation sometimes feels disconnected from Mexico entirely. My grandmother crossed the desert so I could go to university. And I don't even speak her language.`,
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ background: GRADIENT, padding: '48px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <a href="/esl-resources/reading-comprehension/b1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>← B1 Reading</a>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Reading Comprehension</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>15–25 minutes</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' }}>Two Countries, One Family</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 16px', lineHeight: '1.6', maxWidth: '600px' }}>Mexico and the US — why so many Mexicans live in America, what real Mexicans think, and why Mexican-Americans feel caught between two worlds.</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['👆 Highlight any text', '🌍 13-language translation', '🤖 AI conversation partner', '🔊 4-speed audio', '🔊 Pause & resume'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280' }}>🔊 SPEED:</span>
            {SPEEDS.map((s, i) => (
              <button key={s.label} onClick={() => setSpeedIdx(i)} style={{ background: i === speedIdx ? COLOR : '#f3f4f6', color: i === speedIdx ? 'white' : '#6b7280', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>{s.icon} {s.label}</button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
              {LANGUAGES.find(l => l.code === selectedLang)?.flag} {LANGUAGES.find(l => l.code === selectedLang)?.label} ▾
            </button>
            {showLangMenu && (
              <div style={{ position: 'absolute', top: '40px', right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 50, minWidth: '180px', maxHeight: '320px', overflowY: 'auto' }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setSelectedLang(l.code); setShowLangMenu(false); setTranslatedTexts({}) }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', border: 'none', background: l.code === selectedLang ? COLOR_LIGHT : 'transparent', cursor: 'pointer', fontSize: '14px', color: '#374151', textAlign: 'left' }}>{l.flag} {l.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 8px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {PAGES.map(p => (
            <div key={p.id} onClick={() => setCurrentPage(p.id)} style={{ flex: 1, height: '6px', borderRadius: '3px', background: p.id <= currentPage ? COLOR : '#e5e7eb', cursor: 'pointer', transition: 'background 0.2s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>Page {currentPage} of {PAGES.length}</span>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>{PAGES[currentPage - 1].emoji} {PAGES[currentPage - 1].title}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8px 24px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {/* Page Header */}
          <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: COLOR, letterSpacing: '0.05em', marginBottom: '6px' }}>PAGE {currentPage}</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{PAGES[currentPage - 1].emoji}</span> {PAGES[currentPage - 1].title}
              </h2>
            </div>
            {currentPage <= 4 && (
              <button
                onClick={() => playAudio(pageText[currentPage] || '', `page-${currentPage}`)}
                style={{ background: playingAudio === `page-${currentPage}` ? COLOR : '#f3f4f6', color: playingAudio === `page-${currentPage}` ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
              >
                {playingAudio === `page-${currentPage}` ? '⏸ Pause' : '▶ Listen'}
              </button>
            )}
          </div>

          {currentPage === 1 && (
            <div style={{ padding: '8px 28px 0' }}>
              <div style={{ background: COLOR_LIGHT, borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px' }}>👆</span>
                <span style={{ fontSize: '13px', color: '#92400e', fontWeight: '600' }}>Highlight any word or phrase to hear it and see its meaning</span>
              </div>
            </div>
          )}

          <div style={{ padding: '20px 28px 28px' }}>
            {getPageContent()}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          style={{ background: currentPage > 1 ? 'white' : '#f3f4f6', color: currentPage > 1 ? '#374151' : '#d1d5db', border: '1px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: currentPage > 1 ? 'pointer' : 'default' }}
        >← Previous</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>Page {currentPage} of {PAGES.length}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{PAGES[currentPage - 1].title}</div>
        </div>
        <button
          onClick={() => currentPage < PAGES.length && setCurrentPage(currentPage + 1)}
          style={{ background: currentPage < PAGES.length ? COLOR : '#d1d5db', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: currentPage < PAGES.length ? 'pointer' : 'default' }}
        >Next →</button>
      </div>

      {/* Text Selection Popup */}
      {popupPos && (
        <div style={{ position: 'fixed', left: Math.min(popupPos.x, window.innerWidth - 200), top: Math.max(popupPos.y - 120, 10), background: 'white', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '16px 20px', zIndex: 100, maxWidth: '300px', minWidth: '200px', border: '1px solid #e5e7eb' }} onClick={e => e.stopPropagation()}>
          {popupLoading ? (
            <div style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>Looking up "{selectedText}"...</div>
          ) : popupResult ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <button onClick={() => playVocabWord(popupResult.word)} style={{ background: COLOR_LIGHT, border: 'none', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '16px' }}>🔊</button>
                <span style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a2e' }}>{popupResult.word}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', marginBottom: popupResult.translation ? '8px' : '0' }}>{popupResult.meaning}</div>
              {popupResult.translation && (
                <div style={{ fontSize: '13px', color: COLOR, fontWeight: '600', borderTop: '1px solid #f3f4f6', paddingTop: '8px', marginTop: '4px' }}>{popupResult.translation}</div>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Chat FAB */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          style={{ position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px', borderRadius: '50%', background: COLOR, color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(194,65,12,0.4)', cursor: 'pointer', fontSize: '28px', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >💬</button>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', width: '380px', maxWidth: 'calc(100vw - 48px)', height: '500px', maxHeight: 'calc(100vh - 48px)', background: 'white', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: GRADIENT, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>🤖 Conversation Partner</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Discuss the lesson topics</div>
            </div>
            <button onClick={() => setShowChat(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🇲🇽 🇺🇸</div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>Ask me anything about Mexico and the US! Try:<br />"Why do Mexicans move to the US?"<br />"What does Chicano mean?"</div>
              </div>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} style={{ marginBottom: '12px', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: m.role === 'user' ? COLOR : '#f3f4f6', color: m.role === 'user' ? 'white' : '#1a1a2e', padding: '10px 16px', borderRadius: '14px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.5' }}>{m.content}</div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                <div style={{ background: '#f3f4f6', padding: '10px 16px', borderRadius: '14px', fontSize: '14px', color: '#9ca3af' }}>Thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Type your message..."
              style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
            />
            <button onClick={sendChat} disabled={chatLoading} style={{ background: COLOR, color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Send</button>
          </div>
        </div>
      )}
    </main>
  )
}
