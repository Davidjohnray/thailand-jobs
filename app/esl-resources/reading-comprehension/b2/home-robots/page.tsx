'use client'
import { useState } from 'react'
import Link from 'next/link'

const SPEEDS = [
  { label: '🐢 Very Slow', value: 0.55 },
  { label: '🚶 Slow', value: 0.72 },
  { label: '🏃 Normal', value: 0.9 },
  { label: '⚡ Fast', value: 1.1 },
]

const PARTS = [
  { number: 1, title: 'From Simple Machines to Smart Companions', emoji: '🤖', color: '#3b82f6',
    text: `Home robots were once limited to basic tasks such as vacuuming floors or mowing lawns. These early machines followed simple instructions and could not adapt well to changing environments. Today, advances in artificial intelligence, sensors, and connectivity have transformed home robots into far more capable devices. Modern AI-powered robots can learn routines, recognize voices, and respond to human behavior in more natural ways.

This shift has changed how people think about robots in the home. Instead of being seen only as tools, some robots are now viewed as assistants or even companions. They can remind users to take medication, help manage schedules, or provide simple conversation. As technology improves, the boundary between machine and helper becomes less clear, raising new expectations about what robots should do in everyday life.`,
    vocab: [
      { word: 'Connectivity', definition: 'The ability of devices to connect and communicate with each other through networks or the internet.' },
      { word: 'Routines', definition: 'Regular patterns of behaviour or activity that happen repeatedly — for example, morning habits.' },
      { word: 'Companions', definition: 'People or things that provide company and support — a companion is someone or something you spend time with.' },
      { word: 'Boundary', definition: 'A line or limit that separates two things — here, the unclear line between a machine and a human helper.' },
    ],
    questions: [{ n: 1, q: 'Should robots be designed only as tools, or also as companions?' }, { n: 2, q: 'How comfortable would you feel sharing your home with a robot?' }, { n: 3, q: 'Do you think people expect too much from home technology?' }]
  },
  { number: 2, title: 'Helping with Daily Life and Household Tasks', emoji: '🏠', color: '#8b5cf6',
    text: `One of the main benefits of AI-powered home robots is convenience. These robots can clean, cook simple meals, manage deliveries, and monitor home security. By learning a household's habits, they can work efficiently and reduce the time people spend on repetitive chores. For busy families or individuals with limited time, this support can improve quality of life and reduce stress.

Home robots also have strong potential in supporting elderly people and those with disabilities. Robots can assist with mobility, provide reminders, and offer emergency support if something goes wrong. However, there is an ongoing debate about whether robots should replace human care or simply support it. While robots can help with physical tasks, emotional connection and human judgment remain difficult to replicate.`,
    vocab: [
      { word: 'Convenience', definition: 'Something that saves time or effort and makes life easier — a useful feature or advantage.' },
      { word: 'Repetitive', definition: 'Done many times in the same way — boring or mechanical tasks that are repeated over and over.' },
      { word: 'Mobility', definition: 'The ability to move freely and easily — especially important for elderly or disabled people.' },
      { word: 'Replicate', definition: 'To copy or reproduce something exactly — here, to copy human emotions or judgment artificially.' },
    ],
    questions: [{ n: 4, q: 'Which household tasks should robots handle, and which should stay human?' }, { n: 5, q: 'Could robots reduce stress in modern life, or add new pressure?' }, { n: 6, q: 'Should robots be used more in elderly care, or should human care always come first?' }]
  },
  { number: 3, title: 'Privacy, Trust, and Ethical Concerns', emoji: '🔒', color: '#f59e0b',
    text: `AI-powered home robots rely on data to function effectively. Cameras, microphones, and sensors collect information about daily routines, conversations, and living spaces. While this data helps robots learn and improve, it also raises serious privacy concerns. People may worry about who controls this data and how securely it is stored or shared.

Trust is another key issue. If a robot makes decisions or suggestions, users must trust that the system is accurate and unbiased. There are also ethical questions about dependency: if people rely too heavily on robots, they may lose certain skills or become socially isolated. As robots become more common, society will need to decide how much control and responsibility these machines should have inside private homes.`,
    vocab: [
      { word: 'Unbiased', definition: 'Fair and not influenced by personal opinions — treating all situations equally without favouring one side.' },
      { word: 'Dependency', definition: 'Relying on something or someone too much — being unable to function well without it.' },
      { word: 'Isolated', definition: 'Separated from other people — feeling alone or cut off from social contact.' },
      { word: 'Ethical', definition: 'Related to what is morally right or wrong — questions about fairness, responsibility and values.' },
    ],
    questions: [{ n: 7, q: 'How much privacy are people willing to give up for convenience?' }, { n: 8, q: 'Who should be responsible if a home robot makes a serious mistake?' }, { n: 9, q: 'Can dependence on robots change human behaviour in negative ways?' }]
  },
  { number: 4, title: 'The Future of Home Robots', emoji: '🚀', color: '#22c55e',
    text: `Looking ahead, AI-powered home robots are expected to become more affordable, more intelligent, and more integrated into daily life. Future robots may understand emotions better, communicate more naturally, and work seamlessly with other smart home devices. This could create homes that are highly responsive to human needs, adjusting lighting, temperature, and support automatically.

However, the future success of home robots will depend on public acceptance. People will need to feel confident that these machines are safe, respectful, and beneficial. Governments and companies may also need to set clear rules about data use, safety standards, and ethical design. Whether home robots become a common household item or remain a luxury will depend on how well these challenges are managed.`,
    vocab: [
      { word: 'Integrated', definition: 'Combined into a whole — devices that work together as one connected system.' },
      { word: 'Seamlessly', definition: 'Smoothly and without any interruption or visible join — working together perfectly.' },
      { word: 'Acceptance', definition: 'The process of agreeing to receive or adopt something — willingness to welcome new technology.' },
      { word: 'Beneficial', definition: 'Having a good or helpful effect — producing advantages or positive results for people.' },
    ],
    questions: [{ n: 10, q: 'Do you think AI home robots will become common in most households?' }, { n: 11, q: 'Should governments create strict rules for robots used in private homes?' }, { n: 12, q: 'Would you prefer a future with more human help or more robotic assistance?' }]
  },
]

export default function HomeRobotsPage() {
  const [speed, setSpeed] = useState(0.9)

  function speak(text: string) {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-GB'; u.rate = speed; u.pitch = 1
    window.speechSynthesis.speak(u)
  }

  function stop() { if (typeof window === 'undefined') return; window.speechSynthesis.cancel() }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #1e3a5f 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B2 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#3b82f6', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B2 Upper Intermediate</span>
                <span style={{ background: 'rgba(139,92,246,0.6)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Technology</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>AI-Powered Home Robots</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>Living with Intelligent Machines — explore how AI robots are changing life at home, raising questions about privacy, trust, and the future.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[{ icon: '📄', label: '4 reading parts' }, { icon: '💬', label: '12 discussion questions' }, { icon: '📚', label: '16 vocabulary words' }, { icon: '⏱️', label: '45–60 min lesson' }, { icon: '👤', label: '1-to-1 or small group' }, { icon: '🔊', label: 'Audio included' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>How to use:</span>
            {['🔊 Play the passage aloud', '📚 Study vocabulary below each part', '💬 Answer discussion questions', '🗣️ Share your own opinion'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '13px' }}>
                <span style={{ background: '#E85D26', color: 'white', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>🔊 Speed:</span>
            {SPEEDS.map(s => (
              <button key={s.value} onClick={() => setSpeed(s.value)}
                style={{ padding: '4px 12px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? '#3b82f6' : '#e5e7eb', background: speed === s.value ? '#3b82f6' : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {PARTS.map(part => (
          <div key={part.number} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: `linear-gradient(135deg, ${part.color}22, ${part.color}08)`, borderLeft: `5px solid ${part.color}`, padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: part.color, color: 'white', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>{part.number}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: part.color, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Part {part.number}</div>
                <h2 style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{part.emoji} {part.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => speak(part.text.replace(/\n\n/g, ' '))} style={{ background: part.color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: `0 3px 10px ${part.color}40` }}>▶ Play Passage</button>
                <button onClick={stop} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop</button>
              </div>
            </div>
            <div style={{ padding: '24px 28px 20px' }}>
              {part.text.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: '1.85', margin: i === 0 ? '0 0 18px' : '0', fontFamily: 'Georgia, serif' }}>{para}</p>
              ))}
            </div>
            <div style={{ margin: '0 28px 24px', background: part.color + '08', border: `1px solid ${part.color}25`, borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: part.color + '18', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${part.color}20` }}>
                <span style={{ fontSize: '16px' }}>📚</span>
                <span style={{ color: part.color, fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vocabulary — Part {part.number}</span>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {part.vocab.map((v, i) => (
                  <div key={v.word} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: i < part.vocab.length - 1 ? '10px' : '0', borderBottom: i < part.vocab.length - 1 ? `1px solid ${part.color}15` : 'none' }}>
                    <div style={{ background: part.color, color: 'white', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>{v.word}</span>
                        <button onClick={() => speak(v.word)} style={{ background: part.color + '15', color: part.color, border: `1px solid ${part.color}30`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0 }}>🔊</button>
                      </div>
                      <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{v.definition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#1a1a2e', padding: '20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '18px' }}>💬</span>
                <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Discussion Questions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {part.questions.map(q => (
                  <div key={q.n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ background: part.color, color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{q.n}</div>
                    <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{q.q}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to B2 Reading Comprehension</Link>
        </div>
      </div>
    </main>
  )
}
