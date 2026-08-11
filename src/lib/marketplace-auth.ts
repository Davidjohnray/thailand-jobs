// lib/marketplace-auth.ts
// Shared helper for getting the logged-in user and their marketplace seller record.
// Uses your existing site-wide Supabase Auth — same accounts as the rest of the site.

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type MarketplaceUser = {
  id: string // auth.users id — used as buyer_id / user_id throughout
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

/**
 * Returns the currently logged-in user, or null if not logged in.
 * Redirect to /marketplace/login if this returns null on a page that requires auth.
 */
export async function getCurrentUser(): Promise<MarketplaceUser | null> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return { id: data.user.id, email: data.user.email ?? null }
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
