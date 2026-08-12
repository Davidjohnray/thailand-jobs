// lib/marketplace-auth.ts
// Fully separate marketplace authentication — independent from your main site's
// Supabase Auth accounts. Uses its own marketplace_users table, with password
// hashing handled server-side via /api/marketplace/register and /api/marketplace/login.
//
// Session is kept simple (matches the pattern already used for your admin panels):
// after a successful login/register, the user's id + email are stored in localStorage.
// This is NOT a secure server-verified session (no expiry, no token signing) — fine
// for a low-stakes marketplace, but not equivalent to a real auth session. Worth
// upgrading later (e.g. signed JWT in an httpOnly cookie) if this needs to be hardened.

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

/** Call this after a successful register/login API response to store the session. */
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

/**
 * Returns the currently logged-in marketplace user, or null if not logged in.
 * Redirect to /marketplace/login if this returns null on a page that requires auth.
 */
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

/**
 * Returns the seller record for the currently logged-in user, if they have one.
 * Returns null if they're not logged in, or haven't applied to be a seller.
 */
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

/**
 * Determines whether the current user is the buyer or seller for a given listing's messages.
 * Pass the listing's seller_id (from marketplace_listings.seller_id, which references marketplace_sellers.id).
 */
export async function getRoleForListing(listingSellerId: string): Promise<'buyer' | 'seller' | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const seller = await getCurrentSeller()
  if (seller && seller.id === listingSellerId) return 'seller'

  return 'buyer'
}

export { supabase }
