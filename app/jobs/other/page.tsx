'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

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

const otherCategories = ['Hospitality', 'Technology', 'Tourism', 'Finance', 'Marketing', 'Healthcare', 'Creative', 'Other']
const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Remote']

export default function OtherJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All Locations')
  const [jobType, setJobType] = useState<string[]>([])
  const [category, setCategory] = useState<string[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      const now = new Date().toISOString()
      const { data: featured } = await supabase.from('jobs').select('*').eq('featured', true).in('category', otherCategories).gt('expires_at', now).order('created_at', { ascending: false })
      const { data: regular } = await supabase.from('jobs').select('*').eq('featured', false).in('category', otherCategories).gt('expires_at', now).order('created_at', { ascending: false })
      const all = [...(featured || []), ...(regular || [])]
      setJobs(all)
      setFiltered(all)
      setLoading(false)
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    let result = [...jobs]
    if (search) result = result.filter(j => j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase()))
    if (location !== 'All Locations') result = result.filter(j => j.location === location)
    if (jobType.length > 0) result = result.filter(j => jobType.includes(j.job_type))
    if (category.length > 0) result = result.filter(j => category.includes(j.category))
    setFiltered(result)
  }, [search, location, jobType, category, jobs])

  const toggleJobType = (type: string) => setJobType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  const toggleCategory = (cat: string) => setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <section style={{ background: '#1a1a2e', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>💼</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Other Jobs in Thailand</h1>
        <p style={{ color: '#ccc', fontSize: '16px' }}>{filtered.length} jobs available</p>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px' }}>

        <aside style={{ width: '240px', flexShrink: 0 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>Province / Location</h3>
            <select value={location} onChange={e => setLocation(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
              {thaiProvinces.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>Category</h3>
            {otherCategories.map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#444' }}>
                <input type="checkbox" checked={category.includes(cat)} onChange={() => toggleCategory(cat)} /> {cat}
              </label>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>Job Type</h3>
            {jobTypes.map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#444' }}>
                <input type="checkbox" checked={jobType.includes(type)} onChange={() => toggleJobType(type)} /> {type}
              </label>
            ))}
          </div>

          <button onClick={() => { setLocation('All Locations'); setJobType([]); setCategory([]); setSearch('') }}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#666' }}>
            Reset Filters
          </button>
        </aside>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }} />
            <button style={{ background: '#2D6BE4', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              Search
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading jobs...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.length > 0 ? filtered.map((job: any) => (
                <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: job.featured ? '2px solid #2D6BE4' : '1px solid #eee' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a1a2e' }}>{job.title}</span>
                        {job.featured && <span style={{ background: '#2D6BE4', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Featured</span>}
                        {job.visa_sponsor && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Visa</span>}
                      </div>
                      <div style={{ color: '#666', fontSize: '14px', marginBottom: '2px' }}>{job.company} • {job.location}</div>
                      <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
                        Posted: {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <span style={{ background: '#e8f0fe', color: '#2D6BE4', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>💼 {job.category}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#2D6BE4', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>{job.salary}</div>
                      <div style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', display: 'inline-block' }}>{job.job_type}</div>
                    </div>
                  </div>
                </Link>
              )) : (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666', background: 'white', borderRadius: '12px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
                  <p style={{ fontSize: '18px', marginBottom: '16px' }}>No jobs match your filters</p>
                  <button onClick={() => { setLocation('All Locations'); setJobType([]); setCategory([]); setSearch('') }}
                    style={{ color: '#2D6BE4', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                    Clear filters →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}