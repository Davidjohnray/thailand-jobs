import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teaching in Thailand Blog 2026 | Tips, Guides & Advice',
  description: 'Read the latest tips, guides and advice for teaching and working in Thailand. Visa guides, salary information, school reviews and expat life in Thailand.',
  keywords: ['teaching in Thailand blog', 'expat life Thailand', 'ESL teacher tips Thailand', 'teaching visa Thailand', 'teacher salary Thailand', 'living in Thailand expat', 'TEFL Thailand guide'],
  openGraph: {
    title: 'Teaching in Thailand Blog 2026 | Tips, Guides & Advice',
    description: 'Read the latest tips, guides and advice for teaching and working in Thailand.',
    url: 'https://www.jobsinthailand.net/blog',
    siteName: 'Jobs in Thailand',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
