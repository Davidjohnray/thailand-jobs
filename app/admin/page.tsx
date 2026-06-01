'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../src/lib/supabase'

const ADMIN_PASSWORD = 'thailand2024'
const adminSupabase = supabase

const JIT_LOGO = 'https://coldsoilakctfcswqwge.supabase.co/storage/v1/object/public/partner-cvs/jobsinthailand%20job%20logo.png'
const TB_LOGO = 'https://coldsoilakctfcswqwge.supabase.co/storage/v1/object/public/partner-cvs/teach%20bridge%20asia.jpg'
const FILIPINO_LOGO = 'https://coldsoilakctfcswqwge.supabase.co/storage/v1/object/public/partner-cvs/nnes-logo.png'
const NNES_LOGO = 'https://coldsoilakctfcswqwge.supabase.co/storage/v1/object/public/partner-cvs/nnes-global-logo.png'

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
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. New jobs just added in Bangkok!"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any }} />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message to members..." rows={6}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' as any, boxSizing: 'border-box' as any }} />
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
    if (typeof window !== 'undefined') return sessionStorage.getItem('adminAuthed') === 'true'
    return false
  })
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [memberMessages, setMemberMessages] = useState<any[]>([])
  const [rentalMembers, setRentalMembers] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [eslOrders, setEslOrders] = useState<any[]>([])
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [allMembers, setAllMembers] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [allJobs, setAllJobs] = useState<any[]>([])
  const [assigningJob, setAssigningJob] = useState<string | null>(null)
  const [jobPartnerMap, setJobPartnerMap] = useState<Record<string, string>>({})
  const [jobLogoMap, setJobLogoMap] = useState<Record<string, string | null>>({})
  const [savingLogo, setSavingLogo] = useState<string | null>(null)
  const [recruiterRequests, setRecruiterRequests] = useState<any[]>([])
  const [premiumPasswords, setPremiumPasswords] = useState<any[]>([])
  const [generatingPassword, setGeneratingPassword] = useState(false)
  const [newBuyerName, setNewBuyerName] = useState('')
  const [newBuyerEmail, setNewBuyerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [teflLeads, setTeflLeads] = useState<any[]>([])
  const [dukeLeads, setDukeLeads] = useState<any[]>([])

  // ── ARCADE STATE ──────────────────────────────────────────
  const [arcadeCodes, setArcadeCodes] = useState<any[]>([])
  const [arcadeTeachers, setArcadeTeachers] = useState<any[]>([])
  const [arcadeGames, setArcadeGames] = useState<any[]>([])
  const [generatingArcadeCode, setGeneratingArcadeCode] = useState(false)
  const [newArcadeName, setNewArcadeName] = useState('')
  const [newArcadeEmail, setNewArcadeEmail] = useState('')
  const [arcadeSubTab, setArcadeSubTab] = useState<'codes' | 'teachers' | 'games'>('codes')
  // ─────────────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState<'unread' | 'all' | 'members' | 'email' | 'rentals' | 'teachers' | 'esl' | 'blog' | 'direct' | 'partners' | 'premium' | 'arcade' | 'recruiter' | 'tefl' | 'duke'>('unread')
  const [replyText, setReplyText] = useState<Record<number, string>>({})
  const [replying, setReplying] = useState<number | null>(null)
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null)
  const [teacherTemplate, setTeacherTemplate] = useState<Record<string, string>>({})
  const [approvingOrder, setApprovingOrder] = useState<string | null>(null)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [directEmail, setDirectEmail] = useState('')
  const [directSubject, setDirectSubject] = useState('')
  const [directMessage, setDirectMessage] = useState('')
  const [sendingDirect, setSendingDirect] = useState(false)
  const [directSent, setDirectSent] = useState(false)

  const emptyBlogForm = { title: '', slug: '', excerpt: '', content: '', author: 'Jobs in Thailand', category: '', cover_image_url: '', is_published: false }
  const [blogForm, setBlogForm] = useState(emptyBlogForm)

  useEffect(() => {
    if (authed) {
      loadMessages(); loadMemberMessages(); loadRentalMembers(); loadTeachers()
      loadEslOrders(); loadBlogPosts(); loadPartnerJobs(); loadPremiumPasswords()
      loadRecruiterRequests(); loadTeflLeads(); loadDukeLeads()
      loadArcadeCodes(); loadArcadeTeachers(); loadArcadeGames()
      adminSupabase.from('profiles').select('id, email').then(({ data }) => setAllMembers(data || []))
    }
  }, [authed])

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuthed(true); sessionStorage.setItem('adminAuthed', 'true') }
    else setWrongPassword(true)
  }

  const handleLogout = () => { setAuthed(false); sessionStorage.removeItem('adminAuthed') }

  // ── ARCADE LOAD FUNCTIONS ────────────────────────────────
  const loadArcadeCodes = async () => {
    const { data } = await adminSupabase.from('teacher_activation_codes').select('*').order('created_at', { ascending: false })
    setArcadeCodes(data || [])
  }

  const loadArcadeTeachers = async () => {
    const { data } = await adminSupabase.from('teacher_profiles').select('*').order('created_at', { ascending: false })
    setArcadeTeachers(data || [])
  }

  const loadArcadeGames = async () => {
    const { data } = await adminSupabase.from('custom_games').select('*').order('created_at', { ascending: false })
    setArcadeGames(data || [])
  }

  const generateArcadeCode = async () => {
    if (!newArcadeName.trim()) return
    setGeneratingArcadeCode(true)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const code = `TCH-${part1}-${part2}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    const { error } = await adminSupabase.from('teacher_activation_codes').insert([{
      code,
      buyer_name: newArcadeName.trim(),
      buyer_email: newArcadeEmail.trim() || null,
      active: true,
      used: false,
      expires_at: expiresAt.toISOString(),
    }])
    if (error) {
      alert('Error: ' + error.message)
    } else {
      const name = newArcadeName.trim()
      setNewArcadeName(''); setNewArcadeEmail('')
      loadArcadeCodes()
      alert(`✅ Teacher Arcade code generated!\n\nSend this to ${name}:\n\n${code}\n\nActivation URL:\nhttps://www.jobsinthailand.net/arcade/activate\n\nExpires: ${expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`)
    }
    setGeneratingArcadeCode(false)
  }

  const revokeArcadeCode = async (id: string, active: boolean) => {
    if (!confirm(active ? 'Revoke this code? Teacher will lose access.' : 'Re-activate this code?')) return
    await adminSupabase.from('teacher_activation_codes').update({ active: !active }).eq('id', id)
    loadArcadeCodes()
  }

  const deactivateArcadeTeacher = async (id: string) => {
    if (!confirm('Deactivate this teacher arcade account?')) return
    await adminSupabase.from('teacher_profiles').update({ active: false }).eq('id', id)
    loadArcadeTeachers()
  }
  // ─────────────────────────────────────────────────────────

  const uploadCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const ext = file.name.split('.').pop()
    const filename = `cover-${Date.now()}.${ext}`
    const { error } = await adminSupabase.storage.from('blog-images').upload(filename, file, { upsert: true })
    if (error) { alert('Upload failed: ' + error.message); setUploadingImage(false); return }
    const { data } = adminSupabase.storage.from('blog-images').getPublicUrl(filename)
    setBlogForm(prev => ({ ...prev, cover_image_url: data.publicUrl }))
    setUploadingImage(false)
  }

  const sendDirectMessage = async () => {
    if (!directEmail.trim() || !directSubject.trim() || !directMessage.trim()) return alert('Please fill in all fields')
    if (!confirm(`Send this message to ${directEmail}?`)) return
    setSendingDirect(true)
    const { error } = await adminSupabase.from('member_messages').insert([{
      user_email: directEmail, subject: directSubject,
      message: '📩 Message from Jobs in Thailand admin', reply: directMessage,
      replied_at: new Date().toISOString(), read_by_admin: true, read_by_user: false, admin_initiated: true,
    }])
    if (error) { alert('Error: ' + error.message) } else {
      setDirectSent(true); setDirectEmail(''); setDirectSubject(''); setDirectMessage('')
      setTimeout(() => setDirectSent(false), 4000)
    }
    setSendingDirect(false)
  }

  const loadMessages = async () => {
    setLoading(true)
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(data || []); setLoading(false)
  }
  const loadMemberMessages = async () => { const { data } = await adminSupabase.from('member_messages').select('*').order('created_at', { ascending: false }); setMemberMessages(data || []) }
  const loadRentalMembers = async () => { const { data } = await adminSupabase.from('rental_profiles').select('*').order('created_at', { ascending: false }); setRentalMembers(data || []) }
  const loadTeachers = async () => {
    const { data } = await adminSupabase.from('teachers').select('*').order('created_at', { ascending: false })
    setTeachers(data || [])
    const templateMap: Record<string, string> = {}
    data?.forEach((t: any) => { templateMap[t.id] = t.template || 'modern' })
    setTeacherTemplate(templateMap)
  }
  const loadEslOrders = async () => { const { data } = await adminSupabase.from('lesson_plan_orders').select('*, lesson_plans(title, price, pack_type)').order('created_at', { ascending: false }); setEslOrders(data || []) }
  const loadBlogPosts = async () => { const { data } = await adminSupabase.from('blog_posts').select('*').order('created_at', { ascending: false }); setBlogPosts(data || []) }
  const loadPartnerJobs = async () => {
    const { data: partnerData } = await adminSupabase.from('partners').select('*').order('name')
    setPartners(partnerData || [])
    const { data: jobData } = await adminSupabase.from('jobs').select('id, title, company, location, created_at, partner_id, source_logo').order('created_at', { ascending: false }).limit(200)
    setAllJobs(jobData || [])
    const map: Record<string, string> = {}; jobData?.forEach((j: any) => { if (j.partner_id) map[j.id] = j.partner_id })
    setJobPartnerMap(map)
    const logoMap: Record<string, string | null> = {}; jobData?.forEach((j: any) => { logoMap[j.id] = j.source_logo || null })
    setJobLogoMap(logoMap)
  }
  const loadRecruiterRequests = async () => { const { data } = await adminSupabase.from('recruiter_requests').select('*').order('created_at', { ascending: false }); setRecruiterRequests(data || []) }
  const loadPremiumPasswords = async () => { const { data } = await adminSupabase.from('pro_game_passwords').select('*').order('created_at', { ascending: false }); setPremiumPasswords(data || []) }
  const loadTeflLeads = async () => { const { data } = await adminSupabase.from('tefl_leads').select('*').order('created_at', { ascending: false }); setTeflLeads(data || []) }
  const loadDukeLeads = async () => { const { data } = await adminSupabase.from('duke_leads').select('*').order('created_at', { ascending: false }); setDukeLeads(data || []) }
  const deleteTeflLead = async (id: string) => { if (!confirm('Delete this TEFL lead?')) return; await adminSupabase.from('tefl_leads').delete().eq('id', id); setTeflLeads(prev => prev.filter(l => l.id !== id)) }
  const deleteDukeLead = async (id: string) => { if (!confirm('Delete this Duke lead?')) return; await adminSupabase.from('duke_leads').delete().eq('id', id); setDukeLeads(prev => prev.filter(l => l.id !== id)) }
  const assignLogo = async (jobId: string, logo: string | null) => { setSavingLogo(jobId); await adminSupabase.from('jobs').update({ source_logo: logo }).eq('id', jobId); setJobLogoMap(prev => ({ ...prev, [jobId]: logo })); setSavingLogo(null) }

  const generatePassword = async () => {
    if (!newBuyerName.trim()) return
    setGeneratingPassword(true)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const pwd = `ESL-${part1}-${part2}`
    const { error } = await adminSupabase.from('pro_game_passwords').insert([{ password: pwd, buyer_name: newBuyerName.trim(), buyer_email: newBuyerEmail.trim() || null, active: true }])
    if (error) { alert('Error: ' + error.message) } else {
      const buyerName = newBuyerName.trim(); setNewBuyerName(''); setNewBuyerEmail('')
      loadPremiumPasswords()
      alert(`✅ Password generated!\n\nSend this to ${buyerName}:\n\n${pwd}\n\nURL: https://www.jobsinthailand.net/esl-games/live/premium`)
    }
    setGeneratingPassword(false)
  }

  const saveBlogPost = async () => {
    if (!blogForm.title || !blogForm.slug) return alert('Title and slug are required')
    let error
    if (editingPost) { const result = await adminSupabase.from('blog_posts').update({ ...blogForm, updated_at: new Date().toISOString() }).eq('id', editingPost.id); error = result.error }
    else { const result = await adminSupabase.from('blog_posts').insert([blogForm]); error = result.error }
    if (error) { alert('Save failed: ' + error.message); return }
    setShowBlogForm(false); setEditingPost(null); setBlogForm(emptyBlogForm); loadBlogPosts()
  }

  const deleteBlogPost = async (id: string) => { if (!confirm('Delete this article?')) return; await adminSupabase.from('blog_posts').delete().eq('id', id); loadBlogPosts() }
  const deleteAllMemberMessages = async () => {
    if (!confirm(`Delete ALL ${memberMessages.length} member messages? This cannot be undone.`)) return
    const { error } = await adminSupabase.from('member_messages').delete().neq('id', 0)
    if (error) { alert('Error: ' + error.message); return }
    setMemberMessages([])
  }

  const approveEslOrder = async (order: any) => {
    if (!confirm(`Approve order for ${order.buyer_name} and send download link to ${order.buyer_email}?`)) return
    setApprovingOrder(order.id)
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const { error } = await adminSupabase.from('lesson_plan_orders').update({ status: 'approved', download_token: token }).eq('id', order.id)
    if (error) { alert('Error: ' + error.message); setApprovingOrder(null); return }
    await fetch('/api/esl-order-approved', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: order.buyer_email, name: order.buyer_name, planTitle: order.lesson_plans?.title, token }) })
    setEslOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'approved', download_token: token } : o))
    setApprovingOrder(null); alert('✅ Order approved and download email sent!')
  }

  const rejectEslOrder = async (id: string) => { if (!confirm('Reject this order?')) return; await adminSupabase.from('lesson_plan_orders').update({ status: 'rejected' }).eq('id', id); setEslOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'rejected' } : o)) }

  const approveTeacher = async (id: string) => {
    if (!confirm('Approve this teacher profile and make it live?')) return
    const { error } = await adminSupabase.from('teachers').update({ active: true, status: 'approved', template: teacherTemplate[id] || 'modern' }).eq('id', id)
    if (error) { alert('Error: ' + error.message); return }
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, active: true, status: 'approved' } : t))
    alert('✅ Teacher profile is now live!')
  }

  const rejectTeacher = async (id: string) => { if (!confirm('Reject and delete this teacher application?')) return; await adminSupabase.from('teachers').delete().eq('id', id); setTeachers(prev => prev.filter(t => t.id !== id)) }
  const deactivateTeacher = async (id: string) => { if (!confirm('Deactivate this teacher profile?')) return; await adminSupabase.from('teachers').update({ active: false, status: 'pending' }).eq('id', id); setTeachers(prev => prev.map(t => t.id === id ? { ...t, active: false, status: 'pending' } : t)) }
  const toggleRentalActivation = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this rental member?`)) return
    const { error } = await adminSupabase.from('rental_profiles').update({ active: !currentStatus }).eq('id', id)
    if (error) { alert('Error: ' + error.message); return }
    setRentalMembers(prev => prev.map(m => m.id === id ? { ...m, active: !currentStatus } : m))
  }
  const deleteRentalMember = async (id: string) => { if (!confirm('Delete this rental member profile?')) return; await adminSupabase.from('rental_profiles').delete().eq('id', id); setRentalMembers(prev => prev.filter(m => m.id !== id)) }
  const markRead = async (id: number) => { await supabase.from('messages').update({ read: true }).eq('id', id); setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m)) }
  const markUnread = async (id: number) => { await supabase.from('messages').update({ read: false }).eq('id', id); setMessages(prev => prev.map(m => m.id === id ? { ...m, read: false } : m)) }
  const deleteMessage = async (id: number) => { if (!confirm('Delete this message?')) return; await supabase.from('messages').delete().eq('id', id); setMessages(prev => prev.filter(m => m.id !== id)) }
  const deleteMemberMessage = async (id: number) => { if (!confirm('Delete this message?')) return; await adminSupabase.from('member_messages').delete().eq('id', id); setMemberMessages(prev => prev.filter(m => m.id !== id)) }

  const sendReply = async (id: number) => {
    const reply = replyText[id]; if (!reply?.trim()) return; setReplying(id)
    const msg = memberMessages.find(m => m.id === id)
    await adminSupabase.from('member_messages').update({ reply, replied_at: new Date().toISOString(), read_by_admin: true, read_by_user: false }).eq('id', id)
    if (msg && !msg.user_id && msg.user_email) {
      const { data: profile } = await adminSupabase.from('profiles').select('id').eq('email', msg.user_email).single()
      if (profile) { await adminSupabase.from('member_messages').insert([{ user_id: profile.id, user_email: msg.user_email, subject: msg.subject || 'Reply from Jobs in Thailand', message: msg.message, reply, replied_at: new Date().toISOString(), read_by_admin: true, read_by_user: false, admin_initiated: false }]) }
    }
    setReplyText(prev => ({ ...prev, [id]: '' })); setReplying(null); loadMemberMessages()
  }

  const markMemberRead = async (id: number) => { await adminSupabase.from('member_messages').update({ read_by_admin: true }).eq('id', id); setMemberMessages(prev => prev.map(m => m.id === id ? { ...m, read_by_admin: true } : m)) }

  const unreadCount = messages.filter(m => !m.read).length
  const unreadMemberCount = memberMessages.filter(m => !m.read_by_admin).length
  const pendingRentalCount = rentalMembers.filter(m => !m.active).length
  const pendingTeacherCount = teachers.filter(t => t.status === 'pending').length
  const pendingEslCount = eslOrders.filter(o => o.status === 'pending').length
  const pendingRecruiterCount = recruiterRequests.filter(r => r.status === 'pending').length
  const displayed = activeTab === 'unread' ? messages.filter(m => !m.read) : activeTab === 'all' ? messages : memberMessages

  if (!authed) return (
    <main style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>Admin Login</h1>
        <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>Thailand Jobs Admin Panel</p>
        <input type="password" value={password} onChange={e => { setPassword(e.target.value); setWrongPassword(false) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin(e)} placeholder="Enter password"
          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: wrongPassword ? '2px solid red' : '1px solid #ddd', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as any, marginBottom: '8px', textAlign: 'center', letterSpacing: '4px' }} />
        {wrongPassword && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>Incorrect password</p>}
        <button onClick={handleLogin} style={{ width: '100%', background: '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>Login →</button>
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
          <button onClick={() => { loadMessages(); loadMemberMessages(); loadRentalMembers(); loadTeachers(); loadEslOrders(); loadBlogPosts(); loadPartnerJobs(); loadPremiumPasswords(); loadRecruiterRequests(); loadTeflLeads(); loadDukeLeads(); loadArcadeCodes(); loadArcadeTeachers(); loadArcadeGames() }}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>🔄 Refresh</button>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'all', label: `All Contact (${messages.length})` },
            { id: 'members', label: `Member Messages (${memberMessages.length})${unreadMemberCount > 0 ? ' 🔴' : ''}` },
            { id: 'rentals', label: `🏠 Rentals (${rentalMembers.length})${pendingRentalCount > 0 ? ' 🔴' : ''}` },
            { id: 'teachers', label: `🎓 Teachers (${teachers.length})${pendingTeacherCount > 0 ? ' 🔴' : ''}` },
            { id: 'tefl', label: `📋 TEFL Leads (${teflLeads.length})` },
            { id: 'duke', label: `🇹🇭 Duke Leads (${dukeLeads.length})` },
            { id: 'esl', label: `📖 ESL Orders (${eslOrders.length})${pendingEslCount > 0 ? ' 🔴' : ''}` },
            { id: 'blog', label: `✍️ Blog (${blogPosts.length})` },
            { id: 'partners', label: `🤝 Partners` },
            { id: 'premium', label: `🎮 Premium (${premiumPasswords.length})` },
            { id: 'arcade', label: `🕹️ Arcade (${arcadeCodes.length})` },
            { id: 'recruiter', label: `🏫 Recruiters (${recruiterRequests.length})${pendingRecruiterCount > 0 ? ' 🔴' : ''}` },
            { id: 'direct', label: `📩 Message Member` },
            { id: 'email', label: '📧 Email Members' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: activeTab === tab.id ? 'bold' : 'normal', background: activeTab === tab.id ? (tab.id === 'arcade' ? '#0f172a' : '#1a1a2e') : 'white', color: activeTab === tab.id ? (tab.id === 'arcade' ? '#f59e0b' : 'white') : '#555', fontSize: '14px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TEACHER ARCADE TAB ───────────────────────────── */}
        {activeTab === 'arcade' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px', color: '#1a1a2e' }}>🕹️ Teacher Arcade</h2>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Manage activation codes, teacher accounts and all custom games</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'codes', label: `🔑 Codes (${arcadeCodes.length})` },
                  { id: 'teachers', label: `👩‍🏫 Teachers (${arcadeTeachers.length})` },
                  { id: 'games', label: `🎮 Games (${arcadeGames.length})` },
                ].map(t => (
                  <button key={t.id} onClick={() => setArcadeSubTab(t.id as any)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '2px solid', borderColor: arcadeSubTab === t.id ? '#f59e0b' : '#e5e7eb', background: arcadeSubTab === t.id ? '#fffbeb' : 'white', color: arcadeSubTab === t.id ? '#92400e' : '#555', fontWeight: arcadeSubTab === t.id ? 'bold' : 'normal', cursor: 'pointer', fontSize: '13px' }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CODES SUB-TAB */}
            {arcadeSubTab === 'codes' && (
              <div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px', border: '2px solid #fde68a' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Generate New Activation Code</h3>
                  <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Code format: <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#f59e0b' }}>TCH-XXXX-XXXX</span> — 30-day expiry from generation date. Teacher enters this on /arcade/activate to start their subscription.</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <input value={newArcadeName} onChange={e => setNewArcadeName(e.target.value)} placeholder="Teacher name *"
                      style={{ flex: 1, minWidth: '160px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                    <input value={newArcadeEmail} onChange={e => setNewArcadeEmail(e.target.value)} placeholder="Teacher email (optional)"
                      style={{ flex: 1, minWidth: '160px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                    <button disabled={generatingArcadeCode || !newArcadeName.trim()} onClick={generateArcadeCode}
                      style={{ background: generatingArcadeCode || !newArcadeName.trim() ? '#ccc' : '#f59e0b', color: generatingArcadeCode || !newArcadeName.trim() ? '#999' : '#1a1a2e', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '800', fontSize: '14px', cursor: generatingArcadeCode || !newArcadeName.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                      {generatingArcadeCode ? 'Generating...' : '🎲 Generate Code'}
                    </button>
                  </div>
                </div>

                {arcadeCodes.length === 0 ? (
                  <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#888' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
                    <p>No codes generated yet. Add your first teacher above!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {arcadeCodes.map((c: any) => {
                      const expired = new Date(c.expires_at) < new Date()
                      return (
                        <div key={c.id} style={{ background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', border: !c.active || expired ? '1px solid #fca5a5' : c.used ? '1px solid #d9f99d' : '1px solid #fde68a' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e' }}>{c.buyer_name}</span>
                              {c.used && <span style={{ background: '#d9f99d', color: '#365314', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>✓ Used</span>}
                              {!c.used && c.active && !expired && <span style={{ background: '#fef9c3', color: '#713f12', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>⏳ Unused</span>}
                              {(!c.active || expired) && <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>{expired ? '⌛ Expired' : '⛔ Revoked'}</span>}
                            </div>
                            <div style={{ fontFamily: 'monospace', fontSize: '16px', color: '#f59e0b', fontWeight: '900', marginBottom: '2px' }}>{c.code}</div>
                            <div style={{ color: '#888', fontSize: '12px' }}>
                              {c.buyer_email && `${c.buyer_email} · `}
                              Created: {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} ·
                              Expires: {new Date(c.expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {c.used_by_email && ` · Used by: ${c.used_by_email}`}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button onClick={() => navigator.clipboard.writeText(c.code).then(() => alert(`Copied!\n\n${c.code}\n\nActivation URL:\nhttps://www.jobsinthailand.net/arcade/activate`))}
                              style={{ background: '#fffbeb', color: '#92400e', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>📋 Copy</button>
                            <button onClick={() => revokeArcadeCode(c.id, c.active)}
                              style={{ background: c.active ? '#ffeaea' : '#e8f5e9', color: c.active ? '#c62828' : '#2e7d32', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                              {c.active ? '⛔ Revoke' : '✅ Activate'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TEACHERS SUB-TAB */}
            {arcadeSubTab === 'teachers' && (
              <div>
                {arcadeTeachers.length === 0 ? (
                  <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#888' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👩‍🏫</div>
                    <p>No teacher arcade accounts yet. Teachers register after entering their activation code.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {arcadeTeachers.map((t: any) => {
                      const expired = t.subscription_expires_at ? new Date(t.subscription_expires_at) < new Date() : true
                      return (
                        <div key={t.id} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: expired ? '1px solid #fca5a5' : '1px solid #d9f99d' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{t.display_name}</span>
                                <span style={{ background: expired ? '#fee2e2' : '#d9f99d', color: expired ? '#991b1b' : '#365314', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>
                                  {expired ? '⌛ Expired' : '✅ Active'}
                                </span>
                              </div>
                              <div style={{ color: '#666', fontSize: '13px', marginBottom: '2px' }}>📧 {t.user_email}</div>
                              <div style={{ color: '#666', fontSize: '13px', marginBottom: '2px' }}>🔗 arcade/{t.arcade_slug}</div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                                <span style={{ background: '#fffbeb', color: '#92400e', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>📚 {t.subject}</span>
                                <span style={{ background: '#f0f4ff', color: '#2D6BE4', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>👥 {t.class_level}</span>
                                {t.subscription_expires_at && <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>Expires: {new Date(t.subscription_expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                              <a href={`/arcade/${t.arcade_slug}`} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'block', background: '#fffbeb', color: '#92400e', padding: '9px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>
                                🕹️ View Arcade
                              </a>
                              <button onClick={async () => {
                                const newExpiry = new Date()
                                newExpiry.setDate(newExpiry.getDate() + 30)
                                await adminSupabase.from('teacher_profiles').update({ subscription_expires_at: newExpiry.toISOString(), active: true }).eq('id', t.id)
                                loadArcadeTeachers()
                                alert(`✅ Subscription extended 30 days for ${t.display_name}`)
                              }} style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                                +30 Days
                              </button>
                              <button onClick={() => deactivateArcadeTeacher(t.id)}
                                style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                ⛔ Deactivate
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* GAMES SUB-TAB */}
            {arcadeSubTab === 'games' && (
              <div>
                {arcadeGames.length === 0 ? (
                  <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#888' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div>
                    <p>No teacher games yet. Games will appear here as teachers build them.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {arcadeGames.map((g: any) => (
                      <div key={g.id} style={{ background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e' }}>{g.title}</span>
                            <span style={{ background: g.status === 'active' ? '#d9f99d' : g.status === 'paused' ? '#fef9c3' : '#f3f4f6', color: g.status === 'active' ? '#365314' : g.status === 'paused' ? '#713f12' : '#555', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>
                              {g.status}
                            </span>
                            <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>
                              {g.game_type.replace('_', ' ')}
                            </span>
                          </div>
                          <div style={{ color: '#888', fontSize: '12px' }}>
                            👩‍🏫 {g.teacher_email} · arcade/{g.teacher_slug} ·
                            {Array.isArray(g.questions) ? ` ${g.questions.length} questions` : ' 0 questions'} ·
                            ⏱ {g.timer_seconds}s · {g.play_count || 0} plays ·
                            Created: {new Date(g.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <button onClick={async () => {
                          if (!confirm('Delete this game?')) return
                          await adminSupabase.from('custom_games').delete().eq('id', g.id)
                          loadArcadeGames()
                        }} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>
                          🗑 Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* ── END ARCADE TAB ──────────────────────────────── */}

        {/* TEFL LEADS TAB */}
        {activeTab === 'tefl' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>📋 TEFL Leads</h2>
              <span style={{ background: '#2d1b69', color: 'white', borderRadius: '20px', padding: '4px 14px', fontSize: '13px', fontWeight: 'bold' }}>{teflLeads.length} total</span>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Everyone who has registered interest in TEFL certification via the /tefl page.</p>
            {teflLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#888', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <p>No TEFL leads yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {teflLeads.map((lead: any) => (
                  <div key={lead.id} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{lead.name}</span>
                          {lead.interest && <span style={{ background: lead.interest === 'partner' ? '#e8f0fe' : '#f3e8ff', color: lead.interest === 'partner' ? '#2D6BE4' : '#7C3AED', fontSize: '11px', fontWeight: 'bold', padding: '2px 10px', borderRadius: '20px' }}>{lead.interest === 'partner' ? '🎓 Partner Course Now' : '⏳ Waiting for Own Course'}</span>}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
                          <div style={{ color: '#555', fontSize: '13px' }}>📧 <a href={`mailto:${lead.email}`} style={{ color: '#2D6BE4', textDecoration: 'none', fontWeight: 'bold' }}>{lead.email}</a></div>
                          {lead.phone && <div style={{ color: '#555', fontSize: '13px' }}>📞 {lead.phone}</div>}
                          {lead.location && <div style={{ color: '#555', fontSize: '13px' }}>📍 {lead.location}</div>}
                        </div>
                        {lead.message && <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px 12px', color: '#555', fontSize: '13px', lineHeight: '1.5' }}>{lead.message}</div>}
                        <div style={{ color: '#aaa', fontSize: '12px', marginTop: '8px' }}>{new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                        <a href={`mailto:${lead.email}`} style={{ display: 'block', background: '#e8f0fe', color: '#2D6BE4', padding: '9px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>📧 Email</a>
                        <button onClick={() => deleteTeflLead(lead.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🗑 Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DUKE LEADS TAB */}
        {activeTab === 'duke' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>🇹🇭 Duke Language Leads</h2>
              <span style={{ background: '#0f3460', color: 'white', borderRadius: '20px', padding: '4px 14px', fontSize: '13px', fontWeight: 'bold' }}>{dukeLeads.length} total</span>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Everyone who registered interest via the Duke Language School landing page.</p>
            {dukeLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#888' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🇹🇭</div><p>No Duke leads yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dukeLeads.map((lead: any) => (
                  <div key={lead.id} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e', marginBottom: '8px' }}>{lead.name}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
                          <div style={{ color: '#555', fontSize: '13px' }}>📧 <a href={`mailto:${lead.email}`} style={{ color: '#2D6BE4', textDecoration: 'none', fontWeight: 'bold' }}>{lead.email}</a></div>
                          {lead.phone && <div style={{ color: '#555', fontSize: '13px' }}>📞 {lead.phone}</div>}
                        </div>
                        <div style={{ color: '#aaa', fontSize: '12px' }}>{new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                        <a href={`mailto:${lead.email}`} style={{ display: 'block', background: '#e8f0fe', color: '#2D6BE4', padding: '9px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>📧 Email</a>
                        <button onClick={() => deleteDukeLead(lead.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🗑 Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PREMIUM PASSWORDS TAB */}
        {activeTab === 'premium' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px' }}>🎮 Premium Games Passwords</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Generate unique passwords for premium game buyers.</p>
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a2e' }}>Generate New Password</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <input value={newBuyerName} onChange={e => setNewBuyerName(e.target.value)} placeholder="Buyer name *"
                  style={{ flex: 1, minWidth: '160px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                <input value={newBuyerEmail} onChange={e => setNewBuyerEmail(e.target.value)} placeholder="Buyer email (optional)"
                  style={{ flex: 1, minWidth: '160px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                <button disabled={generatingPassword || !newBuyerName.trim()} onClick={generatePassword}
                  style={{ background: generatingPassword || !newBuyerName.trim() ? '#ccc' : '#1a1a2e', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: generatingPassword || !newBuyerName.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                  {generatingPassword ? 'Generating...' : '🎲 Generate Password'}
                </button>
              </div>
            </div>
            {premiumPasswords.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div><p>No passwords generated yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {premiumPasswords.map((p: any) => (
                  <div key={p.id} style={{ background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e' }}>{p.buyer_name}</span>
                        <span style={{ background: p.active ? '#e8f5e9' : '#ffeaea', color: p.active ? '#2e7d32' : '#c62828', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>{p.active ? '✓ Active' : '✗ Revoked'}</span>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '15px', color: '#E85D26', fontWeight: 'bold', marginBottom: '2px' }}>{p.password}</div>
                      <div style={{ color: '#888', fontSize: '12px' }}>{p.buyer_email && `${p.buyer_email} • `}Created: {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => navigator.clipboard.writeText(p.password).then(() => alert(`Copied!\n\n${p.password}`))}
                        style={{ background: '#f0f4ff', color: '#2D6BE4', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>📋 Copy</button>
                      <button onClick={async () => { if (!confirm(p.active ? 'Revoke this password?' : 'Re-activate?')) return; await adminSupabase.from('pro_game_passwords').update({ active: !p.active, session_token: null }).eq('id', p.id); loadPremiumPasswords() }}
                        style={{ background: p.active ? '#ffeaea' : '#e8f5e9', color: p.active ? '#c62828' : '#2e7d32', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                        {p.active ? '⛔ Revoke' : '✅ Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PARTNERS TAB */}
        {activeTab === 'partners' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px' }}>🤝 Assign Jobs to Partners & Logos</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Assign jobs to partners and mark logos.</p>
            {allJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#888' }}>No jobs found</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allJobs.map((job: any) => (
                  <div key={job.id} style={{ background: 'white', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: jobLogoMap[job.id] ? '1px solid #e8f5e9' : '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {jobLogoMap[job.id] && <img src={jobLogoMap[job.id]!} alt="logo" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee', flexShrink: 0 }} />}
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e', marginBottom: '2px' }}>{job.title}</div>
                          <div style={{ color: '#888', fontSize: '13px' }}>{job.company} • {job.location} • {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {[{ label: '🏷️ Mine', logo: JIT_LOGO }, { label: '🤝 TB', logo: TB_LOGO }, { label: '🇵🇭 Filipino', logo: FILIPINO_LOGO }, { label: '🌏 NNES', logo: NNES_LOGO }].map(item => (
                          <button key={item.label} disabled={savingLogo === job.id} onClick={() => assignLogo(job.id, item.logo)}
                            style={{ background: jobLogoMap[job.id] === item.logo ? '#1a1a2e' : '#f0f0f0', color: jobLogoMap[job.id] === item.logo ? 'white' : '#555', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                            {item.label}
                          </button>
                        ))}
                        {jobLogoMap[job.id] && <button disabled={savingLogo === job.id} onClick={() => assignLogo(job.id, null)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>✕</button>}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select value={jobPartnerMap[job.id] || ''} onChange={e => setJobPartnerMap(prev => ({ ...prev, [job.id]: e.target.value }))}
                          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', background: 'white' }}>
                          <option value=''>— No partner —</option>
                          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <button disabled={assigningJob === job.id} onClick={async () => { setAssigningJob(job.id); await adminSupabase.from('jobs').update({ partner_id: jobPartnerMap[job.id] || null }).eq('id', job.id); setAssigningJob(null) }}
                          style={{ background: assigningJob === job.id ? '#ccc' : '#1a1a2e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: assigningJob === job.id ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                          {assigningJob === job.id ? '...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RECRUITER REQUESTS TAB */}
        {activeTab === 'recruiter' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px' }}>🏫 Recruiter Access Requests</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Schools and recruiters requesting access to the Teacher Directory.</p>
            {recruiterRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#888' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>🏫</div><p>No recruiter requests yet</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recruiterRequests.map((req: any) => (
                  <div key={req.id} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: req.status === 'pending' ? '2px solid #E85D26' : '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{req.name}</span>
                          {req.status === 'pending' && <span style={{ background: '#ff9800', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⏳ Pending</span>}
                          {req.status === 'contacted' && <span style={{ background: '#4caf50', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✅ Contacted</span>}
                        </div>
                        {req.school && <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>🏫 {req.school}</div>}
                        <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>📧 {req.email}</div>
                        <div style={{ background: '#fff3ed', color: '#E85D26', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', display: 'inline-block' }}>{req.plan}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                        <a href={`mailto:${req.email}`} style={{ display: 'block', background: '#e8f5e9', color: '#2e7d32', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>📧 Reply</a>
                        <button onClick={async () => {
                          const months = req.plan?.includes('3') ? 3 : 1; const expires = new Date(); expires.setMonth(expires.getMonth() + months)
                          await adminSupabase.from('recruiter_access').upsert([{ email: req.email, plan: req.plan, expires_at: expires.toISOString() }], { onConflict: 'email' })
                          await adminSupabase.from('recruiter_requests').update({ status: 'contacted' }).eq('id', req.id)
                          setRecruiterRequests(prev => prev.map((r: any) => r.id === req.id ? { ...r, status: 'contacted' } : r))
                          alert(`✅ Access activated for ${req.email}`)
                        }} style={{ background: '#E85D26', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>🔓 Activate</button>
                        <button onClick={async () => { if (!confirm('Delete?')) return; await adminSupabase.from('recruiter_requests').delete().eq('id', req.id); setRecruiterRequests(prev => prev.filter((r: any) => r.id !== req.id)) }}
                          style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>🗑 Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'email' && <EmailMembers />}

        {activeTab === 'direct' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #1a1a2e' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>📢 Send to ALL Members</h2>
              <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Sends a dashboard inbox message to every member. ({allMembers.length} members)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input placeholder="Subject" value={directSubject} onChange={e => setDirectSubject(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any }} />
                <textarea placeholder="Type your message..." value={directMessage} onChange={e => setDirectMessage(e.target.value)} rows={5} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' as any, boxSizing: 'border-box' as any }} />
                {directSent && <div style={{ background: '#e8f5e9', borderRadius: '8px', padding: '12px', color: '#2e7d32', fontWeight: 'bold', fontSize: '14px' }}>✅ Message sent to all members!</div>}
                <button disabled={sendingDirect || !directSubject.trim() || !directMessage.trim()}
                  onClick={async () => {
                    if (!directSubject.trim() || !directMessage.trim()) return
                    if (!confirm(`Send to ALL ${allMembers.length} members?`)) return
                    setSendingDirect(true)
                    const rows = allMembers.map((p: any) => ({ user_id: p.id, user_email: p.email, subject: directSubject, message: '📢 Message from Jobs in Thailand', reply: directMessage, replied_at: new Date().toISOString(), read_by_admin: true, read_by_user: false, admin_initiated: true }))
                    const { error } = await adminSupabase.from('member_messages').insert(rows)
                    if (error) { alert('Error: ' + error.message) } else { setDirectSent(true); setDirectSubject(''); setDirectMessage(''); setTimeout(() => setDirectSent(false), 4000) }
                    setSendingDirect(false)
                  }}
                  style={{ background: sendingDirect ? '#ccc' : '#1a1a2e', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: sendingDirect ? 'not-allowed' : 'pointer' }}>
                  {sendingDirect ? 'Sending...' : `📢 Send to All ${allMembers.length} Members`}
                </button>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>📩 Send to One Member</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select value={directEmail} onChange={e => setDirectEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' as any }}>
                  <option value=''>— Select a member —</option>
                  {allMembers.sort((a: any, b: any) => (a.email || '').localeCompare(b.email || '')).map((m: any) => <option key={m.id} value={m.email}>{m.email}</option>)}
                </select>
                <input value={directEmail} onChange={e => setDirectEmail(e.target.value)} placeholder="Or type email directly" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any }} />
                <input value={directSubject} onChange={e => setDirectSubject(e.target.value)} placeholder="Subject" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as any }} />
                <textarea value={directMessage} onChange={e => setDirectMessage(e.target.value)} placeholder="Type your message..." rows={8} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' as any, boxSizing: 'border-box' as any }} />
                {directSent && <div style={{ background: '#e8f5e9', borderRadius: '8px', padding: '14px', color: '#2e7d32', fontWeight: 'bold', fontSize: '14px' }}>✅ Message sent!</div>}
                <button onClick={sendDirectMessage} disabled={sendingDirect || !directEmail.trim() || !directSubject.trim() || !directMessage.trim()}
                  style={{ background: sendingDirect || !directEmail.trim() ? '#ccc' : '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: sendingDirect ? 'not-allowed' : 'pointer' }}>
                  {sendingDirect ? 'Sending...' : '📩 Send to This Member'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BLOG TAB */}
        {activeTab === 'blog' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Blog Posts</h2>
              <button onClick={() => { setEditingPost(null); setBlogForm(emptyBlogForm); setShowBlogForm(true) }} style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ New Article</button>
            </div>
            {showBlogForm && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 'bold' }}>{editingPost ? 'Edit Article' : 'New Article'}</h3>
                <div style={{ display: 'grid', gap: '14px' }}>
                  <input placeholder="Title" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', width: '100%', boxSizing: 'border-box' as any }} />
                  <input placeholder="Slug" value={blogForm.slug} onChange={e => setBlogForm({ ...blogForm, slug: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', width: '100%', boxSizing: 'border-box' as any, color: '#888' }} />
                  <input placeholder="Category" value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', width: '100%', boxSizing: 'border-box' as any }} />
                  <input placeholder="Author name" value={blogForm.author} onChange={e => setBlogForm({ ...blogForm, author: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', width: '100%', boxSizing: 'border-box' as any }} />
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadCoverImage} style={{ display: 'none' }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} style={{ background: uploadingImage ? '#ccc' : '#1a1a2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: uploadingImage ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}>{uploadingImage ? '⏳ Uploading...' : '📷 Upload Cover Image'}</button>
                    {blogForm.cover_image_url && <img src={blogForm.cover_image_url} alt="Cover" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', marginLeft: '12px', verticalAlign: 'middle' }} />}
                  </div>
                  <textarea placeholder="Short excerpt" value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} rows={2} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', width: '100%', boxSizing: 'border-box' as any, resize: 'vertical' as any }} />
                  <textarea placeholder="Full article content" value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} rows={20} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', width: '100%', boxSizing: 'border-box' as any, resize: 'vertical' as any, fontFamily: 'sans-serif', lineHeight: '1.6' }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={blogForm.is_published} onChange={e => setBlogForm({ ...blogForm, is_published: e.target.checked })} />
                    <span style={{ fontSize: '14px' }}>Publish immediately</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={saveBlogPost} style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editingPost ? 'Save Changes' : 'Create Article'}</button>
                  <button onClick={() => { setShowBlogForm(false); setEditingPost(null); setBlogForm(emptyBlogForm) }} style={{ background: '#f3f4f6', color: '#666', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
            {blogPosts.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#888' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>✍️</div><p>No blog posts yet.</p></div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {blogPosts.map((post: any) => (
                  <div key={post.id} style={{ background: 'white', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee', flexShrink: 0 }} />}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>{post.title}</span>
                          <span style={{ background: post.is_published ? '#dcfce7' : '#fef3c7', color: post.is_published ? '#16a34a' : '#d97706', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '20px' }}>{post.is_published ? 'Published' : 'Draft'}</span>
                        </div>
                        <span style={{ color: '#888', fontSize: '12px' }}>{post.category && `${post.category} · `}{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" style={{ background: '#f0f4ff', color: '#2D6BE4', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>View</a>
                      <button onClick={() => { setEditingPost(post); setBlogForm({ title: post.title, slug: post.slug, excerpt: post.excerpt || '', content: post.content || '', author: post.author || '', category: post.category || '', cover_image_url: post.cover_image_url || '', is_published: post.is_published }); setShowBlogForm(true) }} style={{ background: '#f3f4f6', color: '#333', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Edit</button>
                      <button onClick={() => deleteBlogPost(post.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ESL ORDERS TAB */}
        {activeTab === 'esl' && (
          eslOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div><p>No ESL orders yet</p></div>
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
                      <div style={{ color: '#7C3AED', fontSize: '13px', fontWeight: 'bold' }}>📖 {order.lesson_plans?.title}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                      {order.slip_url && <a href={order.slip_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#f0f4ff', color: '#2D6BE4', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}>🧾 View Slip</a>}
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => approveEslOrder(order)} disabled={approvingOrder === order.id} style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>{approvingOrder === order.id ? 'Approving...' : '✅ Approve & Send Link'}</button>
                          <button onClick={() => rejectEslOrder(order.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>❌ Reject</button>
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
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div><p>No teacher applications yet</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {teachers.map(teacher => (
                <div key={teacher.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: teacher.status === 'pending' ? '2px solid #E85D26' : '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {teacher.photo_url ? <img src={teacher.photo_url} alt={teacher.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }} /> : <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>👤</div>}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a1a2e' }}>{teacher.name}</span>
                          {teacher.status === 'pending' ? <span style={{ background: '#ff9800', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⏳ Pending</span> : <span style={{ background: '#4caf50', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Live</span>}
                        </div>
                        <div style={{ color: '#666', fontSize: '13px' }}>{teacher.nationality && `🌍 ${teacher.nationality} · `}📍 {teacher.location}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                      {teacher.status === 'pending' ? (
                        <>
                          <button onClick={() => approveTeacher(teacher.id)} style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✅ Approve & Go Live</button>
                          <button onClick={() => rejectTeacher(teacher.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>❌ Reject & Delete</button>
                        </>
                      ) : (
                        <>
                          <a href={`/teachers/${teacher.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#e8f0fe', color: '#2D6BE4', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', textAlign: 'center' }}>👁 View Live Page</a>
                          <button onClick={() => deactivateTeacher(teacher.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>⛔ Deactivate</button>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>🎨 Template:</span>
                    {['modern', 'bold', 'professional', 'friendly'].map(t => (
                      <button key={t} type="button" onClick={() => setTeacherTemplate(prev => ({ ...prev, [teacher.id]: t }))}
                        style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid', borderColor: teacherTemplate[teacher.id] === t ? '#E85D26' : '#ddd', background: teacherTemplate[teacher.id] === t ? '#fff3ed' : 'white', color: teacherTemplate[teacher.id] === t ? '#E85D26' : '#555', cursor: 'pointer', fontSize: '12px', fontWeight: teacherTemplate[teacher.id] === t ? 'bold' : 'normal' }}>{t}</button>
                    ))}
                  </div>
                  <button onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)} style={{ background: '#f9f9f9', border: '1px solid #eee', color: '#555', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', width: '100%' }}>
                    {expandedTeacher === teacher.id ? '▲ Hide Details' : '▼ View Full Application'}
                  </button>
                  {expandedTeacher === teacher.id && teacher.bio && (
                    <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#555', marginBottom: '4px' }}>About Me</div>
                      <div style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', background: '#f9f9f9', padding: '12px', borderRadius: '8px', whiteSpace: 'pre-line' as any }}>{teacher.bio}</div>
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
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div><p>No rental members yet</p></div>
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
                      {member.phone && <div style={{ color: '#666', fontSize: '13px' }}>📞 {member.phone}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button onClick={() => toggleRentalActivation(member.id, member.active)} style={{ background: member.active ? '#ffeaea' : '#e8f5e9', color: member.active ? '#c62828' : '#2e7d32', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>{member.active ? '⛔ Deactivate' : '✅ Activate'}</button>
                      <button onClick={() => deleteRentalMember(member.id)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>🗑 Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* CONTACT MESSAGES */}
        {activeTab !== 'members' && activeTab !== 'email' && activeTab !== 'rentals' && activeTab !== 'teachers' && activeTab !== 'esl' && activeTab !== 'blog' && activeTab !== 'direct' && activeTab !== 'partners' && activeTab !== 'premium' && activeTab !== 'arcade' && activeTab !== 'recruiter' && activeTab !== 'tefl' && activeTab !== 'duke' && (
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
                    <div style={{ color: '#999', fontSize: '12px' }}>{new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '14px', marginBottom: '16px', color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{msg.message}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!msg.read ? <button onClick={() => markRead(msg.id)} style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>✓ Mark as Read</button> : <button onClick={() => markUnread(msg.id)} style={{ background: '#f0f0f0', color: '#666', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Mark Unread</button>}
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
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div><p>No member messages yet</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={deleteAllMemberMessages} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>🗑 Delete All Messages ({memberMessages.length})</button>
              </div>
              {memberMessages.map(msg => (
                <div key={msg.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: !msg.read_by_admin ? '2px solid #E85D26' : '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' }}>{msg.subject}</span>
                        {!msg.read_by_admin && <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>NEW</span>}
                        {msg.admin_initiated && <span style={{ background: '#2D6BE4', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>📩 Admin Sent</span>}
                      </div>
                      <div style={{ color: '#666', fontSize: '13px' }}>👤 {msg.user_email}</div>
                    </div>
                    <div style={{ color: '#999', fontSize: '12px' }}>{new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '14px', marginBottom: '16px', color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{msg.message}</div>
                  {msg.reply && <div style={{ background: '#fff3ed', borderRadius: '8px', padding: '14px', marginBottom: '16px', border: '1px solid #ffd4b8' }}><div style={{ fontWeight: 'bold', color: '#E85D26', fontSize: '13px', marginBottom: '6px' }}>Your reply:</div><div style={{ color: '#444', fontSize: '14px', lineHeight: '1.6' }}>{msg.reply}</div></div>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea value={replyText[msg.id] || ''} onChange={e => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))} placeholder={msg.reply ? 'Update your reply...' : 'Type your reply here...'} rows={3}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' as any, boxSizing: 'border-box' as any }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => sendReply(msg.id)} disabled={replying === msg.id || !replyText[msg.id]?.trim()} style={{ background: replying === msg.id ? '#ccc' : '#E85D26', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: replying === msg.id ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                        {replying === msg.id ? 'Sending...' : msg.reply ? '📝 Update Reply' : '📨 Send Reply to Member'}
                      </button>
                      {!msg.read_by_admin && <button onClick={() => markMemberRead(msg.id)} style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>✓ Mark Read</button>}
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
