'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ── Settings ─────────────────────────────────────────────
const MONTHLY_GOAL = 4500
const PRICE = 50
const DAYS = 30
const CONTACT_EMAIL = 'Admin@jobsinthailand.net'
const FACEBOOK_URL = '' // optional: paste your Facebook page link here to show a "Message on Facebook" button

type Status = 'loading' | 'public' | 'member' | 'supporter'
type WallEntry = { display_name: string; months_total: number }

const ORANGE = '#E85D26'
const NAVY = '#1a1a2e'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Bangkok' })
}

function levelBadge(months: number) {
  if (months >= 6) return '🥇'
  if (months >= 3) return '🥈'
  if (months >= 1) return '🥉'
  return '⭐'
}

export default function SupportersPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [until, setUntil] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [wall, setWall] = useState<WallEntry[]>([])
  const [raised, setRaised] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      // 1. Who is viewing?
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (active) setStatus('public')
      } else {
        if (active) setUserEmail(session.user.email || '')
        const { data } = await supabase
          .from('supporters')
          .select('supporter_until')
          .eq('user_id', session.user.id)
          .maybeSingle()
        const isSupporter = !!data?.supporter_until && new Date(data.supporter_until).getTime() > Date.now()
        if (active) {
          setStatus(isSupporter ? 'supporter' : 'member')
          setUntil(isSupporter ? data!.supporter_until : null)
        }
      }

      // 2. Supporters wall
      const { data: wallData } = await supabase
        .from('supporter_wall')
        .select('display_name, months_total')
        .order('months_total', { ascending: false })
      if (active && wallData) setWall(wallData as WallEntry[])

      // 3. Monthly total
      const { data: total } = await supabase.rpc('supporter_month_total')
      if (active && typeof total === 'number') setRaised(total)
    }

    load()
    return () => { active = false }
  }, [])

  const mailto =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Become a Supporter')}` +
    `&body=${encodeURIComponent(
      `Hi David,\n\nI'd like to become a Supporter (${PRICE} baht / ${DAYS} days).\n\nMy jobsinthailand.net account email is: ${userEmail || '____'}\n\nThanks!`
    )}`

  const percent = raised !== null ? Math.min(100, Math.round((raised / MONTHLY_GOAL) * 100)) : 0

  const card: React.CSSProperties = {
    background: 'white', borderRadius: '14px', padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #eee',
  }
  const btn: React.CSSProperties = {
    display: 'inline-block', background: ORANGE, color: 'white', padding: '12px 22px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px',
  }
  const btnOutline: React.CSSProperties = {
    display: 'inline-block', background: 'white', color: NAVY, padding: '12px 22px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', border: '1px solid #ddd',
  }

  return (
    <main style={{ background: '#f7f7f9', minHeight: '100vh', padding: '40px 16px 60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── HERO ── */}
        <section style={{ ...card, textAlign: 'center', borderTop: `5px solid ${ORANGE}` }}>
          <div style={{ fontSize: '42px', marginBottom: '8px' }}>⭐</div>
          <h1 style={{ color: NAVY, fontSize: '30px', margin: '0 0 10px' }}>Become a Supporter</h1>
          <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.6, maxWidth: '620px', margin: '0 auto 18px' }}>
            Get every new job the moment it's posted, and help keep jobsinthailand.net free for everyone.
          </p>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: ORANGE, marginBottom: '18px' }}>
            {PRICE} baht <span style={{ fontSize: '16px', color: '#666', fontWeight: 'normal' }}>/ {DAYS} days</span>
          </div>

          {/* Status-aware call to action */}
          {status === 'supporter' && until && (
            <div style={{ background: '#E8F7EE', color: '#1B7A43', borderRadius: '10px', padding: '14px', fontWeight: 'bold' }}>
              ✅ You're a Supporter until {formatDate(until)}. Thank you! 🙏
              <div style={{ fontWeight: 'normal', fontSize: '14px', marginTop: '6px' }}>
                Want to renew early? <a href={mailto} style={{ color: '#1B7A43' }}>Email me</a>. New days are added after your current end date.
              </div>
            </div>
          )}

          {status === 'member' && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={mailto} style={btn}>📧 Email to Become a Supporter</a>
              {FACEBOOK_URL && <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" style={btnOutline}>💬 Message on Facebook</a>}
            </div>
          )}

          {status === 'public' && (
            <div>
              <p style={{ color: '#555', fontSize: '14px', margin: '0 0 12px' }}>
                You need a free account first, so I can upgrade it.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/account/register" style={btn}>Create a Free Account</Link>
                <Link href="/account/login" style={btnOutline}>Login</Link>
              </div>
            </div>
          )}
        </section>

        {/* ── WHY ── */}
        <section style={card}>
          <h2 style={{ color: NAVY, fontSize: '20px', margin: '0 0 10px' }}>Why I'm asking</h2>
          <p style={{ color: '#444', lineHeight: 1.7, margin: 0 }}>
            I run jobsinthailand.net on my own. Over the past year it has grown into much more than a job board:
            free lesson plans, reading comprehension, grammar practice, classroom games, conversation topics,
            a CV builder and the Teacher Directory. Running the site, along with the new instant job alerts,
            costs around {MONTHLY_GOAL.toLocaleString()} baht a month. Supporters help keep it going and keep it
            free for everyone. Thank you! 🙏 <strong>— David</strong>
          </p>

          {/* Goal bar */}
          {raised !== null && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555', marginBottom: '6px' }}>
                <span><strong style={{ color: NAVY }}>This month:</strong> {raised.toLocaleString()} / {MONTHLY_GOAL.toLocaleString()} baht</span>
                <span>{percent}%</span>
              </div>
              <div style={{ background: '#eee', borderRadius: '999px', height: '14px', overflow: 'hidden' }}>
                <div style={{ width: `${percent}%`, background: ORANGE, height: '100%', borderRadius: '999px', transition: 'width 0.6s' }} />
              </div>
            </div>
          )}
        </section>

        {/* ── HOW JOBS WORK ── */}
        <section style={card}>
          <h2 style={{ color: NAVY, fontSize: '20px', margin: '0 0 14px' }}>When you see new jobs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { icon: '⭐', who: 'Supporters', when: 'Instantly', bg: '#FFF1EA', color: ORANGE },
              { icon: '👤', who: 'Free members', when: 'After 1 hour', bg: '#F1F4FF', color: '#3B4FB5' },
              { icon: '🌐', who: 'Visitors (not logged in)', when: 'After 2 hours', bg: '#F4F4F4', color: '#555' },
            ].map((t) => (
              <div key={t.who} style={{ background: t.bg, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '26px' }}>{t.icon}</div>
                <div style={{ fontWeight: 'bold', color: NAVY, marginTop: '4px' }}>{t.who}</div>
                <div style={{ color: t.color, fontWeight: 'bold', fontSize: '18px', marginTop: '4px' }}>{t.when}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PERKS + FREE ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <section style={card}>
            <h2 style={{ color: NAVY, fontSize: '20px', margin: '0 0 12px' }}>⭐ What Supporters get</h2>
            <ul style={{ color: '#444', lineHeight: 1.9, paddingLeft: '20px', margin: 0 }}>
              <li><strong>Instant access to every new job</strong>, so you can contact schools before anyone else</li>
            </ul>
            <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 'bold', color: ORANGE }}>COMING SOON</div>
            <ul style={{ color: '#666', lineHeight: 1.9, paddingLeft: '20px', margin: '4px 0 0' }}>
              <li>Instant LINE job alerts</li>
              <li>Supporter badge on your Teacher Directory profile</li>
              <li>Marketplace and course discounts</li>
            </ul>
          </section>

          <section style={card}>
            <h2 style={{ color: NAVY, fontSize: '20px', margin: '0 0 12px' }}>🆓 What stays free</h2>
            <ul style={{ color: '#444', lineHeight: 1.9, paddingLeft: '20px', margin: 0 }}>
              <li>Applying for jobs</li>
              <li>Lesson plans, reading comprehension, grammar with AI feedback</li>
              <li>Learn &amp; Play games and conversation topics</li>
              <li>The basic CV builder</li>
              <li>Your Teacher Directory profile</li>
            </ul>
          </section>
        </div>

        {/* ── HOW TO JOIN ── */}
        <section style={card}>
          <h2 style={{ color: NAVY, fontSize: '20px', margin: '0 0 12px' }}>How to become a Supporter</h2>
          <ol style={{ color: '#444', lineHeight: 1.9, paddingLeft: '20px', margin: 0 }}>
            <li>Email <a href={mailto} style={{ color: ORANGE, fontWeight: 'bold' }}>{CONTACT_EMAIL}</a>{FACEBOOK_URL ? ' or message me on Facebook' : ''} with the email address you use on the site.</li>
            <li>I'll reply with the bank details.</li>
            <li>Send {PRICE} baht and reply with your transfer slip.</li>
            <li>I'll upgrade your account. Your {DAYS} days start straight away, or are added on after your current membership if you renew early.</li>
          </ol>
          <p style={{ color: '#777', fontSize: '13px', margin: '14px 0 0' }}>
            Supporter membership doesn't renew automatically. When your {DAYS} days end, you simply go back to being a free member. Nothing is lost.
          </p>
        </section>

        {/* ── WALL ── */}
        <section style={card}>
          <h2 style={{ color: NAVY, fontSize: '20px', margin: '0 0 6px' }}>🙏 Thank you to our Supporters</h2>
          <p style={{ color: '#777', fontSize: '13px', margin: '0 0 16px' }}>
            Current Supporters who chose to be listed. Want your name here? Just mention it when you email.
          </p>
          {wall.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: '16px' }}>Be the first name on the wall! ⭐</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {wall.map((s, i) => (
                <div key={i} style={{ background: '#FFF1EA', border: `1px solid ${ORANGE}33`, borderRadius: '999px', padding: '8px 14px', fontSize: '14px', color: NAVY }}>
                  {levelBadge(s.months_total)} <strong>{s.display_name}</strong>
                  {s.months_total > 0 && <span style={{ color: '#888' }}> · {s.months_total} {s.months_total === 1 ? 'month' : 'months'}</span>}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  )
}