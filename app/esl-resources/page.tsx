'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

export default function ESLResourcesPage() {
  const [freePlans, setFreePlans] = useState<any[]>([])
  const [paidPlans, setPaidPlans] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('lesson_plans')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setFreePlans(data?.filter((p: any) => p.is_free) || [])
        setPaidPlans(data?.filter((p: any) => !p.is_free) || [])
      })
  }, [])

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

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* FREE PLANS */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>🎁 Free Lesson Plans</h2>
            <span style={{ background: '#22c55e', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>FREE</span>
          </div>
          {freePlans.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#888' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📚</div>
              <p>Free lesson plans coming soon. Check back shortly!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {freePlans.map((plan: any) => <PlanCard key={plan.id} plan={plan} />)}
            </div>
          )}
        </div>

        {/* PAID PLANS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>🛒 Premium Lesson Plans</h2>
          </div>
          <p style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>
            Complete packs with lesson plan, flashcards, worksheets, and teacher notes.
          </p>
          {paidPlans.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#888' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔜</div>
              <p>Premium lesson plans launching soon!</p>
              <Link href="/account/login" style={{ display: 'inline-block', marginTop: '12px', background: '#7C3AED', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                Create Free Account
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {paidPlans.map((plan: any) => <PlanCard key={plan.id} plan={plan} />)}
            </div>
          )}
        </div>

        {/* INFO SECTION */}
        <div style={{ marginTop: '60px', background: 'white', borderRadius: '16px', padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
          {[
            { icon: '🎯', title: 'All Ages', desc: 'Starting with Pre-K, K1, and K2, with more age groups coming soon.' },
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
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
        <div style={{ height: '160px', background: 'linear-gradient(135deg, #7C3AED20, #E85D2620)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', position: 'relative' }}>
          {plan.preview_image_url
            ? <img src={plan.preview_image_url} alt={plan.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '📚'}
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            {plan.is_free
              ? <span style={{ background: '#22c55e', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>FREE</span>
              : <span style={{ background: '#7C3AED', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>${plan.price}</span>
            }
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {plan.age_group && <span style={{ background: '#f0f4ff', color: '#2D6BE4', fontSize: '12px', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Ages {plan.age_group}</span>}
            {plan.theme && <span style={{ background: '#fdf4ff', color: '#7C3AED', fontSize: '12px', padding: '3px 8px', borderRadius: '12px' }}>{plan.theme}</span>}
            {plan.pack_type && <span style={{ background: '#fff7ed', color: '#E85D26', fontSize: '12px', padding: '3px 8px', borderRadius: '12px' }}>{plan.pack_type === 'single' ? 'Single Lesson' : plan.pack_type === 'weekly' ? 'Weekly Pack' : 'Monthly Pack'}</span>}
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{plan.title}</h3>
          {plan.description && <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' }}>{plan.description}</p>}
          <div style={{ marginTop: '14px', color: plan.is_free ? '#22c55e' : '#7C3AED', fontSize: '14px', fontWeight: 'bold' }}>
            {plan.is_free ? '⬇️ Download Free' : '🛒 View & Buy'}
          </div>
        </div>
      </div>
    </Link>
  )
}