'use client'
import Link from 'next/link'

export default function StoryDiceGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-7-10" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 7-10 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎲</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Story Dice</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Roll dice with pictures. Build a story together using vocabulary from the lesson.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⏱ 20-25 min</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⚡ Low energy</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>👥 Groups of 3-5</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>📚 Vocabulary</h3>
            {['narrative vocabulary', 'story connectors', 'lesson vocabulary', 'creative writing'].map(v => (
              <div key={v} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {v}</div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>🛠 Materials</h3>
            {["Story dice (Rory's Story Cubes or homemade)", 'Paper and pens'].map(m => (
              <div key={m} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {m}</div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', fontSize: '20px' }}>📋 How to Play</h2>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Each group has a set of 6-9 picture dice.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>One child rolls all the dice.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>The group must create a short story using ALL the pictures shown on the dice.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>The story must use vocabulary from the current lesson.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Groups write their story — minimum 6 sentences.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Each group reads their story to the class.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Class votes on the most creative story.</li>
          </ol>
        </div>

        <div style={{ background: '#e0f7fa', borderRadius: '12px', padding: '28px', marginBottom: '20px', border: '1px solid rgba(8,145,178,0.2)' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>💡 Teacher Tips</h2>
          {[
            'You can make simple dice using blank wooden cubes and stickers with pictures.',
            'Teach story connectors first — "First... Then... Next... After that... Finally..."',
            'Set a minimum sentence count to prevent one-line stories.',
            'This activity develops creativity and is excellent for writing practice.',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#0891b2', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
              <span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{tip}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>🔄 Variations</h2>
          {[
            'Each child adds one sentence — collaborative chain story.',
            'Roll one die only — build a story where that image appears in every sentence.',
            'Use vocabulary flashcards instead of dice — pick 6 cards and build a story.',
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#0891b2', fontWeight: 'bold', flexShrink: 0 }}>→</span>
              <span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
          <p style={{ color: 'white', marginBottom: '16px', fontSize: '15px' }}>Want full 50-minute lesson plans for Ages 7-10?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/esl-resources/ages-7-10" style={{ background: '#0891b2', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Browse Lesson Plans</Link>
            <Link href="/esl-games/ages-7-10" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>More Ages 7-10 Games</Link>
          </div>
        </div>

      </div>
    </main>
  )
}