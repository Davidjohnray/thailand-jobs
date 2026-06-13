'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BAND_DESCRIPTORS = [
  { band: '9', label: 'Expert', color: '#7c3aed' },
  { band: '8', label: 'Very Good', color: '#2563eb' },
  { band: '7', label: 'Good', color: '#0891b2' },
  { band: '6', label: 'Competent', color: '#059669' },
  { band: '5', label: 'Modest', color: '#d97706' },
  { band: '4', label: 'Limited', color: '#dc2626' },
]

const SKILLS = [
  {
    title: 'Speaking',
    icon: '🎤',
    href: '/ielts/speaking',
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    description: 'Practice all 3 parts of the IELTS Speaking test with AI feedback on your answers.',
    parts: ['Part 1 — Personal questions', 'Part 2 — Cue card topics', 'Part 3 — Discussion'],
    freeLabel: '3 FREE lessons',
    moreLabel: '+ more with subscription',
  },
  {
    title: 'Writing',
    icon: '✍️',
    href: '/ielts/writing',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #064e3b, #059669)',
    description: 'Submit Task 1 and Task 2 responses and get detailed AI feedback on all 4 band score criteria.',
    parts: ['Task Achievement', 'Coherence & Cohesion', 'Lexical Resource', 'Grammatical Range & Accuracy'],
    freeLabel: '3 FREE lessons',
    moreLabel: '+ more with subscription',
  },
  {
    title: 'Reading',
    icon: '📖',
    href: '/ielts/reading',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #78350f, #d97706)',
    description: 'Master every IELTS reading task type with guided lessons and AI explanations.',
    parts: ['True / False / Not Given', 'Matching Headings', 'Multiple Choice', 'Summary Completion'],
    freeLabel: '1 FREE full mock test',
    moreLabel: '+ more mock tests with subscription',
  },
]

const FAQS = [
  {
    q: 'How many free lessons do I get?',
    a: '3 free lessons each for Speaking and Writing, plus 1 free full Reading mock test (3 passages, 40 questions). All free content includes full AI feedback.',
  },
  {
    q: 'What do I get with a subscription?',
    a: 'Full access to all lessons across all skill areas, unlimited AI feedback on your writing and speaking, plus teacher mode on every lesson.',
  },
  {
    q: 'How does the access code work?',
    a: 'After subscribing you receive a unique code. Enter your email and code on the subscribe page to activate 30 days of full access. Codes are personal — they can only be used by one person.',
  },
  {
    q: 'Can I use this with my students?',
    a: 'Yes — each student needs their own code. The lessons also include a teacher mode with suggested timings and discussion extensions.',
  },
  {
    q: 'How long does a subscription last?',
    a: '30 days from the date you activate your code.',
  },
]

export default function IELTSHubPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    if (!email) { setCheckingAccess(false); return }
    supabase
      .from('ielts_access')
      .select('expires_at, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .single()
      .then(({ data }) => {
        if (data && new Date(data.expires_at) > new Date()) setHasAccess(true)
        setCheckingAccess(false)
      })
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%)',
        padding: '80px 24px 64px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '6px 18px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            IELTS Practice — Jobs in Thailand
          </div>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '800',
            margin: '0 0 20px',
            lineHeight: 1.2,
          }}>
            IELTS Practice That Actually<br />
            <span style={{ color: '#60a5fa' }}>Helps You Improve</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '17px',
            lineHeight: 1.7,
            margin: '0 0 36px',
          }}>
            Real task-based lessons for Speaking, Writing, and Reading — with AI feedback on every answer.
            Study alone or use with your teacher. Free lessons in every skill area, then just 149 THB per month.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/ielts/speaking" style={{
              background: '#2563eb',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block',
            }}>
              Start Free Lessons →
            </Link>
            {!checkingAccess && !hasAccess && (
              <Link href="/ielts/subscribe" style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '16px',
                textDecoration: 'none',
                display: 'inline-block',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>
                Subscribe — 149 THB/month
              </Link>
            )}
            {!checkingAccess && hasAccess && (
              <>
                <span style={{
                  background: 'rgba(16,185,129,0.2)',
                  color: '#6ee7b7',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  border: '1px solid rgba(16,185,129,0.3)',
                }}>
                  ✅ Full Access Active
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem('ielts_email')
                    localStorage.removeItem('ielts_expires')
                    setHasAccess(false)
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                    padding: '14px 24px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Band Score Bar */}
      <section style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            IELTS Band Scores
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {BAND_DESCRIPTORS.map(b => (
              <div key={b.band} style={{
                background: b.color,
                color: 'white',
                borderRadius: '8px',
                padding: '8px 16px',
                textAlign: 'center',
                minWidth: '80px',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{b.band}</div>
                <div style={{ fontSize: '11px', opacity: 0.85 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Cards */}
      <section style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
          Choose a Skill to Practice
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '40px', fontSize: '15px' }}>
          Free lessons in every skill area — no account needed to start
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {SKILLS.map(skill => (
            <div key={skill.title} style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s',
            }}>
              <div style={{ background: skill.gradient, padding: '28px 24px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{skill.icon}</div>
                <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>
                  IELTS {skill.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                  {skill.description}
                </p>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                  {skill.parts.map(part => (
                    <li key={part} style={{
                      fontSize: '13px',
                      color: '#475569',
                      padding: '4px 0',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{ color: skill.color, fontWeight: 'bold' }}>✓</span>
                      {part}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{
                    background: '#f0fdf4',
                    color: '#16a34a',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid #bbf7d0',
                  }}>
                    {skill.freeLabel}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{skill.moreLabel}</span>
                </div>
                <Link href={skill.href} style={{
                  display: 'block',
                  background: skill.gradient,
                  color: 'white',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}>
                  Start {skill.title} Lessons →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Different */}
      <section style={{ background: '#1e3a5f', padding: '60px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', marginBottom: '12px' }}>
            Better Than Typical IELTS Practice
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', fontSize: '15px' }}>
            Most sites just give you past papers and answer keys. We go further.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🤖', title: 'AI Feedback', desc: 'Get detailed feedback on every answer — not just right or wrong, but how to improve.' },
              { icon: '📚', title: 'Task-Based Lessons', desc: 'Each lesson focuses on one skill or task type so you know exactly what to work on.' },
              { icon: '👨‍🏫', title: 'Teacher Mode', desc: 'Every lesson includes timing guides and discussion ideas for classroom use.' },
              { icon: '🇹🇭', title: 'Built for Thailand', desc: 'Topics and examples relevant to life and work in Thailand and Southeast Asia.' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '24px 20px',
                textAlign: 'left',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '60px 24px', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
            Simple Pricing
          </h2>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
            Start free. Subscribe when you're ready.
          </p>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
            borderRadius: '20px',
            padding: '40px 36px',
            color: 'white',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '4px' }}>
              149 <span style={{ fontSize: '20px', fontWeight: '400', opacity: 0.7 }}>THB</span>
            </div>
            <div style={{ opacity: 0.7, marginBottom: '24px', fontSize: '14px' }}>per month · 30 days access</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', textAlign: 'left' }}>
              {[
                'All Speaking, Writing & Reading lessons',
                'Unlimited AI feedback on every answer',
                'Teacher mode on all lessons',
                'One code, one person',
                'Activate anytime — 30 days from first use',
              ].map(item => (
                <li key={item} style={{ padding: '7px 0', fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#60a5fa', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/ielts/subscribe" style={{
              display: 'block',
              background: '#2563eb',
              color: 'white',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '16px',
              textDecoration: 'none',
            }}>
              Get Access Code →
            </Link>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Already have a code?{' '}
            <Link href="/ielts/subscribe" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
              Activate it here
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '660px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '32px' }}>
            Frequently Asked Questions
          </h2>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '10px',
              marginBottom: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                }}
              >
                {faq.q}
                <span style={{ color: '#2563eb', fontSize: '20px', flexShrink: 0 }}>
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <div style={{
                  padding: '0 20px 18px',
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: 1.7,
                  borderTop: '1px solid #f1f5f9',
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
          Ready to improve your IELTS score?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px', fontSize: '15px' }}>
          Start with free lessons — no signup required.
        </p>
        <Link href="/ielts/speaking" style={{
          background: '#2563eb',
          color: 'white',
          padding: '14px 36px',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '16px',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          Start Free Now →
        </Link>
      </section>

    </main>
  )
}
