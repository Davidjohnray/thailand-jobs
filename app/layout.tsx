import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'
import VisitorCounter from '../components/VisitorCounter'

export const metadata: Metadata = {
  title: 'Thailand Jobs',
  description: 'Find jobs in Thailand',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f9f9f9' }}>
        <Navbar />
        {children}
        <VisitorCounter />
      </body>
    </html>
  )
}