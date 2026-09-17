'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

const NAVY = '#14172B'
const GOLD = '#D9A441'
const BLUE_SOFT = '#EAF0FF'
const BLUE_TEXT = '#2D5BD0'

function JobLogo({ job, size = 52 }: { job: any; size?: number }) {
  if (!job.source_logo) return null
  return (
    <img
      src={job.source_logo}
      alt="Posted by"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '8px',
        objectFit: 'contain',
        border: '1px solid #eee',
        background: 'white',
        padding: '3px',
        flexShrink: 0,
      }}
    />
  )
}

export default function WeeklyClient() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const now = new Date().toISOString()

      const { data: featured } = await supabase
        .from('jobs')
        .select('*')
        .eq('country', 'Thailand')
        .eq('featured', true)
        .gte('created_at', sevenDaysAgo)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })

      const { data: regular } = await supabase
        .from('jobs')
        .select('*')
        .eq('country', 'Thailand')
        .eq('featured', false)
        .gte('created_at', sevenDaysAgo)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })
        .limit(20)

      setJobs([...(featured || []), ...(regular || [])])
      setLoading(false)
    }
    fetchJobs()
  }, [])

  const featuredJobs = jobs.filter(j => j.featured)
  const regularJobs = jobs.filter(j => !j.featured)

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <section style={{ background: NAVY, padding: '52px 24px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(217,164,65,0.18)',
            color: GOLD,
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '8px 20px',
            borderRadius: '100px',
            marginBottom: '16px',
          }}
        >
          ⭐ Updated Weekly
        </div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
          New Jobs This Week
        </h1>
        <p style={{ color: '#ccc', fontSize: '16px' }}>
          {loading ? 'Loading…' : `${jobs.length} new jobs posted in the last 7 days`}
        </p>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px 64px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666', background: 'white', borderRadius: '12px' }}>
            <p>No new jobs posted in the last 7 days — check back soon.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {featuredJobs.length > 0 && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: NAVY, marginBottom: '14px' }}>
                  ⭐ Featured This Week
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {featuredJobs.map((job: any) => (
                    <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                      <div
                        style={{
                          position: 'relative',
                          background: 'white',
                          border: `3px solid ${NAVY}`,
                          borderRadius: '14px',
                          boxShadow: '0 4px 24px rgba(217,164,65,0.22), 0 4px 20px rgba(20,23,43,0.12)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '6px',
                            background: `linear-gradient(180deg, ${GOLD}, #F3CE85, ${GOLD})`,
                          }}
                        />
                        <div style={{ background: NAVY, padding: '6px 20px 6px 26px' }}>
                          <span style={{ color: GOLD, fontSize: '12px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            ⭐ Featured Job
                          </span>
                        </div>
                        <div style={{ padding: '18px 20px 18px 26px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <JobLogo job={job} />
                              <span style={{ fontWeight: 800, fontSize: '17px', color: '#1a1a2e' }}>{job.title}</span>
                              {job.visa_sponsor && (
                                <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '3px 9px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>
                              )}
                            </div>
                            <div style={{ color: '#444', fontSize: '14px', fontWeight: 600 }}>{job.company} • {job.location}</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div
                              style={{
                                display: 'inline-block',
                                background: `linear-gradient(120deg, ${GOLD}, #F3CE85)`,
                                color: NAVY,
                                fontWeight: 800,
                                fontSize: '14px',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                marginBottom: '6px',
                              }}
                            >
                              {job.salary}
                            </div>
                            <div style={{ background: BLUE_SOFT, color: BLUE_TEXT, fontSize: '11px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block', fontWeight: 700 }}>
                              {job.job_type}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {regularJobs.length > 0 && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: NAVY, marginBottom: '14px' }}>
                  New This Week
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {regularJobs.map((job: any) => (
                    <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <JobLogo job={job} size={40} />
                            <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a2e' }}>{job.title}</span>
                            {job.visa_sponsor && (
                              <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '10px', padding: '2px 7px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>
                            )}
                          </div>
                          <div style={{ color: '#666', fontSize: '13px' }}>{job.company} • {job.location}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>{job.salary}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
