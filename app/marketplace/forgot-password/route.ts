// app/api/marketplace/forgot-password/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Uses the same Resend setup as your TEFL director confirmation emails.
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data: user } = await supabase
      .from('marketplace_users')
      .select('id, email')
      .eq('email', normalizedEmail)
      .maybeSingle()

    // Always return success even if the email doesn't exist — prevents this
    // endpoint being used to check which emails are registered.
    if (!user) {
      return NextResponse.json({ ok: true })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    await supabase.from('marketplace_password_resets').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    })

    const resetUrl = `https://www.jobsinthailand.net/marketplace/reset-password?token=${token}`

    await resend.emails.send({
      from: 'Thailand Jobs Marketplace <noreply@jobsinthailand.net>', // adjust to match your verified sending domain
      to: user.email,
      subject: 'Reset your Marketplace password',
      html: `
        <p>You requested a password reset for your Teacher Marketplace account.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
