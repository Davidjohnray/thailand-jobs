// app/api/french-friend/admin/codes/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function makeCode(): string {
  let out = ''
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < 8; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return `FF-${out.slice(0, 4)}-${out.slice(4)}`
}

function isAuthorised(request: Request): boolean {
  const expected = process.env.FRENCH_FRIEND_ADMIN_PASSWORD
  if (!expected) return false
  return request.headers.get('x-admin-password') === expected
}

export async function GET(request: Request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })

  const { data, error } = await supabase
    .from('french_friend_access_codes')
    .select('id, code, duration_days, status, note, redeemed_at, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ codes: data || [] })
}

export async function POST(request: Request) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })

  try {
    const { count, durationDays, note } = await request.json()
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 50)
    const days = parseInt(durationDays)
    if (!days || days < 1 || days > 366) {
      return NextResponse.json({ error: 'Please choose a duration between 1 and 366 days.' }, { status: 400 })
    }

    const rows = Array.from({ length: n }, () => ({
      code: makeCode(),
      duration_days: days,
      note: note?.trim() || null,
    }))

    const { data, error } = await supabase.from('french_friend_access_codes').insert(rows).select('code, duration_days')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ created: data })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
