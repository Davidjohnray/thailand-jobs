'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const MODES = [
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#6366f1' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#f59e0b' },
]

export default function AnimalsPage() {
  const router = useRouter()
  const [mode, setMode] = useState('')

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fef3c7 0%, #dbeafe 50%, #fce7f3 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'system-ui, sans-serif',
    }}>

      {/* Floating animals decoration */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {['🐶','🐱','🦁','🐘','🦒','🐬','🦋','🐸','🐧','🐯'].map((e, i) => (
          <div key={i} style={{
            position: 'absolute',
            fontSize: `${24 + (i % 3) * 12}px`,
            left: `${(i * 11) % 95}%`,
            top: `${(i * 17) % 85}%`,
            opacity: 0.12,
            animation: `float${i % 3} ${4 + i % 3}s ease-in-out infinite`,
          }}>{e}</div>
        ))}
      </div>

      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      `}</style>

      {/* Card */}
      <div style={{
        background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '480px', width: '100%',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', position: 'relative', zIndex: 1,
        border: '3px solid #fde68a',
      }}>

        <div style={{ fontSize: '80px', marginBottom: '8px', animation: 'bounce 2s ease-in-out infinite' }}>🐾</div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b', margin: '0 0 6px', letterSpacing: '-1px' }}>
          Animal Match!
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px' }}>
          Can you find the right animal? 🌟
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{
                padding: '18px 24px', borderRadius: '16px', border: '3px solid',
                borderColor: mode === m.id ? m.color : '#e5e7eb',
                background: mode === m.id ? m.color : 'white',
                color: mode === m.id ? 'white' : '#374151',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
                transition: 'all 0.2s', transform: mode === m.id ? 'scale(1.02)' : 'scale(1)',
              }}>
              <span style={{ fontSize: '32px' }}>{m.emoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '16px' }}>{m.label}</div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => mode && router.push(`/esl-games/live/animals/${mode}`)}
          disabled={!mode}
          style={{
            width: '100%', padding: '18px', borderRadius: '16px', border: 'none',
            background: mode ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : '#e5e7eb',
            color: mode ? 'white' : '#9ca3af', fontWeight: '900', fontSize: '20px',
            cursor: mode ? 'pointer' : 'not-allowed',
            boxShadow: mode ? '0 8px 24px rgba(245,158,11,0.4)' : 'none',
            transition: 'all 0.2s',
          }}>
          {mode ? '🎮 Let\'s Play!' : 'Choose a mode first!'}
        </button>

        <Link href="/esl-games/live" style={{ display: 'block', marginTop: '20px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Games
        </Link>
      </div>
    </main>
  )
}
