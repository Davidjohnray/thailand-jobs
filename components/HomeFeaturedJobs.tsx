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
            <div style={{ background: 'white', border: '2px solid #E85D26', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(232,93,38,0.08)', cursor: 'pointer' }}>
              <div className="job-card-inner" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{job.title}</span>
                    <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>⭐ Featured</span>
                    {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>}
                    {isLoggedIn && isJobLocked(job.created_at) && <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Early Access</span>}
                  </div>
                  <div style={{ color: '#555', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>{job.company} • {job.location}</div>
                  <span style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>{job.category}</span>
                </div>
                <div className="job-card-right" style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '15px', marginBottom: '6px' }}>{job.salary}</div>
                  <div style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>{job.job_type}</div>
                </div>
              </div>
            </div>
          </Link>
        )
      ))}
    </div>
  )
}