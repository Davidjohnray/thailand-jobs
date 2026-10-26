import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../src/lib/supabaseAdmin'
import { getUserFromRequest } from '../../../../src/lib/applyServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Called by the school's application page after someone has had it open for a few seconds in a real browser.
// Email virus scanners don't run this, so they don't count as a view.
export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ ok: false }) }
  const token = String(body.token || '')
  if (token.length < 32) return NextResponse.json({ ok: false })

  const db = getSupabaseAdmin()
  const { data: app } = await db
    .from('job_applications')
    .select('id, user_id, emailed_at, viewed_at, view_count')
    .eq('view_token', token)
    .maybeSingle()
  if (!app) return NextResponse.json({ ok: false })

  // The teacher opening their own application doesn't count
  const user = await getUserFromRequest(req, db)
  if (user && app.user_id && user.id === app.user_id) return NextResponse.json({ ok: true, skipped: 'owner' })

  // Ignore anything in the first minute after sending (link checkers)
  if (app.emailed_at && Date.now() - new Date(app.emailed_at).getTime() < 60 * 1000) {
    return NextResponse.json({ ok: true, skipped: 'too_soon' })
  }

  await db
    .from('job_applications')
    .update({ viewed_at: app.viewed_at || new Date().toISOString(), view_count: (app.view_count || 0) + 1 })
    .eq('id', app.id)

  return NextResponse.json({ ok: true })
}
