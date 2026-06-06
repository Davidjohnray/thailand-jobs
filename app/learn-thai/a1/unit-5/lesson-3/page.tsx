'use client'
import { useState } from 'react'
import Link from 'next/link'

const MONEY_VOCAB = [
  {
    thai: 'บาท', roman: 'baat', english: 'Baht', emoji: '💵',
    note: 'The Thai currency. 1 baht = 100 satang. Always say the number first, then baat: ห้าบาท (5 baht), ยี่สิบบาท (20 baht).',
    example: { thai: 'ห้าสิบบาท', roman: 'haa sip baat', english: '50 baht' },
    tip: 'บาท comes AFTER the number — always. Never "baat sip haa", always "haa sip baat".',
  },
  {
    thai: 'สตางค์', roman: 'satang', english: 'Satang', emoji: '🪙',
    note: '1 baht = 100 satang. Satang coins are rare in practice — most prices round to the nearest baht. You may see them at supermarkets.',
    example: { thai: 'ห้าสิบสตางค์', roman: 'haa sip satang', english: '50 satang' },
    tip: 'You rarely need satang in daily life but good to recognise. Market prices are always in whole baht.',
  },
  {
    thai: 'เท่าไร', roman: 'thao rai', english: 'How much?', emoji: '❓',
    note: 'The most useful shopping phrase. Use it for anything — at markets, restaurants, taxis. Just point and say เท่าไรครับ/ค่ะ.',
    example: { thai: 'ราคาเท่าไร', roman: 'raa khaa thao rai', english: 'How much is the price?' },
    tip: 'เท่าไร alone works fine. ราคาเท่าไร is more formal. At a market just point and say เท่าไรครับ — everyone understands.',
  },
  {
    thai: 'แพง', roman: 'phaeng', english: 'Expensive', emoji: '💸',
    note: 'Mid tone. Used when something costs too much. แพงไป (phaeng pai) = too expensive. Very useful at markets.',
    example: { thai: 'แพงไป', roman: 'phaeng pai', english: 'Too expensive' },
    tip: 'Saying แพงไป with a smile is perfectly normal in Thai market culture — sellers expect negotiation.',
  },
  {
    thai: 'ถูก', roman: 'thuuk', english: 'Cheap / Inexpensive', emoji: '🏷️',
    note: 'ถูก means cheap OR correct — context makes it clear. ราคาถูก = cheap price. ถูกต้อง = correct.',
    example: { thai: 'ราคาถูก', roman: 'raa khaa thuuk', english: 'Cheap price' },
    tip: 'ถูกมาก (thuuk maak) = very cheap. A great compliment to give a vendor!',
  },
  {
    thai: 'ลดได้ไหม', roman: 'lot dai mai', english: 'Can you reduce the price?', emoji: '🤝',
    note: 'The classic market negotiation phrase. ลด = reduce, ได้ไหม = can you? Polite and effective.',
    example: { thai: 'ลดหน่อยได้ไหม', roman: 'lot noi dai mai', english: 'Can you reduce it a little?' },
    tip: 'หน่อย (noi = a little) softens the request. Adding ครับ/ค่ะ makes it very polite.',
  },
  {
    thai: 'ทอน', roman: 'thon', english: 'Change (money)', emoji: '🔄',
    note: 'ทอนเงิน = give change. If a vendor doesn\'t have change they\'ll say ไม่มีทอน (mai mii thon = no change). Always carry small notes!',
    example: { thai: 'ไม่มีทอน', roman: 'mai mii thon', english: 'No change' },
    tip: 'At 7-Eleven and markets, having a 1000 baht note is often a problem. Keep 20s and 50s handy.',
  },
  {
    thai: 'ฟรี', roman: 'frii', english: 'Free', emoji: '🎁',
    note: 'Borrowed from English — Thais say ฟรี just like "free". You\'ll see this on signs everywhere: ฟรี! (Free!)',
    example: { thai: 'ฟรีไหม', roman: 'frii mai', english: 'Is it free?' },
    tip: 'ฟรีเลย (frii loei) = completely free. You\'ll hear this at promotions and events.',
  },
]

const PRICES = [
  { thai: 'ห้าบาท', roman: 'haa baat', english: '5 baht' },
  { thai: 'สิบบาท', roman: 'sip baat', english: '10 baht' },
  { thai: 'ยี่สิบบาท', roman: 'yii sip baat', english: '20 baht' },
  { thai: 'สามสิบห้าบาท', roman: 'saam sip haa baat', english: '35 baht' },
  { thai: 'ห้าสิบบาท', roman: 'haa sip baat', english: '50 baht' },
  { thai: 'หนึ่งร้อยบาท', roman: 'nueng roi baat', english: '100 baht' },
  { thai: 'สองร้อยห้าสิบบาท', roman: 'soong roi haa sip baat', english: '250 baht' },
  { thai: 'ห้าร้อยบาท', roman: 'haa roi baat', english: '500 baht' },
]

const SCRIPT_Q = PRICES.map(p => ({
  thai: p.thai, roman: p.roman, english: p.english,
  options: [p.english, ...PRICES.filter(x => x.english !== p.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
})).sort(() => Math.random() - 0.5)

const QUIZ_Q = [
  { q: 'How do you ask "How much?" in Thai?', correct: 'Thao rai', options: ['Phaeng', 'Thao rai', 'Lot dai mai', 'Thuuk'] },
  { q: 'The number always comes before or after "baht" (baat)?', correct: 'Before — number first, then baat', options: ['Before — number first, then baat', 'After — baat first, then number', 'Either order is fine', 'Only after'] },
  { q: 'What does "phaeng pai" mean?', correct: 'Too expensive', options: ['Very cheap', 'Too expensive', 'No change', 'How much?'] },
  { q: 'How do you ask to reduce the price?', correct: 'Lot dai mai', options: ['Thao rai', 'Thuuk maak', 'Lot dai mai', 'Frii mai'] },
  { q: 'What does "thuuk" mean in a shopping context?', correct: 'Cheap', options: ['Expensive', 'Cheap', 'Free', 'Change'] },
  { q: 'How do you say 50 baht in Thai?', correct: 'Haa sip baat', options: ['Baat haa sip', 'Sip haa baat', 'Haa sip baat', 'Haa baat sip'] },
  { q: '"Mai mii thon" means...?', correct: 'No change', options: ['No discount', 'No change', 'Not expensive', 'No price'] },
  { q: 'Which word is borrowed from English and used for "free"?', correct: 'Frii', options: ['Thuuk', 'Frii', 'Baat', 'Lot'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit5Lesson3() {
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

  const card = MONEY_VOCAB[cardIndex]
  const pct = Math.round((correct / QUIZ_Q.length) * 100)

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
      <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 5 · Lesson 3 — Money & Prices</div>
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
        <div style={{ background: 'rgba(5,150,105,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(5,150,105,0.1)' }}>
          <span style={{ color: '#059669', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {MONEY_VOCAB.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#059669', borderRadius: '10px', width: `${((cardIndex + 1) / MONEY_VOCAB.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#059669', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Money & Prices</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #059669' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>💰 Money in Thailand</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Knowing how to talk about prices is essential for daily life in Thailand. Markets, food stalls, taxis, and shops — you'll use these phrases every single day. The good news: Thai price structure is simple and logical.
              </p>
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 18px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>💡 The golden rule</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                  Number + บาท (baat) — always this order. <strong>ห้าสิบบาท</strong> = fifty baht. Never "baat haa sip".
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>{card.emoji}</div>
              <div style={{ fontSize: '64px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', marginBottom: '20px' }}>{card.english}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>🐢 Slow</button>
              </div>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '2px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#059669' }}>{card.example.thai}</div>
                  <div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '15px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)} style={{ marginLeft: 'auto', background: '#059669', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🔊</button>
                </div>
              </div>
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '14px 16px', border: '1px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Practical tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>All vocabulary</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {MONEY_VOCAB.map((v, i) => (
                <button key={i} onClick={() => { setCardIndex(i); speak(v.thai) }}
                  style={{ background: i === cardIndex ? '#059669' : '#f9fafb', color: i === cardIndex ? 'white' : '#374151', border: `2px solid ${i === cardIndex ? '#059669' : '#e5e7eb'}`, borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', transition: 'all 0.15s', fontSize: '18px' }}>
                  {v.emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < MONEY_VOCAB.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(MONEY_VOCAB[cardIndex + 1].thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #064e3b, #059669)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {MONEY_VOCAB[cardIndex + 1].thai} →
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
            <span style={{ color: '#059669', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#059669', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
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
                  if (isCorrect) { bg = '#f0fdf4'; border = '#059669'; textColor = '#065f46' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#059669', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f0fdf4' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#86efac' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#065f46', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #064e3b, #059669)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #059669' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition — Prices</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai price and choose the correct amount in English. This is what you'll see on price tags and menus.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#059669', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#059669', borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>How much is this?</div>
              <div style={{ fontSize: '52px', fontWeight: '900', color: '#059669', lineHeight: 1, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#f0fdf4', color: '#059669', border: '2px solid #86efac', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isCorrect = opt === SCRIPT_Q[scriptIndex].english
                const isSelected = scriptSelected === opt
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#f0fdf4'; border = '#059669'; textColor = '#065f46' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => {
                    if (scriptSelected) return
                    setScriptSelected(opt)
                    if (isCorrect) setScriptScore(prev => prev + 1)
                    setScriptAnswers(prev => [...prev, isCorrect])
                  }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '18px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: textColor }}>{opt}</div>
                    {scriptSelected && isCorrect && <div style={{ color: '#059669', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                    {scriptSelected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#f0fdf4' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? '#86efac' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: '#065f46', fontWeight: '700' }}>✅ Correct! {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english}</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
              }
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #064e3b, #059669)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
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
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#059669' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#f0fdf4' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #86efac', textAlign: 'left' }}>
              <div style={{ color: '#065f46', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>🎉 Unit 5 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                You can now:<br />
                ✓ Count 1–100 in Thai<br />
                ✓ Talk about money and prices<br />
                ✓ Ask how much and negotiate<br />
                ✓ Read Thai price script<br /><br />
                Go test it at a market today!
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1" style={{ display: 'block', background: 'linear-gradient(135deg, #064e3b, #059669)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                ← Back to A1 Overview
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
