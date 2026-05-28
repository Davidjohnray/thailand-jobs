'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const SESSION_KEY = 'premium_games_session'

const MODES = [
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#f97316' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#eab308' },
]

const VOCAB = [
  { emoji: '✏️', word: 'Pencil',     phonetic: '/ˈpɛn.sɪl/',       spelling: 'P – E – N – C – I – L',                         sentence: 'I write with a pencil.',             tip: 'You use it to write and draw!' },
  { emoji: '📚', word: 'Book',       phonetic: '/bʊk/',             spelling: 'B – O – O – K',                                 sentence: 'I read my book.',                    tip: 'Books have words and pictures inside.' },
  { emoji: '🎒', word: 'Bag',        phonetic: '/bæɡ/',             spelling: 'B – A – G',                                     sentence: 'My bag is heavy.',                   tip: 'You carry your books in your bag.' },
  { emoji: '📏', word: 'Ruler',      phonetic: '/ˈruː.lə/',         spelling: 'R – U – L – E – R',                             sentence: 'I measure with a ruler.',            tip: 'A ruler helps you draw straight lines.' },
  { emoji: '✂️', word: 'Scissors',   phonetic: '/ˈsɪz.əz/',         spelling: 'S – C – I – S – S – O – R – S',                 sentence: 'I cut paper with scissors.',         tip: 'Scissors have two sharp blades.' },
  { emoji: '🩹', word: 'Eraser',     phonetic: '/ɪˈreɪ.zə/',        spelling: 'E – R – A – S – E – R',                         sentence: 'I rub out mistakes with an eraser.', tip: 'Also called a rubber! It removes pencil marks.' },
  { emoji: '🫧', word: 'Glue',       phonetic: '/ɡluː/',            spelling: 'G – L – U – E',                                 sentence: 'I stick paper with glue.',           tip: 'Glue is sticky — it joins things together.' },
  { emoji: '🖍️', word: 'Crayon',     phonetic: '/ˈkreɪ.ɒn/',        spelling: 'C – R – A – Y – O – N',                         sentence: 'I colour with a crayon.',            tip: 'Crayons come in many colours!' },
  { emoji: '📓', word: 'Notebook',   phonetic: '/ˈnəʊt.bʊk/',       spelling: 'N – O – T – E – B – O – O – K',                 sentence: 'I write in my notebook.',            tip: 'A notebook is for writing your notes.' },
  { emoji: '🖩', word: 'Calculator', phonetic: '/ˈkæl.kjʊ.leɪ.tə/', spelling: 'C – A – L – C – U – L – A – T – O – R',         sentence: 'I use a calculator for maths.',      tip: 'A calculator helps you add and subtract numbers.' },
  { emoji: '👩‍🏫', word: 'Teacher',    phonetic: '/ˈtiː.tʃə/',         spelling: 'T – E – A – C – H – E – R',                     sentence: 'My teacher is kind.',                tip: 'The teacher helps you learn new things.' },
  { emoji: '🏫', word: 'Classroom',  phonetic: '/ˈklɑːs.ruːm/',     spelling: 'C – L – A – S – S – R – O – O – M',             sentence: 'I learn in the classroom.',          tip: 'This is where you study at school.' },
  { emoji: '📋', word: 'Blackboard', phonetic: '/ˈblæk.bɔːd/',      spelling: 'B – L – A – C – K – B – O – A – R – D',         sentence: 'The teacher writes on the blackboard.', tip: 'Teachers write on the blackboard with chalk.' },
  { emoji: '🪑', word: 'Desk',       phonetic: '/dɛsk/',            spelling: 'D – E – S – K',                                 sentence: 'I sit at my desk.',                  tip: 'You sit at a desk to do your work.' },
  { emoji: '👨‍🎓', word: 'Student',    phonetic: '/ˈstjuː.dənt/',      spelling: 'S – T – U – D – E – N – T',                     sentence: 'I am a good student.',               tip: 'A student is someone who goes to school to learn.' },
]

function speakWord(word: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(word)
  u.lang = 'en-GB'; u.rate = 0.8; u.pitch = 1
  window.speechSynthesis.speak(u)
}

export default function SchoolPage() {
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
    if (lessonIdx + 1 >= VOCAB.length) { router.push(`/esl-games/live/premium/school/${mode}`) }
    else { setLessonIdx(i => i + 1); setShowSpelling(false); setShowSentence(false) }
  }

  const prevWord = () => {
    if (lessonIdx > 0) { setLessonIdx(i => i - 1); setShowSpelling(false); setShowSentence(false) }
  }

  if (checking) return <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed, #fef9c3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '64px' }}>🏫</div></main>

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed 0%, #fef9c3 50%, #f0fdf4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #fdba74' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🏫</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#7c2d12', marginBottom: '8px' }}>School!</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Premium Kindergarten Game — Enter your access code</p>
        <input value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid #ef4444' : '2px solid #fdba74', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#e5e7eb' : 'linear-gradient(135deg, #f97316, #eab308)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(249,115,22,0.3)' }}>
          {logging ? 'Checking...' : '🔓 Enter Game'}
        </button>
        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '20px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>← Back to Premium</Link>
      </div>
    </main>
  )

  // ── LESSON MODE ──────────────────────────────────────────────
  if (phase === 'lesson') {
    const v = VOCAB[lessonIdx]
    const isLast = lessonIdx + 1 >= VOCAB.length
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed 0%, #fef9c3 50%, #f0fdf4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <style>{`
          @keyframes wordPop{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
          @keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        `}</style>

        {/* Header */}
        <div style={{ width: '100%', maxWidth: '560px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={() => setPhase('menu')} style={{ background: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', color: '#6b7280', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Exit Lesson</button>
          <div style={{ background: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '14px', color: '#f97316', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>📖 {lessonIdx + 1} / {VOCAB.length}</div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap', maxWidth: '560px' }}>
          {VOCAB.map((_, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < lessonIdx ? '#22c55e' : i === lessonIdx ? '#f97316' : '#e5e7eb', transition: 'background 0.3s' }} />)}
        </div>

        {/* Main word card */}
        <div key={lessonIdx} style={{ background: 'white', borderRadius: '32px', padding: '36px 32px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '3px solid #fdba74', animation: 'wordPop 0.35s ease', marginBottom: '16px' }}>

          {/* Emoji */}
          <div style={{ fontSize: '110px', marginBottom: '12px', animation: 'bounce 3s ease-in-out infinite' }}>{v.emoji}</div>

          {/* Word + audio + phonetics */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#7c2d12', letterSpacing: '2px' }}>{v.word}</div>
              <button onClick={() => speakWord(v.word)}
                style={{ background: 'linear-gradient(135deg, #f97316, #eab308)', color: 'white', border: 'none', width: '44px', height: '44px', borderRadius: '12px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(249,115,22,0.4)', flexShrink: 0 }}
                title="Hear pronunciation">
                🔊
              </button>
            </div>
            {/* Phonetic spelling */}
            <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '20px', padding: '4px 14px', display: 'inline-block' }}>
              <span style={{ color: '#9a3412', fontSize: '16px', fontWeight: '700', fontFamily: 'monospace' }}>{v.phonetic}</span>
            </div>
          </div>

          {/* Tip */}
          <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '10px 16px', marginBottom: '16px', color: '#c2410c', fontSize: '14px', fontWeight: '600' }}>
            💡 {v.tip}
          </div>

          {/* Spelling reveal */}
          {!showSpelling ? (
            <button onClick={() => setShowSpelling(true)}
              style={{ background: 'linear-gradient(135deg, #f97316, #eab308)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 4px 14px rgba(249,115,22,0.35)', width: '100%' }}>
              🔤 Show Spelling
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease', marginBottom: '12px' }}>
              <div style={{ background: '#fff7ed', border: '2px solid #fdba74', borderRadius: '16px', padding: '16px' }}>
                <div style={{ color: '#9a3412', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🔤 Spelling</div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {v.word.split('').map((letter, i) => (
                    <div key={i} style={{ background: 'white', border: '2px solid #f97316', borderRadius: '10px', minWidth: '36px', height: '44px', padding: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', color: '#f97316', boxShadow: '0 2px 6px rgba(249,115,22,0.2)' }}>
                      {letter}
                    </div>
                  ))}
                </div>
                <div style={{ color: '#c2410c', fontSize: '13px', fontWeight: '700', marginTop: '10px', letterSpacing: '2px' }}>{v.spelling}</div>
              </div>
            </div>
          )}

          {/* Sentence reveal */}
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

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '560px' }}>
          {lessonIdx > 0 && (
            <button onClick={prevWord} style={{ background: 'white', border: '2px solid #fdba74', color: '#7c2d12', padding: '14px 24px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>← Back</button>
          )}
          <button onClick={nextWord}
            style={{ flex: 1, background: isLast ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #f97316, #eab308)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: isLast ? '0 6px 20px rgba(34,197,94,0.4)' : '0 6px 20px rgba(249,115,22,0.4)' }}>
            {isLast ? '🎮 Start the Quiz! →' : 'Next Word →'}
          </button>
        </div>
      </main>
    )
  }

  // ── MENU ─────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed 0%, #fef9c3 50%, #f0fdf4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}} @keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {['✏️','📚','🎒','📏','✂️','🖍️','📓','📐','🖊️','👩‍🏫'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: `${22 + (i % 3) * 8}px`, left: `${(i * 11) % 92}%`, top: `${(i * 17) % 85}%`, opacity: 0.1, animation: `float ${3 + i % 3}s ease-in-out infinite` }}>{e}</div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #fdba74', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '88px', marginBottom: '8px', animation: 'bounce 2.5s ease-in-out infinite' }}>🏫</div>
        <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#7c2d12', margin: '0 0 6px' }}>School!</h1>
        <p style={{ color: '#f97316', fontSize: '16px', marginBottom: '28px', fontWeight: '700' }}>Pencils, books, bags and more! 🌟</p>

        {/* STEP 1 */}
        <div style={{ background: '#fff7ed', border: '2px solid #fdba74', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#f97316', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>1</div>
            <div style={{ fontWeight: '800', color: '#7c2d12', fontSize: '16px' }}>📖 Learn the Words First</div>
          </div>
          <p style={{ color: '#c2410c', fontSize: '13px', margin: '0 0 14px', lineHeight: '1.6' }}>
            See every school word with its picture, phonetic spelling, audio and an example sentence.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {VOCAB.slice(0, 8).map(v => (
              <span key={v.word} style={{ background: 'white', border: '1px solid #fdba74', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', color: '#7c2d12' }}>{v.emoji} {v.word}</span>
            ))}
            <span style={{ background: 'white', border: '1px solid #fdba74', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', color: '#9ca3af' }}>+{VOCAB.length - 8} more</span>
          </div>
          <button onClick={startLesson} disabled={!mode}
            style={{ width: '100%', background: mode ? 'linear-gradient(135deg, #f97316, #eab308)' : '#e5e7eb', color: mode ? 'white' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: mode ? 'pointer' : 'not-allowed', boxShadow: mode ? '0 6px 20px rgba(249,115,22,0.35)' : 'none' }}>
            {mode ? '📖 Start Lesson → then Quiz' : 'Pick a mode below first'}
          </button>
        </div>

        {/* STEP 2 */}
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

        <button onClick={() => mode && router.push(`/esl-games/live/premium/school/${mode}`)} disabled={!mode}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid', borderColor: mode ? '#fdba74' : '#e5e7eb', background: 'white', color: mode ? '#7c2d12' : '#9ca3af', fontWeight: '700', fontSize: '14px', cursor: mode ? 'pointer' : 'not-allowed' }}>
          ⏩ Skip Lesson — Go Straight to Quiz
        </button>
        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '16px', color: '#fdba74', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>← Back to Premium Games</Link>
      </div>
    </main>
  )
}
