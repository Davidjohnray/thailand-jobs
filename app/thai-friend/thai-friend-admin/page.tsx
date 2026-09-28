'use client'
import { useState } from 'react'

type CodeRow = {
  id: string
  code: string
  duration_days: number
  status: string
  note: string | null
  redeemed_at: string | null
  created_at: string
  thai_friend_users: { email: string } | null
}

const DURATIONS = [
  { days: 2, label: '2 days (free trial)' },
  { days: 30, label: '30 days (1 month)' },
  { days: 90, label: '90 days (3 months)' },
]

export default function ThaiFriendAdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [codes, setCodes] = useState<CodeRow[]>([])
  const [loading, setLoading] = useState(false)

  const [durationDays, setDurationDays] = useState(2)
  const [count, setCount] = useState(1)
  const [note, setNote] = useState('')
  const [justCreated, setJustCreated] = useState<{ code: string; duration_days: number }[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const loadCodes = async (pw: string) => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/thai-friend/admin/codes', { headers: { 'x-admin-password': pw } })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      setAuthed(false)
      return
    }
    setCodes(data.codes)
    setAuthed(true)
  }

  const generate = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/thai-friend/admin/codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ count, durationDays, note }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Could not generate codes.')
      return
    }
    setJustCreated(data.created)
    setNote('')
    loadCodes(password)
  }

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  const messageFor = (code: string, days: number) =>
    `Here is your Thai Friend access code: ${code}\n\nIt gives you ${days} days of access, starting when you use it.\n\n1. Go to https://www.jobsinthailand.net/thai-friend\n2. Enter your email, a password and this code\n3. Pick a friend and start talking!\n\nAlready have an account? Log in, then go to https://www.jobsinthailand.net/thai-friend/subscribe to add this code.`

  if (!authed) {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#1B2B25', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '340px', color: '#F5EFE1' }}>
          <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>Thai Friend Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadCodes(password)}
            placeholder="Admin password"
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid rgba(245,239,225,0.2)', background: 'rgba(0,0,0,0.25)', color: '#F5EFE1', marginBottom: '12px' }}
          />
          {error && <p style={{ color: '#e8a3a3', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
          <button onClick={() => loadCodes(password)} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#D4A24C', color: '#14201C', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Checking...' : 'Log in'}
          </button>
        </div>
      </main>
    )
  }

  const unused = codes.filter((c) => c.status === 'unused').length

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#14201C', minHeight: '100vh', padding: '32px 20px', color: '#F5EFE1' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>Thai Friend — Access Codes</h1>
        <p style={{ color: 'rgba(245,239,225,0.6)', fontSize: '13px', marginBottom: '24px' }}>
          {codes.length} codes created · {unused} unused · {codes.length - unused} redeemed
        </p>

        {/* GENERATE */}
        <div style={{ background: '#1B2B25', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
          <p style={{ fontWeight: 700, marginBottom: '14px' }}>Generate new codes</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <label style={{ fontSize: '12px' }}>
              Access length
              <select value={durationDays} onChange={(e) => setDurationDays(parseInt(e.target.value))} style={{ display: 'block', marginTop: '4px', padding: '10px', borderRadius: '8px' }}>
                {DURATIONS.map((d) => <option key={d.days} value={d.days}>{d.label}</option>)}
              </select>
            </label>
            <label style={{ fontSize: '12px' }}>
              How many
              <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} style={{ display: 'block', marginTop: '4px', padding: '10px', borderRadius: '8px', width: '80px' }} />
            </label>
            <label style={{ fontSize: '12px', flex: 1, minWidth: '180px' }}>
              Note (who it's for, how they paid)
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Sarah — PromptPay ฿300" style={{ display: 'block', marginTop: '4px', padding: '10px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }} />
            </label>
            <button onClick={generate} disabled={loading} style={{ padding: '11px 22px', borderRadius: '8px', border: 'none', background: '#D4A24C', color: '#14201C', fontWeight: 700, cursor: 'pointer' }}>
              {loading ? 'Working...' : 'Generate'}
            </button>
          </div>
          {error && <p style={{ color: '#e8a3a3', fontSize: '13px', marginTop: '10px' }}>{error}</p>}

          {justCreated.length > 0 && (
            <div style={{ marginTop: '18px', borderTop: '1px solid rgba(245,239,225,0.12)', paddingTop: '14px' }}>
              <p style={{ fontSize: '12px', color: '#D4A24C', marginBottom: '10px' }}>Just created — copy the message and send it to the student:</p>
              {justCreated.map((c) => (
                <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <code style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '15px', letterSpacing: '1px' }}>{c.code}</code>
                  <button onClick={() => copyText(c.code, `code-${c.code}`)} style={smallBtn}>{copied === `code-${c.code}` ? 'Copied ✓' : 'Copy code'}</button>
                  <button onClick={() => copyText(messageFor(c.code, c.duration_days), `msg-${c.code}`)} style={smallBtn}>{copied === `msg-${c.code}` ? 'Copied ✓' : 'Copy message to send'}</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LIST */}
        <div style={{ background: '#1B2B25', borderRadius: '14px', padding: '20px', overflowX: 'auto' }}>
          <p style={{ fontWeight: 700, marginBottom: '14px' }}>All codes</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'rgba(245,239,225,0.55)' }}>
                <th style={th}>Code</th><th style={th}>Length</th><th style={th}>Status</th><th style={th}>Used by</th><th style={th}>Note</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} style={{ borderTop: '1px solid rgba(245,239,225,0.08)' }}>
                  <td style={td}><code>{c.code}</code></td>
                  <td style={td}>{c.duration_days}d</td>
                  <td style={{ ...td, color: c.status === 'unused' ? '#7fd6a3' : 'rgba(245,239,225,0.5)' }}>{c.status}</td>
                  <td style={td}>{c.thai_friend_users?.email || '—'}</td>
                  <td style={td}>{c.note || ''}</td>
                </tr>
              ))}
              {codes.length === 0 && <tr><td style={td} colSpan={5}>No codes yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

const smallBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(245,239,225,0.25)', background: 'transparent', color: '#F5EFE1', cursor: 'pointer', fontSize: '12px' }
const th: React.CSSProperties = { padding: '8px 10px', fontWeight: 600 }
const td: React.CSSProperties = { padding: '9px 10px' }
