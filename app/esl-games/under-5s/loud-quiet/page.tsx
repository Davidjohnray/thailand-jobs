'use client'
import Link from 'next/link'

export default function LoudQuietGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/under-5s" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Under 5s Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🔊</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Loud and Quiet</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Children repeat vocabulary words loudly or quietly depending on teacher signal.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⏱ 5-10 min</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>⚡ Medium energy</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>👥 Whole class</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>📚 Vocabulary</h3>
            {['any lesson vocabulary', 'loud', 'quiet', 'whisper', 'shout'].map(v => <div key={v} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {v}</div>)}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', fontSize: '15px' }}>🛠 Materials</h3>
            {['Flashcards for vocabulary', 'Optional: loud and quiet signs'].map(m => <div key={m} style={{ color: '#555', fontSize: '13px', marginBottom: '4px' }}>• {m}</div>)}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px', fontSize: '20px' }}>📋 How to Play</h2>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            {[
              'Hold up a flashcard and say the word.',
              'Children repeat the word after you.',
              'Hold up a LOUD sign or raise your arms — children repeat the word in a big loud voice.',
              'Hold up a QUIET sign or put finger to lips — children whisper the word.',
              'Switch between loud and quiet rapidly to keep children alert.',
              'Show the card faster and faster — children must say it at the right volume.',
              'Let a child be the teacher and hold up the signs.',
            ].map((rule, i) => <li key={i} style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>{rule}</li>)}
          </ol>
        </div>
        <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '28px', marginBottom: '20px', border: '1px solid rgba(249,115,22,0.2)' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>💡 Teacher Tips</h2>
          {[
            'This is one of the best drilling games — children repeat words many times without getting bored.',
            'Exaggerate your own loud and quiet voices to make it more fun.',
            'Add a medium volume too — big voice, medium voice, tiny whisper.',
            'Use this game to drill any vocabulary that needs lots of repetition.',
          ].map((tip, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><span style={{ color: '#f97316', fontWeight: 'bold', flexShrink: 0 }}>✓</span><span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{tip}</span></div>)}
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', fontSize: '20px' }}>🔄 Variations</h2>
          {[
            'Fast and slow — say the word quickly or slowly instead of loudly or quietly.',
            'Happy and sad voice — practise emotion words at the same time.',
            'Robot voice and normal voice — children love using a robot voice.',
          ].map((v, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}><span style={{ color: '#f97316', fontWeight: 'bold', flexShrink: 0 }}>→</span><span style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{v}</span></div>)}
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
          <p style={{ color: 'white', marginBottom: '16px', fontSize: '15px' }}>Want full 50-minute lesson plans for Under 5s?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/esl-resources/under-5s" style={{ background: '#f97316', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Browse Lesson Plans</Link>
            <Link href="/esl-games/under-5s" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>More Under 5s Games</Link>
          </div>
        </div>
      </div>
    </main>
  )
}