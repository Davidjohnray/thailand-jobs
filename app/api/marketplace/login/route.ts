// app/api/marketplace/login/route.ts
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

    const normalizedEmail = email.trim().toLowerCase()

    const { data: user, error } = await supabase
      .from('marketplace_users')
      .select('id, email, password_hash')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (error || !user) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
    }

    return NextResponse.json({ id: user.id, email: user.email })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
