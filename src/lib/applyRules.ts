// Shared Apply Pro settings and rules — safe to import in both client and server files.

export const PRO_PRICE_30_DAYS = 99
export const PRO_PRICE_6_MONTHS = 499
export const AI_MONTHLY_LIMIT = 20       // AI applications a month for Apply Pro members
export const AI_FREE_REWRITES = 2        // free "try again" rewrites per job
export const USER_DAILY_APPLY_CAP = 25   // applications per member per 24 hours
export const APPLY_BUCKET = 'job-applications'

export const ARNA_COMPANY = 'Arna Education and Services LTD.'

// Employers that keep their own system and never get the Apply Pro form
const EXCLUDED_COMPANIES = ['teach bridge', 'teachbridge']

export function isExcludedCompany(company: any): boolean {
  const c = String(company || '').toLowerCase()
  return EXCLUDED_COMPANIES.some(x => c.includes(x))
}

export const isEmail = (s: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim())

// Some listings have two emails or extra text in the email field — take the first real address
export function firstEmail(s: any): string | null {
  const m = String(s || '').match(/[^\s@,;<>()]+@[^\s@,;<>()]+\.[a-zA-Z]{2,}/)
  return m ? m[0] : null
}

// A job can use the Apply Pro form when it has an email and isn't a partner / ARNA / excluded employer
export function proEligibleJob(job: any): boolean {
  if (!job) return false
  if (job.apply_partner) return false
  if (job.company === ARNA_COMPANY) return false
  if (isExcludedCompany(job.company)) return false
  return !!firstEmail(job.email)
}

const VIDEO_HOSTS = ['youtube.com', 'youtu.be', 'drive.google.com', 'dropbox.com', 'vimeo.com', 'loom.com', 'onedrive.live.com', '1drv.ms']

export function normaliseVideoLink(raw: any): { ok: boolean; url: string | null; error?: string } {
  const s = String(raw || '').trim()
  if (!s) return { ok: true, url: null }
  let u: URL
  try { u = new URL(s.startsWith('http') ? s : `https://${s}`) } catch { return { ok: false, url: null, error: 'Your video link doesn\'t look right. Paste the full link, e.g. https://youtu.be/…' } }
  const host = u.hostname.replace(/^www\.|^m\./, '')
  if (!VIDEO_HOSTS.some(h => host === h || host.endsWith('.' + h))) {
    return { ok: false, url: null, error: 'Please use a YouTube, Google Drive, Dropbox, Vimeo, Loom or OneDrive link for your video.' }
  }
  u.protocol = 'https:'
  return { ok: true, url: u.toString().slice(0, 500) }
}

export function youtubeId(url: any): string | null {
  const s = String(url || '')
  const m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

export const isDriveLink = (url: any) => /drive\.google\.com/i.test(String(url || ''))

// What /api/apply-pro/status returns
export type ApplyLetter = {
  id?: string
  job_id?: string
  job_title?: string
  company?: string
  email_subject?: string
  message: string
  cover_letter?: string
  message_th?: string
  chat_message?: string
  created_at?: string
}

export type ApplyStatus = {
  loggedIn: boolean
  enabled: boolean
  email?: string
  isPro?: boolean
  proUntil?: string | null
  aiUsedThisMonth?: number
  aiLimit?: number
  aiRemaining?: number
  freeTryAvailable?: boolean
  profile?: {
    full_name: string
    phone: string
    nationality: string
    video_link: string
    about: string
    resume_path: string | null
    resume_name: string | null
    photo_path: string | null
    photo_name: string | null
    photo_url: string | null
  } | null
  letters?: ApplyLetter[]
}

export const fmtDate = (d: any) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
export const fmtDateTime = (d: any) =>
  d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''
