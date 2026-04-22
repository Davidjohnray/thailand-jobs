'use client'
import { useEffect } from 'react'

export default function DukeLanguageRedirect() {
  useEffect(() => {
    // Fire GA event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'sponsor_click', {
        sponsor_name: 'Duke Language School',
        destination: 'https://dukelanguage.com',
      })
    }
    // Redirect after a tiny delay so GA has time to fire
    const timer = setTimeout(() => {
      window.location.href = 'https://dukelanguage.com/?utm_source=jobsinthailand&utm_medium=banner&utm_campaign=sidebar'
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
      <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ width: '200px' }} />
      <p style={{ color: '#666', fontSize: '16px' }}>Taking you to Duke Language School...</p>
    </div>
  )
}