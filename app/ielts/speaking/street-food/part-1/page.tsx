'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TOPIC = 'Street Food & Eating Outdoors'
const PART = 1
const THINK_TIME = 30
const RECORD_TIME = 60

const QUESTIONS = [
  {
    id: 1,
    question: 'Do you enjoy eating street food? Why or why not?',
    tip: 'Give a clear yes or no, then extend with a reason and a personal example. Aim for 3–4 sentences.',
    example: 'Yes, I really enjoy it because... / Not particularly, I prefer... because...',
  },
  {
    id: 2,
    question: 'What kinds of street food are popular where you live?',
    tip: 'Name 2–3 specific types and briefly describe them. Use vocabulary like "grilled", "spicy", "freshly made".',
    example: 'In my city, you can find... One that\'s particularly popular is...',
  },
  {
    id: 3,
    question: 'Have you ever tried street food from another country? What was it like?',
    tip: 'Use past tense to describe the experience. Include how it tasted and how you felt about it.',
    example: 'Yes, when I visited... I tried... It was quite different from what I was used to because...',
  },
  {
    id: 4,
    question: 'Do you think street food is becoming more or less popular? Why?',
    tip: 'Give your opinion clearly and support it with a reason or trend you have noticed.',
    example: 'I think it\'s becoming more popular because... / Less popular in some areas due to...',
  },
]

const PART1_INTRO = {
  what: 'Part 1 lasts 4–5 minutes. The examiner asks questions about familiar topics like your home, work, studies, and everyday interests.',
  howLong: 'Keep answers to 2–4 sentences. Do not give very short one-word answers, but also do not give long speeches.',
  tip: 'Extend every answer with a reason, example, or extra detail. The examiner wants to hear you speak naturally.',
}

type VocabUpgrade = {
  original: string
  upgrade: string
  example: string
}

type Feedback = {
  bandScore: number
  summary: string
  whatWentWell: string
  improvements: string
  modelAnswerBand6: string
  modelAnswerBand7: string
  vocabularyUpgrades: VocabUpgrade[]
  followUpQuestion: string
}

type SpeechRecognitionResult = {
  [key: number]: { transcript: string }
}
type SpeechRecognitionResultList = {
  [key: number]: SpeechRecognitionResult
  length: number
}
type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList
}
type SpeechRecognitionType = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType
    webkitSpeechRecognition: new () => SpeechRecognitionType
  }
}

export default function SpeakingPart1Page() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''))
  const [feedbacks, setFeedbacks] = useState<(Feedback | null)[]>(Array(QUESTIONS.length).fill(null))
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [loadingRewrite, setLoadingRewrite] = useState(false)
  const [rewrittenAnswer, setRewrittenAnswer] = useState<string | null>(null)
  const [modelBandView, setModelBandView] = useState<'6' | '7'>('7')
  const [isRecording, setIsRecording] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showTeacherMode, setShowTeacherMode] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  // Timer states
  const [timerMode, setTimerMode] = useState<'idle' | 'thinking' | 'recording' | 'done'>('idle')
  const [timeLeft, setTimeLeft] = useState(THINK_TIME)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) setHasAccess(true)
  }, [])

  // Timer logic
  useEffect(() => {
    if (timerMode === 'thinking') {
      setTimeLeft(THINK_TIME)
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setTimerMode('recording')
            startRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerMode === 'recording') {
      setTimeLeft(RECORD_TIME)
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            stopRecording()
            setTimerMode('done')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerMode])

  function startTimedMode() {
    const newAnswers = [...answers]
    newAnswers[currentQ] = ''
    setAnswers(newAnswers)
    setRewrittenAnswer(null)
    const newFeedbacks = [...feedbacks]
    newFeedbacks[currentQ] = null
    setFeedbacks(newFeedbacks)
    setTimerMode('thinking')
  }

  function cancelTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsRecording(false)
    setTimerMode('idle')
  }

  function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      const newAnswers = [...answers]
      newAnswers[currentQ] = transcript
      setAnswers(newAnswers)
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  function stopRecording() {
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsRecording(false)
  }

  function manualStopRecording() {
    if (timerRef.current) clearInterval(timerRef.current)
    stopRecording()
    setTimerMode('done')
  }

  async function getFeedback() {
    const answer = answers[currentQ]
    if (!answer.trim()) return
    setLoadingFeedback(true)
    setRewrittenAnswer(null)
    try {
      const response = await fetch('/api/ielts/speaking-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: QUESTIONS[currentQ].question, answer, topic: TOPIC })
      })
      const parsed: Feedback = await response.json()
      const newFeedbacks = [...feedbacks]
      newFeedbacks[currentQ] = parsed
      setFeedbacks(newFeedbacks)
    } catch (err) {
      console.error('Feedback error:', err)
    }
    setLoadingFeedback(false)
  }

  async function getRewrite() {
    const answer = answers[currentQ]
    if (!answer.trim()) return
    setLoadingRewrite(true)
    try {
      const response = await fetch('/api/ielts/speaking-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: QUESTIONS[currentQ].question, answer, topic: TOPIC, mode: 'rewrite' })
      })
      const data = await response.json()
      setRewrittenAnswer(data.rewritten || '')
    } catch (err) {
      console.error('Rewrite error:', err)
    }
    setLoadingRewrite(false)
  }

  function resetQuestion() {
    if (timerRef.current) clearInterval(timerRef.current)
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsRecording(false)
    setTimerMode('idle')
    setRewrittenAnswer(null)
    const newFeedbacks = [...feedbacks]
    newFeedbacks[currentQ] = null
    setFeedbacks(newFeedbacks)
    const newAnswers = [...answers]
    newAnswers[currentQ] = ''
    setAnswers(newAnswers)
  }

  function getBandColor(band: number) {
    if (band >= 8) return '#7c3aed'
    if (band >= 7) return '#2563eb'
    if (band >= 6) return '#059669'
    if (band >= 5) return '#d97706'
    return '#dc2626'
  }

  const q = QUESTIONS[currentQ]
  const feedback = feedbacks[currentQ]
  const feedbackCount = feedbacks.filter(f => f !== null).length

  // INTRO SCREEN
  if (showIntro) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Link href="/ielts/speaking" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>
            ← Speaking Topics
          </Link>
          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '32px', margin: '20px 0', color: 'white' }}>
            <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>IELTS Speaking</div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px' }}>Part 1 — {TOPIC}</h1>
            <p style={{ opacity: 0.8, margin: 0, fontSize: '14px' }}>{QUESTIONS.length} questions · AI feedback, band score & vocabulary upgrade on each</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>About IELTS Speaking Part 1</h2>
            {[
              { label: 'What to expect', text: PART1_INTRO.what },
              { label: 'How long to answer', text: PART1_INTRO.howLong },
              { label: 'Key tip', text: PART1_INTRO.tip },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>{item.label}</p>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '14px', color: '#1e40af', margin: '0 0 8px', fontWeight: 'bold' }}>What you get on every question:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                '🎯 Estimated band score',
                '✅ What you did well',
                '📈 How to improve',
                '📝 Band 6 & Band 7–8 model answers',
                '💬 Vocabulary upgrades',
                '❓ Examiner follow-up question',
                '✍️ AI rewrite of your answer',
                '⏱️ Timed exam practice mode',
              ].map(item => (
                <div key={item} style={{ fontSize: '13px', color: '#1e40af' }}>{item}</div>
              ))}
            </div>
          </div>
          <button onClick={() => setShowIntro(false)} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Start Practice →
          </button>
        </div>
      </main>
    )
  }

  // MAIN LESSON
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <Link href="/ielts/speaking" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>← Speaking Topics</Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {hasAccess && (
              <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#1e3a5f' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                👨‍🏫 Teacher Mode
              </button>
            )}
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{feedbackCount}/{QUESTIONS.length} completed</span>
          </div>
        </div>

        {/* Teacher Mode */}
        {showTeacherMode && (
          <div style={{ background: '#1e3a5f', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — {TOPIC}</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 8–10 minutes per question including feedback review.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Timed mode:</strong> Use exam mode for realistic pressure — 30 seconds to think, 60 seconds to answer.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Classroom use:</strong> After AI feedback, discuss the vocabulary upgrades and model answer as a class.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Extension:</strong> Use the follow-up question for a second round of speaking practice.</p>
              <p style={{ margin: 0 }}><strong>Board work:</strong> Write the vocabulary upgrades on the board and drill pronunciation.</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '6px', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a5f, #2563eb)', height: '100%', borderRadius: '4px', width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Question tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {QUESTIONS.map((_, i) => (
            <button key={i} onClick={() => { setCurrentQ(i); setRewrittenAnswer(null) }} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: i === currentQ ? '#1e3a5f' : feedbacks[i] ? '#dcfce7' : '#e2e8f0', color: i === currentQ ? 'white' : feedbacks[i] ? '#166534' : '#555' }}>
              Q{i + 1} {feedbacks[i] ? '✓' : ''}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Question {currentQ + 1} of {QUESTIONS.length}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', lineHeight: 1.4 }}>"{q.question}"</h2>

          {/* Tip */}
          <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>💡 How to answer</p>
            <p style={{ fontSize: '13px', color: '#1e40af', margin: '0 0 6px', lineHeight: 1.5 }}>{q.tip}</p>
            <p style={{ fontSize: '12px', color: '#3b82f6', margin: 0, fontStyle: 'italic' }}>e.g. {q.example}</p>
          </div>

          {/* Timer Mode Banner */}
          {timerMode === 'thinking' && (
            <div style={{ background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ color: '#92400e', fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px' }}>⏱️ Thinking Time</p>
              <p style={{ color: '#92400e', fontSize: '13px', margin: '0 0 8px' }}>Prepare your answer — recording starts automatically</p>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#d97706' }}>{timeLeft}s</div>
              <button onClick={cancelTimer} style={{ marginTop: '8px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #d97706', background: 'white', color: '#d97706', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
            </div>
          )}

          {timerMode === 'recording' && (
            <div style={{ background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px' }}>🔴 Recording</p>
              <p style={{ color: '#991b1b', fontSize: '13px', margin: '0 0 8px' }}>Speak your answer now</p>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#ef4444' }}>{timeLeft}s</div>
              <button onClick={manualStopRecording} style={{ marginTop: '8px', padding: '6px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>⏹ Stop Early</button>
            </div>
          )}

          {timerMode === 'done' && (
            <div style={{ background: '#dcfce7', border: '2px solid #16a34a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>✅ Recording complete — review your answer below and get feedback</p>
            </div>
          )}

          {/* Mic + Timer buttons */}
          {timerMode === 'idle' && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <button onClick={isRecording ? stopRecording : startRecording} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: isRecording ? '#ef4444' : 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isRecording ? '⏹ Stop Recording' : '🎤 Speak Answer'}
              </button>
              <button onClick={startTimedMode} style={{ padding: '10px 20px', borderRadius: '8px', border: '2px solid #f59e0b', background: 'white', color: '#d97706', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⏱️ Exam Mode
              </button>
              {isRecording && <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600', alignSelf: 'center' }}>● Recording...</span>}
            </div>
          )}

          {/* Text area */}
          <textarea
            value={answers[currentQ]}
            onChange={e => { const a = [...answers]; a[currentQ] = e.target.value; setAnswers(a) }}
            placeholder="Your answer will appear here after speaking, or type directly..."
            rows={5}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', color: '#1a1a2e' }}
          />
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>You can edit the text above before getting feedback.</p>
        </div>

        {/* Get Feedback Button */}
        {!feedback && (
          <button onClick={getFeedback} disabled={loadingFeedback || !answers[currentQ].trim()} style={{ width: '100%', padding: '14px', background: loadingFeedback || !answers[currentQ].trim() ? '#94a3b8' : 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: loadingFeedback || !answers[currentQ].trim() ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
            {loadingFeedback ? '⏳ Analysing your answer...' : '🤖 Get AI Feedback & Band Score'}
          </button>
        )}

        {/* Feedback Panel */}
        {feedback && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>

            {/* Band Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '2px solid #f1f5f9' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: getBandColor(feedback.bandScore), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <div style={{ fontSize: '26px', fontWeight: 'bold', lineHeight: 1 }}>{feedback.bandScore}</div>
                <div style={{ fontSize: '10px', opacity: 0.85 }}>Band</div>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>Estimated Band Score</p>
                <p style={{ fontSize: '14px', color: '#1a1a2e', margin: 0, lineHeight: 1.5 }}>{feedback.summary}</p>
              </div>
            </div>

            {/* What went well */}
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>✅ What went well</p>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7 }}>{feedback.whatWentWell}</p>
            </div>

            {/* Improvements */}
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#d97706', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>📈 How to improve</p>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7 }}>{feedback.improvements}</p>
            </div>

            {/* Vocabulary Upgrades */}
            {feedback.vocabularyUpgrades && feedback.vocabularyUpgrades.length > 0 && (
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>💬 Vocabulary Upgrades</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {feedback.vocabularyUpgrades.map((v, i) => (
                    <div key={i} style={{ background: '#faf5ff', borderRadius: '8px', padding: '12px 14px', border: '1px solid #e9d5ff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{v.original}</span>
                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>→</span>
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{v.upgrade}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#6d28d9', margin: 0, fontStyle: 'italic' }}>e.g. "{v.example}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Answers — Band 6 vs Band 7 toggle */}
            <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px 18px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>📝 Model Answers — See the Difference</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <button onClick={() => setModelBandView('6')} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', background: modelBandView === '6' ? '#d97706' : '#e2e8f0', color: modelBandView === '6' ? 'white' : '#555' }}>
                  Band 6 Answer
                </button>
                <button onClick={() => setModelBandView('7')} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', background: modelBandView === '7' ? '#059669' : '#e2e8f0', color: modelBandView === '7' ? 'white' : '#555' }}>
                  Band 7–8 Answer
                </button>
              </div>
              {modelBandView === '6' && (
                <div>
                  <p style={{ fontSize: '11px', color: '#854d0e', margin: '0 0 8px', fontWeight: '600' }}>Simple vocabulary, basic grammar, limited range — but correct and on topic.</p>
                  <p style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{feedback.modelAnswerBand6}"</p>
                </div>
              )}
              {modelBandView === '7' && (
                <div>
                  <p style={{ fontSize: '11px', color: '#166534', margin: '0 0 8px', fontWeight: '600' }}>Wider vocabulary, varied grammar, natural fluency and well-developed ideas.</p>
                  <p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{feedback.modelAnswerBand7}"</p>
                </div>
              )}
            </div>

            {/* Follow-up Question */}
            {feedback.followUpQuestion && (
              <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '16px 18px', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>❓ Examiner Follow-up Question</p>
                <p style={{ fontSize: '14px', color: '#1e40af', margin: '0 0 10px', fontWeight: '600' }}>"{feedback.followUpQuestion}"</p>
                <p style={{ fontSize: '12px', color: '#3b82f6', margin: 0 }}>Practice answering this to prepare for the unpredictable nature of Part 1.</p>
              </div>
            )}

            {/* Rewrite My Answer */}
            <div style={{ background: '#fefce8', borderRadius: '10px', padding: '16px 18px', border: '1px solid #fef08a', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>✍️ Rewrite My Answer at Band 7–8</p>
              <p style={{ fontSize: '13px', color: '#713f12', margin: '0 0 12px', lineHeight: 1.5 }}>See how your ideas could be expressed at a higher level — keeping your content but improving the language.</p>
              {!rewrittenAnswer && (
                <button onClick={getRewrite} disabled={loadingRewrite} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: loadingRewrite ? '#94a3b8' : '#ca8a04', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: loadingRewrite ? 'not-allowed' : 'pointer' }}>
                  {loadingRewrite ? '⏳ Rewriting...' : '✍️ Rewrite My Answer'}
                </button>
              )}
              {rewrittenAnswer && (
                <div style={{ background: 'white', borderRadius: '8px', padding: '12px 14px', border: '1px solid #fef08a' }}>
                  <p style={{ fontSize: '14px', color: '#713f12', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{rewrittenAnswer}"</p>
                  <button onClick={() => setRewrittenAnswer(null)} style={{ marginTop: '8px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #fef08a', background: 'white', color: '#854d0e', fontSize: '12px', cursor: 'pointer' }}>Hide</button>
                </div>
              )}
            </div>

            {/* Try again */}
            <button onClick={resetQuestion} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#555', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '8px' }}>
          <button onClick={() => { setCurrentQ(Math.max(0, currentQ - 1)); setRewrittenAnswer(null) }} disabled={currentQ === 0} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: currentQ === 0 ? '#c4c4c4' : '#1a1a2e', fontSize: '14px', fontWeight: '600', cursor: currentQ === 0 ? 'not-allowed' : 'pointer' }}>
            ← Previous
          </button>
          {currentQ < QUESTIONS.length - 1 ? (
            <button onClick={() => { setCurrentQ(currentQ + 1); setRewrittenAnswer(null) }} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
              Next Question →
            </button>
          ) : (
            <Link href="/ielts/speaking/street-food/part-2" style={{ padding: '12px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>
              Continue to Part 2 →
            </Link>
          )}
        </div>

      </div>
    </main>
  )
}
