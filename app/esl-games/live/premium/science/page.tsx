// ============================================================
// FILE 1: app/esl-games/live/premium/science/page.tsx
// ============================================================
'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'
const ageGroups = ['P1-P2', 'P3-P4', 'P5-P6', 'M1-M3']
const ageLabels: Record<string, string> = { 'P1-P2': 'Ages 6–7', 'P3-P4': 'Ages 8–9', 'P5-P6': 'Ages 10–11', 'M1-M3': 'Ages 12–14' }

export default function ScienceQuizPage() {
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [selectedAge, setSelectedAge] = useState('P1-P2')

  useEffect(() => {
    const pwd = localStorage.getItem(PASSWORD_KEY)
    const session = localStorage.getItem(SESSION_KEY)
    if (pwd && session) setAuthed(true)
    setAuthChecking(false)
  }, [])

  if (authChecking) return <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#888' }}>Loading...</p></main>

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Premium Game</h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Purchase access to unlock all premium games.</p>
        <Link href="/esl-games/live/premium" style={{ background: '#16a34a', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', display: 'inline-block' }}>🔓 Get Premium Access</Link>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', padding: '52px 24px', color: 'white', textAlign: 'center' }}>
        <Link href="/esl-games/live/premium" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Premium Games</Link>
        <div style={{ marginTop: '20px', fontSize: '56px', marginBottom: '12px' }}>🔬</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Science Quiz</h1>
        <p style={{ opacity: 0.85, fontSize: '16px', margin: 0 }}>Biology, physics, chemistry & earth science — P1 to M3</p>
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginTop: '12px' }}>⭐ PREMIUM</div>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>1. Pick an Age Group</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {ageGroups.map(ag => (
              <button key={ag} onClick={() => setSelectedAge(ag)} style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: '2px solid', borderColor: selectedAge === ag ? '#16a34a' : '#e2e8f0', background: selectedAge === ag ? '#f0fdf4' : 'white', color: selectedAge === ag ? '#16a34a' : '#444', transition: 'all 0.15s', textAlign: 'center' as const }}>
                <div style={{ fontWeight: 'bold' }}>{ag}</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>{ageLabels[ag]}</div>
              </button>
            ))}
          </div>
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>2. Choose Your Mode</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { href: `/esl-games/live/premium/science/solo?ageGroup=${selectedAge}`, icon: '👤', title: 'Solo Play', desc: 'Play on your own — 20 questions, 15 seconds each.', color: '#16a34a', bg: '#f0fdf4', btnBg: '#16a34a', label: 'Play Solo →' },
            { href: `/esl-games/live/premium/science/host?ageGroup=${selectedAge}`, icon: '📱', title: 'Online Multiplayer', desc: 'Create a room. Students join on their phones at jobsinthailand.net/play', color: '#0891b2', bg: '#ecfeff', btnBg: '#0891b2', label: 'Host Game →' },
            { href: `/esl-games/live/premium/science/tv?ageGroup=${selectedAge}`, icon: '📺', title: 'TV Classroom Mode', desc: 'Show on a smart TV or projector. Up to 4 teams — no phones needed.', color: '#E85D26', bg: '#fff7ed', btnBg: '#E85D26', label: 'TV Mode →' },
          ].map(m => (
            <Link key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = m.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
                <div style={{ width: '56px', height: '56px', background: m.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>{m.title}</h3>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{m.desc}</p>
                </div>
                <div style={{ background: m.btnBg, color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' as const }}>{m.label}</div>
              </div>
            </Link>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '24px' }}>20 questions • 15 seconds per question • 4 answer choices</p>
      </div>
    </main>
  )
}
