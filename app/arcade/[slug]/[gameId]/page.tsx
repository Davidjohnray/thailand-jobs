'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../src/lib/supabase'

const gameTypeLabel: Record<string, string> = {
  vocab_blast: '🎯 Vocab Blast', quiz_master: '📝 Quiz Master',
  true_or_false: '✅ True or False', picture_quiz: '🖼️ Picture Quiz',
  word_hunter: '🔍 Word Hunter',
}

export default function GameModePage({ params }: { params: any }) {
  const { slug, gameId } = use(params) as { slug: string; gameId: string }
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!gameId) return
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => {
      setGame(data); setLoading(false)
    })
  }, [gameId])

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
    </main>
  )
  if (!game) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white' }}>Game not found. <Link href={`/arcade/${slug}`} style={{ color: '#f59e0b' }}>Go back</Link></div>
    </main>
  )

  const questionCount = Array.isArray(game.questions) ? game.questions.length : 0
  const tvEnabled = game.tv_enabled !== false
  const multiEnabled = !!game.multiplayer_enabled
  const learnEnabled = game.solo_enabled !== false

  const modes = [
    {
      id: 'learn', enabled: learnEnabled,
      icon: '🃏', label: 'Learn Mode',
      desc: 'Study vocabulary with flip cards — word on front, definition on back. Use alone or with the teacher presenting on screen.',
      color: '#0ea5e9',
      href: `/arcade/${slug}/${gameId}/solo`,
      tag: 'Flip cards · No pressure · Any age',
    },
    {
      id: 'tv', enabled: tvEnabled,
      icon: '📺', label: 'TV Classroom Mode',
      desc: 'Teacher presents on the big screen and runs a team quiz — no student devices needed.',
      color: '#E85D26',
      href: `/arcade/${slug}/${gameId}/tv`,
      tag: 'Big screen · 1–6 teams · Teacher controlled',
    },
    {
      id: 'multi', enabled: multiEnabled,
      icon: '📱', label: 'Online Multiplayer',
      desc: 'Students join on their own devices with a room code and answer questions live.',
      color: '#7C3AED',
      href: `/arcade/${slug}/${gameId}/host`,
      tag: 'Student devices · Live leaderboard · Up to 40',
    },
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Link href={`/arcade/${slug}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', marginBottom: '32px', alignSelf: 'flex-start', maxWidth: '600px', width: '100%' }}>← Back to Arcade</Link>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 24px', marginBottom: '24px', border: '2px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {game.game_type === 'vocab_blast' ? '🎯' : game.game_type === 'word_hunter' ? '🔍' : game.game_type === 'quiz_master' ? '📝' : game.game_type === 'true_or_false' ? '✅' : '🖼️'}
          </div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '900', margin: '0 0 8px' }}>{game.title}</h1>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>{gameTypeLabel[game.game_type]}</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>❓ {questionCount} questions</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>⏱ {game.timer_seconds}s timer</span>
            {game.age_group && (
              <span style={{ background: 'rgba(14,165,233,0.25)', color: '#7dd3fc', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                {game.age_group === 'under_5' ? '🐣 Under 5' : game.age_group === '5_11' ? '🌟 Ages 5–11' : game.age_group === '12_18' ? '📗 Ages 12–18' : '👤 Adult'}
              </span>
            )}
          </div>
        </div>

        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', textAlign: 'center', marginBottom: '16px' }}>Choose a Mode</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {modes.map(mode => {
            if (!mode.enabled) return (
              <div key={mode.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '20px 24px', border: '2px solid rgba(255,255,255,0.06)', opacity: 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '36px', flexShrink: 0 }}>{mode.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', marginBottom: '2px' }}>{mode.label} <span style={{ background: '#374151', color: '#9ca3af', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>Not enabled</span></div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{mode.desc}</div>
                  </div>
                </div>
              </div>
            )
            return (
              <Link key={mode.id} href={mode.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px', border: '2px solid rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'rgba(255,255,255,0.14)'; el.style.borderColor = mode.color }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'rgba(255,255,255,0.08)'; el.style.borderColor = 'rgba(255,255,255,0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '36px', flexShrink: 0 }}>{mode.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', marginBottom: '4px' }}>{mode.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px' }}>{mode.desc}</div>
                      <span style={{ background: mode.color + '25', color: mode.color, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>{mode.tag}</span>
                    </div>
                    <div style={{ color: mode.color, fontWeight: '800', fontSize: '22px', flexShrink: 0 }}>→</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
