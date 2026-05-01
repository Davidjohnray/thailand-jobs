'use client'
import Link from 'next/link'
import { useState } from 'react'
import { topics, getCategoriesByTopic } from './questions'

export default function CategoryRaceModePage() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0])
  const [selectedCategory, setSelectedCategory] = useState(getCategoriesByTopic(topics[0])[0].category)

  const topicEmojis: Record<string, string> = {
    'Animals': '🐾',
    'Food & Drink': '🍎',
    'World & Geography': '🌍',
    'Colours & Descriptions': '🎨',
    'School & Classroom': '🏫',
    'Clothes & Body': '👗',
    'Home & Daily Life': '🏠',
    'Fun & Sports': '🎉',
  }

  const categories = getCategoriesByTopic(selectedTopic)

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic)
    setSelectedCategory(getCategoriesByTopic(topic)[0].category)
  }

  const query = `?topic=${encodeURIComponent(selectedTopic)}&category=${encodeURIComponent(selectedCategory)}`

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #065f46, #047857)', padding: '52px 24px', color: 'white', textAlign: 'center' }}>
        <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Back to Live Games</Link>
        <div style={{ marginTop: '20px', fontSize: '56px', marginBottom: '12px' }}>🎭</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Category Race</h1>
        <p style={{ opacity: 0.85, fontSize: '16px', margin: 0 }}>Race to name as many things as you can in 30 seconds!</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>1. Pick a Topic</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {topics.map(t => (
              <button key={t} onClick={() => handleTopicChange(t)} style={{
                padding: '8px 16px', borderRadius: '24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: '2px solid',
                borderColor: selectedTopic === t ? '#065f46' : '#e2e8f0',
                background: selectedTopic === t ? '#065f46' : 'white',
                color: selectedTopic === t ? 'white' : '#444',
                transition: 'all 0.15s',
              }}>{topicEmojis[t]} {t}</button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>2. Pick a Category</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c.category} onClick={() => setSelectedCategory(c.category)} style={{
                padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: '2px solid',
                borderColor: selectedCategory === c.category ? '#065f46' : '#e2e8f0',
                background: selectedCategory === c.category ? '#f0fdf4' : 'white',
                color: selectedCategory === c.category ? '#065f46' : '#444',
                transition: 'all 0.15s',
              }}>{c.category}</button>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>3. Choose Your Mode</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <Link href={`/esl-games/live/category-race/solo${query}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#7C3AED')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#f5f3ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Solo Play</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Type as many answers as you can in 30 seconds. Great for self-study and vocabulary practice.</p>
              </div>
              <div style={{ background: '#7C3AED', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Play Solo →</div>
            </div>
          </Link>

          <Link href={`/esl-games/live/category-race/host${query}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0891b2')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#ecfeff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📱</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Online Multiplayer</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Students type answers on their phones. Points awarded automatically for each correct unique answer.</p>
              </div>
              <div style={{ background: '#0891b2', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Host Game →</div>
            </div>
          </Link>

          <Link href={`/esl-games/live/category-race/tv${query}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E85D26')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#fff7ed', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📺</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>TV Classroom Mode</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Show on the big screen. Teams shout answers out loud — teacher clicks for each correct answer!</p>
              </div>
              <div style={{ background: '#E85D26', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>TV Mode →</div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  )
}