'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../../src/lib/supabase'

export default function ESLCheckoutPage() {
  const { slug } = useParams()
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [slip, setSlip] = useState<File | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmail(session.user.email || '')
      }
    })
    supabase
      .from('lesson_plans')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
      .then(({ data }) => {
        setPlan(data)
        setLoading(false)
      })
  }, [slug])

  const handleSubmit = async () => {
    if (!name || !email || !slip) {
      setError('Please fill in all fields and upload your payment slip.')
      return
    }
    setSubmitting(true)
    setError('')

    // Upload slip
    const fileExt = slip.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lesson-plan-slips')
      .upload(fileName, slip)

    if (uploadError) {
      setError('Failed to upload slip. Please try again.')
      setSubmitting(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('lesson-plan-slips')
      .getPublicUrl(fileName)

    // Get user id if logged in
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null

    // Create order
    const { error: orderError } = await supabase
      .from('lesson_plan_orders')
      .insert({
        lesson_plan_id: plan.id,
        buyer_name: name,
        buyer_email: email,
        user_id: userId,
        slip_url: publicUrl,
        status: 'pending',
      })

    if (orderError) {
      setError('Failed to submit order. Please try again.')
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>
  if (!plan) return <div style={{ padding: '60px', textAlign: 'center' }}>Plan not found.</div>

  if (done) return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '480px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Order Received!</h2>
        <p style={{ color: '#666', marginBottom: '8px' }}>Thank you <strong>{name}</strong>! We have received your payment slip for:</p>
        <p style={{ color: '#7C3AED', fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>{plan.title}</p>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
          Once your payment is verified we will send the download link to <strong>{email}</strong>. This usually takes a few hours.
        </p>
        <Link href="/esl-resources" style={{ display: 'inline-block', background: '#7C3AED', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
          Browse More Resources
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #E85D26)', padding: '36px 24px', color: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href={`/esl-resources/${plan.slug}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to {plan.title}
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '12px 0 4px' }}>Checkout</h1>
          <p style={{ opacity: 0.9, margin: 0 }}>{plan.title}</p>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>

        {/* ORDER SUMMARY */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#1a1a2e' }}>{plan.title}</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                {plan.pack_type === 'single' ? 'Single Lesson' : plan.pack_type === 'weekly' ? 'Weekly Pack' : 'Monthly Pack'}
                {plan.age_group && ` · Ages ${plan.age_group}`}
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7C3AED' }}>${plan.price}</div>
          </div>
        </div>

        {/* BANK TRANSFER DETAILS */}
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>💳 Bank Transfer Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Bank', value: 'Kasikorn Bank (KBank)' },
              { label: 'Account Name', value: 'Jobs in Thailand' },
              { label: 'Account Number', value: '000-0-00000-0' },
              { label: 'Amount', value: `$${plan.price} USD` },
              { label: 'Reference', value: plan.title },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#888' }}>{item.label}</span>
                <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <p style={{ margin: '16px 0 0', fontSize: '13px', color: '#666' }}>
            Please transfer the exact amount and upload your slip below. Your download link will be sent by email once verified.
          </p>
        </div>

        {/* FORM */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px' }}>Your Details</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
            <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>Your download link will be sent here</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>Payment Slip</label>
            <input type="file" accept="image/*,.pdf" onChange={e => setSlip(e.target.files?.[0] || null)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: '#fafafa' }} />
            <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>Upload a screenshot or photo of your bank transfer</p>
          </div>

          {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px', color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

          <button onClick={handleSubmit} disabled={submitting}
            style={{ width: '100%', background: submitting ? '#9ca3af' : '#7C3AED', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Submitting...' : '✅ Submit Order'}
          </button>
        </div>

      </div>
    </main>
  )
}