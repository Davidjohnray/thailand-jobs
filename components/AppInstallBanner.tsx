'use client'
import { useState, useEffect } from 'react'

export default function AppInstallBanner() {
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other' | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // Don't show if user dismissed previously (persists for 7 days)
    const dismissedAt = localStorage.getItem('app_banner_dismissed')
    if (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 24 * 60 * 60 * 1000) {
      setDismissed(true)
      return
    }

    const ua = navigator.userAgent
    if (/android/i.test(ua)) setPlatform('android')
    else if (/iphone|ipad|ipod/i.test(ua)) setPlatform('ios')
    else setPlatform('other')

    // Capture Android install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleAndroidInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setInstalled(true)
      setDeferredPrompt(null)
    } else {
      setShowInstructions(true)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('app_banner_dismissed', String(Date.now()))
    setDismissed(true)
  }

  if (installed || dismissed || platform === null || platform === 'other') return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
      borderTop: '3px solid #E85D26',
      padding: '20px 24px',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            position: 'absolute', top: '12px', right: '16px',
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
            fontSize: '20px', cursor: 'pointer', lineHeight: 1,
          }}>×</button>

        {/* Main row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '36px' }}>📲</div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '15px', marginBottom: '2px' }}>
              Get the Jobs in Thailand app
            </div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
              Free • No app store needed • Works offline
            </div>
          </div>

          {platform === 'android' && !showInstructions && (
            <button
              onClick={handleAndroidInstall}
              style={{
                background: '#E85D26', color: 'white', border: 'none',
                padding: '10px 22px', borderRadius: '8px', fontWeight: 'bold',
                fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
              Install App
            </button>
          )}

          {platform === 'ios' && !showInstructions && (
            <button
              onClick={() => setShowInstructions(true)}
              style={{
                background: '#E85D26', color: 'white', border: 'none',
                padding: '10px 22px', borderRadius: '8px', fontWeight: 'bold',
                fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
              How to Install
            </button>
          )}
        </div>

        {/* Android fallback instructions */}
        {platform === 'android' && showInstructions && (
          <div style={{
            marginTop: '16px', background: 'rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '14px 18px',
          }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>
              📱 Add to your Android home screen:
            </div>
            {[
              'Open this site in Chrome',
              'Tap the ⋮ menu (top right)',
              'Tap "Add to Home Screen"',
              'Tap Install',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '6px', alignItems: 'flex-start' }}>
                <span style={{
                  background: '#E85D26', color: 'white', borderRadius: '50%',
                  width: '20px', height: '20px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: '1.5' }}>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* iOS instructions */}
        {platform === 'ios' && showInstructions && (
          <div style={{
            marginTop: '16px', background: 'rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '14px 18px',
          }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>
              🍎 Add to your iPhone home screen:
            </div>
            {[
              'Open this site in Safari (not Chrome)',
              'Tap the Share button 📤 at the bottom',
              'Scroll down and tap "Add to Home Screen"',
              'Tap Add — done!',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '6px', alignItems: 'flex-start' }}>
                <span style={{
                  background: '#E85D26', color: 'white', borderRadius: '50%',
                  width: '20px', height: '20px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: '1.5' }}>{step}</span>
              </div>
            ))}
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', margin: '10px 0 0' }}>
              Must use Safari — the Share button doesn't appear in other browsers on iPhone.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
