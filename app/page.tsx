import Link from 'next/link'
import { supabase } from '../src/lib/supabase'
import HomeFeaturedJobs from '../components/HomeFeaturedJobs'
import BuyMeCoffee from '../components/BuyMeCoffee'

export const revalidate = 0

export default async function Home() {
  const now = new Date().toISOString()

  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('featured', true)
    .gt('expires_at', now)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <main>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>

          {/* LEFT AD BOX - RENTALS */}
          <a href="/rentals" style={{ textDecoration: 'none', flexShrink: 0 }} className="hero-side-ad">
            <div style={{ width: '250px', height: '250px', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', border: '2px solid #E85D26', borderRadius: '10px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏠</div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', marginBottom: '6px' }}>Rentals in Thailand</div>
              <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '6px' }}>Condos, Houses & Villas</div>
              <div style={{ color: '#ccc', fontSize: '11px', marginBottom: '12px' }}>Bangkok • Chiang Mai • Phuket & more</div>
              <div style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>Browse Properties →</div>
            </div>
          </a>

          {/* HERO TEXT */}
          <div style={{ flex: 1, maxWidth: '600px' }}>
            <h1 className="hero-title" style={{ color: 'white', fontSize: '44px', fontWeight: 'bold', marginBottom: '16px' }}>
              Find Your Dream Job in Thailand
            </h1>
            <p className="hero-sub" style={{ color: '#ccc', fontSize: '18px', marginBottom: '40px' }}>
              Teaching jobs, hospitality, tech and more — all across Thailand
            </p>
            <div className="search-bar" style={{ display: 'flex', justifyContent: 'center' }}>
              <input type="text" placeholder="Job title, keyword..." className="search-input"
                style={{ flex: 1, padding: '16px', fontSize: '16px', border: 'none', borderRadius: '8px 0 0 8px', outline: 'none' }} />
              <Link href="/jobs">
                <button className="search-btn" style={{ background: '#E85D26', color: 'white', padding: '16px 32px', fontSize: '16px', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: 'bold' }}>
                  Search Jobs
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT AD BOX */}
          <a href="/contact" style={{ textDecoration: 'none', flexShrink: 0 }} className="hero-side-ad">
            <div style={{ width: '250px', height: '250px', background: 'rgba(255,255,255,0.08)', border: '2px dashed rgba(255,255,255,0.25)', borderRadius: '10px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📢</div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Advertise Here</div>
              <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '12px' }}>250 x 250px</div>
              <div style={{ background: '#E85D26', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Get in Touch</div>
            </div>
          </a>

        </div>
      </section>

      {/* LINE COMMUNITY BANNER */}
      <section style={{ background: '#06C755', padding: '24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '32px' }}>💬</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Join our FREE LINE Community — Thailand Teaching Jobs!</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Get job tips, visa advice & connect with teachers across Thailand</div>
          </div>
          <a href="https://line.me/ti/g2/MGV6FgMkGOdFSUeaPsHUyMf2P2hYAT5-a6f5Vg" target="_blank" rel="noopener noreferrer"
            style={{ background: 'white', color: '#06C755', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
            Join Now →
          </a>
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

            <Link href="/coming-soon" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#1a1a2e', borderRadius: '12px', overflow: 'hidden', border: '2px solid #E85D26' }}>
                <div style={{ background: '#E85D26', padding: '8px', textAlign: 'center' }}>
                  <div style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Partner Site</div>
                </div>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🇹🇭</div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>Thai Expat Services</div>
                  <div style={{ color: '#ccc', fontSize: '13px', marginBottom: '12px' }}>Visas, work permits & expat services in Thailand</div>
                  <div style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Visit Site →</div>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* AD SIDEBAR COLUMN 1 */}
        <div className="ad-sidebar" style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#999', fontSize: '11px', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Sponsored</p>
          <Link href="/coming-soon" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '2px solid #E85D26' }}>
              <div style={{ background: '#E85D26', padding: '10px', textAlign: 'center' }}>
                <div style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Partner Site</div>
              </div>
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🇹🇭</div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '17px', marginBottom: '6px' }}>Thai Expat Services</div>
                <div style={{ color: '#ccc', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>Visas, work permits & expat services in Thailand</div>
                <div style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Visit Site →</div>
              </div>
            </div>
          </Link>
          <div style={{ background: 'white', borderRadius: '12px', border: '2px dashed #ddd', padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📚</div>
            <div style={{ fontWeight: 'bold', color: '#888', fontSize: '15px', marginBottom: '6px' }}>Advertise Here</div>
            <div style={{ color: '#bbb', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>TEFL courses, visa services, expat resources</div>
            <Link href="/contact" style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>Get in Touch</Link>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', border: '2px dashed #ddd', padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎓</div>
            <div style={{ fontWeight: 'bold', color: '#888', fontSize: '15px', marginBottom: '6px' }}>Advertise Here</div>
            <div style={{ color: '#bbb', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>Reach thousands of expats and job seekers</div>
            <Link href="/contact" style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>Get in Touch</Link>
          </div>
        </div>

        {/* AD SIDEBAR COLUMN 2 */}
        <div className="ad-sidebar" style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#999', fontSize: '11px', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Sponsored</p>

          <a href="https://www.facebook.com/share/1AviMhTNzJ/?utm_source=website&utm_medium=banner&utm_campaign=lucky_cleaning"
            target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ width: '240px', height: '240px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
              <img src="/lucky_cleaning_service.jpg" alt="Lucky Cleaning Service Bangkok" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </a>

          <div style={{ background: 'white', borderRadius: '12px', border: '2px dashed #ddd', padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🏠</div>
            <div style={{ fontWeight: 'bold', color: '#888', fontSize: '15px', marginBottom: '6px' }}>Advertise Here</div>
            <div style={{ color: '#bbb', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>Housing & accommodation in Thailand</div>
            <Link href="/contact" style={{ background: '#2D6BE4', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>Get in Touch</Link>
          </div>

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