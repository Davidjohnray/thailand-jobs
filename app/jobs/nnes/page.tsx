'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'
import { MemberLockCard, isJobLocked, useAccessTier } from '../../../components/MemberLock'
import LocationFilter, { ALL_LOCATIONS, matchesLocation } from '../../../components/LocationFilter'

const NNES_LOGO = 'https://coldsoilakctfcswqwge.supabase.co/storage/v1/object/public/partner-cvs/nnes-global-logo.png'

function JobLogo({ job }: { job: any }) {
  if (!job.source_logo) return null
  return (
    <img src={job.source_logo} alt="Posted by"
      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee', flexShrink: 0 }} />
  )
}

const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Remote']

export default function NNESJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState(ALL_LOCATIONS)
  const [jobType, setJobType] = useState<string[]>([])
  const [visaOnly, setVisaOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const tier = useAccessTier()

  useEffect(() => {
    const fetchJobs = async () => {
      const now = new Date().toISOString()
      const { data: featured } = await supabase.from('jobs').select('*')
        .eq('source_logo', NNES_LOGO).eq('featured', true).gt('expires_at', now)
        .order('created_at', { ascending: false })
      const { data: regular } = await supabase.from('jobs').select('*')
        .eq('source_logo', NNES_LOGO).eq('featured', false).gt('expires_at', now)
        .order('created_at', { ascending: false })
      const all = [...(featured || []), ...(regular || [])]
      setJobs(all)
      setFiltered(all)
      setLoading(false)
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    let result = [...jobs]
    if (search) result = result.filter(j =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase())
    )
    result = result.filter(j => matchesLocation(j.location, location))
    if (jobType.length > 0) result = result.filter(j => jobType.includes(j.job_type))
    if (visaOnly) result = result.filter(j => j.visa_sponsor)
    setFiltered(result)
  }, [search, location, jobType, visaOnly, jobs])

  const toggleJobType = (type: string) => setJobType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  const resetFilters = () => { setLocation(ALL_LOCATIONS); setJobType([]); setVisaOnly(false); setSearch('') }

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Province / Location</h3>
        <LocationFilter value={location} onChange={setLocation} />
      </div>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Job Type</h3>
        {jobTypes.map(type => (
          <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#444' }}>
            <input type="checkbox" checked={jobType.includes(type)} onChange={() => toggleJobType(type)} /> {type}
          </label>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Requirements</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#444' }}>
          <input type="checkbox" checked={visaOnly} onChange={e => setVisaOnly(e.target.checked)} /> Visa Sponsored Only
        </label>
      </div>
      <button onClick={resetFilters}
        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#666' }}>
        Reset Filters
      </button>
    </div>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <section style={{ background: '#1a1a2e', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
          <img src={NNES_LOGO} alt="NNES Jobs" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid #E85D26', objectFit: 'cover' }} />
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>NNES Teacher Jobs in Thailand</h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: '0 0 8px' }}>{filtered.length} jobs open to Non-Native English Speaking teachers</p>
      </section>

      {tier === 'public' && (
        <div style={{ background: '#fff3ed', borderBottom: '2px solid #E85D26', padding: '12px 24px', textAlign: 'center' }}>
          <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>⭐ Free members see new jobs 1 hour sooner, Supporters see them instantly! </span>
          <Link href="/account/register" style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>Join free →</Link>
        </div>
      )}
      {tier === 'member' && (
        <div style={{ background: '#fff3ed', borderBottom: '2px solid #E85D26', padding: '12px 24px', textAlign: 'center' }}>
          <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>⭐ Supporters see new jobs the moment they're posted. </span>
          <Link href="/supporters" style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>Become a Supporter →</Link>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🌏</span>
          <p style={{ color: '#1a1a2e', fontSize: '14px', margin: 0 }}>
            These jobs welcome applications from <strong>Non-Native English Speaking (NNES) teachers</strong> — including teachers from Africa, Europe, India, South America and beyond.
          </p>
        </div>

        <button className="mobile-only" onClick={() => setShowFilters(!showFilters)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', marginBottom: '16px', display: 'none' }}>
          {showFilters ? '✕ Hide Filters' : '⚙️ Show Filters'}
        </button>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }} className="mobile-stack">
          <div style={{ width: '240px', flexShrink: 0 }} className={showFilters ? 'mobile-full' : 'mobile-hide-sidebar'}>
            {Sidebar()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }} className="mobile-stack mobile-gap">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search NNES teacher jobs..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }} />
              <button style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading jobs...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filtered.length > 0 ? filtered.map((job: any) => (
                  isJobLocked(job.created_at, tier) ? (
                    <MemberLockCard key={job.id} job={job} tier={tier} />
                  ) : (
                    <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', border: job.featured ? '2px solid #E85D26' : '1px solid #eee' }}>
                        <div className="job-card-inner" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <JobLogo job={job} />
                              <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e' }}>{job.title}</span>
                              {job.featured && <span style={{ background: '#E85D26', color: 'white', fontSize: '10px', padding: '2px 7px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Featured</span>}
                              {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '10px', padding: '2px 7px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>}
                              {tier !== 'public' && isJobLocked(job.created_at) && <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '10px', padding: '2px 7px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Early Access</span>}
                              <span style={{ background: '#e8f0fe', color: '#1a1a2e', fontSize: '10px', padding: '2px 7px', borderRadius: '20px', fontWeight: 'bold' }}>🌏 NNES Welcome</span>
                            </div>
                            <div style={{ color: '#666', fontSize: '13px', marginBottom: '2px' }}>{job.company} • {job.location}</div>
                            <div style={{ color: '#999', fontSize: '12px', marginBottom: '6px' }}>
                              Posted: {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '11px', padding: '3px 8px', borderRadius: '20px' }}>{job.category}</span>
                          </div>
                          <div className="job-card-right" style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>{job.salary}</div>
                            <div style={{ background: '#f0f0f0', color: '#555', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', display: 'inline-block' }}>{job.job_type}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                )) : (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#666', background: 'white', borderRadius: '12px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌏</div>
                    <p style={{ marginBottom: '12px' }}>No NNES teacher jobs match your filters</p>
                    <button onClick={resetFilters} style={{ color: '#E85D26', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                      Clear filters →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}