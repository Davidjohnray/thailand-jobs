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
  
  // Colors
  const navyBg = '#14172B'
  const goldAccent = '#D9A441'
  const orangeBg = '#E85D26'
  const darkOrange = '#C94E1D'

  // Convert relative URLs to absolute
  const getAbsoluteUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (url.startsWith('/')) return `${SITE_URL}${url}`
    return `${SITE_URL}/${url}`
  }

  const logoUrl = getAbsoluteUrl(job.logo_url) || getAbsoluteUrl(job.logo)

  // Truncate title if too long
  const title = job.title && job.title.length > 50 
    ? job.title.substring(0, 47) + '...' 
    : job.title || 'Job Opportunity'

  if (isFeatured) {
    // FEATURED JOB DESIGN - Navy & Gold
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: navyBg }}>
          {/* Left content */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '65%', padding: '50px', justifyContent: 'center' }}>
            
            {/* Featured badge */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{ display: 'flex', backgroundColor: goldAccent, color: navyBg, padding: '10px 24px', borderRadius: '30px', fontSize: '18px', fontWeight: 700 }}>
                ⭐ FEATURED JOB
              </div>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', fontSize: '48px', fontWeight: 700, color: '#ffffff', marginBottom: '16px', lineHeight: 1.1 }}>
              {title}
            </div>

            {/* Company */}
            <div style={{ display: 'flex', fontSize: '28px', color: goldAccent, marginBottom: '24px' }}>
              {job.company || 'Company'}
            </div>

            {/* Location & Type */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {job.location ? (
                <div style={{ display: 'flex', fontSize: '22px', color: '#cccccc' }}>
                  📍 {job.location}
                </div>
              ) : null}
              {job.job_type ? (
                <div style={{ display: 'flex', fontSize: '22px', color: '#cccccc' }}>
                  💼 {job.job_type}
                </div>
              ) : null}
            </div>

            {/* Website */}
            <div style={{ display: 'flex', marginTop: 'auto', paddingTop: '30px', fontSize: '18px', color: '#888888' }}>
              jobsinthailand.net
            </div>
          </div>

          {/* Right panel - Salary */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '35%', backgroundColor: goldAccent, padding: '40px' }}>
            {logoUrl ? (
              <div style={{ display: 'flex', marginBottom: '30px', backgroundColor: '#ffffff', padding: '10px', borderRadius: '12px' }}>
                <img src={logoUrl} width={100} height={100} style={{ borderRadius: '8px', objectFit: 'contain' }} />
              </div>
            ) : null}
            
            {job.salary ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', fontSize: '18px', color: navyBg, marginBottom: '8px', fontWeight: 600 }}>SALARY</div>
                <div style={{ display: 'flex', fontSize: '26px', fontWeight: 700, color: navyBg, textAlign: 'center' }}>{job.salary}</div>
              </div>
            ) : null}

            {job.visa_sponsor ? (
              <div style={{ display: 'flex', marginTop: '24px', backgroundColor: navyBg, padding: '10px 20px', borderRadius: '20px', fontSize: '16px', color: '#ffffff' }}>
                ✓ Visa Sponsored
              </div>
            ) : null}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  // REGULAR JOB DESIGN - Bold Orange
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
        {/* Orange accent bar on left */}
        <div style={{ display: 'flex', width: '12px', backgroundColor: orangeBg }}></div>
        
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '50px 50px 50px 40px', justifyContent: 'center' }}>
          
          {/* Logo + Company row */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            {logoUrl ? (
              <div style={{ display: 'flex', marginRight: '20px' }}>
                <img src={logoUrl} width={70} height={70} style={{ borderRadius: '10px', objectFit: 'contain' }} />
              </div>
            ) : null}
            <div style={{ display: 'flex', fontSize: '26px', color: '#666666', fontWeight: 500 }}>
              {job.company || 'Company'}
            </div>
          </div>

          {/* Title - BIG */}
          <div style={{ display: 'flex', fontSize: '52px', fontWeight: 700, color: '#1a1a2e', marginBottom: '20px', lineHeight: 1.1 }}>
            {title}
          </div>

          {/* Location & Type pills */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            {job.location ? (
              <div style={{ display: 'flex', backgroundColor: '#f0f0f0', padding: '10px 20px', borderRadius: '25px', fontSize: '20px', color: '#555555' }}>
                📍 {job.location}
              </div>
            ) : null}
            {job.job_type ? (
              <div style={{ display: 'flex', backgroundColor: '#f0f0f0', padding: '10px 20px', borderRadius: '25px', fontSize: '20px', color: '#555555' }}>
                💼 {job.job_type}
              </div>
            ) : null}
          </div>

          {/* Website */}
          <div style={{ display: 'flex', marginTop: 'auto', paddingTop: '20px', fontSize: '18px', color: '#aaaaaa' }}>
            jobsinthailand.net
          </div>
        </div>

        {/* Right panel - Salary */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '280px', backgroundColor: orangeBg, padding: '40px 30px' }}>
          {job.salary ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: '20px', color: 'rgba(255,255,255,0.8)', marginBottom: '12px', fontWeight: 500 }}>SALARY</div>
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.2 }}>{job.salary}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 600, color: '#ffffff' }}>
              VIEW DETAILS
            </div>
          )}

          {job.visa_sponsor ? (
            <div style={{ display: 'flex', marginTop: '30px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: '20px', fontSize: '16px', color: '#ffffff' }}>
              ✓ Visa Sponsored
            </div>
            ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
