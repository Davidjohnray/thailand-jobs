'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SESSION_KEY = 'premium_games_session'
const PASSWORD_KEY = 'premium_games_password'

type Question = {
  q: string
  options: string[]
  answer: number
}

const questions: Record<string, Question[]> = {
  'P1-P2': [
    { q: "What is the opposite of 'big'?", options: ['small', 'tall', 'fast', 'happy'], answer: 0 },
    { q: "Which word is a colour?", options: ['dog', 'run', 'blue', 'jump'], answer: 2 },
    { q: "How many letters are in the word 'cat'?", options: ['2', '3', '4', '5'], answer: 1 },
    { q: "Which animal says 'moo'?", options: ['pig', 'dog', 'cow', 'cat'], answer: 2 },
    { q: "What comes after Monday?", options: ['Sunday', 'Friday', 'Wednesday', 'Tuesday'], answer: 3 },
    { q: "Which word rhymes with 'hat'?", options: ['dog', 'cat', 'big', 'run'], answer: 1 },
    { q: "What do you use to write?", options: ['fork', 'spoon', 'pencil', 'plate'], answer: 2 },
    { q: "Which is a fruit?", options: ['carrot', 'potato', 'apple', 'broccoli'], answer: 2 },
    { q: "What is 'happy' the opposite of?", options: ['sad', 'big', 'fast', 'tall'], answer: 0 },
    { q: "Which word is a number?", options: ['red', 'five', 'dog', 'run'], answer: 1 },
    { q: "What colour is the sky?", options: ['green', 'red', 'blue', 'yellow'], answer: 2 },
    { q: "Which word means 'a place to sleep'?", options: ['kitchen', 'bedroom', 'garden', 'school'], answer: 1 },
    { q: "What do fish live in?", options: ['trees', 'sky', 'water', 'sand'], answer: 2 },
    { q: "Which is NOT a day of the week?", options: ['Monday', 'March', 'Friday', 'Sunday'], answer: 1 },
    { q: "What sound does a dog make?", options: ['moo', 'oink', 'bark', 'meow'], answer: 2 },
    { q: "Which word is an action word?", options: ['big', 'run', 'dog', 'red'], answer: 1 },
    { q: "What is the first letter of the alphabet?", options: ['B', 'C', 'A', 'D'], answer: 2 },
    { q: "Which is a vegetable?", options: ['apple', 'banana', 'carrot', 'grape'], answer: 2 },
    { q: "How many days are in a week?", options: ['5', '6', '8', '7'], answer: 3 },
    { q: "Which word means the opposite of 'hot'?", options: ['warm', 'cold', 'soft', 'loud'], answer: 1 },
  ],
  'P3-P4': [
    { q: "Which word is a noun?", options: ['quickly', 'run', 'beautiful', 'teacher'], answer: 3 },
    { q: "What is the plural of 'child'?", options: ['childs', 'childes', 'children', 'childrens'], answer: 2 },
    { q: "Which sentence is correct?", options: ['She go to school', 'She goes to school', 'She going to school', 'She goed to school'], answer: 1 },
    { q: "What does 'enormous' mean?", options: ['tiny', 'very large', 'very fast', 'very cold'], answer: 1 },
    { q: "Which word is an adjective?", options: ['jump', 'quickly', 'beautiful', 'teacher'], answer: 2 },
    { q: "What is the past tense of 'eat'?", options: ['eated', 'eating', 'eats', 'ate'], answer: 3 },
    { q: "Which punctuation ends a question?", options: ['.', '!', ',', '?'], answer: 3 },
    { q: "What does 'nocturnal' mean?", options: ['active at night', 'active in morning', 'very fast', 'very slow'], answer: 0 },
    { q: "Which word means 'very happy'?", options: ['sad', 'angry', 'delighted', 'worried'], answer: 2 },
    { q: "What is a synonym for 'big'?", options: ['tiny', 'small', 'large', 'little'], answer: 2 },
    { q: "Which is a compound word?", options: ['beautiful', 'quickly', 'football', 'jumping'], answer: 2 },
    { q: "What is the opposite of 'ancient'?", options: ['old', 'modern', 'big', 'slow'], answer: 1 },
    { q: "Which word has a silent letter?", options: ['cat', 'run', 'knife', 'dog'], answer: 2 },
    { q: "What does 'predict' mean?", options: ['to look back', 'to say what will happen', 'to forget', 'to remember'], answer: 1 },
    { q: "Which uses 'their' correctly?", options: ['Their going home', 'Their is a dog', 'It is their dog', 'There their'], answer: 2 },
    { q: "What is an antonym?", options: ['same meaning', 'opposite meaning', 'a describing word', 'an action word'], answer: 1 },
    { q: "Which word is spelled correctly?", options: ['beutiful', 'beautiful', 'beautifull', 'beautyful'], answer: 1 },
    { q: "What does the prefix 'aqua' mean?", options: ['fire', 'earth', 'water', 'air'], answer: 2 },
    { q: "Which is a proper noun?", options: ['city', 'Bangkok', 'country', 'school'], answer: 1 },
    { q: "What is the subject in: 'The dog runs fast'?", options: ['runs', 'fast', 'The', 'dog'], answer: 3 },
  ],
  'P5-P6': [
    { q: "Which word is a conjunction?", options: ['quickly', 'because', 'beautiful', 'jump'], answer: 1 },
    { q: "What is the superlative form of 'good'?", options: ['gooder', 'more good', 'best', 'better'], answer: 2 },
    { q: "Which sentence is in passive voice?", options: ['The dog bit the man', 'The man was bitten by the dog', 'The man bit the dog', 'The dog runs fast'], answer: 1 },
    { q: "What does 'ambiguous' mean?", options: ['very clear', 'having two meanings', 'very large', 'very small'], answer: 1 },
    { q: "Which is a metaphor?", options: ['She runs like a cheetah', 'She is a cheetah', 'She runs very fast', 'The fast runner'], answer: 1 },
    { q: "What does the prefix 'un-' mean?", options: ['again', 'before', 'not', 'after'], answer: 2 },
    { q: "Which word means to make something better?", options: ['worsen', 'improve', 'destroy', 'ignore'], answer: 1 },
    { q: "What is an idiom?", options: ['a single word', 'a phrase with a different meaning', 'a type of verb', 'a punctuation mark'], answer: 1 },
    { q: "Which sentence contains a simile?", options: ['He is a lion', 'He roared loudly', 'He is as brave as a lion', 'The brave boy'], answer: 2 },
    { q: "What does the suffix '-tion' indicate?", options: ['adjective', 'verb', 'noun', 'adverb'], answer: 2 },
    { q: "Which literary device is 'The wind whispered'?", options: ['simile', 'metaphor', 'personification', 'alliteration'], answer: 2 },
    { q: "What is the meaning of 'benevolent'?", options: ['cruel', 'kind and generous', 'very angry', 'very scared'], answer: 1 },
    { q: "Which word contains a prefix meaning 'wrong'?", options: ['preview', 'misuse', 'rewrite', 'unhappy'], answer: 1 },
    { q: "What is the plural of 'phenomenon'?", options: ['phenomenons', 'phenomena', 'phenomenas', 'phenomenes'], answer: 1 },
    { q: "Which is an example of alliteration?", options: ['She sells sea shells', 'The sun is hot', 'He ran quickly', 'I like cats'], answer: 0 },
    { q: "What does 'persevere' mean?", options: ['to give up', 'to continue despite difficulty', 'to start something', 'to finish quickly'], answer: 1 },
    { q: "Which has correct subject-verb agreement?", options: ['The team are winning', 'The teams is winning', 'The team is winning', 'The teams are wins'], answer: 2 },
    { q: "What is a 'theme' in a story?", options: ['the main character', 'the setting', 'the central message', 'the plot twist'], answer: 2 },
    { q: "Which word is spelled correctly?", options: ['accomodate', 'accommodate', 'acommodate', 'accommoddate'], answer: 1 },
    { q: "What does 'rhetoric' mean?", options: ['a type of dance', 'persuasive language', 'a science term', 'a math term'], answer: 1 },
  ],
  'M1-M3': [
    { q: "What is dramatic irony?", options: ['A character says something funny', 'The audience knows something the character doesn\'t', 'Two characters disagree', 'A character lies'], answer: 1 },
    { q: "What is the subjunctive mood used for?", options: ['expressing facts', 'expressing wishes or hypotheticals', 'expressing commands', 'expressing questions'], answer: 1 },
    { q: "Which word contains a Latin root meaning 'to carry'?", options: ['telephone', 'transport', 'television', 'telescope'], answer: 1 },
    { q: "What is the meaning of 'ephemeral'?", options: ['lasting forever', 'lasting a very short time', 'very large', 'very important'], answer: 1 },
    { q: "Which literary device joins contradictory terms?", options: ['simile', 'metaphor', 'oxymoron', 'alliteration'], answer: 2 },
    { q: "What is a 'foil' character in literature?", options: ['a villain', 'a character who contrasts the protagonist', 'the narrator', 'the main character'], answer: 1 },
    { q: "Which uses a semicolon correctly?", options: ['I went; to the store', 'I went to the store; it was closed', 'I went to; the store', 'I; went to the store'], answer: 1 },
    { q: "What does 'perspicacious' mean?", options: ['having a strong smell', 'having keen insight', 'very large', 'very colorful'], answer: 1 },
    { q: "Which is an example of a paradox?", options: ['The sky is blue', 'Less is more', 'Cats are animals', 'Water is wet'], answer: 1 },
    { q: "What is 'diction' in writing?", options: ['the plot', 'the setting', 'the choice of words', 'the theme'], answer: 2 },
    { q: "Which word means excessively complimentary?", options: ['critical', 'neutral', 'sycophantic', 'objective'], answer: 2 },
    { q: "What is an anachronism?", options: ['something in the wrong time period', 'a type of metaphor', 'a grammar rule', 'a poetic form'], answer: 0 },
    { q: "Which is an example of synecdoche?", options: ['She is a star', 'All hands on deck', 'Time flies', 'It was raining cats and dogs'], answer: 1 },
    { q: "What does 'equivocate' mean?", options: ['to be very clear', 'to use vague language to deceive', 'to speak loudly', 'to write carefully'], answer: 1 },
    { q: "Which uses the conditional correctly?", options: ['If I will go, I will see her', 'If I go, I will see her', 'If I go, I would saw her', 'If I went, I will see her'], answer: 1 },
    { q: "What is 'stream of consciousness' in writing?", options: ['writing about rivers', 'a technique showing character thoughts', 'a type of poem', 'a dialogue technique'], answer: 1 },
    { q: "Which word contains the Greek root 'graph' meaning to write?", options: ['telephone', 'television', 'autograph', 'microscope'], answer: 2 },
    { q: "What is the meaning of 'zeitgeist'?", options: ['a type of music', 'the spirit or mood of an era', 'a historical event', 'a political system'], answer: 1 },
    { q: "Which is an example of metonymy?", options: ['She is a star', 'The crown decided', 'Time flies', 'He is as fast as lightning'], answer: 1 },
    { q: "What does 'soliloquy' mean in drama?", options: ['a conversation between two characters', 'a speech given alone on stage', 'a song in a play', 'the final scene'], answer: 1 },
  ],
}

const AGE_GROUPS = ['P1-P2', 'P3-P4', 'P5-P6', 'M1-M3']
const AGE_LABELS: Record<string, string> = {
  'P1-P2': 'Ages 6–7',
  'P3-P4': 'Ages 8–9',
  'P5-P6': 'Ages 10–11',
  'M1-M3': 'Ages 12–14',
}
const TIMER_SECONDS = 15
const COLORS = ['#E85D26', '#2D6BE4', '#7C3AED', '#16a34a']

export default function EnglishQuizGame() {
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [mode, setMode] = useState<'solo' | 'multi' | 'tv' | null>(null)
  const [ageGroup, setAgeGroup] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [showAnswer, setShowAnswer] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [players, setPlayers] = useState<{ name: string; score: number }[]>([])
  const [playerName, setPlayerName] = useState('')
  const [joined, setJoined] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const timerRef = useRef<any>(null)

  useEffect(() => {
    const savedPassword = localStorage.getItem(PASSWORD_KEY)
    const savedSession = localStorage.getItem(SESSION_KEY)
    if (savedPassword && savedSession) {
      supabase.from('pro_game_passwords').select('session_token, active')
        .eq('password', savedPassword).single()
        .then(({ data }) => {
          if (data?.active && data?.session_token === savedSession) setAuthed(true)
          setAuthChecking(false)
        })
    } else {
      setAuthChecking(false)
    }
  }, [])

  const currentQuestions = ageGroup ? questions[ageGroup] : []

  useEffect(() => {
    if (!gameStarted || showAnswer || gameOver || mode === 'tv') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [gameStarted, currentQ, showAnswer, gameOver])

  const handleTimeout = () => {
    setShowAnswer(true)
    setAnswers(prev => [...prev, false])
    setTimeout(() => nextQuestion(), 2000)
  }

  const handleAnswer = (idx: number) => {
    if (selected !== null || showAnswer) return
    clearInterval(timerRef.current)
    setSelected(idx)
    setShowAnswer(true)
    const correct = idx === currentQuestions[currentQ].answer
    if (correct) setScore(s => s + 1)
    setAnswers(prev => [...prev, correct])
    setTimeout(() => nextQuestion(), 2000)
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= currentQuestions.length) {
      setGameOver(true)
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setShowAnswer(false)
      setTimeLeft(TIMER_SECONDS)
    }
  }

  const startGame = () => {
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setShowAnswer(false)
    setGameOver(false)
    setTimeLeft(TIMER_SECONDS)
    setAnswers([])
    setGameStarted(true)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setMode(null)
    setAgeGroup(null)
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setShowAnswer(false)
    setTimeLeft(TIMER_SECONDS)
    setAnswers([])
    setRoomCode('')
    setJoined(false)
    setPlayerName('')
  }

  if (authChecking) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <p style={{ color: '#888' }}>Checking access...</p>
    </main>
  )

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Premium Game</h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>This is a premium game. Purchase access to unlock all premium games.</p>
        <Link href="/esl-games/live/premium"
          style={{ background: '#7C3AED', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', display: 'inline-block', marginBottom: '12px' }}>
          🔓 Get Premium Access
        </Link>
        <div style={{ marginTop: '12px' }}>
          <Link href="/esl-games/live" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>← Back to Free Games</Link>
        </div>
      </div>
    </main>
  )

  // GAME OVER SCREEN
  if (gameOver) {
    const pct = Math.round((score / currentQuestions.length) * 100)
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '👍' : '💪'
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '48px 40px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{emoji}</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Game Over!</h1>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>English Quiz — {ageGroup}</p>
          <div style={{ background: '#f9f9f9', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#7C3AED', marginBottom: '4px' }}>{score}/{currentQuestions.length}</div>
            <div style={{ color: '#888', fontSize: '16px' }}>{pct}% correct</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
            {answers.map((correct, i) => (
              <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: correct ? '#16a34a' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }}>
                {correct ? '✓' : '✗'}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={startGame}
              style={{ background: '#7C3AED', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              🔄 Play Again
            </button>
            <button onClick={resetGame}
              style={{ background: '#f0f0f0', color: '#555', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              ← Change Settings
            </button>
          </div>
        </div>
      </main>
    )
  }

  // GAME SCREEN
  if (gameStarted && ageGroup) {
    const q = currentQuestions[currentQ]
    const timerPct = (timeLeft / TIMER_SECONDS) * 100
    const timerColor = timeLeft > 8 ? '#16a34a' : timeLeft > 4 ? '#E85D26' : '#ef4444'

    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>

          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ background: '#7C3AED', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>🔤 English</span>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>{ageGroup}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>⭐ {score}</span>
              <span style={{ color: '#ccc', fontSize: '14px' }}>{currentQ + 1}/{currentQuestions.length}</span>
              <button onClick={resetGame} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>✕ Quit</button>
            </div>
          </div>

          {/* TIMER BAR */}
          {mode !== 'tv' && (
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '10px', marginBottom: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: '8px', transition: 'width 1s linear, background 0.3s' }} />
            </div>
          )}
          {mode !== 'tv' && (
            <div style={{ textAlign: 'right', color: timerColor, fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>{timeLeft}s</div>
          )}

          {/* QUESTION */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ color: '#888', fontSize: '13px', marginBottom: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Question {currentQ + 1}</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', lineHeight: '1.4', margin: 0 }}>{q.q}</h2>
          </div>

          {/* ANSWERS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {q.options.map((opt, idx) => {
              let bg = COLORS[idx]
              let border = 'none'
              let opacity = 1
              if (showAnswer) {
                if (idx === q.answer) { bg = '#16a34a'; border = '3px solid #bbf7d0' }
                else if (idx === selected) { bg = '#ef4444'; border = '3px solid #fecaca' }
                else { opacity = 0.4 }
              }
              return (
                <button key={idx} onClick={() => handleAnswer(idx)}
                  disabled={showAnswer}
                  style={{ background: bg, color: 'white', border, borderRadius: '14px', padding: '20px 16px', fontWeight: 'bold', fontSize: '16px', cursor: showAnswer ? 'default' : 'pointer', opacity, transition: 'opacity 0.3s', textAlign: 'center', lineHeight: '1.4' }}>
                  <span style={{ display: 'block', fontSize: '20px', marginBottom: '4px' }}>{['A', 'B', 'C', 'D'][idx]}</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* TV MODE REVEAL */}
          {mode === 'tv' && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {!showAnswer ? (
                <button onClick={() => { setShowAnswer(true) }}
                  style={{ background: '#7C3AED', color: 'white', padding: '14px 32px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                  👁 Reveal Answer
                </button>
              ) : (
                <button onClick={() => { setSelected(q.answer); nextQuestion() }}
                  style={{ background: '#16a34a', color: 'white', padding: '14px 32px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                  Next Question →
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    )
  }

  // SETUP SCREEN
  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED, #5b21b6)', padding: '48px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 24px' }}>
          <Link href="/esl-games/live/premium" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Premium Games</Link>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>⭐ PREMIUM</span>
        </div>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🔤</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px' }}>English Quiz</h1>
        <p style={{ opacity: 0.85, fontSize: '16px', margin: 0 }}>Grammar, vocabulary, literature & language — P1 to M3</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        {/* STEP 1 - AGE GROUP */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>1️⃣ Select Age Group</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {AGE_GROUPS.map(ag => (
              <button key={ag} onClick={() => setAgeGroup(ag)}
                style={{ padding: '16px', borderRadius: '12px', border: ageGroup === ag ? '3px solid #7C3AED' : '2px solid #eee', background: ageGroup === ag ? '#f3f0ff' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: ageGroup === ag ? '#7C3AED' : '#1a1a2e', marginBottom: '4px' }}>{ag}</div>
                <div style={{ color: '#888', fontSize: '12px' }}>{AGE_LABELS[ag]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2 - MODE */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>2️⃣ Select Game Mode</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { id: 'solo', icon: '👤', title: 'Solo Play', desc: 'Play on your own device', color: '#7C3AED' },
              { id: 'multi', icon: '📱', title: 'Multiplayer', desc: 'Students join on their phones', color: '#0891b2' },
              { id: 'tv', icon: '📺', title: 'TV Mode', desc: 'Show on the big screen', color: '#E85D26' },
            ].map(m => (
              <button key={m.id} onClick={() => setMode(m.id as any)}
                style={{ padding: '20px 16px', borderRadius: '12px', border: mode === m.id ? `3px solid ${m.color}` : '2px solid #eee', background: mode === m.id ? '#f9f9f9' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{m.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: mode === m.id ? m.color : '#1a1a2e', marginBottom: '4px' }}>{m.title}</div>
                <div style={{ color: '#888', fontSize: '12px' }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* MULTIPLAYER ROOM CODE */}
        {mode === 'multi' && (
          <div style={{ background: '#f0f4ff', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '2px solid #2D6BE4', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#2D6BE4', marginBottom: '8px' }}>📱 Multiplayer Mode</div>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '16px' }}>Share your screen or give students the room code to join on their phones. The teacher controls the game — students answer on their devices.</p>
            {!roomCode ? (
              <button onClick={() => setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase())}
                style={{ background: '#2D6BE4', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Generate Room Code
              </button>
            ) : (
              <div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#1a1a2e', letterSpacing: '6px', marginBottom: '8px' }}>{roomCode}</div>
                <div style={{ color: '#666', fontSize: '13px' }}>Share this code with your students</div>
              </div>
            )}
          </div>
        )}

        {/* START BUTTON */}
        <button
          onClick={startGame}
          disabled={!ageGroup || !mode}
          style={{ width: '100%', background: !ageGroup || !mode ? '#ccc' : '#7C3AED', color: 'white', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: !ageGroup || !mode ? 'not-allowed' : 'pointer' }}>
          {!ageGroup ? 'Select an age group to start' : !mode ? 'Select a game mode to start' : '🎮 Start English Quiz!'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px', color: '#888', fontSize: '13px' }}>
          20 questions • 15 seconds per question • 4 answer choices
        </div>
      </div>
    </main>
  )
}
