'use client'
import { useState, useEffect } from 'react'

export default function ContactBlock({ teacher, variant = 'dark' }: { teacher: any, variant?: 'dark' | 'orange' | 'professional' | 'friendly' }) {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('recruiter_email')
    if (saved) setHasAccess(true)
  }, [])

  if (!hasAccess) return (
    <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', border: '2px dashed #ddd', textAlign: 'center' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
      <p style={{ color: '#555', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' }}>Contact details are locked</p>
      <p style={{ color: '#888', fontSize: '13px', margin: '0 0 12px' }}>Recruiter access required to view LINE, WhatsApp and email</p>
      <a href="/teachers"
        style={{ display: 'inline-block', background: '#E85D26', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
        Login as Recruiter →
      </a>
    </div>
  )

  if (variant === 'friendly') return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {teacher.line_id && <a href={`https://line.me/ti/p/~${teacher.line_id}`} target="_blank" rel="noopener noreferrer" style={{ background: '#06C755', color: 'white', padding: '14px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>💬 LINE</a>}
      {teacher.whatsapp && <a href={`https://wa.me/${teacher.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '14px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>📱 WhatsApp</a>}
      {teacher.email && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href={`https://mail.google.com/mail/?view=cm&to=${teacher.email}&su=Private Lesson Enquiry`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#E85D26', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>📧 Email via Gmail</a>
          <a href={`mailto:${teacher.email}?subject=Private Lesson Enquiry`} style={{ display: 'block', background: '#2D6BE4', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>📨 Open Email App</a>
        </div>
      )}
      {teacher.facebook && <a href={teacher.facebook} target="_blank" rel="noopener noreferrer" style={{ background: '#1877F2', color: 'white', padding: '14px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>👍 Facebook</a>}
    </div>
  )

  const btnStyle = (bg: string, color = 'white', radius = '8px') => ({
    display: 'block', background: bg, color, padding: '12px', borderRadius: radius,
    textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' as const
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {teacher.line_id && <a href={`https://line.me/ti/p/~${teacher.line_id}`} target="_blank" rel="noopener noreferrer" style={btnStyle('#06C755')}>💬 Contact on LINE</a>}
      {teacher.whatsapp && <a href={`https://wa.me/${teacher.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={btnStyle('#25D366')}>📱 WhatsApp</a>}
      {teacher.email && <a href={`mailto:${teacher.email}`} style={btnStyle(variant === 'orange' ? 'white' : '#2D6BE4', variant === 'orange' ? '#E85D26' : 'white')}>📧 {variant === 'orange' ? 'Send Email' : 'Send Email'}</a>}
      {teacher.facebook && <a href={teacher.facebook} target="_blank" rel="noopener noreferrer" style={btnStyle('#1877F2')}>👍 Facebook</a>}
    </div>
  )
}
