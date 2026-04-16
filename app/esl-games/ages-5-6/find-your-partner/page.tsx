'use client'
import Link from 'next/link'

export default function FindYourPartnerGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-5-6" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 5–6 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🤝</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Find Your Partner</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Each child gets a word card — they must find the classmate holding the matching picture card.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['⏱ 10-15 min', '⚡ Medium energy', '👥 Whole class'].map((t, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.25)', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📋 What You Need</h2>
          <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>A set of matching pairs — one card with the written word and one card with the picture for each vocabulary item. You need one card per child so prepare enough pairs for your class size.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🎮 How to Play</h2>
          {[
            'Shuffle the word and picture cards together into one pile.',
            'Hand one card face down to each child — no peeking until you say go.',
            'On your signal children stand up, show their card and move around the room.',
            'They must find the classmate whose card matches theirs — word matches picture.',
            'When they find their partner they sit down together.',
            'Once all pairs are seated, each pair stands up and says their word aloud for the class.',
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
            'Remind children to walk — the excitement can make this very hectic very quickly.',
            'For weaker readers pair the word card with a child who can read it confidently.',
            'Time the activity and challenge the class to beat their record each round.',
            'Play two or three rounds swapping cards so children practise different vocabulary.',
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
            'Definition match — one card has the word, the other has a simple definition.',
            'Translation match — one card in English, one card in Thai for bilingual reinforcement.',
            'Sentence match — one card has the first half of a sentence, partner has the second half.',
            'Category sort — after finding partners, groups sort themselves into categories like food, animals, colours.',
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