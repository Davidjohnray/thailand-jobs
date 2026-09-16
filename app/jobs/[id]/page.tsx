import { Metadata } from 'next'
import { supabase } from '../../../src/lib/supabase'
import JobDetailClient from './JobDetailClient'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params

  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, location, salary')
    .eq('id', id)
    .single()

  if (!job) {
    return { title: 'Job Not Found | Jobs in Thailand' }
  }

  const title = `${job.title} — ${job.company} | Jobs in Thailand`
  const description = `${job.company} • ${job.location} — ${job.salary}. Apply now on Jobs in Thailand.`

  // Cache-buster: Vercel gives every deployment a unique commit SHA.
  // Adding it to the image URL forces Facebook/Line/WhatsApp to treat the
  // image as "new" on every future deploy, instead of reusing an old cached
  // picture just because the underlying URL looks the same.
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || 'v1'
  const imageUrl = `https://www.jobsinthailand.net/api/og/job/${id}?v=${buildId}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.jobsinthailand.net/jobs/${id}`,
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

export default async function JobDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return <JobDetailClient id={id} />
}
