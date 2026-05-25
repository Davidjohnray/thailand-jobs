'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const SESSION_KEY = 'premium_games_session'

const MODES = [
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#0ea5e9' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#8b5cf6' },
]

const VOCAB = [
  { emoji: '🛏️', word: 'BEDROOM', spelling: 'B – E – D – R – O – O – M', sentence: 'I sleep in my bedroom.', tip: 'The bedroom is where you sleep at night.' },
  { emoji: '🍳', word: 'KITCHEN', spelling: 'K – I – T – C – H – E – N', sentence: 'Mum cooks in the kitchen.', tip: 'The kitchen is where food is cooked.' },
  { emoji: '🚿', word: 'BATHROOM', spelling: 'B – A – T – H – R – O – O – M', sentence: 'I wash my hair in the bathroom.', tip: 'The bathroom is where you shower and brush your teeth.' },
  { emoji: '🛋️', word: 'LIVING ROOM', spelling: 'L – I – V – I – N – G  R – O – O – M', sentence: 'We watch TV in the living room.', tip: 'The living room is where the family sits together.' },
  { emoji: '🌿', word: 'GARDEN', spelling: 'G – A – R – D – E – N', sentence: 'I play in the garden.', tip: 'The garden is outside — with grass, flowers and trees.' },
  { emoji: '🍽️', word: 'DINING ROOM', spelling: 'D – I – N – I – N – G  R – O – O – M', sentence: 'We eat dinner in the dining room.', tip: 'The dining room is where the family eats together.' },
  { emoji: '🚗', word: 'GARAGE', spelling: 'G – A – R – A – G – E', sentence: 'Dad parks the car in the garage.', tip: 'The garage is where you keep the car.' },
  { emoji: '🚽', word: 'TOILET', spelling: 'T – O – I – L – E – T', sentence: 'The toilet is in the bathroom.', tip: 'You use the toilet every day — wash your hands after!' },
  { emoji: '🌅', word: 'BALCONY', spelling: 'B – A – L – C – O – N – Y', sentence: 'I look at the view from the balcony.', tip: 'A balcony is outside on the side of a building.' },
  { emoji: '📚', word: 'STUDY ROOM', spelling: 'S – T – U – D – Y  R – O – O – M', sentence: 'I do my homework in the study room.', tip: 'The study room is a quiet place to read and learn.' },
  { emoji: '🛁', word: 'BATHTUB', spelling: 'B – A – T – H – T – U – B', sentence: 'I have a bath in the bathtub.', tip: 'A bathtub is a big tub you fill with warm water.' },
  { emoji: '🪞', word: 'MIRROR', spelling: 'M – I – R – R – O – R', sentence: 'I look in the mirror every morning.', tip: 'A mirror shows your reflection — you can see yourself!' },
  { emoji: '🛋️', word: 'SOFA', spelling: 'S – O – F – A', sentence: 'I sit on the sofa and watch TV.', tip: 'A sofa is a big comfortable seat for the living room.' },
  { emoji: '🪜', word: 'STAIRS', spelling: 'S – T – A – I – R – S', sentence: 'I walk up the stairs to my bedroom.', tip: 'Stairs take you from one floor to another in a house.' },
  { emoji: '🚪', word: 'DOOR', spelling: 'D – O – O – R', sentence: 'Please close the door.', tip: 'Every room has a door — you open and close it to go in and out.' },
]

export default function RoomsPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)
  const [phase, setPhase] = useState<'menu' | 'lesson'>('menu')
  const [mode, setMode] = useState('')
  const [lessonIdx, setLessonIdx] = useState(0)
  const [showSpelling, setShowSpelling] = useState(false)
  const [showSentence, setShowSentence] = useState(false)

  useEffect(() => { const saved = localStorage.getItem(SESSION_KEY); if (saved) setAuthed(true); setChecking(false) }, [])

  const handleLogin = async () => {
    if (!password.trim()) return
    setLogging(true); setError('')
    const { data } = await supabase.from('pro_game_passwords').select('*').eq('password', password.trim().toUpperCase()).eq('active', true).single()
    if (data) { localStorage.setItem(SESSION_KEY, 'true'); await supabase.from('pro_game_passwords').update({ last_login: new Date().toISOString() }).eq('id', data.id); setAuthed(true) }
    else setError('Invalid password. Please check your access code.')
    setLogging(false)
  }

  const startLesson = () => { setLessonIdx(0); setShowSpelling(false); setShowSentence(false); setPhase('lesson') }

  const nextWord = () => {
    if (lessonIdx + 1 >= VOCAB.length) { router.push(`/esl-games/live/premium/rooms/${mode}`) }
    else { setLessonIdx(i => i + 1); setShowSpelling(false); setShowSentence(false) }
  }

  const prevWord = () => {
    if (lessonIdx > 0) { setLessonIdx(i => i - 1); setShowSpelling(false); setShowSentence(false) }
  }

  if (checking) return <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f9ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '64px' }}>🏠</div></main>

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f9ff 0%, #f5f3ff 50%, #f0fdf4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #7dd3fc' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🏠</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0c4a6e', marginBottom: '8px' }}>Rooms!</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Premium Kindergarten Game — Enter your access code</p>
        <input value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid #ef4444' : '2px solid #7dd3fc', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#e5e7eb' : 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(14,165,233,0.3)' }}>
          {logging ? 'Checking...' : '🔓 Enter Game'}
        </button>
        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '20px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>← Back to Premium</Link>
      </div>
    </main>
  )

  // ============================================================
  // LESSON MODE
  // ============================================================
  if (phase === 'lesson') {
    const v = VOCAB[lessonIdx]
    const isLast = lessonIdx + 1 >= VOCAB.length
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f9ff 0%, #f5f3ff 50%, #f0fdf4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <style>{`
          @keyframes wordPop{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
          @keyframes houseBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        `}</style>

        <div style={{ width: '100%', maxWidth: '560px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={() => setPhase('menu')} style={{ background: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', color: '#6b7280', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Exit Lesson</button>
          <div style={{ background: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '14px', color: '#0ea5e9', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            📖 {lessonIdx + 1} / {VOCAB.length}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap', maxWidth: '560px' }}>
          {VOCAB.map((_, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < lessonIdx ? '#22c55e' : i === lessonIdx ? '#0ea5e9' : '#e5e7eb', transition: 'background 0.3s' }} />
          ))}
        </div>

        <div key={lessonIdx} style={{ background: 'white', borderRadius: '32px', padding: '36px 32px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '3px solid #7dd3fc', animation: 'wordPop 0.35s ease', marginBottom: '16px' }}>
          <div style={{ fontSize: '110px', marginBottom: '12px', animation: 'houseBounce 3s ease-in-out infinite' }}>{v.emoji}</div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#0c4a6e', marginBottom: '8px', letterSpacing: '2px' }}>{v.word}</div>
          <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '10px 16px', marginBottom: '16px', color: '#0369a1', fontSize: '14px', fontWeight: '600' }}>
            💡 {v.tip}
          </div>

          {!showSpelling ? (
            <button onClick={() => setShowSpelling(true)}
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 4px 14px rgba(14,165,233,0.35)', width: '100%' }}>
              🔤 Show Spelling
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease', marginBottom: '12px' }}>
              <div style={{ background: '#f0f9ff', border: '2px solid #7dd3fc', borderRadius: '16px', padding: '16px' }}>
                <div style={{ color: '#0369a1', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🔤 Spelling</div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {v.word.split('').filter(l => l !== ' ').map((letter, i) => (
                    <div key={i} style={{ background: 'white', border: '2px solid #0ea5e9', borderRadius: '10px', width: '36px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', color: '#0ea5e9', boxShadow: '0 2px 6px rgba(14,165,233,0.2)' }}>
                      {letter}
                    </div>
                  ))}
                </div>
                <div style={{ color: '#0369a1', fontSize: '13px', fontWeight: '700', marginTop: '10px', letterSpacing: '2px' }}>{v.spelling}</div>
              </div>
            </div>
          )}

          {!showSentence ? (
            <button onClick={() => setShowSentence(true)}
              style={{ background: showSpelling ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#e5e7eb', color: showSpelling ? 'white' : '#9ca3af', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: showSpelling ? 'pointer' : 'not-allowed', width: '100%', boxShadow: showSpelling ? '0 4px 14px rgba(34,197,94,0.35)' : 'none' }}
              disabled={!showSpelling}>
              💬 Show Example Sentence
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '16px' }}>
                <div style={{ color: '#15803d', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>💬 Example Sentence</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#14532d' }}>{v.sentence}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '560px' }}>
          {lessonIdx > 0 && (
            <button onClick={prevWord} style={{ background: 'white', border: '2px solid #7dd3fc', color: '#0c4a6e', padding: '14px 24px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Back</button>
          )}
          <button onClick={nextWord}
            style={{ flex: 1, background: isLast ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: isLast ? '0 6px 20px rgba(34,197,94,0.4)' : '0 6px 20px rgba(14,165,233,0.4)' }}>
            {isLast ? '🎮 Start the Quiz! →' : 'Next Word →'}
          </button>
        </div>
      </main>
    )
  }

  // ============================================================
  // MENU MODE
  // ============================================================
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f9ff 0%, #f5f3ff 50%, #f0fdf4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}} @keyframes houseBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {['🛏️','🍳','🚿','🛋️','🌿','🍽️','🚗','🚽','📚','🛁'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: `${22 + (i % 3) * 8}px`, left: `${(i * 11) % 92}%`, top: `${(i * 17) % 85}%`, opacity: 0.1, animation: `float ${3 + i % 3}s ease-in-out infinite` }}>{e}</div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #7dd3fc', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '88px', marginBottom: '8px', animation: 'houseBounce 2.5s ease-in-out infinite' }}>🏠</div>
        <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#0c4a6e', margin: '0 0 6px' }}>Rooms!</h1>
        <p style={{ color: '#0ea5e9', fontSize: '16px', marginBottom: '28px', fontWeight: '700' }}>Bedroom, kitchen, bathroom and more! 🌟</p>

        {/* STEP 1 — Learn */}
        <div style={{ background: '#f0f9ff', border: '2px solid #7dd3fc', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#0ea5e9', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>1</div>
            <div style={{ fontWeight: '800', color: '#0c4a6e', fontSize: '16px' }}>📖 Learn the Words First</div>
          </div>
          <p style={{ color: '#0369a1', fontSize: '13px', margin: '0 0 14px', lineHeight: '1.6' }}>
            See every room with its picture, spelling and an example sentence before you play.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {VOCAB.slice(0, 8).map(v => (
              <span key={v.word} style={{ background: 'white', border: '1px solid #7dd3fc', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', color: '#0c4a6e' }}>{v.emoji} {v.word}</span>
            ))}
            <span style={{ background: 'white', border: '1px solid #7dd3fc', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', color: '#9ca3af' }}>+{VOCAB.length - 8} more</span>
          </div>
          <button onClick={startLesson} disabled={!mode}
            style={{ width: '100%', background: mode ? 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' : '#e5e7eb', color: mode ? 'white' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: mode ? 'pointer' : 'not-allowed', boxShadow: mode ? '0 6px 20px rgba(14,165,233,0.35)' : 'none' }}>
            {mode ? '📖 Start Lesson → then Quiz' : 'Pick a mode below first'}
          </button>
        </div>

        {/* STEP 2 — Mode */}
        <div style={{ background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#6b7280', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>2</div>
            <div style={{ fontWeight: '800', color: '#374151', fontSize: '16px' }}>🎮 Choose Your Mode</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                style={{ padding: '14px 18px', borderRadius: '14px', border: '3px solid', borderColor: mode === m.id ? m.color : '#e5e7eb', background: mode === m.id ? m.color : 'white', color: mode === m.id ? 'white' : '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', transform: mode === m.id ? 'scale(1.02)' : 'scale(1)' }}>
                <span style={{ fontSize: '26px' }}>{m.emoji}</span>
                <div style={{ textAlign: 'left' }}><div style={{ fontWeight: '800', fontSize: '15px' }}>{m.label}</div><div style={{ fontSize: '12px', opacity: 0.85 }}>{m.desc}</div></div>
              </button>
            ))}
          </div>
        </div>

        {/* Skip to quiz */}
        <button onClick={() => mode && router.push(`/esl-games/live/premium/rooms/${mode}`)} disabled={!mode}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid', borderColor: mode ? '#7dd3fc' : '#e5e7eb', background: 'white', color: mode ? '#0c4a6e' : '#9ca3af', fontWeight: '700', fontSize: '14px', cursor: mode ? 'pointer' : 'not-allowed' }}>
          ⏩ Skip Lesson — Go Straight to Quiz
        </button>

        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '16px', color: '#7dd3fc', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>← Back to Premium Games</Link>
      </div>
    </main>
  )
}
