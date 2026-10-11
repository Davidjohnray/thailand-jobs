'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../src/lib/supabase'

// ── Settings ─────────────────────────────────────────────
const HOUR = 60 * 60 * 1000
export const MEMBER_DELAY_MS = 1 * HOUR   // free members wait 1 hour
export const PUBLIC_DELAY_MS = 2 * HOUR   // visitors wait 2 hours
const SUPPORTER_URL = '/supporters'

export type AccessTier = 'public' | 'member' | 'supporter'

function delayFor(tier: AccessTier): number {
  if (tier === 'supporter') return 0
  if (tier === 'member') return MEMBER_DELAY_MS
  return PUBLIC_DELAY_MS
}

// Old pages call isJobLocked(createdAt) → treated as a visitor (2 hours).
export function isJobLocked(createdAt: string, tier: AccessTier = 'public'): boolean {
  const delay = delayFor(tier)
  if (delay === 0) return false
  const elapsed = Date.now() - new Date(createdAt).getTime()
  return elapsed < delay
}

// Works out whether the current user is a visitor, member or supporter
export function useAccessTier(): AccessTier {
  const [tier, setTier] = useState<AccessTier>('public')

  useEffect(() => {
    let active = true

    const check = async (session: any) => {
      if (!session) {
        if (active) setTier('public')
        return
      }
      const { data } = await supabase
        .from('supporters')
        .select('supporter_until')
        .eq('user_id', session.user.id)
        .maybeSingle()
      const isSupporter =
        !!data?.supporter_until && new Date(data.supporter_until).getTime() > Date.now()
      if (active) setTier(isSupporter ? 'supporter' : 'member')
    }

    supabase.auth.getSession().then(({ data: { session } }: any) => check(session))

    // setTimeout avoids calling Supabase inside the auth callback, which can freeze logins
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setTimeout(() => check(session), 0)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return tier
}

// The locked job card with countdown
export function MemberLockCard({ job, tier = 'public' }: { job: any; tier?: AccessTier }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const update = () => {
      const created = new Date(job.created_at).getTime()
      const remaining = Math.floor((created + delayFor(tier) - Date.now()) / 1000)
      if (remaining <= 0) {
        window.location.reload()
        return
      }
      const hrs = Math.floor(remaining / 3600)
      const mins = Math.floor((remaining % 3600) / 60)
      const secs = remaining % 60
      setTimeLeft(
        hrs > 0
          ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          : `${mins}:${secs.toString().padStart(2, '0')}`
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [job.created_at, tier])

  const isMember = tier === 'member'

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #E85D26', position: 'relative', overflow: 'hidden' }}>
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', opacity: 0.4, marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e', marginBottom: '4px' }}>{job.title}</div>
        <div style={{ color: '#666', fontSize: '14px' }}>{job.company} • {job.location}</div>
      </div>

      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
        <div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '15px', marginBottom: '4px' }}>
          {isMember ? 'Supporters Early Access' : 'Early Access'}
        </div>
        <div style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
          {isMember ? 'Available to you in ' : 'Available to everyone in '}
          <strong style={{ color: '#1a1a2e' }}>{timeLeft}</strong>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isMember ? (
            <Link href={SUPPORTER_URL}
              style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
              ⭐ Become a Supporter — See It Now
            </Link>
          ) : (
            <>
              <Link href="/account/register"
                style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                Join Free — See Jobs Sooner
              </Link>
              <Link href="/account/login"
                style={{ background: 'white', color: '#1a1a2e', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', border: '1px solid #ddd' }}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}