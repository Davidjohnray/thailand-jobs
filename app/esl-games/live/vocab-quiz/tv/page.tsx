'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

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
    { q: 'What is it called when you cannot see because of thick mist?', options: ['Rain', 'Snow', 'Fog', 'Wind'], answer: 'Fog' },
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

const optionColors = ['#E85D26', '#0891b2', '#7C3AED', '#16a34a']
const optionLabels = ['A', 'B', 'C', 'D']

function TVGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const [questions] = useState(() => shuffle(questionBank[topic] || questionBank['Animals']).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!running || revealed) return
    if (timeLeft === 0) { setRevealed(true); setRunning(false); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, revealed])

  function startTimer() { setRunning(true) }

  function revealAnswer() { setRevealed(true); setRunning(false) }

  function next() {
    if (current + 1 >= questions.length) { setFinished(true); return }
    setCurrent(c => c + 1)
    setRevealed(false)
    setRunning(false)
    setTimeLeft(20)
  }

  if (finished) {
    return (
      <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', padding: '40px' }}>
        <div style={{ fontSize: '120px' }}>🏆</div>
        <h1 style={{ color: 'white', fontSize: '64px', fontWeight: 'bold', margin: 0 }}>Game Over!</h1>
        <p style={{ color: '#ccc', fontSize: '28px' }}>Well played everyone!</p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button onClick={() => window.location.reload()} style={{ background: '#E85D26', color: 'white', padding: '16px 40px', borderRadius: '12px', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Play Again</button>
          <Link href="/esl-games/live/vocab-quiz" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>Change Topic</Link>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const timerColor = timeLeft > 10 ? '#16a34a' : timeLeft > 5 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh', padding: '32px 48px', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', opacity: 0.7 }}>🎮 Vocab Quiz — {topic}</div>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', opacity: 0.7 }}>Question {current + 1} / {questions.length}</div>
      </div>

      {/* Timer bar */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '12px', marginBottom: '32px' }}>
        <div style={{ background: timerColor, height: '12px', borderRadius: '8px', width: `${(timeLeft / 20) * 100}%`, transition: 'width 1s linear, background 0.3s' }} />
      </div>

      {/* Question */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px 60px', textAlign: 'center', maxWidth: '900px', marginBottom: '40px' }}>
          <div style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', lineHeight: '1.3' }}>{q.q}</div>
          {running && !revealed && (
            <div style={{ color: timerColor, fontSize: '64px', fontWeight: 'bold', marginTop: '16px' }}>{timeLeft}</div>
          )}
        </div>

        {/* Options grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', maxWidth: '900px' }}>
          {q.options.map((opt, i) => {
            const isCorrect = opt === q.answer
            const bg = revealed
              ? isCorrect ? '#16a34a' : 'rgba(255,255,255,0.08)'
              : optionColors[i]
            const border = revealed && isCorrect ? '4px solid #4ade80' : '4px solid transparent'
            return (
              <div key={i} style={{ background: bg, border, borderRadius: '16px', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>
                  {optionLabels[i]}
                </div>
                <div style={{ color: 'white', fontSize: '26px', fontWeight: 'bold' }}>{opt}</div>
                {revealed && isCorrect && <div style={{ marginLeft: 'auto', fontSize: '36px' }}>✅</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Teacher controls */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
        {!running && !revealed && (
          <button onClick={startTimer} style={{ background: '#16a34a', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            ▶ Start Timer
          </button>
        )}
        {!revealed && (
          <button onClick={revealAnswer} style={{ background: '#E85D26', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            💡 Reveal Answer
          </button>
        )}
        {revealed && (
          <button onClick={next} style={{ background: '#0891b2', color: 'white', padding: '14px 36px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            {current + 1 >= questions.length ? '🏆 Finish' : 'Next Question →'}
          </button>
        )}
        <Link href="/esl-games/live/vocab-quiz" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 36px', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
          ✕ Exit
        </Link>
      </div>
    </div>
  )
}

export default function TVPage() {
  return <Suspense fallback={<div style={{ background: '#1a1a2e', minHeight: '100vh' }} />}><TVGame /></Suspense>
}