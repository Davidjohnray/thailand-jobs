'use client'
import Link from 'next/link'

const GAME_TYPES = [
  { emoji: '🎯', name: 'Vocab Blast', desc: 'Show a word — students pick the correct definition from 4 choices.' },
  { emoji: '🔍', name: 'Word Hunter', desc: 'Show a definition — students hunt for the correct word.' },
  { emoji: '📝', name: 'Quiz Master', desc: 'Write any question and 4 answer options. Works for any subject.' },
  { emoji: '✅', name: 'True or False', desc: 'Write a statement. Students tap True or False. Fast and fun.' },
  { emoji: '🖼️', name: 'Picture Quiz', desc: 'Upload an image and let students identify it from 4 choices.' },
]

const MODES = [
  { emoji: '🃏', name: 'Learn Mode', color: '#0ea5e9', desc: 'Students study vocabulary flip cards before playing. Word on front, definition on back.' },
  { emoji: '📺', name: 'TV Classroom', color: '#E85D26', desc: 'Project on the big screen and run a live team quiz. No student devices needed.' },
  { emoji: '📱', name: 'Multiplayer', color: '#7C3AED', desc: 'Students join on their phones with a room code and compete live.' },
]

const WHATSAPP = 'https://wa.me/66871033821?text=Hi%2C%20I%20am%20interested%20in%20Teacher%20Arcade%20on%20jobsinthailand.net%20-%20can%20you%20tell%20me%20more%3F'
const LINE = 'https://line.me/ti/p/~+66871033821'
const FACEBOOK = 'https://www.facebook.com/eslajarnjob'

export default function TeacherArcadeLanding() {
  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#0f172a', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .contact-btn:hover { transform: translateY(-2px) !important; opacity: 0.95 !important; }
        .game-card:hover { transform: translateY(-4px) !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎮</span>
          <span style={{ color: 'white', fontWeight: '900', fontSize: '18px' }}>Teacher Arcade</span>
          <span style={{ background: '#f59e0b', color: '#1a1a2e', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '20px', letterSpacing: '1px' }}>NEW</span>
        </Link>
        <Link href="/arcade/david" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '10px 22px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '14px' }}>
          👀 See Demo →
        </Link>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '30px', padding: '8px 18px', marginBottom: '28px' }}>
          <span style={{ animation: 'pulse 2s infinite', fontSize: '12px', color: '#f59e0b' }}>●</span>
          <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '700' }}>Now available — contact us to get early access</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: '900', lineHeight: 1.1, margin: '0 0 24px', maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto' }}>
          Build classroom games<br />
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #E85D26)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your students will love</span>
        </h1>

        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.65)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: '1.7' }}>
          Create vocab games, quizzes and team challenges in minutes. Play on the big screen, on phones, or let students study with flip cards. No tech skills needed.
        </p>

        {/* CONTACT BUTTONS */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="contact-btn"
            style={{ background: '#25D366', color: 'white', padding: '18px 36px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '18px', boxShadow: '0 8px 32px rgba(37,211,102,0.35)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>💬</span> WhatsApp Us
          </a>
          <a href={LINE} target="_blank" rel="noopener noreferrer" className="contact-btn"
            style={{ background: '#06C755', color: 'white', padding: '18px 36px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '18px', boxShadow: '0 8px 32px rgba(6,199,85,0.35)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>💚</span> LINE Us
          </a>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className="contact-btn"
            style={{ background: '#1877F2', color: 'white', padding: '18px 36px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '18px', boxShadow: '0 8px 32px rgba(24,119,242,0.35)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>📘</span> Facebook
          </a>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '24px' }}>
          Message us on any platform — we'll get back to you and set you up with early access
        </p>

        {/* Pricing note */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '14px 28px', marginBottom: '48px' }}>
          <span style={{ fontSize: '22px' }}>🎁</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: 'white', fontWeight: '900', fontSize: '16px' }}>Free trial for the first 50 teachers</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>Then just <strong style={{ color: '#f59e0b' }}>99 THB / month</strong> — less than the price of a coffee ☕</div>
          </div>
        </div>

        {/* Floating emojis */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap' }}>
          {['🎯', '🔍', '📝', '✅', '🖼️', '🏆', '📺', '📱'].map((e, i) => (
            <span key={i} style={{ fontSize: '32px', animation: `float ${2 + i * 0.3}s ease-in-out infinite`, display: 'inline-block', opacity: 0.7 }}>{e}</span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'rgba(245,158,11,0.12)', borderTop: '1px solid rgba(245,158,11,0.2)', borderBottom: '1px solid rgba(245,158,11,0.2)', padding: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', textAlign: 'center' }}>
          {[
            { stat: '5', label: 'Game Types' },
            { stat: '3', label: 'Play Modes' },
            { stat: '6', label: 'Teams in TV Mode' },
            { stat: '40+', label: 'Students in Multiplayer' },
            { stat: '< 10 min', label: 'To build your first game' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: '#f59e0b', fontSize: '28px', fontWeight: '900', lineHeight: 1 }}>{s.stat}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO LINK */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '40px 32px', border: '2px solid rgba(245,158,11,0.3)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👀</div>
          <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '12px' }}>See it in action first</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '24px', lineHeight: '1.6' }}>
            Check out a live demo arcade with real games — Animals for KG, Verbs for Primary, and a Thailand Quiz for secondary students.
          </p>
          <Link href="/arcade/david"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '18px' }}>
            🎮 View Live Demo →
          </Link>
        </div>
      </section>

      {/* GAME TYPES */}
      <section style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px' }}>5 Game Types</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '900', margin: '0 0 12px' }}>Pick your format, add your content</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px' }}>Every game type works across all three play modes.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {GAME_TYPES.map((g, i) => (
            <div key={i} className="game-card" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '18px', padding: '28px 24px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.25s' }}>
              <div style={{ fontSize: '44px', marginBottom: '14px' }}>{g.emoji}</div>
              <h3 style={{ fontSize: '19px', fontWeight: '900', marginBottom: '8px' }}>{g.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 MODES */}
      <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ color: '#E85D26', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px' }}>3 Play Modes</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '900', margin: 0 }}>One game, three ways to play</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {MODES.map((m, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '18px', padding: '28px 24px', border: `2px solid ${m.color}30` }}>
                <div style={{ fontSize: '40px', marginBottom: '14px' }}>{m.emoji}</div>
                <div style={{ color: m.color, fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{m.name}</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFECT FOR */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '28px' }}>Perfect for</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['ESL & EFL classrooms', 'Primary & secondary schools', 'Language centres', 'KG teachers', 'Vocabulary building', 'Grammar practice', 'Test prep', 'Review lessons', 'End-of-term activities'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: '600' }}>✓ {tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '56px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🏆</div>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', marginBottom: '16px', lineHeight: 1.2 }}>
          Interested in Teacher Arcade?<br />
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #E85D26)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get in touch today.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', marginBottom: '36px', maxWidth: '460px', margin: '0 auto 36px', lineHeight: '1.7' }}>
          Message us on WhatsApp, LINE or Facebook and we'll get you set up with early access.<br/>
          <span style={{ color: '#f59e0b', fontWeight: '700' }}>Free trial for the first 50 teachers — then 99 THB/month.</span>
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="contact-btn"
            style={{ background: '#25D366', color: 'white', padding: '16px 36px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            💬 WhatsApp
          </a>
          <a href={LINE} target="_blank" rel="noopener noreferrer" className="contact-btn"
            style={{ background: '#06C755', color: 'white', padding: '16px 36px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            💚 LINE
          </a>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className="contact-btn"
            style={{ background: '#1877F2', color: 'white', padding: '16px 36px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            📘 Facebook
          </a>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', marginTop: '24px' }}>jobsinthailand.net · Teacher Arcade</p>
      </section>
    </main>
  )
}
