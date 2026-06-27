'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = 'thailand2024'

export default function FeaturedTeachersAdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!authed) return
    loadTeachers()
  }, [authed])

  async function loadTeachers() {
    setLoading(true)
    const { data } = await supabase
      .from('teachers')
      .select('id, name, slug, photo_url, nationality, location, subjects, featured, featured_until, status, active')
      .eq('active', true)
      .eq('status', 'approved')
      .order('name', { ascending: true })
    setTeachers(data || [])
    setLoading(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function setFeatured(teacher: any) {
    setSaving(teacher.id)
    const featuredUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await supabase
      .from('teachers')
      .update({ featured: true, featured_until: featuredUntil })
      .eq('id', teacher.id)
    setSaving(null)
    if (!error) {
      showToast(`⭐ ${teacher.name} is now featured until ${new Date(featuredUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`)
      loadTeachers()
    }
  }

  async function removeFeatured(teacher: any) {
    setSaving(teacher.id)
    const { error } = await supabase
      .from('teachers')
      .update({ featured: false, featured_until: null })
      .eq('id', teacher.id)
    setSaving(null)
    if (!error) {
      showToast(`Removed ${teacher.name} from featured`)
      loadTeachers()
    }
  }

  const now = new Date().toISOString()
  const activeFeatured = teachers.filter(t => t.featured && t.featured_until && t.featured_until > now)
  const expiredFeatured = teachers.filter(t => t.featured && (!t.featured_until || t.featured_until <= now))
  const notFeatured = teachers.filter(t => !t.featured)

  const filteredNotFeatured = notFeatured.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.location?.toLowerCase().includes(search.toLowerCase())
  )

  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '360px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⭐</div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>Featured Teachers Admin</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Enter your admin password to continue</p>
          <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { if (pw === ADMIN_PASSWORD) setAuthed(true); else setPwError(true) } }}
            placeholder="Password"
            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: pwError ? '2px solid #ef4444' : '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />
          {pwError && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>Incorrect password</p>}
          <button onClick={() => { if (pw === ADMIN_PASSWORD) setAuthed(true); else setPwError(true) }}
            style={{ width: '100%', background: '#f59e0b', color: '#1a1a2e', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            Login
          </button>
          <Link href="/admin" style={{ display: 'block', marginTop: '16px', color: '#888', fontSize: '13px', textDecoration: 'none' }}>← Back to main admin</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>⭐ Featured Teachers</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{activeFeatured.length} / 12 slots active this week</p>
          </div>
          <Link href="/teachers" target="_blank"
            style={{ background: '#1a1a2e', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
            View Directory →
          </Link>
        </div>

        {/* SLOTS BAR */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>Weekly slots used</span>
            <span style={{ fontWeight: 'bold', color: activeFeatured.length >= 12 ? '#ef4444' : '#16a34a', fontSize: '15px' }}>{activeFeatured.length} / 12</span>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ background: activeFeatured.length >= 12 ? '#ef4444' : '#f59e0b', height: '100%', width: `${(activeFeatured.length / 12) * 100}%`, borderRadius: '8px', transition: 'width 0.3s' }} />
          </div>
          {activeFeatured.length >= 12 && (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: '8px 0 0', fontWeight: 'bold' }}>⚠️ Week is full — remove a slot before adding more</p>
          )}
        </div>

        {/* CURRENTLY FEATURED */}
        {activeFeatured.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Currently Featured</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeFeatured.map(teacher => (
                <div key={teacher.id} style={{ background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', border: '2px solid #f59e0b' }}>
                  {teacher.photo_url ? (
                    <img src={teacher.photo_url} alt={teacher.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>👤</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 2px', fontSize: '15px' }}>{teacher.name}</p>
                    <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{teacher.nationality} · {teacher.location}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '12px', margin: '0 0 6px' }}>
                      ⭐ Until {new Date(teacher.featured_until).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                    <button onClick={() => removeFeatured(teacher)} disabled={saving === teacher.id}
                      style={{ background: '#fee2e2', color: '#ef4444', padding: '6px 14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                      {saving === teacher.id ? '...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPIRED FEATURED — needs cleanup */}
        {expiredFeatured.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444', margin: '0 0 16px' }}>⚠️ Expired Featured (clean up)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {expiredFeatured.map(teacher => (
                <div key={teacher.id} style={{ background: 'white', borderRadius: '10px', padding: '14px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #fee2e2', opacity: 0.8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 2px', fontSize: '14px' }}>{teacher.name}</p>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>Featured slot expired</p>
                  </div>
                  <button onClick={() => removeFeatured(teacher)} disabled={saving === teacher.id}
                    style={{ background: '#fee2e2', color: '#ef4444', padding: '6px 14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                    {saving === teacher.id ? '...' : 'Clear'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD FEATURED */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Add a Featured Teacher</h2>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or location..."
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />

          {loading ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '32px' }}>Loading teachers...</p>
          ) : filteredNotFeatured.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '32px' }}>No teachers found</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredNotFeatured.map(teacher => (
                <div key={teacher.id} style={{ background: 'white', borderRadius: '10px', padding: '14px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {teacher.photo_url ? (
                    <img src={teacher.photo_url} alt={teacher.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>👤</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 2px', fontSize: '14px' }}>{teacher.name}</p>
                    <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{teacher.nationality}{teacher.location ? ` · ${teacher.location}` : ''}</p>
                  </div>
                  <button
                    onClick={() => setFeatured(teacher)}
                    disabled={saving === teacher.id || activeFeatured.length >= 12}
                    style={{
                      background: activeFeatured.length >= 12 ? '#f0f0f0' : '#f59e0b',
                      color: activeFeatured.length >= 12 ? '#aaa' : '#1a1a2e',
                      padding: '8px 18px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '13px',
                      cursor: activeFeatured.length >= 12 ? 'not-allowed' : 'pointer', flexShrink: 0
                    }}>
                    {saving === teacher.id ? '...' : activeFeatured.length >= 12 ? 'Full' : '⭐ Feature'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 9999, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}
    </main>
  )
}
