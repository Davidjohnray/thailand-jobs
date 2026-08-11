'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, getCurrentUser } from '../../../lib/marketplace-auth'

type Listing = {
  id: string
  title: string
  description: string
  price: number
  category: string
  item_type: string
  images: string[]
  stock_quantity: number
  seller_id: string
  marketplace_sellers: { display_name: string; bio: string; trust_tier: string; positive_feedback_count: number; total_listings: number }
}

const TIER_BADGE: Record<string, { label: string; color: string }> = {
  new: { label: '🆕 New Seller', color: '#94a3b8' },
  growing: { label: '🌱 Growing Seller', color: '#10b981' },
  trusted: { label: '✅ Trusted Seller', color: '#059669' },
  top: { label: '⭐ Top Seller', color: '#4F46E5' },
}

export default function ListingDetailPage() {
  const params = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase
      .from('marketplace_listings')
      .select('*, marketplace_sellers(display_name, bio, trust_tier, positive_feedback_count, total_listings)')
      .eq('id', params.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setListing(data as any)
        setLoading(false)
      })
  }, [params.id])

  const sendMessage = async () => {
    if (!message.trim() || !listing) return

    const user = await getCurrentUser()
    if (!user) {
      window.location.href = `/marketplace/login?next=/marketplace/${listing.id}`
      return
    }

    await supabase.from('marketplace_messages').insert({
      listing_id: listing.id,
      seller_id: listing.seller_id,
      buyer_id: user.id,
      sender_id: user.id,
      sender_role: 'buyer',
      message,
    })
    setSent(true)
    setMessage('')
  }

  if (loading) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Loading...</main>
  }

  if (!listing) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Listing not found.</main>
  }

  const tier = TIER_BADGE[listing.marketplace_sellers?.trust_tier] || TIER_BADGE.new

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <Link href="/marketplace" style={{ color: '#4F46E5', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Marketplace</Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '24px' }}>

          {/* IMAGES */}
          <div>
            <div style={{ height: '360px', background: '#eef0fb', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '12px' }}>
              {listing.images && listing.images[activeImage] ? (
                <img src={listing.images[activeImage]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '64px' }}>{listing.item_type === 'digital' ? '📄' : '📦'}</span>
              )}
            </div>
            {listing.images && listing.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {listing.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: activeImage === i ? '2px solid #4F46E5' : '2px solid transparent' }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div>
            <span style={{ fontSize: '12px', color: '#4F46E5', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {listing.category} · {listing.item_type === 'digital' ? 'Digital Download' : 'Physical Item'}
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e1b4b', margin: '10px 0' }}>{listing.title}</h1>
            <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#312e81', margin: '0 0 20px' }}>฿{listing.price}</p>

            <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>{listing.description}</p>

            {listing.item_type === 'physical' && (
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                {listing.stock_quantity > 0 ? `${listing.stock_quantity} in stock` : 'Out of stock'}
              </p>
            )}

            {!showContactForm && !sent && (
              <button
                onClick={() => setShowContactForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #10b981)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '24px',
                  boxShadow: '0 8px 24px rgba(79,70,229,0.25)',
                }}
              >
                💬 Contact Seller
              </button>
            )}

            {showContactForm && !sent && (
              <div style={{ background: 'white', border: '1px solid #e2e2f5', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question or say you'd like to buy this..."
                  style={{ width: '100%', minHeight: '90px', border: '1px solid #ddd', borderRadius: '10px', padding: '10px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <button
                  onClick={sendMessage}
                  style={{ background: '#4F46E5', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Send Message
                </button>
              </div>
            )}

            {sent && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '16px 18px', marginBottom: '24px', color: '#065f46', fontSize: '14px' }}>
                ✅ Message sent! The seller will share their contact and payment details with you directly to arrange the sale.
              </div>
            )}

            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '14px 18px', fontSize: '13px', color: '#3730a3', marginBottom: '24px' }}>
              ℹ️ Buyers and sellers arrange payment and delivery directly. If there's a problem, contact us and we'll try to help resolve it.
            </div>

            {/* SELLER INFO */}
            {listing.marketplace_sellers && (
              <div style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', border: '1px solid #eeeef8' }}>
                <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sold by</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 4px' }}>{listing.marketplace_sellers.display_name}</p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: tier.color, margin: '0 0 8px' }}>{tier.label} · {listing.marketplace_sellers.positive_feedback_count} positive reviews</p>
                {listing.marketplace_sellers.bio && <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{listing.marketplace_sellers.bio}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
