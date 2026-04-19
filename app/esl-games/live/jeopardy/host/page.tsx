'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../../src/lib/supabase'
import { buildBoard, POINT_VALUES, BoardState } from '../questions'

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const CAT_COLORS = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a', '#f59e0b']

export default function JeopardyHostPage() {
  const [boardState, setBoardState] = useState<BoardState>(() => buildBoard())
  const [roomCode] = useState(() => generateCode())
  const [phase, setPhase] = useState<'lobby' | 'playing' | 'finished'>('lobby')
  const [players, setPlayers] = useState<any[]>([])
  const [view, setView] = useState<'board' | 'question' | 'revealed'>('board')
  const [buzzers, setBuzzers] = useState<any[]>([])
  const [tileScore, setTileScore] = useState(0)

  async function saveBoardState(state: BoardState) {
    await supabase.from('live_game_rooms')
      .update({ question_order: JSON.stringify(state) })
      .eq('code', roomCode)
  }

  async function clearRoom() {
    await supabase.from('live_game_answers').delete().eq('room_code', roomCode)
    await supabase.from('live_game_players').delete().eq('room_code', roomCode)
    await supabase.from('live_game_rooms').delete().eq('code', roomCode)
    window.location.href = '/esl-games/live/jeopardy'
  }

  // Create room
  useEffect(() => {
    supabase.from('live_game_rooms').insert([{
      code: roomCode,
      game_type: 'jeopardy',
      topic: 'Mixed',
      status: 'waiting',
      current_question: 0,
      question_order: JSON.stringify(boardState),
    }]).then(({ error }: any) => {
      if (error) console.error('Room error:', error.message)
    })
  }, [])

  // Poll players
  useEffect(() => {
    const fetch = async () => {
      const { data }: any = await supabase.from('live_game_players').select('*').eq('room_code', roomCode)
      setPlayers(data || [])
    }
    fetch()
    const interval = setInterval(fetch, 2000)
    return () => clearInterval(interval)
  }, [roomCode])

  // Poll buzzers when question is active
  useEffect(() => {
    if (phase !== 'playing' || view === 'board' || !boardState.currentTile) return
    const tileIndex = boardState.currentTile.cat * 5 + boardState.currentTile.row
    const fetch = async () => {
      const { data }: any = await supabase
        .from('live_game_answers')
        .select('*')
        .eq('room_code', roomCode)
        .eq('question_index', tileIndex)
        .order('answered_at', { ascending: true })
      setBuzzers(data || [])
    }
    fetch()
    const interval = setInterval(fetch, 1000)
    return () => clearInterval(interval)
  }, [phase, view, boardState.currentTile, roomCode])

  async function startGame() {
    await supabase.from('live_game_rooms').update({ status: 'playing' }).eq('code', roomCode)
    setPhase('playing')
  }

  async function selectTile(cat: number, row: number) {
    const key = `${cat}-${row}`
    if (boardState.used.includes(key)) return
    const q = boardState.board[cat][row]
    const isDaily = boardState.dailyDouble === key
    const pts = isDaily ? q.points * 2 : q.points
    setTileScore(pts)
    setBuzzers([])
    const newState = { ...boardState, currentTile: { cat, row }, buzzPhase: true }
    setBoardState(newState)
    await saveBoardState(newState)
    setView('question')
  }

  async function markCorrect(playerId: string) {
    const player = players.find((p: any) => p.id === playerId)
    if (player) {
      const newScore = (player.score || 0) + tileScore
      await supabase.from('live_game_players').update({ score: newScore }).eq('id', playerId)
      setPlayers(prev => prev.map((p: any) => p.id === playerId ? { ...p, score: newScore } : p))
    }
    await closeTile()
  }

  async function markWrong() {
    await closeTile()
  }

  async function closeTile() {
    const key = `${boardState.currentTile!.cat}-${boardState.currentTile!.row}`
    const newUsed = [...boardState.used, key]
    const newState = { ...boardState, currentTile: null, buzzPhase: false, used: newUsed }
    setBoardState(newState)
    await saveBoardState(newState)
    setBuzzers([])
    setView('board')
    if (newUsed.length === 25) {
      await supabase.from('live_game_rooms').update({ status: 'finished' }).eq('code', roomCode)
      setPhase('finished')
    }
  }

  const sorted = [...players].sort((a: any, b: any) => b.score - a.score)

  // LOBBY
  if (phase === 'lobby') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link href="/esl-games/live/jeopardy" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Jeopardy Lobby</h1>
            <p style={{ color: '#666', fontSize: '15px', margin: '0 0 32px' }}>Share this code with your students</p>
            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Room Code</p>
              <div style={{ color: 'white', fontSize: '72px', fontWeight: 'bold', letterSpacing: '12px', lineHeight: 1 }}>{roomCode}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '16px 0 0' }}>Students go to <strong style={{ color: 'white' }}>jobsinthailand.net/play</strong></p>
            </div>
            <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>👥 Players: {players.length}</span>
                <span style={{ background: '#7C3AED', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>5 Categories • 25 Tiles</span>
              </div>
              {players.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Waiting for players...</p>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {players.map((p: any) => (
                    <span key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '5px 14px', fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{p.nickname}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={startGame} disabled={players.length === 0}
              style={{ background: players.length > 0 ? '#16a34a' : '#cbd5e1', color: 'white', padding: '14px 48px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: players.length > 0 ? 'pointer' : 'default', width: '100%' }}>
              {players.length === 0 ? 'Waiting for players...' : `Start Game with ${players.length} player${players.length > 1 ? 's' : ''} →`}
            </button>
            <button onClick={clearRoom} style={{ background: 'transparent', color: '#888', padding: '10px', border: 'none', fontSize: '14px', cursor: 'pointer', marginTop: '8px', width: '100%' }}>✕ Cancel</button>
          </div>
        </div>
      </main>
    )
  }

  // FINISHED
  if (phase === 'finished') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: '0 0 32px' }}>Final Scores!</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {sorted.map((p: any, i: number) => (
              <div key={p.id} style={{ background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '28px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '18px', flex: 1, textAlign: 'left' }}>{p.nickname}</span>
                <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '22px' }}>{(p.score || 0).toLocaleString()} pts</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={clearRoom} style={{ background: '#7C3AED', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>🔄 New Game</button>
            <Link href="/esl-games/live" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Back to Games</Link>
          </div>
        </div>
      </main>
    )
  }

  // QUESTION VIEW
  if (view === 'question' || view === 'revealed') {
    const tile = boardState.currentTile!
    const q = boardState.board[tile.cat][tile.row]
    const isDaily = boardState.dailyDouble === `${tile.cat}-${tile.row}`
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '20px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ background: CAT_COLORS[tile.cat], color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>{boardState.categories[tile.cat]}</span>
              <span style={{ background: '#fbbf24', color: '#1a1a2e', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                {isDaily ? `⭐ DAILY DOUBLE — ${tileScore} pts` : `${tileScore} pts`}
              </span>
            </div>
            <button onClick={() => closeTile()} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Skip Tile
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              {isDaily && (
                <div style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', borderRadius: '12px', padding: '12px', textAlign: 'center', marginBottom: '16px' }}>
                  <p style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>⭐ DAILY DOUBLE — Correct = {tileScore} points!</p>
                </div>
              )}
              <div style={{ background: '#f8faff', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '14px', margin: '0 0 10px' }}>For {tileScore} points...</p>
                <p style={{ color: '#1a1a2e', fontSize: '22px', fontWeight: 'bold', margin: 0, lineHeight: '1.5' }}>{q.question}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {q.options.map((opt, i) => (
                  <div key={i} style={{ background: view === 'revealed' && opt === q.answer ? '#dcfce7' : '#f8f9fa', border: `2px solid ${view === 'revealed' && opt === q.answer ? '#16a34a' : '#e2e8f0'}`, borderRadius: '10px', padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '15px', color: view === 'revealed' && opt === q.answer ? '#15803d' : '#444' }}>
                    {opt} {view === 'revealed' && opt === q.answer && '✅'}
                  </div>
                ))}
              </div>
              {view === 'question' && (
                <button onClick={() => setView('revealed')} style={{ width: '100%', background: '#1a1a2e', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  💡 Reveal Answer
                </button>
              )}
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px', textAlign: 'center' }}>🔔 Buzz Order</h3>
              {buzzers.length === 0 ? (
                <p style={{ color: '#888', fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>Waiting for students to buzz in...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {buzzers.map((b: any, i: number) => {
                    const player = players.find((p: any) => p.id === b.player_id)
                    return (
                      <div key={b.id} style={{ background: i === 0 ? '#f0fdf4' : '#f8f9fa', border: `1px solid ${i === 0 ? '#16a34a' : '#e2e8f0'}`, borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{i === 0 ? '🥇' : `${i + 1}.`}</span>
                        <span style={{ flex: 1, fontWeight: '600', fontSize: '14px', color: '#1a1a2e' }}>{player?.nickname || 'Unknown'}</span>
                        {i === 0 && view === 'revealed' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => markCorrect(b.player_id)} style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>✅</button>
                            <button onClick={markWrong} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>❌</button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {view === 'revealed' && buzzers.length === 0 && (
                <button onClick={markWrong} style={{ width: '100%', background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}>
                  No one answered — skip
                </button>
              )}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#888', margin: '0 0 8px' }}>Scores</h4>
                {[...players].sort((a: any, b: any) => b.score - a.score).map((p: any, i: number) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                    <span style={{ color: '#444' }}>{i + 1}. {p.nickname}</span>
                    <span style={{ fontWeight: 'bold', color: '#7C3AED' }}>{(p.score || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // BOARD VIEW
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '20px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Room: {roomCode}</span>
            <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>👥 {players.length}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ background: '#fff3ed', color: '#E85D26', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>{boardState.used.length}/25 used</span>
            <button onClick={clearRoom} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>✕ End</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {boardState.categories.map((cat, catI) => (
            <div key={catI} style={{ background: CAT_COLORS[catI], borderRadius: '10px', padding: '12px 8px', textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: '13px', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cat}
            </div>
          ))}
          {POINT_VALUES.map((pts, rowI) =>
            boardState.categories.map((_, catI) => {
              const key = `${catI}-${rowI}`
              const isUsed = boardState.used.includes(key)
              const isDaily = boardState.dailyDouble === key
              return (
                <button key={key} onClick={() => selectTile(catI, rowI)} disabled={isUsed}
                  style={{
                    background: isUsed ? '#f0f0f0' : 'white',
                    border: isDaily && !isUsed ? `3px solid #fbbf24` : '3px solid #e2e8f0',
                    borderRadius: '10px', padding: '12px 8px', cursor: isUsed ? 'default' : 'pointer',
                    color: isUsed ? '#ccc' : '#1a1a2e',
                    fontWeight: 'bold', fontSize: '20px', textAlign: 'center',
                    boxShadow: isUsed ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s', minHeight: '64px',
                  }}
                  onMouseEnter={e => { if (!isUsed) { e.currentTarget.style.background = '#f0f4ff'; e.currentTarget.style.borderColor = '#2D6BE4' } }}
                  onMouseLeave={e => { if (!isUsed) { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = isDaily ? '#fbbf24' : '#e2e8f0' } }}>
                  {isUsed ? '✓' : isDaily ? '⭐' : pts}
                </button>
              )
            })
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#888', margin: '0 0 10px' }}>LEADERBOARD</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[...players].sort((a: any, b: any) => b.score - a.score).map((p: any, i: number) => (
              <div key={p.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '16px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a2e' }}>{p.nickname}</span>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#7C3AED' }}>{(p.score || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}