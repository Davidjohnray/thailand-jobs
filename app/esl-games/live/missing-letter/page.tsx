'use client'
import Link from 'next/link'
import { useState } from 'react'

const topics = ['Animals', 'Food', 'School', 'Nature', 'Sports', 'Travel', 'Technology', 'Countries']
const difficulties = [
  { value: 'easy', label: '🟢 Easy', desc: 'Short words with one missing letter' },
  { value: 'medium', label: '🟡 Medium', desc: 'Longer words with one missing letter' },
  { value: 'hard', label: '🔴 Hard', desc: 'Longer words with two missing letters' },
]

export default function MissingLetterModePage() {
  const [selectedTopic, setSelectedTopic] = useState('Animals')
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '52px 24px', color: 'white', textAlign: 'center' }}>
        <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Back to Live Games</Link>
        <div style={{ marginTop: '20px', fontSize: '56px', marginBottom: '12px' }}>🔤</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Missing Letter</h1>
        <p style={{ opacity: 0.85, fontSize: '16px', margin: 0 }}>Find the missing letter before the timer runs out!</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>1. Pick a Topic</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {topics.map(t => (
              <button key={t} onClick={() => setSelectedTopic(t)} style={{
                padding: '8px 18px', borderRadius: '24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: '2px solid',
                borderColor: selectedTopic === t ? '#1e3a5f' : '#e2e8f0',
                background: selectedTopic === t ? '#1e3a5f' : 'white',
                color: selectedTopic === t ? 'white' : '#444',
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>2. Pick a Difficulty</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {difficulties.map(d => (
              <button key={d.value} onClick={() => setSelectedDifficulty(d.value)} style={{
                flex: 1, minWidth: '180px', padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', border: '2px solid', textAlign: 'left',
                borderColor: selectedDifficulty === d.value ? '#1e3a5f' : '#e2e8f0',
                background: selectedDifficulty === d.value ? '#f0f4ff' : 'white',
                color: '#1a1a2e',
              }}>
                <div style={{ marginBottom: '4px' }}>{d.label}</div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>3. Choose Your Mode</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link href={`/esl-games/live/missing-letter/solo?topic=${selectedTopic}&difficulty=${selectedDifficulty}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#1e3a5f')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#f0f4ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Solo Play</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Pick the missing letters on your own — beat the clock!</p>
              </div>
              <div style={{ background: '#1e3a5f', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Play Solo →</div>
            </div>
          </Link>

          <Link href={`/esl-games/live/missing-letter/host?topic=${selectedTopic}&difficulty=${selectedDifficulty}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0891b2')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#ecfeff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📱</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Online Multiplayer</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Create a room and compete with your classmates!</p>
              </div>
              <div style={{ background: '#0891b2', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Host Game →</div>
            </div>
          </Link>

          <Link href={`/esl-games/live/missing-letter/tv?topic=${selectedTopic}&difficulty=${selectedDifficulty}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E85D26')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#fff7ed', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📺</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>TV Classroom Mode</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Show on the big screen — students shout the missing letter!</p>
              </div>
              <div style={{ background: '#E85D26', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>TV Mode →</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}