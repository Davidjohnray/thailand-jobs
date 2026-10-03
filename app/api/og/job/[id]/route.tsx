import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SITE_URL = 'https://jobsinthailand.net'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !job) {
    return new Response('Job not found', { status: 404 })
  }

  const isFeatured = job.featured === true
  const navyBg = '#14172B'
  const goldAccent = '#D9A441'
  const orangeBg = '#E85D26'
  const primaryBg = isFeatured ? navyBg : orangeBg
  const accentColor = isFeatured ? goldAccent : '#ffffff'

  // Convert relative URLs to absolute
  const getAbsoluteUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (url.startsWith('/')) return `${SITE_URL}${url}`
    return `${SITE_URL}/${url}`
  }

  const logoUrl = getAbsoluteUrl(job.logo_url) || getAbsoluteUrl(job.logo)

  const description = job.description
    ? job.description.substring(0, 120) + (job.description.length > 120 ? '...' : '')
    : ''

  const expiresAt = job.expires_at ? new Date(job.expires_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : null

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#ffffff' }}>
        {/* Left side */}
        <div style={{ width: '70%', height: '100%', display: 'flex', flexDirection: 'column', padding: '40px', backgroundColor: '#ffffff' }}>
          
          {logoUrl && (
            <img src={logoUrl} width={80} height={80} style={{ objectFit: 'contain', borderRadius: '8px', marginBottom: '20px' }} />
          )}

          {isFeatured && (
            <div style={{ display: 'flex', marginBottom: '12px' }}>
              <span style={{ backgroundColor: goldAccent, color: navyBg, padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 700 }}>
                ⭐ FEATURED JOB
              </span>
            </div>
          )}

          <div style={{ fontSize: '36px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px', lineHeight: 1.2 }}>
            {job.title}
          </div>

          <div style={{ fontSize: '24px', color: '#666666', marginBottom: '16px' }}>
            {job.company}
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {job.location && <span style={{ fontSize: '18px', color: '#888888' }}>📍 {job.location}</span>}
            {job.job_type && <span style={{ fontSize: '18px', color: '#888888' }}>💼 {job.job_type}</span>}
          </div>

          {description && (
            <div style={{ fontSize: '16px', color: '#666666', lineHeight: 1.5, marginBottom: '16px' }}>
              {description}
            </div>
          )}

          <div style={{ marginTop: 'auto', fontSize: '16px', color: '#999999' }}>
            jobsinthailand.net
          </div>
        </div>

        {/* Right side */}
        <div style={{ width: '30%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: primaryBg, padding: '40px 20px' }}>
          {job.salary && (
            <>
              <div style={{ fontSize: '16px', color: accentColor, marginBottom: '8px', opacity: 0.9 }}>SALARY</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.3 }}>{job.salary}</div>
            </>
          )}

          {expiresAt && (
            <div style={{ marginTop: '40px', fontSize: '14px', color: accentColor, opacity: 0.8 }}>
              Deadline: {expiresAt}
            </div>
          )}

          {job.visa_sponsor && (
            <div style={{ marginTop: '20px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#ffffff' }}>
              ✓ Visa Sponsored
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
