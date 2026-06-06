'use client'
import { useState } from 'react'
import Link from 'next/link'

const TENS = [
  { num: 11, thai: 'สิบเอ็ด', roman: 'sip et', english: 'Eleven', note: 'สิบ (ten) + เอ็ด (special word for 1 in final position). Note: เอ็ด not หนึ่ง — this is the only exception for 1 at the end.', mnemonic: 'Eleven always uses เอ็ด — remember "et" at the end.' },
  { num: 12, thai: 'สิบสอง', roman: 'sip soong', english: 'Twelve', note: 'สิบ + สอง. From 12 onwards the pattern is completely regular — just add the number after สิบ.', mnemonic: 'Twelve = ten-two. Simple!' },
  { num: 15, thai: 'สิบห้า', roman: 'sip haa', english: 'Fifteen', note: 'สิบ + ห้า. The pattern works for all of 13–19: สิบสาม, สิบสี่, สิบห้า, สิบหก, สิบเจ็ด, สิบแปด, สิบเก้า.', mnemonic: 'Fifteen = ten-five (sip haa). Easy once you know 1–10.' },
  { num: 20, thai: 'ยี่สิบ', roman: 'yii sip', english: 'Twenty', note: 'The ONE irregularity in Thai numbers. 2 is สอง (soong) but 20 is ยี่สิบ (yii sip) — NOT สองสิบ. This is the only exception you need to remember.', mnemonic: '20 = ยี่สิบ — "yee sip" — just memorise this one!' },
  { num: 21, thai: 'ยี่สิบเอ็ด', roman: 'yii sip et', english: 'Twenty-one', note: 'ยี่สิบ (20) + เอ็ด (1 at the end). Remember — 1 at the end of any number is always เอ็ด, not หนึ่ง.', mnemonic: 'Twenty-one = yii sip et. The เอ็ด rule applies here too.' },
  { num: 25, thai: 'ยี่สิบห้า', roman: 'yii sip haa', english: 'Twenty-five', note: 'ยี่สิบ (20) + ห้า (5). All numbers 22–29 follow: ยี่สิบ + the unit number.', mnemonic: 'Twenty-five = yii sip haa. Once you know 20, the rest is just adding.' },
  { num: 30, thai: 'สามสิบ', roman: 'saam sip', english: 'Thirty', note: 'สาม (3) + สิบ. From 30 onwards the pattern is completely regular: สี่สิบ (40), ห้าสิบ (50), หกสิบ (60), เจ็ดสิบ (70), แปดสิบ (80), เก้าสิบ (90).', mnemonic: 'Thirty = three-ten (saam sip). The pattern is clear now!' },
  { num: 50, thai: 'ห้าสิบ', roman: 'haa sip', english: 'Fifty', note: 'ห้า (5) + สิบ. Same pattern. ห้าสิบ is also a common age milestone in Thai culture.', mnemonic: 'Fifty = haa sip. Five-ten.' },
  { num: 99, thai: 'เก้าสิบเก้า', roman: 'gao sip gao', english: 'Ninety-nine', note: 'เก้าสิบ (90) + เก้า (9). Notice 9 in the units position is เก้า (not เอ็ด — that\'s only for 1). The pattern works perfectly.', mnemonic: 'Ninety-nine = gao sip gao. Nine-ten-nine.' },
  { num: 100, thai: 'หนึ่งร้อย', roman: 'nueng roi', english: 'One hundred', note: 'ร้อย (roi) means hundred. หนึ่งร้อย = one hundred. สองร้อย = two hundred. You\'re now equipped to count to 999 and beyond!', mnemonic: 'Hundred = ร้อย (roi). Remember: roi = row of hundreds.' },
]

const PATTERNS = [
  { label: 'Teens (13–19)', pattern: 'sip + number', example: 'sip saam = 13, sip sii = 14, sip hok = 16' },
  { label: 'Exception: 11', pattern: 'sip + et', example: 'sip et = 11 (never sip nueng)' },
  { label: 'Tens (30–90)', pattern: 'number + sip', example: 'saam sip = 30, sii sip = 40, haa sip = 50' },
  { label: 'Exception: 20', pattern: 'yii sip (not soong sip)', example: 'yii sip = 20, yii sip nueng = 21' },
  { label: 'Compound (21–99)', pattern: 'tens + units', example: 'saam sip haa = 35, hok sip jet = 67' },
  { label: 'Exception: units 1', pattern: 'et at end', example: 'yii sip et = 21, saam sip et = 31' },
]

const QUIZ_Q = [
  { q: 'How do you say 20 in Thai? (Watch out — there\'s a special word!)', correct: 'Yii sip', options: ['Soong sip', 'Yii sip', 'Nueng sip', 'Sii sip'] },
  { q: 'How do you say 11 in Thai?', correct: 'Sip et', options: ['Sip nueng', 'Sip soong', 'Sip et', 'Et sip'] },
  { q: 'What is the Thai word for "hundred"?', correct: 'Roi', options: ['Sip', 'Pan', 'Roi', 'Muen'] },
  { q: 'How do you say 35 in Thai?', correct: 'Saam sip haa', options: ['Haa sip saam', 'Saam sip haa', 'Sip saam haa', 'Yii sip haa'] },
  { q: 'When does the number 1 become "et" instead of "nueng"?', correct: 'When it appears at the end of a number', options: ['When it appears at the start', 'When it appears at the end of a number', 'Always', 'Never'] },
  { q: 'How do you say 99 in Thai?', correct: 'Gao sip gao', options: ['Gao gao sip', 'Sip gao gao', 'Gao sip gao', 'Gao roi gao'] },
  { q: 'How do you say 50 in Thai?', correct: 'Haa sip', options: ['Sip haa', 'Haa sip', 'Haa roi', 'Sip nueng haa'] },
  { q: 'How do you build numbers 30 to 90 in Thai?', correct: 'Number + sip', options: ['Sip + number', 'Number + sip', 'Roi + number', 'Number + roi'] },
]

const SCRIPT_Q = TENS.map(n => ({
  thai: n.thai, roman: n.roman, english: n.english, num: n.num,
  options: [n.num, ...TENS.filter(x => x.num !== n.num).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.num)].sort(() => Math.random() - 0.5),
})).sort(() => Math.random() - 0.5)

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit5Lesson2() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'script' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [scriptSelected, setScriptSelected] = useState<string | null>(null)
  const [scriptScore, setScriptScore] = useState(0)
  const [scriptAnswers, setScriptAnswers] = useState<boolean[]>([])

  const card = TENS[cardIndex]
  const pct = Math.round((correct / QUIZ_Q.length) * 100)
  const scriptPct = Math.round((scriptScore / SCRIPT_Q.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === QUIZ_Q[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
  }

  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ_Q.length) { setPhase('script'); setScriptIndex(0); setScriptSelected(null); setScriptScore(0); setScriptAnswers([]); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 5 · Lesson 2 — Numbers 11–100</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ id: 'learn', label: '📖 Learn' }, { id: 'quiz', label: '🧠 Quiz' }, { id: 'script', label: '✍️ Script' }].map(tab => (
            <button key={tab.id} onClick={() => {
              if (tab.id === 'quiz') { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }
              if (tab.id === 'script') { setScriptIndex(0); setScriptSelected(null); setScriptScore(0); setScriptAnswers([]) }
              setPhase(tab.id as any)
            }} style={{ background: phase === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(124,58,237,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
          <span style={{ color: '#7c3aed', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {TENS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#7c3aed', borderRadius: '10px', width: `${((cardIndex + 1) / TENS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#7c3aed', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Numbers 11–100</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #7c3aed' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🔢 Building Bigger Numbers</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px' }}>
                Thai numbers are beautifully logical — with just 2 exceptions to remember. Once you know the pattern, you can count to 999.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                {PATTERNS.map((p, i) => (
                  <div key={i} style={{ background: i === 1 || i === 3 || i === 5 ? '#fff7ed' : '#f5f3ff', borderRadius: '10px', padding: '12px 14px', border: `1px solid ${i === 1 || i === 3 || i === 5 ? '#fed7aa' : '#ede9fe'}` }}>
                    <div style={{ color: i === 1 || i === 3 || i === 5 ? '#c2410c' : '#6d28d9', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                      {i === 1 || i === 3 || i === 5 ? '⚠️ ' : ''}{p.label}
                    </div>
                    <div style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>{p.pattern}</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>{p.example}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', padding: '36px 32px', textAlign: 'center', position: 'relative' }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Number</div>
              <div style={{ fontSize: '80px', fontWeight: '900', color: 'rgba(255,255,255,0.15)', position: 'absolute', right: '28px', top: '16px', lineHeight: 1 }}>{card.num}</div>
              <div style={{ fontSize: '72px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '10px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>{card.roman} — {card.english}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>🐢 Slow</button>
              </div>
            </div>
            <div style={{ padding: '24px 32px' }}>
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 16px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Memory tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.mnemonic}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Key Numbers</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TENS.map((n, i) => (
                <button key={n.num} onClick={() => { setCardIndex(i); speak(n.thai) }}
                  style={{ background: i === cardIndex ? '#7c3aed' : '#f9fafb', color: i === cardIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === cardIndex ? '#7c3aed' : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 12px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center', minWidth: '56px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '900' }}>{n.thai}</div>
                  <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.7 }}>{n.num}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < TENS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(TENS[cardIndex + 1].thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {TENS[cardIndex + 1].thai} ({TENS[cardIndex + 1].num}) →
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
            <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#7c3aed', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ color: '#1a1a2e', fontSize: '19px', fontWeight: '800', lineHeight: '1.4', marginBottom: '24px', textAlign: 'center' }}>{QUIZ_Q[quizIndex].q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_Q[quizIndex].options.map(opt => {
                const isCorrect = opt === QUIZ_Q[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = '#f5f3ff'; border = '#7c3aed'; textColor = '#5b21b6' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#7c3aed', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f5f3ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#ede9fe' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#5b21b6', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #7c3aed' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Look at the Thai number and choose the correct value. Questions are in random order.</p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#7c3aed', borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Which number is this?</div>
              <div style={{ fontSize: '72px', fontWeight: '900', color: '#7c3aed', lineHeight: 1, marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#f5f3ff', color: '#7c3aed', border: '2px solid #ede9fe', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {SCRIPT_Q[scriptIndex].options.map(num => {
                const isCorrect = num === SCRIPT_Q[scriptIndex].num
                const isSelected = scriptSelected === String(num)
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#f5f3ff'; border = '#7c3aed'; textColor = '#5b21b6' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={num} onClick={() => {
                    if (scriptSelected) return
                    setScriptSelected(String(num))
                    if (isCorrect) setScriptScore(prev => prev + 1)
                    setScriptAnswers(prev => [...prev, isCorrect])
                  }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '20px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: textColor }}>{num}</div>
                    {scriptSelected && <div style={{ color: textColor, fontSize: '13px', fontWeight: '700', marginTop: '4px' }}>{TENS.find(n => n.num === num)?.roman || ''}</div>}
                    {scriptSelected && isCorrect && <div style={{ color: '#7c3aed', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                    {scriptSelected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].num === Number(scriptSelected) ? '#f5f3ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].num === Number(scriptSelected) ? '#ede9fe' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].num === Number(scriptSelected)
                ? <span style={{ color: '#5b21b6', fontWeight: '700' }}>✅ Correct! {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} — {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
              }
            </div>
          )}

          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {scriptIndex + 1 >= SCRIPT_Q.length ? '🏆 Finish →' : 'Next →'}
            </button>
          )}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#7c3aed' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#f5f3ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #ede9fe', textAlign: 'left' }}>
              <div style={{ color: '#5b21b6', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can now count to 100 in Thai — vocabulary, pronunciation AND script recognition. Next: money and prices.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-5/lesson-3" style={{ display: 'block', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Money & Prices →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
