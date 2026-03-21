import Link from 'next/link'

export default function AdvertisePage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📢</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>Advertise With Us</h1>
        <p style={{ color: '#ccc', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Reach thousands of expats, teachers and job seekers across Thailand every month. Affordable rates, targeted audience, instant exposure.
        </p>
      </section>

      {/* STATS */}
      <section style={{ background: '#E85D26', padding: '32px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', textAlign: 'center' }}>
          {[
            { number: '10,000+', label: 'Monthly Visitors' },
            { number: '500+', label: 'Jobs Listed Monthly' },
            { number: '🇹🇭', label: 'All Thailand' },
            { number: '100%', label: 'Expat Focused' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{stat.number}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AD PACKAGES */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>Advertising Packages</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '48px', fontSize: '16px' }}>Simple transparent pricing — no hidden fees</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* SIDEBAR BOX */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>📦</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Sidebar Banner</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>250 x 250px — displayed on the homepage sidebar</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {['Homepage placement', 'Thousands of views', 'Link to your website', 'Your logo & branding'].map(f => (
                    <span key={f} style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>PRICING</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>1 Month</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿1,500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>3 Months</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿3,500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>6 Months</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿6,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO SIDE BOX */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #E85D26', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '32px', background: '#E85D26', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
              PREMIUM PLACEMENT
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>⭐</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Hero Side Banner</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>250 x 250px — displayed next to the main homepage title</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {['Prime homepage position', 'First thing visitors see', 'Maximum exposure', 'Link to your website', 'Your logo & branding'].map(f => (
                    <span key={f} style={{ background: '#fff3ed', color: '#E85D26', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>PRICING</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>1 Month</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿2,000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>3 Months</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿5,000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>6 Months</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿9,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURED JOB */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>🚀</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Featured Job Listing</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>Your job at the top of all listings + homepage for 14 days</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {['Homepage featured section', 'Top of all job listings', '⭐ Featured badge', '14 days live', 'Instant activation'].map(f => (
                    <span key={f} style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>ONE-OFF PRICE</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#E85D26' }}>฿500</div>
                  <div style={{ color: '#999', fontSize: '13px' }}>per listing</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* WHY ADVERTISE */}
      <section style={{ background: 'white', padding: '60px 24px', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '48px', color: '#1a1a2e' }}>Why Advertise With Us?</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
            {[
              { icon: '🎯', title: 'Targeted Audience', desc: 'Reach expats, teachers and professionals actively looking for work in Thailand' },
              { icon: '💰', title: 'Affordable Rates', desc: 'Much cheaper than the big job boards — better value for your budget' },
              { icon: '🇹🇭', title: 'Thailand Focused', desc: 'A dedicated Thailand job board — your ad reaches the right people' },
              { icon: '⚡', title: 'Instant Setup', desc: 'Your ad goes live within 24 hours of payment' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Your ad is seen on desktop and mobile devices' },
              { icon: '📈', title: 'Growing Fast', desc: 'New visitors every day as we grow our audience across Thailand' },
            ].map(f => (
              <div key={f.title} style={{ flex: 1, minWidth: '220px', maxWidth: '260px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#1a1a2e' }}>{f.title}</div>
                <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>Ready to Advertise?</h2>
        <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 24px' }}>
          Get in touch and we will set up your ad within 24 hours. We accept bank transfer and PromptPay.
        </p>

        {/* ACCOUNT PROMPT */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '16px', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>💡 Already a member?</p>
          <p style={{ color: '#ccc', fontSize: '13px', margin: '0 0 10px' }}>Log in to message us directly and track your advertising enquiry in your account.</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <a href="/account/login" style={{ background: 'white', color: '#1a1a2e', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', display: 'inline-block' }}>Login to My Account</a>
            <a href="/account/register" style={{ background: '#E85D26', color: 'white', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', display: 'inline-block' }}>Create Account</a>
          </div>
        </div>

        <Link href="/contact" style={{ background: '#E85D26', color: 'white', padding: '16px 48px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px', display: 'inline-block' }}>
          Get in Touch →
        </Link>
      </section>

    </main>
  )
}