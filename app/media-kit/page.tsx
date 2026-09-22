'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

// ── EDIT THESE MANUALLY — pulled from LINE/WhatsApp/Facebook group info, not tracked automatically ──
const LINE_MEMBERS = 685        // e.g. 3200
const WHATSAPP_MEMBERS = 491    // e.g. 1800
const FACEBOOK_MEMBERS = 246436    // e.g. 77700 — combine multiple groups if you run more than one
// ──────────────────────────────────────────────────────────────────────────────────────────────

const NAVY = '#1a1a2e'
const ORANGE = '#E85D26'
const GOLD = '#D9A441'

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export default function MediaKitPage() {
  const [monthlyViews, setMonthlyViews] = useState<number | null>(null)
  const [liveJobs, setLiveJobs] = useState<number | null>(null)
  const [featuredCount, setFeaturedCount] = useState<number | null>(null)
  const [avgFeaturedViews, setAvgFeaturedViews] = useState<number | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

      const { data: statsRows } = await supabase
        .from('daily_stats')
        .select('views')
        .eq('scope', 'site')
        .gte('stat_date', thirtyDaysAgo)
      const totalViews = (statsRows || []).reduce((sum, r) => sum + (r.views || 0), 0)
      setMonthlyViews(totalViews)

      const now = new Date().toISOString()

      const { count: liveCount } = await supabase
        .from('jobs')
        .select('id', { count: 'exact', head: true })
        .gt('expires_at', now)
      setLiveJobs(liveCount ?? 0)

      const { data: featuredJobs } = await supabase
        .from('jobs')
        .select('view_count')
        .eq('featured', true)
        .gt('expires_at', now)

      setFeaturedCount(featuredJobs?.length ?? 0)
      if (featuredJobs && featuredJobs.length > 0) {
        const avg = featuredJobs.reduce((sum, j) => sum + (j.view_count || 0), 0) / featuredJobs.length
        setAvgFeaturedViews(Math.round(avg))
      } else {
        setAvgFeaturedViews(0)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    { value: monthlyViews, label: 'Website Views', sub: 'Last 30 days', icon: '📈' },
    { value: liveJobs, label: 'Live Job Listings', sub: 'Right now', icon: '💼' },
    { value: avgFeaturedViews, label: 'Avg. Views per Featured Job', sub: 'Currently running', icon: '⭐' },
  ]

  const communityStats = [
    { value: FACEBOOK_MEMBERS, label: 'Facebook Group Members', icon: '📘', color: '#1877F2' },
    { value: LINE_MEMBERS, label: 'LINE Community Members', icon: '💬', color: '#06C755' },
    { value: WHATSAPP_MEMBERS, label: 'WhatsApp Community Members', icon: '💬', color: '#25D366' },
  ]

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* HERO */}
      <section style={{ background: NAVY, padding: '80px 24px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(217,164,65,0.15)',
            color: GOLD,
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '8px 20px',
            borderRadius: '100px',
            marginBottom: '24px',
          }}>
            Media Kit
          </div>
          <h1 style={{ color: 'white', fontSize: '42px', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
            Reach Thousands of Teachers<br />and Expats Across Thailand
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '17px', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            Jobs in Thailand connects schools, recruiters, and service providers with an
            engaged audience of teachers and expats actively living and working in Thailand.
          </p>
        </div>
      </section>

      {/* STATS GRID */}
      <section style={{ padding: '0 24px', marginTop: '-64px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'white', borderRadius: '16px', padding: '28px 20px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>{s.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: NAVY, marginBottom: '4px' }}>
                {s.value === null ? '—' : formatNumber(s.value)}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#444' }}>{s.label}</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY REACH */}
      <section style={{ padding: '48px 24px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
            Community Reach
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {communityStats.map((c) => (
              <div key={c.label} style={{ background: 'white', borderRadius: '14px', padding: '22px 18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '26px', marginBottom: '8px' }}>{c.icon}</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: c.color, marginBottom: '4px' }}>
                  {formatNumber(c.value)}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#444' }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS THE AUDIENCE */}
      <section style={{ padding: '100px 24px 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: NAVY, marginBottom: '16px' }}>Who You'll Reach</h2>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.7, marginBottom: '40px' }}>
            Our audience is teachers, ESL professionals, and expats currently living in Thailand or actively
            planning to move — people making real decisions about schools, housing, courses, and services.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', textAlign: 'left' }}>
            {[
              { icon: '🎓', text: 'Qualified & aspiring English teachers across Thailand' },
              { icon: '🌏', text: 'Expats relocating to or already living in Thailand' },
              { icon: '🏫', text: 'Schools and recruiters actively hiring' },
              { icon: '📍', text: 'Concentrated in Bangkok, Chiang Mai, Phuket & beyond' },
            ].map(item => (
              <div key={item.text} style={{ background: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</div>
                <div style={{ fontSize: '14px', color: '#444', lineHeight: 1.5 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S AVAILABLE */}
      <section style={{ background: 'white', padding: '64px 24px', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: NAVY, marginBottom: '16px' }}>Ways to Advertise</h2>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
            Homepage placements, sidebar banners, and featured job listings — each with real,
            trackable performance data behind it.
          </p>
          <Link href="/advertise" style={{
            display: 'inline-block',
            background: ORANGE,
            color: 'white',
            padding: '14px 36px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '16px',
          }}>
            View Advertising Options →
          </Link>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section style={{ background: NAVY, padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>Let's Talk</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '28px' }}>
            Questions about advertising, custom packages, or partnership opportunities?
          </p>
          <Link href="/contact" style={{
            display: 'inline-block',
            background: GOLD,
            color: NAVY,
            padding: '14px 36px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '16px',
          }}>
            Get in Touch →
          </Link>
        </div>
      </section>

    </main>
  )
}
