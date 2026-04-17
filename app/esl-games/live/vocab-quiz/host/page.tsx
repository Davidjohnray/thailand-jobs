'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../../../src/lib/supabase'

const questionBank: Record<string, { q: string; options: string[]; answer: string }[]> = {
  Animals: [
    { q: 'Which animal says "meow"?', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Cat' },
    { q: 'Which animal has a long neck?', options: ['Elephant', 'Tiger', 'Giraffe', 'Monkey'], answer: 'Giraffe' },
    { q: 'Which animal lives in water?', options: ['Lion', 'Fish', 'Horse', 'Rabbit'], answer: 'Fish' },
    { q: 'Which animal has black and white stripes?', options: ['Tiger', 'Cheetah', 'Zebra', 'Panda'], answer: 'Zebra' },
    { q: 'Which animal can fly?', options: ['Snake', 'Dog', 'Eagle', 'Cat'], answer: 'Eagle' },
    { q: 'Which animal is the biggest?', options: ['Dog', 'Mouse', 'Elephant', 'Cat'], answer: 'Elephant' },
    { q: 'Which animal hops?', options: ['Fish', 'Rabbit', 'Snake', 'Turtle'], answer: 'Rabbit' },
    { q: 'Which animal has a shell?', options: ['Dog', 'Bird', 'Turtle', 'Cat'], answer: 'Turtle' },
    { q: 'Which animal is called "man\'s best friend"?', options: ['Cat', 'Dog', 'Rabbit', 'Fish'], answer: 'Dog' },
    { q: 'Which animal roars?', options: ['Cat', 'Mouse', 'Lion', 'Duck'], answer: 'Lion' },
  ],
  Food: [
    { q: 'Which food is yellow and curved?', options: ['Apple', 'Banana', 'Grape', 'Orange'], answer: 'Banana' },
    { q: 'Which food comes from a chicken?', options: ['Milk', 'Egg', 'Apple', 'Bread'], answer: 'Egg' },
    { q: 'Which food is red and round?', options: ['Banana', 'Grape', 'Tomato', 'Lemon'], answer: 'Tomato' },
    { q: 'Which drink comes from a cow?', options: ['Juice', 'Water', 'Milk', 'Tea'], answer: 'Milk' },
    { q: 'Which food is spicy?', options: ['Ice cream', 'Chilli', 'Banana', 'Milk'], answer: 'Chilli' },
    { q: 'Which food do you eat for breakfast?', options: ['Pizza', 'Cereal', 'Sushi', 'Cake'], answer: 'Cereal' },
    { q: 'Which fruit is orange in colour?', options: ['Apple', 'Banana', 'Orange', 'Grape'], answer: 'Orange' },
    { q: 'Which food is baked in an oven?', options: ['Salad', 'Bread', 'Juice', 'Milk'], answer: 'Bread' },
    { q: 'Which food is sweet and cold?', options: ['Pizza', 'Ice cream', 'Soup', 'Rice'], answer: 'Ice cream' },
    { q: 'Which vegetable is orange and long?', options: ['Pea', 'Tomato', 'Carrot', 'Potato'], answer: 'Carrot' },
  ],
  Colours: [
    { q: 'What colour is the sky?', options: ['Red', 'Green', 'Blue', 'Yellow'], answer: 'Blue' },
    { q: 'What colour is grass?', options: ['Blue', 'Green', 'Red', 'Purple'], answer: 'Green' },
    { q: 'What colour is the sun?', options: ['Blue', 'Pink', 'Yellow', 'White'], answer: 'Yellow' },
    { q: 'What colour is a tomato?', options: ['Blue', 'Red', 'Green', 'Orange'], answer: 'Red' },
    { q: 'What colour is snow?', options: ['Black', 'Brown', 'White', 'Grey'], answer: 'White' },
    { q: 'What colour is a pumpkin?', options: ['Purple', 'Orange', 'Blue', 'Red'], answer: 'Orange' },
    { q: 'What colour is a banana?', options: ['Red', 'Green', 'Yellow', 'Blue'], answer: 'Yellow' },
    { q: 'What colour is coal?', options: ['White', 'Red', 'Black', 'Green'], answer: 'Black' },
    { q: 'What colour is a flamingo?', options: ['Blue', 'Pink', 'Green', 'Yellow'], answer: 'Pink' },
    { q: 'What colour is a carrot?', options: ['Orange', 'Blue', 'Purple', 'Green'], answer: 'Orange' },
  ],
  Numbers: [
    { q: 'How many days in a week?', options: ['5', '6', '7', '8'], answer: '7' },
    { q: 'How many months in a year?', options: ['10', '11', '12', '13'], answer: '12' },
    { q: 'What is 5 + 3?', options: ['7', '8', '9', '6'], answer: '8' },
    { q: 'What is 10 - 4?', options: ['5', '6', '7', '8'], answer: '6' },
    { q: 'How many fingers on one hand?', options: ['4', '5', '6', '3'], answer: '5' },
    { q: 'What is 2 x 3?', options: ['4', '5', '6', '7'], answer: '6' },
    { q: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], answer: '3' },
    { q: 'What comes after 19?', options: ['18', '21', '20', '22'], answer: '20' },
    { q: 'How many legs does a spider have?', options: ['6', '7', '8', '10'], answer: '8' },
    { q: 'What is half of 10?', options: ['3', '4', '5', '6'], answer: '5' },
  ],
  Jobs: [
    { q: 'Who teaches children at school?', options: ['Doctor', 'Teacher', 'Chef', 'Driver'], answer: 'Teacher' },
    { q: 'Who puts out fires?', options: ['Policeman', 'Firefighter', 'Nurse', 'Pilot'], answer: 'Firefighter' },
    { q: 'Who flies an aeroplane?', options: ['Driver', 'Captain', 'Pilot', 'Sailor'], answer: 'Pilot' },
    { q: 'Who cooks food in a restaurant?', options: ['Waiter', 'Chef', 'Baker', 'Farmer'], answer: 'Chef' },
    { q: 'Who helps sick people?', options: ['Teacher', 'Driver', 'Doctor', 'Farmer'], answer: 'Doctor' },
    { q: 'Who grows food on a farm?', options: ['Pilot', 'Farmer', 'Chef', 'Builder'], answer: 'Farmer' },
    { q: 'Who builds houses?', options: ['Teacher', 'Nurse', 'Builder', 'Chef'], answer: 'Builder' },
    { q: 'Who delivers letters?', options: ['Postman', 'Driver', 'Chef', 'Nurse'], answer: 'Postman' },
    { q: 'Who keeps people safe in a town?', options: ['Teacher', 'Policeman', 'Farmer', 'Chef'], answer: 'Policeman' },
    { q: 'Who looks after teeth?', options: ['Doctor', 'Nurse', 'Dentist', 'Vet'], answer: 'Dentist' },
  ],
  'Body Parts': [
    { q: 'What do you use to see?', options: ['Ears', 'Eyes', 'Nose', 'Mouth'], answer: 'Eyes' },
    { q: 'What do you use to hear?', options: ['Eyes', 'Nose', 'Ears', 'Hands'], answer: 'Ears' },
    { q: 'What do you use to smell?', options: ['Mouth', 'Eyes', 'Nose', 'Ears'], answer: 'Nose' },
    { q: 'What do you kick a ball with?', options: ['Hands', 'Head', 'Feet', 'Ears'], answer: 'Feet' },
    { q: 'What do you use to eat?', options: ['Ears', 'Mouth', 'Eyes', 'Nose'], answer: 'Mouth' },
    { q: 'What sits on top of your body?', options: ['Arm', 'Leg', 'Head', 'Foot'], answer: 'Head' },
    { q: 'What do you write with?', options: ['Feet', 'Ears', 'Hands', 'Nose'], answer: 'Hands' },
    { q: 'What connects your foot to your body?', options: ['Arm', 'Leg', 'Neck', 'Shoulder'], answer: 'Leg' },
    { q: 'What connects your head to your body?', options: ['Arm', 'Neck', 'Leg', 'Shoulder'], answer: 'Neck' },
    { q: 'What do you use to think?', options: ['Heart', 'Stomach', 'Brain', 'Lungs'], answer: 'Brain' },
  ],
  Transport: [
    { q: 'What flies in the sky?', options: ['Car', 'Boat', 'Aeroplane', 'Bus'], answer: 'Aeroplane' },
    { q: 'What travels on rails?', options: ['Car', 'Train', 'Boat', 'Bike'], answer: 'Train' },
    { q: 'What travels on water?', options: ['Car', 'Bus', 'Boat', 'Train'], answer: 'Boat' },
    { q: 'How many wheels does a bicycle have?', options: ['1', '2', '3', '4'], answer: '2' },
    { q: 'What do you call a big red vehicle in the UK?', options: ['Train', 'Tram', 'Bus', 'Taxi'], answer: 'Bus' },
    { q: 'What do astronauts travel in?', options: ['Plane', 'Rocket', 'Boat', 'Helicopter'], answer: 'Rocket' },
    { q: 'What vehicle has a driver and a meter?', options: ['Bus', 'Train', 'Taxi', 'Tram'], answer: 'Taxi' },
    { q: 'What do you pedal?', options: ['Car', 'Bike', 'Bus', 'Boat'], answer: 'Bike' },
    { q: 'What vehicle carries many passengers on a motorway?', options: ['Taxi', 'Car', 'Coach', 'Tram'], answer: 'Coach' },
    { q: 'What has blades on top and flies?', options: ['Plane', 'Rocket', 'Helicopter', 'Jet'], answer: 'Helicopter' },
  ],
  Weather: [
    { q: 'What do you call water falling from the sky?', options: ['Snow', 'Rain', 'Hail', 'Fog'], answer: 'Rain' },
    { q: 'What is frozen rain called?', options: ['Fog', 'Rain', 'Snow', 'Hail'], answer: 'Snow' },
    { q: 'What do we call a very strong wind?', options: ['Breeze', 'Storm', 'Drizzle', 'Fog'], answer: 'Storm' },
    { q: 'What do you see in the sky after rain?', options: ['Cloud', 'Rainbow', 'Star', 'Moon'], answer: 'Rainbow' },
    { q: 'What is it called when you cannot see?', options: ['Rain', 'Snow', 'Fog', 'Wind'], answer: 'Fog' },
    { q: 'What do we call a very hot sunny day?', options: ['Cloudy', 'Rainy', 'Heatwave', 'Foggy'], answer: 'Heatwave' },
    { q: 'What protects you from rain?', options: ['Hat', 'Scarf', 'Umbrella', 'Gloves'], answer: 'Umbrella' },
    { q: 'What is thunder?', options: ['Bright light', 'Loud sound', 'Strong wind', 'Heavy rain'], answer: 'Loud sound' },
    { q: 'What season has the most snow?', options: ['Spring', 'Summer', 'Autumn', 'Winter'], answer: 'Winter' },
    { q: 'What do we call a tropical storm?', options: ['Blizzard', 'Typhoon', 'Drizzle', 'Breeze'], answer: 'Typhoon' },
  ],
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const optionColors = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a']
const optionLabels = ['A', 'B', 'C', 'D']

function HostGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const [questions] = useState(() => shuffle(questionBank[topic] || questionBank['Animals']).slice(0, 10))
  const [roomCode] = useState(generateCode)
  const [phase, setPhase] = useState<'lobby' | 'playing' | 'finished'>('lobby')
  const [players, setPlayers] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [running, setRunning] = useState(false)
  const [answers, setAnswers] = useState<any[]>([])

  // Create room in Supabase on mount
  useEffect(() => {
  supabase.from('live_game_rooms').insert([{
    code: roomCode,
    game_type: 'vocab-quiz',
    topic,
    status: 'waiting',
    current_question: 0,
  }]).then(({ error }) => {
    if (error) console.error('Room insert error:', error.message)
    else console.log('Room created:', roomCode)
  })
}, [])

  // Listen for new players joining
  // Listen for new players joining
// Listen for new players joining
useEffect(() => {
  // Initial fetch
  supabase.from('live_game_players').select('*').eq('room_code', roomCode).then(({ data }: any) => {
    setPlayers(data || [])
  })

  const channel = supabase
    .channel(`players-${roomCode}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'live_game_players',
    }, (payload) => {
      console.log('Player change detected:', payload)
      supabase.from('live_game_players').select('*').eq('room_code', roomCode).then(({ data }: any) => {
        setPlayers(data || [])
      })
    })
    .subscribe((status) => {
      console.log('Realtime status:', status)
    })

  return () => { supabase.removeChannel(channel) }
}, [roomCode])

  // Listen for answers coming in
  useEffect(() => {
    if (phase !== 'playing') return
    const channel = supabase
      .channel(`answers-${roomCode}-${current}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_game_answers',
        filter: `room_code=eq.${roomCode}`,
      }, () => {
        supabase.from('live_game_answers')
          .select('*')
          .eq('room_code', roomCode)
          .eq('question_index', current)
          .then(({ data }) => setAnswers(data || []))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [roomCode, current, phase])

  // Timer
  useEffect(() => {
    if (!running || revealed) return
    if (timeLeft === 0) { handleReveal(); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, revealed])

  async function startGame() {
    await supabase.from('live_game_rooms').update({ status: 'playing', current_question: 0 }).eq('code', roomCode)
    setPhase('playing')
    setRunning(true)
  }

  async function handleReveal() {
    setRevealed(true)
    setRunning(false)
    // Update scores for correct answers
    const correctAnswer = questions[current].answer
    const { data: roundAnswers } = await supabase
      .from('live_game_answers')
      .select('*')
      .eq('room_code', roomCode)
      .eq('question_index', current)
    if (roundAnswers) {
      for (const ans of roundAnswers) {
        if (ans.answer === correctAnswer) {
          await supabase.from('live_game_players')
            .update({ score: (players.find(p => p.id === ans.player_id)?.score || 0) + 1 })
            .eq('id', ans.player_id)
        }
      }
      // Refresh players
      const { data } = await supabase.from('live_game_players').select('*').eq('room_code', roomCode)
      setPlayers(data || [])
    }
  }

  async function nextQuestion() {
    if (current + 1 >= questions.length) {
      await supabase.from('live_game_rooms').update({ status: 'finished' }).eq('code', roomCode)
      setPhase('finished')
      return
    }
    const next = current + 1
    setCurrent(next)
    setRevealed(false)
    setRunning(true)
    setTimeLeft(15)
    setAnswers([])
    await supabase.from('live_game_rooms').update({ current_question: next }).eq('code', roomCode)
  }

  const sorted = [...players].sort((a, b) => b.score - a.score)
  const q = questions[current]
  const timerColor = timeLeft > 8 ? '#16a34a' : timeLeft > 4 ? '#f59e0b' : '#ef4444'

  // LOBBY
  if (phase === 'lobby') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '32px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link href="/esl-games/live/vocab-quiz" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>

          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📱</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Game Lobby</h1>
            <p style={{ color: '#666', fontSize: '15px', margin: '0 0 32px' }}>Share this code with your students</p>

            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Room Code</p>
              <div style={{ color: 'white', fontSize: '72px', fontWeight: 'bold', letterSpacing: '12px', lineHeight: 1 }}>{roomCode}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '16px 0 0' }}>Students go to <strong style={{ color: 'white' }}>jobsinthailand.net/play</strong></p>
            </div>

            <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>👥 Players joined: {players.length}</span>
                <span style={{ background: '#0891b2', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>{topic}</span>
              </div>
              {players.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Waiting for players to join...</p>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {players.map(p => (
                    <span key={p.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '5px 14px', fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                      {p.nickname}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              disabled={players.length === 0}
              style={{ background: players.length > 0 ? '#16a34a' : '#cbd5e1', color: 'white', padding: '14px 48px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: players.length > 0 ? 'pointer' : 'default', width: '100%' }}>
              {players.length === 0 ? 'Waiting for players...' : `Start Game with ${players.length} player${players.length > 1 ? 's' : ''} →`}
            </button>
          </div>
        </div>
      </main>
    )
  }

  // FINISHED
  if (phase === 'finished') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: '0 0 32px' }}>Final Scores!</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {sorted.map((p, i) => (
              <div key={p.id} style={{ background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '28px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '18px', flex: 1, textAlign: 'left' }}>{p.nickname}</span>
                <span style={{ color: i === 0 ? '#1a1a2e' : 'white', fontWeight: 'bold', fontSize: '22px' }}>{p.score} pts</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Play Again</button>
            <Link href="/esl-games/live" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Back to Games</Link>
          </div>
        </div>
      </main>
    )
  }

  // PLAYING
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '20px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Room: {roomCode}</span>
            <span style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>{topic}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>👥 {players.length} players</span>
            <span style={{ background: '#fff3ed', color: '#E85D26', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>Q{current + 1}/{questions.length}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>

          {/* Question panel */}
          <div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#888', fontSize: '14px' }}>Question {current + 1} of {questions.length}</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: timerColor }}>{timeLeft}s</span>
              </div>

              <div style={{ background: '#f0f0f0', borderRadius: '6px', height: '6px', marginBottom: '20px' }}>
                <div style={{ background: timerColor, height: '6px', borderRadius: '6px', width: `${(timeLeft / 15) * 100}%`, transition: 'width 1s linear' }} />
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 24px', lineHeight: '1.4' }}>{q.q}</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {q.options.map((opt, i) => {
                  const isCorrect = opt === q.answer
                  const bg = revealed ? (isCorrect ? '#dcfce7' : '#f8f9fa') : optionColors[i]
                  const border = revealed && isCorrect ? '2px solid #16a34a' : '2px solid transparent'
                  const color = revealed ? (isCorrect ? '#15803d' : '#888') : 'white'
                  return (
                    <div key={i} style={{ background: bg, border, borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s' }}>
                      <div style={{ width: '32px', height: '32px', background: revealed ? (isCorrect ? '#16a34a' : '#e2e8f0') : 'rgba(255,255,255,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: revealed ? 'white' : 'white', fontSize: '14px', flexShrink: 0 }}>
                        {optionLabels[i]}
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '15px', color }}>{opt}</span>
                      {revealed && isCorrect && <span style={{ marginLeft: 'auto' }}>✅</span>}
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                {!revealed && (
                  <button onClick={handleReveal} style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
                    💡 Reveal Answer ({answers.length}/{players.length} answered)
                  </button>
                )}
                {revealed && (
                  <button onClick={nextQuestion} style={{ background: '#0891b2', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
                    {current + 1 >= questions.length ? '🏆 See Final Scores' : 'Next Question →'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px', textAlign: 'center' }}>🏆 Leaderboard</h3>
            {sorted.length === 0 ? (
              <p style={{ color: '#888', fontSize: '13px', textAlign: 'center' }}>No scores yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sorted.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: i === 0 ? '#fffbeb' : '#f8f9fa', borderRadius: '10px', border: i === 0 ? '1px solid #fde68a' : '1px solid transparent' }}>
                    <span style={{ fontSize: '18px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}</span>
                    <span style={{ flex: 1, fontWeight: '600', fontSize: '14px', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nickname}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#E85D26' }}>{p.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function HostPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><HostGame /></Suspense>
}