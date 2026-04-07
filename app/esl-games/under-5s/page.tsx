'use client'
import Link from 'next/link'

const games = [
  { slug: 'body-parts-freeze-dance', title: 'Body Parts Freeze Dance', emoji: '🕺', summary: 'Music stops and kids touch the body part the teacher calls out.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'colour-hunt', title: 'Colour Hunt', emoji: '🌈', summary: 'Teacher calls a colour, kids race to touch something that colour in the classroom.', time: '5-10 min', energy: 'High', players: 'Whole class' },
  { slug: 'whats-in-the-bag', title: "What's in the Bag?", emoji: '🎒', summary: 'Children feel objects inside a bag and guess the vocabulary word.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
  { slug: 'animal-sounds-bingo', title: 'Animal Sounds Bingo', emoji: '🐮', summary: 'Bingo cards with animal pictures. Teacher makes the sound, children mark the animal.', time: '15-20 min', energy: 'Low', players: 'Whole class' },
  { slug: 'pass-the-ball', title: 'Pass the Ball', emoji: '⚽', summary: 'A ball is passed around. Whoever catches it must say a vocabulary word.', time: '5-10 min', energy: 'Medium', players: 'Whole class' },
]

export default function Under5sGamesPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-games" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to ESL Games</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{ fontSize: '52px' }}>🐣</div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 6px' }}>Under 5s Games</h1>
              <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 4px' }}>Ages 3-4 · Pre-K Level</p>
              <p style={{ opacity: 0.8, fontSize: '14px', margin: 0 }}>Movement games, songs, and activities. No reading or writing required.</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {games.map(game => (
            <Link key={game.slug} href={`/esl-games/under-5s/${game.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{game.emoji}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{game.title}</h3>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px' }}>{game.summary}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#fff3ed', color: '#f97316', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '12px' }}>⏱ {game.time}</span>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '12px' }}>⚡ {game.energy}</span>
                  <span style={{ background: '#f0f4ff', color: '#2D6BE4', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '12px' }}>👥 {game.players}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}