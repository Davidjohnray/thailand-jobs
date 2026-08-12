// app/api/marketplace/register/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check if this email is already registered on the marketplace specifically
    const { data: existing } = await supabase
      .from('marketplace_users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists on the marketplace.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const { data: newUser, error: insertError } = await supabase
      .from('marketplace_users')
      .insert({ email: normalizedEmail, password_hash: passwordHash })
      .select('id, email')
      .single()

    if (insertError || !newUser) {
      return NextResponse.json({ error: 'Something went wrong creating your account.' }, { status: 500 })
    }

    return NextResponse.json({ id: newUser.id, email: newUser.email })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
