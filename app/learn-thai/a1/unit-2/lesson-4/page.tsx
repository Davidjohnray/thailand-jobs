'use client'
import { useState } from 'react'
import Link from 'next/link'

const TONE_MARKS = [
  {
    mark: '◌่', name: 'Mai Ek', thai: 'ไม้เอก', roman: 'mai ek',
    meaning: 'First tone mark',
    color: '#ef4444',
    effect: {
      mid: 'Low tone',
      high: 'Low tone',
      low: 'Falling tone',
    },
    example: { thai: 'ไก่', roman: 'gai', english: 'chicken', tone: 'low' },
    example2: { thai: 'น้ำ', roman: 'naam', english: 'water', tone: 'falling' },
    note: 'Mai ek (◌่) is a small diagonal mark placed above the initial consonant. It lowers the tone — mid class consonants become low tone, low class consonants become falling tone.',
    tip: 'น้ำ (naam) = water — one of the most essential Thai words. The ้ mark on นำ makes it falling tone. You\'ll see this mark constantly.',
  },
  {
    mark: '◌้', name: 'Mai Tho', thai: 'ไม้โท', roman: 'mai tho',
    meaning: 'Second tone mark',
    color: '#f59e0b',
    effect: {
      mid: 'Falling tone',
      high: 'Low tone',
      low: 'High tone',
    },
    example: { thai: 'ข้าว', roman: 'khaao', english: 'rice', tone: 'falling' },
    example2: { thai: 'ช้าง', roman: 'chaang', english: 'elephant', tone: 'high' },
    note: 'Mai tho (◌้) looks like the number 9 written above the consonant. It changes the tone differently depending on consonant class — falling for mid class, low for high class, high for low class.',
    tip: 'ข้าว (khaao) = rice — the staple food of Thailand. The ้ on the high class ข makes it falling tone. กิน ข้าว (gin khaao) = eat rice = have a meal.',
  },
  {
    mark: '◌๊', name: 'Mai Tri', thai: 'ไม้ตรี', roman: 'mai tri',
    meaning: 'Third tone mark',
    color: '#22c55e',
    effect: {
      mid: 'High tone',
      high: 'N/A (rare)',
      low: 'N/A (rare)',
    },
    example: { thai: 'โต๊ะ', roman: 'to', english: 'table', tone: 'high' },
    example2: { thai: 'เก๊', roman: 'gee', english: 'fake/counterfeit', tone: 'high' },
    note: 'Mai tri (◌๊) is relatively rare — mainly used with mid class consonants to produce a high tone. You\'ll mostly see it in a small set of common words.',
    tip: 'โต๊ะ (to) = table — you\'ll see this on every restaurant menu. The ๊ mark forces a high tone on the mid class ต.',
  },
  {
    mark: '◌๋', name: 'Mai Jattawa', thai: 'ไม้จัตวา', roman: 'mai jattawa',
    meaning: 'Fourth tone mark',
    color: '#0ea5e9',
    effect: {
      mid: 'Rising tone',
      high: 'N/A (rare)',
      low: 'N/A (rare)',
    },
    example: { thai: 'หั้น', roman: 'han', english: 'that (Northern dialect)', tone: 'rising' },
    example2: { thai: 'เน๋อ', roman: 'noe', english: '(particle, casual)', tone: 'rising' },
    note: 'Mai jattawa (◌๋) is the rarest tone mark — used to produce a rising tone with mid class consonants. You\'ll encounter it occasionally in informal and dialectal writing.',
    tip: 'This is the least common tone mark — you don\'t need to memorise all its uses right now. Focus on mai ek and mai tho first as they are far more frequent.',
  },
]

const FIVE_TONES = [
  { name: 'Mid', thai: 'สามัญ', roman: 'saaman', color: '#6b7280', pitch: '●  ●  ●', desc: 'Steady, flat — like a calm spoken statement.', example: { thai: 'กา', roman: 'gaa', english: 'crow (bird)' } },
  { name: 'Low', thai: 'เอก', roman: 'ek', color: '#3b82f6', pitch: '↘  ↘  ●', desc: 'Starts low and stays low — slightly descending.', example: { thai: 'ก่า', roman: 'gaa', english: 'a type of lizard' } },
  { name: 'Falling', thai: 'โท', roman: 'tho', color: '#ef4444', pitch: '●  ↘  ↘', desc: 'Starts high and falls — like a surprised statement.', example: { thai: 'ก้า', roman: 'gaa', english: '(demonstrative particle)' } },
  { name: 'High', thai: 'ตรี', roman: 'tri', color: '#f59e0b', pitch: '↗  ↗  ●', desc: 'Starts mid and rises — like asking a question.', example: { thai: 'ก๊า', roman: 'gaa', english: '(archaic particle)' } },
  { name: 'Rising', thai: 'จัตวา', roman: 'jattawa', color: '#22c55e', pitch: '↘  ↗  ↗', desc: 'Starts low, dips, then rises — like a curious question.', example: { thai: 'ก๋า', roman: 'gaa', english: '(rare form)' } },
]

const QUIZ_Q = [
  { question: 'Which tone mark makes mid class consonants produce a LOW tone?', correct: 'Mai Ek (◌่)', options: ['Mai Ek (◌่)', 'Mai Tho (◌้)', 'Mai Tri (◌๊)', 'Mai Jattawa (◌๋)'] },
  { question: 'What tone does ข้าว (rice) use?', correct: 'Falling', options: ['Low', 'Falling', 'High', 'Rising'] },
  { question: 'Which tone mark is the rarest?', correct: 'Mai Jattawa (◌๋)', options: ['Mai Ek (◌่)', 'Mai Tho (◌้)', 'Mai Tri (◌๊)', 'Mai Jattawa (◌๋)'] },
  { question: 'น้ำ (water) has which tone mark?', correct: 'Mai Ek (◌่)', options: ['Mai Ek (◌่)', 'Mai Tho (◌้)', 'No tone mark', 'Mai Tri (◌๊)'] },
  { question: 'How many tones does Thai have?', correct: '5', options: ['3', '4', '5', '6'] },
  { question: 'Where are tone marks written?', correct: 'Above the consonant', options: ['Before the consonant', 'After the consonant', 'Above the consonant', 'Below the consonant'] },
  { question: 'Which tone sounds like a calm, flat statement?', correct: 'Mid tone', options: ['Low tone', 'Mid tone', 'High tone', 'Falling tone'] },
  { question: 'What does mai tho (◌้) look like?', correct: 'Like the number 9', options: ['A small diagonal line', 'Like the number 9', 'A star shape', 'A small hook'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit2Lesson4() {
  const [phase, setPhase] = useState<'tones' | 'marks' | 'quiz' | 'complete'>('tones')
  const [markIndex, setMarkIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const mark = TONE_MARKS[markIndex]
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

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #E85D26)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 2 · Lesson 4 — Tone Marks</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ id: 'tones', label: '🎵 5 Tones' }, { id: 'marks', label: '◌่ Marks' }, { id: 'quiz', label: '🧠 Quiz' }].map(tab => (
            <button key={tab.id} onClick={() => { if (tab.id === 'quiz') { setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }; setPhase(tab.id as any) }}
              style={{ background: phase === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FIVE TONES PHASE */}
      {phase === 'tones' && (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #E85D26' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🎵 Thai Has 5 Tones</h2>
            <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
              Thai is a <strong>tonal language</strong> — the pitch at which you say a syllable completely changes its meaning. The syllable "maa" spoken in 5 different tones can mean 5 different things: horse, dog, come, value, and a question particle. Getting tones right is essential.
            </p>
            <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '14px 18px', border: '1px solid #fed7aa' }}>
              <div style={{ color: '#c2410c', fontWeight: '800', fontSize: '13px', marginBottom: '8px' }}>⚠️ The most important thing in Thai</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>
                A word said with the wrong tone is a <strong>different word</strong>. This is not like English stress — it changes meaning completely. Don't be discouraged — with practice your ear will develop quickly, especially if you're living in Thailand.
              </div>
            </div>
          </div>

          {/* Tone showcase - same syllable, 5 tones */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>The 5 tones — all on the same syllable "maa" (ม + า)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { tone: 'Mid', thai: 'มา', roman: 'maa', english: 'to come', pitch: '— — —', color: '#6b7280' },
                { tone: 'Low', thai: 'ม่า', roman: 'maa', english: '(a type of weave)', pitch: '↘ ↘ —', color: '#3b82f6' },
                { tone: 'Falling', thai: 'ม้า', roman: 'maa', english: 'horse', pitch: '↗ ↘ ↘', color: '#ef4444' },
                { tone: 'High', thai: 'หมา', roman: 'maa', english: 'dog', pitch: '↗ ↗ —', color: '#f59e0b' },
                { tone: 'Rising', thai: 'หม่า', roman: 'maa', english: '(particle)', pitch: '↘ ↗ ↗', color: '#22c55e' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f9fafb', borderRadius: '12px', padding: '14px 18px', border: `2px solid ${t.color}25` }}>
                  <div style={{ background: t.color, color: 'white', width: '80px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>{t.tone}</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: t.color, width: '52px', flexShrink: 0 }}>{t.thai}</div>
                  <div style={{ color: '#6b7280', fontFamily: 'monospace', fontSize: '16px', width: '80px', flexShrink: 0 }}>{t.pitch}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#374151', fontWeight: '700' }}>{t.roman}</span>
                    <span style={{ color: '#9ca3af', fontSize: '14px', marginLeft: '8px' }}>{t.english}</span>
                  </div>
                  <button onClick={() => speak(t.thai)} style={{ background: t.color + '15', color: t.color, border: `1px solid ${t.color}40`, padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>🔊</button>
                </div>
              ))}
            </div>
          </div>

          {/* All 5 tones overview */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>The 5 Tones — descriptions and pitch shapes</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {FIVE_TONES.map(t => (
                <div key={t.name} style={{ background: t.color + '10', borderRadius: '12px', padding: '16px', border: `2px solid ${t.color}30` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ background: t.color, color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>{t.name}</span>
                    <button onClick={() => speak(t.example.thai)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🔊</button>
                  </div>
                  <div style={{ color: t.color, fontFamily: 'monospace', fontSize: '20px', fontWeight: '900', marginBottom: '4px' }}>{t.pitch}</div>
                  <div style={{ color: '#374151', fontSize: '13px', lineHeight: '1.5', marginBottom: '8px' }}>{t.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: t.color }}>{t.example.thai}</span>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>{t.example.english}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setPhase('marks')} style={{ width: '100%', background: 'linear-gradient(135deg, #1a1a2e, #E85D26)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
            Next: Learn the Tone Marks →
          </button>
        </div>
      )}

      {/* TONE MARKS PHASE */}
      {phase === 'marks' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'rgba(232,93,38,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderRadius: '12px', border: '1px solid rgba(232,93,38,0.15)' }}>
            <span style={{ color: '#E85D26', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{markIndex + 1} / {TONE_MARKS.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#E85D26', borderRadius: '10px', width: `${((markIndex + 1) / TONE_MARKS.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#E85D26', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Tone Marks</span>
          </div>

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: `linear-gradient(135deg, #1a1a2e, ${mark.color})`, padding: '40px 32px', textAlign: 'center' }}>
              <span style={{ background: mark.color, color: 'white', fontSize: '11px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', marginBottom: '16px' }}>{mark.meaning}</span>
              <div style={{ fontSize: '96px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '12px' }}>{mark.mark.replace('◌', 'ก')}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>{mark.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>{mark.thai} · {mark.roman}</div>
            </div>

            <div style={{ padding: '28px 32px' }}>
              {/* Effect table */}
              <div style={{ background: '#f9fafb', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
                <div style={{ color: '#374151', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>📊 Effect on each consonant class</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Mid Class', value: mark.effect.mid, color: '#f59e0b' },
                    { label: 'High Class', value: mark.effect.high, color: '#6366f1' },
                    { label: 'Low Class', value: mark.effect.low, color: '#0ea5e9' },
                  ].map(e => (
                    <div key={e.label} style={{ background: e.color + '10', borderRadius: '10px', padding: '12px', border: `1px solid ${e.color}30`, textAlign: 'center' }}>
                      <div style={{ color: e.color, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{e.label}</div>
                      <div style={{ color: '#1a1a2e', fontWeight: '900', fontSize: '16px' }}>{e.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', border: '1px solid #fed7aa' }}>
                <div style={{ color: '#c2410c', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 How it works</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{mark.note}</p>
              </div>

              {/* Examples */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[mark.example, mark.example2].map((ex, i) => (
                  <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '36px', fontWeight: '900', color: mark.color }}>{ex.thai}</div>
                      <button onClick={() => speak(ex.thai)} style={{ background: mark.color + '15', color: mark.color, border: `1px solid ${mark.color}30`, padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>🔊</button>
                    </div>
                    <div style={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}>{ex.roman}</div>
                    <div style={{ color: '#9ca3af', fontSize: '13px' }}>{ex.english}</div>
                    <div style={{ background: mark.color + '15', color: mark.color, fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '6px' }}>{ex.tone} tone</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '14px 16px', border: '1px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Key tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{mark.tip}</p>
              </div>
            </div>
          </div>

          {/* All 4 marks navigation */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>All 4 Tone Marks</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {TONE_MARKS.map((m, i) => (
                <button key={m.name} onClick={() => setMarkIndex(i)}
                  style={{ background: i === markIndex ? m.color : '#f9fafb', color: i === markIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === markIndex ? m.color : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', transition: 'all 0.15s', fontWeight: '800', fontSize: '16px' }}>
                  {m.mark.replace('◌', 'ก')} <span style={{ fontSize: '12px', display: 'block', opacity: 0.8 }}>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {markIndex > 0 && <button onClick={() => setMarkIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {markIndex + 1 < TONE_MARKS.length ? (
              <button onClick={() => setMarkIndex(prev => prev + 1)}
                style={{ flex: 1, background: `linear-gradient(135deg, #1a1a2e, ${TONE_MARKS[markIndex + 1].color})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {TONE_MARKS[markIndex + 1].name} →
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

      {/* QUIZ PHASE */}
      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#E85D26', fontWeight: '700', fontSize: '14px' }}>Question {quizIndex + 1} of {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#E85D26', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Question {quizIndex + 1}</div>
              <div style={{ color: '#1a1a2e', fontSize: '22px', fontWeight: '800', lineHeight: '1.4' }}>{QUIZ_Q[quizIndex].question}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUIZ_Q[quizIndex].options.map(opt => {
                const isCorrect = opt === QUIZ_Q[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151'
                if (selected) {
                  if (isCorrect) { bg = '#fff7ed'; border = '#E85D26'; textColor = '#c2410c' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '16px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '16px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#E85D26', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#fff7ed' : '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#fed7aa' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <div style={{ color: '#c2410c', fontWeight: '700' }}>✅ Correct!</div>
                : <div style={{ color: '#dc2626', fontWeight: '700' }}>❌ The correct answer is: <strong>{QUIZ_Q[quizIndex].correct}</strong></div>
              }
            </div>
          )}
          {selected && (
            <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #1a1a2e, #E85D26)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              {quizIndex + 1 >= QUIZ_Q.length ? '🏆 See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div style={{ maxWidth: '540px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#E85D26' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#fff7ed' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #fff7ed, #fef2f2)', borderRadius: '14px', padding: '20px 24px', marginBottom: '28px', border: '2px solid #fed7aa', textAlign: 'left' }}>
              <div style={{ color: '#E85D26', fontWeight: '900', fontSize: '16px', marginBottom: '10px' }}>🎉 Unit 2 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7' }}>
                You have completed the entire vowel and tone mark unit. You now know:<br />
                ✓ 9 short vowels + 9 long vowels<br />
                ✓ 10 vowel combinations<br />
                ✓ 5 Thai tones<br />
                ✓ 4 written tone marks<br /><br />
                Combined with Unit 1's 44 consonants — you have all the building blocks of the Thai script!
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-3/lesson-1" style={{ display: 'block', background: 'linear-gradient(135deg, #1a1a2e, #E85D26)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Unit 3 — The 5 Tones in Practice →
              </Link>
              <Link href="/learn-thai/a1" style={{ display: 'block', background: '#f3f4f6', color: '#374151', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
                ← Back to A1 Overview
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
