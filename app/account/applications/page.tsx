'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'
import { authHeaders } from '../../../components/applyClient'
import { AI_MONTHLY_LIMIT, fmtDate, fmtDateTime, freeTriesText } from '../../../src/lib/applyRules'

export default function MyApplicationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [apps, setApps] = useState<any[]>([])
  const [access, setAccess] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/account/login'); return }
      try {
        const res = await fetch('/api/my-applications', { headers: await authHeaders(), cache: 'no-store' })
        const data = await res.json()
        setApps(data.applications || [])
        setAccess(data.access || null)
      } catch {}
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></main>
  )

  const viewed = apps.filter(a => a.viewed_at).length

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ background: '#1a1a2e', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>👀 My Applications</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: '4px 0 0' }}>
            {apps.length} sent · {viewed} viewed by the employer
          </p>
        </div>
        <Link href="/account/dashboard" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>← My Account</Link>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 20px' }}>
        {access && access.enabled && (
          access.isPro ? (
            <div style={{ background: '#fff3ed', border: '2px solid #E85D26', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', color: '#1a1a2e', fontSize: '14px' }}>
              ⚡ <strong>Apply Pro</strong> until {fmtDate(access.proUntil)} · ✨ {access.aiRemaining} of {AI_MONTHLY_LIMIT} AI applications left this month
            </div>
          ) : (
            <div style={{ background: 'white', border: '2px solid #E85D26', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ color: '#444', fontSize: '14px' }}>
                {access.freeTryAvailable ? `🎁 You have ${freeTriesText(access.freeTriesLeft ?? 0)} left — open any job to use them.` : '⚡ Keep applying in one click, with AI letters in English and Thai.'}
              </span>
              <Link href="/apply-pro" style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>Apply Pro →</Link>
            </div>
          )
        )}

        {apps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ marginBottom: '16px' }}>No applications yet. When you apply through Jobs in Thailand, they'll appear here.</p>
            <Link href="/jobs" style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Browse jobs →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {apps.map(a => (
              <div key={a.id} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: a.viewed_at ? '2px solid #4caf50' : '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <Link href={`/jobs/${a.job_id}`} style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e', textDecoration: 'none' }}>{a.job_title}</Link>
                  <div style={{ color: '#888', fontSize: '13px', marginTop: '2px' }}>
                    {a.company} · Applied {fmtDateTime(a.created_at)} · JIT-{a.ref_no}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {a.email_status === 'failed' ? (
                    <span style={{ background: '#ffeaea', color: '#c62828', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold' }}>⚠️ Not delivered</span>
                  ) : a.viewed_at ? (
                    <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '13px', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold' }}>👁 Viewed {fmtDateTime(a.viewed_at)}</span>
                  ) : (
                    <span style={{ background: '#f3f4f6', color: '#777', fontSize: '13px', padding: '5px 12px', borderRadius: '20px' }}>Not viewed yet</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '20px', lineHeight: '1.6' }}>
          "Viewed" means the employer opened your full application (CV, photo and video). Some employers reply straight from the email without opening it, so "Not viewed yet" doesn't always mean they haven't seen you.
        </p>
      </div>
    </main>
  )
}
