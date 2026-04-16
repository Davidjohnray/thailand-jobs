'use client'
import Link from 'next/link'

export default function ConsequenceStoryGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/ages-7-10" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Ages 7–10 Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>📜</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Consequence Story</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Each student writes a sentence, folds the paper to hide it and passes it on — read the chaos at the end.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['⏱ 15-20 min', '⚡ Low energy', '👥 Groups of 6-8'].map((t, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.25)', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📋 What You Need</h2>
          <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>One long strip of paper per group — A4 paper cut lengthways works well. Each child needs a pen. Prepare a story structure template on the board to guide each writing stage.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🎮 How to Play</h2>
          {[
            'Write the story structure on the board — one prompt per round, for example: "A person\'s name", "was at a place", "they met someone", "they said something", "then something happened", "the end."',
            'Each child writes their answer to the first prompt on their strip of paper.',
            'They fold the paper to hide what they wrote and pass it to the next person.',
            'The next person writes the second prompt without reading what came before.',
            'Continue folding and passing until all prompts are complete.',
            'Unfold and read the stories aloud — the more absurd the better.',
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
            'Put the story structure prompts on the board clearly so children know exactly what to write at each stage.',
            'Require children to use at least one vocabulary word from the lesson in their sentence.',
            'Give a time limit per round — 60 seconds keeps the pace up and prevents overthinking.',
            'Have children read the finished stories aloud to the class — they are almost always hilarious.',
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
            'Illustration version — alternate between writing a sentence and drawing the previous sentence.',
            'Grammar focus — each prompt must use a specific tense or structure from the lesson.',
            'Class story — do one large version as a whole class, each child adding one sentence on the board.',
            'Themed round — set a genre like horror, adventure or fairy tale and see how children adapt their writing.',
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