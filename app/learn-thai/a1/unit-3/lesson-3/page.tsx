'use client'
import { useState } from 'react'
import Link from 'next/link'

const HIGH_RULES = [
  {
    rule: 'High Class + Live Syllable + No Tone Mark',
    result: 'Rising Tone', color: '#22c55e', toneName: 'Rising',
    explanation: 'High class consonants with no tone mark in a live syllable produce a rising tone — the pitch dips then rises, like asking a curious question.',
    examples: [
      { thai: 'ขา', roman: 'khaa', english: 'leg', breakdown: 'ข (high) + า (live) = rising tone' },
      { thai: 'หา', roman: 'haa', english: 'to look for', breakdown: 'ห (high) + า (live) = rising tone' },
      { thai: 'สาม', roman: 'saam', english: 'three', breakdown: 'ส (high) + า + ม (live) = rising tone' },
    ],
  },
  {
    rule: 'High Class + Dead Syllable + No Tone Mark',
    result: 'Low Tone', color: '#3b82f6', toneName: 'Low',
    explanation: 'High class consonants in a dead syllable (short vowel or stop ending) produce a low tone with no tone mark.',
    examples: [
      { thai: 'ผัก', roman: 'phak', english: 'vegetable', breakdown: 'ผ (high) + ั + ก (stop = dead) = low tone' },
      { thai: 'ฝาก', roman: 'faak', english: 'to deposit/entrust', breakdown: 'ฝ (high) + า + ก (stop = dead) = low tone' },
      { thai: 'สั้น', roman: 'san', english: 'short', breakdown: 'ส (high) + ั + น... actually live — listen carefully' },
    ],
  },
  {
    rule: 'High Class + Mai Ek (◌่)',
    result: 'Low Tone', color: '#3b82f6', toneName: 'Low',
    explanation: 'Adding mai ek to a high class consonant always produces a low tone.',
    examples: [
      { thai: 'ข่าว', roman: 'khaao', english: 'news', breakdown: 'ข (high) + ่ (mai ek) = low tone' },
      { thai: 'หน่าย', roman: 'naai', english: 'fed up/bored', breakdown: 'ห (high) + ่ = low tone' },
      { thai: 'ฝ่าย', roman: 'faai', english: 'side/faction', breakdown: 'ฝ (high) + ่ = low tone' },
    ],
  },
  {
    rule: 'High Class + Mai Tho (◌้)',
    result: 'Falling Tone', color: '#ef4444', toneName: 'Falling',
    explanation: 'Adding mai tho to a high class consonant produces a falling tone.',
    examples: [
      { thai: 'ข้าว', roman: 'khaao', english: 'rice', breakdown: 'ข (high) + ้ (mai tho) = falling tone' },
      { thai: 'ห้อง', roman: 'hoong', english: 'room', breakdown: 'ห (high) + ้ = falling tone' },
      { thai: 'สู้', roman: 'suu', english: 'to fight/try hard', breakdown: 'ส (high) + ้ = falling tone' },
    ],
  },
]

const LOW_RULES = [
  {
    rule: 'Low Class + Live Syllable + No Tone Mark',
    result: 'Mid Tone', color: '#6b7280', toneName: 'Mid',
    explanation: 'Low class consonants with no tone mark in a live syllable produce a mid tone — flat and steady.',
    examples: [
      { thai: 'มา', roman: 'maa', english: 'to come', breakdown: 'ม (low) + า (live) = mid tone' },
      { thai: 'นาม', roman: 'naam', english: 'name (formal)', breakdown: 'น (low) + า + ม (live) = mid tone' },
      { thai: 'ยาว', roman: 'yaao', english: 'long', breakdown: 'ย (low) + า + ว (live) = mid tone' },
    ],
  },
  {
    rule: 'Low Class + Dead Syllable (short vowel) + No Tone Mark',
    result: 'High Tone', color: '#f59e0b', toneName: 'High',
    explanation: 'Low class consonants in a dead syllable with a SHORT vowel produce a high tone — one of the trickiest rules.',
    examples: [
      { thai: 'ยก', roman: 'yok', english: 'to lift', breakdown: 'ย (low) + short ○ + ก (stop) = high tone' },
      { thai: 'นก', roman: 'nok', english: 'bird', breakdown: 'น (low) + short ○ + ก (stop) = high tone' },
      { thai: 'วัด', roman: 'wat', english: 'temple', breakdown: 'ว (low) + ั + ด (stop) = high tone' },
    ],
  },
  {
    rule: 'Low Class + Dead Syllable (long vowel) + No Tone Mark',
    result: 'Falling Tone', color: '#ef4444', toneName: 'Falling',
    explanation: 'Low class consonants in a dead syllable with a LONG vowel produce a falling tone.',
    examples: [
      { thai: 'นาก', roman: 'naak', english: 'otter', breakdown: 'น (low) + า (long) + ก (stop) = falling tone' },
      { thai: 'มาก', roman: 'maak', english: 'very/many', breakdown: 'ม (low) + า (long) + ก (stop) = falling tone' },
      { thai: 'ยาก', roman: 'yaak', english: 'difficult', breakdown: 'ย (low) + า (long) + ก (stop) = falling tone' },
    ],
  },
  {
    rule: 'Low Class + Mai Ek (◌่)',
    result: 'Falling Tone', color: '#ef4444', toneName: 'Falling',
    explanation: 'Adding mai ek to a low class consonant produces a falling tone. This is different from mid and high class where mai ek gives a low tone.',
    examples: [
      { thai: 'น้ำ', roman: 'naam', english: 'water', breakdown: 'น (low) + ้ wait — น้ำ uses mai tho! น่า uses mai ek = falling' },
      { thai: 'น่า', roman: 'naa', english: 'worth doing / attractive', breakdown: 'น (low) + ่ (mai ek) = falling tone' },
      { thai: 'ม่าย', roman: 'maai', english: 'widow', breakdown: 'ม (low) + ่ = falling tone' },
    ],
  },
  {
    rule: 'Low Class + Mai Tho (◌้)',
    result: 'High Tone', color: '#f59e0b', toneName: 'High',
    explanation: 'Adding mai tho to a low class consonant produces a HIGH tone — the opposite effect compared to mid and high class consonants.',
    examples: [
      { thai: 'น้ำ', roman: 'naam', english: 'water', breakdown: 'น (low) + ้ (mai tho) = high tone' },
      { thai: 'ม้า', roman: 'maa', english: 'horse', breakdown: 'ม (low) + ้ = high tone' },
      { thai: 'ง้าว', roman: 'ngaao', english: 'halberd', breakdown: 'ง (low) + ้ = high tone' },
    ],
  },
  {
    rule: 'ห + Low Class (Tone Raiser)',
    result: 'Follows High Class Rules', color: '#8b5cf6', toneName: 'High Class',
    explanation: 'When ห (a high class consonant) is placed before certain low class consonants, the ห is silent but raises the tone class of the syllable to high class. This is why หนู (mouse) sounds different from นู.',
    examples: [
      { thai: 'หนู', roman: 'nuu', english: 'mouse/rat', breakdown: 'ห (silent) + น (low→high class) = rising tone' },
      { thai: 'หมา', roman: 'maa', english: 'dog', breakdown: 'ห (silent) + ม (low→high class) = rising tone' },
      { thai: 'หวาน', roman: 'waan', english: 'sweet', breakdown: 'ห (silent) + ว (low→high class) = rising tone' },
    ],
  },
]

const QUIZ_Q = [
  { q: 'High class + live syllable + no mark = ?', correct: 'Rising tone', options: ['Mid tone', 'Rising tone', 'Low tone', 'Falling tone'] },
  { q: 'Low class + live syllable + no mark = ?', correct: 'Mid tone', options: ['Mid tone', 'High tone', 'Falling tone', 'Rising tone'] },
  { q: 'Low class + Mai Tho (◌้) = ?', correct: 'High tone', options: ['Falling tone', 'Low tone', 'Mid tone', 'High tone'] },
  { q: 'What tone is ข้าว (rice)?', correct: 'Falling tone', options: ['Mid tone', 'Falling tone', 'High tone', 'Rising tone'] },
  { q: 'What tone is มาก (very/many)?', correct: 'Falling tone', options: ['Mid tone', 'High tone', 'Falling tone', 'Rising tone'] },
  { q: 'What does the silent ห do before a low class consonant?', correct: 'Raises tone class to high', options: ['Makes the syllable dead', 'Raises tone class to high', 'Adds mai ek effect', 'Changes the vowel'] },
  { q: 'Low class + dead syllable (SHORT vowel) + no mark = ?', correct: 'High tone', options: ['Low tone', 'High tone', 'Falling tone', 'Mid tone'] },
  { q: 'What tone is หมา (dog)?', correct: 'Rising tone', options: ['Mid tone', 'High tone', 'Falling tone', 'Rising tone'] },
  { q: 'High class + Mai Tho (◌้) = ?', correct: 'Falling tone', options: ['High tone', 'Falling tone', 'Rising tone', 'Low tone'] },
  { q: 'Low class + dead syllable (LONG vowel) + no mark = ?', correct: 'Falling tone', options: ['High tone', 'Low tone', 'Mid tone', 'Falling tone'] },
]

const TONE_COLORS: Record<string, string> = {
  'Mid tone': '#6b7280', 'Low tone': '#3b82f6', 'Falling tone': '#ef4444',
  'High tone': '#f59e0b', 'Rising tone': '#22c55e', 'Follows High Class Rules': '#8b5cf6'
}

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit3Lesson3() {
  const [phase, setPhase] = useState<'high' | 'low' | 'summary' | 'quiz' | 'complete'>('high')
  const [highIndex, setHighIndex] = useState(0)
  const [lowIndex, setLowIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const pct = Math.round((correct / QUIZ_Q.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === QUIZ_Q[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
  }

  const nextQ = () => {
    if (quizIndex + 1 >= QUIZ_Q.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  const currentHighRule = HIGH_RULES[highIndex]
  const currentLowRule = LOW_RULES[lowIndex]

  const RuleCard = ({ rule, index, total, onNext, onPrev, onQuiz }: any) => (
    <div>
      <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <div style={{ background: `linear-gradient(135deg, #1a1a2e, ${rule.color})`, padding: '24px 32px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px 12px', marginBottom: '10px' }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>Rule {index + 1} of {total}</span>
          </div>
          <h3 style={{ color: 'white', fontSize: '17px', fontWeight: '900', margin: '0 0 10px', lineHeight: '1.35' }}>{rule.rule}</h3>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '30px', padding: '6px 18px' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Result:</span>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: '900' }}>{rule.result}</span>
          </div>
        </div>
        <div style={{ padding: '24px 32px' }}>
          <div style={{ background: rule.color + '10', borderRadius: '12px', padding: '14px 18px', marginBottom: '18px', border: `1px solid ${rule.color}25` }}>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{rule.explanation}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rule.examples.map((ex: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f9fafb', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: rule.color, width: '56px', flexShrink: 0 }}>{ex.thai}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#374151', fontSize: '14px' }}>{ex.roman} — {ex.english}</div>
                  <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>{ex.breakdown}</div>
                </div>
                <button onClick={() => speak(ex.thai)} style={{ background: rule.color + '15', color: rule.color, border: `1px solid ${rule.color}30`, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>🔊</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {index > 0 && <button onClick={onPrev} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
        {index + 1 < total ? (
          <button onClick={onNext} style={{ flex: 1, background: `linear-gradient(135deg, #1a1a2e, ${rule.color})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>Next Rule →</button>
        ) : onQuiz ? (
          <button onClick={onQuiz} style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>✅ Take the Quiz →</button>
        ) : null}
      </div>
    </div>
  )

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #7c3aed)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 3 · Lesson 3 — High & Low Class Tone Rules</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ id: 'high', label: '⬆ High Class' }, { id: 'low', label: '⬇ Low Class' }, { id: 'summary', label: '📊 Summary' }, { id: 'quiz', label: '🧠 Quiz' }].map(tab => (
            <button key={tab.id} onClick={() => { if (tab.id === 'quiz') { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }; setPhase(tab.id as any) }}
              style={{ background: phase === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* HIGH CLASS RULES */}
      {phase === 'high' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {highIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #22c55e' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>⬆️ High Class — 4 Rules</h2>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                High class consonants (ข ฃ ฉ ฐ ถ ผ ฝ ศ ษ ส ห) follow 4 tone rules. The base tone for a live syllable is <strong>rising</strong> — higher starting point than mid class.
              </p>
            </div>
          )}
          <div style={{ background: 'rgba(34,197,94,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.15)' }}>
            <span style={{ color: '#15803d', fontSize: '13px', fontWeight: '700' }}>Rule {highIndex + 1} / {HIGH_RULES.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#22c55e', borderRadius: '10px', width: `${((highIndex + 1) / HIGH_RULES.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: currentHighRule.color, fontWeight: '800', fontSize: '13px' }}>→ {currentHighRule.toneName}</span>
          </div>
          <RuleCard rule={currentHighRule} index={highIndex} total={HIGH_RULES.length}
            onNext={() => setHighIndex(prev => prev + 1)}
            onPrev={() => setHighIndex(prev => prev - 1)}
            onQuiz={() => setPhase('low')}
          />
          {highIndex + 1 >= HIGH_RULES.length && (
            <button onClick={() => setPhase('low')} style={{ width: '100%', marginTop: '12px', background: 'linear-gradient(135deg, #1a1a2e, #0ea5e9)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
              Next: Low Class Rules →
            </button>
          )}
        </div>
      )}

      {/* LOW CLASS RULES */}
      {phase === 'low' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {lowIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #0ea5e9' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '10px' }}>⬇️ Low Class — 6 Rules</h2>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: '0 0 12px' }}>
                Low class consonants have the most complex rules — 6 in total. The key difference: <strong>mai tho gives HIGH tone</strong> (not falling like mid/high class), and <strong>mai ek gives FALLING tone</strong>. The silent ห rule is also unique to low class.
              </p>
              <div style={{ background: '#fff7ed', borderRadius: '10px', padding: '10px 14px', border: '1px solid #fed7aa' }}>
                <span style={{ color: '#c2410c', fontWeight: '800', fontSize: '13px' }}>⚠️ Key difference: </span>
                <span style={{ color: '#374151', fontSize: '13px' }}>For low class, mai tho (◌้) = HIGH tone. For mid/high class, mai tho = falling tone.</span>
              </div>
            </div>
          )}
          <div style={{ background: 'rgba(14,165,233,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderRadius: '12px', border: '1px solid rgba(14,165,233,0.15)' }}>
            <span style={{ color: '#0369a1', fontSize: '13px', fontWeight: '700' }}>Rule {lowIndex + 1} / {LOW_RULES.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#0ea5e9', borderRadius: '10px', width: `${((lowIndex + 1) / LOW_RULES.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: currentLowRule.color, fontWeight: '800', fontSize: '13px' }}>→ {currentLowRule.toneName}</span>
          </div>
          <RuleCard rule={currentLowRule} index={lowIndex} total={LOW_RULES.length}
            onNext={() => setLowIndex(prev => prev + 1)}
            onPrev={() => setLowIndex(prev => prev - 1)}
            onQuiz={() => setPhase('summary')}
          />
          {lowIndex + 1 >= LOW_RULES.length && (
            <button onClick={() => setPhase('summary')} style={{ width: '100%', marginTop: '12px', background: 'linear-gradient(135deg, #1a1a2e, #7c3aed)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
              📊 See Full Summary →
            </button>
          )}
        </div>
      )}

      {/* SUMMARY TABLE */}
      {phase === 'summary' && (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #7c3aed' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '16px' }}>📊 Complete Thai Tone Rules — All 3 Classes</h2>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', margin: '0 0 20px' }}>This table shows every tone rule for all three consonant classes. Bookmark this — it's your complete reference for the Thai tone system.</p>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#1a1a2e' }}>
                    <th style={{ color: 'white', padding: '12px 14px', textAlign: 'left', fontWeight: '800', borderRadius: '8px 0 0 0' }}>Condition</th>
                    <th style={{ color: '#f59e0b', padding: '12px 14px', textAlign: 'center', fontWeight: '800' }}>Mid Class</th>
                    <th style={{ color: '#22c55e', padding: '12px 14px', textAlign: 'center', fontWeight: '800' }}>High Class</th>
                    <th style={{ color: '#0ea5e9', padding: '12px 14px', textAlign: 'center', fontWeight: '800', borderRadius: '0 8px 0 0' }}>Low Class</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cond: 'Live + No mark', mid: 'Mid', high: 'Rising', low: 'Mid' },
                    { cond: 'Dead short + No mark', mid: 'Low', high: 'Low', low: 'High' },
                    { cond: 'Dead long + No mark', mid: 'Low', high: 'Low', low: 'Falling' },
                    { cond: '+ Mai Ek (◌่)', mid: 'Low', high: 'Low', low: 'Falling' },
                    { cond: '+ Mai Tho (◌้)', mid: 'Falling', high: 'Falling', low: 'High ⚠️' },
                    { cond: '+ Mai Tri (◌๊)', mid: 'High', high: '—', low: '—' },
                    { cond: '+ Mai Jattawa (◌๋)', mid: 'Rising', high: '—', low: '—' },
                    { cond: 'ห + low class', mid: '—', high: '—', low: 'Follows high class' },
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#f9fafb' : 'white', borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: '#374151' }}>{row.cond}</td>
                      {[row.mid, row.high, row.low].map((tone, j) => {
                        const tc = tone === 'Mid' ? '#6b7280' : tone === 'Low' ? '#3b82f6' : tone === 'Falling' ? '#ef4444' : tone.includes('High') ? '#f59e0b' : tone === 'Rising' ? '#22c55e' : tone.includes('Follows') ? '#8b5cf6' : '#9ca3af'
                        return (
                          <td key={j} style={{ padding: '12px 14px', textAlign: 'center' }}>
                            {tone !== '—' ? (
                              <span style={{ background: tc + '20', color: tc, padding: '4px 12px', borderRadius: '20px', fontWeight: '800', fontSize: '13px' }}>{tone}</span>
                            ) : (
                              <span style={{ color: '#d1d5db', fontSize: '16px' }}>—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', background: '#fff7ed', borderRadius: '8px', padding: '10px 14px', border: '1px solid #fed7aa' }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{ color: '#c2410c', fontSize: '13px', fontWeight: '700' }}>Key difference: Low class + Mai Tho = HIGH tone (not falling like mid/high class)</span>
            </div>
          </div>

          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
            style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer', marginBottom: '12px' }}>
            🧠 Take the Quiz →
          </button>
        </div>
      )}

      {/* QUIZ */}
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
                const tc = TONE_COLORS[opt] || '#374151'
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = tc + '15'; border = tc; textColor = tc }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ fontSize: '18px', color: tc }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '18px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#f5f3ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#ede9fe' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#5b21b6', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct answer: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #1a1a2e, #7c3aed)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '🏆 Results →' : 'Next →'}</button>}
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div style={{ maxWidth: '540px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#7c3aed' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '28px', height: '28px', borderRadius: '8px', background: a ? '#f5f3ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #eef2ff)', borderRadius: '14px', padding: '20px 24px', marginBottom: '24px', border: '2px solid #ede9fe', textAlign: 'left' }}>
              <div style={{ color: '#7c3aed', fontWeight: '900', fontSize: '16px', marginBottom: '10px' }}>🎉 Unit 3 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.8' }}>
                You now know the complete Thai tone system:<br />
                ✓ All 6 mid class tone rules<br />
                ✓ All 4 high class tone rules<br />
                ✓ All 6 low class tone rules (including ห raiser)<br />
                ✓ The full tone comparison table<br /><br />
                <strong>You have completed the 3 hardest units in Thai.</strong> Everything from here builds on what you know — greetings, numbers, vocabulary and real conversations.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-4/lesson-1" style={{ display: 'block', background: 'linear-gradient(135deg, #1a1a2e, #7c3aed)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Unit 4 — Greetings →
              </Link>
              <button onClick={() => setPhase('summary')} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                📊 Review the Summary Table
              </button>
              <Link href="/learn-thai/a1" style={{ display: 'block', background: '#f9fafb', color: '#6b7280', border: '2px solid #e5e7eb', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                ← Back to A1 Overview
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
