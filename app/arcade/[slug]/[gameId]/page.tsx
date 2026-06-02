'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../src/lib/supabase'

const gameTypeLabel: Record<string, string> = {
  vocab_blast: '🎯 Vocab Blast',
  quiz_master: '📝 Quiz Master',
  true_or_false: '✅ True or False',
  picture_quiz: '🖼️ Picture Quiz',
}

export default function GameModePage({ params }: { params: { slug: string; gameId: string } }) {
  const { slug, gameId } = params
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => {
      setGame(data)
      setLoading(false)
    })
  }, [gameId])

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '18px' }}>Loading game...</div>
    </main>
  )

  if (!game) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', maxWidth: '360px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ fontWeight: '800', color: '#1a1a2e', marginBottom: '12px' }}>Game not found</h2>
        <Link href={`/arcade/${slug}`} style={{ color: '#f59e0b', fontWeight: '700', textDecoration: 'none' }}>← Back to Arcade</Link>
      </div>
    </main>
  )

  const questionCount = Array.isArray(game.questions) ? game.questions.length : 0

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      <Link href={`/arcade/${slug}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', marginBottom: '32px', alignSelf: 'flex-start', maxWidth: '600px', width: '100%' }}>
        ← Back to Arcade
      </Link>

      <div style={{ width: '100%', maxWidth: '600px' }}>

        {/* Game Info */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px', marginBottom: '24px', border: '2px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {game.game_type === 'vocab_blast' ? '🎯' : game.game_type === 'quiz_master' ? '📝' : game.game_type === 'true_or_false' ? '✅' : '🖼️'}
          </div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '900', margin: '0 0 8px' }}>{game.title}</h1>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>{gameTypeLabel[game.game_type]}</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
              ❓ {questionCount} questions
            </span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
              ⏱ {game.timer_seconds}s per question
            </span>
            {game.show_vocab_lesson && (
              <span style={{ background: 'rgba(245,158,11,0.3)', color: '#fbbf24', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                📚 Vocab lesson included
              </span>
            )}
          </div>
        </div>

        {/* Choose Mode */}
        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', textAlign: 'center', marginBottom: '16px' }}>Choose How to Play</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Solo */}
          <Link href={`/arcade/${slug}/${gameId}/solo`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px 24px', border: '2px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#f59e0b' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize: '40px', flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: '900', fontSize: '18px', marginBottom: '4px' }}>Solo Play</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Play at your own pace on your own device. Perfect for self-study or homework.</div>
              </div>
              <div style={{ color: '#f59e0b', fontWeight: '800', fontSize: '20px', flexShrink: 0 }}>→</div>
            </div>
          </Link>

          {/* TV Mode */}
          <Link href={`/arcade/${slug}/${gameId}/tv`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px 24px', border: '2px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#E85D26' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize: '40px', flexShrink: 0 }}>📺</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: '900', fontSize: '18px', marginBottom: '4px' }}>TV Classroom Mode</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Teacher shows on the big screen. Students answer by hand — no phones needed.</div>
              </div>
              <div style={{ color: '#E85D26', fontWeight: '800', fontSize: '20px', flexShrink: 0 }}>→</div>
            </div>
          </Link>

          {/* Multiplayer — coming soon */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '22px 24px', border: '2px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.6 }}>
            <div style={{ fontSize: '40px', flexShrink: 0 }}>📱</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: '900', fontSize: '18px', marginBottom: '4px' }}>
                Online Multiplayer
                <span style={{ marginLeft: '10px', background: '#374151', color: '#9ca3af', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', verticalAlign: 'middle' }}>Coming Soon</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Students join on their phones with a room code. Live leaderboard for up to 40 students.</div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
