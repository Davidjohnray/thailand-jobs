'use client'
import Link from 'next/link'

const games = [
  {
    slug: 'vocab-quiz',
    title: 'Vocab Quiz Showdown',
    emoji: '🧠',
    desc: 'Answer vocabulary questions as fast as you can. Pick a topic and test your knowledge.',
    topics: ['Animals', 'Food', 'Colours', 'Numbers', 'Jobs', 'Body Parts', 'Transport', 'Weather'],
    age: 'Ages 5+',
    time: '10-15 min',
  },
  {
    slug: 'word-scramble',
    title: 'Word Scramble Race',
    emoji: '🔀',
    desc: 'Unscramble the word before the timer runs out. Race your classmates to be first!',
    topics: ['Animals', 'Food', 'Sports', 'Nature', 'School', 'Travel', 'Technology', 'Countries'],
    age: 'Ages 7+',
    time: '10-15 min',
  },
  {
  slug: 'true-or-false',
  title: 'True or False Buzzer',
  emoji: '✅',
  desc: 'Is the statement true or false? Buzz in before your classmates and climb the leaderboard!',
  topics: ['Animals', 'Food', 'Science', 'Geography', 'History', 'Thailand', 'English', 'Sport'],
  age: 'Ages 7+',
  time: '10-15 min',
},
]

const modes = [
  { icon: '👤', title: 'Solo Play', desc: 'Play on your own device at your own pace. Perfect for self-study.', color: '#7C3AED' },
  { icon: '📱', title: 'Online Multiplayer', desc: 'Teacher shares a code. Students join on their own phones from anywhere.', color: '#0891b2' },
  { icon: '📺', title: 'TV Classroom Mode', desc: 'Teacher shows on a big screen. Students answer by hand — no phones needed.', color: '#E85D26' },
]

export default function LiveGamesHub() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '56px 24px', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎮</div>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 12px', letterSpacing: '-1px' }}>Live ESL Games</h1>
        <p style={{ opacity: 0.85, fontSize: '17px', maxWidth: '540px', margin: '0 auto 32px', lineHeight: '1.6' }}>
          Interactive games for ESL classrooms — play solo, join a live room, or display on the big screen.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {modes.map((m, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px 20px', textAlign: 'center', minWidth: '160px' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{m.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{m.title}</div>
              <div style={{ opacity: 0.7, fontSize: '12px', lineHeight: '1.5' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px', textAlign: 'center' }}>Available Games</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>More games coming soon</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {games.map(game => (
            <Link key={game.slug} href={`/esl-games/live/${game.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ fontSize: '64px' }}>{game.emoji}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{game.title}</h3>
                  <p style={{ color: '#666', fontSize: '14px', margin: '0 0 14px', lineHeight: '1.6' }}>{game.desc}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {game.topics.map(t => (
                      <span key={t} style={{ background: '#f0f4ff', color: '#2D6BE4', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>⏱ {game.time}</span>
                    <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>👥 {game.age}</span>
                  </div>
                </div>
                <div style={{ background: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap' }}>
                  Play Now →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}