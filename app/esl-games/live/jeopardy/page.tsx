'use client'
import Link from 'next/link'

export default function JeopardyModePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', padding: '52px 24px', color: 'white', textAlign: 'center' }}>
        <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Back to Live Games</Link>
        <div style={{ marginTop: '20px', fontSize: '56px', marginBottom: '12px' }}>🎯</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Jeopardy Quiz</h1>
        <p style={{ opacity: 0.85, fontSize: '16px', margin: '0 0 24px' }}>Pick a category and point value — higher points mean harder questions!</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['100 = Easy', '200 = Easy+', '300 = Medium', '400 = Hard', '500 = Expert'].map((l, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: '600' }}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>Choose Your Mode</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <Link href="/esl-games/live/jeopardy/solo" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#7C3AED')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#f5f3ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Solo Play</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Pick tiles from the board, answer questions and rack up as many points as you can!</p>
              </div>
              <div style={{ background: '#7C3AED', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Play Solo →</div>
            </div>
          </Link>

          <Link href="/esl-games/live/jeopardy/host" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0891b2')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#ecfeff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📱</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Online Multiplayer</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Teacher picks a tile — students buzz in on their phones to answer first and win the points!</p>
              </div>
              <div style={{ background: '#0891b2', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>Host Game →</div>
            </div>
          </Link>

          <Link href="/esl-games/live/jeopardy/tv" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E85D26')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ width: '56px', height: '56px', background: '#fff7ed', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📺</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>TV Classroom Mode</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Show the board on the big screen — students take turns picking tiles and shouting the answer!</p>
              </div>
              <div style={{ background: '#E85D26', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>TV Mode →</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}