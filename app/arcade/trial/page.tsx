'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function TeacherArcadeTrialPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const TOTAL_SPOTS = 50
  const SPOTS_LEFT = 50 // Update this number manually as you send codes

  const handleSubmit = async () => {
    if (!email.trim() || !name.trim()) { setError('Please enter your name and email address.'); return }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return }
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/trial-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), school: school.trim() }),
      })
      if (res.ok) { setSubmitted(true) }
      else { setError('Something went wrong. Please try again or message us on Facebook.') }
    } catch {
      setError('Something went wrong. Please try again or message us on Facebook.')
    }
    setSubmitting(false)
  }

  if (submitted) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎉</div>
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>You&apos;re on the list!</h2>
        <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.7', marginBottom: '24px' }}>
          Thanks <strong>{name}</strong>! We&apos;ll send your free activation code to <strong>{email}</strong> very soon.
        </p>
        <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '20px', border: '2px solid #86efac', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ color: '#15803d', fontWeight: '800', fontSize: '15px', marginBottom: '12px' }}>📋 What happens next:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'We\'ll email you a unique TCH-XXXX-XXXX activation code',
              'Go to jobsinthailand.net/arcade/activate and enter your code',
              'Set up your teacher profile and arcade page',
              'Start building games — your first one takes under 10 minutes!',
              'Log back in any time at jobsinthailand.net/arcade/dashboard',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ background: '#22c55e', color: 'white', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
                <span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <Link href="/" style={{ display: 'block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
          ← Back to Thailand Jobs
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

      {/* HERO */}
      <section style={{ padding: '60px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.5)', borderRadius: '30px', padding: '8px 20px', marginBottom: '24px' }}>
          <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '800' }}>🎁 LIMITED TIME — FREE TRIAL OFFER</span>
        </div>
        <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🎮</div>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '900', margin: '0 0 16px', lineHeight: 1.2 }}>
          Get 1 Month of Teacher Arcade<br />
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #E85D26)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Completely Free</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', maxWidth: '560px', margin: '0 auto 16px', lineHeight: '1.7' }}>
          We&apos;re giving away <strong style={{ color: '#f59e0b' }}>{TOTAL_SPOTS} free one-month trial codes</strong> to teachers who want to try Teacher Arcade before everyone else.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '30px', padding: '10px 20px', marginBottom: '40px' }}>
          <span style={{ color: '#ef4444', fontWeight: '900', fontSize: '15px' }}>⚡ {SPOTS_LEFT} spots remaining — first come, first served</span>
        </div>

        {/* WHAT YOU GET */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', maxWidth: '860px', margin: '0 auto 48px' }}>
          {[
            { emoji: '🎯', text: 'Build unlimited games with 5 game types' },
            { emoji: '📺', text: 'TV team game mode with live leaderboard' },
            { emoji: '📱', text: 'Multiplayer for up to 40 students' },
            { emoji: '📚', text: 'Self study mode for homework' },
            { emoji: '✨', text: 'New game types added regularly' },
            { emoji: '🔓', text: 'Full access — no restrictions' },
          ].map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px 16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{f.emoji}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.5', fontWeight: '600' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNUP FORM */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '40px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e', marginBottom: '6px', textAlign: 'center' }}>Claim Your Free Trial</h2>
          <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>Enter your details and we&apos;ll send your activation code by email.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Your Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah Johnson"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontWeight: '600' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Email Address *</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontWeight: '600' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>School / Organisation (optional)</label>
              <input value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. ABC Language School, Bangkok"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '14px' }}>{error}</div>}

            <button onClick={handleSubmit} disabled={submitting}
              style={{ background: submitting ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: submitting ? '#9ca3af' : '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
              {submitting ? 'Sending...' : '🎮 Claim My Free Trial →'}
            </button>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', marginTop: '16px', lineHeight: '1.6' }}>
            No credit card required. No automatic billing. Your code gives you one full month of free access. We&apos;ll email your code within 24 hours.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '900', textAlign: 'center', marginBottom: '36px' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { n: '1', emoji: '📝', title: 'Apply above', desc: 'Fill in your name and email. We\'ll review and send your code within 24 hours.' },
              { n: '2', emoji: '📧', title: 'Check your email', desc: 'You\'ll receive a unique TCH-XXXX-XXXX activation code from us.' },
              { n: '3', emoji: '🔑', title: 'Activate your code', desc: 'Go to jobsinthailand.net/arcade/activate and enter your code to set up your arcade.' },
              { n: '4', emoji: '🎮', title: 'Start building', desc: 'Log in at /arcade/dashboard any time. Build your first game in under 10 minutes!' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px', color: '#1a1a2e', margin: '0 auto 14px' }}>{s.n}</div>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{s.emoji}</div>
                <h3 style={{ color: 'white', fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPDATES NOTE */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: 'rgba(124,58,237,0.15)', borderRadius: '18px', padding: '28px 32px', border: '2px solid rgba(124,58,237,0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
          <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '900', marginBottom: '10px' }}>We&apos;re just getting started</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
            Teacher Arcade is actively growing. As a trial user you&apos;ll benefit from all updates during your free month — including new game types, new play modes, and new features as they&apos;re released. We&apos;re excited to build this with early teachers like you.
          </p>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: '40px 24px 60px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '8px' }}>Already have an activation code?</p>
        <Link href="/arcade/activate" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
          → Enter your code here
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '32px' }}>jobsinthailand.net · Teacher Arcade</p>
      </section>
    </main>
  )
}
