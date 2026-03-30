import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: teacher } = await supabase
    .from('teachers')
    .select('*')
    .eq('slug', slug)
    .single()
  if (!teacher) return { title: 'Teacher Not Found' }
  return {
    title: `${teacher.name} — Private Teacher in Thailand`,
    description: teacher.tagline || `${teacher.name} is a private teacher in Thailand offering lessons in ${teacher.subjects?.join(', ')}`,
  }
}

export default async function TeacherPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: teacher } = await supabase
    .from('teachers')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!teacher) notFound()

  const template = teacher.template || 'modern'

  // ============================================================
  // TEMPLATE 1 — MODERN (clean white, minimal)
  // ============================================================
  if (template === 'modern') return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', padding: '60px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #E85D26', flexShrink: 0, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '64px' }}>👤</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px' }}>{teacher.name}</h1>
            {teacher.nationality && <div style={{ color: '#ccc', fontSize: '16px', marginBottom: '8px' }}>🌍 {teacher.nationality}</div>}
            {teacher.tagline && <p style={{ color: '#E85D26', fontSize: '18px', fontStyle: 'italic', margin: '0 0 16px' }}>"{teacher.tagline}"</p>}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {teacher.location && <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>📍 {teacher.location}</span>}
              {teacher.online_available && <span style={{ background: '#16a34a', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>🌐 Online Available</span>}
              {teacher.experience_years && <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>⭐ {teacher.experience_years} Years Experience</span>}
              {teacher.hourly_rate && <span style={{ background: '#E85D26', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>💰 {teacher.hourly_rate}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* LEFT CONTENT */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* ABOUT */}
          {teacher.bio && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', borderBottom: '3px solid #E85D26', paddingBottom: '10px' }}>👋 About Me</h2>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>{teacher.bio}</p>
            </div>
          )}

          {/* SUBJECTS */}
          {teacher.subjects?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', borderBottom: '3px solid #E85D26', paddingBottom: '10px' }}>📚 Subjects</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {teacher.subjects.map((s: string) => (
                  <span key={s} style={{ background: '#fff3ed', color: '#E85D26', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* LEVELS */}
          {teacher.levels?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', borderBottom: '3px solid #E85D26', paddingBottom: '10px' }}>🎯 Teaching Levels</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {teacher.levels.map((l: string) => (
                  <span key={l} style={{ background: '#e8f5e9', color: '#2e7d32', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>{l}</span>
                ))}
              </div>
            </div>
          )}

          {/* TEACHING STYLE */}
          {teacher.teaching_style && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', borderBottom: '3px solid #E85D26', paddingBottom: '10px' }}>💡 My Teaching Style</h2>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>{teacher.teaching_style}</p>
            </div>
          )}

          {/* QUALIFICATIONS */}
          {teacher.qualifications?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', borderBottom: '3px solid #E85D26', paddingBottom: '10px' }}>🎓 Qualifications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {teacher.qualifications.map((q: string) => (
                  <div key={q} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#444', fontSize: '14px' }}>
                    <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '16px' }}>✓</span> {q}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {teacher.certifications?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', borderBottom: '3px solid #E85D26', paddingBottom: '10px' }}>📜 Certifications</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {teacher.certifications.map((c: string) => (
                  <span key={c} style={{ background: '#e8f0fe', color: '#2D6BE4', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>🏅 {c}</span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR — CONTACT */}
        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>📞 Get in Touch</h3>
            {teacher.hourly_rate && (
              <div style={{ background: '#E85D26', borderRadius: '8px', padding: '14px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '4px' }}>HOURLY RATE</div>
                <div style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>{teacher.hourly_rate}</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {teacher.line_id && (
                <a href={`https://line.me/ti/p/~${teacher.line_id}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#06C755', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  💬 Contact on LINE
                </a>
              )}
              {teacher.whatsapp && (
                <a href={`https://wa.me/${teacher.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#25D366', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  📱 WhatsApp
                </a>
              )}
              {teacher.email && (
                <a href={`mailto:${teacher.email}`}
                  style={{ display: 'block', background: '#2D6BE4', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  📧 Send Email
                </a>
              )}
              {teacher.facebook && (
                <a href={teacher.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#1877F2', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  👍 Facebook
                </a>
              )}
            </div>
          </div>

          {/* LANGUAGES */}
          {teacher.languages?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>🗣️ Languages Spoken</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {teacher.languages.map((l: string) => (
                  <span key={l} style={{ background: '#f0f0f0', color: '#555', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>{l}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: '#fff3ed', borderRadius: '12px', padding: '20px', border: '1px solid #E85D26' }}>
            <p style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '13px', margin: '0 0 6px' }}>⭐ Listed on Jobs in Thailand</p>
            <p style={{ color: '#666', fontSize: '12px', margin: '0 0 12px' }}>Browse more teachers and services across Thailand</p>
            <Link href="/teachers" style={{ display: 'block', background: '#E85D26', color: 'white', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
              Browse All Teachers →
            </Link>
          </div>

        </div>
      </div>
    </main>
  )

  // ============================================================
  // TEMPLATE 2 — BOLD (colourful hero, vibrant)
  // ============================================================
  if (template === 'bold') return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* BOLD HERO */}
      <div style={{ background: 'linear-gradient(135deg, #E85D26 0%, #ff8c42 100%)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '5px solid white', margin: '0 auto 20px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {teacher.photo_url ? (
            <img src={teacher.photo_url} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '64px' }}>👤</span>
          )}
        </div>
        <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: '0 0 8px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{teacher.name}</h1>
        {teacher.nationality && <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '8px' }}>🌍 {teacher.nationality}</div>}
        {teacher.tagline && <p style={{ color: 'white', fontSize: '20px', fontStyle: 'italic', margin: '0 0 20px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>"{teacher.tagline}"</p>}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {teacher.location && <span style={{ background: 'rgba(0,0,0,0.2)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>📍 {teacher.location}</span>}
          {teacher.online_available && <span style={{ background: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>🌐 Online Available</span>}
          {teacher.hourly_rate && <span style={{ background: '#1a1a2e', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>💰 {teacher.hourly_rate}</span>}
        </div>
      </div>

      {/* SUBJECTS BANNER */}
      {teacher.subjects?.length > 0 && (
        <div style={{ background: '#1a1a2e', padding: '16px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {teacher.subjects.map((s: string) => (
              <span key={s} style={{ color: 'white', fontSize: '14px', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {teacher.bio && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', borderTop: '4px solid #E85D26' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#E85D26', marginBottom: '16px' }}>👋 About Me</h2>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>{teacher.bio}</p>
            </div>
          )}
          {teacher.teaching_style && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', borderTop: '4px solid #7C3AED' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#7C3AED', marginBottom: '16px' }}>💡 My Teaching Style</h2>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>{teacher.teaching_style}</p>
            </div>
          )}
          {teacher.levels?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', borderTop: '4px solid #16a34a' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#16a34a', marginBottom: '16px' }}>🎯 Who I Teach</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {teacher.levels.map((l: string) => (
                  <span key={l} style={{ background: '#e8f5e9', color: '#2e7d32', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>{l}</span>
                ))}
              </div>
            </div>
          )}
          {(teacher.qualifications?.length > 0 || teacher.certifications?.length > 0) && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', borderTop: '4px solid #2D6BE4' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2D6BE4', marginBottom: '16px' }}>🎓 Credentials</h2>
              {teacher.qualifications?.map((q: string) => (
                <div key={q} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#444', fontSize: '14px', marginBottom: '8px' }}>
                  <span style={{ color: '#2D6BE4', fontWeight: 'bold' }}>✓</span> {q}
                </div>
              ))}
              {teacher.certifications?.map((c: string) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#444', fontSize: '14px', marginBottom: '8px' }}>
                  <span style={{ color: '#E85D26', fontWeight: 'bold' }}>🏅</span> {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #E85D26 0%, #ff8c42 100%)', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(232,93,38,0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>📞 Book a Lesson</h3>
            {teacher.hourly_rate && (
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '14px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '4px' }}>HOURLY RATE</div>
                <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{teacher.hourly_rate}</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {teacher.line_id && (
                <a href={`https://line.me/ti/p/~${teacher.line_id}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#06C755', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  💬 Contact on LINE
                </a>
              )}
              {teacher.whatsapp && (
                <a href={`https://wa.me/${teacher.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#25D366', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  📱 WhatsApp
                </a>
              )}
              {teacher.email && (
                <a href={`mailto:${teacher.email}`}
                  style={{ display: 'block', background: 'white', color: '#E85D26', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  📧 Send Email
                </a>
              )}
              {teacher.facebook && (
                <a href={teacher.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#1877F2', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  👍 Facebook
                </a>
              )}
            </div>
          </div>
          {teacher.languages?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>🗣️ Languages</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {teacher.languages.map((l: string) => (
                  <span key={l} style={{ background: '#fff3ed', color: '#E85D26', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{l}</span>
                ))}
              </div>
            </div>
          )}
          <Link href="/teachers" style={{ display: 'block', background: '#1a1a2e', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
            ← Browse All Teachers
          </Link>
        </div>
      </div>
    </main>
  )

  // ============================================================
  // TEMPLATE 3 — PROFESSIONAL (dark, corporate)
  // ============================================================
  if (template === 'professional') return (
    <main style={{ background: '#f0f2f5', minHeight: '100vh' }}>

      {/* DARK HEADER */}
      <div style={{ background: '#1a1a2e', padding: '0 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '50px 0', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: '140px', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '3px solid #E85D26', flexShrink: 0, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '64px' }}>👤</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#E85D26', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Private Teacher · Thailand</div>
            <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', margin: '0 0 8px' }}>{teacher.name}</h1>
            {teacher.tagline && <p style={{ color: '#aaa', fontSize: '16px', margin: '0 0 20px', fontStyle: 'italic' }}>{teacher.tagline}</p>}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {teacher.location && <div style={{ color: '#ccc', fontSize: '14px' }}>📍 {teacher.location}</div>}
              {teacher.experience_years && <div style={{ color: '#ccc', fontSize: '14px' }}>⭐ {teacher.experience_years} Years Experience</div>}
              {teacher.nationality && <div style={{ color: '#ccc', fontSize: '14px' }}>🌍 {teacher.nationality}</div>}
              {teacher.online_available && <div style={{ color: '#16a34a', fontSize: '14px', fontWeight: 'bold' }}>🌐 Online Available</div>}
            </div>
          </div>
          {teacher.hourly_rate && (
            <div style={{ background: '#E85D26', borderRadius: '8px', padding: '20px 28px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Hourly Rate</div>
              <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{teacher.hourly_rate}</div>
            </div>
          )}
        </div>
      </div>

      {/* SUBJECTS BAR */}
      {teacher.subjects?.length > 0 && (
        <div style={{ background: '#E85D26', padding: '12px 24px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginRight: '8px' }}>Subjects:</span>
            {teacher.subjects.map((s: string) => (
              <span key={s} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {teacher.bio && (
            <div style={{ background: 'white', borderRadius: '8px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#E85D26', color: 'white', width: '4px', height: '20px', borderRadius: '2px', display: 'inline-block' }}></span>
                Professional Profile
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>{teacher.bio}</p>
            </div>
          )}
          {teacher.teaching_style && (
            <div style={{ background: 'white', borderRadius: '8px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#E85D26', color: 'white', width: '4px', height: '20px', borderRadius: '2px', display: 'inline-block' }}></span>
                Teaching Methodology
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>{teacher.teaching_style}</p>
            </div>
          )}
          {teacher.levels?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '8px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#E85D26', color: 'white', width: '4px', height: '20px', borderRadius: '2px', display: 'inline-block' }}></span>
                Student Levels
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {teacher.levels.map((l: string) => (
                  <span key={l} style={{ background: '#f5f5f5', color: '#333', padding: '6px 14px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #ddd' }}>{l}</span>
                ))}
              </div>
            </div>
          )}
          {(teacher.qualifications?.length > 0 || teacher.certifications?.length > 0) && (
            <div style={{ background: 'white', borderRadius: '8px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#E85D26', color: 'white', width: '4px', height: '20px', borderRadius: '2px', display: 'inline-block' }}></span>
                Education & Certifications
              </h2>
              {teacher.qualifications?.map((q: string) => (
                <div key={q} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444', fontSize: '14px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ color: '#1a1a2e', fontSize: '18px' }}>🎓</span> {q}
                </div>
              ))}
              {teacher.certifications?.map((c: string) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444', fontSize: '14px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ color: '#E85D26', fontSize: '18px' }}>🏅</span> {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '28px' }}>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {teacher.line_id && (
                <a href={`https://line.me/ti/p/~${teacher.line_id}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#06C755', color: 'white', padding: '12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  💬 LINE
                </a>
              )}
              {teacher.whatsapp && (
                <a href={`https://wa.me/${teacher.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#25D366', color: 'white', padding: '12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  📱 WhatsApp
                </a>
              )}
              {teacher.email && (
                <a href={`mailto:${teacher.email}`}
                  style={{ display: 'block', background: '#E85D26', color: 'white', padding: '12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  📧 Email
                </a>
              )}
              {teacher.facebook && (
                <a href={teacher.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#1877F2', color: 'white', padding: '12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
                  👍 Facebook
                </a>
              )}
            </div>
          </div>
          {teacher.languages?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Languages</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {teacher.languages.map((l: string) => (
                  <span key={l} style={{ background: '#f5f5f5', color: '#333', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', border: '1px solid #ddd' }}>{l}</span>
                ))}
              </div>
            </div>
          )}
          <Link href="/teachers" style={{ display: 'block', background: 'white', color: '#1a1a2e', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd' }}>
            ← Browse All Teachers
          </Link>
        </div>
      </div>
    </main>
  )

  // ============================================================
  // TEMPLATE 4 — FRIENDLY (warm, casual, fun)
  // ============================================================
  return (
    <main style={{ background: '#fffbf7', minHeight: '100vh' }}>

      {/* FRIENDLY HERO */}
      <div style={{ background: 'linear-gradient(135deg, #fff3ed 0%, #ffe4cc 100%)', padding: '50px 24px', borderBottom: '3px solid #E85D26' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '5px solid #E85D26', margin: '0 auto 20px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(232,93,38,0.3)' }}>
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '64px' }}>👤</span>
            )}
          </div>
          <h1 style={{ color: '#1a1a2e', fontSize: '40px', fontWeight: 'bold', margin: '0 0 8px' }}>Hi, I'm {teacher.name}! 👋</h1>
          {teacher.nationality && <div style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>🌍 {teacher.nationality}</div>}
          {teacher.tagline && <p style={{ color: '#E85D26', fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px' }}>"{teacher.tagline}"</p>}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            {teacher.location && <span style={{ background: 'white', color: '#555', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>📍 {teacher.location}</span>}
            {teacher.online_available && <span style={{ background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>🌐 Online Available</span>}
            {teacher.experience_years && <span style={{ background: 'white', color: '#555', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>⭐ {teacher.experience_years} Years Experience</span>}
          </div>
          {teacher.hourly_rate && (
            <div style={{ display: 'inline-block', background: '#E85D26', color: 'white', padding: '12px 32px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(232,93,38,0.4)' }}>
              💰 {teacher.hourly_rate} per hour
            </div>
          )}
        </div>
      </div>

      {/* SUBJECTS */}
      {teacher.subjects?.length > 0 && (
        <div style={{ padding: '24px', textAlign: 'center', background: 'white', borderBottom: '1px solid #eee' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ color: '#888', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>I teach</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {teacher.subjects.map((s: string) => (
                <span key={s} style={{ background: '#fff3ed', color: '#E85D26', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '14px', border: '2px solid #E85D26' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {teacher.bio && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #fff3ed' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#E85D26', marginBottom: '16px' }}>🙋 A Bit About Me</h2>
              <p style={{ color: '#555', lineHeight: '1.9', fontSize: '15px', whiteSpace: 'pre-line' }}>{teacher.bio}</p>
            </div>
          )}

          {teacher.teaching_style && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #dcfce7' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#16a34a', marginBottom: '16px' }}>💡 How I Teach</h2>
              <p style={{ color: '#555', lineHeight: '1.9', fontSize: '15px', whiteSpace: 'pre-line' }}>{teacher.teaching_style}</p>
            </div>
          )}

          {teacher.levels?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #e8f0fe' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2D6BE4', marginBottom: '16px' }}>🎯 Who I Work With</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {teacher.levels.map((l: string) => (
                  <span key={l} style={{ background: '#e8f0fe', color: '#2D6BE4', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '14px' }}>{l}</span>
                ))}
              </div>
            </div>
          )}

          {(teacher.qualifications?.length > 0 || teacher.certifications?.length > 0) && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid #fef9c3' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ca8a04', marginBottom: '16px' }}>🏅 My Credentials</h2>
              {teacher.qualifications?.map((q: string) => (
                <div key={q} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#444', fontSize: '14px', marginBottom: '10px' }}>
                  <span>🎓</span> {q}
                </div>
              ))}
              {teacher.certifications?.map((c: string) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#444', fontSize: '14px', marginBottom: '10px' }}>
                  <span>✅</span> {c}
                </div>
              ))}
            </div>
          )}

          {/* CONTACT CARD */}
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>😊</div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Let's get started!</h2>
            <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '24px' }}>I'd love to help you or your child reach their goals. Get in touch today!</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {teacher.line_id && (
                <a href={`https://line.me/ti/p/~${teacher.line_id}`} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#06C755', color: 'white', padding: '14px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
                  💬 LINE
                </a>
              )}
              {teacher.whatsapp && (
                <a href={`https://wa.me/${teacher.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#25D366', color: 'white', padding: '14px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
                  📱 WhatsApp
                </a>
              )}
              {teacher.email && (
                <a href={`mailto:${teacher.email}`}
                  style={{ background: '#E85D26', color: 'white', padding: '14px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
                  📧 Email Me
                </a>
              )}
              {teacher.facebook && (
                <a href={teacher.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#1877F2', color: 'white', padding: '14px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
                  👍 Facebook
                </a>
              )}
            </div>
            {teacher.languages?.length > 0 && (
              <div style={{ marginTop: '20px', color: '#ccc', fontSize: '13px' }}>
                🗣️ I speak: {teacher.languages.join(', ')}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/teachers" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              ← Browse All Teachers
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}