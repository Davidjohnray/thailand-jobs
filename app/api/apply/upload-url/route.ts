import { NextResponse } from 'next/server'
import { getSupabaseAdmin, APPLY_BUCKET } from '../../../../src/lib/supabaseAdmin'
import { getUserFromRequest } from '../../../../src/lib/applyServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED: Record<string, string[]> = {
  resume: ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp', 'heic'],
  photo: ['png', 'jpg', 'jpeg', 'webp', 'heic', 'gif'],
}

// Gives the browser a one-time private upload link, so files go straight into the private bucket.
// Members' files go in their own folder and are saved for next time; guests' files go in the job's folder.
export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }

  const kind = String(body.kind || '')
  const ext = String(body.ext || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const jobId = String(body.jobId || '').trim()

  if (!ALLOWED[kind]) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  if (!ALLOWED[kind].includes(ext)) {
    return NextResponse.json({ error: kind === 'resume' ? 'Your resume must be a PDF, Word file or image.' : 'Your photo must be an image (JPG, PNG or WEBP).' }, { status: 400 })
  }
  if (!/^[\w-]{1,40}$/.test(jobId)) return NextResponse.json({ error: 'Invalid job' }, { status: 400 })

  const db = getSupabaseAdmin()
  const user = await getUserFromRequest(req, db)

  let path: string
  if (user) {
    path = `members/${user.id}/${Date.now()}-${kind}.${ext}`
  } else {
    // Guests can only upload for partner-school jobs (the only jobs open to guests)
    const { data: job } = await db.from('jobs').select('id, apply_partner').eq('id', jobId).maybeSingle()
    if (!job || !job.apply_partner) return NextResponse.json({ error: 'Please log in to apply for this job.' }, { status: 401 })
    path = `${jobId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}/${kind}.${ext}`
  }

  const { data, error } = await db.storage.from(APPLY_BUCKET).createSignedUploadUrl(path)
  if (error || !data) {
    console.error('upload url failed', error)
    return NextResponse.json({ error: 'Could not prepare the upload. Please try again.' }, { status: 500 })
  }
  return NextResponse.json({ path: data.path || path, token: data.token })
}
