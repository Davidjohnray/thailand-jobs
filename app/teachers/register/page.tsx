'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

const qualificationOptions = ['BA', 'BSc', 'BEd', 'MA', 'MEd', 'PGCE', 'TEFL', 'CELTA', 'DELTA', 'PhD', 'Diploma', 'Certificate']
const subjectOptions = ['English', 'Mathematics', 'Science', 'Social Studies', 'PE', 'Art', 'Music', 'ICT', 'Drama', 'Phonics', 'IELTS/TOEIC Prep', 'Business English', 'Kindergarten', 'Other']
const nationalities = [
  'All Nationalities',

  // 🌏 East & Southeast Asia
  'Filipino', 'Indonesian', 'Malaysian', 'Singaporean', 'Thai', 'Vietnamese',
  'Cambodian', 'Burmese', 'Laotian', 'Bruneian', 'Timorese',
  'Chinese', 'Japanese', 'Korean', 'Taiwanese', 'Mongolian',

  // 🌏 South Asia
  'Indian', 'Pakistani', 'Sri Lankan', 'Bangladeshi', 'Nepali',
  'Bhutanese', 'Maldivian', 'Afghan',

  // 🌍 English-speaking countries
  'British', 'American', 'Canadian', 'Australian', 'New Zealander',
  'Irish', 'Scottish', 'Welsh',

  // 🌍 West Africa
  'Nigerian', 'Ghanaian', 'Ivorian', 'Senegalese', 'Malian',
  'Beninese', 'Burkinabe', 'Togolese', 'Guinean', 'Sierra Leonean',
  'Liberian', 'Gambian', 'Cape Verdean', 'Mauritanian', 'Nigerien',

  // 🌍 East Africa
  'Kenyan', 'Tanzanian', 'Ugandan', 'Ethiopian', 'Rwandan',
  'Burundian', 'Somali', 'Djiboutian', 'Eritrean', 'South Sudanese',
  'Sudanese',

  // 🌍 Central Africa
  'Cameroonian', 'Congolese', 'Gabonese', 'Equatoguinean',
  'Central African', 'Chadian',

  // 🌍 Southern Africa
  'South African', 'Zimbabwean', 'Zambian', 'Mozambican', 'Malawian',
  'Botswanan', 'Namibian', 'Swazi', 'Lesothan', 'Angolan',

  // 🌍 North Africa
  'Egyptian', 'Moroccan', 'Algerian', 'Tunisian', 'Libyan',

  // 🌍 Indian Ocean Africa
  'Malagasy', 'Mauritian', 'Seychellois', 'Comorian',

  // 🌎 South America
  'Brazilian', 'Argentinian', 'Colombian', 'Chilean', 'Peruvian',
  'Venezuelan', 'Ecuadorian', 'Bolivian', 'Paraguayan', 'Uruguayan',
  'Guyanese', 'Surinamese',

  // 🌎 Central America & Caribbean
  'Mexican', 'Jamaican', 'Trinidadian', 'Barbadian', 'Bahamian',
  'Haitian', 'Dominican', 'Cuban', 'Puerto Rican', 'Belizean',
  'Guatemalan', 'Honduran', 'Salvadoran', 'Nicaraguan', 'Costa Rican',
  'Panamanian',

  // 🌍 Middle East
  'Lebanese', 'Jordanian', 'Syrian', 'Iraqi', 'Israeli',
  'Palestinian', 'Saudi', 'Emirati', 'Qatari', 'Kuwaiti',
  'Bahraini', 'Omani', 'Yemeni', 'Iranian', 'Turkish',

  // 🌍 Western Europe
  'French', 'German', 'Dutch', 'Belgian', 'Swiss', 'Spanish', 'Italian',
  'Portuguese', 'Austrian', 'Luxembourgish',

  // 🌍 Northern Europe
  'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Icelandic',
  'Estonian', 'Latvian', 'Lithuanian',

  // 🌍 Eastern Europe
  'Russian', 'Ukrainian', 'Polish', 'Romanian', 'Hungarian',
  'Czech', 'Slovak', 'Bulgarian', 'Belarusian', 'Moldovan',

  // 🌍 Southern Europe
  'Greek', 'Croatian', 'Serbian', 'Slovenian', 'Bosnian',
  'Macedonian', 'Albanian', 'Montenegrin', 'Maltese',

  // 🌏 Central Asia & Caucasus
  'Kazakh', 'Uzbek', 'Kyrgyz', 'Tajik', 'Turkmen',
  'Azerbaijani', 'Georgian', 'Armenian',

  // 🌏 Pacific
  'Papua New Guinean', 'Samoan', 'Tongan', 'Fijian', 'Vanuatuan',

  'Other'
]
const thaiProvinces = [
  'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya / Chonburi', 'Koh Samui / Surat Thani',
  'Hua Hin', 'Krabi', 'Rayong', 'Chiang Rai', 'Nakhon Ratchasima', 'Khon Kaen',
  'Udon Thani', 'Ubon Ratchathani', 'Nonthaburi', 'Ayutthaya', 'Remote / Online',
  'Multiple Locations', 'Other'
]

export default function TeacherRegisterPage() {
  const [form, setForm] = useState({
    name: '', age: '', nationality: '', location: '',
    qualifications: [] as string[], subjects: [] as string[],
    experience_years: '', bio: '', video_url: '',
    email: '', phone: '', line_id: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function toggleQual(q: string) {
    setForm(prev => ({ ...prev, qualifications: prev.qualifications.includes(q) ? prev.qualifications.filter(x => x !== q) : [...prev.qualifications, q] }))
  }
  function toggleSubject(s: string) {
    setForm(prev => ({ ...prev, subjects: prev.subjects.includes(s) ? prev.subjects.filter(x => x !== s) : [...prev.subjects, s] }))
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!form.name || !form.nationality || !form.location || !form.email) {
      setError('Please fill in all required fields (name, nationality, location, email)')
      return
    }
    setError('')
    setSubmitting(true)

    let photo_url = ''
    if (photo) {
      setUploading(true)
      const ext = photo.name.split('.').pop()
      const filename = `teacher-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('teacher-photos').upload(filename, photo, { upsert: true })
      if (uploadError) {
        // Try partner-cvs bucket as fallback
        const { error: uploadError2 } = await supabase.storage.from('partner-cvs').upload(filename, photo, { upsert: true })
        if (!uploadError2) {
          const { data } = supabase.storage.from('partner-cvs').getPublicUrl(filename)
          photo_url = data.publicUrl
        }
      } else {
        const { data } = supabase.storage.from('teacher-photos').getPublicUrl(filename)
        photo_url = data.publicUrl
      }
      setUploading(false)
    }

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)

    const { error: insertError } = await supabase.from('teachers').insert([{
      name: form.name,
      age: form.age ? parseInt(form.age) : null,
      nationality: form.nationality,
      location: form.location,
      qualifications: form.qualifications,
      subjects: form.subjects,
      experience_years: form.experience_years ? parseInt(form.experience_years) : null,
      bio: form.bio,
      video_url: form.video_url || null,
      email: form.email,
      phone: form.phone || null,
      line_id: form.line_id || null,
      photo_url,
      slug,
      active: false,
      status: 'pending',
      template: 'modern',
    }])

    setSubmitting(false)
    if (insertError) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Application Submitted!</h2>
        <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
          Your profile has been submitted for review. We'll check it and make it live within 24 hours.
          You'll appear in the Teacher Directory once approved.
        </p>
        <Link href="/teachers" style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
          View Teacher Directory →
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link href="/teachers" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back to Teacher Directory</Link>

        <div style={{ textAlign: 'center', margin: '20px 0 32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎓</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Post Your Teacher CV</h1>
          <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>Free to post — get found by schools and recruiters across Thailand</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>

          {error && <div style={{ background: '#ffeaea', borderRadius: '8px', padding: '12px 16px', color: '#c62828', fontSize: '14px', marginBottom: '20px' }}>{error}</div>}

          {/* PHOTO */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            {photoPreview ? (
              <div>
                <img src={photoPreview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #E85D26', marginBottom: '8px' }} />
                <br />
                <button type="button" onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', color: '#E85D26', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Change photo</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px dashed #ddd', background: '#f9f9f9', cursor: 'pointer', fontSize: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                <span>📷</span>
                <span style={{ fontSize: '10px', color: '#888' }}>Add Photo</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* BASIC INFO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Maria Santos"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Age</label>
                <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="e.g. 28" type="number"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Nationality *</label>
                <select value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
                  <option value=''>Select nationality</option>
                  {nationalities.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Location in Thailand *</label>
                <select value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
                  <option value=''>Select location</option>
                  {thaiProvinces.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Years of Teaching Experience</label>
              <input value={form.experience_years} onChange={e => setForm({ ...form, experience_years: e.target.value })} placeholder="e.g. 5" type="number"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* QUALIFICATIONS */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>Qualifications</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {qualificationOptions.map(q => (
                  <button key={q} type="button" onClick={() => toggleQual(q)}
                    style={{ padding: '6px 14px', borderRadius: '20px', border: `2px solid ${form.qualifications.includes(q) ? '#2D6BE4' : '#ddd'}`, background: form.qualifications.includes(q) ? '#e8f0fe' : 'white', color: form.qualifications.includes(q) ? '#2D6BE4' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: form.qualifications.includes(q) ? 'bold' : 'normal' }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBJECTS */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>Subjects You Teach</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {subjectOptions.map(s => (
                  <button key={s} type="button" onClick={() => toggleSubject(s)}
                    style={{ padding: '6px 14px', borderRadius: '20px', border: `2px solid ${form.subjects.includes(s) ? '#E85D26' : '#ddd'}`, background: form.subjects.includes(s) ? '#fff3ed' : 'white', color: form.subjects.includes(s) ? '#E85D26' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: form.subjects.includes(s) ? 'bold' : 'normal' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* BIO */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>About You</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell schools about yourself — your experience, teaching style, what makes you a great teacher..."
                rows={5} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            {/* VIDEO */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>▶ Introduction Video Link (optional)</label>
              <input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })}
                placeholder="e.g. https://www.youtube.com/watch?v=..."
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0' }}>YouTube, Vimeo or any video link. A short 1–2 minute introduction works best.</p>
            </div>

            {/* CONTACT */}
            <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '16px', border: '1px solid #eee' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', margin: '0 0 12px' }}>🔒 Contact Details (only visible to paid recruiters)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address *" type="email"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                <input value={form.line_id} onChange={e => setForm({ ...form, line_id: e.target.value })} placeholder="LINE ID"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <button onClick={handleSubmit} disabled={submitting || uploading}
              style={{ background: submitting || uploading ? '#ccc' : '#E85D26', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: submitting || uploading ? 'not-allowed' : 'pointer' }}>
              {uploading ? '⏳ Uploading photo...' : submitting ? 'Submitting...' : '🎓 Submit My CV — Free'}
            </button>
            <p style={{ color: '#888', fontSize: '12px', textAlign: 'center', margin: 0 }}>Your profile will be reviewed and made live within 24 hours. Free forever.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
