import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Partners & Sponsors | Jobs in Thailand',
  description: 'Learn Thai in Thailand with Duke Language School — professional Thai language courses for expats and teachers.',
  openGraph: {
    title: 'Learn Thai in Thailand — Duke Language School',
    description: 'Professional Thai language courses for expats and teachers living in Thailand. All levels welcome!',
    images: [
      {
        url: 'https://www.jobsinthailand.net/sponsors/dukelanguage_school.png',
        width: 800,
        height: 800,
        alt: 'Duke Language School',
      }
    ],
  },
}

export default function SponsorsPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <section style={{ background: '#1a1a2e', padding: '48px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px' }}>Our Partners & Sponsors</h1>
        <p style={{ color: '#ccc', fontSize: '16px', margin: 0 }}>Trusted services for expats and teachers in Thailand</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <a href="/sponsors/duke-language" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', border: '2px solid #3b5bdb', display: 'flex', alignItems: 'center', gap: '32px', padding: '32px' }}>
            <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ width: '160px', height: 'auto', flexShrink: 0 }} />
            <div>
              <div style={{ background: '#3b5bdb', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px', letterSpacing: '1px', textTransform: 'uppercase' as const }}>Sponsor</div>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Duke Language School</h2>
              <p style={{ color: '#666', fontSize: '15px', margin: '0 0 16px', lineHeight: '1.6' }}>
                Learn Thai in Thailand! Professional Thai language courses designed for expats, teachers and business professionals living and working in Thailand.
              </p>
              <div style={{ background: '#3b5bdb', color: 'white', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }}>Visit Duke Language School →</div>
            </div>
          </div>
        </a>
      </div>
    </main>
  )
}