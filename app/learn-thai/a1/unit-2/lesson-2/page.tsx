'use client'
import { useState } from 'react'
import Link from 'next/link'

const LONG_VOWELS = [
  {
    vowel: 'อา', symbol: '-า', name: 'Sara Aa', roman: 'aa',
    short: 'อะ (a)', sound: 'Like the "a" in "father" or "car" — a long, open sound. Hold it twice as long as อะ.',
    position: 'Written AFTER the consonant — า appears to the right.',
    example: { thai: 'มา', roman: 'maa', english: 'to come' },
    example2: { thai: 'ขา', roman: 'khaa', english: 'leg' },
    tip: 'มา (maa) means "to come" — one of the most useful Thai words. The long า vowel is extremely common and easy to spot.',
  },
  {
    vowel: 'อี', symbol: '◌ี', name: 'Sara Ii', roman: 'ii',
    short: 'อิ (i)', sound: 'Like the "ee" in "see" or "feet" — a long, high front vowel. Hold it longer than อิ.',
    position: 'Written ABOVE the consonant — ี (longer mark) sits on top.',
    example: { thai: 'มี', roman: 'mii', english: 'to have' },
    example2: { thai: 'ดี', roman: 'dii', english: 'good' },
    tip: 'มี (mii) = to have, ดี (dii) = good — two essential words. Notice the vowel mark above the consonant is slightly longer than the short version ิ.',
  },
  {
    vowel: 'อือ', symbol: '◌ือ', name: 'Sara Uue', roman: 'uue',
    short: 'อึ (ue)', sound: 'The long version of อึ — like "uh" with rounded lips, held longer. No English equivalent.',
    position: 'Written ABOVE the consonant with อ and ื marks, then า or ื to the right.',
    example: { thai: 'มือ', roman: 'muue', english: 'hand' },
    example2: { thai: 'ถือ', roman: 'thuue', english: 'to hold/carry' },
    tip: 'มือ (muue) means hand — you\'ll use this constantly. The combination of marks can look complex but the sound is consistent.',
  },
  {
    vowel: 'อู', symbol: '◌ู', name: 'Sara Uu', roman: 'uu',
    short: 'อุ (u)', sound: 'Like the "oo" in "food" or "moon" — a long, back rounded vowel. Longer than อุ.',
    position: 'Written BELOW the consonant — ู (longer mark) hangs underneath.',
    example: { thai: 'ดู', roman: 'duu', english: 'to look/watch' },
    example2: { thai: 'อยู่', roman: 'yuu', english: 'to be/stay' },
    tip: 'ดู (duu) = to watch/look — ดูทีวี (duu thiiwii) = watch TV! อยู่ (yuu) = to be somewhere — very common in conversation.',
  },
  {
    vowel: 'เอ', symbol: 'เ◌', name: 'Sara Ee', roman: 'ee',
    short: 'เอะ (e)', sound: 'Like the "a" in "say" or "ay" — a long, mid front vowel. Think of the vowel sound in "name" or "game".',
    position: 'Written BEFORE the consonant — เ appears to the left, nothing to the right.',
    example: { thai: 'เก', roman: 'gee', english: 'smart/clever (informal)' },
    example2: { thai: 'เขา', roman: 'khao', english: 'he/she/they' },
    tip: 'เขา (khao) — he, she, or they — is one of the most used pronouns in Thai. Thai does not have separate words for he and she.',
  },
  {
    vowel: 'แอ', symbol: 'แ◌', name: 'Sara Aae', roman: 'aae',
    short: 'แอะ (ae)', sound: 'Like the "a" in "cat" or "bad" — a long, low front vowel. More open than เอ.',
    position: 'Written BEFORE the consonant — แ appears to the left.',
    example: { thai: 'แม่', roman: 'maae', english: 'mother' },
    example2: { thai: 'แพง', roman: 'phaeng', english: 'expensive' },
    tip: 'แม่ (maae) = mother — one of the first words everyone learns. แพง (phaeng) = expensive — very useful when shopping at markets!',
  },
  {
    vowel: 'โอ', symbol: 'โ◌', name: 'Sara Oo', roman: 'oo',
    short: 'โอะ (o)', sound: 'Like the "o" in "go" or "home" — a long, back vowel. Clear and round.',
    position: 'Written BEFORE the consonant — โ appears to the left.',
    example: { thai: 'โรง', roman: 'roong', english: 'building/hall' },
    example2: { thai: 'โต', roman: 'too', english: 'to grow/big' },
    tip: 'โรงเรียน (roong rian) = school, โรงพยาบาล (roong phayabaan) = hospital. The word โรง (roong) meaning building is in hundreds of compound words.',
  },
  {
    vowel: 'ออ', symbol: '◌อ / เ◌า', name: 'Sara Oo (open)', roman: 'oo',
    short: 'เอาะ (aw)', sound: 'Like the "aw" in "law" or "saw" — a long, back rounded vowel. Open and rounded.',
    position: 'Written AFTER the consonant as อ, OR as เ◌า (before and after).',
    example: { thai: 'พอ', roman: 'phoo', english: 'enough' },
    example2: { thai: 'เขา', roman: 'khao', english: 'he/she (also mountain)' },
    tip: 'พอ (phoo) = enough — very useful. พอดี (phoo dii) = just right, perfect. Notice เขา can mean both "he/she" and "mountain" depending on tone.',
  },
  {
    vowel: 'เออ', symbol: 'เ◌อ', name: 'Sara Ooe', roman: 'ooe',
    short: 'เอิะ (oe)', sound: 'Like "er" in "her" but without the "r" — a long, mid central vowel. Similar to the French "eu" held longer.',
    position: 'Written with เ before the consonant and อ after.',
    example: { thai: 'เธอ', roman: 'thooe', english: 'she/her (formal)' },
    example2: { thai: 'เปล่า', roman: 'plao', english: 'no/not at all' },
    tip: 'เธอ (thooe) is a more formal/poetic way to say "she" or "you" in Thai. เปล่า (plao) = no, not at all — very useful in conversations.',
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

const QUIZ_Q = LONG_VOWELS.map(v => ({
  correct: v.roman, vowel: v.vowel, name: v.name, short: v.short,
  options: shuffleFour(v.roman, LONG_VOWELS.map(x => x.roman).filter(x => x !== v.roman)),
}))

export default function Unit2Lesson2() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizQ] = useState(QUIZ_Q)

  const card = LONG_VOWELS[cardIndex]
  const pct = Math.round((correct / quizQ.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === quizQ[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
    speak(LONG_VOWELS.find(v => v.roman === quizQ[quizIndex].correct)?.example.thai || '')
  }

  const nextQ = () => {
    if (quizIndex + 1 >= quizQ.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #164e63, #06b6d4)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 2 · Lesson 2 — Long Vowels</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Learn</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(6,182,212,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
          <span style={{ color: '#0891b2', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {LONG_VOWELS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#06b6d4', borderRadius: '10px', width: `${((cardIndex + 1) / LONG_VOWELS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#0891b2', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Long Vowels</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #06b6d4' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🎵 Short vs Long Vowels</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px' }}>
                Every short vowel has a long pair. The sound is the same but held for <strong>roughly twice as long</strong>. This length difference changes the meaning — กิน (gin) means "to eat" but กีน doesn't mean anything. Length is as important as the vowel quality itself.
              </p>
              <div style={{ background: '#ecfeff', borderRadius: '12px', padding: '16px 20px', border: '2px solid #a5f3fc' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ color: '#0891b2', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Short — Quick</div>
                    {[['อะ', 'a', 'กะ (portion)'], ['อิ', 'i', 'กิน (eat)'], ['อุ', 'u', 'กุ้ง (shrimp)']].map(r => (
                      <div key={r[0]} style={{ display: 'flex', gap: '10px', marginBottom: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '900', color: '#0891b2', width: '32px' }}>{r[0]}</span>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>/{r[1]}/ · {r[2]}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ color: '#06b6d4', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Long — Extended</div>
                    {[['อา', 'aa', 'มา (come)'], ['อี', 'ii', 'มี (have)'], ['อู', 'uu', 'ดู (watch)']].map(r => (
                      <div key={r[0]} style={{ display: 'flex', gap: '10px', marginBottom: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '900', color: '#06b6d4', width: '32px' }}>{r[0]}</span>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>/{r[1]}/ · {r[2]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #164e63, #06b6d4)', padding: '40px 32px', textAlign: 'center' }}>
              <span style={{ background: '#06b6d4', color: 'white', fontSize: '11px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', marginBottom: '16px' }}>Long Vowel</span>
              <div style={{ fontSize: '72px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px', letterSpacing: '4px' }}>{card.vowel}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '8px' }}>{card.name} · /{card.roman}/</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>Long version of {card.short}</div>
              <button onClick={() => speak(card.example.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>🔊 Hear example</button>
            </div>

            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#ecfeff', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '2px solid #a5f3fc' }}>
                <div style={{ color: '#0369a1', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>🎵 Sound</div>
                <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{card.sound}</p>
              </div>

              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '2px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>📍 Position</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.position}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[card.example, card.example2].map((ex, i) => (
                  <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: '900', color: '#06b6d4' }}>{ex.thai}</div>
                      <button onClick={() => speak(ex.thai)} style={{ background: '#ecfeff', color: '#0891b2', border: '1px solid #a5f3fc', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>🔊</button>
                    </div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}>{ex.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{ex.english}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Key tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>All 9 Long Vowels</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {LONG_VOWELS.map((v, i) => (
                <button key={v.name} onClick={() => { setCardIndex(i); speak(v.example.thai) }}
                  style={{ background: i === cardIndex ? '#06b6d4' : '#f9fafb', color: i === cardIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === cardIndex ? '#06b6d4' : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 12px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {v.vowel}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < LONG_VOWELS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(LONG_VOWELS[cardIndex + 1].example.thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #164e63, #06b6d4)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next Vowel ({LONG_VOWELS[cardIndex + 1].vowel}) →
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
            <span style={{ color: '#06b6d4', fontWeight: '700', fontSize: '14px' }}>Question {quizIndex + 1} of {quizQ.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#06b6d4', borderRadius: '10px', width: `${((quizIndex + 1) / quizQ.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What sound does this long vowel make?</div>
              <div style={{ fontSize: '72px', fontWeight: '900', color: '#06b6d4', lineHeight: 1, marginBottom: '8px' }}>{quizQ[quizIndex].vowel}</div>
              <div style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '12px' }}>{quizQ[quizIndex].name}</div>
              <button onClick={() => speak(LONG_VOWELS.find(v => v.roman === quizQ[quizIndex].correct)?.example.thai || '')}
                style={{ background: '#ecfeff', color: '#0891b2', border: '2px solid #a5f3fc', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear example
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quizQ[quizIndex].options.map(opt => {
                const isCorrect = opt === quizQ[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (selected) {
                  if (isCorrect) { bg = '#ecfeff'; border = '#06b6d4'; textColor = '#164e63' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '20px 12px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ color: textColor, fontWeight: '900', fontSize: '28px', fontFamily: 'monospace', marginBottom: '4px' }}>/{opt}/</div>
                    {selected && isCorrect && <div style={{ color: '#06b6d4', fontSize: '18px' }}>✓</div>}
                    {selected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div style={{ background: selected === quizQ[quizIndex].correct ? '#ecfeff' : '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${selected === quizQ[quizIndex].correct ? '#a5f3fc' : '#fca5a5'}` }}>
              {selected === quizQ[quizIndex].correct
                ? <div style={{ color: '#164e63', fontWeight: '700', fontSize: '15px' }}>✅ Correct! <span style={{ fontWeight: '400' }}>{quizQ[quizIndex].vowel} — {quizQ[quizIndex].name} — makes the /{quizQ[quizIndex].correct}/ sound.</span></div>
                : <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '15px' }}>❌ Not quite. <span style={{ fontWeight: '400' }}>The correct sound is <strong>/{quizQ[quizIndex].correct}/</strong> — {quizQ[quizIndex].name}.</span></div>
              }
            </div>
          )}
          {selected && (
            <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #164e63, #06b6d4)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
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
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#06b6d4' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {quizQ.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#ecfeff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#ecfeff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #a5f3fc', textAlign: 'left' }}>
              <div style={{ color: '#164e63', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You now know all 18 core vowels — 9 short and 9 long. Next: Vowel Combinations — the more complex vowel forms used in everyday Thai.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-2/lesson-3" style={{ display: 'block', background: 'linear-gradient(135deg, #164e63, #06b6d4)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Vowel Combinations →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                🔄 Review Again
              </button>
              <Link href="/learn-thai/a1/unit-2/lesson-1" style={{ display: 'block', background: '#f9fafb', color: '#6b7280', border: '2px solid #e5e7eb', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                ← Back to Short Vowels
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
