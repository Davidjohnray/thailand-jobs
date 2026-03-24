import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single()

  if (!job) {
    return (
      <main style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Job not found</h1>
        <Link href="/jobs" style={{ color: '#E85D26' }}>Back to all jobs</Link>
      </main>
    )
  }

  const gmailUrl = 'https://mail.google.com/mail/?view=cm&to=' + job.email + '&su=Job Application - ' + encodeURIComponent(job.title) + '&body=Dear Hiring Manager,%0A%0AI am writing to apply for the ' + encodeURIComponent(job.title) + ' position at ' + encodeURIComponent(job.company) + '.%0A%0APlease find my CV attached.%0A%0AKind regards%0A%0A---%0AThis application was made via Jobs in Thailand%0Awww.jobsinthailand.net'

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <Link href="/jobs" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>
          Back to all jobs
        </Link>

        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>{job.title}</h1>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '16px' }}>{job.company} • {job.location}</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>{job.job_type}</span>
                <span style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>{job.category}</span>
                {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '13px', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa Sponsor</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '22px' }}>{job.salary}</div>
              <div style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>
                Expires: {new Date(job.expires_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Job Description</h2>
          <p style={{ color: '#444', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{job.description}</p>
        </div>

        {job.requirements && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Requirements</h2>
            <p style={{ color: '#444', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
          </div>
        )}

        {job.benefits && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Benefits</h2>
            <p style={{ color: '#444', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{job.benefits}</p>
          </div>
        )}

        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '32px', textAlign: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Interested in this job?</h2>
          <p style={{ color: '#ccc', marginBottom: '24px', fontSize: '15px' }}>Send your CV directly to the employer</p>
          <a href={gmailUrl} target="_blank" rel="noopener noreferrer"
            style={{ background: '#E85D26', color: 'white', padding: '14px 48px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block' }}>
            Apply Now →
          </a>
        </div>

        {/* LINE COMMUNITY */}
        <div style={{ background: '#06C755', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', marginBottom: '6px' }}>💬 Join our LINE Teaching Community</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginBottom: '16px' }}>Connect with teachers across Thailand — free tips, advice & job alerts!</div>
          <a href="https://line.me/ti/g2/MGV6FgMkGOdFSUeaPsHUyMf2P2hYAT5-a6f5Vg" target="_blank" rel="noopener noreferrer"
            style={{ background: 'white', color: '#06C755', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            Join Free →
          </a>
        </div>

      </div>
    </main>
  )
}