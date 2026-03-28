import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Jobs in Thailand',
  description: 'Browse all jobs in Thailand — teaching, hospitality, technology, finance and more. New jobs added daily across Bangkok, Chiang Mai, Phuket and all provinces.',
  keywords: ['jobs Thailand', 'work in Thailand', 'expat jobs', 'Bangkok jobs', 'teaching jobs', 'hospitality jobs Thailand'],
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}