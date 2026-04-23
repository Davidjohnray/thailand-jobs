import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Duke Language School | Jobs in Thailand Partner',
  description: 'Learn Thai in Thailand with Duke Language School — professional Thai language courses for expats and teachers.',
}

export default function DukeLanguageSchoolPage() {
  redirect('/sponsors/duke-language')
}