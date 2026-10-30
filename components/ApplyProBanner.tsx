'use client'
import Link from 'next/link'

// Eye-catching Apply Pro promo strip — drop <ApplyProBanner /> on any page
export default function ApplyProBanner() {
  return (
    <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #3a1c10 100%)', padding: '36px 16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 420px', minWidth: '280px' }}>
          <div style={{ display: 'inline-block', background: '#E85D26', color: 'white', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', padding: '4px 12px', borderRadius: '20px', marginBottom: '12px' }}>
            ⚡ NEW — APPLY PRO
          </div>
          <h2 style={{ color: 'white', fontSize: '28px', lineHeight: '1.25', margin: '0 0 10px' }}>
            Did the school even open your CV? <span style={{ color: '#E85D26' }}>Now you'll know.</span>
          </h2>
          <p style={{ color: '#ccc', fontSize: '15px', lineHeight: '1.6', margin: '0 0 18px' }}>
            Apply in one click, let AI write your application for each job — in English <em>and</em> Thai — and see the moment a school views it.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/apply-pro" style={{ background: '#E85D26', color: 'white', padding: '13px 26px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
              🎁 Try it free →
            </Link>
            <span style={{ color: '#aaa', fontSize: '13px', alignSelf: 'center' }}>3 free applications · then 99 baht / 30 days</span>
          </div>
        </div>

        {/* Mini "My Applications" preview */}
        <div style={{ flex: '0 1 340px', background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
          <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px', marginBottom: '10px' }}>👀 My Applications</div>
          {[
            { job: 'Kindergarten Teacher', status: '👁 Viewed 9:14am', ok: true },
            { job: 'Primary English', status: '👁 Viewed 2:30pm', ok: true },
            { job: 'ESL Teacher', status: 'Not viewed yet', ok: false },
          ].map(r => (
            <div key={r.job} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', border: r.ok ? '1px solid #c8e6c9' : '1px solid #eee', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: 'bold' }}>{r.job}</span>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: r.ok ? '#e8f5e9' : '#f3f4f6', color: r.ok ? '#2e7d32' : '#777', whiteSpace: 'nowrap' }}>{r.status}</span>
            </div>
          ))}
          <div style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '6px' }}>✨ AI-written · 🇹🇭 Thai version included</div>
        </div>
      </div>
    </section>
  )
}
