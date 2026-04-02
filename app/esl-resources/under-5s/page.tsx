'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

export default function Under5sPage() {
  const [plans, setPlans] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('lesson_plans')
      .select('*')
      .eq('is_active', true)
      .eq('age_group', '3-4')
      .order('created_at', { ascending: false })
      .then(({ data }) => setPlans(data || []))
  }, [])

  const freePlans = plans.filter(p => p.is_free)
  const paidPlans = plans.filter(p => !p.is_free)

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to ESL Resources
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <span style={{ fontSize: '64px' }}>🐣</span>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 6px' }}>Under 5s</h1>
              <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 4px' }}>Ages 3–4 · Pre-K Level</p>
              <p style={{ opacity: 0.8, fontSize: '14px', margin: 0 }}>Simple vocabulary, movement activities, and songs. No reading or writing required.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

        {/* FREE PLANS */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>🎁 Free Lesson Plans</h2>
            <span style={{ background: '#22c55e', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>FREE</span>
          </div>
          {freePlans.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '36px', textAlign: 'center', color: '#888' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📚</div>
              <p>Free lesson plans coming soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {freePlans.map((plan: any) => <PlanCard key={plan.id} plan={plan} />)}
            </div>
          )}
        </div>

        {/* PRICING BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #fff3ed, #f3eeff)', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px' }}>
          <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', marginBottom: '10px' }}>📚 Premium Lesson Plans — Pay by Thai Bank Transfer</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Single Plan', usd: '$1', thb: '35฿' },
              { label: '5-Plan Pack', usd: '$4', thb: '140฿' },
              { label: '10-Plan Pack', usd: '$7.50', thb: '250฿' },
              { label: '20-Plan Pack', usd: '$14', thb: '490฿' },
            ].map(item => (
              <div key={item.label} style={{ background: 'white', borderRadius: '8px', padding: '8px 14px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#7C3AED', fontSize: '16px' }}>{item.usd} <span style={{ color: '#888', fontSize: '12px' }}>/ {item.thb}</span></div>
                <div style={{ color: '#666', fontSize: '12px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PAID PLANS */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '18px' }}>🛒 Premium Plans</h2>
          {paidPlans.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '36px', textAlign: 'center', color: '#888', border: '1px dashed #e5e7eb' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔜</div>
              <p>Premium plans for this age group coming soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {paidPlans.map((plan: any) => <PlanCard key={plan.id} plan={plan} />)}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}

function PlanCard({ plan }: { plan: any }) {
  return (
    <Link href={`/esl-resources/${plan.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
        <div style={{ height: '140px', background: 'linear-gradient(135deg, #fff3ed, #f3eeff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', position: 'relative' }}>
          {plan.preview_image_url
            ? <img src={plan.preview_image_url} alt={plan.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '📚'}
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            {plan.is_free
              ? <span style={{ background: '#22c55e', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>FREE</span>
              : <span style={{ background: '#7C3AED', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>$1 / 35฿</span>
            }
          </div>
          {!plan.is_free && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ background: 'rgba(0,0,0,0.45)', color: 'white', fontSize: '20px', padding: '8px 12px', borderRadius: '8px' }}>🔒</span>
            </div>
          )}
        </div>
        <div style={{ padding: '14px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {plan.theme && <span style={{ background: '#fdf4ff', color: '#7C3AED', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>{plan.theme}</span>}
            {plan.pack_type && <span style={{ background: '#fff7ed', color: '#E85D26', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>{plan.pack_type === 'single' ? 'Single Lesson' : plan.pack_type === 'weekly' ? 'Weekly Pack' : 'Monthly Pack'}</span>}
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 6px' }}>{plan.title}</h3>
          {plan.description && <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: '1.5' }}>{plan.description}</p>}
          <div style={{ marginTop: '12px', color: plan.is_free ? '#22c55e' : '#7C3AED', fontSize: '13px', fontWeight: 'bold' }}>
            {plan.is_free ? '⬇️ Download Free' : '🛒 View & Buy'}
          </div>
        </div>
      </div>
    </Link>
  )
}