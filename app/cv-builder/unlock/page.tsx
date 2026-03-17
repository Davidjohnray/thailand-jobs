'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STANDARD_CODES = ['STANDARD2024', 'STD299THB', 'CVSTANDARD']
const PREMIUM_CODES = ['PREMIUM2024', 'PREM599THB', 'CVPREMIUM']

export default function UnlockPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleUnlock = () => {
    const upper = code.toUpperCase().trim()
    if (STANDARD_CODES.includes(upper)) {
      localStorage.setItem('cv_plan', 'standard')
      router.push('/cv-builder/build-standard')
    } else if (PREMIUM_CODES.includes(upper)) {
      localStorage.setItem('cv_plan', 'premium')
      router.push('/cv-builder/build-premium')
    } else {
      setError('Invalid code. Please check your email and try again.')
    }
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px 32px', maxWidth: '480px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Enter Your Access Code</h1>
        <p style={{ color: '#666', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
          Enter the access code we sent to your email after payment to unlock your plan.
        </p>

        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value); setError('') }}
          placeholder="Enter your access code..."
          style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: error ? '2px solid #ef4444' : '2px solid #ddd', fontSize: '16px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase' }}
        />

        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button onClick={handleUnlock}
          style={{ width: '100%', background: '#E85D26', color: 'white', padding: '14px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '24px' }}>
          Unlock My Plan →
        </button>

        <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ color: '#666', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
            📧 Don't have a code yet? Email us at <strong>david@jobsinthailand.net</strong> with your payment confirmation and we'll send your code within a few hours.
          </p>
        </div>

        <a href="/contact" style={{ color: '#E85D26', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>
          Contact Us →
        </a>
      </div>
    </main>
  )
}