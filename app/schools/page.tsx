'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

interface School {
  id: string
  name: string
  slug: string
  programme: string
  location: string
  banner_url: string
  website_url: string
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchools = async () => {
      const { data } = await supabase
        .from('schools')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: true })
      if (data) setSchools(data)
      setLoading(false)
    }
    fetchSchools()
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '40px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>
            School Partner Pages
          </h1>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.6' }}>
            Register your interest directly with a school. Browse their current vacancies and join their private teacher pool — the HR team will contact you when a suitable role opens up.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading schools...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
            {schools.map((school) => (
              <Link key={school.id} href={`/schools/${school.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e8e8', cursor: 'pointer' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#ccc'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#e8e8e8'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                  }}
                >
                  <div style={{ position: 'relative', height: '130px', overflow: 'hidden' }}>
                    {school.banner_url ? (
                      <img src={school.banner_url} alt={school.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#1a5c3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: '15px', fontWeight: 'bold' }}>{school.name}</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#22c55e', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' }}>
                      Hiring
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '3px' }}>{school.name}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                      {school.programme && `${school.programme} · `}{school.location}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ background: '#1a5c3a', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '6px' }}>
                        View page →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Your school here */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1.5px dashed #d0d0d0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏫</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#888', marginBottom: '6px' }}>Your school here</div>
              <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '16px' }}>Get your own branded recruitment page and private teacher pool</div>
              <a href="mailto:david@jobsinthailand.net" style={{ background: '#E85D26', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none' }}>
                Get in touch
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
