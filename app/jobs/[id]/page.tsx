'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      const { data } = await supabase.from('jobs').select('*').eq('id', id).single()
      setJob(data)
      setLoading(false)
    }
    init()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [id])

  useEffect(() => {
    if (!job) return
    const update = () => {
      const created = new Date(job.created_at).getTime()
      const remaining = 3600000 - (Date.now() - created)
      if (remaining <= 0) { setLocked(false); return }
      setLocked(true)
      const mins = Math.floor(remaining / 60000)
      const secs = Math.floor((remaining % 60000) / 1000)
      setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [job])

  if (loading) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}><p>Loading...</p></main>
  )

  if (!job) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Job not found</h1>
      <Link href="/jobs" style={{ color: '#E85D26' }}>Back to all jobs</Link>
    </main>
  )

  const emailBody = `Dear Hiring Manager,%0A%0AI am writing to apply for the ${encodeURIComponent(job.title)} position at ${encodeURIComponent(job.company)}, as advertised on Jobs in Thailand (www.jobsinthailand.net).%0A%0APlease find my CV attached.%0A%0AKind regards%0A%0A---%0ARef: Jobs in Thailand - www.jobsinthailand.net%0AJob ID: ${job.id}`
  const gmailUrl = 'https://mail.google.com/mail/?view=cm&to=' + job.email + '&su=Job Application - ' + encodeURIComponent(job.title) + '&body=' + emailBody
  const mailtoUrl = 'mailto:' + job.email + '?subject=Job Application - ' + encodeURIComponent(job.title) + '&body=' + emailBody

  if (locked && !isLoggedIn) return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/jobs" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>← Back to all jobs</Link>
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>{job.title}</h1>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '16px' }}>{job.company} • {job.location}</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>{job.job_type}</span>
            <span style={{ background: '#f0f0f0', color: '#555', fontSize: '13px', padding: '4px 12px', borderRadius: '20px' }}>{job.category}</span>
            {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '13px', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa Sponsor</span>}
            <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '13px', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>{job.salary}</span>
          </div>
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '40px 32px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Members Early Access</h2>
          <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '8px' }}>
            This job was just posted! Members get to see new jobs <strong style={{ color: '#E85D26' }}>1 hour before everyone else.</strong>
          </p>
          <div style={{ background: 'rgba(232,93,38,0.2)', borderRadius: '8px', padding: '12px 24px', display: 'inline-block', marginBottom: '24px' }}>
            <span style={{ color: '#ccc', fontSize: '14px' }}>Available to all in </span>
            <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '24px' }}> {timeLeft}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/account/register" style={{ background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              Join Free — View Now →
            </Link>
            <Link href="/account/login" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontSize: '16px' }}>
              Login
            </Link>
          </div>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '16px' }}>Free to join • No spam • Cancel anytime</p>
        </div>
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

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/jobs" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>
          Back to all jobs
        </Link>
        {isLoggedIn && locked && (
          <div style={{ background: '#fff3ed', border: '2px solid #E85D26', borderRadius: '10px', padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⭐</span>
            <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>You're seeing this job {timeLeft} before the public — members early access!</span>
          </div>
        )}
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
              <div style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>Expires: {new Date(job.expires_at).toLocaleDateString()}</div>
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
          <p style={{ color: '#ccc', marginBottom: '16px', fontSize: '15px' }}>Send your CV directly to the employer</p>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#ffd', border: '1px solid rgba(255,255,255,0.2)' }}>
            📌 Please mention <strong>Jobs in Thailand (www.jobsinthailand.net)</strong> in your application!
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <a href={gmailUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block' }}>
              Apply via Gmail →
            </a>
            <a href={mailtoUrl}
              style={{ background: 'white', color: '#1a1a2e', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block' }}>
              Apply via Email App →
            </a>
          </div>
          <p style={{ color: '#aaa', fontSize: '13px', marginTop: '8px' }}>
            Or email directly: <span style={{ color: 'white', fontWeight: 'bold' }}>{job.email}</span>
          </p>
        </div>
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