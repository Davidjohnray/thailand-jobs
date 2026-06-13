'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TOPIC = 'Festivals & Celebrations'
const THINK_TIME = 30
const SPEAK_TIME = 90

const QUESTIONS = [
  {
    id: 1,
    question: 'Why do you think festivals are important to societies?',
    tip: 'Discuss the social, cultural, and emotional functions of festivals — community bonding, preserving traditions, providing breaks from routine. Give examples.',
    example: 'I think festivals serve several important purposes. Firstly... They also provide an opportunity for...',
    targetBand: 'Band 7+ tip: Use listing and linking language — "firstly", "in addition", "another important function is"',
  },
  {
    id: 2,
    question: 'Do you think traditional festivals are becoming less popular? Why or why not?',
    tip: 'Discuss trends — modernization, busy lifestyles, younger generations\' attitudes. Consider counter-examples too.',
    example: 'To some extent, I think this is true. For example... However, at the same time...',
    targetBand: 'Band 7+ tip: Use comparison and contrast — "compared to the past", "while this is true in some areas", "this is not the case everywhere"',
  },
  {
    id: 3,
    question: 'How do you think festivals might change in the future?',
    tip: 'Discuss the role of technology, globalization, and changing lifestyles. Use future and speculative language.',
    example: 'I think it\'s quite likely that... For example, we may see more... This could lead to...',
    targetBand: 'Band 7+ tip: Use speculation — "is likely to", "could potentially", "there is a real possibility that"',
  },
  {
    id: 4,
    question: 'Some people say that festivals are too commercialized nowadays. Do you agree?',
    tip: 'Give a clear position and support it. Think about examples of commercialization (advertising, merchandise) versus the original meaning of festivals.',
    example: 'I tend to agree with this view, because... Many festivals now seem to focus on... However, it could also be argued that...',
    targetBand: 'Band 7+ tip: Show nuance — "to a large extent", "while this is true, it is also worth noting that", "this is not without its drawbacks"',
  },
]

const PART3_INTRO = {
  what: 'Part 3 lasts 4–5 minutes. The examiner asks abstract, discussion-based questions linked to your Part 2 topic. These require opinions, analysis, and the ability to discuss ideas at length.',
  howLong: 'Answers should be longer and more developed than Part 1 — aim for 4–6 sentences. Show you can discuss both sides of an issue.',
  tip: 'Do not just give your opinion — explain it, give examples, consider other viewpoints, and speculate. The examiner wants to see critical thinking in English.',
  language: 'Use phrases like "It could be argued that...", "One perspective is...", "On the other hand...", "This is largely due to...", "From my point of view..."',
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
  followUpQuestion: string
  discussionPhrase: string
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

export default function FestivalsPart3Page() {
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
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [timerMode, setTimerMode] = useState<'idle' | 'thinking' | 'speaking' | 'done'>('idle')
  const [timeLeft, setTimeLeft] = useState(THINK_TIME)
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

  useEffect(() => {
    if (timerMode === 'thinking') {
      setTimeLeft(THINK_TIME)
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

  function startExamMode() { const a = [...answers]; a[currentQ] = ''; setAnswers(a); const f = [...feedbacks]; f[currentQ] = null; setFeedbacks(f); setRewrittenAnswer(null); setTimerMode('thinking') }
  function cancelTimer() { if (timerRef.current) clearInterval(timerRef.current); if (recognitionRef.current) recognitionRef.current.stop(); setIsRecording(false); setTimerMode('idle') }
  function manualStop() { if (timerRef.current) clearInterval(timerRef.current); stopRecording(); setTimerMode('done') }
  function startRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Please use Chrome.'); return }
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = 'en-US'
    r.onresult = (e: SpeechRecognitionEvent) => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; const a = [...answers]; a[currentQ] = t; setAnswers(a) }
    r.onerror = () => setIsRecording(false); r.onend = () => setIsRecording(false)
    recognitionRef.current = r; r.start(); setIsRecording(true)
  }
  function stopRecording() { if (recognitionRef.current) recognitionRef.current.stop(); setIsRecording(false) }
  async function getFeedback() {
    const answer = answers[currentQ]; if (!answer.trim()) return
    setLoadingFeedback(true); setRewrittenAnswer(null)
    try {
      const res = await fetch('/api/ielts/speaking-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: QUESTIONS[currentQ].question, answer, topic: TOPIC, part: 3 }) })
      const parsed: Feedback = await res.json(); const f = [...feedbacks]; f[currentQ] = parsed; setFeedbacks(f)
    } catch (e) { console.error(e) }
    setLoadingFeedback(false)
  }
  async function getRewrite() {
    const answer = answers[currentQ]; if (!answer.trim()) return; setLoadingRewrite(true)
    try {
      const res = await fetch('/api/ielts/speaking-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: QUESTIONS[currentQ].question, answer, topic: TOPIC, mode: 'rewrite', part: 3 }) })
      const d = await res.json(); setRewrittenAnswer(d.rewritten || '')
    } catch (e) { console.error(e) }
    setLoadingRewrite(false)
  }
  function resetQuestion() {
    if (timerRef.current) clearInterval(timerRef.current); if (recognitionRef.current) recognitionRef.current.stop()
    setIsRecording(false); setTimerMode('idle'); setRewrittenAnswer(null)
    const f = [...feedbacks]; f[currentQ] = null; setFeedbacks(f); const a = [...answers]; a[currentQ] = ''; setAnswers(a)
  }
  function getBandColor(b: number) { if (b >= 8) return '#7c3aed'; if (b >= 7) return '#2563eb'; if (b >= 6) return '#059669'; if (b >= 5) return '#d97706'; return '#dc2626' }

  const q = QUESTIONS[currentQ]
  const feedback = feedbacks[currentQ]
  const feedbackCount = feedbacks.filter(f => f !== null).length

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
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px' }}>Part 3 — {TOPIC}</h1>
          <p style={{ opacity: 0.8, margin: 0, fontSize: '14px' }}>{QUESTIONS.length} discussion questions · Opinion & analysis · AI feedback & band score</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>About IELTS Speaking Part 3</h2>
          {[
            { label: 'What to expect', text: PART3_INTRO.what },
            { label: 'How long to answer', text: PART3_INTRO.howLong },
            { label: 'Key tip', text: PART3_INTRO.tip },
            { label: 'Useful language', text: PART3_INTRO.language },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>{item.label}</p>
              <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>
        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>🗣️ Useful Discussion Phrases</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {['It could be argued that...','From my perspective...','On the one hand... on the other...','This is largely due to...','Having said that...','To a certain extent...','It seems to me that...','One significant factor is...'].map(phrase => (
              <div key={phrase} style={{ background: 'white', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', color: '#6d28d9', border: '1px solid #e9d5ff' }}>{phrase}</div>
            ))}
          </div>
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
            <Link href="/ielts/speaking/festivals/part-1" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none' }}>Part 1</Link>
            <Link href="/ielts/speaking/festivals/part-2" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none' }}>Part 2</Link>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e3a5f', borderBottom: '2px solid #2563eb', paddingBottom: '2px' }}>Part 3</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#1e3a5f' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>👨‍🏫 Teacher Mode</button>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{feedbackCount}/{QUESTIONS.length} completed</span>
          </div>
        </div>

        {showTeacherMode && (
          <div style={{ background: '#1e3a5f', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Part 3</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 8–10 minutes per question including discussion.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Q2 (traditional festivals less popular):</strong> A topical issue — ask students whether they think younger people in Thailand celebrate festivals differently from older generations for richer, more authentic discussion.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Class activity:</strong> After AI feedback, do a class debate on Q4 — half the class argues commercialization has ruined the true meaning of festivals, the other half argues it has helped festivals survive and stay relevant.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Board work:</strong> Write the discussion phrase from feedback. Have students use it immediately in a new sentence.</p>
              <p style={{ margin: 0 }}><strong>Extension:</strong> Q3 (how festivals might change) is excellent for a Writing Task 2 opinion essay — assign as homework.</p>
            </div>
          </div>
        )}

        <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '6px', marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(90deg, #1e3a5f, #2563eb)', height: '100%', borderRadius: '4px', width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {QUESTIONS.map((_, i) => (
            <button key={i} onClick={() => { setCurrentQ(i); setRewrittenAnswer(null) }} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: i === currentQ ? '#1e3a5f' : feedbacks[i] ? '#dcfce7' : '#e2e8f0', color: i === currentQ ? 'white' : feedbacks[i] ? '#166534' : '#555' }}>
              Q{i + 1} {feedbacks[i] ? '✓' : ''}
            </button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {currentQ + 1} of {QUESTIONS.length} — Discussion</div>
            <span style={{ background: '#faf5ff', color: '#7c3aed', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', border: '1px solid #e9d5ff' }}>Part 3</span>
          </div>
          <h2 style={{ fontSize: '19px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', lineHeight: 1.4 }}>"{q.question}"</h2>
          <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '14px 16px', marginBottom: '12px', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>💡 How to answer</p>
            <p style={{ fontSize: '13px', color: '#1e40af', margin: '0 0 6px', lineHeight: 1.5 }}>{q.tip}</p>
            <p style={{ fontSize: '12px', color: '#3b82f6', margin: 0, fontStyle: 'italic' }}>e.g. {q.example}</p>
          </div>
          <div style={{ background: '#faf5ff', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', border: '1px solid #e9d5ff' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>🎯 {q.targetBand}</p>
          </div>

          {timerMode === 'thinking' && (
            <div style={{ background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ color: '#92400e', fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px' }}>⏱️ Thinking Time</p>
              <p style={{ color: '#92400e', fontSize: '13px', margin: '0 0 8px' }}>Plan your answer — recording starts automatically</p>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#d97706' }}>{timeLeft}s</div>
              <button onClick={cancelTimer} style={{ marginTop: '8px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #d97706', background: 'white', color: '#d97706', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
            </div>
          )}
          {timerMode === 'speaking' && (
            <div style={{ background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px' }}>🔴 Speaking Now</p>
              <p style={{ color: '#991b1b', fontSize: '13px', margin: '0 0 8px' }}>Give your opinion and discuss both sides</p>
              <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#ef4444' }}>{timeLeft}s</div>
              <div style={{ background: '#fecaca', borderRadius: '6px', height: '6px', margin: '10px auto', maxWidth: '260px' }}>
                <div style={{ background: '#ef4444', height: '100%', borderRadius: '6px', width: `${(timeLeft / SPEAK_TIME) * 100}%`, transition: 'width 1s linear' }} />
              </div>
              <button onClick={manualStop} style={{ marginTop: '8px', padding: '6px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>⏹ Finish Early</button>
            </div>
          )}
          {timerMode === 'done' && (
            <div style={{ background: '#dcfce7', border: '2px solid #16a34a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>✅ Done — review your answer then get feedback</p>
            </div>
          )}

          {timerMode === 'idle' && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <button onClick={isRecording ? stopRecording : startRecording} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: isRecording ? '#ef4444' : 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                {isRecording ? '⏹ Stop Recording' : '🎤 Speak Answer'}
              </button>
              <button onClick={startExamMode} style={{ padding: '10px 20px', borderRadius: '8px', border: '2px solid #f59e0b', background: 'white', color: '#d97706', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>⏱️ Exam Mode</button>
              {isRecording && <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600', alignSelf: 'center' }}>● Recording...</span>}
            </div>
          )}

          <textarea value={answers[currentQ]} onChange={e => { const a = [...answers]; a[currentQ] = e.target.value; setAnswers(a) }} placeholder="Speak your answer or type here. Aim for 4–6 sentences — give an opinion, develop it, and consider other viewpoints." rows={6} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', color: '#1a1a2e' }} />
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>Edit the text above if needed before getting feedback.</p>
        </div>

        {!feedback && (
          <button onClick={getFeedback} disabled={loadingFeedback || !answers[currentQ].trim()} style={{ width: '100%', padding: '14px', background: loadingFeedback || !answers[currentQ].trim() ? '#94a3b8' : 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: loadingFeedback || !answers[currentQ].trim() ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
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
            {feedback.discussionPhrase && (
              <div style={{ background: '#faf5ff', borderRadius: '10px', padding: '16px 18px', border: '1px solid #e9d5ff', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>🗣️ Discussion Phrase to Learn</p>
                <p style={{ fontSize: '15px', color: '#6d28d9', margin: '0 0 8px', fontWeight: '700', fontStyle: 'italic' }}>"{feedback.discussionPhrase}"</p>
                <p style={{ fontSize: '12px', color: '#7c3aed', margin: 0 }}>Practice using this phrase in your next answer to sound more natural and academic.</p>
              </div>
            )}
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
              {modelBandView === '6' && <div><p style={{ fontSize: '11px', color: '#854d0e', margin: '0 0 8px', fontWeight: '600' }}>Basic opinion, simple vocabulary, limited discussion — on topic but not well developed.</p><p style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{feedback.modelAnswerBand6}"</p></div>}
              {modelBandView === '7' && <div><p style={{ fontSize: '11px', color: '#166534', margin: '0 0 8px', fontWeight: '600' }}>Clear opinion, well developed, considers other views, uses academic vocabulary naturally.</p><p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{feedback.modelAnswerBand7}"</p></div>}
            </div>
            {feedback.followUpQuestion && (
              <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '16px 18px', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>❓ Examiner Follow-Up Question</p>
                <p style={{ fontSize: '14px', color: '#1e40af', margin: '0 0 8px', fontWeight: '600' }}>"{feedback.followUpQuestion}"</p>
                <p style={{ fontSize: '12px', color: '#3b82f6', margin: 0 }}>Practice answering this to extend your Part 3 skills.</p>
              </div>
            )}
            <div style={{ background: '#fefce8', borderRadius: '10px', padding: '16px 18px', border: '1px solid #fef08a', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>✍️ Rewrite My Answer at Band 7–8</p>
              <p style={{ fontSize: '13px', color: '#713f12', margin: '0 0 12px', lineHeight: 1.5 }}>See how your ideas could be expressed more academically — your opinion, better language.</p>
              {!rewrittenAnswer ? (
                <button onClick={getRewrite} disabled={loadingRewrite} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: loadingRewrite ? '#94a3b8' : '#ca8a04', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: loadingRewrite ? 'not-allowed' : 'pointer' }}>{loadingRewrite ? '⏳ Rewriting...' : '✍️ Rewrite My Answer'}</button>
              ) : (
                <div style={{ background: 'white', borderRadius: '8px', padding: '12px 14px', border: '1px solid #fef08a' }}>
                  <p style={{ fontSize: '14px', color: '#713f12', margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>"{rewrittenAnswer}"</p>
                  <button onClick={() => setRewrittenAnswer(null)} style={{ marginTop: '8px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #fef08a', background: 'white', color: '#854d0e', fontSize: '12px', cursor: 'pointer' }}>Hide</button>
                </div>
              )}
            </div>
            <button onClick={resetQuestion} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#555', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>🔄 Try Again</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '8px' }}>
          <button onClick={() => { setCurrentQ(Math.max(0, currentQ - 1)); setRewrittenAnswer(null) }} disabled={currentQ === 0} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: currentQ === 0 ? '#c4c4c4' : '#1a1a2e', fontSize: '14px', fontWeight: '600', cursor: currentQ === 0 ? 'not-allowed' : 'pointer' }}>← Previous</button>
          {currentQ < QUESTIONS.length - 1 ? (
            <button onClick={() => { setCurrentQ(currentQ + 1); setRewrittenAnswer(null) }} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Next Question →</button>
          ) : (
            <Link href="/ielts/speaking" style={{ padding: '12px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>✅ Topic Complete — Back to Topics</Link>
          )}
        </div>
      </div>
    </main>
  )
}
