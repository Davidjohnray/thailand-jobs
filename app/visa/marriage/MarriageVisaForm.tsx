'use client'
import { useState, useEffect, type CSSProperties } from 'react'
import { supabase } from '../../../src/lib/supabase'

const NAVY = '#1a1a2e'
const ORANGE = '#E85D26'

const inputStyle: CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '8px',
  border: '1px solid #ddd', background: 'white', color: NAVY, fontSize: '15px',
}
const labelStyle: CSSProperties = { display: 'block', color: '#444', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
      <option value="">Choose…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export default function MarriageVisaForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [lineId, setLineId] = useState('')
  const [preferredContact, setPreferredContact] = useState('')
  const [nationality, setNationality] = useState('')
  const [currentVisa, setCurrentVisa] = useState('')
  const [inThailand, setInThailand] = useState('')
  const [marriageStatus, setMarriageStatus] = useState('')
  const [province, setProvince] = useState('')
  const [isTeacher, setIsTeacher] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [ref, setRef] = useState<string | null>(null)

  // Count page views on the live-stats page (enquiries are counted as "clicks")
  useEffect(() => {
    supabase.rpc('increment_daily_stat', { p_scope: 'visa-marriage', p_metric: 'views' }).then(() => {}, () => {})
  }, [])

  const submit = async () => {
    setError('')
    if (!name.trim()) return setError('Enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email address.')
    if (!consent) return setError('Tick the consent box so we can contact you about your visa.')

    setSubmitting(true)
    try {
      const res = await fetch('/api/visa-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, whatsapp, lineId, preferredContact, nationality, currentVisa,
          inThailand, marriageStatus, province, isTeacher, message, consent, website,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Your details didn\'t send. Please try again.')
      setRef(data.ref)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (ref) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '44px', marginBottom: '8px' }}>✅</div>
        <h3 style={{ color: NAVY, fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px' }}>Thanks, we have your details</h3>
        <p style={{ color: '#555', fontSize: '15px', margin: '0 0 4px' }}>Your reference is <strong>{ref}</strong>.</p>
        <p style={{ color: '#555', fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
          We'll be in touch about your marriage visa{preferredContact ? ` by ${preferredContact}` : ''}.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div><label style={labelStyle}>Full name *</label><input value={name} onChange={e => setName(e.target.value)} style={inputStyle} autoComplete="name" /></div>
        <div><label style={labelStyle}>Email *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} autoComplete="email" /></div>
        <div><label style={labelStyle}>WhatsApp number</label><input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={inputStyle} autoComplete="tel" /></div>
        <div><label style={labelStyle}>LINE ID</label><input value={lineId} onChange={e => setLineId(e.target.value)} style={inputStyle} /></div>
        <div><label style={labelStyle}>Best way to contact you</label><Select value={preferredContact} onChange={setPreferredContact} options={['Email', 'WhatsApp', 'LINE']} /></div>
        <div><label style={labelStyle}>Nationality</label><input value={nationality} onChange={e => setNationality(e.target.value)} style={inputStyle} /></div>
        <div><label style={labelStyle}>Current visa</label><Select value={currentVisa} onChange={setCurrentVisa} options={['Non-B (work)', 'Non-O', 'Tourist / visa exempt', 'ED', 'DTV', 'Retirement', 'Other / not sure']} /></div>
        <div><label style={labelStyle}>Are you in Thailand now?</label><Select value={inThailand} onChange={setInThailand} options={['Yes', 'No']} /></div>
        <div><label style={labelStyle}>Marriage</label><Select value={marriageStatus} onChange={setMarriageStatus} options={['Registered in Thailand', 'Registered abroad', 'Planning to marry']} /></div>
        <div><label style={labelStyle}>Province you live in (or will)</label><input value={province} onChange={e => setProvince(e.target.value)} style={inputStyle} placeholder="e.g. Bangkok, Ayutthaya" /></div>
        <div><label style={labelStyle}>Do you work as a teacher?</label><Select value={isTeacher} onChange={setIsTeacher} options={['Yes', 'Looking for teaching work', 'No']} /></div>
      </div>

      <div>
        <label style={labelStyle}>Anything else we should know?</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="e.g. my Non-B ends in March when my contract finishes" />
      </div>

      {/* Honeypot — hidden from people, bots fill it in */}
      <input value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }} aria-hidden="true" />

      <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#555', fontSize: '13px', lineHeight: 1.5, cursor: 'pointer' }}>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: '3px' }} />
        I agree to Jobs in Thailand storing my details and sharing them with our visa partner so they can contact me about a marriage visa.
      </label>

      {error && (
        <div style={{ background: '#fff3ed', border: `1px solid ${ORANGE}`, color: '#a2401a', borderRadius: '8px', padding: '10px 14px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <button onClick={submit} disabled={submitting}
        style={{ background: ORANGE, color: 'white', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
        {submitting ? 'Sending…' : 'Get help with my marriage visa'}
      </button>
    </div>
  )
}
