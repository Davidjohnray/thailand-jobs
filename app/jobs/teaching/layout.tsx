import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teaching Jobs in Thailand',
  description: 'Find ESL and teaching jobs in Thailand. International schools, language centres, universities and private tutoring across Bangkok, Chiang Mai, Phuket and all Thai provinces.',
  keywords: ['teaching jobs Thailand', 'ESL jobs Thailand', 'TEFL Thailand', 'English teacher Thailand', 'international school Thailand', 'language teacher Bangkok'],
}

export default function TeachingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}