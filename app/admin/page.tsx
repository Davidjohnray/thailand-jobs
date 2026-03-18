'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../src/lib/supabase'

const ADMIN_PASSWORD = 'thailand2024'  // 👈 change this to whatever you want

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread')

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      loadMessages()
    } else {
      setWrongPassword(true)
    }
  }

  const loadMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  const markRead = async (id: number) => {
    await supabase.from('messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const markUnread = async (id: number) => {
    await supabase.from('messages').update({ read: false }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: false } : m))
  }

  const deleteMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const unreadCount = messages.filter(m => !m.read).length
  const displayed = activeTab === 'unread' ? messages.filter(m => !m.read) : messages

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>Admin Login</h1>
        <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>Thailand Jobs Admin Panel</p>
        <input type="password" value={password} onChange={e => { setPassword(e.target.value); setWrongPassword(false) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
          placeholder="Enter password"
          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: wrongPassword ? '2px solid red' : '1px solid #ddd', fontSize: '16px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px', textAlign: 'center', letterSpacing: '4px' }} />
        {wrongPassword && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>Incorrect password</p>}
        <button onClick={handleLogin}
          style={{ width: '100%', background: '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>
          Login →
        </button>
      </div>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#1a1a2e', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>🔐 Admin Panel</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: 0 }}>Thailand Jobs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <span style={{ background: '#E85D26', color: 'white', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 'bold' }}>
              {unreadCount} unread
            </span>
          )}
          <button onClick={() => setAuthed(false)}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>💬 Messages</h2>
          <button onClick={loadMessages}
            style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
            🔄 Refresh
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['unread', 'all'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: activeTab === tab ? 'bold' : 'normal', background: activeTab === tab ? '#1a1a2e' : 'white', color: activeTab === tab ? 'white' : '#555', fontSize: '14px' }}>
              {tab === 'unread' ? `Unread (${unreadCount})` : `All (${messages.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading messages...</div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p>{activeTab === 'unread' ? 'No unread messages' : 'No messages yet'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayed.map(msg => (
              <div key={msg.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: msg.read ? '1px solid #eee' : '2px solid #E85D26' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{msg.name}</span>
                      {!msg.read && <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>NEW</span>}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>{msg.email}</div>
                  </div>
                  <div style={{ color: '#999', fontSize: '12px' }}>
                    {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {msg.job_title && (
                  <div style={{ background: '#fff3ed', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px' }}>
                    <span style={{ color: '#E85D26', fontWeight: 'bold' }}>⭐ Featured job: </span>
                    <span style={{ color: '#555' }}>{msg.job_title} — {msg.company}</span>
                  </div>
                )}

                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '14px', marginBottom: '16px', color: '#444', fontSize: '14px', lineHeight: '1.6' }}>
                  {msg.message}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!msg.read ? (
                    <button onClick={() => markRead(msg.id)}
                      style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                      ✓ Mark as Read
                    </button>
                  ) : (
                    <button onClick={() => markUnread(msg.id)}
                      style={{ background: '#f0f0f0', color: '#666', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Mark Unread
                    </button>
                  )}
                  <a href={`https://mail.google.com/mail/?view=cm&to=${msg.email}&su=Re: Your message to Jobs in Thailand&body=Hi ${encodeURIComponent(msg.name)},%0A%0AThank you for getting in touch!%0A%0A`}
  target="_blank" rel="noopener noreferrer"
  style={{ background: '#1a1a2e', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
  📧 Reply via Gmail
</a>
                  <button onClick={() => deleteMessage(msg.id)}
                    style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginLeft: 'auto' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}