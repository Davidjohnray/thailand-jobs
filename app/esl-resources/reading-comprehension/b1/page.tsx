'use client'
import Link from 'next/link'

const CATEGORIES = [
  {
    id: 'health',
    title: 'Health & Science',
    emoji: '🔬',
    description: 'Medicine, the body and scientific discoveries',
    color: '#0ea5e9',
    lessons: [
      {
        id: 'wearable-health-monitors',
        title: 'Wearable Health Monitors',
        emoji: '⌚',
        description: 'Technology on Your Wrist',
        detail: 'Explore how smartwatches and fitness trackers are changing personal health monitoring.',
        badges: ['4 parts', '12 questions'],
        color: '#0ea5e9',
      },
    ],
  },
  {
    id: 'society',
    title: 'Society & Culture',
    emoji: '🌍',
    description: 'People, communities, culture and how the world works',
    color: '#f97316',
    lessons: [
      {
        id: 'indigenous-peoples',
        title: 'Indigenous Peoples of the World',
        emoji: '🌍',
        description: 'Culture, Land and Identity',
        detail: "Learn about the world's first peoples, the challenges they face, and why their cultures matter to all of us.",
        badges: ['4 parts', '12 questions'],
        color: '#f97316',
      },
      {
        id: 'global-events-oil-prices',
        title: 'Global Events and Oil Prices',
        emoji: '🛢️',
        description: 'Why Prices Change Around the World',
        detail: 'Understand how wars, economies, and clean energy affect the cost of oil and everyday life.',
        badges: ['4 parts', '12 questions'],
        color: '#f97316',
      },
    ],
  },
  {
    id: 'mystery',
    title: 'Mystery & the Unknown',
    emoji: '🔮',
    description: 'Aliens, spirits, supernatural phenomena and the unexplained',
    color: '#8b5cf6',
    lessons: [
      {
        id: 'do-aliens-exist',
        title: 'Do Aliens Really Exist?',
        emoji: '👽',
        description: 'From Ancient Mysteries to Modern Science',
        detail: 'Explore the history of UFO sightings, what scientists are searching for in space, and what alien life might actually look like.',
        badges: ['4 parts', '12 questions'],
        color: '#6366f1',
      },
      {
        id: 'mediums-talking-to-dead',
        title: 'Mediums — Can People Really Talk to the Dead?',
        emoji: '👻',
        description: 'Spirits, Science and Belief',
        detail: 'Explore the world of mediums, séances, and spiritual communication — what do people believe, and what does science say?',
        badges: ['4 parts', '12 questions'],
        color: '#8b5cf6',
      },
    ],
  },
  {
    id: 'sport',
    title: 'Sport & Society',
    emoji: '⚽',
    description: 'Sport, competition and what it tells us about the world',
    color: '#ef4444',
    lessons: [
      {
        id: 'chinese-football',
        title: 'Chinese Football',
        emoji: '⚽',
        description: 'Big Spending, Big Dreams, Big Problems',
        detail: 'From the most expensive league in the world to financial collapse — explore the rise and fall of Chinese football spending and the national team today.',
        badges: ['4 parts', '12 questions'],
        color: '#ef4444',
      },
    ],
  },
  {
    id: 'work',
    title: 'Work & Careers',
    emoji: '💼',
    description: 'Jobs, skills and the modern workplace',
    color: '#6b7280',
    lessons: [],
    comingSoon: true,
  },
]

export default function B1ReadingHub() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)', padding: '60px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', padding: '6px 18px', color: 'white', fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '16px' }}>
          B1 INTERMEDIATE
        </div>
        <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', margin: '0 0 12px', lineHeight: 1.2 }}>
          B1 Reading Comprehension
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', maxWidth: '560px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          Engaging passages on real-world topics — with audio, translation, vocabulary support, and AI conversation practice.
        </p>
        <Link href="/esl-resources/reading-comprehension" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          ← All Levels
        </Link>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ marginBottom: '56px' }}>
            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '28px' }}>{cat.emoji}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>{cat.title}</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{cat.description}</p>
              </div>
            </div>

            {/* Lessons grid */}
            {'comingSoon' in cat && cat.comingSoon ? (
              <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '40px', opacity: 0.4 }}>{cat.emoji}</div>
                <div>
                  <div style={{ color: '#9ca3af', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{cat.title} lessons in development</div>
                  <div style={{ color: '#d1d5db', fontSize: '14px' }}>Check back soon — new lessons are added regularly</div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {cat.lessons.map((lesson) => (
                  <Link key={lesson.id} href={`/esl-resources/reading-comprehension/b1/${lesson.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                      <div style={{ fontSize: '36px', marginBottom: '12px' }}>{lesson.emoji}</div>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.05em' }}>B1</span>
                        {lesson.badges.map(b => (
                          <span key={b} style={{ background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '999px' }}>{b}</span>
                        ))}
                      </div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: '#1e293b', lineHeight: 1.3 }}>{lesson.title}</h3>
                      <p style={{ margin: '0 0 10px', fontSize: '13px', color: lesson.color, fontWeight: '600' }}>{lesson.description}</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{lesson.detail}</p>
                    </div>
                  </Link>
                ))}
                {/* Coming soon card within category */}
                <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', minHeight: '200px' }}>
                  <div style={{ fontSize: '36px' }}>✍️</div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>More {cat.title} lessons coming soon</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
