'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../src/lib/supabase'

export default function Navbar() {
  const [jobsOpen, setJobsOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileJobsOpen, setMobileJobsOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const jobsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => setIsLoggedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (jobsRef.current && !jobsRef.current.contains(e.target as Node)) setJobsOpen(false)
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleNotifications() {
    if (typeof window !== 'undefined') {
      const OS = (window as any).OneSignal
      const deferred = (window as any).OneSignalDeferred
      if (OS) {
        OS.Notifications.requestPermission()
      } else if (deferred) {
        deferred.push((OneSignal: any) => OneSignal.Notifications.requestPermission())
      } else {
        alert('Please allow notifications when prompted by your browser!')
      }
    }
  }

  function closeMobile() { setMobileOpen(false) }

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '110%',
    left: 0,
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    minWidth: '200px',
    zIndex: 1000,
    padding: '8px',
    border: '1px solid #eee',
  }

  const dropdownLinkStyle: React.CSSProperties = {
    display: 'block',
    padding: '10px 14px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#1a1a2e',
    fontSize: '14px',
  }

  return (
    <>
      <nav style={{ background: '#E85D26', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '62px', position: 'sticky', top: 0, zIndex: 999, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>

        {/* ── LEFT — Logo + Bell ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            🇹🇭 Thailand Jobs
          </Link>
          <button onClick={handleNotifications} title="Get job alerts"
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', padding: '5px 9px', cursor: 'pointer', fontSize: '16px', color: 'white' }}>
            🔔
          </button>
        </div>

        {/* ── DESKTOP LINKS ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">

          {/* Jobs dropdown */}
          <div ref={jobsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setJobsOpen(!jobsOpen); setServicesOpen(false) }}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
              💼 Jobs <span style={{ fontSize: '10px' }}>{jobsOpen ? '▲' : '▼'}</span>
            </button>
            {jobsOpen && (
              <div style={dropdownStyle}>
                {[
                  { href: '/jobs', label: '📋 All Jobs' },
                  { href: '/jobs/teaching', label: '🏫 Teaching Jobs' },
                  { href: '/jobs/other', label: '💼 Other Jobs' },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setJobsOpen(false)}
                    style={dropdownLinkStyle}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Services dropdown */}
          <div ref={servicesRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setServicesOpen(!servicesOpen); setJobsOpen(false) }}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
              🏠 Services <span style={{ fontSize: '10px' }}>{servicesOpen ? '▲' : '▼'}</span>
            </button>
            {servicesOpen && (
              <div style={dropdownStyle}>
                {[
                  { href: '/rentals',       label: '🏠 Rentals' },
                  { href: '/teachers',      label: '🎓 Private Teachers' },
                  { href: '/training',      label: '📚 Training' },
                  { href: '/cv-builder',    label: '📄 CV Builder' },
                  { href: '/esl-resources', label: '📖 ESL Resources' },
                  { href: '/esl-games',     label: '🎮 ESL Games' },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setServicesOpen(false)}
                    style={dropdownLinkStyle}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {item.label}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid #eee', margin: '6px 0' }} />
                <Link href="/advertise" onClick={() => setServicesOpen(false)}
                  style={{ ...dropdownLinkStyle, color: '#2D6BE4', fontWeight: 'bold' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  📢 Advertise With Us
                </Link>
              </div>
            )}
          </div>

          {/* Ask Maya */}
          <Link href="/ask-maya"
            style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            👩‍🏫 Ask Maya
          </Link>

          {/* Blog */}
          <Link href="/blog"
            style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', fontWeight: 'bold' }}>
            ✍️ Blog
          </Link>

          {/* Contact */}
          <Link href="/contact"
            style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: '#0891b2', fontWeight: 'bold' }}>
            💬 Contact
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <Link href="/dashboard"
              style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>
              👤 My Account
            </Link>
          ) : (
            <Link href="/login"
              style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>
              👤 Login
            </Link>
          )}

          {/* Post a Job */}
          <Link href="/employers"
            style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '6px', background: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            + Post a Job
          </Link>

          {/* Admin */}
          <Link href="/admin"
            style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '12px', padding: '6px 10px' }}>
            🔐
          </Link>
        </div>

        {/* ── MOBILE HAMBURGER ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-btn"
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '20px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div style={{ position: 'fixed', top: '62px', left: 0, right: 0, bottom: 0, background: '#E85D26', zIndex: 998, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }} className="mobile-nav">

          {/* Jobs */}
          <button onClick={() => setMobileJobsOpen(!mobileJobsOpen)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '12px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
            💼 Jobs <span>{mobileJobsOpen ? '▲' : '▼'}</span>
          </button>
          {mobileJobsOpen && (
            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { href: '/jobs',          label: '📋 All Jobs' },
                { href: '/jobs/teaching', label: '🏫 Teaching Jobs' },
                { href: '/jobs/other',    label: '💼 Other Jobs' },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={closeMobile}
                  style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Services */}
          <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '12px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
            🏠 Services <span>{mobileServicesOpen ? '▲' : '▼'}</span>
          </button>
          {mobileServicesOpen && (
            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { href: '/rentals',       label: '🏠 Rentals' },
                { href: '/teachers',      label: '🎓 Private Teachers' },
                { href: '/training',      label: '📚 Training' },
                { href: '/cv-builder',    label: '📄 CV Builder' },
                { href: '/esl-resources', label: '📖 ESL Resources' },
                { href: '/esl-games',     label: '🎮 ESL Games' },
                { href: '/advertise',     label: '📢 Advertise With Us' },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={closeMobile}
                  style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Ask Maya */}
          <Link href="/ask-maya" onClick={closeMobile}
            style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
            👩‍🏫 Ask Maya
          </Link>

          {/* Blog */}
          <Link href="/blog" onClick={closeMobile}
            style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
            ✍️ Blog
          </Link>

          {/* Contact */}
          <Link href="/contact" onClick={closeMobile}
            style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '12px 14px', borderRadius: '8px', background: '#0891b2', fontWeight: 'bold' }}>
            💬 Contact
          </Link>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={closeMobile}
                style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontWeight: 'bold' }}>
                👤 My Account
              </Link>
            ) : (
              <Link href="/login" onClick={closeMobile}
                style={{ display: 'block', color: 'white', textDecoration: 'none', fontSize: '15px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', fontWeight: 'bold' }}>
                👤 Login / Register
              </Link>
            )}

            <Link href="/employers" onClick={closeMobile}
              style={{ display: 'block', color: '#E85D26', textDecoration: 'none', fontSize: '15px', padding: '12px 14px', borderRadius: '8px', background: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              + Post a Job
            </Link>

            <Link href="/admin" onClick={closeMobile}
              style={{ display: 'block', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '13px', padding: '8px 14px', textAlign: 'center' }}>
              🔐 Admin
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        .mobile-nav { display: flex !important; }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}