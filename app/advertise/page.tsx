'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['Cleaning', 'Health', 'Legal', 'Insurance', 'Transport', 'Tutoring', 'Visa', 'Food', 'Other']

function ExpatServicesForm() {
  const [pkg, setPkg] = useState<'standard' | 'featured'>('standard')
  const [banner, setBanner] = useState<'provide' | 'design'>('provide')
  const [form, setForm] = useState({
    name: '', email: '', business_name: '', category: 'Cleaning',
    tagline: '', location: '', website: '', contact: '', message: ''
  })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.business_name.trim()) {
      setError('Please fill in your name, email and business name.')
      return
    }
    setError('')
    setSent(true)
  }

  const waMessage = encodeURIComponent(`Hi David,

I would like to advertise on the Expat Services Directory.

Package: ${pkg === 'featured' ? '⭐ Featured — ฿1,000 for 6 months' : 'Standard — ฿500 for 6 months'}
Banner: ${banner === 'provide' ? 'I will provide a 250×250 image' : 'Please design a simple card for me'}

Business Name: ${form.business_name}
Category: ${form.category}
Tagline: ${form.tagline || '—'}
Location: ${form.location || '—'}
Website: ${form.website || '—'}
Contact (LINE/WhatsApp/Phone): ${form.contact || '—'}

My name: ${form.name}
My email: ${form.email}
${form.message ? `\nExtra notes: ${form.message}` : ''}`)

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #5eead4' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a2e', marginBottom: '12px' }}>1. Choose your package</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setPkg('standard')}
            style={{ flex: 1, minWidth: '200px', padding: '16px 20px', borderRadius: '12px', border: '3px solid', borderColor: pkg === 'standard' ? '#0ea5e9' : '#e5e7eb', background: pkg === 'standard' ? '#f0f9ff' : 'white', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontWeight: '800', fontSize: '16px', color: pkg === 'standard' ? '#0ea5e9' : '#1a1a2e' }}>Standard Listing</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0ea5e9', margin: '4px 0' }}>฿500</div>
            <div style={{ color: '#666', fontSize: '13px' }}>6 months · 250×250 banner · grid placement</div>
          </button>
          <button onClick={() => setPkg('featured')}
            style={{ flex: 1, minWidth: '200px', padding: '16px 20px', borderRadius: '12px', border: '3px solid', borderColor: pkg === 'featured' ? '#c9a84c' : '#e5e7eb', background: pkg === 'featured' ? '#fffbeb' : 'white', cursor: 'pointer', textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '16px', background: 'linear-gradient(135deg, #c9a84c, #f59e0b)', color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>⭐ FEATURED</div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: pkg === 'featured' ? '#c9a84c' : '#1a1a2e', marginTop: '6px' }}>Featured Listing</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#c9a84c', margin: '4px 0' }}>฿1,000</div>
            <div style={{ color: '#666', fontSize: '13px' }}>6 months · gold border · always shown first · max 10 spots</div>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a2e', marginBottom: '12px' }}>2. Your banner</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setBanner('provide')}
            style={{ flex: 1, minWidth: '180px', padding: '14px 16px', borderRadius: '12px', border: '3px solid', borderColor: banner === 'provide' ? '#7c3aed' : '#e5e7eb', background: banner === 'provide' ? '#f5f3ff' : 'white', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontWeight: '700', fontSize: '14px', color: banner === 'provide' ? '#7c3aed' : '#374151' }}>🖼️ I will provide a 250×250 image</div>
            <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>Send us your ready-made banner and we will upload it</div>
          </button>
          <button onClick={() => setBanner('design')}
            style={{ flex: 1, minWidth: '180px', padding: '14px 16px', borderRadius: '12px', border: '3px solid', borderColor: banner === 'design' ? '#7c3aed' : '#e5e7eb', background: banner === 'design' ? '#f5f3ff' : 'white', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontWeight: '700', fontSize: '14px', color: banner === 'design' ? '#7c3aed' : '#374151' }}>✏️ Please create a simple card for me</div>
            <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>We will build a styled card using your details below</div>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a2e', marginBottom: '16px' }}>3. Your business details</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Business Name *</label>
            <input name="business_name" value={form.business_name} onChange={handleChange} placeholder="e.g. Lucky Cleaning Service"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Tagline <span style={{ color: '#9ca3af', fontWeight: '400' }}>(1 short line)</span></label>
            <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="e.g. Professional cleaning across Bangkok"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Location <span style={{ color: '#9ca3af', fontWeight: '400' }}>(city or nationwide)</span></label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangkok, Phuket, Nationwide"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Website URL <span style={{ color: '#9ca3af', fontWeight: '400' }}>(optional)</span></label>
            <input name="website" value={form.website} onChange={handleChange} placeholder="https://yourwebsite.com"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Phone / LINE / WhatsApp <span style={{ color: '#9ca3af', fontWeight: '400' }}>(optional)</span></label>
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="e.g. +66 81 234 5678"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a2e', marginBottom: '16px' }}>4. Your contact details</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Your Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Email Address *</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" type="email"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginTop: '14px' }}>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Anything else? <span style={{ color: '#9ca3af', fontWeight: '400' }}>(optional)</span></label>
          <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Any questions or extra details..."
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
        </div>
      </div>

      {error && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

      {!sent ? (
        <button onClick={handleSubmit}
          style={{ width: '100%', background: 'linear-gradient(135deg, #0f766e, #0ea5e9)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(14,165,233,0.3)' }}>
          Prepare My Enquiry →
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: '800', color: '#14532d', fontSize: '15px', marginBottom: '4px' }}>✅ Your details are ready!</div>
            <div style={{ color: '#15803d', fontSize: '13px' }}>Tap a button below to send your enquiry directly. Your message will be pre-filled with all your details.</div>
          </div>
          <a href={`https://wa.me/66871033821?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', boxShadow: '0 4px 16px rgba(37,211,102,0.4)' }}>
            <span style={{ fontSize: '24px' }}>💬</span> Send via WhatsApp
          </a>
          <a href="https://line.me/ti/p/+66871033821" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#06C755', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', boxShadow: '0 4px 16px rgba(6,199,85,0.4)' }}>
            <span style={{ fontSize: '24px' }}>💬</span> Send via LINE
          </a>
          <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', margin: 0 }}>WhatsApp message is pre-filled with all your details. LINE will open your chat — copy your details across if needed.</p>
        </div>
      )}
    </div>
  )
}

export default function AdvertisePage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📢</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>Advertise With Us</h1>
        <p style={{ color: '#ccc', fontSize: '16px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          Reach thousands of expats, teachers and job seekers across Thailand — on our website AND across 240,000+ members on Facebook, WhatsApp and LINE.
        </p>
      </section>

      {/* STATS */}
      <section style={{ background: '#E85D26', padding: '32px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', textAlign: 'center' }}>
          {[
            { number: '10,000+', label: 'Monthly Website Visitors' },
            { number: '240,000+', label: 'Social Media Members' },
            { number: '🇹🇭', label: 'All Thailand' },
            { number: '📈', label: 'Growing Every Day' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{stat.number}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL MEDIA PACKAGES */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>🌐 Website + Social Media Packages</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '12px', fontSize: '16px' }}>
          All packages include your banner on the website <strong>plus</strong> regular promotion to our Facebook, WhatsApp and LINE communities
        </p>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ background: '#fef3c7', border: '1px solid #fbbf24', color: '#92400e', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: '700' }}>
            💡 Our audience grows every day — the sooner you start, the bigger the reach!
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>

          {/* STANDARD */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #e5e7eb' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>⭐</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Standard</h3>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#E85D26' }}>฿500<span style={{ fontSize: '14px', color: '#888', fontWeight: '400' }}>/month</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {['✅ Right-side homepage banner', '✅ Weekly post to all Facebook groups', '✅ 240,000+ Facebook members reached', '✅ Weekly WhatsApp promotion', '✅ Weekly LINE group promotion'].map(f => (
                <div key={f} style={{ fontSize: '13px', color: '#444' }}>{f}</div>
              ))}
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#555' }}>
              <strong style={{ color: '#16a34a' }}>Save with longer packages:</strong><br />
              3 months — ฿1,275 <span style={{ color: '#16a34a', fontWeight: 'bold' }}>(save 15%)</span><br />
              6 months — ฿2,250 <span style={{ color: '#16a34a', fontWeight: 'bold' }}>(save 25%)</span>
            </div>
          </div>

          {/* FEATURED */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 24px rgba(232,93,38,0.15)', border: '2px solid #E85D26', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#E85D26', color: 'white', padding: '4px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>🔥 MOST POPULAR</div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔥</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Featured</h3>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#E85D26' }}>฿850<span style={{ fontSize: '14px', color: '#888', fontWeight: '400' }}>/month</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {['✅ Everything in Standard', '✅ Banner on homepage + inner pages', '✅ Jobs, ESL Resources, Teachers & more', '✅ Priority placement — shown first', '✅ Twice weekly social media posts'].map(f => (
                <div key={f} style={{ fontSize: '13px', color: '#444' }}>{f}</div>
              ))}
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#555' }}>
              <strong style={{ color: '#16a34a' }}>Save with longer packages:</strong><br />
              3 months — ฿2,168 <span style={{ color: '#16a34a', fontWeight: 'bold' }}>(save 15%)</span><br />
              6 months — ฿3,825 <span style={{ color: '#16a34a', fontWeight: 'bold' }}>(save 25%)</span>
            </div>
          </div>

          {/* PREMIUM */}
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', border: '2px solid #7c3aed', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', padding: '4px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>👑 MAXIMUM REACH</div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>👑</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: '0 0 4px' }}>Premium</h3>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#a78bfa' }}>฿1,500<span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '400' }}>/month</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {['✅ Everything in Featured', '✅ Banner across ALL pages of the site', '✅ 3x weekly social media posts', '✅ Dedicated post written about your business', '✅ Listed in Expat Services Directory'].map(f => (
                <div key={f} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>{f}</div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              <strong style={{ color: '#a78bfa' }}>Save with longer packages:</strong><br />
              3 months — ฿3,825 <span style={{ color: '#86efac', fontWeight: 'bold' }}>(save 15%)</span><br />
              6 months — ฿6,750 <span style={{ color: '#86efac', fontWeight: 'bold' }}>(save 25%)</span>
            </div>
          </div>

        </div>

        {/* GROWING AUDIENCE BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #0f766e, #0ea5e9)', borderRadius: '16px', padding: '24px 32px', marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '40px' }}>📈</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>Our audience is growing every single day</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
              We currently have over 240,000 members across all our social platforms and it grows daily. Advertisers who join now benefit from an ever-increasing audience at a locked-in rate — the longer you advertise, the more people you reach for the same price.
            </div>
          </div>
        </div>
      </section>

      {/* WEBSITE-ONLY PACKAGES */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>🖥️ Website Banner Packages</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>Website-only banner placements</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* SIDEBAR BANNER */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>📦</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Sidebar Banner</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>250×250px — displayed on the homepage sidebar</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {['Homepage placement', 'Thousands of views', 'Link to your website', 'Your logo & branding'].map(f => (
                    <span key={f} style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 14px', display: 'inline-block' }}>
                  <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '700' }}>🎓 Free Training Page banner included</span>
                  <span style={{ color: '#555', fontSize: '12px' }}> — for TEFL, language & training course advertisers</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>PRICING</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[['1 Month', '฿500'], ['3 Months', '฿1,400'], ['6 Months', '฿2,700']].map(([period, price]) => (
                      <div key={period} style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                        <span>{period}</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO SIDE BANNER */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #E85D26', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '32px', background: '#E85D26', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>PREMIUM PLACEMENT</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>⭐</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Hero Side Banner</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>250×250px — displayed next to the main homepage title</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Prime homepage position', 'First thing visitors see', 'Maximum exposure', 'Link to your website', 'Your logo & branding'].map(f => (
                    <span key={f} style={{ background: '#fff3ed', color: '#E85D26', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>PRICING</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[['1 Month', '฿750'], ['3 Months', '฿2,100'], ['6 Months', '฿4,000']].map(([period, price]) => (
                      <div key={period} style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                        <span>{period}</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO CENTRE LONG BANNER */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #7c3aed', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '32px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>🔥 HIGH VISIBILITY</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>📺</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Hero Centre Long Banner</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>Wide banner displayed in the centre of the homepage hero section</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Centre homepage placement', 'Seen by every visitor', 'Full-width visibility', 'Link to your website', 'Your branding & message'].map(f => (
                    <span key={f} style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>PRICING</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[['1 Month', '฿850'], ['3 Months', '฿2,300'], ['6 Months', '฿4,500']].map(([period, price]) => (
                      <div key={period} style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                        <span>{period}</span><span style={{ fontWeight: 'bold', color: '#7c3aed' }}>{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EXPAT SERVICES */}
          <div id="expat-services" style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #0ea5e9', position: 'relative', scrollMarginTop: '80px' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '32px', background: 'linear-gradient(135deg, #0f766e, #0ea5e9)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>🏙️ NEW</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>🏙️</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Expat Services Directory</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>250×250 banner on the Expat Services page — reach expats across Thailand</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {['6 month listing', '250×250 banner', 'Link to your website', 'Phone/LINE/WhatsApp contact', 'Provide image or we design a card'].map(f => (
                    <span key={f} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 14px', display: 'inline-block' }}>
                  <span style={{ color: '#92400e', fontSize: '13px', fontWeight: '700' }}>⭐ Featured upgrade available</span>
                  <span style={{ color: '#555', fontSize: '12px' }}> — gold border, always shown first, max 10 spots</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#e0f2fe', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#0369a1', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>PRICING</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>Standard</span><span style={{ fontWeight: 'bold', color: '#0369a1' }}>฿500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>⭐ Featured</span><span style={{ fontWeight: 'bold', color: '#c9a84c' }}>฿1,000</span>
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'right' }}>both 6 months</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '2px solid #e0f2fe', paddingTop: '28px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' }}>📋 Submit Your Listing Enquiry</h4>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Fill in your details and send us a message via WhatsApp or LINE — we will reply within 24 hours with payment details.</p>
              <ExpatServicesForm />
            </div>
          </div>

          {/* TRAINING PAGE BANNER */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #0ea5e9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>🎓</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Training Page Banner</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>Featured placement on the Training & Courses section</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {['Training section placement', 'Reach course-seekers directly', 'TEFL, language & tutoring', 'Link to your website'].map(f => (
                    <span key={f} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 14px', display: 'inline-block' }}>
                  <span style={{ color: '#92400e', fontSize: '13px', fontWeight: '700' }}>💡 Already included free</span>
                  <span style={{ color: '#555', fontSize: '12px' }}> — if you purchase a Homepage Sidebar or Hero Banner</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#e0f2fe', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#0369a1', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>STANDALONE PRICE</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0369a1' }}>฿300</div>
                  <div style={{ color: '#555', fontSize: '13px' }}>per month</div>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURED JOB LISTING */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>🚀</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Featured Job Listing</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>Your job at the top of all listings + homepage for 14 days</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Homepage featured section', 'Top of all job listings', '⭐ Featured badge', '14 days live', 'Instant activation'].map(f => (
                    <span key={f} style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>ONE-OFF PRICE</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#E85D26' }}>฿300</div>
                  <div style={{ color: '#999', fontSize: '13px' }}>per listing · 14 days</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* WHY ADVERTISE */}
      <section style={{ background: '#f9f9f9', padding: '60px 24px', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '48px', color: '#1a1a2e' }}>Why Advertise With Us?</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
            {[
              { icon: '🎯', title: 'Targeted Audience', desc: 'Reach expats, teachers and professionals actively looking for services in Thailand' },
              { icon: '📣', title: '240,000+ Social Members', desc: 'Your promotion goes to our Facebook, WhatsApp and LINE communities — all growing daily' },
              { icon: '💰', title: 'Affordable Rates', desc: 'Much cheaper than the big platforms — save 15% for 3 months or 25% for 6 months' },
              { icon: '⚡', title: 'Instant Setup', desc: 'Your ad goes live within 24 hours of payment' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Your ad is seen on desktop and mobile devices across Thailand' },
              { icon: '📈', title: 'Growing Every Day', desc: 'Our audience grows daily — start now and benefit from increasing reach at the same price' },
            ].map(f => (
              <div key={f.title} style={{ flex: 1, minWidth: '220px', maxWidth: '260px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#1a1a2e' }}>{f.title}</div>
                <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>Ready to Advertise?</h2>
        <p style={{ color: '#ccc', fontSize: '16px', maxWidth: '500px', margin: '0 auto 24px' }}>
          Get in touch and we will set up your ad within 24 hours. We accept bank transfer and PromptPay.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/66871033821" target="_blank" rel="noopener noreferrer"
            style={{ background: '#25D366', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block' }}>
            💬 WhatsApp Us →
          </a>
          <a href="mailto:Admin@jobsinthailand.net"
            style={{ background: 'white', color: '#1a1a2e', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block', border: '1px solid #555' }}>
            ✉️ Admin@jobsinthailand.net
          </a>
          <Link href="#expat-services"
            style={{ background: 'linear-gradient(135deg, #0f766e, #0ea5e9)', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block' }}>
            🏙️ Expat Services Enquiry →
          </Link>
          <Link href="/contact"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.3)' }}>
            Contact Us →
          </Link>
        </div>
      </section>

    </main>
  )
}
