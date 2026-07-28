'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TeflLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/tefl/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.')
        setLoading(false)
        return
      }

      router.push('/tefl/course/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <section style={{ background: '#1a1a2e', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
        <h1 style={{ color: 'white', fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome Back
        </h1>
        <p style={{ color: '#ccc', fontSize: '15px' }}>Log in to continue your TEFL course</p>
      </section>

      <section style={{ maxWidth: '440px', margin: '0 auto', padding: '48px 24px' }}>
        <form
          onSubmit={handleSubmit}
          style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#E85D26',
              color: 'white',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '16px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/tefl/course/register" style={{ color: '#E85D26', fontWeight: 'bold' }}>
              Register here
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
