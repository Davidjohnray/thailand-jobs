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

const kgGames = [
  {
    slug: 'count-match',
    emoji: '🔢',
    title: 'Count & Match',
    desc: 'Count the objects and find the right number! Big colourful emojis — perfect for young learners.',
    subjects: ['Numbers', 'Counting', 'Maths'],
    ages: 'KG – P1',
    questions: '20 questions',
    available: true,
    color: '#f59e0b',
  },
  {
  slug: 'body-parts',
  emoji: '👁️',
  title: 'Body Parts',
  desc: 'Head, shoulders, knees and toes! Big visual emoji cards for young learners.',
  subjects: ['Body', 'Vocabulary', 'Health'],
  ages: 'KG – P1',
  questions: '20 questions',
  available: true,
  color: '#22c55e',
},
{
  slug: 'food-fruit',
  emoji: '🍎',
  title: 'Food & Fruit',
  desc: 'Identify fruits, vegetables and food from big colourful pictures!',
  subjects: ['Food', 'Fruit', 'Vegetables'],
  ages: 'KG – P1',
  questions: '20 questions',
  available: true,
  color: '#ef4444',
},
{
  slug: 'weather',
  emoji: '⛅',
  title: 'Weather Watch',
  desc: 'Sunny, rainy, snowy or stormy? Learn weather words with a changing sky background!',
  subjects: ['Weather', 'Seasons', 'Vocabulary'],
  ages: 'KG – P1',
  questions: '20 questions',
  available: true,
  color: '#0ea5e9',
},
{
  slug: 'family',
  emoji: '👨‍👩‍👧',
  title: 'My Family',
  desc: 'Mum, Dad, Sister, Brother, Grandma and Grandpa! Learn family vocabulary with fun visuals.',
  subjects: ['Family', 'Vocabulary', 'People'],
  ages: 'KG – P1',
  questions: '20 questions',
  available: true,
  color: '#ec4899',
},
{
  slug: 'transport',
  emoji: '🚗',
  title: 'Transport',
  desc: 'Cars, buses, planes, trains and boats! Learn transport vocabulary with fun visuals.',
  subjects: ['Transport', 'Vocabulary', 'Travel'],
  ages: 'KG – P1',
  questions: '20 questions',
  available: true,
  color: '#3b82f6',
},
{
    slug: 'clothes',
    emoji: '👗',
    title: 'Clothes',
    desc: 'Shirts, shoes, hats and coats! Learn clothes vocabulary with fun visuals.',
    subjects: ['Clothes', 'Vocabulary', 'Daily Life'],
    ages: 'KG – P1',
    questions: '20 questions',
    available: true,
    color: '#ec4899',
  },
  {
    slug: 'nature',
    emoji: '🌳',
    title: 'Nature',
    desc: 'Trees, flowers, sun, moon and more! Explore the natural world.',
    subjects: ['Nature', 'Science', 'Vocabulary'],
    ages: 'KG – P1',
    questions: '20 questions',
    available: true,
    color: '#22c55e',
  },
{
  slug: 'shapes',
  emoji: '🔷',
  title: 'Shapes',
  desc: 'Circles, squares, triangles, stars and more! Learn shapes with big colourful visuals.',
  subjects: ['Shapes', 'Maths', 'Vocabulary'],
  ages: 'KG – P1',
  questions: '20 questions',
  available: true,
  color: '#a855f7',
},
]

const premiumGames = [
  { slug: 'english', emoji: '🔤', title: 'English Quiz', desc: 'Grammar, vocabulary, literature & language. Four age groups from P1 all the way to M3.', subjects: ['Grammar', 'Vocabulary', 'Literature', 'Spelling'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#7C3AED' },
  { slug: 'maths', emoji: '🔢', title: 'Maths Quiz', desc: 'Numbers, operations, geometry and problem solving across all primary levels.', subjects: ['Numbers', 'Operations', 'Geometry', 'Problem Solving'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#2D6BE4' },
  { slug: 'science', emoji: '🔬', title: 'Science Quiz', desc: 'Biology, physics, chemistry and earth science for primary school students.', subjects: ['Biology', 'Physics', 'Chemistry', 'Earth Science'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#16a34a' },
  { slug: 'social', emoji: '🌍', title: 'Social Studies Quiz', desc: 'Geography, history, culture and citizenship for young learners.', subjects: ['Geography', 'History', 'Culture', 'Citizenship'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#0891b2' },
  { slug: 'general', emoji: '🌟', title: 'General Knowledge Quiz', desc: 'Fun facts, world records, animals, food and more for all ages.', subjects: ['Fun Facts', 'Animals', 'World', 'Food'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#E85D26' },
  { slug: 'spelling', emoji: '🔤', title: 'Spelling Bee', desc: 'See the definition — pick the correct spelling! Great for building vocabulary and spelling skills.', subjects: ['Spelling', 'Vocabulary', 'Definitions', 'Word Skills'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#db2777' },
  { slug: 'idioms', emoji: '🗣️', title: 'Idioms & Phrases', desc: 'What does the idiom mean? Master common English expressions used in everyday conversation.', subjects: ['Idioms', 'Phrases', 'Expressions', 'Vocabulary'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#0d9488' },
  { slug: 'food', emoji: '🍕', title: 'Food Around the World', desc: 'Food vocabulary, cooking methods, world cuisines and kitchen English.', subjects: ['Food Vocabulary', 'Cooking English', 'World Cuisine', 'Kitchen Terms'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#f59e0b' },
  { slug: 'animal', emoji: '🐾', title: 'Animal Kingdom', desc: 'Animal vocabulary, habitats, groups and wildlife English for ESL learners.', subjects: ['Animals', 'Vocabulary', 'Nature', 'Science'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#16a34a' },
  { slug: 'sports', emoji: '🏅', title: 'Sports & Games', desc: 'Sports vocabulary, rules, tactics and competition English for ESL learners.', subjects: ['Sports', 'Vocabulary', 'Rules', 'Competition'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#2D6BE4' },
  { slug: 'grammar', emoji: '✏️', title: 'Grammar Challenge', desc: 'Choose the correct sentence — grammar in context for ESL learners.', subjects: ['Grammar', 'Sentence Structure', 'Tenses', 'English Rules'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#7C3AED' },
  { slug: 'synonyms', emoji: '🔁', title: 'Synonyms & Antonyms', desc: 'Same meaning or opposite? Build vocabulary through synonyms and antonyms.', subjects: ['Vocabulary', 'Synonyms', 'Antonyms', 'Word Building'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#E85D26' },
  { slug: 'house', emoji: '🏠', title: 'Around the House', desc: 'Rooms, furniture and household vocabulary for ESL learners.', subjects: ['Rooms', 'Furniture', 'Vocabulary', 'Daily Life'], ages: 'P1 – M3', questions: '20 questions', available: true, color: '#0d9488' },
]

function GameCard({ game, isKg = false }: { game: typeof premiumGames[0], isKg?: boolean }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: game.available ? `2px solid ${game.color}` : '1px solid #eee', opacity: game.available ? 1 : 0.85 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ fontSize: '44px', flexShrink: 0 }}>{game.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{game.title}</h3>
              {game.available ? (
                <span style={{ background: game.color, color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '2px 10px', borderRadius: '20px' }}>✓ Available Now</span>
              ) : (
                <span style={{ background: '#f0f0f0', color: '#888', fontSize: '11px', fontWeight: 'bold', padding: '2px 10px', borderRadius: '20px' }}>⏳ Coming Soon</span>
              )}
            </div>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px', lineHeight: '1.5' }}>{game.desc}</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {game.subjects.map(s => (
                <span key={s} style={{ background: isKg ? '#fef3c7' : '#f0f4ff', color: isKg ? '#92400e' : '#2D6BE4', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px' }}>{s}</span>
              ))}
              <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px' }}>👥 {game.ages}</span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px' }}>❓ {game.questions}</span>
            </div>
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          {game.available ? (
            <Link href={`/esl-games/live/premium/${game.slug}`}
              style={{ background: game.color, color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', whiteSpace: 'nowrap' }}>
              Play Now →
            </Link>
          ) : (
            <div style={{ background: '#f0f0f0', color: '#aaa', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PremiumGamesPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [sessionKicked, setSessionKicked] = useState(false)
  const [activeTab, setActiveTab] = useState<'kg' | 'prathom' | 'none'>('prathom')

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
    setChecking(true)
    setError('')
    const { data } = await supabase.from('pro_game_passwords').select('id, active, session_token').eq('password', password.trim()).single()
    if (!data || !data.active) { setError('Invalid password. Please check your password and try again.'); setChecking(false); return }
    const newToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    await supabase.from('pro_game_passwords').update({ session_token: newToken, last_login: new Date().toISOString() }).eq('id', data.id)
    localStorage.setItem(PASSWORD_KEY, password.trim())
    localStorage.setItem(SESSION_KEY, newToken)
    setAuthed(true)
    setChecking(false)
  }

  const handleLogout = () => { localStorage.removeItem(PASSWORD_KEY); localStorage.removeItem(SESSION_KEY); setAuthed(false); setPassword('') }

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <p style={{ color: '#888' }}>Loading...</p>
    </main>
  )

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎮</div>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>Premium Live Games</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>Exclusive classroom games for ESL teachers</p>
        </div>

        {sessionKicked && (
          <div style={{ background: '#ffeaea', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ color: '#c62828', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>⚠️ You have been signed out</p>
            <p style={{ color: '#c62828', fontSize: '13px', margin: 0 }}>Your password was used on another device. Please log in again.</p>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>Enter your password</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>Already purchased? Enter your unique premium password below.</p>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter premium password..."
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: error ? '2px solid red' : '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '2px', marginBottom: '8px' }} />
          {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <button onClick={handleLogin} disabled={checking || !password.trim()}
            style={{ width: '100%', background: checking ? '#ccc' : '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: checking ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
            {checking ? 'Checking...' : '🔓 Unlock Premium Games'}
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>🚀 Get Premium Access</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '6px' }}>One-time payment of <strong style={{ color: '#E85D26', fontSize: '20px' }}>฿199</strong></div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '20px' }}>Lifetime access • Unique password • New games added regularly</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
            <a href="https://line.me/ti/g2/MGV6FgMkGOdFSUeaPsHUyMf2P2hYAT5-a6f5Vg" target="_blank" rel="noopener noreferrer"
              style={{ background: '#06C755', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>💬 Contact via LINE</a>
            <a href="https://chat.whatsapp.com/L3fBobRIr7u1tSaiHBxfzv" target="_blank" rel="noopener noreferrer"
              style={{ background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>💬 Contact via WhatsApp</a>
          </div>
          <Link href="/contact" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'underline' }}>Or send us a message on the website →</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>← Back to Free Games</Link>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '900px', margin: '0 auto 24px' }}>
          <Link href="/esl-games/live" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← Free Games</Link>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Logout</button>
        </div>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎮</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px' }}>Premium Live Games</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', margin: '0 0 16px' }}>Interactive ESL games for every classroom — KG through Matthayom</p>
        <div style={{ display: 'inline-block', background: '#E85D26', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
          ✅ Premium Access Active
        </div>
      </div>

      {/* TWO SECTION BUTTONS + CONTENT */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* KG BUTTON */}
        <button onClick={() => setActiveTab(activeTab === 'kg' ? 'none' : 'kg')}
          style={{
            width: '100%', padding: '20px 28px', border: '3px solid',
            borderColor: activeTab === 'kg' ? '#f59e0b' : '#e5e7eb',
            background: activeTab === 'kg' ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'white',
            color: activeTab === 'kg' ? 'white' : '#374151',
            fontWeight: '800', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: activeTab === 'kg' ? '0 6px 20px rgba(245,158,11,0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.2s', marginBottom: activeTab === 'kg' ? '0' : '12px',
            borderRadius: activeTab === 'kg' ? '16px 16px 0 0' : '16px',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🧒</span>
            <div style={{ textAlign: 'left' }}>
              <div>Kindergarten Games</div>
              <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.85 }}>Visual emoji games for ages 4–7 • {kgGames.filter(g => g.available).length} available</div>
            </div>
          </div>
          <span style={{ fontSize: '20px', transition: 'transform 0.2s', transform: activeTab === 'kg' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>

        {/* KG CONTENT */}
        {activeTab === 'kg' && (
          <div style={{ background: '#fffbeb', border: '3px solid #f59e0b', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '24px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {kgGames.map(game => (
                <GameCard key={game.slug} game={game} isKg={true} />
              ))}
            </div>
            <div style={{ marginTop: '20px', background: 'white', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #fcd34d' }}>
              <p style={{ color: '#92400e', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>🎨 More kindergarten games coming soon!</p>
              <p style={{ color: '#78350f', fontSize: '13px', margin: 0 }}>Visual emoji-based games designed specifically for young learners.</p>
            </div>
          </div>
        )}

        {/* PRATHOM BUTTON */}
        <button onClick={() => setActiveTab(activeTab === 'prathom' ? 'none' : 'prathom')}
          style={{
            width: '100%', padding: '20px 28px', border: '3px solid',
            borderColor: activeTab === 'prathom' ? '#E85D26' : '#e5e7eb',
            background: activeTab === 'prathom' ? 'linear-gradient(135deg, #E85D26, #f97316)' : 'white',
            color: activeTab === 'prathom' ? 'white' : '#374151',
            fontWeight: '800', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: activeTab === 'prathom' ? '0 6px 20px rgba(232,93,38,0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.2s',
            borderRadius: activeTab === 'prathom' ? '16px 16px 0 0' : '16px',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>📚</span>
            <div style={{ textAlign: 'left' }}>
              <div>Prathom & Matthayom Games</div>
              <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.85 }}>Quiz games for P1 through M3 • {premiumGames.filter(g => g.available).length} available</div>
            </div>
          </div>
          <span style={{ fontSize: '20px', transition: 'transform 0.2s', transform: activeTab === 'prathom' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>

        {/* PRATHOM CONTENT */}
        {activeTab === 'prathom' && (
          <div style={{ background: '#fff7f3', border: '3px solid #E85D26', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '24px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {premiumGames.map(game => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
            <div style={{ marginTop: '20px', background: 'white', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #fed7aa' }}>
              <p style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>🔔 More games coming soon!</p>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Follow our LINE or WhatsApp community to be notified when new games launch.</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/esl-games" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
            ← Browse all free ESL games
          </Link>
        </div>
      </div>
    </main>
  )
}
