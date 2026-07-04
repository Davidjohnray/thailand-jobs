import Link from 'next/link'

export const metadata = {
  title: 'P&V Advisory Global | Legal Services for Expats in Thailand',
  description: 'Professional legal and advisory services for expatriates in Thailand. Visa, immigration, work permits, real estate, family law and more.',
}

export default function PVAdvisoryPage() {
  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>

      {/* WIDE BANNER */}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <img
          src="/pv_advisory_wide_banner.png"
          alt="P&V Advisory Global - Legal Services for Expats in Thailand"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* INTRO */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '36px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#7B2328', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#C9A84C', fontWeight: 'bold', fontSize: '18px', fontFamily: 'Georgia, serif' }}>P&V</span>
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>P&V Advisory Global</h1>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Legal & Advisory Services for Expatriates in Thailand</p>
            </div>
          </div>
          <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.8', margin: '0 0 16px' }}>
            P&V Advisory Global provides comprehensive legal and non-litigation consultancy and representative services designed to navigate the complexities of daily life in Thailand. Our firm acts as your dedicated liaison, bridging the gap between your requirements and the relevant government agencies and private organizations.
          </p>
          <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
            We represent clients — both Thai nationals and foreigners — in all types of legal cases throughout Thailand.
          </p>
        </div>

        {/* SERVICES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '36px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #7B2328' }}>Our Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { icon: '⚖️', title: 'Dispute Resolution', desc: 'Facilitating mediation and resolution for conflicts between individuals or corporate entities.' },
              { icon: '🏢', title: 'Corporate & Business', desc: 'Expert advisory on business formation, registration, and ongoing regulatory compliance.' },
              { icon: '👔', title: 'Labor & Employment', desc: 'Specialized guidance on employment law, including contracts and labor relations management.' },
              { icon: '📋', title: 'Work Authorization', desc: 'Streamlined processing of Work Permit applications and renewals.' },
              { icon: '🏠', title: 'Real Estate', desc: 'Professional assistance in the acquisition, sale, and leasing of residential and commercial properties.' },
              { icon: '🛂', title: 'Immigration (Thailand)', desc: 'Complete management of Thai visas and all relevant Immigration Bureau formalities.' },
              { icon: '✈️', title: 'Global Visa Consultancy', desc: 'Specialized visa processing for international travel, with expertise in UK and Schengen applications.' },
              { icon: '👨‍👩‍👧', title: 'Family Law & Personal Affairs', desc: 'Dedicated support for adoption, marriage, divorce registration, and estate planning.' },
            ].map(service => (
              <div key={service.title} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{service.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e', marginBottom: '6px' }}>{service.title}</div>
                <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{service.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT & CTA */}
        <div style={{ background: 'linear-gradient(135deg, #7B2328, #9B3338)', borderRadius: '16px', padding: '36px', textAlign: 'center', boxShadow: '0 4px 20px rgba(123,35,40,0.3)' }}>
          <div style={{ background: '#C9A84C', display: 'inline-block', padding: '6px 20px', borderRadius: '20px', marginBottom: '16px' }}>
            <span style={{ color: '#7B2328', fontWeight: '800', fontSize: '13px', letterSpacing: '1px' }}>NO PROBLEM THAILAND</span>
          </div>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '900', margin: '0 0 8px' }}>Ready to get started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '0 0 28px' }}>Contact P&V Advisory Global today for professional legal assistance in Thailand</p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 20px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>📞 Thailand</div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>+66 (0) 89 669 8898</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 20px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>💬 WhatsApp</div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>+44 (0) 7506 780521</div>
            </div>
          </div>

          <a
            href="https://www.pvadvisorythailand.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#C9A84C', color: '#7B2328', padding: '16px 48px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '18px', display: 'inline-block' }}
          >
            Visit Website →
          </a>
        </div>

        {/* BACK LINK */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/expat-services" style={{ color: '#7B2328', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
            ← Back to Expat Services
          </Link>
        </div>

      </div>
    </main>
  )
}
