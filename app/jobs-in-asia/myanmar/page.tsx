import type { Metadata } from 'next'
import CountryJobsPage from '../CountryJobsPage'

export const metadata: Metadata = {
  title: 'Teaching Jobs in Myanmar | ESL & English Teaching Jobs',
  description: 'Browse ESL and English teaching jobs in Myanmar — Yangon, Mandalay and more.',
}

export default function MyanmarJobsPage() {
  return (
    <CountryJobsPage
      country="Myanmar"
      flag="🇲🇲"
      subtitle="ESL and English teaching positions across Myanmar"
      highlights={['Emerging market', 'Yangon & Mandalay', 'Growing demand']}
      slug="myanmar"
    />
  )
}
