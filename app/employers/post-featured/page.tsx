'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import dynamic from 'next/dynamic'
const HCaptcha = dynamic(() => import('@hcaptcha/react-hcaptcha'), { ssr: false })

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
  'Nursery / Pre-Kindergarten', 'Kindergarten (Anuban)',
  'Primary / Prathom (Grades 1–6)', 'Secondary / Matthayom (Grades 7–9)',
  'High School / Matthayom (Grades 10–12)', 'International School (All Levels)',
  'University / Higher Education', 'Adult Classes', 'Business English',
  'IELTS / TOEIC / Exam Prep', 'Online Teaching', 'Private Tutoring',
  'Language School / ESL Centre', 'Special Needs Education', 'Other',
]

const otherCategories = [
  'Hospitality', 'Technology', 'Tourism', 'Finance',
  'Marketing', 'Healthcare', 'Creative', 'Other'
]

function PostFeaturedPage() {
  const searchParams = useSearchParams()
  const isTeaching = searchParams.get('category') !== 'other'
  const [jobLoading, setJobLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [jobRef, setJobRef] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    title: '', company: '', location: '', salary: '',
    job_type: 'Full Time',
    category: isTeaching ? teachingCategories[0] : otherCategories[0],
    description: '', requirements: '', benefits: '', email: '',
    visa_sponsor: false,
    duration: 14,
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'Job title is required'
    if (!form.company.trim()) newErrors.company = `${isTeaching ? 'School / Company' : 'Company'} name is required`
    if (!form.location) newErrors.location = 'Please select a location'
    if (!form.description.trim()) newErrors.description = 'Job description is required'
    if (!form.requirements.trim()) newErrors.requirements = 'Requirements are required'
    if (!form.benefits.trim()) newErrors.benefits = 'Benefits are required'
    if (!captchaToken) newErrors.captcha = 'Please complete the CAPTCHA'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleJobSubmit = async (e: any) => {
    e.preventDefault()
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setJobLoading(true)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + form.duration)
    const { data, error } = await supabase.from('jobs').insert([{
      ...form, featured: false, status: 'pending_payment', expires_at: expiryDate.toISOString()
    }]).select().single()
    if (error) {
      alert('Error submitting job: ' + error.message)
      setCaptchaToken('')
      setJobLoading(false)
      return
    }
    await fetch('/api/notify-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, location: form.location }),
    })
    setJobRef(data.id)
    setSubmitted(true)
    setJobLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const waMessage = encodeURIComponent(`Hi, I've just submitted a Featured Job Listing on jobsinthailand.net and would like to arrange payment.

Job Title: ${form.title}
Company: ${form.company}
Location: ${form.location}
Job Ref: ${jobRef}

Please send me payment details. Thank you!`)

  const inputStyle = (field: string) => ({
    width: '100%', padding: '12px', borderRadius: '8px',
    border: errors[field] ? '2px solid red' : '1px solid #ddd',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const
  })

  const selectStyle = (field: string) => ({
    width: '100%', padding: '12px', borderRadius: '8px',
    border: errors[field] ? '2px solid red' : '1px solid #ddd',
    fontSize: '15px', background: 'white', outline: 'none'
  })

  // PAYMENT STEP — shown after form submission
  if (submitted) {
    return (
      <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          {/* Success header */}
          <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '28px', marginBottom: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#14532d', marginBottom: '8px' }}>Job Submitted!</h1>
            <p style={{ color: '#15803d', fontSize: '15px', marginBottom: '8px' }}>
              Your job listing has been saved. To go live as a <strong>Featured Job</strong>, please arrange payment of <strong>฿300</strong> via the options below.
            </p>
            <div style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', display: 'inline-block', marginTop: '8px' }}>
              <span style={{ color: '#666', fontSize: '13px' }}>Job Ref: </span>
              <span style={{ fontWeight: '900', color: '#1a1a2e', fontSize: '13px', fontFamily: 'monospace' }}>{jobRef}</span>
            </div>
          </div>

          {/* Pricing reminder */}
          <div style={{ background: '#fff3ed', border: '2px solid #E85D26', borderRadius: '14px', padding: '24px', marginBottom: '28px' }}>
            <div style={{ fontWeight: '900', color: '#E85D26', fontSize: '20px', marginBottom: '4px' }}>⭐ Featured Listing — ฿300</div>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>Highlighted at the top of all listings + homepage for {form.duration} days</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Payment Method', value: 'PromptPay or Bank Transfer' },
                { label: 'Bank', value: 'Kasikorn Bank (KBank)' },
                { label: 'Account Name', value: 'Jobs in Thailand' },
                { label: 'PromptPay', value: '0871033821' },
                { label: 'Amount', value: '฿300' },
                { label: 'Reference', value: (jobRef || '').slice(0, 8).toUpperCase() },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #ffe0cc', paddingBottom: '6px' }}>
                  <span style={{ color: '#888' }}>{item.label}</span>
                  <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact buttons */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' }}>📲 Contact Us to Pay</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Send your payment slip via WhatsApp, LINE, or Facebook — or email us at{' '}
              <a href="mailto:Admin@jobsinthailand.net" style={{ color: '#E85D26', fontWeight: 'bold' }}>Admin@jobsinthailand.net</a>.
              Your job will go live within a few hours of payment confirmation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href={`https://wa.me/66871033821?text=${waMessage}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
                <span style={{ fontSize: '22px' }}>💬</span> Send Payment Slip via WhatsApp
              </a>
              <a href="https://line.me/ti/p/+66871033821"
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#06C755', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', boxShadow: '0 4px 16px rgba(6,199,85,0.3)' }}>
                <span style={{ fontSize: '22px' }}>💬</span> Send Payment Slip via LINE
              </a>
              <a href="https://www.facebook.com/jobsinthailand.net"
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#1877F2', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', boxShadow: '0 4px 16px rgba(24,119,242,0.3)' }}>
                <span style={{ fontSize: '22px' }}>📘</span> Message Us on Facebook
              </a>
              <a href="mailto:Admin@jobsinthailand.net"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#1a1a2e', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px' }}>
                <span style={{ fontSize: '22px' }}>✉️</span> Email Admin@jobsinthailand.net
              </a>
            </div>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center' }}>
            Please include your Job Ref <strong>{(jobRef || '').slice(0, 8).toUpperCase()}</strong> when contacting us.
          </p>
        </div>
      </main>
    )
  }

  // FORM STEP
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <a href="/employers" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>← Back to options</a>

        <div style={{ background: '#fff3ed', border: '2px solid #E85D26', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '18px' }}>⭐ Featured Listing — ฿300</div>
            <div style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Pay via PromptPay or bank transfer — live within a few hours of payment</div>
          </div>
          <div style={{ fontSize: '36px' }}>🚀</div>
        </div>

        <div style={{ background: '#f0f7ff', border: '1px solid #2D6BE4', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
  <p style={{ color: '#2D6BE4', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>💡 Have a question?</p>
  <p style={{ color: '#555', fontSize: '13px', margin: '0' }}>Contact us at <a href="mailto:Admin@jobsinthailand.net" style={{ color: '#2D6BE4', fontWeight: 'bold' }}>Admin@jobsinthailand.net</a> or via WhatsApp/LINE.</p>
</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '32px' }}>{isTeaching ? '🏫' : '💼'}</span>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
            Post a Featured {isTeaching ? 'Teaching' : 'Other'} Job
          </h1>
        </div>
        <p style={{ color: '#666', marginBottom: '40px' }}>Fill in your job details — we'll contact you with payment instructions</p>

        {Object.values(errors).some(e => e !== '') && (
          <div style={{ background: '#ffeaea', border: '2px solid red', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontWeight: 'bold', color: 'red', marginBottom: '8px' }}>⚠️ Please fix the following:</div>
            {Object.values(errors).filter(e => e !== '').map((err, i) => (
              <div key={i} style={{ color: 'red', fontSize: '13px', marginBottom: '4px' }}>• {err}</div>
            ))}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Job Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder={isTeaching ? 'e.g. English Teacher, Kindergarten Teacher' : 'e.g. Hotel Manager, Web Developer'}
              style={inputStyle('title')} />
            {errors.title && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              {isTeaching ? 'School / Company Name *' : 'Company Name *'}
            </label>
            <input name="company" value={form.company} onChange={handleChange}
              placeholder={isTeaching ? 'e.g. Bangkok International School' : 'e.g. Phuket Resort & Spa'}
              style={inputStyle('company')} />
            {errors.company && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.company}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              {isTeaching ? 'Teaching Level / Type *' : 'Job Category *'}
            </label>
            <select name="category" value={form.category} onChange={handleChange} style={selectStyle('category')}>
              {(isTeaching ? teachingCategories : otherCategories).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Province / Location *</label>
              <select name="location" value={form.location} onChange={handleChange} style={selectStyle('location')}>
                <option value="">Select province</option>
                {thaiProvinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.location && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.location}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Job Type *</label>
              <select name="job_type" value={form.job_type} onChange={handleChange} style={selectStyle('job_type')}>
                {['Full Time', 'Part Time', 'Contract', 'Remote', 'Freelance'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Salary</label>
            <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. 40,000 - 60,000 THB"
              style={inputStyle('salary')} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Job Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5}
              placeholder="Describe the role and responsibilities..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.description ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
            {errors.description && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.description}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Requirements *</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={4}
              placeholder={isTeaching ? 'e.g. Bachelor degree, TEFL certificate...' : 'e.g. 3 years experience, relevant degree...'}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.requirements ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
            {errors.requirements && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.requirements}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Benefits *</label>
            <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={4}
              placeholder="e.g. Work permit, health insurance, flight allowance..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.benefits ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
            {errors.benefits && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.benefits}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Contact Email</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="jobs@yourcompany.com"
              style={inputStyle('email')} />
            {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" name="visa_sponsor" checked={form.visa_sponsor} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
              <span style={{ fontWeight: 'bold', color: '#333' }}>We provide visa sponsorship / work permit</span>
            </label>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Listing Duration</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[3, 5, 7, 14].map(days => (
                <button key={days} type="button" onClick={() => setForm(prev => ({ ...prev, duration: days }))}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '2px solid', borderColor: form.duration === days ? '#E85D26' : '#ddd', background: form.duration === days ? '#fff3ed' : 'white', color: form.duration === days ? '#E85D26' : '#555', fontWeight: form.duration === days ? 'bold' : 'normal', cursor: 'pointer', fontSize: '14px' }}>
                  {days} days
                </button>
              ))}
            </div>
            <p style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>Default is 14 days for featured listings</p>
          </div>

          {/* Payment info */}
          <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '28px' }}>💳</div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', marginBottom: '4px' }}>Payment via PromptPay or Bank Transfer</div>
              <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>
                After submitting, we'll send you our PromptPay QR code and bank details via WhatsApp, LINE, or Facebook.
                Your job goes live within a few hours of payment confirmation.
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#555' }}>
                📧 Or email us at{' '}
                <a href="mailto:Admin@jobsinthailand.net" style={{ color: '#E85D26', fontWeight: 'bold' }}>Admin@jobsinthailand.net</a>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              onVerify={token => { setCaptchaToken(token); setErrors(prev => ({ ...prev, captcha: '' })) }}
              onExpire={() => setCaptchaToken('')}
            />
          </div>
          {errors.captcha && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>{errors.captcha}</p>}

          <button onClick={handleJobSubmit} disabled={jobLoading}
            style={{ width: '100%', background: jobLoading ? '#ccc' : '#E85D26', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: jobLoading ? 'not-allowed' : 'pointer' }}>
            {jobLoading ? 'Saving job...' : '⭐ Submit Job & Arrange Payment →'}
          </button>
          <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginTop: '12px' }}>
            We will contact you with payment details within a few hours
          </p>
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}>
      <PostFeaturedPage />
    </Suspense>
  )
}
