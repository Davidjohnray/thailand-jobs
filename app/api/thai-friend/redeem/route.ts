// app/api/thai-friend/redeem/route.ts
// Lets an existing student add more access time by entering a new code.
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

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json()

    if (!userId || !code || !String(code).trim()) {
      return NextResponse.json({ error: 'Please enter your access code.' }, { status: 400 })
    }

    const normalizedCode = normalizeCode(code)

    const { data: user } = await supabase
      .from('thai_friend_users')
      .select('id, trial_ends_at, subscription_expires_at')
      .eq('id', userId)
      .maybeSingle()

    if (!user) {
      return NextResponse.json({ error: 'Account not found. Please log in again.' }, { status: 404 })
    }

    // Claim the code atomically — only works if it is still unused.
    const { data: claimed } = await supabase
      .from('thai_friend_access_codes')
      .update({ status: 'redeemed', redeemed_at: new Date().toISOString(), redeemed_by: user.id })
      .eq('code', normalizedCode)
      .eq('status', 'unused')
      .select('id, duration_days')

    if (!claimed || claimed.length === 0) {
      return NextResponse.json({ error: 'That code is not valid or has already been used.' }, { status: 400 })
    }

    const codeRow = claimed[0]

    // New expiry counts from whichever is later: now, or their current expiry —
    // so adding a code early never wastes the time they still had left.
    const now = Date.now()
    const currentExpiry = Math.max(
      user.trial_ends_at ? new Date(user.trial_ends_at).getTime() : 0,
      user.subscription_expires_at ? new Date(user.subscription_expires_at).getTime() : 0
    )
    const base = Math.max(now, currentExpiry)
    const newExpiry = new Date(base + codeRow.duration_days * 24 * 60 * 60 * 1000).toISOString()
    const isPaid = codeRow.duration_days > 3

    const { error: updateError } = await supabase
      .from('thai_friend_users')
      .update({
        trial_ends_at: newExpiry,
        subscription_status: isPaid ? 'active' : 'trial',
        subscription_expires_at: isPaid ? newExpiry : user.subscription_expires_at,
      })
      .eq('id', user.id)

    if (updateError) {
      await supabase
        .from('thai_friend_access_codes')
        .update({ status: 'unused', redeemed_at: null, redeemed_by: null })
        .eq('id', codeRow.id)
      return NextResponse.json({ error: 'Something went wrong. Your code has not been used — please try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, expiresAt: newExpiry, days: codeRow.duration_days })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
