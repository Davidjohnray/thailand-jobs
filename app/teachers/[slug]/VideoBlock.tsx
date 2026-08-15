'use client'
import { useState, useEffect } from 'react'

export default function VideoBlock({ videoUrl }: { videoUrl: string | null }) {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('recruiter_email')
    if (saved) setHasAccess(true)
  }, [])

  if (!videoUrl) return null

  if (hasAccess) {
    return (
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
        <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>🎥 Introduction Video</h3>
        <video controls src={videoUrl} style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
      </div>
    )
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
      <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', marginBottom: '12px' }}>🎥 Introduction Video</h3>
      <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '20px', textAlign: 'center', border: '2px dashed #ddd' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
        <p style={{ color: '#555', fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px' }}>Video intro available</p>
        <p style={{ color: '#888', fontSize: '12px', margin: '0 0 12px' }}>Unlock with recruiter access</p>
        <a href="/teachers" style={{ display: 'inline-block', background: '#E85D26', color: 'white', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
          Get Recruiter Access →
        </a>
      </div>
    </div>
  )
}
