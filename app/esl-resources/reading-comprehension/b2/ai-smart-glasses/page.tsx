'use client'
import Link from 'next/link'

const PARTS = [
  {
    number: 1,
    title: 'From Simple Glasses to Intelligent Devices',
    emoji: '👓',
    color: '#3b82f6',
    text: `Smart glasses have existed for several years, but early versions were often limited, expensive, or uncomfortable to use. Recent advances in artificial intelligence, miniaturized hardware, and battery technology have changed this situation. Next-generation AI smart glasses now aim to blend naturally into daily life, looking more like normal eyewear while offering powerful digital features. These devices can display information directly in the user's field of vision, reducing the need to constantly check a phone.

What makes these glasses different from earlier wearable technology is their ability to understand context. Using cameras, microphones, and sensors, AI smart glasses can recognize surroundings, interpret speech, and respond intelligently. Instead of being a distraction, they are designed to quietly support users during work, travel, and social interaction. Supporters believe this shift could change how people interact with technology, making it more seamless and less intrusive.`,
    vocab: [
      { word: 'Miniaturized', definition: 'Made very small — hardware components reduced to tiny sizes to fit inside glasses.' },
      { word: 'Wearable technology', definition: 'Electronic devices designed to be worn on the body — like smart watches or glasses.' },
      { word: 'Seamless', definition: 'Smooth and uninterrupted — technology that works without you noticing it.' },
      { word: 'Intrusive', definition: 'Unwanted or disturbing — technology that interrupts or interferes with normal life.' },
    ],
    questions: [
      { n: 1, q: 'Do you think wearable technology should replace smartphones, or simply support them?' },
      { n: 2, q: 'How comfortable would you feel wearing smart glasses in public spaces?' },
      { n: 3, q: 'Is convenience more important than appearance when adopting new technology?' },
    ]
  },
  {
    number: 2,
    title: 'Real-Time Translation and Navigation',
    emoji: '🗺️',
    color: '#8b5cf6',
    text: `One of the most exciting features of next-gen AI smart glasses is real-time language translation. Users can hear or see translations instantly while speaking with people from different countries. This could greatly reduce language barriers in travel, international business, and education. Unlike smartphone apps, the hands-free design allows users to maintain eye contact and natural conversation, which may improve communication and trust.

Navigation is another powerful use case. AI smart glasses can project directions, landmarks, and alerts directly into the user's view. For example, walking directions may appear on the street ahead, or reminders could appear when approaching a destination. For people unfamiliar with a city — or those with mobility or vision challenges — this could significantly improve independence and confidence. However, reliance on constant digital guidance may also reduce people's natural sense of direction.`,
    vocab: [
      { word: 'Real-time', definition: 'Happening instantly as events occur — no delay between input and output.' },
      { word: 'Hands-free', definition: 'Working without needing to hold or touch a device — using voice or sensors instead.' },
      { word: 'Landmark', definition: 'A recognizable building or place used as a point of reference for navigation.' },
      { word: 'Augmented reality', definition: 'Digital information or images overlaid onto the real world through a screen or lens.' },
    ],
    questions: [
      { n: 4, q: 'How might real-time translation change international communication?' },
      { n: 5, q: 'Could over-reliance on navigation technology weaken human skills?' },
      { n: 6, q: 'Should this technology be encouraged in education and tourism?' },
    ]
  },
  {
    number: 3,
    title: 'AI Assistance in Daily Life and Work',
    emoji: '💼',
    color: '#f59e0b',
    text: `Beyond translation and navigation, AI smart glasses act as personal assistants. They can summarize messages, provide reminders, identify objects, or offer suggestions based on what the user sees. In professional settings, this could transform productivity. For example, technicians might receive instructions while repairing equipment, or doctors could view patient data without looking away from their work.

At the same time, constant AI assistance raises concerns about attention, privacy, and decision-making. If AI systems guide users too often, people may lose confidence in their own judgment. There are also questions about data collection: cameras and microphones worn on the face may capture sensitive information about others without their consent. Balancing usefulness with ethical responsibility will be one of the biggest challenges for widespread adoption.`,
    vocab: [
      { word: 'Productivity', definition: 'The efficiency of completing tasks — how much useful work is done in a given time.' },
      { word: 'Consent', definition: 'Permission given by a person to allow something — especially collecting their data.' },
      { word: 'Transparency', definition: 'Being open and honest about how something works, especially with data and privacy.' },
    ],
    questions: [
      { n: 7, q: 'Should AI assistants make decisions for people or only offer suggestions?' },
      { n: 8, q: 'How much data collection is acceptable for better user experience?' },
      { n: 9, q: 'Would AI smart glasses improve or reduce workplace creativity?' },
    ]
  },
  {
    number: 4,
    title: 'Social Impact and the Future of Smart Glasses',
    emoji: '🌍',
    color: '#22c55e',
    text: `As AI smart glasses become more common, they may reshape social norms. Just as smartphones changed how people interact, smart glasses could affect eye contact, attention, and trust. Some people may feel uncomfortable being recorded or analyzed without knowing it. Others may see the technology as empowering, especially for people with disabilities or communication challenges.

Looking ahead, the success of AI smart glasses will depend on trust, regulation, and design choices. If companies focus on transparency, privacy protection, and user control, these devices may become a normal part of daily life. If not, public resistance could slow adoption. Whether they become essential tools or niche gadgets, AI smart glasses represent an important step toward a more integrated digital future.`,
    vocab: [
      { word: 'Transparency', definition: 'Being open and honest about how something works, especially with data and privacy.' },
      { word: 'Niche', definition: 'Appealing to a small, specific group of people rather than the general public.' },
      { word: 'Wearable technology', definition: 'Electronic devices designed to be worn on the body — like smart watches or glasses.' },
    ],
    questions: [
      { n: 10, q: 'How might smart glasses change social behaviour in public spaces?' },
      { n: 11, q: 'Should governments regulate wearable AI devices more strictly?' },
      { n: 12, q: 'Would you personally choose to use AI smart glasses in your daily life? Why or why not?' },
    ]
  },
]

function speak(text: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-GB'
  utterance.rate = 0.9
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

function stop() {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
}

export default function AISmartGlassesPage() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B2 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>🥽</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#3b82f6', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B2 Upper Intermediate</span>
                <span style={{ background: 'rgba(139,92,246,0.6)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Technology</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>
                Next-Gen AI Smart Glasses
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>
                A New Way to See the World — explore how AI-powered glasses are changing daily life, work, travel and social interaction.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[
              { icon: '📄', label: '4 reading parts' },
              { icon: '💬', label: '12 discussion questions' },
              { icon: '📚', label: '12 vocabulary words' },
              { icon: '⏱️', label: '45–60 min lesson' },
              { icon: '👤', label: '1-to-1 or small group' },
              { icon: '🔊', label: 'Audio included' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>
                <span>{s.icon}</span> {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '16px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>How to use:</span>
          {['🔊 Play the passage aloud', '📚 Study vocabulary below each part', '💬 Answer discussion questions', '🗣️ Share your own opinion'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '13px' }}>
              <span style={{ background: '#E85D26', color: 'white', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
              {step}
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {PARTS.map(part => (
          <div key={part.number} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>

            {/* Part Header */}
            <div style={{ background: `linear-gradient(135deg, ${part.color}22, ${part.color}08)`, borderLeft: `5px solid ${part.color}`, padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: part.color, color: 'white', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>{part.number}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: part.color, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Part {part.number}</div>
                <h2 style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{part.emoji} {part.title}</h2>
              </div>
              {/* Audio buttons for passage */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => speak(part.text.replace(/\n\n/g, ' '))}
                  style={{ background: part.color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 3px 10px ${part.color}40` }}>
                  ▶ Play Passage
                </button>
                <button
                  onClick={stop}
                  style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  ⏹ Stop
                </button>
              </div>
            </div>

            {/* Reading Text */}
            <div style={{ padding: '24px 28px 20px' }}>
              {part.text.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: '1.85', margin: i === 0 ? '0 0 18px' : '0', fontFamily: 'Georgia, serif' }}>{para}</p>
              ))}
            </div>

            {/* Vocabulary for this part */}
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
                        {/* Audio button for vocab word */}
                        <button
                          onClick={() => speak(v.word)}
                          title={`Hear "${v.word}"`}
                          style={{ background: part.color + '15', color: part.color, border: `1px solid ${part.color}30`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0 }}>
                          🔊
                        </button>
                      </div>
                      <span style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{v.definition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Questions */}
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

        {/* BACK LINK */}
        <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>← Back to B2 Reading Comprehension</Link>
        </div>

      </div>
    </main>
  )
}
