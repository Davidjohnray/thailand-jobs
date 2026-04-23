'use client'
import { useEffect } from 'react'

export default function DukeLanguageRedirect() {
  useEffect(() => {
    try {
      const w = window as any
      if (w.gtag) {
        w.gtag('event', 'sponsor_click', { sponsor_name: 'Duke Language School' })
      }
    } catch(e) {}

    window.location.replace('https://dukelanguage.com/?utm_source=jobsinthailand&utm_medium=banner&utm_campaign=sidebar')
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '16px', background: 'white' }}>
      <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ width: '200px' }} />
      <p style={{ color: '#666' }}>Redirecting to Duke Language School...</p>
    </div>
  )
}