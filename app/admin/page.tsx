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
                style={{ padding: '8px 16px', borderRadius: '8px', border: '2px solid', borderColor: audience === opt.id ? '#E85D26' : '#ddd', background: audience === opt.id ? '#fff3ed' : 'white', color: audience === opt.id ? '#E85D26' : '#555', fontWeight: audience === opt.id ? 'bold' : 'normal', cursor: 'pointer', fontSize: '13px' }}>
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
  const [authed, setAuthed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('adminAuthed') === 'true'
    }
    return false
  })
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [memberMessages, setMemberMessages] = useState<any[]>([])
  const [rentalMembers, setRentalMembers] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [eslOrders, setEslOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'unread' | 'all' | 'members' | 'email' | 'rentals' | 'teachers' | 'esl'>('unread')
  const [replyText, setReplyText] = useState<Record<number, string>>({})
  const [replying, setReplying] = useState<number | null>(null)
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null)
  const [teacherTemplate, setTeacherTemplate] = useState<Record<string, string>>({})
  const [approvingOrder, setApprovingOrder] = useState<string | null>(null)

  useEffect(() => {
    if (authed) {
      loadMessages()
      loadMemberMessages()
      loadRentalMembers()
      loadTeachers()
      loadEslOrders()
    }
  }, [authed])

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      sessionStorage.setItem('adminAuthed', 'true')
      loadMessages()
      loadMemberMessages()
      loadRentalMembers()
      loadTeachers()
      loadEslOrders()
    } else {
      setWrongPassword(true)
    }
  }

  const handleLogout = () => {
    setAuthed(false)
    sessionStorage.removeItem('adminAuthed')
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

  const loadRentalMembers = async () => {
    const { data } = await adminSupabase.from('rental_profiles').select('*').order('created_at', { ascending: false })
    setRentalMembers(data || [])
  }

  const loadTeachers = async () => {
    const { data } = await adminSupabase.from('teachers').select('*').order('created_at', { ascending: false })
    setTeachers(data || [])
    const templateMap: Record<string, string> = {}
    data?.forEach((t: any) => { templateMap[t.id] = t.template || 'modern' })
    setTeacherTemplate(templateMap)
  }

  const loadEslOrders = async () => {
    const { data } = await adminSupabase
      .from('lesson_plan_orders')
      .select('*, lesson_plans(title, price, pack_type)')
      .order('created_at', { ascending: false })
    setEslOrders(data || [])
  }

  const approveEslOrder = async (order: any) => {
    if (!confirm(`Approve order for ${order.buyer_name} and send download link to ${order.buyer_email}?`)) return
    setApprovingOrder(order.id)

    // Generate a simple download token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)

    const { error } = await adminSupabase
      .from('lesson_plan_orders')
      .update({ status: 'approved', download_token: token })
      .eq('id', order.id)

    if (error) {
      alert('Error: ' + error.message)
      setApprovingOrder(null)
      return
    }

    // Send download email via API
    await fetch('/api/esl-order-approved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: order.buyer_email,
        name: order.buyer_name,
        planTitle: order.lesson_plans?.title,
        token,
      }),
    })

    setEslOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'approved', download_token: token } : o))
    setApprovingOrder(null)
    alert('✅ Order approved and download email sent!')
  }

  const rejectEslOrder = async (id: string) => {
    if (!confirm('Reject this order?')) return
    await adminSupabase.from('lesson_plan_orders').update({ status: 'rejected' }).eq('id', id)
    setEslOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'rejected' } : o))
  }

  const approveTeacher = async (id: string) => {
    if (!confirm('Approve this teacher profile and make it live?')) return
    const { error } = await adminSupabase.from('teachers').update({
      active: true,
      status: 'approved',
      template: teacherTemplate[id] || 'modern',
    }).eq('id', id)
    if (error) { alert('Error: ' + error.message); return }
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, active: true, status: 'approved' } : t))
    alert('✅ Teacher profile is now live!')
  }

  const rejectTeacher = async (id: string) => {
    if (!confirm('Reject and delete this teacher application?')) return
    await adminSupabase.from('teachers').delete().eq('id', id)
    setTeachers(prev => prev.filter(t => t.id !== id))
  }

  const deactivateTeacher = async (id: string) => {
    if (!confirm('Deactivate this teacher profile?')) return
    await adminSupabase.from('teachers').update({ active: false, status: 'pending' }).eq('id', id)
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, active: false, status: 'pending' } : t))
  }

  const toggleRentalActivation = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate'
    if (!confirm(`Are you sure you want to ${action} this rental member?`)) return
    const { error } = await adminSupabase.from('rental_profiles').update({ active: !currentStatus }).eq('id', id)
    if (error) { alert('Error: ' + error.message); return }
    setRentalMembers(prev => prev.map(m => m.id === id ? { ...m, active: !currentStatus } : m))
  }

  const deleteRentalMember = async (id: string) => {
    if (!confirm('Delete this rental member profile?')) return
    await adminSupabase.from('rental_profiles').delete().eq('id', id)
    setRentalMembers(prev => prev.filter(m => m.id !== id))
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
  const pendingRentalCount = rentalMembers.filter(m => !m.active).length
  const pendingTeacherCount = teachers.filter(t => t.status === 'pending').length
  const pendingEslCount = eslOrders.filter(o => o.status === 'pending').length
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
          {(unreadCount > 0 || unreadMemberCount > 0 || pendingRentalCount > 0 || pendingTeacherCount > 0 || pendingEslCount > 0) && (
            <span style={{ background: '#E85D26', color: 'white', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 'bold' }}>
              {unreadCount + unreadMemberCount + pendingRentalCount + pendingTeacherCount + pendingEslCount} pending
            </span>
          )}
          <button onClick={() => { loadMessages(); loadMemberMessages(); loadRentalMembers(); loadTeachers(); loadEslOrders() }}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            🔄 Refresh
          </button>
          <button onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'all', label: `All Contact (${messages.length})` },
            { id: 'members', label: `Member Messages (${memberMessages.length})${unreadMemberCount > 0 ? ' 🔴' : ''}` },
            { id: 'rentals', label: `🏠 Rentals (${rentalMembers.length})${pendingRentalCount > 0 ? ' 🔴' : ''}` },
            { id: 'teachers', label: `🎓 Teachers (${teachers.length})${pendingTeacherCount > 0 ? ' 🔴' : ''}` },
            { id: 'esl', label: `📖 ESL Orders (${eslOrders.length})${pendingEslCount > 0 ? ' 🔴' : ''}` },
            { id: 'email', label: '📧 Email Members' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: activeTab === tab.id ? 'bold' : 'normal', background: activeTab === tab.id ? '#1a1a2e' : 'white', color: activeTab === tab.id ? 'white' : '#555', fontSize: '14px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* EMAIL TAB */}
        {activeTab === 'email' && <EmailMembers />}

        {/* ESL ORDERS TAB */}
        {activeTab === 'esl' && (
          eslOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
              <p>No ESL orders yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {eslOrders.map(order => (
                <div key={order.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: order.status === 'pending' ? '2px solid #E85D26' : '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{order.buyer_name}</span>
                        {order.status === 'pending' && <span style={{ background: '#ff9800', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⏳ Pending</span>}
                        {order.status === 'approved' && <span style={{ background: '#4caf50', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✅ Approved</span>}
                        {order.status === 'rejected' && <span style={{ background: '#ef4444', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>❌ Rejected</span>}
                      </div>
                      <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>📧 {order.buyer_email}</div>
                      <div style={{ color: '#7C3AED', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>📖 {order.lesson_plans?.title}</div>
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                      {order.slip_url && (
                        <a href={order.slip_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'block', background: '#f0f4ff', color: '#2D6BE4', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}>
                          🧾 View Slip
                        </a>
                      )}
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => approveEslOrder(order)}
                            disabled={approvingOrder === order.id}
                            style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                            {approvingOrder === order.id ? 'Approving...' : '✅ Approve & Send Link'}
                          </button>
                          <button onClick={() => rejectEslOrder(order.id)}
                            style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* TEACHERS TAB */}
        {activeTab === 'teachers' && (
          teachers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
              <p>No teacher applications yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {teachers.map(teacher => (
                <div key={teacher.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: teacher.status === 'pending' ? '2px solid #E85D26' : '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {teacher.photo_url ? (
                        <img src={teacher.photo_url} alt={teacher.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }} />
                      ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>👤</div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a1a2e' }}>{teacher.name}</span>
                          {teacher.status === 'pending' ? (
                            <span style={{ background: '#ff9800', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⏳ Pending</span>
                          ) : (
                            <span style={{ background: '#4caf50', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Live</span>
                          )}
                        </div>
                        <div style={{ color: '#666', fontSize: '13px' }}>
                          {teacher.nationality && `🌍 ${teacher.nationality} · `}
                          📍 {teacher.location}
                          {teacher.experience_years && ` · ⭐ ${teacher.experience_years} yrs`}
                        </div>
                        <div style={{ color: '#999', fontSize: '12px', marginTop: '2px' }}>
                          Applied: {new Date(teacher.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                      {teacher.status === 'pending' ? (
                        <>
                          <button onClick={() => approveTeacher(teacher.id)}
                            style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                            ✅ Approve & Go Live
                          </button>
                          <button onClick={() => rejectTeacher(teacher.id)}
                            style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            ❌ Reject & Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <a href={`/teachers/${teacher.slug}`} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'block', background: '#e8f0fe', color: '#2D6BE4', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', textAlign: 'center' }}>
                            👁 View Live Page
                          </a>
                          <button onClick={() => deactivateTeacher(teacher.id)}
                            style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            ⛔ Deactivate
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {teacher.hourly_rate && <span style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>💰 {teacher.hourly_rate}</span>}
                    {teacher.online_available && <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>🌐 Online</span>}
                    {teacher.subjects?.slice(0, 4).map((s: string) => (
                      <span key={s} style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>{s}</span>
                    ))}
                    {teacher.subjects?.length > 4 && <span style={{ background: '#f0f0f0', color: '#555', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>+{teacher.subjects.length - 4} more</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>🎨 Template:</span>
                    {['modern', 'bold', 'professional', 'friendly'].map(t => (
                      <button key={t} type="button"
                        onClick={() => setTeacherTemplate(prev => ({ ...prev, [teacher.id]: t }))}
                        style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid', borderColor: teacherTemplate[teacher.id] === t ? '#E85D26' : '#ddd', background: teacherTemplate[teacher.id] === t ? '#fff3ed' : 'white', color: teacherTemplate[teacher.id] === t ? '#E85D26' : '#555', cursor: 'pointer', fontSize: '12px', fontWeight: teacherTemplate[teacher.id] === t ? 'bold' : 'normal' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
                    style={{ background: '#f9f9f9', border: '1px solid #eee', color: '#555', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', width: '100%' }}>
                    {expandedTeacher === teacher.id ? '▲ Hide Details' : '▼ View Full Application'}
                  </button>
                  {expandedTeacher === teacher.id && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                      {teacher.tagline && <div><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '4px' }}>Tagline</div><div style={{ color: '#444', fontSize: '14px', fontStyle: 'italic' }}>"{teacher.tagline}"</div></div>}
                      {teacher.bio && <div><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '4px' }}>About Me</div><div style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', background: '#f9f9f9', padding: '12px', borderRadius: '8px', whiteSpace: 'pre-line' }}>{teacher.bio}</div></div>}
                      {teacher.teaching_style && <div><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '4px' }}>Teaching Style</div><div style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', background: '#f9f9f9', padding: '12px', borderRadius: '8px', whiteSpace: 'pre-line' }}>{teacher.teaching_style}</div></div>}
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {teacher.levels?.length > 0 && <div style={{ flex: 1, minWidth: '200px' }}><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '8px' }}>Teaching Levels</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{teacher.levels.map((l: string) => <span key={l} style={{ background: '#e8f0fe', color: '#2D6BE4', fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>{l}</span>)}</div></div>}
                        {teacher.certifications?.length > 0 && <div style={{ flex: 1, minWidth: '200px' }}><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '8px' }}>Certifications</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{teacher.certifications.map((c: string) => <span key={c} style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>{c}</span>)}</div></div>}
                      </div>
                      {teacher.qualifications?.length > 0 && <div><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '8px' }}>Qualifications</div>{teacher.qualifications.map((q: string) => <div key={q} style={{ color: '#444', fontSize: '14px', marginBottom: '4px' }}>🎓 {q}</div>)}</div>}
                      <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '16px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '10px' }}>Contact Details</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          {teacher.email && <div style={{ fontSize: '13px', color: '#444' }}>📧 {teacher.email}</div>}
                          {teacher.phone && <div style={{ fontSize: '13px', color: '#444' }}>📞 {teacher.phone}</div>}
                          {teacher.line_id && <div style={{ fontSize: '13px', color: '#444' }}>💬 LINE: {teacher.line_id}</div>}
                          {teacher.whatsapp && <div style={{ fontSize: '13px', color: '#444' }}>📱 WhatsApp: {teacher.whatsapp}</div>}
                          {teacher.facebook && <div style={{ fontSize: '13px', color: '#444' }}>👍 <a href={teacher.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#2D6BE4' }}>Facebook</a></div>}
                        </div>
                      </div>
                      {teacher.notes && <div><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '4px' }}>Notes from Applicant</div><div style={{ color: '#444', fontSize: '14px', background: '#fff3ed', padding: '12px', borderRadius: '8px', border: '1px solid #ffd4b8' }}>{teacher.notes}</div></div>}
                      {teacher.status === 'approved' && <div style={{ background: '#e8f5e9', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '13px' }}>🔗 Live URL:</span><a href={`/teachers/${teacher.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2D6BE4', fontSize: '13px' }}>www.jobsinthailand.net/teachers/{teacher.slug}</a></div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* RENTAL MEMBERS TAB */}
        {activeTab === 'rentals' && (
          rentalMembers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <p>No rental member applications yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {rentalMembers.map(member => (
                <div key={member.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: !member.active ? '2px solid #E85D26' : '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{member.full_name || 'No name'}</span>
                        {member.active ? <span style={{ background: '#4caf50', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Active</span> : <span style={{ background: '#ff9800', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⏳ Pending</span>}
                      </div>
                      {member.company && <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>🏢 {member.company}</div>}
                      {member.phone && <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>📞 {member.phone}</div>}
                      {member.line_id && <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>💬 LINE: {member.line_id}</div>}
                      <div style={{ color: '#999', fontSize: '12px' }}>Registered: {new Date(member.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button onClick={() => toggleRentalActivation(member.id, member.active)}
                        style={{ background: member.active ? '#ffeaea' : '#e8f5e9', color: member.active ? '#c62828' : '#2e7d32', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                        {member.active ? '⛔ Deactivate' : '✅ Activate'}
                      </button>
                      <button onClick={() => deleteRentalMember(member.id)}
                        style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* CONTACT MESSAGES */}
        {activeTab !== 'members' && activeTab !== 'email' && activeTab !== 'rentals' && activeTab !== 'teachers' && activeTab !== 'esl' && (
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
                      <button onClick={() => markRead(msg.id)} style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>✓ Mark as Read</button>
                    ) : (
                      <button onClick={() => markUnread(msg.id)} style={{ background: '#f0f0f0', color: '#666', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Mark Unread</button>
                    )}
                    <button onClick={() => deleteMessage(msg.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginLeft: 'auto' }}>🗑 Delete</button>
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
                    <div style={{ color: '#999', fontSize: '12px' }}>{new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '14px', marginBottom: '16px', color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{msg.message}</div>
                  {msg.reply && (
                    <div style={{ background: '#fff3ed', borderRadius: '8px', padding: '14px', marginBottom: '16px', border: '1px solid #ffd4b8' }}>
                      <div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '13px', marginBottom: '6px' }}>Your reply:</div>
                      <div style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{msg.reply}</div>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea value={replyText[msg.id] || ''} onChange={e => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                      placeholder={msg.reply ? 'Update your reply...' : 'Type your reply here...'}
                      rows={3}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => sendReply(msg.id)} disabled={replying === msg.id || !replyText[msg.id]?.trim()}
                        style={{ background: replying === msg.id ? '#ccc' : '#E85D26', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: replying === msg.id ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                        {replying === msg.id ? 'Sending...' : msg.reply ? '📝 Update Reply' : '📨 Send Reply to Member'}
                      </button>
                      {!msg.read_by_admin && (
                        <button onClick={() => markMemberRead(msg.id)} style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>✓ Mark Read</button>
                      )}
                      <button onClick={() => deleteMemberMessage(msg.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginLeft: 'auto' }}>🗑 Delete</button>
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