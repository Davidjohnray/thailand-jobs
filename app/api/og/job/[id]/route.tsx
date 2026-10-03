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
  const primaryBg = isFeatured ? '#14172B' : '#E85D26'
  const accentColor = isFeatured ? '#D9A441' : '#ffffff'

  // Convert relative URLs to absolute
  const getAbsoluteUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (url.startsWith('/')) return `${SITE_URL}${url}`
    return `${SITE_URL}/${url}`
  }

  const logoUrl = getAbsoluteUrl(job.logo_url) || getAbsoluteUrl(job.logo)

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '70%', padding: '40px' }}>
          
          {logoUrl ? (
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <img src={logoUrl} width={80} height={80} style={{ borderRadius: '8px' }} />
            </div>
          ) : null}

          {isFeatured ? (
            <div style={{ display: 'flex', marginBottom: '12px' }}>
              <div style={{ display: 'flex', backgroundColor: '#D9A441', color: '#14172B', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 700 }}>
                FEATURED JOB
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', fontSize: '36px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>
            {job.title || 'Job Title'}
          </div>

          <div style={{ display: 'flex', fontSize: '24px', color: '#666666', marginBottom: '16px' }}>
            {job.company || 'Company'}
          </div>

          <div style={{ display: 'flex', fontSize: '18px', color: '#888888', marginBottom: '8px' }}>
            {job.location ? `📍 ${job.location}` : ''}
          </div>

          <div style={{ display: 'flex', fontSize: '18px', color: '#888888' }}>
            {job.job_type ? `💼 ${job.job_type}` : ''}
          </div>

          <div style={{ display: 'flex', marginTop: 'auto', fontSize: '16px', color: '#999999' }}>
            jobsinthailand.net
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '30%', backgroundColor: primaryBg, padding: '40px' }}>
          {job.salary ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: '16px', color: accentColor, marginBottom: '8px' }}>SALARY</div>
              <div style={{ display: 'flex', fontSize: '22px', fontWeight: 700, color: '#ffffff', textAlign: 'center' }}>{job.salary}</div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
