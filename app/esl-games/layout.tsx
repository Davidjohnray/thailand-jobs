import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free ESL Classroom Games for Thailand Teachers 2026',
  description: 'Play free ESL classroom games for primary school teachers in Thailand. Category Race, live multiplayer games and more. Works on any device, zero prep required.',
  keywords: ['free ESL games', 'ESL classroom games Thailand', 'primary school ESL games', 'live classroom games', 'ESL games for kids', 'free teaching games Thailand'],
  openGraph: {
    title: 'Free ESL Classroom Games for Thailand Teachers 2026',
    description: 'Play free ESL classroom games for primary school teachers in Thailand. Zero prep, works on any device.',
    url: 'https://www.jobsinthailand.net/esl-games',
    siteName: 'Jobs in Thailand',
    type: 'website',
  },
}

export default function ESLGamesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
