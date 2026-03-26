import Link from 'next/link'

export default function EmployersPage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', marginBottom: '16px' }}>
          Post a Job in Thailand
        </h1>
        <p style={{ color: '#ccc', fontSize: '18px' }}>
          Reach thousands of qualified candidates across Thailand
        </p>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>

        {/* TEACHING JOBS SECTION */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <span style={{ fontSize: '36px' }}>🏫</span>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Teaching Jobs</h2>
              <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>ESL, international schools, universities, tutoring</p>
            </div>
          </div>
          <div style={{ height: '2px', background: '#E85D26', marginBottom: '32px', borderRadius: '2px' }} />
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

            {/* Free Teaching */}
            <div style={{ flex: 1, minWidth: '260px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: '#1a1a2e' }}>Standard Listing</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>FREE</div>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '13px' }}>No payment required</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
                {['✓ Listed on jobs page', '✓ Flexible listing duration', '✓ Apply via email', '✗ Not on homepage', '✗ No priority placement'].map((item, i) => (
                  <li key={i} style={{ padding: '7px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: item.startsWith('✗') ? '#999' : '#333' }}>{item}</li>
                ))}
              </ul>
              <Link href="/employers/post-job?category=teaching" style={{ display: 'block', textAlign: 'center', background: '#1a1a2e', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                Post Free Teaching Job →
              </Link>
            </div>

            {/* Featured Teaching */}
            <div style={{ flex: 1, minWidth: '260px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(232,93,38,0.15)', border: '2px solid #E85D26', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#E85D26', color: 'white', padding: '4px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                MOST POPULAR
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: '#1a1a2e' }}>⭐ Featured Listing</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#E85D26', marginBottom: '4px' }}>500 THB</div>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '13px' }}>Per listing</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
                {['✓ Listed on jobs page', '✓ Flexible listing duration', '✓ Apply via email', '✓ Featured on homepage', '✓ Top of all listings', '✓ Featured badge', '✓ 3x more applications'].map((item, i) => (
                  <li key={i} style={{ padding: '7px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: '#333' }}>{item}</li>
                ))}
              </ul>
              <Link href="/employers/post-featured?category=teaching" style={{ display: 'block', textAlign: 'center', background: '#E85D26', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                ⭐ Post Featured Teaching Job →
              </Link>
            </div>

          </div>
        </div>

        {/* OTHER JOBS SECTION */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <span style={{ fontSize: '36px' }}>💼</span>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Other Jobs</h2>
              <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>Hospitality, technology, tourism, finance, marketing and more</p>
            </div>
          </div>
          <div style={{ height: '2px', background: '#2D6BE4', marginBottom: '32px', borderRadius: '2px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
            {['🏨 Hospitality', '💻 Technology', '🌍 Tourism', '📊 Finance', '📣 Marketing', '🏥 Healthcare', '🎨 Creative', '📦 Other'].map(cat => (
              <span key={cat} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', color: '#555' }}>{cat}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

            {/* Free Other */}
            <div style={{ flex: 1, minWidth: '260px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: '#1a1a2e' }}>Standard Listing</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>FREE</div>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '13px' }}>No payment required</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
                {['✓ Listed on jobs page', '✓ Flexible listing duration', '✓ Apply via email', '✗ Not on homepage', '✗ No priority placement'].map((item, i) => (
                  <li key={i} style={{ padding: '7px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: item.startsWith('✗') ? '#999' : '#333' }}>{item}</li>
                ))}
              </ul>
              <Link href="/employers/post-job?category=other" style={{ display: 'block', textAlign: 'center', background: '#1a1a2e', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                Post Free Job →
              </Link>
            </div>

            {/* Featured Other */}
            <div style={{ flex: 1, minWidth: '260px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(45,107,228,0.15)', border: '2px solid #2D6BE4', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#2D6BE4', color: 'white', padding: '4px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                MOST POPULAR
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: '#1a1a2e' }}>⭐ Featured Listing</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2D6BE4', marginBottom: '4px' }}>500 THB</div>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '13px' }}>Per listing</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
                {['✓ Listed on jobs page', '✓ Flexible listing duration', '✓ Apply via email', '✓ Featured on homepage', '✓ Top of all listings', '✓ Featured badge', '✓ 3x more applications'].map((item, i) => (
                  <li key={i} style={{ padding: '7px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: '#333' }}>{item}</li>
                ))}
              </ul>
              <Link href="/employers/post-featured?category=other" style={{ display: 'block', textAlign: 'center', background: '#2D6BE4', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                ⭐ Post Featured Job →
              </Link>
            </div>

          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Common Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: 'How do I pay for a featured listing?', a: 'After submitting your job we will contact you by email to arrange payment via bank transfer or PromptPay.' },
              { q: 'When will my featured job go live?', a: 'Your job goes live immediately. The featured badge and homepage placement is activated once payment is confirmed.' },
              { q: 'Can I upgrade a free listing to featured?', a: 'Yes! Email us after posting and we can upgrade your listing at any time.' },
              { q: 'How long does a listing stay up?', a: 'You can choose 3, 5, 7 or 14 days when posting your job.' },
            ].map((faq, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>{faq.q}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}