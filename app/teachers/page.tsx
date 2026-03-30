import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 0

export default async function TeachersPage() {
  const { data: teachers } = await supabase
    .from('teachers')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', marginBottom: '16px' }}>
          🎓 Find a Private Teacher in Thailand
        </h1>
        <p style={{ color: '#ccc', fontSize: '18px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Browse qualified teachers for private lessons — English, maths, languages and more. Online or in person across Thailand.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/teachers/register" style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
            List Your Teaching Profile →
          </Link>
        </div>
      </section>

      {/* TEACHERS GRID */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

        {!teachers || teachers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎓</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>No teachers listed yet</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>Be the first to list your teaching profile!</p>
            <Link href="/teachers/register" style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              Get Listed →
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                {teachers.length} Teacher{teachers.length !== 1 ? 's' : ''} Available
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {teachers.map(teacher => (
                <Link key={teacher.id} href={`/teachers/${teacher.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', cursor: 'pointer', border: '1px solid #eee' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>

                    {/* PHOTO */}
                    <div style={{ height: '200px', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                      {teacher.photo_url ? (
                        <img src={teacher.photo_url} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ fontSize: '64px' }}>👤</div>
                      )}
                      {teacher.online_available && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#16a34a', color: 'white', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                          🌐 Online
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>{teacher.name}</h3>
                          {teacher.nationality && <div style={{ color: '#666', fontSize: '13px' }}>🌍 {teacher.nationality}</div>}
                        </div>
                        {teacher.hourly_rate && (
                          <div style={{ background: '#fff3ed', color: '#E85D26', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}>
                            {teacher.hourly_rate}
                          </div>
                        )}
                      </div>

                      {teacher.tagline && (
                        <p style={{ color: '#555', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.5', fontStyle: 'italic' }}>"{teacher.tagline}"</p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        {teacher.location && (
                          <span style={{ background: '#f0f0f0', color: '#555', fontSize: '11px', padding: '3px 8px', borderRadius: '20px' }}>
                            📍 {teacher.location}
                          </span>
                        )}
                        {teacher.experience_years && (
                          <span style={{ background: '#f0f0f0', color: '#555', fontSize: '11px', padding: '3px 8px', borderRadius: '20px' }}>
                            ⭐ {teacher.experience_years} yrs exp
                          </span>
                        )}
                      </div>

                      {teacher.subjects && teacher.subjects.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                          {teacher.subjects.slice(0, 3).map((subject: string) => (
                            <span key={subject} style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold' }}>
                              {subject}
                            </span>
                          ))}
                          {teacher.subjects.length > 3 && (
                            <span style={{ background: '#f0f0f0', color: '#666', fontSize: '11px', padding: '3px 8px', borderRadius: '20px' }}>
                              +{teacher.subjects.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div style={{ background: '#E85D26', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                        View Profile →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '60px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎓</div>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', marginBottom: '12px' }}>Are you a teacher in Thailand?</h2>
          <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Get your own professional profile page and reach hundreds of students and parents across Thailand!
          </p>
          <Link href="/teachers/register" style={{ background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
            Get Your Profile Page →
          </Link>
        </div>

      </section>
    </main>
  )
}