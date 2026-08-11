'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function MarketplaceLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }
    setError('')
    setSubmitting(true)

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)

    if (loginError) {
      setError('Incorrect email or password.')
      return
    }

    router.push('/marketplace')
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', margin: 0 }}>Marketplace Login</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>Log in to buy, sell, and message on the Teacher Marketplace</p>
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
          onKeyDown={(e) => e.key === 'Enter' && login()}
          placeholder="Your password"
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '8px' }}
        />

        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
          <Link href="/forgot-password" style={{ fontSize: '12px', color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={login}
          disabled={submitting}
          style={{ background: submitting ? '#999' : 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%', marginBottom: '16px' }}
        >
          {submitting ? 'Logging in...' : 'Log In'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '13px', color: '#888' }}>
          Don't have an account? <Link href="/marketplace/register" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </main>
  )
}
