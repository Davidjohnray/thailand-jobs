'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'

const MODES = [
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#a855f7' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#ec4899' },
]

const VOCAB = [
  { emoji: '⭕', word: 'circle',    phonetic: '/ˈsɜː.kəl/',       spelling: 'c – i – r – c – l – e',         sentence: 'The sun is a circle.',           tip: 'A circle is perfectly round with no corners!' },
  { emoji: '⬛', word: 'square',    phonetic: '/skweər/',           spelling: 's – q – u – a – r – e',         sentence: 'A window is a square.',          tip: 'A square has 4 equal sides and 4 corners.' },
  { emoji: '🔺', word: 'triangle',  phonetic: '/ˈtraɪ.æŋ.ɡəl/',   spelling: 't – r – i – a – n – g – l – e', sentence: 'A slice of pizza is a triangle.', tip: 'A triangle has 3 sides and 3 corners.' },
  { emoji: '🔷', word: 'diamond',   phonetic: '/ˈdaɪ.mənd/',       spelling: 'd – i – a – m – o – n – d',     sentence: 'A kite is a diamond shape.',     tip: 'A diamond looks like a square tilted on its corner.' },
  { emoji: '⬜', word: 'rectangle', phonetic: '/ˈrek.tæŋ.ɡəl/',   spelling: 'r – e – c – t – a – n – g – l – e', sentence: 'A door is a rectangle.',      tip: 'A rectangle has 4 sides — two long and two short.' },
  { emoji: '⭐', word: 'star',      phonetic: '/stɑːr/',            spelling: 's – t – a – r',                 sentence: 'I drew a star in the sky.',      tip: 'A star shape has 5 points.' },
  { emoji: '❤️', word: 'heart',     phonetic: '/hɑːrt/',            spelling: 'h – e – a – r – t',             sentence: 'I draw a heart for love.',       tip: 'We use a heart shape to show love.' },
  { emoji: '🥚', word: 'oval',      phonetic: '/ˈoʊ.vəl/',         spelling: 'o – v – a – l',                 sentence: 'An egg is an oval shape.',       tip: 'An oval is like a circle that has been stretched.' },
  { emoji: '⬠', word: 'pentagon',  phonetic: '/ˈpen.tə.ɡɒn/',    spelling: 'p – e – n – t – a – g – o – n', sentence: 'A pentagon has five sides.',     tip: 'Penta means five — a pentagon has 5 sides and 5 corners.' },
  { emoji: '➡️', word: 'arrow',     phonetic: '/ˈær.oʊ/',          spelling: 'a – r – r – o – w',             sentence: 'The arrow points to the right.', tip: 'An arrow shows direction — it points the way!' },
]

function speakWord(text: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-GB'; u.rate = 0.85; u.pitch = 1
  window.speechSynthesis.speak(u)
}

export default function ShapesPage() {
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

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY)
    if (saved) setAuthed(true)
    setChecking(false)
  }, [])

  const handleLogin = async () => {
    if (!password.trim()) return
    setLogging(true); setError('')
    const { data } = await supabase.from('pro_game_passwords').select('*').eq('password', password.trim().toUpperCase()).eq('active', true).single()
    if (data) {
      localStorage.setItem(SESSION_KEY, 'true')
      localStorage.setItem(PASSWORD_KEY, password.trim().toUpperCase())
      await supabase.from('pro_game_passwords').update({ last_login: new Date().toISOString() }).eq('id', data.id)
      setAuthed(true)
    } else {
      setError('Invalid password. Please check your access code.')
    }
    setLogging(false)
  }

  const startLesson = () => { setLessonIdx(0); setShowSpelling(false); setShowSentence(false); setPhase('lesson') }
  const nextWord = () => {
    if (lessonIdx + 1 >= VOCAB.length) { router.push(`/esl-games/live/premium/shapes/${mode}`) }
    else { setLessonIdx(i => i + 1); setShowSpelling(false); setShowSentence(false) }
  }
  const prevWord = () => { if (lessonIdx > 0) { setLessonIdx(i => i - 1); setShowSpelling(false); setShowSentence(false) } }

  if (checking) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #faf5ff, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '64px' }}>🔷</div>
    </main>
  )

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #faf5ff 0%, #fce7f3 50%, #eff6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #d8b4fe' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🔷</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#3b0764', marginBottom: '8px' }}>Shapes!</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Premium Kindergarten Game — Enter your access code</p>
        <input value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid #ef4444' : '2px solid #d8b4fe', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#e5e7eb' : 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(168,85,247,0.3)' }}>
          {logging ? 'Checking...' : '🔓 Enter Game'}
        </button>
        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '20px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>← Back to Premium</Link>
      </div>
    </main>
  )

  // ── VOCAB LESSON ──────────────────────────────────────────────────────────
  if (phase === 'lesson') {
    const v = VOCAB[lessonIdx]
    const isLast = lessonIdx + 1 >= VOCAB.length
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #faf5ff 0%, #fce7f3 50%, #eff6ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <style>{`
          @keyframes wordPop{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
          @keyframes shapeSpin{0%{transform:rotate(-10deg) scale(1)}50%{transform:rotate(10deg) scale(1.1)}100%{transform:rotate(-10deg) scale(1)}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes audioPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
        `}</style>

        {/* Top bar */}
        <div style={{ width: '100%', maxWidth: '560px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button onClick={() => setPhase('menu')} style={{ background: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', color: '#6b7280', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Exit Lesson</button>
          <div style={{ background: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '14px', color: '#a855f7', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>📖 {lessonIdx + 1} / {VOCAB.length}</div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap', maxWidth: '560px' }}>
          {VOCAB.map((_, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < lessonIdx ? '#22c55e' : i === lessonIdx ? '#a855f7' : '#e5e7eb', transition: 'background 0.3s' }} />)}
        </div>

        {/* Word card */}
        <div key={lessonIdx} style={{ background: 'white', borderRadius: '32px', padding: '32px 28px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '3px solid #d8b4fe', animation: 'wordPop 0.35s ease', marginBottom: '14px' }}>

          {/* Emoji */}
          <div style={{ fontSize: '100px', marginBottom: '10px', animation: 'shapeSpin 3s ease-in-out infinite' }}>{v.emoji}</div>

          {/* Word + audio + phonetic */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ fontSize: '40px', fontWeight: '900', color: '#3b0764', letterSpacing: '2px' }}>{v.word}</div>
              <button onClick={() => speakWord(v.word)}
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(168,85,247,0.4)', animation: 'audioPulse 2s ease-in-out infinite', flexShrink: 0 }}
                title="Hear the word">
                🔊
              </button>
            </div>
            <div style={{ fontSize: '18px', color: '#9ca3af', fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>{v.phonetic}</div>
          </div>

          {/* Tip */}
          <div style={{ background: '#faf5ff', borderRadius: '12px', padding: '10px 16px', marginBottom: '14px', color: '#6b21a8', fontSize: '13px', fontWeight: '600', lineHeight: '1.5' }}>💡 {v.tip}</div>

          {/* Spelling reveal */}
          {!showSpelling ? (
            <button onClick={() => { setShowSpelling(true); speakWord(v.word) }}
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginBottom: '10px', boxShadow: '0 4px 14px rgba(168,85,247,0.35)', width: '100%' }}>
              🔤 Show Spelling
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease', marginBottom: '10px' }}>
              <div style={{ background: '#faf5ff', border: '2px solid #d8b4fe', borderRadius: '16px', padding: '16px' }}>
                <div style={{ color: '#6b21a8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🔤 Spelling</div>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {v.word.split('').map((letter, i) => (
                    <div key={i} style={{ background: 'white', border: '2px solid #a855f7', borderRadius: '10px', width: '34px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', color: '#a855f7', boxShadow: '0 2px 6px rgba(168,85,247,0.2)' }}>{letter}</div>
                  ))}
                </div>
                <div style={{ color: '#6b21a8', fontSize: '13px', fontWeight: '700', letterSpacing: '2px' }}>{v.spelling}</div>
              </div>
            </div>
          )}

          {/* Sentence reveal */}
          {!showSentence ? (
            <button onClick={() => { if (showSpelling) { setShowSentence(true); speakWord(v.sentence) } }}
              style={{ background: showSpelling ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#e5e7eb', color: showSpelling ? 'white' : '#9ca3af', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: showSpelling ? 'pointer' : 'not-allowed', width: '100%', boxShadow: showSpelling ? '0 4px 14px rgba(34,197,94,0.35)' : 'none' }}
              disabled={!showSpelling}>
              💬 Show Example Sentence
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💬 Example Sentence</div>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: '#14532d' }}>{v.sentence}</div>
                </div>
                <button onClick={() => speakWord(v.sentence)}
                  style={{ background: '#22c55e', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  🔊
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '560px' }}>
          {lessonIdx > 0 && (
            <button onClick={prevWord} style={{ background: 'white', border: '2px solid #d8b4fe', color: '#3b0764', padding: '14px 24px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Back</button>
          )}
          <button onClick={nextWord} style={{ flex: 1, background: isLast ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: isLast ? '0 6px 20px rgba(34,197,94,0.4)' : '0 6px 20px rgba(168,85,247,0.4)' }}>
            {isLast ? '🎮 Start the Quiz! →' : 'Next Word →'}
          </button>
        </div>
      </main>
    )
  }

  // ── MENU ──────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #faf5ff 0%, #fce7f3 50%, #eff6ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}} @keyframes spin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.15)}100%{transform:rotate(360deg) scale(1)}}`}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {['⭕','⬛','🔺','🔷','⭐','❤️','⬜','🥚','⬠','➡️'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: `${20 + (i % 3) * 10}px`, left: `${(i * 11) % 92}%`, top: `${(i * 17) % 85}%`, opacity: 0.1, animation: `float ${3 + i % 3}s ease-in-out infinite` }}>{e}</div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #d8b4fe', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '88px', marginBottom: '8px', animation: 'spin 6s linear infinite' }}>🔷</div>
        <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#3b0764', margin: '0 0 6px' }}>Shapes!</h1>
        <p style={{ color: '#a855f7', fontSize: '16px', marginBottom: '28px', fontWeight: '700' }}>circles, squares, triangles and more! 🌟</p>

        {/* Step 1 — Vocab lesson */}
        <div style={{ background: '#faf5ff', border: '2px solid #d8b4fe', borderRadius: '20px', padding: '20px', marginBottom: '14px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ background: '#a855f7', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>1</div>
            <div style={{ fontWeight: '800', color: '#3b0764', fontSize: '16px' }}>📖 Teach the Words First</div>
          </div>
          <p style={{ color: '#6b21a8', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.6' }}>Each shape has its picture, audio 🔊, phonetic spelling and a real-world example sentence.</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {VOCAB.slice(0, 8).map(v => (
              <span key={v.word} style={{ background: 'white', border: '1px solid #d8b4fe', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700', color: '#3b0764' }}>{v.emoji} {v.word}</span>
            ))}
            <span style={{ background: 'white', border: '1px solid #d8b4fe', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700', color: '#9ca3af' }}>+{VOCAB.length - 8} more</span>
          </div>
          <button onClick={startLesson} disabled={!mode}
            style={{ width: '100%', background: mode ? 'linear-gradient(135deg, #a855f7, #ec4899)' : '#e5e7eb', color: mode ? 'white' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: mode ? 'pointer' : 'not-allowed', boxShadow: mode ? '0 6px 20px rgba(168,85,247,0.35)' : 'none' }}>
            {mode ? '📖 Start Lesson → then Quiz' : 'Pick a mode below first'}
          </button>
        </div>

        {/* Step 2 — Mode selection */}
        <div style={{ background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '20px', padding: '20px', marginBottom: '14px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#6b7280', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>2</div>
            <div style={{ fontWeight: '800', color: '#374151', fontSize: '16px' }}>🎮 Choose Your Mode</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                style={{ padding: '14px 18px', borderRadius: '14px', border: '3px solid', borderColor: mode === m.id ? m.color : '#e5e7eb', background: mode === m.id ? m.color : 'white', color: mode === m.id ? 'white' : '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', transform: mode === m.id ? 'scale(1.02)' : 'scale(1)' }}>
                <span style={{ fontSize: '26px' }}>{m.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '800', fontSize: '15px' }}>{m.label}</div>
                  <div style={{ fontSize: '12px', opacity: 0.85 }}>{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Skip lesson */}
        <button onClick={() => mode && router.push(`/esl-games/live/premium/shapes/${mode}`)} disabled={!mode}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid', borderColor: mode ? '#d8b4fe' : '#e5e7eb', background: 'white', color: mode ? '#3b0764' : '#9ca3af', fontWeight: '700', fontSize: '14px', cursor: mode ? 'pointer' : 'not-allowed' }}>
          ⏩ Skip Lesson — Go Straight to Quiz
        </button>

        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '16px', color: '#c084fc', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>← Back to Premium Games</Link>
      </div>
    </main>
  )
}
