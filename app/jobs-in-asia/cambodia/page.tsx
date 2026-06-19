import type { Metadata } from 'next'
import CountryJobsPage from '../CountryJobsPage'

export const metadata: Metadata = {
  title: 'Teaching Jobs in Cambodia | ESL & NGO Teaching Jobs',
  description: 'Browse ESL and teaching jobs in Cambodia — Phnom Penh, Siem Reap and more.',
}

export default function CambodiaJobsPage() {
  return (
    <CountryJobsPage
      country="Cambodia"
      flag="🇰🇭"
      subtitle="ESL and NGO teaching positions across Cambodia"
      highlights={['Growing ESL sector', 'Low cost of living', 'Phnom Penh & Siem Reap']}
      slug="cambodia"
    />
  )
}
