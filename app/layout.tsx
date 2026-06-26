import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'
import VisitorCounter from '../components/VisitorCounter'

export const metadata: Metadata = {
  title: {
    default: 'Jobs in Thailand | Teaching, Hospitality & Expat Jobs',
    template: '%s | Jobs in Thailand',
  },
  description: 'Find teaching jobs, hospitality jobs and expat careers across Thailand. Browse hundreds of jobs in Bangkok, Chiang Mai, Phuket and more. Free to join — members see jobs 1 hour early!',
  keywords: ['jobs in Thailand', 'teaching jobs Thailand', 'ESL jobs Thailand', 'expat jobs Thailand', 'Bangkok jobs', 'Chiang Mai jobs', 'Phuket jobs', 'TEFL Thailand', 'work in Thailand'],
  metadataBase: new URL('https://www.jobsinthailand.net'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.jobsinthailand.net',
    siteName: 'Jobs in Thailand',
    title: 'Jobs in Thailand | Teaching, Hospitality & Expat Jobs',
    description: 'Find teaching jobs, hospitality jobs and expat careers across Thailand. Free to join — members see jobs 1 hour early!',
    images: [
      {
        url: 'https://www.jobsinthailand.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jobs in Thailand — Teaching, Hospitality & Expat Jobs',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobs in Thailand | Teaching, Hospitality & Expat Jobs',
    description: 'Find teaching jobs, hospitality jobs and expat careers across Thailand.',
    images: ['https://www.jobsinthailand.net/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
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
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "4cb638c8-5ea4-46ca-9235-a10ffc51428e",
              notifyButton: {
                enable: true,
                text: {
                  'tip.state.unsubscribed': 'Get job notifications',
                  'tip.state.subscribed': 'Subscribed to job alerts',
                  'tip.state.blocked': 'Notifications blocked',
                  'message.prenotify': 'Click to get new job alerts!',
                  'message.action.subscribed': 'Thanks for subscribing!',
                  'message.action.resubscribed': 'You are now subscribed!',
                  'message.action.unsubscribed': 'You will not receive notifications',
                  'dialog.main.title': 'Get Job Alerts',
                  'dialog.main.button.subscribe': 'Subscribe',
                  'dialog.main.button.unsubscribe': 'Unsubscribe',
                  'dialog.blocked.title': 'Unblock Notifications',
                  'dialog.blocked.message': 'Follow these instructions to allow notifications',
                },
              },
              welcomeNotification: {
                title: 'Jobs in Thailand',
                message: 'Thanks for subscribing! You will now get notified when new jobs are posted.',
              },
            });
          });
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