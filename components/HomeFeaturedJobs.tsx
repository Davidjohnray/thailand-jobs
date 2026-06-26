'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../src/lib/supabase'
import { MemberLockCard, isJobLocked } from './MemberLock'

export default function HomeFeaturedJobs({ jobs }: { jobs: any[] }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {jobs.map((job: any) => (
        !isLoggedIn && isJobLocked(job.created_at) ? (
          <MemberLockCard key={job.id} job={job} />
        ) : (
          <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              border: '3px solid #E85D26',
              borderRadius: '14px',
              padding: '0',
              boxShadow: '0 4px 20px rgba(232,93,38,0.18)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}>

              {/* FEATURED TOP BAR */}
              <div style={{
                background: '#E85D26',
                padding: '7px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '900',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>⭐ Featured Job</span>
              </div>

              <div style={{ padding: '20px 24px' }}>
                <div className="job-card-inner" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '800', fontSize: '19px', color: '#1a1a2e' }}>{job.title}</span>
                      {job.visa_sponsor && (
                        <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '3px 9px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>
                      )}
                      {isLoggedIn && isJobLocked(job.created_at) && (
                        <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '11px', padding: '3px 9px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Early Access</span>
                      )}
                    </div>
                    <div style={{ color: '#444', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>{job.company} • {job.location}</div>
                    <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>🏫 {job.category}</span>
                  </div>
                  <div className="job-card-right" style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#E85D26', fontWeight: '900', fontSize: '18px', marginBottom: '8px' }}>{job.salary}</div>
                    <div style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block', fontWeight: '700' }}>{job.job_type}</div>
                  </div>
                </div>
              </div>

            </div>
          </Link>
        )
      ))}
    </div>
  )
}
