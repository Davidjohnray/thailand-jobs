'use client'
import { useState } from 'react'
import Link from 'next/link'

const MONTHS = [
  { num: 1, thai: 'มกราคม', roman: 'mak-ka-raa-khom', english: 'January', short: 'ม.ค.', sign: 'Capricorn', note: 'From Sanskrit Makara (Capricorn). Thai months are named after zodiac signs — a system shared with Indian calendars.', mnemonic: 'Mak-ka-raa — "macara" — January marks the start.' },
  { num: 2, thai: 'กุมภาพันธ์', roman: 'kum-phaa-phan', english: 'February', short: 'ก.พ.', sign: 'Aquarius', note: 'From Sanskrit Kumbha (Aquarius/water jar). The longest Thai month name — often shortened to กุมภา in casual speech.', mnemonic: 'Kum-phaa — "kumpha" — February is the shortest month but has the longest name!' },
  { num: 3, thai: 'มีนาคม', roman: 'mii-naa-khom', english: 'March', short: 'มี.ค.', sign: 'Pisces', note: 'From Sanskrit Mina (Pisces/fish). March is hot season in Thailand — Songkran Water Festival approaches.', mnemonic: 'Mii-naa — "me-nah" — March onwards gets really hot in Thailand.' },
  { num: 4, thai: 'เมษายน', roman: 'mee-saa-yon', english: 'April', short: 'เม.ย.', sign: 'Aries', note: 'From Sanskrit Mesha (Aries/ram). Songkran — the Thai New Year water festival — falls in April (13–15 April every year).', mnemonic: 'Mee-saa-yon — April = Songkran = get wet! The biggest festival of the year.' },
  { num: 5, thai: 'พฤษภาคม', roman: 'phrúet-sa-phaa-khom', english: 'May', short: 'พ.ค.', sign: 'Taurus', note: 'From Sanskrit Vrishabha (Taurus/bull). May marks the start of the rainy season in Thailand. Labour Day (1 May) is a public holiday.', mnemonic: 'Phrúet-sa-phaa — another long name! May = rain starts coming.' },
  { num: 6, thai: 'มิถุนายน', roman: 'mi-thu-naa-yon', english: 'June', short: 'มิ.ย.', sign: 'Gemini', note: 'From Sanskrit Mithuna (Gemini/twins). Full rainy season — expect afternoon downpours daily in June.', mnemonic: 'Mi-thu-naa — "me-too-na" — June: me too, it\'s raining again.' },
  { num: 7, thai: 'กรกฎาคม', roman: 'ka-ra-ka-daa-khom', english: 'July', short: 'ก.ค.', sign: 'Cancer', note: 'From Sanskrit Karkata (Cancer/crab). Asanha Bucha and Khao Phansa (Buddhist Lent) typically fall in July — important religious holidays.', mnemonic: 'Ka-ra-ka-daa — "kara-kada" — July: Buddhist holidays, crabs and rain.' },
  { num: 8, thai: 'สิงหาคม', roman: 'sing-haa-khom', english: 'August', short: 'ส.ค.', sign: 'Leo', note: 'From Sanskrit Simha (Leo/lion). The Queen Mother\'s birthday is 12 August — a national holiday also celebrated as Mother\'s Day in Thailand.', mnemonic: 'Sing-haa — "sing-ha" — like the Singha beer lion! August = lion = Leo.' },
  { num: 9, thai: 'กันยายน', roman: 'kan-yaa-yon', english: 'September', short: 'ก.ย.', sign: 'Virgo', note: 'From Sanskrit Kanya (Virgo/maiden). Rainy season continues — September often brings flooding in low-lying areas of Thailand.', mnemonic: 'Kan-yaa — "can-yah" — September: can ya believe how much it\'s rained?' },
  { num: 10, thai: 'ตุลาคม', roman: 'tu-laa-khom', english: 'October', short: 'ต.ค.', sign: 'Libra', note: 'From Sanskrit Tula (Libra/scales). King Chulalongkorn Day (23 October) is a public holiday. Rainy season ends late October.', mnemonic: 'Tu-laa — "too-lah" — October: two more months of cool weather ahead!' },
  { num: 11, thai: 'พฤศจิกายน', roman: 'phrúet-sa-ji-kaa-yon', english: 'November', short: 'พ.ย.', sign: 'Scorpio', note: 'From Sanskrit Vrishchika (Scorpio). Cool season begins — November is one of the most pleasant months in Thailand. Loy Krathong festival falls in November.', mnemonic: 'Phrúet-sa-ji-kaa — November: finally cool! Loy Krathong lanterns light the sky.' },
  { num: 12, thai: 'ธันวาคม', roman: 'than-waa-khom', english: 'December', short: 'ธ.ค.', sign: 'Sagittarius', note: 'From Sanskrit Dhanu (Sagittarius/archer). Cool and dry — the best weather in Thailand. Constitution Day (10 Dec) and New Year\'s Eve are major celebrations.', mnemonic: 'Than-waa-khom — December: the nicest month to be in Thailand!' },
]

const SCRIPT_Q = MONTHS.map(m => ({
  thai: m.thai, roman: m.roman, english: m.english, short: m.short,
  options: [m.english, ...MONTHS.filter(x => x.english !== m.english).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.english)].sort(() => Math.random() - 0.5),
})).sort(() => Math.random() - 0.5)

const QUIZ_Q = [
  { q: 'Thai months are named after what system?', correct: 'Zodiac signs from Sanskrit', options: ['Thai kings', 'Zodiac signs from Sanskrit', 'Buddhist monks', 'Animals of the forest'] },
  { q: 'Which month does the Songkran Water Festival fall in?', correct: 'April', options: ['March', 'May', 'April', 'January'] },
  { q: 'How do you say January in Thai (romanised)?', correct: 'Mak-ka-raa-khom', options: ['Mi-thu-naa-yon', 'Mak-ka-raa-khom', 'Mii-naa-khom', 'Mee-saa-yon'] },
  { q: 'Which month is known for Loy Krathong festival?', correct: 'November', options: ['October', 'December', 'November', 'September'] },
  { q: 'What does August (Sing-haa-khom) connect to?', correct: 'Leo the lion — and Singha beer', options: ['Aquarius the water bearer', 'Leo the lion — and Singha beer', 'Scorpio the scorpion', 'Capricorn the goat'] },
  { q: 'When does the rainy season typically start in Thailand?', correct: 'May', options: ['March', 'April', 'May', 'June'] },
  { q: 'How do you say December in Thai (romanised)?', correct: 'Than-waa-khom', options: ['Tu-laa-khom', 'Sing-haa-khom', 'Than-waa-khom', 'Kan-yaa-yon'] },
  { q: 'Most Thai month names end in which sounds?', correct: '-khom or -yon', options: ['-baan or -muang', '-khom or -yon', '-wan or -daan', '-thai or -siam'] },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export default function Unit6Lesson2() {
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

  const card = MONTHS[cardIndex]
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

  const seasonColor = (num: number) => {
    if (num >= 3 && num <= 5) return '#ef4444'   // hot
    if (num >= 6 && num <= 10) return '#3b82f6'  // rainy
    return '#22c55e'                              // cool
  }
  const seasonLabel = (num: number) => {
    if (num >= 3 && num <= 5) return '🌞 Hot Season'
    if (num >= 6 && num <= 10) return '🌧️ Rainy Season'
    return '🌤️ Cool Season'
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 6 · Lesson 2 — Months of the Year</div>
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
        <div style={{ background: 'rgba(37,99,235,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(37,99,235,0.1)' }}>
          <span style={{ color: '#2563eb', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {MONTHS.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#2563eb', borderRadius: '10px', width: `${((cardIndex + 1) / MONTHS.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ background: seasonColor(card.num), color: 'white', fontSize: '12px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', flexShrink: 0 }}>{seasonLabel(card.num)}</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #2563eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>📆 Thai Months</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Thai months come from Sanskrit zodiac names. They end in either <strong>-khom (คม)</strong> for odd-numbered months or <strong>-yon (ยน)</strong> for even-numbered months — a pattern that helps you recognise them quickly.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[{ label: '🌤️ Cool', months: 'Nov–Feb', color: '#22c55e' }, { label: '🌞 Hot', months: 'Mar–May', color: '#ef4444' }, { label: '🌧️ Rainy', months: 'Jun–Oct', color: '#3b82f6' }].map(s => (
                  <div key={s.label} style={{ background: s.color + '15', borderRadius: '10px', padding: '10px 16px', border: `1px solid ${s.color}30`, flex: 1, minWidth: '120px' }}>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: s.color }}>{s.label}</div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>{s.months}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: `linear-gradient(135deg, #1e3a5f, ${seasonColor(card.num)})`, padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '12px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: '700', padding: '3px 12px', borderRadius: '20px' }}>Month {card.num}</span>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: '700', padding: '3px 12px', borderRadius: '20px' }}>{card.sign}</span>
              </div>
              <div style={{ fontSize: '52px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px' }}>{card.thai}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{card.roman}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '4px' }}>{card.english} · Short: {card.short}</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px' }}>
                <button onClick={() => speak(card.thai)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>🔊 Listen</button>
                <button onClick={() => speak(card.thai, 0.5)} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px' }}>🐢 Slow</button>
              </div>
            </div>
            <div style={{ padding: '24px 32px' }}>
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Origin & context</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '14px 16px', border: '1px solid #86efac' }}>
                <div style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Memory tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.mnemonic}</p>
              </div>
            </div>
          </div>

          {/* Month grid */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>All 12 Months</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {MONTHS.map((m, i) => (
                <button key={i} onClick={() => { setCardIndex(i); speak(m.thai) }}
                  style={{ background: i === cardIndex ? seasonColor(m.num) : '#f9fafb', color: i === cardIndex ? 'white' : '#374151', border: `2px solid ${i === cardIndex ? seasonColor(m.num) : '#e5e7eb'}`, borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center', fontSize: '11px', fontWeight: '800' }}>
                  {m.short}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < MONTHS.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(MONTHS[cardIndex + 1].thai) }}
                style={{ flex: 1, background: `linear-gradient(135deg, #1e3a5f, ${seasonColor(MONTHS[cardIndex + 1].num)})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next: {MONTHS[cardIndex + 1].english} →
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
            <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '14px' }}>Q {quizIndex + 1} / {QUIZ_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#2563eb', borderRadius: '10px', width: `${((quizIndex + 1) / QUIZ_Q.length) * 100}%`, transition: 'width 0.3s' }} />
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
                  if (isCorrect) { bg = '#eff6ff'; border = '#2563eb'; textColor = '#1e3a5f' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 20px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: textColor, fontWeight: '700', fontSize: '15px' }}>{opt}</span>
                    {selected && isCorrect && <span style={{ color: '#2563eb', fontSize: '20px' }}>✓</span>}
                    {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontSize: '20px' }}>✗</span>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === QUIZ_Q[quizIndex].correct ? '#eff6ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${selected === QUIZ_Q[quizIndex].correct ? '#bfdbfe' : '#fca5a5'}` }}>
              {selected === QUIZ_Q[quizIndex].correct
                ? <span style={{ color: '#1e3a5f', fontWeight: '700' }}>✅ Correct!</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ Correct: <strong>{QUIZ_Q[quizIndex].correct}</strong></span>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= QUIZ_Q.length ? '✍️ Script Practice →' : 'Next →'}</button>}
        </div>
      )}

      {phase === 'script' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '5px solid #2563eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>✍️ Script Recognition — Months</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Read the Thai month name and choose the correct English month. Random order each time.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '14px' }}>{scriptIndex + 1} / {SCRIPT_Q.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#2563eb', borderRadius: '10px', width: `${((scriptIndex + 1) / SCRIPT_Q.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {scriptScore}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Which month is this?</div>
              <div style={{ fontSize: '44px', fontWeight: '900', color: '#2563eb', lineHeight: 1.1, marginBottom: '8px' }}>{SCRIPT_Q[scriptIndex].thai}</div>
              <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>{SCRIPT_Q[scriptIndex].roman}</div>
              <div style={{ color: '#c4b5fd', fontSize: '13px', fontWeight: '700', marginBottom: '16px' }}>Short: {SCRIPT_Q[scriptIndex].short}</div>
              <button onClick={() => speak(SCRIPT_Q[scriptIndex].thai)}
                style={{ background: '#eff6ff', color: '#2563eb', border: '2px solid #bfdbfe', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                🔊 Hear it
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {SCRIPT_Q[scriptIndex].options.map(opt => {
                const isCorrect = opt === SCRIPT_Q[scriptIndex].english
                const isSelected = scriptSelected === opt
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (scriptSelected) {
                  if (isCorrect) { bg = '#eff6ff'; border = '#2563eb'; textColor = '#1e3a5f' }
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
                    <div style={{ fontSize: '17px', fontWeight: '900', color: textColor }}>{opt}</div>
                    {scriptSelected && isCorrect && <div style={{ color: '#2563eb', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                    {scriptSelected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>
          {scriptSelected && (
            <div style={{ background: SCRIPT_Q[scriptIndex].english === scriptSelected ? '#eff6ff' : '#fef2f2', borderRadius: '14px', padding: '14px 20px', marginBottom: '16px', border: `2px solid ${SCRIPT_Q[scriptIndex].english === scriptSelected ? '#bfdbfe' : '#fca5a5'}` }}>
              {SCRIPT_Q[scriptIndex].english === scriptSelected
                ? <span style={{ color: '#1e3a5f', fontWeight: '700' }}>✅ Correct! {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english}</span>
                : <span style={{ color: '#dc2626', fontWeight: '700' }}>❌ That is {SCRIPT_Q[scriptIndex].thai} = {SCRIPT_Q[scriptIndex].english} ({SCRIPT_Q[scriptIndex].roman})</span>
              }
            </div>
          )}
          {scriptSelected && (
            <button onClick={() => {
              if (scriptIndex + 1 >= SCRIPT_Q.length) { setPhase('complete'); return }
              setScriptIndex(prev => prev + 1); setScriptSelected(null)
            }} style={{ width: '100%', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
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
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#2563eb' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {QUIZ_Q.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#eff6ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#eff6ff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #bfdbfe', textAlign: 'left' }}>
              <div style={{ color: '#1e3a5f', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>✅ Lesson Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You know all 12 months in Thai. Next: telling the time — then you can arrange meetings and talk about schedules completely in Thai!</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-6/lesson-3" style={{ display: 'block', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Telling the Time →
              </Link>
              <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>🔄 Review Again</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
