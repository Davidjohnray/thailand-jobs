'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [sending, setSending] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/account/login')
        return
      }
      setUser(user)
      loadMessages(user.id)
    }
    getUser()
  }, [])

  const loadMessages = async (userId: string) => {
    const { data } = await supabase
      .from('member_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setMessages(data || [])
    await supabase.from('member_messages').update({ read_by_user: true }).eq('user_id', userId).not('reply', 'is', null)
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !newSubject.trim()) return
    setSending(true)
    await supabase.from('member_messages').insert([{
      user_id: user.id,
      user_email: user.email,
      subject: newSubject,
      message: newMessage,
      read_by_admin: false,
      read_by_user: true,
    }])
    setNewMessage('')
    setNewSubject('')
    setShowForm(false)
    loadMessages(user.id)
    setSending(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const unreadReplies = messages.filter(m => m.reply && !m.read_by_user).length

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading...</p>
    </main>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#1a1a2e', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>👤 My Account</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: '4px 0 0' }}>{user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {unreadReplies > 0 && (
            <span style={{ background: '#E85D26', color: 'white', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 'bold' }}>
              {unreadReplies} new {unreadReplies === 1 ? 'reply' : 'replies'}
            </span>
          )}
          <button onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* NEW MESSAGE BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>💬 My Messages</h2>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: '#E85D26', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            {showForm ? '✕ Cancel' : '+ New Message'}
          </button>
        </div>

        {/* NEW MESSAGE FORM */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px', border: '2px solid #E85D26' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>Send us a Message</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Subject</label>
                <input value={newSubject} onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. Featured job listing enquiry, Advertising question..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Message</label>
                <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={5}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <button onClick={sendMessage} disabled={sending || !newMessage.trim() || !newSubject.trim()}
                style={{ background: sending ? '#ccc' : '#E85D26', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: sending ? 'not-allowed' : 'pointer' }}>
                {sending ? 'Sending...' : 'Send Message →'}
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES LIST */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <p style={{ marginBottom: '16px' }}>No messages yet</p>
            <button onClick={() => setShowForm(true)}
              style={{ background: '#E85D26', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              Send your first message →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: msg.reply && !msg.read_by_user ? '2px solid #E85D26' : '1px solid #eee' }}>
                <div style={{ marginBottom: msg.reply ? '20px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e' }}>{msg.subject}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#444', lineHeight: '1.6' }}>
                    {msg.message}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Sent by you</div>
                </div>
                {msg.reply && (
                  <div>
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#E85D26' }}>💬 Reply from Jobs in Thailand</div>
                        {msg.replied_at && (
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {new Date(msg.replied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                      <div style={{ background: '#fff3ed', borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#444', lineHeight: '1.6', border: '1px solid #ffd4b8' }}>
                        {msg.reply}
                      </div>
                    </div>
                  </div>
                )}
                {!msg.reply && (
                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                    ⏳ Awaiting reply — we usually respond within a few hours
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px' }}>← Back to Jobs</Link>
        </div>

        {/* LINE COMMUNITY CARD */}
        <div style={{ marginTop: '24px', background: '#06C755', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>💬</div>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '6px' }}>Join our LINE Community!</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '16px' }}>Connect with teachers & job seekers across Thailand — tips, advice & job alerts!</div>
          <a href="https://line.me/ti/g2/MGV6FgMkGOdFSUeaPsHUyMf2P2hYAT5-a6f5Vg" target="_blank" rel="noopener noreferrer"
            style={{ background: 'white', color: '#06C755', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
            Join Free →
          </a>
        </div>

      </div>
    </main>
  )
}