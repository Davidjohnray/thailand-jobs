'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
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
  { scope: 'banner-teachers', label: 'Teachers Directory (Job Pages)', trackClicks: true },
  { scope: 'banner-arna-education', label: 'ARNA Education', trackClicks: true },
  { scope: 'banner-world-tesol', label: 'World TESOL Academy', trackClicks: true },
  { scope: 'thai-friend', label: 'Thai Friend', trackClicks: false },
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

// Prime Time heatmap
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HEATMAP_LIVE_DAYS = 30 // "Live" mode shows the last 30 days — one day isn't enough to spot a pattern
const DAY_MS = 24 * 60 * 60 * 1000

function bangkokToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())
}

function bangkokDaysAgo(n: number) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(Date.now() - n * DAY_MS))
}

// Monday = 0 … Sunday = 6
function weekdayIndex(dateStr: string) {
  return (new Date(dateStr + 'T00:00:00Z').getUTCDay() + 6) % 7
}

// How many Mondays, Tuesdays… fall inside the range, so we can average fairly
function countWeekdays(from: string, to: string) {
  const counts = [0, 0, 0, 0, 0, 0, 0]
  const end = new Date(to + 'T00:00:00Z').getTime()
  for (let t = new Date(from + 'T00:00:00Z').getTime(); t <= end; t += DAY_MS) {
    counts[(new Date(t).getUTCDay() + 6) % 7]++
  }
  return counts
}

function formatHour(h: number) {
  return `${String(h).padStart(2, '0')}:00`
}

function emptyGrid() {
  return Array.from({ length: 7 }, () => Array(24).fill(0) as number[])
}

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

  // Prime Time heatmap state
  const [heatScope, setHeatScope] = useState('site')
  const [heatGrid, setHeatGrid] = useState<number[][]>(emptyGrid())
  const [heatRange, setHeatRange] = useState<{ from: string; to: string } | null>(null)
  const [heatLoading, setHeatLoading] = useState(true)

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

  const fetchHeatmap = useCallback(async () => {
    let from: string
    let to: string

    if (rangeMode === 'live') {
      from = bangkokDaysAgo(HEATMAP_LIVE_DAYS - 1)
      to = bangkokToday()
    } else if (rangeMode === 'custom') {
      if (!customFrom || !customTo) return
      from = customFrom
      to = customTo
    } else {
      from = bangkokDaysAgo(rangeMode)
      to = bangkokToday()
    }

    setHeatLoading(true)
    const grid = emptyGrid()
    const PAGE = 1000

    // Supabase caps responses at 1000 rows, so page through
    for (let offset = 0; ; offset += PAGE) {
      const { data, error } = await supabase
        .from('hourly_stats')
        .select('stat_date, hour, views')
        .eq('scope', heatScope)
        .gte('stat_date', from)
        .lte('stat_date', to)
        .order('stat_date')
        .order('hour')
        .range(offset, offset + PAGE - 1)

      if (error || !data) break
      for (const row of data) {
        grid[weekdayIndex(row.stat_date)][row.hour] += row.views || 0
      }
      if (data.length < PAGE) break
    }

    setHeatGrid(grid)
    setHeatRange({ from, to })
    setHeatLoading(false)
  }, [rangeMode, customFrom, customTo, heatScope])

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

  useEffect(() => {
    fetchScopeStats()
    if (rangeMode === 'live') {
      const interval = setInterval(fetchScopeStats, REFRESH_MS)
      return () => clearInterval(interval)
    }
  }, [fetchScopeStats, rangeMode])

  useEffect(() => {
    fetchHeatmap()
  }, [fetchHeatmap])

  useEffect(() => {
    fetchJobs()
    if (rangeMode === 'live') {
      const interval = setInterval(fetchJobs, REFRESH_MS)
      return () => clearInterval(interval)
    }
  }, [fetchJobs, rangeMode])

  // Average views per slot (so a range with 5 Mondays and 4 Sundays compares fairly)
  const heat = useMemo(() => {
    const weekdayCounts = heatRange ? countWeekdays(heatRange.from, heatRange.to) : [1, 1, 1, 1, 1, 1, 1]
    const avg = heatGrid.map((row, d) => row.map(v => (weekdayCounts[d] > 0 ? v / weekdayCounts[d] : 0)))

    let max = 0
    let total = 0
    const slots: { d: number; h: number; v: number }[] = []
    avg.forEach((row, d) => row.forEach((v, h) => {
      if (v > max) max = v
      total += v
      if (v > 0) slots.push({ d, h, v })
    }))
    slots.sort((a, b) => b.v - a.v)

    const dayTotals = avg.map(row => row.reduce((a, b) => a + b, 0))
    const hourTotals = Array.from({ length: 24 }, (_, h) => avg.reduce((a, row) => a + row[h], 0))
    const bestDay = dayTotals.indexOf(Math.max(...dayTotals))
    const bestHour = hourTotals.indexOf(Math.max(...hourTotals))

    return { avg, max, total, topSlots: slots.slice(0, 3), bestDay, bestHour }
  }, [heatGrid, heatRange])

  const handleCustomSearch = () => {
    if (customFrom && customTo) setRangeMode('custom')
  }

  const siteViews = scopeStats['site']?.views ?? 0
  const rangeLabel =
    rangeMode === 'live' ? 'Today' :
    rangeMode === 'custom' ? `${customFrom} to ${customTo}` :
    `Last ${rangeMode} Days`
  const heatRangeLabel = rangeMode === 'live' ? `Last ${HEATMAP_LIVE_DAYS} Days` : rangeLabel

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

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
          <button onClick={() => setRangeMode('live')}
            style={{ background: rangeMode === 'live' ? GOLD : 'rgba(255,255,255,0.12)', color: rangeMode === 'live' ? NAVY : 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            🔴 Live
          </button>
          {RANGE_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setRangeMode(opt)}
              style={{ background: rangeMode === opt ? GOLD : 'rgba(255,255,255,0.12)', color: rangeMode === opt ? NAVY : 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              {opt}d
            </button>
          ))}
          <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '6px 10px', fontSize: '13px' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>to</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '6px 10px', fontSize: '13px' }} />
          <button onClick={handleCustomSearch} disabled={!customFrom || !customTo}
            style={{ background: rangeMode === 'custom' ? GOLD : 'rgba(255,255,255,0.12)', color: rangeMode === 'custom' ? NAVY : 'white', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', fontWeight: 700, cursor: customFrom && customTo ? 'pointer' : 'not-allowed', opacity: customFrom && customTo ? 1 : 0.5 }}>
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

        {/* Prime Time heatmap */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>🕒 Prime time (Bangkok time)</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                Average views per hour, {heatRangeLabel.toLowerCase()}
              </div>
            </div>
            <select value={heatScope} onChange={e => setHeatScope(e.target.value)}
              style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', color: NAVY, background: 'white' }}>
              {TRACKED_SCOPES.map(s => (
                <option key={s.scope} value={s.scope}>{s.label}</option>
              ))}
            </select>
          </div>

          {heatLoading ? (
            <p style={{ fontSize: '13px', color: '#999', marginTop: '14px' }}>Loading…</p>
          ) : heat.total === 0 ? (
            <p style={{ fontSize: '13px', color: '#999', marginTop: '14px', lineHeight: 1.6 }}>
              No hourly data for this range yet. Hourly tracking starts from the day the hourly_stats SQL was run, so give it a week for a useful pattern.
            </p>
          ) : (
            <>
              {/* Summary */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '14px 0 18px' }}>
                <div style={{ background: NAVY, color: 'white', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: GOLD, fontWeight: 700 }}>Busiest day</div>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>{DAY_LABELS[heat.bestDay]}</div>
                </div>
                <div style={{ background: NAVY, color: 'white', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: GOLD, fontWeight: 700 }}>Busiest hour</div>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>{formatHour(heat.bestHour)}–{formatHour((heat.bestHour + 1) % 24)}</div>
                </div>
                {heat.topSlots.length > 0 && (
                  <div style={{ background: '#FBF0DC', borderRadius: '10px', padding: '10px 14px', flex: '1 1 220px' }}>
                    <div style={{ fontSize: '11px', color: '#9a6d1c', fontWeight: 700 }}>Best slots to post</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginTop: '2px' }}>
                      {heat.topSlots.map(s => `${DAY_LABELS[s.d]} ${formatHour(s.h)}`).join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid */}
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: '680px', display: 'grid', gridTemplateColumns: '40px repeat(24, 1fr)', gap: '3px' }}>
                  <div />
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} style={{ fontSize: '10px', color: '#999', textAlign: 'center' }}>
                      {h % 3 === 0 ? String(h).padStart(2, '0') : ''}
                    </div>
                  ))}
                  {heat.avg.map((row, d) => (
                    <div key={d} style={{ display: 'contents' }}>
                      <div style={{ fontSize: '11px', color: '#666', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        {DAY_LABELS[d]}
                      </div>
                      {row.map((v, h) => (
                        <div key={h}
                          title={`${DAY_LABELS[d]} ${formatHour(h)}–${formatHour((h + 1) % 24)}: ${v.toFixed(1)} avg views`}
                          style={{
                            height: '26px',
                            borderRadius: '4px',
                            background: v === 0 || heat.max === 0
                              ? '#f2f2f2'
                              : `rgba(217, 164, 65, ${0.15 + 0.85 * (v / heat.max)})`,
                          }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '11px', color: '#999' }}>
                Quieter
                {[0.15, 0.4, 0.65, 1].map(o => (
                  <span key={o} style={{ width: '16px', height: '12px', borderRadius: '3px', background: `rgba(217, 164, 65, ${o})` }} />
                ))}
                Busier
              </div>
            </>
          )}
        </div>

        {/* Resources — collapsible */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' }}>
          <button onClick={() => setResourcesOpen(o => !o)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#333' }}>
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
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
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
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
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
