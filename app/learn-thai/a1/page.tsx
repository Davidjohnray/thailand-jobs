'use client'
import Link from 'next/link'

const UNITS = [
  {
    number: 1, title: 'The Thai Alphabet — Consonants', emoji: '🔤',
    desc: 'Learn all 44 Thai consonants, their names, classes and sounds.',
    lessons: [
      { number: 1, title: 'Mid Class Consonants', free: true, desc: '9 consonants · The foundation of Thai script' },
      { number: 2, title: 'High Class Consonants', free: false, desc: '11 consonants · Higher tone patterns' },
      { number: 3, title: 'Low Class Consonants', free: false, desc: '24 consonants · The largest class' },
    ],
    color: '#f59e0b',
  },
  {
    number: 2, title: 'Vowels and Tone Marks', emoji: '🎵',
    desc: 'Short and long vowels, vowel combinations, and the 4 written tone marks.',
    lessons: [
      { number: 1, title: 'Short Vowels', free: true, desc: '9 short vowels · Pure vowel sounds' },
      { number: 2, title: 'Long Vowels', free: false, desc: '9 long vowels · Extended sounds' },
      { number: 3, title: 'Vowel Combinations', free: false, desc: 'Complex vowels and diphthongs' },
      { number: 4, title: 'Tone Marks', free: false, desc: '4 written marks that change tone' },
    ],
    color: '#0ea5e9',
  },
  {
    number: 3, title: 'The 5 Tones of Thai', emoji: '🎶',
    desc: 'Thai is a tonal language — the same syllable can mean 5 different things.',
    lessons: [
      { number: 1, title: 'Understanding Tones', free: true, desc: 'What tones are and why they matter' },
      { number: 2, title: 'Tone Rules — Mid Class', free: false, desc: 'How consonant class affects tone' },
      { number: 3, title: 'Tone Rules — High & Low Class', free: false, desc: 'Complex tone rules with practice' },
    ],
    color: '#22c55e',
  },
  {
    number: 4, title: 'Greetings and Polite Particles', emoji: '🙏',
    desc: 'Say hello, goodbye, thank you and sorry — plus the essential ครับ and ค่ะ.',
    lessons: [
      { number: 1, title: 'Greetings', free: false, desc: 'สวัสดี and meeting people' },
      { number: 2, title: 'Polite Particles', free: false, desc: 'ครับ / ค่ะ / นะ — when and how to use them' },
      { number: 3, title: 'Useful Phrases', free: false, desc: 'Sorry, excuse me, I don\'t understand' },
    ],
    color: '#ef4444',
  },
  {
    number: 5, title: 'Numbers 1–100', emoji: '🔢',
    desc: 'Thai numbers, how to count, tell the time, and talk about money.',
    lessons: [
      { number: 1, title: 'Numbers 1–10', free: false, desc: 'The essential first numbers' },
      { number: 2, title: 'Numbers 11–100', free: false, desc: 'Patterns and counting practice' },
      { number: 3, title: 'Money and Prices', free: false, desc: 'Baht, satang, asking how much' },
    ],
    color: '#8b5cf6',
  },
  {
    number: 6, title: 'Days, Months and Time', emoji: '📅',
    desc: 'Days of the week, months, telling the time and talking about dates.',
    lessons: [
      { number: 1, title: 'Days of the Week', free: false, desc: 'วันจันทร์ to วันอาทิตย์' },
      { number: 2, title: 'Months and Seasons', free: false, desc: 'Thai months and the year' },
      { number: 3, title: 'Telling the Time', free: false, desc: 'Thai time system — morning, afternoon, evening' },
    ],
    color: '#06b6d4',
  },
  {
    number: 7, title: 'Family and People', emoji: '👨‍👩‍👧',
    desc: 'Talk about your family, describe people, and use pronouns correctly.',
    lessons: [
      { number: 1, title: 'Family Members', free: false, desc: 'พ่อ แม่ พี่ น้อง and extended family' },
      { number: 2, title: 'Pronouns', free: false, desc: 'ผม / ฉัน / เขา — Thai pronoun system' },
      { number: 3, title: 'Describing People', free: false, desc: 'Age, appearance, nationality' },
    ],
    color: '#f97316',
  },
]

export default function A1Hub() {
  const totalLessons = UNITS.reduce((sum, u) => sum + u.lessons.length, 0)
  const freeLessons = UNITS.reduce((sum, u) => sum + u.lessons.filter(l => l.free).length, 0)

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0c4a1e 0%, #15803d 60%, #22c55e 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/learn-thai" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Learn Thai</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', minWidth: '80px', border: '2px solid rgba(255,255,255,0.3)' }}>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>A1</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>BEGINNER</div>
            </div>
            <div>
              <div style={{ display: 'inline-block', background: '#22c55e', color: 'white', fontSize: '12px', fontWeight: '800', padding: '4px 14px', borderRadius: '20px', marginBottom: '10px' }}>100% FREE</div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' }}>A1 — Absolute Beginner</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '0 0 12px', lineHeight: '1.5', maxWidth: '520px' }}>
                Start from zero. Learn the Thai alphabet, tones, essential phrases, numbers and basic vocabulary. The entire A1 level is completely free.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[`${UNITS.length} units`, `${totalLessons} lessons`, 'Thai script from day 1', 'Audio every step', 'AI tutor included'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNITS */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: '#dcfce7', borderRadius: '14px', padding: '16px 20px', border: '2px solid #86efac', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🎉</span>
          <div>
            <div style={{ color: '#15803d', fontWeight: '800', fontSize: '15px' }}>This entire level is free!</div>
            <div style={{ color: '#166534', fontSize: '13px' }}>Complete all {totalLessons} lessons at no cost. No account required to start.</div>
          </div>
          <Link href="/learn-thai/a1/unit-1/lesson-1" style={{ marginLeft: 'auto', background: '#22c55e', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
            Start Now →
          </Link>
        </div>

                {UNITS.map(unit => (
          <div key={unit.number} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: `linear-gradient(135deg, ${unit.color}20, ${unit.color}08)`, borderLeft: `5px solid ${unit.color}`, padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: unit.color, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{unit.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: unit.color, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>Unit {unit.number}</div>
                <h2 style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: '900', margin: '0 0 4px' }}>{unit.title}</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{unit.desc}</p>
              </div>
              <span style={{ background: unit.color + '15', color: unit.color, fontSize: '13px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', flexShrink: 0 }}>{unit.lessons.length} lessons</span>
            </div>
            <div style={{ padding: '8px 16px 16px' }}>
              {unit.lessons.map((lesson, i) => (
                <Link key={i} href={`/learn-thai/a1/unit-${unit.number}/lesson-${lesson.number}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 12px', borderRadius: '12px', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f9fafb'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: unit.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: unit.color, fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>
                      {unit.number}.{lesson.number}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>{lesson.title}</div>
                      <div style={{ color: '#9ca3af', fontSize: '13px' }}>{lesson.desc}</div>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', flexShrink: 0 }}>FREE</span>
                    <span style={{ color: '#d1d5db', fontSize: '18px', flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* A2 BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', borderRadius: '20px', padding: '32px 28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>🚀 READY FOR MORE?</div>
            <h3 style={{ color: 'white', fontSize: '22px', fontWeight: '900', margin: '0 0 8px' }}>Continue to A2 — Elementary Thai</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 8px', lineHeight: '1.6' }}>
              Real conversations · Food & ordering · Shopping & bargaining · Getting around · Health & body
            </p>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: '800' }}>฿199/month · Cancel anytime</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
            <Link href="/learn-thai/subscribe" style={{ background: 'white', color: '#0369a1', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '15px', textAlign: 'center' }}>
              Subscribe & Unlock A2 →
            </Link>
            <Link href="/learn-thai/subscribe" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
              Already have a code? Enter it here
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
