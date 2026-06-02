'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

const gameTypeLabel: Record<string, string> = {
  vocab_blast: '🎯 Vocab Blast',
  quiz_master: '📝 Quiz Master',
  true_or_false: '✅ True or False',
  picture_quiz: '🖼️ Picture Quiz',
}

export default function ArcadePublicPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [teacher, setTeacher] = useState<any>(null)
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: profile } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('arcade_slug', slug)
        .single()

      if (!profile) { setNotFound(true); setLoading(false); return }

      const expired = new Date(profile.subscription_expires_at) < new Date()
      if (!profile.active || expired) { setNotFound(true); setLoading(false); return }

      setTeacher(profile)

      const { data: gameData } = await supabase
        .from('custom_games')
        .select('*')
        .eq('teacher_slug', slug)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      setGames(gameData || [])
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '18px' }}>Loading arcade...</div>
    </main>
  )

  if (notFound) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🕹️</div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>Arcade not found</h2>
        <p style={{ color: '#666', fontSize: '15px' }}>This arcade page doesn&apos;t exist or is currently inactive.</p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>

      {/* HERO */}
      <section style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🕹️</div>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '900', margin: '0 0 8px' }}>
          {teacher.display_name}&apos;s Arcade
        </h1>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
            📚 {teacher.subject}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
            👥 {teacher.class_level}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
            🎮 {games.length} game{games.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </section>

      {/* GAMES GRID */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 60px' }}>
        {games.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No games yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>Your teacher hasn&apos;t published any games yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {games.map(game => (
              <Link key={game.id} href={`/arcade/${slug}/${game.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '28px 24px', border: '2px solid rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '14px' }}>
                    {game.game_type === 'vocab_blast' ? '🎯' : game.game_type === 'quiz_master' ? '📝' : game.game_type === 'true_or_false' ? '✅' : '🖼️'}
                  </div>
                  <h3 style={{ color: 'white', fontSize: '19px', fontWeight: '800', margin: '0 0 8px', lineHeight: '1.3' }}>{game.title}</h3>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '16px' }}>{gameTypeLabel[game.game_type]}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                      {Array.isArray(game.questions) ? game.questions.length : 0} questions
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                      ⏱ {game.timer_seconds}s
                    </span>
                    {game.show_vocab_lesson && (
                      <span style={{ background: 'rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                        📚 Vocab First
                      </span>
                    )}
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '12px', borderRadius: '10px', textAlign: 'center', fontWeight: '900', fontSize: '15px' }}>
                    Play Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div style={{ textAlign: 'center', paddingBottom: '32px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Powered by jobsinthailand.net Teacher Arcade</p>
      </div>
    </main>
  )
}
