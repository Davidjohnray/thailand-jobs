// app/api/thai-friend/register/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password, code } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }
    if (!code || !String(code).trim()) {
      return NextResponse.json({ error: 'Please enter your access code. Need one? Email Admin@jobsinthailand.net.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedCode = String(code).trim().toUpperCase()

    const { data: existing } = await supabase
      .from('thai_friend_users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in instead.' }, { status: 409 })
    }

    // Claim the code first, atomically: only succeeds if it is still unused,
    // so two people can never redeem the same code at the same moment.
    const { data: claimed } = await supabase
      .from('thai_friend_access_codes')
      .update({ status: 'redeemed', redeemed_at: new Date().toISOString() })
      .eq('code', normalizedCode)
      .eq('status', 'unused')
      .select('id, duration_days')

    if (!claimed || claimed.length === 0) {
      return NextResponse.json({ error: 'That code is not valid or has already been used.' }, { status: 400 })
    }

    const codeRow = claimed[0]
    const expiresAt = new Date(Date.now() + codeRow.duration_days * 24 * 60 * 60 * 1000).toISOString()
    const isPaid = codeRow.duration_days > 3
    const passwordHash = await bcrypt.hash(password, 10)

    const { data: newUser, error: insertError } = await supabase
      .from('thai_friend_users')
      .insert({
        email: normalizedEmail,
        password_hash: passwordHash,
        trial_ends_at: expiresAt,
        subscription_status: isPaid ? 'active' : 'trial',
        subscription_expires_at: isPaid ? expiresAt : null,
      })
      .select('id, email')
      .single()

    if (insertError || !newUser) {
      // Account creation failed — give the code back so it isn't wasted.
      await supabase
        .from('thai_friend_access_codes')
        .update({ status: 'unused', redeemed_at: null })
        .eq('id', codeRow.id)
      return NextResponse.json({ error: 'Something went wrong creating your account. Your code has not been used — please try again.' }, { status: 500 })
    }

    await supabase.from('thai_friend_access_codes').update({ redeemed_by: newUser.id }).eq('id', codeRow.id)

    return NextResponse.json({ id: newUser.id, email: newUser.email })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
