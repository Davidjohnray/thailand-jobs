'use client'
import { useState } from 'react'
import { supabase } from '../../src/lib/supabase'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', company: '', message: ''
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('messages').insert([{
      name: form.name,
      email: form.email,
      company: form.company,
      job_title: 'Advertising Enquiry',
      message: form.message,
    }])
    if (error) { alert('Error: ' + error.message) } else { setSuccess(true) }
    setLoading(false)
  }

  if (success) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Message Sent!</h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '32px' }}>We will be in touch shortly about your enquiry.</p>
      <a href="/" style={{ background: '#E85D26', color: 'white', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
        Back to Home
      </a>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <a href="/" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>← Back to Home</a>

        <div style={{ background: '#fff3ed', border: '2px solid #E85D26', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '18px' }}>📣 Advertise with Us</div>
            <div style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Reach thousands of expats and job seekers in Thailand</div>
          </div>
          <div style={{ fontSize: '36px' }}>🇹🇭</div>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>Get in Touch</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>Send us a message and we will get back to you with advertising options and pricing</p>

        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Your Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Email *</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="your@email.com"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Company / Website</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="Your company or website"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Message *</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={5}
              placeholder="Tell us about your advertising needs, target audience, budget etc..."
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', background: loading ? '#ccc' : '#E85D26', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
            {loading ? 'Sending...' : 'Send Message →'}
          </button>
        </div>
      </div>
    </main>
  )
}