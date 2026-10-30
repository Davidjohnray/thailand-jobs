import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getSupabaseAdmin, SITE_URL } from '../../../src/lib/supabaseAdmin'
import { getUserFromRequest, getAccess, emailsSentToday, DAILY_EMAIL_CAP } from '../../../src/lib/applyServer'
import { proEligibleJob, firstEmail, normaliseVideoLink, USER_DAILY_APPLY_CAP } from '../../../src/lib/applyRules'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FROM = process.env.APPLICATIONS_FROM_EMAIL || 'Jobs in Thailand <applications@jobsinthailand.net>'

const esc = (s: any) =>
  String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

const fail = (error: string, status = 400, code?: string) => NextResponse.json({ error, code }, { status })

export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return fail('Invalid request') }

  // Honeypot: bots fill hidden fields, people don't
  if (body.website) return NextResponse.json({ ok: true, ref: 'JIT-0000' })

  const jobId = String(body.jobId || '').trim()
  const name = String(body.name || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().slice(0, 200)
  const phone = String(body.phone || '').trim().slice(0, 40)
  const nationality = String(body.nationality || '').trim().slice(0, 60)
  const message = String(body.message || '').trim().slice(0, 4000)
  const coverLetter = String(body.coverLetter || '').trim().slice(0, 8000) || null
  const messageTh = String(body.messageTh || '').trim().slice(0, 6000) || null
  const resumePath = String(body.resumePath || '')
  const photoPath = String(body.photoPath || '')
  const video = normaliseVideoLink(body.videoLink)

  if (!jobId || !name || !isEmail(email)) return fail('Please enter your name and a valid email.')
  if (!resumePath || !photoPath) return fail('Your resume and photo are both required.')
  if (!video.ok) return fail(video.error || 'Invalid video link.')

  const db = getSupabaseAdmin()
  const user = await getUserFromRequest(req, db)

  // Uploaded files must be in this job's folder (guests) or the member's own folder
  const prefixes = [`${jobId}/`, ...(user ? [`members/${user.id}/`] : [])]
  for (const p of [resumePath, photoPath]) {
    if (p.includes('..') || !prefixes.some(pre => p.startsWith(pre))) return fail('Invalid file upload.')
  }

  const { data: job } = await db.from('jobs').select('*').eq('id', jobId).maybeSingle()
  if (!job) return fail('This job could not be found.', 404)

  // Which kind of application is this?
  let mode: 'partner' | 'pro' | 'free_try' | null = null
  let partner: any = null
  let toEmail: string | null = null

  if (job.apply_partner) {
    const { data } = await db.from('apply_partners').select('key, name, apply_email, active').eq('key', job.apply_partner).maybeSingle()
    if (data && data.active) { partner = data; mode = 'partner'; toEmail = data.apply_email }
  }

  if (!mode) {
    if (!proEligibleJob(job)) return fail('This job does not accept applications through the site.')
    if (!user) return fail('Please log in to apply through Jobs in Thailand.', 401, 'login')
    const access = await getAccess(db, user.id)
    if (!access.enabled) return fail('One-click apply is paused right now. Please use the employer\'s contact details.', 400, 'off')
    if (access.isPro) mode = 'pro'
    else if (access.freeTryAvailable) mode = 'free_try'
    else return fail('You\'ve used your free applications. Upgrade to Apply Pro to keep applying in one click.', 403, 'upgrade')
    toEmail = firstEmail(job.email)
  }
  if (!toEmail) return fail('This job does not accept applications through the site.')

  // Same person, same job — once only (failed emails don't count, so they can try again)
  let dupQuery = db.from('job_applications').select('id').eq('job_id', String(job.id)).neq('email_status', 'failed').limit(1)
  dupQuery = user ? dupQuery.eq('user_id', user.id) : dupQuery.ilike('email', email)
  const { data: dup } = await dupQuery
  if (dup && dup.length) return fail('You have already applied for this job.', 409, 'duplicate')

  if (user) {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    const { count } = await db.from('job_applications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', since)
    if ((count || 0) >= USER_DAILY_APPLY_CAP) return fail(`You can send up to ${USER_DAILY_APPLY_CAP} applications a day. Please try again tomorrow.`, 429, 'user_limit')
  }

  // Protect the daily email allowance — partner schools always go through
  if (mode !== 'partner' && (await emailsSentToday(db)) >= DAILY_EMAIL_CAP) {
    return fail('One-click apply is busy today. Please use the employer\'s contact details below.', 429, 'daily_limit')
  }

  const viewToken = randomBytes(24).toString('hex')

  const { data: app, error: insertError } = await db
    .from('job_applications')
    .insert([{
      view_token: viewToken,
      job_id: String(job.id),
      partner_key: partner?.key || null,
      apply_type: mode,
      user_id: user?.id || null,
      to_email: toEmail,
      job_title: job.title,
      company: job.company,
      name, email, phone, nationality, message,
      cover_letter: coverLetter,
      message_th: messageTh,
      resume_path: resumePath,
      photo_path: photoPath,
      video_path: null,
      video_link: video.url,
    }])
    .select('id, ref_no')
    .single()

  if (insertError || !app) {
    console.error('apply insert failed', insertError)
    return fail('Something went wrong. Please try again.', 500)
  }

  const ref = `JIT-${app.ref_no}`
  const profileUrl = `${SITE_URL}/applications/${viewToken}`
  const extras = [coverLetter ? 'Cover Letter' : '', video.url ? 'Video' : ''].filter(Boolean)
  const buttonText = `View Resume, Photo${extras.length ? ', ' + extras.join(' &amp; ') : ''}`

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
    ${messageTh ? `<div style="background:#fff8f3;border:1px solid #ffe0cc;border-radius:8px;padding:14px;margin:18px 0;font-size:14px;color:#444;line-height:1.7;white-space:pre-wrap"><div style="color:#E85D26;font-weight:bold;font-size:12px;margin-bottom:6px">ภาษาไทย</div>${esc(messageTh)}</div>` : ''}
    <div style="text-align:center;margin:26px 0 10px">
      <a href="${profileUrl}" style="background:#E85D26;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">${buttonText} &rarr;</a>
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
${message ? '\nMessage:\n' + message + '\n' : ''}${messageTh ? '\nภาษาไทย:\n' + messageTh + '\n' : ''}
View resume, photo${coverLetter ? ', cover letter' : ''}${video.url ? ' and video' : ''}: ${profileUrl}

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
        to: [toEmail],
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

  // Save the member's details so the form is filled in next time
  if (user) {
    const saved: any = { user_id: user.id, full_name: name, phone, nationality, video_link: video.url, updated_at: new Date().toISOString() }
    if (resumePath.startsWith(`members/${user.id}/`)) saved.resume_path = resumePath
    if (photoPath.startsWith(`members/${user.id}/`)) saved.photo_path = photoPath
    await db.from('apply_profiles').upsert([saved], { onConflict: 'user_id' })
  }

  // Pro / free-try applications that failed to email: tell the teacher so they can use the contact details
  if (emailStatus === 'failed' && mode !== 'partner') {
    return fail('Sorry — we couldn\'t send your application just now. Please use the employer\'s contact details below.', 502, 'daily_limit')
  }

  // Partner applications are saved either way; a failed email shows up in your admin stats so you can resend it.
  return NextResponse.json({ ok: true, ref, mode })
}
