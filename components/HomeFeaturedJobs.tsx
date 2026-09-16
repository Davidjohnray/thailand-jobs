'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../src/lib/supabase'
import { MemberLockCard, isJobLocked } from './MemberLock'

// Featured colors — kept separate from the site's orange brand color
// so featured jobs read as "premium" rather than blending into nav/ad orange.
const NAVY = '#14172B'
const GOLD = '#D9A441'
const GOLD_SOFT = '#FBF0DC'
const GOLD_TEXT = '#9A6A17'
const BLUE_SOFT = '#EAF0FF'
const BLUE_TEXT = '#2D5BD0'

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
              position: 'relative',
              background: 'white',
              border: `3px solid ${NAVY}`,
              borderRadius: '14px',
              padding: '0',
              boxShadow: '0 4px 24px rgba(217,164,65,0.22), 0 4px 20px rgba(20,23,43,0.12)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}>

              {/* GOLD EDGE STRIPE */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '6px',
                background: `linear-gradient(180deg, ${GOLD}, #F3CE85, ${GOLD})`,
                zIndex: 1,
              }} />

              {/* FEATURED TOP BAR */}
              <div style={{
                background: NAVY,
                padding: '7px 20px 7px 26px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  color: GOLD,
                  fontSize: '12px',
                  fontWeight: '900',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>⭐ Featured Job</span>
              </div>

              <div style={{ padding: '20px 24px 20px 30px' }}>
                <div className="job-card-inner" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
  {job.source_logo && (
    <img
      src={job.source_logo}
      alt="Company logo"
      style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #eee', background: 'white', padding: '3px', flexShrink: 0 }}
    />
  )}
  <span style={{ fontWeight: '800', fontSize: '19px', color: '#1a1a2e' }}>{job.title}</span>
                      {job.visa_sponsor && (
                        <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '3px 9px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>
                      )}
                      {isLoggedIn && isJobLocked(job.created_at) && (
                        <span style={{ background: GOLD_SOFT, color: GOLD_TEXT, fontSize: '11px', padding: '3px 9px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Early Access</span>
                      )}
                    </div>
                    <div style={{ color: '#444', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>{job.company} • {job.location}</div>
                    <span style={{ background: NAVY, color: GOLD, fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>🏫 {job.category}</span>
                  </div>
                  <div className="job-card-right" style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      display: 'inline-block',
                      background: `linear-gradient(120deg, ${GOLD}, #F3CE85)`,
                      color: NAVY,
                      fontWeight: '800',
                      fontSize: '16px',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      marginBottom: '8px',
                    }}>{job.salary}</div>
                    <div style={{ background: BLUE_SOFT, color: BLUE_TEXT, fontSize: '12px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block', fontWeight: '700' }}>{job.job_type}</div>
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
