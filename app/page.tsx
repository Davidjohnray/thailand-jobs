import Link from 'next/link'
import { supabase } from '../src/lib/supabase'

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
      <style>{`
        @media (max-width: 768px) {
          .ad-sidebar { display: none !important; }
          .main-content { flex-direction: column !important; }
          .hero-title { font-size: 28px !important; }
          .hero-sub { font-size: 15px !important; }
          .search-bar { flex-direction: column !important; border-radius: 8px !important; }
          .search-input { border-radius: 8px 8px 0 0 !important; }
          .search-btn { border-radius: 0 0 8px 8px !important; width: 100% !important; }
          .category-grid { gap: 10px !important; }
          .category-card { min-width: 100px !important; padding: 14px 16px !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ color: 'white', fontSize: '44px', fontWeight: 'bold', marginBottom: '16px' }}>
          Find Your Dream Job in Thailand
        </h1>
        <p className="hero-sub" style={{ color: '#ccc', fontSize: '18px', marginBottom: '40px' }}>
          Teaching jobs, hospitality, tech and more — all across Thailand
        </p>
        <div className="search-bar" style={{ display: 'flex', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <input type="text" placeholder="Job title, keyword..." className="search-input"
            style={{ flex: 1, padding: '16px', fontSize: '16px', border: 'none', borderRadius: '8px 0 0 8px', outline: 'none' }} />
          <Link href="/jobs">
            <button className="search-btn" style={{ background: '#E85D26', color: 'white', padding: '16px 32px', fontSize: '16px', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: 'bold' }}>
              Search Jobs
            </button>
          </Link>
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

          {featuredJobs && featuredJobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {featuredJobs.map((job: any) => (
                <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', border: '2px solid #E85D26', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(232,93,38,0.08)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{job.title}</span>
                          <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>⭐ Featured</span>
                          {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>}
                        </div>
                        <div style={{ color: '#555', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>{job.company} • {job.location}</div>
                        <span style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>{job.category}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '15px', marginBottom: '6px' }}>{job.salary}</div>
                        <div style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>{job.job_type}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
              <p style={{ color: '#666', marginBottom: '12px' }}>No featured jobs yet</p>
              <Link href="/employers" style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>Be the first to feature your job →</Link>
            </div>
          )}
        </div>

        {/* AD SIDEBAR COLUMN 1 */}
        <div className="ad-sidebar" style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#999', fontSize: '11px', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Sponsored</p>
          <a href="https://thaiexpatservices.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
          </a>
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
          <div style={{ background: 'white', borderRadius: '12px', border: '2px dashed #ddd', padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>✈️</div>
            <div style={{ fontWeight: 'bold', color: '#888', fontSize: '15px', marginBottom: '6px' }}>Advertise Here</div>
            <div style={{ color: '#bbb', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>Travel & relocation services</div>
            <Link href="/contact" style={{ background: '#2D6BE4', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>Get in Touch</Link>
          </div>
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
        <div className="category-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '🏫', label: 'Teaching / ESL', href: '/jobs/teaching' },
            { icon: '🏨', label: 'Hospitality', href: '/jobs/other' },
            { icon: '💻', label: 'Technology', href: '/jobs/other' },
            { icon: '📊', label: 'Finance', href: '/jobs/other' },
            { icon: '🌍', label: 'Tourism', href: '/jobs/other' },
            { icon: '📚', label: 'Education', href: '/jobs/teaching' },
          ].map((cat) => (
            <Link href={cat.href} key={cat.label} style={{ textDecoration: 'none' }}>
              <div className="category-card" style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '20px 24px', minWidth: '130px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{cat.label}</div>
              </div>
            </Link>
          ))}
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
            <Link href="/employers" style={{ color: '#888', textDecoration: 'none', margin: '0 12px', fontSize: '14px' }}>Post a Job</Link>
            <Link href="/contact" style={{ color: '#888', textDecoration: 'none', margin: '0 12px', fontSize: '14px' }}>Advertise</Link>
          </div>
          <div style={{ color: '#555', fontSize: '13px' }}>
            © {new Date().getFullYear()} Thailand Jobs · All rights reserved
          </div>
        </div>
      </footer>

    </main>
  )
}