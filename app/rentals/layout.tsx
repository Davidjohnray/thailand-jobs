import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rentals in Thailand — Condos, Houses & Villas',
  description: 'Find rental properties across Thailand — condos, houses, villas and apartments in Bangkok, Chiang Mai, Phuket, Pattaya and more. All budgets, fully furnished options available.',
  keywords: ['rentals Thailand', 'condo Bangkok', 'house for rent Thailand', 'expat rentals Thailand', 'Phuket rentals', 'Chiang Mai rentals', 'Bangkok apartments'],
}

export default function RentalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}