'use client'
import Link from 'next/link'

export default function ParkBenchGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-7-10" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 7–10 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🪑</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Park Bench</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Two students sit on a bench — one plays a character trying to annoy the other into leaving using only English.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['⏱ 20-25 min', '⚡ Low-Medium energy', '👥 Pairs'].map((t, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.25)', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📋 What You Need</h2>
          <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>Two chairs placed side by side at the front of the room to act as the park bench. A set of character cards — one card describes who the annoying character is, for example: a very talkative stranger, someone who thinks they know you, an overly enthusiastic salesperson.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🎮 How to Play</h2>
          {[
            'One child sits on the bench as the "normal person" just minding their own business.',
            'A second child draws a character card and sits beside them — they now play that character.',
            'The character\'s goal is to make the first child want to leave using conversation only — no touching or shouting.',
            'The sitting child must respond in English and try to stay as long as possible.',
            'The class watches and scores — did the character succeed? How long did it take?',
            'Swap pairs and repeat with different character cards so everyone gets a turn.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'flex-start' }}>
              <span style={{ background: '#0891b2', color: 'white', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>💡 Teacher Tips</h2>
          {[
            'Model the game yourself first — sit on the bench and have a confident student play the character.',
            'Keep character cards age-appropriate — avoid anything that could lead to bullying behaviour.',
            'Encourage the watching class to suggest phrases the character could use if they get stuck.',
            'This game works brilliantly as a warm-up for a lesson on polite responses and social English.',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#0891b2', fontWeight: 'bold', flexShrink: 0 }}>→</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🔄 Variations</h2>
          {[
            'Reverse it — the sitting person tries to make the annoying character want to leave instead.',
            'Class vote — after each performance the class votes on whether the character succeeded.',
            'Scripted round — pairs prepare their dialogue for five minutes before performing it.',
            'Famous character — the annoying person must act as a famous fictional character the class will recognise.',
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#0891b2', fontWeight: 'bold', flexShrink: 0 }}>→</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
          <p style={{ color: 'white', marginBottom: '16px', fontSize: '15px' }}>Want full 50-minute lesson plans for Ages 7–10?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/esl-resources/ages-7-10" style={{ background: '#0891b2', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Browse Lesson Plans</Link>
            <Link href="/esl-games/ages-7-10" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>More Ages 7–10 Games</Link>
          </div>
        </div>

      </div>
    </main>
  )
}