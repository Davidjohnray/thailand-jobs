'use client'
import Link from 'next/link'

export default function TelephonePictionaryGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-7-10" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 7-10 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>📞</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Telephone Pictionary</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Students alternate between drawing and writing — the message transforms as it passes down the line.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⏱ 20-25 min</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⚡ Low energy</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>👥 Groups of 6-8</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>📚 Vocabulary</h3>
            {['any lesson vocabulary', 'descriptive phrases', 'action sentences', 'topic sentences'].map(v => <div key={v} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {v}</div>)}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>🛠 Materials</h3>
            {['Small booklets of paper — one per student (6-8 sheets each)', 'Pencils'].map(m => <div key={m} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {m}</div>)}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', fontSize: '20px' }}>📋 How to Play</h2>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            {[
              'Give each student a small booklet of 6-8 sheets of paper stapled together.',
              'Each student writes a sentence on the first page — "A cat is eating a pizza."',
              'Pass the booklet to the next student.',
              'That student folds back the sentence page so only the drawing page is visible and DRAWS the sentence.',
              'Pass again — next student folds back the drawing and WRITES what they see in the picture.',
              'Continue alternating between drawing and writing.',
              'At the end unfold all pages and reveal how the message changed.',
              'Read the originals and finals aloud — the funnier the better!',
            ].map((rule, i) => <li key={i} style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>{rule}</li>)}
          </ol>
        </div>
        <div style={{ background: '#e0f7fa', borderRadius: '12px', padding: '28px', marginBottom: '20px', border: '1px solid rgba(8,145,178,0.2)' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>💡 Teacher Tips</h2>
          {[
            'Set a time limit per page — 60-90 seconds — to keep things moving.',
            'Use lesson vocabulary in the starting sentences for maximum learning value.',
            'The reveal at the end is hilarious — children love seeing how messages change.',
            'This combines writing, reading and art in one highly engaging activity.',
          ].map((tip, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><span style={{ color: '#0891b2', fontWeight: 'bold', flexShrink: 0 }}>✓</span><span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{tip}</span></div>)}
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>🔄 Variations</h2>
          {[
            'Writing only — pass and rewrite what you think the previous person meant.',
            'Use vocabulary words as the starting point instead of sentences.',
            'Display the finished booklets on the wall as a class gallery.',
          ].map((v, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><span style={{ color: '#0891b2', fontWeight: 'bold', flexShrink: 0 }}>→</span><span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{v}</span></div>)}
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