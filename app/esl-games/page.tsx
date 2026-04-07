'use client'
import Link from 'next/link'

export default function ESLGamesPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '64px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎮</div>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 14px', letterSpacing: '-1px' }}>Free ESL Games</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '560px', margin: '0 auto 10px' }}>Ready-to-play classroom games for ESL teachers in Thailand</p>
        <p style={{ fontSize: '14px', opacity: 0.7, maxWidth: '480px', margin: '0 auto' }}>No preparation needed. Full rules, tips, and variations included. Completely free.</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px', textAlign: 'center' }}>Choose an Age Group</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>Select the age group you teach to browse games</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '48px' }}>

          <Link href="/esl-games/under-5s" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(249,115,22,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🐣</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Under 5s</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 8px' }}>Ages 3-4 · Pre-K</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>Movement games, songs, and activities. No reading or writing required.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>5 games →</span>
            </div>
          </Link>

          <Link href="/esl-games/ages-5-6" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🌟</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 5-6</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 8px' }}>K1-K2</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>Flashcard games, speaking activities, and fun group challenges.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>5 games →</span>
            </div>
          </Link>

          <Link href="/esl-games/ages-7-10" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(8,145,178,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>📗</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 7-10</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 8px' }}>Primary School</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>Team games, spelling relays, and vocabulary challenges.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>6 games →</span>
            </div>
          </Link>

        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💡</div>
          <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px', fontSize: '18px' }}>Why Use Games in ESL?</h3>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 16px' }}>
            Games lower anxiety, increase participation, and make vocabulary stick. Every game on this site includes full rules, teacher tips, and variations so you can adapt them to your class instantly.
          </p>
          <Link href="/esl-resources" style={{ color: '#2D6BE4', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>
            Also browse our premium lesson plans →
          </Link>
        </div>
      </div>
    </main>
  )
}