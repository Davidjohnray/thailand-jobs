'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authHeaders } from './applyClient'
import { AI_MONTHLY_LIMIT, type ApplyLetter, type ApplyStatus } from '../src/lib/applyRules'

type Ctx = { resumePath?: string | null; name?: string; nationality?: string }

const TABS = [
  { key: 'message', label: '📧 Email' },
  { key: 'cover_letter', label: '📄 Cover letter' },
  { key: 'message_th', label: '🇹🇭 Thai' },
  { key: 'chat_message', label: '💬 LINE / WhatsApp' },
] as const

const readable = (p?: string | null) => !!p && /\.(pdf|png|jpe?g|webp|gif)$/i.test(p)

export default function AiWriter({ job, status, getContext, onLetter, standalone }: {
  job: any
  status: ApplyStatus
  getContext?: () => Ctx
  onLetter?: (l: ApplyLetter) => void
  standalone?: boolean
}) {
  const [about, setAbout] = useState(status.profile?.about || '')
  const [notes, setNotes] = useState('')
  const [showAbout, setShowAbout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ msg: string; code?: string } | null>(null)
  const [letter, setLetter] = useState<ApplyLetter | null>(null)
  const [tab, setTab] = useState<string>(standalone ? 'chat_message' : 'message')
  const [rewritesLeft, setRewritesLeft] = useState<number | null>(null)
  const [remaining, setRemaining] = useState<number>(status.aiRemaining ?? 0)
  const [copied, setCopied] = useState('')

  if (!status.loggedIn) return null

  const ctx = getContext ? getContext() : {}
  const resumePath = ctx.resumePath || status.profile?.resume_path || null
  const needAbout = !readable(resumePath) && about.trim().length < 20
  const previous = (status.letters || []).filter(l => l.message)

  const generate = async () => {
    setError(null)
    if (needAbout && !showAbout) { setShowAbout(true); return }
    if (needAbout) { setError({ msg: 'Please write a few lines about your experience first (at least one sentence).' }); return }
    setLoading(true)
    try {
      const res = await fetch('/api/ai-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({ jobId: job.id, about, notes, resumePath: ctx.resumePath || null, name: ctx.name, nationality: ctx.nationality }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'need_about') setShowAbout(true)
        throw Object.assign(new Error(data.error || 'Something went wrong'), { code: data.code })
      }
      setLetter(data.letter)
      setRewritesLeft(data.rewritesLeft)
      setRemaining(data.aiRemaining)
      onLetter?.(data.letter)
    } catch (e: any) {
      setError({ msg: e.message || 'Something went wrong. Please try again.', code: e.code })
    }
    setLoading(false)
  }

  const usePrevious = (id: string) => {
    const l = previous.find(p => p.id === id)
    if (!l) return
    setLetter(l)
    onLetter?.(l)
  }

  const copy = async (key: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 2000) } catch {}
  }

  const usage = status.isPro
    ? `${remaining} of ${AI_MONTHLY_LIMIT} AI applications left this month`
    : remaining > 0 ? '1 free AI application to try' : 'Free AI application used'

  const box: any = standalone
    ? { background: '#1a1a2e', borderRadius: '12px', padding: '24px', marginBottom: '16px' }
    : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(232,93,38,0.5)', borderRadius: '10px', padding: '18px', marginBottom: '18px' }
  const field: any = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', background: 'white', color: '#1a1a2e' }

  return (
    <div style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: standalone ? '18px' : '15px' }}>
          ✨ {standalone ? 'Let AI write your message for this job' : 'Write my application with AI'}
        </div>
        <div style={{ color: remaining > 0 ? '#ffb38a' : '#aaa', fontSize: '12px' }}>{usage}</div>
      </div>
      <p style={{ color: '#bbb', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.5', textAlign: 'left' }}>
        Reads this job and your resume, then writes an email, a cover letter, a polite Thai version and a short LINE/WhatsApp message.
        {standalone && ' This employer is contacted directly — copy the message and send it yourself.'}
      </p>

      {previous.length > 0 && (
        <select defaultValue="" onChange={e => { usePrevious(e.target.value); e.target.value = '' }} style={{ ...field, marginBottom: '10px', color: '#555' }}>
          <option value="" disabled>♻️ Use a previous letter (free)…</option>
          {previous.map(p => <option key={p.id} value={p.id}>{p.job_title} — {p.company}</option>)}
        </select>
      )}

      {(showAbout || needAbout) && (
        <div style={{ marginBottom: '10px', textAlign: 'left' }}>
          <label style={{ color: '#ddd', fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            About you {readable(resumePath) ? '(optional — the AI also reads your resume)' : '— the AI uses this'}
          </label>
          <textarea rows={3} value={about} onChange={e => setAbout(e.target.value)} style={{ ...field, resize: 'vertical' }}
            placeholder="e.g. British, BA in English, 120-hour TEFL, 3 years teaching kindergarten in Bangkok, available from November" />
        </div>
      )}
      {!showAbout && !needAbout && (
        <button type="button" onClick={() => setShowAbout(true)} style={{ background: 'none', border: 'none', color: '#ffb38a', fontSize: '12px', cursor: 'pointer', padding: 0, marginBottom: '10px' }}>
          + Add details about yourself
        </button>
      )}

      <input value={notes} onChange={e => setNotes(e.target.value)} maxLength={400} style={{ ...field, marginBottom: '10px' }}
        placeholder="Anything to mention? (optional) e.g. I can start immediately" />

      {error && (
        <div style={{ background: '#ffeaea', color: '#c62828', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '10px', fontWeight: 'bold', textAlign: 'left' }}>
          {error.msg}{' '}
          {(error.code === 'upgrade' || error.code === 'limit') && <Link href="/apply-pro" style={{ color: '#E85D26' }}>See Apply Pro →</Link>}
        </div>
      )}

      <button type="button" onClick={generate} disabled={loading}
        style={{ width: '100%', background: loading ? '#888' : 'linear-gradient(90deg, #E85D26, #f08a4b)', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: loading ? 'wait' : 'pointer' }}>
        {loading ? '✍️ Writing your application… (10–20 seconds)'
          : letter ? (rewritesLeft ? `🔄 Try again (${rewritesLeft} free ${rewritesLeft === 1 ? 'rewrite' : 'rewrites'} left)` : '🔄 Write a new version (uses 1 AI application)')
          : '✨ Write with AI'}
      </button>
      {!status.isPro && remaining <= 0 && !letter && (
        <p style={{ color: '#aaa', fontSize: '12px', margin: '8px 0 0' }}>
          Want more? <Link href="/apply-pro" style={{ color: '#ffb38a' }}>Apply Pro gives you {AI_MONTHLY_LIMIT} a month →</Link>
        </p>
      )}

      {letter && (
        <div style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {TABS.map(t => (
              <button key={t.key} type="button" onClick={() => setTab(t.key)}
                style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: tab === t.key ? '#E85D26' : 'rgba(255,255,255,0.12)', color: 'white' }}>
                {t.label}
              </button>
            ))}
          </div>
          {(() => {
            const text = String((letter as any)[tab] || '')
            return (
              <div style={{ position: 'relative' }}>
                <textarea readOnly value={text} rows={tab === 'cover_letter' ? 12 : 7} style={{ ...field, resize: 'vertical', lineHeight: '1.6', background: '#fafafa' }} />
                <button type="button" onClick={() => copy(tab, text)}
                  style={{ marginTop: '6px', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}>
                  {copied === tab ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
            )
          })()}
          {!standalone && (
            <p style={{ color: '#a5d6a7', fontSize: '12px', margin: '8px 0 0', textAlign: 'left' }}>
              ✅ The email has been put in your message below — edit it if you like. Choose below whether to include the cover letter and Thai version.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
