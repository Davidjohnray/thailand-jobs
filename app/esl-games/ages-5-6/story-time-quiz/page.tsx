'use client'
import Link from 'next/link'

export default function StoryTimeQuizGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-5-6" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 5–6 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>📖</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Story Time Quiz</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Teacher reads a short story then asks comprehension questions for points.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['⏱ 15-20 min', '⚡ Low energy', '👥 Whole class or teams'].map((t, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.25)', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📋 What You Need</h2>
          <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>A short picture book or printed story of 150–300 words using lesson vocabulary. Prepare 5–8 simple comprehension questions in advance. Optional: a small prize or sticker for the winning team.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🎮 How to Play</h2>
          {[
            'Tell children to listen very carefully because there will be questions after the story.',
            'Read the story clearly and at a pace children can follow — show pictures as you go.',
            'After finishing, close the book so children cannot refer back to it.',
            'Ask comprehension questions one at a time — what colour was the cat? where did she go?',
            'Children raise their hand to answer. Correct answers earn a point for their team.',
            'The team with the most points at the end wins.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'flex-start' }}>
              <span style={{ background: '#7C3AED', color: 'white', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>💡 Teacher Tips</h2>
          {[
            'Read the story twice — once for enjoyment and once telling children to listen for specific things.',
            'Use expression and voices for different characters to hold attention throughout.',
            'Mix easy and hard questions so every ability level has a chance to score a point.',
            'Write the target vocabulary on the board before reading so children recognise the words when they hear them.',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#7C3AED', fontWeight: 'bold', flexShrink: 0 }}>→</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🔄 Variations</h2>
          {[
            'True or false — read statements about the story and children stand or sit for true or false.',
            'Draw a scene — after the story children draw their favourite moment and label it.',
            'Retell it — pairs take turns retelling the story to each other in their own words.',
            'Continue the story — class adds one sentence each to create a new ending.',
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#7C3AED', fontWeight: 'bold', flexShrink: 0 }}>→</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
          <p style={{ color: 'white', marginBottom: '16px', fontSize: '15px' }}>Want full 50-minute lesson plans for Ages 5–6?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/esl-resources/ages-5-6" style={{ background: '#7C3AED', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Browse Lesson Plans</Link>
            <Link href="/esl-games/ages-5-6" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>More Ages 5–6 Games</Link>
          </div>
        </div>

      </div>
    </main>
  )
}