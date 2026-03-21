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