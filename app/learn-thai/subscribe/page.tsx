'use client'
import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Monthly',
    price: '฿199',
    period: '/month',
    save: null,
    features: [
      'All 5 levels — A1 through C1',
      '35+ course units',
      '1,000+ vocabulary words',
      'Audio for every word and phrase',
      'Script recognition exercises',
      'Cancel anytime',
    ],
    highlight: false,
  },
  {
    name: 'Annual',
    price: '฿1,990',
    period: '/year',
    save: 'Save 33% — 2 months free',
    features: [
      'Everything in Monthly',
      'Best value for serious learners',
      'Lock in current price',
      'Priority support',
    ],
    highlight: true,
  },
]

export default function LearnThaiSubscribe() {
  const [code, setCode] = useState('')
  const [codeStatus, setCodeStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const validateCode = async () => {
    if (!code.trim()) return
    setCodeStatus('checking')
    setErrorMsg('')
    try {
      const res = await fetch('/api/learn-thai/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (data.valid) {
        localStorage.setItem('learnThaiCode', code.trim().toUpperCase())
        localStorage.setItem('learnThaiCodeExpiry', data.expiry || '')
        setCodeStatus('success')
        setTimeout(() => { window.location.href = '/learn-thai/a2' }, 1500)
      } else {
        setCodeStatus('error')
        setErrorMsg(data.message || 'Invalid or expired code.')
      }
    } catch {
      setCodeStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <main style={{ background: '#0a0f1e', minHeight: '100vh', color: 'white', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* NAV */}
      <nav style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/learn-thai" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← Learn Thai</Link>
        <div style={{ flex: 1 }} />
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' }}>A1 is free →</Link>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '30px', padding: '6px 18px', marginBottom: '24px' }}>
            <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '800' }}>🔓 Unlock all 5 levels</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', marginBottom: '14px', lineHeight: 1.15 }}>
            Continue your Thai journey
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            A1 is free forever. Subscribe to unlock A2, B1, B2, and C1 — from conversations to fluency.
          </p>
        </div>

        {/* PLANS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '48px' }}>
          {PLANS.map((plan, i) => (
            <div key={i} style={{ background: plan.highlight ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.08))' : 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '32px 28px', border: `2px solid ${plan.highlight ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`, position: 'relative' }}>
              {plan.highlight && <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#1a1a2e', fontSize: '11px', fontWeight: '900', padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap' }}>BEST VALUE</div>}
              <div style={{ color: plan.highlight ? '#f59e0b' : 'rgba(255,255,255,0.6)', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '44px', fontWeight: '900', color: 'white' }}>{plan.price}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>{plan.period}</span>
              </div>
              {plan.save && <div style={{ color: '#22c55e', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>{plan.save}</div>}
              {!plan.save && <div style={{ marginBottom: '20px' }} />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: plan.highlight ? '#f59e0b' : '#22c55e', fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.4' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* HOW TO SUBSCRIBE */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '36px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px', textAlign: 'center' }}>How to subscribe</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', textAlign: 'center', marginBottom: '32px', lineHeight: '1.6' }}>
            Contact us on any of the platforms below. We'll confirm your plan, send payment details, and give you your access code within a few hours.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {[
              { label: 'WhatsApp', icon: '💬', color: '#25D366', href: 'https://wa.me/66871033821?text=Hi%20I%27d%20like%20to%20subscribe%20to%20Learn%20Thai' },
              { label: 'LINE', icon: '💚', color: '#06C755', href: 'https://line.me/ti/p/~jobsinthailand' },
              { label: 'Facebook', icon: '📘', color: '#1877F2', href: 'https://facebook.com/jobsinthailand' },
            ].map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: c.color + '20', border: `2px solid ${c.color}40`, borderRadius: '14px', padding: '18px', textDecoration: 'none', transition: 'all 0.15s' }}>
                <span style={{ fontSize: '24px' }}>{c.icon}</span>
                <span style={{ color: 'white', fontWeight: '800', fontSize: '16px' }}>{c.label}</span>
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px 18px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {['1', '2', '3'].map((n, i) => (
              <div key={n} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: '32px', height: '32px', background: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', color: '#1a1a2e', margin: '0 auto 8px' }}>{n}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.5' }}>
                  {i === 0 && 'Contact us on WhatsApp, LINE or Facebook'}
                  {i === 1 && 'Pay via PromptPay or bank transfer'}
                  {i === 2 && 'Receive your access code and start learning'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CODE ENTRY */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px', textAlign: 'center' }}>Already have a code?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>Enter your access code below to unlock all subscription content.</p>
          <div style={{ display: 'flex', gap: '12px', maxWidth: '420px', margin: '0 auto' }}>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && validateCode()}
              placeholder="e.g. THAI-XXXX-XXXX"
              style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: `2px solid ${codeStatus === 'error' ? '#ef4444' : codeStatus === 'success' ? '#22c55e' : 'rgba(255,255,255,0.15)'}`, borderRadius: '12px', padding: '14px 18px', color: 'white', fontSize: '18px', fontWeight: '700', letterSpacing: '2px', outline: 'none', fontFamily: 'monospace' }}
            />
            <button onClick={validateCode} disabled={codeStatus === 'checking' || !code.trim()}
              style={{ background: codeStatus === 'success' ? '#22c55e' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px 24px', borderRadius: '12px', fontWeight: '900', fontSize: '15px', cursor: codeStatus === 'checking' ? 'wait' : 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
              {codeStatus === 'checking' ? '...' : codeStatus === 'success' ? '✓' : 'Unlock'}
            </button>
          </div>
          {codeStatus === 'success' && <div style={{ color: '#22c55e', fontWeight: '700', textAlign: 'center', marginTop: '16px', fontSize: '16px' }}>✅ Code valid! Redirecting you to A2...</div>}
          {codeStatus === 'error' && <div style={{ color: '#ef4444', fontWeight: '700', textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>❌ {errorMsg}</div>}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textDecoration: 'none' }}>← Back to free A1 lessons</Link>
        </div>
      </div>
    </main>
  )
}
