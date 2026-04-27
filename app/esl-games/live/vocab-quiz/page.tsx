'use client'
import Link from 'next/link'
import { useState } from 'react'

const topics = ['Animals', 'Food', 'Colours', 'Numbers', 'Jobs', 'Body Parts', 'Transport', 'Weather']
const difficulties = [
  { label: 'Easy', emoji: '🟢', desc: 'Simple questions — great for younger students' },
  { label: 'Medium', emoji: '🟡', desc: 'Moderate challenge — suitable for most classes' },
  { label: 'Hard', emoji: '🔴', desc: 'Tough questions — for advanced students' },
]

export default function VocabQuizModePage() {
  const [selectedTopic, setSelectedTopic] = useState('Animals')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy')

  const query = `?topic=${selectedTopic}&difficulty=${selectedDifficulty}`

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '52px 24px', color: 'white', textAlign: 'center' }}>
        <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Back to Live Games</Link>
        <div style={{ marginTop: '20px', fontSize: '56px', marginBottom: '12px' }}>🧠</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Vocab Quiz Showdown</h1>
        <p style={{ opacity: 0.85, fontSize: '16px', margin: 0 }}>Choose your topic, difficulty and how you want to play</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        {/* TOPIC */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>1. Pick a Topic</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {topics.map(t => (
              <button key={t} onClick={() => setSelectedTopic(t)} style={{
                padding: '8px 18px', borderRadius: '24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: '2px solid',
                borderColor: selectedTopic === t ? '#1a1a2e' : '#e2e8f0',
                background: selectedTopic === t ? '#1a1a2e' : 'white',
                color: selectedTopic === t ? 'white' : '#444',
                transition: 'all 0.15s',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* DIFFICULTY */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>2. Pick a Difficulty</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {difficulties.map(d => (
              <button key={d.label} onClick={() => setSelectedDifficulty(d.label)} style={{
                padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: '2px solid',
                borderColor: selectedDifficulty === d.label ? '#1a1a2e' : '#e2e8f0',
                background: selectedDifficulty === d.label ? '#1a1a2e' : 'white',
                color: selectedDifficulty === d.label ? 'white' : '#444',
                transition: 'all 0.15s',
                textAlign: 'left' as const,
                flex: '1',
                minWidth: '160px',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{d.emoji}</div>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{d.label}</div>
                <div style={{ fontSize: '12px', opacity: 0.7, fontWeight: 'normal' }}>{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>3. Choose Your Mode</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <Link href={`/esl-games/live/vocab-quiz/solo${query}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#7C3AED')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#f5f3ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Solo Play</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Play on your own at your own pace. Answer 10 questions and get your score.</p>
              </div>
              <div style={{ background: '#7C3AED', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Play Solo →</div>
            </div>
          </Link>

          <Link href={`/esl-games/live/vocab-quiz/host${query}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0891b2')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#ecfeff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📱</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Online Multiplayer</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Create a room and share the code. Students join on their own phones from anywhere.</p>
              </div>
              <div style={{ background: '#0891b2', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Host Game →</div>
            </div>
          </Link>

          <Link href={`/esl-games/live/vocab-quiz/tv${query}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E85D26')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#fff7ed', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📺</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>TV Classroom Mode</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Show on a smart TV or projector. Students answer out loud — no phones needed at all.</p>
              </div>
              <div style={{ background: '#E85D26', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>TV Mode →</div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  )
}