'use client'
import Link from 'next/link'

// ============================================================
// ADD NEW VIDEOS HERE — newest first
// Just paste the YouTube video ID (the part after ?v= in the URL)
// ============================================================
const videos = [
  {
    id: 'JzNIp4C9H7U',
    title: 'How Much Do Teachers Earn in Thailand in 2025?',
    desc: 'The honest breakdown — government, private and international school salaries, a real monthly budget, and red flags to watch before you sign.',
    category: 'Salaries',
  },
  // Add more videos below like this:
  // {
  //   id: 'YOUTUBE_VIDEO_ID',
  //   title: 'Your Video Title Here',
  //   desc: 'Short description of what the video covers.',
  //   category: 'Teaching',
  // },
]

const CATEGORIES = ['All', 'Salaries', 'Teaching', 'Cities', 'Visas', 'Jobs', 'Lifestyle']

export default function VideosPage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
          <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', margin: '0 0 12px' }}>
            Jobs in Thailand — YouTube Channel
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '17px', margin: '0 0 28px', lineHeight: '1.6', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Honest guides on teaching salaries, city comparisons, visas, school types and the best jobs of the week — all free, all from Thailand.
          </p>
          <a
            href="https://www.youtube.com/@jobsinthailand"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#FF0000', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 16px rgba(255,0,0,0.3)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Subscribe on YouTube
          </a>
        </div>
      </div>

      {/* WHAT TO EXPECT BANNER */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {[
            { emoji: '📋', text: 'Weekly Best Jobs' },
            { emoji: '💰', text: 'Salary Guides' },
            { emoji: '🏙️', text: 'City Comparisons' },
            { emoji: '✈️', text: 'Visa Advice' },
            { emoji: '🏫', text: 'School Types' },
            { emoji: '📖', text: 'Blog Videos' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '14px', fontWeight: '600' }}>
              <span style={{ fontSize: '20px' }}>{item.emoji}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

        {/* VIDEO COUNT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>All Videos</h2>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{videos.length} video{videos.length !== 1 ? 's' : ''} — new content every week</p>
          </div>
          <a href="https://www.youtube.com/@jobsinthailand" target="_blank" rel="noopener noreferrer"
            style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            View all on YouTube →
          </a>
        </div>

        {/* VIDEO GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {videos.map((video) => (
            <div key={video.id} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>

              {/* THUMBNAIL */}
              <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', position: 'relative', textDecoration: 'none' }}>
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                />
                {/* Play button overlay */}
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.2)', transition: 'background 0.2s',
                }}>
                  <div style={{ background: '#FF0000', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                {/* Category badge */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#E85D26', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>
                  {video.category}
                </div>
              </a>

              {/* CARD CONTENT */}
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px', lineHeight: '1.4' }}>
                  {video.title}
                </h3>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 16px', lineHeight: '1.6', flex: 1 }}>
                  {video.desc}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#FF0000', color: 'white', padding: '11px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  Watch on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* SUBSCRIBE CTA */}
        <div style={{ marginTop: '48px', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', borderRadius: '16px', padding: '40px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔔</div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px' }}>Never miss a video</h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: '0 0 24px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
            We post every week — salary guides, city comparisons, visa advice and the best teaching jobs in Thailand right now.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://www.youtube.com/@jobsinthailand" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FF0000', color: 'white', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              Subscribe Free
            </a>
            <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E85D26', color: 'white', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              Browse Jobs →
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
