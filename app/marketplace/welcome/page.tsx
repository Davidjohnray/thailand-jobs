'use client'
import Link from 'next/link'

export default function MarketplaceWelcomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '72px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '54px', marginBottom: '16px' }}>🛒</div>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 14px' }}>Teacher Marketplace</h1>
        <p style={{ fontSize: '17px', opacity: 0.92, maxWidth: '560px', margin: '0 auto' }}>
          Buy and sell teaching aids, lesson resources, and classroom materials — directly with other teachers across Thailand
        </p>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>

        {/* HOW IT WORKS */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e1b4b', textAlign: 'center', marginBottom: '28px' }}>How It Works</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <StepCard emoji="🔍" title="Browse or List" text="Search for teaching resources, or list your own items for ฿20 per 30 days." />
            <StepCard emoji="💬" title="Message Directly" text="Contact the seller through our messaging system to ask questions and arrange payment." />
            <StepCard emoji="⭐" title="Leave Feedback" text="After receiving your item, leave positive feedback — this helps sellers build trust over time." />
          </div>
        </section>

        {/* TRUST TIERS */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '16px' }}>Seller Trust Tiers</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: '1.7' }}>
            Sellers start with a lower listing price limit, which increases automatically as they build a track record of positive reviews. This helps protect buyers from unproven sellers listing expensive items right away.
          </p>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eeeef8', overflow: 'hidden' }}>
            <TierRow emoji="🆕" label="New Seller" range="0–9 reviews" limit="Up to ฿1,000/listing" />
            <TierRow emoji="🌱" label="Growing Seller" range="10–29 reviews" limit="Up to ฿2,000/listing" />
            <TierRow emoji="✅" label="Trusted Seller" range="30–59 reviews" limit="Up to ฿5,000/listing" />
            <TierRow emoji="⭐" label="Top Seller" range="60+ reviews" limit="No limit" last />
          </div>
        </section>

        {/* SAFETY */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '16px' }}>Buying & Selling Safely</h2>
          <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '16px', padding: '22px 26px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#3730a3', fontSize: '14px', lineHeight: '2' }}>
              <li>Payment and delivery are arranged directly between buyer and seller via PromptPay</li>
              <li>All communication should stay within our messaging system, so there's a record if something goes wrong</li>
              <li>If an item arrives damaged or doesn't match the listing, use "Report a Problem" with photo evidence and we'll help resolve it</li>
              <li>Only leave positive feedback for good experiences — for anything else, contact us instead</li>
            </ul>
          </div>
        </section>

        {/* CTAs */}
        <section style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Link href="/marketplace/register" style={{ textDecoration: 'none' }}>
              <span style={{ background: 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', padding: '15px 34px', borderRadius: '26px', fontSize: '15px', fontWeight: 'bold', display: 'inline-block', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}>
                Register an Account
              </span>
            </Link>
            <Link href="/marketplace/login" style={{ textDecoration: 'none' }}>
              <span style={{ background: 'white', color: '#4F46E5', border: '2px solid #4F46E5', padding: '13px 32px', borderRadius: '26px', fontSize: '15px', fontWeight: 'bold', display: 'inline-block' }}>
                Log In
              </span>
            </Link>
          </div>
          <Link href="/marketplace" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>
            Just want to look around? Browse listings without an account →
          </Link>
        </section>
      </div>
    </main>
  )
}

function StepCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px 18px', border: '1px solid #eeeef8', textAlign: 'center' }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{emoji}</div>
      <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e1b4b', margin: '0 0 8px' }}>{title}</h3>
      <p style={{ fontSize: '12.5px', color: '#666', lineHeight: '1.6', margin: 0 }}>{text}</p>
    </div>
  )
}

function TierRow({ emoji, label, range, limit, last }: { emoji: string; label: string; range: string; limit: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: last ? 'none' : '1px solid #f5f5fa' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>{emoji}</span>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e1b4b', margin: 0 }}>{label}</p>
          <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{range}</p>
        </div>
      </div>
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>{limit}</span>
    </div>
  )
}
