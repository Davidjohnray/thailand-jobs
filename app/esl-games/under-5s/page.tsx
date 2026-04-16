'use client'
import Link from 'next/link'

const games = [
  { slug: 'body-parts-freeze-dance', title: 'Body Parts Freeze Dance', emoji: '🕺', summary: 'Music stops and kids touch the body part the teacher calls out.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'colour-hunt', title: 'Colour Hunt', emoji: '🌈', summary: 'Teacher calls a colour, kids race to touch something that colour in the classroom.', time: '5-10 min', energy: 'High', players: 'Whole class' },
  { slug: 'whats-in-the-bag', title: "What's in the Bag?", emoji: '🎒', summary: 'Children feel objects inside a bag and guess the vocabulary word.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
  { slug: 'animal-sounds-bingo', title: 'Animal Sounds Bingo', emoji: '🐮', summary: 'Bingo cards with animal pictures. Teacher makes the sound, children mark the animal.', time: '15-20 min', energy: 'Low', players: 'Whole class' },
  { slug: 'pass-the-ball', title: 'Pass the Ball', emoji: '⚽', summary: 'A ball is passed around. Whoever catches it must say a vocabulary word.', time: '5-10 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'musical-statues', title: 'Musical Statues', emoji: '🎵', summary: 'Children dance then freeze like a statue when the music stops.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'shapes-on-the-floor', title: 'Shapes on the Floor', emoji: '🔺', summary: 'Shape cards on the floor — children hop onto the shape the teacher calls.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'fruit-salad', title: 'Fruit Salad', emoji: '🍓', summary: 'Children are assigned a fruit word. When it is called they swap seats.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'clap-and-say', title: 'Clap and Say', emoji: '👏', summary: 'Clap a rhythm and say a vocabulary word on the beat. Great for phonics.', time: '5-10 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'follow-the-leader', title: 'Follow the Leader', emoji: '🦆', summary: "Children copy the leader's actions and words around the classroom.", time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'duck-duck-goose', title: 'Duck Duck Goose', emoji: '🐥', summary: 'Classic game with a vocabulary twist — say words instead of duck and goose.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'flashcard-show', title: 'Flashcard Show', emoji: '🃏', summary: 'Teacher flashes a card quickly — children shout the word as fast as they can.', time: '5-10 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'jump-the-line', title: 'Jump the Line', emoji: '➡️', summary: 'A line on the floor — jump left for yes, right for no. Fast vocabulary check.', time: '5-10 min', energy: 'High', players: 'Whole class' },
  { slug: 'sleeping-lions', title: 'Sleeping Lions', emoji: '🦁', summary: 'Children lie still like sleeping lions — last one to move wins.', time: '5-10 min', energy: 'Low', players: 'Whole class' },
  { slug: 'number-jump', title: 'Number Jump', emoji: '🔢', summary: 'Numbers on the floor — teacher calls a number and children jump to it.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'rainbow-run', title: 'Rainbow Run', emoji: '🌈', summary: 'Colour cards spread around the room — children run to the colour called.', time: '10-15 min', energy: 'High', players: 'Whole class' },
  { slug: 'teddy-bear-says', title: 'Teddy Bear Says', emoji: '🧸', summary: "Simon Says with a teddy bear — only follow instructions if teddy says so.", time: '5-10 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'magic-bag', title: 'Magic Bag', emoji: '🎩', summary: 'Teacher pulls mystery items from a bag one by one — children guess and repeat.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
  { slug: 'loud-quiet', title: 'Loud and Quiet', emoji: '🔊', summary: 'Children repeat vocabulary words loudly or quietly depending on teacher signal.', time: '5-10 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'bounce-and-say', title: 'Bounce and Say', emoji: '🏀', summary: 'Bounce a ball and say a word for each bounce — great for counting and vocab.', time: '5-10 min', energy: 'High', players: 'Whole class' },
  { slug: 'sticky-stars', title: 'Sticky Stars', emoji: '⭐', summary: 'Children earn a sticky star on the board every time they say a word correctly.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
  { slug: 'animal-walk', title: 'Animal Walk', emoji: '🐘', summary: 'Teacher calls an animal — children walk around the room moving like that animal.', time: '5-10 min', energy: 'High', players: 'Whole class' },
  { slug: 'colour-mixing', title: 'Colour Mixing', emoji: '🎨', summary: 'Teacher mixes two colour cards — children shout the colour they make together.', time: '5-10 min', energy: 'Low', players: 'Whole class' },
  { slug: 'giant-small', title: 'Giant and Small', emoji: '🔍', summary: 'Children stand tall for big things and crouch small for little things teacher names.', time: '5-10 min', energy: 'Medium', players: 'Whole class' },
  { slug: 'hello-goodbye', title: 'Hello Goodbye', emoji: '👋', summary: 'Children practise greetings by walking around saying hello and goodbye to each other.', time: '5-10 min', energy: 'High', players: 'Whole class' },
  { slug: 'mirror-mirror', title: 'Mirror Mirror', emoji: '🪞', summary: 'Children copy the teacher exactly — actions and words — like a mirror reflection.', time: '5-10 min', energy: 'Medium', players: 'Whole class' },
{ slug: 'hide-the-flashcard', title: 'Hide the Flashcard', emoji: '🙈', summary: 'Teacher hides a flashcard around the room — children find it and shout the word.', time: '10 min', energy: 'High', players: 'Whole class' },
{ slug: 'roll-and-say', title: 'Roll and Say', emoji: '🎲', summary: 'Roll a foam dice with pictures on each face — say the word that lands face up.', time: '10-15 min', energy: 'Low', players: 'Whole class' },
{ slug: 'feely-box', title: 'Feely Box', emoji: '📦', summary: 'Reach into a decorated box and guess the hidden object by touch alone.', time: '10-15 min', energy: 'Low', players: 'One at a time' },
{ slug: 'spin-the-bottle', title: 'Spin the Bottle', emoji: '🍾', summary: 'Spin a bottle — whoever it points to must say a word in the current category.', time: '10-15 min', energy: 'Low-Medium', players: 'Small groups' },
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