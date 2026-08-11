'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function MarketplaceAdminDashboard() {
  const router = useRouter()
  const [checkedAuth, setCheckedAuth] = useState(false)

  const [pendingSellers, setPendingSellers] = useState<any[]>([])
  const [pendingFeePayments, setPendingFeePayments] = useState<any[]>([])
  const [pendingListings, setPendingListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('marketplace_admin_authed') !== 'true') {
      router.push('/marketplace-admin')
      return
    }
    setCheckedAuth(true)
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)

    const { data: sellers } = await supabase
      .from('marketplace_sellers')
      .select('*')
      .eq('status', 'pending')
      .order('applied_at', { ascending: true })

    const { data: fees } = await supabase
      .from('marketplace_listing_fee_payments')
      .select('*, marketplace_listings(title), marketplace_sellers(display_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    const { data: listings } = await supabase
      .from('marketplace_listings')
      .select('*, marketplace_sellers(display_name)')
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: true })

    setPendingSellers(sellers || [])
    setPendingFeePayments(fees || [])
    setPendingListings(listings || [])
    setLoading(false)
  }

  const approveSeller = async (id: string) => {
    await supabase.from('marketplace_sellers').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', id)
    loadAll()
  }

  const rejectSeller = async (id: string) => {
    await supabase.from('marketplace_sellers').update({ status: 'rejected' }).eq('id', id)
    loadAll()
  }

  const confirmFeePayment = async (feePaymentId: string, listingId: string) => {
    await supabase.from('marketplace_listing_fee_payments').update({ status: 'confirmed', confirmed_by_admin_at: new Date().toISOString() }).eq('id', feePaymentId)
    await supabase.from('marketplace_listings').update({ fee_paid: true, fee_paid_at: new Date().toISOString() }).eq('id', listingId)
    loadAll()
  }

  const approveListing = async (id: string) => {
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    await supabase.from('marketplace_listings').update({ status: 'active', listing_expires_at: expires.toISOString() }).eq('id', id)
    loadAll()
  }

  const rejectListing = async (id: string) => {
    await supabase.from('marketplace_listings').update({ status: 'rejected' }).eq('id', id)
    loadAll()
  }

  const logout = () => {
    sessionStorage.removeItem('marketplace_admin_authed')
    router.push('/marketplace-admin')
  }

  if (!checkedAuth) return null

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '32px 24px', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🛒 Marketplace Admin</h1>
            <p style={{ fontSize: '13px', opacity: 0.85, margin: '4px 0 0' }}>Everything needing your attention, in one place</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/marketplace-admin/stats" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}>
              📊 Stats
            </a>
            <button onClick={logout} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {loading && <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>}

        {!loading && (
          <>
            {/* SUMMARY COUNTS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '36px' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eeeef8', textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4F46E5', margin: 0 }}>{pendingSellers.length}</p>
                <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>Pending Seller Applications</p>
              </div>
              <div style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eeeef8', textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{pendingFeePayments.length}</p>
                <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>Fee Payments to Confirm</p>
              </div>
              <div style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #eeeef8', textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{pendingListings.length}</p>
                <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>Listings to Approve</p>
              </div>
            </div>

            {/* PENDING SELLERS */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '14px' }}>🆕 Pending Seller Applications</h2>
              {pendingSellers.length === 0 && <p style={{ color: '#999', fontSize: '13px' }}>Nothing pending.</p>}
              {pendingSellers.map((s) => (
                <div key={s.id} style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '1px solid #eeeef8', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 4px' }}>{s.display_name}</p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>PromptPay: {s.contact_promptpay} · Contact: {s.contact_line_or_phone}</p>
                    {s.bio && <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>{s.bio}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => approveSeller(s.id)} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>✅ Approve</button>
                    <button onClick={() => rejectSeller(s.id)} style={{ background: '#f1f1f1', color: '#666', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))}
            </section>

            {/* PENDING FEE PAYMENTS */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '14px' }}>💰 Fee Payments to Confirm</h2>
              {pendingFeePayments.length === 0 && <p style={{ color: '#999', fontSize: '13px' }}>Nothing pending.</p>}
              {pendingFeePayments.map((f) => (
                <div key={f.id} style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '1px solid #eeeef8', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 4px' }}>{f.marketplace_listings?.title || 'Listing'}</p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                      Seller: {f.marketplace_sellers?.display_name} · Ref: {f.promptpay_reference} · ฿{f.amount}
                    </p>
                    {f.payment_slip_url && (
                      <a href={f.payment_slip_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#4F46E5', fontWeight: 'bold' }}>View Payment Slip →</a>
                    )}
                  </div>
                  <button onClick={() => confirmFeePayment(f.id, f.listing_id)} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>✅ Confirm Payment</button>
                </div>
              ))}
            </section>

            {/* PENDING LISTINGS */}
            <section>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '14px' }}>📋 Listings to Approve</h2>
              {pendingListings.length === 0 && <p style={{ color: '#999', fontSize: '13px' }}>Nothing pending.</p>}
              {pendingListings.map((l) => (
                <div key={l.id} style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '1px solid #eeeef8', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 4px' }}>{l.title} — ฿{l.price}</p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                      Seller: {l.marketplace_sellers?.display_name} · {l.category} · {l.item_type} · Fee paid: {l.fee_paid ? '✅' : '❌ not yet'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => approveListing(l.id)} disabled={!l.fee_paid} style={{ background: l.fee_paid ? '#10b981' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', cursor: l.fee_paid ? 'pointer' : 'not-allowed' }}>✅ Approve</button>
                    <button onClick={() => rejectListing(l.id)} style={{ background: '#f1f1f1', color: '#666', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  )
}
