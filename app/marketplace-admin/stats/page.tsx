'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function MarketplaceStatsPage() {
  const router = useRouter()
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    totalFeeRevenue: 0,
    totalSellers: 0,
    approvedSellers: 0,
    pendingSellers: 0,
    totalListings: 0,
    activeListings: 0,
    expiredListings: 0,
    soldOrRemoved: 0,
    totalFeedback: 0,
    totalMessages: 0,
  })
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ category: string; count: number }[]>([])
  const [tierBreakdown, setTierBreakdown] = useState<{ tier: string; count: number }[]>([])
  const [recentListings, setRecentListings] = useState<any[]>([])
  const [recentFeedback, setRecentFeedback] = useState<any[]>([])

  useEffect(() => {
    if (sessionStorage.getItem('marketplace_admin_authed') !== 'true') {
      router.push('/marketplace-admin')
      return
    }
    setCheckedAuth(true)
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)

    const [
      { data: fees },
      { data: sellers },
      { data: listings },
      { data: feedback },
      { count: messageCount },
    ] = await Promise.all([
      supabase.from('marketplace_listing_fee_payments').select('amount, status'),
      supabase.from('marketplace_sellers').select('status, trust_tier'),
      supabase.from('marketplace_listings').select('status, category, title, price, created_at'),
      supabase.from('marketplace_feedback').select('*, marketplace_sellers(display_name)').order('created_at', { ascending: false }).limit(10),
      supabase.from('marketplace_messages').select('*', { count: 'exact', head: true }),
    ])

    const confirmedFees = (fees || []).filter((f) => f.status === 'confirmed')
    const totalFeeRevenue = confirmedFees.reduce((sum, f) => sum + Number(f.amount), 0)

    const approvedSellers = (sellers || []).filter((s) => s.status === 'approved').length
    const pendingSellers = (sellers || []).filter((s) => s.status === 'pending').length

    const activeListings = (listings || []).filter((l) => l.status === 'active').length
    const expiredListings = (listings || []).filter((l) => l.status === 'expired').length
    const soldOrRemoved = (listings || []).filter((l) => l.status === 'removed' || l.status === 'rejected').length

    setStats({
      totalFeeRevenue,
      totalSellers: (sellers || []).length,
      approvedSellers,
      pendingSellers,
      totalListings: (listings || []).length,
      activeListings,
      expiredListings,
      soldOrRemoved,
      totalFeedback: (feedback || []).length,
      totalMessages: messageCount || 0,
    })

    // Category breakdown
    const catCounts: Record<string, number> = {}
    ;(listings || []).forEach((l) => {
      catCounts[l.category] = (catCounts[l.category] || 0) + 1
    })
    setCategoryBreakdown(Object.entries(catCounts).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count))

    // Trust tier breakdown
    const tierCounts: Record<string, number> = {}
    ;(sellers || []).forEach((s) => {
      if (s.status === 'approved') tierCounts[s.trust_tier] = (tierCounts[s.trust_tier] || 0) + 1
    })
    setTierBreakdown(Object.entries(tierCounts).map(([tier, count]) => ({ tier, count })))

    // Recent listings (most recent 8)
    const sortedListings = [...(listings || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8)
    setRecentListings(sortedListings)

    setRecentFeedback(feedback || [])

    setLoading(false)
  }

  if (!checkedAuth) return null

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '32px 24px', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>📊 Marketplace Stats</h1>
            <p style={{ fontSize: '13px', opacity: 0.85, margin: '4px 0 0' }}>Everything that has happened, at a glance</p>
          </div>
          <Link href="/marketplace-admin/dashboard" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {loading && <p style={{ textAlign: 'center', color: '#888' }}>Loading stats...</p>}

        {!loading && (
          <>
            {/* TOP-LINE NUMBERS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <StatCard label="Total Fee Revenue" value={`฿${stats.totalFeeRevenue}`} color="#10b981" />
              <StatCard label="Approved Sellers" value={stats.approvedSellers} color="#4F46E5" />
              <StatCard label="Active Listings" value={stats.activeListings} color="#f59e0b" />
              <StatCard label="Positive Reviews" value={stats.totalFeedback} color="#059669" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
              <StatCard label="Total Listings Ever" value={stats.totalListings} color="#6366f1" small />
              <StatCard label="Expired Listings" value={stats.expiredListings} color="#94a3b8" small />
              <StatCard label="Pending Applications" value={stats.pendingSellers} color="#f97316" small />
              <StatCard label="Buyer-Seller Messages" value={stats.totalMessages} color="#0ea5e9" small />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '36px' }}>

              {/* CATEGORY BREAKDOWN */}
              <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #eeeef8' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '14px' }}>Listings by Category</h3>
                {categoryBreakdown.length === 0 && <p style={{ fontSize: '13px', color: '#999' }}>No listings yet.</p>}
                {categoryBreakdown.map((c) => (
                  <div key={c.category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#444', padding: '6px 0', borderBottom: '1px solid #f5f5fa' }}>
                    <span>{c.category}</span>
                    <span style={{ fontWeight: 'bold', color: '#4F46E5' }}>{c.count}</span>
                  </div>
                ))}
              </div>

              {/* TIER BREAKDOWN */}
              <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #eeeef8' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '14px' }}>Sellers by Trust Tier</h3>
                {tierBreakdown.length === 0 && <p style={{ fontSize: '13px', color: '#999' }}>No approved sellers yet.</p>}
                {tierBreakdown.map((t) => (
                  <div key={t.tier} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#444', padding: '6px 0', borderBottom: '1px solid #f5f5fa' }}>
                    <span style={{ textTransform: 'capitalize' }}>{t.tier}</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT LISTINGS */}
            <section style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '14px' }}>Recent Listings</h2>
              {recentListings.length === 0 && <p style={{ color: '#999', fontSize: '13px' }}>No listings yet.</p>}
              {recentListings.map((l, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '12px 18px', border: '1px solid #eeeef8', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#1e1b4b', fontWeight: 'bold' }}>{l.title}</span>
                  <span style={{ color: '#888' }}>฿{l.price} · {l.category} · <span style={{ textTransform: 'capitalize' }}>{l.status}</span></span>
                </div>
              ))}
            </section>

            {/* RECENT FEEDBACK */}
            <section>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '14px' }}>Recent Positive Feedback</h2>
              {recentFeedback.length === 0 && <p style={{ color: '#999', fontSize: '13px' }}>No feedback yet.</p>}
              {recentFeedback.map((f, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '12px 18px', border: '1px solid #eeeef8', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#1e1b4b', fontWeight: 'bold' }}>{'⭐'.repeat(f.rating)} {f.marketplace_sellers?.display_name}</span>
                  {f.comment && <p style={{ color: '#666', margin: '4px 0 0' }}>{f.comment}</p>}
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  )
}

function StatCard({ label, value, color, small }: { label: string; value: string | number; color: string; small?: boolean }) {
  return (
    <div style={{ background: 'white', borderRadius: '14px', padding: small ? '14px' : '20px', border: '1px solid #eeeef8', textAlign: 'center' }}>
      <p style={{ fontSize: small ? '20px' : '28px', fontWeight: 'bold', color, margin: 0 }}>{value}</p>
      <p style={{ fontSize: '11px', color: '#888', margin: '4px 0 0' }}>{label}</p>
    </div>
  )
}
