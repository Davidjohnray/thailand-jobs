'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TESTS = [
  {
    id: 'sustainable-tourism',
    title: 'Mock Test 1',
    topics: ['Sustainable Tourism in Southeast Asia', 'Remote Work & Digital Nomads', 'Wildlife Conservation in Thailand'],
    free: true,
  },
  {
    id: 'urban-innovation',
    title: 'Mock Test 2',
    topics: ['The Psychology of Sleep', 'The History and Science of Chocolate', 'Artificial Intelligence and the Future of Work'],
    free: false,
  },
  {
    id: 'mock-test-3',
    title: 'Mock Test 3',
    topics: ['Coming soon', 'Coming soon', 'Coming soon'],
    free: false,
  },
]

const QUESTION_TYPES = [
  { type: 'True / False / Not Given', desc: 'Decide whether a statement agrees with, contradicts, or is not mentioned in the passage.' },
  { type: 'Matching Headings', desc: 'Match the correct heading to each paragraph from a list of options.' },
  { type: 'Multiple Choice', desc: 'Choose the correct answer from four options based on detail or inference.' },
  { type: 'Sentence Completion', desc: 'Complete sentences using words taken directly from the passage.' },
  { type: 'Matching Information', desc: 'Identify which paragraph contains specific information.' },
  { type: 'Summary Completion', desc: 'Fill gaps in a summary of part of the passage using words from a list or the text.' },
]

export default function IELTSReadingPage() {
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
      <section style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/ielts" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none' }}>← IELTS Hub</Link>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 'bold', margin: '12px 0 8px' }}>📖 IELTS Reading Practice</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: 0, maxWidth: '580px', lineHeight: 1.6 }}>
            Full-length mock tests — 3 passages, 40 questions, mixed question types, just like the real exam. AI explanations for every answer, plus an optional 20-minute-per-passage timer.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { icon: '📄', text: '3 passages, increasing difficulty' },
            { icon: '❓', text: '40 questions, mixed types' },
            { icon: '⏱️', text: 'Optional 20-min-per-passage timer' },
            { icon: '🤖', text: 'AI explanation for every question' },
            { icon: '🎯', text: 'Score out of 40 + band estimate' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>{item.text}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '40px 24px', maxWidth: '860px', margin: '0 auto' }}>

        {/* Question Types Guide */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>Question Types You'll Practice</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>Each mock test mixes several of these across its 3 passages</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {QUESTION_TYPES.map(qt => (
            <div key={qt.type} style={{ background: 'white', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #d97706' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#92400e', margin: '0 0 6px' }}>{qt.type}</p>
              <p style={{ fontSize: '12px', color: '#555', margin: 0, lineHeight: 1.5 }}>{qt.desc}</p>
            </div>
          ))}
        </div>

        {/* Free Test */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>Free Mock Test</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>No account needed — try a full reading test now</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {TESTS.filter(t => t.free).map(test => (
            <TestCard key={test.id} test={test} locked={false} />
          ))}
        </div>

        {/* Subscription Tests */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>Subscription Mock Tests</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          {hasAccess ? 'Full access active — all tests unlocked' : '149 THB/month — activate your code to unlock'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {TESTS.filter(t => !t.free).map(test => (
            <TestCard key={test.id} test={test} locked={!hasAccess} />
          ))}
        </div>

        {!checkingAccess && !hasAccess && (
          <div style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', borderRadius: '16px', padding: '32px', marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: '0 0 8px' }}>Unlock All Reading Tests</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 20px' }}>149 THB/month · 30 days · All skills included</p>
            <Link href="/ielts/subscribe" style={{ background: '#d97706', color: 'white', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', display: 'inline-block', border: '2px solid rgba(255,255,255,0.3)' }}>
              Get Access →
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

function TestCard({ test, locked }: { test: typeof TESTS[0], locked: boolean }) {
  const comingSoon = test.topics[0] === 'Coming soon'
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: locked || comingSoon ? '1px solid #e2e8f0' : '1px solid #fde68a', opacity: comingSoon ? 0.6 : locked ? 0.85 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', border: '1px solid #fde68a' }}>3 Passages · 40 Questions</span>
          {test.free && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>FREE</span>}
          {comingSoon && <span style={{ background: '#f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>COMING SOON</span>}
        </div>
      </div>
      <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 10px' }}>{test.title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
        {test.topics.map((topic, i) => (
          <p key={i} style={{ fontSize: '13px', color: comingSoon ? '#94a3b8' : '#475569', margin: 0 }}>
            {!comingSoon && <span style={{ color: '#d97706', fontWeight: 'bold' }}>Passage {i + 1}: </span>}{topic}
          </p>
        ))}
      </div>
      {comingSoon ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#f1f5f9', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
          🕐 Coming Soon
        </div>
      ) : locked ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#f1f5f9', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
          🔒 Subscription Required
        </div>
      ) : (
        <Link href={`/ielts/reading/${test.id}`} style={{ display: 'block', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', textAlign: 'center', padding: '11px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>
          Start Test →
        </Link>
      )}
    </div>
  )
}
