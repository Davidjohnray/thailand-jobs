'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

interface School {
  id: string
  name: string
  slug: string
  programme: string
  location: string
  banner_url: string
  website_url: string
  description: string
  founded: string
  students: string
  school_type: string
  address: string
  facebook_url: string
  line_id: string
}

interface Vacancy {
  id: number
  title: string
  location: string
  job_type: string
  created_at: string
}

const NATIONALITIES = [
  'American', 'Australian', 'British', 'Canadian', 'Filipino',
  'Irish', 'New Zealander', 'Scottish', 'South African', 'Welsh', 'Other'
]

const EXPERIENCE_OPTIONS = [
  'Less than 1 year', '1–2 years', '3–5 years', '5–10 years', '10+ years'
]

export default function SchoolSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('')
  const [school, setSchool] = useState<School | null>(null)
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const [nationalityOther, setNationalityOther] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    nationality: '',
    whatsapp: '',
    line_id: '',
    available_from: '',
    subjects: '',
    qualifications: '',
    experience: '',
    photo_url: '',
    video_url: '',
    about: '',
  })

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [])

  useEffect(() => {
    if (!slug) return
    const fetchSchool = async () => {
      const { data } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single()

      if (data) {
        setSchool(data)
        const { data: vacData } = await supabase
          .from('jobs')
          .select('id, title, location, job_type, created_at')
          .eq('school_id', data.id)
          .order('created_at', { ascending: false })
        setVacancies((vacData as Vacancy[]) || [])
      }
      setLoading(false)
    }
    fetchSchool()
  }, [slug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5MB.')
      return
    }
    setPhotoUploading(true)
    setError('')
    const ext = file.name.split('.').pop()
    const fileName = `school-registrations/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('teacher-images')
      .upload(fileName, file, { upsert: false })
    if (uploadError) {
      setError('Photo upload failed. Please try again.')
      setPhotoUploading(false)
      return
    }
    const { data: urlData } = supabase.storage
      .from('teacher-images')
      .getPublicUrl(fileName)
    setForm(prev => ({ ...prev, photo_url: urlData.publicUrl }))
    setPhotoPreview(urlData.publicUrl)
    setPhotoUploading(false)
  }

  const handleSubmit = async () => {
    setError('')
    const finalNationality = form.nationality === 'Other' ? nationalityOther.trim() : form.nationality
    if (!finalNationality) {
      setError('Please enter your nationality.')
      return
    }
    const required = ['full_name', 'email', 'whatsapp', 'available_from', 'subjects', 'qualifications', 'experience', 'photo_url', 'video_url', 'about']
    for (const field of required) {
      if (!form[field as keyof typeof form].trim()) {
        setError('Please fill in all required fields before submitting.')
        return
      }
    }
    setSubmitting(true)
    const { error: insertError } = await supabase
      .from('school_registrations')
      .insert({
        school_id: school!.id,
        ...form,
        nationality: finalNationality,
      })
    if (insertError) {
      if (insertError.code === '23505') {
        setError('You have already registered your interest with this school. We will be in touch!')
      } else {
        setError('Something went wrong. Please try again.')
      }
      setSubmitting(false)
      return
    }
    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '60px 16px', textAlign: 'center', color: '#888' }}>
      Loading...
    </main>
  )

  if (!school) return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '60px 16px', textAlign: 'center', color: '#888' }}>
      School not found. <Link href="/schools" style={{ color: '#E85D26' }}>Back to schools</Link>
    </main>
  )

  const accentColor = '#1a5c3a'

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '40px 16px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <Link href="/schools" style={{ fontSize: '13px', color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
          ← Back to all schools
        </Link>

        {/* Hero banner */}
        <div style={{ borderRadius: '14px', overflow: 'hidden', position: 'relative', marginBottom: '24px' }}>
          {school.banner_url ? (
            <img src={school.banner_url} alt={school.name}
              style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
          ) : (
            <div style={{ height: '220px', background: accentColor }} />
          )}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(0,0,0,0.55)', padding: '16px 24px'
          }}>
            <div style={{ fontSize: '11px', color: '#a8d5bc', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
              Official teacher recruitment page
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', lineHeight: '1.3' }}>
              {school.name}
            </div>
            {school.programme && (
              <div style={{ fontSize: '14px', color: '#c8e6d5', marginTop: '3px' }}>{school.programme}</div>
            )}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ background: '#22c55e', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>
                Actively hiring
              </span>
              {school.website_url && (
                <a href={school.website_url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: '#a8d5bc', textDecoration: 'none' }}>
                  🔗 School website
                </a>
              )}
              {school.facebook_url && (
                <a href={school.facebook_url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: '#a8d5bc', textDecoration: 'none' }}>
                  📘 Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        {/* About the school */}
        {(school.description || school.founded || school.students || school.address) && (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '22px 24px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '16px' }}>
              About the school
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '18px' }}>
              {school.school_type && (
                <div style={{ background: '#f0f7f4', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>🏫</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a5c3a' }}>{school.school_type}</div>
                </div>
              )}
              {school.founded && (
                <div style={{ background: '#f0f7f4', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>📅</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a5c3a' }}>{school.founded}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Founded</div>
                </div>
              )}
              {school.students && (
                <div style={{ background: '#f0f7f4', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>👨‍🎓</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a5c3a' }}>{school.students}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Students</div>
                </div>
              )}
            </div>

            {/* Description */}
            {school.description && (
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.8', marginBottom: '16px' }}>
                {school.description}
              </p>
            )}

            {/* Address & contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {school.address && (
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span>📍</span>
                  <span>{school.address}</span>
                </div>
              )}
              {school.line_id && (
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>💬</span>
                  <span>LINE: {school.line_id}</span>
                </div>
              )}
              {school.website_url && (
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>🌐</span>
                  <a href={school.website_url} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: 'none', fontWeight: '500' }}>
                    {school.website_url.replace('https://', '')}
                  </a>
                </div>
              )}
              {school.facebook_url && (
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>📘</span>
                  <a href={school.facebook_url} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: 'none', fontWeight: '500' }}>
                    Facebook page
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vacancies */}
        {vacancies.length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '20px 22px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '14px' }}>
              Current vacancies
            </div>
            {vacancies.map((v) => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <Link href={`/jobs/${v.id}`} style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', textDecoration: 'none' }}>
                    {v.title}
                  </Link>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                    {v.location && `${v.location}`}{v.job_type && ` · ${v.job_type}`}
                  </div>
                </div>
                <Link href={`/jobs/${v.id}`} style={{ background: '#1a5c3a', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  View job →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {!showForm && !submitted && (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8e8e8', borderLeft: `4px solid ${accentColor}`, padding: '22px 24px' }}>
            <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>
              Interested in working here?
            </div>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '18px' }}>
              Even if none of the above roles match right now, register your profile below. The team reviews all submissions and will reach out directly when a suitable vacancy opens up.
            </p>
            <button onClick={() => setShowForm(true)} style={{ background: accentColor, color: 'white', border: 'none', padding: '13px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
              Register my interest →
            </button>
          </div>
        )}

        {/* Registration form */}
        {showForm && !submitted && (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '24px' }}>
            <div style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a1a' }}>Register your interest</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>{school.name} · All fields are required</div>
            </div>

            {[
              { label: 'Full name', name: 'full_name', type: 'text', placeholder: 'e.g. Sarah Johnson' },
              { label: 'Email address', name: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'WhatsApp / LINE ID', name: 'whatsapp', type: 'text', placeholder: '+66... or LINE ID' },
              { label: 'LINE ID (optional)', name: 'line_id', type: 'text', placeholder: 'Your LINE ID', required: false },
              { label: 'Available from', name: 'available_from', type: 'text', placeholder: 'e.g. May 2025' },
              { label: 'Subject(s) you can teach', name: 'subjects', type: 'text', placeholder: 'e.g. English, Science, Maths, Kindergarten' },
              { label: 'Qualifications', name: 'qualifications', type: 'text', placeholder: 'e.g. BA Education, TEFL 120hr, PGCE' },
              { label: 'Introduction video link', name: 'video_url', type: 'text', placeholder: 'YouTube or Google Drive — 1 to 2 minute intro recommended' },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>
                  {field.label} {field.required !== false && <span style={{ color: '#c0392b' }}>*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', outline: 'none' }}
                />
              </div>
            ))}

            {/* Nationality */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>
                Nationality <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <select name="nationality" value={form.nationality} onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a' }}>
                <option value="">Select...</option>
                {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              {form.nationality === 'Other' && (
                <input type="text" placeholder="Please type your nationality" value={nationalityOther}
                  onChange={e => setNationalityOther(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', outline: 'none', marginTop: '8px' }}
                />
              )}
            </div>

            {/* Experience */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>
                Years of teaching experience <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <select name="experience" value={form.experience} onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a' }}>
                <option value="">Select...</option>
                {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Photo upload */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>
                Profile photo <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <div style={{ border: '2px dashed #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#fafafa' }}>
                {photoPreview ? (
                  <div>
                    <img src={photoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '3px solid #e8e8e8' }} />
                    <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 'bold', marginBottom: '8px' }}>✓ Photo uploaded</div>
                    <label style={{ fontSize: '12px', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
                      Change photo
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                    <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>Upload a clear photo of yourself</div>
                    <label style={{ display: 'inline-block', background: accentColor, color: 'white', padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: photoUploading ? 'not-allowed' : 'pointer' }}>
                      {photoUploading ? 'Uploading...' : 'Choose photo'}
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={photoUploading} />
                    </label>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '8px' }}>JPG, PNG — max 5MB</div>
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>
                About you <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <textarea name="about" value={form.about} onChange={handleChange} rows={4}
                placeholder={`Tell ${school.name} about yourself, your teaching style, and why you'd like to join...`}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', resize: 'vertical' }}
              />
            </div>

            <div style={{ background: '#f0f7f4', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#555', display: 'flex', gap: '8px' }}>
              <span>🔒</span>
              <span>Your details are shared only with {school.name}. Duplicate submissions from the same email address will not be accepted.</span>
            </div>

            {error && (
              <div style={{ background: '#FDE8E0', color: '#993C1D', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitting || photoUploading}
              style={{ background: submitting ? '#888' : accentColor, color: 'white', border: 'none', padding: '13px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%' }}>
              {submitting ? 'Submitting...' : 'Submit my profile'}
            </button>
          </div>
        )}

        {/* Success */}
        {submitted && (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a5c3a', marginBottom: '10px' }}>Profile submitted!</div>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '20px' }}>
              Thank you! The team at {school.name} will review your profile and be in touch when a suitable vacancy arises.
            </p>
            <Link href="/schools" style={{ display: 'inline-block', background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              Browse more schools →
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
