'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const TOPIC = 'Environment & Development'
const ESSAY_TYPE = 'Problem-Solution Essay'
const TASK = 'Many cities around the world are facing serious problems caused by rapid urbanisation. What problems does this cause and what solutions can you suggest?'

const ESSAY_TYPE_GUIDE = {
  what: 'A problem-solution essay asks you to identify specific problems and then propose realistic solutions. Each solution should directly address a problem you identified. This essay type does not require you to give an opinion — your job is to analyse and propose.',
  structure: [
    { label: 'Introduction (2–3 sentences)', desc: 'Paraphrase the statement. State that there are significant problems and that solutions exist. Do not list them yet.' },
    { label: 'Body Paragraph 1 — Problems (5–6 sentences)', desc: 'Identify 2 specific problems caused by urbanisation. Explain each clearly with causes and consequences. Use specific examples.' },
    { label: 'Body Paragraph 2 — Solutions (5–6 sentences)', desc: 'Propose a realistic solution for each problem you identified. Explain how each solution works and why it would be effective.' },
    { label: 'Conclusion (2–3 sentences)', desc: 'Summarise the main problems and solutions. Optional: forward-looking statement about the importance of addressing this issue.' },
  ],
  tips: [
    'Match your solutions to your problems — each solution should address a specific problem you raised',
    'Be specific — "the government should do more" is too vague. Say exactly what they should do and how',
    'Use cautious language for solutions: "could", "might", "one approach would be to"',
    'Avoid giving your personal opinion — this essay type is analytical, not argumentative',
    'Aim for 270–290 words — under 250 loses marks automatically',
  ]
}

const USEFUL_LANGUAGE = [
  {
    category: 'Identifying Problems',
    phrases: [
      'One of the most pressing issues is...',
      'A significant problem associated with this is...',
      'This has resulted in a dramatic increase in...',
      'The consequences of this include...',
    ]
  },
  {
    category: 'Proposing Solutions',
    phrases: [
      'One effective solution would be to...',
      'A practical approach to this problem is...',
      'Governments could address this by...',
      'This issue could be tackled through...',
    ]
  },
  {
    category: 'Explaining Impact',
    phrases: [
      'This would help to alleviate the problem of...',
      'As a result, this would significantly reduce...',
      'This approach has proven effective in cities such as...',
      'If implemented, this could lead to...',
    ]
  },
  {
    category: 'Cause & Effect',
    phrases: [
      'This is largely due to the fact that...',
      'As a direct consequence of...',
      'This has led to a situation where...',
      'The root cause of this problem is...',
    ]
  },
  {
    category: 'Concluding',
    phrases: [
      'In conclusion, while urbanisation presents serious challenges...',
      'To summarise, the problems outlined above require...',
      'Addressing these issues will require coordinated action from...',
      'Only by tackling these problems directly can cities...',
    ]
  },
]

const PLAN_PROMPTS = {
  intro: 'Briefly introduce the topic — what is urbanisation causing? One or two sentences.',
  problem1: 'Your first problem caused by rapid urbanisation — be specific.',
  problem1Detail: 'Consequence or example to support Problem 1.',
  problem2: 'Your second problem — be specific.',
  problem2Detail: 'Consequence or example to support Problem 2.',
  solution1: 'Your solution to Problem 1 — be specific about what, who, and how.',
  solution2: 'Your solution to Problem 2 — be specific about what, who, and how.',
  conclusion: 'Summarise the two problems and two solutions in 1–2 sentences.',
}

type Criteria = { band: number; feedback: string }
type Feedback = {
  overallBand: number
  criteria: {
    taskAchievement: Criteria
    coherenceCohesion: Criteria
    lexicalResource: Criteria
    grammaticalRange: Criteria
  }
  paragraphFeedback: {
    introduction: string
    body1: string
    body2: string
    conclusion: string
  }
  vocabularyUpgrades: { original: string; upgrade: string; example: string }[]
  keyImprovement: string
  modelEssayBand6: string
  modelEssayBand7: string
}

export default function WritingLesson3Page() {
  const [stage, setStage] = useState<'intro' | 'plan' | 'write' | 'feedback'>('intro')
  const [plan, setPlan] = useState({ intro: '', problem1: '', problem1Detail: '', problem2: '', problem2Detail: '', solution1: '', solution2: '', conclusion: '' })
  const [essay, setEssay] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [modelView, setModelView] = useState<'6' | '7'>('7')
  const [activeLanguageTab, setActiveLanguageTab] = useState(0)
  const [showTeacherMode, setShowTeacherMode] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [rewrittenIntro, setRewrittenIntro] = useState<string | null>(null)
  const [rewrittenConclusion, setRewrittenConclusion] = useState<string | null>(null)
  const [loadingRewrite, setLoadingRewrite] = useState<'intro' | 'conclusion' | null>(null)
  const [showParagraphFeedback, setShowParagraphFeedback] = useState(false)
  const [timer, setTimer] = useState(40 * 60)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) setHasAccess(true)
  }, [])

  useEffect(() => {
    setWordCount(essay.trim() ? essay.trim().split(/\s+/).length : 0)
  }, [essay])

  useEffect(() => {
    if (!timerRunning) return
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); setTimerRunning(false); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerRunning])

  function formatTimer(s: number) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  }

  function buildEssayFromPlan() {
    const intro = plan.intro
    const b1 = `${plan.problem1} ${plan.problem1Detail} Furthermore, ${plan.problem2} ${plan.problem2Detail}`
    const b2 = `${plan.solution1} ${plan.solution2}`
    const conc = plan.conclusion
    setEssay([intro, b1, b2, conc].filter(Boolean).join('\n\n'))
    setStage('write')
  }

  async function getFeedback() {
    if (!essay.trim() || wordCount < 200) return
    setLoadingFeedback(true)
    try {
      const res = await fetch('/api/ielts/writing-feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay, task: TASK, essayType: ESSAY_TYPE })
      })
      const data: Feedback = await res.json()
      setFeedback(data)
      setStage('feedback')
    } catch (e) { console.error(e) }
    setLoadingFeedback(false)
  }

  async function rewrite(mode: 'intro' | 'conclusion') {
    setLoadingRewrite(mode)
    try {
      const res = await fetch('/api/ielts/writing-feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay, task: TASK, essayType: ESSAY_TYPE, mode: `rewrite_${mode}` })
      })
      const data = await res.json()
      if (mode === 'intro') setRewrittenIntro(data.rewritten || '')
      else setRewrittenConclusion(data.rewritten || '')
    } catch (e) { console.error(e) }
    setLoadingRewrite(null)
  }

  function getBandColor(b: number) {
    if (b >= 8) return '#7c3aed'; if (b >= 7) return '#2563eb'
    if (b >= 6) return '#059669'; if (b >= 5) return '#d97706'; return '#dc2626'
  }

  const planComplete = Object.values(plan).filter(v => v.trim()).length >= 5

  // INTRO STAGE
  if (stage === 'intro') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/ielts/writing" style={{ color: '#059669', fontSize: '13px', textDecoration: 'none' }}>← Writing Topics</Link>

        <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', borderRadius: '16px', padding: '32px', margin: '20px 0', color: 'white' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 'bold' }}>✍️ Writing Task 2</span>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 'bold' }}>Problem-Solution Essay</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px' }}>{TOPIC}</h1>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', opacity: 0.8, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>The Task</p>
            <p style={{ fontSize: '15px', margin: 0, lineHeight: 1.6 }}>{TASK}</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>Understanding the Problem-Solution Essay</h2>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: 1.6 }}>{ESSAY_TYPE_GUIDE.what}</p>

          {/* Key difference */}
          <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #fde68a' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>⚠️ Common Mistake</p>
            <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>Students often write vague solutions like "the government should raise awareness" or "people need to change their behaviour." These score poorly. Your solutions must be specific, practical, and directly linked to a problem you identified.</p>
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>📐 Essay Structure</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {ESSAY_TYPE_GUIDE.structure.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#064e3b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 2px' }}>{s.label}</p>
                  <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '10px' }}>💡 Key Tips</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ESSAY_TYPE_GUIDE.tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#374151' }}>
                <span style={{ color: '#059669', fontWeight: 'bold', flexShrink: 0 }}>✓</span>{tip}
              </div>
            ))}
          </div>
        </div>

        {/* Band Score Criteria */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📊 How Your Essay is Scored</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Task Achievement', color: '#2563eb', desc: 'Did you identify clear problems AND propose specific solutions? Are they logically connected?' },
              { label: 'Coherence & Cohesion', color: '#059669', desc: 'Does your essay flow logically from problems to solutions? Are paragraphs well-organised?' },
              { label: 'Lexical Resource', color: '#7c3aed', desc: 'Do you use specific vocabulary related to urbanisation, environment, and policy?' },
              { label: 'Grammatical Range', color: '#d97706', desc: 'Variety of sentence structures. Good use of conditionals and modal verbs for solutions.' },
            ].map(c => (
              <div key={c.label} style={{ borderLeft: `3px solid ${c.color}`, paddingLeft: '12px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: c.color, margin: '0 0 4px' }}>{c.label}</p>
                <p style={{ fontSize: '12px', color: '#555', margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', margin: '0 0 8px', fontWeight: 'bold' }}>What you get after writing:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {['🎯 Overall band score','📊 Score on all 4 criteria','📝 Paragraph-by-paragraph feedback','📈 Key improvement tip','💬 Vocabulary upgrades','📚 Band 6 & 7–8 model essays','✍️ AI rewrite of your intro & conclusion','⏱️ 40-minute exam timer'].map(item => (
              <div key={item} style={{ fontSize: '13px', color: '#1e40af' }}>{item}</div>
            ))}
          </div>
        </div>

        <button onClick={() => setStage('plan')} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #064e3b, #059669)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          Start — Plan My Essay →
        </button>
      </div>
    </main>
  )

  // PLAN STAGE
  if (stage === 'plan') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <button onClick={() => setStage('intro')} style={{ color: '#059669', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '20px' }}>← Back</button>

        <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>The Task</p>
          <p style={{ fontSize: '14px', color: '#065f46', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>"{TASK}"</p>
        </div>

        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
            <strong>Planning tip:</strong> Identify 2 specific problems first, then think of a realistic solution for each one. Your Body 1 covers both problems, Body 2 covers both solutions. Make sure each solution directly addresses the problem it is paired with.
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>🗂️ Essay Planner</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Plan your problems and solutions before writing. Specific plans lead to specific, higher-scoring essays.</p>

          {Object.entries(PLAN_PROMPTS).map(([key, prompt]) => (
            <div key={key} style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
                {key === 'intro' ? '📌 Introduction' :
                  key === 'problem1' ? '⚠️ Problem 1' :
                  key === 'problem1Detail' ? '📖 Problem 1 — Evidence or Example' :
                  key === 'problem2' ? '⚠️ Problem 2' :
                  key === 'problem2Detail' ? '📖 Problem 2 — Evidence or Example' :
                  key === 'solution1' ? '✅ Solution to Problem 1' :
                  key === 'solution2' ? '✅ Solution to Problem 2' :
                  '🔚 Conclusion'}
              </label>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px' }}>{prompt}</p>
              <textarea
                value={plan[key as keyof typeof plan]}
                onChange={e => setPlan({ ...plan, [key]: e.target.value })}
                rows={2}
                placeholder={
                  key === 'intro' ? 'e.g. Rapid urbanisation is creating significant challenges for cities worldwide, including issues of infrastructure and environmental degradation.' :
                  key === 'problem1' ? 'e.g. Overcrowding puts enormous strain on public transport and road infrastructure, leading to chronic traffic congestion.' :
                  key === 'problem1Detail' ? 'e.g. In Bangkok, for example, commuters spend an average of 60 hours per year stuck in traffic, reducing productivity and quality of life.' :
                  key === 'problem2' ? 'e.g. Rapid construction to accommodate growing populations destroys green spaces and increases air and water pollution.' :
                  key === 'problem2Detail' ? 'e.g. Cities like Jakarta have seen severe flooding worsen as natural drainage areas are replaced by concrete developments.' :
                  key === 'solution1' ? 'e.g. Governments could invest in integrated public transport networks — including metros, buses, and cycling lanes — to reduce car dependency and ease congestion.' :
                  key === 'solution2' ? 'e.g. Urban planners could implement strict green space regulations requiring developers to maintain a minimum ratio of parks and trees per square kilometre of new development.' :
                  'e.g. In conclusion, urbanisation presents real challenges, but targeted investment in infrastructure and environmental planning can significantly reduce these impacts.'
                }
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px', lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', color: '#1a1a2e' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setStage('write')} style={{ flex: 1, padding: '14px', background: '#f1f5f9', color: '#555', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Skip Plan — Write Directly
          </button>
          <button onClick={buildEssayFromPlan} disabled={!planComplete} style={{ flex: 2, padding: '14px', background: planComplete ? 'linear-gradient(135deg, #064e3b, #059669)' : '#94a3b8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: planComplete ? 'pointer' : 'not-allowed' }}>
            Use My Plan & Start Writing →
          </button>
        </div>
      </div>
    </main>
  )

  // WRITE STAGE
  if (stage === 'write') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <button onClick={() => setStage('plan')} style={{ color: '#059669', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Back to Plan</button>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {hasAccess && <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#064e3b' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>👨‍🏫 Teacher Mode</button>}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: timerRunning ? '#fee2e2' : '#f1f5f9', borderRadius: '8px', padding: '6px 12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: timerRunning ? '#ef4444' : '#555', fontFamily: 'monospace' }}>⏱️ {formatTimer(timer)}</span>
                <button onClick={() => setTimerRunning(!timerRunning)} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#555' }}>{timerRunning ? 'Pause' : 'Start'}</button>
                <button onClick={() => { setTimer(40 * 60); setTimerRunning(false) }} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#555' }}>Reset</button>
              </div>
            </div>
          </div>

          {showTeacherMode && (
            <div style={{ background: '#064e3b', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode</h3>
              <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 5 min planning, 30 min writing, 5 min checking.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Before writing:</strong> Brainstorm as a class — what problems do students see in Thai cities? Bangkok, Chiang Mai, Pattaya all offer relevant examples.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Common mistake:</strong> Remind students to match solutions to problems. If Problem 1 is traffic, Solution 1 must address traffic — not pollution.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Vocabulary focus:</strong> Urbanisation has rich academic vocabulary — infrastructure, congestion, pollution, sustainability, development. Encourage use of these.</p>
                <p style={{ margin: 0 }}><strong>Extension:</strong> After feedback, ask students to evaluate each other's solutions — are they realistic? Specific enough? This develops critical thinking.</p>
              </div>
            </div>
          )}

          <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Task — Write at least 250 words</p>
            <p style={{ fontSize: '14px', color: '#065f46', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>"{TASK}"</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e' }}>Your Essay</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: wordCount >= 250 ? '#059669' : wordCount >= 200 ? '#d97706' : '#ef4444' }}>
              {wordCount} words {wordCount >= 250 ? '✓' : wordCount >= 200 ? '— almost there' : '— minimum 250'}
            </span>
          </div>

          <textarea value={essay} onChange={e => setEssay(e.target.value)} placeholder="Write your essay here. Start with your introduction — paraphrase the question and mention that there are both problems and solutions to discuss..." rows={20} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', lineHeight: 1.8, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Georgia, serif', outline: 'none', color: '#1a1a2e' }} />

          <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '6px', margin: '10px 0' }}>
            <div style={{ background: wordCount >= 250 ? '#059669' : wordCount >= 200 ? '#d97706' : '#ef4444', height: '100%', borderRadius: '4px', width: `${Math.min((wordCount / 300) * 100, 100)}%`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '16px' }}>
            <span>0</span><span>150</span><span style={{ color: wordCount >= 250 ? '#059669' : '#94a3b8', fontWeight: 'bold' }}>250 min</span><span>300 target</span>
          </div>

          <button onClick={getFeedback} disabled={loadingFeedback || wordCount < 200} style={{ width: '100%', padding: '14px', background: loadingFeedback || wordCount < 200 ? '#94a3b8' : 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: loadingFeedback || wordCount < 200 ? 'not-allowed' : 'pointer' }}>
            {loadingFeedback ? '⏳ Analysing your essay...' : '🤖 Get AI Feedback & Band Score'}
          </button>
          {wordCount < 200 && wordCount > 0 && <p style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center', marginTop: '8px' }}>Write at least 200 words before submitting</p>}
        </div>

        {/* Right Panel */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px' }}>📚 Useful Language</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
              {USEFUL_LANGUAGE.map((cat, i) => (
                <button key={i} onClick={() => setActiveLanguageTab(i)} style={{ padding: '4px 10px', borderRadius: '20px', border: 'none', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: activeLanguageTab === i ? '#064e3b' : '#f1f5f9', color: activeLanguageTab === i ? 'white' : '#555' }}>
                  {cat.category.split(' ')[0]}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', margin: '0 0 8px' }}>{USEFUL_LANGUAGE[activeLanguageTab].category}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {USEFUL_LANGUAGE[activeLanguageTab].phrases.map((phrase, i) => (
                <div key={i} style={{ background: '#f0fdf4', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#065f46', border: '1px solid #a7f3d0', cursor: 'pointer' }}
                  onClick={() => setEssay(prev => prev + (prev ? ' ' : '') + phrase)}>
                  {phrase} <span style={{ color: '#059669', fontSize: '10px' }}>+ add</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px', marginBottom: 0 }}>Click any phrase to add it to your essay</p>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginTop: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 10px' }}>📐 Structure Reminder</p>
            {[
              { label: 'Intro', hint: 'Paraphrase the task' },
              { label: 'Body 1', hint: 'Problem 1 + Problem 2' },
              { label: 'Body 2', hint: 'Solution 1 + Solution 2' },
              { label: 'Conclusion', hint: 'Summarise both' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                <span style={{ background: '#064e3b', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 7px', borderRadius: '4px', flexShrink: 0 }}>{s.label}</span>
                <span style={{ fontSize: '12px', color: '#555' }}>{s.hint}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '12px 14px', marginTop: '12px', border: '1px solid #fde68a' }}>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#92400e', margin: '0 0 4px' }}>⚠️ Key Reminder</p>
            <p style={{ fontSize: '11px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>Match solutions to problems. Solution 1 addresses Problem 1. Solution 2 addresses Problem 2. Be specific.</p>
          </div>
        </div>
      </div>
    </main>
  )

  // FEEDBACK STAGE
  if (stage === 'feedback' && feedback) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={() => setStage('write')} style={{ color: '#059669', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Edit My Essay</button>
          <button onClick={() => { setEssay(''); setFeedback(null); setStage('intro'); setRewrittenIntro(null); setRewrittenConclusion(null) }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#555', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>🔄 Start Again</button>
        </div>

        {/* Overall Band Score */}
        <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '30px', fontWeight: 'bold', lineHeight: 1 }}>{feedback.overallBand}</div>
              <div style={{ fontSize: '10px', opacity: 0.85 }}>Band</div>
            </div>
            <div>
              <p style={{ fontSize: '12px', opacity: 0.7, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Estimated Band Score</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px' }}>{TOPIC} — Problem-Solution Essay</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Task', band: feedback.criteria.taskAchievement.band },
                  { label: 'Coherence', band: feedback.criteria.coherenceCohesion.band },
                  { label: 'Vocabulary', band: feedback.criteria.lexicalResource.band },
                  { label: 'Grammar', band: feedback.criteria.grammaticalRange.band },
                ].map(c => (
                  <div key={c.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{c.band}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Improvement */}
        <div style={{ background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>⭐ Most Important Improvement</p>
          <p style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: 1.6 }}>{feedback.keyImprovement}</p>
        </div>

        {/* Criteria Breakdown */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>📊 Criteria Breakdown</h2>
          {[
            { label: 'Task Achievement', color: '#2563eb', data: feedback.criteria.taskAchievement },
            { label: 'Coherence & Cohesion', color: '#059669', data: feedback.criteria.coherenceCohesion },
            { label: 'Lexical Resource', color: '#7c3aed', data: feedback.criteria.lexicalResource },
            { label: 'Grammatical Range & Accuracy', color: '#d97706', data: feedback.criteria.grammaticalRange },
          ].map(c => (
            <div key={c.label} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: c.color, margin: 0 }}>{c.label}</p>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: getBandColor(c.data.band), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>{c.data.band}</div>
              </div>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7 }}>{c.data.feedback}</p>
            </div>
          ))}
        </div>

        {/* Paragraph Feedback */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <button onClick={() => setShowParagraphFeedback(!showParagraphFeedback)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>📝 Paragraph-by-Paragraph Feedback</h2>
            <span style={{ fontSize: '20px', color: '#059669' }}>{showParagraphFeedback ? '−' : '+'}</span>
          </button>
          {showParagraphFeedback && (
            <div style={{ marginTop: '20px' }}>
              {[
                { label: 'Introduction', key: 'introduction', color: '#2563eb' },
                { label: 'Body Paragraph 1 (Problems)', key: 'body1', color: '#dc2626' },
                { label: 'Body Paragraph 2 (Solutions)', key: 'body2', color: '#059669' },
                { label: 'Conclusion', key: 'conclusion', color: '#d97706' },
              ].map(p => (
                <div key={p.key} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: p.color, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>{p.label}</p>
                  <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.7 }}>{feedback.paragraphFeedback[p.key as keyof typeof feedback.paragraphFeedback]}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vocabulary Upgrades */}
        {feedback.vocabularyUpgrades?.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>💬 Vocabulary Upgrades</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {feedback.vocabularyUpgrades.map((v, i) => (
                <div key={i} style={{ background: '#faf5ff', borderRadius: '8px', padding: '12px 14px', border: '1px solid #e9d5ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{v.original}</span>
                    <span style={{ color: '#94a3b8' }}>→</span>
                    <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{v.upgrade}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6d28d9', margin: 0, fontStyle: 'italic' }}>e.g. "{v.example}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Model Essays */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>📚 Model Essays — See the Difference</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button onClick={() => setModelView('6')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', background: modelView === '6' ? '#d97706' : '#e2e8f0', color: modelView === '6' ? 'white' : '#555' }}>Band 6 Essay</button>
            <button onClick={() => setModelView('7')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', background: modelView === '7' ? '#059669' : '#e2e8f0', color: modelView === '7' ? 'white' : '#555' }}>Band 7–8 Essay</button>
          </div>
          {modelView === '6' && (
            <div>
              <p style={{ fontSize: '12px', color: '#854d0e', margin: '0 0 10px', fontWeight: '600' }}>Problems and solutions identified but vaguely developed, limited vocabulary range, basic grammar.</p>
              <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '16px', border: '1px solid #fde68a' }}>
                <p style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: 1.9, fontFamily: 'Georgia, serif', whiteSpace: 'pre-line' }}>{feedback.modelEssayBand6}</p>
              </div>
            </div>
          )}
          {modelView === '7' && (
            <div>
              <p style={{ fontSize: '12px', color: '#166534', margin: '0 0 10px', fontWeight: '600' }}>Specific problems with evidence, practical solutions directly linked, varied vocabulary and grammar, logical structure.</p>
              <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 1.9, fontFamily: 'Georgia, serif', whiteSpace: 'pre-line' }}>{feedback.modelEssayBand7}</p>
              </div>
            </div>
          )}
        </div>

        {/* Rewrite Intro & Conclusion */}
        <div style={{ background: '#fefce8', borderRadius: '16px', padding: '28px', border: '1px solid #fef08a', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#854d0e', marginBottom: '6px' }}>✍️ Rewrite My Introduction & Conclusion</h2>
          <p style={{ fontSize: '13px', color: '#713f12', marginBottom: '20px', lineHeight: 1.5 }}>See how AI rewrites your introduction and conclusion at Band 7–8 using your ideas.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { key: 'intro' as const, label: 'Introduction', rewritten: rewrittenIntro },
              { key: 'conclusion' as const, label: 'Conclusion', rewritten: rewrittenConclusion },
            ].map(item => (
              <div key={item.key}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', margin: '0 0 8px' }}>📝 {item.label}</p>
                {!item.rewritten ? (
                  <button onClick={() => rewrite(item.key)} disabled={loadingRewrite === item.key} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: loadingRewrite === item.key ? '#94a3b8' : '#ca8a04', color: 'white', fontSize: '13px', fontWeight: 'bold', cursor: loadingRewrite === item.key ? 'not-allowed' : 'pointer' }}>
                    {loadingRewrite === item.key ? '⏳ Rewriting...' : `✍️ Rewrite ${item.label}`}
                  </button>
                ) : (
                  <div>
                    <div style={{ background: 'white', borderRadius: '8px', padding: '12px', border: '1px solid #fef08a', marginBottom: '8px' }}>
                      <p style={{ fontSize: '13px', color: '#713f12', margin: 0, lineHeight: 1.7, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>{item.rewritten}</p>
                    </div>
                    <button onClick={() => item.key === 'intro' ? setRewrittenIntro(null) : setRewrittenConclusion(null)} style={{ fontSize: '12px', color: '#854d0e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Hide</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Your Essay */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>📄 Your Essay ({wordCount} words)</h2>
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.9, fontFamily: 'Georgia, serif', whiteSpace: 'pre-line' }}>{essay}</p>
          </div>
          <button onClick={() => setStage('write')} style={{ marginTop: '12px', padding: '8px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#555', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>✏️ Edit Essay</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
          <Link href="/ielts/writing" style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#1a1a2e', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>← All Writing Topics</Link>
          <Link href="/ielts" style={{ padding: '12px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #064e3b, #059669)', color: 'white', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>✅ Back to IELTS Hub</Link>
        </div>

      </div>
    </main>
  )

  return null
}
