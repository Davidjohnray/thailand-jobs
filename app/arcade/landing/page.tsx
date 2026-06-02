'use client'
import { useState } from 'react'
import Link from 'next/link'

const GAME_TYPES = [
  { emoji: '🎯', name: 'Vocab Blast', desc: 'Show a word — students pick the correct definition from 4 choices.' },
  { emoji: '🔍', name: 'Word Hunter', desc: 'Show a definition — students hunt for the correct word. Reverse of Vocab Blast.' },
  { emoji: '📝', name: 'Quiz Master', desc: 'Write any question and 4 answer options. Works for any subject.' },
  { emoji: '✅', name: 'True or False', desc: 'Write a statement. Students tap True or False. Fast and fun.' },
  { emoji: '🖼️', name: 'Picture Quiz', desc: 'Upload an image and let students identify it from 4 choices.' },
]

const MODES = [
  {
    emoji: '📚', name: 'Self Study',
    color: '#f59e0b',
    tag: 'Individual devices',
    desc: 'Students review vocabulary cards at their own pace, then test themselves with a quiz. Perfect for homework or independent revision.',
    steps: ['Student opens the game link', 'Reviews all vocab cards first', 'Takes the quiz and gets a score'],
  },
  {
    emoji: '📺', name: 'TV Classroom Mode',
    color: '#E85D26',
    tag: 'No student devices needed',
    desc: 'Project onto your classroom screen. Teach the vocabulary as a whole class, then run a live team game with leaderboard and final podium.',
    steps: ['Teacher projects game on screen', 'Teaches vocab cards as a class', 'Runs team quiz with up to 6 teams', 'Full leaderboard after every question'],
  },
  {
    emoji: '📱', name: 'Online Multiplayer',
    color: '#7C3AED',
    tag: 'Students on phones/tablets',
    desc: 'Students join with a room code on their own devices. Answer questions live and compete on a real-time leaderboard.',
    steps: ['Teacher opens host screen', 'Students join with a room code', 'Everyone answers on their device', 'Live leaderboard updates in real time'],
  },
]

const STEPS = [
  { n: '1', title: 'Get your code', desc: 'Purchase an activation code — less than the price of a coffee.' },
  { n: '2', title: 'Activate your arcade', desc: 'Enter your code at /arcade/activate and set up your personal teacher arcade.' },
  { n: '3', title: 'Build a game', desc: 'Choose a game type, add your questions, set a timer and go live in minutes.' },
  { n: '4', title: 'Play with your class', desc: 'Share your arcade link. Choose Self Study, TV Mode or Multiplayer and play.' },
]

export default function TeacherArcadeLanding() {
  const [activeMode, setActiveMode] = useState(0)

  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#0f172a', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .game-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important; }
        .mode-btn:hover { opacity: 1 !important; }
        .cta-btn:hover { transform: scale(1.04) !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎮</span>
          <span style={{ color: 'white', fontWeight: '900', fontSize: '18px' }}>Teacher Arcade</span>
          <span style={{ background: '#f59e0b', color: '#1a1a2e', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '20px', letterSpacing: '1px' }}>NEW</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/arcade/dashboard" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Sign In</Link>
          <Link href="/arcade/activate"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '10px 22px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '14px' }}>
            Get Started →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '30px', padding: '8px 18px', marginBottom: '28px' }}>
          <span style={{ animation: 'pulse 2s infinite', fontSize: '12px' }}>●</span>
          <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '700' }}>Now live on jobsinthailand.net</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '900', lineHeight: 1.1, margin: '0 0 24px', maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto' }}>
          Build classroom games<br />
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #E85D26)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your students will love</span>
        </h1>

        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.65)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: '1.7' }}>
          Create vocab games, quizzes and team challenges in minutes. Play on the big screen, on phones, or let students study solo. No tech skills needed.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
          <Link href="/arcade/activate"
            className="cta-btn"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '18px 40px', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '18px', boxShadow: '0 8px 32px rgba(245,158,11,0.4)', transition: 'transform 0.2s', display: 'inline-block' }}>
            🎮 Get Your Activation Code →
          </Link>
          <Link href="/arcade/david"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '18px 32px', borderRadius: '14px', textDecoration: 'none', fontWeight: '700', fontSize: '17px', border: '2px solid rgba(255,255,255,0.15)', display: 'inline-block' }}>
            👀 See a Demo
          </Link>
        </div>

        {/* Floating emojis */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap' }}>
          {['🎯', '🔍', '📝', '✅', '🖼️', '🏆', '📺', '📱'].map((e, i) => (
            <span key={i} style={{ fontSize: '32px', animation: `float ${2 + i * 0.3}s ease-in-out infinite`, display: 'inline-block', opacity: 0.7 }}>{e}</span>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'rgba(245,158,11,0.12)', borderTop: '1px solid rgba(245,158,11,0.2)', borderBottom: '1px solid rgba(245,158,11,0.2)', padding: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', textAlign: 'center' }}>
          {[
            { stat: '5', label: 'Game Types' },
            { stat: '3', label: 'Play Modes' },
            { stat: '6', label: 'Teams in TV Mode' },
            { stat: '40', label: 'Students in Multiplayer' },
            { stat: '< 10 min', label: 'To build your first game' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: '#f59e0b', fontSize: '28px', fontWeight: '900', lineHeight: 1 }}>{s.stat}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GAME TYPES */}
      <section style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px' }}>5 Game Types</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', margin: '0 0 16px' }}>Pick your format, add your content</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>Every game type works across all three play modes — build once, use three ways.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {GAME_TYPES.map((g, i) => (
            <div key={i} className="game-card" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '18px', padding: '28px 24px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.25s', cursor: 'default' }}>
              <div style={{ fontSize: '44px', marginBottom: '14px' }}>{g.emoji}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px', color: 'white' }}>{g.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{g.desc}</p>
            </div>
          ))}
          {/* Placeholder for 5th → 6 grid */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '18px', padding: '28px 24px', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ fontSize: '36px' }}>✨</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', fontWeight: '700', textAlign: 'center' }}>More game types<br />coming soon</div>
          </div>
        </div>
      </section>

      {/* 3 PLAY MODES */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ color: '#E85D26', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px' }}>3 Play Modes</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', margin: '0 0 16px' }}>One game, three ways to play</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>Choose the mode that fits your classroom — or let students pick for themselves.</p>
          </div>

          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {MODES.map((m, i) => (
              <button key={i} onClick={() => setActiveMode(i)} className="mode-btn"
                style={{ padding: '12px 24px', borderRadius: '12px', border: `2px solid ${activeMode === i ? m.color : 'rgba(255,255,255,0.12)'}`, background: activeMode === i ? m.color + '20' : 'transparent', color: activeMode === i ? m.color : 'rgba(255,255,255,0.5)', fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', opacity: activeMode === i ? 1 : 0.7 }}>
                {m.emoji} {m.name}
              </button>
            ))}
          </div>

          {/* Mode detail */}
          {MODES.map((m, i) => activeMode === i && (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center', animation: 'slideIn 0.3s ease' }}>
              <div>
                <span style={{ background: m.color + '25', color: m.color, fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '16px' }}>{m.tag}</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '16px', color: 'white' }}>{m.emoji} {m.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', lineHeight: '1.7', marginBottom: '28px' }}>{m.desc}</p>
                <Link href="/arcade/activate" style={{ display: 'inline-block', background: m.color, color: '#1a1a2e', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                  Try it now →
                </Link>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '32px', border: `2px solid ${m.color}30` }}>
                <div style={{ color: m.color, fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>How it works</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {m.steps.map((step, si) => (
                    <div key={si} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ background: m.color, color: '#1a1a2e', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{si + 1}</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: '1.6', paddingTop: '3px' }}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO GET STARTED */}
      <section style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ color: '#7C3AED', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px' }}>Get Started</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', margin: '0 0 16px' }}>Up and running in 4 steps</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '22px', color: '#1a1a2e', margin: '0 auto 16px' }}>{s.n}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'white' }}>{s.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PERFECT FOR */}
      <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '32px' }}>Perfect for</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['ESL & EFL classrooms', 'Primary & secondary schools', 'Language centres', 'Tutoring schools', 'Review lessons', 'Test prep', 'End-of-term activities', 'Vocabulary building', 'Grammar practice'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '8px 18px', borderRadius: '30px', fontSize: '14px', fontWeight: '600' }}>✓ {tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '64px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🏆</div>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', marginBottom: '16px', lineHeight: 1.15 }}>
          Your students are waiting.<br />
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #E85D26)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Let's build something great.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '18px', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px', lineHeight: '1.7' }}>
          Get your activation code and build your first game today. Less than the price of a coffee ☕
        </p>
        <Link href="/arcade/activate"
          className="cta-btn"
          style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '20px 52px', borderRadius: '16px', textDecoration: 'none', fontWeight: '900', fontSize: '20px', boxShadow: '0 12px 40px rgba(245,158,11,0.45)', transition: 'transform 0.2s' }}>
          🎮 Get Your Activation Code →
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '20px' }}>jobsinthailand.net · Teacher Arcade</p>
      </section>

    </main>
  )
}
