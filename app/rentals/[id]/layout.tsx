import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, location, description')
    .eq('id', params.id)
    .single()

  if (!job) return { title: 'Job Not Found' }

  return {
    title: `${job.title} at ${job.company} — ${job.location}`,
    description: `${job.title} job at ${job.company} in ${job.location}, Thailand. ${job.description?.slice(0, 150)}...`,
    keywords: [job.title, job.company, job.location, 'jobs Thailand', 'expat jobs'],
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: `${job.title} in ${job.location}, Thailand`,
      url: `https://www.jobsinthailand.net/jobs/${params.id}`,
    }
  }
}

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}