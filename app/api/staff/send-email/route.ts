import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message, sentBy } = await req.json()

    // Validate inputs
    if (!to || !subject || !message || !sentBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Jobs in Thailand Recruitment <recruitment@jobsinthailand.net>',
      to: to,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="white-space: pre-wrap; line-height: 1.6; color: #333;">
${message}
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">
            Jobs in Thailand - Your Gateway to Opportunities<br>
            <a href="https://jobsinthailand.net" style="color: #E85D26;">jobsinthailand.net</a>
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log to database
    await supabase.from('staff_emails').insert([{
      sent_by: sentBy,
      sent_to: to,
      subject: subject,
      message: message
    }])

    return NextResponse.json({ success: true, id: data?.id })

  } catch (err: any) {
    console.error('Send email error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
