'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TOPIC = 'Living in a Hot Climate'
const PREP_TIME = 60
const SPEAK_TIME = 120

const CUE_CARD = {
  title: 'Describe a time when the hot weather affected your plans.',
  bullets: [
    'when this happened',
    'what your original plans were',
    'how the heat affected what you did',
    'and explain how you felt about it',
  ],
}

const PART2_INTRO = {
  what: 'Part 2 lasts 3–4 minutes. You are given a cue card with a topic and bullet points. You have 1 minute to prepare, then you must speak for 1–2 minutes without stopping.',
  howLong: 'Aim to speak for the full 2 minutes. Cover all the bullet points on the cue card and add your own details and feelings.',
  tip: 'Use the bullet points as a structure. Start with a clear opening sentence, work through each point with details and feelings, then end with a strong concluding sentence.',
  notes: 'In the real exam you are given paper and a pencil — jot down key words for each bullet point during prep time.',
}

type VocabUpgrade = { original: string; upgrade: string; example: string }
type Feedback = {
  bandScore: number
  summary: string
  whatWentWell: string
  improvements: string
  modelAnswerBand6: string
  modelAnswerBand7: string
  vocabularyUpgrades: VocabUpgrade[]
  roundingOffResponse: string
}
type SpeechRecognitionResult = { [key: number]: { transcript: string } }
type SpeechRecognitionResultList = { [key: number]: SpeechRecognitionResult; length: number }
type SpeechRecognitionEvent = { results: SpeechRecognitionResultList }
type SpeechRecognitionType = {
  continuous: boolean; interimResults: boolean; lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null; start: () => void; stop: () => void
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType
    webkitSpeechRecognition: new () => SpeechRecognitionType
  }
}

export default function HotClimatePart2Page() {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [loadingRewrite, setLoadingRewrite] = useState(false)
  const [rewrittenAnswer, setRewrittenAnswer] = useState<string | null>(null)
  const [modelBandView, setModelBandView] = useState<'6' | '7'>('7')
  const [isRecording, setIsRecording] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showTeacherMode, setShowTeacherMode] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [timerMode, setTimerMode] = useState<'idle' | 'prep' | 'speaking' | 'done'>('idle')
  const [timeLeft, setTimeLeft] = useState(PREP_TIME)
  const [wordCount, setWordCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) {
      setHasAccess(true); setCheckingAccess(false); return
    }
    if (!email) { setCheckingAccess(false); return }
    supabase.from('ielts_access').select('expires_at, is_active').eq('email', email).eq('is_active', true).single()
      .then(({ data }) => {
        if (data && new Date(data.expires_at) > new Date()) {
          setHasAccess(true)
          localStorage.setItem('ielts_expires', data.expires_at)
        }
        setCheckingAccess(false)
      })
  }, [])

  useEffect(() => { setWordCount(answer.trim() ? answer.trim().split(/\s+/).length : 0) }, [answer])

  useEffect(() => {
    if (timerMode === 'prep') {
      setTimeLeft(PREP_TIME)
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current!); setTimerMode('speaking'); startRecording(); return 0 } return prev - 1 })
      }, 1000)
    } else if (timerMode === 'speaking') {
      setTimeLeft(SPEAK_TIME)
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current!); stopRecording(); setTimerMode('done'); return 0 } return prev - 1 })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerMode])

  function startExamMode() { setAnswer(''); setFeedback(null); setRewrittenAnswer(null); setTimerMode('prep') }
  function cancelTimer() { if (timerRef.current) clearInterval(timerRef.current); if (recognitionRef.current) recognitionRef.current.stop(); setIsRecording(false); setTimerMode('idle') }
  function manualStop() { if (timerRef.current) clearInterval(timerRef.current); stopRecording(); setTimerMode('done') }
  function startRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Please use Chrome.'); return }
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = 'en-US'
    r.onresult = (e: SpeechRecognitionEvent) => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setAnswer(t) }
    r.onerror = () => setIsRecording(false); r.onend = () => setIsRecording(false)
    recognitionRef.current = r; r.start(); setIsRecording(true)
  }
  function stopRecording() { if (recognitionRef.current) recognitionRef.current.stop(); setIsRecording(false) }
  async function getFeedback() {
    if (!answer.trim()) return; setLoadingFeedback(true); setRewrittenAnswer(null)
    try {
      const res = await fetch('/api/ielts/speaking-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: CUE_CARD.title, answer, topic: TOPIC, part: 2, bullets: CUE_CARD.bullets }) })
      setFeedback(await res.json())
    } catch (e) { console.error(e) }
    setLoadingFeedback(false)
  }
  async function getRewrite() {
    if (!answer.trim()) return; setLoadingRewrite(true)
    try {
      const res = await fetch('/api/ielts/speaking-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: CUE_CARD.title, answer, topic: TOPIC, mode: 'rewrite', part: 2 }) })
      const d = await res.json(); setRewrittenAnswer(d.rewritten || '')
    } catch (e) { console.error(e) }
    setLoadingRewrite(false)
  }
  function resetAll() { if (timerRef.current) clearInterval(timerRef.current); if (recognitionRef.current) recognitionRef.current.stop(); setIsRecording(false); setTimerMode('idle'); setAnswer(''); setFeedback(null); setRewrittenAnswer(null) }
  function getBandColor(b: number) { if (b >= 8) return '#7c3aed'; if (b >= 7) return '#2563eb'; if (b >= 6) return '#059669'; if (b >= 5) return '#d97706'; return '#dc2626' }
  function formatTime(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}` }
  const speakingDuration = Math.round(wordCount / 2.5)

  // ============ LOCKED — NO ACCESS ============
  if (!checkingAccess && !hasAccess) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <Link href="/ielts/speaking" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>← Speaking Topics</Link>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px 32px', marginTop: '24px', color: 'white' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>{TOPIC}</h1>
          <p style={{ opacity: 0.8, fontSize: '14px', margin: '0 0 24px' }}>This is a subscription topic. Activate your access code to unlock this and 6 other Speaking topics, plus all Writing and Reading content.</p>
          <Link href="/ielts/subscribe" style={{ background: 'white', color: '#1e3a5f', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
            Get Access — 149 THB/month →
          </Link>
        </div>
      </div>
    </main>
  )

  if (showIntro) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link href="/ielts/speaking" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>← Speaking Topics</Link>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '32px', margin: '20px 0', color: 'white' }}>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>IELTS Speaking</div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px' }}>Part 2 — {TOPIC}</h1>
          <p style={{ opacity: 0.8, margin: 0, fontSize: '14px' }}>Cue card long turn · 1 min prep · 2 min talk · AI feedback & band score</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>About IELTS Speaking Part 2</h2>
          {[
            { label: 'What to expect', text: PART2_INTRO.what },
            { label: 'How long to speak', text: PART2_INTRO.howLong },
            { label: 'Key tip', text: PART2_INTRO.tip },
            { label: 'Making notes', text: PART2_INTRO.notes },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>{item.label}</p>
              <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>
        <div style={{ background: '#fffbeb', border: '2px dashed #f59e0b', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>📋 Your Cue Card</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', lineHeight: 1.4 }}>{CUE_CARD.title}</p>
          <p style={{ fontSize: '13px', color: '#555', margin: '0 0 10px', fontStyle: 'italic' }}>You should say:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {CUE_CARD.bullets.map((b, i) => <li key={i} style={{ fontSize: '14px', color: '#374151', padding: '4px 0', display: 'flex', gap: '8px' }}><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>•</span> {b}</li>)}
          </ul>
        </div>
        <button onClick={() => setShowIntro(false)} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Start Practice →</button>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/ielts/speaking" style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>← Topics</Link>
            <Link href="/ielts/speaking/hot-climate/part-1" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none' }}>Part 1</Link>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e3a5f', borderBottom: '2px solid #2563eb', paddingBottom: '2px' }}>Part 2</span>
            <Link href="/ielts/speaking/hot-climate/part-3" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none' }}>Part 3</Link>
          </div>
          <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#1e3a5f' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>👨‍🏫 Teacher Mode</button>
        </div>

        {showTeacherMode && (
          <div style={{ background: '#1e3a5f', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Part 2</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 15–20 minutes including prep, speaking, feedback and discussion.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Before starting:</strong> Ask students to think of a real example — a day when heat changed their plans (cancelled trip, moved an event indoors, etc.). Personal examples score higher in Part 2.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Vocabulary focus:</strong> Encourage words like "unbearable," "scorching," "humidity," "heatwave," and "to seek shade" — these are common in higher-band answers on this topic.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Extension:</strong> Use the rounding-off question for a brief class discussion before moving to Part 3.</p>
              <p style={{ margin: 0 }}><strong>Board work:</strong> Write vocabulary upgrades on the board and drill with example sentences.</p>
            </div>
          </div>
        )}

        <div style={{ background: '#fffbeb', border: '2px dashed #f59e0b', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>📋 Cue Card — Part 2</p>
            <span style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', color: '#92400e', fontWeight: '600' }}>1 min prep · 2 min talk</span>
          </div>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', lineHeight: 1.4 }}>{CUE_CARD.title}</p>
          <p style={{ fontSize: '13px', color: '#555', margin: '0 0 10px', fontStyle: 'italic' }}>You should say:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {CUE_CARD.bullets.map((b, i) => <li key={i} style={{ fontSize: '15px', color: '#374151', padding: '6px 0', display: 'flex', gap: '10px', borderBottom: i < CUE_CARD.bullets.length - 1 ? '1px solid #fde68a' : 'none' }}><span style={{ color: '#f59e0b', fontWeight: 'bold', flexShrink: 0 }}>•</span> {b}</li>)}
          </ul>
        </div>

        {timerMode === 'prep' && (
          <div style={{ background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '12px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ color: '#92400e', fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px' }}>⏱️ Preparation Time</p>
            <p style={{ color: '#92400e', fontSize: '13px', margin: '0 0 12px' }}>Read the cue card and prepare — speaking starts automatically</p>
            <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#d97706', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
            <button onClick={cancelTimer} style={{ marginTop: '12px', padding: '6px 16px', borderRadius: '6px', border: '1px solid #d97706', background: 'white', color: '#d97706', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
          </div>
        )}
        {timerMode === 'speaking' && (
          <div style={{ background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '12px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px' }}>🔴 Speaking Now</p>
            <p style={{ color: '#991b1b', fontSize: '13px', margin: '0 0 12px' }}>Cover all bullet points — keep talking until the timer ends</p>
            <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#ef4444', lineHeight: 1 }}>{formatTime(timeLeft)}</div>
            <div style={{ background: '#fecaca', borderRadius: '8px', height: '8px', margin: '12px auto', maxWidth: '300px' }}>
              <div style={{ background: '#ef4444', height: '100%', borderRadius: '8px', width: `${(timeLeft / SPEAK_TIME) * 100}%`, transition: 'width 1s linear' }} />
            </div>
            <button onClick={manualStop} style={{ marginTop: '8px', padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>⏹ Finish Early</button>
          </div>
        )}
        {timerMode === 'done' && (
          <div style={{ background: '#dcfce7', border: '2px solid #16a34a', borderRadius: '10px', padding: '14px 20px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>✅ Well done — review your answer below then get your feedback</p>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Your Answer</p>
            {wordCount > 0 && <span style={{ fontSize: '12px', color: wordCount >= 100 ? '#059669' : wordCount >= 60 ? '#d97706' : '#ef4444', fontWeight: '600' }}>~{speakingDuration}s · {wordCount} words {wordCount >= 100 ? '✓ Good length' : wordCount >= 60 ? '— Try to say more' : '— Too short'}</span>}
          </div>
          {timerMode === 'idle' && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <button onClick={isRecording ? stopRecording : startRecording} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: isRecording ? '#ef4444' : 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>{isRecording ? '⏹ Stop Recording' : '🎤 Speak Answer'}</button>
              <button onClick={startExamMode} style={{ padding: '10px 20px', borderRadius: '8px', border: '2px solid #f59e0b', background: 'white', color: '#d97706', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>⏱️ Exam Mode</button>
              {isRecording && <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600', alignSelf: 'center' }}>● Recording...</span>}
            </div>
          )}
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Your answer will appear here after speaking, or type directly. Aim for at least 100 words." rows={8} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', color: '#1a1a2e' }} />
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>You can edit the text above before getting feedback.</p>
        </div>

        {answer.trim() && !feedback && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>Self-check — did you cover all points?</p>
            {CUE_CARD.bullets.map((b, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', padding: '4px 0' }}><span style={{ fontSize: '16px' }}>☐</span> {b}</div>)}
          </div>
        )}

        {!feedback && (
          <button onClick={getFeedback} disabled={loadingFeedback || !answer.trim()} style={{ width: '100%', padding: '14px', background: loadingFeedback || !answer.trim() ? '#94a3b8' : 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: loadingFeedback || !answer.trim() ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
            {loadingFeedback ? '⏳ Analysing your answer...' : '🤖 Get AI Feedback & Band Score'}
          </button>
        )}

        {feedback && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
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
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>✅ What went well</p>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7 }}>{feedback.whatWentWell}</p>
            </div>
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#d97706', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>📈 How to improve</p>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7 }}>{feedback.improvements}</p>
            </div>
            {feedback.vocabularyUpgrades?.length > 0 && (
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>💬 Vocabulary Upgrades</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {feedback.vocabularyUpgrades.map((v, i) => (
                    <div key={i} style={{ background: '#faf5ff', borderRadius: '8px', padding: '12px 14px', border: '1px solid #e9d5ff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{v.original}</span>
                        <span style={{ color: '#94a3b8' }}>→</span>
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{v.upgrade}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#6d28d9', margin: 0, fontStyle: 'italic' }}>e.g. "{v.example}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px 18px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>📝 Model Answers — See the Difference</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <button onClick={() => setModelBandView('6')} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', background: modelBandView === '6' ? '#d97706' : '#e2e8f0', color: modelBandView === '6' ? 'white' : '#555' }}>Band 6 Answer</button>
                <button onClick={() => setModelBandView('7')} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', background: modelBandView === '7' ? '#059669' : '#e2e8f0', color: modelBandView === '7' ? 'white' : '#555' }}>Band 7–8 Answer</button>
              </div>
              {modelBandView === '6' && <div><p style={{ fontSize: '11px', color: '#854d0e', margin: '0 0 8px', fontWeight: '600' }}>Simple vocabulary, basic structure, limited development — but correct and covers the points.</p><p style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{feedback.modelAnswerBand6}"</p></div>}
              {modelBandView === '7' && <div><p style={{ fontSize: '11px', color: '#166534', margin: '0 0 8px', fontWeight: '600' }}>Wider vocabulary, varied grammar, well-developed with feelings and specific details.</p><p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{feedback.modelAnswerBand7}"</p></div>}
            </div>
            {feedback.roundingOffResponse && (
              <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '16px 18px', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>❓ Examiner Rounding-Off Question</p>
                <p style={{ fontSize: '14px', color: '#1e40af', margin: '0 0 10px', fontWeight: '600' }}>"{feedback.roundingOffResponse}"</p>
                <p style={{ fontSize: '12px', color: '#3b82f6', margin: 0 }}>Answer briefly — this leads into Part 3.</p>
              </div>
            )}
            <div style={{ background: '#fefce8', borderRadius: '10px', padding: '16px 18px', border: '1px solid #fef08a', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>✍️ Rewrite My Answer at Band 7–8</p>
              <p style={{ fontSize: '13px', color: '#713f12', margin: '0 0 12px', lineHeight: 1.5 }}>See how your ideas could be expressed at a higher level — your content, better language.</p>
              {!rewrittenAnswer ? (
                <button onClick={getRewrite} disabled={loadingRewrite} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: loadingRewrite ? '#94a3b8' : '#ca8a04', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: loadingRewrite ? 'not-allowed' : 'pointer' }}>{loadingRewrite ? '⏳ Rewriting...' : '✍️ Rewrite My Answer'}</button>
              ) : (
                <div style={{ background: 'white', borderRadius: '8px', padding: '12px 14px', border: '1px solid #fef08a' }}>
                  <p style={{ fontSize: '14px', color: '#713f12', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{rewrittenAnswer}"</p>
                  <button onClick={() => setRewrittenAnswer(null)} style={{ marginTop: '8px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #fef08a', background: 'white', color: '#854d0e', fontSize: '12px', cursor: 'pointer' }}>Hide</button>
                </div>
              )}
            </div>
            <button onClick={resetAll} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#555', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>🔄 Try Again</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '8px' }}>
          <Link href="/ielts/speaking/hot-climate/part-1" style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#1a1a2e', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>← Part 1</Link>
          <Link href="/ielts/speaking/hot-climate/part-3" style={{ padding: '12px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>Continue to Part 3 →</Link>
        </div>
      </div>
    </main>
  )
}
