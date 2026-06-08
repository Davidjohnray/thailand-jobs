'use client'
import { useState } from 'react'
import Link from 'next/link'

const FAMILY = [
  {
    thai: 'พ่อ', roman: 'phoo', english: 'Father', emoji: '👨',
    note: 'พ่อ is the standard word for father/dad. Very commonly used in everyday speech. พ่อ also appears in compounds like พ่อครัว (chef — literally "cooking father").',
    example: { thai: 'พ่อของฉัน', roman: 'phoo khoong chan', english: 'my father' },
    tip: 'Thais often address older men they respect as พ่อ even if not related — a sign of deep respect.',
  },
  {
    thai: 'แม่', roman: 'maae', english: 'Mother', emoji: '👩',
    note: 'แม่ is mother/mum. One of the most important words in Thai — แม่ is also used as a respectful term for older women and in compounds like แม่บ้าน (housewife/housekeeper).',
    example: { thai: 'แม่ของฉัน', roman: 'maae khoong chan', english: 'my mother' },
    tip: 'แม่น้ำ (maae naam) = river — literally "mother of water". แม่ appears in many Thai compound words.',
  },
  {
    thai: 'พี่ชาย', roman: 'phii chaai', english: 'Older brother', emoji: '👦',
    note: 'พี่ = older sibling, ชาย = male. Thai has separate words for older and younger siblings — age matters in Thai family vocabulary.',
    example: { thai: 'พี่ชายสองคน', roman: 'phii chaai soong khon', english: 'two older brothers' },
    tip: 'พี่ alone is used as a polite form of address for anyone slightly older than you — not just family.',
  },
  {
    thai: 'น้องชาย', roman: 'noong chaai', english: 'Younger brother', emoji: '👶',
    note: 'น้อง = younger sibling, ชาย = male. น้อง alone can refer to any younger person and is also used as a self-reference when speaking to elders.',
    example: { thai: 'น้องชายคนเล็ก', roman: 'noong chaai khon lek', english: 'the youngest brother' },
    tip: 'น้อง is also how teachers refer to students — หนูน้อง (little one) or just น้องๆ (students/younger ones).',
  },
  {
    thai: 'พี่สาว', roman: 'phii saao', english: 'Older sister', emoji: '👧',
    note: 'พี่ = older sibling, สาว = female/young woman. สาว alone means young woman.',
    example: { thai: 'พี่สาวคนโต', roman: 'phii saao khon too', english: 'the eldest sister' },
    tip: 'พี่สาว is also used as a polite way to address a slightly older woman you\'ve just met — friendly and respectful.',
  },
  {
    thai: 'น้องสาว', roman: 'noong saao', english: 'Younger sister', emoji: '🧒',
    note: 'น้อง = younger sibling, สาว = female. The same น้อง base word as น้องชาย.',
    example: { thai: 'น้องสาวของฉัน', roman: 'noong saao khoong chan', english: 'my younger sister' },
    tip: 'If you don\'t know whether a sibling is older or younger, you can just say พี่น้อง (phii noong) which means siblings in general.',
  },
  {
    thai: 'ปู่/ย่า', roman: 'puu / yaa', english: 'Grandfather / Grandmother (father\'s side)', emoji: '👴👵',
    note: 'ปู่ = paternal grandfather, ย่า = paternal grandmother. Thai distinguishes which side of the family grandparents are on.',
    example: { thai: 'ปู่ย่าของฉัน', roman: 'puu yaa khoong chan', english: 'my paternal grandparents' },
    tip: 'ตา (taa) = maternal grandfather, ยาย (yaai) = maternal grandmother. Four different words for four grandparents!',
  },
  {
    thai: 'ลูก', roman: 'luuk', english: 'Child / Son or Daughter', emoji: '👶',
    note: 'ลูก means child — either son or daughter. ลูกชาย = son, ลูกสาว = daughter. ลูก also appears in many compound words.',
    example: { thai: 'ลูกสาวของฉัน', roman: 'luuk saao khoong chan', english: 'my daughter' },
    tip: 'ลูกศิษย์ (luuk sit) = student/disciple. ลูกค้า (luuk khaa) = customer. ลูก is incredibly versatile in Thai!',
  },
  {
    thai: 'สามี / ภรรยา', roman: 'saa mii / phan ra yaa', english: 'Husband / Wife', emoji: '💑',
    note: 'สามี = husband (formal), ภรรยา = wife (formal). In casual speech Thais often say ผัว (phua) for husband and เมีย (mia) for wife — but these are informal.',
    example: { thai: 'สามีของฉัน', roman: 'saa mii khoong chan', english: 'my husband' },
    tip: 'แฟน (faen) = boyfriend/girlfriend/partner — borrowed from English "fan". Very commonly used for all romantic partners.',
  },
  {
    thai: 'ครอบครัว', roman: 'khroob khrua', english: 'Family', emoji: '👨‍👩‍👧‍👦',
    note: 'The word for the whole family unit. ครอบครัวใหญ่ = big family, ครอบครัวเล็ก = small family. Family is extremely important in Thai culture.',
    example: { thai: 'ครอบครัวของฉัน', roman: 'khroob khrua khoong chan', english: 'my family' },
    tip: 'คุณมีครอบครัวไหม? (Do you have a family?) is a very common Thai conversation starter. Be ready to talk about yours!',
  },
]

const SCRIPT_Q = FAMILY.map(f => ({
  thai: f.thai, roman: f.roman, english: f.english,
  options: [f.english, ...FAMILY.filter(x => x.english !== f.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
})).sort(() => Math.random() - 0.5)

const QUIZ_Q = [
  { q: 'What is the Thai word for "mother"?', correct: 'Maae', options: ['Phoo', 'Maae', 'Phii saao', 'Luuk'] },
  { q: 'How do you say "older brother" in Thai?', correct: 'Phii chaai', options: ['Noong chaai', 'Phii saao', 'Phii chaai', 'Luuk chaai'] },
  { q: 'Thai has separate words for older and younger siblings. True or false?', correct: 'True', options: ['True', 'False'] },
  { q: 'What does "luuk" mean?', correct: 'Child / son or daughter', options: ['Grandparent', 'Child / son or daughter', 'Younger sibling', 'Husband'] },
  { q: 'How do you say "my family" in Thai?', correct: 'Khroob khrua khoong chan', options: ['Phoo maae khoong chan', 'Phii noong khoong chan', 'Khroob khrua khoong chan', 'Luuk khoong chan'] },
  { q: 'Which word means both "boyfriend" and "girlfriend" in Thai?', correct: 'Faen', options: ['Saa mii', 'Phan ra yaa', 'Faen', 'Luuk saao'] },
  { q: 'What is the difference between ปู่/ย่า and ตา/ยาย?', correct: 'Father\'s side vs mother\'s side', options: ['Older vs younger', 'Father\'s side vs mother\'s side', 'Male vs female', 'Formal vs informal'] },
  { q: 'How do you say "younger sister" in Thai?', correct: 'Noong saao', options: ['Phii saao', 'Noong chaai', 'Noong saao', 'Luuk saao'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit7Lesson1() {
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

  const card = FAMILY[cardIndex]
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
      <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #dc2626)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 7 · Lesson 1 — Family Members</div>
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
        <div style={{ background: 'rgba(220,38,38,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(220,38,38,0.1)' }}>
          <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {FAMILY.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#dc2626', borderRadius: '10px', width: `${((cardIndex + 1) / FAMILY.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{card.emoji} {card.english}</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #dc2626' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>👨‍👩‍👧‍👦 Family in Thai Culture</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Family is central to Thai life — and Thai family vocabulary reflects this. Unlike English, Thai has different words for <strong>older and younger</strong> siblings, and for grandparents on each side of the family. The words พี่ and น้อง extend beyond family to describe social relationships with anyone older or younger.
              </p>
              <div style={{ background: '#fef2f2', borderRadius: '12px', padding: '14px 18px', border: '1px solid #fca5a5' }}>
                <div style={{ color: '#dc2626', fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>💡 Key pattern</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                  ชาย (chaai) = male · สาว (saao) = female · พี่ (phii) = older · น้อง (noong) = younger<br />
                  So: พี่ชาย = older brother, น้องสาว = younger sister — the logic is consistent!
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #dc2626)', padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '60px', marginBottom: '12px' }}>{card.emoji}</div>
              <div style={{ fontSize: '60px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', marginBottom: '20px' }}>{card.english}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>🐢 Slow</button>
              </div>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ background: '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '2px solid #fca5a5' }}>
                <div style={{ color: '#dc2626', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#dc2626' }}>{card.example.thai}</div>
                  <div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '15px' }}>{card.example.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.example.english}</div>
                  </div>
                  <button onClick={() => speak(card.example.thai)} style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🔊</button>
                </div>
              </div>
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 16px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Cultural tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.tip}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>All Family Members</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {FAMILY.map((f, i) => (
                <button key={i} onClick={() => { setCardIndex(i); speak(f.thai) }}
                  style={{ background: i === cardIndex ? '#dc2626' : '#f9fafb', color: i === cardIndex ? 'white' : '#374151', border: `2px solid ${i === cardIndex ? '#dc2626' : '#e5e7eb'}`, borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontSize: '22px', transition: 'all 0.15s' }}>
                  {f.emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < FAMILY.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(FAMILY[cardIndex + 1].thai) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #7f1d1d, #dc2626)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {FAMILY[cardIndex + 1].english} →
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
            <span style={{ color: '#dc2626', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#dc2626', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
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
                  if (isCorrect) { bg = '#fef2f2'; border = '#dc2626'; textColor = '#7f1d1d' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                  if (isCorrect) { bg = '#fef2f2'; border = '#dc2626'; textColor = '#7f1d1d' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#dc2626', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#fef2f2' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#fca5a5' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#7f1d1d', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #7f1d1d, #dc2626)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #dc2626' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition — Family</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai family word and choose the correct English meaning. Random order.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#dc2626', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#dc2626', borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Who is this?</div>
              <div style={{ fontSize: '64px', fontWeight: '900', color: '#dc2626', lineHeight: 1, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '15px', marginBottom: '16px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#fef2f2', color: '#dc2626', border: '2px solid #fca5a5', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isCorrect = opt === SCRIPT_Q[scriptIndex].english
                const isSelected = scriptSelected === opt
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#fef2f2'; border = '#dc2626'; textColor = '#7f1d1d' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                  if (isCorrect) { bg = '#fef2f2'; border = '#dc2626'; textColor = '#7f1d1d' }
                }
                return (
                  <button key={opt} onClick={() => {
                    if (scriptSelected) return
                    setScriptSelected(opt)
                    if (isCorrect) setScriptScore(prev => prev + 1)
                    setScriptAnswers(prev => [...prev, isCorrect])
                  }} disabled={!!scriptSelected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: scriptSelected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {scriptSelected && isCorrect && <span style={{ color: '#dc2626', fontSize: '20px' }}>✓</span>}
                    {scriptSelected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#fef2f2' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? '#fca5a5' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: '#7f1d1d', fontWeight: '700' }}>✅ Correct! {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english}</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
              }
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #7f1d1d, #dc2626)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
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
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#dc2626' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#fef2f2' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #fca5a5', textAlign: 'left' }}>
              <div style={{ color: '#7f1d1d', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You can talk about your family in Thai! Next: describing people — age, appearance, and personality.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-7/lesson-2" style={{ display: 'block', background: 'linear-gradient(135deg, #7f1d1d, #dc2626)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Describing People →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
