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

  // Track banner click
  const trackClick = async (slug: string) => {
    const scope = `banner-${slug}`
    try {
      await supabase.rpc('increment_daily_stat', {
        stat_scope: scope,
        stat_type: 'click'
      })
    } catch (e) {
      console.log('Tracking error:', e)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '40px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>
            School Partner Pages
          </h1>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.6' }}>
            Register your interest directly with a school or agency. Browse their current vacancies and join their private teacher pool — the HR team will contact you when a suitable role opens up.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            Loading schools...
          </div>
        ) : schools.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            No partner schools available yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {schools.map((school) => (
              <Link 
                key={school.id} 
                href={`/schools/${school.slug}`}
                onClick={() => trackClick(school.slug)}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
                >
                  {/* Banner */}
                  <div style={{
                    height: '180px',
                    backgroundImage: school.banner_url ? `url(${school.banner_url})` : 'linear-gradient(135deg, #E85D26 0%, #c94a1a 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      padding: '40px 20px 16px'
                    }}>
                      <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
                        {school.name}
                      </h2>
                      {school.programme && (
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: '4px 0 0' }}>
                          {school.programme}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      📍 {school.location || 'Thailand'}
                    </span>
                    <span style={{
                      background: '#E85D26',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA for schools */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          background: '#fff',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <p style={{ fontSize: '15px', color: '#555', marginBottom: '12px' }}>
            Are you a school looking to join our partner programme?
          </p>
          <Link href="/school-partners" style={{
            color: '#E85D26',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Learn more about School Partner Pages →
          </Link>
        </div>

      </div>
    </main>
  )
}
