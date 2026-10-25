// SERVER ONLY — never import this into a 'use client' file.
// Uses the service role key, which can read private tables and files.
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://coldsoilakctfcswqwge.supabase.co'

export const SITE_URL = 'https://www.jobsinthailand.net'
export const APPLY_BUCKET = 'job-applications'

export function getSupabaseAdmin() {
  // Uses the SUPABASE_SERVICE_KEY already set in Vercel (or SUPABASE_SERVICE_ROLE_KEY if added later)
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_KEY is not set in Vercel environment variables')
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } })
}