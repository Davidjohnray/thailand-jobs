'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../src/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const ADMIN_PASSWORD = 'thailand2024'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [memberMessages, setMemberMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'unread' | 'all' | 'members' | 'email'>('unread')
  const [replyText, setReplyText] = useState<Record<number, string>>({})
  const [replying, setReplying] = useState<number | null>(null)

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      loadMessages()
      loadMemberMessages()
    } else {
      setWrongPassword(true)
    }
  }

  const loadMessages = async () => {
    setLoading(true)
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  const loadMemberMessages = async () => {
    const { data } = await adminSupabase.from('member_messages').select('*').order('created_at', { ascending: false })
    setMemberMessages(data || [])
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
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) { alert('Error deleting: ' + error.message); return }
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const deleteMemberMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return
    const { error } = await adminSupabase.from('member_messages').delete().eq('id', id)
    if (error) { alert('Error deleting: ' + error.message); return }
    setMemberMessages(prev => prev.filter(m => m.id !== id))
  }

  const sendReply = async (id: number) => {
    const reply = replyText[id]
    if (!reply?.trim()) return
    setReplying(id)
    await adminSupabase.from('member_messages').update({
      reply,
      replied_at: new Date().toISOString(),
      read_by_admin: true,
      read_by_user: false,
    }).eq('id', id)
    setReplyText(prev => ({ ...prev, [id]: '' }))
    setReplying(null)
    loadMemberMessages()
  }

  const markMemberRead = async (id: number) => {
    await adminSupabase.from('member_messages').update({ read_by_admin: true }).eq('id', id)
    setMemberMessages(prev => prev.map(m => m.id === id ? { ...m, read_by_admin: true } : m))
  }

  const unreadCount = messages.filter(m => !m.read).length
  const unreadMemberCount = memberMessages.filter(m => !m.read_by_admin).length
  const displayed = activeTab === 'unread' ? messages.filter(m => !m.read) : activeTab === 'all' ? messages : memberMessages

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

      <div style={{ background: '#1a1a2e', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>🔐 Admin Panel</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: 0 }}>Thailand Jobs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {(unreadCount > 0 || unreadMemberCount > 0) && (
            <span style={{ background: '#E85D26', color: 'white', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 'bold' }}>
              {unreadCount + unreadMemberCount} unread
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
          <button onClick={() => { loadMessages(); loadMemberMessages() }}
            style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#555' }}>
            🔄 Refresh
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'all', label: `All Contact (${messages.length})` },
            { id: 'members', label: `Member Messages (${memberMessages.length})${unreadMemberCount > 0 ? ` 🔴` : ''}` },
            { id: 'email', label: '📧 Email Members' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: activeTab === tab.id ? 'bold' : 'normal', background: activeTab === tab.id ? '#1a1a2e' : 'white', color: activeTab === tab.id ? 'white' : '#555', fontSize: '14px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* EMAIL MEMBERS TAB */}
        {activeTab === 'email' && <EmailMembers />}

        {/* CONTACT FORM MESSAGES */}
        {activeTab !== 'members' && activeTab !== 'email' && (
          loading ? (
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
                    <button onClick={() => deleteMessage(msg.id)}
                      style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginLeft: 'auto' }}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* MEMBER MESSAGES */}
        {activeTab === 'members' && (
          memberMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p>No member messages yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {memberMessages.map(msg => (
                <div key={msg.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: !msg.read_by_admin ? '2px solid #E85D26' : '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{msg.subject}</span>
                        {!msg.read_by_admin && <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>NEW</span>}
                      </div>
                      <div style={{ color: '#666', fontSize: '13px' }}>👤 {msg.user_email}</div>
                    </div>
                    <div style={{ color: '#999', fontSize: '12px' }}>
                      {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '14px', marginBottom: '16px', color: '#444', fontSize: '14px', lineHeight: '1.6' }}>
                    {msg.message}
                  </div>
                  {msg.reply && (
                    <div style={{ background: '#fff3ed', borderRadius: '8px', padding: '14px', marginBottom: '16px', border: '1px solid #ffd4b8' }}>
                      <div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '13px', marginBottom: '6px' }}>Your reply:</div>
                      <div style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{msg.reply}</div>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                      value={replyText[msg.id] || ''}
                      onChange={e => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                      placeholder={msg.reply ? 'Update your reply...' : 'Type your reply here — member will see this in their account...'}
                      rows={3}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => sendReply(msg.id)}
                        disabled={replying === msg.id || !replyText[msg.id]?.trim()}
                        style={{ background: replying === msg.id ? '#ccc' : '#E85D26', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: replying === msg.id ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                        {replying === msg.id ? 'Sending...' : msg.reply ? '📝 Update Reply' : '📨 Send Reply to Member'}
                      </button>
                      {!msg.read_by_admin && (
                        <button onClick={() => markMemberRead(msg.id)}
                          style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                          ✓ Mark Read
                        </button>
                      )}
                      <button onClick={() => deleteMemberMessage(msg.id)}
                        style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginLeft: 'auto' }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </main>
  )
}