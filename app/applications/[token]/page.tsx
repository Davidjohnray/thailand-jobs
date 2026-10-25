import { getSupabaseAdmin, APPLY_BUCKET, SITE_URL } from '../../../src/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Application — Jobs in Thailand', robots: { index: false, follow: false } }

const card: any = { background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }

export default async function ApplicationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const db = getSupabaseAdmin()

  const { data: app } = token && token.length >= 32
    ? await db.from('job_applications').select('*').eq('view_token', token).single()
    : { data: null }

  if (!app) return (
    <main style={{ textAlign: 'center', padding: '80px 24px', background: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '26px', color: '#1a1a2e' }}>Application not found</h1>
      <p style={{ color: '#666' }}>This link may be wrong or the application has been removed.</p>
    </main>
  )

  // Fresh private links every time the page opens (valid 2 hours)
  const paths = [app.resume_path, app.photo_path, app.video_path].filter(Boolean)
  const { data: signed } = await db.storage.from(APPLY_BUCKET).createSignedUrls(paths, 60 * 60 * 2)
  const urlFor = (p: string | null) => (p ? signed?.find((s: any) => s.path === p)?.signedUrl || null : null)
  const resumeUrl = urlFor(app.resume_path)
  const photoUrl = urlFor(app.photo_path)
  const videoUrl = urlFor(app.video_path)
  const resumeIsPdf = (app.resume_path || '').toLowerCase().endsWith('.pdf')
  const resumeIsImage = /\.(png|jpe?g|webp|gif|heic)$/i.test(app.resume_path || '')
  const ref = `JIT-${app.ref_no}`

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px 28px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' }}>APPLICATION VIA</div>
            <a href={SITE_URL} style={{ color: 'white', fontWeight: 'bold', fontSize: '22px', textDecoration: 'none' }}>Jobs in Thailand</a>
          </div>
          <div style={{ color: '#ccc', fontSize: '14px', textAlign: 'right' }}>
            Ref <strong style={{ color: 'white' }}>{ref}</strong><br />
            {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            {photoUrl ? (
              <a href={photoUrl} target="_blank" rel="noopener noreferrer">
                <img src={photoUrl} alt={app.name} style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #E85D26' }} />
              </a>
            ) : null}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <h1 style={{ fontSize: '26px', color: '#1a1a2e', margin: '0 0 6px' }}>{app.name}</h1>
              <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>
                Applying for: {app.job_title}{app.company ? ` — ${app.company}` : ''}
              </div>
              <div style={{ color: '#555', fontSize: '14px', lineHeight: '1.9' }}>
                📧 <a href={`mailto:${app.email}`} style={{ color: '#2D6BE4' }}>{app.email}</a><br />
                {app.phone && <>📞 {app.phone}<br /></>}
                {app.nationality && <>🌍 {app.nationality}</>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
            <a href={`mailto:${app.email}?subject=${encodeURIComponent('Your application: ' + (app.job_title || ''))}`}
              style={{ background: '#E85D26', color: 'white', padding: '12px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>📧 Email candidate</a>
            {resumeUrl && <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: '#1a1a2e', color: 'white', padding: '12px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>📄 Download resume</a>}
          </div>
        </div>

        {app.message && (
          <div style={card}>
            <h2 style={{ fontSize: '18px', color: '#1a1a2e', margin: '0 0 12px' }}>Message</h2>
            <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>{app.message}</p>
          </div>
        )}

        {videoUrl && (
          <div style={card}>
            <h2 style={{ fontSize: '18px', color: '#1a1a2e', margin: '0 0 12px' }}>🎥 Video introduction</h2>
            <video src={videoUrl} controls style={{ width: '100%', borderRadius: '10px', background: '#000' }} />
          </div>
        )}

        {resumeUrl && (
          <div style={card}>
            <h2 style={{ fontSize: '18px', color: '#1a1a2e', margin: '0 0 12px' }}>📄 Resume</h2>
            {resumeIsPdf ? (
              <iframe src={resumeUrl} style={{ width: '100%', height: '800px', border: '1px solid #eee', borderRadius: '8px' }} />
            ) : resumeIsImage ? (
              <img src={resumeUrl} alt="Resume" style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }} />
            ) : (
              <p style={{ color: '#666', margin: 0 }}>This resume is a Word file. Use <strong>Download resume</strong> above to open it.</p>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', color: '#999', fontSize: '13px' }}>
          This candidate applied through <a href={SITE_URL} style={{ color: '#E85D26' }}>www.jobsinthailand.net</a> — Thailand's job board for teachers and expats.
        </p>
      </div>
    </main>
  )
}
