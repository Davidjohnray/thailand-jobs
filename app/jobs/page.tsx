import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

export default async function JobsPage() {
  const now = new Date().toISOString()

  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('featured', true)
    .gt('expires_at', now)
    .order('created_at', { ascending: false })

  const { data: regularJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('featured', false)
    .gt('expires_at', now)
    .order('created_at', { ascending: false })

  const jobs = [...(featuredJobs || []), ...(regularJobs || [])]

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <section style={{ background: '#1a1a2e', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>All Jobs in Thailand</h1>
        <p style={{ color: '#ccc', fontSize: '16px' }}>{jobs.length} jobs available right now</p>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px' }}>

        <aside style={{ width: '240px', flexShrink: 0 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>Location</h3>
            {['All Locations', 'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Remote'].map(loc => (
              <label key={loc} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#444' }}>
                <input type="radio" name="location" /> {loc}
              </label>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>Category</h3>
            {['All', 'Teaching', 'Hospitality', 'Technology', 'Tourism', 'Education'].map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#444' }}>
                <input type="checkbox" /> {cat}
              </label>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>Job Type</h3>
            {['Full Time', 'Part Time', 'Contract', 'Remote'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#444' }}>
                <input type="checkbox" /> {type}
              </label>
            ))}
          </div>
        </aside>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input type="text" placeholder="Search jobs..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }} />
            <button style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              Search
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.length > 0 ? jobs.map((job: any) => (
              <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: '12px', padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                  border: job.featured ? '2px solid #E85D26' : '1px solid #eee'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a1a2e' }}>{job.title}</span>
                      {job.featured && <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Featured</span>}
                      {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>{job.company} • {job.location}</div>
                    <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
                      Posted: {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <span style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>{job.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>{job.salary}</div>
                    <div style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>{job.job_type}</div>
                  </div>
                </div>
              </Link>
            )) : (
              <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>No jobs found</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}