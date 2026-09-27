'use client'
import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other' | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Don't show if already running as an installed app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
    if (isStandalone) return

    if (localStorage.getItem('thai_friend_install_dismissed') === 'true') {
      setDismissed(true)
      return
    }

    const ua = window.navigator.userAgent
    if (/iPhone|iPad|iPod/.test(ua)) {
      setPlatform('ios')
    } else if (/Android/.test(ua)) {
      setPlatform('android')
      // Capture Chrome's native install prompt so we can trigger it ourselves
      // from our own styled button instead of waiting for the browser's default banner.
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
      })
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem('thai_friend_install_dismissed', 'true')
    setDismissed(true)
  }

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    dismiss()
  }

  if (dismissed || !platform) return null

  return (
    <div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', maxWidth: '420px', margin: '0 auto', zIndex: 50 }}>
      <div style={{ background: '#1B2B25', border: '1px solid rgba(245,239,225,0.15)', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>

        {platform === 'android' && !showIOSInstructions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>📲</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#F5EFE1', fontSize: '13px', fontWeight: 600, margin: '0 0 2px' }}>Add Thai Friend to your home screen</p>
              <p style={{ color: 'rgba(245,239,225,0.6)', fontSize: '11px', margin: 0 }}>Open it in one tap, just like an app</p>
            </div>
            <button onClick={handleAndroidInstall} style={{ background: '#D4A24C', color: '#14201C', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Install
            </button>
            <button onClick={dismiss} style={{ background: 'none', border: 'none', color: 'rgba(245,239,225,0.4)', fontSize: '16px', cursor: 'pointer', padding: '4px' }}>✕</button>
          </div>
        )}

        {platform === 'ios' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: showIOSInstructions ? '14px' : 0 }}>
              <span style={{ fontSize: '24px' }}>📲</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#F5EFE1', fontSize: '13px', fontWeight: 600, margin: '0 0 2px' }}>Add Thai Friend to your home screen</p>
                <p style={{ color: 'rgba(245,239,225,0.6)', fontSize: '11px', margin: 0 }}>Open it in one tap, just like an app</p>
              </div>
              {!showIOSInstructions && (
                <button onClick={() => setShowIOSInstructions(true)} style={{ background: '#D4A24C', color: '#14201C', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Show me
                </button>
              )}
              <button onClick={dismiss} style={{ background: 'none', border: 'none', color: 'rgba(245,239,225,0.4)', fontSize: '16px', cursor: 'pointer', padding: '4px' }}>✕</button>
            </div>

            {showIOSInstructions && (
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                <p style={{ color: 'rgba(245,239,225,0.85)', fontSize: '12px', lineHeight: 1.8, margin: 0 }}>
                  1. Tap the <strong>Share</strong> button <span style={{ opacity: 0.7 }}>(square with an arrow, at the bottom of Safari)</span><br />
                  2. Scroll down and tap <strong>Add to Home Screen</strong><br />
                  3. Tap <strong>Add</strong> in the top right
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
