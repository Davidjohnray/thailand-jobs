import type { Metadata } from 'next'
import CountryJobsPage from '../CountryJobsPage'

export const metadata: Metadata = {
  title: 'Teaching Jobs in China | ESL & International School Jobs',
  description: 'Browse ESL and international school teaching jobs in China — Shanghai, Beijing, Shenzhen and more.',
}

export default function ChinaJobsPage() {
  return (
    <CountryJobsPage
      country="China"
      flag="🇨🇳"
      subtitle="ESL and international school positions across China"
      highlights={['Huge job market', 'Shanghai & Beijing', 'International schools']}
      slug="china"
    />
  )
}
