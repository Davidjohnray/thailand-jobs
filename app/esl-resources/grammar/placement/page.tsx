'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

type Question = {
  id: number
  level: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'
  question: string
  options: string[]
  answer: string
}

const QUESTION_BANK: Question[] = [
  // ── A1 (10 questions) ──────────────────────────────────────
  { id: 1,  level: 'a1', question: 'She ___ a teacher.',                                         options: ['am', 'is', 'are', 'be'],                                          answer: 'is' },
  { id: 2,  level: 'a1', question: 'They ___ from Brazil.',                                      options: ['is', 'am', 'are', 'be'],                                          answer: 'are' },
  { id: 3,  level: 'a1', question: 'I have ___ dog. The ___ dog is brown.',                      options: ['a / a', 'a / the', 'the / a', 'the / the'],                        answer: 'a / the' },
  { id: 4,  level: 'a1', question: 'He ___ to school every day.',                                options: ['go', 'goes', 'going', 'gone'],                                     answer: 'goes' },
  { id: 5,  level: 'a1', question: 'There ___ two books on the table.',                          options: ['is', 'are', 'am', 'be'],                                          answer: 'are' },
  { id: 6,  level: 'a1', question: 'What ___ your name?',                                        options: ['am', 'is', 'are', 'be'],                                          answer: 'is' },
  { id: 7,  level: 'a1', question: 'This is ___ orange. ___ orange is very sweet.',              options: ['a / A', 'an / The', 'the / An', 'a / An'],                         answer: 'an / The' },
  { id: 8,  level: 'a1', question: 'My sister ___ like coffee.',                                 options: ['don\'t', 'doesn\'t', 'isn\'t', 'aren\'t'],                        answer: 'doesn\'t' },
  { id: 9,  level: 'a1', question: 'Where ___ you from?',                                        options: ['is', 'am', 'are', 'be'],                                          answer: 'are' },
  { id: 10, level: 'a1', question: 'There ___ a pen on my desk.',                                options: ['are', 'am', 'is', 'be'],                                          answer: 'is' },

  // ── A2 (10 questions) ──────────────────────────────────────
  { id: 11, level: 'a2', question: 'Yesterday I ___ to the cinema.',                             options: ['go', 'goes', 'went', 'gone'],                                     answer: 'went' },
  { id: 12, level: 'a2', question: 'She ___ play tennis. She\'s not good at it.',                options: ['can', 'can\'t', 'must', 'should'],                                 answer: 'can\'t' },
  { id: 13, level: 'a2', question: 'This is ___ book I\'ve ever read.',                          options: ['good', 'better', 'the best', 'most good'],                         answer: 'the best' },
  { id: 14, level: 'a2', question: 'I ___ going to visit my grandmother next week.',             options: ['am', 'is', 'are', 'be'],                                          answer: 'am' },
  { id: 15, level: 'a2', question: 'How ___ milk do we need?',                                   options: ['many', 'much', 'few', 'number of'],                                answer: 'much' },
  { id: 16, level: 'a2', question: 'We ___ dinner when the phone rang.',                         options: ['have', 'had', 'were having', 'are having'],                        answer: 'were having' },
  { id: 17, level: 'a2', question: 'Mount Everest is ___ mountain in the world.',                options: ['high', 'higher', 'the highest', 'most high'],                      answer: 'the highest' },
  { id: 18, level: 'a2', question: 'Please ___ so loudly. I\'m trying to work.',                 options: ['not talk', 'don\'t talk', 'no talking', 'not talking'],             answer: 'don\'t talk' },
  { id: 19, level: 'a2', question: 'I ___ my keys. Have you seen them?',                         options: ['lose', 'lost', 'have lost', 'am losing'],                          answer: 'have lost' },
  { id: 20, level: 'a2', question: 'She ___ her homework before dinner last night.',             options: ['finish', 'finishes', 'finished', 'is finishing'],                  answer: 'finished' },

  // ── B1 (10 questions) ──────────────────────────────────────
  { id: 21, level: 'b1', question: 'I ___ never ___ sushi before. It was delicious!',            options: ['have / eaten', 'had / eaten', 'was / eating', 'did / eat'],         answer: 'had / eaten' },
  { id: 22, level: 'b1', question: 'If it rains tomorrow, we ___ the match.',                    options: ['cancel', 'will cancel', 'would cancel', 'cancelled'],               answer: 'will cancel' },
  { id: 23, level: 'b1', question: 'I enjoy ___ to music while I work.',                         options: ['listen', 'to listen', 'listening', 'listened'],                    answer: 'listening' },
  { id: 24, level: 'b1', question: 'She ___ live in Paris, but now she lives in London.',        options: ['was used to', 'used to', 'is used to', 'use to'],                  answer: 'used to' },
  { id: 25, level: 'b1', question: 'The report ___ by the manager last Friday.',                 options: ['wrote', 'was written', 'has written', 'is writing'],               answer: 'was written' },
  { id: 26, level: 'b1', question: 'By the time we arrived, the film ___.',                      options: ['already started', 'has already started', 'had already started', 'already starts'], answer: 'had already started' },
  { id: 27, level: 'b1', question: 'You look tired. You ___ take a break.',                      options: ['must', 'should', 'will', 'can'],                                   answer: 'should' },
  { id: 28, level: 'b1', question: 'The man ___ called you is my uncle.',                        options: ['who', 'which', 'what', 'whom'],                                    answer: 'who' },
  { id: 29, level: 'b1', question: 'I\'d rather ___ at home than go out tonight.',               options: ['stay', 'to stay', 'staying', 'stayed'],                            answer: 'stay' },
  { id: 30, level: 'b1', question: 'She asked me where ___ from.',                               options: ['I came', 'did I come', 'I come', 'come I'],                        answer: 'I came' },

  // ── B2 (10 questions) ──────────────────────────────────────
  { id: 31, level: 'b2', question: 'If I ___ you, I would apologise immediately.',               options: ['am', 'was', 'were', 'had been'],                                   answer: 'were' },
  { id: 32, level: 'b2', question: 'She said she ___ the email the following day.',              options: ['will send', 'sends', 'would send', 'had sent'],                    answer: 'would send' },
  { id: 33, level: 'b2', question: 'If they ___ harder, they would have won.',                   options: ['trained', 'had trained', 'would train', 'were training'],           answer: 'had trained' },
  { id: 34, level: 'b2', question: 'He ___ have left already — his coat is gone.',               options: ['should', 'must', 'can', 'would'],                                  answer: 'must' },
  { id: 35, level: 'b2', question: 'I wish I ___ more time to finish the project.',              options: ['have', 'had', 'would have', 'will have'],                          answer: 'had' },
  { id: 36, level: 'b2', question: 'The new bridge ___ by the end of next year.',                options: ['will complete', 'will be completed', 'completes', 'is completing'], answer: 'will be completed' },
  { id: 37, level: 'b2', question: '___ having studied hard, she failed the exam.',              options: ['Despite', 'Although', 'However', 'Even'],                          answer: 'Despite' },
  { id: 38, level: 'b2', question: 'I had my car ___ at the garage yesterday.',                  options: ['service', 'to service', 'serviced', 'servicing'],                  answer: 'serviced' },
  { id: 39, level: 'b2', question: 'It ___ that the project will be delayed.',                   options: ['seems', 'is seemed', 'seeming', 'seemed'],                         answer: 'seems' },
  { id: 40, level: 'b2', question: 'No sooner ___ than it started to rain.',                     options: ['we left', 'had we left', 'we had left', 'did we leave'],           answer: 'had we left' },

  // ── C1 (10 questions) ──────────────────────────────────────
  { id: 41, level: 'c1', question: 'Not only ___ late, but he also forgot the documents.',       options: ['he arrived', 'arrived he', 'did he arrive', 'he did arrive'],       answer: 'did he arrive' },
  { id: 42, level: 'c1', question: '___ I known about the problem, I would have acted sooner.',  options: ['If', 'Had', 'Should', 'Were'],                                     answer: 'Had' },
  { id: 43, level: 'c1', question: 'It was the director ___ made the final decision.',           options: ['who', 'which', 'what', 'whom'],                                    answer: 'who' },
  { id: 44, level: 'c1', question: 'She managed to complete the task, ___ proved very difficult.', options: ['which', 'that', 'what', 'who'],                                  answer: 'which' },
  { id: 45, level: 'c1', question: 'The government\'s ___ of the policy led to widespread protests.', options: ['implement', 'implementing', 'implementation', 'implemented'], answer: 'implementation' },
  { id: 46, level: 'c1', question: 'Rarely ___ such a convincing performance.',                  options: ['I have seen', 'have I seen', 'I saw', 'did I see'],                 answer: 'have I seen' },
  { id: 47, level: 'c1', question: '___ to arrive on time, please call ahead.',                  options: ['Unable', 'Should you be unable', 'If unable', 'Being unable'],      answer: 'Should you be unable' },
  { id: 48, level: 'c1', question: 'The results were ___ surprising that we repeated the experiment.', options: ['such', 'so', 'very', 'too'],                                 answer: 'so' },
  { id: 49, level: 'c1', question: 'He spoke for two hours, ___ which time most people had fallen asleep.', options: ['during', 'while', 'for', 'by'],                         answer: 'during' },
  { id: 50, level: 'c1', question: 'The findings ___ to suggest a link between sleep and memory.', options: ['appear', 'are appeared', 'have appeared', 'appearing'],          answer: 'appear' },

  // ── C2 (10 questions) ──────────────────────────────────────
  { id: 51, level: 'c2', question: 'The committee recommended that he ___ given a second chance.', options: ['is', 'was', 'be', 'were'],                                       answer: 'be' },
  { id: 52, level: 'c2', question: 'Hardly ___ sat down when the alarm went off.',               options: ['I had', 'had I', 'I have', 'have I'],                              answer: 'had I' },
  { id: 53, level: 'c2', question: 'The article argued that the findings, ___ were peer-reviewed, supported the hypothesis.', options: ['who', 'which', 'that', 'whose'],       answer: 'which' },
  { id: 54, level: 'c2', question: 'She spoke with such ___ that everyone believed her.',        options: ['convince', 'convincing', 'conviction', 'convinced'],               answer: 'conviction' },
  { id: 55, level: 'c2', question: 'The success of the project was ___ to the team\'s dedication.', options: ['attributed', 'attribute', 'attributing', 'attribution'],       answer: 'attributed' },
  { id: 56, level: 'c2', question: 'It is essential that every delegate ___ the opening ceremony.', options: ['attends', 'attended', 'attend', 'will attend'],                 answer: 'attend' },
  { id: 57, level: 'c2', question: 'The more pressure he was under, ___ his performance became.', options: ['the worse', 'worse', 'the more worse', 'most worse'],             answer: 'the worse' },
  { id: 58, level: 'c2', question: 'What ___ a simple disagreement soon escalated into a crisis.', options: ['began as', 'began like', 'started as being', 'was begun as'],    answer: 'began as' },
  { id: 59, level: 'c2', question: 'The policy was introduced ___ reduce carbon emissions.',     options: ['so as to', 'so that to', 'in order that', 'for'],                  answer: 'so as to' },
  { id: 60, level: 'c2', question: '___ the circumstances, the decision was understandable.',    options: ['Given', 'Giving', 'Having given', 'Being given'],                  answer: 'Given' },
]

const LEVEL_ORDER = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const
type Level = typeof LEVEL_ORDER[number]

const LEVEL_INFO: Record<Level, { label: string; title: string; emoji: string; color: string; gradient: string; desc: string }> = {
  a1: { label: 'A1', title: 'Starter',           emoji: '🌱', color: '#16a34a', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)', desc: 'You\'re just starting out. Begin with the basics — to be, articles, and simple present.' },
  a2: { label: 'A2', title: 'Elementary',         emoji: '🌿', color: '#0891b2', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', desc: 'You know the basics. Now build on them — past tense, modal verbs, and comparatives.' },
  b1: { label: 'B1', title: 'Pre-Intermediate',   emoji: '📗', color: '#2D6BE4', gradient: 'linear-gradient(135deg, #2D6BE4, #4f8ef7)', desc: 'You\'re developing well. Focus on present perfect, conditionals, and reported speech.' },
  b2: { label: 'B2', title: 'Intermediate',       emoji: '📘', color: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED, #9f67f5)', desc: 'You\'re a confident user. Work on passive voice, modal perfects, and complex sentences.' },
  c1: { label: 'C1', title: 'Upper-Intermediate', emoji: '🔥', color: '#d97706', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)', desc: 'You\'re advanced. Refine inversion, cleft sentences, and formal written structures.' },
  c2: { label: 'C2', title: 'Advanced',           emoji: '🏆', color: '#E85D26', gradient: 'linear-gradient(135deg, #E85D26, #f97316)', desc: 'Near-native level. Challenge yourself with subjunctive, complex aspect, and discourse.' },
}

function pickRandom(bank: Question[]): Question[] {
  const byLevel: Record<string, Question[]> = {}
  LEVEL_ORDER.forEach(l => { byLevel[l] = [] })
  bank.forEach(q => byLevel[q.level].push(q))
  return LEVEL_ORDER.flatMap(l =>
    [...byLevel[l]].sort(() => Math.random() - 0.5).slice(0, 5)
  )
}

function getResult(questions: Question[], answers: Record<number, string>) {
  const scoreByLevel: Record<string, { correct: number; total: number }> = {}
  LEVEL_ORDER.forEach(l => { scoreByLevel[l] = { correct: 0, total: 5 } })
  questions.forEach(q => {
    if ((answers[q.id] ?? '').toLowerCase() === q.answer.toLowerCase()) {
      scoreByLevel[q.level].correct++
    }
  })
  let recommendedLevel: Level = 'a1'
  for (const level of LEVEL_ORDER) {
    if (scoreByLevel[level].correct >= 3) recommendedLevel = level
  }
  const totalCorrect = Object.values(scoreByLevel).reduce((s, v) => s + v.correct, 0)
  return { scoreByLevel, recommendedLevel, totalCorrect }
}

export default function PlacementTestPage() {
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [testKey, setTestKey] = useState(0)

  // Pick a new random set whenever testKey changes (on start / retake)
  const questions = useMemo(() => pickRandom(QUESTION_BANK), [testKey])

  const q = questions[current]
  const progress = (current / questions.length) * 100

  function handleSelect(opt: string) {
    if (selected) return
    setSelected(opt)
  }

  function handleNext() {
    if (!selected) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  function handleRetake() {
    setTestKey(k => k + 1)
    setStarted(false)
    setCurrent(0)
    setAnswers({})
    setSelected(null)
    setFinished(false)
  }

  // ── INTRO SCREEN ────────────────────────────────────────────
  if (!started) {
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #2D6BE4 100%)', padding: '70px 24px', textAlign: 'center', color: 'white' }}>
          <Link href="/esl-resources/grammar" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
            ← Back to Grammar
          </Link>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎯</div>
          <h1 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 14px', letterSpacing: '-1px' }}>Grammar Placement Test</h1>
          <p style={{ fontSize: '17px', opacity: 0.9, maxWidth: '500px', margin: '0 auto 10px' }}>
            Find your level in 30 questions — from A1 beginner to C2 advanced
          </p>
          <p style={{ fontSize: '14px', opacity: 0.7, margin: '0 auto', maxWidth: '420px' }}>Takes about 5–10 minutes · No sign-in required · Different questions every time</p>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 20px' }}>How it works</h2>
            {[
              { icon: '📝', text: '30 multiple-choice questions, 5 from each of the six CEFR levels' },
              { icon: '🔀', text: 'Questions are randomly selected from a larger bank — different every time you retake' },
              { icon: '📈', text: 'They get harder as you go — A1 through to C2' },
              { icon: '⚡', text: 'Answer every question, even if you\'re not sure — just make your best guess' },
              { icon: '🎯', text: 'At the end you\'ll see your level and exactly where to start' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '28px' }}>
            {LEVEL_ORDER.map(l => {
              const info = LEVEL_INFO[l]
              return (
                <div key={l} style={{ background: 'white', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #eee' }}>
                  <span style={{ fontSize: '20px' }}>{info.emoji}</span>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: info.color, margin: '4px 0 0' }}>{info.label}</p>
                  <p style={{ fontSize: '11px', color: '#888', margin: '2px 0 0' }}>{info.title}</p>
                </div>
              )
            })}
          </div>

          <button onClick={() => setStarted(true)}
            style={{ width: '100%', background: 'linear-gradient(135deg, #059669, #2D6BE4)', color: 'white', border: 'none', cursor: 'pointer', padding: '16px', borderRadius: '14px', fontSize: '17px', fontWeight: 'bold' }}>
            Start the test →
          </button>
        </div>
      </main>
    )
  }

  // ── RESULTS SCREEN ──────────────────────────────────────────
  if (finished) {
    const { scoreByLevel, recommendedLevel, totalCorrect } = getResult(questions, answers)
    const rec = LEVEL_INFO[recommendedLevel]
    return (
      <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ background: rec.gradient, padding: '56px 24px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>{rec.emoji}</div>
          <p style={{ fontSize: '13px', opacity: 0.8, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Your result</p>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', margin: '0 0 8px', letterSpacing: '-1px' }}>{rec.label} — {rec.title}</h1>
          <p style={{ fontSize: '16px', opacity: 0.85, maxWidth: '480px', margin: '0 auto' }}>{rec.desc}</p>
        </div>

        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>

          {/* SCORE BREAKDOWN */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px 32px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Score breakdown</h2>
              <span style={{ fontSize: '14px', color: '#888' }}>{totalCorrect} / 30 correct</span>
            </div>
            {LEVEL_ORDER.map(level => {
              const { correct, total } = scoreByLevel[level]
              const info = LEVEL_INFO[level]
              const pct = (correct / total) * 100
              const isRec = level === recommendedLevel
              return (
                <div key={level} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: info.color }}>{info.label}</span>
                      <span style={{ fontSize: '13px', color: '#888' }}>{info.title}</span>
                      {isRec && <span style={{ fontSize: '11px', fontWeight: 'bold', background: info.color, color: 'white', padding: '2px 8px', borderRadius: '10px' }}>Your level</span>}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: correct >= 3 ? '#16a34a' : '#aaa' }}>{correct}/{total}</span>
                  </div>
                  <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '8px' }}>
                    <div style={{ background: correct >= 3 ? info.color : '#d1d5db', height: '8px', borderRadius: '4px', width: `${pct}%`, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div style={{ background: '#1a1a2e', borderRadius: '20px', padding: '28px 32px', textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>Ready to start {rec.label}?</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: '0 0 20px', lineHeight: '1.6' }}>
              Go to your level and work through the topics in order — each one builds on the last.
            </p>
            <Link href={`/esl-resources/grammar/${recommendedLevel}`} style={{ textDecoration: 'none' }}>
              <span style={{ background: rec.gradient, color: 'white', padding: '13px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', display: 'inline-block' }}>
                Start {rec.label} {rec.title} →
              </span>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleRetake}
              style={{ flex: 1, background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 'bold', color: '#555', cursor: 'pointer' }}>
              Retake with new questions
            </button>
            <Link href="/esl-resources/grammar" style={{ flex: 1, textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 'bold', color: '#555', textAlign: 'center' }}>
                Browse all levels
              </div>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── QUESTION SCREEN ─────────────────────────────────────────
  const levelInfo = LEVEL_INFO[q.level]
  const isCorrect = selected === q.answer

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* TOP BAR */}
      <div style={{ background: '#1a1a2e', padding: '16px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Question {current + 1} of {questions.length}</span>
            <span style={{ background: levelInfo.color, color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '10px' }}>
              {levelInfo.label} {levelInfo.title}
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '4px', height: '6px' }}>
            <div style={{ background: 'white', height: '6px', borderRadius: '4px', width: `${progress}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <p style={{ fontSize: '19px', color: '#1a1a2e', lineHeight: '1.7', margin: '0 0 28px', fontWeight: '500' }}>
            {q.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt, i) => {
              let bg = '#f9fafb', border = '#e5e7eb', color = '#333'
              if (selected) {
                if (opt === q.answer) { bg = '#f0fdf4'; border = '#86efac'; color = '#166534' }
                else if (opt === selected && opt !== q.answer) { bg = '#fef2f2'; border = '#fca5a5'; color = '#991b1b' }
                else { bg = '#f9fafb'; border = '#e5e7eb'; color = '#bbb' }
              }
              return (
                <button key={i} onClick={() => handleSelect(opt)} disabled={!!selected}
                  style={{ background: bg, border: `2px solid ${border}`, borderRadius: '12px', padding: '14px 18px', textAlign: 'left', cursor: selected ? 'default' : 'pointer', fontSize: '15px', color, fontWeight: opt === selected ? 'bold' : 'normal', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', border: `2px solid ${selected ? (opt === q.answer ? '#86efac' : opt === selected ? '#fca5a5' : '#e5e7eb') : '#ddd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0, color }}>
                    {selected && opt === q.answer ? '✓' : selected && opt === selected && opt !== q.answer ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {selected && (
            <div style={{ marginTop: '20px', background: isCorrect ? '#f0fdf4' : '#fef2f2', border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}`, borderRadius: '12px', padding: '14px 16px' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: isCorrect ? '#166534' : '#991b1b', margin: 0 }}>
                {isCorrect ? '✓ Correct!' : `✗ The answer is: ${q.answer}`}
              </p>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleNext} disabled={!selected}
              style={{ background: selected ? 'linear-gradient(135deg, #059669, #2D6BE4)' : '#e5e7eb', color: selected ? 'white' : '#aaa', border: 'none', cursor: selected ? 'pointer' : 'default', padding: '13px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', transition: 'all 0.2s' }}>
              {current + 1 >= questions.length ? 'See my result →' : 'Next question →'}
            </button>
          </div>
        </div>

        {/* LEVEL MARKERS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '0 4px' }}>
          {LEVEL_ORDER.map((l, i) => {
            const startQ = i * 5
            const active = current >= startQ && current < startQ + 5
            const done = current >= startQ + 5
            const info = LEVEL_INFO[l]
            return (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: done ? info.color : active ? info.color : '#ddd', margin: '0 auto 4px', opacity: active ? 1 : done ? 0.5 : 0.25 }} />
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: active ? info.color : '#bbb' }}>{info.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
