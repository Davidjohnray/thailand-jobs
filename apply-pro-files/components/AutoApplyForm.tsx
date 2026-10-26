'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../src/lib/supabase'
import { authHeaders } from './applyClient'
import AiWriter from './AiWriter'
import { APPLY_BUCKET, normaliseVideoLink, isDriveLink, type ApplyLetter, type ApplyStatus } from '../src/lib/applyRules'

const MAX_MB = 10

const inputStyle: any = {
  width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd',
  fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#1a1a2e',
}
const labelStyle: any = { display: 'block', fontWeight: 'bold', fontSize: '13px', color: '#ddd', marginBottom: '6px', textAlign: 'left' }
const tickStyle: any = { display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#ccc', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }

function FilePick({ label, accept, fileName, uploading, saved, onPick, hint }: any) {
  const has = !!fileName
  return (
    <div>
      <label style={labelStyle}>{label} *</label>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px',
        border: has ? '2px solid #4caf50' : '2px dashed rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)',
        cursor: uploading ? 'wait' : 'pointer', color: has ? '#a5d6a7' : '#ccc', fontSize: '14px', textAlign: 'left',
      }}>
        <span style={{ fontSize: '20px' }}>{uploading ? '⏳' : has ? '✅' : '📎'}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {uploading ? 'Uploading…' : has ? `${fileName}${saved ? ' (saved)' : ''}` : hint}
        </span>
        {has && !uploading && <span style={{ color: '#ffb38a', fontSize: '12px', flexShrink: 0 }}>Change</span>}
        <input type="file" accept={accept} style={{ display: 'none' }} disabled={uploading}
          onChange={e => { onPick(e.target.files?.[0] || null); e.target.value = '' }} />
      </label>
    </div>
  )
}

export default function AutoApplyForm({ job, mode, status, onFallback }: {
  job: any
  mode: 'partner' | 'pro' | 'free_try'
  status: ApplyStatus | null
  onFallback?: (message: string) => void
}) {
  const loggedIn = !!status?.loggedIn
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState('')
  const [message, setMessage] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [messageTh, setMessageTh] = useState('')
  const [includeCover, setIncludeCover] = useState(true)
  const [includeTh, setIncludeTh] = useState(true)
  const [videoLink, setVideoLink] = useState('')
  const [resume, setResume] = useState<{ path: string; name: string; saved?: boolean } | null>(null)
  const [photo, setPhoto] = useState<{ path: string; name: string; url?: string | null; saved?: boolean } | null>(null)
  const [uploading, setUploading] = useState<{ resume?: boolean; photo?: boolean }>({})
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [error, setError] = useState<{ msg: string; code?: string } | null>(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<{ ref: string; mode: string } | null>(null)
  const [prefilled, setPrefilled] = useState(false)

  // Fill in saved details once we know who this is
  useEffect(() => {
    if (!status?.loggedIn || prefilled) return
    const p = status.profile
    if (status.email) setEmail(v => v || status.email || '')
    if (p) {
      setName(v => v || p.full_name)
      setPhone(v => v || p.phone)
      setNationality(v => v || p.nationality)
      setVideoLink(v => v || p.video_link)
      if (p.resume_path) setResume(r => r || { path: p.resume_path!, name: p.resume_name || 'resume', saved: true })
      if (p.photo_path) setPhoto(r => r || { path: p.photo_path!, name: p.photo_name || 'photo', url: p.photo_url, saved: true })
    }
    setPrefilled(true)
  }, [status, prefilled])

  // Files upload as soon as they're chosen, straight into private storage
  const pick = async (kind: 'resume' | 'photo', file: File | null) => {
    if (!file) return
    setError(null)
    if (file.size > MAX_MB * 1024 * 1024) { setError({ msg: `Your ${kind} must be under ${MAX_MB} MB.` }); return }
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    setUploading(u => ({ ...u, [kind]: true }))
    try {
      const res = await fetch('/api/apply/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({ jobId: job.id, kind, ext }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      const { error: upErr } = await supabase.storage.from(APPLY_BUCKET).uploadToSignedUrl(data.path, data.token, file, { contentType: file.type || undefined })
      if (upErr) throw new Error(`Could not upload your ${kind}: ${upErr.message}`)
      if (kind === 'resume') setResume({ path: data.path, name: file.name })
      else setPhoto({ path: data.path, name: file.name, url: URL.createObjectURL(file) })
    } catch (e: any) {
      setError({ msg: e.message || `Could not upload your ${kind}. Please try again.` })
    }
    setUploading(u => ({ ...u, [kind]: false }))
  }

  const applyLetter = (l: ApplyLetter) => {
    setMessage(l.message || '')
    setCoverLetter(l.cover_letter || '')
    setMessageTh(l.message_th || '')
  }

  const submit = async (e: any) => {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim()) return setError({ msg: 'Please enter your name and email.' })
    if (!resume) return setError({ msg: 'Please attach your resume.' })
    if (!photo) return setError({ msg: 'Please attach a photo of yourself.' })
    if (uploading.resume || uploading.photo) return setError({ msg: 'Please wait for your files to finish uploading.' })
    const v = normaliseVideoLink(videoLink)
    if (!v.ok) return setError({ msg: v.error || 'Please check your video link.' })
    if (!consent) return setError({ msg: 'Please tick the box to agree to your details being sent to the employer.' })

    setSending(true)
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({
          jobId: job.id, name, email, phone, nationality, message,
          coverLetter: includeCover ? coverLetter : '',
          messageTh: includeTh ? messageTh : '',
          videoLink: v.url, resumePath: resume.path, photoPath: photo.path, website,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'daily_limit' && onFallback) { onFallback(data.error); return }
        throw Object.assign(new Error(data.error || 'Something went wrong. Please try again.'), { code: data.code })
      }
      setDone({ ref: data.ref, mode: data.mode || mode })
    } catch (err: any) {
      setError({ msg: err.message || 'Something went wrong. Please try again.', code: err.code })
    }
    setSending(false)
  }

  if (done) return (
    <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '40px 32px', textAlign: 'center', marginBottom: '16px', border: '2px solid #4caf50' }}>
      <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px' }}>Application sent!</h2>
      <p style={{ color: '#ccc', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' }}>
        Your application for <strong style={{ color: 'white' }}>{job.title}</strong> has been sent to {job.company}.
        If you're shortlisted they will contact you directly by email{phone ? ' or phone' : ''}.
      </p>
      <div style={{ background: 'rgba(232,93,38,0.2)', borderRadius: '8px', padding: '10px 20px', display: 'inline-block', color: '#E85D26', fontWeight: 'bold', fontSize: '16px', marginBottom: '18px' }}>
        Your reference: {done.ref}
      </div>
      {loggedIn && (
        <div>
          <Link href="/account/applications" style={{ background: '#E85D26', color: 'white', padding: '12px 26px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', display: 'inline-block' }}>
            👀 Track it in My Applications →
          </Link>
          <p style={{ color: '#999', fontSize: '12px', margin: '12px 0 0' }}>We'll show you when the employer views your application.</p>
        </div>
      )}
      {done.mode === 'free_try' && (
        <div style={{ marginTop: '18px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px', color: '#ddd', fontSize: '14px' }}>
          That was your free try. <Link href="/apply-pro" style={{ color: '#ffb38a', fontWeight: 'bold' }}>Get Apply Pro</Link> to keep applying in one click — with 20 AI applications a month.
        </div>
      )}
    </div>
  )

  const showAi = loggedIn && status?.enabled
  const hasLetterExtras = !!(coverLetter || messageTh)

  return (
    <form onSubmit={submit} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '32px', marginBottom: '16px' }}>
      <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px', textAlign: 'center' }}>Apply for this position</h2>
      <p style={{ color: '#ccc', fontSize: '14px', margin: '0 0 8px', textAlign: 'center', lineHeight: '1.6' }}>
        Your application goes straight to {job.company} through Jobs in Thailand.
      </p>
      {mode === 'free_try' && (
        <p style={{ color: '#ffb38a', fontSize: '13px', margin: '0 0 16px', textAlign: 'center' }}>🎁 Free try — your first one-click application is on us.</p>
      )}
      {mode === 'pro' && (
        <p style={{ color: '#ffb38a', fontSize: '13px', margin: '0 0 16px', textAlign: 'center' }}>⚡ Apply Pro — we'll show you when the employer views it.</p>
      )}
      {mode === 'partner' && !loggedIn && (
        <p style={{ color: '#999', fontSize: '12px', margin: '0 0 16px', textAlign: 'center' }}>
          <Link href="/account/login" style={{ color: '#ffb38a' }}>Log in</Link> to save your details, use the AI writer and track your application.
        </p>
      )}
      <div style={{ height: '8px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
        <div><label style={labelStyle}>Full name *</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label style={labelStyle}>Email *</label><input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><label style={labelStyle}>Phone / WhatsApp</label><input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} /></div>
        <div><label style={labelStyle}>Nationality</label><input style={inputStyle} value={nationality} onChange={e => setNationality(e.target.value)} /></div>
      </div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
        <FilePick label="Resume / CV" accept=".pdf,.doc,.docx,image/*" fileName={resume?.name} saved={resume?.saved} uploading={uploading.resume}
          onPick={(f: File | null) => pick('resume', f)} hint={`PDF is best (the AI can read it) · max ${MAX_MB} MB`} />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          {photo?.url && <img src={photo.url} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #4caf50', flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <FilePick label="Photo" accept="image/*" fileName={photo?.name} saved={photo?.saved} uploading={uploading.photo}
              onPick={(f: File | null) => pick('photo', f)} hint="A clear, professional photo" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Intro video link (optional)</label>
          <input style={inputStyle} value={videoLink} onChange={e => setVideoLink(e.target.value)} placeholder="YouTube or Google Drive link" />
          <p style={{ color: '#999', fontSize: '12px', margin: '6px 0 0', textAlign: 'left', lineHeight: '1.5' }}>
            {isDriveLink(videoLink)
              ? <span style={{ color: '#ffb38a' }}>⚠️ In Google Drive, set sharing to <strong>"Anyone with the link can view"</strong> or the school won't be able to watch it.</span>
              : <>Tip: upload to YouTube as <strong>Unlisted</strong> (only people with the link can see it). 1–2 minutes is perfect.</>}
          </p>
        </div>
      </div>

      {showAi && status && (
        <AiWriter job={job} status={status} onLetter={applyLetter}
          getContext={() => ({ resumePath: resume?.path || null, name, nationality })} />
      )}

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Message to the employer</label>
        <textarea rows={showAi && message ? 9 : 4} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} value={message} onChange={e => setMessage(e.target.value)}
          placeholder="A few lines about your experience and availability" />
      </div>

      {hasLetterExtras && (
        <div style={{ display: 'grid', gap: '8px', marginBottom: '18px' }}>
          {coverLetter && (
            <label style={tickStyle}>
              <input type="checkbox" checked={includeCover} onChange={e => setIncludeCover(e.target.checked)} style={{ marginTop: '3px' }} />
              <span>Include my AI cover letter (shown on my application page)</span>
            </label>
          )}
          {messageTh && (
            <label style={tickStyle}>
              <input type="checkbox" checked={includeTh} onChange={e => setIncludeTh(e.target.checked)} style={{ marginTop: '3px' }} />
              <span>Include the Thai version for the school's Thai staff 🇹🇭</span>
            </label>
          )}
        </div>
      )}

      {/* honeypot — hidden from people */}
      <input value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }} aria-hidden="true" />

      <label style={{ ...tickStyle, marginBottom: '18px' }}>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: '3px' }} />
        <span>I agree to my details, resume, photo and video link being sent to {job.company} for this job.</span>
      </label>

      {error && (
        <div style={{ background: '#ffeaea', color: '#c62828', borderRadius: '8px', padding: '12px', fontSize: '14px', marginBottom: '14px', fontWeight: 'bold' }}>
          {error.msg}{' '}
          {error.code === 'upgrade' && <Link href="/apply-pro" style={{ color: '#E85D26' }}>See Apply Pro →</Link>}
          {error.code === 'login' && <Link href="/account/login" style={{ color: '#E85D26' }}>Log in →</Link>}
        </div>
      )}

      <button type="submit" disabled={sending || !!uploading.resume || !!uploading.photo}
        style={{ width: '100%', background: sending ? '#888' : '#E85D26', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '17px', cursor: sending ? 'not-allowed' : 'pointer' }}>
        {sending ? 'Sending...' : 'Send Application →'}
      </button>
    </form>
  )
}
