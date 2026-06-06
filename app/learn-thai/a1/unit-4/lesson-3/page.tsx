'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const PHRASES = [
  { category: '😊 Everyday Essentials', color: '#f59e0b', items: [
    { thai: 'ขอบคุณ', roman: 'khob khun', english: 'Thank you', note: 'Use constantly. Add ครับ/ค่ะ to make it polite: ขอบคุณครับ/ค่ะ' },
    { thai: 'ไม่เป็นไร', roman: 'mai pen rai', english: 'No problem / Never mind / It\'s OK', note: 'One of the most Thai phrases ever. Used to brush off thanks, apologise for small things, or say "no worries".' },
    { thai: 'ขอโทษ', roman: 'kho thot', english: 'Sorry / Excuse me', note: 'Used for apologies AND to get someone\'s attention. ขอโทษนะครับ is very polite.' },
    { thai: 'เข้าใจ', roman: 'khao jai', english: 'I understand', note: 'ไม่เข้าใจ (mai khao jai) = I don\'t understand. เข้าใจไหม? = Do you understand?' },
    { thai: 'ได้', roman: 'dai', english: 'Yes / Can / OK / Possible', note: 'Extremely versatile. ได้ครับ = yes I can. ไม่ได้ = can\'t / not possible.' },
  ]},
  { category: '🏫 Classroom Phrases', color: '#0ea5e9', items: [
    { thai: 'ทำอีกครั้ง', roman: 'tham iik khrang', english: 'Do it again', note: 'Useful for repeating exercises. อีกครั้ง alone means "one more time".' },
    { thai: 'ดีมาก', roman: 'dii maak', english: 'Very good!', note: 'Your go-to praise phrase. เก่งมาก (geng maak) = very clever/skilled is also great.' },
    { thai: 'เงียบๆ', roman: 'ngiap ngiap', english: 'Quiet please', note: 'The reduplication (saying a word twice) softens the instruction. หนูๆ เงียบนะ = students, be quiet please.' },
    { thai: 'ดูที่กระดาน', roman: 'duu thii gradan', english: 'Look at the board', note: 'กระดาน = board. ดูที่หนังสือ = look at the book.' },
    { thai: 'พูดภาษาไทย', roman: 'phut phasaa thai', english: 'Speak Thai', note: 'พูดภาษาอังกฤษ = speak English. เราพูดภาษาไทยในห้องเรียน = we speak Thai in the classroom.' },
  ]},
  { category: '🛒 Daily Life', color: '#22c55e', items: [
    { thai: 'เท่าไร', roman: 'thao rai', english: 'How much?', note: 'The most useful market phrase. ราคาเท่าไร? (how much is the price?) or just เท่าไรครับ/ค่ะ.' },
    { thai: 'แพงไป', roman: 'phaeng pai', english: 'Too expensive', note: 'Market negotiation gold. ลดได้ไหม? (can you reduce?) follows naturally.' },
    { thai: 'อร่อย', roman: 'aroy', english: 'Delicious', note: 'Say this to every cook and hawker — you will make their day. อร่อยมาก = very delicious.' },
    { thai: 'ขอ...หน่อย', roman: 'kho...noi', english: 'Can I have... please', note: 'ขอน้ำหน่อยครับ = water please. ขอบิลหน่อยครับ = bill please. หน่อย softens the request.' },
    { thai: 'ห้องน้ำอยู่ที่ไหน', roman: 'hong naam yuu thii nai', english: 'Where is the toilet?', note: 'ห้องน้ำ = bathroom/toilet. อยู่ที่ไหน = where is it. Essential phrase for daily life.' },
  ]},
  { category: '🆘 When You\'re Stuck', color: '#8b5cf6', items: [
    { thai: 'ไม่เข้าใจ', roman: 'mai khao jai', english: 'I don\'t understand', note: 'Always better to say this than pretend to understand. Thai people will try to help.' },
    { thai: 'พูดช้าๆ ได้ไหม', roman: 'phut cha cha dai mai', english: 'Can you speak slowly?', note: 'ช้าๆ = slowly (reduplication). ได้ไหม = can you? A polite and useful request.' },
    { thai: 'ภาษาไทยไม่เก่ง', roman: 'phasaa thai mai geng', english: 'My Thai isn\'t good', note: 'Thai people will immediately speak more simply and clearly. A great conversation reset.' },
    { thai: 'นี่คืออะไร', roman: 'nii khue arai', english: 'What is this?', note: 'Point at anything and ask this — a fantastic vocabulary-building habit.' },
    { thai: 'แปลว่าอะไร', roman: 'plae wa arai', english: 'What does it mean?', note: 'ความหมายคืออะไร is more formal but แปลว่าอะไร works perfectly in everyday conversation.' },
  ]},
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

const ALL_ITEMS = PHRASES.flatMap(cat => cat.items)

const QUIZ_Q = [
  { q: 'How do you say "Thank you"?', correct: 'ขอบคุณ', options: ['สวัสดี', 'ขอโทษ', 'ขอบคุณ', 'ไม่เป็นไร'] },
  { q: 'ไม่เป็นไร means...?', correct: 'No problem / Never mind', options: ['I understand', 'No problem / Never mind', 'Sorry', 'Too expensive'] },
  { q: 'How do you ask "How much?"', correct: 'เท่าไร', options: ['อร่อย', 'เท่าไร', 'ได้', 'เข้าใจ'] },
  { q: 'You don\'t understand. What do you say?', correct: 'ไม่เข้าใจ', options: ['ได้ครับ', 'ขอบคุณ', 'ไม่เป็นไร', 'ไม่เข้าใจ'] },
  { q: 'อร่อย means...?', correct: 'Delicious', options: ['Expensive', 'Delicious', 'Good morning', 'Understand'] },
  { q: 'How do you ask someone to speak slowly?', correct: 'พูดช้าๆ ได้ไหม', options: ['ขอโทษ', 'ดีมาก', 'พูดช้าๆ ได้ไหม', 'เงียบๆ'] },
  { q: 'ขอโทษ is used for...?', correct: 'Sorry and Excuse me', options: ['Thank you only', 'Sorry and Excuse me', 'Goodbye only', 'I understand'] },
  { q: 'How do you ask "What does it mean?"', correct: 'แปลว่าอะไร', options: ['นี่คืออะไร', 'ห้องน้ำอยู่ที่ไหน', 'แปลว่าอะไร', 'เท่าไร'] },
]

export default function Unit4Lesson3() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [activeCategory, setActiveCategory] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const pct = Math.round((correct / QUIZ_Q.length) * 100)
  const cat = PHRASES[activeCategory]

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === QUIZ_Q[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
    speak(ALL_ITEMS.find(i => i.thai === QUIZ_Q[quizIndex].correct || i.english === QUIZ_Q[quizIndex].correct)?.thai || '')
  }

  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ_Q.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0369a1)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 4 · Lesson 3 — Useful Phrases</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setPhase('learn')} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Learn</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #0369a1' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>🗣️ 20 Essential Phrases for Daily Life in Thailand</h2>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>These phrases will carry you through your first months in Thailand. Click 🔊 to hear any phrase. Use them every day — even imperfect Thai is greatly appreciated.</p>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {PHRASES.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                style={{ background: i === activeCategory ? cat.color : 'white', color: i === activeCategory ? 'white' : '#374151', border: `2px solid ${i === activeCategory ? cat.color : '#e5e7eb'}`, padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.15s' }}>
                {cat.category}
              </button>
            ))}
          </div>

          {/* Phrase cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {cat.items.map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `4px solid ${cat.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '28px', fontWeight: '900', color: cat.color }}>{item.thai}</span>
                      <span style={{ color: '#6b7280', fontSize: '16px', fontWeight: '600' }}>{item.roman}</span>
                    </div>
                    <div style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>{item.english}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.5' }}>{item.note}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => speak(item.thai)}
                      style={{ background: cat.color + '15', color: cat.color, border: `1px solid ${cat.color}30`, padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                      🔊
                    </button>
                    <button onClick={() => speak(item.thai, 0.5)}
                      style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                      🐢
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
            style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
            🧠 Test Your Knowledge →
          </button>
        </div>
      )}

      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#0369a1', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#0369a1', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
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
                  if (isCorrect) { bg = '#e0f2fe'; border = '#0369a1'; textColor = '#075985' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                      {/[\u0e00-\u0e7f]/.test(opt) && (
                        <button onClick={(e) => { e.stopPropagation(); speak(opt) }}
                          style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>🔊</button>
                      )}
                    </div>
                    {selected && isCorrect && <span style={{ color: '#0369a1', fontSize: '20px', flexShrink: 0 }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px', flexShrink: 0 }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#e0f2fe' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#bae6fd' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#075985', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #1a1a2e, #0369a1)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '🏆 Results →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#0369a1' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#e0f2fe' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #e0f2fe, #dbeafe)', borderRadius: '14px', padding: '20px 24px', marginBottom: '24px', border: '2px solid #bae6fd', textAlign: 'left' }}>
              <div style={{ color: '#075985', fontWeight: '900', fontSize: '15px', marginBottom: '10px' }}>🎉 Unit 4 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.8' }}>
                You can now:<br />
                ✓ Greet people in 8 situations<br />
                ✓ Use ครับ / ค่ะ / คะ / นะ correctly<br />
                ✓ Handle 20 essential daily phrases<br /><br />
                Try using at least 3 of these phrases with a real Thai person today. That's your homework!
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1" style={{ display: 'block', background: 'linear-gradient(135deg, #1a1a2e, #0369a1)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                ← Back to A1 Overview
              </Link>
              <button onClick={() => { setPhase('learn'); setActiveCategory(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review All Phrases</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
