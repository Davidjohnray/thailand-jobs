'use client'

import Link from 'next/link'
import TrackView, { trackClick } from './TrackView'

export default function TeachersDirectoryBanner() {
  return (
    <div style={{ maxWidth: '900px', margin: '16px auto 0', padding: '0 16px' }}>
      <TrackView scope="banner-teachers" />
      <Link
        href="/teachers/register"
        onClick={() => trackClick('banner-teachers')}
        style={{
          display: 'block',
          background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
          borderRadius: '12px',
          padding: '20px',
          textDecoration: 'none',
          textAlign: 'center',
          boxShadow: '0 2px 12px rgba(30, 64, 175, 0.35)',
        }}
      >
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', marginBottom: '6px', lineHeight: '1.3' }}>
          👩‍🏫 Be Discovered by Schools & Recruiters!
        </div>
        <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '14px', lineHeight: '1.6', marginBottom: '14px' }}>
          Don&apos;t just apply and wait. Create your Teacher Profile and let schools and recruiters
          across Thailand find <em>you</em>. It takes just a few minutes.
        </div>
        <div style={{ color: 'white', fontSize: '13px', marginBottom: '16px', lineHeight: '1.8' }}>
          ✅ Free to join &nbsp;•&nbsp; ✅ Your own public profile page &nbsp;•&nbsp; ✅ Add your photo &amp; experience
        </div>
        <span
          style={{
            display: 'inline-block',
            background: '#FFD23F',
            color: '#1E293B',
            padding: '12px 32px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '15px',
          }}
        >
          Create My Free Profile →
        </span>
      </Link>
    </div>
  )
}
