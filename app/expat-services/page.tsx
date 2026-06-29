import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

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

const CATEGORIES = ['Cleaning', 'Health', 'Legal', 'Insurance', 'Transport', 'Tutoring', 'Visa', 'Food', 'Other']

function AdCard({ ad }: { ad: Ad }) {
  const cat = CATEGORY_COLORS[ad.category] || CATEGORY_COLORS['Other']
  return (
    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
      {ad.banner_url ? (
        <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
          <img src={ad.banner_url} alt={ad.business_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', minHeight: '200px', justifyContent: 'center' }}>
          <span style={{ background: cat.bg, color: cat.color, fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>{ad.category}</span>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', lineHeight: '1.3' }}>{ad.business_name}</div>
          {ad.tagline && <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{ad.tagline}</div>}
          {ad.location && <div style={{ color: '#9ca3af', fontSize: '12px' }}>📍 {ad.location}</div>}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {ad.banner_url && (
          <>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>{ad.business_name}</div>
            {ad.tagline && <div style={{ color: '#666', fontSize: '12px' }}>{ad.tagline}</div>}
            {ad.location && <div style={{ color: '#9ca3af', fontSize: '12px' }}>📍 {ad.location}</div>}
          </>
        )}
        {!ad.banner_url && (
          <span style={{ background: cat.bg, color: cat.color, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', alignSelf: 'flex-start' }}>{ad.category}</span>
        )}
        {ad.contact && <div style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>📞 {ad.contact}</div>}
        {ad.website_url && (
          <a href={ad.website_url} target="_blank" rel="noopener noreferrer"
            style={{ background: '#1a1a2e', color: 'white', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', textAlign: 'center', display: 'block' }}>
            Visit Website →
          </a>
        )}
      </div>
    </div>
  )
}

function FeaturedAdCard({ ad }: { ad: Ad }) {
  const cat = CATEGORY_COLORS[ad.category] || CATEGORY_COLORS['Other']
  return (
    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(201,168,76,0.25)', border: '2px solid #c9a84c', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(135deg, #c9a84c, #f59e0b)', padding: '6px 12px', textAlign: 'center' }}>
        <span style={{ color: 'white', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>⭐ Featured</span>
      </div>
      {ad.banner_url ? (
        <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
          <img src={ad.banner_url} alt={ad.business_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', minHeight: '200px', justifyContent: 'center', background: 'linear-gradient(135deg, #fffbeb, #fff)' }}>
          <span style={{ background: cat.bg, color: cat.color, fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>{ad.category}</span>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', lineHeight: '1.3' }}>{ad.business_name}</div>
          {ad.tagline && <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{ad.tagline}</div>}
          {ad.location && <div style={{ color: '#9ca3af', fontSize: '12px' }}>📍 {ad.location}</div>}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #fde68a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {ad.banner_url && (
          <>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>{ad.business_name}</div>
            {ad.tagline && <div style={{ color: '#666', fontSize: '12px' }}>{ad.tagline}</div>}
            {ad.location && <div style={{ color: '#9ca3af', fontSize: '12px' }}>📍 {ad.location}</div>}
          </>
        )}
        {ad.contact && <div style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>📞 {ad.contact}</div>}
        {ad.website_url && (
          <a href={ad.website_url} target="_blank" rel="noopener noreferrer"
            style={{ background: '#c9a84c', color: 'white', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', textAlign: 'center', display: 'block' }}>
            Visit Website →
          </a>
        )}
      </div>
    </div>
  )
}

function PlaceholderFeaturedCard() {
  return (
    <Link href="/advertise" style={{ textDecoration: 'none' }}>
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(201,168,76,0.15)', border: '2px dashed #c9a84c', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s' }}>
        <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', padding: '6px 12px', textAlign: 'center' }}>
          <span style={{ color: '#c9a84c', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>⭐ Featured Spot</span>
        </div>
        <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '10px', minHeight: '200px' }}>
          <div style={{ fontSize: '36px' }}>📢</div>
          <div style={{ fontWeight: '800', color: '#c9a84c', fontSize: '15px' }}>Your Business Here</div>
          <div style={{ color: '#9ca3af', fontSize: '12px', lineHeight: '1.5' }}>Reach thousands of expats and teachers across Thailand</div>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #fde68a', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg, #c9a84c, #f59e0b)', color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '800' }}>
            ฿1,000 · 6 months →
          </div>
        </div>
      </div>
    </Link>
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
  const placeholderCount = Math.max(0, 10 - featured.length)

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
          {CATEGORIES.map(cat => (
            <span key={cat} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>{cat}</span>
          ))}
        </div>
      </section>

      {/* ADVERTISE CTA BAR */}
      <div style={{ background: '#1a1a2e', padding: '16px 24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>🏢 Advertise your service to thousands of expats across Thailand</span>
        <Link href="/advertise" style={{ background: '#0ea5e9', color: 'white', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
          From ฿500 · 6 months →
        </Link>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* FEATURED SECTION — always shows 10 slots */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', paddingBottom: '14px', borderBottom: '3px solid #c9a84c' }}>
            <div style={{ background: 'linear-gradient(135deg, #c9a84c, #f59e0b)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>⭐</div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>Featured Services</h2>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>10 premium spots — gold border, always shown first</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ background: '#fffbeb', color: '#c9a84c', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', border: '1px solid #fde68a' }}>{featured.length}/10 filled</span>
              {placeholderCount > 0 && (
                <Link href="/advertise" style={{ background: 'linear-gradient(135deg, #c9a84c, #f59e0b)', color: 'white', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textDecoration: 'none' }}>
                  {placeholderCount} spot{placeholderCount > 1 ? 's' : ''} available →
                </Link>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' }}>
            {featured.map(ad => <FeaturedAdCard key={ad.id} ad={ad} />)}
            {Array.from({ length: placeholderCount }).map((_, i) => <PlaceholderFeaturedCard key={`placeholder-${i}`} />)}
          </div>
        </div>

        {/* STANDARD ADS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '3px solid #e5e7eb' }}>
            <div style={{ background: '#0ea5e9', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🏙️</div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>All Services</h2>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Businesses serving the expat community in Thailand</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>

            {/* LUCKY CLEANING — hardcoded */}
            <a href="https://www.facebook.com/share/1AviMhTNzJ/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                  <img src="/lucky_cleaning_service.jpg" alt="Lucky Cleaning Service" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>Lucky Cleaning Service</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>Professional cleaning across Thailand</div>
                  <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', alignSelf: 'flex-start' }}>Cleaning</span>
                  <div style={{ background: '#1a1a2e', color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', textAlign: 'center', marginTop: '4px' }}>
                    View on Facebook →
                  </div>
                </div>
              </div>
            </a>

            {/* CAR & VAN RENTAL SERVICE — hardcoded */}
            <a href="https://line.me/ti/p/watee7266" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                  <img src="/car-van-rental-service.jpg" alt="Car & Van Rental Service Thailand" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>Car & Van Rental Service</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>Airport transfers & travel across Thailand</div>
                  <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', alignSelf: 'flex-start' }}>Transport</span>
                  <div style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>📞 +66989157266</div>
                </div>
              </div>
            </a>

            {/* HUA HIN MOVING SERVICE — hardcoded */}
            <a href="tel:0968415264" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                  <img src="/huahin-moving-service.jpg" alt="Hua Hin Moving Service" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>Hua Hin Moving Service</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>Household, office & condo relocation</div>
                  <span style={{ background: '#f3f4f6', color: '#4b5563', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', alignSelf: 'flex-start' }}>Moving</span>
                  <div style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>📞 096-841-5264</div>
                </div>
              </div>
            </a>

            {/* DB standard ads */}
            {standard.map(ad => <AdCard key={ad.id} ad={ad} />)}

            {/* Placeholder standard slot */}
            <Link href="/advertise" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '2px dashed #e5e7eb', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <div style={{ padding: '32px 16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '10px', minHeight: '200px' }}>
                  <div style={{ fontSize: '36px' }}>📢</div>
                  <div style={{ fontWeight: '800', color: '#9ca3af', fontSize: '15px' }}>Advertise Here</div>
                  <div style={{ color: '#d1d5db', fontSize: '12px', lineHeight: '1.5' }}>Reach expats and teachers across Thailand</div>
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                  <div style={{ background: '#f3f4f6', color: '#6b7280', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '800' }}>
                    ฿500 · 6 months →
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* BOTTOM CTA */}
        <div style={{ marginTop: '48px', background: 'linear-gradient(135deg, #0f766e, #0ea5e9)', borderRadius: '20px', padding: '36px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📢</div>
          <h3 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 8px' }}>Advertise Your Service Here</h3>
          <p style={{ opacity: 0.85, fontSize: '15px', margin: '0 0 20px' }}>Reach thousands of expats and teachers living across Thailand</p>
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
          <Link href="/advertise" style={{ background: 'white', color: '#0f766e', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '16px', display: 'inline-block' }}>
            Get Listed Today →
          </Link>
        </div>

      </div>
    </main>
  )
}
