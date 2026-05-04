'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Partner = {
  id: string
  slug: string
  name: string
  logo_url: string
  description: string
  website: string
  email: string
  phone: string
  line_id: string
  active: boolean
}

type Job = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  job_type: string
  category: string
  description: string
  created_at: string
  expires_at: string
  visa_sponsor: boolean
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
  fontFamily: 'inherit',
}

const labelStyle = {
  fontSize: '13px',
  fontWeight: 'bold' as const,
  color: '#555',
  display: 'block' as const,
  marginBottom: '6px',
}

type FormData = {
  full_name: string
  email: string
  phone: string
  nationality: string
  location: string
  experience: string
  cover_note: string
}

const emptyForm: FormData = {
  full_name: '',
  email: '',
  phone: '',
  nationality: '',
  location: '',
  experience: '',
  cover_note: '',
}

export default function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('')

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])
  const [partner, setPartner] = useState<Partner | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'jobs' | 'drop-cv' | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
  if (!slug) return
  const load = async () => {
    const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single()

      if (!partnerData) { setLoading(false); return }
      setPartner(partnerData)

      const now = new Date().toISOString()
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('partner_id', partnerData.id)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })

      setJobs(jobData || [])
      setLoading(false)
    }
    load()
  }, [slug])

  const updateForm = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
      setError('')
    } else {
      setError('Please upload a PDF file only')
      setCvFile(null)
    }
  }

  const openApply = (job: Job) => {
    setSelectedJob(job)
    setActiveSection('drop-cv')
    setSubmitted(false)
    setForm(emptyForm)
    setCvFile(null)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const openDropCV = () => {
    setSelectedJob(null)
    setActiveSection('drop-cv')
    setSubmitted(false)
    setForm(emptyForm)
    setCvFile(null)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.email.trim()) {
      setError('Please fill in your name and email')
      return
    }
    if (!cvFile) {
      setError('Please upload your CV as a PDF')
      return
    }
    if (!partner) return

    setSubmitting(true)
    setError('')

    try {
      // Upload CV to Supabase Storage
      const filename = `${Date.now()}-${form.full_name.replace(/\s+/g, '-').toLowerCase()}.pdf`
      const { error: uploadError } = await supabase.storage
        .from('partner-cvs')
        .upload(`${partner.slug}/${filename}`, cvFile, { upsert: false })

      if (uploadError) throw new Error('CV upload failed: ' + uploadError.message)

      const { data: urlData } = supabase.storage
        .from('partner-cvs')
        .getPublicUrl(`${partner.slug}/${filename}`)

      // Save to partner_cvs table
      const { error: dbError } = await supabase.from('partner_cvs').insert([{
        partner_id: partner.id,
        partner_slug: partner.slug,
        job_id: selectedJob?.id || null,
        job_title: selectedJob?.title || null,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        nationality: form.nationality,
        location: form.location,
        experience: form.experience,
        cover_note: form.cover_note,
        cv_url: urlData.publicUrl,
        submitted_at: new Date().toISOString(),
        status: 'new',
      }])

      if (dbError) throw new Error('Submission failed: ' + dbError.message)

      setSubmitted(true)
      setForm(emptyForm)
      setCvFile(null)
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    }

    setSubmitting(false)
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <p style={{ color: '#888', fontSize: '16px' }}>Loading...</p>
    </main>
  )

  if (!partner) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '48px' }}>🔍</div>
      <h1 style={{ fontSize: '24px', color: '#1a1a2e' }}>Partner not found</h1>
      <Link href="/jobs" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold' }}>Browse all jobs →</Link>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {partner.logo_url && (
            <img src={partner.logo_url} alt={partner.name}
              style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'contain', background: 'white', padding: '12px', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>⭐ OFFICIAL PARTNER</span>
            </div>
            <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>{partner.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: '0 0 16px', lineHeight: '1.6', maxWidth: '560px' }}>{partner.description}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {partner.website && (
                <a href={partner.website} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#E85D26', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                  🌐 Visit Website
                </a>
              )}
              {partner.email && (
                <a href={`mailto:${partner.email}`}
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
                  ✉️ {partner.email}
                </a>
              )}
              {partner.line_id && (
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px' }}>
                  💬 LINE: {partner.line_id}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '16px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#555' }}>Quick actions:</span>
          <button onClick={() => setActiveSection(activeSection === 'jobs' ? null : 'jobs')}
            style={{ background: activeSection === 'jobs' ? '#1a1a2e' : 'white', color: activeSection === 'jobs' ? 'white' : '#1a1a2e', border: '2px solid #1a1a2e', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            💼 View All Jobs ({jobs.length})
          </button>
          <button onClick={openDropCV}
            style={{ background: activeSection === 'drop-cv' && !selectedJob ? '#E85D26' : 'white', color: activeSection === 'drop-cv' && !selectedJob ? 'white' : '#E85D26', border: '2px solid #E85D26', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            📋 Drop My CV
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* JOBS LIST */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>Current Vacancies</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>{jobs.length > 0 ? `${jobs.length} jobs available right now` : 'Check back soon for new vacancies'}</p>

          {jobs.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <p style={{ marginBottom: '16px' }}>No vacancies listed right now.</p>
              <p style={{ fontSize: '14px' }}>Drop your CV below and {partner.name} will be in touch when a suitable role comes up.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {jobs.map(job => (
                <div key={job.id} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 6px' }}>{job.title}</h3>
                      <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{job.company} • {job.location}</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>{job.job_type}</span>
                        <span style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>{job.category}</span>
                        {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa Sponsor</span>}
                        <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>{job.salary}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <Link href={`/jobs/${job.id}`} target="_blank"
                        style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                        View Job
                      </Link>
                      <button onClick={() => openApply(job)}
                        style={{ background: '#E85D26', color: 'white', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                        Apply + CV →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CV FORM */}
        {activeSection === 'drop-cv' && (
          <div ref={formRef} style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: selectedJob ? '2px solid #E85D26' : '2px solid #1a1a2e' }}>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>CV Submitted!</h3>
                <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px' }}>
                  {selectedJob
                    ? `Your application for ${selectedJob.title} has been sent to ${partner.name}.`
                    : `Your CV has been sent directly to ${partner.name}.`}
                  <br />They will be in touch if there's a suitable match.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => { setSubmitted(false); setSelectedJob(null); setActiveSection(null) }}
                    style={{ background: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    Back to Jobs
                  </button>
                  <Link href="/jobs"
                    style={{ background: '#f0f0f0', color: '#555', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                    Browse All Jobs
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  {selectedJob ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>APPLYING FOR</span>
                        <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '13px' }}>✕ Clear</button>
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>{selectedJob.title}</h2>
                      <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{selectedJob.company} • {selectedJob.location} • {selectedJob.salary}</p>
                    </>
                  ) : (
                    <>
                      <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 6px' }}>📋 Drop Your CV</h2>
                      <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Submit your CV directly to {partner.name} — they'll contact you when a suitable position comes up.</p>
                    </>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input value={form.full_name} onChange={e => updateForm('full_name', e.target.value)}
                      placeholder="John Smith" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input value={form.email} onChange={e => updateForm('email', e.target.value)}
                      placeholder="john@email.com" type="email" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input value={form.phone} onChange={e => updateForm('phone', e.target.value)}
                      placeholder="+66 12 345 6789" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nationality</label>
                    <input value={form.nationality} onChange={e => updateForm('nationality', e.target.value)}
                      placeholder="e.g. British" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Current Location</label>
                    <input value={form.location} onChange={e => updateForm('location', e.target.value)}
                      placeholder="e.g. Bangkok, Thailand" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Years of Experience</label>
                    <select value={form.experience} onChange={e => updateForm('experience', e.target.value)} style={inputStyle}>
                      <option value="">Select...</option>
                      <option>No experience (looking to start)</option>
                      <option>Less than 1 year</option>
                      <option>1-2 years</option>
                      <option>3-5 years</option>
                      <option>5-10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Cover Note (optional)</label>
                  <textarea value={form.cover_note} onChange={e => updateForm('cover_note', e.target.value)}
                    placeholder={selectedJob ? `Tell ${partner.name} why you're a great fit for this role...` : `Tell ${partner.name} a little about yourself and what you're looking for...`}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Upload CV (PDF only) *</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{ border: '2px dashed', borderColor: cvFile ? '#22c55e' : '#ddd', borderRadius: '10px', padding: '28px', textAlign: 'center', cursor: 'pointer', background: cvFile ? '#f0fdf4' : '#fafafa', transition: 'all 0.2s' }}>
                    <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                    {cvFile ? (
                      <>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                        <p style={{ color: '#16a34a', fontWeight: 'bold', margin: '0 0 4px' }}>{cvFile.name}</p>
                        <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Click to change file</p>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                        <p style={{ color: '#555', fontWeight: 'bold', margin: '0 0 4px' }}>Click to upload your CV</p>
                        <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>PDF files only • Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                {error && (
                  <div style={{ background: '#ffeaea', borderRadius: '8px', padding: '12px 16px', color: '#c62828', fontSize: '14px', marginBottom: '16px' }}>
                    ⚠️ {error}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={submitting}
                  style={{ width: '100%', background: submitting ? '#ccc' : '#E85D26', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? '⏳ Submitting...' : selectedJob ? `📨 Apply for ${selectedJob.title}` : `📋 Submit CV to ${partner.name}`}
                </button>

                <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
                  Your details will only be shared with {partner.name} and will not be used for any other purpose.
                </p>
              </>
            )}
          </div>
        )}

        {/* GENERAL DROP CV CTA (always visible at bottom) */}
        {activeSection !== 'drop-cv' && (
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', borderRadius: '16px', padding: '36px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>Don't see a job that fits?</h3>
            <p style={{ opacity: 0.8, fontSize: '15px', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
              Drop your CV directly with {partner.name} and they'll contact you when the right role comes up.
            </p>
            <button onClick={openDropCV}
              style={{ background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              Drop My CV →
            </button>
          </div>
        )}

      </div>
    </main>
  )
}
