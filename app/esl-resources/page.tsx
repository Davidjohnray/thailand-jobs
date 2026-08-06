'use client'
import Link from 'next/link'
import PVAdvisoryBanner from '../../components/PVAdvisoryBanner'

export default function ESLResourcesPage() {
  const sections = [
    {
      href: '/esl-resources/lesson-plans',
      emoji: '📋',
      title: 'Lesson Plans',
      desc: 'Ready-to-teach plans for Pre-K through Secondary — print and teach, no prep needed.',
      cta: 'Browse Lesson Plans →',
      gradient: 'linear-gradient(135deg, #7C3AED, #E85D26)',
      shadow: 'rgba(124,58,237,0.3)',
    },
    {
      href: '/esl-resources/reading-comprehension',
      emoji: '🗞️',
      title: 'Reading Comprehension',
      desc: 'Visual reading passages with discussion questions and vocabulary — perfect for 1-to-1 classes.',
      cta: 'Browse Lessons →',
      gradient: 'linear-gradient(135deg, #0f3460, #0ea5e9)',
      shadow: 'rgba(14,165,233,0.3)',
    },
    {
      href: '/esl-resources/grammar',
      emoji: '✏️',
      title: 'Grammar',
      desc: 'From A1 basics to C2 advanced — learn, practise, and teach every grammar point with AI feedback.',
      cta: 'Explore Grammar →',
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
      shadow: 'rgba(5,150,105,0.3)',
    },
    {
      href: '/esl-games/live',
      emoji: '🎮',
      title: 'Learn & Play',
      desc: 'Interactive classroom games for KG through Matthayom — vocabulary, quizzes and team play.',
      cta: 'Play Games →',
      gradient: 'linear-gradient(135deg, #f59e0b, #22c55e)',
      shadow: 'rgba(245,158,11,0.3)',
    },
    {
      href: '/esl-resources/conversation-topics',
      emoji: '🗣️',
      title: 'Conversation Topics',
      desc: 'Pick a category and level to generate random speaking topics and discussion questions.',
      cta: 'Start Talking →',
      gradient: 'linear-gradient(135deg, #dc2626, #f97316)',
      shadow: 'rgba(220,38,38,0.3)',
    },
  ]

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#1a1a2e', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E85D26 100%)', padding: '70px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>

          {/* HERO TEXT */}
          <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>📖</div>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 14px', letterSpacing: '-1px' }}>ESL Resources</h1>
            <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '560px', margin: '0 auto 10px' }}>Ready-to-teach ESL resources for all ages</p>
            <p style={{ fontSize: '14px', opacity: 0.75, maxWidth: '480px', margin: '0 auto' }}>Designed for bilingual schools, private kindergartens, and ESL programs in Thailand</p>
          </div>

          {/* P&V ADVISORY BANNER */}
          <div className="hero-side-ad" style={{ flexShrink: 0 }}>
            <PVAdvisoryBanner size={250} location="esl_resources_hero" />
          </div>

        </div>
      </div>

      {/* SECTION BUTTONS — 3 + 2 */}
      <div style={{ padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>Choose a section</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {sections.map((s, i) => (
              <Link key={i} href={s.href} style={{ textDecoration: 'none', flex: '1 1 280px', maxWidth: '320px' }}>
                <div
                  style={{
                    background: s.gradient,
                    borderRadius: '20px',
                    padding: '32px 28px',
                    textAlign: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: `0 8px 28px ${s.shadow}`,
                    border: '2px solid rgba(255,255,255,0.1)',
                    height: '100%',
                    boxSizing: 'border-box',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ fontSize: '44px', marginBottom: '12px' }}>{s.emoji}</div>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>{s.title}</h2>
                  <p style={{ opacity: 0.85, fontSize: '14px', margin: '0 0 16px', lineHeight: '1.5' }}>{s.desc}</p>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }}>{s.cta}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </main>
  )
}
