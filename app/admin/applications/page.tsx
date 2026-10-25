'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtTime = (d: string) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function ApplicationStatsPage() {
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [school, setSchool] = useState('all')
  const [open, setOpen] = useState<string | null>(null)

  const load = async (password: string) => {
    setLoading(true)
    const res = await fetch('/api/admin/applications', { headers: { 'x-admin-password': password }, cache: 'no-store' })
    if (res.status === 401) {
      setWrong(true); setAuthed(false)
      try { sessionStorage.removeItem('adminPw') } catch {}
      setLoading(false); return
    }
    setData(await res.json())
    setAuthed(true)
    try { sessionStorage.setItem('adminPw', password) } catch {}
    setLoading(false)
  }

  useEffect(() => {
    try { const saved = sessionStorage.getItem('adminPw'); if (saved) { setPw(saved); load(saved) } } catch {}
  }, [])

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <form onSubmit={e => { e.preventDefault(); load(pw) }} style={{ background: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '44px', marginBottom: '12px' }}>📊</div>
        <h1 style={{ fontSize: '22px', color: '#1a1a2e', margin: '0 0 24px' }}>Application Stats</h1>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setWrong(false) }} placeholder="Admin password"
          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: wrong ? '2px solid red' : '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box', textAlign: 'center', marginBottom: '10px' }} />
        {wrong && <p style={{ color: 'red', fontSize: '13px', margin: '0 0 10px' }}>Incorrect password</p>}
        <button type="submit" style={{ width: '100%', background: '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? 'Loading...' : 'View Stats →'}
        </button>
      </form>
    </main>
  )

  const partners: any[] = data?.partners || []
  const jobs: any[] = (data?.jobs || []).filter((j: any) => school === 'all' || j.partner_key === school)
  const partnerName = (key: string) => partners.find(p => p.key === key)?.name || key

  const totals = jobs.reduce((t, j) => ({ views: t.views + (j.views || 0), apps: t.apps + j.applications, sent: t.sent + j.sent, failed: t.failed + j.failed }), { views: 0, apps: 0, sent: 0, failed: 0 })
  const last7 = jobs.flatMap(j => j.applicants).filter((a: any) => Date.now() - new Date(a.created_at).getTime() < 7 * 86400000).length

  const Stat = ({ label, value, color }: any) => (
    <div style={{ background: 'white', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1, minWidth: '140px' }}>
      <div style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: color || '#1a1a2e', fontSize: '28px', fontWeight: 'bold' }}>{value}</div>
    </div>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ background: '#1a1a2e', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '20px', margin: 0 }}>📊 Application Stats</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: 0 }}>Auto-apply schools — applications sent through Jobs in Thailand</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => load(pw)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>🔄 Refresh</button>
          <Link href="/admin" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>← Admin</Link>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[{ key: 'all', name: 'All schools' }, ...partners].map((p: any) => (
            <button key={p.key} onClick={() => setSchool(p.key)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '2px solid', borderColor: school === p.key ? '#E85D26' : '#ddd', background: school === p.key ? '#fff3ed' : 'white', color: school === p.key ? '#E85D26' : '#555', fontWeight: school === p.key ? 'bold' : 'normal', cursor: 'pointer', fontSize: '14px' }}>
              {p.name}{p.active === false ? ' (paused)' : ''}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Stat label="Jobs" value={jobs.length} />
          <Stat label="Job views" value={totals.views} />
          <Stat label="Applications sent" value={totals.sent} color="#2e7d32" />
          <Stat label="Last 7 days" value={last7} color="#E85D26" />
          {totals.failed > 0 && <Stat label="Email failed" value={totals.failed} color="#c62828" />}
        </div>

        {jobs.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '50px', textAlign: 'center', color: '#888' }}>
            No auto-apply jobs yet. In Admin → Partners, pick the school's logo on their jobs to switch them on.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jobs.map((j: any) => {
              const expired = j.expires_at && new Date(j.expires_at) < new Date()
              const rate = j.views ? Math.round((j.applications / j.views) * 1000) / 10 : 0
              return (
                <div key={j.id} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div onClick={() => setOpen(open === String(j.id) ? null : String(j.id))}
                    style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', cursor: 'pointer' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e' }}>
                        {j.title} {expired && <span style={{ background: '#f3f4f6', color: '#888', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', marginLeft: '6px' }}>expired</span>}
                      </div>
                      <div style={{ color: '#888', fontSize: '13px' }}>{partnerName(j.partner_key)} • {j.location} • posted {fmt(j.created_at)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '18px', textAlign: 'center' }}>
                      <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' }}>{j.views}</div><div style={{ fontSize: '11px', color: '#888' }}>views</div></div>
                      <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>{j.sent}</div><div style={{ fontSize: '11px', color: '#888' }}>sent</div></div>
                      {j.failed > 0 && <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c62828' }}>{j.failed}</div><div style={{ fontSize: '11px', color: '#888' }}>failed</div></div>}
                      <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#E85D26' }}>{rate}%</div><div style={{ fontSize: '11px', color: '#888' }}>apply rate</div></div>
                    </div>
                  </div>

                  {open === String(j.id) && (
                    <div style={{ borderTop: '1px solid #eee', padding: '12px 20px 18px' }}>
                      {j.applicants.length === 0 ? (
                        <p style={{ color: '#888', fontSize: '14px', margin: '6px 0 0' }}>No applications yet.</p>
                      ) : j.applicants.map((a: any) => (
                        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', padding: '10px 0', borderBottom: '1px solid #f3f3f3' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a1a2e' }}>
                              {a.name} <span style={{ color: '#aaa', fontWeight: 'normal' }}>· JIT-{a.ref_no}</span>
                              {a.video_path && <span style={{ marginLeft: '6px' }} title="Includes video">🎥</span>}
                            </div>
                            <div style={{ color: '#888', fontSize: '12px' }}>{a.email}{a.phone ? ` · ${a.phone}` : ''}{a.nationality ? ` · ${a.nationality}` : ''} · {fmtTime(a.created_at)}</div>
                            {a.email_status === 'failed' && <div style={{ color: '#c62828', fontSize: '12px', marginTop: '2px' }}>⚠️ Email to school failed: {a.email_error}</div>}
                          </div>
                          <a href={`/applications/${a.view_token}`} target="_blank" rel="noopener noreferrer"
                            style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>View →</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
