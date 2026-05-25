'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const SESSION_KEY = 'premium_games_session'

const MODES = [
  { id: 'solo', emoji: '👤', label: 'Solo Play', desc: 'Play on your own!', color: '#f59e0b' },
  { id: 'tv', emoji: '📺', label: 'TV Mode', desc: 'Play on the big screen!', color: '#1d4ed8' },
]

const VOCAB = [
  { word: 'Electricity', definition: 'A form of energy caused by the movement of electrons, used to power lights, machines and devices.', sentence: 'We use electricity every day to power our phones, lights and computers.' },
  { word: 'Negative charge', definition: 'One of the two types of electric charge — opposite to positive charge. Electrons carry a negative charge.', sentence: 'A negative charge is attracted to a positive charge.' },
  { word: 'Electrocution', definition: 'Injury or death caused by electric shock passing through the body.', sentence: 'Always follow safety rules to avoid electrocution near power lines.' },
  { word: 'Parallel circuit', definition: 'A circuit where components are connected across multiple paths, so current can flow through more than one route.', sentence: 'In a parallel circuit, if one bulb breaks the others stay on.' },
  { word: 'Electromagnet', definition: 'A magnet created by passing electric current through a coil of wire wrapped around an iron core.', sentence: 'An electromagnet can be switched on and off by controlling the electric current.' },
  { word: 'Electric current', definition: 'The flow of electric charge through a conductor, measured in amperes (A).', sentence: 'Electric current flows through the wire and lights up the bulb.' },
  { word: 'Precaution', definition: 'A safety measure taken in advance to prevent danger or accidents.', sentence: 'One important precaution is never touching electrical sockets with wet hands.' },
  { word: 'Series circuit', definition: 'A circuit where all components are connected in a single loop, so current flows through each one in turn.', sentence: 'In a series circuit, if one bulb goes out, all the others go out too.' },
  { word: 'Conductor', definition: 'A material that allows electric current to pass through it easily, such as copper or aluminium.', sentence: 'Copper wire is a good conductor and is used in most electrical cables.' },
  { word: 'Brightness', definition: 'The amount of light produced by a bulb — affected by the voltage and the number of bulbs in a circuit.', sentence: 'Adding more bulbs to a series circuit reduces the brightness of each one.' },
  { word: 'Static electricity', definition: 'A buildup of electric charge on the surface of an object, caused by friction between materials.', sentence: 'You can create static electricity by rubbing a balloon against your hair.' },
  { word: 'Consumption', definition: 'The amount of electrical energy used by a device or household over a period of time.', sentence: 'Turning off lights when you leave a room reduces electricity consumption.' },
]

// Split a word into its component words (for two-word terms) and letters
function getWordGroups(word: string): string[][] {
  return word.split(' ').map(w => w.split(''))
}

// Get flat letter index from word group position
function getFlatIndex(groups: string[][], groupIdx: number, letterIdx: number): number {
  let idx = 0
  for (let g = 0; g < groupIdx; g++) idx += groups[g].length
  return idx + letterIdx
}

export default function ElectricityPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)
  const [phase, setPhase] = useState<'menu' | 'lesson'>('menu')
  const [mode, setMode] = useState('')
  const [lessonIdx, setLessonIdx] = useState(0)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [revealedLetters, setRevealedLetters] = useState<boolean[]>([])
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
    if (data) { localStorage.setItem(SESSION_KEY, 'true'); await supabase.from('pro_game_passwords').update({ last_login: new Date().toISOString() }).eq('id', data.id); setAuthed(true) }
    else setError('Invalid password. Please check your access code.')
    setLogging(false)
  }

  const getTotalLetters = (word: string) => word.replace(/ /g, '').length

  const startLesson = () => {
    setLessonIdx(0); setStep(1)
    setRevealedLetters(new Array(getTotalLetters(VOCAB[0].word)).fill(false))
    setShowSentence(false)
    setPhase('lesson')
  }

  const goToStep = (s: 1 | 2 | 3) => {
    setStep(s)
    if (s === 2) setRevealedLetters(new Array(getTotalLetters(VOCAB[lessonIdx].word)).fill(false))
    if (s === 3) setShowSentence(false)
  }

  const revealLetter = (i: number) => {
    setRevealedLetters(prev => { const n = [...prev]; n[i] = true; return n })
  }

  const revealAll = () => setRevealedLetters(new Array(getTotalLetters(VOCAB[lessonIdx].word)).fill(true))

  const nextWord = () => {
    if (lessonIdx + 1 >= VOCAB.length) {
      router.push(`/esl-games/live/premium/electricity/${mode}`)
    } else {
      const next = lessonIdx + 1
      setLessonIdx(next)
      setStep(1)
      setRevealedLetters(new Array(getTotalLetters(VOCAB[next].word)).fill(false))
      setShowSentence(false)
    }
  }

  const prevWord = () => {
    if (lessonIdx > 0) {
      const prev = lessonIdx - 1
      setLessonIdx(prev)
      setStep(1)
      setRevealedLetters(new Array(getTotalLetters(VOCAB[prev].word)).fill(false))
      setShowSentence(false)
    }
  }

  if (checking) return <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '64px' }}>⚡</div></main>

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e 0%, #1e3a5f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '3px solid #f59e0b' }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>⚡</div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>Electricity!</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Premium Science Game — Enter your access code</p>
        <input value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="ESL-XXXX-XXXX"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: error ? '2px solid #ef4444' : '2px solid #f59e0b', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontWeight: 'bold' }} />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button onClick={handleLogin} disabled={logging}
          style={{ width: '100%', background: logging ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #1d4ed8)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: logging ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(245,158,11,0.3)' }}>
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
    const wordGroups = getWordGroups(v.word)
    const isMultiWord = wordGroups.length > 1
    const isLast = lessonIdx + 1 >= VOCAB.length
    const allRevealed = revealedLetters.every(Boolean)

    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e 0%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <style>{`@keyframes wordPop{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes zap{0%,100%{transform:scale(1)}50%{transform:scale(1.2) rotate(5deg)}}`}</style>

        {/* Header */}
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={() => setPhase('menu')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px 16px', borderRadius: '20px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>← Exit Lesson</button>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '14px', color: '#f59e0b' }}>
            📖 {lessonIdx + 1} / {VOCAB.length}
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap', maxWidth: '600px' }}>
          {VOCAB.map((_, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < lessonIdx ? '#22c55e' : i === lessonIdx ? '#f59e0b' : 'rgba(255,255,255,0.2)', transition: 'background 0.3s' }} />)}
        </div>

        {/* Step tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '6px', width: '100%', maxWidth: '600px' }}>
          {[
            { s: 1 as const, label: '1 — Definition' },
            { s: 2 as const, label: '2 — Spelling' },
            { s: 3 as const, label: '3 — Sentence' },
          ].map(t => (
            <button key={t.s} onClick={() => goToStep(t.s)}
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: step === t.s ? '#f59e0b' : 'transparent', color: step === t.s ? 'white' : 'rgba(255,255,255,0.5)', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div key={`${lessonIdx}-${step}`} style={{ background: 'white', borderRadius: '28px', padding: '32px', maxWidth: '600px', width: '100%', boxShadow: '0 16px 48px rgba(0,0,0,0.3)', border: '3px solid #f59e0b', animation: 'wordPop 0.3s ease', marginBottom: '16px' }}>

          {/* Word title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '52px', marginBottom: '8px', animation: 'zap 3s ease-in-out infinite' }}>⚡</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a2e', letterSpacing: '2px' }}>{v.word}</div>
            <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
              {step === 1 ? 'Definition' : step === 2 ? 'Spelling Practice' : 'Example Sentence'}
            </div>
          </div>

          {/* STEP 1 — DEFINITION */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ color: '#92400e', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>📖 Definition</div>
                <p style={{ color: '#1a1a2e', fontSize: '17px', lineHeight: '1.7', margin: 0, fontFamily: 'Georgia, serif' }}>{v.definition}</p>
              </div>
              <button onClick={() => goToStep(2)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
                ✅ Got it! → Practice Spelling
              </button>
            </div>
          )}

          {/* STEP 2 — SPELLING */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ background: '#eff6ff', border: '2px solid #93c5fd', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ color: '#1d4ed8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>🔤 Tap each letter to reveal the spelling</div>

                {/* MULTI-WORD: one row per word */}
                {isMultiWord ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                    {wordGroups.map((wordLetters, groupIdx) => (
                      <div key={groupIdx}>
                        <div style={{ color: '#6b7280', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', textAlign: 'center' }}>
                          Word {groupIdx + 1}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'nowrap' }}>
                          {wordLetters.map((letter, letterIdx) => {
                            const flatIdx = getFlatIndex(wordGroups, groupIdx, letterIdx)
                            return (
                              <button key={letterIdx} onClick={() => revealLetter(flatIdx)}
                                style={{ background: revealedLetters[flatIdx] ? '#1d4ed8' : '#e0f2fe', border: revealedLetters[flatIdx] ? '2px solid #1d4ed8' : '2px solid #93c5fd', borderRadius: '10px', width: '44px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px', color: revealedLetters[flatIdx] ? 'white' : '#93c5fd', cursor: 'pointer', transition: 'all 0.2s', boxShadow: revealedLetters[flatIdx] ? '0 4px 12px rgba(29,78,216,0.3)' : 'none', flexShrink: 0 }}>
                                {revealedLetters[flatIdx] ? letter.toUpperCase() : '?'}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* SINGLE WORD: break into rows of max 7 letters */
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'nowrap', marginBottom: '12px' }}>
    {(() => {
      const allLetters = wordGroups[0]
      const count = allLetters.length
      const boxSize = count <= 7 ? 44 : count <= 9 ? 38 : count <= 11 ? 32 : 28
      const fontSize = count <= 7 ? 20 : count <= 9 ? 18 : count <= 11 ? 15 : 13
      return allLetters.map((letter, flatIdx) => (
        <button key={flatIdx} onClick={() => revealLetter(flatIdx)}
          style={{ background: revealedLetters[flatIdx] ? '#1d4ed8' : '#e0f2fe', border: revealedLetters[flatIdx] ? '2px solid #1d4ed8' : '2px solid #93c5fd', borderRadius: '10px', width: `${boxSize}px`, height: `${boxSize + 8}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: `${fontSize}px`, color: revealedLetters[flatIdx] ? 'white' : '#93c5fd', cursor: 'pointer', transition: 'all 0.2s', boxShadow: revealedLetters[flatIdx] ? '0 4px 12px rgba(29,78,216,0.3)' : 'none', flexShrink: 0 }}>
          {revealedLetters[flatIdx] ? letter.toUpperCase() : '?'}
        </button>
      ))
    })()}
  </div>
                )}

                <button onClick={revealAll} style={{ width: '100%', background: '#eff6ff', color: '#1d4ed8', border: '2px solid #93c5fd', padding: '10px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  👁 Reveal All Letters
                </button>
              </div>
              {allRevealed && (
                <button onClick={() => goToStep(3)} style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.4)', animation: 'fadeIn 0.3s ease' }}>
                  ✅ Spelled it! → See Example Sentence
                </button>
              )}
            </div>
          )}

          {/* STEP 3 — SENTENCE */}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {!showSentence ? (
                <div>
                  <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
                    <div style={{ color: '#15803d', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Can you use <strong>"{v.word}"</strong> in a sentence?</div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>Try to say it aloud before revealing the example!</div>
                  </div>
                  <button onClick={() => setShowSentence(true)} style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.4)' }}>
                    💬 Show Example Sentence
                  </button>
                </div>
              ) : (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                    <div style={{ color: '#15803d', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>💬 Example Sentence</div>
                    <p style={{ color: '#14532d', fontSize: '17px', lineHeight: '1.7', margin: 0, fontFamily: 'Georgia, serif' }}>
                      {v.sentence.split(new RegExp(`(${v.word})`, 'i')).map((part, i) =>
                        part.toLowerCase() === v.word.toLowerCase()
                          ? <strong key={i} style={{ color: '#16a34a', textDecoration: 'underline' }}>{part}</strong>
                          : part
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '600px' }}>
          {lessonIdx > 0 && (
            <button onClick={prevWord} style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', color: 'white', padding: '14px 24px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>← Back</button>
          )}
          {(step === 3 && showSentence) || step < 3 ? (
            <button onClick={nextWord}
              style={{ flex: 1, background: isLast ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: isLast ? '0 6px 20px rgba(34,197,94,0.4)' : '0 6px 20px rgba(245,158,11,0.4)' }}>
              {isLast ? '🎮 Start the Quiz! →' : 'Next Word →'}
            </button>
          ) : (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: '15px' }}>
              Complete all 3 steps to continue →
            </div>
          )}
        </div>
      </main>
    )
  }

  // ============================================================
  // MENU
  // ============================================================
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a1a2e 0%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}} @keyframes zap{0%,100%{transform:scale(1)}50%{transform:scale(1.2) rotate(5deg)}}`}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {['⚡','🔋','💡','🔌','🧲','⚙️','🔬','💻','🌩️','🔦'].map((e, i) => (
          <div key={i} style={{ position: 'absolute', fontSize: `${20 + (i % 3) * 8}px`, left: `${(i * 11) % 92}%`, top: `${(i * 17) % 85}%`, opacity: 0.08, animation: `float ${3 + i % 3}s ease-in-out infinite` }}>{e}</div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '32px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '3px solid #f59e0b', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '88px', marginBottom: '8px', animation: 'zap 2s ease-in-out infinite' }}>⚡</div>
        <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 6px' }}>Electricity</h1>
        <p style={{ color: '#f59e0b', fontSize: '15px', marginBottom: '8px', fontWeight: '700' }}>Science Vocabulary — Prathom / Matthayom 🌟</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
          {['⚡ Electric current', '🔋 Series circuit', '🧲 Electromagnet', '💡 Conductor'].map(tag => (
            <span key={tag} style={{ background: '#fffbeb', color: '#92400e', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', border: '1px solid #fde68a' }}>{tag}</span>
          ))}
        </div>

        <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#f59e0b', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>1</div>
            <div style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '16px' }}>📖 Learn the Vocabulary First</div>
          </div>
          <p style={{ color: '#92400e', fontSize: '13px', margin: '0 0 14px', lineHeight: '1.6' }}>
            Work through all 12 electricity words — definition, spelling practice and example sentence — before the quiz.
          </p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {VOCAB.slice(0, 6).map(v => <span key={v.word} style={{ background: 'white', border: '1px solid #fde68a', borderRadius: '8px', padding: '3px 8px', fontSize: '11px', fontWeight: '700', color: '#92400e' }}>⚡ {v.word}</span>)}
            <span style={{ background: 'white', border: '1px solid #fde68a', borderRadius: '8px', padding: '3px 8px', fontSize: '11px', fontWeight: '700', color: '#9ca3af' }}>+{VOCAB.length - 6} more</span>
          </div>
          <button onClick={startLesson} disabled={!mode}
            style={{ width: '100%', background: mode ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#e5e7eb', color: mode ? 'white' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: mode ? 'pointer' : 'not-allowed', boxShadow: mode ? '0 6px 20px rgba(245,158,11,0.35)' : 'none' }}>
            {mode ? '📖 Start Lesson → then Quiz' : 'Pick a mode below first'}
          </button>
        </div>

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

        <button onClick={() => mode && router.push(`/esl-games/live/premium/electricity/${mode}`)} disabled={!mode}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid', borderColor: mode ? '#fde68a' : '#e5e7eb', background: 'white', color: mode ? '#92400e' : '#9ca3af', fontWeight: '700', fontSize: '14px', cursor: mode ? 'pointer' : 'not-allowed' }}>
          ⏩ Skip Lesson — Go Straight to Quiz
        </button>

        <Link href="/esl-games/live/premium" style={{ display: 'block', marginTop: '16px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>← Back to Premium Games</Link>
      </div>
    </main>
  )
}
