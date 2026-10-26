import { NextResponse } from 'next/server'
import { getSupabaseAdmin, APPLY_BUCKET } from '../../../../src/lib/supabaseAdmin'
import { getUserFromRequest, getAccess, applyProEnabled, fileName } from '../../../../src/lib/applyServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Everything the apply form needs to know about the current visitor, in one call
export async function GET(req: Request) {
  const db = getSupabaseAdmin()
  const user = await getUserFromRequest(req, db)

  if (!user) {
    return NextResponse.json({ loggedIn: false, enabled: await applyProEnabled(db) })
  }

  const [access, profileRes, lettersRes] = await Promise.all([
    getAccess(db, user.id),
    db.from('apply_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    db.from('ai_letters')
      .select('id, job_id, job_title, company, message, cover_letter, message_th, chat_message, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const p: any = profileRes.data
  let photoUrl: string | null = null
  if (p?.photo_path) {
    const { data } = await db.storage.from(APPLY_BUCKET).createSignedUrl(p.photo_path, 3600)
    photoUrl = data?.signedUrl || null
  }

  return NextResponse.json({
    loggedIn: true,
    email: user.email,
    ...access,
    profile: p ? {
      full_name: p.full_name || '',
      phone: p.phone || '',
      nationality: p.nationality || '',
      video_link: p.video_link || '',
      about: p.about || '',
      resume_path: p.resume_path || null,
      resume_name: fileName(p.resume_path),
      photo_path: p.photo_path || null,
      photo_name: fileName(p.photo_path),
      photo_url: photoUrl,
    } : null,
    letters: lettersRes.data || [],
  })
}
