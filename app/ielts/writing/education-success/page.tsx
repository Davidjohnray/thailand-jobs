'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const TOPIC = 'Education & Success'
const ESSAY_TYPE = 'Discussion Essay'
const TASK = 'Some people think that a university degree is the only path to a successful career. Others believe that vocational training is equally valuable. Discuss both views and give your own opinion.'

const ESSAY_TYPE_GUIDE = {
  what: 'A discussion essay asks you to present both sides of an argument fairly, then give your own opinion. Unlike an opinion essay, you must give equal weight to both views in the body paragraphs before stating your position.',
  structure: [
    { label: 'Introduction (2–3 sentences)', desc: 'Paraphrase the statement. Briefly mention that there are two views. State which view you find more convincing.' },
    { label: 'Body Paragraph 1 (5–6 sentences)', desc: 'Present View 1 — university degree. Explain why some people hold this view. Give reasons and examples. Do not give your opinion here.' },
    { label: 'Body Paragraph 2 (5–6 sentences)', desc: 'Present View 2 — vocational training. Explain the merits of this view. Give reasons and examples. Then briefly state which you agree with more.' },
    { label: 'Conclusion (2–3 sentences)', desc: 'Restate both views briefly. Clearly state your own opinion. Optional: a forward-looking statement about education.' },
  ],
  tips: [
    'Present both sides fairly — do not be one-sided in the body paragraphs',
    'Your opinion should appear in the introduction AND conclusion — be consistent',
    'Each body paragraph covers ONE view — do not mix them',
    'Use hedging language for views you do not personally hold: "Proponents argue that..." "It is claimed that..."',
    'Aim for 270–290 words — under 250 loses marks automatically',
  ]
}

const USEFUL_LANGUAGE = [
  {
    category: 'Presenting View 1',
    phrases: [
      'Proponents of this view argue that...',
      'Those who favour this position contend that...',
      'It is widely believed that...',
      'Supporters of this view point out that...',
    ]
  },
  {
    category: 'Presenting View 2',
    phrases: [
      'On the other hand, others maintain that...',
      'An alternative perspective holds that...',
      'Those who oppose this view argue that...',
      'Conversely, it can be argued that...',
    ]
  },
  {
    category: 'Giving Your Opinion',
    phrases: [
      'In my view, the latter argument is more persuasive because...',
      'Personally, I am inclined to agree with...',
      'While both views have merit, I believe that...',
      'On balance, I would argue that...',
    ]
  },
  {
    category: 'Giving Examples',
    phrases: [
      'This is clearly illustrated by...',
      'A compelling example of this is...',
      'Research consistently shows that...',
      'Consider, for instance, the case of...',
    ]
  },
  {
    category: 'Concluding',
    phrases: [
      'In conclusion, while both perspectives have validity...',
      'To summarise, the debate between... reflects...',
      'Ultimately, I believe that...',
      'All things considered, it seems that...',
    ]
  },
]

const PLAN_PROMPTS = {
  thesis: 'Which view do you find more convincing — university degree or vocational training? State your position in one sentence.',
  view1: 'Summarise the argument FOR university degrees in one sentence.',
  view1Example: 'A specific example or evidence to support the university degree argument.',
  view2: 'Summarise the argument FOR vocational training in one sentence.',
  view2Example: 'A specific example or evidence to support the vocational training argument.',
  conclusion: 'Restate your position and briefly summarise both views in 1–2 sentences.',
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

export default function WritingLesson2Page() {
  const [stage, setStage] = useState<'intro' | 'plan' | 'write' | 'feedback'>('intro')
  const [plan, setPlan] = useState({ thesis: '', view1: '', view1Example: '', view2: '', view2Example: '', conclusion: '' })
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
    const intro = `There is ongoing debate about whether a university qualification is essential for career success, or whether vocational training offers an equally valid route. ${plan.thesis}`
    const b1 = `${plan.view1} ${plan.view1Example}`
    const b2 = `${plan.view2} ${plan.view2Example}`
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

  const planComplete = Object.values(plan).filter(v => v.trim()).length >= 4

  // INTRO STAGE
  if (stage === 'intro') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/ielts/writing" style={{ color: '#059669', fontSize: '13px', textDecoration: 'none' }}>← Writing Topics</Link>

        <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', borderRadius: '16px', padding: '32px', margin: '20px 0', color: 'white' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 'bold' }}>✍️ Writing Task 2</span>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 'bold' }}>Discussion Essay</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px' }}>{TOPIC}</h1>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', opacity: 0.8, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>The Task</p>
            <p style={{ fontSize: '15px', margin: 0, lineHeight: 1.6 }}>{TASK}</p>
          </div>
        </div>

        {/* Discussion Essay Guide */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>Understanding the Discussion Essay</h2>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: 1.6 }}>{ESSAY_TYPE_GUIDE.what}</p>

          {/* Key difference from opinion essay */}
          <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #fde68a' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>⚠️ Key Difference from Opinion Essay</p>
            <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>In a discussion essay, your body paragraphs must present BOTH views fairly — even the one you disagree with. Do not show your personal opinion until the conclusion (and optionally the introduction). A common mistake is writing two body paragraphs that both support one view.</p>
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
              { label: 'Task Achievement', color: '#2563eb', desc: 'Did you discuss BOTH views fairly and give your own opinion? Partial or one-sided treatment loses marks.' },
              { label: 'Coherence & Cohesion', color: '#059669', desc: 'Is your essay logically organised? Do paragraphs flow naturally? Are linking words used accurately?' },
              { label: 'Lexical Resource', color: '#7c3aed', desc: 'Do you use vocabulary to discuss both sides? Variety of academic expressions for presenting views?' },
              { label: 'Grammatical Range', color: '#d97706', desc: 'Variety of sentence structures including complex and compound sentences. Minimal errors.' },
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

        <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>The Task</p>
          <p style={{ fontSize: '14px', color: '#065f46', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>"{TASK}"</p>
        </div>

        {/* Discussion reminder */}
        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
            <strong>Remember:</strong> Body Paragraph 1 presents the case FOR university degrees. Body Paragraph 2 presents the case FOR vocational training. You are not arguing for one side — you are presenting both views fairly, then giving your opinion.
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>🗂️ Essay Planner</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Plan both sides before writing. A good discussion essay requires understanding the strongest version of both arguments.</p>

          {Object.entries(PLAN_PROMPTS).map(([key, prompt]) => (
            <div key={key} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                {key === 'thesis' ? '📌 Your Position (Introduction)' :
                  key === 'view1' ? '🎓 View 1 — University Degree Argument' :
                  key === 'view1Example' ? '📖 View 1 — Supporting Example' :
                  key === 'view2' ? '🔧 View 2 — Vocational Training Argument' :
                  key === 'view2Example' ? '📖 View 2 — Supporting Example' :
                  '🔚 Conclusion'}
              </label>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px' }}>{prompt}</p>
              <textarea
                value={plan[key as keyof typeof plan]}
                onChange={e => setPlan({ ...plan, [key]: e.target.value })}
                rows={2}
                placeholder={
                  key === 'thesis' ? 'e.g. While university degrees offer clear advantages, I believe vocational training is equally valuable and should be given greater recognition.' :
                  key === 'view1' ? 'e.g. Many people believe a university degree opens more doors because it signals academic ability and provides theoretical knowledge.' :
                  key === 'view1Example' ? 'e.g. In many Asian countries, employers specifically require degrees for management positions, making higher education a prerequisite rather than an advantage.' :
                  key === 'view2' ? 'e.g. Vocational training, however, provides practical skills that many industries desperately need and can lead to well-paid, stable careers.' :
                  key === 'view2Example' ? 'e.g. Skilled tradespeople such as electricians and plumbers are in high demand globally, often earning comparable salaries to university graduates without years of student debt.' :
                  'e.g. In conclusion, both pathways offer distinct benefits. While university degrees remain prestigious, vocational training deserves equal recognition as a route to a fulfilling and successful career.'
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
                <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 5 min intro/planning, 30 min writing, 5 min checking.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Before writing:</strong> Ask students which path they chose and why. Have them argue the opposite view for 1 minute — forces fair presentation.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Common mistake:</strong> Students often write two body paragraphs supporting only one view. Remind them BP1 = university, BP2 = vocational training.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Discussion:</strong> Ask students — which industries in Thailand favour each path? Personal context improves example quality.</p>
                <p style={{ margin: 0 }}><strong>Extension:</strong> After feedback, ask students to rewrite the body paragraph for the view they disagree with — pushes Band 7 thinking.</p>
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

          <textarea value={essay} onChange={e => setEssay(e.target.value)} placeholder="Write your essay here. Start with your introduction — paraphrase the question and mention both views before stating your position..." rows={20} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', lineHeight: 1.8, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Georgia, serif', outline: 'none', color: '#1a1a2e' }} />

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
              { label: 'Intro', hint: 'Both views + your position' },
              { label: 'Body 1', hint: 'University degree — reasons & examples' },
              { label: 'Body 2', hint: 'Vocational training — reasons & examples' },
              { label: 'Conclusion', hint: 'Your opinion + summarise' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                <span style={{ background: '#064e3b', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 7px', borderRadius: '4px', flexShrink: 0 }}>{s.label}</span>
                <span style={{ fontSize: '12px', color: '#555' }}>{s.hint}</span>
              </div>
            ))}
          </div>

          {/* Discussion reminder */}
          <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '12px 14px', marginTop: '12px', border: '1px solid #fde68a' }}>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#92400e', margin: '0 0 4px' }}>⚠️ Discussion Essay Reminder</p>
            <p style={{ fontSize: '11px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>Body 1 = university view. Body 2 = vocational view. Present both fairly before giving your opinion.</p>
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
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px' }}>{TOPIC} — Discussion Essay</p>
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
                { label: 'Body Paragraph 1 (University)', key: 'body1', color: '#059669' },
                { label: 'Body Paragraph 2 (Vocational)', key: 'body2', color: '#7c3aed' },
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
              <p style={{ fontSize: '12px', color: '#854d0e', margin: '0 0 10px', fontWeight: '600' }}>Both views covered, adequate development, some linking — but limited vocabulary range and basic grammar.</p>
              <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '16px', border: '1px solid #fde68a' }}>
                <p style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: 1.9, fontFamily: 'Georgia, serif', whiteSpace: 'pre-line' }}>{feedback.modelEssayBand6}</p>
              </div>
            </div>
          )}
          {modelView === '7' && (
            <div>
              <p style={{ fontSize: '12px', color: '#166534', margin: '0 0 10px', fontWeight: '600' }}>Both views fairly presented with strong examples, clear position, varied vocabulary and grammar, natural linking.</p>
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
          <Link href="/ielts/writing/environment-development" style={{ padding: '12px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #064e3b, #059669)', color: 'white', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>Next Lesson →</Link>
        </div>

      </div>
    </main>
  )

  return null
}
