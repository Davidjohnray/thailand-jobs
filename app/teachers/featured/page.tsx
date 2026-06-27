import Link from 'next/link'

export const metadata = {
  title: 'Get Featured | Teacher Directory | Jobs in Thailand',
  description: 'Boost your teacher profile to the top of the directory. Be seen first by schools and recruiters across Thailand.',
}

export default function FeaturedTeachersPage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', padding: '60px 24px', textAlign: 'center', borderBottom: '4px solid #f59e0b' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
        <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', margin: '0 0 12px' }}>Get Featured on the Teacher Directory</h1>
        <p style={{ color: '#ccc', fontSize: '18px', maxWidth: '560px', margin: '0 auto 28px', lineHeight: '1.6' }}>
          Stand out from 100+ teachers. Your profile shown first — in the spotlight carousel at the top of the page, seen by every school and recruiter who visits.
        </p>
        <div style={{ display: 'inline-block', background: '#f59e0b', color: '#1a1a2e', fontSize: '32px', fontWeight: 'bold', padding: '14px 36px', borderRadius: '12px' }}>
          ฿50 for 1 week
        </div>
        <p style={{ color: '#aaa', fontSize: '14px', marginTop: '10px' }}>First come, first served — maximum 12 slots per week</p>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', textAlign: 'center', marginBottom: '40px' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {[
            { icon: '📩', step: '1', title: 'Contact us', desc: 'Send us a message using the button below. Tell us your name or profile link.' },
            { icon: '💳', step: '2', title: 'Pay ฿50', desc: 'Transfer to our Thai bank account. We confirm payment and activate your slot within a few hours.' },
            { icon: '⭐', step: '3', title: 'Go live', desc: 'Your profile appears in the featured carousel at the top of the directory for 7 days.' },
            { icon: '🏫', step: '4', title: 'Get noticed', desc: 'Schools and recruiters browsing the directory see your profile first — every single visit.' },
          ].map(item => (
            <div key={item.step} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{item.icon}</div>
              <div style={{ background: '#f59e0b', color: '#1a1a2e', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', margin: '0 auto 10px' }}>{item.step}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* WHAT YOU GET */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', borderRadius: '16px', padding: '36px', marginBottom: '40px', border: '2px solid #f59e0b' }}>
          <h2 style={{ color: '#f59e0b', fontSize: '22px', fontWeight: 'bold', margin: '0 0 20px', textAlign: 'center' }}>What you get for ฿50</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Your profile card shown in the auto-scrolling carousel at the very top of the directory',
              'Big profile photo displayed prominently — make a great first impression',
              '⭐ FEATURED badge on your card so schools know you\'re a priority candidate',
              'Visible to every school, recruiter and visitor who browses the directory for 7 days',
              'Up to 12 featured slots available per week — first come, first served',
              'Your regular profile listing stays in the directory as normal after the week ends',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                <span style={{ color: '#e5e7eb', fontSize: '15px', lineHeight: '1.5' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SLOTS NOTICE */}
        <div style={{ background: '#fff7ed', border: '2px solid #f59e0b', borderRadius: '12px', padding: '20px 24px', marginBottom: '40px', textAlign: 'center' }}>
          <p style={{ color: '#92400e', fontWeight: 'bold', fontSize: '16px', margin: '0 0 6px' }}>⚡ Limited to 12 slots per week</p>
          <p style={{ color: '#78350f', fontSize: '14px', margin: 0 }}>Slots are filled on a first-come, first-served basis. Once a week is full, you'll be added to the next available week.</p>
        </div>

        {/* REQUIREMENTS */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Requirements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'You must already have a profile in the Teacher Directory',
              'Your profile must be approved and active',
              'A profile photo is strongly recommended — cards with photos get far more clicks',
            ].map((req, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#E85D26', flexShrink: 0 }}>→</span>
                <span style={{ color: '#555', fontSize: '14px' }}>{req}</span>
              </div>
            ))}
          </div>
          <p style={{ color: '#888', fontSize: '13px', margin: '16px 0 0' }}>
            Not in the directory yet? <Link href="/teachers/register" style={{ color: '#E85D26', fontWeight: 'bold' }}>Register your free profile →</Link>
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Ready to get featured?</h2>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '28px' }}>Contact us via any of the options below and we'll get your slot set up within a few hours.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '420px', margin: '0 auto 32px' }}>
            {/* WhatsApp */}
            <a href="https://wa.me/66819603740?text=Hi%2C%20I%27d%20like%20to%20book%20a%20featured%20slot%20on%20the%20Teacher%20Directory.%20My%20profile%20name%2Flink%20is%3A"
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              <span style={{ fontSize: '22px' }}>💬</span> Contact via WhatsApp
            </a>

            {/* LINE */}
            <a href="https://line.me/ti/p/~davidray_thailand"
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#06C755', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              <span style={{ fontSize: '22px' }}>💚</span> Contact via LINE
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com/jobsinthailand.net"
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#1877F2', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              <span style={{ fontSize: '22px' }}>📘</span> Message on Facebook
            </a>

            {/* Email */}
            <a href="mailto:Admin@jobsinthailand.net?subject=Featured Teacher Slot&body=Hi, I'd like to book a featured slot on the Teacher Directory. My profile name/link is:"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#1a1a2e', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              <span style={{ fontSize: '22px' }}>📧</span> Email: Admin@jobsinthailand.net
            </a>
          </div>

          <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '10px', padding: '16px 20px', maxWidth: '420px', margin: '0 auto 28px' }}>
            <p style={{ color: '#555', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
              Send us your <strong>profile name or link</strong> and we'll confirm your slot and send payment details (฿50 via PromptPay or bank transfer). Your profile goes live within a few hours of payment.
            </p>
          </div>

          <Link href="/teachers" style={{ color: '#2D6BE4', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>
            ← Back to Teacher Directory
          </Link>
        </div>
      </section>
    </main>
  )
}
