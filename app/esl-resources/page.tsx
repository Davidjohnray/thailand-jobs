'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

export default function ESLResourcesPage() {
  const [plans, setPlans] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('lesson_plans')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setPlans(data || []))
  }, [])

  const ageGroups = [
    { label: 'Under 5s', range: '3-4', emoji: '🐣', desc: 'Pre-K · Ages 3–4 · No reading or writing required' },
    { label: 'Ages 5–6', range: '4-5', emoji: '🌟', desc: 'K1–K2 · Ages 4–6 · Speaking and listening focus' },
    { label: 'Ages 7–10', range: '7-10', emoji: '📗', desc: 'Primary · Ages 7–10 · Coming soon' },
    { label: 'Ages 11+', range: '11+', emoji: '📘', desc: 'Secondary · Ages 11+ · Coming soon' },
  ]

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #E85D26)', padding: '60px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📖</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px' }}>ESL Resources</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 8px' }}>
          ESL lesson plans for all ages
        </p>
        <p style={{ fontSize: '15px', opacity: 0.8, maxWidth: '500px', margin: '0 auto' }}>
          Designed for bilingual schools, private kindergartens, and ESL programs in Thailand
        </p>
      </div>

      {/* PRICING BANNER */}
      <div style={{ background: '#1a1a2e', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#FBBF24', fontWeight: 'bold', fontSize: '15px', margin: '0 0 16px' }}>
          💰 Simple Pricing — Pay by Thai Bank Transfer
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: 'Single Plan', usd: '$1', thb: '35 ฿' },
            { label: '5-Plan Pack', usd: '$4', thb: '140 ฿' },
            { label: '10-Plan Pack', usd: '$7.50', thb: '250 ฿' },
            { label: '20-Plan Pack', usd: '$14', thb: '490 ฿' },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 20px', minWidth: '130px' }}>
              <div style={{ color: '#FBBF24', fontWeight: 'bold', fontSize: '18px' }}>{item.usd}</div>
              <div style={{ color: '#aaa', fontSize: '12px' }}>{item.thb}</div>
              <div style={{ color: 'white', fontSize: '13px', marginTop: '4px' }}>{item.label}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#888', fontSize: '13px', margin: '16px 0 0' }}>
          ✅ Free plans available below — no payment needed
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {ageGroups.map(group => {
          const groupPlans = plans.filter(p => p.age_group === group.range)
          const freePlans = groupPlans.filter(p => p.is_free)
          const paidPlans = groupPlans.filter(p => !p.is_free)
          const isComingSoon = group.range === '7-10' || group.range === '11+'

          return (
            <div key={group.range} style={{ marginBottom: '56px' }}>

              {/* AGE SECTION HEADER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '14px' }}>
                <span style={{ fontSize: '36px' }}>{group.emoji}</span>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{group.label}</h2>
                  <p style={{ color: '#888', fontSize: '14px', margin: '2px 0 0' }}>{group.desc}</p>
                </div>
                {isComingSoon && (
                  <span style={{ marginLeft: 'auto', background: '#f0f4ff', color: '#2D6BE4', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>
                    Coming Soon
                  </span>
                )}
              </div>

              {isComingSoon ? (
                <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#888', border: '2px dashed #e5e7eb' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔜</div>
                  <p style={{ margin: 0 }}>Lesson plans for this age group are coming soon. Check back shortly!</p>
                </div>
              ) : (
                <>
                  {/* FREE PLANS */}
                  {freePlans.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <span style={{ background: '#22c55e', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>FREE</span>
                        <span style={{ color: '#666', fontSize: '13px' }}>No payment required</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {freePlans.map((plan: any) => <PlanCard key={plan.id} plan={plan} />)}
                      </div>
                    </div>
                  )}

                  {/* PRICING REMINDER */}
                  <div style={{ background: 'linear-gradient(135deg, #fff3ed, #f3eeff)', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px' }}>📚 Premium Lesson Plans</span>
                      <span style={{ color: '#666', fontSize: '13px', marginLeft: '10px' }}>Single $1 (35฿) · 5-pack $4 (140฿) · 10-pack $7.50 (250฿) · 20-pack $14 (490฿)</span>
                    </div>
                    <span style={{ color: '#7C3AED', fontSize: '13px', fontWeight: 'bold' }}>Pay by bank transfer ✓</span>
                  </div>

                  {/* PAID PLANS */}
                  {paidPlans.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {paidPlans.map((plan: any) => <PlanCard key={plan.id} plan={plan} />)}
                    </div>
                  ) : (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#888', border: '1px dashed #e5e7eb' }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>Premium plans for this age group coming soon!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}

        {/* INFO SECTION */}
        <div style={{ marginTop: '20px', background: 'white', borderRadius: '16px', padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
          {[
            { icon: '🎯', title: 'All Ages', desc: 'Starting with Pre-K and K1-K2, with more age groups coming soon.' },
            { icon: '⏱️', title: '30–45 Minutes', desc: 'Structured into short stages: hello routine, vocabulary, activity, practice, and review.' },
            { icon: '🏫', title: 'School Ready', desc: 'Trusted by bilingual schools and private kindergartens across Thailand.' },
            { icon: '✅', title: 'No Prep', desc: 'Print and teach. Every pack includes flashcards, worksheets, and teacher notes.' },
          ].map((item: any) => (
            <div key={item.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}

function PlanCard({ plan }: { plan: any }) {
  return (
    <Link href={`/esl-resources/${plan.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', position: 'relative' }}>
        <div style={{ height: '140px', background: 'linear-gradient(135deg, #7C3AED20, #E85D2620)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', position: 'relative' }}>
          {plan.preview_image_url
            ? <img src={plan.preview_image_url} alt={plan.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '📚'}
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            {plan.is_free
              ? <span style={{ background: '#22c55e', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>FREE</span>
              : <span style={{ background: '#7C3AED', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>$1</span>
            }
          </div>
          {!plan.is_free && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '20px', padding: '8px 12px', borderRadius: '8px' }}>🔒</span>
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
            {plan.is_free ? '⬇️ Download Free' : '🛒 View & Buy — $1 / 35฿'}
          </div>
        </div>
      </div>
    </Link>
  )
}