'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../src/lib/supabase'
import { createClient } from '@supabase/supabase-js'
function EmailMembers() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [audience, setAudience] = useState<'all' | 'job_seeker' | 'employer'>('all')

  const sendEmails = async () => {
    if (!subject.trim() || !message.trim()) return
    if (!confirm(`Send this email to ${audience === 'all' ? 'all members' : audience === 'job_seeker' ? 'job seekers only' : 'employers only'}?`)) return
    setSending(true)
    const res = await fetch('/api/email-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, audience }),
    })
    const data = await res.json()
    setResult(data)
    setSending(false)
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>📧 Email All Members</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* AUDIENCE SELECTOR */}
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', display: 'block', marginBottom: '8px' }}>Send To</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: '👥 All Members' },
              { id: 'job_seeker', label: '👤 Job Seekers Only' },
              { id: 'employer', label: '🏫 Employers Only' },
            ].map(opt => (
              <button key={opt.id} type="button" onClick={() => setAudience(opt.id as any)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '2px solid',
                  borderColor: audience === opt.id ? '#E85D26' : '#ddd',
                  background: audience === opt.id ? '#fff3ed' : 'white',
                  color: audience === opt.id ? '#E85D26' : '#555',
                  fontWeight: audience === opt.id ? 'bold' : 'normal',
                  cursor: 'pointer', fontSize: '13px'
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            placeholder="e.g. New jobs just added in Bangkok!"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Type your message to members..."
            rows={6}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        {result && (
          <div style={{ background: '#e8f5e9', borderRadius: '8px', padding: '12px', color: '#2e7d32', fontWeight: 'bold', fontSize: '14px' }}>
            ✅ Sent to {result.sent} of {result.total} members!
          </div>
        )}
        <button onClick={sendEmails} disabled={sending || !subject.trim() || !message.trim()}
          style={{ background: sending ? '#ccc' : '#1a1a2e', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: sending ? 'not-allowed' : 'pointer' }}>
          {sending ? 'Sending...' : '📧 Send to Members'}
        </button>
      </div>
    </div>
  )
}