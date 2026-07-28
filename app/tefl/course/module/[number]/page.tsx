'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type ContentSection = {
  id: string
  section_title: string
  content_html: string
  content_type: 'reading' | 'video' | 'activity' | 'download'
  video_url?: string
  estimated_minutes: number
}
type QuizQuestion = { id: string; question: string; option_a: string; option_b: string; option_c: string; option_d: string }
type SubmissionRecord = { text: string; submitted_at: string }

export default function TeflModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleNumber = params.number

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mod, setMod] = useState<any>(null)
  const [content, setContent] = useState<ContentSection[]>([])
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [progress, setProgress] = useState<any>(null)
  const [reflection, setReflection] = useState<any>(null)
  const [reflectionText, setReflectionText] = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)
  const [submissions, setSubmissions] = useState<Record<string, SubmissionRecord>>({})

  const [view, setView] = useState<'content' | 'reflect' | 'quiz'>('content')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [assignmentText, setAssignmentText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch(`/api/tefl/module/${moduleNumber}`)
      if (res.status === 401) {
        router.push('/tefl/course/login')
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not load module.')
        setLoading(false)
        return
      }
      setMod(data.module)
      setContent(data.content)
      setQuiz(data.quiz)
      setProgress(data.progress)
      setReflection(data.reflection)
      if (data.reflection?.response) setReflectionText(data.reflection.response)

      const subRes = await fetch(`/api/tefl/submissions/${moduleNumber}`)
      if (subRes.ok) {
        const subData = await subRes.json()
        setSubmissions(subData.submissions || {})
      }

      setLoading(false)
    }
    load()
  }, [moduleNumber, router])

  async function saveReflection() {
    setSubmitting(true)
    const res = await fetch('/api/tefl/reflection-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleNumber: Number(moduleNumber), prompt: mod.reflection_prompt, response: reflectionText }),
    })
    setSubmitting(false)
    if (res.ok) {
      setReflectionSaved(true)
      setTimeout(() => setReflectionSaved(false), 2500)
    }
  }

  async function saveSubmission(contentId: string, text: string) {
    const res = await fetch('/api/tefl/submission-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleNumber: Number(moduleNumber), contentId, text }),
    })
    if (res.ok) {
      setSubmissions((prev) => ({ ...prev, [contentId]: { text, submitted_at: new Date().toISOString() } }))
      return true
    }
    return false
  }

  async function submitQuiz() {
    if (Object.keys(answers).length < quiz.length) {
      setError('Please answer every question before submitting.')
      return
    }
    setError('')
    setSubmitting(true)
    const res = await fetch('/api/tefl/quiz-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleNumber: Number(moduleNumber), answers, assignmentText }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setError(data.error || 'Something went wrong submitting your quiz.')
      return
    }
    setResult(data)
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666' }}>Loading module…</p>
      </main>
    )
  }

  if (error && !mod) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#c0392b' }}>{error}</p>
      </main>
    )
  }

  const totalMinutes = content.reduce((sum, c) => sum + (c.estimated_minutes || 0), 0)

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <section style={{ background: '#1a1a2e', padding: '32px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/tefl/course/dashboard" style={{ color: '#E85D26', fontSize: '13px', textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
          <p style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginTop: '12px' }}>
            MODULE {mod.module_number} OF 12 · ~{Math.round(totalMinutes / 60 * 10) / 10} hours
          </p>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', marginTop: '4px' }}>{mod.title}</h1>
        </div>
      </section>

      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <TabButton active={view === 'content'} onClick={() => setView('content')} label="📖 Study Content" />
          <TabButton active={view === 'reflect'} onClick={() => setView('reflect')} label="✏️ Reflect" />
          <TabButton active={view === 'quiz'} onClick={() => setView('quiz')} label="✍️ Quiz" />
        </div>

        {view === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {content.map((section) => (
              <ContentBlock
                key={section.id}
                section={section}
                existingSubmission={submissions[section.id]}
                onSave={saveSubmission}
              />
            ))}
            <button
              onClick={() => setView('reflect')}
              style={{
                background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px',
                border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', alignSelf: 'flex-start',
              }}
            >
              Continue to Reflection →
            </button>
          </div>
        )}

        {view === 'reflect' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>
              Reflection Journal
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
              {mod.reflection_prompt}
            </p>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              rows={8}
              placeholder="Write your response here..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={saveReflection}
                disabled={submitting || !reflectionText.trim()}
                style={{
                  background: '#1a1a2e', color: 'white', padding: '12px 28px', borderRadius: '8px',
                  border: 'none', fontWeight: 'bold', fontSize: '15px',
                  cursor: submitting || !reflectionText.trim() ? 'not-allowed' : 'pointer',
                  opacity: submitting || !reflectionText.trim() ? 0.6 : 1,
                }}
              >
                {submitting ? 'Saving…' : 'Save Reflection'}
              </button>
              {reflectionSaved && <span style={{ color: '#4caf50', fontSize: '14px', fontWeight: 'bold' }}>✓ Saved</span>}
            </div>
            <button
              onClick={() => setView('quiz')}
              style={{ background: 'none', border: 'none', color: '#E85D26', fontWeight: 'bold', fontSize: '14px', marginTop: '20px', cursor: 'pointer', padding: 0 }}
            >
              Continue to Quiz →
            </button>
          </div>
        )}

        {view === 'quiz' && !result && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
              {quiz.length} questions · 70% required to pass · Unlimited retakes
            </p>

            {quiz.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <p style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>
                  {idx + 1}. {q.question}
                </p>
                {(['a', 'b', 'c', 'd'] as const).map((opt) => (
                  <label
                    key={opt}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px',
                      border: answers[q.id] === opt ? '2px solid #E85D26' : '1px solid #ddd', marginBottom: '8px', cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    />
                    <span style={{ fontSize: '14px', color: '#333' }}>{q[`option_${opt}` as 'option_a']}</span>
                  </label>
                ))}
              </div>
            ))}

            {mod.has_assignment && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Assignment</label>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
                  This module includes a written assignment. Submit it below along with your quiz.
                </p>
                <textarea
                  value={assignmentText}
                  onChange={(e) => setAssignmentText(e.target.value)}
                  rows={8}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {error && <p style={{ color: '#c0392b', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

            <button
              onClick={submitQuiz}
              disabled={submitting}
              style={{
                background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px',
                border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Submitting…' : 'Submit Quiz'}
            </button>
          </div>
        )}

        {result && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{result.passed ? '🎉' : '📚'}</div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
              {result.passed ? 'Module Passed!' : 'Not Quite — Try Again'}
            </h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
              You scored {result.correctCount} / {result.totalQuestions} ({result.scorePercent}%)
            </p>
            {result.passed ? (
              <Link
                href="/tefl/course/dashboard"
                style={{ display: 'inline-block', background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Back to Dashboard
              </Link>
            ) : (
              <button
                onClick={() => { setResult(null); setAnswers({}); setView('content') }}
                style={{ background: '#1a1a2e', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Review Content & Retry
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

function ContentBlock({
  section,
  existingSubmission,
  onSave,
}: {
  section: ContentSection
  existingSubmission?: SubmissionRecord
  onSave: (contentId: string, text: string) => Promise<boolean>
}) {
  const isActivity = section.content_type === 'activity'
  const isDownload = section.content_type === 'download'

  const badgeStyle: Record<string, { bg: string; label: string }> = {
    reading: { bg: '#eee', label: '📖 Reading' },
    activity: { bg: '#fff3e0', label: '🎯 Activity' },
    download: { bg: '#e8f5e9', label: '🖨️ Worksheet' },
    video: { bg: '#e3f2fd', label: '▶️ Video' },
  }
  const badge = badgeStyle[section.content_type] || badgeStyle.reading

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        border: isActivity ? '2px solid #E85D26' : isDownload ? '2px solid #4caf50' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ background: badge.bg, padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', color: '#555' }}>
          {badge.label}
        </span>
        <span style={{ fontSize: '12px', color: '#aaa' }}>~{section.estimated_minutes} min</span>
      </div>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '10px' }}>
        {section.section_title}
      </h2>
      <div
        style={{ fontSize: '15px', color: '#333', lineHeight: '1.7' }}
        dangerouslySetInnerHTML={{ __html: section.content_html }}
      />
      {section.content_type === 'video' && section.video_url && (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginTop: '16px', borderRadius: '10px', overflow: 'hidden' }}>
          <iframe
            src={section.video_url}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={section.section_title}
          />
        </div>
      )}
      {(isActivity || isDownload) && (
        <SubmissionBox
          contentId={section.id}
          label={isActivity ? 'Submit Your Work' : 'Submit Your Completed Worksheet'}
          existingSubmission={existingSubmission}
          onSave={onSave}
        />
      )}
    </div>
  )
}

function SubmissionBox({
  contentId,
  label,
  existingSubmission,
  onSave,
}: {
  contentId: string
  label: string
  existingSubmission?: SubmissionRecord
  onSave: (contentId: string, text: string) => Promise<boolean>
}) {
  const [text, setText] = useState(existingSubmission?.text || '')
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  async function handleSubmit() {
    if (!text.trim()) return
    setSaving(true)
    const ok = await onSave(contentId, text)
    setSaving(false)
    if (ok) {
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2500)
    }
  }

  return (
    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e' }}>{label}</span>
        {existingSubmission && (
          <span style={{ fontSize: '12px', color: '#4caf50', fontWeight: 'bold' }}>
            ✓ Submitted {new Date(existingSubmission.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Write or paste your completed work here..."
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={handleSubmit}
          disabled={saving || !text.trim()}
          style={{
            background: '#1a1a2e', color: 'white', padding: '10px 22px', borderRadius: '8px',
            border: 'none', fontWeight: 'bold', fontSize: '14px',
            cursor: saving || !text.trim() ? 'not-allowed' : 'pointer',
            opacity: saving || !text.trim() ? 0.6 : 1,
          }}
        >
          {saving ? 'Submitting…' : existingSubmission ? 'Update Submission' : 'Submit'}
        </button>
        {justSaved && <span style={{ color: '#4caf50', fontSize: '13px', fontWeight: 'bold' }}>✓ Saved</span>}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px', borderRadius: '8px', border: 'none',
        background: active ? '#1a1a2e' : '#eee', color: active ? 'white' : '#666',
        fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
