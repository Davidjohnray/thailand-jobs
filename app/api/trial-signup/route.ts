import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, school } = await req.json()
    if (!name || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Check for duplicate
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/trial_signups?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const existing = await checkRes.json()
    if (existing.length > 0) return NextResponse.json({ error: 'Already signed up' }, { status: 409 })

    // Insert
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/trial_signups`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name, email: email.toLowerCase(), school: school || null, code_sent: false,
      }),
    })

    if (!insertRes.ok) {
      const err = await insertRes.text()
      return NextResponse.json({ error: err }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
