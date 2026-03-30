'use client'
import { useState, useRef } from 'react'
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
  'High School (Ages 16-18)', 'University / Adult', 'Business Professionals',
  'All Ages'
]

const certifications = [
  'TEFL', 'TESOL', 'CELTA', 'DELTA', 'QTS (UK)', 'PGCE',
  'Bachelor of Education', 'Masters in Education', 'PhD', 'Other'
]

const languages = [
  'English', 'Thai', 'Mandarin', 'French', 'Spanish', 'German',
  'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other'
]

const templates = [
  { id: 'modern', label: '🎨 Modern', desc: 'Clean white minimal design with sidebar' },
  { id: 'bold', label: '🔥 Bold', desc: 'Vibrant colourful design with big hero' },
  { id: 'professional', label: '💼 Professional', desc: 'Dark corporate style' },
  { id: 'friendly', label: '😊 Friendly', desc: 'Warm casual feel — great for tutors' },
]

export default function TeacherRegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef<HCaptcha>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: '',
    nationality: '',
    location: '',
    tagline: '',
    bio: '',
    teaching_style: '',
    subjects: [] as string[],
    levels: [] as string[],
    qualifications: '',
    certifications: [] as string[],
    languages: [] as string[],
    experience_years: '',
    hourly_rate: '',
    online_available: false,
    email: '',
    phone: '',
    line_id: '',
    whatsapp: '',
    facebook: '',
    photo_url: '',
    preferred_template: 'modern',
    notes: '',
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

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Your name is required'
    if (!form.location.trim()) newErrors.location = 'Location is required'
    if (!form.bio.trim()) newErrors.bio = 'Please write a short bio'
    if (form.subjects.length === 0) newErrors.subjects = 'Please select at least one subject'
    if (form.levels.length === 0) newErrors.levels = 'Please select at least one level'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email'
    if (!form.hourly_rate.trim()) newErrors.hourly_rate = 'Please enter your hourly rate'
    if (!captchaToken) newErrors.captcha = 'Please complete the CAPTCHA'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now().toString().slice(-4)
  }

  const handleSubmit = async () => {
    if (!validateStep2()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setLoading(true)

    const slug = generateSlug(form.name)

    const { error } = await supabase.from('teachers').insert([{
      slug,
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
      alert('Error submitting: ' + error.message)
      captchaRef.current?.resetCaptcha()
      setCaptchaToken('')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '56px 48px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Application Received!</h1>
        <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.7', fontSize: '15px' }}>
          Thank you for applying to list your teacher profile on Jobs in Thailand!
        </p>
        <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
          <p style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', margin: '0 0 8px' }}>What happens next?</p>
          <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.8' }}>
            ✅ We'll review your profile within 24 hours<br />
            ✅ We may contact you to discuss your listing<br />
            ✅ Once approved your profile goes live!<br />
            ✅ You'll receive a link to share with students
          </div>
        </div>
        <Link href="/teachers" style={{ background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
          Browse Teacher Profiles →
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>List Your Teacher Profile</h1>
          <p style={{ color: '#666', fontSize: '15px' }}>Join our growing directory of private teachers in Thailand</p>
        </div>

        {/* STEP INDICATOR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '40px' }}>
          {[1, 2].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', background: step >= s ? '#E85D26' : '#ddd', color: step >= s ? 'white' : '#999' }}>
                {s}
              </div>
              <div style={{ marginLeft: '8px', marginRight: i === 0 ? '0' : '0', fontSize: '13px', color: step >= s ? '#E85D26' : '#999', fontWeight: step >= s ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
                {s === 1 ? 'Your Profile' : 'Contact & Finish'}
              </div>
              {i === 0 && <div style={{ width: '60px', height: '2px', background: step >= 2 ? '#E85D26' : '#ddd', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        {/* ERRORS */}
        {Object.values(errors).some(e => e !== '') && (
          <div style={{ background: '#ffeaea', border: '2px solid red', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontWeight: 'bold', color: 'red', marginBottom: '8px' }}>⚠️ Please fix the following:</div>
            {Object.values(errors).filter(e => e !== '').map((err, i) => (
              <div key={i} style={{ color: 'red', fontSize: '13px', marginBottom: '4px' }}>• {err}</div>
            ))}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

          {/* ========== STEP 1 ========== */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>👤 About You</h2>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sarah Johnson"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.name ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                {errors.name && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Nationality</label>
                  <input name="nationality" value={form.nationality} onChange={handleChange} placeholder="e.g. British, American"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Location in Thailand *</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangkok, Chiang Mai"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.location ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.location && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.location}</p>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Tagline</label>
                <input name="tagline" value={form.tagline} onChange={handleChange}
                  placeholder="e.g. Experienced English teacher helping students achieve their best"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                <p style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>A short catchy phrase that appears on your profile</p>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>About Me *</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={5}
                  placeholder="Tell students and parents about yourself — your background, experience, teaching style and what makes you a great teacher..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.bio ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                {errors.bio && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.bio}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>My Teaching Style</label>
                <textarea name="teaching_style" value={form.teaching_style} onChange={handleChange} rows={3}
                  placeholder="Describe how you teach — your methods, approach, and what students can expect..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              {/* SUBJECTS */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>Subjects I Teach * <span style={{ color: '#999', fontWeight: 'normal' }}>(select all that apply)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {subjects.map(s => (
                    <button key={s} type="button" onClick={() => toggleArray('subjects', s)}
                      style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: form.subjects.includes(s) ? '#E85D26' : '#ddd', background: form.subjects.includes(s) ? '#fff3ed' : 'white', color: form.subjects.includes(s) ? '#E85D26' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: form.subjects.includes(s) ? 'bold' : 'normal' }}>
                      {form.subjects.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
                {errors.subjects && <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>{errors.subjects}</p>}
              </div>

              {/* LEVELS */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>Student Levels * <span style={{ color: '#999', fontWeight: 'normal' }}>(select all that apply)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {levels.map(l => (
                    <button key={l} type="button" onClick={() => toggleArray('levels', l)}
                      style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: form.levels.includes(l) ? '#2D6BE4' : '#ddd', background: form.levels.includes(l) ? '#e8f0fe' : 'white', color: form.levels.includes(l) ? '#2D6BE4' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: form.levels.includes(l) ? 'bold' : 'normal' }}>
                      {form.levels.includes(l) ? '✓ ' : ''}{l}
                    </button>
                  ))}
                </div>
                {errors.levels && <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>{errors.levels}</p>}
              </div>

              {/* QUALIFICATIONS */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Qualifications</label>
                <textarea name="qualifications" value={form.qualifications} onChange={handleChange} rows={3}
                  placeholder="One per line e.g.&#10;Bachelor of Education, University of Manchester&#10;Masters in TESOL, Leeds University"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              {/* CERTIFICATIONS */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>Certifications</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {certifications.map(c => (
                    <button key={c} type="button" onClick={() => toggleArray('certifications', c)}
                      style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: form.certifications.includes(c) ? '#16a34a' : '#ddd', background: form.certifications.includes(c) ? '#e8f5e9' : 'white', color: form.certifications.includes(c) ? '#16a34a' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: form.certifications.includes(c) ? 'bold' : 'normal' }}>
                      {form.certifications.includes(c) ? '✓ ' : ''}{c}
                    </button>
                  ))}
                </div>
              </div>

              {/* LANGUAGES */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>Languages I Speak</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {languages.map(l => (
                    <button key={l} type="button" onClick={() => toggleArray('languages', l)}
                      style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: form.languages.includes(l) ? '#7C3AED' : '#ddd', background: form.languages.includes(l) ? '#f3e8ff' : 'white', color: form.languages.includes(l) ? '#7C3AED' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: form.languages.includes(l) ? 'bold' : 'normal' }}>
                      {form.languages.includes(l) ? '✓ ' : ''}{l}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Years of Experience</label>
                  <input name="experience_years" value={form.experience_years} onChange={handleChange} type="number" placeholder="e.g. 5"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" name="online_available" checked={form.online_available} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>🌐 Available for online lessons</span>
                  </label>
                </div>
              </div>

              {/* TEMPLATE CHOICE */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '12px', color: '#333', fontSize: '14px' }}>Choose Your Profile Style</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {templates.map(t => (
                    <button key={t.id} type="button" onClick={() => setForm(prev => ({ ...prev, preferred_template: t.id }))}
                      style={{ padding: '14px 16px', borderRadius: '10px', border: '2px solid', borderColor: form.preferred_template === t.id ? '#E85D26' : '#ddd', background: form.preferred_template === t.id ? '#fff3ed' : 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: form.preferred_template === t.id ? '#E85D26' : '#333' }}>{t.label}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{t.desc}</div>
                      </div>
                      {form.preferred_template === t.id && <span style={{ marginLeft: 'auto', color: '#E85D26', fontWeight: 'bold' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleNext}
                style={{ background: '#E85D26', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                Next — Contact Details →
              </button>
            </div>
          )}

          {/* ========== STEP 2 ========== */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>📞 Contact & Finishing Up</h2>

              <div style={{ background: '#fff3ed', borderRadius: '10px', padding: '16px', fontSize: '13px', color: '#E85D26' }}>
                ⭐ Your contact details will appear on your profile so students and parents can reach you directly.
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Hourly Rate *</label>
                <input name="hourly_rate" value={form.hourly_rate} onChange={handleChange}
                  placeholder="e.g. 500 THB / hour or 800-1200 THB"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.hourly_rate ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                {errors.hourly_rate && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.hourly_rate}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Email Address *</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="your@email.com"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.email ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0812345678"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>LINE ID</label>
                  <input name="line_id" value={form.line_id} onChange={handleChange} placeholder="your LINE ID"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>WhatsApp Number</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="e.g. +66812345678"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Facebook Page URL</label>
                  <input name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/yourpage"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Profile Photo URL</label>
                <input name="photo_url" value={form.photo_url} onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                <p style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                  Paste a direct link to your photo. You can upload to Google Drive or ImgBB for a free link. We can also help you with this after submission!
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Anything else you'd like us to know?</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                  placeholder="Any special requirements, questions, or additional info for our team..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              {/* HCAPTCHA */}
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
                <button onClick={() => setStep(1)}
                  style={{ background: '#f0f0f0', color: '#555', padding: '14px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  style={{ flex: 1, background: loading ? '#ccc' : '#E85D26', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Submitting...' : '🎓 Submit My Profile →'}
                </button>
              </div>

              <p style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
                Your profile will be reviewed by our team before going live — usually within 24 hours.
              </p>
            </div>
          )}

        </div>

        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '24px' }}>
          Already listed? <Link href="/teachers" style={{ color: '#E85D26', fontWeight: 'bold', textDecoration: 'none' }}>Browse all teachers →</Link>
        </p>

      </div>
    </main>
  )
}