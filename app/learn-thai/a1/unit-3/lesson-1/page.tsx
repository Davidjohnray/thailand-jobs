'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const TONE_PAIRS = [
  {
    tone1: { name: 'Mid', thai: 'มา', roman: 'maa', english: 'to come', pitch: '— — —', color: '#6b7280', pitchDesc: 'Flat and steady' },
    tone2: { name: 'Falling', thai: 'ม้า', roman: 'maa', english: 'horse', pitch: '↗ ↘ ↘', color: '#ef4444', pitchDesc: 'Rises then falls' },
    lesson: 'These two words sound identical to English ears at first. Listen carefully — มา rises and falls while มา stays flat.',
  },
  {
    tone1: { name: 'High', thai: 'หมา', roman: 'maa', english: 'dog', pitch: '↗ ↗ —', color: '#f59e0b', pitchDesc: 'Rises and stays high' },
    tone2: { name: 'Low', thai: 'ม่า', roman: 'maa', english: '(archaic particle)', pitch: '↘ — —', color: '#3b82f6', pitchDesc: 'Starts and stays low' },
    lesson: 'High tone climbs up like a question. Low tone stays low and flat — almost like a sigh.',
  },
  {
    tone1: { name: 'Mid', thai: 'กา', roman: 'gaa', english: 'crow (bird)', pitch: '— — —', color: '#6b7280', pitchDesc: 'Flat and steady' },
    tone2: { name: 'High', thai: 'ก้า', roman: 'gaa', english: 'trader (archaic)', pitch: '↗ ↗ —', color: '#f59e0b', pitchDesc: 'Rises and stays high' },
    lesson: 'The mid tone is your neutral starting point. The high tone climbs noticeably above it.',
  },
  {
    tone1: { name: 'Mid', thai: 'ไข่', roman: 'khai', english: 'egg', pitch: '— — —', color: '#6b7280', pitchDesc: 'Flat and steady' },
    tone2: { name: 'Low', thai: 'ไข', roman: 'khai', english: 'to cough', pitch: '↘ — —', color: '#3b82f6', pitchDesc: 'Starts low and stays low' },
    lesson: 'ไข่ (egg) and ไข (to cough) differ only in tone. The egg is mid, the cough is low.',
  },
]

const TONE_WORDS = [
  { thai: 'สวัสดี', roman: 'sawasdii', english: 'Hello', note: 'The most important phrase. Practice the rising tone on the last syllable.' },
  { thai: 'ขอบคุณ', roman: 'khob khun', english: 'Thank you', note: 'Mid tone throughout. Clean and steady.' },
  { thai: 'ใช่', roman: 'chai', english: 'Yes (correct)', note: 'Falling tone — starts high, drops down. Not to be confused with chai (a name).' },
  { thai: 'ไม่', roman: 'mai', english: 'No / Not', note: 'Falling tone. Extremely common — ไม่เป็นไร (never mind), ไม่ใช่ (no/incorrect).' },
  { thai: 'อร่อย', roman: 'aroy', english: 'Delicious', note: 'Mid then rising. Tell every cook their food is delicious!' },
  { thai: 'สบาย', roman: 'sabaai', english: 'Comfortable / well', note: 'Mid tone. สบายดีไหม? (Are you well?) is the standard greeting.' },
]

const QUIZ_Q = [
  { question: 'Listen and identify: ม้า (maa) — what does this mean?', correct: 'Horse', options: ['To come', 'Horse', 'Dog', 'Mother'] },
  { question: 'Which tone sounds like a rising question?', correct: 'High tone', options: ['Mid tone', 'Low tone', 'High tone', 'Falling tone'] },
  { question: 'ไม่ (mai = not/no) uses which tone?', correct: 'Falling tone', options: ['Mid tone', 'Rising tone', 'Falling tone', 'High tone'] },
  { question: 'How would you describe the mid tone?', correct: 'Flat and steady', options: ['Rises then falls', 'Flat and steady', 'Starts low and stays low', 'Dips then rises'] },
  { question: 'สวัสดี (sawasdii = hello) ends on which tone?', correct: 'Rising tone', options: ['Mid tone', 'Falling tone', 'Rising tone', 'Low tone'] },
  { question: 'What is the best way to develop your ear for Thai tones?', correct: 'Listen to native speakers and repeat', options: ['Only study grammar rules', 'Listen to native speakers and repeat', 'Ignore tones at first', 'Only read Thai text'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit3Lesson1() {
  const [phase, setPhase] = useState<'learn' | 'pairs' | 'practice' | 'quiz' | 'complete'>('learn')
  const [pairIndex, setPairIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  const pair = TONE_PAIRS[pairIndex]
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

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice requires Chrome'); return }
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
      <div style={{ background: 'linear-gradient(135deg, #14532d, #15803d)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 3 · Lesson 1 — Understanding Tones</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ id: 'learn', label: '📖 Intro' }, { id: 'pairs', label: '🎵 Tone Pairs' }, { id: 'practice', label: '🎤 Practice' }, { id: 'quiz', label: '🧠 Quiz' }].map(tab => (
            <button key={tab.id} onClick={() => { if (tab.id === 'quiz') { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }; setPhase(tab.id as any) }}
              style={{ background: phase === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* INTRO PHASE */}
      {phase === 'learn' && (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #15803d' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', marginBottom: '14px' }}>🎵 Tones in Real Life</h2>
            <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.75', margin: '0 0 16px' }}>
              You already know the 5 tones and 4 tone marks. Now let's make them real. In this lesson you'll train your ear to hear the differences, learn the most important tonal words, and practice saying them using your microphone.
            </p>
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px 20px', border: '2px solid #86efac', marginBottom: '16px' }}>
              <div style={{ color: '#15803d', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Good news for learners in Thailand</div>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                Living in Thailand is the biggest advantage you have. Every time you go to a market, talk to a colleague, or hear Thai on TV — you are training your ear. The brain naturally adapts to a new tonal system when surrounded by it. Trust the process.
              </p>
            </div>
            <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '16px 20px', border: '1px solid #fed7aa' }}>
              <div style={{ color: '#c2410c', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>⚠️ A note on mistakes</div>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                Getting a tone wrong won't cause offence — Thai people are used to learners and will understand from context. What matters is that you keep trying. Even saying a word with the wrong tone will teach your mouth and ear to adjust over time.
              </p>
            </div>
          </div>

          {/* Visual pitch chart */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>The 5 Tones — Pitch Chart</div>
            <div style={{ position: 'relative', background: '#f9fafb', borderRadius: '12px', padding: '24px 20px', border: '1px solid #e5e7eb', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '120px' }}>
                {[
                  { name: 'Mid', color: '#6b7280', height: '60px', shape: '●—●—●' },
                  { name: 'Low', color: '#3b82f6', height: '30px', shape: '↘—●—●' },
                  { name: 'Falling', color: '#ef4444', height: '90px', shape: '↗—↘—↘' },
                  { name: 'High', color: '#f59e0b', height: '100px', shape: '↗—↗—●' },
                  { name: 'Rising', color: '#22c55e', height: '40px', shape: '↘—↗—↗' },
                ].map(t => (
                  <div key={t.name} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ background: t.color, borderRadius: '8px', width: '40px', margin: '0 auto', height: t.height, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    <div style={{ color: t.color, fontSize: '12px', fontWeight: '800', marginTop: '8px' }}>{t.name}</div>
                    <div style={{ color: '#9ca3af', fontSize: '11px' }}>{t.shape}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              {[
                { name: 'Mid', color: '#6b7280', emoji: '→', desc: 'Flat & steady' },
                { name: 'Low', color: '#3b82f6', emoji: '↘', desc: 'Low & flat' },
                { name: 'Falling', color: '#ef4444', emoji: '↗↘', desc: 'High then drops' },
                { name: 'High', color: '#f59e0b', emoji: '↗', desc: 'Rises & stays up' },
                { name: 'Rising', color: '#22c55e', emoji: '↘↗', desc: 'Dips then rises' },
              ].map(t => (
                <div key={t.name} style={{ background: t.color + '12', borderRadius: '10px', padding: '12px', border: `1px solid ${t.color}30`, textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{t.emoji}</div>
                  <div style={{ color: t.color, fontWeight: '800', fontSize: '14px' }}>{t.name}</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setPhase('pairs')}
            style={{ width: '100%', background: 'linear-gradient(135deg, #14532d, #15803d)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
            Listen to Tone Pairs →
          </button>
        </div>
      )}

      {/* TONE PAIRS PHASE */}
      {phase === 'pairs' && (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#15803d', fontWeight: '700', fontSize: '14px' }}>Pair {pairIndex + 1} of {TONE_PAIRS.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#22c55e', borderRadius: '10px', width: `${((pairIndex + 1) / TONE_PAIRS.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>

          <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', border: '1px solid #86efac' }}>
            <div style={{ color: '#15803d', fontSize: '13px', fontWeight: '700' }}>🎧 {pair.lesson}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {[pair.tone1, pair.tone2].map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <div style={{ background: t.color, padding: '24px 20px', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{t.name} Tone</div>
                  <div style={{ fontSize: '56px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px' }}>{t.thai}</div>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', fontFamily: 'monospace', letterSpacing: '4px' }}>{t.pitch}</div>
                </div>
                <div style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <div style={{ color: '#374151', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{t.roman}</div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>{t.english}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '14px', fontStyle: 'italic' }}>{t.pitchDesc}</div>
                  <button onClick={() => speak(t.thai)}
                    style={{ background: t.color + '15', color: t.color, border: `2px solid ${t.color}40`, padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', fontWeight: '800', fontSize: '15px', width: '100%' }}>
                    🔊 Listen
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>Listen to both back to back</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => { speak(pair.tone1.thai); setTimeout(() => speak(pair.tone2.thai), 1500) }}
                style={{ background: 'linear-gradient(135deg, #14532d, #15803d)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '15px' }}>
                🔊 {pair.tone1.thai} then {pair.tone2.thai}
              </button>
              <button onClick={() => { speak(pair.tone2.thai); setTimeout(() => speak(pair.tone1.thai), 1500) }}
                style={{ background: 'rgba(21,128,61,0.1)', color: '#15803d', border: '2px solid #15803d', padding: '12px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '15px' }}>
                🔄 Reverse
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {pairIndex > 0 && <button onClick={() => setPairIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {pairIndex + 1 < TONE_PAIRS.length ? (
              <button onClick={() => setPairIndex(prev => prev + 1)}
                style={{ flex: 1, background: 'linear-gradient(135deg, #14532d, #15803d)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next Pair →
              </button>
            ) : (
              <button onClick={() => setPhase('practice')}
                style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                🎤 Practice Speaking →
              </button>
            )}
          </div>
        </div>
      )}

      {/* PRACTICE PHASE */}
      {phase === 'practice' && (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #15803d' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>🎤 Speaking Practice</h2>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              Listen to each word, then try saying it yourself using the microphone. Don't worry about being perfect — the goal is to start training your mouth and ear together.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {TONE_WORDS.map((word, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: '#15803d', marginBottom: '4px' }}>{word.thai}</div>
                  <div style={{ color: '#374151', fontWeight: '700', fontSize: '15px' }}>{word.roman} — {word.english}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>{word.note}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => speak(word.thai)}
                    style={{ background: '#f0fdf4', color: '#15803d', border: '2px solid #86efac', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '14px' }}>
                    🔊 Listen
                  </button>
                  <button onClick={() => speak(word.thai, 0.5)}
                    style={{ background: '#e0f2fe', color: '#0369a1', border: '2px solid #bae6fd', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                    🐢 Slow
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Microphone practice */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎤</div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>Try Recording Yourself</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>Say any of the words above in Thai and see what is recognised. This helps train your pronunciation.</p>
            <button onClick={startListening} disabled={listening}
              style={{ background: listening ? '#ef4444' : '#15803d', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '30px', cursor: listening ? 'not-allowed' : 'pointer', fontWeight: '900', fontSize: '16px', boxShadow: listening ? '0 0 0 6px rgba(239,68,68,0.2)' : 'none', transition: 'all 0.2s' }}>
              {listening ? '⏺ Listening...' : '🎤 Start Recording'}
            </button>
            {transcript && (
              <div style={{ marginTop: '16px', background: '#f0fdf4', borderRadius: '12px', padding: '16px', border: '2px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Recognised:</div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#14532d' }}>{transcript}</div>
              </div>
            )}
          </div>

          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
            style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
            🧠 Take the Quiz →
          </button>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#15803d', fontWeight: '700', fontSize: '14px' }}>Question {quizIndex + 1} of {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#22c55e', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{QUIZ_Q[quizIndex].question}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_Q[quizIndex].options.map(opt => {
                const isCorrect = opt === QUIZ_Q[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = '#f0fdf4'; border = '#22c55e'; textColor = '#15803d' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '16px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '16px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#22c55e', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f0fdf4' : '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#86efac' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <div style={{ color: '#15803d', fontWeight: '700' }}>✅ Correct!</div>
                : <div style={{ color: '#dc2626', fontWeight: '700' }}>❌ The correct answer is: <strong>{QUIZ_Q[quizIndex].correct}</strong></div>
              }
            </div>
          )}
          {selected && (
            <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #14532d, #15803d)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {quizIndex + 1 >= QUIZ_Q.length ? '🏆 See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#22c55e' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #86efac', textAlign: 'left' }}>
              <div style={{ color: '#15803d', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson 1 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can hear the 5 tones and recognise them in real words. Next: Tone Rules — how consonant class determines tone without any tone marks.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-3/lesson-2" style={{ display: 'block', background: 'linear-gradient(135deg, #14532d, #15803d)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Tone Rules — Mid Class →
              </Link>
              <button onClick={() => { setPhase('learn') }}
                style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                🔄 Review Again
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
