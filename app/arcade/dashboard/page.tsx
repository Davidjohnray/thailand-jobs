'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

export default function ArcadeDashboardPage() {
  const [loginStep, setLoginStep] = useState<'login' | 'dashboard'>('login')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [checking, setChecking] = useState(false)
  const [teacher, setTeacher] = useState<any>(null)
  const [games, setGames] = useState<any[]>([])
  const [loadingGames, setLoadingGames] = useState(false)
  const [deletingGame, setDeletingGame] = useState<string | null>(null)

  // Check if already logged in via sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('arcadeTeacher')
    if (saved) {
      try {
        const t = JSON.parse(saved)
        setTeacher(t)
        setLoginStep('dashboard')
        loadGames(t.arcade_slug)
      } catch { sessionStorage.removeItem('arcadeTeacher') }
    }
  }, [])

  const handleLogin = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) { setCodeError('Please enter your code.'); return }
    setChecking(true); setCodeError('')

    // Look up code
    const { data: codeData, error: codeError } = await supabase
      .from('teacher_activation_codes')
      .select('*')
      .eq('code', trimmed)
      .single()

    if (codeError || !codeData) { setCodeError('Code not found. Please check and try again.'); setChecking(false); return }
    if (!codeData.active) { setCodeError('This code has been deactivated. Please contact us.'); setChecking(false); return }
    if (!codeData.used) { setCodeError('This code has not been activated yet. Please go to /arcade/activate first.'); setChecking(false); return }

    // Look up teacher profile by code's used_by_email
    const { data: profile, error: profileError } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_email', codeData.used_by_email)
      .single()

    if (profileError || !profile) { setCodeError('No arcade account found for this code. Please activate at /arcade/activate.'); setChecking(false); return }

    // Check subscription
    if (new Date(profile.subscription_expires_at) < new Date()) {
      setCodeError('Your subscription has expired. Please contact us to renew.')
      setChecking(false); return
    }

    // Save to session
    sessionStorage.setItem('arcadeTeacher', JSON.stringify(profile))
    setTeacher(profile)
    setLoginStep('dashboard')
    loadGames(profile.arcade_slug)
    setChecking(false)
  }

  const loadGames = async (slug: string) => {
    setLoadingGames(true)
    const { data } = await supabase
      .from('custom_games')
      .select('*')
      .eq('teacher_slug', slug)
      .order('created_at', { ascending: false })
    setGames(data || [])
    setLoadingGames(false)
  }

  const toggleGameStatus = async (gameId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    await supabase.from('custom_games').update({ status: newStatus }).eq('id', gameId)
    setGames(prev => prev.map(g => g.id === gameId ? { ...g, status: newStatus } : g))
  }

  const deleteGame = async (gameId: string) => {
    if (!confirm('Delete this game? This cannot be undone.')) return
    setDeletingGame(gameId)
    await supabase.from('custom_games').delete().eq('id', gameId)
    setGames(prev => prev.filter(g => g.id !== gameId))
    setDeletingGame(null)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('arcadeTeacher')
    setTeacher(null)
    setLoginStep('login')
    setCode('')
    setGames([])
  }

  const daysLeft = teacher ? Math.max(0, Math.ceil((new Date(teacher.subscription_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0

  const gameTypeLabel: Record<string, string> = {
    vocab_blast: '🎯 Vocab Blast',
    quiz_master: '📝 Quiz Master',
    true_or_false: '✅ True or False',
    picture_quiz: '🖼️ Picture Quiz',
  }

  // ── LOGIN SCREEN ──────────────────────────────────────────
  if (loginStep === 'login') return (
    <main style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🕹️</div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '900', margin: '0 0 8px' }}>Teacher Arcade</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>Enter your activation code to access your dashboard</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>Sign In with Your Code</h2>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
            Use the <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#f59e0b' }}>TCH-XXXX-XXXX</span> code you received after payment.
          </p>

          <input
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="TCH-XXXX-XXXX"
            maxLength={13}
            style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: `2px solid ${codeError ? '#ef4444' : '#e5e7eb'}`, fontSize: '20px', fontFamily: 'monospace', fontWeight: '800', outline: 'none', boxSizing: 'border-box', letterSpacing: '2px', textAlign: 'center', color: '#1a1a2e', background: '#f9fafb', marginBottom: '8px' }}
          />
          {codeError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px', textAlign: 'center' }}>{codeError}</p>}

          <button onClick={handleLogin} disabled={checking || !code.trim()}
            style={{ width: '100%', background: checking || !code.trim() ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: checking || !code.trim() ? '#9ca3af' : '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: checking || !code.trim() ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
            {checking ? 'Checking...' : '🕹️ Enter My Arcade →'}
          </button>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
            <Link href="/arcade/activate" style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
              New teacher? Activate your code here →
            </Link>
            <a href="https://wa.me/66871033821" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', fontSize: '12px', textDecoration: 'none' }}>
              Don&apos;t have a code? Contact us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  )

  // ── DASHBOARD ─────────────────────────────────────────────
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '20px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ fontSize: '36px' }}>🕹️</div>
            <div>
              <div style={{ color: 'white', fontWeight: '900', fontSize: '20px' }}>{teacher?.display_name}&apos;s Arcade</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                arcade/{teacher?.arcade_slug} ·
                <span style={{ color: daysLeft > 7 ? '#34d399' : '#fbbf24', fontWeight: '700' }}> {daysLeft} days left</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href={`/arcade/${teacher?.arcade_slug}`} target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '13px', border: '1px solid rgba(255,255,255,0.2)' }}>
              👁 View My Arcade
            </a>
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Games', value: games.length, icon: '🎮', color: '#f59e0b' },
            { label: 'Active Games', value: games.filter(g => g.status === 'active').length, icon: '✅', color: '#22c55e' },
            { label: 'Total Plays', value: games.reduce((sum, g) => sum + (g.play_count || 0), 0), icon: '🎯', color: '#3b82f6' },
            { label: 'Days Left', value: daysLeft, icon: '📅', color: daysLeft > 7 ? '#22c55e' : '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${stat.color}20` }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* MY ARCADE URL */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: '#92400e', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>🔗 Your Student Arcade URL</div>
            <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '900', color: '#1a1a2e' }}>jobsinthailand.net/arcade/{teacher?.arcade_slug}</div>
            <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>Share this with your students so they can find and play your games</div>
          </div>
          <button onClick={() => navigator.clipboard.writeText(`https://www.jobsinthailand.net/arcade/${teacher?.arcade_slug}`).then(() => alert('Link copied!'))}
            style={{ background: '#fffbeb', color: '#92400e', border: '2px solid #fde68a', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
            📋 Copy Link
          </button>
        </div>

        {/* CREATE NEW GAME */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' }}>My Games</h2>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{games.length} game{games.length !== 1 ? 's' : ''} created</p>
          </div>
          <Link href={`/arcade/builder?slug=${teacher?.arcade_slug}`}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '15px', boxShadow: '0 4px 14px rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ➕ Create New Game
          </Link>
        </div>

        {/* GAME LIST */}
        {loadingGames ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', color: '#888' }}>Loading your games...</div>
        ) : games.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px dashed #fde68a' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎮</div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>No games yet!</h3>
            <p style={{ color: '#888', fontSize: '15px', marginBottom: '24px' }}>Create your first game and share it with your class.</p>
            <Link href={`/arcade/builder?slug=${teacher?.arcade_slug}`}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
              ➕ Build My First Game
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {games.map(game => (
              <div key={game.id} style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: game.status === 'active' ? '2px solid #d9f99d' : '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '800', fontSize: '17px', color: '#1a1a2e' }}>{game.title}</span>
                      <span style={{ background: game.status === 'active' ? '#d9f99d' : game.status === 'paused' ? '#fef9c3' : '#f3f4f6', color: game.status === 'active' ? '#365314' : game.status === 'paused' ? '#713f12' : '#555', fontSize: '11px', fontWeight: '800', padding: '2px 10px', borderRadius: '20px' }}>
                        {game.status === 'active' ? '🟢 Live' : game.status === 'paused' ? '⏸ Paused' : '📝 Draft'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ background: '#fffbeb', color: '#92400e', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>{gameTypeLabel[game.game_type] || game.game_type}</span>
                      <span style={{ background: '#f0f4ff', color: '#2D6BE4', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                        {Array.isArray(game.questions) ? game.questions.length : 0} questions
                      </span>
                      <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                        ⏱ {game.timer_seconds}s timer
                      </span>
                      <span style={{ background: '#f3f4f6', color: '#555', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                        🎯 {game.play_count || 0} plays
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flexShrink: 0 }}>
                    <button onClick={() => toggleGameStatus(game.id, game.status)}
                      style={{ background: game.status === 'active' ? '#fef9c3' : '#d9f99d', color: game.status === 'active' ? '#713f12' : '#365314', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                      {game.status === 'active' ? '⏸ Pause' : '🟢 Go Live'}
                    </button>
                    <Link href={`/arcade/builder?slug=${teacher?.arcade_slug}&game=${game.id}`}
                      style={{ background: '#e0f2fe', color: '#0369a1', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>
                      ✏️ Edit
                    </Link>
                    {game.status === 'active' && (
                      <a href={`/arcade/${teacher?.arcade_slug}`} target="_blank" rel="noopener noreferrer"
                        style={{ background: '#f59e0b', color: '#1a1a2e', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>
                        ▶ Play
                      </a>
                    )}
                    <button onClick={() => deleteGame(game.id)} disabled={deletingGame === game.id}
                      style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                      {deletingGame === game.id ? '...' : '🗑'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBSCRIPTION NOTICE */}
        {daysLeft <= 7 && daysLeft > 0 && (
          <div style={{ marginTop: '24px', background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '32px' }}>⚠️</div>
            <div>
              <div style={{ fontWeight: '800', color: '#92400e', marginBottom: '4px' }}>Subscription expiring in {daysLeft} days</div>
              <div style={{ color: '#a16207', fontSize: '13px' }}>Contact us on WhatsApp to renew and keep your games active.</div>
            </div>
            <a href="https://wa.me/66871033821" target="_blank" rel="noopener noreferrer"
              style={{ background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '14px', flexShrink: 0, marginLeft: 'auto' }}>
              💬 Renew
            </a>
          </div>
        )}

      </div>
    </main>
  )
}
