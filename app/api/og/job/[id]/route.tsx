import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

const NAVY = '#14172B'
const GOLD = '#D9A441'
const ORANGE = '#E85D26'

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

  // Right-panel colors: gold/navy for featured, site-orange for everything else —
  // keeps regular listings visually strong, but never mistaken for a featured one.
  const panelBg = isFeatured
    ? `linear-gradient(160deg, ${NAVY}, #23284A)`
    : `linear-gradient(160deg, ${ORANGE}, #F08A52)`
  const panelAccent = isFeatured ? GOLD : '#FFFFFF'
  const panelLabelBg = isFeatured ? 'rgba(217,164,65,0.18)' : 'rgba(255,255,255,0.22)'

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
                  fontWeight: 700,
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
                  fontWeight: 700,
                  padding: '7px 18px',
                  borderRadius: '100px',
                }}
              >
                🏫 {job.category}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flex: 1 }} />

          <div style={{ display: 'flex', fontSize: '18px', fontWeight: 700, color: NAVY }}>
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
              <div style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                {job.job_type}
              </div>
            )}
            <div style={{ display: 'flex', fontSize: '18px', fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>
              {deadline ? `Apply by ${deadline}` : 'Apply today'}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
