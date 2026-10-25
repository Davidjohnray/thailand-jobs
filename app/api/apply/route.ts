import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getSupabaseAdmin, SITE_URL } from '../../../src/lib/supabaseAdmin'

export const runtime = 'nodejs'

const FROM = process.env.APPLICATIONS_FROM_EMAIL || 'Jobs in Thailand <applications@jobsinthailand.net>'

const esc = (s: any) =>
  String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }

  // Honeypot: bots fill hidden fields, people don't
  if (body.website) return NextResponse.json({ ok: true, ref: 'JIT-0000' })

  const jobId = String(body.jobId || '').trim()
  const name = String(body.name || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().slice(0, 200)
  const phone = String(body.phone || '').trim().slice(0, 40)
  const nationality = String(body.nationality || '').trim().slice(0, 60)
  const message = String(body.message || '').trim().slice(0, 3000)
  const resumePath = String(body.resumePath || '')
  const photoPath = String(body.photoPath || '')
  const videoPath = body.videoPath ? String(body.videoPath) : null

  if (!jobId || !name || !isEmail(email)) {
    return NextResponse.json({ error: 'Please enter your name and a valid email.' }, { status: 400 })
  }
  if (!resumePath || !photoPath) {
    return NextResponse.json({ error: 'Your resume and photo are both required.' }, { status: 400 })
  }
  // Uploaded files must belong to this job's folder
  for (const p of [resumePath, photoPath, videoPath].filter(Boolean) as string[]) {
    if (!p.startsWith(`${jobId}/`) || p.includes('..')) {
      return NextResponse.json({ error: 'Invalid file upload.' }, { status: 400 })
    }
  }

  const db = getSupabaseAdmin()

  const { data: job } = await db
    .from('jobs')
    .select('id, title, company, location, apply_partner')
    .eq('id', jobId)
    .single()
  if (!job || !job.apply_partner) {
    return NextResponse.json({ error: 'This job does not accept applications through the site.' }, { status: 400 })
  }

  const { data: partner } = await db
    .from('apply_partners')
    .select('key, name, apply_email, active')
    .eq('key', job.apply_partner)
    .single()
  if (!partner || !partner.active) {
    return NextResponse.json({ error: 'This job does not accept applications through the site.' }, { status: 400 })
  }

  const viewToken = randomBytes(24).toString('hex')

  const { data: app, error: insertError } = await db
    .from('job_applications')
    .insert([{
      view_token: viewToken,
      job_id: String(job.id),
      partner_key: partner.key,
      job_title: job.title,
      company: job.company,
      name, email, phone, nationality, message,
      resume_path: resumePath,
      photo_path: photoPath,
      video_path: videoPath,
    }])
    .select('id, ref_no')
    .single()

  if (insertError || !app) {
    console.error('apply insert failed', insertError)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  const ref = `JIT-${app.ref_no}`
  const profileUrl = `${SITE_URL}/applications/${viewToken}`

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #eee;border-radius:10px;overflow:hidden">
  <div style="background:#1a1a2e;padding:20px 24px">
    <div style="color:#E85D26;font-weight:bold;font-size:13px;letter-spacing:1px">NEW APPLICATION VIA</div>
    <div style="color:#ffffff;font-weight:bold;font-size:22px">Jobs in Thailand</div>
  </div>
  <div style="padding:24px">
    <p style="margin:0 0 6px;color:#888;font-size:13px">Position</p>
    <p style="margin:0 0 18px;color:#1a1a2e;font-size:18px;font-weight:bold">${esc(job.title)}${job.location ? ' &ndash; ' + esc(job.location) : ''}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333">
      <tr><td style="padding:6px 0;color:#888;width:120px">Name</td><td style="padding:6px 0;font-weight:bold">${esc(name)}</td></tr>
      <tr><td style="padding:6px 0;color:#888">Email</td><td style="padding:6px 0">${esc(email)}</td></tr>
      ${phone ? `<tr><td style="padding:6px 0;color:#888">Phone</td><td style="padding:6px 0">${esc(phone)}</td></tr>` : ''}
      ${nationality ? `<tr><td style="padding:6px 0;color:#888">Nationality</td><td style="padding:6px 0">${esc(nationality)}</td></tr>` : ''}
      <tr><td style="padding:6px 0;color:#888">Reference</td><td style="padding:6px 0">${ref}</td></tr>
    </table>
    ${message ? `<div style="background:#f9f9f9;border-radius:8px;padding:14px;margin:18px 0;font-size:14px;color:#444;line-height:1.6;white-space:pre-wrap">${esc(message)}</div>` : ''}
    <div style="text-align:center;margin:26px 0 10px">
      <a href="${profileUrl}" style="background:#E85D26;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">View Resume, Photo${videoPath ? ' &amp; Video' : ''} &rarr;</a>
    </div>
    <p style="font-size:13px;color:#888;text-align:center;margin:12px 0 0">Press <strong>Reply</strong> to contact ${esc(name)} directly.</p>
  </div>
  <div style="background:#f5f5f5;padding:14px 24px;font-size:12px;color:#999;text-align:center">
    This candidate applied through <a href="${SITE_URL}" style="color:#E85D26;text-decoration:none">www.jobsinthailand.net</a>
  </div>
</div>`

  const text =
`New application via Jobs in Thailand (${ref})

Position: ${job.title}${job.location ? ' - ' + job.location : ''}
Name: ${name}
Email: ${email}${phone ? '\nPhone: ' + phone : ''}${nationality ? '\nNationality: ' + nationality : ''}
${message ? '\nMessage:\n' + message + '\n' : ''}
View resume, photo${videoPath ? ' and video' : ''}: ${profileUrl}

Reply to this email to contact the candidate directly.
--
This candidate applied through www.jobsinthailand.net`

  let emailStatus = 'sent'
  let emailError: string | null = null
  try {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [partner.apply_email],
        reply_to: email,
        subject: `New application: ${job.title} — ${name} (${ref}) via Jobs in Thailand`,
        html,
        text,
      }),
    })
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
  } catch (e: any) {
    emailStatus = 'failed'
    emailError = String(e?.message || e).slice(0, 500)
    console.error('apply email failed', emailError)
  }

  await db
    .from('job_applications')
    .update({ email_status: emailStatus, email_error: emailError, emailed_at: emailStatus === 'sent' ? new Date().toISOString() : null })
    .eq('id', app.id)

  // The application is saved either way; a failed email shows up in your admin stats so you can resend it.
  return NextResponse.json({ ok: true, ref })
}
