
'use client'
import Link from 'next/link'
import { useLearnThaiGate } from '@/hooks/useLearnThaiGate'

const UNITS = [
  { unit: 1, title: 'Talking About Yourself', desc: 'Occupations, how long you\'ve been in Thailand, present continuous, survival phrases', lessons: 3, color: '#0ea5e9', ready: true },
  { unit: 2, title: 'Food & Ordering', desc: 'Restaurant vocabulary, ordering food, asking about dishes, Thai food culture', lessons: 3, color: '#22c55e', ready: false },
  { unit: 3, title: 'Shopping & Bargaining', desc: 'Market vocabulary, prices, bargaining phrases, colours and sizes', lessons: 3, color: '#f59e0b', ready: false },
  { unit: 4, title: 'Getting Around', desc: 'Transport, directions, asking for help, tuk-tuks, Grab, buses', lessons: 3, color: '#ef4444', ready: false },
  { unit: 5, title: 'Health & Body', desc: 'Body parts, symptoms, at the doctor, pharmacy vocabulary', lessons: 3, color: '#8b5cf6', ready: false },
  { unit: 6, title: 'Work & Daily Routine', desc: 'School life, teaching vocabulary, daily schedules, telling the time in context', lessons: 3, color: '#f97316', ready: false },
  { unit: 7, title: 'Making Plans', desc: 'Future tense, making arrangements, days and dates, invitations', lessons: 3, color: '#06b6d4', ready: false },
  { unit: 8, title: 'Feelings & Social Life', desc: 'Emotions, social situations, Thai greetings culture, festivals', lessons: 3, color: '#ec4899', ready: false },
]

export default function A2Overview() {
  useLearnThaiGate()

  return (
    <main style={{ background: '#0a0f1e', minHeight: '100vh', color: 'white', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link href="/learn-thai" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>← Learn Thai</Link>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '900', margin: '4px 0 0' }}>A2 — Elementary Thai</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: 0 }}>8 units · 24 lessons · Real conversations</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 20px', textAlign: 'center' }}>
          <div style={{ color: 'white', fontWeight: '900', fontSize: '20px' }}>฿199/mo</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Full access</div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ background: 'rgba(14,165,233,0.1)', borderRadius: '16px', padding: '20px 24px', marginBottom: '28px', border: '1px solid rgba(14,165,233,0.3)' }}>
          <div style={{ color: '#38bdf8', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>🎯 A2 Level — What you'll achieve</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
            At A2 you move from individual words to real conversations. You'll be able to talk about yourself, order food, shop at markets, get around by transport, and handle everyday social situations — all in Thai.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {UNITS.map((unit) => (
            <div key={unit.unit} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px 24px', border: `1px solid ${unit.ready ? unit.color + '40' : 'rgba(255,255,255,0.08)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ background: unit.ready ? unit.color : 'rgba(255,255,255,0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', color: 'white', flexShrink: 0 }}>
                  {unit.unit}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '17px', marginBottom: '4px' }}>Unit {unit.unit}: {unit.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{unit.desc}</div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {unit.ready ? (
                    <Link href={`/learn-thai/a2/unit-${unit.unit}/lesson-1`}
                      style={{ background: unit.color, color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '14px', display: 'block' }}>
                      Start →
                    </Link>
                  ) : (
                    <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700' }}>
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>← Back to A1</Link>
        </div>
      </div>
    </main>
  )
}
