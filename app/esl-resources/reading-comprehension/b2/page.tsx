import Link from 'next/link'

const lessons = [
  {
    slug: 'ai-smart-glasses',
    title: 'Next-Gen AI Smart Glasses',
    subtitle: 'A New Way to See the World',
    emoji: '🥽',
    topic: 'Technology',
    topicColor: '#8b5cf6',
    parts: 4,
    questions: 12,
    preview: 'Explore how AI-powered smart glasses are changing daily life, work, travel and social interaction.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
  },
  {
  slug: 'home-robots',
  title: 'AI-Powered Home Robots',
  subtitle: 'Living with Intelligent Machines',
  emoji: '🤖',
  topic: 'Technology',
  topicColor: '#3b82f6',
  parts: 4,
  questions: 12,
  preview: 'Explore how AI robots are changing life at home, raising questions about privacy, trust and the future of human connection.',
  gradient: 'linear-gradient(135deg, #1a1a2e 0%, #1e3a5f 100%)',
},
{
  slug: 'holographic-display',
  title: 'Holographic Display Gadgets',
  subtitle: 'From Science Fiction to Consumer Technology',
  emoji: '🔮',
  topic: 'Technology',
  topicColor: '#8b5cf6',
  parts: 4,
  questions: 12,
  preview: 'Explore how holographic technology is moving from science fiction to reality, changing business, education and entertainment.',
  gradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
},
]

export default function B2ReadingPage() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>B2</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>UPPER INT.</div>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' }}>B2 — Upper Intermediate</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: '0 0 12px', lineHeight: '1.5', maxWidth: '520px' }}>
                Complex texts on concrete and abstract topics. Students can discuss ideas, give opinions and follow detailed arguments.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Adult learners', 'University prep', 'IELTS 5.5–6.5', '1-to-1 classes'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{tag}</span>
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
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>B2 Lessons</h2>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''} available — new content added regularly</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {lessons.map(lesson => (
            <Link key={lesson.slug} href={`/esl-resources/reading-comprehension/b2/${lesson.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #eee' }}>
                <div style={{ background: lesson.gradient, padding: '28px 24px', position: 'relative' }}>
                  <div style={{ fontSize: '44px', marginBottom: '10px' }}>{lesson.emoji}</div>
                  <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px', lineHeight: '1.3' }}>{lesson.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>{lesson.subtitle}</p>
                  <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <span style={{ background: 'rgba(139,92,246,0.7)', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>{lesson.topic}</span>
                  </div>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>{lesson.preview}</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}><span>📄</span> {lesson.parts} parts</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}><span>💬</span> {lesson.questions} questions</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}><span>📚</span> Vocabulary</div>
                  </div>
                  <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bfdbfe' }}>
                    <span style={{ color: '#1d4ed8', fontWeight: 'bold', fontSize: '14px' }}>Open Lesson →</span>
                    <span style={{ fontSize: '18px' }}>📖</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Coming Soon */}
          <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #ddd', padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '200px' }}>
            <div style={{ fontSize: '40px' }}>✍️</div>
            <div style={{ fontWeight: 'bold', color: '#888', fontSize: '16px' }}>More B2 lessons coming soon</div>
            <div style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5', maxWidth: '220px' }}>Technology, society, environment, culture and more</div>
          </div>
        </div>
      </section>

    </main>
  )
}
