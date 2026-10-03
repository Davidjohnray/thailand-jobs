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

  // Fetch job from database
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
  const primaryBg = isFeatured ? navyBg : orangeBg
  const accentColor = isFeatured ? goldAccent : '#ffffff'

  // Convert relative URLs to absolute URLs
  const getAbsoluteUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    if (url.startsWith('/')) {
      return `${SITE_URL}${url}`
    }
    return `${SITE_URL}/${url}`
  }

  const logoUrl = getAbsoluteUrl(job.logo_url) || getAbsoluteUrl(job.logo)

  // Truncate description
  const description = job.description
    ? job.description.substring(0, 120) + (job.description.length > 120 ? '...' : '')
    : ''

  // Format expiry
  const expiresAt = job.expires_at ? new Date(job.expires_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : null

  // Load fonts
  let fontConfig: any[] = []
  try {
    const [interBold, interRegular] = await Promise.all([
      fetch('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2', {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1)' }
      }),
      fetch('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2', {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1)' }
      })
    ])

    if (interBold.ok && interRegular.ok) {
      const [boldData, regularData] = await Promise.all([
        interBold.arrayBuffer(),
        interRegular.arrayBuffer()
      ])
      fontConfig = [
        { name: 'Inter', data: boldData, weight: 700 as const, style: 'normal' as const },
        { name: 'Inter', data: regularData, weight: 400 as const, style: 'normal' as const }
      ]
    }
  } catch (e) {
    console.log('Font loading failed, using fallback')
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Left side - Job details */}
        <div
          style={{
            width: '70%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Logo */}
          {logoUrl && (
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <img
                src={logoUrl}
                alt=""
                width={80}
                height={80}
                style={{ objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
          )}

          {/* Featured badge */}
          {isFeatured && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  backgroundColor: goldAccent,
                  color: navyBg,
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                ⭐ FEATURED JOB
              </span>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#1a1a2e',
              marginBottom: '12px',
              lineHeight: 1.2,
            }}
          >
            {job.title}
          </div>

          {/* Company */}
          <div
            style={{
              fontSize: '24px',
              color: '#666666',
              marginBottom: '16px',
            }}
          >
            {job.company}
          </div>

          {/* Location & Job Type */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            {job.location && (
              <span style={{ fontSize: '18px', color: '#888888' }}>
                📍 {job.location}
              </span>
            )}
            {job.job_type && (
              <span style={{ fontSize: '18px', color: '#888888' }}>
                💼 {job.job_type}
              </span>
            )}
          </div>

          {/* Description snippet */}
          {description && (
            <div
              style={{
                fontSize: '16px',
                color: '#666666',
                lineHeight: 1.5,
                marginBottom: '16px',
              }}
            >
              {description}
            </div>
          )}

          {/* Footer - Website */}
          <div
            style={{
              marginTop: 'auto',
              fontSize: '16px',
              color: '#999999',
            }}
          >
            jobsinthailand.net
          </div>
        </div>

        {/* Right side - Salary panel */}
        <div
          style={{
            width: '30%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: primaryBg,
            padding: '40px 20px',
          }}
        >
          {job.salary && (
            <>
              <div
                style={{
                  fontSize: '16px',
                  color: accentColor,
                  marginBottom: '8px',
                  opacity: 0.9,
                }}
              >
                SALARY
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#ffffff',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                {job.salary}
              </div>
            </>
          )}

          {expiresAt && (
            <div
              style={{
                marginTop: '40px',
                fontSize: '14px',
                color: accentColor,
                opacity: 0.8,
              }}
            >
              Deadline: {expiresAt}
            </div>
          )}

          {/* Visa sponsor badge */}
          {job.visa_sponsor && (
            <div
              style={{
                marginTop: '20px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                color: '#ffffff',
              }}
            >
              ✓ Visa Sponsored
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontConfig.length > 0 ? { fonts: fontConfig } : {}),
    }
  )
}
