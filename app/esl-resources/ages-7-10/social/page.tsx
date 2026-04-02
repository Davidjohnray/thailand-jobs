'use client'
import Link from 'next/link'

export default function ComingSoonPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/esl-resources/ages-7-10" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>
            Back to Ages 7-10
          </Link>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '20px 0 8px' }}>Coming Soon</h1>
          <p style={{ opacity: 0.8, fontSize: '16px', margin: 0 }}>Lesson plans for this subject are being prepared. Check back soon!</p>
        </div>
      </div>
      <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔜</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Lesson Plans Coming Soon</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>We are currently building lesson plans for this subject. Sign up or check back shortly!</p>
          <Link href="/esl-resources" style={{ display: 'inline-block', background: '#1a1a2e', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
            Browse All Resources
          </Link>
        </div>
      </div>
    </main>
  )
}