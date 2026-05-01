import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free ESL Lesson Plans for Thailand Teachers 2026',
  description: 'Download ready-to-teach ESL lesson plans for Under 5s, Ages 5-6, 7-10 and 11+. Designed for bilingual schools and kindergartens in Thailand. Free and premium plans available.',
  keywords: ['ESL lesson plans Thailand', 'free ESL resources', 'lesson plans kindergarten Thailand', 'ESL teaching materials', 'primary school lesson plans Thailand', 'ESL resources for teachers'],
  openGraph: {
    title: 'Free ESL Lesson Plans for Thailand Teachers 2026',
    description: 'Download ready-to-teach ESL lesson plans for all ages. Designed for bilingual schools and kindergartens in Thailand.',
    url: 'https://www.jobsinthailand.net/esl-resources',
    siteName: 'Jobs in Thailand',
    type: 'website',
  },
}

export default function ESLResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
