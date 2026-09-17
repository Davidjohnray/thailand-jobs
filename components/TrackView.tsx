'use client'
import { useEffect } from 'react'
import { supabase } from '../src/lib/supabase'

// Drop this anywhere you want a "view" counted for that day.
// Usage: <TrackView scope="site" /> in the root layout,
//        <TrackView scope="banner-duke" /> inside a banner component, etc.
export default function TrackView({ scope }: { scope: string }) {
  useEffect(() => {
    supabase.rpc('increment_daily_stat', { p_scope: scope, p_metric: 'views' }).then(() => {}, () => {})
  }, [scope])

  return null
}

// Call this from a banner's onClick to count a click, separate from its view.
// Usage: onClick={() => trackClick('banner-duke')}
export async function trackClick(scope: string) {
  supabase.rpc('increment_daily_stat', { p_scope: scope, p_metric: 'clicks' }).then(() => {}, () => {})
}
