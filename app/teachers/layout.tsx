import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Private Teachers in Thailand',
  description: 'Find qualified private teachers in Thailand for English, maths, languages and more. Online or in person. List your teaching profile for just 200 THB — one time, listed forever!',
  keywords: ['private teacher Thailand', 'English tutor Bangkok', 'TEFL teacher Thailand', 'online teacher Thailand', 'private tutor Chiang Mai'],
}

export default function TeachersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}