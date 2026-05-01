import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find ESL Teachers in Thailand 2026 | Teacher Directory',
  description: 'Browse profiles of qualified ESL and English teachers available for hire across Thailand. Find teachers in Bangkok, Chiang Mai, Phuket and more. Post your teacher profile for just ฿200.',
  keywords: ['ESL teachers Thailand', 'English teachers Bangkok', 'hire teacher Thailand', 'teacher profiles Thailand', 'find ESL teacher', 'qualified teachers Thailand', 'teacher directory Thailand'],
  openGraph: {
    title: 'Find ESL Teachers in Thailand 2026 | Teacher Directory',
    description: 'Browse profiles of qualified ESL and English teachers available for hire across Thailand.',
    url: 'https://www.jobsinthailand.net/teacher-profile',
    siteName: 'Jobs in Thailand',
    type: 'website',
  },
}

export default function TeacherProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
