import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

const NAVY = '#14172B'
const GOLD = '#D9A441'

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

export async function GET(req: Request) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const now = new Date().toISOString()

  const { data: jobs, count } = await supabase
    .from('jobs')
    .select('company, source_logo', { count: 'exact' })
    .eq('country', 'Thailand')
    .gte('created_at', sevenDaysAgo)
    .gt('expires_at', now)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  const total = count ?? jobs?.length ?? 0
  const logos = (jobs || []).filter(j => j.source_logo).slice(0, 5)
  const extra = total - logos.length

  const dateRange = `${new Date(sevenDaysAgo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`

  let fontConfig: { name: string; data: ArrayBuffer; weight: 400 | 800; style: 'normal' }[] = []
  try {
    const [interRegular, interBold] = await Promise.all([
      loadGoogleFont('Inter', 400),
      loadGoogleFont('Inter', 800),
    ])
    fontConfig = [
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: interBold, weight: 800, style: 'normal' },
    ]
  } catch (e) {
    fontConfig = []
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(160deg, ${NAVY}, #23284A)`,
          fontFamily: 'Inter',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            background: 'rgba(217,164,65,0.18)',
            color: GOLD,
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '10px 26px',
            borderRadius: '100px',
            marginBottom: '32px',
          }}
        >
          ⭐ New Jobs This Week
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '84px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          {total} New {total === 1 ? 'Job' : 'Jobs'}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '26px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '44px',
          }}
        >
          Posted {dateRange} · jobsinthailand.net
        </div>

        {logos.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {logos.map((job, i) => (
              <img
                key={i}
                src={job.source_logo}
                width={80}
                height={80}
                style={{
                  borderRadius: '50%',
                  objectFit: 'contain',
                  border: `3px solid ${NAVY}`,
                  background: '#fff',
                  marginLeft: i === 0 ? '0' : '-20px',
                }}
              />
            ))}
            {extra > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: GOLD,
                  color: NAVY,
                  fontWeight: 800,
                  fontSize: '22px',
                  border: `3px solid ${NAVY}`,
                  marginLeft: '-20px',
                }}
              >
                +{extra}
              </div>
            )}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontConfig,
    }
  )
}
