import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jobs in Thailand — Hospitality, Tech, Finance & More',
  description: 'Find hospitality, technology, tourism, finance and marketing jobs in Thailand. Browse expat-friendly careers across Bangkok, Phuket, Chiang Mai and beyond.',
  keywords: ['hospitality jobs Thailand', 'hotel jobs Thailand', 'tech jobs Bangkok', 'finance jobs Thailand', 'marketing jobs Thailand', 'expat jobs Bangkok'],
}

export default function OtherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}