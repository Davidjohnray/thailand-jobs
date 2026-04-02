'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

export default function ESLPlanPage() {
  const { slug } = useParams()
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontSize: '18px' }}>Loading...</div>
  if (!plan) return <div style={{ padding: '60px', textAlign: 'center', fontSize: '18px' }}>Lesson plan not found.</div>

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #E85D26)', padding: '48px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to ESL Resources
          </Link>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {plan.age_group && <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>Ages {plan.age_group}</span>}
            {plan.theme && <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>{plan.theme}</span>}
            {plan.pack_type && <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>{plan.pack_type === 'single' ? 'Single Lesson' : plan.pack_type === 'weekly' ? 'Weekly Pack' : 'Monthly Pack'}</span>}
            {plan.is_free
              ? <span style={{ background: '#22c55e', color: 'white', fontSize: '13px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>FREE</span>
              : <span style={{ background: 'white', color: '#7C3AED', fontSize: '13px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>${plan.price}</span>
            }
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '16px 0 8px' }}>{plan.title}</h1>
          {plan.description && <p style={{ fontSize: '16px', opacity: 0.9, margin: 0, maxWidth: '600px' }}>{plan.description}</p>}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div>

          {/* WHAT STUDENTS WILL LEARN */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>🎯 What Students Will Learn</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#444', lineHeight: '2' }}>
              <li>Age-appropriate vocabulary and expressions</li>
              <li>Listening and speaking skills</li>
              <li>Classroom participation and confidence</li>
              <li>Repetition-based language acquisition</li>
            </ul>
          </div>

          {/* WHAT'S INCLUDED */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>📦 What's Included</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📄', text: 'Printable lesson plan (1–2 pages)' },
                { icon: '🃏', text: 'Flashcards (color + B&W)' },
                { icon: '📝', text: '1 visual worksheet' },
                { icon: '👩‍🏫', text: 'Teacher notes and classroom language tips' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <span style={{ color: '#444', fontSize: '15px' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LESSON STRUCTURE */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>⏱️ Lesson Structure (30–45 min)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { time: '5 min', step: 'Hello & routine' },
                { time: '5–8 min', step: 'Vocabulary introduction' },
                { time: '5–7 min', step: 'Movement or song activity' },
                { time: '10 min', step: 'Guided practice (worksheet / game)' },
                { time: '5 min', step: 'Speaking / response activity' },
                { time: '5 min', step: 'Review & goodbye' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 14px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <span style={{ background: '#7C3AED', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{item.time}</span>
                  <span style={{ color: '#444', fontSize: '14px' }}>{item.step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN — CTA */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>

            {plan.preview_image_url && (
              <img src={plan.preview_image_url} alt={plan.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '20px', objectFit: 'cover' }} />
            )}

            <div style={{ fontSize: '32px', fontWeight: 'bold', color: plan.is_free ? '#22c55e' : '#7C3AED', marginBottom: '4px' }}>
              {plan.is_free ? 'FREE' : `$${plan.price}`}
            </div>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
              {plan.is_free ? 'No signup required' : 'One-time payment via bank transfer'}
            </p>

            {plan.is_free ? (
              <a href={plan.file_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', background: '#22c55e', color: 'white', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>
                ⬇️ Download Free
              </a>
            ) : (
              <Link href={`/esl-resources/checkout/${plan.slug}`}
                style={{ display: 'block', background: '#7C3AED', color: 'white', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>
                🛒 Buy Now
              </Link>
            )}

            <Link href="/esl-resources"
              style={{ display: 'block', color: '#888', fontSize: '13px', textDecoration: 'none' }}>
              ← Browse all resources
            </Link>

            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                '✅ No reading required',
                '✅ No writing (tracing only)',
                '✅ Repetition-based speaking',
                '✅ Works for non-native teachers',
              ].map(item => (
                <div key={item} style={{ fontSize: '13px', color: '#555', textAlign: 'left' }}>{item}</div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* MOBILE RESPONSIVE */}
      <style>{`
        @media (max-width: 768px) {
          main > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </main>
  )
}