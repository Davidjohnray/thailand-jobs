'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Listing = {
  id: string
  title: string
  description: string
  price: number
  category: string
  item_type: string
  images: string[]
  marketplace_sellers: { display_name: string; trust_tier: string; positive_feedback_count: number }
}

const TIER_BADGE: Record<string, { label: string; color: string }> = {
  new: { label: '🆕 New Seller', color: '#94a3b8' },
  growing: { label: '🌱 Growing Seller', color: '#10b981' },
  trusted: { label: '✅ Trusted Seller', color: '#059669' },
  top: { label: '⭐ Top Seller', color: '#4F46E5' },
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    supabase
      .from('marketplace_listings')
      .select('id, title, description, price, category, item_type, images, marketplace_sellers(display_name, trust_tier, positive_feedback_count)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setLoading(false)
          return
        }
        const items = (data || []) as any[]
        setListings(items)
        setCategories(Array.from(new Set(items.map((i) => i.category))))
        setLoading(false)
      })
  }, [])

  const filtered = category === 'all' ? listings : listings.filter((l) => l.category === category)

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '64px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px' }}>Teacher Marketplace</h1>
        <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '540px', margin: '0 auto 24px' }}>
          Buy and sell teaching aids, resources, and classroom materials directly with other teachers
        </p>
        <Link href="/marketplace/sell" style={{ textDecoration: 'none' }}>
          <span style={{ background: '#10b981', color: 'white', padding: '12px 28px', borderRadius: '24px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', boxShadow: '0 6px 20px rgba(16,185,129,0.4)' }}>
            + List an Item — ฿20 / 30 days
          </span>
        </Link>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* CATEGORY FILTER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
          <button
            onClick={() => setCategory('all')}
            style={{
              background: category === 'all' ? '#312e81' : 'white',
              color: category === 'all' ? 'white' : '#312e81',
              border: '1px solid #e2e2f5',
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? '#312e81' : 'white',
                color: category === cat ? 'white' : '#312e81',
                border: '1px solid #e2e2f5',
                borderRadius: '20px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#888' }}>Loading listings...</p>}

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', padding: '48px 0' }}>No listings yet in this category.</p>
        )}

        {/* LISTING GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {filtered.map((listing) => {
            const tier = TIER_BADGE[listing.marketplace_sellers?.trust_tier] || TIER_BADGE.new
            return (
              <Link key={listing.id} href={`/marketplace/${listing.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(49,46,129,0.08)', height: '100%', border: '1px solid #eeeef8' }}>
                  <div style={{ height: '160px', background: '#eef0fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {listing.images && listing.images[0] ? (
                      <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '40px' }}>{listing.item_type === 'digital' ? '📄' : '📦'}</span>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <span style={{ fontSize: '11px', color: '#4F46E5', fontWeight: 'bold', textTransform: 'uppercase' }}>{listing.category}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e1b4b', margin: '4px 0 8px', lineHeight: '1.3' }}>{listing.title}</h3>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#312e81', margin: '0 0 10px' }}>฿{listing.price}</p>
                    {listing.marketplace_sellers && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: tier.color }}>{tier.label}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
