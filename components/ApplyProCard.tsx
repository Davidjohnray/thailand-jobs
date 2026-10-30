'use client'
import Link from 'next/link'
import { useApplyStatus } from './applyClient'
import { AI_MONTHLY_LIMIT, PRO_PRICE_30_DAYS, fmtDate, freeTriesText } from '../src/lib/applyRules'

// Member dashboard card: Apply Pro status, AI letters left, link to My Applications
export default function ApplyProCard() {
  const { status } = useApplyStatus()
  if (!status || !status.loggedIn || !status.enabled) return null

  const btn: any = { padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', display: 'inline-block' }

  if (status.isPro) return (
    <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #7a2e10 100%)', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '2px solid #E85D26' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '28px' }}>⚡</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>Apply Pro</span>
            <span style={{ background: '#4caf50', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Active</span>
          </div>
          <p style={{ color: '#ddd', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
            Until <strong style={{ color: 'white' }}>{fmtDate(status.proUntil)}</strong> · ✨ {status.aiRemaining} of {AI_MONTHLY_LIMIT} AI applications left this month
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/account/applications" style={{ ...btn, background: '#E85D26', color: 'white' }}>👀 My Applications</Link>
          <Link href="/jobs" style={{ ...btn, background: 'rgba(255,255,255,0.15)', color: 'white' }}>Find jobs →</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '2px solid #E85D26', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '28px' }}>⚡</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a1a2e' }}>New: Apply Pro</span>
            {status.freeTryAvailable && <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>🎁 {freeTriesText(status.freeTriesLeft ?? 0)}</span>}
          </div>
          <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
            Apply in one click, let AI write your application in English <em>and</em> Thai, and see when a school views it.
            {status.freeTryAvailable ? ` You have ${freeTriesText(status.freeTriesLeft ?? 0)} to try — open any job to use them.` : ` ${PRO_PRICE_30_DAYS} baht / 30 days.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/apply-pro" style={{ ...btn, background: '#E85D26', color: 'white' }}>See Apply Pro →</Link>
          <Link href="/account/applications" style={{ ...btn, background: '#f3f3f3', color: '#1a1a2e' }}>My Applications</Link>
        </div>
      </div>
    </div>
  )
}
