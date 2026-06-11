'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TOPICS = [
  { id: 'street-food', title: 'Street Food & Eating Outdoors', free: true, parts: [1, 2, 3] },
  { id: 'phone-habits', title: 'Using Your Phone in Public', free: true, parts: [1, 2, 3] },
  { id: 'online-shopping', title: 'Online Shopping Habits', free: true, parts: [1, 2, 3] },
  { id: 'hot-climate', title: 'Living in a Hot Climate', free: false, parts: [1, 2, 3] },
  { id: 'traffic', title: 'Traffic & Getting Around', free: false, parts: [1, 2, 3] },
  { id: 'language-learning', title: 'Learning a New Language', free: false, parts: [1, 2, 3] },
  { id: 'different-cultures', title: 'Working with Different Cultures', free: false, parts: [1, 2, 3] },
  { id: 'cashless-payments', title: 'Cashless Payments', free: false, parts: [1, 2, 3] },
  { id: 'festivals', title: 'Traditional Festivals', free: false, parts: [1, 2, 3] },
  { id: 'personal-style', title: 'Clothing & Personal Style', free: false, parts: [1, 2, 3] },
]

export default function IELTSSpeakingPage() {
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) {
      setHasAccess(true)
      setCheckingAccess(false)
      return
    }
    if (!email) { setCheckingAccess(false); return }
    supabase
      .from('ielts_access')
      .select('expires_at, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .single()
      .then(({ data }) => {
        if (data && new Date(data.expires_at) > new Date()) {
          setHasAccess(true)
          localStorage.setItem('ielts_expires', data.expires_at)
        }
        setCheckingAccess(false)
      })
  }, [])

  const freeTopic = TOPICS.filter(t => t.free)
  const paidTopics = TOPICS.filter(t => !t.free)

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
        padding: '48px 24px 40px',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/ielts" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none' }}>
            ← IELTS Hub
          </Link>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 'bold', margin: '12px 0 8px' }}>
            🎤 IELTS Speaking Practice
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: 0, maxWidth: '580px', lineHeight: 1.6 }}>
            Speak your answers using your microphone, get AI feedback and an estimated band score.
            Each topic covers Part 1, Part 2, and Part 3.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { icon: '🎤', text: 'Speak your answer using your mic' },
            { icon: '✏️', text: 'Edit the text if needed' },
            { icon: '🤖', text: 'Get AI feedback and band score' },
            { icon: '📝', text: 'See a model Band 7–8 answer' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '40px 24px', maxWidth: '860px', margin: '0 auto' }}>

        {/* Free Topics */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>
          Free Lessons
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          No account needed — start practising now
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {freeTopic.map(topic => (
            <TopicCard key={topic.id} topic={topic} locked={false} />
          ))}
        </div>

        {/* Paid Topics */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>
          Subscription Lessons
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          {hasAccess ? 'Full access active — all lessons unlocked' : '149 THB/month — activate your code to unlock'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {paidTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} locked={!hasAccess} />
          ))}
        </div>

        {!checkingAccess && !hasAccess && (
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '32px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: '0 0 8px' }}>
              Unlock All Speaking Topics
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 20px' }}>
              149 THB/month · 30 days · All skills included
            </p>
            <Link href="/ielts/subscribe" style={{
              background: '#2563eb',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-block',
            }}>
              Get Access →
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

function TopicCard({ topic, locked }: { topic: typeof TOPICS[0], locked: boolean }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: locked ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
      opacity: locked ? 0.85 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', margin: 0, lineHeight: 1.4, flex: 1 }}>
          {topic.title}
        </h3>
        {topic.free && (
          <span style={{
            background: '#dcfce7',
            color: '#16a34a',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '2px 8px',
            borderRadius: '20px',
            marginLeft: '8px',
            flexShrink: 0,
          }}>FREE</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {topic.parts.map(p => (
          <span key={p} style={{
            background: '#eff6ff',
            color: '#2563eb',
            fontSize: '11px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>Part {p}</span>
        ))}
      </div>
      {locked ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px',
          background: '#f1f5f9',
          borderRadius: '8px',
          color: '#94a3b8',
          fontSize: '13px',
          fontWeight: '600',
        }}>
          🔒 Subscription Required
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {topic.parts.map(p => (
            <Link key={p} href={`/ielts/speaking/${topic.id}/part-${p}`} style={{
              display: 'block',
              background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
              textAlign: 'center',
            }}>
              Start Part {p} →
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
