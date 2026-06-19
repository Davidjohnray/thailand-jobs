import type { Metadata } from 'next'
import CountryJobsPage from '../CountryJobsPage'

export const metadata: Metadata = {
  title: 'Teaching Jobs in Japan | ALT, Eikaiwa & ESL Jobs',
  description: 'Browse ALT, eikaiwa and English teaching jobs in Japan — Tokyo, Osaka, Kyoto and beyond.',
}

export default function JapanJobsPage() {
  return (
    <CountryJobsPage
      country="Japan"
      flag="🇯🇵"
      subtitle="ALT, eikaiwa and international school positions across Japan"
      highlights={['JET Programme & private schools', 'Tokyo, Osaka & beyond', 'Strong expat community']}
      slug="japan"
    />
  )
}
