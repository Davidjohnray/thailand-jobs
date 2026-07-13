'use client'

import Image from 'next/image'

export default function EssentialTeflBanner() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'banner_click', {
        banner_name: 'essential_tefl',
        banner_location: window.location.pathname,
      })
    }
  }

  return (
    <a
      href="/tefl/essential-tefl"
      onClick={handleClick}
      style={{
        display: 'block',
        width: '100%',
        maxWidth: '320px',
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #2d323c',
        textDecoration: 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '900 / 499', background: '#272b33' }}>
        <Image
          src="/images/essential-tefl-banner.png"
          alt="Essential TEFL - Get TEFL Certified in Bangkok"
          fill
          style={{ objectFit: 'contain', padding: '8px' }}
          sizes="320px"
        />
      </div>
    </a>
  )
}
