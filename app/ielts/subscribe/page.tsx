'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function IELTSSubscribePage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')

  async function handleActivate() {
    setError('')
    const cleanEmail = email.trim().toLowerCase()
    const cleanCode = code.trim().toUpperCase()

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (!cleanCode) {
      setError('Please enter your access code.')
      return
    }

    setLoading(true)

    // Check code exists and is not used
    const { data: codeData, error: codeError } = await supabase
      .from('ielts_codes')
      .select('*')
      .eq('code', cleanCode)
      .single()

    if (codeError || !codeData) {
      setError('Code not found. Please check and try again.')
      setLoading(false)
      return
    }

    if (codeData.is_used) {
      setError('This code has already been used. Each code is for one person only.')
      setLoading(false)
      return
    }

    // Check if this email already has active access
    const { data: existingAccess } = await supabase
      .from('ielts_access')
      .select('*')
      .eq('email', cleanEmail)
      .eq('is_active', true)
      .single()

    if (existingAccess && new Date(existingAccess.expires_at) > new Date()) {
      setError('This email already has active access. Please check your expiry date.')
      setLoading(false)
      return
    }

    // Calculate expiry — 30 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    const expiresAtISO = expiresAt.toISOString()

    // Create access record
    const { error: accessError } = await supabase
      .from('ielts_access')
      .insert({
        email: cleanEmail,
        code_used: cleanCode,
        activated_at: new Date().toISOString(),
        expires_at: expiresAtISO,
        is_active: true,
      })

    if (accessError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    // Mark code as used
    await supabase
      .from('ielts_codes')
      .update({
        is_used: true,
        activated_by_email: cleanEmail,
        activated_at: new Date().toISOString(),
        expires_at: expiresAtISO,
      })
      .eq('code', cleanCode)

    // Save to localStorage so lessons can check access
    localStorage.setItem('ielts_email', cleanEmail)
    localStorage.setItem('ielts_expires', expiresAtISO)

    setExpiryDate(expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '48px 40px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>
            Access Activated!
          </h1>
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '8px' }}>
            Your full IELTS access is now active.
          </p>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '16px',
            margin: '20px 0',
          }}>
            <p style={{ color: '#166534', fontSize: '14px', margin: 0, fontWeight: '600' }}>
              ✅ Access valid until {expiryDate}
            </p>
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '28px' }}>
            Logged in as <strong>{email.trim().toLowerCase()}</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/ielts/speaking" style={{
              display: 'block',
              background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
              color: 'white',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '15px',
              textDecoration: 'none',
            }}>
              🎤 Start Speaking Practice
            </Link>
            <Link href="/ielts/writing" style={{
              display: 'block',
              background: 'linear-gradient(135deg, #064e3b, #059669)',
              color: 'white',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '15px',
              textDecoration: 'none',
            }}>
              ✍️ Start Writing Practice
            </Link>
            <Link href="/ielts/reading" style={{
              display: 'block',
              background: 'linear-gradient(135deg, #78350f, #d97706)',
              color: 'white',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '15px',
              textDecoration: 'none',
            }}>
              📖 Start Reading Practice
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/ielts" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' }}>
            ← Back to IELTS Hub
          </Link>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 'bold', margin: '16px 0 8px' }}>
            Get Full IELTS Access
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>
            149 THB per month · 30 days · One code per person
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>

          {/* How to Subscribe */}
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px 28px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>
              How to Subscribe
            </h2>
            {[
              { step: '1', title: 'Contact us to pay', desc: 'Send 149 THB via PromptPay or bank transfer and message us your email address.' },
              { step: '2', title: 'Receive your code', desc: 'We\'ll send you a unique access code by WhatsApp, LINE or Facebook.' },
              { step: '3', title: 'Activate below', desc: 'Enter your email and code to unlock 30 days of full access instantly.' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', margin: '0 0 4px' }}>{item.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Contact Buttons */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px', marginTop: '8px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Contact to pay
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="https://wa.me/66871033821" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#25d366',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  <span>💬</span> WhatsApp
                </a>
                <a href="https://line.me/ti/p/~@eslajarnjob" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#06c755',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  <span>💚</span> LINE
                </a>
                <a href="https://facebook.com/eslajarnjob" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#1877f2',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  <span>👍</span> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Activation Form */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px 28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>
              Activate Your Code
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
              Already have a code? Enter it below to unlock full access.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Your Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Access Code
              </label>
              <input
                type="text"
                placeholder="IELTS-XXXX-XXXX-XXXX-XXXX"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '15px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  outline: 'none',
                  letterSpacing: '1px',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '16px',
                color: '#dc2626',
                fontSize: '13px',
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleActivate}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
              }}
            >
              {loading ? 'Activating...' : 'Activate Full Access →'}
            </button>

            <div style={{
              background: '#f8fafc',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '12px',
              color: '#64748b',
              lineHeight: 1.6,
            }}>
              <strong>Important:</strong> Each code can only be used by one person. Your 30-day access starts from the moment you activate. Codes cannot be shared or transferred.
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link href="/ielts" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>
                ← Try 3 free lessons first
              </Link>
            </div>
          </div>

        </div>

        {/* What you get */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginTop: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            What you get with full access
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              '🎤 All Speaking lessons (Parts 1, 2 & 3)',
              '✍️ All Writing lessons (Task 1 & Task 2)',
              '📖 All Reading lessons (all task types)',
              '🤖 Unlimited AI feedback on every answer',
              '👨‍🏫 Teacher mode on all lessons',
              '30 days full access from activation',
            ].map(item => (
              <div key={item} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', display: 'flex', gap: '8px' }}>
                <span style={{ color: '#60a5fa', flexShrink: 0 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
