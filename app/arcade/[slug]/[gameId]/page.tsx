'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../src/lib/supabase'

const gameTypeLabel: Record<string, string> = {
  vocab_blast: '🎯 Vocab Blast', quiz_master: '📝 Quiz Master',
  true_or_false: '✅ True or False', picture_quiz: '🖼️ Picture Quiz',
}

export default function GameModePage({ params }: { params: { slug: string; gameId: string } }) {
  const { slug, gameId } = params
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => { setGame(data); setLoading(false) })
  }, [gameId])

  if (loading) return <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'white', fontSize: '18px' }}>Loading...</div></main>
  if (!game) return <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}><div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center' }}><h2 style={{ fontWeight: '800', color: '#1a1a2e', marginBottom: '12px' }}>Game not found</h2><Link href={`/arcade/${slug}`} style={{ color: '#f59e0b', fontWeight: '700', textDecoration: 'none' }}>← Back</Link></div></main>

  const questionCount = Array.isArray(game.questions) ? game.questions.length : 0
  const soloEnabled = game.solo_enabled !== false
  const tvEnabled = game.tv_enabled !== false
  const multiEnabled = !!game.multiplayer_enabled

  const modes = [
    { id: 'solo', enabled: soloEnabled, icon: '👤', label: 'Solo Play', desc: 'Play at your own pace on your own device. Perfect for self-study or homework.', color: '#f59e0b', href: `/arcade/${slug}/${gameId}/solo` },
    { id: 'tv', enabled: tvEnabled, icon: '📺', label: 'TV Classroom Mode', desc: 'Teacher shows on the big screen. Students answer by hand — no phones needed.', color: '#E85D26', href: `/arcade/${slug}/${gameId}/tv` },
    { id: 'multi', enabled: multiEnabled, icon: '📱', label: 'Online Multiplayer', desc: 'Students join on their phones with a room code. Live leaderboard for up to 40 students.', color: '#7C3AED', href: `/arcade/${slug}/${gameId}/host` },
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Link href={`/arcade/${slug}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', marginBottom: '32px', alignSelf: 'flex-start', maxWidth: '600px', width: '100%' }}>← Back to Arcade</Link>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px', marginBottom: '24px', border: '2px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {game.game_type === 'vocab_blast' ? '🎯' : game.game_type === 'quiz_master' ? '📝' : game.game_type === 'true_or_false' ? '✅' : '🖼️'}
          </div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '900', margin: '0 0 8px' }}>{game.title}</h1>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>{gameTypeLabel[game.game_type]}</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>❓ {questionCount} questions</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>⏱ {game.timer_seconds}s per question</span>
            {game.show_vocab_lesson && <span style={{ background: 'rgba(245,158,11,0.3)', color: '#fbbf24', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>📚 Vocab lesson</span>}
          </div>
        </div>

        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', textAlign: 'center', marginBottom: '16px' }}>Choose How to Play</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {modes.map(mode => {
            if (!mode.enabled) return (
              <div key={mode.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '22px 24px', border: '2px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.5 }}>
                <div style={{ fontSize: '40px', flexShrink: 0 }}>{mode.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: '900', fontSize: '18px', marginBottom: '4px' }}>{mode.label} <span style={{ background: '#374151', color: '#9ca3af', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>Not enabled</span></div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{mode.desc}</div>
                </div>
              </div>
            )
            return (
              <Link key={mode.id} href={mode.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px 24px', border: '2px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLDivElement).style.borderColor = mode.color }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)' }}>
                  <div style={{ fontSize: '40px', flexShrink: 0 }}>{mode.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: '900', fontSize: '18px', marginBottom: '4px' }}>{mode.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{mode.desc}</div>
                  </div>
                  <div style={{ color: mode.color, fontWeight: '800', fontSize: '20px', flexShrink: 0 }}>→</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
