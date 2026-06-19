'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../src/lib/supabase'

interface School {
  id: string
  name: string
  slug: string
  programme: string
  dashboard_password: string
}

interface Registration {
  id: string
  full_name: string
  nationality: string
  subjects: string
  qualifications: string
  experience: string
  available_from: string
  email: string
  whatsapp: string
  line_id: string
  photo_url: string
  video_url: string
  about: string
  shortlisted: boolean
  created_at: string
}

export default function SchoolDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('')
  const [school, setSchool] = useState<School | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filtered, setFiltered] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<Registration | null>(null)
  const [filterSubject, setFilterSubject] = useState('')
  const [filterNationality, setFilterNationality] = useState('')
  const [filterShortlisted, setFilterShortlisted] = useState(false)

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [])

  useEffect(() => {
    if (!slug) return
    const fetchSchool = async () => {
      const { data } = await supabase
        .from('schools')
        .select('id, name, slug, programme, dashboard_password')
        .eq('slug', slug)
        .single()
      if (data) setSchool(data)
      setLoading(false)
    }
    fetchSchool()
  }, [slug])

  const handleLogin = () => {
    if (!school) return
    if (password === school.dashboard_password) {
      setAuthed(true)
      fetchRegistrations(school.id)
    } else {
      setPasswordError('Incorrect password. Please try again.')
    }
  }

  const fetchRegistrations = async (schoolId: string) => {
    const { data } = await supabase
      .from('school_registrations')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
    if (data) {
      setRegistrations(data)
      setFiltered(data)
    }
  }

  useEffect(() => {
    let results = [...registrations]
    if (filterSubject) results = results.filter(r => r.subjects.toLowerCase().includes(filterSubject.toLowerCase()))
    if (filterNationality) results = results.filter(r => r.nationality === filterNationality)
    if (filterShortlisted) results = results.filter(r => r.shortlisted)
    setFiltered(results)
  }, [filterSubject, filterNationality, filterShortlisted, registrations])

  const toggleShortlist = async (id: string, current: boolean) => {
    await supabase.from('school_registrations').update({ shortlisted: !current }).eq('id', id)
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, shortlisted: !current } : r))
    if (selectedTeacher?.id === id) setSelectedTeacher(prev => prev ? { ...prev, shortlisted: !current } : null)
  }

  const nationalities = [...new Set(registrations.map(r => r.nationality))].sort()

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      Loading...
    </main>
  )

  // Password gate
  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e8e8e8', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔒</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '6px' }}>{school?.name}</div>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>Private teacher pool dashboard</div>
        <input
          type="password"
          placeholder="Enter dashboard password"
          value={password}
          onChange={e => { setPassword(e.target.value); setPasswordError('') }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', outline: 'none' }}
        />
        {passwordError && <div style={{ color: '#c0392b', fontSize: '13px', marginBottom: '12px' }}>{passwordError}</div>}
        <button
          onClick={handleLogin}
          style={{ background: '#1a5c3a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
        >
          Enter dashboard
        </button>
        <div style={{ marginTop: '16px' }}>
          <Link href={`/schools/${slug}`} style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>← Back to school page</Link>
        </div>
      </div>
    </main>
  )

  // Teacher detail view
  if (selectedTeacher) return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <button onClick={() => setSelectedTeacher(null)} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#888', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>
          ← Back to teacher pool
        </button>
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e8e8e8', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>{selectedTeacher.full_name}</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>{selectedTeacher.nationality} · {selectedTeacher.subjects}</div>
            </div>
            <button
              onClick={() => toggleShortlist(selectedTeacher.id, selectedTeacher.shortlisted)}
              style={{
                background: selectedTeacher.shortlisted ? '#1a5c3a' : 'white',
                color: selectedTeacher.shortlisted ? 'white' : '#1a5c3a',
                border: '1px solid #1a5c3a', padding: '8px 16px',
                borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              {selectedTeacher.shortlisted ? '★ Shortlisted' : '☆ Shortlist'}
            </button>
          </div>

          {selectedTeacher.photo_url && (
            <img src={selectedTeacher.photo_url} alt={selectedTeacher.full_name}
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginBottom: '20px', border: '3px solid #e8e8e8' }} />
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Qualifications', value: selectedTeacher.qualifications },
              { label: 'Experience', value: selectedTeacher.experience },
              { label: 'Available from', value: selectedTeacher.available_from },
              { label: 'Nationality', value: selectedTeacher.nationality },
            ].map(item => (
              <div key={item.label} style={{ background: '#f8f8f6', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>About</div>
            <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.7' }}>{selectedTeacher.about}</p>
          </div>

          {selectedTeacher.video_url && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Introduction video</div>
              <a href={selectedTeacher.video_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', background: '#E85D26', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                ▶ Watch video
              </a>
            </div>
          )}

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '12px' }}>Contact</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href={`mailto:${selectedTeacher.email}`}
                style={{ background: '#E85D26', color: 'white', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                📧 Email
              </a>
              {selectedTeacher.whatsapp && (
                <a href={`https://wa.me/${selectedTeacher.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#25D366', color: 'white', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                  💬 WhatsApp
                </a>
              )}
              {selectedTeacher.line_id && (
                <a href={`https://line.me/ti/p/~${selectedTeacher.line_id}`} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#06C755', color: 'white', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                  💬 LINE
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )

  // Main dashboard
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>Teacher pool</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>{school?.name} · Private dashboard</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '12px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a5c3a' }}>{registrations.length}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Total</div>
            </div>
            <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '12px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a5c3a' }}>{registrations.filter(r => r.shortlisted).length}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Shortlisted</div>
            </div>
            <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '12px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a5c3a' }}>
                {registrations.filter(r => new Date(r.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>This month</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Filter by subject..."
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            style={{ padding: '9px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', flex: '1', minWidth: '160px' }}
          />
          <select
            value={filterNationality}
            onChange={e => setFilterNationality(e.target.value)}
            style={{ padding: '9px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', flex: '1', minWidth: '160px' }}
          >
            <option value="">All nationalities</option>
            {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button
            onClick={() => setFilterShortlisted(!filterShortlisted)}
            style={{
              padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer',
              background: filterShortlisted ? '#1a5c3a' : 'white',
              color: filterShortlisted ? 'white' : '#1a5c3a',
              border: '1px solid #1a5c3a'
            }}
          >
            ★ Shortlisted only
          </button>
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '40px', textAlign: 'center', color: '#888' }}>
            No teachers found matching your filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((teacher) => (
              <div key={teacher.id} style={{
                background: 'white', borderRadius: '12px',
                border: `1px solid ${teacher.shortlisted ? '#1a5c3a' : '#e8e8e8'}`,
                padding: '16px 18px',
                display: 'flex', gap: '14px', alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                  background: '#d4edda', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 'bold', color: '#1a5c3a'
                }}>
                  {teacher.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a1a' }}>{teacher.full_name}</div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                    {teacher.nationality} · {teacher.subjects} · Available {teacher.available_from}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    <span style={{ background: '#E6F1FB', color: '#185FA5', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>
                      {teacher.qualifications.split(',')[0].trim()}
                    </span>
                    <span style={{ background: '#d4edda', color: '#1a5c3a', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>
                      {teacher.experience}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => setSelectedTeacher(teacher)}
                    style={{ background: '#1a5c3a', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    View profile
                  </button>
                  <button
                    onClick={() => toggleShortlist(teacher.id, teacher.shortlisted)}
                    style={{
                      background: teacher.shortlisted ? '#faeeda' : 'white',
                      color: teacher.shortlisted ? '#854F0B' : '#888',
                      border: '1px solid #e8e8e8', padding: '7px 14px',
                      borderRadius: '7px', fontSize: '12px', cursor: 'pointer'
                    }}
                  >
                    {teacher.shortlisted ? '★ Shortlisted' : '☆ Shortlist'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
