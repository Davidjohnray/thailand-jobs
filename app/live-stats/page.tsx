'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

const NAVY = '#14172B'
const GOLD = '#D9A441'

// Add a scope here whenever you wire up tracking on a new banner.
// trackClicks: false = this one only measures views (e.g. it links to an
// internal page with no separate click event) — CTR wouldn't mean anything.
const TRACKED_SCOPES: { scope: string; label: string; trackClicks?: boolean }[] = [
  { scope: 'site', label: 'Whole Website' },
  { scope: 'banner-duke', label: 'Duke Language School', trackClicks: true },
  { scope: 'partner-teach-bridge', label: 'Teach Bridge Asia', trackClicks: false },
  { scope: 'banner-essential-tefl', label: 'Essential TEFL', trackClicks: true },
]

// ESL Resources hub — these only track clicks (into the section), not views.
const RESOURCE_SCOPES: { scope: string; label: string }[] = [
  { scope: 'resource-lesson-plans', label: 'Lesson Plans' },
  { scope: 'resource-reading-comprehension', label: 'Reading Comprehension' },
  { scope: 'resource-grammar', label: 'Grammar' },
  { scope: 'resource-games', label: 'Learn & Play' },
  { scope: 'resource-conversation-topics', label: 'Conversation Topics' },
]

const REFRESH_MS = 8000
const RANGE_OPTIONS = [7, 30, 90]

function bangkokToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())
}

// 'live' = today only, auto-refreshing. Anything else = a fixed historical range.
type RangeMode = 'live' | number | 'custom'

export default function LiveStatsPage() {
  const [rangeMode, setRangeMode] = useState<RangeMode>('live')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const [scopeStats, setScopeStats] = useState<Record<string, { views: number; clicks: number }>>({})
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([])
  const [regularJobs, setRegularJobs] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [resourcesOpen, setResourcesOpen] = useState(false)

  const fetchScopeStats = useCallback(async () => {
    let from: string
    let to: string

    if (rangeMode === 'live') {
      from = bangkokToday()
      to = from
    } else if (rangeMode === 'custom') {
      if (!customFrom || !customTo) return
      from = customFrom
      to = customTo
    } else {
      from = new Date(Date.now() - rangeMode * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      to = bangkokToday()
    }

    const allScopes = [...TRACKED_SCOPES, ...RESOURCE_SCOPES]

    const { data: statsRows } = await supabase
      .from('daily_stats')
      .select('scope, views, clicks')
      .in('scope', allScopes.map(s => s.scope))
      .gte('stat_date', from)
      .lte('stat_date', to)

    const map: Record<string, { views: number; clicks: number }> = {}
    for (const s of allScopes) map[s.scope] = { views: 0, clicks: 0 }
    for (const row of statsRows || []) {
      map[row.scope].views += row.views || 0
      map[row.scope].clicks += row.clicks || 0
    }
    setScopeStats(map)
    setLastUpdated(new Date())
  }, [rangeMode, customFrom, customTo])

  const fetchJobs = useCallback(async () => {
    const now = new Date().toISOString()

    const { data: featured } = await supabase
      .from('jobs')
      .select('id, title, company, view_count, expires_at')
      .eq('featured', true)
      .gt('expires_at', now)
      .order('view_count', { ascending: false })
    setFeaturedJobs(featured || [])

    const { data: regular } = await supabase
      .from('jobs')
      .select('id, title, company, view_count, expires_at')
      .eq('featured', false)
      .gt('expires_at', now)
      .order('view_count', { ascending: false })
      .limit(20)
    setRegularJobs(regular || [])

    setLoading(false)
  }, [])

  // Scope stats: refetch whenever the range changes, and poll only in live mode.
  useEffect(() => {
    fetchScopeStats()
    if (rangeMode === 'live') {
      const interval = setInterval(fetchScopeStats, REFRESH_MS)
      return () => clearInterval(interval)
    }
  }, [fetchScopeStats, rangeMode])

  // Jobs: lifetime totals, not date-scoped — fetched once, refreshed alongside live polling.
  useEffect(() => {
    fetchJobs()
    if (rangeMode === 'live') {
      const interval = setInterval(fetchJobs, REFRESH_MS)
      return () => clearInterval(interval)
    }
  }, [fetchJobs, rangeMode])

  const handleCustomSearch = () => {
    if (customFrom && customTo) setRangeMode('custom')
  }

  const siteViews = scopeStats['site']?.views ?? 0
  const rangeLabel =
    rangeMode === 'live' ? 'Today' :
    rangeMode === 'custom' ? `${customFrom} to ${customTo}` :
    `Last ${rangeMode} Days`

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: NAVY }}>Stats</h1>
          {rangeMode === 'live' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#999' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32' }} />
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-GB')}` : 'Loading…'}
            </div>
          )}
        </div>

        {/* Range controls */}
        <div style={{ background: NAVY, borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setRangeMode('live')}
            style={{
              background: rangeMode === 'live' ? GOLD : 'rgba(255,255,255,0.12)',
              color: rangeMode === 'live' ? NAVY : 'white',
              border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            🔴 Live
          </button>
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setRangeMode(opt)}
              style={{
                background: rangeMode === opt ? GOLD : 'rgba(255,255,255,0.12)',
                color: rangeMode === opt ? NAVY : 'white',
                border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {opt}d
            </button>
          ))}
          <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />
          <input
            type="date"
            value={customFrom}
            onChange={e => setCustomFrom(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '6px 10px', fontSize: '13px' }}
          />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>to</span>
          <input
            type="date"
            value={customTo}
            onChange={e => setCustomTo(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '6px 10px', fontSize: '13px' }}
          />
          <button
            onClick={handleCustomSearch}
            disabled={!customFrom || !customTo}
            style={{
              background: rangeMode === 'custom' ? GOLD : 'rgba(255,255,255,0.12)',
              color: rangeMode === 'custom' ? NAVY : 'white',
              border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', fontWeight: 700,
              cursor: customFrom && customTo ? 'pointer' : 'not-allowed',
              opacity: customFrom && customTo ? 1 : 0.5,
            }}
          >
            Search
          </button>
        </div>

        {/* Site total */}
        <div style={{ background: NAVY, borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '56px', fontWeight: 800, color: 'white' }}>{siteViews}</div>
          <div style={{ fontSize: '14px', color: GOLD, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Website Views — {rangeLabel}
          </div>
        </div>

        {/* Banner cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {TRACKED_SCOPES.filter(s => s.scope !== 'site').map((s) => {
            const stat = scopeStats[s.scope] || { views: 0, clicks: 0 }
            const ctr = s.trackClicks && stat.views > 0 ? Math.round((stat.clicks / stat.views) * 100) : null
            return (
              <div key={s.scope} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>{s.label}</div>
                  {ctr !== null && (
                    <div style={{ fontSize: '11px', color: GOLD, fontWeight: 800, background: '#FBF0DC', padding: '2px 8px', borderRadius: '20px' }}>
                      {ctr}% CTR
                    </div>
                  )}
                </div>
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

        {/* Resources — collapsible */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' }}>
          <button
            onClick={() => setResourcesOpen(o => !o)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 18px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              color: '#333',
            }}
          >
            <span>📚 Resources — {rangeLabel}</span>
            <span style={{ color: '#999', fontSize: '13px' }}>{resourcesOpen ? '▲ Hide' : '▼ Show'}</span>
          </button>
          {resourcesOpen && (
            <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[...RESOURCE_SCOPES]
                .sort((a, b) => (scopeStats[b.scope]?.clicks ?? 0) - (scopeStats[a.scope]?.clicks ?? 0))
                .map((s, i, arr) => {
                  const stat = scopeStats[s.scope] || { views: 0, clicks: 0 }
                  return (
                    <div key={s.scope} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: NAVY }}>{stat.clicks} clicks</div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        <p style={{ fontSize: '12px', color: '#999', marginBottom: '20px', marginTop: '-14px' }}>
          Note: the job lists below always show lifetime totals — they don't change with the range picker above.
        </p>

        {/* Currently active featured jobs */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '14px' }}>⭐ Currently Featured Jobs (Lifetime Views)</div>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#999' }}>Loading…</p>
          ) : featuredJobs.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#999' }}>No featured jobs running right now.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {featuredJobs.map((job, i) => {
                const daysLeft = Math.max(0, Math.ceil((new Date(job.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                return (
                  <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < featuredJobs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
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

        {/* Regular jobs */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '14px' }}>Regular Jobs — Top 20 (Lifetime Views)</div>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#999' }}>Loading…</p>
          ) : regularJobs.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#999' }}>No active regular jobs right now.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {regularJobs.map((job, i) => {
                const daysLeft = Math.max(0, Math.ceil((new Date(job.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                return (
                  <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < regularJobs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
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
