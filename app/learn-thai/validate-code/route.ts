import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!code) return NextResponse.json({ valid: false, message: 'No code provided.' })

  const { data, error } = await supabase
    .from('learn_thai_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (error || !data) return NextResponse.json({ valid: false, message: 'Code not found.' })
  if (!data.active) return NextResponse.json({ valid: false, message: 'This code has been deactivated.' })
  if (data.expires_at && new Date(data.expires_at) < new Date()) return NextResponse.json({ valid: false, message: 'This code has expired. Please contact us to renew.' })

  // Mark as activated if first use
  if (!data.activated_at) {
    await supabase.from('learn_thai_codes').update({ activated_at: new Date().toISOString() }).eq('code', code.toUpperCase())
  }

  return NextResponse.json({ valid: true, expiry: data.expires_at, plan: data.plan })
}
