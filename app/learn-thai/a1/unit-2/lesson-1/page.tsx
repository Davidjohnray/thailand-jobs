'use client'
import { useState } from 'react'
import Link from 'next/link'

const SHORT_VOWELS = [
  {
    vowel: 'อะ', symbol: '-ะ', name: 'Sara A', roman: 'a',
    sound: 'Like the "a" in "cut" or "fun" — a short, central vowel sound.',
    position: 'Written after the consonant. The ะ symbol appears to the right.',
    example: { thai: 'กะ', roman: 'ga', english: 'to cut/portion' },
    example2: { thai: 'จะ', roman: 'ja', english: 'will (future marker)' },
    tip: 'This is one of the most important vowels — จะ (ja) is used constantly in Thai to show future tense.',
  },
  {
    vowel: 'อิ', symbol: '◌ิ', name: 'Sara I', roman: 'i',
    sound: 'Like the "i" in "pin" — a short, high front vowel. Shorter than "ee".',
    position: 'Written ABOVE the consonant — a small mark sitting on top.',
    example: { thai: 'กิน', roman: 'gin', english: 'to eat' },
    example2: { thai: 'ติ', roman: 'ti', english: 'to criticise' },
    tip: 'กิน (gin) — to eat — is one of the first words every Thai learner needs. The vowel sits above the ก.',
  },
  {
    vowel: 'อึ', symbol: '◌ึ', name: 'Sara Ue', roman: 'ue',
    sound: 'No English equivalent. Like "uh" but with rounded lips — similar to French "eu" or German "ö". Short version.',
    position: 'Written ABOVE the consonant — a mark with a small hook.',
    example: { thai: 'คึก', roman: 'khuek', english: 'energetic/lively' },
    example2: { thai: 'ขึ้น', roman: 'khuen', english: 'to go up/increase' },
    tip: 'This sound is tricky for English speakers. Try saying "uh" while rounding your lips slightly. ขึ้น (khuen) means to go up — very useful.',
  },
  {
    vowel: 'อุ', symbol: '◌ุ', name: 'Sara U', roman: 'u',
    sound: 'Like the "oo" in "book" — a short, back rounded vowel. Not as long as "oo" in "food".',
    position: 'Written BELOW the consonant — a small mark hanging underneath.',
    example: { thai: 'กุ้ง', roman: 'kung', english: 'shrimp' },
    example2: { thai: 'ทุก', roman: 'thuk', english: 'every/all' },
    tip: 'กุ้ง (kung) — shrimp — is on every Thai menu. ทุก (thuk) means "every" and appears constantly in Thai speech.',
  },
  {
    vowel: 'เอะ', symbol: 'เ◌ะ', name: 'Sara E', roman: 'e',
    sound: 'Like the "e" in "bed" or "pet" — a short, mid-front vowel.',
    position: 'Written BEFORE the consonant. The เ goes to the left, ะ to the right.',
    example: { thai: 'เกะกะ', roman: 'gega', english: 'messy/in the way' },
    example2: { thai: 'เละ', roman: 'le', english: 'mushy/soggy' },
    tip: 'Notice the เ comes BEFORE the consonant when reading left to right — but you pronounce the consonant before the vowel sound.',
  },
  {
    vowel: 'แอะ', symbol: 'แ◌ะ', name: 'Sara Ae', roman: 'ae',
    sound: 'Like the "a" in "cat" or "hat" — a short, low front vowel. More open than เอะ.',
    position: 'Written BEFORE the consonant. แ goes to the left, ะ to the right.',
    example: { thai: 'แกะ', roman: 'gae', english: 'sheep / to carve' },
    example2: { thai: 'แพะ', roman: 'phae', english: 'goat' },
    tip: 'The แ symbol is very common — you\'ll see it on menus and signs everywhere. แกะ means both sheep and "to carve/unwrap".',
  },
  {
    vowel: 'โอะ', symbol: 'โ◌ะ', name: 'Sara O', roman: 'o',
    sound: 'Like the "o" in "top" or "hot" — a short, back vowel. Not the long "oh" sound.',
    position: 'Written BEFORE the consonant. โ to the left, ะ to the right.',
    example: { thai: 'โต๊ะ', roman: 'to', english: 'table' },
    example2: { thai: 'โก้', roman: 'go', english: 'stylish/trendy' },
    tip: 'โต๊ะ (to) means table — seen on every restaurant menu. The small circle above ๊ is a tone mark (mai tri).',
  },
  {
    vowel: 'เอาะ', symbol: 'เ◌าะ', name: 'Sara Aw', roman: 'aw',
    sound: 'Like the "aw" in "law" or "saw" — a short, back rounded vowel.',
    position: 'Written with เ before and าะ after the consonant.',
    example: { thai: 'เกาะ', roman: 'gaw', english: 'island' },
    example2: { thai: 'เพาะ', roman: 'phaw', english: 'to cultivate/grow' },
    tip: 'เกาะ (gaw) means island — Thailand has hundreds of them! This vowel combination wraps around the consonant on both sides.',
  },
  {
    vowel: 'เอิะ', symbol: 'เ◌ิะ', name: 'Sara Oe', roman: 'oe',
    sound: 'No English equivalent. Similar to the "er" in "her" — but shorter and without the "r". Like the French "eu" short.',
    position: 'Written with เ before the consonant and ิะ above and after.',
    example: { thai: 'เงิน', roman: 'ngoen', english: 'money/silver' },
    example2: { thai: 'เดิน', roman: 'doen', english: 'to walk' },
    tip: 'เงิน (ngoen) means both money AND silver — one of the most essential Thai words. เดิน (doen) means to walk.',
  },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

function shuffleFour(correct: string, others: string[]): string[] {
  const picks = others.sort(() => Math.random() - 0.5).slice(0, 3)
  return [correct, ...picks].sort(() => Math.random() - 0.5)
}

const QUIZ_Q = SHORT_VOWELS.map(v => ({
  correct: v.roman,
  vowel: v.vowel,
  name: v.name,
  options: shuffleFour(v.roman, SHORT_VOWELS.map(x => x.roman).filter(x => x !== v.roman)),
}))

export default function Unit2Lesson1() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizQ] = useState(QUIZ_Q)

  const card = SHORT_VOWELS[cardIndex]
  const pct = Math.round((correct / quizQ.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === quizQ[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
    speak(quizQ[quizIndex].vowel)
  }

  const nextQ = () => {
    if (quizIndex + 1 >= quizQ.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e, #0891b2)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 2 · Lesson 1 — Short Vowels</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Learn</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(8,145,178,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(8,145,178,0.1)' }}>
          <span style={{ color: '#0891b2', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {SHORT_VOWELS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#0891b2', borderRadius: '10px', width: `${((cardIndex + 1) / SHORT_VOWELS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#0891b2', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Short Vowels</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #0891b2' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🎵 Thai Vowels — An Overview</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px' }}>
                Thai has <strong>32 vowel forms</strong>, divided into short and long pairs. Short vowels are pronounced quickly; long vowels are held for roughly twice as long. This length distinction changes the meaning of a word. Vowels can appear <strong>before, after, above, or below</strong> the consonant — or even surrounding it on all sides.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { icon: '→', label: 'After consonant', desc: 'e.g. กะ (ga)' },
                  { icon: '↑', label: 'Above consonant', desc: 'e.g. กิ (gi)' },
                  { icon: '↓', label: 'Below consonant', desc: 'e.g. กุ (gu)' },
                  { icon: '←→', label: 'Both sides', desc: 'e.g. เกะ (ge)' },
                ].map(p => (
                  <div key={p.label} style={{ background: '#e0f2fe', borderRadius: '10px', padding: '12px', border: '1px solid #bae6fd' }}>
                    <div style={{ color: '#0891b2', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>{p.icon} {p.label}</div>
                    <div style={{ color: '#374151', fontSize: '13px' }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0c4a6e, #0891b2)', padding: '40px 32px', textAlign: 'center' }}>
              <span style={{ background: '#0891b2', color: 'white', fontSize: '11px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', marginBottom: '20px' }}>Short Vowel</span>
              <div style={{ fontSize: '80px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px', letterSpacing: '4px' }}>{card.vowel}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '20px' }}>{card.name} · /{card.roman}/</div>
              <button onClick={() => speak(card.example.thai)}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
                🔊 Hear example
              </button>
            </div>

            <div style={{ padding: '28px 32px' }}>
              {/* Sound description */}
              <div style={{ background: '#e0f2fe', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '2px solid #bae6fd' }}>
                <div style={{ color: '#0369a1', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>🎵 Sound</div>
                <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{card.sound}</p>
              </div>

              {/* Position */}
              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '2px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>📍 Position in a word</div>
                <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px' }}>{card.position}</p>
                <div style={{ display: 'flex', gap: '8px', background: '#1a1a2e', borderRadius: '10px', padding: '14px 18px', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#22c55e', fontSize: '32px', fontWeight: '900' }}>{card.symbol.replace('◌', 'ก')}</span>
                </div>
              </div>

              {/* Examples */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[card.example, card.example2].map((ex, i) => (
                  <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: '900', color: '#0891b2' }}>{ex.thai}</div>
                      <button onClick={() => speak(ex.thai)} style={{ background: '#e0f2fe', color: '#0891b2', border: '1px solid #bae6fd', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>🔊</button>
                    </div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}>{ex.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{ex.english}</div>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Key tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>

          {/* All 9 mini grid */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>All 9 Short Vowels</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SHORT_VOWELS.map((v, i) => (
                <button key={v.name} onClick={() => { setCardIndex(i); speak(v.example.thai) }}
                  style={{ background: i === cardIndex ? '#0891b2' : '#f9fafb', color: i === cardIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === cardIndex ? '#0891b2' : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 12px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}>
                  {v.vowel}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < SHORT_VOWELS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(SHORT_VOWELS[cardIndex + 1].example.thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #0c4a6e, #0891b2)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next Vowel ({SHORT_VOWELS[cardIndex + 1].vowel}) →
              </button>
            ) : (
              <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                ✅ Take the Quiz →
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#0891b2', fontWeight: '700', fontSize: '14px' }}>Question {quizIndex + 1} of {quizQ.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#0891b2', borderRadius: '10px', width: `${((quizIndex + 1) / quizQ.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What sound does this vowel make?</div>
              <div style={{ fontSize: '72px', fontWeight: '900', color: '#0891b2', lineHeight: 1, marginBottom: '8px', letterSpacing: '4px' }}>{quizQ[quizIndex].vowel}</div>
              <div style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '12px' }}>{quizQ[quizIndex].name}</div>
              <button onClick={() => speak(SHORT_VOWELS.find(v => v.roman === quizQ[quizIndex].correct)?.example.thai || '')}
                style={{ background: '#e0f2fe', color: '#0891b2', border: '2px solid #bae6fd', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear example
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quizQ[quizIndex].options.map(opt => {
                const isCorrect = opt === quizQ[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (selected) {
                  if (isCorrect) { bg = '#e0f2fe'; border = '#0891b2'; textColor = '#0c4a6e' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '20px 12px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ color: textColor, fontWeight: '900', fontSize: '28px', fontFamily: 'monospace', marginBottom: '4px' }}>/{opt}/</div>
                    {selected && isCorrect && <div style={{ color: '#0891b2', fontSize: '18px' }}>✓</div>}
                    {selected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div style={{ background: selected === quizQ[quizIndex].correct ? '#e0f2fe' : '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${selected === quizQ[quizIndex].correct ? '#bae6fd' : '#fca5a5'}` }}>
              {selected === quizQ[quizIndex].correct
                ? <div style={{ color: '#0369a1', fontWeight: '700', fontSize: '15px' }}>✅ Correct! <span style={{ fontWeight: '400' }}>{quizQ[quizIndex].vowel} — {quizQ[quizIndex].name} — makes the /{quizQ[quizIndex].correct}/ sound.</span></div>
                : <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '15px' }}>❌ Not quite. <span style={{ fontWeight: '400' }}>The correct sound is <strong>/{quizQ[quizIndex].correct}/</strong> — {quizQ[quizIndex].name}.</span></div>
              }
            </div>
          )}

          {selected && (
            <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #0c4a6e, #0891b2)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {quizIndex + 1 >= quizQ.length ? '🏆 See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#0891b2' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {quizQ.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#e0f2fe' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#e0f2fe', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #bae6fd', textAlign: 'left' }}>
              <div style={{ color: '#0369a1', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You know all 9 short vowels. Next: Long Vowels — the paired long versions of everything you just learned.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-2/lesson-2" style={{ display: 'block', background: 'linear-gradient(135deg, #0c4a6e, #0891b2)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Long Vowels →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                🔄 Review Again
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
