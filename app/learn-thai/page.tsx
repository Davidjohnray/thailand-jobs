'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const THAI_WORDS = [
  { thai: 'สวัสดี', roman: 'Sawasdee', english: 'Hello' },
  { thai: 'ขอบคุณ', roman: 'Khob khun', english: 'Thank you' },
  { thai: 'อาหาร', roman: 'Ahaan', english: 'Food' },
  { thai: 'สวยมาก', roman: 'Suay maak', english: 'Very beautiful' },
  { thai: 'เที่ยว', roman: 'Tiao', english: 'Travel' },
  { thai: 'ไป', roman: 'Pai', english: 'Go' },
]

const LEVELS = [
  { code: 'A1', label: 'Beginner', color: '#22c55e', desc: 'Alphabet, tones, greetings, numbers', units: 7, free: true },
  { code: 'A2', label: 'Elementary', color: '#0ea5e9', desc: 'Conversations, shopping, directions', units: 8, free: false },
  { code: 'B1', label: 'Intermediate', color: '#f59e0b', desc: 'Work, social situations, reading', units: 8, free: false },
  { code: 'B2', label: 'Upper Int.', color: '#ef4444', desc: 'News, opinions, complex Thai', units: 7, free: false },
  { code: 'C1', label: 'Advanced', color: '#8b5cf6', desc: 'Formal Thai, culture, native content', units: 6, free: false },
]

const FEATURES = [
  { emoji: '🔤', title: 'Thai Script', desc: 'Learn to read and write real Thai script from day one — not just romanisation.' },
  { emoji: '🎧', title: 'Listening Practice', desc: 'Native-quality audio at 4 speeds. Train your ear to the 5 tones of Thai.' },
  { emoji: '💬', title: 'AI Thai Tutor', desc: 'Practice real conversations with an AI tutor calibrated to your level — available 24/7.' },
  { emoji: '🎤', title: 'Speaking Practice', desc: 'Record yourself, compare to native audio, and get instant feedback on your pronunciation.' },
  { emoji: '✍️', title: 'Writing Exercises', desc: 'Type in Thai script, fill in the blanks, and write short compositions with AI correction.' },
  { emoji: '📊', title: 'Smart Vocabulary', desc: 'Spaced repetition system shows you words at exactly the right time so you never forget them.' },
]

const TESTIMONIALS = [
  { name: 'James T.', role: 'ESL Teacher, Bangkok', text: 'After 3 years in Thailand I could barely order food. Six months with this and I\'m having real conversations with my students\' parents.' },
  { name: 'Sarah K.', role: 'Teacher, Chiang Mai', text: 'The tone training finally made it click for me. I\'d tried Duolingo but it just doesn\'t cover Thai script the way this does.' },
  { name: 'Mike R.', role: 'Teacher, Phuket', text: 'My Thai colleagues are shocked at how much I\'ve improved. The AI tutor is genuinely brilliant — it corrects me without making me feel bad.' },
]

function speak(text: string, rate = 0.8) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.1
  window.speechSynthesis.speak(u)
}

export default function LearnThaiLanding() {
  const [wordIndex, setWordIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [spoken, setSpoken] = useState(false)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setWordIndex(prev => (prev + 1) % THAI_WORDS.length)
        setAnimating(false)
        setSpoken(false)
      }, 400)
    }, 3000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const currentWord = THAI_WORDS[wordIndex]

  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#0a0f1e', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-16px)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .card-hover:hover { transform:translateY(-6px) !important; box-shadow:0 20px 40px rgba(0,0,0,0.4) !important; }
        .btn-hover:hover { transform:scale(1.03) !important; }
        .word-in { animation: fadeUp 0.4s ease forwards; }
        .word-out { animation: fadeOut 0.4s ease forwards; }
      `}</style>

      {/* NAV */}
      <nav style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,15,30,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🇹🇭</span>
          <div>
            <span style={{ color: 'white', fontWeight: '900', fontSize: '18px' }}>Learn Thai</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginLeft: '8px' }}>by jobsinthailand.net</span>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/learn-thai/dashboard" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Sign In</Link>
          <Link href="/learn-thai/subscribe"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '10px 22px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '14px' }}>
            Start Learning Free →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '120px', opacity: 0.04, animation: 'float 6s ease-in-out infinite' }}>ก</div>
          <div style={{ position: 'absolute', top: '20%', right: '8%', fontSize: '100px', opacity: 0.04, animation: 'float 8s ease-in-out infinite 1s' }}>ข</div>
          <div style={{ position: 'absolute', bottom: '15%', left: '10%', fontSize: '80px', opacity: 0.04, animation: 'float 7s ease-in-out infinite 2s' }}>ค</div>
          <div style={{ position: 'absolute', bottom: '25%', right: '6%', fontSize: '110px', opacity: 0.04, animation: 'float 9s ease-in-out infinite 0.5s' }}>ง</div>
          <div style={{ position: 'absolute', top: '50%', left: '2%', fontSize: '90px', opacity: 0.03, animation: 'float 10s ease-in-out infinite 3s' }}>จ</div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '30px', padding: '8px 20px', marginBottom: '32px' }}>
          <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '800' }}>🇹🇭 Built for expat teachers in Thailand</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: '900', lineHeight: 1.1, margin: '0 0 24px', maxWidth: '900px' }}>
          Finally learn to speak<br />
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>real Thai</span>
        </h1>

        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.7' }}>
          From the Thai alphabet to fluent conversation — a complete learning system built specifically for expats living and working in Thailand.
        </p>

        {/* Live word demo */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px 48px', marginBottom: '48px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', minWidth: '320px' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Today&apos;s word</div>
          <div className={animating ? 'word-out' : 'word-in'} style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '64px', fontWeight: '900', lineHeight: 1, marginBottom: '8px', color: '#f59e0b' }}>{currentWord.thai}</div>
            <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{currentWord.roman}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>{currentWord.english}</div>
          </div>
          <button onClick={() => { speak(currentWord.thai); setSpoken(true) }}
            style={{ marginTop: '16px', background: spoken ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)', border: `1px solid ${spoken ? '#22c55e' : 'rgba(255,255,255,0.2)'}`, color: spoken ? '#86efac' : 'white', padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s' }}>
            {spoken ? '✓ Heard it!' : '🔊 Hear it in Thai'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/learn-thai/a1" className="btn-hover"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '18px 44px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '18px', boxShadow: '0 8px 32px rgba(245,158,11,0.4)', transition: 'transform 0.2s' }}>
            🎓 Start for Free
          </Link>
          <Link href="#levels"
            style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: 'white', padding: '18px 32px', borderRadius: '14px', textDecoration: 'none', fontWeight: '700', fontSize: '17px', border: '2px solid rgba(255,255,255,0.15)' }}>
            See all levels ↓
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '32px', marginTop: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{ n: '5', label: 'CEFR levels' }, { n: '35+', label: 'Course units' }, { n: '1,000+', label: 'Thai words' }, { n: 'A1', label: 'Completely free' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#f59e0b', fontSize: '28px', fontWeight: '900', lineHeight: 1 }}>{s.n}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY LEARN THAI */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Why Learn Thai?</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', marginBottom: '20px', lineHeight: 1.2 }}>You live here. Your life gets better when you speak Thai.</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '18px', maxWidth: '640px', margin: '0 auto 56px', lineHeight: '1.7' }}>
            Connect with your students, their families, and your community. Navigate daily life with confidence. Build friendships that go beyond the expat bubble.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { emoji: '🏫', text: 'Connect with students and their parents in their own language' },
              { emoji: '🛒', text: 'Shop at local markets, negotiate prices, and get the local rate' },
              { emoji: '🏥', text: 'Communicate clearly at hospitals, clinics, and government offices' },
              { emoji: '🤝', text: 'Build real friendships with Thai colleagues and neighbours' },
              { emoji: '🗺️', text: 'Travel off the tourist path and experience the real Thailand' },
              { emoji: '💼', text: 'Stand out in job applications — Thai skills are highly valued' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px 20px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.emoji}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: '1.5', fontWeight: '600' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEVELS */}
      <section id="levels" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Your Learning Path</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', marginBottom: '16px' }}>From zero to fluent — step by step</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px' }}>A1 is completely free. Unlock all levels with a monthly subscription.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {LEVELS.map((level, i) => (
              <div key={level.code} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '18px', padding: '24px 28px', border: `2px solid ${level.free ? level.color + '60' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', transition: 'all 0.2s' }}>
                <div style={{ background: level.color, width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', color: 'white', flexShrink: 0 }}>{level.code}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'white', fontWeight: '900', fontSize: '20px' }}>{level.label}</span>
                    {level.free && <span style={{ background: level.color + '25', color: level.color, fontSize: '12px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px' }}>FREE</span>}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>{level.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '600' }}>{level.units} units</span>
                  {level.free
                    ? <Link href="/learn-thai/a1" style={{ background: level.color, color: 'white', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '14px' }}>Start Free →</Link>
                    : <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' }}>🔒 Subscribe</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Everything You Need</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', marginBottom: '16px' }}>All 4 skills. One platform.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card-hover" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '18px', padding: '28px 24px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.25s', cursor: 'default' }}>
                <div style={{ fontSize: '44px', marginBottom: '16px' }}>{f.emoji}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '10px', color: 'white' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.65', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALPHABET PREVIEW */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Start Here</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', marginBottom: '16px' }}>The Thai alphabet is easier than you think</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px', maxWidth: '560px', margin: '0 auto 48px', lineHeight: '1.7' }}>
            44 consonants, 32 vowels, 5 tones. We break it down into small, manageable steps with audio for every single character.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '10px', marginBottom: '40px' }}>
            {['ก','ข','ค','ง','จ','ช','ซ','ญ','ด','ต','ถ','ท','น','บ','ป','ผ','ฝ','พ','ฟ','ม','ย','ร','ล','ว','ส','ห','อ','ฮ'].map((char, i) => (
              <button key={char} onClick={() => speak(char)} title={`Click to hear ${char}`}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 8px', fontSize: '28px', fontWeight: '900', color: i < 9 ? '#f59e0b' : 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.15)'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#f59e0b' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)' }}>
                {char}
              </button>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '28px' }}>👆 Click any character to hear it spoken in Thai</p>
          <Link href="/learn-thai/a1" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px' }}>
            Start Learning the Alphabet →
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>From the Community</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900' }}>Teachers who made it happen</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '18px', padding: '28px 24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#f59e0b', fontSize: '28px', marginBottom: '16px' }}>★★★★★</div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: '1.7', margin: '0 0 20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <div style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>{t.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Simple Pricing</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', marginBottom: '16px' }}>Start free. Upgrade when ready.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px', maxWidth: '700px', margin: '40px auto 0' }}>

            {/* Free */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '36px 28px', border: '2px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <div style={{ color: '#22c55e', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Free Forever</div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>฿0</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px' }}>No credit card needed</div>
              {['Complete A1 level', 'Thai alphabet & tones', 'Core 200 vocabulary', 'Basic AI tutor (3/day)', 'Audio playback'].map(f => (
                <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#22c55e', fontSize: '16px', flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>{f}</span>
                </div>
              ))}
              <Link href="/learn-thai/a1" style={{ display: 'block', marginTop: '24px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '2px solid #22c55e', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '15px', textAlign: 'center' }}>
                Start Free →
              </Link>
            </div>

            {/* Paid */}
            <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', borderRadius: '20px', padding: '36px 28px', border: '2px solid #f59e0b', textAlign: 'left', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#1a1a2e', fontSize: '12px', fontWeight: '900', padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
              <div style={{ color: '#f59e0b', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Full Access</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '48px', fontWeight: '900', color: 'white' }}>฿249</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>/month</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px' }}>฿1,990/year — save 33%</div>
              {['Everything in Free', 'All 5 levels (A1–C1)', '1,000+ vocabulary words', 'Unlimited AI tutor', 'Speaking & writing practice', 'Spaced repetition system', 'Progress tracking & streaks'].map(f => (
                <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#f59e0b', fontSize: '16px', flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>{f}</span>
                </div>
              ))}
              <Link href="/learn-thai/subscribe" style={{ display: 'block', marginTop: '24px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '15px', textAlign: 'center' }}>
                Subscribe Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '64px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🇹🇭</div>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '900', marginBottom: '16px', lineHeight: 1.2 }}>
          Your Thai journey starts<br />
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with one word</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px', lineHeight: '1.7' }}>
          A1 is completely free. No credit card. No commitment. Just start.
        </p>
        <Link href="/learn-thai/a1" className="btn-hover"
          style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '20px 56px', borderRadius: '16px', textDecoration: 'none', fontWeight: '900', fontSize: '20px', boxShadow: '0 12px 40px rgba(245,158,11,0.4)', transition: 'transform 0.2s' }}>
          🎓 Start Learning Thai — Free
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginTop: '20px' }}>jobsinthailand.net · Learn Thai</p>
      </section>

    </main>
  )
}
