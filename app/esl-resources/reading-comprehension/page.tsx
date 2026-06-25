import Link from 'next/link'

const LEVELS = [
  {
    code: 'a1',
    label: 'A1',
    title: 'Beginner',
    color: '#22c55e',
    bg: 'linear-gradient(135deg, #16a34a, #22c55e)',
    shadow: 'rgba(34,197,94,0.3)',
    emoji: '🌱',
    desc: 'Simple texts with basic vocabulary and short sentences. Ideal for students just starting their English journey.',
    who: 'Complete beginners · Young learners · New to English',
    features: ['Warm-up questions', 'Audio playback', 'Vocabulary + translation', 'Writing practice'],
    count: 5,
  },
  {
    code: 'a2',
    label: 'A2',
    title: 'Elementary',
    color: '#84cc16',
    bg: 'linear-gradient(135deg, #65a30d, #84cc16)',
    shadow: 'rgba(132,204,22,0.3)',
    emoji: '🌿',
    desc: 'Short passages on familiar topics with straightforward questions. Students can understand simple texts about everyday life.',
    who: 'Elementary students · Ages 10–12 · Basic English',
    features: [],
    count: 2,
  },
  {
    code: 'b1',
    label: 'B1',
    title: 'Intermediate',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #d97706, #f59e0b)',
    shadow: 'rgba(245,158,11,0.3)',
    emoji: '📘',
    desc: 'Clear texts on a range of topics. Students can understand the main points and express opinions on familiar subjects.',
    who: 'Teen & adult learners · General English · IELTS 4.0–5.5',
    features: ['4-part extended passages', 'Audio + 4 speeds', '13-language translation', 'AI conversation partner'],
    count: 10,
  },
  {
    code: 'b2',
    label: 'B2',
    title: 'Upper Intermediate',
    color: '#3b82f6',
    bg: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    shadow: 'rgba(59,130,246,0.3)',
    emoji: '📗',
    desc: 'Complex texts on concrete and abstract topics. Students can discuss ideas, give opinions and follow detailed arguments.',
    who: 'Adult learners · University prep · IELTS 5.5–7.0',
    features: ['4-part extended passages', 'Word highlight & lookup', '13-language translation', 'AI conversation partner'],
    count: 35,
  },
  {
    code: 'c1',
    label: 'C1',
    title: 'Advanced',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    shadow: 'rgba(139,92,246,0.3)',
    emoji: '📙',
    desc: 'Demanding texts on complex topics with nuanced vocabulary. Students can understand and evaluate detailed arguments.',
    who: 'Advanced learners · Professional English · IELTS 7.0–8.0',
    features: [],
    count: 1,
  },
  {
    code: 'c2',
    label: 'C2',
    title: 'Proficiency',
    color: '#ec4899',
    bg: 'linear-gradient(135deg, #be185d, #ec4899)',
    shadow: 'rgba(236,72,153,0.3)',
    emoji: '🏆',
    desc: 'Sophisticated academic and professional texts. Students can understand virtually everything read with ease and precision.',
    who: 'Near-native · Academic English · IELTS 8.5+',
    features: [],
    count: 0,
  },
]

export default function ReadingComprehensionPage() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/esl-resources" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← ESL Resources</Link>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>📖</div>
          <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', margin: '0 0 12px' }}>Reading Comprehension</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '17px', margin: '0 0 24px', lineHeight: '1.6', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}>
            Engaging reading passages with audio, vocabulary, translation and AI conversation — levelled from A1 to C2.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🔊 Audio Playback', '🌍 13-Language Translation', '🤖 AI Conversation', '📚 Vocabulary Included', '🎯 A1 – C2 Levels', '👤 1-to-1 Classes'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', padding: '6px 14px', borderRadius: '20px', fontWeight: '600' }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* LEVEL CARDS */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px', textAlign: 'center' }}>Choose a Level</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>Select the CEFR level that matches your student</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {LEVELS.map(level => (
            <Link key={level.code} href={`/esl-resources/reading-comprehension/${level.code}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Card Header */}
                <div style={{ background: level.bg, padding: '28px 24px', position: 'relative' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{level.emoji}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ color: 'white', fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>{level.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', fontWeight: 'bold' }}>{level.title}</span>
                  </div>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>
                    {level.count === 0 ? 'Coming soon' : `${level.count} lesson${level.count !== 1 ? 's' : ''}`}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px' }}>{level.desc}</p>
                  <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px' }}>
                    <div style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Suitable for</div>
                    <div style={{ color: '#374151', fontSize: '13px', fontWeight: '600' }}>{level.who}</div>
                  </div>
                  {level.features.length > 0 && (
                    <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {level.features.map(f => (
                        <span key={f} style={{ background: level.color + '12', color: level.color, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', border: `1px solid ${level.color}25` }}>✓ {f}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 'auto', background: level.count === 0 ? '#f3f4f6' : level.color + '15', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${level.count === 0 ? '#e5e7eb' : level.color + '30'}` }}>
                    <span style={{ color: level.count === 0 ? '#9ca3af' : level.color, fontWeight: 'bold', fontSize: '14px' }}>
                      {level.count === 0 ? 'Coming Soon' : `Browse ${level.label} Lessons →`}
                    </span>
                    <span style={{ fontSize: '16px' }}>{level.count === 0 ? '⏳' : '📖'}</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px 36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {[
            { icon: '🔊', title: 'Audio at 4 Speeds', desc: 'Every lesson has audio playback at Very Slow, Slow, Normal and Fast — perfect for all levels.' },
            { icon: '🌍', title: '13-Language Translation', desc: 'Translate vocabulary and questions into Thai, Japanese, Chinese, Korean and 9 more languages instantly.' },
            { icon: '🤖', title: 'AI Conversation Partner', desc: 'Students can practise speaking with an AI teacher on every discussion question — with gentle corrections.' },
            { icon: '👤', title: '1-to-1 Optimised', desc: 'Designed for private tutoring and small group classes — fully screen-based, no printing needed.' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px', fontSize: '15px' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
