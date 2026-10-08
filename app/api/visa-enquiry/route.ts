import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const FROM = 'Jobs in Thailand <applications@jobsinthailand.net>'
const NOTIFY_EMAIL = process.env.VISA_ENQUIRY_EMAIL || 'Admin@jobsinthailand.net'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real people never fill this hidden field
  if (body?.website) return NextResponse.json({ ref: 'VISA-0000' })

  const f = {
    name: clean(body?.name, 120),
    email: clean(body?.email, 200),
    whatsapp: clean(body?.whatsapp, 40),
    line_id: clean(body?.lineId, 60),
    preferred_contact: clean(body?.preferredContact, 20),
    nationality: clean(body?.nationality, 60),
    current_visa: clean(body?.currentVisa, 60),
    in_thailand: clean(body?.inThailand, 20),
    marriage_status: clean(body?.marriageStatus, 60),
    province: clean(body?.province, 60),
    is_teacher: clean(body?.isTeacher, 20),
    message: clean(body?.message, 2000),
  }

  if (!f.name || !EMAIL_RE.test(f.email)) {
    return NextResponse.json({ error: 'Please enter your name and a valid email address.' }, { status: 400 })
  }
  if (body?.consent !== true) {
    return NextResponse.json({ error: 'Please tick the consent box.' }, { status: 400 })
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const row: Record<string, string | null> = { service: 'marriage-visa' }
  for (const [k, v] of Object.entries(f)) row[k] = v || null

  const { data, error } = await db.from('visa_enquiries').insert(row).select('ref').single()
  if (error || !data) {
    console.error('Visa enquiry insert failed', error)
    return NextResponse.json({ error: 'We could not save your details. Please try again.' }, { status: 500 })
  }

  // One notification email to you (counts as 1 against Resend's daily limit)
  if (process.env.RESEND_API_KEY) {
    const rows: [string, string][] = [
      ['Name', f.name], ['Email', f.email], ['WhatsApp', f.whatsapp], ['LINE', f.line_id],
      ['Preferred contact', f.preferred_contact], ['Nationality', f.nationality],
      ['Current visa', f.current_visa], ['In Thailand now', f.in_thailand],
      ['Marriage', f.marriage_status], ['Province', f.province], ['Teacher', f.is_teacher],
    ]
    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
  <h2 style="margin:0 0 4px">New marriage visa enquiry</h2>
  <p style="color:#666;margin:0 0 16px">Reference ${data.ref}</p>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    ${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#666;width:40%">${k}</td><td style="padding:6px 8px;border-bottom:1px solid #eee"><strong>${esc(v)}</strong></td></tr>`).join('')}
  </table>
  ${f.message ? `<p style="background:#f7f7f7;padding:12px 14px;border-radius:8px;white-space:pre-wrap;font-size:14px;margin-top:16px">${esc(f.message)}</p>` : ''}
  <p style="font-size:12px;color:#999;margin-top:20px">Saved in Supabase → visa_enquiries. Reply to this email to contact the person directly.</p>
</div>`
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [NOTIFY_EMAIL],
          reply_to: f.email,
          subject: `Marriage visa enquiry: ${f.name} (${data.ref})`,
          html,
        }),
      })
      if (!res.ok) console.error('Resend error', res.status, await res.text())
    } catch (err) {
      console.error('Resend request failed', err)
    }
  }

  // Count it on the live-stats page
  await db.rpc('increment_daily_stat', { p_scope: 'visa-marriage', p_metric: 'clicks' }).then(() => {}, () => {})

  return NextResponse.json({ ref: data.ref })
}
