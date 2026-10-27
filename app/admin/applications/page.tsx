'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtTime = (d: string) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

const TYPE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  pro: { label: '⚡ Pro', bg: '#fff3ed', color: '#E85D26' },
  free_try: { label: '🎁 Free try', bg: '#f0f4ff', color: '#2D6BE4' },
  partner: { label: '🏫 Partner', bg: '#f3f4f6', color: '#555' },
}

export default function ApplicationStatsPage() {
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [school, setSchool] = useState('all')
  const [open, setOpen] = useState<string | null>(null)
  const [grantEmail, setGrantEmail] = useState('')
  const [grantDays, setGrantDays] = useState('30')
  const [proMsg, setProMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const load = async (password: string) => {
    setLoading(true)
    const res = await fetch('/api/admin/applications', { headers: { 'x-admin-password': password }, cache: 'no-store' })
    if (res.status === 401) {
      setWrong(true); setAuthed(false)
      try { localStorage.removeItem('jitAdminPw'); sessionStorage.removeItem('adminPw') } catch {}
      setLoading(false); return
    }
    setData(await res.json())
    setAuthed(true)
    try { localStorage.setItem('jitAdminPw', password); sessionStorage.setItem('adminPw', password) } catch {}
    setLoading(false)
  }

  useEffect(() => {
    // Remembered on this computer (until you log out), so closing the tab doesn't sign you out
    try { const saved = localStorage.getItem('jitAdminPw') || sessionStorage.getItem('adminPw'); if (saved) { setPw(saved); load(saved) } } catch {}
  }, [])

  const proAction = async (body: any, success: string) => {
    setBusy(true); setProMsg(null)
    try {
      const res = await fetch('/api/admin/apply-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Something went wrong')
      setProMsg({ ok: true, text: d.pro_until ? `${success} — active until ${fmt(d.pro_until)}` : success })
      if (body.action === 'grant') setGrantEmail('')
      await load(pw)
    } catch (e: any) {
      setProMsg({ ok: false, text: e.message })
    }
    setBusy(false)
  }

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

  const pro = data?.pro || { enabled: true, sentToday: 0, dailyCap: 80, aiLettersThisMonth: 0, members: [] }
  const partners: any[] = data?.partners || []
  const tabs = [{ key: 'all', name: 'All' }, { key: 'pro', name: '⚡ Apply Pro jobs' }, ...partners]
  const jobs: any[] = (data?.jobs || []).filter((j: any) => school === 'all' || j.partner_key === school)
  const partnerName = (key: string) => key === 'pro' ? 'Apply Pro' : partners.find(p => p.key === key)?.name || key

  const totals = jobs.reduce((t, j) => ({ views: t.views + (j.views || 0), apps: t.apps + j.applications, sent: t.sent + j.sent, failed: t.failed + j.failed, viewed: t.viewed + j.viewed }), { views: 0, apps: 0, sent: 0, failed: 0, viewed: 0 })
  const last7 = jobs.flatMap(j => j.applicants).filter((a: any) => Date.now() - new Date(a.created_at).getTime() < 7 * 86400000).length

  const Stat = ({ label, value, color, small }: any) => (
    <div style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1, minWidth: '130px' }}>
      <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: color || '#1a1a2e', fontSize: small ? '20px' : '26px', fontWeight: 'bold' }}>{value}</div>
    </div>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ background: '#1a1a2e', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '20px', margin: 0 }}>📊 Application Stats</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: 0 }}>Partner schools and Apply Pro — applications sent through Jobs in Thailand</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => load(pw)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>🔄 Refresh</button>
          <button onClick={() => { try { localStorage.removeItem('jitAdminPw'); sessionStorage.removeItem('adminPw') } catch {}; setAuthed(false); setPw('') }}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>🔒 Log out</button>
          <Link href="/admin" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>← Admin</Link>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>

        {/* ── APPLY PRO PANEL ── */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #E85D26', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', color: '#1a1a2e', margin: 0 }}>⚡ Apply Pro</h2>
              <p style={{ color: '#888', fontSize: '13px', margin: '2px 0 0' }}>
                {pro.enabled ? 'On — paid members and free tries can apply through the site' : 'Paused — everyone sees contact details (partner schools still work)'}
              </p>
            </div>
            <button disabled={busy} onClick={() => proAction({ action: 'toggle', value: pro.enabled ? 'off' : 'on' }, pro.enabled ? 'Apply Pro paused' : 'Apply Pro switched on')}
              style={{ background: pro.enabled ? '#f3f4f6' : '#4caf50', color: pro.enabled ? '#c62828' : 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {pro.enabled ? '⏸ Pause Apply Pro' : '▶ Switch Apply Pro on'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <Stat small label="Active Pro members" value={pro.members.length} color="#E85D26" />
            <Stat small label="Emails sent today" value={`${pro.sentToday} / ${pro.dailyCap}`} color={pro.sentToday >= pro.dailyCap ? '#c62828' : '#1a1a2e'} />
            <Stat small label="AI letters this month" value={pro.aiLettersThisMonth} />
          </div>

          <form onSubmit={e => { e.preventDefault(); if (grantEmail.trim()) proAction({ action: 'grant', email: grantEmail.trim(), days: Number(grantDays) }, `Apply Pro switched on for ${grantEmail.trim()}`) }}
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <input value={grantEmail} onChange={e => setGrantEmail(e.target.value)} placeholder="Member's account email" type="email"
              style={{ flex: 1, minWidth: '220px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
            <select value={grantDays} onChange={e => setGrantDays(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white' }}>
              <option value="30">30 days (99 baht)</option>
              <option value="180">6 months (499 baht)</option>
              <option value="7">7 days (free trial)</option>
            </select>
            <button type="submit" disabled={busy || !grantEmail.trim()}
              style={{ background: '#E85D26', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {busy ? 'Working…' : '+ Give Apply Pro'}
            </button>
          </form>
          <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px' }}>If they're still active, the days are added on to their current end date.</p>
          {proMsg && (
            <div style={{ background: proMsg.ok ? '#e8f5e9' : '#ffeaea', color: proMsg.ok ? '#2e7d32' : '#c62828', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
              {proMsg.text}
            </div>
          )}

          {pro.members.length > 0 && (
            <div style={{ borderTop: '1px solid #eee', marginTop: '8px' }}>
              {pro.members.map((m: any) => (
                <div key={m.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: '1px solid #f5f5f5', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '14px', color: '#1a1a2e' }}>{m.email} <span style={{ color: '#888', fontSize: '12px' }}>· until {fmt(m.pro_until)}</span></div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button disabled={busy} onClick={() => proAction({ action: 'grant', email: m.email, days: 30 }, `Added 30 days for ${m.email}`)}
                      style={{ background: '#f0f4ff', color: '#2D6BE4', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>+30 days</button>
                    <button disabled={busy} onClick={() => { if (confirm(`Remove Apply Pro from ${m.email}?`)) proAction({ action: 'revoke', email: m.email }, `Apply Pro removed from ${m.email}`) }}
                      style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── APPLICATIONS ── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {tabs.map((p: any) => (
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
          <Stat label="Viewed by employer" value={totals.viewed} color="#2D6BE4" />
          <Stat label="Last 7 days" value={last7} color="#E85D26" />
          {totals.failed > 0 && <Stat label="Email failed" value={totals.failed} color="#c62828" />}
        </div>

        {jobs.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '50px', textAlign: 'center', color: '#888' }}>
            No applications here yet.
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
                      <div style={{ color: '#888', fontSize: '13px' }}>{j.partner_key === 'pro' ? j.company : partnerName(j.partner_key)} • {j.location} • posted {fmt(j.created_at)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '18px', textAlign: 'center' }}>
                      <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' }}>{j.views}</div><div style={{ fontSize: '11px', color: '#888' }}>views</div></div>
                      <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>{j.sent}</div><div style={{ fontSize: '11px', color: '#888' }}>sent</div></div>
                      <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2D6BE4' }}>{j.viewed}</div><div style={{ fontSize: '11px', color: '#888' }}>viewed</div></div>
                      {j.failed > 0 && <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c62828' }}>{j.failed}</div><div style={{ fontSize: '11px', color: '#888' }}>failed</div></div>}
                      <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#E85D26' }}>{rate}%</div><div style={{ fontSize: '11px', color: '#888' }}>apply rate</div></div>
                    </div>
                  </div>

                  {open === String(j.id) && (
                    <div style={{ borderTop: '1px solid #eee', padding: '12px 20px 18px' }}>
                      {j.applicants.length === 0 ? (
                        <p style={{ color: '#888', fontSize: '14px', margin: '6px 0 0' }}>No applications yet.</p>
                      ) : j.applicants.map((a: any) => {
                        const badge = TYPE_BADGE[a.apply_type] || TYPE_BADGE.partner
                        return (
                          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', padding: '10px 0', borderBottom: '1px solid #f3f3f3' }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a1a2e' }}>
                                {a.name} <span style={{ color: '#aaa', fontWeight: 'normal' }}>· JIT-{a.ref_no}</span>
                                <span style={{ background: badge.bg, color: badge.color, fontSize: '11px', padding: '2px 8px', borderRadius: '20px', marginLeft: '8px' }}>{badge.label}</span>
                                {(a.video_path || a.video_link) && <span style={{ marginLeft: '6px' }} title="Includes video">🎥</span>}
                              </div>
                              <div style={{ color: '#888', fontSize: '12px' }}>{a.email}{a.phone ? ` · ${a.phone}` : ''}{a.nationality ? ` · ${a.nationality}` : ''} · {fmtTime(a.created_at)}</div>
                              <div style={{ fontSize: '12px', marginTop: '2px', color: a.viewed_at ? '#2e7d32' : '#aaa' }}>
                                {a.viewed_at ? `👁 Viewed ${fmtTime(a.viewed_at)}${a.view_count > 1 ? ` (${a.view_count}×)` : ''}` : 'Not viewed yet'}
                                {a.to_email && <span style={{ color: '#aaa' }}> · sent to {a.to_email}</span>}
                              </div>
                              {a.email_status === 'failed' && <div style={{ color: '#c62828', fontSize: '12px', marginTop: '2px' }}>⚠️ Email to employer failed: {a.email_error}</div>}
                            </div>
                            <a href={`/applications/${a.view_token}?admin=1`} target="_blank" rel="noopener noreferrer"
                              style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>View →</a>
                          </div>
                        )
                      })}
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
