import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { name, email, school } = await req.json()
    if (!name || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const { data: existing } = await supabase
      .from('trial_signups')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existing) return NextResponse.json({ error: 'Already signed up' }, { status: 409 })

    const { error } = await supabase.from('trial_signups').insert([{
      name, email: email.toLowerCase(), school: school || null,
      created_at: new Date().toISOString(), code_sent: false,
    }])

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
