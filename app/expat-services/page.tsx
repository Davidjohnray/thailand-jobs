import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 0

type Ad = {
  id: string
  business_name: string
  tagline: string | null
  category: string
  location: string | null
  website_url: string | null
  contact: string | null
  banner_url: string | null
  featured: boolean
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Cleaning':   { bg: '#dcfce7', color: '#15803d' },
  'Health':     { bg: '#fee2e2', color: '#dc2626' },
  'Legal':      { bg: '#dbeafe', color: '#1d4ed8' },
  'Insurance':  { bg: '#e0f2fe', color: '#0369a1' },
  'Transport':  { bg: '#fff7ed', color: '#c2410c' },
  'Tutoring':   { bg: '#f5f3ff', color: '#7c3aed' },
  'Visa':       { bg: '#ccfbf1', color: '#0f766e' },
  'Food':       { bg: '#fef9c3', color: '#854d0e' },
  'Other':      { bg: '#f3f4f6', color: '#4b5563' },
}

function AdCard({ ad, featured = false }: { ad: Ad; featured?: boolean }) {
  const cat = CATEGORY_COLORS[ad.category] || CATEGORY_COLORS['Other']

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: featured ? '0 8px 32px rgba(201,168,76,0.25)' : '0 2px 12px rgba(0,0,0,0.08)',
      border: featured ? '2px solid #c9a84c' : '1px solid #eee',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {featured && (
        <div style={{ background: 'linear-gradient(135deg, #c9a84c, #f59e0b)', padding: '6px 12px', textAlign: 'center' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>⭐ Featured</span>
        </div>
      )}

      {/* Banner image or styled card */}
      {ad.banner_url ? (
        <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
          <img src={ad.banner_url} alt={ad.business_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', minHeight: '200px', justifyContent: 'center', background: featured ? 'linear-gradient(135deg, #fffbeb, #fff)' : 'white' }}>
          <span style={{ background: cat.bg, color: cat.color, fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>{ad.category}</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', lineHeight: '1.3' }}>{ad.business_name}</div>
          {ad.tagline && <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{ad.tagline}</div>}
          {ad.location && <div style={{ color: '#9ca3af', fontSize: '12px' }}>📍 {ad.location}</div>}
        </div>
      )}

      {/* Footer with contact/link */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {!ad.banner_url && (
          <span style={{ background: cat.bg, color: cat.color, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', alignSelf: 'flex-start' }}>{ad.category}</span>
        )}
        {ad.banner_url && (
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>{ad.business_name}</div>
        )}
        {ad.banner_url && ad.tagline && (
          <div style={{ color: '#666', fontSize: '12px' }}>{ad.tagline}</div>
        )}
        {ad.location && ad.banner_url && (
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>📍 {ad.location}</div>
        )}
        {ad.contact && (
          <div style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>📞 {ad.contact}</div>
        )}
        {ad.website_url && (
          <a href={ad.website_url} target="_blank" rel="noopener noreferrer"
            style={{ background: featured ? '#c9a84c' : '#1a1a2e', color: 'white', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', textAlign: 'center', display: 'block' }}>
            Visit Website →
          </a>
        )}
      </div>
    </div>
  )
}

export default async function ExpatServicesPage() {
  const now = new Date().toISOString()

  const { data: featuredAds } = await supabase
    .from('expat_ads')
    .select('*')
    .eq('active', true)
    .eq('featured', true)
    .gt('expires_at', now)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: standardAds } = await supabase
    .from('expat_ads')
    .select('*')
    .eq('active', true)
    .eq('featured', false)
    .gt('expires_at', now)
    .order('created_at', { ascending: false })

  const featured = featuredAds || []
  const standard = standardAds || []

  const CATEGORIES = ['Cleaning', 'Health', 'Legal', 'Insurance', 'Transport', 'Tutoring', 'Visa', 'Food', 'Other']

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>🏙️</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: '900', margin: '0 0 12px', letterSpacing: '-0.5px' }}>Expat Services Thailand</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', maxWidth: '540px', margin: '0 auto 20px', lineHeight: '1.6' }}>
          Trusted services for expats and teachers living across Thailand — cleaning, health, visa, transport and more
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {CATEGORIES.map(cat => {
            const c = CATEGORY_COLORS[cat]
            return (
              <span key={cat} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>{cat}</span>
            )
          })}
        </div>
      </section>

      {/* ADVERTISE CTA */}
      <div style={{ background: '#1a1a2e', padding: '16px 24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>🏢 Advertise your service to thousands of expats across Thailand</span>
        <Link href="/advertise#expat-services" style={{ background: '#0ea5e9', color: 'white', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
          From ฿500 · 6 months →
        </Link>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* FEATURED SECTION */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '3px solid #c9a84c' }}>
              <div style={{ background: 'linear-gradient(135deg, #c9a84c, #f59e0b)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⭐</div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>Featured Services</h2>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Top-rated and promoted businesses</p>
              </div>
              <span style={{ marginLeft: 'auto', background: '#fffbeb', color: '#c9a84c', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', border: '1px solid #fde68a' }}>{featured.length} featured</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {featured.map(ad => <AdCard key={ad.id} ad={ad} featured={true} />)}
            </div>
          </div>
        )}

        {/* STANDARD ADS */}
        {standard.length > 0 ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '3px solid #e5e7eb' }}>
              <div style={{ background: '#0ea5e9', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏙️</div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>All Services</h2>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Businesses serving the expat community</p>
              </div>
              <span style={{ marginLeft: 'auto', background: '#f3f4f6', color: '#6b7280', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>{standard.length} listed</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {standard.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          </div>
        ) : featured.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏙️</div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>Coming Soon!</h2>
            <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              We're building our directory of expat services across Thailand. Be the first to advertise your business here.
            </p>
            <Link href="/advertise#expat-services" style={{ background: '#0ea5e9', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '16px' }}>
              Advertise Your Service →
            </Link>
          </div>
        ) : null}

        {/* BOTTOM CTA */}
        {(featured.length > 0 || standard.length > 0) && (
          <div style={{ marginTop: '48px', background: 'linear-gradient(135deg, #0f766e, #0ea5e9)', borderRadius: '20px', padding: '36px', textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📢</div>
            <h3 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 8px' }}>Advertise Your Service Here</h3>
            <p style={{ opacity: 0.85, fontSize: '15px', marginBottom: '8px' }}>Reach thousands of expats and teachers living across Thailand</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 20px' }}>
                <div style={{ color: 'white', fontWeight: '900', fontSize: '18px' }}>฿500</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Standard · 6 months</div>
              </div>
              <div style={{ background: 'rgba(201,168,76,0.3)', border: '1px solid #c9a84c', borderRadius: '10px', padding: '10px 20px' }}>
                <div style={{ color: '#fde68a', fontWeight: '900', fontSize: '18px' }}>฿1,000</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>⭐ Featured · 6 months</div>
              </div>
            </div>
            <Link href="/advertise#expat-services" style={{ background: 'white', color: '#0f766e', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '16px', display: 'inline-block' }}>
              Get Listed Today →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
