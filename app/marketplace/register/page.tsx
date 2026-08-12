'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { setMarketplaceSession } from '../../../lib/marketplace-auth'

export default function MarketplaceRegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const register = async () => {
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in your email and password.')
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

    try {
      const res = await fetch('/api/marketplace/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      let data: any = {}
      try {
        data = await res.json()
      } catch {
        setError(`Server returned an unexpected response (status ${res.status}). Check Vercel function logs for /api/marketplace/register.`)
        return
      }

      if (!res.ok) {
        setError(data.error || `Something went wrong (status ${res.status}).`)
        return
      }

      setMarketplaceSession({ id: data.id, email: data.email })
      router.push('/marketplace')
    } catch (err: any) {
      setError(`Network error: ${err?.message || 'could not reach the server.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', margin: 0 }}>Create Your Marketplace Account</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
            This account is separate from your main jobsinthailand.net login — it's only for the marketplace.
          </p>
        </div>

        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
        />

        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
        />

        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && register()}
          placeholder="Re-enter your password"
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
        />

        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={register}
          disabled={submitting}
          style={{ background: submitting ? '#999' : 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%', marginBottom: '16px' }}
        >
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '13px', color: '#888' }}>
          Already have a marketplace account? <Link href="/marketplace/login" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
        </div>
      </div>
    </main>
  )
}
