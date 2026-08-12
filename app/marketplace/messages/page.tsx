'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, getCurrentUser, getCurrentSeller } from '../../../lib/marketplace-auth'

export default function MyMessagesPage() {
  const [loading, setLoading] = useState(true)
  const [notLoggedIn, setNotLoggedIn] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    setLoading(true)

    const user = await getCurrentUser()
    if (!user) {
      setNotLoggedIn(true)
      setLoading(false)
      return
    }

    const seller = await getCurrentSeller()

    const orConditions = seller
      ? `buyer_id.eq.${user.id},seller_id.eq.${seller.id}`
      : `buyer_id.eq.${user.id}`

    const { data: messages } = await supabase
      .from('marketplace_messages')
      .select('*, marketplace_listings(id, title, price, images)')
      .or(orConditions)
      .order('created_at', { ascending: false })

    if (!messages) {
      setConversations([])
      setLoading(false)
      return
    }

    const grouped: Record<string, any> = {}
    messages.forEach((m: any) => {
      if (!grouped[m.listing_id]) {
        grouped[m.listing_id] = {
          listingId: m.listing_id,
          listing: m.marketplace_listings,
          lastMessage: m.message,
          lastMessageAt: m.created_at,
          role: seller && m.seller_id === seller.id ? 'seller' : 'buyer',
        }
      }
    })

    setConversations(Object.values(grouped))
    setLoading(false)
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
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Log in to see your messages.</p>
          <Link href="/marketplace/login?next=/marketplace/messages" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Log In →</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '40px 24px', color: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', textDecoration: 'none' }}>← Back to Marketplace</Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 0' }}>💬 My Messages</h1>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px' }}>

        {conversations.length === 0 && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '40px', textAlign: 'center', border: '1px solid #eeeef8' }}>
            <p style={{ color: '#888', fontSize: '14px' }}>No conversations yet. Browse listings and contact a seller to get started.</p>
          </div>
        )}

        {conversations.map((c) => (
          <Link key={c.listingId} href={`/marketplace/messages/${c.listingId}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '1px solid #eeeef8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#eef0fb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {c.listing?.images?.[0] ? (
                  <img src={c.listing.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '20px' }}>📦</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 4px' }}>
                  {c.listing?.title || 'Listing'} <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#4F46E5' }}>({c.role === 'seller' ? 'You are the seller' : 'You are the buyer'})</span>
                </p>
                <p style={{ fontSize: '13px', color: '#888', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
