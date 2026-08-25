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
}

const BENEFITS = [
  { icon: '🏫', title: 'Your own branded page', desc: 'A professional recruitment page at jobsinthailand.net/schools/[your-school] with your banner photo and programme details.' },
  { icon: '👥', title: 'Private teacher pool', desc: 'Teachers register their interest directly with your school — building up a ready pool of candidates before you even advertise a vacancy.' },
  { icon: '🔒', title: 'Password-protected dashboard', desc: 'Only your HR team can access your private dashboard. Browse, filter and shortlist teachers at any time.' },
  { icon: '🎥', title: 'Full teacher profiles', desc: 'Every teacher submits their photo, qualifications, experience, availability and a short intro video link.' },
  { icon: '📋', title: 'Your vacancies listed', desc: 'Current job openings appear directly on your school page, linked to your full job listing on the site.' },
  { icon: '📢', title: 'Promoted to 250,000+ members', desc: 'Your school page is promoted across our Facebook, WhatsApp and LINE communities reaching thousands of teachers every month.' },
]

const STEPS = [
  { num: '1', title: 'Get in touch', desc: 'Contact us and we\'ll set up your school page within 24 hours. We just need your school name, banner photo and a few details.' },
  { num: '2', title: 'Teachers register', desc: 'Teachers browsing the site find your page, see your vacancies and register their interest with their full profile and intro video.' },
  { num: '3', title: 'You choose who to contact', desc: 'Log into your private dashboard, browse registered teachers, shortlist your favourites and contact them directly — no middlemen.' },
]

export default function SchoolPartnersPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [school, setSchool] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const fetchSchools = async () => {
      const { data } = await supabase
        .from('schools')
        .select('id, name, slug, programme, location, banner_url')
        .eq('active', true)
        .order('created_at', { ascending: true })
      if (data) setSchools(data)
    }
    fetchSchools()
  }, [])

  const handleEnquiry = async () => {
    if (!name.trim() || !email.trim() || !school.trim()) return
    setSending(true)
    await supabase.from('school_enquiries').insert({
      name, email, school_name: school, message
    })
    setSent(true)
    setSending(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a5c3a 0%, #0f3d27 100%)', padding: '70px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#a8d5bc', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 16px', borderRadius: '20px', marginBottom: '20px' }}>
            New — School Partner Pages
          </div>
          <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '16px' }}>
            Build your private teacher pool — before you even need to hire
          </h1>
          <p style={{ color: '#c8e6d5', fontSize: '17px', lineHeight: '1.8', marginBottom: '32px' }}>
            Get your own branded recruitment page on jobsinthailand.net. Teachers register their interest directly with your school — so when a vacancy opens up, your shortlist is already waiting.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#enquire" style={{ background: '#E85D26', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
              Get your school page →
            </a>
            <a href="#schools" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)' }}>
              See partner schools
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'white', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', textAlign: 'center' }}>
          {[
            { num: '250,000+', label: 'Community members' },
            { num: '1,000+', label: 'Daily visitors' },
            { num: '24hrs', label: 'Page goes live' },
            { num: '฿0', label: 'Agency fees for you' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a5c3a' }}>{s.num}</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a5c3a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>How it works</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>Simple. Fast. Effective.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {STEPS.map(step => (
            <div key={step.num} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: '#1a5c3a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>
                {step.num}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>{step.title}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7' }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ background: 'white', padding: '60px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a5c3a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>What you get</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>Everything your school needs to find great teachers</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ background: '#f0f7f4', borderRadius: '12px', padding: '22px', border: '1px solid #d4edda' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{b.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>{b.title}</div>
                <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.7' }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PITCH PULL QUOTE */}
      <section style={{ background: '#1a5c3a', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>💡</div>
          <p style={{ color: 'white', fontSize: '20px', lineHeight: '1.8', fontWeight: '500', marginBottom: '16px' }}>
            "A typical agency placement fee in Thailand costs ฿30,000–฿50,000. Our School Partner Page gives you a continuous stream of interested, qualified teachers — for a fraction of that cost."
          </p>
          <p style={{ color: '#a8d5bc', fontSize: '14px' }}>No agency fees. No middlemen. Direct contact with every teacher.</p>
        </div>
      </section>

      {/* PARTNER SCHOOLS */}
      <section id="schools" style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a5c3a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Currently on board</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>Our partner schools</h2>
            <p style={{ color: '#666', fontSize: '15px', marginTop: '8px' }}>Join these schools already building their private teacher pool</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {schools.map(s => (
              <Link key={s.id} href={`/schools/${s.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e8e8' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
                    ;(e.currentTarget as HTMLDivElement).style.borderColor = '#ccc'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                    ;(e.currentTarget as HTMLDivElement).style.borderColor = '#e8e8e8'
                  }}
                >
                  <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
                    {s.banner_url ? (
                      <img src={s.banner_url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#1a5c3a' }} />
                    )}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#22c55e', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>
                      Partner
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '3px' }}>{s.name}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                      {s.programme && `${s.programme} · `}{s.location}
                    </div>
                    <span style={{ background: '#1a5c3a', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '6px' }}>
                      View school page →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Your school here */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1.5px dashed #d0d0d0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏫</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#888', marginBottom: '6px' }}>Your school here</div>
              <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '16px' }}>Get your own branded recruitment page</div>
              <a href="#enquire" style={{ background: '#E85D26', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none' }}>
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section id="enquire" style={{ background: 'white', padding: '60px 24px', borderTop: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a5c3a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Get started</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '10px' }}>Get your school page live in 24 hours</h2>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7' }}>Fill in your details below and we'll be in touch to get your school set up.</p>
          </div>

          {sent ? (
            <div style={{ background: '#f0f7f4', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a5c3a', marginBottom: '8px' }}>Enquiry received!</div>
              <p style={{ fontSize: '14px', color: '#555' }}>Thank you — we'll be in touch within 24 hours to get your school page set up.</p>
            </div>
          ) : (
            <div style={{ background: '#f8f8f6', borderRadius: '12px', padding: '32px', border: '1px solid #e8e8e8' }}>
              {[
                { label: 'Your name', value: name, set: setName, placeholder: 'e.g. Khun Nattaya' },
                { label: 'Email address', value: email, set: setEmail, placeholder: 'your@school.ac.th' },
                { label: 'School name', value: school, set: setSchool, placeholder: 'e.g. Bangkok International Academy' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>
                    {f.label} <span style={{ color: '#c0392b' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>
                  Any questions? (optional)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Tell us a bit about your school or ask us anything..."
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'vertical', outline: 'none' }}
                />
              </div>
              <button
                onClick={handleEnquiry}
                disabled={sending || !name.trim() || !email.trim() || !school.trim()}
                style={{ width: '100%', background: sending ? '#888' : '#1a5c3a', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: sending ? 'not-allowed' : 'pointer' }}
              >
                {sending ? 'Sending...' : 'Send enquiry →'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#888' }}>
                Or email us directly at <a href="mailto:admin@jobsinthailand.net" style={{ color: '#1a5c3a' }}>admin@jobsinthailand.net</a>
              </div>
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
