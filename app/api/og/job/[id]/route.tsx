import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

const NAVY = '#14172B'
const GOLD = '#D9A441'
const ORANGE = '#E85D26'

// Fetches a real Inter font file at the requested weight from Google Fonts.
// Without this, the image renderer fakes bold text by smearing a thin font,
// which is what was causing the blurry/fuzzy text on Facebook.
// NOTE: Google Fonts serves .woff2 to modern browsers by default, but our
// renderer needs .ttf/.otf — so we pretend to be an old browser via the
// User-Agent header, which makes Google respond with a compatible format.
async function loadGoogleFont(font: string, weight: number) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}`
  const css = await (
    await fetch(cssUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
      },
    })
  ).text()
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/)
  if (match) {
    const res = await fetch(match[1])
    if (res.status === 200) {
      return await res.arrayBuffer()
    }
  }
  throw new Error(`Failed to load font: ${font} ${weight}`)
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, location, salary, job_type, category, source_logo, visa_sponsor, featured, description, expires_at')
    .eq('id', id)
    .single()

  if (!job) {
    return new Response('Job not found', { status: 404 })
  }

  const isFeatured = !!job.featured

  const snippet = job.description
    ? job.description.replace(/\s+/g, ' ').trim().slice(0, 110) + (job.description.length > 110 ? '…' : '')
    : ''

  const deadline = job.expires_at
    ? new Date(job.expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : null

  const panelBg = isFeatured
    ? `linear-gradient(160deg, ${NAVY}, #23284A)`
    : `linear-gradient(160deg, ${ORANGE}, #F08A52)`
  const panelAccent = isFeatured ? GOLD : '#FFFFFF'
  const panelLabelBg = isFeatured ? 'rgba(217,164,65,0.18)' : 'rgba(255,255,255,0.22)'

  let fontConfig: { name: string; data: ArrayBuffer; weight: 400 | 600 | 800; style: 'normal' }[] = []
  try {
    const [interRegular, interSemibold, interBold] = await Promise.all([
      loadGoogleFont('Inter', 400),
      loadGoogleFont('Inter', 600),
      loadGoogleFont('Inter', 800),
    ])
    fontConfig = [
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: interSemibold, weight: 600, style: 'normal' },
      { name: 'Inter', data: interBold, weight: 800, style: 'normal' },
    ]
  } catch (e) {
    // If Google Fonts is unreachable or changes its response format again,
    // fall back to the renderer's default font rather than failing the
    // entire image — a slightly less crisp banner beats no banner at all.
    fontConfig = []
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#ffffff',
          fontFamily: 'Inter',
        }}
      >
        {/* LEFT — job details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '760px',
            padding: '52px 44px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px' }}>
            {job.source_logo ? (
              <img
                src={job.source_logo}
                width={72}
                height={72}
                style={{
                  borderRadius: '14px',
                  objectFit: 'contain',
                  border: '1px solid #eee',
                  background: '#fff',
                }}
              />
            ) : null}
            <div
              style={{
                display: 'flex',
                background: isFeatured ? NAVY : '#F1F1F4',
                color: isFeatured ? GOLD : '#6B7280',
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '8px 18px',
                borderRadius: '100px',
              }}
            >
              {isFeatured ? '⭐ Featured Job' : 'Jobs in Thailand'}
            </div>
          </div>

          <div
            style={{
              fontSize: '42px',
              fontWeight: 800,
              color: NAVY,
              lineHeight: 1.15,
              marginBottom: '12px',
              display: 'flex',
            }}
          >
            {job.title}
          </div>

          <div
            style={{
              fontSize: '24px',
              color: '#444',
              fontWeight: 600,
              marginBottom: '14px',
              display: 'flex',
            }}
          >
            {job.company} • {job.location}
          </div>

          {snippet && (
            <div
              style={{
                fontSize: '19px',
                color: '#666',
                fontWeight: 400,
                lineHeight: 1.45,
                marginBottom: '22px',
                maxWidth: '660px',
                display: 'flex',
              }}
            >
              {snippet}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {job.visa_sponsor && (
              <div
                style={{
                  display: 'flex',
                  background: '#DDF3E4',
                  color: '#1E7A44',
                  fontSize: '18px',
                  fontWeight: 600,
                  padding: '7px 18px',
                  borderRadius: '100px',
                }}
              >
                ✅ Visa
              </div>
            )}
            {job.category && (
              <div
                style={{
                  display: 'flex',
                  background: isFeatured ? NAVY : '#F1F1F4',
                  color: isFeatured ? GOLD : '#555',
                  fontSize: '18px',
                  fontWeight: 600,
                  padding: '7px 18px',
                  borderRadius: '100px',
                }}
              >
                🏫 {job.category}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flex: 1 }} />

          <div style={{ display: 'flex', fontSize: '18px', fontWeight: 600, color: NAVY }}>
            jobsinthailand.net
          </div>
        </div>

        {/* RIGHT — salary / apply panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '440px',
            background: panelBg,
            padding: '52px 40px',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: panelLabelBg,
              color: panelAccent,
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: '100px',
              alignSelf: 'flex-start',
              marginBottom: '18px',
            }}
          >
            Salary
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '38px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '32px',
            }}
          >
            {job.salary}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingTop: '28px',
              borderTop: `2px solid ${isFeatured ? 'rgba(217,164,65,0.3)' : 'rgba(255,255,255,0.3)'}`,
            }}
          >
            {job.job_type && (
              <div style={{ display: 'flex', fontSize: '20px', fontWeight: 600, color: '#ffffff' }}>
                {job.job_type}
              </div>
            )}
            <div style={{ display: 'flex', fontSize: '18px', fontWeight: 400, color: 'rgba(255,255,255,0.75)' }}>
              {deadline ? `Apply by ${deadline}` : 'Apply today'}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Only pass `fonts` when we actually have one — an empty array
      // makes the renderer throw ("At least one font is required"),
      // which is worse than just omitting the key and using its
      // built-in default font.
      ...(fontConfig.length > 0 ? { fonts: fontConfig } : {}),
    }
  )
}
