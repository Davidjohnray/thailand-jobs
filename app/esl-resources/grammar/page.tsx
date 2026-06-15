'use client'
import Link from 'next/link'

const LEVELS = [
  { code: 'a1', label: 'A1', title: 'Starter',           emoji: '🌱', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)', who: 'Complete beginners',    topics: 12, sample: ['To be (am/is/are)', 'Articles: a, an, the', 'Simple present tense', 'Plural nouns'] },
  { code: 'a2', label: 'A2', title: 'Elementary',         emoji: '🌿', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', who: 'Early learners',        topics: 14, sample: ['Past simple', "Can / can't", 'Comparatives & superlatives', 'Countable & uncountable'] },
  { code: 'b1', label: 'B1', title: 'Pre-Intermediate',   emoji: '📗', gradient: 'linear-gradient(135deg, #2D6BE4, #4f8ef7)', who: 'Developing learners',   topics: 16, sample: ['Present perfect', 'First conditional', 'Gerunds vs infinitives', 'Used to / would'] },
  { code: 'b2', label: 'B2', title: 'Intermediate',       emoji: '📘', gradient: 'linear-gradient(135deg, #7C3AED, #9f67f5)', who: 'Confident learners',    topics: 16, sample: ['Passive voice', 'Reported speech', 'Second & third conditional', 'Modal perfects'] },
  { code: 'c1', label: 'C1', title: 'Upper-Intermediate', emoji: '🔥', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)', who: 'Advanced learners',     topics: 14, sample: ['Inversion', 'Cleft sentences', 'Mixed conditionals', 'Ellipsis & substitution'] },
  { code: 'c2', label: 'C2', title: 'Advanced',           emoji: '🏆', gradient: 'linear-gradient(135deg, #E85D26, #f97316)', who: 'Near-native speakers',  topics: 12, sample: ['Subjunctive mood', 'Nominalization', 'Complex aspect', 'Discourse markers'] },
]

const MODES = [
  { icon: '📖', title: 'Learn',     color: '#2D6BE4', bg: 'rgba(45,107,228,0.08)',  border: 'rgba(45,107,228,0.2)',  points: ['Clear rule explanation with examples', 'Form tables showing how to build the structure', 'Common learner mistakes and how to fix them', 'Tip boxes with memory tricks'] },
  { icon: '✍️', title: 'Practise',  color: '#059669', bg: 'rgba(5,150,105,0.08)',   border: 'rgba(5,150,105,0.2)',   points: ['Fill-in-the-blank exercises', 'Sentence transformation tasks', 'Error correction activities', 'AI feedback on free writing'] },
  { icon: '📺', title: 'Teach',     color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.2)',  points: ['Projector-ready explanation slides', 'Class exercises you can run live', 'Student answer reveal for TV mode', 'Printable reference sheets'] },
]

export default function GrammarLandingPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #2D6BE4 100%)', padding: '70px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>✏️</div>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 14px', letterSpacing: '-1px' }}>Grammar</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '560px', margin: '0 auto 10px' }}>
          From A1 basics to C2 advanced — every grammar point explained, practised, and ready to teach
        </p>
        <p style={{ fontSize: '14px', opacity: 0.75, maxWidth: '460px', margin: '0 auto 28px' }}>
          Self-study for learners anywhere · Teach mode for the classroom
        </p>
        <Link href="/esl-resources/grammar/placement" style={{ textDecoration: 'none' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', color: 'white', padding: '12px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', display: 'inline-block' }}>
            Not sure of your level? Take the placement test →
          </span>
        </Link>
      </div>

      <div style={{ background: '#1a1a2e', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', textAlign: 'center' }}>How it works</p>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 32px' }}>Every grammar topic has three modes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {MODES.map(mode => (
              <div key={mode.title} style={{ background: mode.bg, border: `1px solid ${mode.border}`, borderRadius: '16px', padding: '28px 24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{mode.icon}</div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px' }}>{mode.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {mode.points.map(pt => (
                    <li key={pt} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: mode.color, flexShrink: 0, marginTop: '2px' }}>✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#059669', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Choose your level</p>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 10px' }}>Six levels · A1 to C2</h2>
          <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>Start at your level or work through from the beginning</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {LEVELS.map(level => (
            <Link key={level.code} href={`/esl-resources/grammar/${level.code}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', cursor: 'pointer' }}>
                <div style={{ background: level.gradient, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '36px' }}>{level.emoji}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ color: 'white', fontSize: '26px', fontWeight: 'bold' }}>{level.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', fontWeight: 'bold' }}>{level.title}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0 }}>{level.who} · {level.topics} topics</p>
                  </div>
                </div>
                <div style={{ padding: '20px 28px 24px' }}>
                  <p style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>Topics include</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                    {level.sample.map(t => (
                      <li key={t} style={{ color: '#444', fontSize: '13px', lineHeight: '1.6', marginBottom: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: '#ccc', fontSize: '10px' }}>▸</span>{t}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#aaa' }}>{level.topics} grammar topics</span>
                    <span style={{ background: '#1a1a2e', color: 'white', padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold' }}>Start {level.label} →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ background: '#1a1a2e', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>🌍</div>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: '0 0 12px' }}>Grammar for English learners everywhere</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.7', margin: '0 0 28px' }}>
            Every topic covers the most common mistakes learners make — whatever your first language — with clear explanations and practice that actually sticks.
          </p>
          <Link href="/esl-resources/grammar/placement" style={{ textDecoration: 'none' }}>
            <span style={{ background: 'linear-gradient(135deg, #059669, #2D6BE4)', color: 'white', padding: '14px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', display: 'inline-block' }}>
              Find my level →
            </span>
          </Link>
        </div>
      </div>

    </main>
  )
}
