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
        const res = await fetch('/api/applications/viewed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
          body: JSON.stringify({ token }),
          keepalive: true,
        })
        const data = await res.json().catch(() => ({}))
        // Only remember it once a real view has been counted, so a skipped view (too soon, or the
        // teacher's own) can still count later in the same tab
        if (data?.counted) { try { sessionStorage.setItem(key, '1') } catch {} }
      } catch {}
    }, 4000)
    return () => clearTimeout(t)
  }, [token, skip])
  return null
}
