'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setFrenchFriendSession } from '../../../lib/french-friend-auth'

export default function FrenchFriendLoginPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const enter = async () => {
    if (!code.trim()) { setError('Please enter your access code.'); return }
    setError(''); setSubmitting(true)
    try {
      const res = await fetch('/api/french-friend/enter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
      let data: any = {}
      try { data = await res.json() } catch { setError(`Server returned an unexpected response (status ${res.status}).`); return }
      if (!res.ok) { setError(data.error || 'That code is not valid.'); return }
      setFrenchFriendSession({ id: data.id })
      router.push('/french-friend/characters')
    } catch { setError('Could not reach the server. Please try again.') } finally { setSubmitting(false) }
  }

  return (
    <main style={{ fontFamily: "'Work Sans', sans-serif", background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', color: '#F5EFE1' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Work+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ background: '#1B2B25', borderRadius: '18px', padding: '40px', maxWidth: '380px', width: '100%', border: '1px solid rgba(245,239,225,0.12)' }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Welcome back</h1>
        <p style={{ color: 'rgba(245,239,225,0.65)', fontSize: '13px', textAlign: 'center', marginBottom: '22px', lineHeight: 1.5 }}>
          Enter your access code. It's the same code you used last time.
        </p>
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && enter()}
          placeholder="FF-XXXX-XXXX"
          style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(212,162,76,0.5)', borderRadius: '8px', padding: '14px', color: '#F5EFE1', fontSize: '16px', letterSpacing: '1.5px', textAlign: 'center', boxSizing: 'border-box', marginBottom: '14px' }} />
        {error && <p style={{ color: '#e8a3a3', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>{error}</p>}
        <button onClick={enter} disabled={submitting}
          style={{ width: '100%', background: '#D4A24C', color: '#14201C', border: 'none', padding: '13px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? 'Checking...' : 'Enter'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(245,239,225,0.55)', marginTop: '18px', lineHeight: 1.6 }}>
          New here? Email <a href="mailto:Admin@jobsinthailand.net?subject=French%20Friend%20access%20code" style={{ color: '#D4A24C' }}>Admin@jobsinthailand.net</a> for a free 48-hour code.
        </p>
      </div>
    </main>
  )
}
