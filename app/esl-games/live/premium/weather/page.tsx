'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'

const MODES = [
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#0ea5e9' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#8b5cf6' },
]

const VOCAB = [
  { emoji: '☀️', word: 'sunny',     phonetic: '/ˈsʌn.i/',        spelling: 's – u – n – n – y',         sentence: 'It is sunny today — let\'s go outside!',       tip: 'Sunny means the sun is shining bright in the sky!' },
  { emoji: '🌧️', word: 'rainy',     phonetic: '/ˈreɪ.ni/',       spelling: 'r – a – i – n – y',         sentence: 'It is rainy today — take your umbrella!',      tip: 'Rainy means water is falling from clouds in the sky.' },
  { emoji: '⛅', word: 'cloudy',    phonetic: '/ˈklaʊ.di/',      spelling: 'c – l – o – u – d – y',     sentence: 'The sky is cloudy — no sunshine today.',        tip: 'Cloudy means the sky is covered with grey or white clouds.' },
  { emoji: '❄️', word: 'snowy',     phonetic: '/ˈsnəʊ.i/',       spelling: 's – n – o – w – y',         sentence: 'It is snowy — let\'s build a snowman!',         tip: 'Snowy means white snow is falling from the sky!' },
  { emoji: '💨', word: 'windy',     phonetic: '/ˈwɪn.di/',       spelling: 'w – i – n – d – y',         sentence: 'It is very windy — hold your hat!',             tip: 'Windy means the wind is blowing strongly!' },
  { emoji: '⛈️', word: 'stormy',    phonetic: '/ˈstɔːr.mi/',     spelling: 's – t – o – r – m – y',     sentence: 'There is a big storm outside — stay inside!',   tip: 'Stormy means heavy rain with strong wind and thunder.' },
  { emoji: '🌫️', word: 'foggy',     phonetic: '/ˈfɒɡ.i/',        spelling: 'f – o – g – g – y',         sentence: 'It is foggy this morning — drive carefully.',   tip: 'Foggy means thick mist makes it hard to see far away.' },
  { emoji: '🌈', word: 'rainbow',   phonetic: '/ˈreɪn.bəʊ/',    spelling: 'r – a – i – n – b – o – w', sentence: 'Look! There is a rainbow after the rain.',       tip: 'A rainbow appears when the sun shines through raindrops!' },
  { emoji: '🌩️', word: 'lightning', phonetic: '/ˈlaɪt.nɪŋ/',    spelling: 'l – i – g – h – t – n – i – n – g', sentence: 'I can see lightning in the sky!', tip: 'Lightning is a bright flash of electricity in a storm.' },
  { emoji: '🌪️', word: 'tornado',   phonetic: '/tɔːrˈneɪ.dəʊ/', spelling: 't – o – r – n – a – d – o', sentence: 'A tornado is very dangerous — go inside!',       tip: 'A tornado is a fast-spinning column of wind.' },
  { emoji: '🌸', word: 'spring',    phonetic: '/sprɪŋ/',          spelling: 's – p – r – i – n – g',     sentence: 'Spring is warm with lots of flowers.',          tip: 'Spring comes after winter — flowers bloom and birds sing!' },
  { emoji: '🏖️', word: 'summer',    phonetic: '/ˈsʌm.ər/',       spelling: 's – u – m – m – e – r',     sentence: 'Summer is hot and sunny — go to the beach!',   tip: 'Summer is the hottest season of the year.' },
  { emoji: '🍂', word: 'autumn',    phonetic: '/ˈɔː.təm/',       spelling: 'a – u – t – u – m – n',     sentence: 'In autumn, the leaves turn red and fall.',      tip: 'Autumn is also called fall — leaves change colour!' },
  { emoji: '⛄', word: 'winter',    phonetic: '/ˈwɪn.tər/',      spelling: 'w – i – n – t – e – r',     sentence: 'Winter is cold — we wear coats and scarves.',   tip: 'Winter is the coldest season — it can snow!' },
]

function speakWord(text: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-GB'; u.rate = 0.85; u.pitch = 1
  window.speechSynthesis.speak(u)
}

export default function WeatherPage() {
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
    if (lessonIdx + 1 >= VOCAB.length) { router.push(`/esl-games/live/premium/weather/${mode}`) }
    else { setLessonIdx(i => i + 1); setShowSpelling(false); setShowSentence(false) }
  }
  const prevWord = () => { if (lessonIdx > 0) { setLessonIdx(i => i - 1); setShowSpelling(false); setShowSentence(false) } }

  if (checking) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9, #7dd3fc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '64px' }}>🌤️</div>
    </main>
  )

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9 0%, #7dd3fc 50%, #bae6fd 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '3px solid #7dd3fc' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>⛅</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0c4a6e', marginBottom: '8px' }}>Weather Watch!</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Premium Kindergarten Game — Enter your access code</p>
        <input value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid #ef4444' : '2px solid #bae6fd', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#e5e7eb' : 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(14,165,233,0.4)' }}>
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
      <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 40%, #bae6fd 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <style>{`
          @keyframes wordPop{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
          @keyframes weatherFloat{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.1) translateY(-12px)}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes audioPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
        `}</style>

        {/* Top bar */}
        <div style={{ width: '100%', maxWidth: '560px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button onClick={() => setPhase('menu')} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', padding: '8px 16px', borderRadius: '20px', color: '#0369a1', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>← Exit Lesson</button>
          <div style={{ background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '14px', color: '#0ea5e9', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>📖 {lessonIdx + 1} / {VOCAB.length}</div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap', maxWidth: '560px' }}>
          {VOCAB.map((_, i) => <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: i < lessonIdx ? '#22c55e' : i === lessonIdx ? 'white' : 'rgba(255,255,255,0.35)', transition: 'background 0.3s' }} />)}
        </div>

        {/* Word card */}
        <div key={lessonIdx} style={{ background: 'white', borderRadius: '32px', padding: '32px 28px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.2)', border: '3px solid #7dd3fc', animation: 'wordPop 0.35s ease', marginBottom: '14px' }}>

          {/* Emoji */}
          <div style={{ fontSize: '100px', marginBottom: '10px', animation: 'weatherFloat 2.5s ease-in-out infinite' }}>{v.emoji}</div>

          {/* Word + audio + phonetic */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#0c4a6e', letterSpacing: '2px' }}>{v.word}</div>
              <button onClick={() => speakWord(v.word)}
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.4)', animation: 'audioPulse 2s ease-in-out infinite', flexShrink: 0 }}>
                🔊
              </button>
            </div>
            <div style={{ fontSize: '18px', color: '#9ca3af', fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>{v.phonetic}</div>
          </div>

          {/* Tip */}
          <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '10px 16px', marginBottom: '14px', color: '#0369a1', fontSize: '13px', fontWeight: '600', lineHeight: '1.5' }}>💡 {v.tip}</div>

          {/* Spelling reveal */}
          {!showSpelling ? (
            <button onClick={() => { setShowSpelling(true); speakWord(v.word) }}
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginBottom: '10px', boxShadow: '0 4px 14px rgba(14,165,233,0.35)', width: '100%' }}>
              🔤 Show Spelling
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease', marginBottom: '10px' }}>
              <div style={{ background: '#f0f9ff', border: '2px solid #7dd3fc', borderRadius: '16px', padding: '16px' }}>
                <div style={{ color: '#0369a1', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🔤 Spelling</div>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {v.word.split('').map((letter, i) => (
                    <div key={i} style={{ background: 'white', border: '2px solid #0ea5e9', borderRadius: '10px', width: '32px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '17px', color: '#0ea5e9', boxShadow: '0 2px 6px rgba(14,165,233,0.2)' }}>{letter}</div>
                  ))}
                </div>
                <div style={{ color: '#0369a1', fontSize: '13px', fontWeight: '700', letterSpacing: '2px' }}>{v.spelling}</div>
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
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#14532d' }}>{v.sentence}</div>
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
            <button onClick={prevWord} style={{ background: 'rgba(255,255,255,0.9)', border: '2px solid rgba(255,255,255,0.6)', color: '#0c4a6e', padding: '14px 24px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>← Back</button>
          )}
          <button onClick={nextWord} style={{ flex: 1, background: isLast ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: isLast ? '0 6px 20px rgba(34,197,94,0.4)' : '0 6px 20px rgba(14,165,233,0.4)' }}>
            {isLast ? '🎮 Start the Quiz! →' : 'Next Word →'}
          </button>
        </div>
      </main>
    )
  }

  // ── MENU ──────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 40%, #bae6fd 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes cloud{0%{transform:translateX(-20px)}50%{transform:translateX(20px)}100%{transform:translateX(-20px)}}
        @keyframes spin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.15)}100%{transform:rotate(360deg) scale(1)}}
      `}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {['☀️','⛅','🌧️','❄️','🌈','💨','⛈️','🌤️','🌩️','🌸'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: `${22 + (i % 3) * 12}px`, left: `${(i * 11) % 92}%`, top: `${(i * 17) % 85}%`, opacity: 0.15, animation: `cloud ${4 + i % 3}s ease-in-out infinite` }}>{e}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,0,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '4px solid #7dd3fc', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '88px', marginBottom: '8px', animation: 'spin 8s linear infinite' }}>☀️</div>
        <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#0c4a6e', margin: '0 0 6px' }}>Weather Watch!</h1>
        <p style={{ color: '#0369a1', fontSize: '16px', marginBottom: '28px', fontWeight: '700' }}>sunny, rainy, cloudy, snowy and more! 🌈</p>

        {/* Step 1 — Vocab lesson */}
        <div style={{ background: '#f0f9ff', border: '2px solid #7dd3fc', borderRadius: '20px', padding: '20px', marginBottom: '14px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ background: '#0ea5e9', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>1</div>
            <div style={{ fontWeight: '800', color: '#0c4a6e', fontSize: '16px' }}>📖 Teach the Words First</div>
          </div>
          <p style={{ color: '#0369a1', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.6' }}>Each weather word has its picture, audio 🔊, phonetic spelling and an example sentence.</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {VOCAB.slice(0, 8).map(v => (
              <span key={v.word} style={{ background: 'white', border: '1px solid #7dd3fc', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700', color: '#0c4a6e' }}>{v.emoji} {v.word}</span>
            ))}
            <span style={{ background: 'white', border: '1px solid #7dd3fc', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700', color: '#9ca3af' }}>+{VOCAB.length - 8} more</span>
          </div>
          <button onClick={startLesson} disabled={!mode}
            style={{ width: '100%', background: mode ? 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' : '#e5e7eb', color: mode ? 'white' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: mode ? 'pointer' : 'not-allowed', boxShadow: mode ? '0 6px 20px rgba(14,165,233,0.35)' : 'none' }}>
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
        <button onClick={() => mode && router.push(`/esl-games/live/premium/weather/${mode}`)} disabled={!mode}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid', borderColor: mode ? '#7dd3fc' : '#e5e7eb', background: 'white', color: mode ? '#0c4a6e' : '#9ca3af', fontWeight: '700', fontSize: '14px', cursor: mode ? 'pointer' : 'not-allowed' }}>
          ⏩ Skip Lesson — Go Straight to Quiz
        </button>

        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '16px', color: '#7dd3fc', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>← Back to Premium Games</Link>
      </div>
    </main>
  )
}
