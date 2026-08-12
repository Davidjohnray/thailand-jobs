// app/api/marketplace/reset-password/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Missing token or new password.' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const { data: resetRecord, error } = await supabase
      .from('marketplace_password_resets')
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .maybeSingle()

    if (error || !resetRecord) {
      return NextResponse.json({ error: 'This reset link is invalid.' }, { status: 400 })
    }
    if (resetRecord.used) {
      return NextResponse.json({ error: 'This reset link has already been used.' }, { status: 400 })
    }
    if (new Date(resetRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await supabase.from('marketplace_users').update({ password_hash: passwordHash }).eq('id', resetRecord.user_id)
    await supabase.from('marketplace_password_resets').update({ used: true }).eq('id', resetRecord.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
