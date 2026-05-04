import type { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: 'https://www.jobsinthailand.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jobs in Thailand — Teaching, Hospitality & Expat Jobs',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.jobsinthailand.net/og-image.jpg'],
  },
}

export default function JobDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}