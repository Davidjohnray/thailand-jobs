'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useApplyStatus } from '../../components/applyClient'
import { AI_MONTHLY_LIMIT, PRO_PRICE_30_DAYS, PRO_PRICE_6_MONTHS, fmtDate } from '../../src/lib/applyRules'

const ADMIN_EMAIL = 'Admin@jobsinthailand.net'

const FEATURES = [
  { icon: '⚡', title: 'One-click apply', text: 'Your CV, photo and video go straight to the employer through Jobs in Thailand. Your details are saved, so every application after the first takes seconds.' },
  { icon: '✨', title: `${AI_MONTHLY_LIMIT} AI applications a month`, text: 'AI reads the job advert and your CV, then writes an application email and a full cover letter made for that job — not a template.' },
  { icon: '🇹🇭', title: 'A Thai version for Thai staff', text: 'Many schools have Thai staff screening applications first. Add a polite Thai version with one tick.' },
  { icon: '💬', title: 'LINE & WhatsApp messages', text: 'For jobs that recruit on LINE or WhatsApp, get a short, friendly message ready to copy and send.' },
  { icon: '👀', title: 'See when you\'re viewed', text: 'My Applications shows every job you applied for, and the moment the employer opens your application.' },
  { icon: '♻️', title: 'Reuse your best letters', text: 'Every AI letter is saved. Reuse one on a similar job for free, and get 2 free rewrites on every job.' },
]

const FAQ = [
  { q: 'Which jobs can I use it on?', a: 'One-click apply works on every job that lists an email address. For jobs that only use LINE, WhatsApp or phone, the AI writes your message for you to send. A few agencies use their own application system.' },
  { q: 'What counts as one AI application?', a: `Each new letter for a job counts as one. Your first 2 rewrites on the same job are free, and reusing a saved letter is always free. Your ${AI_MONTHLY_LIMIT} reset on the 1st of every month.` },
  { q: 'Does it renew automatically?', a: 'No. There are no automatic payments — when your time is up it simply stops, and you can renew whenever you like.' },
  { q: 'Is there a free try?', a: 'Yes. Every registered member gets one free one-click application with an AI-written letter.' },
  { q: 'Does the AI make things up?', a: 'It\'s told to use only what\'s in your CV and what you tell it. Always read your letter before sending — you can edit everything.' },
]

export default function ApplyProPage() {
  const { status } = useApplyStatus()
  const [copied, setCopied] = useState(false)
  const subject = (plan: string) => encodeURIComponent('Apply Pro — ' + plan)
  const body = (plan: string) => encodeURIComponent(`Hi David,\n\nI'd like Apply Pro (${plan}).\nMy Jobs in Thailand account email: ${status?.email || ''}\n\nPlease send me the bank details. Thank you!`)
  // Gmail in the browser works on almost every computer and phone (mailto needs an email app set up)
  const gmail = (plan: string) => `https://mail.google.com/mail/?view=cm&fs=1&to=${ADMIN_EMAIL}&su=${subject(plan)}&body=${body(plan)}`
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(ADMIN_EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  const plans = [
    { name: '30 days', price: PRO_PRICE_30_DAYS, note: 'Try it for a month', highlight: false },
    { name: '6 months', price: PRO_PRICE_6_MONTHS, note: `Save ${PRO_PRICE_30_DAYS * 6 - PRO_PRICE_6_MONTHS} baht`, highlight: true },
  ]

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #3a1c10 100%)', padding: '56px 20px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ color: '#E85D26', fontWeight: 'bold', letterSpacing: '2px', fontSize: '13px', marginBottom: '12px' }}>⚡ APPLY PRO</div>
          <h1 style={{ color: 'white', fontSize: '36px', lineHeight: '1.2', margin: '0 0 16px' }}>
            Apply in one click. In English <span style={{ color: '#E85D26' }}>and</span> Thai.
          </h1>
          <p style={{ color: '#ccc', fontSize: '17px', lineHeight: '1.6', margin: '0 0 24px' }}>
            Let AI write a job-specific application in seconds, send it straight to the school through Jobs in Thailand, and see the moment they view it.
          </p>
          {status?.loggedIn && status.isPro ? (
            <div style={{ display: 'inline-block', background: 'rgba(76,175,80,0.2)', border: '2px solid #4caf50', borderRadius: '10px', padding: '12px 22px', color: 'white', fontSize: '15px' }}>
              ✅ You're on Apply Pro until <strong>{fmtDate(status.proUntil)}</strong> · {status.aiRemaining} AI applications left this month
            </div>
          ) : status?.loggedIn && status.freeTryAvailable ? (
            <Link href="/jobs" style={{ background: '#E85D26', color: 'white', padding: '14px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block' }}>
              🎁 Use your free try — pick a job →
            </Link>
          ) : !status?.loggedIn ? (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/account/register" style={{ background: '#E85D26', color: 'white', padding: '14px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Join free — first one's on us →</Link>
              <Link href="/account/login" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 30px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px' }}>Log in</Link>
            </div>
          ) : null}
        </div>
      </section>

      <section style={{ maxWidth: '1000px', margin: '-32px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: 'white', borderRadius: '12px', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e', marginBottom: '6px' }}>{f.title}</div>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 16px 8px' }}>
        <h2 style={{ textAlign: 'center', color: '#1a1a2e', fontSize: '26px', margin: '0 0 8px' }}>Simple pricing</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', margin: '0 0 24px' }}>Pay by Thai bank transfer · no automatic renewal · separate from Supporter membership</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: 'white', borderRadius: '14px', padding: '28px', textAlign: 'center', border: p.highlight ? '3px solid #E85D26' : '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', position: 'relative' }}>
              {p.highlight && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#E85D26', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>BEST VALUE</div>}
              <div style={{ color: '#888', fontSize: '14px', fontWeight: 'bold' }}>{p.name}</div>
              <div style={{ color: '#1a1a2e', fontSize: '40px', fontWeight: 'bold', margin: '6px 0' }}>{p.price} <span style={{ fontSize: '16px', color: '#888' }}>baht</span></div>
              <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px' }}>{p.note}</div>
              <ul style={{ textAlign: 'left', color: '#555', fontSize: '14px', lineHeight: '1.9', paddingLeft: '20px', margin: '0 0 20px' }}>
                <li>One-click apply on all email jobs</li>
                <li>{AI_MONTHLY_LIMIT} AI applications every month</li>
                <li>Thai version + LINE/WhatsApp message</li>
                <li>"Viewed" alerts in My Applications</li>
              </ul>
              {status?.loggedIn ? (
                <a href={gmail(p.name)} target="_blank" rel="noopener noreferrer" style={{ background: p.highlight ? '#E85D26' : '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', display: 'block' }}>
                  Get {p.name} →
                </a>
              ) : (
                <Link href="/account/register" style={{ background: p.highlight ? '#E85D26' : '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', display: 'block' }}>
                  Join free first →
                </Link>
              )}
            </div>
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '22px', marginTop: '20px', border: '2px solid #E85D26', color: '#555', fontSize: '14px', lineHeight: '1.7' }}>
          <h3 style={{ color: '#1a1a2e', fontSize: '18px', margin: '0 0 12px' }}>How to get Apply Pro</h3>
          <ol style={{ margin: '0 0 16px', paddingLeft: '20px' }}>
            <li><strong>Register free</strong> on Jobs in Thailand (if you haven't already).</li>
            <li><strong>Email us</strong> at <strong style={{ color: '#E85D26' }}>{ADMIN_EMAIL}</strong> with the email address you use on the site, and which plan you'd like (30 days or 6 months).</li>
            <li>We'll reply with our <strong>Thai bank details</strong>.</li>
            <li>Send your payment — we switch Apply Pro on as soon as it arrives, usually the same day.</li>
          </ol>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '10px 14px', fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>{ADMIN_EMAIL}</div>
            <button type="button" onClick={copyEmail}
              style={{ background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', padding: '11px 16px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
              {copied ? '✅ Copied' : '📋 Copy email'}
            </button>
            <a href={gmail('30 days')} target="_blank" rel="noopener noreferrer"
              style={{ background: '#E85D26', color: 'white', borderRadius: '8px', padding: '11px 16px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>
              📧 Email us in Gmail
            </a>
          </div>
          <p style={{ color: '#999', fontSize: '12px', margin: '12px 0 0' }}>You can also message us on Facebook. No automatic payments — Apply Pro simply stops at the end of your time, and you renew whenever you like.</p>
        </div>
      </section>

      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 16px 60px' }}>
        <h2 style={{ textAlign: 'center', color: '#1a1a2e', fontSize: '24px', margin: '0 0 20px' }}>Questions</h2>
        {FAQ.map(f => (
          <details key={f.q} style={{ background: 'white', borderRadius: '10px', padding: '16px 20px', marginBottom: '10px', border: '1px solid #eee' }}>
            <summary style={{ fontWeight: 'bold', color: '#1a1a2e', cursor: 'pointer', fontSize: '15px' }}>{f.q}</summary>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', margin: '10px 0 0' }}>{f.a}</p>
          </details>
        ))}
      </section>
    </main>
  )
}
