import Link from 'next/link'

const lessons = [
  {
    slug: 'my-weekend',
    title: 'My Weekend',
    subtitle: 'Hobbies, activities and free time',
    emoji: '🎉',
    topic: 'Free Time',
    topicColor: '#84cc16',
    parts: 1,
    questions: 6,
    preview: 'Read about Tom\'s weekend — football with friends, going to the market and relaxing at home.',
    gradient: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)',
  },
  {
    slug: 'my-town',
    title: 'My Town',
    subtitle: 'Neighbourhoods, places and getting around',
    emoji: '🏙️',
    topic: 'Places',
    topicColor: '#84cc16',
    parts: 1,
    questions: 6,
    preview: 'Read about Sara\'s city — her neighbourhood, favourite café and how she travels around Chiang Mai.',
    gradient: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)',
  },
]

export default function A2ReadingPage() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>A2</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>ELEMENTARY</div>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' }}>A2 — Elementary</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 12px', lineHeight: '1.5', maxWidth: '520px' }}>
                Short passages on familiar topics. Students can understand simple texts about everyday life and express basic ideas.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Everyday topics', 'Simple past tense', 'Vocabulary building', 'Ages 10–14'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LESSONS */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>A2 Lessons</h2>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{lessons.length} lessons available — new content added regularly</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {lessons.map(lesson => (
            <Link key={lesson.slug} href={`/esl-resources/reading-comprehension/a2/${lesson.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #eee' }}>
                <div style={{ background: lesson.gradient, padding: '28px 24px', position: 'relative' }}>
                  <div style={{ fontSize: '44px', marginBottom: '10px' }}>{lesson.emoji}</div>
                  <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px', lineHeight: '1.3' }}>{lesson.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', margin: 0 }}>{lesson.subtitle}</p>
                  <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>{lesson.topic}</span>
                  </div>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>{lesson.preview}</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}><span>📖</span> Reading + Listening</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}><span>💬</span> {lesson.questions} questions</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}><span>✍️</span> Writing practice</div>
                  </div>
                  <div style={{ background: '#f7fee7', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #d9f99d' }}>
                    <span style={{ color: '#65a30d', fontWeight: 'bold', fontSize: '14px' }}>Open Lesson →</span>
                    <span style={{ fontSize: '18px' }}>📖</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Coming Soon */}
          <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #ddd', padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '200px' }}>
            <div style={{ fontSize: '40px' }}>✍️</div>
            <div style={{ fontWeight: 'bold', color: '#888', fontSize: '16px' }}>More A2 lessons coming soon</div>
            <div style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5', maxWidth: '220px' }}>Shopping, weather, travel and more</div>
          </div>
        </div>
      </section>

    </main>
  )
}
