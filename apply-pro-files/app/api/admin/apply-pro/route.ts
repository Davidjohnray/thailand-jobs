import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../src/lib/supabaseAdmin'
import { ADMIN_PASSWORD, type Db } from '../../../../src/lib/applyServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function findUserByEmail(db: Db, email: string) {
  const target = email.toLowerCase()
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    const found = data.users.find((u: any) => (u.email || '').toLowerCase() === target)
    if (found) return found
    if (data.users.length < 1000) break
  }
  return null
}

// Admin actions: switch Apply Pro on for a paying member, remove it, or pause Apply Pro for everyone
export async function POST(req: Request) {
  if (req.headers.get('x-admin-password') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const db = getSupabaseAdmin()
  const action = String(body.action || '')

  if (action === 'toggle') {
    const value = body.value === 'off' ? 'off' : 'on'
    await db.from('app_settings').upsert([{ key: 'apply_pro', value, updated_at: new Date().toISOString() }], { onConflict: 'key' })
    return NextResponse.json({ ok: true, enabled: value === 'on' })
  }

  const email = String(body.email || '').trim()
  if (!email) return NextResponse.json({ error: 'Enter the member\'s email' }, { status: 400 })

  const user = await findUserByEmail(db, email)
  if (!user) return NextResponse.json({ error: `No account found for ${email}. They need to register on the site first, with this email.` }, { status: 404 })

  if (action === 'grant') {
    const days = Math.max(1, Math.min(400, Number(body.days) || 30))
    const { data: existing } = await db.from('apply_pro').select('pro_until, days_total').eq('user_id', user.id).maybeSingle()
    const base = Math.max(Date.now(), existing?.pro_until ? new Date(existing.pro_until).getTime() : 0)
    const until = new Date(base + days * 86400000).toISOString()
    const { error } = await db.from('apply_pro').upsert([{
      user_id: user.id,
      email: user.email,
      pro_until: until,
      days_total: (existing?.days_total || 0) + days,
      updated_at: new Date().toISOString(),
    }], { onConflict: 'user_id' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, email: user.email, pro_until: until })
  }

  if (action === 'revoke') {
    await db.from('apply_pro').update({ pro_until: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('user_id', user.id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
