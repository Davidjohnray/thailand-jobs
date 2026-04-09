'use client'
import Link from 'next/link'

export default function NoughtsAndCrossesGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-5-6" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 5-6 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>❌</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Noughts and Crosses</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Answer a vocabulary question correctly to place your mark on the grid.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⏱ 10-15 min</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⚡ Low energy</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>👥 2 teams</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>📚 Vocabulary</h3>
            {['any lesson vocabulary', 'spelling', 'definitions', 'questions and answers'].map(v => <div key={v} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {v}</div>)}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>🛠 Materials</h3>
            {['Whiteboard with a 3x3 grid drawn', 'Vocabulary question list'].map(m => <div key={m} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {m}</div>)}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', fontSize: '20px' }}>📋 How to Play</h2>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            {[
              'Draw a large 3x3 noughts and crosses grid on the board.',
              'Divide the class into two teams — Team X and Team O.',
              'Teams take turns. One child from the team comes to the front.',
              'Teacher asks a vocabulary question.',
              'If they answer correctly, they choose a square and mark it with X or O.',
              'If they answer incorrectly, they cannot place a mark and it is the other team\'s turn.',
              'First team to get three in a row wins the round.',
              'Play multiple rounds — keep a score.',
            ].map((rule, i) => <li key={i} style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>{rule}</li>)}
          </ol>
        </div>
        <div style={{ background: '#fdf4ff', borderRadius: '12px', padding: '28px', marginBottom: '20px', border: '1px solid rgba(124,58,237,0.2)' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>💡 Teacher Tips</h2>
          {[
            'Write a vocabulary word in each square — children must use it in a sentence to claim it.',
            'Let the whole team help the child who is answering for the first few rounds.',
            'This game creates great competitive energy without putting pressure on individuals.',
            'Play 3-4 rounds to keep the game moving — reset the grid after each win.',
          ].map((tip, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><span style={{ color: '#7C3AED', fontWeight: 'bold', flexShrink: 0 }}>✓</span><span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{tip}</span></div>)}
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>🔄 Variations</h2>
          {[
            'Place flashcards in each square — children must name or spell the word to claim it.',
            'Use a 4x4 grid for a longer, more strategic game.',
            'Play in pairs at their desks using paper grids.',
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