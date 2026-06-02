'use client'
import Link from 'next/link'

const CATEGORIES = [
  {
    id: 'business',
    title: 'Business & Economics',
    emoji: '💼',
    description: 'Commerce, markets, labour and the global economy',
    color: '#f59e0b',
    lessons: [
      {
        id: 'gig-economy',
        title: 'The Gig Economy — Freedom or Exploitation?',
        emoji: '📱',
        description: 'Platform Capitalism and the Future of Work',
        detail: 'A critical examination of how digital platforms have transformed employment, who benefits, who is harmed, and how societies might respond.',
        badges: ['4 parts', '12 questions'],
        color: '#f59e0b',
      },
    ]
  },
  {
    id: 'society',
    title: 'Society & Politics',
    emoji: '🌍',
    description: 'Power, inequality, justice and how societies are organised',
    color: '#8b5cf6',
    lessons: [],
    comingSoon: false,
  },
  {
    id: 'technology',
    title: 'Technology & Ethics',
    emoji: '🤖',
    description: 'Artificial intelligence, data, surveillance and digital rights',
    color: '#0ea5e9',
    lessons: [],
    comingSoon: false,
  },
  {
    id: 'environment',
    title: 'Environment & Policy',
    emoji: '🌿',
    description: 'Climate, energy, sustainability and environmental governance',
    color: '#22c55e',
    lessons: [],
    comingSoon: false,
  },
  {
    id: 'culture',
    title: 'Culture & Identity',
    emoji: '🎭',
    description: 'Language, art, globalisation and what it means to belong',
    color: '#ef4444',
    lessons: [],
    comingSoon: false,
  },
]

export default function C1ReadingHub() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>
            ← Reading Comprehension
          </Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', minWidth: '80px', border: '2px solid rgba(255,255,255,0.2)' }}>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>C1</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>ADVANCED</div>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' }}>C1 — Advanced</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '0 0 12px', lineHeight: '1.6', maxWidth: '540px' }}>
                Extended academic passages on complex topics. Students engage critically with arguments, evaluate evidence, and construct sophisticated written and spoken responses.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Critical thinking', 'Academic argument', 'Advanced vocabulary', 'IELTS 6.5–8.0'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            {['✍️ Highlight any text', '🌍 13-language translation', '🤖 AI debate partner', '🎤 Push-to-talk voice', '🔊 4-speed audio'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ color: '#7c3aed', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>C1 Passage Style</div>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Dense, nuanced texts with complex sentence structures, sophisticated vocabulary, and multi-perspective arguments — similar to quality journalism and academic writing.</p>
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ color: '#7c3aed', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>C1 Discussion Questions</div>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Questions require critical analysis, evaluation of competing arguments, and the ability to defend a position under challenge — not just personal opinion.</p>
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ color: '#7c3aed', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>C1 AI Partner</div>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>The AI uses advanced vocabulary, challenges your arguments, and pushes you to develop your reasoning further — calibrated for academic discussion at C1 level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {CATEGORIES.map(cat => (
          <div key={cat.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: `3px solid ${cat.color}` }}>
              <div style={{ background: cat.color, width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{cat.emoji}</div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{cat.title}</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{cat.description}</p>
              </div>
              <span style={{ marginLeft: 'auto', background: cat.lessons.length > 0 ? cat.color + '15' : '#f3f4f6', color: cat.lessons.length > 0 ? cat.color : '#9ca3af', fontSize: '13px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', flexShrink: 0 }}>
                {cat.lessons.length > 0 ? `${cat.lessons.length} lesson${cat.lessons.length !== 1 ? 's' : ''}` : 'Coming soon'}
              </span>
            </div>

            {cat.lessons.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
                {cat.lessons.map(lesson => (
                  <Link key={lesson.id} href={`/esl-resources/reading-comprehension/c1/${lesson.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}>
                      <div style={{ background: `linear-gradient(135deg, ${lesson.color}22, ${lesson.color}08)`, borderBottom: `3px solid ${lesson.color}`, padding: '22px 20px 16px' }}>
                        <div style={{ fontSize: '44px', marginBottom: '10px' }}>{lesson.emoji}</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 5px', lineHeight: '1.3' }}>{lesson.title}</h3>
                        <p style={{ color: lesson.color, fontSize: '13px', fontWeight: '700', margin: 0 }}>{lesson.description}</p>
                      </div>
                      <div style={{ padding: '16px 20px', flex: 1 }}>
                        <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.65', margin: '0 0 14px' }}>{lesson.detail}</p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {lesson.badges.map(b => (
                            <span key={b} style={{ background: '#f3f4f6', color: '#555', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}>{b}</span>
                          ))}
                          <span style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}>🤖 AI Debate</span>
                          <span style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}>🌍 Translation</span>
                        </div>
                      </div>
                      <div style={{ padding: '0 20px 20px' }}>
                        <div style={{ background: lesson.color, color: 'white', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', textAlign: 'center' }}>Open Lesson →</div>
                      </div>
                    </div>
                  </Link>
                ))}
                <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', minHeight: '200px' }}>
                  <div style={{ fontSize: '36px' }}>✍️</div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>More {cat.title} lessons coming soon</div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '40px', opacity: 0.4 }}>{cat.emoji}</div>
                <div>
                  <div style={{ color: '#9ca3af', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{cat.title} lessons in development</div>
                  <div style={{ color: '#d1d5db', fontSize: '14px' }}>Check back soon — new C1 lessons are added regularly</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </main>
  )
}
