'use client'
import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import HCaptcha from '@hcaptcha/react-hcaptcha'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

const steps = [
  { num: 1, label: 'Personal Info' },
  { num: 2, label: 'Teaching' },
  { num: 3, label: 'Contact' },
]

export default function TeacherRegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef<HCaptcha>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: '', nationality: '', location: '', tagline: '', bio: '',
    teaching_style: '', subjects: [] as string[], levels: [] as string[],
    qualifications: '', certifications: [] as string[], languages: [] as string[],
    experience_years: '', hourly_rate: '', online_available: false,
    email: '', phone: '', line_id: '', whatsapp: '', facebook: '',
    photo_url: '', preferred_template: 'modern', notes: '',
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const toggleArray = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev as any)[field].includes(value)
        ? (prev as any)[field].filter((v: string) => v !== value)
        : [...(prev as any)[field], value]
    }))
  }

  const validate = (s: number) => {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!form.name.trim()) e.name = 'Your name is required'
      if (!form.location.trim()) e.location = 'Location is required'
      if (!form.bio.trim()) e.bio = 'Please write a short bio'
    }
    if (s === 2) {
      if (form.subjects.length === 0) e.subjects = 'Please select at least one subject'
      if (form.levels.length === 0) e.levels = 'Please select at least one level'
    }
    if (s === 3) {
      if (!form.email.trim()) e.email = 'Email is required'
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email'
      if (!form.hourly_rate.trim()) e.hourly_rate = 'Please enter your hourly rate'
      if (!captchaToken) e.captcha = 'Please complete the CAPTCHA'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (validate(step)) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    + '-' + Date.now().toString().slice(-4)

  const handleSubmit = async () => {
    if (!validate(3)) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    setLoading(true)
    const { error } = await db.from('teachers').insert([{
      slug: generateSlug(form.name),
      name: form.name,
      nationality: form.nationality || null,
      location: form.location,
      tagline: form.tagline || null,
      bio: form.bio,
      teaching_style: form.teaching_style || null,
      subjects: form.subjects,
      levels: form.levels,
      qualifications: form.qualifications ? form.qualifications.split('\n').filter(q => q.trim()) : [],
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
      template: form.preferred_template,
      notes: form.notes || null,
      status: 'pending',
      active: false,
    }])
    if (error) {
      alert('Error: ' + error.message)
      captchaRef.current?.resetCaptcha()
      setCaptchaToken('')
      setLoading(false)
      return
    }
    setSuccess(true)
    setLoading(false)
  }

  // ---- SUCCESS ----
  if (success) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', maxWidth: '540px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Profile Submitted!</h1>
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.7' }}>
          Thank you! We'll review your profile and get back to you within 24 hours. Once approved your profile page will go live!
        </p>

        {/* WHAT HAPPENS NEXT */}
        <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '10px', fontSize: '14px' }}>What happens next:</div>
          {[
            'We review your profile (within 24hrs)',
            'We may contact you to discuss your listing',
            'Your profile goes live on Jobs in Thailand',
            'You get a unique link to share with students!'
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', fontSize: '13px', color: '#555' }}>
              <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> {item}
            </div>
          ))}
        </div>

        {/* MEMBER ACCOUNT PROMPT */}
        <div style={{ background: '#e8f0fe', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left', border: '1px solid #c7d9f8' }}>
          <p style={{ color: '#2D6BE4', fontWeight: 'bold', fontSize: '14px', margin: '0 0 8px' }}>📌 One more step!</p>
          <p style={{ color: '#555', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.6' }}>
            Create a free member account using the <strong>same email address</strong> to manage and edit your teacher profile once approved — all from your dashboard!
          </p>
          <a href="/account/register" style={{ display: 'inline-block', background: '#2D6BE4', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
            Create Member Account →
          </a>
        </div>

        <a href="/teachers" style={{ display: 'block', background: '#E85D26', color: 'white', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
          Browse Teacher Profiles →
        </a>
      </div>
    </main>
  )

  const tagStyle = (active: boolean, color = '#E85D26') => ({
    padding: '7px 14px', borderRadius: '20px', border: `1px solid ${active ? color : '#ddd'}`,
    background: active ? color + '18' : 'white', color: active ? color : '#555',
    cursor: 'pointer' as const, fontSize: '13px', fontWeight: active ? 'bold' : 'normal' as const,
  })

  // ---- FORM ----
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎓</div>
          <h1 style={{ color: 'white', fontSize: '30px', fontWeight: 'bold', margin: '0 0 8px' }}>List Your Teaching Profile</h1>
          <p style={{ color: '#ccc', fontSize: '15px', margin: 0 }}>Join our growing directory of private teachers in Thailand</p>
        </div>

        {/* STEP INDICATOR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px', background: step >= s.num ? '#E85D26' : 'rgba(255,255,255,0.15)', color: 'white' }}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <div style={{ fontSize: '11px', color: step >= s.num ? '#E85D26' : '#888', fontWeight: step >= s.num ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>{s.label}</div>
              </div>
              {i < steps.length - 1 && <div style={{ width: '60px', height: '2px', background: step > s.num ? '#E85D26' : 'rgba(255,255,255,0.15)', margin: '0 8px', marginBottom: '18px' }} />}
            </div>
          ))}
        </div>

        {/* ERRORS */}
        {Object.values(errors).some(e => e !== '') && (
          <div style={{ background: '#ffeaea', border: '2px solid red', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', color: 'red', marginBottom: '6px', fontSize: '14px' }}>⚠️ Please fix the following:</div>
            {Object.values(errors).filter(e => e !== '').map((err, i) => (
              <div key={i} style={{ color: 'red', fontSize: '13px', marginBottom: '3px' }}>• {err}</div>
            ))}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>

          {/* ========== STEP 1 ========== */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>👤 Personal Information</h2>
                <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>Tell us about yourself</p>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sarah Johnson"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.name ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                {errors.name && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Nationality</label>
                  <input name="nationality" value={form.nationality} onChange={handleChange} placeholder="e.g. British, American"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Location in Thailand *</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangkok, Chiang Mai"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.location ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.location && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.location}</p>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Profile Tagline</label>
                <input name="tagline" value={form.tagline} onChange={handleChange}
                  placeholder="e.g. Experienced English teacher helping students achieve their best"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                <p style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>A short catchy phrase shown on your profile</p>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>About Me *</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={5}
                  placeholder="Tell students and parents about yourself — your background, experience and what makes you a great teacher..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.bio ? '2px solid red' : '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                {errors.bio && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.bio}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>My Teaching Style</label>
                <textarea name="teaching_style" value={form.teaching_style} onChange={handleChange} rows={3}
                  placeholder="Describe your teaching approach and what students can expect..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Profile Photo URL</label>
                <input name="photo_url" value={form.photo_url} onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                <p style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>Paste a direct link to your photo — or we can help you add this later!</p>
              </div>

              {/* TEMPLATE */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>Choose Your Profile Style</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {templates.map(t => (
                    <button key={t.id} type="button" onClick={() => setForm(prev => ({ ...prev, preferred_template: t.id }))}
                      style={{ padding: '14px', borderRadius: '10px', border: `2px solid ${form.preferred_template === t.id ? t.color : '#ddd'}`, background: form.preferred_template === t.id ? t.color + '12' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: form.preferred_template === t.id ? t.color : '#333', marginBottom: '2px' }}>{t.label}</div>
                      <div style={{ fontSize: '11px', color: '#999' }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={next} style={{ background: '#E85D26', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                Next — Teaching Details →
              </button>
            </div>
          )}

          {/* ========== STEP 2 ========== */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>📚 Teaching Details</h2>
                <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>Tell us what and who you teach</p>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>
                  Subjects I Teach * <span style={{ color: '#999', fontWeight: 'normal' }}>(select all that apply)</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {subjects.map(s => (
                    <button key={s} type="button" onClick={() => toggleArray('subjects', s)} style={tagStyle(form.subjects.includes(s), '#E85D26')}>
                      {form.subjects.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
                {errors.subjects && <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>{errors.subjects}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>
                  Student Levels * <span style={{ color: '#999', fontWeight: 'normal' }}>(select all that apply)</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {levels.map(l => (
                    <button key={l} type="button" onClick={() => toggleArray('levels', l)} style={tagStyle(form.levels.includes(l), '#2D6BE4')}>
                      {form.levels.includes(l) ? '✓ ' : ''}{l}
                    </button>
                  ))}
                </div>
                {errors.levels && <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>{errors.levels}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>Certifications</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {certificationOptions.map(c => (
                    <button key={c} type="button" onClick={() => toggleArray('certifications', c)} style={tagStyle(form.certifications.includes(c), '#16a34a')}>
                      {form.certifications.includes(c) ? '✓ ' : ''}{c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Qualifications</label>
                <textarea name="qualifications" value={form.qualifications} onChange={handleChange} rows={3}
                  placeholder="One per line e.g.&#10;Bachelor of Education, University of Manchester&#10;Masters in TESOL, Leeds University"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>Languages I Speak</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {languageOptions.map(l => (
                    <button key={l} type="button" onClick={() => toggleArray('languages', l)} style={tagStyle(form.languages.includes(l), '#7C3AED')}>
                      {form.languages.includes(l) ? '✓ ' : ''}{l}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Years of Experience</label>
                  <input name="experience_years" value={form.experience_years} onChange={handleChange} type="number" placeholder="e.g. 5"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '180px', paddingTop: '22px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" name="online_available" checked={form.online_available} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>🌐 Available online</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={back} style={{ background: '#f0f0f0', color: '#555', padding: '14px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>← Back</button>
                <button onClick={next} style={{ flex: 1, background: '#E85D26', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Next — Contact Details →</button>
              </div>
            </div>
          )}

          {/* ========== STEP 3 ========== */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>📞 Contact Details</h2>
                <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>How students and parents can reach you</p>
              </div>

              <div style={{ background: '#fff3ed', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#E85D26', border: '1px solid #ffd4b8' }}>
                ⭐ Your contact details appear on your profile so students can reach you directly. Add as many as you like!
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Hourly Rate *</label>
                  <input name="hourly_rate" value={form.hourly_rate} onChange={handleChange} placeholder="e.g. 500 THB / hour"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.hourly_rate ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.hourly_rate && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.hourly_rate}</p>}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Email Address *</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="your@email.com"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.email ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0812345678"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>LINE ID</label>
                  <input name="line_id" value={form.line_id} onChange={handleChange} placeholder="your LINE ID"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>WhatsApp</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+66812345678"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Facebook Page</label>
                  <input name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/yourpage"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Anything else for our team?</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                  placeholder="Any questions or extra info for us..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                  onVerify={token => { setCaptchaToken(token); setErrors(prev => ({ ...prev, captcha: '' })) }}
                  onExpire={() => setCaptchaToken('')}
                />
              </div>
              {errors.captcha && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{errors.captcha}</p>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={back} style={{ background: '#f0f0f0', color: '#555', padding: '14px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>← Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  style={{ flex: 1, background: loading ? '#ccc' : '#E85D26', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Submitting...' : '🎓 Submit My Profile →'}
                </button>
              </div>

              <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', margin: 0 }}>
                Your profile will be reviewed before going live — usually within 24 hours
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}