'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'job_seeker' | 'employer' | 'rental_member' | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: any) => {
    e.preventDefault()
    if (!role) { setError('Please select your account type'); return }
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert([{
        id: data.user.id,
        full_name: name,
        role: role === 'rental_member' ? 'employer' : role,
      }])

      if (role === 'rental_member') {
        await supabase.from('rental_profiles').insert([{
          id: data.user.id,
          full_name: name,
          active: false,
        }])
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Account Created!</h1>
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
          Please check your email and click the confirmation link to activate your account.
        </p>
        {role === 'rental_member' && (
          <div style={{ background: '#fff3ed', borderRadius: '10px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#E85D26', textAlign: 'left' }}>
            🏠 Once your email is confirmed, log in and message us to activate your Rental Member account after payment.
          </div>
        )}
        <Link href="/account/login" style={{ background: '#E85D26', color: 'white', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
          Go to Login →
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '520px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Create an Account</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Join thousands of expats and job seekers in Thailand</p>
        </div>

        <div style={{ background: '#fff3ed', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', fontSize: '13px', color: '#E85D26' }}>
          ⭐ Members see new jobs 1 hour early & can message us directly!
        </div>

        {/* ROLE SELECTION */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>I want to... *</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <button type="button" onClick={() => setRole('job_seeker')}
              style={{ padding: '14px 16px', borderRadius: '10px', border: '2px solid', borderColor: role === 'job_seeker' ? '#E85D26' : '#ddd', background: role === 'job_seeker' ? '#fff3ed' : 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '28px' }}>👤</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: role === 'job_seeker' ? '#E85D26' : '#333' }}>Find a Job</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Job seeker — see new jobs 1 hour early, free to join</div>
              </div>
            </button>

            <button type="button" onClick={() => setRole('employer')}
              style={{ padding: '14px 16px', borderRadius: '10px', border: '2px solid', borderColor: role === 'employer' ? '#E85D26' : '#ddd', background: role === 'employer' ? '#fff3ed' : 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '28px' }}>🏫</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: role === 'employer' ? '#E85D26' : '#333' }}>Hire Staff</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Employer / School — post jobs and manage applications</div>
              </div>
            </button>

            <button type="button" onClick={() => setRole('rental_member')}
              style={{ padding: '14px 16px', borderRadius: '10px', border: '2px solid', borderColor: role === 'rental_member' ? '#E85D26' : '#ddd', background: role === 'rental_member' ? '#fff3ed' : 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '28px' }}>🏠</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: role === 'rental_member' ? '#E85D26' : '#333' }}>List a Rental Property</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Landlord / Agent — post properties for rent in Thailand</div>
              </div>
            </button>

          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@email.com"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {error && <p style={{ color: 'red', fontSize: '13px', margin: 0 }}>{error}</p>}

          <button onClick={handleRegister} disabled={loading}
            style={{ background: loading ? '#ccc' : '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '24px' }}>
          Already have an account? <Link href="/account/login" style={{ color: '#E85D26', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </main>
  )
}