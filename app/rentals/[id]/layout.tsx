import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  const { data: property } = await supabase
    .from('properties')
    .select('title, location, area, property_type, price, description')
    .eq('id', id)
    .single()

  if (!property) return { title: 'Property Not Found' }

  return {
    title: `${property.title} — ${property.area ? `${property.area}, ` : ''}${property.location}`,
    description: `${property.property_type} for rent in ${property.location}, Thailand. ฿${property.price?.toLocaleString()}/month. ${property.description?.slice(0, 150)}...`,
    keywords: [property.title, property.location, property.property_type, 'rental Thailand', 'expat rental'],
    openGraph: {
      title: `${property.title} — ${property.location}`,
      description: `${property.property_type} for rent in ${property.location}. ฿${property.price?.toLocaleString()}/month`,
      url: `https://www.jobsinthailand.net/rentals/${id}`,
    }
  }
}

export default function RentalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}