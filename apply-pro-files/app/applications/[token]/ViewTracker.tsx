'use client'
import { useEffect } from 'react'
import { authHeaders } from '../../../components/applyClient'

// Counts a "view" once the page has been open for a few seconds in a real browser.
// Email link scanners don't run this, and the teacher viewing their own application is ignored by the server.
export default function ViewTracker({ token, skip }: { token: string; skip?: boolean }) {
  useEffect(() => {
    if (skip) return
    const key = `jit-viewed-${token}`
    try { if (sessionStorage.getItem(key)) return } catch {}
    const t = setTimeout(async () => {
      try {
        await fetch('/api/applications/viewed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
          body: JSON.stringify({ token }),
          keepalive: true,
        })
        try { sessionStorage.setItem(key, '1') } catch {}
      } catch {}
    }, 4000)
    return () => clearTimeout(t)
  }, [token, skip])
  return null
}
