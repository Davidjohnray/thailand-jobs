'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// NOTE: hardcoded password to match your existing pattern (TEFL admin, Sarasas dashboard).
// Change this before wider promotion of the marketplace.
const MARKETPLACE_ADMIN_PASSWORD = 'MarketplaceAdmin2026!'

export default function MarketplaceAdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = () => {
    if (password === MARKETPLACE_ADMIN_PASSWORD) {
      sessionStorage.setItem('marketplace_admin_authed', 'true')
      router.push('/marketplace-admin/dashboard')
    } else {
      setError('Incorrect password.')
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '380px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', margin: 0 }}>Marketplace Admin</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>Separate from the main site admin</p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          placeholder="Admin password"
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
        />

        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={login}
          style={{ background: 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
        >
          Sign In
        </button>
      </div>
    </main>
  )
}
