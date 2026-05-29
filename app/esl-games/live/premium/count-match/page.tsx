'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'

const MODES = [
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#f59e0b' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#ec4899' },
]

const VOCAB = [
  { digit: 1,  word: 'one',      phonetic: '/wʌn/',           dots: '🍎',                                    tip: 'Hold up one finger — that is one!' },
  { digit: 2,  word: 'two',      phonetic: '/tuː/',            dots: '🍎🍎',                                  tip: 'You have two eyes and two hands!' },
  { digit: 3,  word: 'three',    phonetic: '/θriː/',           dots: '🍎🍎🍎',                                tip: 'A triangle has three sides!' },
  { digit: 4,  word: 'four',     phonetic: '/fɔːr/',           dots: '🍎🍎🍎🍎',                              tip: 'A cat has four legs!' },
  { digit: 5,  word: 'five',     phonetic: '/faɪv/',           dots: '🍎🍎🍎🍎🍎',                            tip: 'One hand has five fingers!' },
  { digit: 6,  word: 'six',      phonetic: '/sɪks/',           dots: '🍎🍎🍎🍎🍎🍎',                          tip: 'An insect has six legs!' },
  { digit: 7,  word: 'seven',    phonetic: '/ˈsev.ən/',        dots: '🍎🍎🍎🍎🍎🍎🍎',                        tip: 'There are seven days in a week!' },
  { digit: 8,  word: 'eight',    phonetic: '/eɪt/',            dots: '🍎🍎🍎🍎🍎🍎🍎🍎',                      tip: 'A spider has eight legs!' },
  { digit: 9,  word: 'nine',     phonetic: '/naɪn/',           dots: '🍎🍎🍎🍎🍎🍎🍎🍎🍎',                    tip: 'Nine is one less than ten — nearly there!' },
  { digit: 10, word: 'ten',      phonetic: '/ten/',            dots: '🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎',                  tip: 'Both hands together make ten fingers!' },
  { digit: 11, word: 'eleven',   phonetic: '/ɪˈlev.ən/',      dots: '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟',              tip: 'Ten plus one more — eleven!' },
  { digit: 12, word: 'twelve',   phonetic: '/twɛlv/',          dots: '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟',            tip: 'There are twelve months in a year!' },
  { digit: 13, word: 'thirteen', phonetic: '/ˌθɜːˈtiːn/',     dots: '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟',          tip: 'Thirteen — three + ten!' },
  { digit: 14, word: 'fourteen', phonetic: '/ˌfɔːˈtiːn/',     dots: '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟',        tip: 'Fourteen — four + ten!' },
  { digit: 15, word: 'fifteen',  phonetic: '/ˌfɪfˈtiːn/',     dots: '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟',      tip: 'Fifteen — five + ten!' },
]

function speakWord(text: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-GB'; u.rate = 0.85; u.pitch = 1
  window.speechSynthesis.speak(u)
}

export default function CountMatchPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)
  const [phase, setPhase] = useState<'menu' | 'lesson'>('menu')
  const [mode, setMode] = useState('')
  const [lessonIdx, setLessonIdx] = useState(0)
  const [showDots, setShowDots] = useState(false)
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

  const startLesson = () => { setLessonIdx(0); setShowDots(false); setShowSentence(false); setPhase('lesson') }
  const nextWord = () => {
    if (lessonIdx + 1 >= VOCAB.length) { router.push(`/esl-games/live/premium/count-match/${mode}`) }
    else { setLessonIdx(i => i + 1); setShowDots(false); setShowSentence(false) }
  }
  const prevWord = () => { if (lessonIdx > 0) { setLessonIdx(i => i - 1); setShowDots(false); setShowSentence(false) } }

  if (checking) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7, #fde8d8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '64px' }}>🔢</div>
    </main>
  )

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7 0%, #fde8d8 50%, #fce7f3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #fcd34d' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🔢</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#1e1b4b', marginBottom: '8px' }}>Count & Match</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Premium Kindergarten Game — Enter your access code</p>
        <input value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid #ef4444' : '2px solid #fcd34d', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(245,158,11,0.3)' }}>
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
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7 0%, #fde8d8 50%, #fce7f3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <style>{`
          @keyframes wordPop{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
          @keyframes numBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes audioPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
          @keyframes dotPop{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
        `}</style>

        {/* Top bar */}
        <div style={{ width: '100%', maxWidth: '560px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button onClick={() => setPhase('menu')} style={{ background: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', color: '#6b7280', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Exit Lesson</button>
          <div style={{ background: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '14px', color: '#f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>📖 {lessonIdx + 1} / {VOCAB.length}</div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap', maxWidth: '560px' }}>
          {VOCAB.map((_, i) => <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: i < lessonIdx ? '#22c55e' : i === lessonIdx ? '#f59e0b' : '#e5e7eb', transition: 'background 0.3s' }} />)}
        </div>

        {/* Word card */}
        <div key={lessonIdx} style={{ background: 'white', borderRadius: '32px', padding: '32px 28px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '3px solid #fcd34d', animation: 'wordPop 0.35s ease', marginBottom: '14px' }}>

          {/* Big number */}
          <div style={{ fontSize: '96px', fontWeight: '900', color: '#f59e0b', lineHeight: 1, marginBottom: '8px', animation: 'numBounce 2s ease-in-out infinite' }}>{v.digit}</div>

          {/* Word + audio + phonetic */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#1e1b4b', letterSpacing: '3px' }}>{v.word}</div>
              <button onClick={() => speakWord(v.word)}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,158,11,0.4)', animation: 'audioPulse 2s ease-in-out infinite', flexShrink: 0 }}>
                🔊
              </button>
            </div>
            <div style={{ fontSize: '18px', color: '#9ca3af', fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>{v.phonetic}</div>
          </div>

          {/* Tip */}
          <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '10px 16px', marginBottom: '14px', color: '#92400e', fontSize: '13px', fontWeight: '600', lineHeight: '1.5' }}>💡 {v.tip}</div>

          {/* Count the dots reveal */}
          {!showDots ? (
            <button onClick={() => { setShowDots(true); speakWord(v.word) }}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginBottom: '10px', boxShadow: '0 4px 14px rgba(245,158,11,0.35)', width: '100%' }}>
              🔢 Count the Objects
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease', marginBottom: '10px' }}>
              <div style={{ background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '16px', padding: '16px' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🔢 Count them!</div>
                <div style={{ fontSize: v.digit <= 10 ? '32px' : '24px', lineHeight: '1.6', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', marginBottom: '10px' }}>
                  {v.dots}
                </div>
                <div style={{ color: '#92400e', fontSize: '22px', fontWeight: '900' }}>= {v.digit} {v.word}</div>
              </div>
            </div>
          )}

          {/* Say the number sentence */}
          {!showSentence ? (
            <button onClick={() => { if (showDots) { setShowSentence(true); speakWord(`${v.digit} — ${v.word}`) } }}
              style={{ background: showDots ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#e5e7eb', color: showDots ? 'white' : '#9ca3af', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: showDots ? 'pointer' : 'not-allowed', width: '100%', boxShadow: showDots ? '0 4px 14px rgba(34,197,94,0.35)' : 'none' }}
              disabled={!showDots}>
              🔊 Say It Together
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>🎤 Class repeat after me!</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#14532d' }}>{v.digit} — {v.word}</div>
                </div>
                <button onClick={() => speakWord(`${v.digit} — ${v.word}`)}
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
            <button onClick={prevWord} style={{ background: 'white', border: '2px solid #fcd34d', color: '#1e1b4b', padding: '14px 24px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Back</button>
          )}
          <button onClick={nextWord} style={{ flex: 1, background: isLast ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: isLast ? '0 6px 20px rgba(34,197,94,0.4)' : '0 6px 20px rgba(245,158,11,0.4)' }}>
            {isLast ? '🎮 Start the Quiz! →' : 'Next Number →'}
          </button>
        </div>
      </main>
    )
  }

  // ── MENU ──────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef3c7 0%, #fde8d8 50%, #fce7f3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
      `}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: '28px', left: `${(i * 11) % 92}%`, top: `${(i * 17) % 85}%`, opacity: 0.1, animation: `float ${3 + i % 3}s ease-in-out infinite` }}>{e}</div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #fcd34d', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '80px', marginBottom: '8px', animation: 'bounce 2s ease-in-out infinite' }}>🔢</div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e1b4b', margin: '0 0 6px' }}>Count & Match!</h1>
        <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '28px' }}>one, two, three... all the way to fifteen! 🌟</p>

        {/* Step 1 — Vocab lesson */}
        <div style={{ background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '20px', padding: '20px', marginBottom: '14px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ background: '#f59e0b', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>1</div>
            <div style={{ fontWeight: '800', color: '#1e1b4b', fontSize: '16px' }}>📖 Teach the Numbers First</div>
          </div>
          <p style={{ color: '#92400e', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.6' }}>Each number has its digit, word, audio 🔊, phonetic spelling and visual counting dots.</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {VOCAB.slice(0, 8).map(v => (
              <span key={v.word} style={{ background: 'white', border: '1px solid #fcd34d', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700', color: '#1e1b4b' }}>{v.digit} {v.word}</span>
            ))}
            <span style={{ background: 'white', border: '1px solid #fcd34d', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700', color: '#9ca3af' }}>+{VOCAB.length - 8} more</span>
          </div>
          <button onClick={startLesson} disabled={!mode}
            style={{ width: '100%', background: mode ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : '#e5e7eb', color: mode ? 'white' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: mode ? 'pointer' : 'not-allowed', boxShadow: mode ? '0 6px 20px rgba(245,158,11,0.35)' : 'none' }}>
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
        <button onClick={() => mode && router.push(`/esl-games/live/premium/count-match/${mode}`)} disabled={!mode}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid', borderColor: mode ? '#fcd34d' : '#e5e7eb', background: 'white', color: mode ? '#1e1b4b' : '#9ca3af', fontWeight: '700', fontSize: '14px', cursor: mode ? 'pointer' : 'not-allowed' }}>
          ⏩ Skip Lesson — Go Straight to Quiz
        </button>

        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '16px', color: '#fcd34d', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>← Back to Premium Games</Link>
      </div>
    </main>
  )
}
