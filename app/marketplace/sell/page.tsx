'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, getCurrentUser } from '../../../lib/marketplace-auth'

export default function SellerApplyPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [contactPromptpay, setContactPromptpay] = useState('')
  const [contactLineOrPhone, setContactLineOrPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.push('/marketplace/login?next=/marketplace/sell')
        return
      }
      setUserId(user.id)
      setCheckingAuth(false)
    })
  }, [])

  const submitApplication = async () => {
    if (!displayName.trim() || !contactPromptpay.trim() || !contactLineOrPhone.trim()) {
      setError('Please fill in your name, PromptPay number, and a contact method.')
      return
    }
    setSubmitting(true)
    setError('')

    const { error: insertError } = await supabase.from('marketplace_sellers').insert({
      user_id: userId,
      display_name: displayName,
      bio,
      contact_promptpay: contactPromptpay,
      contact_line_or_phone: contactLineOrPhone,
      status: 'pending',
    })

    if (insertError) {
      setError('Something went wrong submitting your application. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  if (checkingAuth) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Loading...</main>
  }

  if (submitted) {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '48px', maxWidth: '440px', textAlign: 'center', boxShadow: '0 10px 30px rgba(49,46,129,0.1)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Application Submitted</h1>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            We'll review your application and approve your seller account soon. You'll be able to start listing items as a <strong>🆕 New Seller</strong> (up to ฿1,000 per listing).
          </p>
          <Link href="/marketplace" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>← Back to Marketplace</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '56px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '44px', marginBottom: '12px' }}>🏪</div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: '0 0 10px' }}>Become a Seller</h1>
        <p style={{ fontSize: '15px', opacity: 0.9, maxWidth: '480px', margin: '0 auto' }}>
          Apply to sell teaching aids and resources on the Teacher Marketplace
        </p>
      </div>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px' }}>

        {/* TIER EXPLANATION */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px 22px', border: '1px solid #eeeef8', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>How Seller Tiers Work</p>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.8', margin: 0 }}>
            🆕 New Seller (0-9 reviews): up to ฿1,000/listing<br/>
            🌱 Growing Seller (10-29 reviews): up to ฿2,000/listing<br/>
            ✅ Trusted Seller (30-59 reviews): up to ฿5,000/listing<br/>
            ⭐ Top Seller (60+ reviews): no limit
          </p>
        </div>

        {/* FORM */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeef8' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Display Name *</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Sarah's Teaching Resources"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
          />

          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Short Bio (optional)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell buyers a little about yourself or what you sell..."
            style={{ width: '100%', minHeight: '70px', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit' }}
          />

          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>PromptPay Number *</label>
          <input
            value={contactPromptpay}
            onChange={(e) => setContactPromptpay(e.target.value)}
            placeholder="Phone number or Citizen ID for buyers to pay you"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
          />

          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>LINE ID or Phone Number *</label>
          <input
            value={contactLineOrPhone}
            onChange={(e) => setContactLineOrPhone(e.target.value)}
            placeholder="So buyers can reach you directly"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '20px' }}
          />

          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

          <button
            onClick={submitApplication}
            disabled={submitting}
            style={{
              background: submitting ? '#999' : 'linear-gradient(135deg, #4F46E5, #10b981)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </main>
  )
}
