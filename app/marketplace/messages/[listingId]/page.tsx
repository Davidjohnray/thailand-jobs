'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, getCurrentUser, getRoleForListing } from '../../../../lib/marketplace-auth'

type Message = {
  id: string
  sender_role: 'buyer' | 'seller' | 'admin'
  buyer_id: string
  message: string
  image_url: string | null
  created_at: string
}

export default function MessageThreadPage() {
  const params = useParams()
  const listingId = params.listingId as string
  const bottomRef = useRef<HTMLDivElement>(null)

  const [listing, setListing] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [myRole, setMyRole] = useState<'buyer' | 'seller'>('buyer')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [notLoggedIn, setNotLoggedIn] = useState(false)

  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportPhotoUrl, setReportPhotoUrl] = useState('')
  const [reportError, setReportError] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)

  useEffect(() => {
    loadThread()
  }, [listingId])

  const loadThread = async () => {
    setLoading(true)

    const user = await getCurrentUser()
    if (!user) {
      setNotLoggedIn(true)
      setLoading(false)
      return
    }
    setCurrentUserId(user.id)

    const { data: listingData } = await supabase
      .from('marketplace_listings')
      .select('*, marketplace_sellers(display_name, contact_promptpay, contact_line_or_phone)')
      .eq('id', listingId)
      .single()
    setListing(listingData)

    if (listingData) {
      const role = await getRoleForListing(listingData.seller_id)
      setMyRole(role || 'buyer')
    }

    const { data: messagesData } = await supabase
      .from('marketplace_messages')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true })
    setMessages(messagesData || [])

    setLoading(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    setSending(true)

    // NOTE: known limitation — if a listing gets messages from multiple different
    // buyers, this schema currently mixes them into one thread per listing_id rather
    // than one thread per (listing_id, buyer_id) pair. Fine for now with low message
    // volume, but worth revisiting (e.g. a conversation_id grouping both parties)
    // once a popular listing gets messaged by more than one interested buyer.
    const existingBuyerMessage = messages.find((m) => m.sender_role === 'buyer')
    const buyerIdForThread = myRole === 'buyer' ? currentUserId : existingBuyerMessage?.buyer_id

    if (!buyerIdForThread) {
      // Seller trying to reply before any buyer has sent the first message — shouldn't
      // normally happen since sellers only see this page via a message-count link.
      setSending(false)
      return
    }

    await supabase.from('marketplace_messages').insert({
      listing_id: listingId,
      seller_id: listing?.seller_id,
      buyer_id: buyerIdForThread,
      sender_id: currentUserId,
      sender_role: myRole,
      message: newMessage,
    })

    setNewMessage('')
    await loadThread()
    setSending(false)
  }

  const submitReport = async () => {
    setReportError('')
    if (!reportReason.trim()) {
      setReportError('Please describe the problem.')
      return
    }
    if (!reportPhotoUrl.trim()) {
      setReportError('Please upload at least one photo showing the issue before submitting.')
      return
    }

    const existingBuyerMessage = messages.find((m) => m.sender_role === 'buyer')
    const buyerIdForThread = myRole === 'buyer' ? currentUserId : existingBuyerMessage?.buyer_id

    await supabase.from('marketplace_messages').insert({
      listing_id: listingId,
      seller_id: listing?.seller_id,
      buyer_id: buyerIdForThread,
      sender_id: currentUserId,
      sender_role: myRole,
      message: `⚠️ PROBLEM REPORTED: ${reportReason}`,
      image_url: reportPhotoUrl,
    })

    setReportSubmitted(true)
    setShowReportForm(false)
    await loadThread()
  }

  if (loading) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Loading conversation...</main>
  }

  if (notLoggedIn) {
    return (
      <main style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: '#888', marginBottom: '16px' }}>Please log in to view this conversation.</p>
        <Link href="/marketplace/login" style={{ color: '#4F46E5', fontWeight: 'bold', textDecoration: 'none' }}>Log In →</Link>
      </main>
    )
  }

  if (!listing) {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Listing not found.</main>
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fc', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #312e81 0%, #4F46E5 55%, #10b981 100%)', padding: '24px', color: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link href={myRole === 'seller' ? '/marketplace/dashboard' : '/marketplace'} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', textDecoration: 'none' }}>← Back</Link>
          <h1 style={{ fontSize: '19px', fontWeight: 'bold', margin: '8px 0 4px' }}>{listing.title}</h1>
          <p style={{ fontSize: '13px', opacity: 0.85, margin: 0 }}>
            ฿{listing.price} · Conversation with {myRole === 'seller' ? 'buyer' : listing.marketplace_sellers?.display_name}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px' }}>

        {/* PAYMENT INFO REMINDER */}
        <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '14px 18px', fontSize: '13px', color: '#3730a3', marginBottom: '20px' }}>
          ℹ️ Arrange payment and delivery directly in this chat. Seller's PromptPay: <strong>{listing.marketplace_sellers?.contact_promptpay}</strong> · Contact: <strong>{listing.marketplace_sellers?.contact_line_or_phone}</strong>
        </div>

        {/* MESSAGE THREAD */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eeeef8', padding: '20px', marginBottom: '16px', minHeight: '300px' }}>
          {messages.length === 0 && <p style={{ color: '#999', fontSize: '13px', textAlign: 'center' }}>No messages yet — say hello!</p>}

          {messages.map((m) => {
            const isMe = m.sender_role === myRole
            const isAdmin = m.sender_role === 'admin'
            const isProblem = m.message.startsWith('⚠️ PROBLEM REPORTED')
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  maxWidth: '75%',
                  background: isProblem ? '#fef2f2' : isAdmin ? '#fffbeb' : isMe ? '#4F46E5' : '#f1f1f8',
                  color: isProblem ? '#991b1b' : isAdmin ? '#92400e' : isMe ? 'white' : '#1e1b4b',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  border: isProblem ? '1px solid #fecaca' : 'none',
                }}>
                  {!isMe && <p style={{ fontSize: '10px', fontWeight: 'bold', opacity: 0.7, margin: '0 0 4px', textTransform: 'capitalize' }}>{m.sender_role}</p>}
                  <p style={{ margin: 0, lineHeight: '1.5' }}>{m.message}</p>
                  {m.image_url && (
                    <img src={m.image_url} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }} />
                  )}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* SEND MESSAGE */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, border: '1px solid #ddd', borderRadius: '12px', padding: '12px 16px', fontSize: '14px' }}
          />
          <button onClick={sendMessage} disabled={sending}
            style={{ background: '#4F46E5', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 'bold', cursor: 'pointer' }}>
            Send
          </button>
        </div>

        {/* DEAL COMPLETE / FEEDBACK — buyer only */}
        {myRole === 'buyer' && !reportSubmitted && !showReportForm && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <Link href={`/marketplace/feedback/${listingId}`} style={{ flex: 1, textDecoration: 'none' }}>
              <span style={{ display: 'block', background: 'linear-gradient(135deg, #4F46E5, #10b981)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                ✅ Got It — Leave Feedback
              </span>
            </Link>
          </div>
        )}

        {/* REPORT A PROBLEM */}
        {!reportSubmitted && !showReportForm && (
          <button
            onClick={() => setShowReportForm(true)}
            style={{ background: 'white', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
          >
            ⚠️ Report a Problem with This Order
          </button>
        )}

        {showReportForm && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '18px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#991b1b', marginBottom: '10px' }}>Report a Problem</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe what went wrong (e.g. item arrived broken, never received, not as described)..."
              style={{ width: '100%', minHeight: '70px', border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '10px', fontFamily: 'inherit' }}
            />
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b', display: 'block', marginBottom: '6px' }}>
              Photo Evidence (required)
            </label>
            <input
              value={reportPhotoUrl}
              onChange={(e) => setReportPhotoUrl(e.target.value)}
              placeholder="Paste uploaded photo URL showing the issue"
              style={{ width: '100%', border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '6px' }}
            />
            <p style={{ fontSize: '11px', color: '#b91c1c', marginBottom: '12px' }}>
              (Replace with an actual file upload component connected to Supabase Storage)
            </p>

            {reportError && <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '10px' }}>{reportError}</p>}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={submitReport} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                Submit Report
              </button>
              <button onClick={() => setShowReportForm(false)} style={{ background: 'white', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {reportSubmitted && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '16px', color: '#065f46', fontSize: '13px', textAlign: 'center' }}>
            ✅ Your report has been added to this conversation. We'll review it and help resolve the issue.
          </div>
        )}
      </div>
    </main>
  )
}
