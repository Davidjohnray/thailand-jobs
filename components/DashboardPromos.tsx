'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../src/lib/supabase'

const ORANGE = '#E85D26'
const NAVY = '#1a1a2e'

const LAUNCH = new Date('2026-10-14T00:00:00+07:00').getTime()
const UPDATE_SHOW_UNTIL = new Date('2026-11-01T00:00:00+07:00').getTime()
const DISMISS_KEY = 'jit_supporter_update_dismissed'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Bangkok' })
}

export default function DashboardPromos() {
  const [loaded, setLoaded] = useState(false)
  const [role, setRole] = useState<string>('')
  const [supporterUntil, setSupporterUntil] = useState<string | null>(null)
  const [monthsTotal, setMonthsTotal] = useState(0)
  const [hasTeacherProfile, setHasTeacherProfile] = useState(true) // assume yes until checked, so nothing flashes
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(() => {
    let active = true

    // Update banner: show until 1 Nov unless dismissed
    let dismissed = false
    try { dismissed = localStorage.getItem(DISMISS_KEY) === '1' } catch {}
    setShowUpdate(!dismissed && Date.now() < UPDATE_SHOW_UNTIL)

    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const userId = session.user.id
      const email = session.user.email || ''

      const [{ data: profile }, { data: sup }, { data: teacher }] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', userId).maybeSingle(),
        supabase.from('supporters').select('supporter_until, months_total').eq('user_id', userId).maybeSingle(),
        supabase.from('teachers').select('id').or(`user_id.eq.${userId},email.eq.${email}`).limit(1),
      ])

      if (!active) return
      setRole(profile?.role || '')
      if (sup?.supporter_until && new Date(sup.supporter_until).getTime() > Date.now()) {
        setSupporterUntil(sup.supporter_until)
        setMonthsTotal(sup.months_total || 0)
      }
      setHasTeacherProfile(!!teacher && teacher.length > 0)
      setLoaded(true)
    }

    load()
    return () => { active = false }
  }, [])

  const dismissUpdate = () => {
    try { localStorage.setItem(DISMISS_KEY, '1') } catch {}
    setShowUpdate(false)
  }

  const isJobSeeker = role === 'job_seeker'
  const beforeLaunch = Date.now() < LAUNCH
  const inFreeWeek = !!supporterUntil && monthsTotal === 0

  const card: React.CSSProperties = {
    borderRadius: '12px', padding: '18px 20px', marginBottom: '16px', position: 'relative',
  }
  const btn: React.CSSProperties = {
    display: 'inline-block', marginTop: '10px', padding: '9px 16px', borderRadius: '8px',
    textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', color: 'white',
  }

  return (
    <div>
      {/* ── 1. WHAT'S CHANGING (only shown to job seekers) ── */}
      {showUpdate && isJobSeeker && (
        <div style={{ ...card, background: '#FFF8E6', border: '1px solid #F2C14E' }}>
          <button onClick={dismissUpdate} aria-label="Dismiss"
            style={{ position: 'absolute', top: '10px', right: '12px', background: 'none', border: 'none', fontSize: '18px', color: '#999', cursor: 'pointer' }}>
            ✕
          </button>
          <div style={{ fontWeight: 'bold', color: NAVY, fontSize: '16px', marginBottom: '6px' }}>
            📢 {beforeLaunch ? 'Coming on Wednesday 14 October' : "What's new"}
          </div>
          <div style={{ color: '#444', fontSize: '14px', lineHeight: 1.7 }}>
            New jobs now go to <strong>Supporters instantly</strong>, <strong>free members after 1 hour</strong>, and visitors after 2 hours.
            Applying for jobs, all teaching resources, the basic CV builder and the Teacher Directory stay free.
            {beforeLaunch && <> As a thank-you, <strong>all members get 7 days of Supporter access free</strong> from 14 October.</>}
          </div>
          <Link href="/supporters" style={{ color: ORANGE, fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginTop: '8px' }}>
            Find out why →
          </Link>
        </div>
      )}

      {loaded && isJobSeeker && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '8px' }}>

          {/* ── 2. SUPPORTER STATUS ── */}
          {supporterUntil ? (
            <div style={{ ...card, marginBottom: 0, background: '#E8F7EE', border: '1px solid #1B7A4333' }}>
              <div style={{ fontWeight: 'bold', color: '#1B7A43', fontSize: '16px' }}>
                {inFreeWeek ? '🎁 Free Supporter week' : '⭐ You\'re a Supporter'}
              </div>
              <div style={{ color: '#444', fontSize: '14px', lineHeight: 1.6, marginTop: '4px' }}>
                You see new jobs instantly until <strong>{formatDate(supporterUntil)}</strong>.
                {inFreeWeek
                  ? ' Want to keep it? Become a Supporter for 50 baht / 30 days.'
                  : ' Thank you for helping keep the site free! 🙏'}
              </div>
              <Link href="/supporters" style={{ ...btn, background: '#1B7A43' }}>
                {inFreeWeek ? 'Keep Instant Access →' : 'Renew Early →'}
              </Link>
            </div>
          ) : (
            <div style={{ ...card, marginBottom: 0, background: '#fff3ed', border: `1px solid ${ORANGE}33` }}>
              <div style={{ fontWeight: 'bold', color: NAVY, fontSize: '16px' }}>⭐ See jobs the moment they're posted</div>
              <div style={{ color: '#444', fontSize: '14px', lineHeight: 1.6, marginTop: '4px' }}>
                Supporters see every new job <strong>instantly</strong>, so you can contact schools before anyone else.
                Just 50 baht / 30 days.
              </div>
              <Link href="/supporters" style={{ ...btn, background: ORANGE }}>Become a Supporter →</Link>
            </div>
          )}

          {/* ── 3. TEACHER DIRECTORY (only if they don't have a profile yet) ── */}
          {!hasTeacherProfile && (
            <div style={{ ...card, marginBottom: 0, background: '#F1F4FF', border: '1px solid #3B4FB533' }}>
              <div style={{ fontWeight: 'bold', color: NAVY, fontSize: '16px' }}>👩‍🏫 Get found by schools</div>
              <div style={{ color: '#444', fontSize: '14px', lineHeight: 1.6, marginTop: '4px' }}>
                Create your <strong>free Teacher Directory profile</strong> so schools across Thailand can find you.
                Use the same email as your account so it links automatically.
              </div>
              <Link href="/teachers/register" style={{ ...btn, background: '#3B4FB5' }}>Create My Free Profile →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}