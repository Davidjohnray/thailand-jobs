// app/api/french-friend/enter/route.ts
// The code IS the login — a new code creates an account, a used code logs back in.
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function normalizeCode(input: string): string {
  const raw = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (raw.length === 8) return `FF-${raw.slice(0, 4)}-${raw.slice(4)}`
  if (raw.startsWith('FF') && raw.length === 10) return `FF-${raw.slice(2, 6)}-${raw.slice(6)}`
  return raw
}

const INVALID = 'That code is not valid. Please check it, or email Admin@jobsinthailand.net.'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    const normalized = normalizeCode(code)
    if (!normalized) return NextResponse.json({ error: 'Please enter your access code.' }, { status: 400 })

    const { data: row } = await supabase
      .from('french_friend_access_codes')
      .select('id, status, redeemed_by')
      .eq('code', normalized)
      .maybeSingle()

    if (!row) return NextResponse.json({ error: INVALID }, { status: 400 })

    if (row.status === 'redeemed') {
      if (row.redeemed_by) return NextResponse.json({ id: row.redeemed_by, isNew: false })
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    const { data: claimed } = await supabase
      .from('french_friend_access_codes')
      .update({ status: 'redeemed', redeemed_at: new Date().toISOString() })
      .eq('id', row.id)
      .eq('status', 'unused')
      .select('id, duration_days')

    if (!claimed || claimed.length === 0) return NextResponse.json({ error: INVALID }, { status: 400 })

    const codeRow = claimed[0]
    const expiresAt = new Date(Date.now() + codeRow.duration_days * 24 * 60 * 60 * 1000).toISOString()
    const isPaid = codeRow.duration_days > 3

    const { data: newUser, error: insertError } = await supabase
      .from('french_friend_users')
      .insert({
        trial_ends_at: expiresAt,
        subscription_status: isPaid ? 'active' : 'trial',
        subscription_expires_at: isPaid ? expiresAt : null,
      })
      .select('id')
      .single()

    if (insertError || !newUser) {
      await supabase.from('french_friend_access_codes').update({ status: 'unused', redeemed_at: null }).eq('id', codeRow.id)
      return NextResponse.json({ error: 'Something went wrong. Your code has not been used — please try again.' }, { status: 500 })
    }

    await supabase.from('french_friend_access_codes').update({ redeemed_by: newUser.id }).eq('id', codeRow.id)
    return NextResponse.json({ id: newUser.id, isNew: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
