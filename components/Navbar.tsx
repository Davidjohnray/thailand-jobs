'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [jobsOpen, setJobsOpen] = useState(false)

  const handleNotifications = () => {
    if (typeof window !== 'undefined') {
      const OS = (window as any).OneSignal
      const deferred = (window as any).OneSignalDeferred
      if (OS) {
        OS.Notifications.requestPermission()
      } else if (deferred) {
        deferred.push((OneSignal: any) => {
          OneSignal.Notifications.requestPermission()
        })
      } else {
        alert('Please allow notifications when prompted by your browser!')
      }
    }
  }

  return (
    <nav style={{ background: '#E85D26', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1000 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/" style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', textDecoration: 'none' }}>
          Thailand Jobs
        </Link>
        <button onClick={handleNotifications}
          title="Get job notifications"
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '18px', color: 'white' }}>
          🔔
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

        {/* JOBS DROPDOWN */}
        <div style={{ position: 'relative' }}
          onMouseEnter={() => setJobsOpen(true)}
          onMouseLeave={() => setJobsOpen(false)}>
          <button
            style={{ color: 'white', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            💼 Jobs ▾
          </button>
          {jobsOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: '180px', padding: '8px', zIndex: 9999, marginTop: '4px' }}>
              <Link href="/jobs" onClick={() => setJobsOpen(false)}
                style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px', fontWeight: 'bold' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                🗂 All Jobs
              </Link>
              <Link href="/jobs/teaching" onClick={() => setJobsOpen(false)}
                style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                🏫 Teaching Jobs
              </Link>
              <Link href="/jobs/other" onClick={() => setJobsOpen(false)}
                style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                💼 Other Jobs
              </Link>
            </div>
          )}
        </div>

        <Link href="/training" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          🎓 Training
        </Link>
        <Link href="/cv-builder" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'white', fontWeight: 'bold' }}>
          📄 CV Builder
        </Link>
        <Link href="/advertise" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          📢 Advertise
        </Link>
        <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          💬 Contact
        </Link>
        <Link href="/account/login" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          👤 Members Login
        </Link>
        <Link href="/employers" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', border: '1px solid white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}>
          Post a Job
        </Link>
        <span className="admin-desktop-only">
          <Link href="/admin" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: 'white' }}>
            🔐 Admin
          </Link>
        </span>
      </div>

    </nav>
  )
}