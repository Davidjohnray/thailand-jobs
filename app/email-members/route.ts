import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  const { subject, message } = await req.json()

  // Get all users from Supabase Auth
  const { data: { users }, error } = await adminSupabase.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const emails = users.map((u: any) => u.email).filter(Boolean)

  // Send email to each member via Resend
  const results = await Promise.all(emails.map(async (email: string) => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Jobs in Thailand <onboarding@resend.dev>',
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #E85D26; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🇹🇭 Jobs in Thailand</h1>
            </div>
            <div style="background: white; padding: 32px; border: 1px solid #eee;">
              <p style="font-size: 15px; color: #444; line-height: 1.8; white-space: pre-wrap;">${message}</p>
              <div style="text-align: center; margin-top: 32px;">
                <a href="https://www.jobsinthailand.net" style="background: #E85D26; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">View Jobs →</a>
              </div>
            </div>
            <div style="background: #f9f9f9; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #999; font-size: 12px; margin: 0;">You're receiving this because you have a member account at jobsinthailand.net</p>
            </div>
          </div>
        `,
      }),
    })
    return res.ok
  }))

  const sent = results.filter(Boolean).length
  return NextResponse.json({ sent, total: emails.length })
}