'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TOPIC = 'Social Media & Communication'
const ESSAY_TYPE = 'Advantages-Disadvantages Essay'
const TASK = 'Social media has transformed the way people communicate and share information. What are the advantages and disadvantages of this development?'

const ESSAY_TYPE_GUIDE = {
  what: 'An advantages-disadvantages essay asks you to discuss both the positive and negative effects of a development. Some versions of this question also ask whether the advantages outweigh the disadvantages — read the question carefully to check whether you need to give an overall view. Either way, your essay should present both sides fairly, with clear explanations and specific examples.',
  structure: [
    { label: 'Introduction (2–3 sentences)', desc: 'Paraphrase the statement. State that this development has brought both benefits and drawbacks. If the question asks for your opinion on which is greater, you can briefly indicate it here.' },
    { label: 'Body Paragraph 1 — Advantages (5–6 sentences)', desc: 'Discuss 2 advantages of the development. Explain each clearly and support with a specific example.' },
    { label: 'Body Paragraph 2 — Disadvantages (5–6 sentences)', desc: 'Discuss 2 disadvantages of the development. Explain each clearly and support with a specific example.' },
    { label: 'Conclusion (2–3 sentences)', desc: 'Summarise both sides. If the question asks whether advantages outweigh disadvantages, give a clear final view here.' },
  ],
  tips: [
    'Read the question carefully — does it only ask for advantages/disadvantages, or also which is greater?',
    'Give roughly equal weight to both sides unless the question asks for your opinion — don\'t make one paragraph much longer than the other',
    'Use specific, real-world examples — vague claims like "it has many benefits" score poorly',
    'Use clear topic sentences that introduce each advantage or disadvantage',
    'Aim for 270–290 words — under 250 loses marks automatically',
  ]
}

const USEFUL_LANGUAGE = [
  {
    category: 'Introducing Advantages',
    phrases: [
      'One major advantage of this development is...',
      'A key benefit is that...',
      'This has brought about significant benefits, such as...',
      'Among the many advantages, one of the most notable is...',
    ]
  },
  {
    category: 'Introducing Disadvantages',
    phrases: [
      'On the other hand, a significant drawback is...',
      'However, this development also has its downsides...',
      'One of the main disadvantages is...',
      'Despite these benefits, there are also concerns about...',
    ]
  },
  {
    category: 'Giving Examples',
    phrases: [
      'For instance...',
      'A clear example of this can be seen in...',
      'This is evident in the way that...',
      'To illustrate this point...',
    ]
  },
  {
    category: 'Weighing Up',
    phrases: [
      'While there are clear benefits, the drawbacks should not be overlooked.',
      'On balance, the advantages appear to outweigh the disadvantages.',
      'Both sides of this issue carry significant weight.',
      'Ultimately, whether this is positive or negative often depends on...',
    ]
  },
  {
    category: 'Concluding',
    phrases: [
      'In conclusion, while social media has clear benefits, it also presents challenges that should not be ignored.',
      'To summarise, this development offers significant advantages, but the disadvantages are equally worth considering.',
      'Overall, it is clear that this development has reshaped communication in both positive and negative ways.',
      'Taking everything into account, the benefits of this development appear to outweigh its drawbacks.',
    ]
  },
]

const PLAN_PROMPTS = {
  intro: 'Briefly introduce the topic — how has social media changed communication? One or two sentences.',
  advantage1: 'Your first advantage of social media — be specific.',
  advantage1Detail: 'Explanation or example to support Advantage 1.',
  advantage2: 'Your second advantage — be specific.',
  disadvantage1: 'Your first disadvantage of social media — be specific.',
  disadvantage1Detail: 'Explanation or example to support Disadvantage 1.',
  disadvantage2: 'Your second disadvantage — be specific.',
  conclusion: 'Summarise the advantages and disadvantages in 1–2 sentences.',
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

export default function SocialMediaWritingPage() {
  const [stage, setStage] = useState<'intro' | 'plan' | 'write' | 'feedback'>('intro')
  const [plan, setPlan] = useState({ intro: '', advantage1: '', advantage1Detail: '', advantage2: '', disadvantage1: '', disadvantage1Detail: '', disadvantage2: '', conclusion: '' })
  const [essay, setEssay] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [modelView, setModelView] = useState<'6' | '7'>('7')
  const [activeLanguageTab, setActiveLanguageTab] = useState(0)
  const [showTeacherMode, setShowTeacherMode] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [rewrittenIntro, setRewrittenIntro] = useState<string | null>(null)
  const [rewrittenConclusion, setRewrittenConclusion] = useState<string | null>(null)
  const [loadingRewrite, setLoadingRewrite] = useState<'intro' | 'conclusion' | null>(null)
  const [showParagraphFeedback, setShowParagraphFeedback] = useState(false)
  const [timer, setTimer] = useState(40 * 60)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) {
      setHasAccess(true); setCheckingAccess(false); return
    }
    if (!email) { setCheckingAccess(false); return }
    supabase.from('ielts_access').select('expires_at, is_active').eq('email', email).eq('is_active', true).single()
      .then(({ data }) => {
        if (data && new Date(data.expires_at) > new Date()) {
          setHasAccess(true)
          localStorage.setItem('ielts_expires', data.expires_at)
        }
        setCheckingAccess(false)
      })
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
    const b1 = `${plan.advantage1} ${plan.advantage1Detail} In addition, ${plan.advantage2}`
    const b2 = `${plan.disadvantage1} ${plan.disadvantage1Detail} Furthermore, ${plan.disadvantage2}`
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

  // ============ LOCKED — NO ACCESS ============
  if (!checkingAccess && !hasAccess) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <Link href="/ielts/writing" style={{ color: '#059669', fontSize: '13px', textDecoration: 'none' }}>← Writing Topics</Link>
        <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', borderRadius: '16px', padding: '40px 32px', marginTop: '24px', color: 'white' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>{TOPIC}</h1>
          <p style={{ opacity: 0.8, fontSize: '14px', margin: '0 0 24px' }}>This is a subscription topic. Activate your access code to unlock this and 2 other Writing lessons, plus all Speaking and Reading content.</p>
          <Link href="/ielts/subscribe" style={{ background: 'white', color: '#064e3b', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
            Get Access — 149 THB/month →
          </Link>
        </div>
      </div>
    </main>
  )

  // INTRO STAGE
  if (stage === 'intro') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/ielts/writing" style={{ color: '#059669', fontSize: '13px', textDecoration: 'none' }}>← Writing Topics</Link>

        <div style={{ background: 'linear-gradient(135deg, #064e3b, #059669)', borderRadius: '16px', padding: '32px', margin: '20px 0', color: 'white' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 'bold' }}>✍️ Writing Task 2</span>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 'bold' }}>Advantages-Disadvantages Essay</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px' }}>{TOPIC}</h1>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', opacity: 0.8, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>The Task</p>
            <p style={{ fontSize: '15px', margin: 0, lineHeight: 1.6 }}>{TASK}</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>Understanding the Advantages-Disadvantages Essay</h2>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: 1.6 }}>{ESSAY_TYPE_GUIDE.what}</p>

          {/* Common Mistake */}
          <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #fde68a' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>⚠️ Common Mistake</p>
            <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>Students often just list advantages and disadvantages without explaining them. Each point needs three parts: the point itself, an explanation of why or how it happens, and ideally a specific example. "Faster communication" alone is too vague — explain how and why this matters.</p>
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
              { label: 'Task Achievement', color: '#2563eb', desc: 'Did you discuss both advantages AND disadvantages with explanation? If asked, did you give a clear final view?' },
              { label: 'Coherence & Cohesion', color: '#059669', desc: 'Does each paragraph focus on one side — advantages or disadvantages? Are ideas linked logically within paragraphs?' },
              { label: 'Lexical Resource', color: '#7c3aed', desc: 'Do you use varied vocabulary for benefits and drawbacks, rather than repeating "good" and "bad"?' },
              { label: 'Grammatical Range', color: '#d97706', desc: 'Variety of sentence structures. Good use of contrast linkers — however, on the other hand, whereas.' },
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
            <strong>Planning tip:</strong> Think of 2 advantages and 2 disadvantages of social media for communication. Your Body 1 covers both advantages, Body 2 covers both disadvantages. Try to make at least one point on each side specific and example-based.
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>🗂️ Essay Planner</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Plan your advantages and disadvantages before writing. Specific plans lead to specific, higher-scoring essays.</p>

          {Object.entries(PLAN_PROMPTS).map(([key, prompt]) => (
            <div key={key} style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
                {key === 'intro' ? '📌 Introduction' :
                  key === 'advantage1' ? '✅ Advantage 1' :
                  key === 'advantage1Detail' ? '📖 Advantage 1 — Explanation or Example' :
                  key === 'advantage2' ? '✅ Advantage 2' :
                  key === 'disadvantage1' ? '⚠️ Disadvantage 1' :
                  key === 'disadvantage1Detail' ? '📖 Disadvantage 1 — Explanation or Example' :
                  key === 'disadvantage2' ? '⚠️ Disadvantage 2' :
                  '🔚 Conclusion'}
              </label>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px' }}>{prompt}</p>
              <textarea
                value={plan[key as keyof typeof plan]}
                onChange={e => setPlan({ ...plan, [key]: e.target.value })}
                rows={2}
                placeholder={
                  key === 'intro' ? 'e.g. Social media has fundamentally changed the way people interact and exchange information, bringing both significant benefits and notable drawbacks.' :
                  key === 'advantage1' ? 'e.g. Social media allows people to stay connected with friends and family regardless of distance.' :
                  key === 'advantage1Detail' ? 'e.g. For example, migrant workers can have daily video calls with their families back home, something that was impossible a generation ago.' :
                  key === 'advantage2' ? 'e.g. It also allows information and news to spread quickly, helping people stay informed about important events.' :
                  key === 'disadvantage1' ? 'e.g. Social media can negatively affect mental health, particularly among young people, due to constant comparison with others.' :
                  key === 'disadvantage1Detail' ? 'e.g. Studies have linked heavy social media use among teenagers to increased rates of anxiety and low self-esteem.' :
                  key === 'disadvantage2' ? 'e.g. It can also spread misinformation quickly, as false stories often circulate before they can be fact-checked.' :
                  'e.g. In conclusion, while social media has made communication faster and more connected, it has also introduced challenges related to wellbeing and the spread of false information.'
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
              <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#064e3b' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>👨‍🏫 Teacher Mode</button>
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
                <p style={{ margin: '0 0 6px' }}><strong>Before writing:</strong> Brainstorm as a class — which apps do students use most, and how has this changed how they communicate with friends and family compared to 10 years ago?</p>
                <p style={{ margin: '0 0 6px' }}><strong>Common mistake:</strong> Remind students that each body paragraph should focus on ONE side only. Mixing an advantage into the disadvantages paragraph (or vice versa) confuses the structure and hurts Coherence & Cohesion.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Vocabulary focus:</strong> Social media has rich vocabulary — connectivity, misinformation, mental wellbeing, online platforms, instant communication. Encourage use of these.</p>
                <p style={{ margin: 0 }}><strong>Extension:</strong> After feedback, ask students whether the question requires a final opinion (advantages outweigh disadvantages, or vice versa) — discuss how this changes the conclusion.</p>
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

          <textarea value={essay} onChange={e => setEssay(e.target.value)} placeholder="Write your essay here. Start with your introduction — paraphrase the question and mention that social media has brought both advantages and disadvantages..." rows={20} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', lineHeight: 1.8, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Georgia, serif', outline: 'none', color: '#1a1a2e' }} />

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
              { label: 'Body 1', hint: 'Advantage 1 + Advantage 2' },
              { label: 'Body 2', hint: 'Disadvantage 1 + Disadvantage 2' },
              { label: 'Conclusion', hint: 'Summarise both sides' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                <span style={{ background: '#064e3b', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 7px', borderRadius: '4px', flexShrink: 0 }}>{s.label}</span>
                <span style={{ fontSize: '12px', color: '#555' }}>{s.hint}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '12px 14px', marginTop: '12px', border: '1px solid #fde68a' }}>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#92400e', margin: '0 0 4px' }}>⚠️ Key Reminder</p>
            <p style={{ fontSize: '11px', color: '#78350f', margin: 0, lineHeight: 1.5 }}>Keep advantages and disadvantages in separate paragraphs. Each point needs an explanation and, ideally, a specific example.</p>
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
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px' }}>{TOPIC} — Advantages-Disadvantages Essay</p>
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
                { label: 'Body Paragraph 1 (Advantages)', key: 'body1', color: '#059669' },
                { label: 'Body Paragraph 2 (Disadvantages)', key: 'body2', color: '#dc2626' },
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
              <p style={{ fontSize: '12px', color: '#854d0e', margin: '0 0 10px', fontWeight: '600' }}>Advantages and disadvantages mentioned but vaguely developed, limited vocabulary range, basic grammar.</p>
              <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '16px', border: '1px solid #fde68a' }}>
                <p style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: 1.9, fontFamily: 'Georgia, serif', whiteSpace: 'pre-line' }}>{feedback.modelEssayBand6}</p>
              </div>
            </div>
          )}
          {modelView === '7' && (
            <div>
              <p style={{ fontSize: '12px', color: '#166534', margin: '0 0 10px', fontWeight: '600' }}>Specific advantages and disadvantages with clear examples, varied vocabulary and grammar, logical structure with one side per paragraph.</p>
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
