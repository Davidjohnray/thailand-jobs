import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teaching & Expat Jobs in Thailand 2026 | Jobs in Thailand',
  description: 'Browse hundreds of ESL teaching, hospitality, and expat jobs across Thailand. Find jobs in Bangkok, Chiang Mai, Phuket and every province. Updated daily.',
  keywords: ['teaching jobs Thailand', 'ESL jobs Thailand', 'expat jobs Bangkok', 'English teacher Thailand', 'jobs in Thailand 2026', 'work in Thailand', 'Bangkok jobs', 'Chiang Mai jobs'],
  openGraph: {
    title: 'Teaching & Expat Jobs in Thailand 2026',
    description: 'Browse hundreds of ESL teaching, hospitality, and expat jobs across Thailand. Updated daily.',
    url: 'https://www.jobsinthailand.net/jobs',
    siteName: 'Jobs in Thailand',
    type: 'website',
  },
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}