'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [property, setProperty] = useState<any>(null)
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [messageSent, setMessageSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const fetchProperty = async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()
      setProperty(data)

      const { data: imgs } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: true })
      setImages(imgs || [])
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  const handleSendMessage = async () => {
    if (!form.name || !form.email || !form.message) {
      alert('Please fill in all fields')
      return
    }
    setSending(true)
    const { error } = await supabase.from('rental_messages').insert([{
      property_id: id,
      landlord_id: property.user_id,
      sender_name: form.name,
      sender_email: form.email,
      message: form.message,
    }])
    if (error) {
      alert('Error sending message: ' + error.message)
    } else {
      setMessageSent(true)
    }
    setSending(false)
  }

  if (loading) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}><p>Loading...</p></main>
  )

  if (!property) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Property not found</h1>
      <Link href="/rentals" style={{ color: '#E85D26' }}>Back to rentals</Link>
    </main>
  )

  const features = property.features || []

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <Link href="/rentals" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>
          ← Back to Rentals
        </Link>

        {/* TITLE BAR */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{property.title}</h1>
                {property.featured && <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>⭐ Featured</span>}
              </div>
              <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>📍 {property.area ? `${property.area}, ` : ''}{property.location}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '28px' }}>฿{property.price?.toLocaleString()}</div>
              <div style={{ color: '#999', fontSize: '13px' }}>per month</div>
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        {images.length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
            <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', height: '400px' }}>
              <img src={images[activeImage]?.url} alt={property.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, index) => (
                  <div key={img.id} onClick={() => setActiveImage(index)}
                    style={{ width: '80px', height: '60px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', border: activeImage === index ? '2px solid #E85D26' : '2px solid transparent', opacity: activeImage === index ? 1 : 0.7 }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {images.length === 0 && (
          <div style={{ background: '#f0f0f0', borderRadius: '12px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '64px' }}>
            🏠
          </div>
        )}

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* LEFT COLUMN */}
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* KEY DETAILS */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>Property Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Type', value: property.property_type, icon: '🏠' },
                  { label: 'Bedrooms', value: property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`, icon: '🛏' },
                  { label: 'Bathrooms', value: `${property.bathrooms} bath`, icon: '🚿' },
                  { label: 'Size', value: property.size_sqm ? `${property.size_sqm} m²` : 'N/A', icon: '📐' },
                  { label: 'Furnished', value: property.furnished, icon: '🪑' },
                  { label: 'Available', value: property.available_from ? new Date(property.available_from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Now', icon: '📅' },
                ].map(detail => (
                  <div key={detail.label} style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{detail.icon}</div>
                    <div style={{ color: '#999', fontSize: '11px', marginBottom: '2px' }}>{detail.label}</div>
                    <div style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: '14px' }}>{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            {property.description && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Description</h2>
                <p style={{ color: '#444', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{property.description}</p>
              </div>
            )}

            {/* FEATURES */}
            {features.length > 0 && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Features & Amenities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {features.map((feature: string) => (
                    <span key={feature} style={{ background: '#f0f7ff', color: '#2D6BE4', fontSize: '13px', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - CONTACT */}
          <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* CONTACT INFO */}
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Contact Landlord</h2>
              {property.contact_name && (
                <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '10px' }}>👤 {property.contact_name}</div>
              )}
              {property.contact_phone && (
                <a href={`tel:${property.contact_phone}`} style={{ display: 'block', color: '#ccc', fontSize: '14px', marginBottom: '10px', textDecoration: 'none' }}>
                  📞 {property.contact_phone}
                </a>
              )}
              {property.line_id && (
                <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '16px' }}>
                  💬 LINE: {property.line_id}
                </div>
              )}
              {property.contact_email && (
                <a href={`mailto:${property.contact_email}`}
                  style={{ display: 'block', background: '#E85D26', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', marginBottom: '8px' }}>
                  📧 Email Landlord
                </a>
              )}
            </div>

            {/* SEND MESSAGE FORM */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>💬 Send a Message</h2>
              {messageSent ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                  <p style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '15px' }}>Message sent!</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>The landlord will be in touch soon.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Your email"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  <textarea value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="I am interested in this property..."
                    rows={4}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  <button onClick={handleSendMessage} disabled={sending}
                    style={{ background: sending ? '#ccc' : '#E85D26', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: sending ? 'not-allowed' : 'pointer' }}>
                    {sending ? 'Sending...' : 'Send Message →'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}