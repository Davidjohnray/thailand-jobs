'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const GREETINGS = [
  {
    thai: 'สวัสดี', roman: 'sawasdee', english: 'Hello / Goodbye',
    tone: 'Mid · Falling · Mid', toneColor: '#6b7280',
    context: 'Used for both hello and goodbye. The most important word in Thai.',
    formal: 'สวัสดีครับ (man) / สวัสดีค่ะ (woman)',
    notes: 'Always add ครับ (male) or ค่ะ (female) to be polite. The wai (pressing palms together) often accompanies this greeting.',
    situations: ['Meeting someone', 'Leaving someone', 'Answering the phone', 'Entering a shop'],
    emoji: '🙏',
  },
  {
    thai: 'สบายดีไหม', roman: 'sabaai dii mai', english: 'How are you?',
    tone: 'Mid · Mid · Rising', toneColor: '#22c55e',
    context: 'The standard "how are you" — literally "comfortable good question-particle".',
    formal: 'สบายดีไหมครับ / ค่ะ',
    notes: 'ไหม (mai) turns a statement into a yes/no question. The answer is usually สบายดี (fine) or สบายดีครับ/ค่ะ.',
    situations: ['Greeting friends', 'Starting a conversation', 'Small talk with colleagues'],
    emoji: '😊',
  },
  {
    thai: 'สบายดี', roman: 'sabaai dii', english: 'I\'m fine / Fine',
    tone: 'Mid · Mid', toneColor: '#6b7280',
    context: 'The standard response to "how are you". Literally means "comfortable and good".',
    formal: 'สบายดีครับ / สบายดีค่ะ',
    notes: 'You can add ขอบคุณ (thank you) or ขอบคุณนะ (thanks) after this. สบาย also means comfortable or relaxed.',
    situations: ['Responding to สบายดีไหม', 'Casual greeting response'],
    emoji: '👍',
  },
  {
    thai: 'ยินดีที่ได้รู้จัก', roman: 'yindii thii dai ruujak', english: 'Nice to meet you',
    tone: 'Mixed', toneColor: '#8b5cf6',
    context: 'Said when meeting someone for the first time. More formal than everyday greetings.',
    formal: 'ยินดีที่ได้รู้จักครับ / ค่ะ',
    notes: 'ยินดี means pleased/glad. You can shorten to ยินดีครับ in casual settings. Thai people sometimes use English "nice to meet you" in professional contexts.',
    situations: ['First meetings', 'Business introductions', 'Formal settings'],
    emoji: '🤝',
  },
  {
    thai: 'ไปไหน', roman: 'pai nai', english: 'Where are you going?',
    tone: 'Mid · Mid', toneColor: '#6b7280',
    context: 'A very common casual greeting — Thai people ask this as small talk, not expecting a detailed answer.',
    formal: 'ไปไหนครับ / คะ',
    notes: 'Don\'t be surprised when Thai people ask this — it\'s friendly small talk, not nosy. Just say ไปเที่ยว (going out) or ไปทำงาน (going to work).',
    situations: ['Neighbours greeting you', 'Casual street small talk'],
    emoji: '🚶',
  },
  {
    thai: 'ไปทำงาน', roman: 'pai tham ngaan', english: 'Going to work',
    tone: 'Mid · Falling · Mid', toneColor: '#f59e0b',
    context: 'The most common reply to ไปไหน. Instantly understood and socially appropriate.',
    formal: 'ไปทำงานครับ / ค่ะ',
    notes: 'ทำงาน (tham ngaan) = to work. ไป (pai) = to go. You\'ll use this phrase every morning.',
    situations: ['Replying to ไปไหน', 'Explaining where you\'re going'],
    emoji: '💼',
  },
  {
    thai: 'แล้วพบกันใหม่', roman: 'laeo phob gan mai', english: 'See you again',
    tone: 'Mixed', toneColor: '#0ea5e9',
    context: 'A friendly goodbye phrase. Literally "and meet each other again".',
    formal: 'แล้วพบกันใหม่นะครับ / นะค่ะ',
    notes: 'นะ adds softness and warmth to the phrase. Very common among colleagues and friends at the end of the day.',
    situations: ['Saying goodbye at work', 'End of meetings', 'Parting from friends'],
    emoji: '👋',
  },
  {
    thai: 'ฝันดี', roman: 'fan dii', english: 'Good night / Sweet dreams',
    tone: 'Falling · Mid', toneColor: '#ef4444',
    context: 'Said before bed or when someone is about to sleep. Literally "dream good".',
    formal: 'ฝันดีนะครับ / นะค่ะ',
    notes: 'ฝัน = dream, ดี = good. A warm and friendly way to end the evening with family, friends or housemates.',
    situations: ['Before bed', 'Late night goodbyes', 'Saying goodnight to family'],
    emoji: '🌙',
  },
]

const QUIZ_Q = [
  { q: 'How do you say "Hello" in Thai?', correct: 'สวัสดี', options: ['สบายดี', 'สวัสดี', 'ขอบคุณ', 'ยินดี'] },
  { q: 'สบายดีไหม means...?', correct: 'How are you?', options: ['Nice to meet you', 'Where are you going?', 'How are you?', 'See you again'] },
  { q: 'A Thai person asks ไปไหน. What do they mean?', correct: 'Where are you going?', options: ['How are you?', 'What time is it?', 'Where are you going?', 'What are you eating?'] },
  { q: 'How do you say "I\'m fine" in Thai?', correct: 'สบายดี', options: ['ฝันดี', 'สวัสดี', 'สบายดี', 'ยินดีที่ได้รู้จัก'] },
  { q: 'ฝันดี means...?', correct: 'Good night / Sweet dreams', options: ['See you again', 'Goodbye', 'Good night / Sweet dreams', 'Nice to meet you'] },
  { q: 'What does ไปทำงาน mean?', correct: 'Going to work', options: ['Going home', 'Going to eat', 'Going to work', 'Going out'] },
  { q: 'สวัสดี is used for...?', correct: 'Both hello and goodbye', options: ['Only hello', 'Only goodbye', 'Both hello and goodbye', 'Only formal situations'] },
  { q: 'แล้วพบกันใหม่ means...?', correct: 'See you again', options: ['Nice to meet you', 'Good night', 'How are you?', 'See you again'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit4Lesson1() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  const card = GREETINGS[cardIndex]
  const pct = Math.round((correct / QUIZ_Q.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === QUIZ_Q[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
  }

  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ_Q.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  const startListening = (targetThai: string) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice requires Chrome'); return }
    setTranscript('')
    const r = new SR(); r.lang = 'th-TH'; r.continuous = false; r.interimResults = false
    r.onstart = () => setListening(true)
    r.onresult = (e: any) => { setTranscript(e.results[0][0].transcript); setListening(false) }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    recognitionRef.current = r; r.start()
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #7c2d12, #ef4444)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 4 · Lesson 1 — Greetings</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Learn</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(239,68,68,0.05)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
          <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {GREETINGS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#ef4444', borderRadius: '10px', width: `${((cardIndex + 1) / GREETINGS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Greetings</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #ef4444' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🙏 Welcome to the fun part!</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                You've mastered the building blocks — consonants, vowels, tones. Now we start using real Thai in real situations. Greetings are your first tool for connecting with Thai people every single day.
              </p>
              <div style={{ background: '#fef2f2', borderRadius: '12px', padding: '14px 18px', border: '1px solid #fca5a5' }}>
                <div style={{ color: '#dc2626', fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>💡 Cultural note — The Wai</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>Thai greetings are often accompanied by the <strong>wai</strong> — pressing your palms together at chest level and bowing slightly. As a foreigner, returning a wai is always appreciated. You don't need to initiate, but always return one if given to you.</div>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #7c2d12, #ef4444)', padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>{card.emoji}</div>
              <div style={{ fontSize: '64px', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '10px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', marginBottom: '20px' }}>{card.english}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => speak(card.thai)}
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>
                  🔊 Listen
                </button>
                <button onClick={() => speak(card.thai, 0.5)}
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  🐢 Slow
                </button>
              </div>
            </div>

            <div style={{ padding: '28px 32px' }}>
              {/* Context */}
              <div style={{ background: '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '2px solid #fca5a5' }}>
                <div style={{ color: '#dc2626', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>📖 Context</div>
                <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{card.context}</p>
              </div>

              {/* Formal version */}
              <div style={{ background: '#f9fafb', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
                <div style={{ color: '#6b7280', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>🎯 Polite form</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e' }}>{card.formal}</div>
                  <button onClick={() => speak(card.formal.split(' / ')[0])} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>🔊</button>
                </div>
              </div>

              {/* Notes */}
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Notes</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.notes}</p>
              </div>

              {/* When to use */}
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>✅ When to use</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {card.situations.map((s, i) => (
                    <span key={i} style={{ background: '#dcfce7', color: '#15803d', fontSize: '13px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Try saying it */}
              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #ede9fe', textAlign: 'center' }}>
                <div style={{ color: '#6d28d9', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🎤 Try saying it</div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => startListening(card.thai)} disabled={listening}
                    style={{ background: listening ? '#ef4444' : '#7c3aed', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '20px', cursor: listening ? 'not-allowed' : 'pointer', fontWeight: '800', fontSize: '14px', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.2)' : 'none', transition: 'all 0.2s' }}>
                    {listening ? '⏺ Listening...' : '🎤 Record'}
                  </button>
                </div>
                {transcript && (
                  <div style={{ marginTop: '12px', background: 'white', borderRadius: '10px', padding: '12px 16px', border: '1px solid #ede9fe' }}>
                    <div style={{ color: '#6d28d9', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>You said:</div>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e' }}>{transcript}</div>
                    {transcript.includes(card.thai.split(' ')[0]) && <div style={{ color: '#15803d', fontSize: '13px', fontWeight: '700', marginTop: '4px' }}>✅ Great pronunciation!</div>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* All greetings mini nav */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>All {GREETINGS.length} Greetings</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {GREETINGS.map((g, i) => (
                <button key={i} onClick={() => { setCardIndex(i); speak(g.thai) }}
                  style={{ background: i === cardIndex ? '#ef4444' : '#f9fafb', color: i === cardIndex ? 'white' : '#374151', border: `2px solid ${i === cardIndex ? '#ef4444' : '#e5e7eb'}`, borderRadius: '10px', padding: '8px 12px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {g.emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < GREETINGS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(GREETINGS[cardIndex + 1].thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #7c2d12, #ef4444)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {GREETINGS[cardIndex + 1].thai} →
              </button>
            ) : (
              <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                ✅ Take the Quiz →
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#ef4444', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '19px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{QUIZ_Q[quizIndex].q}</div>
            {/* Hear the word if it's Thai */}
            {QUIZ_Q[quizIndex].q.includes('สวัสดี') || QUIZ_Q[quizIndex].q.includes('สบาย') || QUIZ_Q[quizIndex].q.includes('ไป') || QUIZ_Q[quizIndex].q.includes('ฝัน') || QUIZ_Q[quizIndex].q.includes('แล้ว') ? (
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <button onClick={() => {
                  const thaiWord = QUIZ_Q[quizIndex].q.match(/[\u0E00-\u0E7F\s]+/)?.[0]?.trim() || ''
                  speak(thaiWord)
                }} style={{ background: '#fef2f2', color: '#ef4444', border: '2px solid #fca5a5', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>🔊 Hear it</button>
              </div>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_Q[quizIndex].options.map(opt => {
                const isCorrect = opt === QUIZ_Q[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                  if (isCorrect) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                  if (isCorrect) { bg = '#f0fdf4'; border = '#22c55e'; textColor = '#15803d' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '16px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f0fdf4' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#86efac' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#15803d', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #7c2d12, #ef4444)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '🏆 Results →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#ef4444' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #fca5a5', textAlign: 'left' }}>
              <div style={{ color: '#dc2626', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can now greet Thai people in 8 different situations. Tomorrow — try using สวัสดีครับ/ค่ะ with a real person. Next: polite particles ครับ and ค่ะ.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-4/lesson-2" style={{ display: 'block', background: 'linear-gradient(135deg, #7c2d12, #ef4444)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Polite Particles ครับ / ค่ะ →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
