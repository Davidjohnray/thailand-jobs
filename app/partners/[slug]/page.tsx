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
  facebook: string
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

const SUBJECT_OPTIONS = [
  'English', 'Math', 'Science', 'Social Studies', 'PE', 'Art',
  'Music', 'ICT / Computing', 'Thai', 'Chinese', 'Japanese',
  'Business Studies', 'Economics', 'History', 'Geography',
  'Biology', 'Chemistry', 'Physics', 'Drama', 'EFL / ESL',
]

type FormData = {
  full_name: string
  email: string
  phone: string
  nationality: string
  location: string
  experience: string
  bio: string
  subjects: string[]
  hourly_rate: string
  online_available: boolean
  video_url: string
}

const emptyForm: FormData = {
  full_name: '',
  email: '',
  phone: '',
  nationality: '',
  location: '',
  experience: '',
  bio: '',
  subjects: [],
  hourly_rate: '',
  online_available: false,
  video_url: '',
}

function whatsappLink(phone: string, message?: string) {
  const digits = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export default function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('')

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  const [partner, setPartner] = useState<Partner | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Directory form state
  const [form, setForm] = useState<FormData>(emptyForm)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitResult, setSubmitResult] = useState<'created' | 'exists' | null>(null)
  const [error, setError] = useState('')

  const photoRef = useRef<HTMLInputElement>(null)
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

  const updateForm = (field: keyof FormData, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleSubject = (subject: string) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!form.full_name.trim() || !form.email.trim()) {
      setError('Please fill in your name and email address')
      return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    // Photo OR video required
    if (!photoFile && !form.video_url.trim()) {
      setError('Please add a profile photo or a video introduction link — at least one is required')
      return
    }
    if (!partner) return

    setSubmitting(true)
    setError('')

    try {
      // Check for duplicate email
      const { data: existing } = await supabase
        .from('teachers')
        .select('id')
        .eq('email', form.email.trim().toLowerCase())
        .maybeSingle()

      if (existing) {
        setSubmitResult('exists')
        setSubmitted(true)
        setSubmitting(false)
        return
      }

      // Upload photo if provided
      let photoUrl: string | null = null
      if (photoFile) {
        const photoExt = photoFile.name.split('.').pop()
        const photoFilename = `${Date.now()}-${form.full_name.replace(/\s+/g, '-').toLowerCase()}.${photoExt}`
        const { error: photoError } = await supabase.storage
          .from('teacher-photos')
          .upload(photoFilename, photoFile, { upsert: false })
        if (!photoError) {
          const { data: photoData } = supabase.storage
            .from('teacher-photos')
            .getPublicUrl(photoFilename)
          photoUrl = photoData.publicUrl
        }
      }

      // Generate slug
      const teacherSlug = form.full_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4)

      const { error: dbError } = await supabase.from('teachers').insert([{
        name: form.full_name,
        email: form.email.trim().toLowerCase(),
        phone: form.phone || null,
        nationality: form.nationality || null,
        location: form.location || null,
        experience_years: form.experience || null,
        bio: form.bio || null,
        subjects: form.subjects.length > 0 ? form.subjects : null,
        hourly_rate: form.hourly_rate || null,
        online_available: form.online_available,
        photo_url: photoUrl,
        video_url: form.video_url.trim() || null,
        slug: teacherSlug,
        status: 'pending',
        active: false,
        template: 'modern',
        source: 'teach-bridge-form',
      }])

      if (dbError) throw new Error('Submission failed: ' + dbError.message)

      setSubmitResult('created')
      setSubmitted(true)
      setForm(emptyForm)
      setPhotoFile(null)
      setPhotoPreview(null)
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
              {partner.facebook && (
                <a href={partner.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#1877F2', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                  📘 Follow on Facebook
                </a>
              )}
              {partner.phone && (
                <a href={whatsappLink(partner.phone)} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                  💬 WhatsApp Us
                </a>
              )}
              {partner.email && (
                <a href={`mailto:${partner.email}`}
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
                  ✉️ {partner.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* HOW IT WORKS */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px' }}>📋 How to Apply</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { step: '1', icon: '💼', title: 'Find a job below', desc: 'Browse current vacancies from ' + partner.name },
              { step: '2', icon: '💬', title: 'Apply via WhatsApp', desc: 'Click Apply — send your CV and cover message directly to ' + partner.name },
              { step: '3', icon: '🎓', title: 'Add your profile', desc: 'Fill in the form below to add yourself to the Teacher Directory for free' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ background: '#E85D26', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a1a2e', marginBottom: '3px' }}>{s.icon} {s.title}</div>
                  <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.5' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JOBS */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Current Vacancies</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
            {jobs.length > 0 ? `${jobs.length} job${jobs.length !== 1 ? 's' : ''} available right now` : 'Check back soon for new vacancies'}
          </p>

          {jobs.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <p style={{ marginBottom: '8px' }}>No vacancies listed right now.</p>
              <p style={{ fontSize: '14px' }}>Add your profile below and {partner.name} will contact you when a suitable role comes up.</p>
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
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                      <Link href={`/jobs/${job.id}`} target="_blank"
                        style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                        View Job
                      </Link>
                      {partner.phone && (
                        <a
                          href={whatsappLink(partner.phone, `Hi ${partner.name}, I'd like to apply for the ${job.title} position (${job.company}, ${job.location}). Please find my CV attached.`)}
                          target="_blank" rel="noopener noreferrer"
                          style={{ background: '#25D366', color: 'white', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                          💬 Apply via WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TEACHER DIRECTORY FORM */}
        <div ref={formRef} style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '2px solid #7C3AED' }}>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              {submitResult === 'exists' ? (
                <>
                  <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎓</div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Already in the Directory!</h3>
                  <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                    We found an existing profile for that email address. You're already listed in the Teacher Directory — no duplicate created.
                  </p>
                  <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px 20px', marginBottom: '24px', color: '#2D6BE4', fontSize: '14px' }}>
                    💡 Want to update your profile? <a href="/teachers/register" style={{ color: '#2D6BE4', fontWeight: 'bold' }}>Visit your profile page</a> or contact us.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Profile Submitted!</h3>
                  <p style={{ color: '#666', fontSize: '15px', marginBottom: '16px', maxWidth: '440px', margin: '0 auto 16px' }}>
                    Your Teacher Directory profile has been created and is pending review. Once approved, schools across Thailand will be able to find you directly!
                  </p>
                  <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '14px 20px', marginBottom: '24px', color: '#16a34a', fontSize: '14px', fontWeight: 'bold' }}>
                    🎉 You'll appear at <strong>jobsinthailand.net/teachers</strong> once approved — usually within 24 hours.
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => { setSubmitted(false); setSubmitResult(null) }}
                  style={{ background: '#7C3AED', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                  Back to Page
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
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#7C3AED', margin: '0 0 6px' }}>🎓 Add Yourself to the Teacher Directory</h2>
                <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
                  Free to join. Schools across Thailand search this directory to find teachers directly. A photo or video is required.
                </p>
              </div>

              {/* BASIC DETAILS */}
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
                  <label style={labelStyle}>Phone / WhatsApp</label>
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

              {/* BIO */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>About Me</label>
                <textarea value={form.bio} onChange={e => updateForm('bio', e.target.value)}
                  placeholder="Write a short intro — your teaching style, experience, and what makes you a great teacher. 3-5 sentences is ideal."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* SUBJECTS */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Subjects You Teach</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SUBJECT_OPTIONS.map(subject => (
                    <button key={subject} type="button" onClick={() => toggleSubject(subject)}
                      style={{ padding: '6px 14px', borderRadius: '20px', border: '2px solid', borderColor: form.subjects.includes(subject) ? '#7C3AED' : '#ddd', background: form.subjects.includes(subject) ? '#7C3AED' : 'white', color: form.subjects.includes(subject) ? 'white' : '#555', fontSize: '13px', fontWeight: form.subjects.includes(subject) ? 'bold' : 'normal', cursor: 'pointer' }}>
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* HOURLY RATE + ONLINE */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Expected Hourly Rate (optional)</label>
                  <input value={form.hourly_rate} onChange={e => updateForm('hourly_rate', e.target.value)}
                    placeholder="e.g. 500 THB/hr or negotiable" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Available for Online Teaching?</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    {[{ label: '✅ Yes', value: true }, { label: '❌ No', value: false }].map(opt => (
                      <button key={String(opt.value)} type="button" onClick={() => updateForm('online_available', opt.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid', borderColor: form.online_available === opt.value ? '#7C3AED' : '#ddd', background: form.online_available === opt.value ? '#f8f4ff' : 'white', color: form.online_available === opt.value ? '#7C3AED' : '#555', fontWeight: form.online_available === opt.value ? 'bold' : 'normal', cursor: 'pointer', fontSize: '13px' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHOTO + VIDEO — at least one required */}
              <div style={{ background: '#fdf4ff', border: '2px solid #e9d5ff', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#7C3AED', marginBottom: '6px' }}>
                  📸 Photo & Video <span style={{ background: '#7C3AED', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', marginLeft: '6px' }}>At least one required</span>
                </div>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Add a profile photo, a video introduction link, or both. This greatly increases your chances of being contacted by schools.</p>

                {/* PHOTO UPLOAD */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Profile Photo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview"
                        style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #7C3AED', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👤</div>
                    )}
                    <div>
                      <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                      <button type="button" onClick={() => photoRef.current?.click()}
                        style={{ background: '#7C3AED', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                        {photoPreview ? '📷 Change Photo' : '📷 Upload Photo'}
                      </button>
                      <span style={{ color: '#888', fontSize: '12px' }}>JPG or PNG • Clear headshot works best</span>
                    </div>
                  </div>
                </div>

                {/* VIDEO LINK */}
                <div>
                  <label style={labelStyle}>🎥 Video Introduction Link</label>
                  <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                    <p style={{ color: '#2D6BE4', fontWeight: 'bold', fontSize: '13px', margin: '0 0 6px' }}>📱 How to add a video intro (Google Drive):</p>
                    <ol style={{ color: '#555', fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                      <li>Record a short 1-2 minute intro on your phone</li>
                      <li>Upload to <strong>Google Drive</strong></li>
                      <li>Tap <strong>Share → Anyone with the link → Copy link</strong></li>
                      <li>Paste below</li>
                    </ol>
                    <p style={{ color: '#888', fontSize: '12px', margin: '8px 0 0' }}>YouTube or Loom also works!</p>
                  </div>
                  <input
                    value={form.video_url}
                    onChange={e => updateForm('video_url', e.target.value)}
                    placeholder="Paste your Google Drive / YouTube / Loom link here..."
                    style={inputStyle}
                  />
                </div>
              </div>

              {error && (
                <div style={{ background: '#ffeaea', borderRadius: '8px', padding: '12px 16px', color: '#c62828', fontSize: '14px', marginBottom: '16px' }}>
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handleSubmit} disabled={submitting}
                style={{ width: '100%', background: submitting ? '#ccc' : '#7C3AED', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? '⏳ Submitting...' : '🎓 Add Me to the Teacher Directory'}
              </button>

              <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
                Your profile will be reviewed before going live — usually within 24 hours. Free forever, no fees.
              </p>
            </>
          )}
        </div>

      </div>
    </main>
  )
}
