'use client'
import Link from 'next/link'

const CATEGORIES = [
  {
    id: 'health',
    title: 'Health & Science',
    emoji: '🔬',
    description: 'Medicine, the body and scientific discoveries',
    color: '#0ea5e9',
    lessons: [
      { id: 'wearable-health-monitors', title: 'Wearable Health Monitors', emoji: '⌚', description: 'Technology on Your Wrist', detail: 'Explore how smartwatches and fitness trackers are changing personal health monitoring and the future of medicine.', badges: ['4 parts', '12 questions'], color: '#0ea5e9' },
    ],
  },
  {
    id: 'society',
    title: 'Society & Culture',
    emoji: '🌍',
    description: 'People, communities, culture and how the world works',
    color: '#f97316',
    lessons: [
      { id: 'indigenous-peoples', title: 'Indigenous Peoples of the World', emoji: '🌍', description: 'Culture, Land and Identity', detail: "Learn about the world's first peoples, the challenges they face, and why their cultures matter to all of us.", badges: ['4 parts', '12 questions'], color: '#f97316' },
      { id: 'global-events-oil-prices', title: 'Global Events and Oil Prices', emoji: '🛢️', description: 'Why Prices Change Around the World', detail: 'Understand how wars, economies, and clean energy affect the cost of oil and everyday life.', badges: ['4 parts', '12 questions'], color: '#f97316' },
      { id: 'running-of-the-bulls', title: 'The Running of the Bulls', emoji: '🐂', description: 'Tradition or Cruelty?', detail: 'Every July, thousands run through the streets of Pamplona chased by angry bulls. Is it a treasured cultural tradition or animal cruelty that should be banned?', badges: ['4 parts', '12 questions'], color: '#ea580c' },
{ id: 'david-attenborough-at-100', title: 'David Attenborough at 100', emoji: '🌿', description: 'The Man Who Showed Us the Natural World', detail: 'At 100 years old, Sir David Attenborough just became the oldest ever Emmy nominee. How one man changed the way the entire world sees nature — and why it matters.', badges: ['4 parts', '12 questions'], color: '#16a34a' },
{ id: 'climate-change-everyday-life', title: 'Climate Change and Everyday Life', emoji: '🌡️', description: 'How a Warming World Affects Us All', detail: 'Understand how climate change impacts food, weather, health and daily life around the world — and what ordinary people can do about it.', badges: ['4 parts', '12 questions'], color: '#f97316' },
{ id: 'social-media-mental-health', title: 'Social Media and Mental Health', emoji: '📱', description: 'The Hidden Cost of Being Online', detail: 'How does social media affect our mental health, self-esteem and relationships? Explore the science and the debate.', badges: ['4 parts', '12 questions'], color: '#f97316' },
{ id: 'tourism', title: 'Tourism', emoji: '✈️', description: 'Travel, Culture and the Impact on Communities', detail: 'Explore the benefits and problems of global tourism — and what responsible travel really looks like.', badges: ['4 parts', '12 questions'], color: '#f97316' },
    ],
  },
  {
  id: 'nature',
  title: 'Nature & Animals',
  emoji: '🐾',
  description: 'Wildlife, ecosystems and the natural world',
  color: '#0ea5e9',
  lessons: [
    { id: 'sharks', title: 'Sharks — Misunderstood Predators', emoji: '🦈', description: 'The Truth About the Ocean\'s Most Feared Fish', detail: 'Discover the amazing facts about sharks — their incredible abilities, the truth about attacks, and why these ancient animals desperately need our protection.', badges: ['4 parts', '12 questions'], color: '#0ea5e9' },
    { id: 'animal-migrations', title: 'Incredible Animal Migrations', emoji: '🦋', description: 'How Animals Travel Thousands of Kilometres Without GPS', detail: 'Arctic terns, monarch butterflies, wildebeest, and humpback whales — how do animals travel thousands of kilometres every year without maps or anyone showing them the way?', badges: ['4 parts', '12 questions'], color: '#059669' },
  ],
},
{
  id: 'science',
  title: 'Science & Space',
  emoji: '🔭',
  description: 'How things work, space exploration and scientific discoveries',
  color: '#8b5cf6',
  lessons: [
    { id: 'the-moon', title: 'The Moon', emoji: '🌕', description: 'How It Formed, Why It Glows, and Walking on It', detail: 'Discover how the Moon was born from a giant collision, why it appears to glow, and what it was really like for astronauts to walk on another world.', badges: ['4 parts', '12 questions'], color: '#8b5cf6' },
    { id: 'volcanoes', title: 'Volcanoes — Mountains That Explode', emoji: '🌋', description: 'How They Work and Famous Eruptions', detail: 'How do volcanoes form? What buried the city of Pompeii? And why do millions of people choose to live next to them?', badges: ['4 parts', '12 questions'], color: '#ef4444' },
{ id: 'why-do-we-dream', title: 'Why Do We Dream?', emoji: '💭', description: 'What Happens Inside Your Brain at Night', detail: 'Every night your brain creates its own private movie. Discover what happens when we sleep, why scientists think we dream, and the incredible world of lucid dreaming.', badges: ['4 parts', '12 questions'], color: '#6366f1' },
  ],
},
  {
    id: 'mystery',
    title: 'Mystery & the Unknown',
    emoji: '🔮',
    description: 'Aliens, spirits, supernatural phenomena and the unexplained',
    color: '#8b5cf6',
    lessons: [
      { id: 'do-aliens-exist', title: 'Do Aliens Really Exist?', emoji: '👽', description: 'From Ancient Mysteries to Modern Science', detail: 'Explore the history of UFO sightings, what scientists are searching for in space, and what alien life might actually look like.', badges: ['4 parts', '12 questions'], color: '#6366f1' },
{ id: 'mediums-talking-to-dead', title: 'Mediums — Can People Really Talk to the Dead?', emoji: '👻', description: 'Spirits, Science and Belief', detail: 'Explore the world of mediums, séances, and spiritual communication — what do people believe, and what does science say?', badges: ['4 parts', '12 questions'], color: '#8b5cf6' },
{ id: 'ghosts', title: 'Ghosts — Do They Really Exist?', emoji: '🏚️', description: 'Hauntings, History and Science', detail: 'Stories of the supernatural, famous hauntings around the world, and what science says about things that go bump in the night.', badges: ['4 parts', '12 questions'], color: '#7c3aed' },
{ id: 'near-death-experiences', title: 'Near-Death Experiences', emoji: '✨', description: 'Tunnels of Light and Life After Death', detail: 'Tunnels of light, meetings with the dead, and out-of-body journeys — what really happens when we come close to death?', badges: ['4 parts', '12 questions'], color: '#6d28d9' },
{ id: 'bermuda-triangle', title: 'The Bermuda Triangle', emoji: '🔺', description: 'Ships and Planes That Vanish Without Trace', detail: 'Is the Bermuda Triangle really more dangerous than any other part of the ocean? Explore the famous disappearances, the theories, and what the evidence actually shows.', badges: ['4 parts', '12 questions'], color: '#4c1d95' },
    ],
  },
  {
    id: 'sport',
    title: 'Sport & Society',
    emoji: '⚽',
    description: 'Sport, competition and what it tells us about the world',
    color: '#ef4444',
    lessons: [
      { id: 'chinese-football', title: 'Chinese Football', emoji: '⚽', description: 'Big Spending, Big Dreams, Big Problems', detail: 'From the most expensive league in the world to financial collapse — explore the rise and fall of Chinese football spending and the national team today.', badges: ['4 parts', '12 questions'], color: '#ef4444' },
    ],
  },
  {
    id: 'work',
    title: 'Work & Careers',
    emoji: '💼',
    description: 'Jobs, skills and the modern workplace',
    color: '#6b7280',
    lessons: [
      { id: 'working-from-home', title: 'Working from Home', emoji: '🏠', description: 'The Future of How We Work', detail: 'How the pandemic changed work forever — the benefits, the challenges, and whether offices will ever be the same.', badges: ['4 parts', '12 questions'], color: '#6b7280' },
    ],
  },
]

export default function B1ReadingHub() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>B1</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>INTERMEDIATE</div>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' }}>B1 — Intermediate</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 12px', lineHeight: '1.5', maxWidth: '520px' }}>Engaging texts on real-world topics. Students can understand main ideas and give opinions on familiar subjects.</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Real-world topics', 'Opinion & discussion', 'Vocabulary building', 'IELTS 4.0–5.5'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            {['✍️ Highlight any text', '🌍 13-language translation', '🤖 AI conversation partner', '🎤 Push-to-talk voice', '🔊 4-speed audio', '🔊 Natural AI voice'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {CATEGORIES.map(cat => (
          <div key={cat.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: `3px solid ${cat.color}` }}>
              <div style={{ background: cat.color, width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{cat.emoji}</div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{cat.title}</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{cat.description}</p>
              </div>
              {(cat as any).comingSoon ? (
                <span style={{ marginLeft: 'auto', background: '#f3f4f6', color: '#9ca3af', fontSize: '13px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', flexShrink: 0 }}>Coming soon</span>
              ) : (
                <span style={{ marginLeft: 'auto', background: cat.color + '15', color: cat.color, fontSize: '13px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', flexShrink: 0 }}>{cat.lessons.length} lesson{cat.lessons.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {cat.lessons.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
                {cat.lessons.map(lesson => (
                  <Link key={lesson.id} href={`/esl-resources/reading-comprehension/b1/${lesson.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}>
                      <div style={{ background: `linear-gradient(135deg, ${lesson.color}22, ${lesson.color}08)`, borderBottom: `3px solid ${lesson.color}`, padding: '22px 20px 16px' }}>
                        <div style={{ fontSize: '44px', marginBottom: '10px' }}>{lesson.emoji}</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 5px', lineHeight: '1.3' }}>{lesson.title}</h3>
                        <p style={{ color: lesson.color, fontSize: '13px', fontWeight: '700', margin: 0 }}>{lesson.description}</p>
                      </div>
                      <div style={{ padding: '16px 20px', flex: 1 }}>
                        <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.65', margin: '0 0 14px' }}>{lesson.detail}</p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {lesson.badges.map(b => (
                            <span key={b} style={{ background: '#f3f4f6', color: '#555', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}>{b}</span>
                          ))}
                          <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}>🤖 AI + 🌍 Translation</span>
                        </div>
                      </div>
                      <div style={{ padding: '0 20px 20px' }}>
                        <div style={{ background: lesson.color, color: 'white', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', textAlign: 'center' }}>Open Lesson →</div>
                      </div>
                    </div>
                  </Link>
                ))}
                <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', minHeight: '200px' }}>
                  <div style={{ fontSize: '36px' }}>✍️</div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>More {cat.title} lessons coming soon</div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '40px', opacity: 0.4 }}>{cat.emoji}</div>
                <div>
                  <div style={{ color: '#9ca3af', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{cat.title} lessons in development</div>
                  <div style={{ color: '#d1d5db', fontSize: '14px' }}>Check back soon — new lessons are added regularly</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
