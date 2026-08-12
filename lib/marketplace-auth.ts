// lib/marketplace-auth.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SESSION_KEY = 'marketplace_session'

export type MarketplaceUser = {
  id: string
  email: string | null
}

export type MarketplaceSeller = {
  id: string
  user_id: string
  display_name: string
  trust_tier: string
  max_listing_price: number
  positive_feedback_count: number
  status: string
  contact_promptpay: string
  contact_line_or_phone: string
}

export function setMarketplaceSession(user: MarketplaceUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
}

export function clearMarketplaceSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

export async function getCurrentUser(): Promise<MarketplaceUser | null> {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as MarketplaceUser
  } catch {
    return null
  }
}

export async function getCurrentSeller(): Promise<MarketplaceSeller | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('marketplace_sellers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !data) return null
  return data as MarketplaceSeller
}

export async function getRoleForListing(listingSellerId: string): Promise<'buyer' | 'seller' | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const seller = await getCurrentSeller()
  if (seller && seller.id === listingSellerId) return 'seller'

  return 'buyer'
}

export { supabase }
