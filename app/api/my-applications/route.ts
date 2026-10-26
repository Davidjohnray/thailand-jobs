import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../src/lib/supabaseAdmin'
import { getUserFromRequest, getAccess } from '../../../src/lib/applyServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// The logged-in member's own applications, for the My Applications page
export async function GET(req: Request) {
  const db = getSupabaseAdmin()
  const user = await getUserFromRequest(req, db)
  if (!user) return NextResponse.json({ error: 'Please log in' }, { status: 401 })

  const [access, appsRes] = await Promise.all([
    getAccess(db, user.id),
    db.from('job_applications')
      .select('id, ref_no, job_id, job_title, company, apply_type, email_status, created_at, viewed_at, view_count')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(300),
  ])

  return NextResponse.json({ access, applications: appsRes.data || [] })
}
