import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

const NAVY = '#14172B'
const GOLD = '#D9A441'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, location, salary, job_type, category, source_logo, visa_sponsor, featured')
    .eq('id', id)
    .single()

  if (!job) {
    return new Response('Job not found', { status: 404 })
  }

  const isFeatured = !!job.featured

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          fontFamily: 'Inter',
        }}
      >
        {/* Top banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '20px 48px',
            background: isFeatured ? NAVY : '#F1F1F4',
            color: isFeatured ? GOLD : '#6B7280',
            fontSize: '26px',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          {isFeatured ? '⭐ Featured Job' : 'Jobs in Thailand'}
        </div>

        {/* Body */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '48px',
            gap: '36px',
          }}
        >
          {job.source_logo ? (
            <img
              src={job.source_logo}
              width={140}
              height={140}
              style={{
                borderRadius: '16px',
                objectFit: 'contain',
                border: '1px solid #eee',
                background: '#fff',
              }}
            />
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div
              style={{
                fontSize: '44px',
                fontWeight: 800,
                color: NAVY,
                lineHeight: 1.2,
                marginBottom: '14px',
              }}
            >
              {job.title}
            </div>

            <div
              style={{
                fontSize: '26px',
                color: '#444',
                fontWeight: 600,
                marginBottom: '28px',
                display: 'flex',
              }}
            >
              {job.company} • {job.location}
            </div>

            <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
              {job.visa_sponsor && (
                <div
                  style={{
                    display: 'flex',
                    background: '#DDF3E4',
                    color: '#1E7A44',
                    fontSize: '20px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '100px',
                  }}
                >
                  ✓ Visa
                </div>
              )}
              {job.job_type && (
                <div
                  style={{
                    display: 'flex',
                    background: '#EAF0FF',
                    color: '#2D5BD0',
                    fontSize: '20px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '100px',
                  }}
                >
                  {job.job_type}
                </div>
              )}
              {job.category && (
                <div
                  style={{
                    display: 'flex',
                    background: NAVY,
                    color: GOLD,
                    fontSize: '20px',
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: '100px',
                  }}
                >
                  🏫 {job.category}
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                background: 'linear-gradient(120deg, #D9A441, #F3CE85)',
                color: NAVY,
                fontSize: '30px',
                fontWeight: 800,
                padding: '14px 28px',
                borderRadius: '100px',
              }}
            >
              {job.salary}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 48px',
            borderTop: '2px solid #F1F1F4',
            fontSize: '22px',
            fontWeight: 700,
            color: NAVY,
          }}
        >
          <div style={{ display: 'flex' }}>jobsinthailand.net</div>
          <div style={{ display: 'flex', color: '#6B7280', fontWeight: 500 }}>
            Apply today
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
