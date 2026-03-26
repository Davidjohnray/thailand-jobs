'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function MemberLockCard({ job }: { job: any }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [minutesLeft, setMinutesLeft] = useState(0)

  useEffect(() => {
    const update = () => {
      const created = new Date(job.created_at).getTime()
      const now = Date.now()
      const elapsed = Math.floor((now - created) / 1000)
      const remaining = 3600 - elapsed
      if (remaining <= 0) {
        window.location.reload()
        return
      }
      const mins = Math.floor(remaining / 60)
      const secs = remaining % 60
      setMinutesLeft(mins)
      setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [job.created_at])

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #E85D26', position: 'relative', overflow: 'hidden' }}>
      {/* BLURRED BACKGROUND HINT */}
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', opacity: 0.4, marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e', marginBottom: '4px' }}>{job.title}</div>
        <div style={{ color: '#666', fontSize: '14px' }}>{job.company} • {job.location}</div>
      </div>

      {/* LOCK OVERLAY */}
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
        <div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '15px', marginBottom: '4px' }}>
          Members Early Access
        </div>
        <div style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
          Available to everyone in <strong style={{ color: '#1a1a2e' }}>{timeLeft}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/account/register"
            style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
            Join Free — View Now
          </Link>
          <Link href="/account/login"
            style={{ background: 'white', color: '#1a1a2e', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', border: '1px solid #ddd' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export function isJobLocked(createdAt: string): boolean {
  const created = new Date(createdAt).getTime()
  const elapsed = Date.now() - created
  return elapsed < 60 * 60 * 1000 // 1 hour in ms
}