// lib/thai-friend-auth.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SESSION_KEY = 'thai_friend_session'

export type ThaiFriendUser = {
  id: string
  email: string
}

export function setThaiFriendSession(user: ThaiFriendUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
}

export function clearThaiFriendSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

export async function getCurrentThaiFriendUser(): Promise<ThaiFriendUser | null> {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ThaiFriendUser
  } catch {
    return null
  }
}

export async function getFullUserRecord(userId: string) {
  const { data } = await supabase.from('thai_friend_users').select('*').eq('id', userId).maybeSingle()
  return data
}

// Access runs until whichever of the two expiry dates is later. Codes update both,
// so this covers free trials and paid time in one check.
export function trialStatus(user: any): { active: boolean; hoursLeft: number } {
  if (!user) return { active: false, hoursLeft: 0 }

  const trialEnd = user.trial_ends_at ? new Date(user.trial_ends_at).getTime() : 0
  const paidEnd = user.subscription_expires_at ? new Date(user.subscription_expires_at).getTime() : 0
  const expiry = Math.max(trialEnd, paidEnd)

  const hoursLeft = Math.max(0, (expiry - Date.now()) / (1000 * 60 * 60))
  return { active: hoursLeft > 0, hoursLeft }
}

export { supabase }
