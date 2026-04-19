'use client'
import Link from 'next/link'
import { useState } from 'react'

const topics = ['Animals', 'Food', 'Science', 'Geography', 'History', 'Thailand', 'English', 'Sport']
const difficulties = [
  { value: 'easy', label: '🟢 Easy', desc: 'Simple statements perfect for younger students' },
  { value: 'medium', label: '🟡 Medium', desc: 'Requires a bit more knowledge and thought' },
  { value: 'hard', label: '🔴 Hard', desc: 'Challenging facts to stretch stronger students' },
]

export default function TrueOrFalseModePage() {
  const [selectedTopic, setSelectedTopic] = useState('Animals')
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '52px 24px', color: 'white', textAlign: 'center' }}>
        <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Back to Live Games</Link>
        <div style={{ marginTop: '20px', fontSize: '56px', marginBottom: '12px' }}>✅</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>True or False Buzzer</h1>
        <p style={{ opacity: 0.85, fontSize: '16px', margin: 0 }}>Is the statement true or false? Buzz in before your classmates!</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>1. Pick a Topic</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {topics.map(t => (
              <button key={t} onClick={() => setSelectedTopic(t)} style={{
                padding: '8px 18px', borderRadius: '24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: '2px solid',
                borderColor: selectedTopic === t ? '#0891b2' : '#e2e8f0',
                background: selectedTopic === t ? '#0891b2' : 'white',
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
                borderColor: selectedDifficulty === d.value ? '#0891b2' : '#e2e8f0',
                background: selectedDifficulty === d.value ? '#ecfeff' : 'white',
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
          <Link href={`/esl-games/live/true-or-false/solo?topic=${selectedTopic}&difficulty=${selectedDifficulty}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0891b2')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#ecfeff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Solo Play</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Answer 10 true or false questions on your own against the clock!</p>
              </div>
              <div style={{ background: '#0891b2', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Play Solo →</div>
            </div>
          </Link>

          <Link href={`/esl-games/live/true-or-false/host?topic=${selectedTopic}&difficulty=${selectedDifficulty}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#7C3AED')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#f5f3ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📱</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Online Multiplayer</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Create a room and buzz in faster than your classmates!</p>
              </div>
              <div style={{ background: '#7C3AED', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Host Game →</div>
            </div>
          </Link>

          <Link href={`/esl-games/live/true-or-false/tv?topic=${selectedTopic}&difficulty=${selectedDifficulty}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E85D26')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#fff7ed', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📺</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>TV Classroom Mode</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Show on the big screen — students shout true or false as a class!</p>
              </div>
              <div style={{ background: '#E85D26', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>TV Mode →</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}