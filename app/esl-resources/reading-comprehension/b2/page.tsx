'use client'
import Link from 'next/link'

const CATEGORIES = [
  {
    id: 'technology',
    title: 'Technology',
    emoji: '💻',
    description: 'AI, gadgets, wearables and the digital future',
    color: '#6366f1',
    lessons: [
      { id: 'ai-smart-glasses', title: 'Next-Gen AI Smart Glasses', emoji: '👓', description: 'A New Way to See the World', detail: 'Explore how AI-powered smart glasses are changing daily life, work, travel and social interaction.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
      { id: 'home-robots', title: 'AI-Powered Home Robots', emoji: '🤖', description: 'Living with Intelligent Machines', detail: 'Explore how AI robots are changing life at home, raising questions about privacy, trust and the future.', badges: ['4 parts', '12 questions'], color: '#8b5cf6' },
      { id: 'holographic-display', title: 'Holographic Display Gadgets', emoji: '🔮', description: 'From Science Fiction to Reality', detail: 'Explore how holographic technology is moving from science fiction into business, education and everyday life.', badges: ['4 parts', '12 questions'], color: '#14b8a6' },
      { id: 'facial-recognition', title: 'Facial Recognition Technology', emoji: '👁️', description: 'Identity, Privacy and Bias', detail: 'Explore how AI identifies faces — and the growing debate over privacy, accuracy, and government regulation.', badges: ['4 parts', '12 questions'], color: '#6366f1' },
      { id: 'ai-in-healthcare', title: 'Artificial Intelligence in Healthcare', emoji: '🏥', description: 'Can Machines Help Heal Us?', detail: 'Explore how AI is transforming diagnosis, treatment and medicine — and the ethical questions that come with it.', badges: ['4 parts', '12 questions'], color: '#0ea5e9' },
      { id: 'electric-vehicles', title: 'Electric Vehicles and the Future of Transport', emoji: '⚡', description: 'The Road Ahead', detail: 'Explore the rise of EVs, their environmental impact, infrastructure challenges, and what the future of transport might look like.', badges: ['4 parts', '12 questions'], color: '#0ea5e9' },
      { id: 'ai-and-humans', title: 'The Relationship Between AI and Humans', emoji: '🤖', description: 'Trust, Identity and Partnership', detail: 'How is AI reshaping trust, work, and human identity? Explore the black box problem, automation bias, what AI means for employment — and the case for genuine human-machine partnership.', badges: ['4 parts', '12 questions'], color: '#6366f1' },
    ]
  },
  {
  id: 'hidden-headlines',
  title: 'Hidden Headlines',
  emoji: '📰',
  description: 'Real stories from around the world that didn\'t make the headlines',
  color: '#0891b2',
  lessons: [
    { id: 'neil-the-seal', title: 'Neil the Seal — Australia\'s Most Inconvenient Celebrity', emoji: '🦭', description: 'A One-Tonne Problem Nobody Could Solve', detail: 'A one-tonne elephant seal decided to take up residence in a working Tasmanian harbour — and authorities discovered there was absolutely nothing they could do about it.', badges: ['4 parts', '12 questions'], color: '#0891b2' },
    { id: 'cockroach-kingpin', title: 'The Cockroach Kingpin', emoji: '🪳', description: 'Australia\'s Record Bug Bust', detail: 'Australian authorities raided a commercial breeder and seized over 100,000 illegal exotic insects — the largest invertebrate bust in the country\'s history.', badges: ['4 parts', '12 questions'], color: '#16a34a' },
    { id: 'pigeons-navigate-with-livers', title: 'Pigeons Navigate with Their Livers', emoji: '🐦', description: 'The Discovery Nobody Expected', detail: 'Scientists spent decades trying to solve how pigeons find their way home. The answer was hiding inside an organ nobody thought to look at.', badges: ['4 parts', '12 questions'], color: '#7c3aed' },
  ],
},
  {
    id: 'business',
    title: 'Business English',
    emoji: '💼',
    description: 'Negotiation, reporting, presentations and professional communication',
    color: '#f59e0b',
    lessons: [
      { id: 'negotiating-contracts', title: 'Negotiating Prices and Contracts', emoji: '🤝', description: 'The Art of the Deal', detail: 'Master the language, strategies and skills needed to negotiate effectively in professional business settings.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
      { id: 'explaining-reports', title: 'Explaining Data and Reports to Your Boss', emoji: '📊', description: 'From Numbers to Decisions', detail: 'Learn how to present findings clearly, structure reports for senior audiences, and make recommendations with confidence.', badges: ['4 parts', '12 questions'], color: '#0ea5e9' },
      { id: 'running-meetings', title: 'Running and Participating in Meetings', emoji: '🗓️', description: 'Say What You Mean', detail: 'Learn how to chair meetings confidently, contribute effectively as a participant, and follow up professionally.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
      { id: 'giving-presentations', title: 'Giving Presentations with Confidence', emoji: '🎤', description: 'Stand Up and Speak', detail: 'Learn how to structure, deliver and adapt professional presentations in English with clarity and confidence.', badges: ['4 parts', '12 questions'], color: '#8b5cf6' },
      { id: 'job-interviews', title: 'Job Interviews in English', emoji: '💼', description: 'Get the Job', detail: 'Master the preparation, language and strategies needed to succeed in professional job interviews in English.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
      { id: 'networking-small-talk', title: 'Networking and Small Talk at Events', emoji: '🍹', description: 'Work the Room', detail: 'Master the art of professional small talk, confident introductions, and building lasting connections at business events.', badges: ['4 parts', '12 questions'], color: '#f59e0b' },
      { id: 'multicultural-teams', title: 'Working in Multicultural Teams', emoji: '🌏', description: 'Beyond Borders', detail: 'Understand how culture shapes communication, hierarchy and trust at work, and how to make diverse teams thrive.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
      { id: 'giving-feedback', title: 'Giving and Receiving Feedback', emoji: '💬', description: 'The Gift of Honesty', detail: 'Master the language and skills needed to give useful feedback, receive it gracefully, and build a culture where teams improve together.', badges: ['4 parts', '12 questions'], color: '#f59e0b' },
      { id: 'professional-emails', title: 'Writing Professional Emails', emoji: '📧', description: 'Clear, Confident, Professional', detail: 'Master the structure, tone and strategies needed to write effective emails in any business context.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
      { id: 'managing-conflict', title: 'Managing Conflict at Work', emoji: '🕊️', description: 'From Tension to Resolution', detail: 'Understand what causes workplace conflict, how to address it professionally, and how to build teams that handle disagreement well.', badges: ['4 parts', '12 questions'], color: '#ef4444' },
      { id: 'business-jargon', title: 'Understanding Business Jargon', emoji: '🗣️', description: 'Synergy, Pivot, Low-Hanging Fruit', detail: 'Decode the most common corporate buzzwords, understand when jargon helps and when it hurts, and learn to communicate with real clarity.', badges: ['4 parts', '12 questions'], color: '#6366f1' },
      { id: 'salary-negotiation', title: 'Salary Negotiation', emoji: '💰', description: 'Know Your Worth', detail: 'Learn why most people don\'t negotiate, how to research your market value, and the exact language to use when asking for more money.', badges: ['4 parts', '12 questions'], color: '#22c55e' },
      { id: 'remote-work', title: 'Remote Work and the Future of Work', emoji: '🏠', description: 'Office, Home or Hybrid?', detail: 'Explore the remote work revolution — communication challenges, productivity, trust, wellbeing, and what the future workplace might look like.', badges: ['4 parts', '12 questions'], color: '#f59e0b' },
      { id: 'crisis-communication', title: 'Crisis Communication — Delivering Bad News', emoji: '📢', description: 'When Things Go Wrong', detail: 'Redundancies, project failures, corporate scandals — the language and strategies professionals need when delivering difficult news at work.', badges: ['4 parts', '12 questions'], color: '#d97706' },
    ]
  },
  {
    id: 'mystery',
    title: 'Mystery & the Unknown',
    emoji: '🔮',
    description: 'Unsolved puzzles, strange phenomena and the limits of human knowledge',
    color: '#8b5cf6',
    lessons: [
      { id: 'voynich-manuscript', title: 'The Voynich Manuscript', emoji: '📜', description: 'The Book Nobody Can Read', detail: 'A 600-year-old illustrated book in an unknown script that no cryptographer, linguist, or AI has ever been able to decipher.', badges: ['4 parts', '12 questions'], color: '#8b5cf6' },
      { id: 'time-slips', title: 'Time Slips', emoji: '⏳', description: 'Walking Into the Past', detail: 'People who claim to have briefly stepped into a different historical era — the cases, the witnesses, and what science makes of their accounts.', badges: ['4 parts', '12 questions'], color: '#7c3aed' },
      { id: 'dyatlov-pass-incident', title: 'The Dyatlov Pass Incident', emoji: '🏔️', description: 'Nine Hikers, One Unsolved Mystery', detail: 'In 1959, nine experienced Soviet hikers were found dead on a remote mountain slope. Their tent was cut open from the inside. No satisfactory explanation has ever been given.', badges: ['4 parts', '12 questions'], color: '#0ea5e9' },
{ id: 'spontaneous-human-combustion', title: 'Spontaneous Human Combustion', emoji: '🔥', description: 'Fact, Fiction, or Science?', detail: 'Bodies reduced to ash while surrounding furniture remains intact — a phenomenon that has baffled investigators for centuries, and what science says really happened.', badges: ['4 parts', '12 questions'], color: '#ef4444' },
{ id: 'wow-signal', title: 'The Wow! Signal', emoji: '📡', description: 'The Most Compelling Evidence of Alien Contact', detail: 'For 72 seconds in 1977, a radio telescope detected something from deep space that matched almost perfectly what an alien transmission would look like. It has never been detected again.', badges: ['4 parts', '12 questions'], color: '#6366f1' },
{ id: 'ancient-megalithic-structures', title: 'Ancient Megalithic Structures', emoji: '🗿', description: 'Stonehenge, Göbekli Tepe and Prehistoric Builders', detail: 'How did prehistoric peoples without wheels or writing move stones weighing hundreds of tonnes — and why did they build structures that would last thousands of years?', badges: ['4 parts', '12 questions'], color: '#16a34a' },
{ id: 'cryptids', title: 'Cryptids — Bigfoot, Nessie and Why People Keep Searching', emoji: '🦶', description: 'Hidden Creatures and Human Psychology', detail: 'Blurry photographs, enormous footprints, and the surprisingly deep psychology behind the search for animals science says don\'t exist.', badges: ['4 parts', '12 questions'], color: '#854d0e' },
{ id: 'simulation-theory', title: 'The Simulation Theory', emoji: '🌀', description: 'Are We Living Inside a Computer?', detail: 'A serious philosophical argument — endorsed by physicists and philosophers — that our entire reality may be a computational simulation running on an inconceivably powerful machine.', badges: ['4 parts', '12 questions'], color: '#06b6d4' },
    ]
  },
  {
    id: 'sports',
    title: 'Sports',
    emoji: '⚽',
    description: 'Football, competition and sporting culture',
    color: '#22c55e',
    lessons: [
      { id: 'world-cup-2026', title: 'FIFA World Cup 2026', emoji: '⚽', description: 'The Biggest Tournament in Football History', detail: 'Explore the build-up, the favorites, the pressure of expectations, and what fans around the world are saying.', badges: ['4 parts', '12 questions'], color: '#22c55e' },
      { id: 'olympics', title: 'The Olympic Games — History, Politics and the Modern Era', emoji: '🏅', description: 'Faster, Higher, Stronger', detail: 'Explore the ancient origins of the Olympics, how the Games were reborn in 1896, and the complex role they play in politics, identity, and society today.', badges: ['4 parts', '12 questions'], color: '#7C3AED' },
      { id: 'esports', title: 'Esports — Is Gaming a Real Sport?', emoji: '🎮', description: 'Controllers vs. Goalposts', detail: 'Explore the explosive rise of competitive gaming, the arguments for and against calling it a sport, and what it means for the future of competition.', badges: ['4 parts', '12 questions'], color: '#8b5cf6' },
      { id: 'formula1-boom', title: "Formula 1's Global Boom", emoji: '🏎️', description: 'From Niche to Netflix', detail: 'Explore how Drive to Survive, new races, and the sport\'s human drama transformed F1 from a European institution into a global phenomenon.', badges: ['4 parts', '12 questions'], color: '#ef4444' },
      { id: 'womens-football', title: "The Rise of Women's Football", emoji: '⚽', description: 'Equal Game', detail: "Explore how women's football went from the margins to the global stage, and the ongoing debates about pay, investment, and the future of the sport.", badges: ['4 parts', '12 questions'], color: '#8b5cf6' },
      { id: 'var-football', title: 'VAR and Technology in Football', emoji: '📺', description: 'Did Tech Fix the Beautiful Game?', detail: 'Explore the controversy, the arguments for and against VAR, and what its troubled history tells us about technology and sport.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
    ]
  },
  {
    id: 'society',
    title: 'Society & Culture',
    emoji: '🌍',
    description: 'People, communities and social change',
    color: '#f59e0b',
    lessons: [
      { id: 'online-learning', title: 'Online Learning Platforms', emoji: '💻', description: 'The Future of Education', detail: 'Explore how online platforms are changing education — flexibility, access, challenges and what comes next.', badges: ['4 parts', '12 questions'], color: '#f59e0b' },
    ]
  },
  { id: 'environment', title: 'Environment', emoji: '🌿', description: 'Climate, sustainability and the natural world', color: '#16a34a', lessons: [], comingSoon: true },
  { id: 'health', title: 'Health & Science', emoji: '🔬', description: 'Medicine, wellbeing and scientific discovery', color: '#ef4444', lessons: [], comingSoon: true },
  {
    id: 'work',
    title: 'Work & Economics',
    emoji: '📈',
    description: 'Careers, economics and the modern workplace',
    color: '#6366f1',
    lessons: [
      { id: 'income-inequality', title: 'Income Inequality', emoji: '💸', description: 'Is the Gap Between Rich and Poor Too Wide?', detail: 'Explore the causes and consequences of growing income inequality and the debate over what should be done about it.', badges: ['4 parts', '12 questions'], color: '#6366f1' },
      { id: 'university-degree', title: 'Is a University Degree Still Worth It?', emoji: '🎓', description: 'Degree or No Degree?', detail: 'Explore the rising cost of university, the arguments for and against a degree, and what the future of qualifications might look like.', badges: ['4 parts', '12 questions'], color: '#f59e0b' },
      { id: 'digital-nomad-economy', title: 'The Digital Nomad Economy', emoji: '🌍', description: 'Work from Anywhere', detail: 'Explore the rise of location-independent work, its impact on cities and communities, and what the future holds for remote workers worldwide.', badges: ['4 parts', '12 questions'], color: '#3b82f6' },
      { id: 'sea-tech-hub', title: 'The Rise of Southeast Asia as a Tech Hub', emoji: '🌏', description: 'Silicon Valley of the East', detail: 'Explore how Singapore, Vietnam, Indonesia, and Thailand are building world-class tech industries, with Grab, Gojek, and Sea Group leading the way.', badges: ['4 parts', '12 questions'], color: '#22c55e' },
    ]
  },
]

export default function B2ReadingHub() {
  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Reading Comprehension</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>B2</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>UPPER INT.</div>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' }}>B2 — Upper Intermediate</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 12px', lineHeight: '1.5', maxWidth: '520px' }}>Complex texts on current topics. Students can understand detailed arguments and express opinions with confidence.</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Complex arguments', 'Critical thinking', 'Opinion & debate', 'IELTS 5.5–7.0'].map(tag => (
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
                  <Link key={lesson.id} href={`/esl-resources/reading-comprehension/b2/${lesson.id}`} style={{ textDecoration: 'none' }}>
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
