import { Metadata } from 'next'
import { supabase } from '../../src/lib/supabase'
import WeeklyClient from './WeeklyClient'

export async function generateMetadata(): Promise<Metadata> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const now = new Date().toISOString()

  const { count } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('country', 'Thailand')
    .gte('created_at', sevenDaysAgo)
    .gt('expires_at', now)

  const total = count ?? 0
  const title = `${total} New Jobs This Week | Jobs in Thailand`
  const description = `${total} new teaching and expat jobs posted in Thailand this week. Updated automatically — check back every week for the newest roles.`

  // Weekly cache-buster: changes automatically once a week (no deploy needed),
  // so Facebook/Line/WhatsApp fetch a fresh image each time you re-share this
  // same link, instead of reusing last week's cached banner.
  const weekStamp = new Date().toISOString().slice(0, 10)
  const imageUrl = `https://www.jobsinthailand.net/api/og/weekly?week=${weekStamp}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://www.jobsinthailand.net/weekly',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function WeeklyPage() {
  return <WeeklyClient />
}
