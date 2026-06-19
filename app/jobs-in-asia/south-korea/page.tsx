import type { Metadata } from 'next'
import CountryJobsPage from '../CountryJobsPage'

export const metadata: Metadata = {
  title: 'Teaching Jobs in South Korea | EPIK, Hagwon & ESL Jobs',
  description: 'Browse EPIK, hagwon and English teaching jobs in South Korea — Seoul, Busan and more.',
}

export default function SouthKoreaJobsPage() {
  return (
    <CountryJobsPage
      country="South Korea"
      flag="🇰🇷"
      subtitle="EPIK, hagwon and international school positions across South Korea"
      highlights={['Competitive salaries', 'Free accommodation', 'Seoul & Busan']}
      slug="south-korea"
    />
  )
}
