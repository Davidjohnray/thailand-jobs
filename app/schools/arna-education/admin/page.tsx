'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../../src/lib/supabase'

const ADMIN_PASSWORD = 'thailand2024'

interface Application {
  id: string
  job_id: number
  full_name: string
  email: string
  nationality: string
  whatsapp: string
  qualifications: string
  experience: string
  photo_url: string
  resume_url: string
  video_url: string
  about: string
  status: string
  created_at: string
  job_title?: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  forwarded: '#22c55e',
  rejected: '#ef4444',
  hold: '#6366f1',
}

export default function ArnaAdminPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arna_admin_authed') === 'true'
    }
    return false
  })
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [actionLoading, setActionLoading] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('arna_applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      const jobIds = [...new Set(data.map(a => a.job_id))]
      const { data: jobData } = await supabase
        .from('jobs')
        .select('id, title')
        .in('id', jobIds)
      const jobMap: Record<number, string> = {}
      jobData?.forEach(j => { jobMap[j.id] = j.title })
      setJobs(jobMap)
      setApplications(data.map(a => ({ ...a, job_title: jobMap[a.job_id] || 'Unknown position' })))
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authed) fetchApplications()
  }, [authed])

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      localStorage.setItem('arna_admin_authed', 'true')
      setPwError('')
    } else setPwError('Incorrect password')
  }

  const logout = () => {
    setAuthed(false)
    localStorage.removeItem('arna_admin_authed')
  }

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id + status)
    await supabase.from('arna_applications').update({ status }).eq('id', id)
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : null)
    setActionLoading('')
    showToast(status === 'forwarded' ? '✅ Marked as forwarded' : status === 'rejected' ? '❌ Application rejected' : status === 'hold' ? '⏳ Application on hold' : '✅ Updated')
  }

  const deleteApplication = async (id: string) => {
    if (!confirm('Remove this application permanently?')) return
    setActionLoading(id + 'delete')
    await supabase.from('arna_applications').delete().eq('id', id)
    setApplications(prev => prev.filter(a => a.id !== id))
    if (selectedApp?.id === id) setSelectedApp(null)
    setActionLoading('')
    showToast('🗑️ Application removed')
  }

  const openGmail = (to: string, subject: string, body: string) => {
    const url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(url, '_blank')
  }

  const sendForwardEmail = (app: Application) => {
    openGmail(
      app.email,
      `Your application for: ${app.job_title}`,
      `Hi ${app.full_name},\n\nThank you for applying for the position of ${app.job_title} through Jobs in Thailand.\n\nWe are pleased to let you know that your application has been reviewed and your CV has been forwarded to ARNA Education & Services for their consideration.\n\nIf your profile is a good match for the position, ARNA will be in touch with you directly to arrange the next steps.\n\nWe will keep you updated on the progress of your application.\n\nBest regards,\nJobs in Thailand Team\nAdmin@jobsinthailand.net`
    )
    updateStatus(app.id, 'forwarded')
  }

  const sendToArna = (app: Application) => {
    openGmail(
      'Thitiporn536@gmail.com',
      `Teacher Application: ${app.job_title} — ${app.full_name}`,
      `Hi Arna,\n\nPlease find below the details of a teacher who has applied for the position of ${app.job_title}.\n\nName: ${app.full_name}\nEmail: ${app.email}\nNationality: ${app.nationality}\nWhatsApp: ${app.whatsapp || 'Not provided'}\nQualifications: ${app.qualifications}\nExperience: ${app.experience}\n\nAbout:\n${app.about}\n\nResume: ${app.resume_url}\nPhoto: ${app.photo_url}${app.video_url ? `\nIntro video: ${app.video_url}` : ''}\n\nBest regards,\nDavid\nJobs in Thailand`
    )
  }

  const sendRejectionEmail = (app: Application) => {
    openGmail(
      app.email,
      `Your application for ${app.job_title}`,
      `Hi ${app.full_name},\n\nThank you for your interest in the position of ${app.job_title} through Jobs in Thailand and ARNA Education & Services.\n\nAfter careful review, we regret to inform you that on this occasion your application has not been successful for this particular position.\n\nWe would encourage you to keep your profile updated and apply for other positions that match your skills and experience. You can browse all available vacancies at www.jobsinthailand.net.\n\nWe wish you all the best in your job search.\n\nKind regards,\nJobs in Thailand Team\nAdmin@jobsinthailand.net`
    )
    updateStatus(app.id, 'rejected')
  }

  const uniqueJobIds = [...new Set(applications.map(a => a.job_id))]
  const filtered = selectedJob === 'all' ? applications : applications.filter(a => a.job_id === parseInt(selectedJob))

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#0a0f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
        <img src="/arna-education.png" alt="ARNA" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '12px', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0a0f2e', marginBottom: '6px' }}>ARNA Applications</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>Enter your admin password to continue</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Password"
          style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', fontSize: '15px', textAlign: 'center', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />
        {pwError && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{pwError}</div>}
        <button onClick={login}
          style={{ background: '#D9A441', color: '#0a0f2e', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', width: '100%' }}>
          Enter Dashboard
        </button>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa', padding: '24px 16px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#0a0f2e', color: 'white', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <img src="/arna-education.png" alt="ARNA" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px' }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0a0f2e', margin: 0 }}>ARNA Applications Dashboard</h1>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={logout}
            style={{ background: '#f3f4f6', color: '#666', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            🔓 Log Out
          </button>
        </div>

        {/* Filter by job */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#555' }}>Filter by position:</span>
          <button onClick={() => setSelectedJob('all')}
            style={{ background: selectedJob === 'all' ? '#0a0f2e' : '#f0f0f0', color: selectedJob === 'all' ? 'white' : '#555', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            All ({applications.length})
          </button>
          {uniqueJobIds.map(jobId => (
            <button key={jobId} onClick={() => setSelectedJob(String(jobId))}
              style={{ background: selectedJob === String(jobId) ? '#D9A441' : '#f0f0f0', color: selectedJob === String(jobId) ? '#0a0f2e' : '#555', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              {jobs[jobId] || `Job #${jobId}`} ({applications.filter(a => a.job_id === jobId).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p>No applications yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1fr 380px' : '1fr', gap: '20px', alignItems: 'flex-start' }}>

            {/* Applications list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(app => (
                <div key={app.id}
                  onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}
                  style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${selectedApp?.id === app.id ? '#D9A441' : '#eee'}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <img src={app.photo_url} alt={app.full_name}
                      style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #D9A441' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '15px', color: '#0a0f2e' }}>{app.full_name}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>{app.nationality} · {app.experience}</div>
                          <div style={{ fontSize: '12px', color: '#D9A441', fontWeight: '700', marginTop: '2px' }}>{app.job_title}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span style={{ background: STATUS_COLORS[app.status] + '22', color: STATUS_COLORS[app.status], fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                            {app.status}
                          </span>
                          <span style={{ fontSize: '11px', color: '#bbb' }}>{new Date(app.created_at).toLocaleDateString('en-GB')}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.qualifications}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => sendForwardEmail(app)} disabled={!!actionLoading}
                      style={{ background: '#22c55e', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      ✅ Forward Teacher
                    </button>
                    <button onClick={() => sendToArna(app)} disabled={!!actionLoading}
                      style={{ background: '#D9A441', color: '#0a0f2e', border: 'none', padding: '7px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      📎 Send to ARNA
                    </button>
                    <button onClick={() => sendRejectionEmail(app)} disabled={!!actionLoading}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      ❌ Reject
                    </button>
                    <button onClick={() => updateStatus(app.id, 'hold')} disabled={!!actionLoading}
                      style={{ background: '#6366f1', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      ⏳ Hold
                    </button>
                    <button onClick={() => deleteApplication(app.id)} disabled={!!actionLoading}
                      style={{ background: '#f3f4f6', color: '#888', border: 'none', padding: '7px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {selectedApp && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: '20px', border: '2px solid #D9A441' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: '#0a0f2e' }}>Application Detail</div>
                  <button onClick={() => setSelectedApp(null)}
                    style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>×</button>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <img src={selectedApp.photo_url} alt={selectedApp.full_name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #D9A441' }} />
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#0a0f2e', marginTop: '10px' }}>{selectedApp.full_name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{selectedApp.nationality}</div>
                  <div style={{ fontSize: '12px', color: '#D9A441', fontWeight: '700', marginTop: '4px' }}>{selectedApp.job_title}</div>
                </div>

                {[
                  { label: 'Email', value: selectedApp.email },
                  { label: 'WhatsApp', value: selectedApp.whatsapp || '—' },
                  { label: 'Experience', value: selectedApp.experience },
                  { label: 'Qualifications', value: selectedApp.qualifications },
                ].map(row => (
                  <div key={row.label} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>{row.label}</div>
                    <div style={{ fontSize: '13px', color: '#333' }}>{row.value}</div>
                  </div>
                ))}

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>About</div>
                  <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', maxHeight: '100px', overflow: 'auto' }}>{selectedApp.about}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer"
                    style={{ background: '#0a0f2e', color: 'white', padding: '8px 14px', borderRadius: '7px', textDecoration: 'none', fontSize: '12px', fontWeight: '700' }}>
                    📄 View Resume
                  </a>
                  {selectedApp.video_url && (
                    <a href={selectedApp.video_url} target="_blank" rel="noopener noreferrer"
                      style={{ background: '#6366f1', color: 'white', padding: '8px 14px', borderRadius: '7px', textDecoration: 'none', fontSize: '12px', fontWeight: '700' }}>
                      🎥 Video
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
