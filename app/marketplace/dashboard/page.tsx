'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, getCurrentUser, getCurrentSeller } from '../../../lib/marketplace-auth'

const TIER_BADGE: Record<string, { label: string; color: string }> = {
  new: { label: '🆕 New Seller', color: '#94a3b8' },
  growing: { label: '🌱 Growing Seller', color: '#10b981' },
  trusted: { label: '✅ Trusted Seller', color: '#059669' },
  top: { label: '⭐ Top Seller', color: '#4F46E5' },
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending_payment: { label: 'Awaiting Fee Payment', color: '#92400e', bg: '#fff8f0' },
  pending_approval: { label: 'Pending Approval', color: '#92400e', bg: '#fff8f0' },
  active: { label: 'Active', color: '#065f46', bg: '#ecfdf5' },
  sold: { label: 'Sold', color: '#3730a3', bg: '#eef2ff' },
  expired: { label: 'Expired', color: '#6b7280', bg: '#f3f4f6' },
  removed: { label: 'Removed', color: '#6b7280', bg: '#f3f4f6' },
  rejected: { label: 'Rejected', color: '#991b1b', bg: '#fef2f2' },
}

export default function SellerDashboardPage() {
  const [seller, setSeller] = useState<any>(null)
  const [notLoggedIn, setNotLoggedIn] = useState(false)
  const [listings, setListings] = useState<any[]>([])
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)

    const user = await getCurrentUser()
    if (!user) {
      setNotLoggedIn(true)
      setLoading(false)
      return
    }

    const sellerData = await getCurrentSeller()

    if (!sellerData) {
      setLoading(false)
      return
    }
    setSeller(sellerData)

    const { data: listingsData } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('seller_id', sellerData.id)
      .order('created_at', { ascending: false })

    setListings(listingsData || [])

    // message counts per listing
    if (listingsData && listingsData.length > 0) {
      const { data: messages } = await supabase
        .from('marketplace_messages')
        .select('listing_id')
        .in('listing_id', listingsData.map((l) => l.id))

      const counts: Record<string, number> = {}
      ;(messages || []).forEach((m: any) => {
        counts[m.listing_id] = (counts[m.listing_id] || 0) + 1
      })
      setMessageCounts(counts)
    }

    setLoading(false)
  }

  const markAsSold = async (id: string) => {
    await supabase.from('marketplace_listings').update({ status: 'sold' }).eq('id', id)
    loadDashboard()
  }

  const removeListing = async (id: string) => {
    if (!confirm('Remove this listing? This cannot be undone.')) return
    await supabase.from('marketplace_listings').update({ status: 'removed' }).eq('id', id)
    loadDashboard()
  }

  if (loading) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Loading...</main>
  }

  if (notLoggedIn) {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Please Log In</h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Log in to see your seller dashboard.</p>
          <Link href="/marketplace/login?next=/marketplace/dashboard" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Log In →</Link>
        </div>
      </main>
    )
  }

  if (!seller) {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏪</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Not a Seller Yet</h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Apply to become a seller to access this dashboard.</p>
          <Link href="/marketplace/sell" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Apply to Become a Seller →</Link>
        </div>
      </main>
    )
  }

  const tier = TIER_BADGE[seller.trust_tier] || TIER_BADGE.new

  if (seller.status === 'pending') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Application Under Review</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>We'll approve your seller account soon. Check back here once you're approved.</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '40px 24px', color: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 6px' }}>{seller.display_name}</h1>
            <p style={{ fontSize: '13px', fontWeight: 'bold', opacity: 0.95 }}>
              {tier.label} · {seller.positive_feedback_count} positive reviews · Max ฿{seller.max_listing_price}/listing
            </p>
          </div>
          <Link href="/marketplace/create-listing" style={{ textDecoration: 'none' }}>
            <span style={{ background: 'white', color: '#312e81', padding: '12px 24px', borderRadius: '24px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }}>
              + New Listing
            </span>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px 64px' }}>

        <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '16px' }}>Your Listings</h2>

        {listings.length === 0 && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '40px', textAlign: 'center', border: '1px solid #eeeef8' }}>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>You haven't created any listings yet.</p>
            <Link href="/marketplace/create-listing" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Create your first listing →</Link>
          </div>
        )}

        {listings.map((listing) => {
          const status = STATUS_LABEL[listing.status] || STATUS_LABEL.pending_approval
          const msgCount = messageCounts[listing.id] || 0
          return (
            <div key={listing.id} style={{ background: 'white', borderRadius: '14px', padding: '18px 22px', border: '1px solid #eeeef8', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e1b4b', margin: 0 }}>{listing.title}</h3>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: status.color, background: status.bg, padding: '3px 10px', borderRadius: '10px' }}>{status.label}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
                    ฿{listing.price} · {listing.category} · {listing.item_type}
                    {msgCount > 0 && <span style={{ color: '#4F46E5', fontWeight: 'bold' }}> · 💬 {msgCount} message{msgCount > 1 ? 's' : ''}</span>}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {listing.status === 'active' && msgCount > 0 && (
                    <Link href={`/marketplace/messages/${listing.id}`} style={{ textDecoration: 'none' }}>
                      <span style={{ background: '#eef2ff', color: '#4F46E5', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>View Messages</span>
                    </Link>
                  )}
                  {listing.status === 'active' && (
                    <button onClick={() => markAsSold(listing.id)} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Mark Sold</button>
                  )}
                  {(listing.status === 'active' || listing.status === 'pending_approval') && (
                    <button onClick={() => removeListing(listing.id)} style={{ background: '#f1f1f1', color: '#666', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
