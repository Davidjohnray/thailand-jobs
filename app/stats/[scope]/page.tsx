'use client'
import { useState, useEffect, use, useCallback } from 'react'
import { supabase } from '../../../src/lib/supabase'

const NAVY = '#14172B'
const GOLD = '#D9A441'

const SCOPE_NAMES: Record<string, string> = {
  site: 'Website Traffic',
  'banner-duke': 'Duke Language School Banner',
  'partner-teach-bridge': 'Teach Bridge Asia',
  'banner-essential-tefl': 'Essential TEFL Banner',
}

const RANGE_OPTIONS = [7, 30, 90]

function bangkokToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())
}

export default function StatsPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = use(params)
  const [rows, setRows] = useState<any[]>([])
  const [days, setDays] = useState<number | null>(30)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setLoading(true)

    let from: string
    let to: string

    if (days === null && customFrom && customTo) {
      // Custom range mode
      from = customFrom
      to = customTo
    } else {
      // Preset "last N days" mode
      const n = days ?? 30
      from = new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      to = bangkokToday()
    }

    const { data } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('scope', scope)
      .gte('stat_date', from)
      .lte('stat_date', to)
      .order('stat_date', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }, [scope, days, customFrom, customTo])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handlePreset = (opt: number) => {
    setDays(opt)
    setCustomFrom('')
    setCustomTo('')
  }

  const handleCustomSearch = () => {
    if (customFrom && customTo) {
      setDays(null)
    }
  }

  const totalViews = rows.reduce((sum, r) => sum + (r.views || 0), 0)
  const totalClicks = rows.reduce((sum, r) => sum + (r.clicks || 0), 0)
  const hasClicks = rows.some(r => r.clicks > 0)
  const maxViews = Math.max(1, ...rows.map(r => r.views || 0))
  const isCustom = days === null

  const displayName = SCOPE_NAMES[scope] || (scope.startsWith('job-') ? `Job #${scope.replace('job-', '')}` : scope)

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>

          <div style={{ background: NAVY, padding: '28px 32px' }}>
            <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '18px' }}>{displayName}</h1>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {RANGE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => handlePreset(opt)}
                  style={{
                    background: !isCustom && days === opt ? GOLD : 'rgba(255,255,255,0.12)',
                    color: !isCustom && days === opt ? NAVY : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {opt}d
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '13px',
                }}
              />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>to</span>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '13px',
                }}
              />
              <button
                onClick={handleCustomSearch}
                disabled={!customFrom || !customTo}
                style={{
                  background: isCustom ? GOLD : 'rgba(255,255,255,0.12)',
                  color: isCustom ? NAVY : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: customFrom && customTo ? 'pointer' : 'not-allowed',
                  opacity: customFrom && customTo ? 1 : 0.5,
                }}
              >
                Search
              </button>
            </div>
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
              <div style={{ flex: 1, background: '#F9F6EF', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: NAVY }}>{totalViews}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Views {isCustom ? `(${customFrom} to ${customTo})` : `(last ${days} days)`}
                </div>
              </div>
              {hasClicks && (
                <div style={{ flex: 1, background: '#F9F6EF', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: GOLD }}>{totalClicks}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Clicks in this range</div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '14px' }}>Daily Breakdown</h2>
              {loading ? (
                <p style={{ fontSize: '14px', color: '#999' }}>Loading…</p>
              ) : rows.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#999' }}>No data in this range yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                  {rows.map((r) => (
                    <div key={r.stat_date} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#999', width: '64px', flexShrink: 0 }}>
                        {new Date(r.stat_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                      <div style={{ flex: 1, background: '#F1F1F4', borderRadius: '6px', height: '18px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.max(4, ((r.views || 0) / maxViews) * 100)}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${NAVY}, #23284A)`,
                          borderRadius: '6px',
                        }} />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, width: '80px', textAlign: 'right', flexShrink: 0 }}>
                        {r.views}{hasClicks ? ` / ${r.clicks}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
