'use client'

// Hub page listing every language app under this umbrella. Each language keeps its
// own separate URL, branding and backend (e.g. /thai-friend) — this page just links
// out to them. Add a new entry to LANGUAGES as each one goes live.

const LANGUAGES: {
  name: string
  flag: string
  tagline: string
  href: string
  status: 'live' | 'soon'
}[] = [
  {
    name: 'Thai',
    flag: '🇹🇭',
    tagline: 'Talk with Bank, Somchai, Nueng or Tong — each remembers you separately.',
    href: '/thai-friend',
    status: 'live',
  },
  {
    name: 'French',
    flag: '🇫🇷',
    tagline: 'Talk with Léo, Henri, Camille or Odette — each remembers you separately.',
    href: '/french-friend',
    status: 'live',
  },
]

export default function LanguageFriendHub() {
  return (
    <main style={{ fontFamily: "'Work Sans', sans-serif", background: '#14201C', minHeight: '100vh', color: '#F5EFE1' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Work+Sans:wght@400;500;600;700&display=swap');
        .ff-display { font-family: 'Fraunces', serif; }
      `}</style>

      <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <span className="ff-display" style={{ fontSize: '20px', fontWeight: 700 }}>Language Friend</span>
      </div>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px 60px', textAlign: 'center' }}>
        <h1 className="ff-display" style={{ fontSize: '42px', lineHeight: 1.2, fontWeight: 700, margin: '0 0 20px' }}>
          Learn any language by making a friend.
        </h1>
        <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'rgba(245,239,225,0.8)', maxWidth: '560px', margin: '0 auto' }}>
          Talk out loud with an AI who remembers you, helps when you get stuck, and gently corrects you — no drills, no red pen. Pick a language to get started.
        </p>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {LANGUAGES.map((lang) => (
            <LanguageCard key={lang.name} {...lang} />
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 32px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'rgba(245,239,225,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Pricing</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap' }}>
          <div><span style={{ color: '#D4A24C', fontWeight: 700, fontSize: '18px' }}>Free</span> <span style={{ color: 'rgba(245,239,225,0.6)', fontSize: '13px' }}>48hr trial</span></div>
          <div><span style={{ color: '#D4A24C', fontWeight: 700, fontSize: '18px' }}>฿199</span> <span style={{ color: 'rgba(245,239,225,0.6)', fontSize: '13px' }}>30 days</span></div>
          <div><span style={{ color: '#D4A24C', fontWeight: 700, fontSize: '18px' }}>฿549</span> <span style={{ color: 'rgba(245,239,225,0.6)', fontSize: '13px' }}>90 days</span></div>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(245,239,225,0.45)', marginTop: '14px' }}>Same pricing for every language. Email Admin@jobsinthailand.net to register.</p>
      </section>
    </main>
  )
}

function LanguageCard({ name, flag, tagline, href, status }: { name: string; flag: string; tagline: string; href: string; status: 'live' | 'soon' }) {
  const isLive = status === 'live'

  const content = (
    <div
      style={{
        background: 'rgba(245,239,225,0.05)',
        border: '1px solid rgba(245,239,225,0.12)',
        borderRadius: '18px',
        padding: '28px',
        height: '100%',
        boxSizing: 'border-box',
        opacity: isLive ? 1 : 0.6,
        cursor: isLive ? 'pointer' : 'default',
        transition: 'transform 0.15s',
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '14px' }}>{flag}</div>
      <p className="ff-display" style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>{name}</p>
      <p style={{ fontSize: '13.5px', color: 'rgba(245,239,225,0.75)', lineHeight: 1.5, margin: '0 0 16px' }}>{tagline}</p>
      <span
        style={{
          display: 'inline-block',
          background: isLive ? '#D4A24C' : 'rgba(245,239,225,0.12)',
          color: isLive ? '#14201C' : 'rgba(245,239,225,0.6)',
          fontSize: '12px',
          fontWeight: 700,
          padding: '6px 14px',
          borderRadius: '20px',
        }}
      >
        {isLive ? 'Try it free →' : 'Coming soon'}
      </span>
    </div>
  )

  if (!isLive) return content

  return (
    <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      {content}
    </a>
  )
}
