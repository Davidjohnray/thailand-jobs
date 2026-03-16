'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'standard'
  const isStandard = plan === 'standard'

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '480px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{isStandard ? '⭐' : '💎'}</div>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
          {isStandard ? 'Standard Plan' : 'Premium Plan'}
        </h1>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: isStandard ? '#E85D26' : '#2D6BE4', marginBottom: '4px' }}>
          {isStandard ? '฿299' : '฿599'}
        </div>
        <div style={{ color: '#999', fontSize: '14px', marginBottom: '32px' }}>per month</div>

        <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px', color: '#1a1a2e' }}>What you get:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(isStandard
              ? ['Everything in Free', '5 CV templates', 'No watermark', 'Save up to 3 CVs', 'AI writing suggestions']
              : ['Everything in Standard', '15+ CV templates', 'Unlimited saved CVs', 'Cover letter builder', 'LinkedIn import', 'Priority support']
            ).map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#444' }}>
                <span style={{ color: isStandard ? '#E85D26' : '#2D6BE4', fontWeight: 'bold' }}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: '#fff3ed', border: '1px solid #ffd4b8', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ color: '#E85D26', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' }}>🚧 Payment Coming Soon</p>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>We are setting up secure payments. Get in touch and we will set you up manually in the meantime!</p>
        </div>

        <Link href="/contact" style={{ display: 'block', background: isStandard ? '#E85D26' : '#2D6BE4', color: 'white', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>
          Contact Us to Subscribe →
        </Link>
        <Link href="/cv-builder" style={{ display: 'block', color: '#888', fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Plans
        </Link>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}