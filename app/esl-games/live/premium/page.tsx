'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'

// ─── GAME DATA ────────────────────────────────────────────────────────────────

const KG_CATEGORIES = [
  {
    id: 'numbers', title: 'Numbers & Shapes', emoji: '🔢', color: '#f59e0b',
    games: [
      { slug: 'count-match', emoji: '🔢', title: 'Count & Match', desc: 'Count the objects and find the right number!', color: '#f59e0b' },
      { slug: 'numbers',     emoji: '🔟', title: 'Numbers',       desc: 'Count from 1 to 10 with big visual cards.',   color: '#3b82f6' },
      { slug: 'shapes',      emoji: '🔷', title: 'Shapes',         desc: 'Circles, squares, triangles and more!',       color: '#a855f7' },
      { slug: 'colours',     emoji: '🌈', title: 'Colours',        desc: 'Learn all the colours with bright visuals.',  color: '#ec4899' },
    ],
  },
  {
    id: 'world', title: 'The World Around Me', emoji: '🌍', color: '#22c55e',
    games: [
      { slug: 'weather',    emoji: '⛅', title: 'Weather Watch',  desc: 'Sunny, rainy, snowy or stormy?',              color: '#0ea5e9' },
      { slug: 'transport',  emoji: '🚗', title: 'Transport',      desc: 'Cars, buses, planes, trains and boats!',      color: '#3b82f6' },
      { slug: 'nature',     emoji: '🌳', title: 'Nature',         desc: 'Trees, flowers, sun and moon!',               color: '#22c55e' },
      { slug: 'food-fruit', emoji: '🍎', title: 'Food & Fruit',   desc: 'Fruits, vegetables and food from pictures!',  color: '#ef4444' },
      { slug: 'sea',        emoji: '🌊', title: 'Sea Creatures',  desc: 'Fish, sharks, dolphins, crabs and more!',     color: '#0ea5e9' },
    ],
  },
  {
    id: 'people', title: 'People & Family', emoji: '👨‍👩‍👧', color: '#ec4899',
    games: [
      { slug: 'family',     emoji: '👨‍👩‍👧', title: 'My Family',  desc: 'Mum, Dad, Sister, Brother and more!',        color: '#ec4899' },
      { slug: 'body-parts', emoji: '👁️',  title: 'Body Parts', desc: 'Head, shoulders, knees and toes!',             color: '#22c55e' },
      { slug: 'emotions',   emoji: '😊',  title: 'Emotions',   desc: 'Happy, sad, angry, scared and more!',          color: '#f59e0b' },
      { slug: 'clothes',    emoji: '👗',  title: 'Clothes',    desc: 'Shirts, shoes, hats and coats!',               color: '#ec4899' },
    ],
  },
  {
    id: 'language', title: 'Words & Language', emoji: '🔤', color: '#f97316',
    games: [
      { slug: 'school', emoji: '🏫', title: 'School Items', desc: 'Pencils, books, bags and scissors!', color: '#f97316' },
      { slug: 'rooms',  emoji: '🏠', title: 'Rooms',        desc: 'Bedroom, kitchen, bathroom and more!', color: '#0ea5e9' },
    ],
  },
]

const PRATHOM_CATEGORIES = [
  {
    id: 'english', title: 'English Language', emoji: '📖', color: '#7C3AED',
    games: [
      { slug: 'english',  emoji: '🔤', title: 'English Quiz',  desc: 'Grammar, vocabulary and language for P1–P6.',  color: '#7C3AED' },
      { slug: 'spelling', emoji: '✏️', title: 'Spelling Bee',  desc: 'See the definition — pick the correct spelling!', color: '#db2777' },
    ],
  },
  {
    id: 'maths', title: 'Mathematics', emoji: '🔢', color: '#2D6BE4',
    games: [
      { slug: 'maths', emoji: '🔢', title: 'Maths Quiz', desc: 'Numbers, operations, geometry and problem solving.', color: '#2D6BE4' },
    ],
  },
  {
    id: 'science', title: 'Science & Nature', emoji: '🔬', color: '#16a34a',
    games: [
      { slug: 'science', emoji: '🔬', title: 'Science Quiz',   desc: 'Biology, physics, chemistry and earth science.', color: '#16a34a' },
      { slug: 'animal',  emoji: '🐾', title: 'Animal Kingdom', desc: 'Animal vocabulary, habitats and wildlife.',       color: '#16a34a' },
    ],
  },
  {
    id: 'social', title: 'Social Studies', emoji: '🌍', color: '#0891b2',
    games: [
      { slug: 'social', emoji: '🌍', title: 'Social Studies Quiz',   desc: 'Geography, history, culture and citizenship.', color: '#0891b2' },
      { slug: 'food',   emoji: '🍕', title: 'Food Around the World', desc: 'Food vocabulary and world cuisines.',           color: '#f59e0b' },
    ],
  },
  {
    id: 'general', title: 'General Knowledge', emoji: '🌟', color: '#E85D26',
    games: [
      { slug: 'general', emoji: '🌟', title: 'General Knowledge', desc: 'Fun facts, world records, animals and more!',     color: '#E85D26' },
      { slug: 'sports',  emoji: '🏅', title: 'Sports & Games',    desc: 'Sports vocabulary, rules and competition.',        color: '#2D6BE4' },
      { slug: 'house',   emoji: '🏠', title: 'Around the House',  desc: 'Rooms, furniture and household vocabulary.',       color: '#0d9488' },
    ],
  },
]

const MATTHAYOM_CATEGORIES = [
  {
    id: 'english', title: 'English Language', emoji: '📖', color: '#7C3AED',
    games: [
      { slug: 'english',   emoji: '🔤', title: 'English Quiz',         desc: 'Grammar, vocabulary and literature for M1–M3.', color: '#7C3AED' },
      { slug: 'grammar',   emoji: '✏️', title: 'Grammar Challenge',    desc: 'Choose the correct sentence in context.',        color: '#7C3AED' },
      { slug: 'idioms',    emoji: '🗣️', title: 'Idioms & Phrases',     desc: 'Master common English expressions.',             color: '#0d9488' },
      { slug: 'synonyms',  emoji: '🔁', title: 'Synonyms & Antonyms',  desc: 'Same meaning or opposite? Build vocabulary.',    color: '#E85D26' },
      { slug: 'spelling',  emoji: '✏️', title: 'Spelling Bee',         desc: 'See the definition — pick the correct spelling!', color: '#db2777' },
    ],
  },
  {
    id: 'maths', title: 'Mathematics', emoji: '🔢', color: '#2D6BE4',
    games: [
      { slug: 'maths', emoji: '🔢', title: 'Maths Quiz', desc: 'Numbers, operations, geometry and problem solving.', color: '#2D6BE4' },
    ],
  },
  {
    id: 'science', title: 'Science', emoji: '🔬', color: '#16a34a',
    games: [
      { slug: 'science',     emoji: '🔬', title: 'Science Quiz', desc: 'Biology, physics, chemistry and earth science.', color: '#16a34a' },
      { slug: 'electricity', emoji: '⚡', title: 'Electricity',   desc: 'Electric current, circuits and conductors.',     color: '#f59e0b' },
    ],
  },
  {
    id: 'social', title: 'Social Studies', emoji: '🌍', color: '#0891b2',
    games: [
      { slug: 'social', emoji: '🌍', title: 'Social Studies Quiz', desc: 'Geography, history, culture and citizenship.', color: '#0891b2' },
    ],
  },
  {
    id: 'general', title: 'General Knowledge', emoji: '🌟', color: '#E85D26',
    games: [
      { slug: 'general', emoji: '🌟', title: 'General Knowledge',    desc: 'Fun facts, world records, animals and more!', color: '#E85D26' },
      { slug: 'sports',  emoji: '🏅', title: 'Sports & Games',       desc: 'Sports vocabulary, rules and competition.',   color: '#2D6BE4' },
      { slug: 'food',    emoji: '🍕', title: 'Food Around the World', desc: 'Food vocabulary and world cuisines.',          color: '#f59e0b' },
      { slug: 'animal',  emoji: '🐾', title: 'Animal Kingdom',        desc: 'Animal vocabulary, habitats and wildlife.',   color: '#16a34a' },
    ],
  },
]

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function GameCard({ game }: { game: any }) {
  return (
    <Link href={`/esl-games/live/premium/${game.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', border: `2px solid ${game.color}20`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.18s', cursor: 'pointer' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${game.color}25` }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: game.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>{game.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a2e', marginBottom: '3px' }}>{game.title}</div>
          <div style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.4' }}>{game.desc}</div>
        </div>
        <div style={{ background: game.color, color: 'white', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', flexShrink: 0, whiteSpace: 'nowrap' }}>Play →</div>
      </div>
    </Link>
  )
}

function CategorySection({ cat }: { cat: any }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingBottom: '10px', borderBottom: `2px solid ${cat.color}30` }}>
        <div style={{ background: cat.color, width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{cat.emoji}</div>
        <div>
          <div style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a2e' }}>{cat.title}</div>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>{cat.games.length} game{cat.games.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {cat.games.map((game: any) => <GameCard key={game.slug} game={game} />)}
      </div>
    </div>
  )
}

// ─── LEVEL CARDS ─────────────────────────────────────────────────────────────

const LEVELS = [
  {
    id: 'kg',
    emoji: '🎒',
    title: 'Kindergarten',
    subtitle: 'Ages 3–6',
    desc: 'Visual emoji games — picture matching, vocabulary and early learning',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    shadow: 'rgba(245,158,11,0.45)',
    border: '#f59e0b',
    games: 15,
    categories: KG_CATEGORIES,
  },
  {
    id: 'prathom',
    emoji: '📚',
    title: 'Prathom',
    subtitle: 'Grades 1–6 · Ages 6–12',
    desc: 'Quiz games for English, Maths, Science, Social Studies and more',
    gradient: 'linear-gradient(135deg, #2D6BE4 0%, #7C3AED 100%)',
    shadow: 'rgba(45,107,228,0.45)',
    border: '#2D6BE4',
    games: 10,
    categories: PRATHOM_CATEGORIES,
  },
  {
    id: 'matthayom',
    emoji: '🎓',
    title: 'Matthayom',
    subtitle: 'Grades 7–9 · Ages 12–18',
    desc: 'Advanced quizzes — grammar, idioms, science and critical thinking',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
    shadow: 'rgba(13,148,136,0.45)',
    border: '#0d9488',
    games: 9,
    categories: MATTHAYOM_CATEGORIES,
  },
]

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PremiumGamesPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [sessionKicked, setSessionKicked] = useState(false)
  const [activeLevel, setActiveLevel] = useState<string | null>(null)

  useEffect(() => {
    const savedPassword = localStorage.getItem(PASSWORD_KEY)
    const savedSession = localStorage.getItem(SESSION_KEY)
    if (savedPassword && savedSession) {
      verifyExistingSession(savedPassword, savedSession)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyExistingSession = async (savedPassword: string, savedSession: string) => {
    const { data } = await supabase.from('pro_game_passwords').select('session_token, active').eq('password', savedPassword).single()
    if (!data || !data.active) { localStorage.removeItem(PASSWORD_KEY); localStorage.removeItem(SESSION_KEY); setLoading(false); return }
    if (data.session_token === savedSession) { setAuthed(true) }
    else { localStorage.removeItem(PASSWORD_KEY); localStorage.removeItem(SESSION_KEY); setSessionKicked(true) }
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!password.trim()) return
    setChecking(true); setError('')
    const { data } = await supabase.from('pro_game_passwords').select('id, active, session_token').eq('password', password.trim()).single()
    if (!data || !data.active) { setError('Invalid password. Please check and try again.'); setChecking(false); return }
    const newToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    await supabase.from('pro_game_passwords').update({ session_token: newToken, last_login: new Date().toISOString() }).eq('id', data.id)
    localStorage.setItem(PASSWORD_KEY, password.trim())
    localStorage.setItem(SESSION_KEY, newToken)
    setAuthed(true); setChecking(false)
  }

  const handleLogout = () => { localStorage.removeItem(PASSWORD_KEY); localStorage.removeItem(SESSION_KEY); setAuthed(false); setPassword('') }

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <div style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>🎮</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  )

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f2027 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}} @keyframes pulse2{0%,100%{opacity:0.3}50%{opacity:0.7}}`}</style>

      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {['🎒','📚','🎓','🎮','⭐','🏅','🔬','🔢','📖'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: `${20 + (i % 3) * 10}px`, left: `${(i * 12) % 90}%`, top: `${(i * 15) % 80}%`, opacity: 0.08, animation: `float ${3 + i % 3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}>{e}</div>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🎮</div>
          <h1 style={{ color: 'white', fontSize: '30px', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Learn & Play Games</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>Premium classroom games for every level</p>
        </div>

        {sessionKicked && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>⚠️ Signed out</p>
            <p style={{ color: '#fca5a5', fontSize: '13px', margin: 0 }}>Your password was used on another device. Please log in again.</p>
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>Enter your password</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px' }}>Already purchased? Enter your premium password below.</p>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter premium password..."
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: error ? '2px solid #ef4444' : '2px solid rgba(255,255,255,0.15)', fontSize: '15px', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '2px', marginBottom: '8px', background: 'rgba(255,255,255,0.08)', color: 'white' }} />
          {error && <p style={{ color: '#fca5a5', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <button onClick={handleLogin} disabled={checking || !password.trim()}
            style={{ width: '100%', background: checking ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #E85D26, #f97316)', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: '800', fontSize: '16px', cursor: checking ? 'not-allowed' : 'pointer', marginTop: '4px', letterSpacing: '0.3px' }}>
            {checking ? 'Checking...' : '🔓 Unlock Learn & Play'}
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '17px', marginBottom: '6px' }}>🚀 Get Premium Access</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>One-time payment of <strong style={{ color: '#f97316', fontSize: '22px' }}>฿199</strong></div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '20px' }}>Lifetime access • 34 games • New games added regularly</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
            <a href="https://line.me/ti/g2/MGV6FgMkGOdFSUeaPsHUyMf2P2hYAT5-a6f5Vg" target="_blank" rel="noopener noreferrer"
              style={{ background: '#06C755', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>💬 LINE</a>
            <a href="https://chat.whatsapp.com/L3fBobRIr7u1tSaiHBxfzv" target="_blank" rel="noopener noreferrer"
              style={{ background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>💬 WhatsApp</a>
          </div>
          <Link href="/contact" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'underline' }}>Or contact us on the website →</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', textDecoration: 'none' }}>← Back to Free Games</Link>
        </div>
      </div>
    </main>
  )

  // ── MAIN AUTHENTICATED PAGE ───────────────────────────────────────────────
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 60%, #0f2027 100%)', padding: '36px 24px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {['🎒','📚','🎓','⭐','🎮','🏅'].map((e, i) => (
            <div key={i} style={{ position: 'absolute', fontSize: '18px', left: `${(i * 18) % 92}%`, top: `${(i * 22) % 80}%`, opacity: 0.06, animation: `float ${4 + i % 2}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>{e}</div>
          ))}
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>← Free Games</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#86efac', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>✅ Premium Active</span>
              <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Logout</button>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '12px', animation: 'float 3s ease-in-out infinite' }}>🎮</div>
            <h1 style={{ color: 'white', fontSize: '34px', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Learn & Play</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: '0 0 20px' }}>Choose your level to explore games by subject</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '13px' }}>
              {[{ n: '34', l: 'Total Games' }, { n: '3', l: 'Age Groups' }, { n: '15', l: 'Categories' }].map(s => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 18px', textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: '900', fontSize: '22px' }}>{s.n}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* THREE LEVEL CARDS */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {LEVELS.map(level => (
            <div key={level.id}>
              {/* LEVEL BUTTON */}
              <button
                onClick={() => setActiveLevel(activeLevel === level.id ? null : level.id)}
                style={{
                  width: '100%', border: 'none', cursor: 'pointer', padding: '0',
                  borderRadius: activeLevel === level.id ? '20px 20px 0 0' : '20px',
                  overflow: 'hidden', transition: 'all 0.2s',
                  boxShadow: activeLevel === level.id ? `0 8px 32px ${level.shadow}` : '0 4px 16px rgba(0,0,0,0.1)',
                  transform: activeLevel === level.id ? 'translateY(-2px)' : 'translateY(0)',
                }}>
                <div style={{ background: level.gradient, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '56px', lineHeight: 1, flexShrink: 0, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>{level.emoji}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ color: 'white', fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: '4px' }}>{level.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>{level.subtitle}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', maxWidth: '360px', lineHeight: '1.4' }}>{level.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '10px 18px', textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '24px', fontWeight: '900', lineHeight: 1 }}>{level.games}</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Games</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.25)', color: 'white', padding: '8px 20px', borderRadius: '20px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {activeLevel === level.id ? '▲ Close' : '▼ Explore'}
                    </div>
                  </div>
                </div>
              </button>

              {/* EXPANDED CATEGORIES */}
              {activeLevel === level.id && (
                <div style={{ background: 'white', borderRadius: '0 0 20px 20px', padding: '28px', border: `3px solid ${level.border}`, borderTop: 'none', animation: 'slideDown 0.2s ease' }}>
                  {level.categories.map(cat => <CategorySection key={cat.id} cat={cat} />)}
                  <div style={{ marginTop: '8px', background: '#f9fafb', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px dashed #e5e7eb' }}>
                    <p style={{ color: '#9ca3af', fontWeight: '700', fontSize: '13px', margin: '0 0 4px' }}>🔔 More games coming soon!</p>
                    <p style={{ color: '#d1d5db', fontSize: '12px', margin: 0 }}>Follow our LINE or WhatsApp to be notified when new games launch.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/esl-games" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>← Browse all free ESL games</Link>
        </div>
      </div>
    </main>
  )
}
