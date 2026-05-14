'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

// ⚠️ UPDATE THESE WHEN DUKE CONFIRMS
const DISCOUNT_CODE = 'JIT10'
const DUKE_EMAIL = 'info@dukelanguage.com'
const DUKE_PHONE = '+66 XX XXX XXXX'
const DUKE_LINE = '@dukelanguage'
const DUKE_WEBSITE_LABEL = 'Duke Language School'

export default function DukeLanguagePage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    level: '',
    goal: '',
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setLoading(true)
    await supabase.from('duke_leads').insert([{
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      level: form.level || null,
      goal: form.goal || null,
      source: 'duke-landing-page',
      created_at: new Date().toISOString(),
    }])
    setSubmitted(true)
    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const reasons = [
    {
      icon: '💼',
      title: 'Your school will notice',
      body: 'Thai teachers and directors respect foreign teachers who make the effort to learn even basic Thai. It shows commitment, earns trust, and often leads to contract renewals and better working conditions.',
    },
    {
      icon: '🧒',
      title: 'Connect with your students',
      body: "Young learners respond to teachers who can explain things in Thai when English isn't landing. A few words breaks the ice and makes you far more effective in the classroom.",
    },
    {
      icon: '🏙️',
      title: 'Daily life gets dramatically easier',
      body: "Ordering food, taking taxis, shopping at the market, dealing with landlords, visiting the hospital — everything changes when you can communicate. Thailand opens up in ways Google Translate never will.",
    },
    {
      icon: '💰',
      title: 'Your salary goes further',
      body: 'Teachers who can negotiate in Thai, shop local, and avoid the tourist tax consistently spend less and save more. Your baht stretches further when you\'re not dependent on English-speaking services.',
    },
    {
      icon: '🛂',
      title: 'Helps with visas and work permits',
      body: 'Dealing with immigration, the Labour Department, or local government offices is significantly smoother when you can follow basic Thai. Officers respond differently to teachers who have made an effort.',
    },
    {
      icon: '🌏',
      title: 'Most teachers never bother — so you stand out',
      body: 'The vast majority of foreign teachers in Thailand never learn Thai beyond sawadee krap. That\'s your opportunity. Schools, students, and communities remember the ones who tried.',
    },
  ]

  const courseTypes = [
    {
      icon: '👤',
      title: 'One-on-One Lessons',
      description: 'Fastest progress. Fully tailored to your schedule, goals and current level. Ideal if you\'re working full time and want structured learning that fits around your timetable.',
      tag: 'Most Popular',
      tagColor: '#E85D26',
    },
    {
      icon: '👥',
      title: 'Group Classes',
      description: 'Learn alongside other expats and teachers at a similar level. More affordable, still structured, and a great way to practise conversation in a low-pressure environment.',
      tag: 'Best Value',
      tagColor: '#2D6BE4',
    },
    {
      icon: '📱',
      title: 'Online Classes',
      description: 'Study from anywhere — your apartment, a café, or between classes at school. Same qualified teachers, same structured curriculum, fully remote.',
      tag: 'Study Anywhere',
      tagColor: '#16a34a',
    },
    {
      icon: '⚡',
      title: 'Intensive Courses',
      description: 'For teachers who want rapid results. Concentrated daily sessions designed to get you functional in Thai as fast as possible. Popular with new arrivals to Thailand.',
      tag: 'New Arrivals',
      tagColor: '#7C3AED',
    },
  ]

  // THANK YOU / DISCOUNT REVEAL SCREEN
  if (submitted) {
    return (
      <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
        <section style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '72px 24px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>
              Your Discount is Ready!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '40px' }}>
              You're registered as a Jobs in Thailand member. Use the code below when you contact Duke Language School to claim your exclusive discount.
            </p>

            {/* DISCOUNT CODE BOX */}
            <div style={{ background: 'rgba(201,168,76,0.12)', border: '2px solid #c9a84c', borderRadius: '16px', padding: '32px 24px', marginBottom: '32px' }}>
              <div style={{ color: '#c9a84c', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Your Exclusive Discount Code</div>
              <div style={{ fontFamily: 'monospace', fontSize: '40px', fontWeight: '900', color: 'white', letterSpacing: '6px', marginBottom: '16px' }}>{DISCOUNT_CODE}</div>
              <button onClick={copyCode}
                style={{ background: copied ? '#16a34a' : '#c9a84c', color: '#1a1a2e', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s' }}>
                {copied ? '✓ Copied!' : '📋 Copy Code'}
              </button>
            </div>

            {/* HOW TO USE */}
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '28px 24px', marginBottom: '32px', textAlign: 'left' }}>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>📌 How to claim your discount</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Contact Duke Language School using the details below',
                  `Quote your discount code: ${DISCOUNT_CODE}`,
                  'Tell them you\'re a Jobs in Thailand member',
                  'Choose your course and start learning Thai!',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ background: '#c9a84c', color: '#1a1a2e', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.5' }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DUKE CONTACT DETAILS */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ height: '40px', objectFit: 'contain' }} />
              </div>
              <div style={{ fontWeight: '800', fontSize: '18px', color: '#1a1a2e', marginBottom: '4px' }}>Duke Language School</div>
              <div style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Professional Thai language courses for expats and teachers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href={`mailto:${DUKE_EMAIL}?subject=Thai Course Enquiry — Code ${DISCOUNT_CODE}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff3ed', color: '#E85D26', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                  <span style={{ fontSize: '20px' }}>📧</span> {DUKE_EMAIL}
                </a>
                <a href={`tel:${DUKE_PHONE}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0f4ff', color: '#2D6BE4', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                  <span style={{ fontSize: '20px' }}>📞</span> {DUKE_PHONE}
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#e8f5e9', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '14px' }}>
                  <span style={{ fontSize: '20px' }}>💬</span> LINE: {DUKE_LINE}
                </div>
              </div>
              <div style={{ marginTop: '16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 14px', color: '#92400e', fontSize: '13px', fontWeight: '600' }}>
                💡 Remember to quote code <strong>{DISCOUNT_CODE}</strong> when you get in touch!
              </div>
            </div>

          </div>
        </section>

        <div style={{ textAlign: 'center', padding: '32px 24px' }}>
          <Link href="/jobs/teaching" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>← Back to Teaching Jobs</Link>
        </div>
      </main>
    )
  }

  // MAIN LANDING PAGE
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '72px 24px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 20px)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '30px', padding: '6px 20px', marginBottom: '24px' }}>
            <span style={{ color: '#c9a84c', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>🇹🇭 Exclusive Member Offer — Jobs in Thailand</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '44px', fontWeight: '900', marginBottom: '16px', lineHeight: '1.2' }}>
            The Language Course<br />
            <span style={{ color: '#c9a84c' }}>Every Teacher in Thailand</span><br />
            Should Take
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', lineHeight: '1.7', marginBottom: '36px', maxWidth: '580px', margin: '0 auto 36px' }}>
            You came to teach English. But the teachers who stay, thrive, and genuinely enjoy life in Thailand are the ones who learn Thai. Register below to unlock your exclusive Jobs in Thailand member discount with Duke Language School.
          </p>
          <a href="#register"
            style={{ display: 'inline-block', background: '#c9a84c', color: '#1a1a2e', padding: '16px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: '800', fontSize: '16px' }}>
            Claim Your Member Discount →
          </a>
        </div>
      </section>

      {/* WHY LEARN THAI */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#1a1a2e', marginBottom: '12px' }}>
            6 Reasons Teachers in Thailand Should Learn Thai
          </h2>
          <p style={{ color: '#666', fontSize: '16px', maxWidth: '560px', margin: '0 auto' }}>
            Most foreign teachers never bother. That's exactly why you should.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
          {reasons.map((r, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{r.icon}</div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e', marginBottom: '8px' }}>{r.title}</div>
              <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.65' }}>{r.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section style={{ background: '#1a1a2e', padding: '64px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
            What You'll Actually Learn
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '48px' }}>
            A structured Thai course covers far more than phrases from a YouTube video.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🔤', label: 'Thai script & alphabet', sub: 'The foundation that unlocks everything' },
              { icon: '🗣️', label: 'Tones & pronunciation', sub: 'Say the right word, not the wrong one' },
              { icon: '🛒', label: 'Everyday vocabulary', sub: 'Markets, food, directions, numbers' },
              { icon: '🏫', label: 'School Thai', sub: 'Talk to Thai staff with confidence' },
              { icon: '🏥', label: 'Medical & admin Thai', sub: 'Hospitals, visas, government offices' },
              { icon: '💬', label: 'Real conversation', sub: 'Back-and-forth, not just phrases' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px 14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', lineHeight: '1.5' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW LONG DOES IT TAKE */}
      <section style={{ background: '#fffbeb', borderTop: '1px solid #fde68a', borderBottom: '1px solid #fde68a', padding: '56px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1a1a2e', marginBottom: '32px', textAlign: 'center' }}>
            How Long Does It Take to Learn Thai?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { time: '4–6 weeks', level: 'Survival Thai', color: '#16a34a', desc: 'Greet people, order food, count, take taxis, say where you live. Enough to feel confident day-to-day.' },
              { time: '3–6 months', level: 'Functional Thai', color: '#2D6BE4', desc: 'Hold basic conversations, understand directions, communicate with Thai colleagues and school parents.' },
              { time: '1–2 years', level: 'Conversational Thai', color: '#7C3AED', desc: 'Discuss topics in depth, understand TV and radio, navigate any social or professional situation with ease.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ background: item.color, color: 'white', borderRadius: '8px', padding: '8px 16px', fontWeight: '800', fontSize: '14px', whiteSpace: 'nowrap' as any, flexShrink: 0 }}>{item.time}</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '16px', marginBottom: '4px' }}>{item.level}</div>
                  <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: '#92400e', fontSize: '14px', marginTop: '20px', textAlign: 'center', fontWeight: '600' }}>
            💡 Most teachers who take structured lessons reach Survival Thai within their first month.
          </p>
        </div>
      </section>

      {/* COURSE TYPES */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#1a1a2e', marginBottom: '12px' }}>Course Types Available</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>Whether you're a complete beginner or already know some basics, there's a format that fits your life.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {courseTypes.map((c, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #eee' }}>
              <div style={{ background: c.tagColor, padding: '8px 16px', textAlign: 'center' }}>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' as any }}>{c.tag}</span>
              </div>
              <div style={{ padding: '24px 20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{c.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e', marginBottom: '8px' }}>{c.title}</div>
                <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{c.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT DUKE */}
      <section style={{ background: '#1a1a2e', padding: '56px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ height: '60px', objectFit: 'contain', marginBottom: '24px', filter: 'brightness(0) invert(1)' }} />
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>About Duke Language School</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>
            Duke Language School is one of Thailand's leading Thai language schools for foreigners and expats. With experienced, qualified Thai teachers and a curriculum designed specifically for adult learners living and working in Thailand, Duke offers practical, results-focused language training that fits around a busy teaching schedule.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.8' }}>
            Whether you're brand new to Thailand or you've been here for years and finally want to get serious about Thai, Duke's courses are built for people just like you.
          </p>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="register" style={{ maxWidth: '640px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px 36px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', border: '2px solid #c9a84c' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-block', background: '#fffbeb', border: '1px solid #c9a84c', borderRadius: '30px', padding: '6px 20px', marginBottom: '16px' }}>
              <span style={{ color: '#92400e', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' as any }}>🎁 Members-Only Discount</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>
              Register to Unlock Your Discount
            </h2>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6' }}>
              Fill in your details below and your exclusive Jobs in Thailand discount code will be revealed instantly — along with Duke's contact details so you can get started right away.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontWeight: '700', fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Full Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. James Smith"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as any }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '700', fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. james@gmail.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as any }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '700', fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Phone / LINE ID (optional)</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. +66 81 234 5678"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as any }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '700', fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Current Thai Level</label>
              <select
                value={form.level}
                onChange={e => setForm({ ...form, level: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', background: 'white', boxSizing: 'border-box' as any }}
              >
                <option value="">— Select your level —</option>
                <option value="complete-beginner">Complete Beginner — never studied Thai</option>
                <option value="basic">Basic — I know a few words and phrases</option>
                <option value="elementary">Elementary — I can have very simple conversations</option>
                <option value="intermediate">Intermediate — I get by but want to improve</option>
              </select>
            </div>
            <div>
              <label style={{ fontWeight: '700', fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>What's your main goal?</label>
              <select
                value={form.goal}
                onChange={e => setForm({ ...form, goal: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', background: 'white', boxSizing: 'border-box' as any }}
              >
                <option value="">— Select your goal —</option>
                <option value="daily-life">Survive and enjoy daily life in Thailand</option>
                <option value="school">Communicate better at my school</option>
                <option value="reading">Learn to read and write Thai script</option>
                <option value="fluency">Become fully conversational in Thai</option>
                <option value="not-sure">Not sure yet — just exploring options</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !form.name.trim() || !form.email.trim()}
              style={{
                background: loading || !form.name.trim() || !form.email.trim() ? '#ccc' : '#c9a84c',
                color: '#1a1a2e',
                border: 'none',
                padding: '16px',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '16px',
                cursor: loading || !form.name.trim() || !form.email.trim() ? 'not-allowed' : 'pointer',
                marginTop: '8px',
              }}
            >
              {loading ? 'Registering...' : '🎁 Reveal My Discount Code →'}
            </button>

            <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', margin: 0 }}>
              Your details are only shared with Duke Language School. No spam, no third parties.
            </p>
          </div>
        </div>
      </section>

      {/* BACK LINK */}
      <div style={{ textAlign: 'center', paddingBottom: '48px' }}>
        <Link href="/jobs/teaching" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>← Back to Teaching Jobs</Link>
      </div>

    </main>
  )
}
