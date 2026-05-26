'use client'
import Link from 'next/link'

const PARTS = [
  {
    number: 1,
    title: 'From Science Fiction to Consumer Technology',
    emoji: '🔮',
    color: '#8b5cf6',
    text: `Holographic displays were once seen only in science fiction movies, where characters interacted with floating images in mid-air. For many years, this technology felt unrealistic and far beyond everyday use. However, recent advances in optics, projection systems, and computing power have brought holographic gadgets much closer to reality. Today, early versions already exist in exhibitions, medical training, and high-end presentations.

Modern holographic display gadgets aim to project three-dimensional images without requiring special glasses. These images can appear to float above a surface, rotate freely, and be viewed from multiple angles. As interest grows, companies are exploring how holograms could be used in homes, offices, and public spaces. This shift raises questions about how visual technology might change communication and information sharing.`,
    vocab: [
      { word: 'Holographic', definition: 'Relating to a hologram — a three-dimensional image created by laser light that appears to float in space.' },
      { word: 'Optics', definition: 'The branch of physics dealing with light and how it behaves — used in cameras, lenses and display technology.' },
      { word: 'Three-dimensional', definition: 'Having height, width and depth — appearing solid and real rather than flat like a normal screen.' },
      { word: 'Consumer technology', definition: 'Electronic products designed and sold for everyday use by the general public, not just specialists.' },
    ],
    questions: [
      { n: 1, q: 'Why do you think holograms capture people\'s imagination so strongly?' },
      { n: 2, q: 'Do you believe futuristic technology becomes popular because it is useful or because it looks impressive?' },
      { n: 3, q: 'How important is visual impact compared to practicality in new gadgets?' },
    ]
  },
  {
    number: 2,
    title: 'Uses in Business, Education, and Entertainment',
    emoji: '🎓',
    color: '#3b82f6',
    text: `Holographic display gadgets offer new possibilities for business communication. Instead of flat screens or slides, presenters can show 3D product models, architectural designs, or data visualizations that audiences can explore visually. This can make complex ideas easier to understand and more engaging, especially in fields like engineering, medicine, and design.

In education, holograms may support interactive learning by allowing students to observe objects such as historical artifacts, scientific models, or anatomical structures in three dimensions. Entertainment is another major area of interest, with holographic concerts, games, and immersive storytelling experiences becoming more realistic. However, the cost and technical complexity of these systems still limit widespread use.`,
    vocab: [
      { word: 'Visualization', definition: 'A visual representation of data or information — turning numbers and facts into images or graphics.' },
      { word: 'Anatomical', definition: 'Relating to the structure of the human body — anatomy is the study of how the body is built.' },
      { word: 'Immersive', definition: 'Deeply engaging and surrounding — an experience that makes you feel completely inside it.' },
      { word: 'Artifacts', definition: 'Objects made or used by humans in the past — historical items studied to understand earlier civilizations.' },
    ],
    questions: [
      { n: 4, q: 'In which area do you think holographic displays could be most valuable?' },
      { n: 5, q: 'Should schools invest in advanced display technology, or focus on traditional teaching methods?' },
      { n: 6, q: 'How might holograms change the way people experience entertainment?' },
    ]
  },
  {
    number: 3,
    title: 'Challenges and Social Impact',
    emoji: '⚠️',
    color: '#f59e0b',
    text: `Despite their potential, holographic display gadgets face several challenges. Producing clear, stable images requires precise hardware and significant processing power. Power consumption, portability, and durability are also major concerns, especially if these devices are meant for everyday use. As with many new technologies, early versions may feel exciting but impractical for most consumers.

There are also social and psychological questions to consider. Highly realistic holograms could blur the line between physical and digital experiences. While this may enhance communication, it could also increase screen dependence or reduce face-to-face interaction. Society will need to decide how much immersive technology is healthy and how it should fit into daily life.`,
    vocab: [
      { word: 'Portability', definition: 'The ability to be carried and used easily in different places — a portable device is light and convenient.' },
      { word: 'Durability', definition: 'The ability to last a long time without breaking or wearing out — how tough and reliable something is.' },
      { word: 'Screen dependence', definition: 'Relying too heavily on digital screens — spending so much time on devices that it affects real life negatively.' },
      { word: 'Impractical', definition: 'Not useful or realistic in real-world situations — something that sounds good in theory but is hard to use.' },
    ],
    questions: [
      { n: 7, q: 'Do you think immersive visual technology brings people closer together or pushes them apart?' },
      { n: 8, q: 'Should there be limits on how realistic digital experiences become?' },
      { n: 9, q: 'How do you usually decide whether new technology is worth adopting?' },
    ]
  },
  {
    number: 4,
    title: 'The Future of Holographic Gadgets',
    emoji: '🚀',
    color: '#22c55e',
    text: `As technology continues to improve, holographic display gadgets are expected to become thinner, more affordable, and easier to use. Future devices may integrate with smartphones, smart glasses, or home systems, allowing users to create holograms on demand. Some experts believe holograms could eventually replace traditional screens in certain situations, especially for collaboration and creative work.

However, success will depend on whether holographic displays solve real problems rather than simply offering visual novelty. Consumers and businesses will likely adopt them only if they clearly improve productivity, learning, or communication. If these conditions are met, holographic gadgets could represent a major shift in how humans interact with digital information.`,
    vocab: [
      { word: 'Integrate', definition: 'To combine different things so they work together as one connected system.' },
      { word: 'On demand', definition: 'Available whenever you want it — produced or accessed instantly at the moment you need it.' },
      { word: 'Novelty', definition: 'Something new and unusual that attracts attention — but often loses interest quickly once the newness wears off.' },
      { word: 'Productivity', definition: 'The efficiency of completing tasks — how much useful work is done in a given period of time.' },
    ],
    questions: [
      { n: 10, q: 'Do you see holographic displays becoming common in homes?' },
      { n: 11, q: 'What would convince you to replace a normal screen with a holographic one?' },
      { n: 12, q: 'How might holograms change the way people work together remotely?' },
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

export default function HolographicDisplayPage() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b2" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B2 Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '72px', flexShrink: 0 }}>🔮</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: '#3b82f6', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B2 Upper Intermediate</span>
                <span style={{ background: 'rgba(139,92,246,0.6)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Technology</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>
                Holographic Display Gadgets
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>
                From science fiction to reality — explore how holographic technology is changing business, education, entertainment and everyday life.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[
              { icon: '📄', label: '4 reading parts' },
              { icon: '💬', label: '12 discussion questions' },
              { icon: '📚', label: '16 vocabulary words' },
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
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => speak(part.text.replace(/\n\n/g, ' '))}
                  style={{ background: part.color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 3px 10px ${part.color}40` }}>
                  ▶ Play Passage
                </button>
                <button onClick={stop}
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

            {/* Vocabulary */}
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
                        <button onClick={() => speak(v.word)} title={`Hear "${v.word}"`}
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
