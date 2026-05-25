import Link from 'next/link'

const lessons = [
  {
    slug: 'ai-smart-glasses',
    title: 'Next-Gen AI Smart Glasses',
    subtitle: 'A New Way to See the World',
    emoji: '🥽',
    level: 'B2',
    levelColor: '#3b82f6',
    topic: 'Technology',
    topicColor: '#8b5cf6',
    parts: 4,
    questions: 12,
    preview: 'Explore how AI-powered smart glasses are changing daily life, work, travel and social interaction.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    border: '#3b82f6',
  },
  // Add more lessons here
]

const LEVELS = [
  { code: 'A1', label: 'A1 Beginner', color: '#22c55e' },
  { code: 'A2', label: 'A2 Elementary', color: '#84cc16' },
  { code: 'B1', label: 'B1 Intermediate', color: '#f59e0b' },
  { code: 'B2', label: 'B2 Upper Intermediate', color: '#3b82f6' },
  { code: 'C1', label: 'C1 Advanced', color: '#8b5cf6' },
  { code: 'C2', label: 'C2 Proficiency', color: '#ec4899' },
]

export default function ReadingComprehensionPage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>📖</div>
          <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', margin: '0 0 12px' }}>
            Reading Comprehension
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '17px', margin: '0 0 24px', lineHeight: '1.6', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}>
            Engaging reading passages with discussion questions and vocabulary — designed for one-on-one and small group classes.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['💬 Discussion Questions', '📚 Vocabulary', '🎯 Levelled B1–C1', '📱 Screen Optimised'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', padding: '6px 14px', borderRadius: '20px', fontWeight: '600' }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* LEVEL KEY */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '16px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Levels:</span>
          {LEVELS.map(l => (
            <span key={l.code} style={{ background: l.color + '18', color: l.color, fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${l.color}40` }}>{l.label}</span>
          ))}
        </div>
      </section>

      {/* LESSONS GRID */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>All Lessons</h2>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''} — new content added regularly</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {lessons.map(lesson => (
            <Link key={lesson.slug} href={`/esl-resources/reading-comprehension/${lesson.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: `1px solid #eee`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }}>

                {/* Card Header */}
                <div style={{ background: lesson.gradient, padding: '28px 24px', position: 'relative' }}>
                  <div style={{ fontSize: '44px', marginBottom: '10px' }}>{lesson.emoji}</div>
                  <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px', lineHeight: '1.3' }}>{lesson.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>{lesson.subtitle}</p>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <span style={{ background: lesson.levelColor, color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>{lesson.level}</span>
                    <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>{lesson.topic}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>{lesson.preview}</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}>
                      <span>📄</span> {lesson.parts} parts
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}>
                      <span>💬</span> {lesson.questions} discussion questions
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}>
                      <span>📚</span> Vocabulary included
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', background: '#f9f9f9', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '14px' }}>Open Lesson →</span>
                    <span style={{ fontSize: '18px' }}>📖</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Coming Soon placeholder */}
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '2px dashed #ddd', padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '200px' }}>
            <div style={{ fontSize: '40px' }}>✍️</div>
            <div style={{ fontWeight: 'bold', color: '#888', fontSize: '16px' }}>More lessons coming soon</div>
            <div style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5', maxWidth: '240px' }}>New topics added weekly — technology, society, environment, culture and more</div>
          </div>
        </div>
      </section>

      {/* BACK LINK */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 40px' }}>
        <Link href="/esl-resources" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to ESL Resources</Link>
      </section>

    </main>
  )
}
