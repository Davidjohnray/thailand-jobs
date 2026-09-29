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
        event_label: 'world_tesol_academy',
        banner_location: location,
      })
    }
    router.push('/partners/world-tesol-academy')
  }

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer', display: 'block' }}>
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%)',
        border: '2px solid #f59e0b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        textAlign: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        boxShadow: '0 4px 16px rgba(45,27,105,0.3)',
      }}>
        <img src="/world-tesol-academy.png" alt="World TESOL Academy" style={{ width: '80px', height: '80px', objectFit: 'contain', background: 'white', borderRadius: '10px', padding: '6px' }} />
        <div style={{ color: '#f59e0b', fontWeight: '800', fontSize: '13px', lineHeight: '1.3' }}>World TESOL Academy</div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', lineHeight: '1.4' }}>Award-Winning Accredited TESOL/TEFL Certificate</div>
        <div style={{ background: '#f59e0b', color: '#1a1a2e', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '900' }}>
          Enroll From $36 →
        </div>
      </div>
    </div>
  )
}
