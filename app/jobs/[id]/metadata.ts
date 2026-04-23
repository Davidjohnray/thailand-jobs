import { supabase } from '../../../src/lib/supabase'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, location, description, salary')
    .eq('id', id)
    .single()

  if (!job) return {
    title: 'Job Not Found | Jobs in Thailand',
  }

  return {
    title: `${job.title} — ${job.company} | Jobs in Thailand`,
    description: `${job.title} at ${job.company} in ${job.location}. Salary: ${job.salary}. Apply now on Jobs in Thailand.`,
    openGraph: {
      title: `${job.title} — ${job.company}`,
      description: `${job.title} at ${job.company} in ${job.location}. Salary: ${job.salary}.`,
      images: [
        {
          url: 'https://www.jobsinthailand.net/og-banner.jpg',
          width: 1376,
          height: 768,
          alt: 'Jobs in Thailand',
        }
      ],
    },
  }
}