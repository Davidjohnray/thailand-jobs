'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'
import HCaptcha from '@hcaptcha/react-hcaptcha'

const subjects = [
  'English', 'Maths', 'Science', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'French', 'Spanish', 'Mandarin Chinese', 'Japanese',
  'Korean', 'Thai', 'Art', 'Music', 'Drama', 'PE / Sports',
  'IT / Computer Science', 'Business Studies', 'Economics', 'IELTS / TOEFL Prep',
  'SAT / ACT Prep', 'Primary School Subjects', 'Special Needs', 'Other'
]

const levels = [
  'Pre-School / Kindergarten', 'Primary (Ages 6-11)', 'Secondary (Ages 11-16)',
  'High School (Ages 16-18)', 'University / Adult', 'Business Professionals', 'All Ages'
]

const certificationOptions = [
  'TEFL', 'TESOL', 'CELTA', 'DELTA', 'QTS (UK)', 'PGCE',
  'Bachelor of Education', 'Masters in Education', 'PhD', 'Other'
]

const languageOptions = [
  'English', 'Thai', 'Mandarin', 'French', 'Spanish', 'German',
  'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other'
]

const templates = [
  { id: 'modern', label: '🎨 Modern', desc: 'Clean white minimal design', color: '#2D6BE4' },
  { id: 'bold', label: '🔥 Bold', desc: 'Vibrant colourful design', color: '#E85D26' },
  { id: 'professional', label: '💼 Professional', desc: 'Dark corporate style', color: '#1a1a2e' },
  { id: 'friendly', label: '😊 Friendly', desc: 'Warm casual feel', color: '#16a34a' },
]

export default function TeacherProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/account/login'); return }
      setUser(session.user)

      const { data: teacherData } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (!teacherData) {
        // Try matching by email
        const { data: byEmail } = await supabase
          .from('teachers')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (byEmail) {
          // Link the account
          await supabase.from('teachers').update({ user_id: session.user.id }).eq('id', byEmail.id)
          setTeacher(byEmail)
          setForm(buildForm(byEmail))
        }
      } else {
        setTeacher(teacherData)
        setForm(buildForm(teacherData))
      }
      setLoading(false)
    }
    init()
  }, [])

  const buildForm = (t: any) => ({
    name: t.name || '',
    nationality: t.nationality || '',
    location: t.location || '',
    tagline: t.tagline || '',
    bio: t.bio || '',
    teaching_style: t.teaching_style || '',
    subjects: t.subjects || [],
    levels: t.levels || [],
    qualifications: t.qualifications?.join('\n') || '',
    certifications: t.certifications || [],
    languages: t.languages || [],
    experience_years: t.experience_years?.toString() || '',
    hourly_rate: t.hourly_rate || '',
    online_available: t.online_available || false,
    email: t.email || '',
    phone: t.phone || '',
    line_id: t.line_id || '',
    whatsapp: t.whatsapp || '',
    facebook: t.facebook || '',
    photo_url: t.photo_url || '',
    template: t.template || 'modern',
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleArray = (field: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v: string) => v !== value)
        : [...prev[field], value]
    }))
  }

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `teachers/${user.id}/${Date.now()}.${fileExt}`
    const { error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: true })
    if (error) { alert('Upload error: ' + error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(fileName)
    setForm((prev: any) => ({ ...prev, photo_url: publicUrl }))
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('teachers').update({
      name: form.name,
      nationality: form.nationality || null,
      location: form.location,
      tagline: form.tagline || null,
      bio: form.bio,
      teaching_style: form.teaching_style || null,
      subjects: form.subjects,
      levels: form.levels,
      qualifications: form.qualifications ? form.qualifications.split('\n').filter((q: string) => q.trim()) : [],
      certifications: form.certifications,
      languages: form.languages,
      experience_years: form.experience_years ? parseInt(form.experience_years) : null,
      hourly_rate: form.hourly_rate,
      online_available: form.online_available,
      email: form.email,
      phone: form.phone || null,
      line_id: form.line_id || null,
      whatsapp: form.whatsapp || null,
      facebook: form.facebook || null,
      photo_url: form.photo_url || null,
      template: form.template,
    }).eq('id', teacher.id)

    if (error) { alert('Error saving: ' + error.message); setSaving(false); return }
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading...</p>
    </main>
  )

  if (!teacher) return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎓</div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>No Teacher Profile Found</h1>
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
          You don't have a teacher profile yet. Register as a teacher and use the same email address as your member account!
        </p>
        <Link href="/teachers/register" style={{ display: 'block', background: '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>
          Register as a Teacher →
        </Link>
        <Link href="/account/dashboard" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  )

  const tagStyle = (active: boolean, color = '#E85D26') => ({
    padding: '7px 14px', borderRadius: '20px',
    border: `1px solid ${active ? color : '#ddd'}`,
    background: active ? color + '18' : 'white',
    color: active ? color : '#555',
    cursor: 'pointer' as const,
    fontSize: '13px',
    fontWeight: active ? 'bold' : 'normal' as const,
  })

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#1a1a2e', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>🎓 My Teacher Profile</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: '4px 0 0' }}>{user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {teacher.active && (
            <a href={`/teachers/${teacher.slug}`} target="_blank" rel="noopener noreferrer"
              style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              👁 View Live Profile →
            </a>
          )}
          <Link href="/account/dashboard"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
            ← Dashboard
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* STATUS BANNER */}
        <div style={{ background: teacher.active ? '#e8f5e9' : '#fff3ed', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', border: `1px solid ${teacher.active ? '#a5d6a7' : '#ffd4b8'}` }}>
          <span style={{ fontSize: '24px' }}>{teacher.active ? '✅' : '⏳'}</span>
          <div>
            <div style={{ fontWeight: 'bold', color: teacher.active ? '#2e7d32' : '#E85D26', fontSize: '15px' }}>
              {teacher.active ? 'Your profile is LIVE!' : 'Profile Pending Review'}
            </div>
            <div style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>
              {teacher.active
                ? `Live at: www.jobsinthailand.net/teachers/${teacher.slug}`
                : 'We will review and approve your profile within 24 hours'}
            </div>
          </div>
        </div>

        {/* SAVE BUTTON TOP */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px', gap: '12px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '14px' }}>✅ Changes saved!</span>}
          <button onClick={handleSave} disabled={saving}
            style={{ background: saving ? '#ccc' : '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* PHOTO */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📸 Profile Photo</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #E85D26', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {form.photo_url ? (
                  <img src={form.photo_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '40px' }}>👤</span>
                )}
              </div>
              <div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  style={{ background: uploading ? '#ccc' : '#1a1a2e', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  {uploading ? '⏳ Uploading...' : '📷 Upload Photo'}
                </button>
                <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>Or paste a direct URL below:</p>
                <input name="photo_url" value={form.photo_url} onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* PERSONAL INFO */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>👤 Personal Info</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Nationality</label>
                  <input name="nationality" value={form.nationality} onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Location in Thailand</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Years of Experience</label>
                  <input name="experience_years" value={form.experience_years} onChange={handleChange} type="number"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Profile Tagline</label>
                <input name="tagline" value={form.tagline} onChange={handleChange}
                  placeholder="A short catchy phrase shown on your profile"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="online_available" checked={form.online_available} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>🌐 Available for online lessons</span>
                </label>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📝 About & Teaching Style</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>About Me</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={5}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Teaching Style</label>
                <textarea name="teaching_style" value={form.teaching_style} onChange={handleChange} rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* SUBJECTS */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📚 Subjects & Levels</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '13px' }}>Subjects I Teach</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {subjects.map(s => (
                  <button key={s} type="button" onClick={() => toggleArray('subjects', s)} style={tagStyle(form.subjects.includes(s), '#E85D26')}>
                    {form.subjects.includes(s) ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '13px' }}>Student Levels</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {levels.map(l => (
                  <button key={l} type="button" onClick={() => toggleArray('levels', l)} style={tagStyle(form.levels.includes(l), '#2D6BE4')}>
                    {form.levels.includes(l) ? '✓ ' : ''}{l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CREDENTIALS */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🎓 Credentials</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Qualifications (one per line)</label>
                <textarea name="qualifications" value={form.qualifications} onChange={handleChange} rows={3}
                  placeholder="e.g. Bachelor of Education, University of Manchester"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '13px' }}>Certifications</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {certificationOptions.map(c => (
                    <button key={c} type="button" onClick={() => toggleArray('certifications', c)} style={tagStyle(form.certifications.includes(c), '#16a34a')}>
                      {form.certifications.includes(c) ? '✓ ' : ''}{c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '13px' }}>Languages I Speak</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {languageOptions.map(l => (
                    <button key={l} type="button" onClick={() => toggleArray('languages', l)} style={tagStyle(form.languages.includes(l), '#7C3AED')}>
                      {form.languages.includes(l) ? '✓ ' : ''}{l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RATES & CONTACT */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>💰 Rates & Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Hourly Rate</label>
                <input name="hourly_rate" value={form.hourly_rate} onChange={handleChange}
                  placeholder="e.g. 500 THB / hour"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>LINE ID</label>
                  <input name="line_id" value={form.line_id} onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>WhatsApp</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '13px' }}>Facebook Page URL</label>
                <input name="facebook" value={form.facebook} onChange={handleChange}
                  placeholder="https://facebook.com/yourpage"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* TEMPLATE */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🎨 Profile Style</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {templates.map(t => (
                <button key={t.id} type="button" onClick={() => setForm((prev: any) => ({ ...prev, template: t.id }))}
                  style={{ padding: '14px', borderRadius: '10px', border: `2px solid ${form.template === t.id ? t.color : '#ddd'}`, background: form.template === t.id ? t.color + '12' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: form.template === t.id ? t.color : '#333', marginBottom: '2px' }}>{t.label}</div>
                  <div style={{ fontSize: '11px', color: '#999' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON BOTTOM */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
            {saved && <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '14px' }}>✅ Changes saved!</span>}
            <button onClick={handleSave} disabled={saving}
              style={{ background: saving ? '#ccc' : '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}