'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../src/lib/supabase'

export default function Navbar() {
  const [jobsOpen, setJobsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => setIsLoggedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

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

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <nav style={{ background: '#E85D26', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1000 }}>

        {/* LEFT — Logo + Bell */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', textDecoration: 'none' }}>
            Thailand Jobs
          </Link>
          <button onClick={handleNotifications} title="Get job notifications"
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '18px', color: 'white' }}>
            🔔
          </button>
        </div>

        {/* DESKTOP MENU */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

          {/* JOBS DROPDOWN — dark navy */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setJobsOpen(true)}
            onMouseLeave={() => setJobsOpen(false)}>
            <button style={{ color: 'white', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#1a1a2e', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
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

          {/* RENTALS — purple */}
          <Link href="/rentals" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#7C3AED', fontWeight: 'bold' }}>
            🏠 Rentals
          </Link>
          <Link href="/teachers" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#0891b2', fontWeight: 'bold' }}>
  🎓 Teachers
</Link>

          {/* TRAINING — green */}
          <Link href="/training" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#16a34a', fontWeight: 'bold' }}>
            🎓 Training
          </Link>

          {/* CV BUILDER — white */}
          <Link href="/cv-builder" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'white', fontWeight: 'bold' }}>
            📄 CV Builder
          </Link>

          {/* ADVERTISE — blue */}
          <Link href="/advertise" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#2D6BE4', fontWeight: 'bold' }}>
            📢 Advertise
          </Link>

          {/* CONTACT — teal */}
          <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#0891b2', fontWeight: 'bold' }}>
            💬 Contact
          </Link>

          {/* LOGIN / ACCOUNT — gold */}
          {isLoggedIn ? (
            <Link href="/account/dashboard" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#FBBF24', fontWeight: 'bold' }}>
              👤 My Account
            </Link>
          ) : (
            <Link href="/account/login" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#FBBF24', fontWeight: 'bold' }}>
              👤 Members Login
            </Link>
          )}

          {/* POST A JOB — white outline */}
          <Link href="/employers" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', border: '2px solid white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}>
            Post a Job
          </Link>

          {/* ADMIN — white */}
          <Link href="/admin" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: 'white' }}>
            🔐 Admin
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', color: 'white', fontSize: '20px' }}>
          {mobileOpen ? '✕' : '☰'}
        </button>

      </nav>

      {/* MOBILE MENU DRAWER */}
      {mobileOpen && (
        <div className="mobile-menu" style={{ background: '#1a1a2e', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '4px' }}>
            <p style={{ color: '#aaa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Browse Jobs</p>
            <Link href="/jobs" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '6px' }}>
              🗂 All Jobs
            </Link>
            <Link href="/jobs/teaching" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '6px' }}>
              🏫 Teaching Jobs
            </Link>
            <Link href="/jobs/other" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.2)' }}>
              💼 Other Jobs
            </Link>
          </div>

          {/* RENTALS — purple */}
          <Link href="/rentals" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#7C3AED', fontWeight: 'bold' }}>
            🏠 Rentals
          </Link>
          <Link href="/teachers" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#0891b2', fontWeight: 'bold' }}>
  🎓 Teachers
</Link>

          {/* TRAINING — green */}
          <Link href="/training" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#16a34a', fontWeight: 'bold' }}>
            🎓 Training
          </Link>

          {/* CV BUILDER — white */}
          <Link href="/cv-builder" onClick={closeMobile} style={{ display: 'block', color: '#E85D26', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: 'white', fontWeight: 'bold' }}>
            📄 CV Builder
          </Link>

          {/* ADVERTISE — blue */}
          <Link href="/advertise" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#2D6BE4', fontWeight: 'bold' }}>
            📢 Advertise
          </Link>

          {/* CONTACT — teal */}
          <Link href="/contact" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#0891b2', fontWeight: 'bold' }}>
            💬 Contact
          </Link>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

            {/* LOGIN / ACCOUNT — gold */}
            {isLoggedIn ? (
              <Link href="/account/dashboard" onClick={closeMobile} style={{ display: 'block', color: '#1a1a2e', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#FBBF24', fontWeight: 'bold' }}>
                👤 My Account
              </Link>
            ) : (
              <Link href="/account/login" onClick={closeMobile} style={{ display: 'block', color: '#1a1a2e', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#FBBF24', fontWeight: 'bold' }}>
                👤 Members Login
              </Link>
            )}

            {/* POST A JOB — orange */}
            <Link href="/employers" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '12px', borderRadius: '8px', background: '#E85D26', fontWeight: 'bold', textAlign: 'center' }}>
              📝 Post a Job
            </Link>

            {/* ADMIN — white */}
            <Link href="/admin" onClick={closeMobile} style={{ display: 'block', color: '#1a1a2e', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              🔐 Admin
            </Link>
          </div>

        </div>
      )}

      {/* CSS for responsive switching */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .mobile-nav-toggle { display: none !important; }
        }
      `}</style>
    </>
  )
}