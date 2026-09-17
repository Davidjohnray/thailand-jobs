'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../src/lib/supabase'

const NAVY = '#14172B'
const GOLD = '#D9A441'

export default function JobStatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('title, company, location, salary, featured, view_count, created_at, expires_at')
        .eq('id', id)
        .single()
      setJob(data)
      setLoading(false)
    }
    fetchJob()
  }, [id])

  if (loading) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}><p>Loading...</p></main>
  )

  if (!job) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Job not found</h1>
    </main>
  )

  const now = new Date()
  const expires = new Date(job.expires_at)
  const daysLeft = Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  const isExpired = daysLeft === 0

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>

          <div style={{ background: NAVY, padding: '28px 32px' }}>
            {job.featured && (
              <div style={{
                display: 'inline-block',
                background: 'rgba(217,164,65,0.18)',
                color: GOLD,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '5px 14px',
                borderRadius: '100px',
                marginBottom: '12px',
              }}>
                ⭐ Featured Listing
              </div>
            )}
            <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>{job.title}</h1>
            <p style={{ color: '#B9BEDA', fontSize: '14px' }}>{job.company} • {job.location}</p>
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '28px' }}>
              <div style={{ flex: 1, background: '#F9F6EF', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '34px', fontWeight: 800, color: NAVY }}>{job.view_count ?? 0}</div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Total Views</div>
              </div>
              <div style={{ flex: 1, background: '#F9F6EF', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '34px', fontWeight: 800, color: isExpired ? '#999' : NAVY }}>
                  {isExpired ? '0' : daysLeft}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                  {isExpired ? 'Listing Expired' : 'Days Remaining'}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '14px', color: '#666', lineHeight: 1.7 }}>
              <div><strong style={{ color: '#333' }}>Posted:</strong> {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div><strong style={{ color: '#333' }}>Salary:</strong> {job.salary}</div>
              {job.featured && <div><strong style={{ color: '#333' }}>Placement:</strong> Homepage, jobs listing, and shared to our Facebook/Line/WhatsApp communities</div>}
            </div>

            <p style={{ fontSize: '12px', color: '#999', marginTop: '24px', textAlign: 'center' }}>
              Views are counted from real visitors to your job listing on jobsinthailand.net
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href={`/jobs/${id}`} style={{ color: NAVY, fontSize: '14px', textDecoration: 'underline' }}>
            View the live listing →
          </Link>
        </div>
      </div>
    </main>
  )
}
