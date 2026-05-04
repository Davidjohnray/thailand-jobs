'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type CV = {
  id: string
  full_name: string
  email: string
  phone: string
  nationality: string
  location: string
  experience: string
  cover_note: string
  cv_url: string
  job_title: string | null
  submitted_at: string
  status: string
}

type Partner = {
  id: string
  name: string
  slug: string
  logo_url: string
}

export default function PartnerDashboard({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [partner, setPartner] = useState<Partner | null>(null)
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterJob, setFilterJob] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  // Check session
  useEffect(() => {
    const saved = sessionStorage.getItem(`partner_authed_${slug}`)
    if (saved === 'true') setAuthed(true)
  }, [slug])

  useEffect(() => {
    if (!authed) return
    const load = async () => {
      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!partnerData) { setLoading(false); return }
      setPartner(partnerData)

      const { data: cvData } = await supabase
        .from('partner_cvs')
        .select('*')
        .eq('partner_slug', slug)
        .order('submitted_at', { ascending: false })

      setCvs(cvData || [])
      setLoading(false)
    }
    load()
  }, [authed, slug])

  const handleLogin = (e: any) => {
  e.preventDefault()
  if (password === 'partner_teach-bridge_2026') {
    setAuthed(true)
    sessionStorage.setItem(`partner_authed_${slug}`, 'true')
  } else {
    setWrongPassword(true)
  }
}

  const handleLogout = () => {
    setAuthed(false)
    sessionStorage.removeItem(`partner_authed_${slug}`)
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdatingStatus(id)
    await supabase.from('partner_cvs').update({ status }).eq('id', id)
    setCvs(prev => prev.map(cv => cv.id === id ? { ...cv, status } : cv))
    setUpdatingStatus(null)
  }

  const deleteCV = async (id: string) => {
    if (!confirm('Delete this CV submission? This cannot be undone.')) return
    await supabase.from('partner_cvs').delete().eq('id', id)
    setCvs(prev => prev.filter(cv => cv.id !== id))
  }

  // Unique job titles for filter
  const jobTitles = ['all', ...Array.from(new Set(cvs.map(cv => cv.job_title || 'General Application').filter(Boolean)))]

  const filtered = cvs.filter(cv => {
    const matchStatus = filterStatus === 'all' || cv.status === filterStatus
    const matchJob = filterJob === 'all' || (cv.job_title || 'General Application') === filterJob
    return matchStatus && matchJob
  })

  const statusColor = (status: string) => {
    if (status === 'new') return { bg: '#fff3ed', color: '#E85D26' }
    if (status === 'reviewed') return { bg: '#e8f0fe', color: '#2D6BE4' }
    if (status === 'shortlisted') return { bg: '#e8f5e9', color: '#2e7d32' }
    if (status === 'rejected') return { bg: '#ffeaea', color: '#c62828' }
    return { bg: '#f0f0f0', color: '#555' }
  }

  const counts = {
    all: cvs.length,
    new: cvs.filter(c => c.status === 'new').length,
    reviewed: cvs.filter(c => c.status === 'reviewed').length,
    shortlisted: cvs.filter(c => c.status === 'shortlisted').length,
    rejected: cvs.filter(c => c.status === 'rejected').length,
  }

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px 40px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '6px', color: '#1a1a2e' }}>Partner Dashboard</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Jobs in Thailand — CV Manager</p>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setWrongPassword(false) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
          placeholder="Enter your dashboard password"
          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: wrongPassword ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '3px', marginBottom: '8px' }}
        />
        {wrongPassword && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>Incorrect password</p>}
        <button onClick={handleLogin}
          style={{ width: '100%', background: '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>
          Login →
        </button>
        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '16px' }}>
          Need help? Contact <a href="mailto:raydave8@hotmail.com" style={{ color: '#E85D26' }}>Jobs in Thailand</a>
        </p>
      </div>
    </main>
  )

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <p style={{ color: '#888' }}>Loading dashboard...</p>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#1a1a2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {partner?.logo_url && (
            <img src={partner.logo_url} alt={partner?.name}
              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: 'white', padding: '4px' }} />
          )}
          <div>
            <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{partner?.name} — CV Dashboard</h1>
            <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>Powered by Jobs in Thailand</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {counts.new > 0 && (
            <span style={{ background: '#E85D26', color: 'white', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 'bold' }}>
              {counts.new} new
            </span>
          )}
          <button onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total CVs', value: counts.all, bg: '#1a1a2e', color: 'white' },
            { label: 'New', value: counts.new, bg: '#fff3ed', color: '#E85D26' },
            { label: 'Reviewed', value: counts.reviewed, bg: '#e8f0fe', color: '#2D6BE4' },
            { label: 'Shortlisted', value: counts.shortlisted, bg: '#e8f5e9', color: '#2e7d32' },
            { label: 'Rejected', value: counts.rejected, bg: '#ffeaea', color: '#c62828' },
          ].map(stat => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: stat.color, opacity: 0.8, fontWeight: 'bold' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Status:</span>
            {(['all', 'new', 'reviewed', 'shortlisted', 'rejected'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize', background: filterStatus === s ? '#1a1a2e' : '#f0f0f0', color: filterStatus === s ? 'white' : '#555' }}>
                {s} {s !== 'all' ? `(${counts[s]})` : `(${counts.all})`}
              </button>
            ))}
          </div>
          {jobTitles.length > 2 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Job:</span>
              <select value={filterJob} onChange={e => setFilterJob(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', background: 'white' }}>
                {jobTitles.map(j => <option key={j} value={j}>{j === 'all' ? 'All Jobs' : j}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* CV LIST */}
        {filtered.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '16px' }}>{cvs.length === 0 ? 'No CVs submitted yet.' : 'No CVs match your filters.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(cv => {
              const sc = statusColor(cv.status)
              const isExpanded = expanded === cv.id
              return (
                <div key={cv.id} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: cv.status === 'new' ? '2px solid #E85D26' : '1px solid #eee', overflow: 'hidden' }}>

                  {/* CV HEADER */}
                  <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{cv.full_name}</span>
                        <span style={{ background: sc.bg, color: sc.color, fontSize: '11px', fontWeight: 'bold', padding: '2px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>{cv.status}</span>
                        {cv.job_title && (
                          <span style={{ background: '#f0f4ff', color: '#2D6BE4', fontSize: '11px', fontWeight: 'bold', padding: '2px 10px', borderRadius: '20px' }}>
                            📋 {cv.job_title}
                          </span>
                        )}
                        {!cv.job_title && (
                          <span style={{ background: '#f0f0f0', color: '#666', fontSize: '11px', padding: '2px 10px', borderRadius: '20px' }}>General Application</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#666' }}>
                        <span>✉️ {cv.email}</span>
                        {cv.phone && <span>📞 {cv.phone}</span>}
                        {cv.nationality && <span>🌍 {cv.nationality}</span>}
                        {cv.location && <span>📍 {cv.location}</span>}
                        {cv.experience && <span>⭐ {cv.experience}</span>}
                      </div>
                      <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>
                        Submitted: {new Date(cv.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <a href={cv.cv_url} target="_blank" rel="noopener noreferrer"
                        style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                        📄 View CV
                      </a>
                      <a href={cv.cv_url} download
                        style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                        ⬇ Download
                      </a>
                      <button onClick={() => setExpanded(isExpanded ? null : cv.id)}
                        style={{ background: '#f0f0f0', color: '#555', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                        {isExpanded ? '▲ Less' : '▼ More'}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED DETAILS */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #eee', padding: '20px 24px', background: '#fafafa' }}>

                      {cv.cover_note && (
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '8px' }}>Cover Note</div>
                          <div style={{ background: 'white', borderRadius: '8px', padding: '14px', fontSize: '14px', color: '#444', lineHeight: '1.6', border: '1px solid #eee', whiteSpace: 'pre-wrap' }}>
                            {cv.cover_note}
                          </div>
                        </div>
                      )}

                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '10px' }}>Update Status</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {(['new', 'reviewed', 'shortlisted', 'rejected'] as const).map(s => {
                            const sc2 = statusColor(s)
                            return (
                              <button key={s} onClick={() => updateStatus(cv.id, s)}
                                disabled={updatingStatus === cv.id || cv.status === s}
                                style={{ padding: '8px 16px', borderRadius: '8px', border: `2px solid ${sc2.color}`, background: cv.status === s ? sc2.color : 'white', color: cv.status === s ? 'white' : sc2.color, fontWeight: 'bold', fontSize: '13px', cursor: cv.status === s ? 'default' : 'pointer', textTransform: 'capitalize', opacity: updatingStatus === cv.id ? 0.6 : 1 }}>
                                {updatingStatus === cv.id ? '...' : s}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <a href={`mailto:${cv.email}?subject=Re: Your application - ${cv.job_title || 'General Application'}`}
                          style={{ background: '#1a1a2e', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                          ✉️ Email Applicant
                        </a>
                        <button onClick={() => deleteCV(cv.id)}
                          style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                          🗑 Delete
                        </button>
                      </div>
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
