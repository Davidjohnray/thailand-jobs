'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../src/lib/supabase'

export default function Navbar() {
  const [jobsOpen, setJobsOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileJobsOpen, setMobileJobsOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }: any) => {
      setIsLoggedIn(!!session)
      if (session) {
        const { data } = await supabase
          .from('member_messages')
          .select('id')
          .eq('user_id', session.user.id)
          .not('reply', 'is', null)
          .eq('read_by_user', false)
        setUnreadCount(data?.length || 0)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      setIsLoggedIn(!!session)
      if (session) {
        const { data } = await supabase
          .from('member_messages')
          .select('id')
          .eq('user_id', session.user.id)
          .not('reply', 'is', null)
          .eq('read_by_user', false)
        setUnreadCount(data?.length || 0)
      } else {
        setUnreadCount(0)
      }
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

  const closeMobile = () => {
    setMobileOpen(false)
    setMobileJobsOpen(false)
    setMobileServicesOpen(false)
  }

  return (
    <>
      <nav style={{ background: '#E85D26', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1000 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', textDecoration: 'none' }}>
            Thailand Jobs
          </Link>
          <button onClick={handleNotifications} title="Get job notifications"
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '18px', color: 'white' }}>
            🔔
          </button>
        </div>

        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          <div style={{ position: 'relative' }}
            onMouseEnter={() => setJobsOpen(true)}
            onMouseLeave={() => setJobsOpen(false)}>
            <button style={{ color: 'white', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#1a1a2e', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              💼 Jobs ▾
            </button>
            {jobsOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: '200px', padding: '8px', zIndex: 9999, marginTop: '4px' }}>
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
                <div style={{ borderTop: '1px solid #eee', margin: '6px 0' }} />
                <Link href="/employers" onClick={() => setJobsOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#E85D26', fontSize: '14px', fontWeight: 'bold' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  📝 Post a Job
                </Link>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}>
            <button style={{ color: 'white', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#7C3AED', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              🇹🇭 Services ▾
            </button>
            {servicesOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: '200px', padding: '8px', zIndex: 9999, marginTop: '4px' }}>
                <Link href="/rentals" onClick={() => setServicesOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px', fontWeight: 'bold' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  🏠 Rentals
                </Link>
                <Link href="/teachers" onClick={() => setServicesOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  🎓 Private Teachers
                </Link>
                <Link href="/training" onClick={() => setServicesOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  📚 Training
                </Link>
                <Link href="/cv-builder" onClick={() => setServicesOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  📄 CV Builder
                </Link>
                <Link href="/esl-resources" onClick={() => setServicesOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  📖 ESL Resources
                </Link>
                <Link href="/esl-games" onClick={() => setServicesOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#1a1a2e', fontSize: '14px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  🎮 ESL Games
                </Link>
                <div style={{ borderTop: '1px solid #eee', margin: '6px 0' }} />
                <Link href="/advertise" onClick={() => setServicesOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', color: '#2D6BE4', fontSize: '14px', fontWeight: 'bold' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  📢 Advertise With Us
                </Link>
              </div>
            )}
          </div>

          <Link href="/blog" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', fontWeight: 'bold' }}>
            ✍️ Blog
          </Link>

          <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#0891b2', fontWeight: 'bold' }}>
            💬 Contact
          </Link>

          {isLoggedIn ? (
            <Link href="/account/dashboard" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#FBBF24', fontWeight: 'bold', position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              👤 My Account
              {unreadCount > 0 && (
                <span style={{ background: '#E85D26', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </Link>
          ) : (
            <Link href="/account/login" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#FBBF24', fontWeight: 'bold' }}>
              👤 Members Login
            </Link>
          )}

          <Link href="/employers" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', border: '2px solid white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}>
            Post a Job
          </Link>

          <Link href="/admin" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: 'white' }}>
            🔐 Admin
          </Link>

        </div>

        <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', color: 'white', fontSize: '20px' }}>
          {mobileOpen ? '✕' : '☰'}
        </button>

      </nav>

      {mobileOpen && (
        <div className="mobile-menu" style={{ background: '#1a1a2e', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>

          <button onClick={() => setMobileJobsOpen(!mobileJobsOpen)}
            style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>💼 Jobs</span>
            <span>{mobileJobsOpen ? '▲' : '▼'}</span>
          </button>
          {mobileJobsOpen && (
            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Link href="/jobs" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>🗂 All Jobs</Link>
              <Link href="/jobs/teaching" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>🏫 Teaching Jobs</Link>
              <Link href="/jobs/other" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>💼 Other Jobs</Link>
            </div>
          )}

          <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            style={{ background: '#7C3AED', border: 'none', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🇹🇭 Services</span>
            <span>{mobileServicesOpen ? '▲' : '▼'}</span>
          </button>
          {mobileServicesOpen && (
            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Link href="/rentals" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>🏠 Rentals</Link>
              <Link href="/teachers" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>🎓 Private Teachers</Link>
              <Link href="/training" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>📚 Training</Link>
              <Link href="/cv-builder" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>📄 CV Builder</Link>
              <Link href="/esl-resources" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>📖 ESL Resources</Link>
              <Link href="/esl-games" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>🎮 ESL Games</Link>
              <Link href="/advertise" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>📢 Advertise With Us</Link>
            </div>
          )}

          <Link href="/blog" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', fontWeight: 'bold' }}>✍️ Blog</Link>
          <Link href="/contact" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#0891b2', fontWeight: 'bold' }}>💬 Contact</Link>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isLoggedIn ? (
              <Link href="/account/dashboard" onClick={closeMobile} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#1a1a2e', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#FBBF24', fontWeight: 'bold' }}>
                <span>👤 My Account</span>
                {unreadCount > 0 && (
                  <span style={{ background: '#E85D26', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '12px', fontWeight: 'bold' }}>
                    {unreadCount} new
                  </span>
                )}
              </Link>
            ) : (
              <Link href="/account/login" onClick={closeMobile} style={{ display: 'block', color: '#1a1a2e', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: '#FBBF24', fontWeight: 'bold' }}>👤 Members Login</Link>
            )}
            <Link href="/employers" onClick={closeMobile} style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '12px', borderRadius: '8px', background: '#E85D26', fontWeight: 'bold', textAlign: 'center' }}>📝 Post a Job</Link>
            <Link href="/admin" onClick={closeMobile} style={{ display: 'block', color: '#1a1a2e', textDecoration: 'none', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', background: 'white', fontWeight: 'bold', textAlign: 'center' }}>🔐 Admin</Link>
          </div>
        </div>
      )}

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