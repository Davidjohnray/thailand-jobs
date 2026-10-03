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
      // Fallback to direct insert
      await supabase.from('daily_stats').upsert({
        scope: scope,
        stat_date: new Date().toISOString().split('T')[0],
        clicks: 1
      }, { onConflict: 'scope,stat_date' })
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '40px 16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>
            School Partner Pages
          </h1>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
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
                  cursor: 'pointer',
                  height: '100%'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
                >
                  {/* Banner Image */}
                  <div style={{
                    height: '200px',
                    backgroundImage: school.banner_url ? `url(${school.banner_url})` : 'linear-gradient(135deg, #E85D26 0%, #c94a1a 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />

                  {/* Card Content */}
                  <div style={{ padding: '20px' }}>
                    <h2 style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: '#1a1a1a', 
                      marginBottom: '6px' 
                    }}>
                      {school.name}
                    </h2>
                    
                    {school.programme && (
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#666', 
                        marginBottom: '12px' 
                      }}>
                        {school.programme}
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px', color: '#888' }}>
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
