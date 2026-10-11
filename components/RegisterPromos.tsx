'use client'
import Link from 'next/link'

const ORANGE = '#E85D26'
const NAVY = '#1a1a2e'

// Free week offer for anyone who registers before launch day (14 Oct 2026, Thai time)
const TRIAL_DEADLINE = new Date('2026-10-14T00:00:00+07:00').getTime()

function trialOfferActive() {
  return Date.now() < TRIAL_DEADLINE
}

// ─────────────────────────────────────────────────────────
// 1. Shown ABOVE the registration form
// ─────────────────────────────────────────────────────────
export function RegisterPerks() {
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
        ⭐ <strong style={{ color: ORANGE }}>Supporters</strong> (50 baht / 30 days) see every new job <strong>instantly</strong>.{' '}
        <Link href="/supporters" style={{ color: ORANGE, fontWeight: 'bold' }}>Learn more</Link>
      </div>
      {trialOfferActive() && (
        <div style={{ marginTop: '10px', background: 'white', borderRadius: '8px', padding: '10px', fontSize: '13px', color: '#1B7A43', fontWeight: 'bold', textAlign: 'center' }}>
          🎁 Sign up before 14 October and get 7 days of Supporter access free!
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 2. Shown on the "Account Created!" success screen
//    role: 'job_seeker' | 'employer' | '' (from the register form)
// ─────────────────────────────────────────────────────────
export function RegisterSuccessNext({ role }: { role?: string }) {
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

      {trialOfferActive() && (
        <div style={{ ...box, background: '#E8F7EE', color: '#1B7A43', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
          🎁 You're in time! You'll get 7 days of Supporter access free from 14 October.
        </div>
      )}

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
        <div style={{ fontWeight: 'bold', color: NAVY, fontSize: '15px' }}>⭐ See jobs the moment they're posted</div>
        <div style={{ color: '#555', fontSize: '13px', lineHeight: 1.6, marginTop: '4px' }}>
          Supporters (50 baht / 30 days) get every new job <strong>instantly</strong>, so you can contact schools
          before anyone else, and help keep the site free for everyone.
        </div>
        <Link href="/supporters" style={{ ...btn, background: ORANGE }}>
          Become a Supporter →
        </Link>
      </div>
    </div>
  )
}