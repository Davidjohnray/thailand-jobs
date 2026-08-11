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
        event_label: 'advertise_here',
        banner_location: location,
      })
    }
    router.push('/advertise')
  }

  return (
    <div
      onClick={handleClick}
      style={{ cursor: 'pointer', display: 'block' }}
    >
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '12px',
        border: '2px dashed #c9a84c',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        textAlign: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}>
        <div style={{ fontSize: '36px' }}>📢</div>
        <div style={{ color: '#c9a84c', fontWeight: '800', fontSize: '15px' }}>Advertise Here</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: '1.5' }}>Reach 1,000+ visitors daily & 250,000+ expat members</div>
        <div style={{ background: '#c9a84c', color: '#1a1a2e', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', marginTop: '4px' }}>
          From ฿500/month →
        </div>
      </div>
    </div>
  )
}
