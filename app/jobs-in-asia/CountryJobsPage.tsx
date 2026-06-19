'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  job_type: string
  category: string
  visa_sponsor: boolean
  featured: boolean
  created_at: string
}

interface CountryJobsPageProps {
  country: string
  flag: string
  subtitle: string
  highlights: string[]
  slug: string
}

export default function CountryJobsPage({ country, flag, subtitle, highlights, slug }: CountryJobsPageProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, company, location, salary, job_type, category, visa_sponsor, featured, created_at')
        .eq('country', country)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      setJobs(data || [])
      setLoading(false)
    }
    fetchJobs()
  }, [country])

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: '#E85D26', padding: '48px 24px 40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Link href="/jobs" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Jobs</Link>
          {' '} ›{' '}
          <Link href="/jobs-in-asia" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Jobs in Asia</Link>
          {' '} › {country}
        </p>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px' }}>
          {flag} Teaching Jobs in {country}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: '0 auto 24px', maxWidth: '520px' }}>
          {subtitle}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {highlights.map((h, i) => (
            <span key={i} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '13px', padding: '6px 14px', borderRadius: '20px' }}>
              ✓ {h}
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Job count + post CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
            {loading ? 'Loading jobs...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} in ${country}`}
          </h2>
          <Link href={`/employers/post-job?category=teaching`} style={{ background: '#E85D26', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            + Post a Job in {country}
          </Link>
        </div>

        {/* Jobs list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', border: '1px solid #eee' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{flag}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>No jobs listed yet</h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>Be the first to post a teaching job in {country}</p>
            <Link href="/employers/post-job?category=teaching" style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              Post a Job →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobs.map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  border: job.featured ? '2px solid #E85D26' : '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                  cursor: 'pointer',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {job.featured && (
                        <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Featured</span>
                      )}
                      {job.visa_sponsor && (
                        <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa Sponsor</span>
                      )}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e', marginBottom: '4px' }}>{job.title}</div>
                    <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{job.company} • {job.location}, {country}</div>
                    <span style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>{job.category}</span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {job.salary && <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '15px', marginBottom: '6px' }}>{job.salary}</div>}
                    <div style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>{job.job_type}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/jobs-in-asia" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>
            ← Back to Jobs in Asia
          </Link>
        </div>
      </div>
    </main>
  )
}
