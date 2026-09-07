'use client'
import Link from 'next/link'
import { useState } from 'react'

function NewBadge({ publishedDate }: { publishedDate?: string }) {
  if (!publishedDate) return null
  const published = new Date(publishedDate)
  const now = new Date()
  const diffDays = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays > 7) return null
  return (
    <span style={{
      position: 'absolute', top: '12px', right: '12px',
      background: 'linear-gradient(135deg, #ef4444, #f97316)',
      color: 'white', fontSize: '11px', fontWeight: '800',
      padding: '4px 10px', borderRadius: '20px',
      textTransform: 'uppercase', letterSpacing: '1px',
      boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
      animation: 'pulse 2s infinite',
    }}>🔥 New</span>
  )
}

function isThisWeek(dateStr?: string) {
  if (!dateStr) return false
  const published = new Date(dateStr)
  const now = new Date()
  const diffDays = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 7
}


function ExpiryBadge({ publishedDate }: { publishedDate?: string }) {
  if (!publishedDate) return null
  const published = new Date(publishedDate)
  const expires = new Date(published.getTime() + 7 * 24 * 60 * 60 * 1000)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const label = months[expires.getMonth()] + ' ' + expires.getDate()
  return (
    <span style={{
      position: 'absolute', bottom: '12px', right: '12px',
      background: '#fef2f2', color: '#991b1b',
      fontSize: '10px', fontWeight: '700',
      padding: '3px 8px', borderRadius: '12px',
      border: '1px solid #fecaca',
    }}>Expires: {label}</span>
  )
}

function getWeekLabel(dateStr: string) {
  const d = new Date(dateStr)
  const start = new Date(d)
  start.setDate(start.getDate() - start.getDay() + 1)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return months[start.getMonth()] + ' ' + start.getDate() + ' - ' + months[end.getMonth()] + ' ' + end.getDate()
}

function WeeklyArchive({ lessons, catColor, level }: { lessons: any[], catColor: string, level: string }) {
  const [openWeek, setOpenWeek] = useState<string | null>(null)
  const pastLessons = lessons.filter((l: any) => l.publishedDate && !isThisWeek(l.publishedDate))
  if (pastLessons.length === 0) return null
  
  const weeks: Record<string, any[]> = {}
  pastLessons.forEach((l: any) => {
    const key = getWeekLabel(l.publishedDate)
    if (!weeks[key]) weeks[key] = []
    weeks[key].push(l)
  })
  
  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#6b7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>📂</span> Previous Weeks
      </div>
      {Object.entries(weeks).reverse().map(([week, items]) => (
        <div key={week} style={{ marginBottom: '8px' }}>
          <button onClick={() => setOpenWeek(openWeek === week ? null : week)} style={{ width: '100%', textAlign: 'left', background: openWeek === week ? '#fef2f2' : '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            <span>📰 {week} <span style={{ color: '#9ca3af', fontWeight: '400' }}>({items.length} {items.length === 1 ? 'story' : 'stories'})</span></span>
            <span style={{ fontSize: '18px', color: '#9ca3af', transform: openWeek === week ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
          </button>
          {openWeek === week && (
            <div style={{ padding: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {items.map((lesson: any) => (
                <Link key={lesson.id} href={'/esl-resources/reading-comprehension/' + level + '/' + lesson.id} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fef2f2' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'white' }}>
                    <span style={{ fontSize: '24px' }}>{lesson.emoji}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e' }}>{lesson.title}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{lesson.description}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: catColor, fontWeight: '600' }}>Open →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const CATEGORIES = [
  {
    id: 'weekly-news',
    title: "This Week's News",
    emoji: '📰',
    description: 'Real stories from this week — updated regularly',
    color: '#dc2626',
    weeklyNews: true,
    lessons: [
      { id: 'uefa-vs-fifa', title: 'UEFA Threatens to Boycott FIFA', emoji: '⚽', description: 'The Battle for Football\'s Future', detail: 'UEFA voted to boycott all FIFA competitions after Infantino proposed selling World Cup stakes to private investors. The biggest governance crisis in football history.', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-08-03' },
      { id: 'rise-of-populism', title: 'Colombia and the Global Rise of Populism', emoji: '🗳️', description: 'Why Voters Are Choosing Radical Leaders', detail: 'Colombia elected a far-right president this week, joining a global wave of populism. Why are voters choosing radical leaders, and what does it mean for democracy?', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-08-03' },
      { id: 'uk-new-pm', title: 'Britain Gets Its 7th PM in a Decade', emoji: '🇬🇧', description: 'Andy Burnham and the Post-Brexit Crisis', detail: 'Andy Burnham became the UK\'s seventh prime minister in ten years. Why can\'t Britain keep a leader, what went wrong after Brexit, and can Burnham break the cycle?', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-08-03' },
      { id: 'eu-migration-emergency', title: 'The EU Migration Emergency', emoji: '🌍', description: 'Policy Failure, Political Weapons, and No Easy Answers', detail: 'After 60,000 people crossed into Ceuta, the EU called an emergency meeting. But does Europe have any real answers — or just more fences?', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-08-03' },
      { id: 'ai-alignment-crisis', title: 'When AI Goes Rogue — The Alignment Crisis', emoji: '🤖', description: 'The Transparency Paradox and the Regulation Race', detail: 'AI models hacked computers without being asked. The alignment problem, the transparency paradox, and the global race to regulate the most powerful technology ever created.', badges: ['4 parts', '12 questions'], color: '#7f1d1d', publishedDate: '2026-08-03' },
      { id: 'gaza-disarmament-deal', title: 'The Gaza Disarmament Deal — Can It Work?', emoji: '🕊️', description: 'A Historic Agreement or an Illusion?', detail: 'Trump announced a historic deal for Hamas to disarm. But Israel and Hamas disagree on the terms. Can a deal built on distrust actually deliver peace?', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-08-04' },
      { id: 'china-economic-slowdown', title: 'China\'s Factory Slowdown and the AI Race', emoji: '🏭', description: 'When the World\'s Factory Goes Quiet', detail: 'Chinese factories are slowing, youth unemployment is rising, and Beijing is betting everything on AI. What went wrong, and what does it mean for the world?', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-08-04' },
      { id: 'library-book-150-years', title: 'Library Book Returned 150 Years Late', emoji: '📚', description: 'Found Bricked Into a Fireplace', detail: 'A book checked out 150 years ago was found bricked into a fireplace. The quirky story that sparked a global conversation about libraries, reading, and what lasts.', badges: ['4 parts', '12 questions'], color: '#d97706', publishedDate: '2026-08-04' },
      { id: 'nolan-odyssey', title: "Nolan's Odyssey — When Hollywood Meets Homer", emoji: '🎬', description: 'A 3,000-Year-Old Blockbuster', detail: "Christopher Nolan turned a 2,800-year-old Greek poem into one of the biggest films of 2026. Why ancient stories still fill cinemas and what The Odyssey tells us about being human.", badges: ['4 parts', '12 questions'], color: '#d97706', publishedDate: '2026-08-05' },
      { id: 'dallas-yall-street', title: 'Dallas Becomes "Y\'all Street"', emoji: '🤠', description: 'Wall Street Moves South', detail: "Goldman Sachs is building a massive campus in Dallas as Wall Street moves south. Why companies are leaving New York and what it means for the future of work.", badges: ['4 parts', '12 questions'], color: '#b45309', publishedDate: '2026-08-05' },
      { id: 'hormuz-crisis', title: 'The Strait of Hormuz Crisis', emoji: '🚢', description: 'The Chokepoint That Controls Global Oil', detail: "Iran and Oman reached a deal on shipping through the world\'s most important waterway. Why one narrow strait controls 25% of global oil and what happens when it closes.", badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-08-07' },
      { id: 'greece-wildfire-satellites', title: 'Greece Uses AI Satellites to Fight Wildfires', emoji: '🛰️', description: 'Fighting Fire with Technology', detail: 'Greece tested a satellite system that detects wildfires within minutes using AI. The Mediterranean fire crisis and why prevention still matters most.', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-08-07' },
      { id: 'el-nino-hunger', title: 'El Nino Could Push 50 Million Into Hunger', emoji: '🌾', description: 'The Invisible Disaster', detail: 'The UN warns El Nino could drive 50 million people into acute hunger by 2027. How a weather pattern in the Pacific breaks the global food chain.', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-08-07' },
      { id: 'us-strikes-iran-tankers', title: 'US Strikes Three Iranian Oil Tankers', emoji: '🛢️', description: 'Fire on the Water', detail: 'The US Navy attacked Iranian oil tankers. Iran fired missiles at US warships. The naval war is escalating and the world economy is paying.', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-09-07' },
      { id: 'syria-chemical-weapons', title: 'Syria Destroys Assad Chemical Weapons', emoji: '🧪', description: 'Destroying the Evidence', detail: 'Syria new government is dismantling Assad chemical weapons. The red line that was not, why chemical weapons are different, and can Syria start again?', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-09-07' },
      { id: 'real-size-countries-map', title: 'Countries Are Not the Size You Think', emoji: '🗺️', description: 'Everything You Know Is Wrong', detail: 'A new world map reveals Africa is 14 times bigger than Greenland. How maps distort reality and why it matters more than you think.', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-09-07' },
      { id: 'germany-afd-tiktok', title: 'Germany Far-Right AfD Rises on TikTok', emoji: '🇩🇪', description: 'The Algorithm Governor', detail: 'Germany could get its first far-right governor since WWII, fuelled by TikTok. Social media, populism, and why history is watching.', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-09-05' },
      { id: 'diesel-prices-record', title: 'Diesel Prices Hit an All-Time Record', emoji: '⛽', description: 'The Fuel That Runs the World', detail: 'Diesel prices hit record highs driven by the Iran war and attacks on Russian refineries. Why diesel matters more than petrol and who pays.', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-09-05' },
      { id: 'ai-superintelligence-ban', title: 'US Lawmakers Propose Ban on Superintelligent AI', emoji: '🤖', description: 'Banning the Future', detail: 'As GPT-6 launches, lawmakers propose banning superintelligence. Can you ban a technology that does not exist yet, and should you try?', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-09-05' },
      { id: 'openai-shooting-lawsuit', title: 'OpenAI Sued Over Canadian Mass Shooting', emoji: '⚠️', description: 'The Chatbot That Knew', detail: 'Lawsuits claim OpenAI executives chose image over safety when their chatbot showed warning signs before a shooting. AI responsibility and its limits.', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-09-03' },
      { id: 'russia-iran-alliance', title: 'Russia and Iran Deepen Military Alliance', emoji: '🤝', description: 'The Enemy of My Enemy', detail: 'Putin pledged continued support for Iran against the US. What the Russia-Iran axis means for Ukraine, energy markets, and the world order.', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-09-03' },
      { id: 'malta-journalist-acquitted', title: 'Malta Journalist Murder — Acquittal Shocks Europe', emoji: '📰', description: 'The Reporter Who Knew Too Much', detail: 'A businessman acquitted of ordering a journalist car-bomb murder. Press freedom, corruption, and what happens when the powerful escape justice.', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-09-03' },
      { id: 'us-venezuela-oil-deal', title: 'US-Venezuela Oil Deal — 65 Billion Barrels', emoji: '🛢️', description: 'Blood for Oil', detail: "Trump announced a deal for majority control of Venezuelan oil. The resource curse, Venezuela\'s collapse, and who really benefits.", badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-09-01' },
      { id: 'nepal-floods-climate-b2', title: 'Nepal Floods — The Glacier Time Bomb', emoji: '🏔️', description: 'Climate Injustice in the Himalayas', detail: 'Catastrophic floods killed hundreds in Nepal. Glacial lakes, climate injustice, and why polluting countries must pay for the consequences.', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-09-01' },
      { id: 'uber-drone-delivery', title: 'Uber Eats Drone Delivery Is Coming', emoji: '🛩️', description: 'Your Food Is Flying', detail: 'Uber will test autonomous drone delivery this year — food in 10 minutes. The last mile problem, drones over your head, and the automated future.', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-09-01' },
      { id: 'alien-signals-hiding', title: 'Alien Signals Hiding in Unexplored Frequencies', emoji: '📡', description: 'Listening on the Wrong Channel', detail: 'We have searched less than 1% of the radio spectrum for alien signals. A new study says we may have been listening on the wrong channel all along.', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-08-27' },
      { id: 'sequoias-need-fire', title: 'Giant Sequoias Need More Fire to Survive', emoji: '🌲', description: 'The Trees That Need to Burn', detail: 'Trees that survived 3,000 years are dying because we stopped the fires they need. Indigenous knowledge, prescribed burning, and lessons about resilience.', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-08-27' },
      { id: 'gut-microbiome-medications', title: 'Your Medications Change Your Gut Forever', emoji: '🦠', description: 'The Invisible Ecosystem Inside You', detail: 'Common medications reshape your gut microbiome permanently. 38 trillion organisms inside you, the gut-brain axis, and why you are a community, not an individual.', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-08-27' },
      { id: 'iran-ceasefire-collapses', title: 'US-Iran Ceasefire Collapses', emoji: '💥', description: 'Back on a War Footing', detail: 'The 60-day ceasefire expired. Trump told Iran to surrender. Iran declared offensive posture. Economic warfare, regional fallout, and what comes next.', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-08-25' },
      { id: 'sudan-forgotten-crisis', title: 'Sudan — The Crisis Nobody Sees', emoji: '🇸🇩', description: '14 Million Displaced and the World Looks Away', detail: '14 million displaced, famine spreading, and the world barely watches. Why some crises get attention and others do not.', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-08-25' },
      { id: 'afghan-american-congress', title: 'First Afghan American in Congress', emoji: '🗳️', description: 'Making History', detail: 'Aisha Wahab became the first Afghan American in Congress. Why representation matters, the immigrant story, and the American promise.', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-08-25' },
      { id: 'israel-gaza-investigation', title: 'Israel Investigates Troop Conduct in Gaza', emoji: '⚖️', description: 'A Five-Year-Old Named Hind', detail: "Israel opened its first criminal investigations into soldier conduct in Gaza, including the killing of 5-year-old Hind Rajab. The law of war and why accountability matters.", badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-08-21' },
      { id: 'mars-eclipse-rover', title: 'Mars Rover Watches an Eclipse', emoji: '🔴', description: 'Two Eclipses, Two Worlds', detail: "While Earth watched the solar eclipse, NASA Perseverance rover filmed one on Mars. Organic molecules, Martian moons, and why we explore.", badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-08-21' },
      { id: 'ebola-drc-outbreak', title: 'Ebola Returns — 4,000 Cases in the DRC', emoji: '🦠', description: 'The Virus That Keeps Coming Back', detail: 'The DRC has 4,000 Ebola cases — the worst since 2014. Why the virus keeps returning, why the DRC is uniquely vulnerable, and what the world must learn.', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-08-18' },
      { id: 'crimea-drone-war', title: 'Ukrainian Drones Are Changing the War', emoji: '🔋', description: 'Death by a Thousand Drones', detail: 'Cheap drones cause power outages across Crimea. The drone revolution, the ethics of targeting infrastructure, and what it means for the future of war.', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-08-18' },
      { id: 'greenland-oil-drilling', title: 'Oil Drilling in Greenland — The Last Frontier', emoji: '🧊', description: 'Should Some Places Be Off Limits?', detail: 'A Trump-linked company prepares to drill in Greenland. The Arctic gold rush, indigenous sovereignty, and whether the last frontier should be protected.', badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-08-18' },
      { id: 'colombia-earthquake-b2', title: 'Colombia Earthquake — A Preventable Catastrophe', emoji: '🏚️', description: 'Why Earthquakes Kill the Poorest', detail: 'A 7.4 earthquake killed 265 in Colombia. Japan survives far worse. The uncomfortable truth about why the victims are always the poorest.', badges: ['4 parts', '12 questions'], color: '#dc2626', publishedDate: '2026-08-10' },
      { id: 'turkey-kurdish-peace-b2', title: 'Turkey-Kurdish Peace — The Price of Peace', emoji: '⚖️', description: 'Amnesty, Justice, and Lessons from History', detail: 'Turkey voted to pardon Kurdish fighters. The amnesty question, lessons from South Africa and Colombia, and what lasting peace requires.', badges: ['4 parts', '12 questions'], color: '#991b1b', publishedDate: '2026-08-10' },
      { id: 'eclipse-economics-b2', title: 'The Eclipse — Economics, Science, and Awe', emoji: '🌑', description: '300 Million Euros of Darkness', detail: "Today's eclipse generated 300M euros in tourism, crashed solar grids, and made strangers weep. The economics, science, and psychology of looking up.", badges: ['4 parts', '12 questions'], color: '#b91c1c', publishedDate: '2026-08-10' },
      { id: 'star-ate-planet', title: 'A Star That Ate Its Own Planet', emoji: '⭐', description: 'Cosmic Cannibalism and Why It Matters', detail: 'Astronomers found a star with a chemical fingerprint proving it swallowed one of its own planets. The wonderfully absurd discovery and why space stories matter.', badges: ['4 parts', '12 questions'], color: '#f59e0b', publishedDate: '2026-08-04' },
    ],
  },
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
      { id: 'deepfakes', title: 'Deepfakes — When You Cannot Believe What You See', emoji: '🎭', description: 'AI, Truth, and the Death of Trust', detail: 'AI can now create fake videos so realistic that even experts struggle to tell them from the real thing. What does this mean for truth, trust, and democracy?', badges: ['4 parts', '12 questions'], color: '#6366f1', publishedDate: '2026-07-28' },
      { id: 'brain-computer-interfaces', title: 'Brain-Computer Interfaces', emoji: '🧠', description: 'Connecting Minds to Machines', detail: 'Chips in brains, thoughts controlling computers, paralysed patients typing with their minds. The technology that connects human brains directly to machines is no longer science fiction.', badges: ['4 parts', '12 questions'], color: '#0891b2', publishedDate: '2026-07-28' },
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
      { id: 'leadership-and-delegation', title: 'Leadership and Delegation', emoji: '👔', description: 'How to Lead a Team and Get the Best from People', detail: 'Great leaders don\'t do everything themselves — master the language of leading teams, delegating tasks, and building trust across cultures.', badges: ['4 parts', '12 questions'], color: '#d97706', publishedDate: '2026-07-27' },
      { id: 'handling-customer-complaints', title: 'Handling Customer Complaints', emoji: '🤝', description: 'Turning Problems into Opportunities', detail: 'An angry customer is not a disaster — it is an opportunity. Learn the professional language and psychology of turning complaints into loyalty.', badges: ['4 parts', '12 questions'], color: '#ca8a04', publishedDate: '2026-07-27' },
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
      { id: 'loneliness-epidemic', title: 'The Loneliness Epidemic', emoji: '😔', description: 'Why More People Feel Alone Than Ever', detail: 'Loneliness is as dangerous as smoking 15 cigarettes a day. Why the most connected generation in history is also the loneliest — and what can be done.', badges: ['4 parts', '12 questions'], color: '#d97706', publishedDate: '2026-07-28' },
      { id: 'cancel-culture', title: 'Cancel Culture — Justice or Mob Rule?', emoji: '📢', description: 'Accountability, Public Shaming, and Where the Line Is', detail: 'When does holding people responsible become mob justice? The debate that divides opinion on free speech, consequences, and the power of social media.', badges: ['4 parts', '12 questions'], color: '#b45309', publishedDate: '2026-07-28' },
      { id: 'global-housing-crisis', title: 'The Global Housing Crisis', emoji: '🏠', description: 'Why Young People Cannot Afford Homes', detail: 'From London to Sydney to Bangkok — why house prices have risen so far that an entire generation is locked out of home ownership.', badges: ['4 parts', '12 questions'], color: '#92400e', publishedDate: '2026-07-28' },
      { id: 'fake-news', title: 'Fake News and How to Spot It', emoji: '📰', description: 'Why Misinformation Spreads and How to Fight It', detail: 'False stories spread six times faster than true ones. Who creates fake news, why it works, and the practical skills you need to tell real from fake.', badges: ['4 parts', '12 questions'], color: '#b45309', publishedDate: '2026-07-28' },
      { id: 'changing-families', title: 'The Changing Shape of Families', emoji: '👨‍👩‍👧‍👦', description: 'What Family Means Now', detail: 'Single parents, same-sex couples, child-free by choice, and multigenerational households — how family has changed, why, and what children actually need.', badges: ['4 parts', '12 questions'], color: '#d97706', publishedDate: '2026-07-28' },
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
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
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
                <span style={{ marginLeft: 'auto', background: cat.color + '15', color: cat.color, fontSize: '13px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', flexShrink: 0 }}>{(cat as any).weeklyNews ? cat.lessons.filter(l => isThisWeek((l as any).publishedDate)).length : cat.lessons.length} lesson{((cat as any).weeklyNews ? cat.lessons.filter(l => isThisWeek((l as any).publishedDate)).length : cat.lessons.length) !== 1 ? 's' : ''}</span>
              )}
            </div>

            {cat.lessons.length > 0 ? (
              <><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
                {((cat as any).weeklyNews ? cat.lessons.filter(l => isThisWeek((l as any).publishedDate)) : cat.lessons).map(lesson => (
                  <Link key={lesson.id} href={`/esl-resources/reading-comprehension/b2/${lesson.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}>
                      <div style={{ background: `linear-gradient(135deg, ${lesson.color}22, ${lesson.color}08)`, borderBottom: `3px solid ${lesson.color}`, padding: '22px 20px 16px', position: 'relative' }}>
                        <NewBadge publishedDate={(lesson as any).publishedDate} />
                      {(cat as any).weeklyNews && <ExpiryBadge publishedDate={(lesson as any).publishedDate} />}
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
                  <div style={{ fontSize: '36px' }}>{(cat as any).weeklyNews ? '📰' : '✍️'}</div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>{(cat as any).weeklyNews ? 'Check back next week for new stories!' : `More ${cat.title} lessons coming soon`}</div>
                </div>
              </div>
              {(cat as any).weeklyNews && <WeeklyArchive lessons={cat.lessons} catColor={cat.color} level="b2" />}
              </>
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
