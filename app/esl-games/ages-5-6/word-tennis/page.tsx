'use client'
import Link from 'next/link'

export default function WordTennisGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-5-6" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 5-6 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎾</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Word Tennis</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Partners volley vocabulary words back and forth — no repeats allowed.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⏱ 5-10 min</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⚡ Low energy</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>👥 Pairs</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>📚 Vocabulary</h3>
            {['any vocabulary category', 'animals', 'food', 'colours', 'numbers', 'classroom objects'].map(v => <div key={v} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {v}</div>)}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>🛠 Materials</h3>
            {['No materials needed', 'Timer optional'].map(m => <div key={m} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {m}</div>)}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', fontSize: '20px' }}>📋 How to Play</h2>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            {[
              'Children work in pairs sitting facing each other.',
              'Teacher announces a category — "Animals!"',
              'Child A says one animal — "Lion!"',
              'Child B immediately responds with a different animal — "Tiger!"',
              'Child A responds — "Elephant!"',
              'Continue rallying back and forth — no repeating words.',
              'The child who cannot think of a word or repeats one loses the rally.',
              'Play best of 5 rallies then swap partners.',
            ].map((rule, i) => <li key={i} style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>{rule}</li>)}
          </ol>
        </div>
        <div style={{ background: '#fdf4ff', borderRadius: '12px', padding: '28px', marginBottom: '20px', border: '1px solid rgba(124,58,237,0.2)' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>💡 Teacher Tips</h2>
          {[
            'This is the fastest vocabulary practice game available — use it regularly.',
            'Set a 3 second time limit per response to keep the pace fast.',
            'Pairs can manage themselves — teacher circulates and listens.',
            'Use lesson vocabulary categories for maximum learning value.',
          ].map((tip, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><span style={{ color: '#7C3AED', fontWeight: 'bold', flexShrink: 0 }}>✓</span><span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{tip}</span></div>)}
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>🔄 Variations</h2>
          {[
            'Whole class tennis — two teams volley instead of pairs.',
            'Alphabet tennis — each word must start with the next letter of the alphabet.',
            'Sentence tennis — each player says a full sentence using the category word.',
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