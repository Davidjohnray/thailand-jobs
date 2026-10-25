import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../src/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'thailand2024'

export async function GET(req: Request) {
  if (req.headers.get('x-admin-password') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const db = getSupabaseAdmin()

  const { data: partners } = await db.from('apply_partners').select('key, name, apply_email, active').order('name')

  const { data: jobs } = await db
    .from('jobs')
    .select('*')
    .not('apply_partner', 'is', null)
    .order('created_at', { ascending: false })

  const { data: apps } = await db
    .from('job_applications')
    .select('id, ref_no, view_token, job_id, partner_key, job_title, name, email, phone, nationality, video_path, email_status, email_error, created_at')
    .order('created_at', { ascending: false })
    .limit(2000)

  const jobRows = (jobs || []).map((j: any) => {
    const list = (apps || []).filter((a: any) => a.job_id === String(j.id))
    return {
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      created_at: j.created_at,
      expires_at: j.expires_at,
      partner_key: j.apply_partner,
      views: j.views ?? j.view_count ?? 0,
      applications: list.length,
      sent: list.filter((a: any) => a.email_status === 'sent').length,
      failed: list.filter((a: any) => a.email_status === 'failed').length,
      applicants: list,
    }
  })

  // Applications for jobs that are no longer flagged (e.g. logo changed or job deleted)
  const knownIds = new Set(jobRows.map(j => String(j.id)))
  const orphans = (apps || []).filter((a: any) => !knownIds.has(a.job_id))

  return NextResponse.json({ partners: partners || [], jobs: jobRows, orphans })
}
