import type { Metadata } from 'next'
import CountryJobsPage from '../CountryJobsPage'

export const metadata: Metadata = {
  title: 'Teaching Jobs in Vietnam | ESL & English Teacher Jobs',
  description: 'Browse ESL and English teaching jobs in Vietnam — Ho Chi Minh City, Hanoi, Da Nang and more.',
}

export default function VietnamJobsPage() {
  return (
    <CountryJobsPage
      country="Vietnam"
      flag="🇻🇳"
      subtitle="ESL and English teaching opportunities across Vietnam"
      highlights={['High demand for native speakers', 'Ho Chi Minh City & Hanoi', 'Competitive local salaries']}
      slug="vietnam"
    />
  )
}
