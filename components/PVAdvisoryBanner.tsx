'use client'
import { useRouter } from 'next/navigation'

type Props = {
  size?: number
  location: string
}

export default function PVAdvisoryBanner({ size = 250, location }: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'banner_click', {
        event_category: 'advertising',
        event_label: 'pv_advisory',
        banner_location: location,
      })
    }
    router.push('/expat-services/pv-advisory')
  }

  return (
    <div
      onClick={handleClick}
      style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
    >
      <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
        <img
          src="/pv-advisory-thailand.png"
          alt="P&V Advisory Thailand - Legal Services for Expats"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}
