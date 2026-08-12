'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MarketplaceForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const sendResetEmail = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setError('')
    setSubmitting(true)

    await fetch('/api/marketplace/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setSubmitting(false)
    setSent(true)
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>

        {!sent ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔑</div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', margin: 0 }}>Forgot Your Password?</h1>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>Enter your marketplace account email.</p>
            </div>

            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendResetEmail()}
              placeholder="you@example.com"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
            />

            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

            <button
              onClick={sendResetEmail}
              disabled={submitting}
              style={{ background: submitting ? '#999' : 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%', marginBottom: '16px' }}
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link href="/marketplace/login" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>← Back to Login</Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>📧</div>
            <h1 style={{ fontSize: '19px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Check Your Email</h1>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', marginBottom: '20px' }}>
              If a marketplace account exists for <strong>{email}</strong>, a reset link has been sent.
            </p>
            <Link href="/marketplace/login" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>← Back to Login</Link>
          </div>
        )}
      </div>
    </main>
  )
}
