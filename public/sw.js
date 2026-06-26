self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => {})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})