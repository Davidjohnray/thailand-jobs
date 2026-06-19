'use client'
import Link from 'next/link'

interface CountryCardProps {
  href: string
  flag: string
  name: string
  subtitle: string
  highlight: string
}

export default function CountryCard({ href, flag, name, subtitle, highlight }: CountryCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px 20px',
          border: '1px solid #eee',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'box-shadow 0.15s, transform 0.15s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'
          el.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.boxShadow = 'none'
          el.style.transform = 'translateY(0)'
        }}
      >
        <span style={{ fontSize: '48px', lineHeight: '1' }}>{flag}</span>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>
            {name}
          </h2>
          <p style={{ fontSize: '13px', color: '#888', margin: '0 0 10px' }}>
            {subtitle}
          </p>
          <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: '1.5' }}>
            {highlight}
          </p>
        </div>
        <span style={{
          marginTop: '4px',
          background: '#E85D26',
          color: 'white',
          fontSize: '13px',
          fontWeight: 'bold',
          padding: '6px 16px',
          borderRadius: '6px',
        }}>
          View Jobs →
        </span>
      </div>
    </Link>
  )
}
