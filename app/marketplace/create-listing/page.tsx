'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser, getCurrentSeller } from '../../../lib/marketplace-auth'

const CATEGORIES = [
  'TEFL Resources',
  'Lesson Plans',
  'Worksheets & Printables',
  'Flashcards',
  'PDF Books & E-books',
  'Physical Books',
  'Classroom Equipment',
  'Games & Activities',
  'Posters & Visual Aids',
  'Certificates & Templates',
  'Audio & Video Resources',
  'Other',
]

export default function CreateListingPage() {
  const router = useRouter()
  const [seller, setSeller] = useState<{ id: string; trust_tier: string; max_listing_price: number; status: string } | null>(null)
  const [loadingSeller, setLoadingSeller] = useState(true)
  const [notLoggedIn, setNotLoggedIn] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [itemType, setItemType] = useState<'digital' | 'physical'>('digital')
  const [stockQuantity, setStockQuantity] = useState('1')

  const [step, setStep] = useState<'form' | 'payment' | 'submitted'>('form')
  const [listingId, setListingId] = useState<string | null>(null)
  const [referenceCode, setReferenceCode] = useState('')
  const [slipUrl, setSlipUrl] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getCurrentUser().then(async (user) => {
      if (!user) {
        setNotLoggedIn(true)
        setLoadingSeller(false)
        return
      }
      const sellerData = await getCurrentSeller()
      setSeller(sellerData as any)
      setLoadingSeller(false)
    })
  }, [])

  const createListing = async () => {
    setError('')
    if (!title.trim() || !description.trim() || !price) {
      setError('Please fill in the title, description, and price.')
      return
    }
    const priceNum = parseFloat(price)
    if (seller && priceNum > seller.max_listing_price) {
      setError(`Your seller tier allows listings up to ฿${seller.max_listing_price}. Sell more items to unlock higher limits.`)
      return
    }

    setSubmitting(true)
    const code = 'MP-' + Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data, error: insertError } = await supabase
      .from('marketplace_listings')
      .insert({
        seller_id: seller?.id,
        title,
        description,
        price: priceNum,
        category,
        item_type: itemType,
        stock_quantity: itemType === 'physical' ? parseInt(stockQuantity) : 1,
        status: 'pending_payment',
        fee_amount: 20,
      })
      .select()
      .single()

    if (insertError || !data) {
      setError('Something went wrong creating the listing. Please try again.')
      setSubmitting(false)
      return
    }

    // Create the fee payment record tied to this listing
    await supabase.from('marketplace_listing_fee_payments').insert({
      listing_id: data.id,
      seller_id: seller?.id,
      amount: 20,
      promptpay_reference: code,
      status: 'pending',
    })

    setListingId(data.id)
    setReferenceCode(code)
    setStep('payment')
    setSubmitting(false)
  }

  const submitPaymentProof = async () => {
    if (!slipUrl.trim()) {
      setError('Please upload your payment slip first.')
      return
    }
    setError('')
    setSubmitting(true)

    await supabase
      .from('marketplace_listing_fee_payments')
      .update({ payment_slip_url: slipUrl })
      .eq('listing_id', listingId)
      .eq('status', 'pending')

    await supabase
      .from('marketplace_listings')
      .update({ status: 'pending_approval' })
      .eq('id', listingId)

    setStep('submitted')
    setSubmitting(false)
  }

  if (loadingSeller) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Loading...</main>
  }

  if (notLoggedIn) {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Please Log In</h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>You need to be logged in to create a listing.</p>
          <Link href="/marketplace/login?next=/marketplace/create-listing" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Log In →</Link>
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
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Apply to become a seller before creating listings.</p>
          <Link href="/marketplace/sell" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Apply to Become a Seller →</Link>
        </div>
      </main>
    )
  }

  if (seller.status !== 'approved') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Application Under Review</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>We'll approve your seller account soon — check back here once you're approved.</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '48px 24px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' }}>List an Item</h1>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>฿20 listing fee · active for 30 days · your limit: ฿{seller.max_listing_price}</p>
      </div>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '32px 24px' }}>

        {/* STEP 1: LISTING FORM */}
        {step === 'form' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeef8' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 50 TEFL Speaking Question Cards"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }} />

            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the item in detail..."
              style={{ width: '100%', minHeight: '90px', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit' }} />

            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Price (฿) *</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder={`Max ฿${seller.max_listing_price} for your tier`}
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }} />

            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Item Type</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button onClick={() => setItemType('digital')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: itemType === 'digital' ? '2px solid #4F46E5' : '1px solid #ddd', background: itemType === 'digital' ? '#eef2ff' : 'white', fontWeight: 'bold', color: '#1e1b4b', cursor: 'pointer' }}>📄 Digital</button>
              <button onClick={() => setItemType('physical')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: itemType === 'physical' ? '2px solid #4F46E5' : '1px solid #ddd', background: itemType === 'physical' ? '#eef2ff' : 'white', fontWeight: 'bold', color: '#1e1b4b', cursor: 'pointer' }}>📦 Physical</button>
            </div>

            {itemType === 'physical' && (
              <>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px' }}>Stock Quantity</label>
                <input value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} type="number"
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }} />
              </>
            )}

            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

            <button onClick={createListing} disabled={submitting}
              style={{ background: submitting ? '#999' : 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%' }}>
              {submitting ? 'Creating...' : 'Continue to Payment →'}
            </button>
          </div>
        )}

        {/* STEP 2: PROMPTPAY PAYMENT */}
        {step === 'payment' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #eeeef8', textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '8px' }}>Pay the ฿20 Listing Fee</h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Scan the QR code below with your banking app</p>

            {/* Replace this with your actual static PromptPay QR image, uploaded once to Supabase Storage or /public */}
            <div style={{ width: '200px', height: '200px', background: '#eef0fb', borderRadius: '16px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#888' }}>
              [Your PromptPay QR image here]
            </div>

            <div style={{ background: '#eef2ff', borderRadius: '10px', padding: '12px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Reference Code (include in transfer note if possible)</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#312e81', letterSpacing: '1px' }}>{referenceCode}</p>
            </div>

            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b', display: 'block', marginBottom: '6px', textAlign: 'left' }}>Upload Payment Slip *</label>
            <input
              value={slipUrl}
              onChange={(e) => setSlipUrl(e.target.value)}
              placeholder="Paste uploaded slip image URL"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '8px' }}
            />
            <p style={{ fontSize: '11px', color: '#999', marginBottom: '16px', textAlign: 'left' }}>
              (This should be replaced with an actual file upload component connected to Supabase Storage)
            </p>

            {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

            <button onClick={submitPaymentProof} disabled={submitting}
              style={{ background: submitting ? '#999' : 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%' }}>
              {submitting ? 'Submitting...' : "I've Paid — Submit for Review"}
            </button>
          </div>
        )}

        {/* STEP 3: SUBMITTED */}
        {step === 'submitted' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #eeeef8', textAlign: 'center' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>✅</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>Listing Submitted!</h2>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '20px' }}>
              We'll confirm your payment and approve your listing shortly. It'll go live for 30 days once approved.
            </p>
            <Link href="/marketplace" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>← Back to Marketplace</Link>
          </div>
        )}
      </div>
    </main>
  )
}
