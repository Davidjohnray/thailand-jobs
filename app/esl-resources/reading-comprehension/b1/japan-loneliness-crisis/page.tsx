'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

const COLOR = '#be185d'
const COLOR_DARK = '#831843'
const COLOR_LIGHT = '#fdf2f8'
const GRADIENT = 'linear-gradient(135deg, #831843 0%, #be185d 60%, #e11d48 100%)'

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
  { word: 'Plastic surgery', def: 'Medical operations to change how someone looks — for example, making a nose smaller or eyes bigger' },
  { word: 'Beauty standard', def: 'The idea of what is considered beautiful in a particular culture or society' },
  { word: 'Pressure', def: 'The feeling that you must do something because other people expect it' },
  { word: 'Double eyelid', def: 'A fold in the eyelid that makes the eye look bigger — very common surgery in East Asia' },
  { word: 'Jaw reduction', def: 'Surgery to make the jawbone smaller to create a V-shaped face' },
  { word: 'Self-esteem', def: 'How much you like and value yourself' },
  { word: 'Discrimination', def: 'Treating someone unfairly because of how they look, their age, gender, or background' },
  { word: 'Conform', def: 'To behave or look the same as everyone else because of social pressure' },
  { word: 'Influencer', def: 'Someone with many followers on social media who affects what other people buy or do' },
  { word: 'Filter', def: 'A digital tool that changes how you look in photos — smoother skin, bigger eyes, thinner face' },
  { word: 'Unrealistic', def: 'Not possible in real life — too perfect or too extreme to be true' },
  { word: 'Body positivity', def: 'A social movement that says all body types are beautiful and people should accept themselves' },
]

const PAGES = [
  { id: 1, title: 'The Beautiful Pressure', emoji: '🇰🇷' },
  { id: 2, title: 'Why South Korea?', emoji: '💉' },
  { id: 3, title: 'The K-Pop Effect', emoji: '🎤' },
  { id: 4, title: 'The Dark Side', emoji: '😔' },
  { id: 5, title: 'Vocabulary & Key Phrases', emoji: '📖' },
  { id: 6, title: 'Discussion & Debate', emoji: '🗣️' },
]

export default function KoreaBeautyLesson() {
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

  useEffect(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setPlayingAudio(null)
  }, [currentPage])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages, chatLoading])

  useEffect(() => {
    const handler = () => { setPopupPos(null); setPopupResult(null) }
    if (popupPos) { setTimeout(() => document.addEventListener('click', handler), 100); return () => document.removeEventListener('click', handler) }
  }, [popupPos])

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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: `The student highlighted: "${text}". Give a short, simple English definition (1 sentence, B1 level).${selectedLang !== 'en' ? ` Also translate it to ${lang?.label}.` : ''} Reply in JSON: {"meaning":"...","translation":"..."}` }] })
    })
      .then(r => r.json())
      .then(data => {
        try { const parsed = JSON.parse(data.reply || data.content || '{}'); setPopupResult({ word: text, meaning: parsed.meaning || 'No definition found', translation: parsed.translation }) }
        catch { setPopupResult({ word: text, meaning: data.reply || data.content || 'No definition found' }) }
        setPopupLoading(false)
      })
      .catch(() => { setPopupResult({ word: text, meaning: 'Could not look up this word.' }); setPopupLoading(false) })
  }, [selectedLang])

  useEffect(() => { document.addEventListener('mouseup', handleTextSelect); return () => document.removeEventListener('mouseup', handleTextSelect) }, [handleTextSelect])

  const playAudio = (text: string, id: string) => {
    if (audioRef.current) {
      if (playingAudio === id) { if (audioRef.current.paused) { audioRef.current.play(); return } else { audioRef.current.pause(); return } }
      audioRef.current.pause(); audioRef.current = null
    }
    setPlayingAudio(id)
    const cleaned = text.replace(/[\u{1F600}-\u{1F9FF}\u{2600}-\u{2B55}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]/gu, '').replace(/[#*_~`>|]/g, '')
    fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: cleaned, speed: SPEEDS[speedIdx].rate }) })
      .then(r => r.blob())
      .then(blob => { const url = URL.createObjectURL(blob); const audio = new Audio(url); audio.playbackRate = SPEEDS[speedIdx].rate; audioRef.current = audio; audio.onended = () => { setPlayingAudio(null); audioRef.current = null }; audio.play() })
      .catch(() => setPlayingAudio(null))
  }

  const playVocabWord = (word: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setPlayingVocab(word)
    fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: word, speed: 0.85 }) })
      .then(r => r.blob())
      .then(blob => { const url = URL.createObjectURL(blob); const audio = new Audio(url); audioRef.current = audio; audio.onended = () => { setPlayingVocab(null); audioRef.current = null }; audio.play() })
      .catch(() => setPlayingVocab(null))
  }

  const translate = (text: string, id: string) => {
    if (selectedLang === 'en' || translatedTexts[id]) return
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    setLoadingTranslations(p => ({ ...p, [id]: true }))
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: `Translate to ${lang?.label}. Return ONLY the translation, nothing else:\n\n${text}` }] }) })
      .then(r => r.json())
      .then(data => { setTranslatedTexts(p => ({ ...p, [id]: data.reply || data.content })); setLoadingTranslations(p => ({ ...p, [id]: false })) })
      .catch(() => setLoadingTranslations(p => ({ ...p, [id]: false })))
  }

  const sendChat = () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = chatInput.trim(); setChatInput('')
    setChatMessages(p => [...p, { role: 'user', content: userMsg }]); setChatLoading(true)
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    const systemMsg = `You are a friendly English conversation partner helping a B1 student discuss South Korea's beauty culture — plastic surgery, K-pop, beauty standards, body image. Keep answers short (2-3 sentences). Ask a follow-up question. Use simple B1 English.${selectedLang !== 'en' ? ` If the student writes in ${lang?.label}, reply in English but add a ${lang?.label} translation in brackets.` : ''}`
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'system', content: systemMsg }, ...chatMessages.slice(-8), { role: 'user', content: userMsg }] }) })
      .then(r => r.json())
      .then(data => { setChatMessages(p => [...p, { role: 'assistant', content: data.reply || data.content }]); setChatLoading(false) })
      .catch(() => { setChatMessages(p => [...p, { role: 'assistant', content: 'Sorry, I had a connection problem. Try again!' }]); setChatLoading(false) })
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

  const KoreanPhrase = ({ phrase, meaning }: { phrase: string; meaning: string }) => (
    <div style={{ background: COLOR_LIGHT, border: '1px solid #fbcfe8', borderRadius: '10px', padding: '12px 16px', margin: '12px 0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: COLOR_DARK, fontStyle: 'italic' }}>"{phrase}"</span>
      <span style={{ fontSize: '14px', color: '#6b7280' }}>— {meaning}</span>
    </div>
  )

  const getPageContent = () => {
    switch (currentPage) {
      case 1: return (
        <>
          <P id="1-1">South Korea is one of the most beautiful countries in Asia. The food, the mountains, the technology, the fashion — everything seems polished and perfect. But there is one area where South Korea leads the entire world, and it is surprising: plastic surgery.</P>
          <P id="1-2">South Korea has more plastic surgery operations per person than any other country on Earth. Around one in three women in Seoul between the ages of 19 and 29 have had some kind of cosmetic procedure. In the famous Gangnam district — yes, the one from the song — there are more plastic surgery clinics than coffee shops.</P>
          <P id="1-3">But this is not just about vanity. The pressure to look a certain way in South Korea is intense — and it starts young. Students receive plastic surgery as graduation gifts from their parents. Job applications require a photograph. Dating apps rank you by appearance. In a society where how you look can decide your career, your relationships, and your future, beauty is not a choice. It is a survival tool.</P>
          <P id="1-4">In this lesson, we will explore why South Korea became the plastic surgery capital of the world, how K-pop and social media made it worse, and why a growing number of young Koreans are now fighting back — smashing their makeup and refusing to conform.</P>
          <P id="1-5">Whether you live in Thailand, Japan, China, or anywhere else in Asia, you will recognise the pressures described in this lesson. The beauty standards may be different, but the feeling is the same.</P>
        </>
      )
      case 2: return (
        <>
          <SubHead>The Job Market — Your Face Is Your CV</SubHead>
          <P id="2-1">In most countries, it would be illegal to choose employees based on how they look. In South Korea, it is normal. Most job applications require a professional photograph, and employers openly admit that appearance matters. A study found that attractive candidates were 30% more likely to get called for an interview.</P>
          <P id="2-2">For young Koreans entering the job market, this sends a clear message: if you want a good job, you need to look good. Many parents pay for their children's surgery as an investment in their future — like paying for university, but for their face.</P>
          <KoreanPhrase phrase="외모지상주의 (oe-mo-ji-sang-ju-ui)" meaning="Lookism — discrimination based on physical appearance" />

          <SubHead>Confucian Culture — Respect and Conformity</SubHead>
          <P id="2-3">South Korean culture has deep roots in Confucianism — a system of values that emphasises respect for authority, social harmony, and fitting in with the group. Standing out or being different is not celebrated the way it is in Western countries. There is enormous pressure to conform.</P>
          <P id="2-4">This extends to appearance. There is a very specific idea of what "beautiful" looks like in Korea: pale skin, a small face, a high nose bridge, big eyes with double eyelids, and a V-shaped jawline. If you do not naturally look like this, society quietly tells you to fix it.</P>

          <SubHead>The "Golden Ratio" Face</SubHead>
          <P id="2-5">Korean plastic surgeons talk about the "golden ratio" — a mathematically perfect face shape. Clinics use computer software to show patients exactly what their face could look like after surgery. The result is that many people end up looking remarkably similar — so similar that there is a joke about groups of Korean actresses being impossible to tell apart.</P>
          <P id="2-6">This is not just a joke. It reveals something important about beauty in Korea: the goal is not to look unique or interesting. The goal is to look correct.</P>

          <SubHead>Medical Tourism — The World Comes to Korea</SubHead>
          <P id="2-7">South Korea is now the world's number one destination for medical tourism in plastic surgery. Hundreds of thousands of people fly to Seoul every year from China, Japan, Thailand, and the Middle East for procedures that are cheaper and more advanced than in their home countries.</P>
          <P id="2-8">The Gangnam district alone has over 500 clinics. Some buildings have a different clinic on every floor. There are even "surgery tours" for tourists — fly in on Friday, get your nose done on Saturday, recover on Sunday, fly home on Monday.</P>
          <KoreanPhrase phrase="성형 관광 (seong-hyeong gwan-gwang)" meaning="Plastic surgery tourism" />
        </>
      )
      case 3: return (
        <>
          <P id="3-1">You cannot talk about South Korean beauty culture without talking about K-pop. The global explosion of Korean pop music — BTS, BLACKPINK, Stray Kids, NewJeans — has not just exported music. It has exported beauty standards to the entire world.</P>

          <SubHead>The Idol Factory</SubHead>
          <P id="3-2">K-pop idols are not just singers. They are products. Entertainment companies recruit teenagers — sometimes as young as 12 or 13 — and train them for years in singing, dancing, acting, and appearance. Trainees are weighed regularly. Their diets are controlled. Many undergo plastic surgery before they debut.</P>
          <P id="3-3">The message to millions of young fans is clear: this is what perfection looks like. And if your idol looks like that, shouldn't you try to look like that too?</P>
          <KoreanPhrase phrase="연습생 (yeon-seup-saeng)" meaning="Trainee — a young person being trained to become a K-pop idol" />

          <SubHead>Skin Care — The 10-Step Routine</SubHead>
          <P id="3-4">Korea is also the birthplace of the famous "10-step skincare routine" — a daily process involving cleansers, toners, essences, serums, sheet masks, eye creams, and more. Korean skincare brands like Innisfree, Laneige, and COSRX are now sold everywhere in the world.</P>
          <P id="3-5">For many Koreans, skincare is not optional. Having clear, glowing, "glass skin" is a social requirement. Men are expected to care about their skin too — South Korea is the largest market for male cosmetics in the world.</P>

          <SubHead>Social Media and Filters</SubHead>
          <P id="3-6">Apps like Snow and B612 — both Korean-made — allow users to completely transform their face with a single tap. Bigger eyes, smoother skin, a sharper jawline, lighter skin. The "real" you disappears behind a digital mask.</P>
          <P id="3-7">For young people who grow up seeing filtered faces everywhere — on Instagram, on TikTok, on dating apps — the gap between the screen and the mirror becomes painful. "I look beautiful in my phone. Why don't I look like that in real life?" This is a question millions of young Koreans ask themselves every day.</P>
          <KoreanPhrase phrase="셀카 (sel-ka)" meaning="Selfie — from the English 'self camera'" />

          <SubHead>The Export Machine</SubHead>
          <P id="3-8">Korean beauty standards have spread across Asia and beyond. In Thailand, China, Vietnam, and the Philippines, young people now follow Korean beauty trends, buy Korean products, and even travel to Korea for surgery. The Korean beauty industry is worth over 15 billion dollars — and it is still growing.</P>
        </>
      )
      case 4: return (
        <>
          <P id="4-1">Behind the perfect skin and the flawless selfies, there is a darker story. The pressure to look perfect has real consequences — especially for young people.</P>

          <SubHead>Mental Health</SubHead>
          <P id="4-2">South Korea has one of the highest rates of depression and anxiety among young people in the developed world. Studies show a direct link between beauty pressure and mental health problems. When your value as a person is measured by how you look, any imperfection feels like a failure.</P>
          <P id="4-3">Eating disorders are rising rapidly, especially among teenage girls and young women. The ideal body type promoted by K-pop — extremely thin, with almost no body fat — is physically impossible for most people to achieve without starving themselves.</P>

          <SubHead>Surgery Addiction</SubHead>
          <P id="4-4">Some people become addicted to plastic surgery. One procedure leads to another, then another. The face they wanted after the first surgery is never quite right, so they go back for more. Doctors in Korea report patients who have had 10, 20, even 30 procedures — chasing a perfection that does not exist.</P>
          <P id="4-5">There are also serious medical risks. Every surgery can cause infection, scarring, nerve damage, or worse. Some patients travel to cheap clinics without proper qualifications and suffer permanent damage.</P>

          <SubHead>The Escape the Corset Movement</SubHead>
          <P id="4-6">In recent years, a powerful movement has emerged. It is called "Escape the Corset" — and it is led by young Korean women who are fighting back against beauty pressure. They are cutting their hair short, throwing away their makeup, and posting bare-faced selfies on social media.</P>
          <KoreanPhrase phrase="탈코르셋 (tal-ko-reu-set)" meaning="Escape the Corset — a movement rejecting beauty standards" />
          <P id="4-7">These women are saying: "I refuse to spend two hours getting ready every morning. I refuse to be judged by my face. I refuse to let society tell me what beautiful means." The movement has been praised internationally, but in Korea itself, it remains controversial. Many people see these women as brave. Others see them as extreme.</P>

          <SubHead>Is Change Possible?</SubHead>
          <P id="4-8">Slowly, attitudes are changing. Some Korean companies have removed photo requirements from job applications. Some K-pop idols are speaking openly about mental health and body image. More brands are using diverse models in their advertising.</P>
          <P id="4-9">But the beauty industry is worth billions of dollars. It will not give up easily. And as long as how you look affects how you are treated — at work, in relationships, in daily life — the pressure to be beautiful will remain.</P>
          <P id="4-10">"I used to think I needed to fix my face to fix my life. Now I think I need to fix my country." — Anonymous Korean woman, Reddit, 2024.</P>
        </>
      )
      case 5: return (
        <div>
          <P id="5-intro">Key vocabulary from this lesson. Click any word to hear the pronunciation.</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {VOCAB.map(v => (
              <div key={v.word} onClick={() => playVocabWord(v.word)} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '14px 18px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = COLOR_LIGHT; (e.currentTarget as HTMLDivElement).style.borderColor = '#fbcfe8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'white'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: playingVocab === v.word ? COLOR : '#f3f4f6', color: playingVocab === v.word ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, transition: 'all 0.2s' }}>🔊</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>{v.word}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px', lineHeight: '1.5' }}>{v.def}</div>
                </div>
              </div>
            ))}
          </div>
          <SubHead>Korean Phrases from the Lesson</SubHead>
          <KoreanPhrase phrase="외모지상주의 (oe-mo-ji-sang-ju-ui)" meaning="Lookism — discrimination based on physical appearance" />
          <KoreanPhrase phrase="성형 관광 (seong-hyeong gwan-gwang)" meaning="Plastic surgery tourism" />
          <KoreanPhrase phrase="연습생 (yeon-seup-saeng)" meaning="Trainee — a young person training to become a K-pop idol" />
          <KoreanPhrase phrase="셀카 (sel-ka)" meaning="Selfie — from the English 'self camera'" />
          <KoreanPhrase phrase="탈코르셋 (tal-ko-reu-set)" meaning="Escape the Corset — a movement rejecting beauty standards" />
        </div>
      )
      case 6: return (
        <div>
          <P id="6-intro">Use these questions to practise speaking. Try the AI conversation partner to discuss your ideas!</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {[
              { q: 'In your country, is there pressure to look a certain way? What does "beautiful" mean in your culture?', icon: '🪞' },
              { q: 'Do you think employers should be allowed to ask for a photo on a job application? Why or why not?', icon: '💼' },
              { q: 'K-pop idols often have plastic surgery. Does it matter if the beauty we admire is not real?', icon: '🎤' },
              { q: 'Would you ever consider having plastic surgery? Why or why not?', icon: '💉' },
              { q: 'Social media filters change how we look. Do you think they are fun, or are they harmful?', icon: '📱' },
              { q: '"I used to think I needed to fix my face to fix my life." What does this quote make you feel?', icon: '💬' },
              { q: 'The "Escape the Corset" movement says women should reject makeup and beauty pressure. Do you agree?', icon: '✊' },
              { q: 'In Thailand, skin whitening products are very popular. Is this similar to South Korea\'s beauty culture? How?', icon: '🇹🇭' },
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
          <div style={{ background: COLOR_LIGHT, border: '1px solid #fbcfe8', borderRadius: '14px', padding: '20px', marginTop: '28px', textAlign: 'center' }}>
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
    1: `South Korea is one of the most beautiful countries in Asia. The food, the mountains, the technology, the fashion — everything seems polished and perfect. But there is one area where South Korea leads the entire world, and it is surprising: plastic surgery. South Korea has more plastic surgery operations per person than any other country on Earth. Around one in three women in Seoul between the ages of 19 and 29 have had some kind of cosmetic procedure. In the famous Gangnam district — yes, the one from the song — there are more plastic surgery clinics than coffee shops. But this is not just about vanity. The pressure to look a certain way in South Korea is intense — and it starts young. Students receive plastic surgery as graduation gifts from their parents. Job applications require a photograph. Dating apps rank you by appearance. In a society where how you look can decide your career, your relationships, and your future, beauty is not a choice. It is a survival tool. In this lesson, we will explore why South Korea became the plastic surgery capital of the world, how K-pop and social media made it worse, and why a growing number of young Koreans are now fighting back. Whether you live in Thailand, Japan, China, or anywhere else in Asia, you will recognise the pressures described in this lesson.`,
    2: `The job market. In most countries, it would be illegal to choose employees based on how they look. In South Korea, it is normal. Most job applications require a professional photograph, and employers openly admit that appearance matters. A study found that attractive candidates were 30 percent more likely to get called for an interview. For young Koreans entering the job market, this sends a clear message: if you want a good job, you need to look good. Many parents pay for their children's surgery as an investment in their future. Confucian culture. South Korean culture has deep roots in Confucianism, a system of values that emphasises respect for authority, social harmony, and fitting in with the group. There is enormous pressure to conform. This extends to appearance. There is a very specific idea of what beautiful looks like in Korea: pale skin, a small face, a high nose bridge, big eyes with double eyelids, and a V-shaped jawline. The golden ratio face. Korean plastic surgeons talk about the golden ratio, a mathematically perfect face shape. The result is that many people end up looking remarkably similar. Medical tourism. South Korea is now the world's number one destination for medical tourism in plastic surgery.`,
    3: `You cannot talk about South Korean beauty culture without talking about K-pop. The global explosion of Korean pop music has not just exported music. It has exported beauty standards to the entire world. K-pop idols are not just singers. They are products. Entertainment companies recruit teenagers, sometimes as young as 12 or 13, and train them for years. Trainees are weighed regularly. Their diets are controlled. Many undergo plastic surgery before they debut. The message to millions of young fans is clear: this is what perfection looks like. Korea is also the birthplace of the famous 10-step skincare routine. For many Koreans, skincare is not optional. Having clear, glowing, glass skin is a social requirement. Men are expected to care about their skin too. Social media and filters. Apps like Snow and B612 allow users to completely transform their face with a single tap. For young people who grow up seeing filtered faces everywhere, the gap between the screen and the mirror becomes painful. Korean beauty standards have spread across Asia and beyond. The Korean beauty industry is worth over 15 billion dollars.`,
    4: `Behind the perfect skin and the flawless selfies, there is a darker story. The pressure to look perfect has real consequences. South Korea has one of the highest rates of depression and anxiety among young people in the developed world. Studies show a direct link between beauty pressure and mental health problems. Eating disorders are rising rapidly, especially among teenage girls and young women. Some people become addicted to plastic surgery. One procedure leads to another, then another. Doctors report patients who have had 10, 20, even 30 procedures, chasing a perfection that does not exist. In recent years, a powerful movement has emerged. It is called Escape the Corset, and it is led by young Korean women who are fighting back against beauty pressure. They are cutting their hair short, throwing away their makeup, and posting bare-faced selfies on social media. These women are saying: I refuse to be judged by my face. Slowly, attitudes are changing. Some Korean companies have removed photo requirements from job applications. But the beauty industry is worth billions of dollars. It will not give up easily.`,
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
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' }}>The Beautiful Pressure</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 16px', lineHeight: '1.6', maxWidth: '600px' }}>South Korea's obsession with beauty — why plastic surgery is normal, how K-pop sets the standard, and why young Koreans are fighting back.</p>
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

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8px 24px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: COLOR, letterSpacing: '0.05em', marginBottom: '6px' }}>PAGE {currentPage}</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{PAGES[currentPage - 1].emoji}</span> {PAGES[currentPage - 1].title}
              </h2>
            </div>
            {currentPage <= 4 && (
              <button onClick={() => playAudio(pageText[currentPage] || '', `page-${currentPage}`)} style={{ background: playingAudio === `page-${currentPage}` ? COLOR : '#f3f4f6', color: playingAudio === `page-${currentPage}` ? 'white' : '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {playingAudio === `page-${currentPage}` ? '⏸ Pause' : '▶ Listen'}
              </button>
            )}
          </div>
          {currentPage === 1 && (
            <div style={{ padding: '8px 28px 0' }}>
              <div style={{ background: COLOR_LIGHT, borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px' }}>👆</span>
                <span style={{ fontSize: '13px', color: '#9d174d', fontWeight: '600' }}>Highlight any word or phrase to hear it and see its meaning</span>
              </div>
            </div>
          )}
          <div style={{ padding: '20px 28px 28px' }}>{getPageContent()}</div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} style={{ background: currentPage > 1 ? 'white' : '#f3f4f6', color: currentPage > 1 ? '#374151' : '#d1d5db', border: '1px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: currentPage > 1 ? 'pointer' : 'default' }}>← Previous</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>Page {currentPage} of {PAGES.length}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{PAGES[currentPage - 1].title}</div>
        </div>
        <button onClick={() => currentPage < PAGES.length && setCurrentPage(currentPage + 1)} style={{ background: currentPage < PAGES.length ? COLOR : '#d1d5db', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: currentPage < PAGES.length ? 'pointer' : 'default' }}>Next →</button>
      </div>

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

      {!showChat && (
        <button onClick={() => setShowChat(true)} style={{ position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px', borderRadius: '50%', background: COLOR, color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(190,24,93,0.4)', cursor: 'pointer', fontSize: '28px', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</button>
      )}

      {showChat && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', width: '380px', maxWidth: 'calc(100vw - 48px)', height: '500px', maxHeight: 'calc(100vh - 48px)', background: 'white', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: GRADIENT, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>🤖 Conversation Partner</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Discuss beauty & culture</div>
            </div>
            <button onClick={() => setShowChat(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🇰🇷 💄</div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>Ask me anything about Korean beauty culture! Try:<br />"Why is plastic surgery so popular in Korea?"<br />"What is the Escape the Corset movement?"</div>
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
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Type your message..." style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            <button onClick={sendChat} disabled={chatLoading} style={{ background: COLOR, color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Send</button>
          </div>
        </div>
      )}
    </main>
  )
}
