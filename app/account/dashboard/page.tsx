'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'
import HCaptcha from '@hcaptcha/react-hcaptcha'

const thaiProvinces = [
  'All Thailand',
  'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya / Chonburi', 'Koh Samui / Surat Thani',
  'Hua Hin / Prachuap', 'Krabi', 'Rayong', 'Chiang Rai',
  'Nakhon Ratchasima', 'Khon Kaen', 'Udon Thani', 'Ubon Ratchathani',
  'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Ayutthaya',
  'Nakhon Pathom', 'Kanchanaburi', 'Lopburi', 'Saraburi',
  'Phitsanulok', 'Sukhothai', 'Lampang', 'Lamphun', 'Mae Hong Son',
  'Nan', 'Phayao', 'Phrae', 'Uttaradit', 'Tak',
  'Mukdahan', 'Nakhon Phanom', 'Sakon Nakhon', 'Nong Khai',
  'Loei', 'Chaiyaphum', 'Buriram', 'Surin', 'Si Sa Ket',
  'Yasothon', 'Amnat Charoen', 'Roi Et', 'Maha Sarakham',
  'Kalasin', 'Nong Bua Lamphu', 'Songkhla', 'Trang', 'Phatthalung',
  'Satun', 'Yala', 'Narathiwat', 'Nakhon Si Thammarat', 'Phangnga',
  'Ranong', 'Chumphon', 'Prachuap Khiri Khan', 'Samut Sakhon',
  'Samut Songkhram', 'Ratchaburi', 'Phetchaburi', 'Suphan Buri',
  'Sing Buri', 'Ang Thong', 'Chai Nat', 'Nakhon Nayok',
  'Prachin Buri', 'Sa Kaeo', 'Chanthaburi', 'Trat',
  'Chachoengsao', 'Nakhon Sawan', 'Uthai Thani', 'Kamphaeng Phet',
  'Phichit', 'Phetchabun', 'Remote', 'Other'
]

const jobCategories = [
  'All', 'Teaching / ESL', 'Hospitality', 'Technology',
  'Tourism', 'Finance', 'Marketing', 'Healthcare', 'Creative', 'Other'
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [rentalProfile, setRentalProfile] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [sending, setSending] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)
  const [prefLocation, setPrefLocation] = useState('All Thailand')
  const [prefCategory, setPrefCategory] = useState('All')
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef<HCaptcha>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/account/login'); return }
      setUser(session.user)
      loadMessages(session.user.id)

      const { data: rental } = await supabase
        .from('rental_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setRentalProfile(rental)

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(prof)
      if (prof?.preferred_location) setPrefLocation(prof.preferred_location)
      if (prof?.preferred_category) setPrefCategory(prof.preferred_category)
    }
    init()
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

  const savePreferences = async () => {
    setSavingPrefs(true)
    await supabase.from('profiles').upsert([{
      id: user.id,
      preferred_location: prefLocation,
      preferred_category: prefCategory,
    }])
    setPrefsSaved(true)
    setSavingPrefs(false)
    setTimeout(() => setPrefsSaved(false), 3000)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !newSubject.trim()) return
    if (!captchaToken) { alert('Please complete the CAPTCHA'); return }
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
    setCaptchaToken('')
    captchaRef.current?.resetCaptcha()
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

        {/* RENTAL MEMBER CARD */}
        {rentalProfile && (
          <div style={{ background: rentalProfile.active ? 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)' : '#f9f9f9', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: rentalProfile.active ? '2px solid #E85D26' : '2px solid #ddd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '28px' }}>🏠</span>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: rentalProfile.active ? 'white' : '#1a1a2e' }}>Rental Member</span>
                  {rentalProfile.active ? (
                    <span style={{ background: '#4caf50', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>✓ Active</span>
                  ) : (
                    <span style={{ background: '#ff9800', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>⏳ Pending Activation</span>
                  )}
                </div>
                <p style={{ color: rentalProfile.active ? '#ccc' : '#666', fontSize: '14px', margin: 0 }}>
                  {rentalProfile.active ? 'You can post and manage your rental listings' : 'Your account is awaiting activation — contact us to complete your subscription'}
                </p>
              </div>
              {rentalProfile.active ? (
                <Link href="/account/rental-dashboard"
                  style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
                  🏠 Rental Dashboard →
                </Link>
              ) : (
                <button onClick={() => setShowForm(true)}
                  style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  💬 Contact Us →
                </button>
              )}
            </div>
          </div>
        )}

        {/* JOB ALERT PREFERENCES */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>🔔</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Daily Job Alert Preferences</h2>
              <p style={{ color: '#666', fontSize: '13px', margin: '4px 0 0' }}>We'll email you a daily digest of new jobs matching your preferences</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>📍 Preferred Location</label>
              <select value={prefLocation} onChange={e => setPrefLocation(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
                {thaiProvinces.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>💼 Job Category</label>
              <select value={prefCategory} onChange={e => setPrefCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
                {jobCategories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={savePreferences} disabled={savingPrefs}
              style={{ background: savingPrefs ? '#ccc' : '#E85D26', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: savingPrefs ? 'not-allowed' : 'pointer' }}>
              {savingPrefs ? 'Saving...' : 'Save Preferences →'}
            </button>
            {prefsSaved && (
              <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '14px' }}>✅ Saved!</span>
            )}
          </div>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '12px', marginBottom: 0 }}>
            📧 Daily digest sent every morning with new jobs matching your preferences. Select "All Thailand" and "All" to receive every new job.
          </p>
        </div>

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
                  placeholder="e.g. Job alert question, Rental member activation..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '6px' }}>Message</label>
                <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={5}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              {/* HCAPTCHA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                  onVerify={token => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken('')}
                />
              </div>

              <button onClick={sendMessage} disabled={sending || !newMessage.trim() || !newSubject.trim() || !captchaToken}
                style={{ background: sending || !captchaToken ? '#ccc' : '#E85D26', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: sending || !captchaToken ? 'not-allowed' : 'pointer' }}>
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