'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const ADMIN_PASSWORD = 'thailand2024'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'IELTS-'
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    if (i < 3) code += '-'
  }
  return code
}

type Code = {
  id: string
  code: string
  created_at: string
  activated_by_email: string | null
  activated_at: string | null
  expires_at: string | null
  is_used: boolean
}

type Access = {
  id: string
  email: string
  code_used: string
  activated_at: string
  expires_at: string
  is_active: boolean
}

export default function IELTSAdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [tab, setTab] = useState<'codes' | 'access'>('codes')
  const [codes, setCodes] = useState<Code[]>([])
  const [access, setAccess] = useState<Access[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function handlePasswordSubmit() {
    if (password === 'thailand2024') {
      setAuthed(true)
      setPasswordError('')
    } else {
      setPasswordError('Incorrect password.')
    }
  }

  async function fetchCodes() {
    setLoading(true)
    const { data } = await supabase
      .from('ielts_codes')
      .select('*')
      .order('created_at', { ascending: false })
    setCodes(data || [])
    setLoading(false)
  }

  async function fetchAccess() {
    setLoading(true)
    const { data } = await supabase
      .from('ielts_access')
      .select('*')
      .order('activated_at', { ascending: false })
    setAccess(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (authed) {
      fetchCodes()
      fetchAccess()
    }
  }, [authed])

  async function handleGenerateCodes() {
    setGenerating(true)
    setMessage('')
    const newCodes = []
    for (let i = 0; i < qty; i++) {
      newCodes.push({ code: generateCode() })
    }
    const { error } = await supabase.from('ielts_codes').insert(newCodes)
    if (error) {
      setMessage('Error generating codes: ' + error.message)
    } else {
      setMessage(`✅ ${qty} code${qty > 1 ? 's' : ''} generated successfully.`)
      await fetchCodes()
    }
    setGenerating(false)
  }

  async function handleDeactivateAccess(id: string) {
    await supabase.from('ielts_access').update({ is_active: false }).eq('id', id)
    await fetchAccess()
  }

  async function handleDeleteCode(id: string) {
    await supabase.from('ielts_codes').delete().eq('id', id)
    await fetchCodes()
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  function isExpired(expiresAt: string | null) {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  // PASSWORD SCREEN
  if (!authed) {
    return (
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
            IELTS Admin
          </h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px' }}>
            jobsinthailand.net — restricted access
          </p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '15px',
              marginBottom: '12px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
          {passwordError && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{passwordError}</p>
          )}
          <button
            onClick={handlePasswordSubmit}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Enter
          </button>
        </div>
      </main>
    )
  }

  // ADMIN DASHBOARD
  const unusedCodes = codes.filter(c => !c.is_used)
  const usedCodes = codes.filter(c => c.is_used)
  const activeAccess = access.filter(a => a.is_active && !isExpired(a.expires_at))
  const expiredAccess = access.filter(a => !a.is_active || isExpired(a.expires_at))

  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              🎓 IELTS Admin Panel
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '4px 0 0' }}>
              jobsinthailand.net — code management & access control
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'Total Codes', value: codes.length, color: '#3b82f6' },
              { label: 'Active Users', value: activeAccess.length, color: '#10b981' },
              { label: 'Unused Codes', value: unusedCodes.length, color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '12px 20px',
                textAlign: 'center'
              }}>
                <div style={{ color: stat.color, fontSize: '22px', fontWeight: 'bold' }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Codes Panel */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>
            Generate Access Codes
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#555' }}>Quantity:</label>
              <select
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {[1, 2, 5, 10, 20, 50].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerateCodes}
              disabled={generating}
              style={{
                padding: '8px 24px',
                background: generating ? '#94a3b8' : 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: generating ? 'not-allowed' : 'pointer'
              }}
            >
              {generating ? 'Generating...' : '+ Generate Codes'}
            </button>
            {message && (
              <span style={{ fontSize: '14px', color: message.startsWith('✅') ? '#10b981' : '#ef4444' }}>
                {message}
              </span>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '12px 0 0' }}>
            149 THB/month · 1 person per code · expires 30 days after activation
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['codes', 'access'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: tab === t ? '#1e3a5f' : 'white',
                color: tab === t ? 'white' : '#555',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              {t === 'codes' ? `🔑 Codes (${codes.length})` : `👤 Active Access (${activeAccess.length})`}
            </button>
          ))}
          <button
            onClick={() => { fetchCodes(); fetchAccess() }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              background: 'white',
              color: '#555',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              marginLeft: 'auto'
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Codes Table */}
        {tab === 'codes' && (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : codes.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No codes yet. Generate some above.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    {['Code', 'Status', 'Activated By', 'Activated', 'Expires', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', color: '#1e3a5f' }}>
                          {c.code}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: c.is_used ? '#fee2e2' : '#dcfce7',
                          color: c.is_used ? '#dc2626' : '#16a34a'
                        }}>
                          {c.is_used ? 'Used' : 'Available'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555' }}>
                        {c.activated_by_email || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555' }}>
                        {formatDate(c.activated_at)}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: c.expires_at && isExpired(c.expires_at) ? '#ef4444' : '#555' }}>
                        {formatDate(c.expires_at)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!c.is_used && (
                            <button
                              onClick={() => copyCode(c.code)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                fontSize: '12px',
                                cursor: 'pointer',
                                background: copiedCode === c.code ? '#dcfce7' : 'white',
                                color: copiedCode === c.code ? '#16a34a' : '#555'
                              }}
                            >
                              {copiedCode === c.code ? '✅ Copied' : '📋 Copy'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCode(c.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid #fecaca',
                              fontSize: '12px',
                              cursor: 'pointer',
                              background: '#fff5f5',
                              color: '#ef4444'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Access Table */}
        {tab === 'access' && (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : access.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No activations yet.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    {['Email', 'Code Used', 'Activated', 'Expires', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {access.map((a, i) => {
                    const expired = isExpired(a.expires_at)
                    return (
                      <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#1a1a2e' }}>{a.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#555' }}>{a.code_used}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555' }}>{formatDate(a.activated_at)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: expired ? '#ef4444' : '#555' }}>{formatDate(a.expires_at)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: !a.is_active || expired ? '#fee2e2' : '#dcfce7',
                            color: !a.is_active || expired ? '#dc2626' : '#16a34a'
                          }}>
                            {!a.is_active ? 'Deactivated' : expired ? 'Expired' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {a.is_active && !expired && (
                            <button
                              onClick={() => handleDeactivateAccess(a.id)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid #fecaca',
                                fontSize: '12px',
                                cursor: 'pointer',
                                background: '#fff5f5',
                                color: '#ef4444'
                              }}
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
