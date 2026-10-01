'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentThaiFriendUser, getFullUserRecord, trialStatus } from '../../../lib/thai-friend-auth'

const ADMIN_EMAIL = 'Admin@jobsinthailand.net'

export default function ThaiFriendSubscribePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const user = await getCurrentThaiFriendUser()
      if (user) {
        setUserId(user.id)
        const full = await getFullUserRecord(user.id)
        setActive(trialStatus(full).active)
      }
      setLoading(false)
    })()
  }, [])

  const redeem = async () => {
    if (!code.trim()) {
      setError('Please enter your access code.')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/thai-friend/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }
      setSuccess(`Done! ${data.days} more days added to your access.`)
      setTimeout(() => router.push('/thai-friend/characters'), 1800)
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const mailto = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('Thai Friend access code')}&body=${encodeURIComponent('Hi, I would like an access code for Thai Friend.\n\nMy name:\nMy email:')}`

  if (loading) {
    return <main style={{ background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5EFE1', fontFamily: "'Work Sans', sans-serif" }}>Loading...</main>
  }

  return (
    <main style={{ fontFamily: "'Work Sans', sans-serif", background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', color: '#F5EFE1' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Work+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ background: '#1B2B25', borderRadius: '18px', padding: '36px', maxWidth: '420px', width: '100%', border: '1px solid rgba(245,239,225,0.12)' }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 700, marginBottom: '10px', textAlign: 'center' }}>
          {active ? 'Add more time' : 'Keep talking with your friends'}
        </h1>
        <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', textAlign: 'center' }}>
          {active
            ? 'Have a new access code? Enter it below and the time is added to what you have left.'
            : 'Your access has ended. Enter a new access code to carry on where you left off — your friends still remember you.'}
        </p>

        {userId ? (
          <>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && redeem()}
              placeholder="TF-XXXXXX"
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(245,239,225,0.2)', borderRadius: '8px', padding: '13px 14px', color: '#F5EFE1', fontSize: '16px', letterSpacing: '1px', textAlign: 'center', marginBottom: '12px' }}
            />
            {error && <p style={{ color: '#e8a3a3', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: '#7fd6a3', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>{success}</p>}
            <button onClick={redeem} disabled={submitting || !!success} style={{ width: '100%', background: '#D4A24C', color: '#14201C', border: 'none', padding: '13px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
              {submitting ? 'Checking...' : 'Add my code'}
            </button>
          </>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '14px', marginBottom: '8px' }}>
            Please <a href="/thai-friend/login" style={{ color: '#D4A24C', fontWeight: 700 }}>log in</a> first, then come back here to add your code.
          </p>
        )}

        <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid rgba(245,239,225,0.12)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(245,239,225,0.5)', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pricing</p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            <div style={{ flex: 1, background: 'rgba(245,239,225,0.05)', border: '1px solid rgba(245,239,225,0.12)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: '20px', fontWeight: 700, color: '#D4A24C' }}>฿199</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(245,239,225,0.6)' }}>30 days</p>
            </div>
            <div style={{ flex: 1, background: 'rgba(245,239,225,0.05)', border: '1px solid rgba(245,239,225,0.12)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: '20px', fontWeight: 700, color: '#D4A24C' }}>฿549</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(245,239,225,0.6)' }}>90 days</p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(245,239,225,0.7)', marginBottom: '12px', textAlign: 'center' }}>Email us to register and pay — we'll send your code.</p>
          <a href={mailto} style={{ display: 'inline-block', background: 'rgba(245,239,225,0.1)', border: '1px solid rgba(245,239,225,0.25)', color: '#F5EFE1', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
            ✉️ Email {ADMIN_EMAIL}
          </a>
          <p style={{ fontSize: '12px', color: 'rgba(245,239,225,0.5)', marginTop: '10px' }}>
            Send us a message and we'll reply with your code, and payment details if it's for a paid month.
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '18px' }}>
          <a href="/thai-friend/characters" style={{ color: 'rgba(245,239,225,0.5)', fontSize: '12px' }}>← Back</a>
        </p>
      </div>
    </main>
  )
}
