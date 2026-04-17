'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '../../src/lib/supabase'

const optionColors = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a']
const optionLabels = ['A', 'B', 'C', 'D']

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

function PlayPage() {
  const [phase, setPhase] = useState<'join' | 'lobby' | 'playing' | 'finished'>('join')
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [room, setRoom] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  async function joinRoom() {
    setError('')
    if (!code.trim() || !nickname.trim()) { setError('Please enter your name and the room code'); return }
    const { data: roomData } = await supabase.from('live_game_rooms').select('*').eq('code', code.trim()).single()
    if (!roomData) { setError('Room not found — check the code and try again'); return }
    if (roomData.status === 'finished') { setError('This game has already finished'); return }
    const { data: player } = await supabase.from('live_game_players').insert([{ room_code: code.trim(), nickname: nickname.trim(), score: 0 }]).select().single()
    if (!player) { setError('Could not join — please try again'); return }
    setPlayerId(player.id)
    setRoom(roomData)
    const qs = shuffle(questionBank[roomData.topic] || questionBank['Animals']).slice(0, 10)
    setQuestions(qs)
    setPhase('lobby')
  }

  // Listen for game to start
  useEffect(() => {
    if (phase !== 'lobby' || !room) return
    const channel = supabase
      .channel(`room-start-${room.code}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'live_game_rooms',
        filter: `code=eq.${room.code}`,
      }, (payload) => {
        if (payload.new.status === 'playing') {
          setCurrent(payload.new.current_question)
          setPhase('playing')
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [phase, room])

  // Listen for question changes
  useEffect(() => {
    if (phase !== 'playing' || !room) return
    const channel = supabase
      .channel(`room-playing-${room.code}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'live_game_rooms',
        filter: `code=eq.${room.code}`,
      }, (payload) => {
        if (payload.new.status === 'finished') {
          supabase.from('live_game_players').select('*').eq('room_code', room.code).order('score', { ascending: false }).then(({ data }) => {
            setLeaderboard(data || [])
          })
          setPhase('finished')
          return
        }
        if (payload.new.current_question !== current) {
          setCurrent(payload.new.current_question)
          setSelected(null)
          setAnswered(false)
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [phase, room, current])

  async function submitAnswer(answer: string) {
    if (answered || !playerId || !room) return
    setSelected(answer)
    setAnswered(true)
    const correct = answer === questions[current]?.answer
    if (correct) setScore(s => s + 1)
    await supabase.from('live_game_answers').insert([{
      room_code: room.code,
      player_id: playerId,
      question_index: current,
      answer,
      correct,
    }])
  }

  // JOIN SCREEN
  if (phase === 'join') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎮</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Join the Game</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 28px' }}>Enter your name and the room code from your teacher</p>

          {error && <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            style={{ width: '100%', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
          />
          <input
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="4-digit room code"
            maxLength={4}
            style={{ width: '100%', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '8px', marginBottom: '20px', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
          />
          <button
            onClick={joinRoom}
            disabled={code.length !== 4 || !nickname.trim()}
            style={{ width: '100%', background: code.length === 4 && nickname.trim() ? '#1a1a2e' : '#cbd5e1', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '17px', fontWeight: 'bold', cursor: code.length === 4 && nickname.trim() ? 'pointer' : 'default' }}>
            Join Game →
          </button>
        </div>
      </main>
    )
  }

  // LOBBY — waiting for teacher to start
  if (phase === 'lobby') {
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 12px' }}>You're in!</h2>
          <p style={{ opacity: 0.8, fontSize: '18px', margin: '0 0 8px' }}>Hi {nickname}! 👋</p>
          <p style={{ opacity: 0.6, fontSize: '16px' }}>Waiting for the teacher to start the game...</p>
          <div style={{ marginTop: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 24px', display: 'inline-block' }}>
            <span style={{ opacity: 0.7, fontSize: '14px' }}>Room </span>
            <span style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '4px' }}>{room?.code}</span>
          </div>
        </div>
        <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
      </main>
    )
  }

  // FINISHED
  if (phase === 'finished') {
    const myRank = leaderboard.findIndex(p => p.id === playerId) + 1
    return (
      <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', color: 'white', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>{myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🎉'}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>{myRank === 1 ? 'You Won!' : 'Game Over!'}</h2>
          <p style={{ opacity: 0.8, fontSize: '18px', margin: '0 0 24px' }}>You scored {score} points — rank #{myRank}</p>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            {leaderboard.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <span style={{ fontSize: '20px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span style={{ flex: 1, textAlign: 'left', fontWeight: p.id === playerId ? 'bold' : 'normal', color: p.id === playerId ? '#fbbf24' : 'white' }}>{p.nickname}</span>
                <span style={{ fontWeight: 'bold' }}>{p.score} pts</span>
              </div>
            ))}
          </div>
          <button onClick={() => window.location.href = '/play'} style={{ background: '#E85D26', color: 'white', padding: '12px 32px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            Play Again
          </button>
        </div>
      </main>
    )
  }

  // PLAYING
  const q = questions[current]
  if (!q) return null

  return (
    <main style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Q{current + 1}/10</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>⭐ {score}</span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0, lineHeight: '1.4' }}>{q.q}</p>
        </div>

        {answered ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>{selected === q.answer ? '✅' : '❌'}</div>
            <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
              {selected === q.answer ? 'Correct! 🎉' : 'Not quite!'}
            </p>
            {selected !== q.answer && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0 }}>Answer: <strong style={{ color: 'white' }}>{q.answer}</strong></p>
            )}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '16px' }}>Waiting for next question...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {q.options.map((opt: string, i: number) => (
              <button key={i} onClick={() => submitAnswer(opt)}
                style={{ background: optionColors[i], border: 'none', borderRadius: '14px', padding: '20px 12px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.1s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '8px', padding: '4px 10px', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{optionLabels[i]}</span>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{opt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function PlayPageWrapper() {
  return <Suspense fallback={<div style={{ background: '#1a1a2e', minHeight: '100vh' }} />}><PlayPage /></Suspense>
}