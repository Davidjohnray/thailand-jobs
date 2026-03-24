import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 30

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  try {
    const { subject, message } = await req.json()

    const { data, error } = await adminSupabase.auth.admin.listUsers()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const emails = data.users.map((u: any) => u.email).filter(Boolean)
    console.log('Found members:', emails.length)

    let sent = 0
    for (const email of emails) {
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
      const result = await res.json()
      console.log('Email to', email, ':', result)
      if (res.ok) sent++
    }

    return NextResponse.json({ sent, total: emails.length })
  } catch (err: any) {
    console.error('Email error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}