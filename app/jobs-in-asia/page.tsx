import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jobs in Asia | Teaching & Expat Jobs Across Asia',
  description: 'Browse teaching and expat job opportunities across Asia including Vietnam, Japan, South Korea, China, Cambodia, and Myanmar.',
}

const countries = [
  {
    href: '/jobs-in-asia/vietnam',
    flag: '🇻🇳',
    name: 'Vietnam',
    subtitle: 'ESL • Ho Chi Minh City • Hanoi',
    highlight: 'High demand for native English teachers',
  },
  {
    href: '/jobs-in-asia/japan',
    flag: '🇯🇵',
    name: 'Japan',
    subtitle: 'ALT • Eikaiwa • Tokyo • Osaka',
    highlight: 'JET Programme & private language schools',
  },
  {
    href: '/jobs-in-asia/south-korea',
    flag: '🇰🇷',
    name: 'South Korea',
    subtitle: 'EPIK • Hagwon • Seoul • Busan',
    highlight: 'Competitive salaries & free accommodation',
  },
  {
    href: '/jobs-in-asia/china',
    flag: '🇨🇳',
    name: 'China',
    subtitle: 'ESL • International Schools • Shanghai',
    highlight: 'Huge market with varied opportunities',
  },
  {
    href: '/jobs-in-asia/cambodia',
    flag: '🇰🇭',
    name: 'Cambodia',
    subtitle: 'NGO • ESL • Phnom Penh • Siem Reap',
    highlight: 'Growing ESL sector, low cost of living',
  },
  {
    href: '/jobs-in-asia/myanmar',
    flag: '🇲🇲',
    name: 'Myanmar',
    subtitle: 'ESL • Yangon • Mandalay',
    highlight: 'Emerging market for English education',
  },
]

export default function JobsInAsiaPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>

      {/* Hero */}
      <div style={{ background: '#E85D26', padding: '48px 24px 40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Link href="/jobs" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Jobs</Link>
          {' '} › Jobs in Asia
        </p>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px' }}>
          🌏 Jobs in Asia
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', margin: '0 auto', maxWidth: '520px' }}>
          Teaching and expat opportunities across Asia — select a country to get started
        </p>
      </div>

      {/* Country grid */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {countries.map(country => (
            <Link
              key={country.href}
              href={country.href}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px 20px',
                border: '1px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'box-shadow 0.15s, transform 0.15s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '48px', lineHeight: 1 }}>{country.flag}</span>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>
                    {country.name}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#888', margin: '0 0 10px' }}>
                    {country.subtitle}
                  </p>
                  <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>
                    {country.highlight}
                  </p>
                </div>
                <span style={{
                  marginTop: '4px',
                  background: '#E85D26',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  padding: '6px 16px',
                  borderRadius: '6px',
                }}>
                  View Jobs →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming soon note */}
        <div style={{
          marginTop: '40px',
          background: 'white',
          border: '1px solid #eee',
          borderRadius: '12px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}>
          <span style={{ fontSize: '24px' }}>💡</span>
          <div>
            <p style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px', fontSize: '15px' }}>
              More countries coming soon
            </p>
            <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
              Taiwan, Indonesia, and the Philippines are on the roadmap.
              Know an employer hiring in Asia?{' '}
              <Link href="/employers" style={{ color: '#E85D26', fontWeight: 'bold', textDecoration: 'none' }}>
                Post a job →
              </Link>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/jobs" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>
            ← Back to Thailand Jobs
          </Link>
        </div>
      </div>
    </main>
  )
}
