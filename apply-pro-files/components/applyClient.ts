'use client'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabase'
import type { ApplyStatus } from '../src/lib/applyRules'

// Login header for the site's own API routes (always fresh — Supabase refreshes the token for us)
export async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
}

// Apply Pro status for the current visitor: logged in? Pro? free try left? saved details?
export function useApplyStatus() {
  const [status, setStatus] = useState<ApplyStatus | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/apply-pro/status', { headers: await authHeaders(), cache: 'no-store' })
      setStatus(await res.json())
    } catch {
      setStatus({ loggedIn: false, enabled: true })
    }
  }, [])

  useEffect(() => {
    load()
    // Reload when someone logs in or out on this page
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') setTimeout(load, 0)
    })
    return () => subscription.unsubscribe()
  }, [load])

  return { status, reload: load }
}
