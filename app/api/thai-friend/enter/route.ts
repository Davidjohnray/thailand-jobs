// app/api/thai-friend/enter/route.ts
// The code IS the login.
//  - A brand-new code creates an account and starts the clock.
//  - A code that has already been used logs back in to the account that used it.
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Accepts "tf-k7m2-qx9p", "TFK7M2QX9P", "k7m2 qx9p" etc. and returns "TF-K7M2-QX9P".
function normalizeCode(input: string): string {
  const raw = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (raw.length === 8) return `TF-${raw.slice(0, 4)}-${raw.slice(4)}`
  if (raw.startsWith('TF') && raw.length === 10) return `TF-${raw.slice(2, 6)}-${raw.slice(6)}`
  return raw
}

const INVALID = 'That code is not valid. Please check it, or email Admin@jobsinthailand.net.'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    const normalized = normalizeCode(code)

    if (!normalized) {
      return NextResponse.json({ error: 'Please enter your access code.' }, { status: 400 })
    }

    const { data: row } = await supabase
      .from('thai_friend_access_codes')
      .select('id, status, redeemed_by')
      .eq('code', normalized)
      .maybeSingle()

    if (!row) {
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    // Already used: this is somebody coming back — log them in to their account.
    if (row.status === 'redeemed') {
      if (row.redeemed_by) {
        return NextResponse.json({ id: row.redeemed_by, isNew: false })
      }
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    // Unused: claim it atomically, so two people can never start an account from the same code.
    const { data: claimed } = await supabase
      .from('thai_friend_access_codes')
      .update({ status: 'redeemed', redeemed_at: new Date().toISOString() })
      .eq('id', row.id)
      .eq('status', 'unused')
      .select('id, duration_days')

    if (!claimed || claimed.length === 0) {
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    const codeRow = claimed[0]
    const expiresAt = new Date(Date.now() + codeRow.duration_days * 24 * 60 * 60 * 1000).toISOString()
    const isPaid = codeRow.duration_days > 3

    const { data: newUser, error: insertError } = await supabase
      .from('thai_friend_users')
      .insert({
        trial_ends_at: expiresAt,
        subscription_status: isPaid ? 'active' : 'trial',
        subscription_expires_at: isPaid ? expiresAt : null,
      })
      .select('id')
      .single()

    if (insertError || !newUser) {
      // Give the code back so it isn't wasted.
      await supabase
        .from('thai_friend_access_codes')
        .update({ status: 'unused', redeemed_at: null })
        .eq('id', codeRow.id)
      return NextResponse.json({ error: 'Something went wrong. Your code has not been used — please try again.' }, { status: 500 })
    }

    await supabase.from('thai_friend_access_codes').update({ redeemed_by: newUser.id }).eq('id', codeRow.id)

    return NextResponse.json({ id: newUser.id, isNew: true })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
