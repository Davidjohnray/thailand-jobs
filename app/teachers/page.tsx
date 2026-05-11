'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

const nationalities = [
  'All Nationalities',
  'Filipino', 'British', 'American', 'Canadian', 'Australian', 'South African',
  'Zimbabwean', 'Indian', 'Irish', 'New Zealander', 'Scottish', 'Welsh',
  'French', 'German', 'Dutch', 'Belgian', 'Swiss', 'Spanish', 'Italian',
  'Nigerian', 'Ghanaian', 'Kenyan', 'Ugandan', 'Jamaican', 'Other'
]

const subjectOptions = [
  'English', 'Mathematics', 'Science', 'Social Studies', 'PE', 'Art',
  'Music', 'ICT', 'Drama', 'Phonics', 'IELTS/TOEIC Prep', 'Business English'
]

export default function TeacherDirectoryPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [nationality, setNationality] = useState('All Nationalities')
  const [subject, setSubject] = useState('All Subjects')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', school: '', email: '', phone: '', plan: '1 month — ฿500', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase.from('teachers').select('*').eq('active', true).eq('status', 'approved').order('created_at', { ascending: false })
      .then(({ data }) => { setTeachers(data || []); setFiltered(data || []); setLoading(false) })
  }, [])

  useEffect(() => {
    let result = [...teachers]
    if (nationality !== 'All Nationalities') result = result.filter(t => t.nationality === nationality)
    if (subject !== 'All Subjects') result = result.filter(t => t.subjects?.includes(subject))
    if (search) result = result.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.location?.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [nationality, subject, search, teachers])

  async function submitRequest() {
    if (!form.name || !form.email) return alert('Please fill in your name and email')
    setSending(true)
    await supabase.from('recruiter_requests').insert([{ ...form }])
    setSending(false)
    setSent(true)
    setTimeout(() => { setShowModal(false); setSent(false); setForm({ name: '', school: '', email: '', phone: '', plan: '1 month — ฿500', message: '' }) }, 3000)
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HEADER */}
      <section style={{ background: '#1a1a2e', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px' }}>🎓 Teacher Directory</h1>
        <p style={{ color: '#ccc', fontSize: '16px', margin: '0 0 20px' }}>{filtered.length} teachers seeking positions in Thailand</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setShowModal(true)}
            style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            🏫 Get Recruiter Access
          </button>
          <Link href="/teachers/register"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
            + Post Your CV Free
          </Link>
        </div>
      </section>

      {/* RECRUITER BANNER */}
      <div style={{ background: '#fff3ed', borderBottom: '2px solid #E85D26', padding: '12px 24px', textAlign: 'center' }}>
        <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>🏫 Schools & Recruiters — </span>
        <span style={{ color: '#555', fontSize: '14px' }}>Browse all teacher CVs free. Pay only to unlock contact details. </span>
        <button onClick={() => setShowModal(true)} style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>View pricing →</button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>

        {/* FILTERS */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or location..."
            style={{ flex: 1, minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
          <select value={nationality} onChange={e => setNationality(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
            {nationalities.map(n => <option key={n}>{n}</option>)}
          </select>
          <select value={subject} onChange={e => setSubject(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
            <option>All Subjects</option>
            {subjectOptions.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => { setNationality('All Nationalities'); setSubject('All Subjects'); setSearch('') }}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#666' }}>
            Reset
          </button>
        </div>

        {/* TEACHER GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#666' }}>Loading teachers...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '12px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
            <p>No teachers match your filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filtered.map((teacher: any) => (
              <div key={teacher.id} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', border: '1px solid #eee' }}>
                {/* Top section */}
                <div style={{ background: '#1a1a2e', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {teacher.photo_url ? (
                    <img src={teacher.photo_url} alt={teacher.name}
                      style={{ width: '144px', height: '144px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #E85D26', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '144px', height: '144px', borderRadius: '50%', background: '#E85D26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👤</div>
                  )}
                  <div>
                    <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px' }}>{teacher.name}</h3>
                    <p style={{ color: '#ccc', fontSize: '13px', margin: '0 0 4px' }}>
                      {teacher.nationality}{teacher.age ? ` · ${teacher.age} years old` : ''}
                    </p>
                    <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>📍 {teacher.location}</p>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '16px' }}>
                  {/* Qualifications */}
                  {teacher.qualifications?.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {teacher.qualifications.map((q: string) => (
                          <span key={q} style={{ background: '#e8f0fe', color: '#2D6BE4', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold' }}>{q}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subjects */}
                  {teacher.subjects?.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {teacher.subjects.slice(0, 4).map((s: string) => (
                          <span key={s} style={{ background: '#f0f0f0', color: '#555', fontSize: '11px', padding: '3px 8px', borderRadius: '20px' }}>{s}</span>
                        ))}
                        {teacher.subjects.length > 4 && <span style={{ color: '#888', fontSize: '11px', padding: '3px 0' }}>+{teacher.subjects.length - 4} more</span>}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {teacher.experience_years && (
                    <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px' }}>⭐ {teacher.experience_years} years experience</p>
                  )}

                  {/* Bio snippet */}
                  {teacher.bio && (
                    <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {teacher.bio}
                    </p>
                  )}

                  {/* Video link */}
                  {teacher.video_url && (
                    <a href={teacher.video_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E85D26', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', marginBottom: '12px' }}>
                      ▶ Watch Introduction Video
                    </a>
                  )}

                  {/* Contact — locked */}
                  <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', border: '1px dashed #ddd', textAlign: 'center' }}>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 8px' }}>🔒 Contact details available to recruiters</p>
                    <button onClick={() => setShowModal(true)}
                      style={{ background: '#E85D26', color: 'white', padding: '8px 20px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                      Get Access
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECRUITER ACCESS MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>🏫 Recruiter Access</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>

            {/* Pricing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ border: '2px solid #E85D26', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>1️⃣</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e', marginBottom: '4px' }}>1 Month</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#E85D26' }}>฿500</div>
                <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>Full directory access</div>
              </div>
              <div style={{ border: '2px solid #2D6BE4', borderRadius: '12px', padding: '16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '8px', right: '-12px', background: '#2D6BE4', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 20px', transform: 'rotate(45deg)' }}>SAVE</div>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>3️⃣</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e', marginBottom: '4px' }}>3 Months</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2D6BE4' }}>฿1,400</div>
                <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>Save ฿100</div>
              </div>
            </div>

            <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
              ✅ Unlimited access to all teacher contact details<br/>
              ✅ New teachers added daily<br/>
              ✅ Filter by nationality, subject & location
            </p>

            {sent ? (
              <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '20px', textAlign: 'center', color: '#2e7d32', fontWeight: 'bold', fontSize: '16px' }}>
                ✅ Request sent! We'll contact you within 24 hours.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>Your Details</h3>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name *"
                  style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                <input value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} placeholder="School or company name"
                  style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address *" type="email"
                  style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone / LINE / WhatsApp"
                  style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}
                  style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
                  <option>1 month — ฿500</option>
                  <option>3 months — ฿1,400</option>
                </select>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Any questions or requirements? (optional)" rows={3}
                  style={{ padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                <button onClick={submitRequest} disabled={sending}
                  style={{ background: sending ? '#ccc' : '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: sending ? 'not-allowed' : 'pointer' }}>
                  {sending ? 'Sending...' : '📩 Request Access'}
                </button>
                <p style={{ color: '#888', fontSize: '12px', textAlign: 'center', margin: 0 }}>We'll contact you within 24 hours with payment details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
