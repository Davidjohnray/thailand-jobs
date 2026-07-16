import Link from 'next/link'
import { supabase } from '../src/lib/supabase'
import HomeFeaturedJobs from '../components/HomeFeaturedJobs'
import BuyMeCoffee from '../components/BuyMeCoffee'
import PVAdvisoryBanner from '../components/PVAdvisoryBanner'
import EssentialTeflBanner from '../components/ads/EssentialTeflBanner'

export const revalidate = 0

export default async function Home() {
  const now = new Date().toISOString()

  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('country', 'Thailand')
    .eq('featured', true)
    .gt('expires_at', now)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <main>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>

          {/* LEFT AD BOX - TEACH BRIDGE */}
          <Link href="/partners/teach-bridge" style={{ textDecoration: 'none', flexShrink: 0 }} className="hero-side-ad">
            <div style={{ width: '250px', height: '250px', background: 'white', border: '3px solid #c9a84c', borderRadius: '10px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <img
                src="https://coldsoilakctfcswqwge.supabase.co/storage/v1/object/public/partner-cvs/teach%20bridge%20asia.jpg"
                alt="Teach Bridge Asia Recruitment"
                style={{ width: '180px', height: 'auto', objectFit: 'contain' }}
              />
              <div style={{ background: '#1a1a2e', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>Find Teaching Jobs →</div>
            </div>
          </Link>

          {/* HERO TEXT */}
          <div style={{ flex: 1, maxWidth: '600px' }}>
            <h1 className="hero-title" style={{ color: 'white', fontSize: '44px', fontWeight: 'bold', marginBottom: '16px' }}>
              Find Teaching & Expat Jobs in Thailand
            </h1>
            <p className="hero-sub" style={{ color: '#ccc', fontSize: '18px', marginBottom: '40px' }}>
              Browse hundreds of jobs in Bangkok, Chiang Mai, Phuket and more
            </p>
            <Link href="/esl-resources" style={{ textDecoration: 'none', display: 'block', marginTop: '8px' }}>
              <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E85D26 100%)', borderRadius: '12px', padding: '16px 20px', border: '2px solid rgba(255,255,255,0.15)' }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>📖 Free ESL Resources for Teachers</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {[
                    { icon: '📋', label: 'Lesson Plans' },
                    { icon: '🎮', label: 'Learn & Play Games' },
                    { icon: '🗞️', label: 'Reading Comprehension' },
                    { icon: '✨', label: 'More Coming Soon' },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '5px 12px', color: 'white', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {item.icon} {item.label}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Designed for bilingual schools & ESL classrooms in Thailand</div>
                  <div style={{ background: 'white', color: '#7C3AED', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '900', whiteSpace: 'nowrap' }}>Explore Free →</div>
                </div>
              </div>
            </Link>
          </div>

          {/* RIGHT AD BOX - P&V ADVISORY with GA tracking */}
          <div className="hero-side-ad" style={{ flexShrink: 0 }}>
            <PVAdvisoryBanner size={250} location="homepage_hero" />
          </div>

        </div>
      </section>

      {/* COMMUNITY BANNERS */}
      <section style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ background: '#06C755', padding: '24px', flex: 1, minWidth: '280px' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '32px' }}>💬</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Join our FREE LINE Community!</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Job tips, visa advice & teachers across Thailand</div>
            </div>
            <a href="https://line.me/ti/g2/MGV6FgMkGOdFSUeaPsHUyMf2P2hYAT5-a6f5Vg" target="_blank" rel="noopener noreferrer"
              style={{ background: 'white', color: '#06C755', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
              Join LINE →
            </a>
          </div>
        </div>
        <div style={{ background: '#25D366', padding: '24px', flex: 1, minWidth: '280px' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '32px' }}>💬</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Join our FREE WhatsApp Community!</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Job tips, visa advice & teachers across Thailand</div>
            </div>
            <a href="https://chat.whatsapp.com/L3fBobRIr7u1tSaiHBxfzv" target="_blank" rel="noopener noreferrer"
              style={{ background: 'white', color: '#25D366', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
              Join WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="main-content" style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 16px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* FEATURED JOBS */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>⭐ Featured Jobs</h2>
            <Link href="/jobs" style={{ color: '#E85D26', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>View All →</Link>
          </div>

          <div style={{ background: '#fff3ed', border: '1px solid #E85D26', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>⭐</span>
            <div>
              <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>Members see new jobs 1 hour before everyone else! </span>
              <Link href="/account/register" style={{ color: '#E85D26', fontSize: '13px', textDecoration: 'underline' }}>Join free →</Link>
            </div>
          </div>

          {featuredJobs && featuredJobs.length > 0 ? (
            <HomeFeaturedJobs jobs={featuredJobs} />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
              <p style={{ color: '#666', marginBottom: '12px' }}>No featured jobs yet</p>
              <Link href="/employers" style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>Be the first to feature your job →</Link>
            </div>
          )}

          {/* MOBILE ADS */}
          <div className="mobile-ads" style={{ flexDirection: 'column', gap: '16px', marginTop: '24px' }}>

            {/* P&V Advisory - mobile */}
            <PVAdvisoryBanner size={200} location="homepage_mobile" />

            <Link href="/partners/teach-bridge" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '3px solid #c9a84c', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
                <img src="https://coldsoilakctfcswqwge.supabase.co/storage/v1/object/public/partner-cvs/teach%20bridge%20asia.jpg"
                  alt="Teach Bridge Asia" style={{ width: '160px', height: 'auto', marginBottom: '10px' }} />
                <div style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>Official Recruitment Partner</div>
                <div style={{ color: '#666', fontSize: '12px', marginBottom: '12px' }}>Find teaching jobs across Thailand</div>
                <div style={{ background: '#1a1a2e', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>View Jobs & Apply →</div>
              </div>
            </Link>

            <a href="/rentals" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', borderRadius: '12px', padding: '20px', border: '2px solid #E85D26', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏠</div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>Rentals in Thailand</div>
                <div style={{ color: '#ccc', fontSize: '13px', marginBottom: '12px' }}>Condos, Houses & Villas across Thailand</div>
                <div style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block' }}>Browse Properties →</div>
              </div>
            </a>

            <a href="https://www.facebook.com/share/1AviMhTNzJ/?utm_source=website&utm_medium=mobile_banner&utm_campaign=lucky_cleaning"
              target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                <img src="/lucky_cleaning_service.jpg" alt="Lucky Cleaning Service Bangkok" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              </div>
            </a>

            <Link href="/sponsors/duke-language" style={{ textDecoration: 'none' }}>
              <div style={{ width: '240px', height: '240px', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', border: '2px solid #3b5bdb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', gap: '8px' }}>
                <div style={{ background: '#3b5bdb', color: 'white', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px' }}>Sponsored</div>
                <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
                <div style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '13px', lineHeight: '1.4' }}>Learn Thai, English & Chinese</div>
                <div style={{ background: '#3b5bdb', color: 'white', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Explore Courses →</div>
              </div>
            </Link>

            <Link href="/expat-services" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)', borderRadius: '12px', padding: '20px', border: '2px solid #5eead4', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏙️</div>
                <div style={{ color: '#5eead4', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Expat Services Thailand</div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>Cleaning · Visa · Insurance · Transport</div>
                <div style={{ background: '#5eead4', color: '#0f4c47', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block' }}>Browse Services →</div>
              </div>
            </Link>

          </div>
        </div>

        {/* AD SIDEBAR COLUMN 1 */}
        <div className="ad-sidebar" style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#999', fontSize: '11px', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Official Partner</p>

          <Link href="/partners/teach-bridge" style={{ textDecoration: 'none' }}>
            <div style={{ width: '240px', height: '240px', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', border: '3px solid #c9a84c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', gap: '8px' }}>
              <div style={{ color: '#c9a84c', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>⭐ Official Recruitment Partner</div>
              <img src="https://coldsoilakctfcswqwge.supabase.co/storage/v1/object/public/partner-cvs/teach%20bridge%20asia.jpg"
                alt="Teach Bridge Asia" style={{ width: '150px', height: 'auto', objectFit: 'contain' }} />
              <div style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '13px' }}>Teacher Recruitment Agency</div>
              <div style={{ background: '#1a1a2e', color: 'white', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>View Jobs & Apply →</div>
            </div>
          </Link>

          <EssentialTeflBanner />
        </div>

        {/* AD SIDEBAR COLUMN 2 */}
        <div className="ad-sidebar" style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#999', fontSize: '11px', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Sponsored</p>

          {/* DUKE LANGUAGE */}
          <Link href="/sponsors/duke-language" style={{ textDecoration: 'none' }}>
            <div style={{ width: '240px', height: '240px', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', border: '2px solid #3b5bdb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', gap: '8px' }}>
              <div style={{ background: '#3b5bdb', color: 'white', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px' }}>Sponsored</div>
              <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
              <div style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '13px', lineHeight: '1.4' }}>Learn Thai, English & Chinese</div>
              <div style={{ background: '#3b5bdb', color: 'white', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Explore Courses →</div>
            </div>
          </Link>

          {/* EXPAT SERVICES */}
          <Link href="/expat-services" style={{ textDecoration: 'none' }}>
            <div style={{ width: '240px', background: 'linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '2px solid #5eead4', padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '32px' }}>🏙️</div>
              <div style={{ color: '#5eead4', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Expat Services Thailand</div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '13px', lineHeight: '1.4' }}>Cleaning · Visa · Insurance<br />Health · Transport & more</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', lineHeight: '1.5' }}>Trusted services for expats living & working in Thailand</div>
              <div style={{ background: '#5eead4', color: '#0f4c47', padding: '7px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>Browse Services →</div>
            </div>
          </Link>

          {/* LUCKY CLEANING */}
          <a href="https://www.facebook.com/share/1AviMhTNzJ/?utm_source=website&utm_medium=banner&utm_campaign=lucky_cleaning"
            target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ width: '240px', height: '240px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
              <img src="/lucky_cleaning_service.jpg" alt="Lucky Cleaning Service Bangkok" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </a>

          {/* RENTALS */}
          <a href="/rentals" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '2px solid #E85D26' }}>
              <div style={{ background: '#E85D26', padding: '10px', textAlign: 'center' }}>
                <div style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Rentals in Thailand</div>
              </div>
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏠</div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '17px', marginBottom: '6px' }}>Find Your Home</div>
                <div style={{ color: '#ccc', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>Condos, houses & villas across Bangkok, Chiang Mai, Phuket & more</div>
                <div style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Browse Properties →</div>
              </div>
            </div>
          </a>

          <div style={{ background: 'white', borderRadius: '12px', border: '2px dashed #ddd', padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>💊</div>
            <div style={{ fontWeight: 'bold', color: '#888', fontSize: '15px', marginBottom: '6px' }}>Advertise Here</div>
            <div style={{ color: '#bbb', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>Health insurance & medical services</div>
            <Link href="/contact" style={{ background: '#2D6BE4', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>Get in Touch</Link>
          </div>
        </div>

      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '60px 24px', background: '#f9f9f9', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Browse by Category</h2>
        <p style={{ color: '#666', marginBottom: '40px' }}>Find jobs that match your skills</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '🏫', label: 'Teaching / ESL', href: '/jobs/teaching' },
            { icon: '🏨', label: 'Hospitality', href: '/jobs/other' },
            { icon: '💻', label: 'Technology', href: '/jobs/other' },
            { icon: '📊', label: 'Finance', href: '/jobs/other' },
            { icon: '🌍', label: 'Tourism', href: '/jobs/other' },
            { icon: '🏠', label: 'Rentals', href: '/rentals' },
          ].map((cat) => (
            <Link href={cat.href} key={cat.label} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '20px 24px', minWidth: '130px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{cat.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section style={{ background: 'white', padding: '60px 24px', textAlign: 'center', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '12px', color: '#1a1a2e' }}>Get in Touch</h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
            Have a question about a job, want to advertise, or just want to say hello?
          </p>
          <Link href="/contact" style={{ background: '#E85D26', color: 'white', padding: '16px 48px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px', display: 'inline-block' }}>
            Send us a Message
          </Link>
        </div>
      </section>

      {/* SUPPORT THE SITE */}
      <section style={{ background: '#fffbeb', padding: '48px 24px', textAlign: 'center', borderTop: '1px solid #fde68a' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🙏</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e', marginBottom: '12px' }}>This site is completely free</h2>
          <p style={{ color: '#78350f', fontSize: '15px', lineHeight: '1.8', marginBottom: '8px' }}>
            Jobs in Thailand is run by one person, with no corporate backing, no investors, and no ads selling your data.
          </p>
          <p style={{ color: '#78350f', fontSize: '15px', lineHeight: '1.8', marginBottom: '8px' }}>
            Every job listing, every ESL game, every lesson plan page — built and maintained solo, for the teaching community in Thailand.
          </p>
          <p style={{ color: '#92400e', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.8', marginBottom: '24px' }}>
            If this site helped you find a job, a teacher, or a great classroom game — a small coffee means the world. ☕
          </p>
          <BuyMeCoffee />
        </div>
      </section>

      {/* EMPLOYER CTA */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Hiring in Thailand?</h2>
        <p style={{ color: '#ccc', fontSize: '18px', marginBottom: '32px' }}>Post your job free and reach thousands of qualified candidates</p>
        <Link href="/employers" style={{ background: '#E85D26', color: 'white', padding: '16px 48px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
          Post a Job Today
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '12px' }}>
            <Link href="/jobs/teaching" style={{ color: '#888', textDecoration: 'none', margin: '0 12px', fontSize: '14px' }}>Teaching Jobs</Link>
            <Link href="/jobs/other" style={{ color: '#888', textDecoration: 'none', margin: '0 12px', fontSize: '14px' }}>Other Jobs</Link>
            <Link href="/rentals" style={{ color: '#888', textDecoration: 'none', margin: '0 12px', fontSize: '14px' }}>Rentals</Link>
            <Link href="/employers" style={{ color: '#888', textDecoration: 'none', margin: '0 12px', fontSize: '14px' }}>Post a Job</Link>
            <Link href="/contact" style={{ color: '#888', textDecoration: 'none', margin: '0 12px', fontSize: '14px' }}>Contact</Link>
          </div>
          <div style={{ color: '#555', fontSize: '13px' }}>
            © {new Date().getFullYear()} Thailand Jobs · All rights reserved
          </div>
        </div>
      </footer>

    </main>
  )
}
