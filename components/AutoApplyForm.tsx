'use client'
import { useState } from 'react'
import { supabase } from '../src/lib/supabase'

const BUCKET = 'job-applications'
const MAX_MB = { resume: 10, photo: 10, video: 50 }

const inputStyle: any = {
  width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd',
  fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#1a1a2e',
}
const labelStyle: any = { display: 'block', fontWeight: 'bold', fontSize: '13px', color: '#ddd', marginBottom: '6px', textAlign: 'left' }

function FilePick({ label, accept, file, onChange, required, hint }: any) {
  return (
    <div>
      <label style={labelStyle}>{label}{required ? ' *' : ' (optional)'}</label>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px',
        border: file ? '2px solid #4caf50' : '2px dashed rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)',
        cursor: 'pointer', color: file ? '#a5d6a7' : '#ccc', fontSize: '14px', textAlign: 'left',
      }}>
        <span style={{ fontSize: '20px' }}>{file ? '✅' : '📎'}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file ? file.name : hint}</span>
        <input type="file" accept={accept} style={{ display: 'none' }} onChange={e => onChange(e.target.files?.[0] || null)} />
      </label>
    </div>
  )
}

export default function AutoApplyForm({ job }: { job: any }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState('')
  const [message, setMessage] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [doneRef, setDoneRef] = useState('')

  const tooBig = (f: File | null, mb: number) => !!f && f.size > mb * 1024 * 1024

  const upload = async (folder: string, kind: string, file: File) => {
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
    const path = `${folder}/${kind}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined, upsert: false })
    if (error) throw new Error(`Could not upload your ${kind}: ${error.message}`)
    return path
  }

  const submit = async (e: any) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) return setError('Please enter your name and email.')
    if (!resume) return setError('Please attach your resume.')
    if (!photo) return setError('Please attach a photo of yourself.')
    if (tooBig(resume, MAX_MB.resume)) return setError(`Your resume must be under ${MAX_MB.resume} MB.`)
    if (tooBig(photo, MAX_MB.photo)) return setError(`Your photo must be under ${MAX_MB.photo} MB.`)
    if (tooBig(video, MAX_MB.video)) return setError(`Your video must be under ${MAX_MB.video} MB. Try a shorter clip.`)
    if (!consent) return setError('Please tick the box to agree to your details being sent to the employer.')

    setSending(true)
    try {
      const folder = `${job.id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      setStatus('Uploading resume...')
      const resumePath = await upload(folder, 'resume', resume)
      setStatus('Uploading photo...')
      const photoPath = await upload(folder, 'photo', photo)
      let videoPath: string | null = null
      if (video) {
        setStatus('Uploading video... this can take a minute')
        videoPath = await upload(folder, 'video', video)
      }
      setStatus('Sending application...')
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, name, email, phone, nationality, message, resumePath, photoPath, videoPath, website }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setDoneRef(data.ref)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    }
    setStatus('')
    setSending(false)
  }

  if (doneRef) return (
    <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '40px 32px', textAlign: 'center', marginBottom: '16px', border: '2px solid #4caf50' }}>
      <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px' }}>Application sent!</h2>
      <p style={{ color: '#ccc', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' }}>
        Your application for <strong style={{ color: 'white' }}>{job.title}</strong> has been sent to {job.company}.
        If you're shortlisted they will contact you directly by email{phone ? ' or phone' : ''}.
      </p>
      <div style={{ background: 'rgba(232,93,38,0.2)', borderRadius: '8px', padding: '10px 20px', display: 'inline-block', color: '#E85D26', fontWeight: 'bold', fontSize: '16px' }}>
        Your reference: {doneRef}
      </div>
    </div>
  )

  return (
    <form onSubmit={submit} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '32px', marginBottom: '16px' }}>
      <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px', textAlign: 'center' }}>Apply for this position</h2>
      <p style={{ color: '#ccc', fontSize: '14px', margin: '0 0 24px', textAlign: 'center', lineHeight: '1.6' }}>
        Your application goes straight to {job.company} through Jobs in Thailand.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
        <div><label style={labelStyle}>Full name *</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label style={labelStyle}>Email *</label><input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><label style={labelStyle}>Phone / WhatsApp</label><input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} /></div>
        <div><label style={labelStyle}>Nationality</label><input style={inputStyle} value={nationality} onChange={e => setNationality(e.target.value)} /></div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Short message to the employer</label>
        <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={message} onChange={e => setMessage(e.target.value)}
          placeholder="A few lines about your experience and availability" />
      </div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
        <FilePick label="Resume / CV" required accept=".pdf,.doc,.docx,image/*" file={resume} onChange={setResume} hint={`PDF or Word, max ${MAX_MB.resume} MB`} />
        <FilePick label="Photo" required accept="image/*" file={photo} onChange={setPhoto} hint="A clear, professional photo" />
        <FilePick label="Video introduction" accept="video/*" file={video} onChange={setVideo} hint={`Short video, max ${MAX_MB.video} MB`} />
      </div>

      {/* honeypot — hidden from people */}
      <input value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }} aria-hidden="true" />

      <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#ccc', fontSize: '13px', marginBottom: '18px', textAlign: 'left', cursor: 'pointer' }}>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: '3px' }} />
        <span>I agree to my details, resume, photo and video being sent to {job.company} for this job.</span>
      </label>

      {error && <div style={{ background: '#ffeaea', color: '#c62828', borderRadius: '8px', padding: '12px', fontSize: '14px', marginBottom: '14px', fontWeight: 'bold' }}>{error}</div>}

      <button type="submit" disabled={sending}
        style={{ width: '100%', background: sending ? '#888' : '#E85D26', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '17px', cursor: sending ? 'not-allowed' : 'pointer' }}>
        {sending ? (status || 'Sending...') : 'Send Application →'}
      </button>
    </form>
  )
}
