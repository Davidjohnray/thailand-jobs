import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free CV Builder for Teachers in Thailand 2026',
  description: 'Build a professional teaching CV in minutes. Free PDF download with no browser headers. Templates designed for ESL teachers and international schools in Thailand. Premium plans from ฿299/month.',
  keywords: ['free CV builder Thailand', 'teacher CV builder', 'ESL teacher resume', 'CV builder Thailand', 'teaching CV template', 'free resume builder Thailand', 'international school CV'],
  openGraph: {
    title: 'Free CV Builder for Teachers in Thailand 2026',
    description: 'Build a professional teaching CV in minutes. Free PDF download. Templates designed for ESL teachers and international schools in Thailand.',
    url: 'https://www.jobsinthailand.net/cv-builder',
    siteName: 'Jobs in Thailand',
    type: 'website',
  },
}

export default function CVBuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
