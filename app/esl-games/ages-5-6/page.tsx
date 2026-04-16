'use client'
import Link from 'next/link'

const games = [
  { slug: 'flashcard-slap', title: 'Flashcard Slap', emoji: '👋', summary: 'Two students race to slap the correct flashcard when teacher calls the word.', time: '10-15 min', energy: 'High', players: '2 at a time' },
  { slug: 'bomb-game', title: 'The Bomb Game', emoji: '💣', summary: 'Pass the bomb! Whoever is holding it when the timer goes off must answer a question.', time: '10-15 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'hot-seat', title: 'Hot Seat', emoji: '🪑', summary: 'One child sits facing the class. A word appears behind them. Class describes it without saying it.', time: '15-20 min', energy: 'Low-Medium', players: 'One at a time' },
  { slug: 'simon-says', title: 'Simon Says', emoji: '🙋', summary: 'Children only follow instructions starting with "Simon says". Great for action verbs.', time: '5-10 min', energy: 'High', players: 'Whole class' },
  { slug: 'snakes-and-ladders', title: 'Snakes and Ladders', emoji: '🐍', summary: 'Classic board game but landing on a square means answering a vocabulary question.', time: '20-30 min', energy: 'Low', players: '2-4 per group' },
  { slug: 'vocabulary-bingo', title: 'Vocabulary Bingo', emoji: '🎯', summary: 'Children mark words on their bingo card as teacher calls definitions or pictures.', time: '15-20 min', energy: 'Low', players: 'Whole class' },
  { slug: 'chinese-whispers', title: 'Chinese Whispers', emoji: '🤫', summary: 'Whisper a word or sentence down the line and see how it changes.', time: '10-15 min', energy: 'Low', players: 'Teams of 6-8' },
  { slug: 'noughts-and-crosses', title: 'Noughts and Crosses', emoji: '❌', summary: 'Answer a vocabulary question correctly to place your mark on the grid.', time: '10-15 min', energy: 'Low', players: '2 teams' },
  { slug: 'memory-match', title: 'Memory Match', emoji: '🃏', summary: 'Flip cards to find matching pairs of words and pictures.', time: '15-20 min', energy: 'Low', players: '2-4 per group' },
  { slug: 'stand-up-sit-down', title: 'Stand Up Sit Down', emoji: '🧍', summary: 'Stand up if the answer is yes, sit down if no. Fast and easy vocabulary check.', time: '5-10 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'word-snap', title: 'Word Snap', emoji: '🖐️', summary: 'Flip cards one at a time — shout SNAP when two matching cards appear.', time: '10-15 min', energy: 'High', players: '2-4 per group' },
  { slug: 'hangman', title: 'Hangman', emoji: '✏️', summary: 'Guess the hidden word one letter at a time before the drawing is complete.', time: '10-15 min', energy: 'Low', players: 'Whole class or pairs' },
  { slug: 'alphabet-race', title: 'Alphabet Race', emoji: '🔤', summary: 'Race to write a word beginning with each letter of the alphabet.', time: '10-15 min', energy: 'Low', players: 'Teams of 3-4' },
  { slug: 'yes-no-game', title: 'Yes or No Game', emoji: '🙅', summary: 'Answer questions without saying yes or no — surprisingly tricky and very fun.', time: '10-15 min', energy: 'Low-Medium', players: 'Pairs or whole class' },
  { slug: 'action-race', title: 'Action Race', emoji: '🏁', summary: 'Teacher calls an action word — first child to do it correctly wins a point.', time: '5-10 min', energy: 'High', players: 'Whole class' },
  { slug: 'category-race', title: 'Category Race', emoji: '🏁', summary: 'Teams race to name as many words in a category as possible before time runs out.', time: '10-15 min', energy: 'Medium', players: 'Teams of 3-4' },
  { slug: 'sentence-builder', title: 'Sentence Builder', emoji: '🧱', summary: 'Children build sentences one word at a time around the class.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
  { slug: 'mime-it', title: 'Mime It!', emoji: '🎭', summary: 'One child mimes a word — the class guesses what it is. No talking allowed.', time: '10-15 min', energy: 'Medium', players: 'One at a time' },
  { slug: 'back-to-back', title: 'Back to Back', emoji: '🔙', summary: 'Partners sit back to back — one describes a flashcard, the other draws what they hear.', time: '15-20 min', energy: 'Low', players: 'Pairs' },
  { slug: 'keyword-bingo', title: 'Keyword Bingo', emoji: '🎯', summary: 'Children write their own bingo cards with lesson words and listen for them in a story.', time: '15-20 min', energy: 'Low', players: 'Whole class' },
  { slug: 'spelling-tennis', title: 'Spelling Tennis', emoji: '🎾', summary: 'Two teams take turns spelling a word one letter at a time like a tennis rally.', time: '10-15 min', energy: 'Low', players: '2 teams' },
  { slug: 'odd-one-out', title: 'Odd One Out', emoji: '🔎', summary: 'Three words on the board — children identify which one does not belong and explain why.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
  { slug: 'question-ball', title: 'Question Ball', emoji: '⚽', summary: 'Roll a ball to a classmate — whoever catches it must answer a question.', time: '10-15 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'true-false-run', title: 'True or False Run', emoji: '🏃', summary: 'Teacher says a sentence — children run to the TRUE or FALSE side of the room.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'word-tennis', title: 'Word Tennis', emoji: '🎾', summary: 'Partners volley vocabulary words back and forth — no repeats allowed.', time: '5-10 min', energy: 'Low', players: 'Pairs' },
  { slug: 'find-your-partner', title: 'Find Your Partner', emoji: '🤝', summary: 'Each child gets a word card — they must find the classmate holding the matching picture card.', time: '10-15 min', energy: 'Medium', players: 'Whole class' },
{ slug: 'whiteboard-race', title: 'Whiteboard Race', emoji: '🖊️', summary: 'Teams race to write the correct answer on mini whiteboards and hold them up first.', time: '10-15 min', energy: 'Medium', players: '2-4 teams' },
{ slug: 'story-time-quiz', title: 'Story Time Quiz', emoji: '📖', summary: 'Teacher reads a short story then asks comprehension questions for points.', time: '15-20 min', energy: 'Low', players: 'Whole class or teams' },
{ slug: 'word-ladder', title: 'Word Ladder', emoji: '🪜', summary: 'Change one letter at a time to turn one word into another — how many steps does it take?', time: '10-15 min', energy: 'Low', players: 'Pairs or teams' },
{ slug: 'pass-the-message', title: 'Pass the Message', emoji: '📨', summary: 'Teacher whispers a sentence to the first child — they pass it along and the last child says it aloud.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
]

export default function Ages56GamesPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-games" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to ESL Games</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{ fontSize: '52px' }}>🌟</div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 5-6 Games</h1>
              <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 4px' }}>K1-K2 Level</p>
              <p style={{ opacity: 0.8, fontSize: '14px', margin: 0 }}>Flashcard games, speaking activities, and fun group challenges.</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {games.map(game => (
            <Link key={game.slug} href={`/esl-games/ages-5-6/${game.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{game.emoji}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{game.title}</h3>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px' }}>{game.summary}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#fdf4ff', color: '#7C3AED', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '12px' }}>⏱ {game.time}</span>
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