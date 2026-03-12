import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'
import VisitorCounter from '../components/VisitorCounter'

export const metadata: Metadata = {
  title: 'Thailand Jobs',
  description: 'Find teaching and other jobs in Thailand',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E85D26" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Thailand Jobs" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QM05PNHVW4"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QM05PNHVW4');
        `}} />
      </head>
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f9f9f9' }}>
        <Navbar />
        {children}
        <VisitorCounter />
      </body>
    </html>
  )
}