// Add this section inside your existing admin panel page
// Import at top: import LearnThaiCodesAdmin from '@/components/admin/LearnThaiCodesAdmin'
// Then place <LearnThaiCodesAdmin /> wherever you want it in the admin layout

'use client'
import { useState, useEffect } from 'react'

type LTCode = {
  id: string
  code: string
  email: string | null
  plan: string
  active: boolean
  created_at: string
  activated_at: string | null
  expires_at: string | null
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `THAI-${seg(4)}-${seg(4)}`
}

export default function LearnThaiCodesAdmin() {
  const [codes, setCodes] = useState<LTCode[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('monthly')
  const [newCode, setNewCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const fetchCodes = async () => {
    setLoading(true)
    const res = await fetch(`${supabaseUrl}/rest/v1/learn_thai_codes?order=created_at.desc&limit=50`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
    })
    const data = await res.json()
    setCodes(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchCodes() }, [])

  const generateAndSave = async () => {
    setGenerating(true)
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const res = await fetch(`${supabaseUrl}/rest/v1/learn_thai_codes`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        code,
        email: email.trim() || null,
        plan,
        active: true,
        expires_at: expiresAt,
      }),
    })

    if (res.ok) {
      setNewCode(code)
      setEmail('')
      fetchCodes()
    }
    setGenerating(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`${supabaseUrl}/rest/v1/learn_thai_codes?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active: !current }),
    })
    fetchCodes()
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isExpired = (expiry: string | null) => expiry ? new Date(expiry) < new Date() : false
  const isActivated = (code: LTCode) => !!code.activated_at

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 4px' }}>🇹🇭 Learn Thai — Access Codes</h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Generate codes for subscribers. Each code expires 30 days after generation.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Subscriber email (optional)"
            style={{ border: '2px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', width: '220px' }}
          />
          <select value={plan} onChange={e => setPlan(e.target.value)}
            style={{ border: '2px solid #e5e7eb', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', outline: 'none', background: 'white' }}>
            <option value="monthly">Monthly — ฿199</option>
            <option value="annual">Annual — ฿1,990</option>
          </select>
          <button onClick={generateAndSave} disabled={generating}
            style={{ background: 'linear-gradient(135deg, #064e3b, #10b981)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '800', fontSize: '14px', cursor: generating ? 'wait' : 'pointer' }}>
            {generating ? 'Generating...' : '+ Generate Code'}
          </button>
        </div>
      </div>

      {/* New code display */}
      {newCode && (
        <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '18px 20px', marginBottom: '20px', border: '2px solid #86efac', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#15803d', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>✅ New code generated — send this to the subscriber:</div>
            <div style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: '900', color: '#064e3b', letterSpacing: '2px' }}>{newCode}</div>
            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Expires in 30 days</div>
          </div>
          <button onClick={() => copyCode(newCode)}
            style={{ background: copied ? '#22c55e' : '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', marginLeft: 'auto' }}>
            {copied ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total codes', value: codes.length, color: '#6366f1' },
          { label: 'Active', value: codes.filter(c => c.active && !isExpired(c.expires_at)).length, color: '#22c55e' },
          { label: 'Activated', value: codes.filter(c => isActivated(c)).length, color: '#f59e0b' },
          { label: 'Expired', value: codes.filter(c => isExpired(c.expires_at)).length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ background: s.color + '10', borderRadius: '12px', padding: '14px 16px', border: `1px solid ${s.color}25`, textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: s.color }}>{s.value}</div>
            <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Codes table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>Loading codes...</div>
      ) : codes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>No codes yet — generate your first one above.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                {['Code', 'Email', 'Plan', 'Created', 'Activated', 'Expires', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#6b7280', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {codes.map(c => {
                const expired = isExpired(c.expires_at)
                const activated = isActivated(c)
                const statusColor = !c.active ? '#9ca3af' : expired ? '#ef4444' : activated ? '#f59e0b' : '#22c55e'
                const statusLabel = !c.active ? 'Disabled' : expired ? 'Expired' : activated ? 'In Use' : 'Ready'
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#1a1a2e', fontSize: '14px' }}>{c.code}</span>
                        <button onClick={() => copyCode(c.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '12px', padding: '2px 4px' }}>📋</button>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#6b7280' }}>{c.email || '—'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: c.plan === 'annual' ? '#fef9c3' : '#f0f9ff', color: c.plan === 'annual' ? '#92400e' : '#0369a1', padding: '2px 8px', borderRadius: '20px', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>{c.plan}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString('en-GB')}</td>
                    <td style={{ padding: '10px 12px', color: activated ? '#f59e0b' : '#9ca3af', whiteSpace: 'nowrap' }}>{c.activated_at ? new Date(c.activated_at).toLocaleDateString('en-GB') : '—'}</td>
                    <td style={{ padding: '10px 12px', color: expired ? '#ef4444' : '#9ca3af', whiteSpace: 'nowrap' }}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-GB') : '—'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: statusColor + '15', color: statusColor, padding: '3px 10px', borderRadius: '20px', fontWeight: '700', fontSize: '11px' }}>{statusLabel}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <button onClick={() => toggleActive(c.id, c.active)}
                        style={{ background: 'none', border: `1px solid ${c.active ? '#fca5a5' : '#86efac'}`, color: c.active ? '#ef4444' : '#22c55e', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}>
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
