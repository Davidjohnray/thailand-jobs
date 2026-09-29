'use client'
import { useState, useEffect } from 'react'

// Site-wide banner for Thai Friend. Dropped into app/layout.tsx once, right under
// <Navbar />, so it shows on every page automatically without editing each one.
//
// Dismiss is remembered for the browser SESSION only (sessionStorage, not localStorage) —
// so someone who closes it isn't nagged again while browsing today, but it comes back
// fresh on their next visit. Given the goal is "seen everywhere," this leans toward
// showing it by default rather than hiding it permanently after one dismissal.

export default function ThaiFriendBanner() {
  const [dismissed, setDismissed] = useState(true) // default true so it never flashes before the check runs

  useEffect(() => {
    setDismissed(sessionStorage.getItem('thai_friend_banner_dismissed') === 'true')
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('thai_friend_banner_dismissed', 'true')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div style={{ background: '#14201C', borderBottom: '2px solid #D4A24C', padding: '10px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', position: 'relative' }}>
        <a href="/thai-friend" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Georgia', serif", color: '#F5EFE1', fontSize: '15px', fontWeight: 700 }}>
            🇹🇭 Learn Thai by making a <span style={{ color: '#D4A24C' }}>friend</span>
          </span>
          <span style={{ color: 'rgba(245,239,225,0.65)', fontSize: '13px' }}>
            Talk out loud with an AI who remembers you — no drills, no red pen.
          </span>
          <span style={{ background: '#D4A24C', color: '#14201C', fontSize: '13px', fontWeight: 700, padding: '6px 16px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
            Try it free →
          </span>
        </a>

        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(245,239,225,0.5)', fontSize: '18px', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
