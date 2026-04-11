'use client'
import Link from 'next/link'

export default function CategoryRaceGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-5-6" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 5-6 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🏁</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Category Race</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Teams race to name as many words in a category as possible before time runs out.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⏱ 10-15 min</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⚡ Medium energy</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>👥 Teams of 3-4</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>📚 Vocabulary</h3>
            {['animals', 'food', 'colours', 'clothes', 'classroom objects', 'transport'].map(v => <div key={v} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {v}</div>)}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>🛠 Materials</h3>
            {['Timer or stopwatch', 'Whiteboard to keep score', 'Optional: category cards'].map(m => <div key={m} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {m}</div>)}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', fontSize: '20px' }}>📋 How to Play</h2>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            {[
              'Divide the class into teams of 3-4.',
              'Teacher announces a category — "Animals!"',
              'Set a timer for 60 seconds.',
              'Teams take turns — one child from each team shouts a word from that category.',
              'Each correct unique word earns the team 1 point.',
              'No repeating words already said by any team.',
              'When the timer ends the team with the most points wins the round.',
              'Play 5 rounds with different categories.',
            ].map((rule, i) => <li key={i} style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>{rule}</li>)}
          </ol>
        </div>
        <div style={{ background: '#fdf4ff', borderRadius: '12px', padding: '28px', marginBottom: '20px', border: '1px solid rgba(124,58,237,0.2)' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>💡 Teacher Tips</h2>
          {[
            'Use categories from the current lesson to reinforce new vocabulary.',
            'Write words on the board as they are said so nobody repeats them.',
            'This game naturally differentiates — stronger students say more obscure words.',
            'Great as a review game at the end of a vocabulary unit.',
          ].map((tip, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><span style={{ color: '#7C3AED', fontWeight: 'bold', flexShrink: 0 }}>✓</span><span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{tip}</span></div>)}
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>🔄 Variations</h2>
          {[
            'Play individually — each child keeps their own score.',
            'Restrict to words starting with a specific letter.',
            'Teams must use the word in a sentence to earn double points.',
          ].map((v, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><span style={{ color: '#7C3AED', fontWeight: 'bold', flexShrink: 0 }}>→</span><span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{v}</span></div>)}
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
          <p style={{ color: 'white', marginBottom: '16px', fontSize: '15px' }}>Want full 50-minute lesson plans for Ages 5-6?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/esl-resources/ages-5-6" style={{ background: '#7C3AED', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Browse Lesson Plans</Link>
            <Link href="/esl-games/ages-5-6" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>More Ages 5-6 Games</Link>
          </div>
        </div>
      </div>
    </main>
  )
}