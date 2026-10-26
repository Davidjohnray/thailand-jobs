import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../src/lib/supabaseAdmin'
import { ADMIN_PASSWORD, emailsSentToday, bangkokMonthStart, applyProEnabled, DAILY_EMAIL_CAP } from '../../../../src/lib/applyServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (req.headers.get('x-admin-password') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const db = getSupabaseAdmin()

  const { data: partners } = await db.from('apply_partners').select('key, name, apply_email, active').order('name')

  const { data: apps } = await db
    .from('job_applications')
    .select('id, ref_no, view_token, job_id, partner_key, apply_type, user_id, to_email, job_title, name, email, phone, nationality, video_path, video_link, email_status, email_error, created_at, viewed_at, view_count')
    .order('created_at', { ascending: false })
    .limit(3000)

  // Partner-school jobs, plus any other job that has Apply Pro / free-try applications
  const { data: partnerJobs } = await db
    .from('jobs')
    .select('*')
    .not('apply_partner', 'is', null)
    .order('created_at', { ascending: false })

  const partnerIds = new Set((partnerJobs || []).map((j: any) => String(j.id)))
  const proJobIds = Array.from(new Set((apps || []).filter((a: any) => !a.partner_key).map((a: any) => String(a.job_id))))
    .filter(id => !partnerIds.has(id))
  let proJobs: any[] = []
  if (proJobIds.length) {
    const { data } = await db.from('jobs').select('*').in('id', proJobIds.slice(0, 500))
    proJobs = data || []
  }

  const toRow = (j: any, key: string) => {
    const list = (apps || []).filter((a: any) => a.job_id === String(j.id))
    return {
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      created_at: j.created_at,
      expires_at: j.expires_at,
      partner_key: key,
      views: j.views ?? j.view_count ?? 0,
      applications: list.length,
      sent: list.filter((a: any) => a.email_status === 'sent').length,
      failed: list.filter((a: any) => a.email_status === 'failed').length,
      viewed: list.filter((a: any) => a.viewed_at).length,
      applicants: list,
    }
  }

  const jobRows = [
    ...(partnerJobs || []).map((j: any) => toRow(j, j.apply_partner)),
    ...proJobs.map((j: any) => toRow(j, 'pro')),
  ].sort((a, b) => {
    const la = a.applicants[0]?.created_at || a.created_at
    const lb = b.applicants[0]?.created_at || b.created_at
    return new Date(lb).getTime() - new Date(la).getTime()
  })

  // Applications for jobs that no longer exist (e.g. job deleted)
  const knownIds = new Set(jobRows.map(j => String(j.id)))
  const orphans = (apps || []).filter((a: any) => !knownIds.has(a.job_id))

  // Apply Pro summary
  const [enabled, sentToday, aiMonth, proRes] = await Promise.all([
    applyProEnabled(db),
    emailsSentToday(db),
    db.from('ai_letters').select('id', { count: 'exact', head: true }).eq('counted', true).gte('created_at', bangkokMonthStart()),
    db.from('apply_pro').select('user_id, email, pro_until, days_total').gt('pro_until', new Date().toISOString()).order('pro_until'),
  ])

  return NextResponse.json({
    partners: partners || [],
    jobs: jobRows,
    orphans,
    pro: {
      enabled,
      sentToday,
      dailyCap: DAILY_EMAIL_CAP,
      aiLettersThisMonth: aiMonth.count || 0,
      members: proRes.data || [],
    },
  })
}
