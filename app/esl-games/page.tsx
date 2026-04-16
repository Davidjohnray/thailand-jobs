'use client'
import Link from 'next/link'

export default function ESLGamesPage() {
  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f0f4f8', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2a4a 100%)',
        padding: '72px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative floating bubbles */}
        {[
          { top: '12%', left: '5%',  size: 80,  emoji: '🎮', delay: '0s'    },
          { top: '60%', left: '2%',  size: 56,  emoji: '🎯', delay: '0.3s'  },
          { top: '20%', right: '4%', size: 70,  emoji: '🏆', delay: '0.6s'  },
          { top: '55%', right: '3%', size: 60,  emoji: '⭐', delay: '0.9s'  },
          { top: '80%', left: '12%', size: 48,  emoji: '📚', delay: '1.2s'  },
          { top: '75%', right: '10%',size: 52,  emoji: '✏️', delay: '1.5s'  },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: b.top,
            left: (b as any).left,
            right: (b as any).right,
            width: b.size,
            height: b.size,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: b.size * 0.45,
            animation: `float 4s ease-in-out infinite`,
            animationDelay: b.delay,
          }}>{b.emoji}</div>
        ))}

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-12px); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .age-card:hover { transform: translateY(-8px) !important; box-shadow: 0 24px 48px rgba(0,0,0,0.25) !important; }
          .age-card { transition: transform 0.25s ease, box-shadow 0.25s ease !important; }
          .stat-pill:hover { transform: scale(1.05); }
          .stat-pill { transition: transform 0.2s ease; }
        `}</style>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '40px',
            padding: '8px 20px',
            marginBottom: '28px',
            animation: 'fadeUp 0.5s ease forwards',
          }}>
            <span style={{ fontSize: '16px' }}>🎓</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>
              FREE CLASSROOM RESOURCES
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            color: 'white',
            margin: '0 0 16px',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            animation: 'fadeUp 0.6s ease 0.1s both',
          }}>
            ESL Games for
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg, #f97316, #fbbf24, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Every Classroom
            </span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: '18px',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '0 auto 40px',
            animation: 'fadeUp 0.6s ease 0.2s both',
          }}>
            Ready-to-run ESL games for Under 5s through to Primary. No prep. No cost. Just great lessons.
          </p>

          {/* Stats strip */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeUp 0.6s ease 0.3s both',
          }}>
            {[
              { icon: '🎮', label: '30+ Free Games'     },
              { icon: '👶', label: '3 Age Groups'        },
              { icon: '⚡', label: 'Zero Prep Needed'   },
              { icon: '♾️', label: 'Always Free'         },
            ].map((s, i) => (
              <div key={i} className="stat-pill" style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '32px',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'default',
              }}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────── */}
      <div style={{ background: '#0f172a', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f0f4f8" />
        </svg>
      </div>

      {/* ── AGE GROUP CARDS ───────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 24px 48px' }}>

        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Choose Your Age Group
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
            Every game includes rules, tips, and classroom variations
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>

          {/* ── UNDER 5s ── */}
          <Link href="/esl-games/under-5s" style={{ textDecoration: 'none' }}>
            <div className="age-card" style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              cursor: 'pointer',
            }}>
              {/* card header */}
              <div style={{
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 60%, #fbbf24 100%)',
                padding: '36px 28px 28px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 100, opacity: 0.15 }}>🧸</div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '1px',
                  marginBottom: '14px',
                  textTransform: 'uppercase',
                }}>Nursery / Kindergarten</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '60px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>🧸</span>
                  <div>
                    <h3 style={{ fontSize: '30px', fontWeight: 900, color: 'white', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Under 5s</h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: 0 }}>Movement, songs &amp; sensory play</p>
                  </div>
                </div>
              </div>
              {/* card body */}
              <div style={{ padding: '24px 28px 28px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {['Body Parts Freeze Dance', 'Colour Hunt', 'Magic Bag', 'Animal Walk', 'Sticky Stars'].map(g => (
                    <span key={g} style={{
                      background: '#fff7ed',
                      color: '#c2410c',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: '1px solid #fed7aa',
                    }}>{g}</span>
                  ))}
                  <span style={{
                    background: '#f97316',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}>+10 more</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fff7ed',
                  borderRadius: '12px',
                  padding: '12px 16px',
                }}>
                  <span style={{ color: '#9a3412', fontSize: '14px', fontWeight: 600 }}>Browse all Under 5s games</span>
                  <span style={{ fontSize: '20px' }}>→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* ── AGES 5-6 ── */}
          <Link href="/esl-games/ages-5-6" style={{ textDecoration: 'none' }}>
            <div className="age-card" style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              cursor: 'pointer',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 60%, #a78bfa 100%)',
                padding: '36px 28px 28px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 100, opacity: 0.15 }}>⭐</div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '1px',
                  marginBottom: '14px',
                  textTransform: 'uppercase',
                }}>K1 / K2 / Grade 1</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '60px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>⭐</span>
                  <div>
                    <h3 style={{ fontSize: '30px', fontWeight: 900, color: 'white', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Ages 5–6</h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: 0 }}>Flashcard games &amp; group challenges</p>
                  </div>
                </div>
              </div>
              <div style={{ padding: '24px 28px 28px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {['Flashcard Slap', 'Bomb Game', 'Hot Seat', 'Simon Says', 'Bingo'].map(g => (
                    <span key={g} style={{
                      background: '#f5f3ff',
                      color: '#5b21b6',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: '1px solid #ddd6fe',
                    }}>{g}</span>
                  ))}
                  <span style={{
                    background: '#7c3aed',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}>+10 more</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f5f3ff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                }}>
                  <span style={{ color: '#4c1d95', fontSize: '14px', fontWeight: 600 }}>Browse all Ages 5–6 games</span>
                  <span style={{ fontSize: '20px' }}>→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* ── AGES 7-10 ── */}
          <Link href="/esl-games/ages-7-10" style={{ textDecoration: 'none' }}>
            <div className="age-card" style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              cursor: 'pointer',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 60%, #22d3ee 100%)',
                padding: '36px 28px 28px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 100, opacity: 0.15 }}>📗</div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '1px',
                  marginBottom: '14px',
                  textTransform: 'uppercase',
                }}>Primary School</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '60px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>📗</span>
                  <div>
                    <h3 style={{ fontSize: '30px', fontWeight: 900, color: 'white', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Ages 7–10</h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: 0 }}>Team games &amp; vocabulary challenges</p>
                  </div>
                </div>
              </div>
              <div style={{ padding: '24px 28px 28px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {['Hot Potato Quiz', 'Taboo', 'Grammar Auction', 'Speed Debate', 'Pictionary'].map(g => (
                    <span key={g} style={{
                      background: '#ecfeff',
                      color: '#0e7490',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: '1px solid #a5f3fc',
                    }}>{g}</span>
                  ))}
                  <span style={{
                    background: '#0891b2',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}>+10 more</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ecfeff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                }}>
                  <span style={{ color: '#164e63', fontSize: '14px', fontWeight: 600 }}>Browse all Ages 7–10 games</span>
                  <span style={{ fontSize: '20px' }}>→</span>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* ── WHY GAMES SECTION ─────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
          borderRadius: '28px',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, fontSize: 200, opacity: 0.04 }}>🎮</div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: 'white', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
              Why Use Games in Your ESL Class?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>
              Every game on this site includes full rules, teacher tips, and variations
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {[
              { icon: '😌', title: 'Lower Anxiety',     desc: 'Games create a relaxed environment where students take more risks with language' },
              { icon: '🧠', title: 'Better Retention',  desc: 'Vocabulary learned through games sticks far longer than traditional drilling'    },
              { icon: '🙋', title: '100% Participation',desc: 'Every student gets involved — even shy learners open up during game play'        },
              { icon: '⚡', title: 'Zero Prep Time',    desc: 'Every game is ready to run in minutes — just read and go'                        },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '24px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>{item.icon}</div>
                <h4 style={{ color: 'white', fontWeight: 700, fontSize: '15px', margin: '0 0 8px' }}>{item.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/esl-resources" style={{
              background: 'linear-gradient(135deg, #f97316, #fbbf24)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '15px',
              boxShadow: '0 4px 16px rgba(249,115,22,0.35)',
            }}>
              📚 Browse Premium Lesson Plans
            </Link>
            <Link href="https://www.facebook.com/groups/4181665728812037" target="_blank" style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '15px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              💬 Join Our Free ESL Games Group
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
