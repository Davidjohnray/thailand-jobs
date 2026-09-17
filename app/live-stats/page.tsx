'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

const NAVY = '#14172B'
const GOLD = '#D9A441'

// Add a scope here whenever you wire up tracking on a new banner.
const TRACKED_SCOPES: { scope: string; label: string }[] = [
  { scope: 'site', label: 'Whole Website' },
  { scope: 'banner-duke', label: 'Duke Language School' },
  { scope: 'banner-pv-advisory', label: 'P&V Advisory' },
  { scope: 'banner-essential-tefl', label: 'Essential TEFL' },
]

const REFRESH_MS = 8000

function bangkokToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())
}

export default function LiveStatsPage() {
  const [scopeStats, setScopeStats] = useState<Record<string, { views: number; clicks: number }>>({})
  const [topJobs, setTopJobs] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const today = bangkokToday()

    const { data: statsRows } = await supabase
      .from('daily_stats')
      .select('scope, views, clicks')
      .eq('stat_date', today)
      .in('scope', TRACKED_SCOPES.map(s => s.scope))

    const map: Record<string, { views: number; clicks: number }> = {}
    for (const s of TRACKED_SCOPES) map[s.scope] = { views: 0, clicks: 0 }
    for (const row of statsRows || []) {
      map[row.scope] = { views: row.views || 0, clicks: row.clicks || 0 }
    }
    setScopeStats(map)

    const now = new Date().toISOString()
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title, company, view_count, expires_at')
      .eq('featured', true)
      .gt('expires_at', now)
      .order('view_count', { ascending: false })
    setTopJobs(jobs || [])

    setLastUpdated(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchAll])

  const siteViews = scopeStats['site']?.views ?? 0

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY }}>Live Stats</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#999' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32' }} />
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-GB')}` : 'Loading…'}
          </div>
        </div>

        {/* Site total — big ticking number */}
        <div style={{ background: NAVY, borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '56px', fontWeight: 800, color: 'white' }}>{siteViews}</div>
          <div style={{ fontSize: '14px', color: GOLD, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Website Views Today
          </div>
        </div>

        {/* Banner cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {TRACKED_SCOPES.filter(s => s.scope !== 'site').map((s) => {
            const stat = scopeStats[s.scope] || { views: 0, clicks: 0 }
            return (
              <div key={s.scope} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>{s.label}</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: NAVY }}>{stat.views}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>views</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: GOLD }}>{stat.clicks}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>clicks</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Currently active featured jobs — the paying customers, ranked by views */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '14px' }}>⭐ Currently Featured Jobs</div>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#999' }}>Loading…</p>
          ) : topJobs.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#999' }}>No featured jobs running right now.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topJobs.map((job, i) => {
                const daysLeft = Math.max(0, Math.ceil((new Date(job.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                return (
                  <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < topJobs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{job.company} · {daysLeft} day{daysLeft === 1 ? '' : 's'} left</div>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY, flexShrink: 0 }}>{job.view_count ?? 0} views</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
