import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import GrammarLevelProgress from './GrammarLevelProgress'

const LEVEL_META: Record<string, {
  label: string; title: string; emoji: string
  gradient: string; who: string
  prev?: string; next?: string; color: string
}> = {
  a1: { label: 'A1', title: 'Starter',           emoji: '🌱', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)', who: 'Complete beginners',   next: 'a2', color: '#16a34a' },
  a2: { label: 'A2', title: 'Elementary',         emoji: '🌿', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', who: 'Early learners',       prev: 'a1', next: 'b1', color: '#0891b2' },
  b1: { label: 'B1', title: 'Pre-Intermediate',   emoji: '📗', gradient: 'linear-gradient(135deg, #2D6BE4, #4f8ef7)', who: 'Developing learners',  prev: 'a2', next: 'b2', color: '#2D6BE4' },
  b2: { label: 'B2', title: 'Intermediate',       emoji: '📘', gradient: 'linear-gradient(135deg, #7C3AED, #9f67f5)', who: 'Confident learners',   prev: 'b1', next: 'c1', color: '#7C3AED' },
  c1: { label: 'C1', title: 'Upper-Intermediate', emoji: '🔥', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)', who: 'Advanced learners',    prev: 'b2', next: 'c2', color: '#d97706' },
  c2: { label: 'C2', title: 'Mastery',            emoji: '🏆', gradient: 'linear-gradient(135deg, #E85D26, #f97316)', who: 'Near-native speakers', prev: 'c1', color: '#E85D26' },
}

type Topic = { id: string; slug: string; title: string; short_desc: string | null; order_index: number }

export default async function GrammarLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: rawLevel } = await params
  const level = rawLevel.toLowerCase()
  const meta = LEVEL_META[level]
  if (!meta) notFound()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: topics } = await supabase
    .from('grammar_topics')
    .select('id, slug, title, short_desc, order_index')
    .eq('level', level)
    .eq('is_published', true)
    .order('order_index')

  const typedTopics = (topics ?? []) as Topic[]
  const topicIds = typedTopics.map(t => t.id)

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: meta.gradient, padding: '48px 24px 32px', textAlign: 'center', color: 'white' }}>
        <Link href="/esl-resources/grammar" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
          ← All Grammar Levels
        </Link>
        <div style={{ fontSize: '44px', marginBottom: '10px' }}>{meta.emoji}</div>
        <h1 style={{ fontSize: '34px', fontWeight: 'bold', margin: '0 0 6px', letterSpacing: '-1px' }}>
          {meta.label} — {meta.title}
        </h1>
        <p style={{ fontSize: '15px', opacity: 0.85, margin: '0 0 4px' }}>{meta.who}</p>
        <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>{typedTopics.length} grammar topics</p>
      </div>

      {/* DARK NAV STRIP */}
      <div style={{ background: '#1a1a2e', padding: '16px 24px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {Object.entries(LEVEL_META).map(([code, m]) => (
              <Link key={code} href={`/esl-resources/grammar/${code}`} style={{ textDecoration: 'none' }}>
                <span style={{
                  padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
                  background: code === level ? 'white' : 'rgba(255,255,255,0.1)',
                  color: code === level ? '#1a1a2e' : 'rgba(255,255,255,0.6)',
                  display: 'inline-block',
                }}>
                  {m.label}
                </span>
              </Link>
            ))}
          </div>

          {/* CLIENT COMPONENT handles auth + progress */}
          {typedTopics.length > 0 && (
            <GrammarLevelProgress
              topicIds={topicIds}
              totalTopics={typedTopics.length}
              color={meta.color}
              loginUrl="/account/login"
            />
          )}
        </div>
      </div>

      {/* TOPICS GRID */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        {typedTopics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#888' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#444', marginBottom: '8px' }}>{meta.label} topics coming soon</h2>
            <p style={{ fontSize: '15px', margin: '0 0 24px' }}>We&apos;re building this level now — check back soon.</p>
            <Link href="/esl-resources/grammar" style={{ color: '#2D6BE4', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>← Back to all levels</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {typedTopics.map((topic, i) => (
                <Link key={topic.id} href={`/esl-resources/grammar/${level}/${topic.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white', borderRadius: '16px', padding: '20px 22px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer',
                    border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: '#f3f4f6', color: '#888', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', flexShrink: 0 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{topic.title}</h3>
                    </div>
                    {topic.short_desc && (
                      <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' }}>{topic.short_desc}</p>
                    )}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2D6BE4', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>📖 Learn</span>
                      <span style={{ fontSize: '11px', background: '#f0fdf4', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>✍️ Practise</span>
                      <span style={{ fontSize: '11px', background: '#faf5ff', color: '#7C3AED', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>📺 Teach</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', gap: '16px', flexWrap: 'wrap' }}>
              {meta.prev ? (
                <Link href={`/esl-resources/grammar/${meta.prev}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '14px 20px', fontSize: '14px', fontWeight: 'bold', color: '#444' }}>
                    ← {LEVEL_META[meta.prev].label} {LEVEL_META[meta.prev].title}
                  </div>
                </Link>
              ) : <div />}
              {meta.next ? (
                <Link href={`/esl-resources/grammar/${meta.next}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '14px 20px', fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
                    {LEVEL_META[meta.next].label} {LEVEL_META[meta.next].title} →
                  </div>
                </Link>
              ) : <div />}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
