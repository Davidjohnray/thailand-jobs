'use client'
import Link from 'next/link'

const CATEGORIES = [
  {
    id: 'technology',
    title: 'Technology',
    emoji: '💻',
    description: 'AI, gadgets, wearables and the digital future',
    color: '#6366f1',
    lessons: [
      { id: 'ai-smart-glasses', title: 'Next-Gen AI Smart Glasses', emoji: '👓', description: 'A New Way to See the World', detail: 'Explore how AI-powered smart glasses are changing daily life, work, travel and social interaction.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
      { id: 'home-robots', title: 'AI-Powered Home Robots', emoji: '🤖', description: 'Living with Intelligent Machines', detail: 'Explore how AI robots are changing life at home, raising questions about privacy, trust and the future.', badges: ['4 parts', '12 questions'], color: '#8b5cf6' },
      { id: 'holographic-display', title: 'Holographic Display Gadgets', emoji: '🔮', description: 'From Science Fiction to Reality', detail: 'Explore how holographic technology is moving from science fiction into business, education and everyday life.', badges: ['4 parts', '12 questions'], color: '#14b8a6' },
      { id: 'facial-recognition', title: 'Facial Recognition Technology', emoji: '👁️', description: 'Identity, Privacy and Bias', detail: 'Explore how AI identifies faces — and the growing debate over privacy, accuracy, and government regulation.', badges: ['4 parts', '12 questions'], color: '#6366f1' },
    ]
  },
  {
    id: 'sports',
    title: 'Sports',
    emoji: '⚽',
    description: 'Football, competition and sporting culture',
    color: '#22c55e',
    lessons: [
      { id: 'world-cup-2026', title: 'FIFA World Cup 2026', emoji: '⚽', description: 'The Biggest Tournament in Football History', detail: 'Explore the build-up, the favorites, the pressure of expectations, and what fans around the world are saying.', badges: ['4 parts', '12 questions'], color: '#22c55e' },
    ]
  },
  {
  id: 'society',
  title: 'Society & Culture',
  emoji: '🌍',
  description: 'People, communities and social change',
  color: '#f59e0b',
  lessons: [
    {
      id: 'online-learning',
      title: 'Online Learning Platforms',
      emoji: '💻',
      description: 'The Future of Education',
      detail: 'Explore how online platforms are changing education — flexibility, access, challenges and what comes next.',
      badges: ['4 parts', '12 questions'],
      color: '#f59e0b',
    },
  ]
},
  { id: 'environment', title: 'Environment', emoji: '🌿', description: 'Climate, sustainability and the natural world', color: '#16a34a', lessons: [], comingSoon: true },
  { id: 'health', title: 'Health & Science', emoji: '🔬', description: 'Medicine, wellbeing and scientific discovery', color: '#ef4444', lessons: [], comingSoon: true },
  { id: 'work', title: 'Work & Business', emoji: '💼', description: 'Careers, economics and the modern workplace', color: '#0ea5e9', lessons: [], comingSoon: true },
]

export default function B2ReadingHub() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>B2</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>UPPER INT.</div>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' }}>B2 — Upper Intermediate</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 12px', lineHeight: '1.5', maxWidth: '520px' }}>Complex texts on current topics. Students can understand detailed arguments and express opinions with confidence.</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Complex arguments', 'Critical thinking', 'Opinion & debate', 'IELTS 5.5–7.0'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            {['✍️ Highlight any text', '🌍 13-language translation', '🤖 AI conversation partner', '🎤 Push-to-talk voice', '🔊 4-speed audio'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {CATEGORIES.map(cat => (
          <div key={cat.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: `3px solid ${cat.color}` }}>
              <div style={{ background: cat.color, width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{cat.emoji}</div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{cat.title}</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{cat.description}</p>
              </div>
              {(cat as any).comingSoon ? (
                <span style={{ marginLeft: 'auto', background: '#f3f4f6', color: '#9ca3af', fontSize: '13px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', flexShrink: 0 }}>Coming soon</span>
              ) : (
                <span style={{ marginLeft: 'auto', background: cat.color + '15', color: cat.color, fontSize: '13px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', flexShrink: 0 }}>{cat.lessons.length} lesson{cat.lessons.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {cat.lessons.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
                {cat.lessons.map(lesson => (
                  <Link key={lesson.id} href={`/esl-resources/reading-comprehension/b2/${lesson.id}`} style={{ textDecoration: 'none' }}>
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
                          <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}>🤖 AI + 🌍 Translation</span>
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
                  <div style={{ color: '#d1d5db', fontSize: '14px' }}>Check back soon — new lessons are added regularly</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
