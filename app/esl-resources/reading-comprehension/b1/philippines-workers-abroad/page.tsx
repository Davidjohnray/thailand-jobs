'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

const COLOR = '#4338ca'
const COLOR_DARK = '#312e81'
const COLOR_LIGHT = '#eef2ff'
const GRADIENT = 'linear-gradient(135deg, #312e81 0%, #4338ca 60%, #6366f1 100%)'

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
  { word: 'Loneliness', def: 'The sad feeling of being alone and not having meaningful connections with other people' },
  { word: 'Hikikomori', def: 'A Japanese word for people who shut themselves inside their homes for months or years, avoiding all social contact' },
  { word: 'Isolation', def: 'Being separated from other people — physically or emotionally' },
  { word: 'Ageing population', def: 'When a country has more old people than young people, and the average age keeps rising' },
  { word: 'Birth rate', def: 'The number of babies born per 1,000 people in a year — Japan has one of the lowest in the world' },
  { word: 'Overwork', def: 'Working too many hours, which damages your health and personal life' },
  { word: 'Karoshi', def: 'A Japanese word that literally means "death from overwork" — people dying from heart attacks or strokes caused by extreme working hours' },
  { word: 'Stigma', def: 'A negative feeling that society has about something, which makes people feel ashamed to talk about it' },
  { word: 'Epidemic', def: 'Something that spreads rapidly and affects a very large number of people — not just diseases' },
  { word: 'Connection', def: 'A meaningful relationship or bond with another person' },
  { word: 'Mental health', def: 'Your emotional and psychological wellbeing — how you think, feel, and cope with life' },
  { word: 'Community', def: 'A group of people who live in the same area or share interests and support each other' },
]

const PAGES = [
  { id: 1, title: 'A Country of Empty Spaces', emoji: '🇯🇵' },
  { id: 2, title: 'Why Is Japan So Lonely?', emoji: '🏢' },
  { id: 3, title: 'Hikikomori — The Hidden People', emoji: '🚪' },
  { id: 4, title: 'Fighting Back Against Loneliness', emoji: '🤝' },
  { id: 5, title: 'Vocabulary & Key Phrases', emoji: '📖' },
  { id: 6, title: 'Discussion & Debate', emoji: '🗣️' },
]

export default function JapanLonelinessLesson() {
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

  useEffect(() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null } setPlayingAudio(null) }, [currentPage])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages, chatLoading])
  useEffect(() => { const handler = () => { setPopupPos(null); setPopupResult(null) }; if (popupPos) { setTimeout(() => document.addEventListener('click', handler), 100); return () => document.removeEventListener('click', handler) } }, [popupPos])

  const handleTextSelect = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return
    const text = sel.toString().trim()
    if (text.length > 100) return
    setSelectedText(text)
    const range = sel.getRangeAt(0); const rect = range.getBoundingClientRect()
    setPopupPos({ x: rect.left + rect.width / 2, y: rect.top - 10 }); setPopupResult(null); setPopupLoading(true)
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: `The student highlighted: "${text}". Give a short, simple English definition (1 sentence, B1 level).${selectedLang !== 'en' ? ` Also translate it to ${lang?.label}.` : ''} Reply in JSON: {"meaning":"...","translation":"..."}` }] }) })
      .then(r => r.json())
      .then(data => { try { const parsed = JSON.parse(data.reply || data.content || '{}'); setPopupResult({ word: text, meaning: parsed.meaning || 'No definition found', translation: parsed.translation }) } catch { setPopupResult({ word: text, meaning: data.reply || data.content || 'No definition found' }) } setPopupLoading(false) })
      .catch(() => { setPopupResult({ word: text, meaning: 'Could not look up this word.' }); setPopupLoading(false) })
  }, [selectedLang])

  useEffect(() => { document.addEventListener('mouseup', handleTextSelect); return () => document.removeEventListener('mouseup', handleTextSelect) }, [handleTextSelect])

  const playAudio = (text: string, id: string) => {
    if (audioRef.current) { if (playingAudio === id) { if (audioRef.current.paused) { audioRef.current.play(); return } else { audioRef.current.pause(); return } } audioRef.current.pause(); audioRef.current = null }
    setPlayingAudio(id)
    const cleaned = text.replace(/[\u{1F600}-\u{1F9FF}\u{2600}-\u{2B55}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]/gu, '').replace(/[#*_~`>|]/g, '')
    fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: cleaned, speed: SPEEDS[speedIdx].rate }) })
      .then(r => r.blob()).then(blob => { const url = URL.createObjectURL(blob); const audio = new Audio(url); audio.playbackRate = SPEEDS[speedIdx].rate; audioRef.current = audio; audio.onended = () => { setPlayingAudio(null); audioRef.current = null }; audio.play() }).catch(() => setPlayingAudio(null))
  }

  const playVocabWord = (word: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null } setPlayingVocab(word)
    fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: word, speed: 0.85 }) })
      .then(r => r.blob()).then(blob => { const url = URL.createObjectURL(blob); const audio = new Audio(url); audioRef.current = audio; audio.onended = () => { setPlayingVocab(null); audioRef.current = null }; audio.play() }).catch(() => setPlayingVocab(null))
  }

  const translate = (text: string, id: string) => {
    if (selectedLang === 'en' || translatedTexts[id]) return
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    setLoadingTranslations(p => ({ ...p, [id]: true }))
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: `Translate to ${lang?.label}. Return ONLY the translation, nothing else:\n\n${text}` }] }) })
      .then(r => r.json()).then(data => { setTranslatedTexts(p => ({ ...p, [id]: data.reply || data.content })); setLoadingTranslations(p => ({ ...p, [id]: false })) }).catch(() => setLoadingTranslations(p => ({ ...p, [id]: false })))
  }

  const sendChat = () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = chatInput.trim(); setChatInput(''); setChatMessages(p => [...p, { role: 'user', content: userMsg }]); setChatLoading(true)
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    const systemMsg = `You are a friendly English conversation partner helping a B1 student discuss Japan's loneliness crisis — hikikomori, overwork, ageing, isolation, mental health. Keep answers short (2-3 sentences). Ask a follow-up question. Use simple B1 English.${selectedLang !== 'en' ? ` If the student writes in ${lang?.label}, reply in English but add a ${lang?.label} translation in brackets.` : ''}`
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'system', content: systemMsg }, ...chatMessages.slice(-8), { role: 'user', content: userMsg }] }) })
      .then(r => r.json()).then(data => { setChatMessages(p => [...p, { role: 'assistant', content: data.reply || data.content }]); setChatLoading(false) }).catch(() => { setChatMessages(p => [...p, { role: 'assistant', content: 'Sorry, I had a connection problem. Try again!' }]); setChatLoading(false) })
  }

  const P = ({ children, id }: { children: string; id: string }) => (
    <div style={{ marginBottom: '20px' }}>
      <p style={{ fontSize: '16px', lineHeight: '1.9', color: '#1a1a2e', margin: '0 0 8px' }}>{children}</p>
      {selectedLang !== 'en' && (
        <button onClick={() => translate(children, id)} style={{ background: 'none', border: 'none', color: COLOR, fontSize: '13px', cursor: 'pointer', padding: '2px 0', fontWeight: '600' }}>
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

  const JapanesePhrase = ({ phrase, meaning }: { phrase: string; meaning: string }) => (
    <div style={{ background: COLOR_LIGHT, border: '1px solid #c7d2fe', borderRadius: '10px', padding: '12px 16px', margin: '12px 0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: COLOR_DARK, fontStyle: 'italic' }}>"{phrase}"</span>
      <span style={{ fontSize: '14px', color: '#6b7280' }}>— {meaning}</span>
    </div>
  )

  const getPageContent = () => {
    switch (currentPage) {
      case 1: return (
        <>
          <P id="1-1">Japan is a country of 125 million people. Its cities are some of the most crowded on Earth. Trains are packed so tightly that railway companies hire people to push passengers inside. And yet, Japan is facing an epidemic of loneliness.</P>
          <P id="1-2">A government survey found that more than 40% of Japanese adults feel lonely. Over a million people — known as hikikomori — have shut themselves inside their homes, some for years, some for decades. The country has more empty houses than it can count. Entire villages have been abandoned as young people leave for the cities, and the cities themselves feel lonelier than ever.</P>
          <P id="1-3">Japan even created the world's first Minister of Loneliness in 2021 — a government position dedicated entirely to solving this crisis. That is how serious the problem has become.</P>
          <P id="1-4">How did one of the world's most advanced, safest, and most organised countries become one of the loneliest? The answer lies in a unique combination of work culture, social pressure, an ageing population, and technology that connects people to screens but disconnects them from each other.</P>
          <P id="1-5">This is not just Japan's story. Loneliness is spreading across the world — from South Korea to the UK, from the US to Thailand. Understanding Japan can help us understand ourselves.</P>
        </>
      )
      case 2: return (
        <>
          <SubHead>Work Culture — Living at the Office</SubHead>
          <P id="2-1">Japan is famous for its work ethic. Employees are expected to arrive early, stay late, and never leave before their boss. Working 60 or 70 hours a week is common. Some workers sleep at their desks or in "capsule hotels" near the office because they finish too late to go home.</P>
          <P id="2-2">This extreme work culture has a deadly consequence. Japan has a word that does not exist in most languages: karoshi — death from overwork. Every year, people die from heart attacks, strokes, and suicide caused by working too many hours.</P>
          <JapanesePhrase phrase="過労死 (karoshi)" meaning="Death from overwork — a uniquely Japanese word for a uniquely Japanese problem" />
          <P id="2-3">When you work this much, you have no time for friends, hobbies, dating, or family. Many workers come home exhausted, eat alone, sleep, and go back to work. Their only human contact is with colleagues — not friends, not family, just co-workers.</P>

          <SubHead>The Marriage Crisis</SubHead>
          <P id="2-4">Fewer and fewer Japanese people are getting married. In the 1970s, only 2% of men and 3% of women were unmarried at age 50. Today, about 28% of men and 18% of women reach 50 without ever marrying. A recent survey found that 40% of single Japanese people in their 20s and 30s have never been in a romantic relationship at all.</P>
          <P id="2-5">Why? The reasons are complex. Work leaves no time for dating. Traditional gender roles feel outdated to many young women, who do not want to become housewives. Young men feel financial pressure — they cannot afford to support a family on Japanese salaries that have barely increased in 30 years.</P>
          <JapanesePhrase phrase="草食系男子 (soushoku-kei danshi)" meaning="Herbivore men — passive, uninterested in dating or competition" />

          <SubHead>The Baby Crisis</SubHead>
          <P id="2-6">If people are not getting married, they are not having children. Japan's birth rate has fallen to its lowest level in history. In 2023, only 758,000 babies were born — down from 2.7 million in 1947. Japan's population is shrinking by about 800,000 people every year.</P>
          <P id="2-7">This means more old people and fewer young people. In some rural areas, there are more people over 80 than under 20. Schools close. Shops close. Bus routes are cancelled. Towns become ghost towns — full of empty houses and silence.</P>

          <SubHead>Social Pressure — The Weight of Fitting In</SubHead>
          <P id="2-8">Japanese society places enormous value on harmony, politeness, and not bothering others. This is beautiful in many ways — it makes Japan one of the safest, cleanest, and most respectful countries on Earth. But it also makes it very difficult to ask for help, express your feelings, or show weakness.</P>
          <P id="2-9">If you are struggling, you are expected to keep it to yourself. Complaining is seen as selfish. Asking for help is seen as a burden on others. Many lonely people suffer in silence because they are too polite to tell anyone they are suffering.</P>
          <JapanesePhrase phrase="迷惑をかけない (meiwaku wo kakenai)" meaning="Don't cause trouble for others — a core value in Japanese culture" />
        </>
      )
      case 3: return (
        <>
          <P id="3-1">Of all the symptoms of Japan's loneliness crisis, none is more striking than hikikomori — people who withdraw completely from society and lock themselves inside their homes.</P>

          <SubHead>Who Are They?</SubHead>
          <P id="3-2">The Japanese government defines hikikomori as people who have stayed at home for more than six months and do not go to work, school, or socialise outside the family. There are now an estimated 1.46 million hikikomori in Japan — and the real number may be much higher, because many families keep it secret.</P>
          <P id="3-3">Originally, hikikomori were mostly young men in their teens and twenties. But the crisis has aged. Today, many are in their 40s, 50s, and even 60s. Some have been inside their rooms for 20 or 30 years. They order food online, avoid all human contact, and communicate with family — if at all — through notes slipped under the door.</P>
          <JapanesePhrase phrase="引きこもり (hikikomori)" meaning="People who withdraw from society and stay shut inside their homes" />

          <SubHead>Why Does It Happen?</SubHead>
          <P id="3-4">There is no single cause. For many, it starts with a bad experience — bullying at school, failure in an exam, losing a job, or social rejection. In a culture where shame is powerful and failure is not easily forgiven, these experiences can feel impossible to recover from.</P>
          <P id="3-5">The thinking goes like this: "If I go outside, I might fail. If I fail, I bring shame to my family. If I stay inside, I cannot fail." The room becomes a prison — but a safe one. The longer someone stays inside, the harder it becomes to leave. After a year, the outside world feels terrifying. After five years, it feels impossible.</P>

          <SubHead>The Elderly Alone</SubHead>
          <P id="3-6">It is not just young people. Japan has a growing problem of elderly people dying alone in their homes — sometimes not discovered for weeks or months. There is a word for this: kodokushi, lonely death.</P>
          <JapanesePhrase phrase="孤独死 (kodokushi)" meaning="Lonely death — dying alone and not being found for a long time" />
          <P id="3-7">An entire industry has grown around this tragedy. Special cleaning companies clear the homes of people who died alone. In some cases, the body was not found for so long that it left a permanent mark on the floor. These companies are always busy — in Tokyo, there are more than 30,000 kodokushi deaths every year.</P>

          <SubHead>Rent-a-Friend, Rent-a-Family</SubHead>
          <P id="3-8">Japan's loneliness has created some of the strangest businesses in the world. You can rent a friend to go shopping with. You can rent a family member to attend your wedding. You can rent a boyfriend or girlfriend to introduce to your parents. These services are expensive — but for many lonely Japanese people, they are the closest thing to real human connection.</P>
          <P id="3-9">There are also "listening bars" where you pay someone to listen to you talk. Not a therapist — just a human being who will look at you, nod, and listen. The fact that people will pay money for this tells you everything about how lonely Japan has become.</P>
        </>
      )
      case 4: return (
        <>
          <P id="4-1">Japan's loneliness crisis is enormous — but the country is not ignoring it. From government programmes to community projects to technology, Japan is trying to find solutions. Some are brilliant. Some are bizarre. All of them reveal how desperate the need is.</P>

          <SubHead>The Minister of Loneliness</SubHead>
          <P id="4-2">In 2021, Japan became only the second country in the world (after the UK) to appoint a Minister of Loneliness. The minister's job is to coordinate programmes across government, encourage research, and raise awareness. It was a powerful symbolic move — the government was saying: "Loneliness is a national crisis, and we take it seriously."</P>

          <SubHead>Community Cafes and Third Places</SubHead>
          <P id="4-3">Across Japan, "community cafes" are opening — places where elderly people can come for a cheap meal, a cup of tea, and some company. Some are run by local governments, others by volunteers. The idea is simple: give lonely people a place to go where someone will talk to them.</P>
          <P id="4-4">For young people, there are "free spaces" — relaxed places where hikikomori can come at their own pace, with no pressure to talk or socialise. Some of these spaces have been remarkably successful in slowly helping people rejoin society.</P>

          <SubHead>Technology — Help or Harm?</SubHead>
          <P id="4-5">Japan has always been a technology leader, and it is using technology to fight loneliness too. AI companions, robot pets, and virtual friends are all available. A company called Gatebox sells a holographic anime character that lives in a glass tube on your desk, greets you when you come home, and sends you text messages during the day.</P>
          <P id="4-6">But many experts worry that these digital solutions make the problem worse. "If a lonely person gets comfort from a robot, they have even less reason to go outside and meet real people," says one psychologist. "We are treating the symptoms, not the disease."</P>
          <JapanesePhrase phrase="つながり (tsunagari)" meaning="Connection, bond, human ties — what Japan is trying to rebuild" />

          <SubHead>Work Reform</SubHead>
          <P id="4-7">The government is slowly pushing companies to reduce working hours. In 2019, a law was passed limiting overtime. Some companies now turn off office lights at 8pm to force employees to go home. Others are experimenting with four-day work weeks.</P>
          <P id="4-8">Progress is slow. Many companies resist change. Older bosses believe long hours equal loyalty. But younger workers are pushing back — they want lives outside the office, and they are willing to change jobs to find them.</P>

          <SubHead>Can Loneliness Be Cured?</SubHead>
          <P id="4-9">Japan's loneliness crisis is a warning to the rest of the world. As societies become richer, safer, and more technological, they do not automatically become happier. Humans need connection — real, messy, imperfect human connection. No app, no robot, and no amount of money can replace that.</P>
          <P id="4-10">"I have everything I need. Food, a clean apartment, fast internet, a good job. But I go weeks without anyone touching me or calling my name. Is this really what progress looks like?" — Anonymous Japanese office worker, 2024.</P>
        </>
      )
      case 5: return (
        <div>
          <P id="5-intro">Key vocabulary from this lesson. Click any word to hear the pronunciation.</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {VOCAB.map(v => (
              <div key={v.word} onClick={() => playVocabWord(v.word)} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '14px 18px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = COLOR_LIGHT; (e.currentTarget as HTMLDivElement).style.borderColor = '#c7d2fe' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'white'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: playingVocab === v.word ? COLOR : '#f3f4f6', color: playingVocab === v.word ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, transition: 'all 0.2s' }}>🔊</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>{v.word}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px', lineHeight: '1.5' }}>{v.def}</div>
                </div>
              </div>
            ))}
          </div>
          <SubHead>Japanese Phrases from the Lesson</SubHead>
          <JapanesePhrase phrase="過労死 (karoshi)" meaning="Death from overwork" />
          <JapanesePhrase phrase="草食系男子 (soushoku-kei danshi)" meaning="Herbivore men — passive, uninterested in dating" />
          <JapanesePhrase phrase="迷惑をかけない (meiwaku wo kakenai)" meaning="Don't cause trouble for others" />
          <JapanesePhrase phrase="引きこもり (hikikomori)" meaning="People who withdraw from society completely" />
          <JapanesePhrase phrase="孤独死 (kodokushi)" meaning="Lonely death — dying alone and not being found" />
          <JapanesePhrase phrase="つながり (tsunagari)" meaning="Connection, bond, human ties" />
        </div>
      )
      case 6: return (
        <div>
          <P id="6-intro">Use these questions to practise speaking. Try the AI conversation partner to discuss your ideas!</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {[
              { q: 'Do you ever feel lonely? What helps you when you feel that way?', icon: '💭' },
              { q: 'In your culture, is it easy or difficult to talk about loneliness and mental health? Why?', icon: '🗣️' },
              { q: 'Is overwork a problem in your country? How many hours per week do you think is healthy?', icon: '🏢' },
              { q: 'Do you think technology (social media, video calls, AI friends) makes loneliness better or worse?', icon: '📱' },
              { q: 'What do you think about the concept of hikikomori? Does anything similar exist in your country?', icon: '🚪' },
              { q: '"I have everything I need — but I go weeks without anyone calling my name." What does this quote make you feel?', icon: '💬' },
              { q: 'Should governments have a Minister of Loneliness? Or is loneliness a personal problem, not a political one?', icon: '🏛️' },
              { q: 'What advice would you give to someone who feels lonely and isolated?', icon: '🤝' },
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
          <div style={{ background: COLOR_LIGHT, border: '1px solid #c7d2fe', borderRadius: '14px', padding: '20px', marginTop: '28px', textAlign: 'center' }}>
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
    1: `Japan is a country of 125 million people. Its cities are some of the most crowded on Earth. Trains are packed so tightly that railway companies hire people to push passengers inside. And yet, Japan is facing an epidemic of loneliness. A government survey found that more than 40 percent of Japanese adults feel lonely. Over a million people, known as hikikomori, have shut themselves inside their homes, some for years, some for decades. The country has more empty houses than it can count. Japan even created the world's first Minister of Loneliness in 2021. How did one of the world's most advanced, safest, and most organised countries become one of the loneliest? The answer lies in a unique combination of work culture, social pressure, an ageing population, and technology that connects people to screens but disconnects them from each other. This is not just Japan's story. Loneliness is spreading across the world. Understanding Japan can help us understand ourselves.`,
    2: `Work culture. Japan is famous for its work ethic. Employees are expected to arrive early, stay late, and never leave before their boss. Working 60 or 70 hours a week is common. This extreme work culture has a deadly consequence. Japan has a word that does not exist in most languages: karoshi, death from overwork. When you work this much, you have no time for friends, hobbies, dating, or family. The marriage crisis. Fewer and fewer Japanese people are getting married. About 28 percent of men and 18 percent of women reach 50 without ever marrying. A recent survey found that 40 percent of single Japanese people in their 20s and 30s have never been in a romantic relationship at all. The baby crisis. Japan's birth rate has fallen to its lowest level in history. Japan's population is shrinking by about 800,000 people every year. Social pressure. Japanese society places enormous value on harmony, politeness, and not bothering others. If you are struggling, you are expected to keep it to yourself. Many lonely people suffer in silence.`,
    3: `Of all the symptoms of Japan's loneliness crisis, none is more striking than hikikomori, people who withdraw completely from society and lock themselves inside their homes. There are now an estimated 1.46 million hikikomori in Japan. Originally, hikikomori were mostly young men. But the crisis has aged. Today, many are in their 40s, 50s, and 60s. Some have been inside their rooms for 20 or 30 years. There is no single cause. For many, it starts with a bad experience, bullying, failure, or social rejection. The thinking goes: if I go outside, I might fail. If I stay inside, I cannot fail. The room becomes a prison, but a safe one. Japan also has a growing problem of elderly people dying alone, called kodokushi. An entire industry has grown around this tragedy. Japan's loneliness has created some of the strangest businesses: rent-a-friend, rent-a-family, listening bars where you pay someone to listen to you talk.`,
    4: `Japan's loneliness crisis is enormous, but the country is not ignoring it. In 2021, Japan became only the second country to appoint a Minister of Loneliness. Community cafes are opening across Japan, places where elderly people can come for a cheap meal and some company. For young people, there are free spaces where hikikomori can come at their own pace. Japan is using technology too. AI companions, robot pets, and virtual friends are all available. But many experts worry that these digital solutions make the problem worse. The government is slowly pushing companies to reduce working hours. Some companies turn off office lights at 8pm. Others are experimenting with four-day work weeks. Japan's loneliness crisis is a warning to the rest of the world. As societies become richer, safer, and more technological, they do not automatically become happier. Humans need connection, real, messy, imperfect human connection.`,
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <section style={{ background: GRADIENT, padding: '48px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <a href="/esl-resources/reading-comprehension/b1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>← B1 Reading</a>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Reading Comprehension</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>15–25 minutes</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' }}>A Country of Empty Spaces</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 16px', lineHeight: '1.6', maxWidth: '600px' }}>Japan's loneliness epidemic — overwork, hikikomori, an ageing population, and a country searching for connection.</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['👆 Highlight any text', '🌍 13-language translation', '🤖 AI conversation partner', '🔊 4-speed audio', '🔊 Pause & resume'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280' }}>🔊 SPEED:</span>
            {SPEEDS.map((s, i) => (<button key={s.label} onClick={() => setSpeedIdx(i)} style={{ background: i === speedIdx ? COLOR : '#f3f4f6', color: i === speedIdx ? 'white' : '#6b7280', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>{s.icon} {s.label}</button>))}
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>{LANGUAGES.find(l => l.code === selectedLang)?.flag} {LANGUAGES.find(l => l.code === selectedLang)?.label} ▾</button>
            {showLangMenu && (<div style={{ position: 'absolute', top: '40px', right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 50, minWidth: '180px', maxHeight: '320px', overflowY: 'auto' }}>{LANGUAGES.map(l => (<button key={l.code} onClick={() => { setSelectedLang(l.code); setShowLangMenu(false); setTranslatedTexts({}) }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', border: 'none', background: l.code === selectedLang ? COLOR_LIGHT : 'transparent', cursor: 'pointer', fontSize: '14px', color: '#374151', textAlign: 'left' }}>{l.flag} {l.label}</button>))}</div>)}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 8px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>{PAGES.map(p => (<div key={p.id} onClick={() => setCurrentPage(p.id)} style={{ flex: 1, height: '6px', borderRadius: '3px', background: p.id <= currentPage ? COLOR : '#e5e7eb', cursor: 'pointer', transition: 'background 0.2s' }} />))}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>Page {currentPage} of {PAGES.length}</span>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>{PAGES[currentPage - 1].emoji} {PAGES[currentPage - 1].title}</span>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8px 24px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: COLOR, letterSpacing: '0.05em', marginBottom: '6px' }}>PAGE {currentPage}</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><span>{PAGES[currentPage - 1].emoji}</span> {PAGES[currentPage - 1].title}</h2>
            </div>
            {currentPage <= 4 && (<button onClick={() => playAudio(pageText[currentPage] || '', `page-${currentPage}`)} style={{ background: playingAudio === `page-${currentPage}` ? COLOR : '#f3f4f6', color: playingAudio === `page-${currentPage}` ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>{playingAudio === `page-${currentPage}` ? '⏸ Pause' : '▶ Listen'}</button>)}
          </div>
          {currentPage === 1 && (<div style={{ padding: '8px 28px 0' }}><div style={{ background: COLOR_LIGHT, borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ fontSize: '16px' }}>👆</span><span style={{ fontSize: '13px', color: '#3730a3', fontWeight: '600' }}>Highlight any word or phrase to hear it and see its meaning</span></div></div>)}
          <div style={{ padding: '20px 28px 28px' }}>{getPageContent()}</div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} style={{ background: currentPage > 1 ? 'white' : '#f3f4f6', color: currentPage > 1 ? '#374151' : '#d1d5db', border: '1px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: currentPage > 1 ? 'pointer' : 'default' }}>← Previous</button>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>Page {currentPage} of {PAGES.length}</div><div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{PAGES[currentPage - 1].title}</div></div>
        <button onClick={() => currentPage < PAGES.length && setCurrentPage(currentPage + 1)} style={{ background: currentPage < PAGES.length ? COLOR : '#d1d5db', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: currentPage < PAGES.length ? 'pointer' : 'default' }}>Next →</button>
      </div>

      {popupPos && (<div style={{ position: 'fixed', left: Math.min(popupPos.x, window.innerWidth - 200), top: Math.max(popupPos.y - 120, 10), background: 'white', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '16px 20px', zIndex: 100, maxWidth: '300px', minWidth: '200px', border: '1px solid #e5e7eb' }} onClick={e => e.stopPropagation()}>{popupLoading ? (<div style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>Looking up "{selectedText}"...</div>) : popupResult ? (<><div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><button onClick={() => playVocabWord(popupResult.word)} style={{ background: COLOR_LIGHT, border: 'none', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '16px' }}>🔊</button><span style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a2e' }}>{popupResult.word}</span></div><div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', marginBottom: popupResult.translation ? '8px' : '0' }}>{popupResult.meaning}</div>{popupResult.translation && (<div style={{ fontSize: '13px', color: COLOR, fontWeight: '600', borderTop: '1px solid #f3f4f6', paddingTop: '8px', marginTop: '4px' }}>{popupResult.translation}</div>)}</>) : null}</div>)}

      {!showChat && (<button onClick={() => setShowChat(true)} style={{ position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px', borderRadius: '50%', background: COLOR, color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(67,56,202,0.4)', cursor: 'pointer', fontSize: '28px', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</button>)}

      {showChat && (<div style={{ position: 'fixed', bottom: '24px', right: '24px', width: '380px', maxWidth: 'calc(100vw - 48px)', height: '500px', maxHeight: 'calc(100vh - 48px)', background: 'white', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: GRADIENT, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><div style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>🤖 Conversation Partner</div><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Discuss loneliness & society</div></div><button onClick={() => setShowChat(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>×</button></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {chatMessages.length === 0 && (<div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>🇯🇵 🏠</div><div style={{ fontSize: '14px', lineHeight: '1.5' }}>Ask me anything about Japan's loneliness crisis! Try:<br />"What is hikikomori?"<br />"Why don't young Japanese people get married?"</div></div>)}
          {chatMessages.map((m, i) => (<div key={i} style={{ marginBottom: '12px', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}><div style={{ background: m.role === 'user' ? COLOR : '#f3f4f6', color: m.role === 'user' ? 'white' : '#1a1a2e', padding: '10px 16px', borderRadius: '14px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.5' }}>{m.content}</div></div>))}
          {chatLoading && (<div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}><div style={{ background: '#f3f4f6', padding: '10px 16px', borderRadius: '14px', fontSize: '14px', color: '#9ca3af' }}>Thinking...</div></div>)}
          <div ref={chatEndRef} />
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Type your message..." style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
          <button onClick={sendChat} disabled={chatLoading} style={{ background: COLOR, color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Send</button>
        </div>
      </div>)}
    </main>
  )
}
