'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

interface Job {
  id: number
  title: string
  location: string
  job_type: string
  salary: string
  created_at: string
}

export default function ArnaEducationPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('jobs')
        .select('id, title, location, job_type, salary, created_at')
        .eq('company', 'Arna Education and Services LTD.')
        .gt('expires_at', now)
        .order('created_at', { ascending: false })
      setJobs(data || [])
      setLoading(false)
    }
    fetchJobs()
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>

      {/* HERO BANNER */}
      <section style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #1a2060 100%)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img src="/arna-education.png" alt="ARNA Education and Services" style={{ width: '160px', height: '160px', objectFit: 'contain', borderRadius: '16px', marginBottom: '24px' }} />
          <div style={{ display: 'inline-block', background: '#D9A441', borderRadius: '20px', padding: '5px 16px', marginBottom: '16px' }}>
            <span style={{ color: '#0a0f2e', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>⭐ Official Recruitment Partner</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: '900', margin: '0 0 12px' }}>ARNA Education & Services</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', margin: '0 0 8px' }}>One-Stop Service Solutions for Education & Personnel in Thailand</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '0 0 28px' }}>Established 2014 · Thai & English Services · Nationwide Coverage</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://www.arnaedusv.co.th" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
              🌐 Website
            </a>
            <a href="https://www.facebook.com/arnaedusv" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
              📘 Facebook
            </a>
            <a href="https://line.me/ti/p/b8NyML8RZB" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
              💬 LINE
            </a>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        {/* ABOUT */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0a0f2e', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #D9A441' }}>About ARNA</h2>
          <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.8', marginBottom: '16px' }}>
            ARNA Education & Services Co., Ltd. provides comprehensive services in education, personnel support, visas, work permits, professional training, and business coordination for schools, companies, organizations, and international clients in Thailand.
          </p>
          <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.8', marginBottom: '20px' }}>
            We support our clients throughout the entire process — from initial planning and document preparation to implementation, coordination, and after-sales support.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { icon: '🏫', title: 'Education Personnel', desc: 'Teacher recruitment & support' },
              { icon: '🛂', title: 'Visa & Work Permits', desc: 'Full immigration support' },
              { icon: '📋', title: 'Teacher Licensing', desc: 'Document & license support' },
              { icon: '🎓', title: 'Corporate Training', desc: 'Professional development' },
              { icon: '✈️', title: 'Study Abroad', desc: 'International education' },
              { icon: '🤝', title: 'Since 2014', desc: 'Trusted & experienced' },
            ].map(item => (
              <div key={item.title} style={{ background: '#f8f9fa', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '13px', color: '#0a0f2e', marginBottom: '3px' }}>{item.title}</div>
                <div style={{ color: '#888', fontSize: '11px' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CURRENT VACANCIES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0a0f2e', marginBottom: '6px', paddingBottom: '12px', borderBottom: '2px solid #D9A441' }}>
            Current Vacancies
          </h2>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
            Apply for a specific position below. You must upload a photo and resume to apply. All applications are reviewed by our team before being forwarded to ARNA.
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading vacancies...</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
              <p>No current vacancies — check back soon.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {jobs.map(job => (
                <div key={job.id} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '18px 20px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#0a0f2e', marginBottom: '4px' }}>{job.title}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {job.location && `📍 ${job.location}`}{job.job_type && ` · ${job.job_type}`}
                    </div>
                    {job.salary && <div style={{ fontSize: '13px', color: '#D9A441', fontWeight: '700', marginTop: '4px' }}>{job.salary}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <Link href={`/jobs/${job.id}`}
                      style={{ background: 'white', color: '#0a0f2e', border: '1px solid #ddd', padding: '9px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: '700' }}>
                      View details
                    </Link>
                    <Link href={`/schools/arna-education/apply/${job.id}`}
                      style={{ background: '#D9A441', color: '#0a0f2e', padding: '9px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: '800' }}>
                      Apply Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WHY ARNA */}
        <div style={{ background: 'linear-gradient(135deg, #0a0f2e, #1a2060)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '900', margin: '0 0 12px' }}>Why Work With ARNA?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', margin: '0 0 24px', lineHeight: '1.7' }}>
            ARNA has been placing teachers and supporting expats in Thailand since 2014. Their network covers private schools, international schools, language centres and universities across the country.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            {['✅ Established 2014', '✅ Nationwide network', '✅ Full visa support', '✅ Thai & English service'].map(tag => (
              <span key={tag} style={{ background: 'rgba(217,164,65,0.2)', border: '1px solid #D9A441', color: '#D9A441', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '20px' }}>{tag}</span>
            ))}
          </div>
          <Link href="/jobs" style={{ background: '#D9A441', color: '#0a0f2e', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '15px', display: 'inline-block' }}>
            Browse All Teaching Jobs →
          </Link>
        </div>

      </div>
    </main>
  )
}
