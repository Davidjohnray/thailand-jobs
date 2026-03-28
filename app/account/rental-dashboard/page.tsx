'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

const thaiProvinces = [
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

const propertyTypes = ['Condo', 'House', 'Apartment', 'Villa', 'Townhouse', 'Studio', 'Other']
const furnishedOptions = ['Fully Furnished', 'Part Furnished', 'Unfurnished']
const featureOptions = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'CCTV', 'Lift / Elevator',
  'Air Conditioning', 'Balcony', 'Garden', 'Pet Friendly', 'Internet / WiFi',
  'Washing Machine', 'Dishwasher', 'Western Kitchen', 'Rooftop', 'Sea View',
  'Mountain View', 'City View', 'Near BTS / MRT', 'Near Beach', 'Near Schools',
  'Near Hospital', 'Near Shopping Mall'
]

const emptyForm = {
  title: '', description: '', property_type: 'Condo', location: 'Bangkok',
  area: '', price: '', bedrooms: '1', bathrooms: '1', size_sqm: '',
  available_from: '', furnished: 'Fully Furnished', features: [] as string[],
  contact_name: '', contact_email: '', contact_phone: '', line_id: '',
}

export default function RentalDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [rentalProfile, setRentalProfile] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'properties' | 'add' | 'messages'>('properties')
  const [form, setForm] = useState(emptyForm)
  const [uploadedImages, setUploadedImages] = useState<{ url: string, path: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/account/login'); return }
      setUser(session.user)

      const { data: profile } = await supabase
        .from('rental_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setRentalProfile(profile)

      if (profile?.active) {
        const { data: props } = await supabase
          .from('properties')
          .select('*, property_images(url, id)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
        setProperties(props || [])

        const { data: msgs } = await supabase
          .from('rental_messages')
          .select('*')
          .eq('landlord_id', session.user.id)
          .order('created_at', { ascending: false })
        setMessages(msgs || [])
      }
      setLoading(false)
    }
    init()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const toggleFeature = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleImageUpload = async (e: any) => {
    const files = Array.from(e.target.files) as File[]
    if (files.length === 0) return
    setUploading(true)

    const newImages: { url: string, path: string }[] = []

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) {
        alert('Error uploading image: ' + error.message)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)

      newImages.push({ url: publicUrl, path: fileName })
    }

    setUploadedImages(prev => [...prev, ...newImages])
    setUploading(false)
  }

  const removeImage = async (index: number) => {
    const image = uploadedImages[index]
    if (image.path) {
      await supabase.storage.from('property-images').remove([image.path])
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!form.title || !form.location || !form.price) {
      alert('Please fill in title, location and price')
      return
    }
    setSubmitting(true)

    const propertyData = {
      user_id: user.id,
      title: form.title,
      description: form.description,
      property_type: form.property_type,
      location: form.location,
      area: form.area,
      price: parseInt(form.price),
      bedrooms: parseInt(form.bedrooms),
      bathrooms: parseInt(form.bathrooms),
      size_sqm: form.size_sqm ? parseInt(form.size_sqm) : null,
      available_from: form.available_from || null,
      furnished: form.furnished,
      features: form.features,
      contact_name: form.contact_name,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      line_id: form.line_id,
      status: 'active',
    }

    let propertyId = editingId

    if (editingId) {
      await supabase.from('properties').update(propertyData).eq('id', editingId)
      await supabase.from('property_images').delete().eq('property_id', editingId)
    } else {
      const { data } = await supabase.from('properties').insert([propertyData]).select().single()
      propertyId = data?.id
    }

    if (uploadedImages.length > 0 && propertyId) {
      await supabase.from('property_images').insert(
        uploadedImages.map(img => ({ property_id: propertyId, url: img.url }))
      )
    }

    setSuccess(true)
    setSubmitting(false)
    setForm(emptyForm)
    setUploadedImages([])
    setEditingId(null)

    const { data: props } = await supabase
      .from('properties')
      .select('*, property_images(url, id)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setProperties(props || [])

    setTimeout(() => { setSuccess(false); setActiveTab('properties') }, 2000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property?')) return
    await supabase.from('properties').delete().eq('id', id)
    setProperties(prev => prev.filter(p => p.id !== id))
  }

  const handleEdit = (property: any) => {
    setForm({
      title: property.title || '',
      description: property.description || '',
      property_type: property.property_type || 'Condo',
      location: property.location || 'Bangkok',
      area: property.area || '',
      price: property.price?.toString() || '',
      bedrooms: property.bedrooms?.toString() || '1',
      bathrooms: property.bathrooms?.toString() || '1',
      size_sqm: property.size_sqm?.toString() || '',
      available_from: property.available_from || '',
      furnished: property.furnished || 'Fully Furnished',
      features: property.features || [],
      contact_name: property.contact_name || '',
      contact_email: property.contact_email || '',
      contact_phone: property.contact_phone || '',
      line_id: property.line_id || '',
    })
    setUploadedImages(property.property_images?.map((i: any) => ({ url: i.url, path: '' })) || [])
    setEditingId(property.id)
    setActiveTab('add')
  }

  const markMessageRead = async (id: number) => {
    await supabase.from('rental_messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const deleteMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return
    await supabase.from('rental_messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  if (loading) return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}><p>Loading...</p></main>
  )

  if (!rentalProfile || !rentalProfile.active) return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏠</div>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Rental Member Area</h1>
        <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
          To list properties on Jobs in Thailand, you need a Rental Member account. Contact us to get set up — it's a simple monthly subscription!
        </p>
        <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
          {['Unlimited property listings', 'Upload photos directly from your PC', 'Direct messages from renters', 'Manage & edit listings anytime', 'Reach expats & job seekers across Thailand'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: '#444' }}>
              <span style={{ color: '#E85D26', fontWeight: 'bold' }}>✓</span> {item}
            </div>
          ))}
        </div>
        <Link href="/contact" style={{ display: 'block', background: '#E85D26', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>
          Contact Us to Get Started →
        </Link>
        <Link href="/rentals" style={{ display: 'block', color: '#666', fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Rentals
        </Link>
      </div>
    </main>
  )

  const unreadMessages = messages.filter(m => !m.read).length

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <div style={{ background: '#1a1a2e', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>🏠 Rental Dashboard</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: 0 }}>{user?.email}</p>
        </div>
        <Link href="/rentals" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
          View Rentals →
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'properties', label: `🏠 My Properties (${properties.length})` },
            { id: 'add', label: editingId ? '✏️ Edit Property' : '➕ Add Property' },
            { id: 'messages', label: `💬 Messages (${messages.length})${unreadMessages > 0 ? ` 🔴` : ''}` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: activeTab === tab.id ? 'bold' : 'normal', background: activeTab === tab.id ? '#E85D26' : 'white', color: activeTab === tab.id ? 'white' : '#555', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* MY PROPERTIES */}
        {activeTab === 'properties' && (
          properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <p style={{ color: '#666', marginBottom: '16px' }}>No properties listed yet</p>
              <button onClick={() => setActiveTab('add')}
                style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                Add Your First Property →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {properties.map((property: any) => {
                const firstImage = property.property_images?.[0]?.url
                return (
                  <div key={property.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '75px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {firstImage ? <img src={firstImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '32px' }}>🏠</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e', marginBottom: '4px' }}>{property.title}</div>
                      <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>📍 {property.location} • {property.property_type}</div>
                      <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '15px' }}>฿{property.price?.toLocaleString()}/mo</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                      <Link href={`/rentals/${property.id}`} target="_blank"
                        style={{ background: '#f0f0f0', color: '#555', padding: '8px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', textAlign: 'center' }}>
                        👁 View
                      </Link>
                      <button onClick={() => handleEdit(property)}
                        style={{ background: '#fff3ed', color: '#E85D26', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(property.id)}
                        style={{ background: '#ffeaea', color: '#c62828', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* ADD / EDIT PROPERTY */}
        {activeTab === 'add' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '24px' }}>
              {editingId ? '✏️ Edit Property' : '➕ Add New Property'}
            </h2>

            {success && (
              <div style={{ background: '#e8f5e9', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#2e7d32', fontWeight: 'bold', textAlign: 'center' }}>
                ✅ Property {editingId ? 'updated' : 'added'} successfully!
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Property Title *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Modern 2BR Condo near BTS Asok"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Property Type *</label>
                  <select name="property_type" value={form.property_type} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', outline: 'none' }}>
                    {propertyTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Furnished</label>
                  <select name="furnished" value={form.furnished} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', outline: 'none' }}>
                    {furnishedOptions.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Province *</label>
                  <select name="location" value={form.location} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', outline: 'none' }}>
                    {thaiProvinces.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Area / Neighbourhood</label>
                  <input name="area" value={form.area} onChange={handleChange}
                    placeholder="e.g. Sukhumvit, Nimman, Patong"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Monthly Rent (THB) *</label>
                  <input name="price" value={form.price} onChange={handleChange} type="number"
                    placeholder="e.g. 15000"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '100px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Bedrooms</label>
                  <select name="bedrooms" value={form.bedrooms} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', outline: 'none' }}>
                    {['0', '1', '2', '3', '4', '5', '6'].map(n => <option key={n} value={n}>{n === '0' ? 'Studio' : n}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '100px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Bathrooms</label>
                  <select name="bathrooms" value={form.bathrooms} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', background: 'white', outline: 'none' }}>
                    {['1', '2', '3', '4', '5'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '100px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Size (m²)</label>
                  <input name="size_sqm" value={form.size_sqm} onChange={handleChange} type="number"
                    placeholder="e.g. 55"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Available From</label>
                <input name="available_from" value={form.available_from} onChange={handleChange} type="date"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                  placeholder="Describe the property, location, nearby amenities..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              {/* FEATURES */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333', fontSize: '14px' }}>Features & Amenities</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {featureOptions.map(feature => (
                    <button key={feature} type="button" onClick={() => toggleFeature(feature)}
                      style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid', borderColor: form.features.includes(feature) ? '#E85D26' : '#ddd', background: form.features.includes(feature) ? '#fff3ed' : 'white', color: form.features.includes(feature) ? '#E85D26' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: form.features.includes(feature) ? 'bold' : 'normal' }}>
                      {form.features.includes(feature) ? '✓ ' : ''}{feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* PHOTO UPLOAD */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' }}>
                  📸 Property Photos
                </label>
                <p style={{ color: '#999', fontSize: '13px', marginBottom: '12px' }}>
                  Upload photos directly from your PC — JPG, PNG or WEBP, max 5MB each
                </p>

                {/* UPLOAD BUTTON */}
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: uploading ? '#ccc' : '#1a1a2e', color: 'white',
                  padding: '12px 20px', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: 'bold', marginBottom: '16px'
                }}>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload}
                    disabled={uploading} style={{ display: 'none' }} />
                  {uploading ? '⏳ Uploading...' : '📷 Upload Photos'}
                </label>

                {/* IMAGE PREVIEWS */}
                {uploadedImages.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {uploadedImages.map((img, index) => (
                      <div key={index} style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd' }}>
                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={() => removeImage(index)}
                          style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ✕
                        </button>
                        {index === 0 && (
                          <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#E85D26', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CONTACT DETAILS */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '16px', color: '#333', fontSize: '15px' }}>Contact Details</label>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#555', fontSize: '13px' }}>Contact Name</label>
                    <input name="contact_name" value={form.contact_name} onChange={handleChange}
                      placeholder="Your name"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#555', fontSize: '13px' }}>Email</label>
                    <input name="contact_email" value={form.contact_email} onChange={handleChange} type="email"
                      placeholder="your@email.com"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#555', fontSize: '13px' }}>Phone</label>
                    <input name="contact_phone" value={form.contact_phone} onChange={handleChange}
                      placeholder="e.g. 0812345678"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#555', fontSize: '13px' }}>LINE ID</label>
                    <input name="line_id" value={form.line_id} onChange={handleChange}
                      placeholder="your LINE ID"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ flex: 1, background: submitting ? '#ccc' : '#E85D26', color: 'white', padding: '16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Saving...' : editingId ? '✏️ Update Property' : '🏠 Add Property →'}
                </button>
                {editingId && (
                  <button onClick={() => { setEditingId(null); setForm(emptyForm); setUploadedImages([]); setActiveTab('properties') }}
                    style={{ background: '#f0f0f0', color: '#555', padding: '16px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <p style={{ color: '#666' }}>No messages yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg: any) => (
                <div key={msg.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: !msg.read ? '2px solid #E85D26' : '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1a1a2e' }}>{msg.sender_name}</span>
                        {!msg.read && <span style={{ background: '#E85D26', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>NEW</span>}
                      </div>
                      <div style={{ color: '#666', fontSize: '13px' }}>📧 {msg.sender_email}</div>
                    </div>
                    <div style={{ color: '#999', fontSize: '12px' }}>
                      {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '14px', marginBottom: '16px', color: '#444', fontSize: '14px', lineHeight: '1.6' }}>
                    {msg.message}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href={`mailto:${msg.sender_email}`}
                      style={{ background: '#E85D26', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                      Reply via Email →
                    </a>
                    {!msg.read && (
                      <button onClick={() => markMessageRead(msg.id)}
                        style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                        ✓ Mark Read
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

      </div>
    </main>
  )
}