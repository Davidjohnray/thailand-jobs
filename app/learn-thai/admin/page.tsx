'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const ADMIN_PASSWORD = 'thailand2024'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `THAI-${seg(4)}-${seg(4)}`
}

export default function LearnThaiAdmin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrong, setWrong] = useState(false)
  const [codes, setCodes] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [generating, setGenerating] = useState(false)
  const [lastCode, setLastCode] = useState('')
  const [copied, setCopied] = useState(false)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' }

  const fetchCodes = async () => {
    const res = await fetch(`${supabaseUrl}/rest/v1/learn_thai_codes?order=created_at.desc`, { headers })
    const data = await res.json()
    setCodes(Array.isArray(data) ? data : [])
  }

  useEffect(() => { if (authed) fetchCodes() }, [authed])

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuthed(true) }
    else { setWrong(true) }
  }

  const generate = async () => {
    setGenerating(true)
    const code = generateCode()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    await fetch(`${supabaseUrl}/rest/v1/learn_thai_codes`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ code, email: email.trim() || null, plan: 'monthly', active: true, expires_at: expiresAt.toISOString() }),
    })
    setLastCode(code)
    setEmail('')
    fetchCodes()
    setGenerating(false)
  }

  const toggleCode = async (id: string, active: boolean) => {
    await fetch(`${supabaseUrl}/rest/v1/learn_thai_codes?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ active: !active }),
    })
    fetchCodes()
  }

  const copy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🇹🇭</div>
        <h1 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px', color: '#1a1a2e' }}>Learn Thai Admin</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Subscription code manager</p>
        <input type="password" value={password} onChange={e => { setPassword(e.target.value); setWrong(false) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
          placeholder="Enter password"
          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: wrong ? '2px solid #ef4444' : '2px solid #e5e7eb', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as any, textAlign: 'center', letterSpacing: '4px', marginBottom: '8px' }} />
        {wrong && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>Incorrect password</p>}
        <button onClick={handleLogin} style={{ width: '100%', background: '#10b981', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>
          Login →
        </button>
      </div>
    </main>
  )

  const active = codes.filter(c => c.active && (!c.expires_at || new Date(c.expires_at) > new Date())).length
  const inUse = codes.filter(c => c.activated_at).length
  const expired = codes.filter(c => c.expires_at && new Date(c.expires_at) < new Date()).length

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #064e3b, #10b981)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '900', margin: 0 }}>🇹🇭 Learn Thai Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>Subscription code manager · ฿199/month</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={fetchCodes} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>🔄 Refresh</button>
          <Link href="/learn-thai" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', textDecoration: 'none' }}>← Learn Thai</Link>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Total', value: codes.length, color: '#6366f1' },
            { label: 'Active', value: active, color: '#10b981' },
            { label: 'In Use', value: inUse, color: '#f59e0b' },
            { label: 'Expired', value: expired, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: s.color }}>{s.value}</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Generator */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '24px', border: '2px solid #a7f3d0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px' }}>Generate New Code</h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>Format: THAI-XXXX-XXXX · Expires 30 days from today · Subscriber enters at /learn-thai/subscribe</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Subscriber email (optional)"
              style={{ flex: 1, minWidth: '220px', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none' }} />
            <button onClick={generate} disabled={generating}
              style={{ background: generating ? '#ccc' : '#10b981', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '900', fontSize: '15px', cursor: generating ? 'wait' : 'pointer', whiteSpace: 'nowrap' as any }}>
              {generating ? 'Generating...' : '🇹🇭 Generate Code'}
            </button>
          </div>

          {lastCode && (
            <div style={{ marginTop: '20px', background: '#f0fdf4', borderRadius: '12px', padding: '20px 24px', border: '2px solid #86efac', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#15803d', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>✅ New code — send this to the subscriber:</div>
                <div style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: '900', color: '#064e3b', letterSpacing: '2px' }}>{lastCode}</div>
                <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>URL: jobsinthailand.net/learn-thai/subscribe · Expires in 30 days</div>
              </div>
              <button onClick={() => copy(lastCode)} style={{ marginLeft: 'auto', background: copied ? '#10b981' : '#064e3b', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', flexShrink: 0 }}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Codes list */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '20px' }}>All Codes ({codes.length})</h2>
          {codes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🇹🇭</div>
              <p>No codes yet — generate your first one above.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {codes.map(c => {
                const expired = c.expires_at && new Date(c.expires_at) < new Date()
                const statusLabel = !c.active ? 'Disabled' : expired ? 'Expired' : c.activated_at ? 'In Use' : 'Ready'
                const statusColor = !c.active ? '#9ca3af' : expired ? '#ef4444' : c.activated_at ? '#f59e0b' : '#10b981'
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: '900', color: '#10b981', letterSpacing: '1px' }}>{c.code}</div>
                      <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '3px' }}>
                        {c.email || 'No email'} · Created: {new Date(c.created_at).toLocaleDateString('en-GB')}
                        {c.expires_at && ` · Expires: ${new Date(c.expires_at).toLocaleDateString('en-GB')}`}
                      </div>
                    </div>
                    <span style={{ background: statusColor + '20', color: statusColor, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>{statusLabel}</span>
                    <button onClick={() => copy(c.code)} style={{ background: '#f0fdf4', color: '#15803d', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📋</button>
                    <button onClick={() => toggleCode(c.id, c.active)} style={{ background: c.active ? '#fef2f2' : '#f0fdf4', color: c.active ? '#ef4444' : '#10b981', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                      {c.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
