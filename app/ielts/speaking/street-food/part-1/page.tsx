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

type Feedback = {
  bandScore: number
  summary: string
  whatWentWell: string
  improvements: string
  modelAnswer: string
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
  const [isRecording, setIsRecording] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showTeacherMode, setShowTeacherMode] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) {
      setHasAccess(true)
    }
  }, [])

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

    recognition.onerror = (event: { error: string }) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }

  async function getFeedback() {
    const answer = answers[currentQ]
    if (!answer.trim()) return
    setLoadingFeedback(true)

    try {
      const response = await fetch('/api/ielts/speaking-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: QUESTIONS[currentQ].question,
          answer,
          topic: TOPIC,
        })
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

  function getBandColor(band: number) {
    if (band >= 8) return '#7c3aed'
    if (band >= 7) return '#2563eb'
    if (band >= 6) return '#059669'
    if (band >= 5) return '#d97706'
    return '#dc2626'
  }

  const q = QUESTIONS[currentQ]
  const feedback = feedbacks[currentQ]
  const answeredCount = answers.filter(a => a.trim()).length
  const feedbackCount = feedbacks.filter(f => f !== null).length

  // INTRO SCREEN
  if (showIntro) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Link href="/ielts/speaking" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>
            ← Speaking Topics
          </Link>

          <div style={{
            background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
            borderRadius: '16px',
            padding: '32px',
            margin: '20px 0',
            color: 'white',
          }}>
            <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              IELTS Speaking
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px' }}>Part 1 — {TOPIC}</h1>
            <p style={{ opacity: 0.8, margin: 0, fontSize: '14px' }}>{QUESTIONS.length} questions · AI feedback & band score on each</p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>
              About IELTS Speaking Part 1
            </h2>
            {[
              { label: 'What to expect', text: PART1_INTRO.what },
              { label: 'How long to answer', text: PART1_INTRO.howLong },
              { label: 'Key tip', text: PART1_INTRO.tip },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '14px', color: '#1e40af', margin: 0, lineHeight: 1.6 }}>
              <strong>How this works:</strong> Read the question, then click the microphone to speak your answer. Your speech will be converted to text. You can edit it before submitting. Click <strong>Get Feedback</strong> to receive your band score and tips.
            </p>
          </div>

          <button
            onClick={() => setShowIntro(false)}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/ielts/speaking" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>
            ← Speaking Topics
          </Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {hasAccess && (
              <button
                onClick={() => setShowTeacherMode(!showTeacherMode)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  background: showTeacherMode ? '#1e3a5f' : 'white',
                  color: showTeacherMode ? 'white' : '#555',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                👨‍🏫 Teacher Mode
              </button>
            )}
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              {feedbackCount}/{QUESTIONS.length} completed
            </span>
          </div>
        </div>

        {/* Teacher Mode Panel */}
        {showTeacherMode && (
          <div style={{
            background: '#1e3a5f',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '20px',
            color: 'white',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              👨‍🏫 Teacher Mode — {TOPIC}
            </h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 8px' }}><strong>Suggested timing:</strong> 8–10 minutes per question including feedback review.</p>
              <p style={{ margin: '0 0 8px' }}><strong>Classroom use:</strong> Have students answer aloud first, then submit for AI feedback. Discuss the model answer as a class.</p>
              <p style={{ margin: '0 0 8px' }}><strong>Extension:</strong> Ask students to re-answer the question after reading the model answer and compare.</p>
              <p style={{ margin: 0 }}><strong>Board work:</strong> Write key vocabulary from student answers and model answers on the board.</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '6px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(90deg, #1e3a5f, #2563eb)',
            height: '100%',
            borderRadius: '4px',
            width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`,
            transition: 'width 0.3s',
          }} />
        </div>

        {/* Question number tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {QUESTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                background: i === currentQ ? '#1e3a5f' : feedbacks[i] ? '#dcfce7' : '#e2e8f0',
                color: i === currentQ ? 'white' : feedbacks[i] ? '#166534' : '#555',
              }}
            >
              Q{i + 1} {feedbacks[i] ? '✓' : ''}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Question {currentQ + 1} of {QUESTIONS.length}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', lineHeight: 1.4 }}>
            "{q.question}"
          </h2>

          {/* Tip */}
          <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              💡 How to answer
            </p>
            <p style={{ fontSize: '13px', color: '#1e40af', margin: '0 0 6px', lineHeight: 1.5 }}>{q.tip}</p>
            <p style={{ fontSize: '12px', color: '#3b82f6', margin: 0, fontStyle: 'italic' }}>e.g. {q.example}</p>
          </div>

          {/* Mic button */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: isRecording ? '#ef4444' : 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                color: 'white',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isRecording ? '⏹ Stop Recording' : '🎤 Speak Answer'}
            </button>
            {isRecording && (
              <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600', animation: 'pulse 1s infinite' }}>
                ● Recording...
              </span>
            )}
          </div>

          {/* Text area */}
          <textarea
            value={answers[currentQ]}
            onChange={e => {
              const newAnswers = [...answers]
              newAnswers[currentQ] = e.target.value
              setAnswers(newAnswers)
            }}
            placeholder="Your answer will appear here after speaking, or type directly..."
            rows={5}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              fontSize: '15px',
              lineHeight: 1.6,
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              outline: 'none',
              color: '#1a1a2e',
            }}
          />
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
            You can edit the text above before getting feedback.
          </p>
        </div>

        {/* Get Feedback Button */}
        {!feedback && (
          <button
            onClick={getFeedback}
            disabled={loadingFeedback || !answers[currentQ].trim()}
            style={{
              width: '100%',
              padding: '14px',
              background: loadingFeedback || !answers[currentQ].trim()
                ? '#94a3b8'
                : 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: loadingFeedback || !answers[currentQ].trim() ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {loadingFeedback ? '⏳ Getting feedback...' : '🤖 Get AI Feedback & Band Score'}
          </button>
        )}

        {/* Feedback Panel */}
        {feedback && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>

            {/* Band Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '2px solid #f1f5f9' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: getBandColor(feedback.bandScore),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}>
                <div style={{ fontSize: '26px', fontWeight: 'bold', lineHeight: 1 }}>{feedback.bandScore}</div>
                <div style={{ fontSize: '10px', opacity: 0.85 }}>Band</div>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>
                  Estimated Band Score
                </p>
                <p style={{ fontSize: '14px', color: '#1a1a2e', margin: 0, lineHeight: 1.5 }}>{feedback.summary}</p>
              </div>
            </div>

            {/* What went well */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>
                ✅ What went well
              </p>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7 }}>{feedback.whatWentWell}</p>
            </div>

            {/* Improvements */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#d97706', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>
                📈 How to improve
              </p>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7 }}>{feedback.improvements}</p>
            </div>

            {/* Model Answer */}
            <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px 18px', border: '1px solid #bbf7d0' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>
                📝 Model Band 7–8 Answer
              </p>
              <p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>
                "{feedback.modelAnswer}"
              </p>
            </div>

            {/* Try again button */}
            <button
              onClick={() => {
                const newFeedbacks = [...feedbacks]
                newFeedbacks[currentQ] = null
                setFeedbacks(newFeedbacks)
                const newAnswers = [...answers]
                newAnswers[currentQ] = ''
                setAnswers(newAnswers)
              }}
              style={{
                marginTop: '16px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: '#555',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '8px' }}>
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              color: currentQ === 0 ? '#c4c4c4' : '#1a1a2e',
              fontSize: '14px',
              fontWeight: '600',
              cursor: currentQ === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Previous
          </button>

          {currentQ < QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Next Question →
            </button>
          ) : (
            <Link href="/ielts/speaking/street-food/part-2" style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}>
              Continue to Part 2 →
            </Link>
          )}
        </div>

      </div>
    </main>
  )
}
