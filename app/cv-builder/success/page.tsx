import Link from 'next/link'

export default function CVBuilderSuccess() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px 32px', maxWidth: '520px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>

        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Payment Successful!</h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
          Thank you for your purchase! Here's how to get started:
        </p>

        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
          <p style={{ color: '#166534', fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px' }}>✅ Next steps:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { step: '1', text: 'Email us at david@jobsinthailand.net with your payment confirmation' },
              { step: '2', text: 'We will send your personal access code within a few hours' },
              { step: '3', text: 'Enter your code on the unlock page to access your plan' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ background: '#E85D26', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>
                  {item.step}
                </div>
                <p style={{ color: '#166534', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff3ed', border: '1px solid #ffd4b8', borderRadius: '10px', padding: '16px', marginBottom: '32px' }}>
          <p style={{ color: '#E85D26', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' }}>📧 Email us now:</p>
          <p style={{ color: '#E85D26', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>david@jobsinthailand.net</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/cv-builder/unlock" style={{ display: 'block', background: '#E85D26', color: 'white', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
            I Have My Code — Unlock Now →
          </Link>
          <Link href="/cv-builder/build" style={{ display: 'block', background: 'white', color: '#666', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', border: '1px solid #ddd' }}>
            Use Free Builder While I Wait
          </Link>
        </div>

      </div>
    </main>
  )
}