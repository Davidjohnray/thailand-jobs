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

          {/* SIDEBAR BANNER */}
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {['Homepage placement', 'Thousands of views', 'Link to your website', 'Your logo & branding'].map(f => (
                    <span key={f} style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 14px', display: 'inline-block' }}>
                  <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '700' }}>🎓 Free Training Page banner included</span>
                  <span style={{ color: '#555', fontSize: '12px' }}> — for TEFL, language & training course advertisers</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>PRICING</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>1 Month</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>3 Months</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿1,400</span>
                        <div style={{ color: '#16a34a', fontSize: '11px', fontWeight: '600' }}>save ฿100</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>6 Months</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿2,700</span>
                        <div style={{ color: '#16a34a', fontSize: '11px', fontWeight: '600' }}>save ฿300</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO SIDE BANNER */}
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {['Prime homepage position', 'First thing visitors see', 'Maximum exposure', 'Link to your website', 'Your logo & branding'].map(f => (
                    <span key={f} style={{ background: '#fff3ed', color: '#E85D26', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 14px', display: 'inline-block' }}>
                  <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '700' }}>🎓 Free Training Page banner included</span>
                  <span style={{ color: '#555', fontSize: '12px' }}> — for TEFL, language & training course advertisers</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>PRICING</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>1 Month</span><span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿750</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>3 Months</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿2,100</span>
                        <div style={{ color: '#16a34a', fontSize: '11px', fontWeight: '600' }}>save ฿150</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '15px', color: '#333' }}>
                      <span>6 Months</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 'bold', color: '#E85D26' }}>฿4,000</span>
                        <div style={{ color: '#16a34a', fontSize: '11px', fontWeight: '600' }}>save ฿500</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TRAINING PAGE BANNER */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #0ea5e9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>🎓</span>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Training Page Banner</h3>
                    <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>Featured placement on the Training & Courses section</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {['Training section placement', 'Reach course-seekers directly', 'TEFL, language & tutoring', 'Link to your website'].map(f => (
                    <span key={f} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>✓ {f}</span>
                  ))}
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 14px', display: 'inline-block' }}>
                  <span style={{ color: '#92400e', fontSize: '13px', fontWeight: '700' }}>💡 Already included free</span>
                  <span style={{ color: '#555', fontSize: '12px' }}> — if you purchase a Homepage Sidebar or Hero Banner</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: '#e0f2fe', borderRadius: '12px', padding: '20px 24px' }}>
                  <div style={{ color: '#0369a1', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>STANDALONE PRICE</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0369a1' }}>฿300</div>
                  <div style={{ color: '#555', fontSize: '13px' }}>per month</div>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURED JOB LISTING */}
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
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#E85D26' }}>฿300</div>
                  <div style={{ color: '#999', fontSize: '13px' }}>per listing · 14 days</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK COMPARISON */}
      <section style={{ background: 'white', padding: '48px 24px', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', color: '#1a1a2e' }}>Quick Price Summary</h2>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid #eee' }}>
            <div style={{ background: '#1a1a2e', padding: '14px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
              {['Placement', '1 Month', '3 Months', '6 Months'].map(h => (
                <div key={h} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</div>
              ))}
            </div>
            {[
              { name: 'Sidebar Banner', prices: ['฿500', '฿1,400', '฿2,700'] },
              { name: 'Hero Side Banner', prices: ['฿750', '฿2,100', '฿4,000'], highlight: true },
              { name: 'Training Page', prices: ['฿300', '฿300/mo', '฿300/mo'], note: 'standalone' },
              { name: 'Featured Job', prices: ['฿300', '—', '—'], note: '14 days' },
            ].map((row, i) => (
              <div key={row.name} style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', background: row.highlight ? '#fff3ed' : i % 2 === 0 ? 'white' : '#f9f9f9', borderTop: '1px solid #eee' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>
                  {row.name}
                  {row.note && <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '400', marginLeft: '4px' }}>({row.note})</span>}
                </div>
                {row.prices.map((p, pi) => (
                  <div key={pi} style={{ fontWeight: '700', fontSize: '15px', color: row.highlight ? '#E85D26' : '#374151' }}>{p}</div>
                ))}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#16a34a', fontSize: '13px', fontWeight: '600', marginTop: '16px' }}>
            🎓 Training page placement included FREE with any Sidebar or Hero banner for TEFL, language & training course advertisers
          </p>
        </div>
      </section>

      {/* WHY ADVERTISE */}
      <section style={{ background: '#f9f9f9', padding: '60px 24px', borderTop: '1px solid #eee' }}>
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
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '16px', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>💡 Already a member?</p>
          <p style={{ color: '#ccc', fontSize: '13px', margin: '0 0 10px' }}>Log in to message us directly and track your advertising enquiry in your account.</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <a href="/account/login" style={{ background: 'white', color: '#1a1a2e', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', display: 'inline-block' }}>Login to My Account</a>
            <a href="/account/register" style={{ background: '#E85D26', color: 'white', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', display: 'inline-block' }}>Create Account</a>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/account/register" style={{ background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block' }}>
            Create Account & Enquire →
          </Link>
          <Link href="/contact" style={{ background: 'white', color: '#1a1a2e', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block', border: '1px solid #ddd' }}>
            Contact Us Directly
          </Link>
        </div>
      </section>

    </main>
  )
}
