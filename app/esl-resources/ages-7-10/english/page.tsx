'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../src/lib/supabase'

function calcPrice(n: number): number {
  let remaining = n
  let total = 0
  while (remaining >= 20) { total += 14; remaining -= 20 }
  while (remaining >= 10) { total += 7.50; remaining -= 10 }
  while (remaining >= 5) { total += 4; remaining -= 5 }
  total += remaining * 1
  return total
}

export default function Primary710EnglishPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    supabase
      .from('lesson_plans')
      .select('*')
      .eq('is_active', true)
      .eq('age_group', '7-10')
      .eq('subject', 'english')
      .order('created_at', { ascending: false })
      .then(({ data }) => setPlans(data || []))
  }, [])

  const freePlans = plans.filter(p => p.is_free)
  const paidPlans = plans.filter(p => !p.is_free)
  const toggleSelect = (slug: string) => setSelected(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug])
  const price = calcPrice(selected.length)
  const thb = Math.round(price * 35)
  const selectedTitles = selected.map(slug => plans.find(p => p.slug === slug)?.title).filter(Boolean)
  const contactMessage = `Hi, I would like to purchase the following ${selected.length} lesson plan(s) for Primary English (Ages 7-10):\n\n${selectedTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nTotal: $${price} USD / ${thb} THB\n\nPlease send me the bank transfer details. Thank you!`

  const blue = '#2D6BE4'

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', paddingBottom: selected.length > 0 ? '100px' : '0' }}>

      {/* BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #2D6BE4, #4f8ef7)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources/ages-7-10" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>
            Back to Ages 7-10
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '8px 16px' }}>E</div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 6px' }}>English</h1>
              <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 4px' }}>Ages 7-10 · Primary Level</p>
              <p style={{ opacity: 0.8, fontSize: '14px', margin: 0 }}>Reading, writing, grammar, comprehension, and speaking.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

        {/* FREE PLANS */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Free Lesson Plans</h2>
            <span style={{ background: '#22c55e', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>FREE</span>
          </div>
          {freePlans.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '36px', textAlign: 'center', color: '#888' }}>
              <p>Free lesson plans coming soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {freePlans.map((plan: any) => <PlanCard key={plan.id} plan={plan} selectable={false} selected={false} onToggle={() => {}} accentColor={blue} />)}
            </div>
          )}
        </div>

        {/* PRICING BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #e8f0fe, #f3eeff)', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px' }}>
          <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', marginBottom: '10px' }}>Premium Lesson Plans — Tick the ones you want for the best price!</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {[{ label: 'Single Plan', usd: '$1', thb: '35฿' }, { label: '5-Plan Pack', usd: '$4', thb: '140฿' }, { label: '10-Plan Pack', usd: '$7.50', thb: '250฿' }, { label: '20-Plan Pack', usd: '$14', thb: '490฿' }].map(item => (
              <div key={item.label} style={{ background: 'white', borderRadius: '8px', padding: '8px 14px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: blue, fontSize: '16px' }}>{item.usd} <span style={{ color: '#888', fontSize: '12px' }}>/ {item.thb}</span></div>
                <div style={{ color: '#666', fontSize: '12px' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Best price applied automatically. 7 plans = 5-pack + 2 singles = $6</p>
        </div>

        {/* PAID PLANS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Premium Plans</h2>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                Clear selection
              </button>
            )}
          </div>
          {paidPlans.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '36px', textAlign: 'center', color: '#888', border: '1px dashed #e5e7eb' }}>
              <p>Premium plans coming soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {paidPlans.map((plan: any) => (
                <PlanCard key={plan.id} plan={plan} selectable={true} selected={selected.includes(plan.slug)} onToggle={() => toggleSelect(plan.slug)} accentColor={blue} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STICKY BAR */}
      {selected.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1a1a2e', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', zIndex: 999, boxShadow: '0 -4px 20px rgba(0,0,0,0.2)' }}>
          <div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{selected.length} plan{selected.length > 1 ? 's' : ''} selected</div>
            <div style={{ color: '#FBBF24', fontSize: '14px' }}>Total: <strong>${price} USD</strong> / <strong>{thb} THB</strong></div>
          </div>
          <Link href={`/contact?message=${encodeURIComponent(contactMessage)}`}
            style={{ background: blue, color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
            Contact Us to Order
          </Link>
        </div>
      )}
    </main>
  )
}

function PlanCard({ plan, selectable, selected, onToggle, accentColor }: any) {
  return (
    <div onClick={selectable ? onToggle : undefined}
      style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: selected ? `0 0 0 3px ${accentColor}` : '0 2px 8px rgba(0,0,0,0.08)', cursor: selectable ? 'pointer' : 'default', position: 'relative', transition: 'box-shadow 0.2s' }}>
      {selectable && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, width: '22px', height: '22px', borderRadius: '6px', background: selected ? accentColor : 'white', border: `2px solid ${selected ? accentColor : '#ddd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selected && <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>v</span>}
        </div>
      )}
      <div style={{ height: '130px', background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', color: accentColor, position: 'relative' }}>
        {plan.preview_image_url ? <img src={plan.preview_image_url} alt={plan.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'E'}
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          {plan.is_free
            ? <span style={{ background: '#22c55e', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>FREE</span>
            : <span style={{ background: accentColor, color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>$1 / 35฿</span>}
        </div>
      </div>
      <div style={{ padding: '14px' }}>
        {plan.theme && <span style={{ background: '#e8f0fe', color: accentColor, fontSize: '11px', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '8px' }}>{plan.theme}</span>}
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 6px' }}>{plan.title}</h3>
        {plan.description && <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: '1.5' }}>{plan.description}</p>}
        <div style={{ marginTop: '12px', color: plan.is_free ? '#22c55e' : (selected ? accentColor : accentColor), fontSize: '13px', fontWeight: 'bold' }}>
          {plan.is_free ? 'Download Free' : (selected ? 'Selected' : 'Tap to Select')}
        </div>
      </div>
    </div>
  )
}