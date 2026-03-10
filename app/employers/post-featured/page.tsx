'use client'
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

export default function PostFeaturedPage() {
  const searchParams = useSearchParams()
  const isTeaching = searchParams.get('category') !== 'other'

  const [step, setStep] = useState<'form' | 'message' | 'done'>('form')
  const [jobLoading, setJobLoading] = useState(false)
  const [msgLoading, setMsgLoading] = useState(false)
  const [submittedJob, setSubmittedJob] = useState<any>(null)

  const [form, setForm] = useState({
    title: '', company: '', location: '', salary: '',
    job_type: 'Full Time',
    category: isTeaching ? teachingCategories[0] : otherCategories[0],
    description: '', requirements: '', benefits: '', email: '',
    visa_sponsor: false,
  })

  const [msgForm, setMsgForm] = useState({
    name: '', email: '', message: ''
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleMsgChange = (e: any) => {
    const { name, value } = e.target
    setMsgForm(prev => ({ ...prev, [name]: value }))
  }

  const handleJobSubmit = async (e: any) => {
    e.preventDefault()
    setJobLoading(true)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 14)
    const { data, error } = await supabase.from('jobs').insert([{
      ...form,
      featured: false,
      status: 'pending_payment',
      expires_at: expiryDate.toISOString()
    }]).select().single()
    if (error) {
      alert('Error submitting job: ' + error.message)
    } else {
      setSubmittedJob(data)
      setMsgForm(prev => ({ ...prev, email: form.email, name: form.company }))
      setStep('message')
    }
    setJobLoading(false)
  }

  const handleMessageSubmit = async (e: any) => {
    e.preventDefault()
    setMsgLoading(true)
    const { error } = await supabase.from('messages').insert([{
      name: msgForm.name,
      email: msgForm.email,
      company: form.company,
      job_title: form.title,
      message: msgForm.message || `I would like to arrange payment for my featured job listing: "${form.title}" at ${form.company}.`,
    }])
    if (error) {
      alert('Error sending message: ' + error.message)
    } else {
      setStep('done')
    }
    setMsgLoading(false)
  }

  // STEP 3 — Done
  if (step === 'done') return (
    <main style={{ textAlign: 'center', padding: '80px 24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Message Sent!</h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '8px' }}>We have received your message and will be in touch shortly with payment details.</p>
      <p style={{ color: '#666', fontSize: '15px', marginBottom: '32px' }}>Your featured listing will go live once payment is confirmed.</p>
      <a href="/jobs" style={{ background: '#E85D26', color: 'white', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
        View All Jobs
      </a>
    </main>
  )

  // STEP 2 — Contact form
  if (step === 'message') return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ background: '#e8f5e9', border: '2px solid #2e7d32', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px' }}>
          <div style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '16px', marginBottom: '4px' }}>✅ Job submitted successfully!</div>
          <div style={{ color: '#555', fontSize: '14px' }}>"{form.title}" at {form.company} has been saved. Now send us a message to arrange payment and go live.</div>
        </div>

        <div style={{ background: '#fff3ed', border: '2px solid #E85D26', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '16px' }}>⭐ Featured Listing — 500 THB</div>
            <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>Your job goes live once payment is confirmed</div>
          </div>
          <div style={{ fontSize: '32px' }}>💳</div>
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>Send Us a Message</h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>We will reply with payment details as soon as possible</p>

        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Your Name *</label>
            <input name="name" value={msgForm.name} onChange={handleMsgChange} placeholder="Your name"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Your Email *</label>
            <input name="email" value={msgForm.email} onChange={handleMsgChange} type="email" placeholder="your@email.com"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Message</label>
            <textarea name="message" value={msgForm.message} onChange={handleMsgChange} rows={4}
              placeholder={`Hi, I'd like to arrange payment for my featured listing "${form.title}" at ${form.company}. Please send me payment details.`}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

          <button onClick={handleMessageSubmit} disabled={msgLoading}
            style={{ width: '100%', background: msgLoading ? '#ccc' : '#E85D26', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
            {msgLoading ? 'Sending...' : 'Send Message →'}
          </button>

          <button onClick={() => setStep('done')}
            style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer' }}>
            Skip for now — I'll contact you later
          </button>
        </div>
      </div>
    </main>
  )

  // STEP 1 — Job form
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <a href="/employers" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>← Back to options</a>

        <div style={{ background: '#fff3ed', border: '2px solid #E85D26', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '18px' }}>⭐ Featured Listing — 500 THB</div>
            <div style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Your job goes live once payment is confirmed</div>
          </div>
          <div style={{ fontSize: '36px' }}>🚀</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '32px' }}>{isTeaching ? '🏫' : '💼'}</span>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
            Post a Featured {isTeaching ? 'Teaching' : 'Other'} Job
          </h1>
        </div>
        <p style={{ color: '#666', marginBottom: '40px' }}>Fill in your job details — then send us a message to arrange payment</p>

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
              placeholder={isTeaching ? 'e.g. Bachelor degree, TEFL certificate...' : 'e.g. 3 years experience, relevant degree...'}
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

          <button onClick={handleJobSubmit} disabled={jobLoading}
            style={{ width: '100%', background: jobLoading ? '#ccc' : '#E85D26', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
            {jobLoading ? 'Saving...' : 'Next — Arrange Payment →'}
          </button>

          <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginTop: '12px' }}>
            Your job is saved but won't go live until payment is confirmed
          </p>
        </div>
      </div>
    </main>
  )
}