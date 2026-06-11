'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TOPICS = [
  {
    id: 'technology-thinking',
    title: 'Technology & Independent Thinking',
    type: 'Opinion Essay',
    typeColor: '#2563eb',
    question: 'Some people believe that technology is making people less able to think for themselves. To what extent do you agree or disagree?',
    free: true,
  },
  {
    id: 'education-success',
    title: 'Education & Success',
    type: 'Discussion Essay',
    typeColor: '#059669',
    question: 'Some people think that a university degree is the only path to a successful career. Others believe that vocational training is equally valuable. Discuss both views and give your own opinion.',
    free: true,
  },
  {
    id: 'environment-development',
    title: 'Environment & Development',
    type: 'Problem-Solution Essay',
    typeColor: '#d97706',
    question: 'Many cities around the world are facing serious problems caused by rapid urbanisation. What problems does this cause and what solutions can you suggest?',
    free: true,
  },
  {
    id: 'social-media-communication',
    title: 'Social Media & Communication',
    type: 'Advantages-Disadvantages',
    typeColor: '#7c3aed',
    question: 'Social media has transformed the way people communicate and share information. What are the advantages and disadvantages of this development?',
    free: false,
  },
  {
    id: 'globalisation-culture',
    title: 'Globalisation & Culture',
    type: 'Opinion Essay',
    typeColor: '#2563eb',
    question: 'Globalisation has led to the spread of Western culture across the world. Some people see this as a positive development while others see it as a threat to local cultures. To what extent do you agree or disagree?',
    free: false,
  },
  {
    id: 'health-government',
    title: 'Health & Government Responsibility',
    type: 'Discussion Essay',
    typeColor: '#059669',
    question: 'Some people believe that the government should be responsible for ensuring citizens live healthy lives. Others think that health is a personal responsibility. Discuss both views and give your own opinion.',
    free: false,
  },
]

const ESSAY_TYPES = [
  { type: 'Opinion Essay', color: '#2563eb', tip: 'Give your position clearly and defend it throughout. Use "I believe" / "In my opinion" sparingly — show your view through your arguments.' },
  { type: 'Discussion Essay', color: '#059669', tip: 'Present both sides fairly, then give your own opinion in the conclusion. Do not be one-sided in the body paragraphs.' },
  { type: 'Problem-Solution', color: '#d97706', tip: 'Identify specific problems clearly, then propose realistic solutions. Each solution should directly address the problem you identified.' },
  { type: 'Advantages-Disadvantages', color: '#7c3aed', tip: 'Cover both sides thoroughly. Do not write all advantages then all disadvantages — consider mixing within paragraphs for coherence.' },
]

export default function IELTSWritingPage() {
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) {
      setHasAccess(true); setCheckingAccess(false); return
    }
    if (!email) { setCheckingAccess(false); return }
    supabase.from('ielts_access').select('expires_at, is_active').eq('email', email).eq('is_active', true).single()
      .then(({ data }) => {
        if (data && new Date(data.expires_at) > new Date()) {
          setHasAccess(true)
          localStorage.setItem('ielts_expires', data.expires_at)
        }
        setCheckingAccess(false)
      })
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/ielts" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none' }}>← IELTS Hub</Link>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 'bold', margin: '12px 0 8px' }}>✍️ IELTS Writing Practice</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: 0, maxWidth: '580px', lineHeight: 1.6 }}>
            Task 2 essay practice with a guided planner, useful language, AI feedback on all 4 band score criteria, and Band 6 vs Band 7–8 model essays.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { icon: '📋', text: 'Learn the essay type & structure' },
            { icon: '🗂️', text: 'Plan your essay with guided prompts' },
            { icon: '✍️', text: 'Write with useful language on screen' },
            { icon: '🤖', text: 'Get AI feedback on all 4 criteria' },
            { icon: '📝', text: 'Compare Band 6 & 7–8 model essays' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>{item.text}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '40px 24px', maxWidth: '860px', margin: '0 auto' }}>

        {/* Essay Types Guide */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>Essay Types Guide</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>Know what each type requires before you start</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {ESSAY_TYPES.map(et => (
            <div key={et.type} style={{ background: 'white', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', borderLeft: `4px solid ${et.color}` }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: et.color, margin: '0 0 6px' }}>{et.type}</p>
              <p style={{ fontSize: '12px', color: '#555', margin: 0, lineHeight: 1.5 }}>{et.tip}</p>
            </div>
          ))}
        </div>

        {/* Free Topics */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>Free Lessons</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>No account needed — start writing now</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {TOPICS.filter(t => t.free).map(topic => (
            <TopicCard key={topic.id} topic={topic} locked={false} />
          ))}
        </div>

        {/* Paid Topics */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>Subscription Lessons</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          {hasAccess ? 'Full access active — all lessons unlocked' : '149 THB/month — activate your code to unlock'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {TOPICS.filter(t => !t.free).map(topic => (
            <TopicCard key={topic.id} topic={topic} locked={!hasAccess} />
          ))}
        </div>

        {!checkingAccess && !hasAccess && (
          <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', borderRadius: '16px', padding: '32px', marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: '0 0 8px' }}>Unlock All Writing Topics</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 20px' }}>149 THB/month · 30 days · All skills included</p>
            <Link href="/ielts/subscribe" style={{ background: '#059669', color: 'white', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', display: 'inline-block', border: '2px solid rgba(255,255,255,0.3)' }}>
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
    <div style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: locked ? '1px solid #e2e8f0' : '1px solid #a7f3d0', opacity: locked ? 0.85 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: topic.typeColor + '20', color: topic.typeColor, fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', border: `1px solid ${topic.typeColor}40` }}>{topic.type}</span>
          {topic.free && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>FREE</span>}
        </div>
      </div>
      <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{topic.title}</h3>
      <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px', lineHeight: 1.5, fontStyle: 'italic' }}>"{topic.question}"</p>
      {locked ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#f1f5f9', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
          🔒 Subscription Required
        </div>
      ) : (
        <Link href={`/ielts/writing/${topic.id}`} style={{ display: 'block', background: 'linear-gradient(135deg, #064e3b, #059669)', color: 'white', textAlign: 'center', padding: '11px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>
          Start Writing →
        </Link>
      )}
    </div>
  )
}
