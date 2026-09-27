'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setThaiFriendSession } from '../../../lib/thai-friend-auth'

export default function ThaiFriendLoginPage() {
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

    const res = await fetch('/api/thai-friend/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(data.error || 'Incorrect email or password.')
      return
    }

    setThaiFriendSession({ id: data.id, email: data.email })
    router.push('/thai-friend/characters')
  }

  return (
    <main style={{ fontFamily: "'Work Sans', sans-serif", background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', color: '#F5EFE1' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Work+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ background: '#1B2B25', borderRadius: '18px', padding: '40px', maxWidth: '380px', width: '100%', border: '1px solid rgba(245,239,225,0.12)' }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Welcome back</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(245,239,225,0.2)', borderRadius: '8px', padding: '12px 14px', color: '#F5EFE1', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          placeholder="Password"
          style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(245,239,225,0.2)', borderRadius: '8px', padding: '12px 14px', color: '#F5EFE1', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
        />

        {error && <p style={{ color: '#e8a3a3', fontSize: '13px', marginBottom: '14px' }}>{error}</p>}

        <button
          onClick={login}
          disabled={submitting}
          style={{ width: '100%', background: '#D4A24C', color: '#14201C', border: 'none', padding: '13px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: submitting ? 'not-allowed' : 'pointer' }}
        >
          {submitting ? 'Logging in...' : 'Log In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(245,239,225,0.6)', marginTop: '18px' }}>
          Don't have an account? <a href="/thai-friend" style={{ color: '#D4A24C', fontWeight: 600, textDecoration: 'none' }}>Start free trial</a>
        </p>
      </div>
    </main>
  )
}
