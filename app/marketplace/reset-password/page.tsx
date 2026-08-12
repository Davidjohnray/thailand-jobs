'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updatePassword = async () => {
    setError('')

    if (!token) {
      setError('This reset link is missing its token. Please request a new one.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    const res = await fetch('/api/marketplace/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: password }),
    })
    const data = await res.json()

    setSubmitting(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please request a new reset link.')
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/marketplace/login'), 2500)
  }

  if (!token) {
    return (
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
        <h1 style={{ fontSize: '19px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '10px' }}>Missing Reset Link</h1>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Please use the link from your password reset email, or request a new one.</p>
        <Link href="/marketplace/forgot-password" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Request New Link →</Link>
      </div>
    )
  }

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>

      {!success ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔒</div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Set a New Password</h1>
          </div>

          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
          />

          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updatePassword()}
            placeholder="Re-enter your new password"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
          />

          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <button
            onClick={updatePassword}
            disabled={submitting}
            style={{ background: submitting ? '#999' : '#E85D26', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%' }}
          >
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '44px', marginBottom: '14px' }}>✅</div>
          <h1 style={{ fontSize: '19px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '10px' }}>Password Updated!</h1>
          <p style={{ fontSize: '14px', color: '#666' }}>Redirecting you to log in...</p>
        </div>
      )}
    </div>
  )
}

export default function MarketplaceResetPasswordPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Suspense fallback={<div style={{ color: '#888' }}>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}
