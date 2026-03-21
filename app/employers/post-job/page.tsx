'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'

const thaiProvinces = [
  'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya / Chonburi', 'Koh Samui / Surat Thani',
  'Hua Hin / Prachuap', 'Krabi', 'Rayong', 'Chiang Rai',
  'Nakhon Ratchasima', 'Khon Kaen', 'Udon Thani', 'Ubon Ratchathani',
  'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Ayutthaya',
  'Nakhon Pathom', 'Kanchanaburi', 'Lopburi', 'Saraburi',
  'Phitsanulok', 'Sukhothai', 'Lampang', 'Lamphun', 'Mae Hong Son',
  'Nan', 'Phayao', 'Phrae', 'Uttaradit', 'Tak',
  'Mukdahan', 'Nakhon Phanom', 'Sakon Nakhon', 'Nong Khai',
  'Loei', 'Chaiyaphum', 'Buriram', 'Surin', 'Si Sa Ket',
  'Yasothon', 'Amnat Charoen', 'Roi Et', 'Maha Sarakham',
  'Kalasin', 'Nong Bua Lamphu', 'Songkhla', 'Trang', 'Phatthalung',
  'Satun', 'Yala', 'Narathiwat', 'Nakhon Si Thammarat', 'Phangnga',
  'Ranong', 'Chumphon', 'Prachuap Khiri Khan', 'Samut Sakhon',
  'Samut Songkhram', 'Ratchaburi', 'Phetchaburi', 'Suphan Buri',
  'Sing Buri', 'Ang Thong', 'Chai Nat', 'Nakhon Nayok',
  'Prachin Buri', 'Sa Kaeo', 'Chanthaburi', 'Trat',
  'Chachoengsao', 'Nakhon Sawan', 'Uthai Thani', 'Kamphaeng Phet',
  'Phichit', 'Phetchabun', 'Remote', 'Online', 'Other'
]

const teachingCategories = [
  'Nursery / Pre-Kindergarten',
  'Kindergarten (Anuban)',
  'Primary / Prathom (Grades 1–6)',
  'Secondary / Matthayom (Grades 7–9)',
  'High School / Matthayom (Grades 10–12)',
  'International School (All Levels)',
  'University / Higher Education',
  'Adult Classes',
  'Business English',
  'IELTS / TOEIC / Exam Prep',
  'Online Teaching',
  'Private Tutoring',
  'Language School / ESL Centre',
  'Special Needs Education',
  'Other',
]

const otherCategories = [
  'Hospitality', 'Technology', 'Tourism', 'Finance',
  'Marketing', 'Healthcare', 'Creative', 'Other'
]

function PostJobPage() {
  const searchParams = useSearchParams()
  const isTeaching = searchParams.get('category') !== 'other'

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', company: '', location: '', salary: '',
    job_type: 'Full Time',
    category: isTeaching ? teachingCategories[0] : otherCategories[0],
    description: '', requirements: '', benefits: '', email: '',
    visa_sponsor: false,
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 14)
    const { error } = await supabase.from('jobs').insert([{
      ...form,
      featured: false,
      expires_at: expiryDate.toISOString()
    }])
    if (error) { alert('Error: ' + error.message) } else {
      await fetch('/api/notify-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, location: form.location }),
      })
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Job Posted!</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Your job is now live on Thailand Jobs</p>
      <a href="/jobs" style={{ background: '#E85D26', color: 'white', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>View All Jobs</a>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <a href="/employers" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>← Back to options</a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '32px' }}>{isTeaching ? '🏫' : '💼'}</span>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
            Post a Free {isTeaching ? 'Teaching' : 'Other'} Job
          </h1>
        </div>
        <p style={{ color: '#666', marginBottom: '40px' }}>Your listing will appear on the jobs page for 2 weeks</p>

        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Job Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder={isTeaching ? 'e.g. English Teacher, Kindergarten Teacher' : 'e.g. Hotel Manager, Web Developer'}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              {isTeaching ? 'School / Company Name *' : 'Company Name *'}
            </label>
            <input name="company" value={form.company} onChange={handleChange}
              placeholder={isTeaching ? 'e.g. Bangkok International School' : 'e.g. Phuket Resort & Spa'}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              {isTeaching ? 'Teaching Level / Type *' : 'Job Category *'}
            </label>
            <select name="category" value={form.category} onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', outline: 'none' }}>
              {(isTeaching ? teachingCategories : otherCategories).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Province / Location *</label>
              <select name="location" value={form.location} onChange={handleChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', outline: 'none' }}>
                <option value="">Select province</option>
                {thaiProvinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Job Type *</label>
              <select name="job_type" value={form.job_type} onChange={handleChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', outline: 'none' }}>
                {['Full Time', 'Part Time', 'Contract', 'Remote', 'Freelance'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Salary</label>
            <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. 40,000 - 60,000 THB"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Job Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5}
              placeholder="Describe the role and responsibilities..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Requirements</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={4}
              placeholder={isTeaching ? 'e.g. Bachelor degree, TEFL certificate, experience with young learners...' : 'e.g. 3 years experience, relevant degree...'}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Benefits</label>
            <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={4}
              placeholder="e.g. Work permit, health insurance, flight allowance..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Contact Email *</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="jobs@yourcompany.com"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" name="visa_sponsor" checked={form.visa_sponsor} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
              <span style={{ fontWeight: 'bold', color: '#333' }}>We provide visa sponsorship / work permit</span>
            </label>
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', background: loading ? '#ccc' : isTeaching ? '#E85D26' : '#2D6BE4', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
            {loading ? 'Posting...' : 'Post Free Job →'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}>
      <PostJobPage />
    </Suspense>
  )
}