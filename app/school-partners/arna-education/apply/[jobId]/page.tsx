'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../../src/lib/supabase'

const NATIONALITIES = [
  'American', 'Australian', 'British', 'Canadian', 'Filipino',
  'Irish', 'New Zealander', 'Scottish', 'South African', 'Welsh', 'Other'
]

const EXPERIENCE_OPTIONS = [
  'Less than 1 year', '1–2 years', '3–5 years', '5–10 years', '10+ years'
]

export default function ArnaApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const [jobId, setJobId] = useState('')
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [resumeUploading, setResumeUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const [resumeName, setResumeName] = useState('')
  const [nationalityOther, setNationalityOther] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    nationality: '',
    whatsapp: '',
    qualifications: '',
    experience: '',
    photo_url: '',
    resume_url: '',
    video_url: '',
    about: '',
  })

  useEffect(() => {
    params.then(p => setJobId(p.jobId))
  }, [])

  useEffect(() => {
    if (!jobId) return
    const fetchJob = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, location, job_type, salary, company')
        .eq('id', jobId)
        .single()
      setJob(data)
      setLoading(false)
    }
    fetchJob()
  }, [jobId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Photo must be under 5MB.'); return }
    setPhotoUploading(true)
    setError('')
    const ext = file.name.split('.').pop()
    const fileName = `arna-applications/${Date.now()}-photo.${ext}`
    const { error: uploadError } = await supabase.storage.from('teacher-images').upload(fileName, file, { upsert: false })
    if (uploadError) { setError('Photo upload failed. Please try again.'); setPhotoUploading(false); return }
    const { data: urlData } = supabase.storage.from('teacher-images').getPublicUrl(fileName)
    setForm(prev => ({ ...prev, photo_url: urlData.publicUrl }))
    setPhotoPreview(urlData.publicUrl)
    setPhotoUploading(false)
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setError('Resume must be under 10MB.'); return }
    setResumeUploading(true)
    setError('')
    const ext = file.name.split('.').pop()
    const fileName = `arna-applications/${Date.now()}-resume.${ext}`
    const { error: uploadError } = await supabase.storage.from('teacher-images').upload(fileName, file, { upsert: false })
    if (uploadError) { setError('Resume upload failed. Please try again.'); setResumeUploading(false); return }
    const { data: urlData } = supabase.storage.from('teacher-images').getPublicUrl(fileName)
    setForm(prev => ({ ...prev, resume_url: urlData.publicUrl }))
    setResumeName(file.name)
    setResumeUploading(false)
  }

  const handleSubmit = async () => {
    setError('')
    const finalNationality = form.nationality === 'Other' ? nationalityOther.trim() : form.nationality
    if (!finalNationality) { setError('Please select your nationality.'); return }
    if (!form.full_name.trim()) { setError('Please enter your full name.'); return }
    if (!form.email.trim()) { setError('Please enter your email address.'); return }
    if (!form.photo_url) { setError('Please upload a profile photo — this is required.'); return }
    if (!form.resume_url) { setError('Please upload your resume/CV — this is required.'); return }
    if (!form.qualifications.trim()) { setError('Please enter your qualifications.'); return }
    if (!form.experience) { setError('Please select your experience level.'); return }
    if (!form.about.trim()) { setError('Please write a short introduction about yourself.'); return }

    setSubmitting(true)
    const { error: insertError } = await supabase
      .from('arna_applications')
      .insert({
        job_id: parseInt(jobId),
        ...form,
        nationality: finalNationality,
        status: 'pending',
      })
    if (insertError) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }
    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa', padding: '60px 16px', textAlign: 'center', color: '#888' }}>Loading...</main>
  )

  if (!job) return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa', padding: '60px 16px', textAlign: 'center', color: '#888' }}>
      Job not found. <Link href="/schools/arna-education" style={{ color: '#D9A441' }}>Back to ARNA</Link>
    </main>
  )

  if (submitted) return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa', padding: '60px 16px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0a0f2e', marginBottom: '12px' }}>Application Submitted!</h2>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.8', marginBottom: '8px' }}>
          Thank you for applying for <strong>{job.title}</strong>.
        </p>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.8', marginBottom: '24px' }}>
          Your application has been received and will be reviewed by our team. If your profile is a good match, we will be in touch to let you know it has been forwarded to ARNA Education & Services.
        </p>
        <Link href="/schools/arna-education"
          style={{ background: '#D9A441', color: '#0a0f2e', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '15px', display: 'inline-block' }}>
          View More Vacancies →
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px 16px' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>

        <Link href="/schools/arna-education" style={{ fontSize: '13px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
          ← Back to ARNA vacancies
        </Link>

        {/* Job header */}
        <div style={{ background: 'linear-gradient(135deg, #0a0f2e, #1a2060)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#D9A441', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Applying for</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'white', marginBottom: '6px' }}>{job.title}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
            ARNA Education & Services{job.location && ` · ${job.location}`}{job.job_type && ` · ${job.job_type}`}
          </div>
          {job.salary && <div style={{ fontSize: '14px', color: '#D9A441', fontWeight: '700', marginTop: '8px' }}>{job.salary}</div>}
        </div>

        {/* Important notice */}
        <div style={{ background: '#fff8e6', border: '1px solid #D9A441', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', fontSize: '13px', color: '#7a5c00' }}>
          <strong>📋 Please note:</strong> A profile photo and resume/CV are required to apply. Applications without these cannot be submitted. All applications are reviewed by our team before being forwarded to ARNA.
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <div style={{ borderLeft: '4px solid #D9A441', paddingLeft: '12px', marginBottom: '24px' }}>
            <div style={{ fontSize: '17px', fontWeight: '900', color: '#0a0f2e' }}>Your Application</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>All fields marked * are required</div>
          </div>

          {/* Basic info */}
          {[
            { label: 'Full name', name: 'full_name', type: 'text', placeholder: 'e.g. Sarah Johnson', required: true },
            { label: 'Email address', name: 'email', type: 'email', placeholder: 'your@email.com', required: true },
            { label: 'WhatsApp number', name: 'whatsapp', type: 'text', placeholder: '+66... or local number', required: false },
            { label: 'Qualifications', name: 'qualifications', type: 'text', placeholder: 'e.g. BA Education, TEFL 120hr, PGCE', required: true },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '600' }}>
                {field.label} {field.required && <span style={{ color: '#c0392b' }}>*</span>}
              </label>
              <input type={field.type} name={field.name} value={form[field.name as keyof typeof form]}
                onChange={handleChange} placeholder={field.placeholder}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}

          {/* Nationality */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '600' }}>
              Nationality <span style={{ color: '#c0392b' }}>*</span>
            </label>
            <select name="nationality" value={form.nationality} onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
              <option value="">Select...</option>
              {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {form.nationality === 'Other' && (
              <input type="text" placeholder="Please type your nationality" value={nationalityOther}
                onChange={e => setNationalityOther(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', marginTop: '8px', boxSizing: 'border-box' }} />
            )}
          </div>

          {/* Experience */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '600' }}>
              Teaching experience <span style={{ color: '#c0392b' }}>*</span>
            </label>
            <select name="experience" value={form.experience} onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
              <option value="">Select...</option>
              {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Photo upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '600' }}>
              Profile photo <span style={{ color: '#c0392b' }}>*</span> <span style={{ color: '#888', fontWeight: '400' }}>(required to apply)</span>
            </label>
            <div style={{ border: '2px dashed #ddd', borderRadius: '10px', padding: '20px', textAlign: 'center', background: '#fafafa' }}>
              {photoPreview ? (
                <div>
                  <img src={photoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '3px solid #D9A441' }} />
                  <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700', marginBottom: '8px' }}>✓ Photo uploaded</div>
                  <label style={{ fontSize: '12px', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
                    Change photo <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>Upload a clear professional photo</div>
                  <label style={{ display: 'inline-block', background: '#0a0f2e', color: 'white', padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: photoUploading ? 'not-allowed' : 'pointer' }}>
                    {photoUploading ? 'Uploading...' : 'Choose photo'}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={photoUploading} />
                  </label>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '8px' }}>JPG, PNG — max 5MB</div>
                </div>
              )}
            </div>
          </div>

          {/* Resume upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '600' }}>
              Resume / CV <span style={{ color: '#c0392b' }}>*</span> <span style={{ color: '#888', fontWeight: '400' }}>(required to apply)</span>
            </label>
            <div style={{ border: '2px dashed #ddd', borderRadius: '10px', padding: '20px', textAlign: 'center', background: '#fafafa' }}>
              {resumeName ? (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                  <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: '700', marginBottom: '6px' }}>✓ Resume uploaded</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{resumeName}</div>
                  <label style={{ fontSize: '12px', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
                    Replace resume <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>Upload your resume or CV</div>
                  <label style={{ display: 'inline-block', background: '#0a0f2e', color: 'white', padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: resumeUploading ? 'not-allowed' : 'pointer' }}>
                    {resumeUploading ? 'Uploading...' : 'Choose file'}
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} disabled={resumeUploading} />
                  </label>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '8px' }}>PDF, DOC, DOCX — max 10MB</div>
                </div>
              )}
            </div>
          </div>

          {/* Video intro (optional) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '600' }}>
              Introduction video link <span style={{ color: '#888', fontWeight: '400' }}>(optional but recommended)</span>
            </label>
            <input type="text" name="video_url" value={form.video_url} onChange={handleChange}
              placeholder="YouTube or Google Drive link — 1 to 2 minute intro"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* About */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '600' }}>
              About you <span style={{ color: '#c0392b' }}>*</span>
            </label>
            <textarea name="about" value={form.about} onChange={handleChange} rows={4}
              placeholder="Tell us about yourself, your teaching experience, and why you are interested in this position..."
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          <div style={{ background: '#f0f7f4', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#555', display: 'flex', gap: '8px' }}>
            <span>🔒</span>
            <span>Your details are reviewed by our team before being forwarded. We will email you to let you know the status of your application.</span>
          </div>

          {error && (
            <div style={{ background: '#FDE8E0', color: '#993C1D', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting || photoUploading || resumeUploading}
            style={{ background: submitting ? '#888' : '#D9A441', color: '#0a0f2e', border: 'none', padding: '14px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: '900', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%' }}>
            {submitting ? 'Submitting...' : 'Submit Application →'}
          </button>
        </div>
      </div>
    </main>
  )
}
