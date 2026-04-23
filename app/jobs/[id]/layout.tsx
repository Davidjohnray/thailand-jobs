import { supabase } from '../../../src/lib/supabase'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, location, salary')
    .eq('id', id)
    .single()

  return {
    title: job ? `${job.title} — ${job.company} | Jobs in Thailand` : 'Jobs in Thailand',
    description: job ? `${job.title} at ${job.company} in ${job.location}. Salary: ${job.salary}.` : 'Find jobs in Thailand',
    openGraph: {
      title: job ? `${job.title} — ${job.company}` : 'Jobs in Thailand',
      description: job ? `${job.title} at ${job.company} in ${job.location}. Salary: ${job.salary}.` : 'Find jobs in Thailand',
      images: [{ url: 'https://www.jobsinthailand.net/og-banner.jpg', width: 1376, height: 768 }],
    },
  }
}

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}