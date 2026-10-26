// SERVER ONLY — helpers for Apply Pro API routes.
import { getSupabaseAdmin } from './supabaseAdmin'
import { AI_MONTHLY_LIMIT } from './applyRules'

export type Db = ReturnType<typeof getSupabaseAdmin>

// Resend's free plan allows 100 emails a day. Keep some room for partner schools and other site emails.
export const DAILY_EMAIL_CAP = Number(process.env.APPLY_DAILY_EMAIL_CAP || 80)

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'thailand2024'

// The logged-in member, from the "Authorization: Bearer <token>" header the site sends
export async function getUserFromRequest(req: Request, db: Db) {
  const h = req.headers.get('authorization') || ''
  const token = h.startsWith('Bearer ') ? h.slice(7).trim() : ''
  if (!token) return null
  const { data, error } = await db.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

// Start of the current month in Thailand time
export function bangkokMonthStart(): string {
  const offset = 7 * 3600 * 1000
  const bkk = new Date(Date.now() + offset)
  return new Date(Date.UTC(bkk.getUTCFullYear(), bkk.getUTCMonth(), 1) - offset).toISOString()
}

// Start of today in UTC (Resend counts its daily limit by UTC day)
export function utcDayStart(): string {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString()
}

export async function emailsSentToday(db: Db): Promise<number> {
  const { count } = await db
    .from('job_applications')
    .select('id', { count: 'exact', head: true })
    .eq('email_status', 'sent')
    .gte('emailed_at', utcDayStart())
  return count || 0
}

export async function applyProEnabled(db: Db): Promise<boolean> {
  const { data } = await db.from('app_settings').select('value').eq('key', 'apply_pro').maybeSingle()
  return (data?.value || 'on') !== 'off'
}

export type Access = {
  enabled: boolean
  isPro: boolean
  proUntil: string | null
  aiUsedThisMonth: number
  aiLimit: number
  aiRemaining: number
  freeTryAvailable: boolean
}

export async function getAccess(db: Db, userId: string): Promise<Access> {
  const [enabled, proRes, aiMonthRes, aiEverRes, freeRes] = await Promise.all([
    applyProEnabled(db),
    db.from('apply_pro').select('pro_until').eq('user_id', userId).maybeSingle(),
    db.from('ai_letters').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('counted', true).gte('created_at', bangkokMonthStart()),
    db.from('ai_letters').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('counted', true),
    db.from('job_applications').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('apply_type', 'free_try').neq('email_status', 'failed'),
  ])
  const proUntil = proRes.data?.pro_until || null
  const isPro = !!proUntil && new Date(proUntil).getTime() > Date.now()
  const aiUsedThisMonth = aiMonthRes.count || 0
  const aiEver = aiEverRes.count || 0
  return {
    enabled,
    isPro,
    proUntil,
    aiUsedThisMonth,
    aiLimit: isPro ? AI_MONTHLY_LIMIT : 1,
    aiRemaining: isPro ? Math.max(0, AI_MONTHLY_LIMIT - aiUsedThisMonth) : (aiEver > 0 ? 0 : 1),
    freeTryAvailable: !isPro && (freeRes.count || 0) === 0,
  }
}

export const fileName = (p: string | null | undefined) =>
  p ? (p.split('/').pop() || '').replace(/^\d+-/, '') : null
