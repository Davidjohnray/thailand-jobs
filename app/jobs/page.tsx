'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'
import { MemberLockCard, isJobLocked } from '../../components/MemberLock'

const thaiProvinces = [
  'All Locations',
  'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya / Chonburi', 'Koh Samui / Surat Thani',
  'Hua Hin / Prachuap', 'Krabi', 'Rayong', 'Chiang Rai',
  'Nakhon Ratchasima', 'Khon Kaen', 'Udon Thani', 'Ubon Ratchathani',
  'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Ayutthaya',
  'Nakhon Pathom', 'Kanchanaburi', 'Lopburi', 'Saraburi',
  'Phitsanulok', 'Sukhothai', 'Lampang', 'Lamphun', 'Mae Hong Son',
  'Nan', 'Phayao', 'Phrae', 'Uttaradit', 'Tak',
  'Mukdahan', 'Nakhon Phanom', 'Sakon Nakhon', 'Nong Khai',
  'Loei', 'Chaiyaphum', 'Buriram', 'Surin', 'Si Sa Ket',
  'Yasothon', 'Amnat Charoen', 'Roi Et', 'Maha Sarakham',
  'Kalasin', 'Nong Bua Lamphu', 'Songkhla', 'Trang', 'Phatthalung',
  'Satun', 'Yala', 'Narathiwat', 'Nakhon Si Thammarat', 'Phangnga',
  'Ranong', 'Chumphon', 'Prachuap Khiri Khan', 'Samut Sakhon',
  'Samut Songkhram', 'Ratchaburi', 'Phetchaburi', 'Suphan Buri',
  'Sing Buri', 'Ang Thong', 'Chai Nat', 'Nakhon Nayok',
  'Prachin Buri', 'Sa Kaeo', 'Chanthaburi', 'Trat',
  'Chachoengsao', 'Nakhon Sawan', 'Uthai Thani', 'Kamphaeng Phet',
  'Phichit', 'Phetchabun', 'Remote'
]

const allCategories = ['Teaching', 'Hospitality', 'Technology', 'Tourism', 'Finance', 'Marketing', 'Healthcare', 'Creative', 'Other']
const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Remote']

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All Locations')
  const [jobType, setJobType] = useState<string[]>([])
  const [category, setCategory] = useState<string[]>([])
  const [visaOnly, setVisaOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }: any) => setIsLoggedIn(!!session))
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
    setIsLoggedIn(!!session)
  })
  return () => subscription.unsubscribe()
}, [])

  useEffect(() => {
    const fetchJobs = async () => {
      const now = new Date().toISOString()
      const { data: featured } = await supabase.from('jobs').select('*').eq('featured', true).gt('expires_at', now).order('created_at', { ascending: false })
      const { data: regular } = await supabase.from('jobs').select('*').eq('featured', false).gt('expires_at', now).order('created_at', { ascending: false })
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
    if (location !== 'All Locations') result = result.filter(j =>
      j.location?.toLowerCase().trim() === location.toLowerCase().trim()
    )
    if (jobType.length > 0) result = result.filter(j => jobType.includes(j.job_type))
    if (category.length > 0) result = result.filter(j => category.includes(j.category))
    if (visaOnly) result = result.filter(j => j.visa_sponsor)
    setFiltered(result)
  }, [search, location, jobType, category, visaOnly, jobs])

  const toggleJobType = (type: string) => setJobType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  const toggleCategory = (cat: string) => setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  const resetFilters = () => { setLocation('All Locations'); setJobType([]); setCategory([]); setVisaOnly(false); setSearch('') }

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Province / Location</h3>
        <select value={location} onChange={e => setLocation(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
          {thaiProvinces.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Category</h3>
        {allCategories.map(cat => (
          <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#444' }}>
            <input type="checkbox" checked={category.includes(cat)} onChange={() => toggleCategory(cat)} /> {cat}
          </label>
        ))}
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
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>All Jobs in Thailand</h1>
        <p style={{ color: '#ccc', fontSize: '16px' }}>{filtered.length} jobs available right now</p>
      </section>

      {!isLoggedIn && (
        <div style={{ background: '#fff3ed', borderBottom: '2px solid #E85D26', padding: '12px 24px', textAlign: 'center' }}>
          <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>⭐ Members see new jobs 1 hour early! </span>
          <Link href="/account/register" style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>Join free →</Link>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        <button className="mobile-only" onClick={() => setShowFilters(!showFilters)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', marginBottom: '16px', display: 'none' }}>
          {showFilters ? '✕ Hide Filters' : '⚙️ Show Filters'}
        </button>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }} className="mobile-stack">
          <div style={{ width: '240px', flexShrink: 0 }} className={showFilters ? 'mobile-full' : 'mobile-hide-sidebar'}>
            <Sidebar />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }} className="mobile-stack mobile-gap">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }} />
              <button style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading jobs...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filtered.length > 0 ? filtered.map((job: any) => (
                  !isLoggedIn && isJobLocked(job.created_at) ? (
                    <MemberLockCard key={job.id} job={job} />
                  ) : (
                    <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', border: job.featured ? '2px solid #E85D26' : '1px solid #eee' }}>
                        <div className="job-card-inner" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e' }}>{job.title}</span>
                              {job.featured && <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Featured</span>}
                              {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>}
                              {isLoggedIn && isJobLocked(job.created_at) && <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Early Access</span>}
                            </div>
                            <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>{job.company} • {job.location}</div>
                            <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
                              Posted: {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <span style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>{job.category}</span>
                          </div>
                          <div className="job-card-right" style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>{job.salary}</div>
                            <div style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>{job.job_type}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                )) : (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#666', background: 'white', borderRadius: '12px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                    <p style={{ marginBottom: '12px' }}>No jobs match your filters</p>
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