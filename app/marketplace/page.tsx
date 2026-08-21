'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { getCurrentUser } from '../../lib/marketplace-auth'

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

// Category icons — falls back to a box if the category isn't in this list
const CATEGORY_ICON: Record<string, string> = {
  Books: '📚',
  'Lesson Plans': '📝',
  Flashcards: '🗂️',
  Games: '🎲',
  'Classroom Decor': '🎨',
  Worksheets: '📄',
  Equipment: '🔧',
  Technology: '💻',
  Furniture: '🪑',
  Toys: '🧸',
  Textbooks: '📖',
  Certificates: '🎓',
}

function categoryIcon(cat: string) {
  return CATEGORY_ICON[cat] || '📦'
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const [sellButtonHref, setSellButtonHref] = useState('/marketplace/welcome')

  useEffect(() => {
    getCurrentUser().then(async (user) => {
      if (!user) {
        setSellButtonHref('/marketplace/welcome')
        return
      }
      const { data: seller } = await supabase
        .from('marketplace_sellers')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle()

      if (seller?.status === 'approved') {
        setSellButtonHref('/marketplace/dashboard')
      } else if (seller) {
        setSellButtonHref('/marketplace/sell')
      } else {
        setSellButtonHref('/marketplace/sell')
      }
    })
  }, [])

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
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '56px 24px 72px', textAlign: 'center', color: 'white' }}>

        {/* decorative floating shapes */}
        <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-30px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        {/* animated floating classroom items */}
        <style jsx>{`
          @keyframes float-a { 0%, 100% { transform: translateY(0) rotate(-12deg); } 50% { transform: translateY(-14px) rotate(-6deg); } }
          @keyframes float-b { 0%, 100% { transform: translateY(0) rotate(10deg); } 50% { transform: translateY(-10px) rotate(16deg); } }
          @keyframes float-c { 0%, 100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-16px) rotate(-2deg); } }
          @keyframes float-d { 0%, 100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-12px) rotate(0deg); } }
          @keyframes float-e { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-9px) rotate(4deg); } }
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .fi-a { animation: float-a 3.4s ease-in-out infinite; }
          .fi-b { animation: float-b 4.1s ease-in-out infinite; }
          .fi-c { animation: float-c 3.8s ease-in-out infinite; }
          .fi-d { animation: float-d 4.6s ease-in-out infinite; }
          .fi-e { animation: float-e 3.1s ease-in-out infinite; }
          .fi-spin { animation: spin-slow 12s linear infinite; }
        `}</style>
        <div className="fi-a" style={{ position: 'absolute', top: '30%', right: '8%', fontSize: '34px', opacity: 0.5 }}>📚</div>
        <div className="fi-b" style={{ position: 'absolute', top: '16%', left: '7%', fontSize: '28px', opacity: 0.5 }}>✏️</div>
        <div className="fi-c" style={{ position: 'absolute', bottom: '16%', left: '11%', fontSize: '26px', opacity: 0.45 }}>🎨</div>
        <div className="fi-d" style={{ position: 'absolute', top: '10%', right: '20%', fontSize: '24px', opacity: 0.45 }}>🎒</div>
        <div className="fi-e" style={{ position: 'absolute', bottom: '22%', right: '13%', fontSize: '24px', opacity: 0.4 }}>📐</div>
        <div className="fi-spin" style={{ position: 'absolute', bottom: '10%', left: '4%', fontSize: '22px', opacity: 0.35 }}>⭐</div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', gap: '16px', maxWidth: '1100px', margin: '0 auto 20px', fontSize: '13px' }}>
          <Link href="/marketplace/login" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 'bold' }}>Log In</Link>
          <Link href="/marketplace/register" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
          <Link href="/marketplace/messages" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 'bold' }}>My Messages</Link>
          <Link href="/marketplace/dashboard" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 'bold' }}>My Dashboard</Link>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            width: '84px', height: '84px', margin: '0 auto 16px', borderRadius: '22px',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          }}>
            🛒
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 12px' }}>Teacher Marketplace</h1>
          <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '540px', margin: '0 auto 28px' }}>
            Buy and sell teaching aids, resources, and classroom materials directly with other teachers across Thailand
          </p>
          <Link href={sellButtonHref} style={{ textDecoration: 'none' }}>
            <span style={{ background: '#10b981', color: 'white', padding: '14px 32px', borderRadius: '24px', fontSize: '15px', fontWeight: 'bold', display: 'inline-block', boxShadow: '0 8px 24px rgba(16,185,129,0.45)' }}>
              + List an Item — ฿20 / 30 days
            </span>
          </Link>
        </div>
      </div>

      {/* HOW IT WORKS — overlapping the hero for depth */}
      <div style={{ maxWidth: '1000px', margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: 'white', borderRadius: '18px', boxShadow: '0 12px 32px rgba(49,46,129,0.12)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { icon: '🔍', title: 'Browse or List', text: 'Search listings or post your own item in minutes' },
            { icon: '💬', title: 'Message Directly', text: 'Chat with the buyer or seller to arrange details' },
            { icon: '🤝', title: 'Deal Direct', text: 'Meet up or ship — you arrange payment together' },
          ].map((step) => (
            <div key={step.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{step.icon}</div>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 4px' }}>{step.title}</h4>
              <p style={{ fontSize: '12.5px', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT TEACHERS ARE SELLING — visual showcase, always populated even with no live listings yet */}
      <div style={{ maxWidth: '1100px', margin: '48px auto 0', padding: '0 24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', textAlign: 'center', margin: '0 0 6px' }}>
          What Teachers Are Selling
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', margin: '0 0 28px' }}>
          From flashcards to full classroom setups — browse by category
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {[
            { icon: '📚', label: 'Books & Textbooks', bg: 'linear-gradient(135deg, #4F46E5, #6366f1)' },
            { icon: '🗂️', label: 'Flashcards', bg: 'linear-gradient(135deg, #10b981, #34d399)' },
            { icon: '🎲', label: 'Games & Toys', bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
            { icon: '🎨', label: 'Classroom Decor', bg: 'linear-gradient(135deg, #ec4899, #f472b6)' },
            { icon: '📝', label: 'Lesson Plans', bg: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
            { icon: '💻', label: 'Technology', bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
          ].map((c) => (
            <div key={c.label} style={{
              background: c.bg, borderRadius: '16px', padding: '22px 12px', textAlign: 'center',
              color: 'white', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', cursor: 'default',
            }}>
              <div style={{ fontSize: '30px', marginBottom: '8px' }}>{c.icon}</div>
              <div style={{ fontSize: '12.5px', fontWeight: 'bold', lineHeight: '1.3' }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* CATEGORY FILTER — with icons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
          <button
            onClick={() => setCategory('all')}
            style={{
              background: category === 'all' ? '#312e81' : 'white',
              color: category === 'all' ? 'white' : '#312e81',
              border: '1px solid #e2e2f5',
              borderRadius: '20px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'transform 0.15s ease',
            }}
          >
            🗂️ All Items
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
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {categoryIcon(cat)} {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
            Loading listings...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: 'white', borderRadius: '18px', border: '1px dashed #d9d9f0' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>🛍️</div>
            <h3 style={{ fontSize: '16px', color: '#312e81', margin: '0 0 6px' }}>No listings yet in this category</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: '0 0 20px' }}>Be the first to list something here!</p>
            <Link href={sellButtonHref} style={{ textDecoration: 'none' }}>
              <span style={{ background: '#4F46E5', color: 'white', padding: '10px 22px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                + List an Item
              </span>
            </Link>
          </div>
        )}

        {/* LISTING GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {filtered.map((listing) => {
            const tier = TIER_BADGE[listing.marketplace_sellers?.trust_tier] || TIER_BADGE.new
            return (
              <Link key={listing.id} href={`/marketplace/${listing.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 14px rgba(49,46,129,0.08)',
                    height: '100%',
                    border: '1px solid #eeeef8',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(49,46,129,0.16)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 14px rgba(49,46,129,0.08)'
                  }}
                >
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, #eef0fb, #e4f7ef)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {listing.images && listing.images[0] ? (
                      <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '44px' }}>{categoryIcon(listing.category)}</span>
                    )}
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', borderRadius: '10px', padding: '3px 9px', fontSize: '11px', fontWeight: 'bold', color: '#4F46E5' }}>
                      {categoryIcon(listing.category)} {listing.category}
                    </span>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 8px', lineHeight: '1.3' }}>{listing.title}</h3>
                    <p style={{ fontSize: '19px', fontWeight: 'bold', color: '#312e81', margin: '0 0 10px' }}>฿{listing.price}</p>
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
