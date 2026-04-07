'use client'
import Link from 'next/link'

export default function KahootStyleQuizGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-7-10" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 7-10 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>📱</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Kahoot-Style Quiz</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Use coloured cards A/B/C/D to create an interactive quiz without technology.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⏱ 15-20 min</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⚡ Low-Medium energy</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>👥 Whole class or teams</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>📚 Vocabulary</h3>
            {['any lesson vocabulary or grammar', 'comprehension questions', 'spelling'].map(v => (
              <div key={v} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {v}</div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>🛠 Materials</h3>
            {['Question list or slides', 'Coloured cards labelled A, B, C, D (one set per student)'].map(m => (
              <div key={m} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {m}</div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', fontSize: '20px' }}>📋 How to Play</h2>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Give each child 4 small cards labelled A, B, C, D.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Teacher shows or reads a question with 4 possible answers.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Children hold up the card matching their answer — all at the same time.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Teacher reveals the correct answer.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Children with correct answers earn a point.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>Keep a running score — highest score at the end wins.</li>
            <li style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>For team play, teams discuss quietly before showing their card.</li>
          </ol>
        </div>

        <div style={{ background: '#e0f7fa', borderRadius: '12px', padding: '28px', marginBottom: '20px', border: '1px solid rgba(8,145,178,0.2)' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>💡 Teacher Tips</h2>
          {[
            'Use this game to review before a test — it is quick and covers lots of content.',
            'If you have access to technology, Kahoot.com is the digital version.',
            'Prepare 10-15 questions in advance for a full activity.',
            'Award bonus points for the fastest correct answer.',
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
            'True/False only — thumbs up or thumbs down.',
            'Open answer — children write on mini whiteboards or paper.',
            'Team points — teams discuss and nominate a spokesperson.',
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