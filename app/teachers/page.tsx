'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const nationalities = [
  'All Nationalities',
  'Filipino', 'Indonesian', 'Malaysian', 'Singaporean', 'Thai', 'Vietnamese',
  'Cambodian', 'Burmese', 'Laotian', 'Bruneian', 'Timorese',
  'Chinese', 'Japanese', 'Korean', 'Taiwanese', 'Mongolian',
  'Indian', 'Pakistani', 'Sri Lankan', 'Bangladeshi', 'Nepali',
  'Bhutanese', 'Maldivian', 'Afghan',
  'British', 'American', 'Canadian', 'Australian', 'New Zealander',
  'Irish', 'Scottish', 'Welsh',
  'Nigerian', 'Ghanaian', 'Ivorian', 'Senegalese', 'Malian',
  'Beninese', 'Burkinabe', 'Togolese', 'Guinean', 'Sierra Leonean',
  'Liberian', 'Gambian', 'Cape Verdean', 'Mauritanian', 'Nigerien',
  'Kenyan', 'Tanzanian', 'Ugandan', 'Ethiopian', 'Rwandan',
  'Burundian', 'Somali', 'Djiboutian', 'Eritrean', 'South Sudanese', 'Sudanese',
  'Cameroonian', 'Congolese', 'Gabonese', 'Equatoguinean', 'Central African', 'Chadian',
  'South African', 'Zimbabwean', 'Zambian', 'Mozambican', 'Malawian',
  'Botswanan', 'Namibian', 'Swazi', 'Lesothan', 'Angolan',
  'Egyptian', 'Moroccan', 'Algerian', 'Tunisian', 'Libyan',
  'Malagasy', 'Mauritian', 'Seychellois', 'Comorian',
  'Brazilian', 'Argentinian', 'Colombian', 'Chilean', 'Peruvian',
  'Venezuelan', 'Ecuadorian', 'Bolivian', 'Paraguayan', 'Uruguayan', 'Guyanese', 'Surinamese',
  'Mexican', 'Jamaican', 'Trinidadian', 'Barbadian', 'Bahamian',
  'Haitian', 'Dominican', 'Cuban', 'Puerto Rican', 'Belizean',
  'Guatemalan', 'Honduran', 'Salvadoran', 'Nicaraguan', 'Costa Rican', 'Panamanian',
  'Lebanese', 'Jordanian', 'Syrian', 'Iraqi', 'Israeli',
  'Palestinian', 'Saudi', 'Emirati', 'Qatari', 'Kuwaiti',
  'Bahraini', 'Omani', 'Yemeni', 'Iranian', 'Turkish',
  'French', 'German', 'Dutch', 'Belgian', 'Swiss', 'Spanish', 'Italian',
  'Portuguese', 'Austrian', 'Luxembourgish',
  'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Icelandic',
  'Estonian', 'Latvian', 'Lithuanian',
  'Russian', 'Ukrainian', 'Polish', 'Romanian', 'Hungarian',
  'Czech', 'Slovak', 'Bulgarian', 'Belarusian', 'Moldovan',
  'Greek', 'Croatian', 'Serbian', 'Slovenian', 'Bosnian',
  'Macedonian', 'Albanian', 'Montenegrin', 'Maltese',
  'Kazakh', 'Uzbek', 'Kyrgyz', 'Tajik', 'Turkmen',
  'Azerbaijani', 'Georgian', 'Armenian',
  'Papua New Guinean', 'Samoan', 'Tongan', 'Fijian', 'Vanuatuan',
  'Other'
]

const subjectOptions = [
  'English', 'Mathematics', 'Science', 'Social Studies', 'PE', 'Art',
  'Music', 'ICT', 'Drama', 'Phonics', 'IELTS/TOEIC Prep', 'Business English'
]

function FeaturedCarousel({ teachers }: { teachers: any[] }) {
  const MAX_SLOTS = 12
  const filledSlots = teachers.length
  const emptySlots = MAX_SLOTS - filledSlots
  const placeholders = Array.from({ length: emptySlots }, (_, i) => ({ _placeholder: true, _id: `placeholder-${i}` }))
  const allItems: any[] = [...teachers, ...placeholders]
  // Duplicate for seamless infinite loop
  const loopItems = [...allItems, ...allItems]

  const cardWidth = 300
  const cardGap = 16
  const scrollSpeed = 40 // seconds for one full loop

  function renderCard(item: any, key: string) {
    if (item._placeholder) {
      return (
        <Link key={key} href="/teachers/featured" style={{ textDecoration: 'none', flexShrink: 0, width: `${cardWidth}px` }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '2px dashed rgba(245,158,11,0.3)', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px dashed rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>⭐</div>
            <div>
              <p style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '14px', margin: '0 0 6px' }}>Featured Slot Available</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '0 0 14px', lineHeight: '1.5' }}>Get your profile seen first by schools & recruiters</p>
              <span style={{ background: '#f59e0b', color: '#1a1a2e', padding: '7px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>฿50 / week — Contact Us</span>
            </div>
          </div>
        </Link>
      )
    }
    return (
      <div key={key} style={{ flexShrink: 0, width: `${cardWidth}px`, background: 'rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(245,158,11,0.3)' }}>
        <div style={{ position: 'relative', height: '160px', background: '#0d0d1a', overflow: 'hidden' }}>
          {item.photo_url ? (
            <img src={item.photo_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>👤</div>
          )}
          <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#f59e0b', color: '#1a1a2e', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '20px' }}>⭐ FEATURED</div>
        </div>
        <div style={{ padding: '14px' }}>
          <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
          <p style={{ color: '#ccc', fontSize: '12px', margin: '0 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.nationality}{item.location ? ` · 📍 ${item.location}` : ''}</p>
          {item.subjects?.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {item.subjects.slice(0, 3).map((s: string) => (
                <span key={s} style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '10px', padding: '2px 7px', borderRadius: '20px' }}>{s}</span>
              ))}
            </div>
          )}
          <Link href={`/teachers/${item.slug}`}
            style={{ display: 'block', textAlign: 'center', background: '#f59e0b', color: '#1a1a2e', padding: '7px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none' }}>
            View Profile →
          </Link>
        </div>
      </div>
    )
  }

  const totalWidth = allItems.length * (cardWidth + cardGap)

  return (
    <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', padding: '24px 0 28px', borderBottom: '3px solid #f59e0b' }}>
      <style>{`
        @keyframes featuredScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${totalWidth}px); }
        }
        .featured-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 18px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⭐</span>
          <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '18px' }}>Featured Teachers</span>
          <span style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.4)' }}>
            {filledSlots} / {MAX_SLOTS} slots filled this week
          </span>
        </div>
        <Link href="/teachers/featured"
          style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #f59e0b', padding: '6px 14px', borderRadius: '6px' }}>
          ⭐ Get Featured →
        </Link>
      </div>

      {/* Scrolling track */}
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div
          className="featured-track"
          style={{
            display: 'flex',
            gap: `${cardGap}px`,
            paddingLeft: `${cardGap}px`,
            width: 'max-content',
            animation: `featuredScroll ${scrollSpeed}s linear infinite`,
          }}>
          {loopItems.map((item, i) => renderCard(item, `${item._id ?? item.id}-${i}`))}
        </div>
      </div>
    </div>
  )
}

export default function TeacherDirectoryPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [featured, setFeatured] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [nationality, setNationality] = useState('All Nationalities')
  const [subject, setSubject] = useState('All Subjects')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', school: '', email: '', phone: '', plan: '1 month — ฿500', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const [recruiterEmail, setRecruiterEmail] = useState('')
  const [recruiterInput, setRecruiterInput] = useState('')
  const [checkingAccess, setCheckingAccess] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const [accessExpiry, setAccessExpiry] = useState('')
  const [showAccessForm, setShowAccessForm] = useState(false)
  const hasAccess = !!recruiterEmail

  useEffect(() => {
    const saved = sessionStorage.getItem('recruiter_email')
    if (saved) setRecruiterEmail(saved)
  }, [])

  useEffect(() => {
    const now = new Date().toISOString()
    // Load all approved teachers
    supabase.from('teachers').select('*').eq('active', true).eq('status', 'approved').order('created_at', { ascending: false })
      .then(({ data }) => {
        const all = data || []
        // Split featured (active + not expired) from regular
        const featuredNow = all.filter(t => t.featured && t.featured_until && t.featured_until > now)
        const regular = all.filter(t => !(t.featured && t.featured_until && t.featured_until > now))
        setFeatured(featuredNow)
        setTeachers(regular)
        setFiltered(regular)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = [...teachers]
    if (nationality !== 'All Nationalities') result = result.filter(t => t.nationality === nationality)
    if (subject !== 'All Subjects') result = result.filter(t => t.subjects?.includes(subject))
    if (search) result = result.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.location?.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [nationality, subject, search, teachers])

  async function checkAccess() {
    if (!recruiterInput.trim()) return
    setCheckingAccess(true)
    setAccessDenied(false)
    const now = new Date().toISOString()
    const { data } = await supabase.from('recruiter_access').select('*').eq('email', recruiterInput.trim().toLowerCase()).gt('expires_at', now).single()
    setCheckingAccess(false)
    if (data) {
      setRecruiterEmail(recruiterInput.trim().toLowerCase())
      sessionStorage.setItem('recruiter_email', recruiterInput.trim().toLowerCase())
      setAccessExpiry(new Date(data.expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))
      setShowAccessForm(false)
    } else {
      setAccessDenied(true)
    }
  }

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

      <section style={{ background: '#1a1a2e', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px' }}>🎓 Teacher Directory</h1>
        <p style={{ color: '#ccc', fontSize: '16px', margin: '0 0 20px' }}>{teachers.length + featured.length} teachers seeking positions in Thailand</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {hasAccess ? (
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '14px' }}>✅ Recruiter Access Active</span>
              {accessExpiry && <span style={{ color: '#ccc', fontSize: '12px' }}>until {accessExpiry}</span>}
              <button onClick={() => { setRecruiterEmail(''); sessionStorage.removeItem('recruiter_email') }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '12px' }}>Sign out</button>
            </div>
          ) : (
            <button onClick={() => setShowAccessForm(true)}
              style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
              🏫 Recruiter Login
            </button>
          )}
          <button onClick={() => setShowModal(true)}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            💳 Get Recruiter Access
          </button>
          <Link href="/teachers/register"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
            + Post Your CV Free
          </Link>
          <Link href="/teachers/featured"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', border: '1px solid rgba(245,158,11,0.4)' }}>
            ⭐ Get Featured
          </Link>
        </div>
      </section>

      {!hasAccess && (
        <div style={{ background: '#fff3ed', borderBottom: '2px solid #E85D26', padding: '12px 24px', textAlign: 'center' }}>
          <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>🏫 Schools & Recruiters — </span>
          <span style={{ color: '#555', fontSize: '14px' }}>Browse all teacher CVs free. Pay to unlock contact details & intro videos. </span>
          <button onClick={() => setShowModal(true)} style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>View pricing →</button>
        </div>
      )}

      {/* FEATURED CAROUSEL — always visible */}
      <FeaturedCarousel teachers={featured} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
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
                <div style={{ background: '#1a1a2e', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {teacher.photo_url ? (
                    <img src={teacher.photo_url} alt={teacher.name}
                      style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #E85D26', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#E85D26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👤</div>
                  )}
                  <div>
                    <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px' }}>{teacher.name}</h3>
                    <p style={{ color: '#ccc', fontSize: '13px', margin: '0 0 4px' }}>{teacher.nationality}{teacher.age ? ` · ${teacher.age} years old` : ''}</p>
                    <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>📍 {teacher.location}</p>
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  {teacher.qualifications?.length > 0 && (
                    <div style={{ marginBottom: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {teacher.qualifications.map((q: string) => (
                        <span key={q} style={{ background: '#e8f0fe', color: '#2D6BE4', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold' }}>{q}</span>
                      ))}
                    </div>
                  )}
                  {teacher.subjects?.length > 0 && (
                    <div style={{ marginBottom: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {teacher.subjects.slice(0, 4).map((s: string) => (
                        <span key={s} style={{ background: '#f0f0f0', color: '#555', fontSize: '11px', padding: '3px 8px', borderRadius: '20px' }}>{s}</span>
                      ))}
                      {teacher.subjects.length > 4 && <span style={{ color: '#888', fontSize: '11px', padding: '3px 0' }}>+{teacher.subjects.length - 4} more</span>}
                    </div>
                  )}
                  {teacher.experience_years && (
                    <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px' }}>⭐ {teacher.experience_years} years experience</p>
                  )}
                  {teacher.bio && (
                    <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {teacher.bio}
                    </p>
                  )}
                  {hasAccess ? (
                    <div style={{ background: '#e8f5e9', borderRadius: '8px', padding: '12px', border: '1px solid #c8e6c9' }}>
                      <p style={{ color: '#2e7d32', fontSize: '12px', fontWeight: 'bold', margin: '0 0 8px' }}>✅ Contact Details</p>
                      {teacher.email && <p style={{ color: '#444', fontSize: '13px', margin: '0 0 4px' }}>📧 {teacher.email}</p>}
                      {teacher.phone && <p style={{ color: '#444', fontSize: '13px', margin: '0 0 4px' }}>📞 {teacher.phone}</p>}
                      {teacher.line_id && <p style={{ color: '#444', fontSize: '13px', margin: '0 0 4px' }}>💬 LINE: {teacher.line_id}</p>}
                      {teacher.video_url && (
                        <a href={teacher.video_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2e7d32', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', marginTop: '6px' }}>
                          ▶ Watch Introduction Video
                        </a>
                      )}
                    </div>
                  ) : (
                    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', border: '1px dashed #ddd', textAlign: 'center' }}>
                      <p style={{ color: '#888', fontSize: '13px', margin: '0 0 4px' }}>🔒 Contact details & intro video</p>
                      <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 10px' }}>Available to recruiters only</p>
                      <button onClick={() => setShowAccessForm(true)}
                        style={{ background: '#E85D26', color: 'white', padding: '8px 20px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                        Get Access
                      </button>
                    </div>
                  )}
                  <Link href={`/teachers/${teacher.slug}`}
                    style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: '#2D6BE4', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
                    View Full Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECRUITER LOGIN MODAL */}
      {showAccessForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '420px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>🏫 Recruiter Login</h2>
              <button onClick={() => { setShowAccessForm(false); setAccessDenied(false) }} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>Enter the email address you used when you purchased recruiter access.</p>
            <input value={recruiterInput} onChange={e => { setRecruiterInput(e.target.value); setAccessDenied(false) }}
              onKeyDown={e => e.key === 'Enter' && checkAccess()}
              placeholder="your@email.com" type="email"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: accessDenied ? '2px solid #ef4444' : '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />
            {accessDenied && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>❌ No active access found for this email. <button onClick={() => { setShowAccessForm(false); setShowModal(true) }} style={{ background: 'none', border: 'none', color: '#E85D26', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', fontSize: '13px' }}>Get access →</button></p>}
            <button onClick={checkAccess} disabled={checkingAccess}
              style={{ width: '100%', background: checkingAccess ? '#ccc' : '#E85D26', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: checkingAccess ? 'not-allowed' : 'pointer' }}>
              {checkingAccess ? 'Checking...' : '🔓 Access Contact Details'}
            </button>
            <p style={{ color: '#888', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
              Don't have access? <button onClick={() => { setShowAccessForm(false); setShowModal(true) }} style={{ background: 'none', border: 'none', color: '#E85D26', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Get it here →</button>
            </p>
          </div>
        </div>
      )}

      {/* GET ACCESS MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>🏫 Get Recruiter Access</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
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
              ✅ Unlimited access to all teacher contact details<br />
              ✅ Watch teacher introduction videos<br />
              ✅ New teachers added daily<br />
              ✅ Filter by nationality, subject & location
            </p>
            {sent ? (
              <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '20px', textAlign: 'center', color: '#2e7d32', fontWeight: 'bold', fontSize: '16px' }}>
                ✅ Request sent! We'll contact you within 24 hours.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Any questions? (optional)" rows={3}
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
