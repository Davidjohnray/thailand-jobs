'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../src/lib/supabase'

const STAFF_PASSWORD = 'recruit2026'
const FROM_EMAIL = 'recruitment@jobsinthailand.net'

export default function StaffPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [staffName, setStaffName] = useState('')
  const [staffEmail, setStaffEmail] = useState('')
  const [loginError, setLoginError] = useState('')
  
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('staffLoggedIn')
    const savedName = localStorage.getItem('staffName')
    const savedEmail = localStorage.getItem('staffEmail')
    if (saved === 'true' && savedName && savedEmail) {
      setLoggedIn(true)
      setStaffName(savedName)
      setStaffEmail(savedEmail)
      loadHistory(savedName)
    }
  }, [])

  const handleLogin = () => {
    if (!staffName.trim()) {
      setLoginError('Please enter your name')
      return
    }
    if (!staffEmail.trim() || !staffEmail.includes('@')) {
      setLoginError('Please enter a valid email')
      return
    }
    if (password === STAFF_PASSWORD) {
      localStorage.setItem('staffLoggedIn', 'true')
      localStorage.setItem('staffName', staffName.trim())
      localStorage.setItem('staffEmail', staffEmail.trim())
      setLoggedIn(true)
      setLoginError('')
      loadHistory(staffName.trim())
    } else {
      setLoginError('Incorrect password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('staffLoggedIn')
    localStorage.removeItem('staffName')
    localStorage.removeItem('staffEmail')
    setLoggedIn(false)
    setStaffName('')
    setStaffEmail('')
    setPassword('')
    setHistory([])
  }

  const loadHistory = async (name: string) => {
    setLoadingHistory(true)
    const { data } = await supabase
      .from('staff_emails')
      .select('*')
      .eq('sent_by', name)
      .order('sent_at', { ascending: false })
      .limit(20)
    
    setHistory(data || [])
    setLoadingHistory(false)
  }

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !message.trim()) {
      alert('Please fill in all fields')
      return
    }

    if (!to.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    setSending(true)
    setSent(false)

    try {
      const res = await fetch('/api/staff/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: to.trim(),
          subject: subject.trim(),
          message: message.trim(),
          sentBy: staffName,
          replyTo: staffEmail
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSent(true)
        setTo('')
        setSubject('')
        setMessage('')
        loadHistory(staffName)
        
        setTimeout(() => setSent(false), 3000)
      } else {
        alert('Error sending email: ' + (data.error || 'Unknown error'))
      }
    } catch (err: any) {
      alert('Error: ' + err.message)
    }

    setSending(false)
  }

  // Login Screen
  if (!loggedIn) {
    return (
      <main style={{ background: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px 32px', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Staff Login</h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Jobs in Thailand Recruitment</p>
          
          <input
            type="text"
            placeholder="Your Name"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          
          <input
            type="email"
            placeholder="Your Email (for replies)"
            value={staffEmail}
            onChange={(e) => setStaffEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
          />
          
          {loginError && <p style={{ color: 'red', fontSize: '14px', marginBottom: '16px' }}>{loginError}</p>}
          
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '14px', background: '#E85D26', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Login →
          </button>
          
          <p style={{ color: '#999', fontSize: '12px', marginTop: '16px' }}>
            Replies will be sent to your email address
          </p>
        </div>
      </main>
    )
  }

  // Main Dashboard
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>📧 Email Outbox</h1>
            <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0' }}>Sending as: <strong>{FROM_EMAIL}</strong></p>
            <p style={{ color: '#999', fontSize: '12px', margin: '2px 0 0' }}>Replies go to: <strong>{staffEmail}</strong></p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>👤 {staffName}</span>
            <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
              Logout
            </button>
          </div>
        </div>

        {/* Compose Email */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>✉️ Compose Email</h2>
          
          {sent && (
            <div style={{ background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontWeight: 'bold' }}>
              ✅ Email sent successfully! Replies will go to {staffEmail}
            </div>
          )}
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333', fontSize: '14px' }}>To:</label>
            <input
              type="email"
              placeholder="recipient@email.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333', fontSize: '14px' }}>Subject:</label>
            <input
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333', fontSize: '14px' }}>Message:</label>
            <textarea
              placeholder="Write your email message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={sending}
            style={{ 
              padding: '14px 28px', 
              background: sending ? '#ccc' : '#E85D26', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: sending ? 'not-allowed' : 'pointer' 
            }}
          >
            {sending ? 'Sending...' : '📤 Send Email'}
          </button>
        </div>

        {/* Sent History */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📋 Sent History</h2>
          
          {loadingHistory ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>Loading...</p>
          ) : history.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No emails sent yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((email) => (
                <div key={email.id} style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px 16px', borderLeft: '4px solid #E85D26' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <strong style={{ color: '#1a1a2e', fontSize: '14px' }}>{email.sent_to}</strong>
                    <span style={{ color: '#999', fontSize: '12px' }}>
                      {new Date(email.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{email.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
