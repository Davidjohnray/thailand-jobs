'use client'
import Link from 'next/link'

const games = [
  { slug: 'back-to-the-board', title: 'Back to the Board', emoji: '🔙', summary: 'Student faces the class while classmates describe the word shown on the board behind them.', time: '15-20 min', energy: 'Medium', players: 'One at a time' },
  { slug: 'running-dictation', title: 'Running Dictation', emoji: '🏃', summary: 'Text is posted on the wall. Students run to read it, memorise it, then dictate it to their partner.', time: '15-20 min', energy: 'High', players: 'Pairs' },
  { slug: 'four-corners', title: 'Four Corners', emoji: '🔲', summary: 'Each corner of the room is labelled A, B, C, or D. Children move to the corner matching their answer.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'kahoot-style-quiz', title: 'Kahoot-Style Quiz', emoji: '📱', summary: 'Use coloured cards A/B/C/D to create an interactive quiz without technology.', time: '15-20 min', energy: 'Low-Medium', players: 'Whole class or teams' },
  { slug: 'story-dice', title: 'Story Dice', emoji: '🎲', summary: 'Roll dice with pictures. Build a story together using vocabulary from the lesson.', time: '20-25 min', energy: 'Low', players: 'Groups of 3-5' },
  { slug: 'team-spelling-relay', title: 'Team Spelling Relay', emoji: '✏️', summary: 'Teams race to spell a word on the board — one letter per student.', time: '10-15 min', energy: 'High', players: 'Teams of 4-6' },
  { slug: 'taboo', title: 'Taboo', emoji: '🚫', summary: 'Describe a word without using the forbidden clue words listed on the card.', time: '15-20 min', energy: 'Medium', players: 'Teams of 3-4' },
  { slug: 'pictionary', title: 'Pictionary', emoji: '🎨', summary: 'Draw a vocabulary word on the board — no letters, no speaking. Team guesses.', time: '15-20 min', energy: 'Medium', players: 'Teams of 3-5' },
  { slug: 'word-association', title: 'Word Association Chain', emoji: '🔗', summary: 'Each student says a word connected to the previous one. No hesitation or repetition allowed.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
  { slug: 'grammar-auction', title: 'Grammar Auction', emoji: '🏷️', summary: 'Teams bid on sentences they think are correct. Wrong bids lose points.', time: '20-25 min', energy: 'Low', players: 'Teams of 3-4' },
  { slug: 'last-one-standing', title: 'Last One Standing', emoji: '🏆', summary: 'Answer spelling or vocabulary questions to stay standing. Wrong answers sit down.', time: '10-15 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'twenty-questions', title: '20 Questions', emoji: '🤔', summary: 'Think of a word — classmates ask yes or no questions to guess it in 20 tries.', time: '15-20 min', energy: 'Low', players: 'Whole class' },
  { slug: 'sentence-race', title: 'Sentence Race', emoji: '📝', summary: 'Teams race to build a grammatically correct sentence from a set of word cards.', time: '10-15 min', energy: 'Medium', players: 'Teams of 3-5' },
  { slug: 'debate-it', title: 'Debate It!', emoji: '🗣️', summary: 'Two teams argue for and against a simple topic using lesson vocabulary.', time: '20-25 min', energy: 'Low', players: '2 teams' },
  { slug: 'vocabulary-basketball', title: 'Vocabulary Basketball', emoji: '🏀', summary: 'Answer a question correctly to earn a shot at the basket. Teams compete for points.', time: '15-20 min', energy: 'High', players: '2 teams' },
  { slug: 'hot-take', title: 'Hot Take', emoji: '🔥', summary: 'Students give a bold opinion on a topic and defend it against the class.', time: '20-25 min', energy: 'Low', players: 'Whole class' },
  { slug: 'alibi-game', title: 'Alibi Game', emoji: '🕵️', summary: 'Two students leave the room. Class asks them questions to find differences in their stories.', time: '20-25 min', energy: 'Low', players: 'Whole class' },
  { slug: 'vocabulary-volleyball', title: 'Vocabulary Volleyball', emoji: '🏐', summary: 'Two teams volley vocabulary words back and forth in a category without repeating.', time: '10-15 min', energy: 'Medium', players: '2 teams' },
  { slug: 'mystery-object', title: 'Mystery Object', emoji: '🔍', summary: 'An object is hidden in a bag. Students ask yes or no questions to identify it.', time: '15-20 min', energy: 'Low', players: 'Whole class' },
  { slug: 'chain-story', title: 'Chain Story', emoji: '📖', summary: 'Each student adds one sentence to build a class story using target vocabulary.', time: '15-20 min', energy: 'Low', players: 'Whole class' },
]

export default function Ages710GamesPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-games" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to ESL Games</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{ fontSize: '52px' }}>📗</div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 7-10 Games</h1>
              <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 4px' }}>Primary Level</p>
              <p style={{ opacity: 0.8, fontSize: '14px', margin: 0 }}>Team games, spelling relays, and vocabulary challenges.</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {games.map(game => (
            <Link key={game.slug} href={`/esl-games/ages-7-10/${game.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{game.emoji}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{game.title}</h3>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px' }}>{game.summary}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#e0f7fa', color: '#0891b2', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '12px' }}>⏱ {game.time}</span>
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