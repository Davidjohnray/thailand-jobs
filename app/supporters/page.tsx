'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ── Settings ─────────────────────────────────────────────
const LAUNCH_PRICE = 100                                                // launch offer: 100 baht for 6 months
const LAUNCH_MONTHS = 6
const LAUNCH_DEADLINE = new Date('2026-11-01T00:00:00+07:00').getTime() // offer ends at the end of 31 Oct
const LAUNCH_END_LABEL = '31 October'
const MONTHLY_PRICE = 50                                                // regular: 50 baht / 30 days
const DAYS = 30
const SIX_MONTH_PRICE = 250                                             // regular: 250 baht / 6 months
const MONTHLY_GOAL = 4500
const CONTACT_EMAIL = 'Admin@jobsinthailand.net'
const FACEBOOK_URL = '' // optional: your Facebook page link, to show a "Message on Facebook" button

// Optional: show bank details on the page so people can pay straight away.
// Leave blank to keep "email me for the bank details".
const BANK_NAME = ''
const ACCOUNT_NAME = ''
const ACCOUNT_NUMBER = ''

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
  const [permanent, setPermanent] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [wall, setWall] = useState<WallEntry[]>([])
  const [raised, setRaised] = useState<number | null>(null)
  const [launch, setLaunch] = useState(true)

  useEffect(() => {
    setLaunch(Date.now() < LAUNCH_DEADLINE)
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
          setPermanent(isSupporter && new Date(data!.supporter_until).getFullYear() >= 2090)
        }
      }

      // 2. Supporters wall
      const { data: wallData } = await supabase
        .from('supporter_wall')
        .select('display_name, months_total')
        .order('months_total', { ascending: false })
      if (active && wallData) setWall(wallData as WallEntry[])

      // 3. Total raised this month
      const { data: total } = await supabase.rpc('supporter_month_total')
      if (active && typeof total === 'number') setRaised(total)
    }

    load()
    return () => { active = false }
  }, [])

  const showBank = !!(BANK_NAME && ACCOUNT_NUMBER)
  const amountText = launch
    ? `${LAUNCH_PRICE} baht (${LAUNCH_MONTHS} months)`
    : `${MONTHLY_PRICE} baht (${DAYS} days) or ${SIX_MONTH_PRICE} baht (6 months)`

  const mailBody = launch
    ? `Hi David,\n\nI'd like the Supporter launch offer: ${LAUNCH_PRICE} baht for ${LAUNCH_MONTHS} months.\n\nMy jobsinthailand.net account email is: ${userEmail || '____'}\n\nThanks!`
    : `Hi David,\n\nI'd like to become a Supporter:\n[ ] ${MONTHLY_PRICE} baht / ${DAYS} days\n[ ] ${SIX_MONTH_PRICE} baht / 6 months\n\nMy jobsinthailand.net account email is: ${userEmail || '____'}\n\nThanks!`

  const mailto =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Become a Supporter')}` +
    `&body=${encodeURIComponent(mailBody)}`

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
          <div style={{ fontSize: '42px', marginBottom: '8px' }}>{launch ? '🎉' : '⭐'}</div>
          <h1 style={{ color: NAVY, fontSize: '30px', margin: '0 0 10px' }}>Become a Supporter</h1>
          <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.6, maxWidth: '620px', margin: '0 auto 18px' }}>
            Get every new job the moment it's posted, and help keep jobsinthailand.net free for everyone.
          </p>

          {launch ? (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'inline-block', background: '#FFC83D', color: NAVY, fontWeight: 'bold', fontSize: '13px', padding: '4px 12px', borderRadius: '999px', marginBottom: '10px' }}>
                🎉 Launch offer — ends {LAUNCH_END_LABEL}
              </div>
              <div style={{ fontSize: '30px', fontWeight: 'bold', color: ORANGE }}>
                {LAUNCH_PRICE} baht{' '}
                <span style={{ fontSize: '16px', color: '#666', fontWeight: 'normal' }}>for {LAUNCH_MONTHS} months</span>
              </div>
              <div style={{ color: '#888', fontSize: '13px', marginTop: '6px' }}>
                After {LAUNCH_MONTHS} months, renew for {MONTHLY_PRICE} baht / {DAYS} days or {SIX_MONTH_PRICE} baht / 6 months.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
              <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '14px 20px', minWidth: '160px' }}>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: ORANGE }}>{MONTHLY_PRICE} baht</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{DAYS} days</div>
              </div>
              <div style={{ border: `2px solid ${ORANGE}`, borderRadius: '12px', padding: '14px 20px', minWidth: '160px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: ORANGE, color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '2px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  SAVE 50 BAHT
                </div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: ORANGE }}>{SIX_MONTH_PRICE} baht</div>
                <div style={{ color: '#666', fontSize: '14px' }}>6 months</div>
              </div>
            </div>
          )}

          {/* Status */}
          {status === 'supporter' && permanent && (
            <div style={{ background: '#E8F7EE', color: '#1B7A43', borderRadius: '10px', padding: '14px', fontWeight: 'bold' }}>
              ✅ You're a Supporter. Thank you! 🙏
            </div>
          )}

          {status === 'supporter' && !permanent && until && (
            <div style={{ background: '#E8F7EE', color: '#1B7A43', borderRadius: '10px', padding: '14px', fontWeight: 'bold' }}>
              ✅ You have Supporter access until {formatDate(until)}.
              <div style={{ fontWeight: 'normal', fontSize: '14px', marginTop: '6px' }}>
                {launch
                  ? `Add ${LAUNCH_MONTHS} months for ${LAUNCH_PRICE} baht before ${LAUNCH_END_LABEL}. It starts after your current access ends.`
                  : 'Renew any time. New time is added after your current end date.'}
              </div>
            </div>
          )}

          {(status === 'member' || (status === 'supporter' && !permanent)) && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '14px' }}>
              <a href={mailto} style={btn}>
                📧 {launch ? `Get ${LAUNCH_MONTHS} Months for ${LAUNCH_PRICE} Baht` : status === 'supporter' ? 'Renew My Membership' : 'Become a Supporter'}
              </a>
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

          {showBank && (
            <div style={{ background: '#f7f7f9', border: '1px solid #eee', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px', fontSize: '14px', color: '#333', lineHeight: 1.8 }}>
              <div><strong>Bank:</strong> {BANK_NAME}</div>
              {ACCOUNT_NAME && <div><strong>Account name:</strong> {ACCOUNT_NAME}</div>}
              <div><strong>Account number:</strong> {ACCOUNT_NUMBER}</div>
              <div><strong>Amount:</strong> {amountText}</div>
            </div>
          )}

          <ol style={{ color: '#444', lineHeight: 1.9, paddingLeft: '20px', margin: 0 }}>
            {showBank ? (
              <>
                <li>Transfer <strong>{amountText}</strong> to the account above.</li>
                <li>Email your transfer slip to <a href={mailto} style={{ color: ORANGE, fontWeight: 'bold' }}>{CONTACT_EMAIL}</a> with the email address you use on the site.</li>
                <li>I'll upgrade your account, usually the same day.</li>
              </>
            ) : (
              <>
                <li>Email <a href={mailto} style={{ color: ORANGE, fontWeight: 'bold' }}>{CONTACT_EMAIL}</a>{FACEBOOK_URL ? ' or message me on Facebook' : ''} with the email address you use on the site.</li>
                <li>I'll reply with the bank details.</li>
                <li>Send <strong>{amountText}</strong> and reply with your transfer slip.</li>
                <li>I'll upgrade your account, usually the same day.</li>
              </>
            )}
          </ol>

          <p style={{ color: '#777', fontSize: '13px', margin: '14px 0 0' }}>
            {launch && `The launch offer ends on ${LAUNCH_END_LABEL}. `}
            No automatic payments: if you don't renew, you simply go back to being a free member. Nothing is lost.
            If you renew early, the new time is added after your current end date.
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