'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const ORANGE = '#E85D26'
const NAVY = '#1a1a2e'

const LAUNCH_PRICE = 100
const LAUNCH_MONTHS = 6
const LAUNCH_DEADLINE = new Date('2026-11-01T00:00:00+07:00').getTime()
const LAUNCH_END_LABEL = '31 October'
const MONTHLY_PRICE = 50
const DAYS = 30

function useLaunchOffer() {
  const [active, setActive] = useState(true)
  useEffect(() => { setActive(Date.now() < LAUNCH_DEADLINE) }, [])
  return active
}

// ─────────────────────────────────────────────────────────
// 1. Shown ABOVE the registration form
// ─────────────────────────────────────────────────────────
export function RegisterPerks() {
  const launch = useLaunchOffer()

  return (
    <div style={{ background: '#fff3ed', borderRadius: '10px', padding: '16px', marginBottom: '24px', border: `1px solid ${ORANGE}33` }}>
      <div style={{ fontWeight: 'bold', color: NAVY, fontSize: '14px', marginBottom: '10px' }}>
        Free members get:
      </div>
      <ul style={{ margin: 0, paddingLeft: '18px', color: '#444', fontSize: '13px', lineHeight: 1.8 }}>
        <li>New jobs <strong>1 hour before</strong> visitors</li>
        <li>A <strong>free Teacher Directory profile</strong> so schools can find you</li>
        <li>Message us directly and read replies in your account</li>
      </ul>
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px dashed ${ORANGE}55`, fontSize: '13px', color: '#444' }}>
        {launch ? (
          <>
            🎉 <strong style={{ color: ORANGE }}>Launch offer:</strong> see every new job <strong>instantly</strong> for{' '}
            {LAUNCH_MONTHS} months, just {LAUNCH_PRICE} baht (until {LAUNCH_END_LABEL}).{' '}
          </>
        ) : (
          <>
            ⭐ <strong style={{ color: ORANGE }}>Supporters</strong> (from {MONTHLY_PRICE} baht / {DAYS} days) see every new job <strong>instantly</strong>.{' '}
          </>
        )}
        <Link href="/supporters" style={{ color: ORANGE, fontWeight: 'bold' }}>Learn more</Link>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 2. Shown on the "Account Created!" success screen
// ─────────────────────────────────────────────────────────
export function RegisterSuccessNext({ role }: { role?: string }) {
  const launch = useLaunchOffer()
  const isJobSeeker = role !== 'employer'

  const box: React.CSSProperties = {
    textAlign: 'left', borderRadius: '12px', padding: '16px', marginBottom: '12px',
  }
  const btn: React.CSSProperties = {
    display: 'inline-block', marginTop: '10px', padding: '9px 16px', borderRadius: '8px',
    textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', color: 'white',
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontWeight: 'bold', color: NAVY, fontSize: '15px', margin: '8px 0 12px' }}>
        While you wait for the email:
      </div>

      {isJobSeeker && (
        <div style={{ ...box, background: '#F1F4FF', border: '1px solid #3B4FB533' }}>
          <div style={{ fontWeight: 'bold', color: NAVY, fontSize: '15px' }}>👩‍🏫 Are you a teacher?</div>
          <div style={{ color: '#555', fontSize: '13px', lineHeight: 1.6, marginTop: '4px' }}>
            Create your <strong>free Teacher Directory profile</strong> so schools across Thailand can find you.
            Use the <strong>same email</strong> you just registered with, so it links to your account.
          </div>
          <Link href="/teachers/register" style={{ ...btn, background: '#3B4FB5' }}>
            Create My Free Profile →
          </Link>
        </div>
      )}

      <div style={{ ...box, background: '#fff3ed', border: `1px solid ${ORANGE}33` }}>
        <div style={{ fontWeight: 'bold', color: NAVY, fontSize: '15px' }}>
          {launch ? `🎉 Launch offer: ${LAUNCH_MONTHS} months for ${LAUNCH_PRICE} baht` : "⭐ See jobs the moment they're posted"}
        </div>
        <div style={{ color: '#555', fontSize: '13px', lineHeight: 1.6, marginTop: '4px' }}>
          {launch
            ? <>Become a Supporter and get every new job <strong>instantly</strong> for {LAUNCH_MONTHS} months. Offer ends {LAUNCH_END_LABEL}.</>
            : <>Supporters (from {MONTHLY_PRICE} baht / {DAYS} days) get every new job <strong>instantly</strong>, so you can contact schools before anyone else.</>}
        </div>
        <Link href="/supporters" style={{ ...btn, background: ORANGE }}>
          Become a Supporter →
        </Link>
      </div>
    </div>
  )
}