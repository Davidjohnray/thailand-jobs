'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'
import HCaptcha from '@hcaptcha/react-hcaptcha'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef<HCaptcha>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) router.push('/account/dashboard')
    })
  }, [])

  const handleLogin = async (e: any) => {
    e.preventDefault()
    if (!captchaToken) {
      setError('Please complete the CAPTCHA')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken }
    })
    if (error) {
      setError('Invalid email or password')
      captchaRef.current?.resetCaptcha()
      setCaptchaToken('')
    } else {
      router.push('/account/dashboard')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '480px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔑</div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Member Login</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Access your messages and account</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
              placeholder="john@email.com"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
              placeholder="Your password"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* HCAPTCHA */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              onVerify={token => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken('')}
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '13px', margin: 0 }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading || !captchaToken}
            style={{ background: loading || !captchaToken ? '#ccc' : '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: loading || !captchaToken ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '24px' }}>
          Don't have an account? <Link href="/account/register" style={{ color: '#E85D26', fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
    </main>
  )
}