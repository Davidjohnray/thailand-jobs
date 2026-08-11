'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, getCurrentUser } from '../../../../lib/marketplace-auth'

// Trust tier thresholds — keep in sync with marketplace_schema_v2.sql comments
function calculateTier(positiveFeedbackCount: number) {
  if (positiveFeedbackCount >= 60) return { tier: 'top', maxPrice: 999999 }
  if (positiveFeedbackCount >= 30) return { tier: 'trusted', maxPrice: 5000 }
  if (positiveFeedbackCount >= 10) return { tier: 'growing', maxPrice: 2000 }
  return { tier: 'new', maxPrice: 1000 }
}

export default function LeaveFeedbackPage() {
  const params = useParams()
  const listingId = params.listingId as string

  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('marketplace_listings')
      .select('*, marketplace_sellers(id, display_name, positive_feedback_count)')
      .eq('id', listingId)
      .single()
      .then(({ data, error }) => {
        if (!error) setListing(data)
        setLoading(false)
      })
  }, [listingId])

  const submitFeedback = async () => {
    setError('')
    setSubmitting(true)

    const user = await getCurrentUser()
    if (!user) {
      setError('Please log in to leave feedback.')
      setSubmitting(false)
      return
    }

    const seller = listing.marketplace_sellers

    // 1. Insert the feedback record
    const { error: feedbackError } = await supabase.from('marketplace_feedback').insert({
      listing_id: listingId,
      seller_id: seller.id,
      buyer_id: user.id,
      rating,
      comment,
    })

    if (feedbackError) {
      setError('Something went wrong submitting your feedback. Please try again.')
      setSubmitting(false)
      return
    }

    // 2. Recalculate the seller's tier based on their new feedback count
    const newCount = (seller.positive_feedback_count || 0) + 1
    const { tier, maxPrice } = calculateTier(newCount)

    await supabase
      .from('marketplace_sellers')
      .update({
        positive_feedback_count: newCount,
        trust_tier: tier,
        max_listing_price: maxPrice,
      })
      .eq('id', seller.id)

    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Loading...</main>
  }

  if (!listing) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Listing not found.</main>
  }

  if (submitted) {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '44px', maxWidth: '420px', textAlign: 'center', boxShadow: '0 10px 30px rgba(49,46,129,0.1)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Thanks for Your Feedback!</h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
            Your review helps {listing.marketplace_sellers.display_name} build trust with future buyers.
          </p>
          <Link href="/marketplace" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>← Back to Marketplace</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '48px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>⭐</div>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px' }}>Leave Feedback</h1>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>For your purchase: {listing.title}</p>
      </div>

      <div style={{ maxWidth: '460px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #eeeef8' }}>

          <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>How was your experience with {listing.marketplace_sellers.display_name}?</p>

          {/* RATING — only positive options, no negative stars available */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setRating(4)}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: rating === 4 ? '2px solid #4F46E5' : '1px solid #ddd',
                background: rating === 4 ? '#eef2ff' : 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#1e1b4b',
              }}
            >
              ⭐⭐⭐⭐<br /><span style={{ fontSize: '11px', fontWeight: 'normal', color: '#888' }}>Good</span>
            </button>
            <button
              onClick={() => setRating(5)}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: rating === 5 ? '2px solid #4F46E5' : '1px solid #ddd',
                background: rating === 5 ? '#eef2ff' : 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#1e1b4b',
              }}
            >
              ⭐⭐⭐⭐⭐<br /><span style={{ fontSize: '11px', fontWeight: 'normal', color: '#888' }}>Excellent</span>
            </button>
          </div>

          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share what you liked about buying from this seller..."
            style={{ width: '100%', minHeight: '80px', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit' }}
          />

          <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: '#3730a3', marginBottom: '20px' }}>
            ℹ️ Had a problem instead? Feedback here is for positive experiences only —
            use <strong>"Report a Problem"</strong> in your message thread with the seller if something went wrong.
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

          <button
            onClick={submitFeedback}
            disabled={submitting}
            style={{ background: submitting ? '#999' : 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%' }}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </main>
  )
}
