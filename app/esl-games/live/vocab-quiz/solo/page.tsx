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

function SoloGame() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || 'Animals'
  const questions = shuffle(questionBank[topic] || questionBank['Animals']).slice(0, 10)

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    if (answered || finished) return
    if (timeLeft === 0) { handleAnswer(null); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, answered, finished])

  function handleAnswer(answer: string | null) {
    if (answered) return
    setAnswered(true)
    setSelected(answer)
    if (answer === questions[current].answer) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
      setTimeLeft(15)
    }
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', maxWidth: '480px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Game Over!</h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>Topic: {topic}</p>
          <div style={{ background: '#f0f4ff', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a1a2e' }}>{score}/{questions.length}</div>
            <div style={{ color: '#666', fontSize: '16px', marginTop: '4px' }}>{pct}% correct</div>
          </div>
          <p style={{ color: '#444', fontSize: '15px', marginBottom: '28px' }}>
            {pct >= 80 ? 'Excellent work! 🌟' : pct >= 50 ? 'Good effort! Keep practising.' : 'Keep trying — you will get there!'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              Play Again
            </button>
            <Link href="/esl-games/live/vocab-quiz" style={{ background: '#f0f0f0', color: '#1a1a2e', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              Change Topic
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const q = questions[current]
  const timerPct = (timeLeft / 15) * 100
  const timerColor = timeLeft > 8 ? '#16a34a' : timeLeft > 4 ? '#f59e0b' : '#ef4444'

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link href="/esl-games/live/vocab-quiz" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ background: '#f0f4ff', color: '#2D6BE4', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{topic}</span>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>⭐ {score}</span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>Question {current + 1} of {questions.length}</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: timerColor }}>{timeLeft}s</span>
          </div>

          <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px', marginBottom: '24px' }}>
            <div style={{ background: timerColor, height: '8px', borderRadius: '8px', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 28px', lineHeight: '1.4', textAlign: 'center' }}>{q.q}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {q.options.map((opt, i) => {
              let bg = 'white'
              let border = '2px solid #e2e8f0'
              let color = '#1a1a2e'
              if (answered) {
                if (opt === q.answer) { bg = '#dcfce7'; border = '2px solid #16a34a'; color = '#15803d' }
                else if (opt === selected) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#dc2626' }
              }
              const icons = ['🅰️', '🅱️', '🅲', '🅳']
              return (
                <button key={i} onClick={() => handleAnswer(opt)} disabled={answered}
                  style={{ background: bg, border, color, borderRadius: '12px', padding: '16px', fontSize: '15px', fontWeight: '600', cursor: answered ? 'default' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '20px' }}>{icons[i]}</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <button onClick={next} style={{ width: '100%', marginTop: '20px', background: '#1a1a2e', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              {current + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}
            </button>
          )}
        </div>

        <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '8px' }}>
          <div style={{ background: '#1a1a2e', height: '8px', borderRadius: '8px', width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '8px' }}>{current + 1} of {questions.length} questions</p>
      </div>
    </main>
  )
}

export default function SoloPage() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}><SoloGame /></Suspense>
}